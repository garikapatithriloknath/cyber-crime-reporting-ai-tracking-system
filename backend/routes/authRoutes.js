import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { dbStore } from '../utils/store.js';
import { uploadEvidence } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret || 'cyberguard_jwt_super_secret_key_2026_x892',
    { expiresIn: config.jwtExpiresIn || '7d' }
  );
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await dbStore.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Validate password (bcrypt comparison)
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'citizen',
        profilePhoto: user.profilePhoto || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, profilePhoto } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await dbStore.findUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
    }

    const newUser = await dbStore.createUser({
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      role: role === 'admin' ? 'admin' : 'citizen',
      profilePhoto: profilePhoto || '',
      password,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully and stored in MongoDB database.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        profilePhoto: newUser.profilePhoto || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile details
router.put('/profile', async (req, res) => {
  try {
    const { name, email, phone, profilePhoto } = req.body;
    const targetEmail = (email || '').toLowerCase().trim();

    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;

    const updatedUser = await dbStore.updateUser(targetEmail, updates);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/profile/photo
// @desc    Upload profile photo
router.post('/profile/photo', uploadEvidence.single('photo'), async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photoData) {
      photoUrl = req.body.photoData;
    } else {
      return res.status(400).json({ success: false, message: 'No photo file or data provided.' });
    }

    const updatedUser = await dbStore.updateUser(email, { profilePhoto: photoUrl });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully!',
      profilePhoto: photoUrl,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/auth/profile/photo
// @desc    Delete user profile photo
router.delete('/profile/photo', async (req, res) => {
  try {
    const email = (req.query.email || req.body.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    const updatedUser = await dbStore.updateUser(email, { profilePhoto: '' });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo removed successfully.',
      profilePhoto: '',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profilePhoto: '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
router.put('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const targetEmail = (email || '').toLowerCase().trim();

    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const user = await dbStore.findUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Verify current password if provided
    if (currentPassword) {
      let isMatch = false;
      if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
        isMatch = await bcrypt.compare(currentPassword, user.password);
      } else {
        isMatch = user.password === currentPassword;
      }

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await dbStore.updateUser(targetEmail, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully! Please use your new password next time.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/settings
// @desc    Get user/admin saved settings
router.get('/settings', async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase().trim();
    const user = email ? await dbStore.findUserByEmail(email) : null;

    const defaultSettings = {
      notifications: {
        complaintSubmitted: true,
        underReview: true,
        investigating: true,
        resolved: true,
        emailNotifications: true,
        smsNotifications: false,
        soundEnabled: true,
        adminNewComplaint: true,
        adminHighPriority: true,
        adminStatusChange: true,
      },
      preferences: {
        language: 'en',
        theme: 'dark',
      },
      aiSettings: {
        crimeClassification: true,
        priorityPrediction: true,
        confidenceThreshold: 85,
        modelVersion: 'CyberGuard-v2.4-Neural',
        categories: {
          phishing: true,
          onlineFraud: true,
          identityTheft: true,
          socialMediaScam: true,
          cyberbullying: true,
          malwareRansomware: true,
        },
      },
      system: {
        autoAssignOfficer: true,
        maintenanceMode: false,
      },
    };

    const userSettings = user?.settings || defaultSettings;

    res.status(200).json({
      success: true,
      settings: userSettings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/settings
// @desc    Update user/admin settings
router.put('/settings', async (req, res) => {
  try {
    const { email, settings } = req.body;
    const targetEmail = (email || '').toLowerCase().trim();

    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    const updatedUser = await dbStore.updateUser(targetEmail, { settings });

    res.status(200).json({
      success: true,
      message: 'Settings saved successfully.',
      settings: updatedUser?.settings || settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// In-memory stores for OTPs and Captchas
export const otpStore = new Map();
export const captchaStore = new Map();

// Helper: Generate Random Alphanumeric Captcha
export const generateCaptchaCode = (length = 6) => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Helper: Verify Captcha Code
export const verifyCaptcha = (token, enteredCode) => {
  if (!token || !enteredCode) return false;
  const item = captchaStore.get(token);
  if (!item) {
    // If token not found in demo, allow match if entered code is standard length
    return enteredCode.trim().length >= 4;
  }
  if (Date.now() > item.expiresAt) {
    captchaStore.delete(token);
    return false;
  }
  const isMatch = item.code.toLowerCase() === enteredCode.trim().toLowerCase();
  if (isMatch) {
    captchaStore.delete(token); // Single use
  }
  return isMatch;
};

// Helper: Verify OTP Code
export const verifyOtpCode = (identifier, enteredOtp) => {
  if (!identifier || !enteredOtp) return false;
  const cleanId = identifier.trim().toLowerCase();
  const cleanOtp = enteredOtp.trim();

  // Universal Demo OTP override
  if (cleanOtp === '123456' || cleanOtp === '999999') return true;

  const stored = otpStore.get(cleanId);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanId);
    return false;
  }
  const isMatch = stored.otp === cleanOtp;
  if (isMatch) {
    otpStore.delete(cleanId); // Single use
  }
  return isMatch;
};

// @route   GET /api/auth/captcha
// @desc    Generate a new captcha string and security token
router.get('/captcha', (req, res) => {
  try {
    const code = generateCaptchaCode(6);
    const token = `cap_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    captchaStore.set(token, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

    res.status(200).json({
      success: true,
      token,
      captcha: code,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/send-otp
// @desc    Send 6-digit OTP to mobile number or email
router.post('/send-otp', async (req, res) => {
  try {
    const { contact, type = 'mobile' } = req.body;
    if (!contact || !contact.trim()) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid ${type === 'mobile' ? 'mobile number' : 'email address'}.`,
      });
    }

    const cleanContact = contact.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins validity

    otpStore.set(cleanContact, { otp, expiresAt, type });

    console.log(`[CyberGuard OTP] Generated OTP for ${cleanContact}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${type === 'mobile' ? `+91 ${cleanContact}` : cleanContact}.`,
      demoOtp: otp,
      expiresInSeconds: 300,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Citizen OTP + Captcha Login
router.post('/verify-otp', async (req, res) => {
  try {
    const { contact, otp, captcha, captchaToken, type = 'mobile' } = req.body;

    if (!contact || !contact.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number or email.' });
    }
    if (!otp || !otp.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter the 6-digit OTP.' });
    }
    if (!captcha || !captcha.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter the Captcha code.' });
    }

    // 1. Verify Captcha
    const isCaptchaValid = verifyCaptcha(captchaToken, captcha);
    if (!isCaptchaValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired Captcha code. Please refresh and retry.' });
    }

    // 2. Verify OTP
    const isOtpValid = verifyOtpCode(contact, otp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please enter the correct OTP or click Get OTP.' });
    }

    const cleanContact = contact.trim().toLowerCase();

    // 3. Find or auto-provision citizen account
    let user = null;
    const allUsers = await dbStore.getUsers();

    if (type === 'mobile') {
      user = allUsers.find(
        (u) => u.phone && u.phone.replace(/\D/g, '') === cleanContact.replace(/\D/g, '')
      );
    } else {
      user = allUsers.find((u) => u.email && u.email.toLowerCase() === cleanContact);
    }

    if (!user) {
      const generatedEmail = type === 'mobile' ? `citizen_${cleanContact.replace(/\D/g, '')}@cyberguard.citizen.in` : cleanContact;
      const generatedPhone = type === 'mobile' ? cleanContact : '';
      const citizenName = type === 'mobile' ? `Citizen (${cleanContact.slice(-4)})` : cleanContact.split('@')[0];
      user = await dbStore.createUser({
        id: `citizen-${Date.now()}`,
        name: citizenName,
        email: generatedEmail,
        phone: generatedPhone,
        role: 'citizen',
        profilePhoto: '',
        password: `OtpCitizen_${Date.now()}_!`,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Verification successful! Welcome, ${user.name}.`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP to registered email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
    }

    const user = await dbStore.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with this email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

    otpStore.set(cleanEmail, { otp, expiresAt, type: 'reset-password' });

    console.log(`[CyberGuard Auth] Password reset OTP for ${cleanEmail}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `Verification code generated for ${cleanEmail}.`,
      demoOtp: otp,
      expiresInSeconds: 600,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using verified OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanOtp = (otp || '').trim();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!cleanOtp) {
      return res.status(400).json({ success: false, message: '6-digit verification code is required.' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = await dbStore.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const isOtpValid = verifyOtpCode(cleanEmail, cleanOtp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code. Please request a new code.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await dbStore.updateUser(cleanEmail, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;



