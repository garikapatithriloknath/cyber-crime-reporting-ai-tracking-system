import express from 'express';
import { dbStore } from '../utils/store.js';
import { uploadEvidence } from '../middlewares/uploadMiddleware.js';
import { verifyCaptcha, verifyOtpCode } from './authRoutes.js';

const router = express.Router();

// Helper: AI Text Classification Algorithm with entity extraction
export const predictCrimeCategoryAndPriority = (title = '', description = '') => {
  const combinedText = `${title} ${description}`.toLowerCase();

  let category = 'Online Fraud';
  let priority = 'Medium';
  let categoryScore = 88;
  let priorityScore = 84;
  let extractedEntities = [];

  // Extract phone numbers
  const phoneMatch = combinedText.match(/(?:\+91[\-\s]?)?[6789]\d{9}/g);
  if (phoneMatch) extractedEntities.push({ type: 'Suspect Phone', value: phoneMatch[0] });

  // Extract UPI / handles
  const upiMatch = combinedText.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g);
  if (upiMatch) extractedEntities.push({ type: 'Suspect UPI ID', value: upiMatch[0] });

  // Extract URLs
  const urlMatch = combinedText.match(/https?:\/\/[^\s]+/g);
  if (urlMatch) extractedEntities.push({ type: 'Suspicious URL', value: urlMatch[0] });

  if (/phish|fake website|bank login|spoof|otp steal|credential|login link|fake email|verify account/i.test(combinedText)) {
    category = 'Phishing';
    categoryScore = 94;
    priority = 'High';
    priorityScore = 89;
  } else if (/ransomware|virus|trojan|encrypt|bitcoin ransom|malware|malicious app|apk hack|keylogger/i.test(combinedText)) {
    category = 'Malware/Ransomware';
    categoryScore = 97;
    priority = 'High';
    priorityScore = 95;
  } else if (/instagram|facebook|fake id|impersonat|whatsapp dp|profile clone|social media|twitter fake/i.test(combinedText)) {
    category = 'Social Media Scam';
    categoryScore = 90;
    priority = 'Medium';
    priorityScore = 84;
  } else if (/identity|aadhar|pan card|stolen identity|credit card clone|passport leak|kyc forge/i.test(combinedText)) {
    category = 'Identity Theft';
    categoryScore = 92;
    priority = 'High';
    priorityScore = 90;
  } else if (/bully|harass|blackmail|threat|stalk|abuse|defamation|leaked photos/i.test(combinedText)) {
    category = 'CyberBullying';
    categoryScore = 91;
    priority = 'High';
    priorityScore = 92;
  } else if (/upi|qr code|paytm|gpay|money deducted|scam|job offer|lottery|crypto scam|investment fraud/i.test(combinedText)) {
    category = 'Online Fraud';
    categoryScore = 93;
    priority = /urgent|lakhs|thousands|lost money|emergency/i.test(combinedText) ? 'High' : 'Medium';
    priorityScore = 88;
  }

  return {
    category,
    confidenceCategory: categoryScore,
    priority,
    confidencePriority: priorityScore,
    extractedEntities,
    message: 'Our AI model has analyzed your complaint.',
    aiNotice: 'AI predictions help authorities prioritize and take faster action.',
  };
};

// @route   POST /api/complaints/predict
// @desc    Live AI prediction for complaint text
router.post('/predict', (req, res) => {
  const { title, description } = req.body;
  const result = predictCrimeCategoryAndPriority(title, description);
  res.status(200).json({ success: true, ...result });
});

// @route   GET /api/complaints
// @desc    Get all complaints with search, category, and status filtering
router.get('/', async (req, res) => {
  try {
    const { search, status, category, priority, userEmail } = req.query;
    let list = await dbStore.getComplaints();

    if (userEmail) {
      list = list.filter(
        (c) => c.userEmail && c.userEmail.toLowerCase() === userEmail.toLowerCase()
      );
    }

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(s) ||
          c.title.toLowerCase().includes(s) ||
          c.user.toLowerCase().includes(s) ||
          c.category.toLowerCase().includes(s)
      );
    }

    if (status && status !== 'All' && status !== 'All Status') {
      list = list.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      list = list.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    if (priority && priority !== 'All') {
      list = list.filter((c) => c.priority.toLowerCase() === priority.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: list.length,
      complaints: list,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint by ID for tracking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await dbStore.findComplaintById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: `Complaint ID ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/complaints
// @desc    Submit a new complaint with optional multipart evidence files
router.post('/', uploadEvidence.array('evidence', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      user: complainantName,
      userEmail: complainantEmail,
      evidenceCount: rawCount,
    } = req.body;

    const user = complainantName || 'Anonymous Citizen';
    const userEmail = complainantEmail || '';

    const trimmedTitle = (title || '').trim();
    const trimmedDesc = (description || '').trim();

    if (!trimmedTitle || !trimmedDesc) {
      return res.status(400).json({ success: false, message: 'Complaint title and description are required.' });
    }

    if (trimmedDesc.length < 20) {
      return res.status(400).json({
        success: false,
        message: `Incident description must be at least 20 characters long (currently ${trimmedDesc.length} characters). Please describe the event chronologically.`,
      });
    }

    const aiResult = predictCrimeCategoryAndPriority(title, description);
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const allComplaints = await dbStore.getComplaints({ includeDeleted: true });
    const allDeleted = await dbStore.getDeletedComplaints();
    const combined = [...allComplaints, ...allDeleted];
    let maxIdNumber = 0;
    combined.forEach((c) => {
      const match = c.id?.match(/COM-\d{4}-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxIdNumber) maxIdNumber = num;
      }
    });
    const nextSeq = Math.max(maxIdNumber + 1, combined.length + 1);
    const newId = `COM-2024-${String(nextSeq).padStart(3, '0')}`;

    // Process uploaded evidence files
    const evidenceFiles = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date().toISOString(),
    }));

    const finalEvidenceCount = evidenceFiles.length > 0 ? evidenceFiles.length : (parseInt(rawCount) || 1);

    const newComplaint = {
      id: newId,
      user,
      userEmail,
      title,
      category: aiResult.category,
      priority: aiResult.priority,
      status: 'Submitted',
      date: dateFormatted,
      createdAt: now.toISOString(),
      description,
      evidenceCount: finalEvidenceCount,
      evidenceFiles,
      assignedOfficer: 'Cyber Defense Triage Team',
      confidenceCategory: aiResult.confidenceCategory,
      confidencePriority: aiResult.confidencePriority,
      timeline: [
        {
          status: 'Submitted',
          date: `${dateFormatted}, ${timeFormatted}`,
          note: 'Complaint submitted by citizen and queued for triage.',
        },
      ],
    };

    const savedComplaint = await dbStore.createComplaint(newComplaint);

    // Create an initial notification for the citizen
    await dbStore.createNotification({
      id: `notif-${Date.now()}`,
      userId: userEmail,
      userEmail,
      message: `Your complaint ${newId} (${aiResult.category}) was received successfully.`,
      date: `${dateFormatted}, ${timeFormatted}`,
      read: false,
      type: 'status_update',
      complaintId: newId,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint: savedComplaint,
      aiAnalysis: aiResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Admin updates complaint status, remarks, officer, and auto-dispatches notification
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, assignedOfficer, priority } = req.body;

    const complaint = await dbStore.findComplaintById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: `Complaint ID ${id} not found.` });
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const updates = {};

    if (status) {
      updates.status = status;
      const updatedTimeline = [...(complaint.timeline || [])];
      updatedTimeline.push({
        status,
        date: `${dateFormatted}, ${timeFormatted}`,
        note: remarks || `Status updated to ${status} by Cyber Crime Officer.`,
      });
      updates.timeline = updatedTimeline;
    }

    if (assignedOfficer) {
      updates.assignedOfficer = assignedOfficer;
    }

    if (priority) {
      updates.priority = priority;
    }

    const updatedComplaint = await dbStore.updateComplaint(id, updates);

    // Auto-dispatch notification to the citizen
    if ((status || remarks) && updatedComplaint.userEmail) {
      await dbStore.createNotification({
        id: `notif-${Date.now()}`,
        userId: updatedComplaint.userEmail,
        userEmail: updatedComplaint.userEmail,
        message: `Status update: Complaint ${id} is now [${updatedComplaint.status}]. ${remarks ? `Note: ${remarks}` : ''}`,
        date: `${dateFormatted}, ${timeFormatted}`,
        read: false,
        type: 'status_update',
        complaintId: id,
      });
    }

    res.status(200).json({
      success: true,
      message: `Complaint ${id} updated successfully.`,
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/complaints/deleted
// @desc    Get recently deleted complaints for undo / recovery
router.get('/deleted/all', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const deletedList = await dbStore.getDeletedComplaints(userEmail);
    res.status(200).json({
      success: true,
      count: deletedList.length,
      deletedComplaints: deletedList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint with support for undo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbStore.deleteComplaint(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: `Complaint ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: `Complaint ${id} deleted successfully.`,
      complaint: deleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/complaints/:id/restore
// @desc    Undo deletion and restore complaint
router.post('/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const restored = await dbStore.restoreComplaint(id);

    if (!restored) {
      return res.status(404).json({ success: false, message: `Complaint ${id} not found in deleted items.` });
    }

    res.status(200).json({
      success: true,
      message: `Complaint ${id} restored successfully!`,
      complaint: restored,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/complaints/track-by-contact
// @desc    Track complaints by Mobile Number or Email with OTP & Captcha verification
router.post('/track-by-contact', async (req, res) => {
  try {
    const { contact, otp, captcha, captchaToken, type = 'mobile' } = req.body;

    if (!contact || !contact.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid mobile number or email address.' });
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
      return res.status(400).json({ success: false, message: 'Invalid or expired Captcha code. Please refresh captcha.' });
    }

    // 2. Verify OTP
    const isOtpValid = verifyOtpCode(contact, otp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please enter the correct OTP.' });
    }

    const cleanContact = contact.trim().toLowerCase();
    const allUsers = await dbStore.getUsers();
    let matchedUser = null;

    if (type === 'mobile') {
      matchedUser = allUsers.find(
        (u) => u.phone && u.phone.replace(/\D/g, '') === cleanContact.replace(/\D/g, '')
      );
    } else {
      matchedUser = allUsers.find((u) => u.email && u.email.toLowerCase() === cleanContact);
    }

    const allComplaints = await dbStore.getComplaints();
    let userComplaints = [];

    if (matchedUser) {
      userComplaints = allComplaints.filter(
        (c) =>
          (c.userEmail && c.userEmail.toLowerCase() === matchedUser.email.toLowerCase()) ||
          (c.user && c.user.toLowerCase() === matchedUser.name.toLowerCase())
      );
    } else if (type === 'email') {
      userComplaints = allComplaints.filter(
        (c) => c.userEmail && c.userEmail.toLowerCase() === cleanContact
      );
    }

    res.status(200).json({
      success: true,
      message: `Verified successfully! Found ${userComplaints.length} complaint(s) for ${type === 'mobile' ? `+91 ${cleanContact}` : cleanContact}.`,
      user: matchedUser ? { name: matchedUser.name, email: matchedUser.email, phone: matchedUser.phone } : null,
      contact: cleanContact,
      count: userComplaints.length,
      complaints: userComplaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;


