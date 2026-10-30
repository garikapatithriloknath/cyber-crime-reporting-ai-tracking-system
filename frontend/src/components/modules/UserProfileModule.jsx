import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  ShieldAlert,
  Camera,
  Trash2,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  Award,
  RefreshCw,
  Image as ImageIcon,
  Settings,
  ZoomIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import LiveCameraModal from '../common/LiveCameraModal';
import ImageLightboxModal from '../common/ImageLightboxModal';

const PRESET_AVATARS = [
  {
    id: 'badge-officer',
    name: 'Police Badge',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&auto=format&fit=crop&q=80',
    forAdmin: true
  },
  {
    id: 'cyber-agent',
    name: 'Cyber Special Agent',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    forAdmin: true
  },
  {
    id: 'security-analyst',
    name: 'Forensics Analyst',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    forAdmin: false
  },
  {
    id: 'citizen-avatar',
    name: 'Citizen Avatar',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    forAdmin: false
  },
];

const UserProfileModule = () => {
  const { user, isAdmin, updateUser } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(isAdmin ? 'Cyber Crime Investigation & Forensics Cell' : 'Citizen Grievance & Reporting');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '');

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfilePhoto(user.profilePhoto || '');
      setPhotoPreview(user.profilePhoto || '');
    }
  }, [user, isAdmin]);

  // Handle local file selection and photo upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size should be less than 5MB.');
      return;
    }

    setError('');
    setMessage('');
    setUploadingPhoto(true);

    // Create immediate local preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result;
      setPhotoPreview(base64Data);

      try {
        // Try uploading multipart to backend API
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('email', email);

        const res = await api.post('/auth/profile/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data?.success) {
          const finalUrl = res.data.profilePhoto || base64Data;
          setProfilePhoto(finalUrl);
          setPhotoPreview(finalUrl);
          updateUser({ profilePhoto: finalUrl });
          setMessage('Profile photo updated successfully!');
        } else {
          // Fallback to updating profile with base64 data
          await savePhotoDirect(base64Data);
        }
      } catch (err) {
        console.warn('Multipart upload failed, saving photo preview locally:', err.message);
        await savePhotoDirect(base64Data);
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const savePhotoDirect = async (photoDataUrl) => {
    try {
      const res = await api.put('/auth/profile', {
        email,
        name: fullName,
        phone,
        profilePhoto: photoDataUrl,
      });
      if (res.data?.success) {
        setProfilePhoto(photoDataUrl);
        setPhotoPreview(photoDataUrl);
        updateUser({ profilePhoto: photoDataUrl });
        setMessage('Profile photo updated successfully!');
      } else {
        setProfilePhoto(photoDataUrl);
        setPhotoPreview(photoDataUrl);
        updateUser({ profilePhoto: photoDataUrl });
        setMessage('Profile photo updated!');
      }
    } catch (e) {
      setProfilePhoto(photoDataUrl);
      setPhotoPreview(photoDataUrl);
      updateUser({ profilePhoto: photoDataUrl });
      setMessage('Profile photo updated locally!');
    }
  };

  // Handle preset avatar selection
  const handleSelectPreset = async (presetUrl) => {
    setError('');
    setMessage('');
    setUploadingPhoto(true);
    try {
      await savePhotoDirect(presetUrl);
      setShowPresets(false);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle Delete Profile Photo
  const handleDeletePhoto = async () => {
    setError('');
    setMessage('');
    setUploadingPhoto(true);

    try {
      try {
        await api.delete('/auth/profile/photo', {
          params: { email },
        });
      } catch (err) {
        await api.put('/auth/profile', {
          email,
          profilePhoto: '',
        });
      }

      setProfilePhoto('');
      setPhotoPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      updateUser({ profilePhoto: '' });
      setMessage('Profile photo removed successfully.');
    } catch (err) {
      setProfilePhoto('');
      setPhotoPreview('');
      updateUser({ profilePhoto: '' });
      setMessage('Profile photo removed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle Profile Details Form Submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await api.put('/auth/profile', {
        name: fullName,
        email,
        phone,
        profilePhoto: photoPreview || profilePhoto,
      });

      if (res.data?.success) {
        updateUser(res.data.user || { name: fullName, phone, profilePhoto });
        setMessage('Profile details updated successfully!');
      } else {
        updateUser({ name: fullName, phone });
        setMessage('Profile details updated!');
      }
    } catch (err) {
      updateUser({ name: fullName, phone });
      setMessage('Profile details saved locally.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="module-card p-5 sm:p-6 bg-white dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-6 transition-colors">
        
        {/* Header with Title and Role Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {isAdmin ? (
                <>
                  <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Officer Profile Management
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Citizen Profile Management
                </>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAdmin
                ? 'Manage officer credentials, official profile picture, and contact details.'
                : 'Manage your personal details, profile picture, and contact preferences.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={isAdmin ? '/admin/settings' : '/settings'}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Full Settings</span>
            </Link>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700/60'
                  : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              {isAdmin ? 'Law Enforcement Officer' : 'Verified Citizen'}
            </span>
          </div>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* PROFILE PHOTO EDIT & DELETE SECTION */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            
            {/* Clickable Avatar container with zoom overlay and camera icon */}
            <div className="relative group flex-shrink-0">
              <div
                onClick={() => {
                  if (photoPreview) {
                    setShowLightbox(true);
                  } else {
                    setShowCameraModal(true);
                  }
                }}
                title={photoPreview ? 'Click to view full photo' : 'Click to take live photo'}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center border-4 shadow-md transition-all cursor-pointer relative ${
                  isAdmin
                    ? 'border-purple-500/60 dark:border-purple-500 bg-purple-100 dark:bg-purple-950/60 group-hover:ring-4 group-hover:ring-purple-400/40'
                    : 'border-blue-500/60 dark:border-blue-500 bg-blue-100 dark:bg-blue-950/60 group-hover:ring-4 group-hover:ring-blue-400/40'
                }`}
              >
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <ZoomIn className="w-5 h-5 mb-0.5" />
                      <span>View Full</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
                    {isAdmin ? (
                      <ShieldAlert className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Quick overlay Live Camera button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCameraModal(true);
                }}
                title="Open Live Camera Capture"
                className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full hover:bg-blue-600 dark:hover:bg-purple-600 transition-colors shadow-md border-2 border-white dark:border-slate-900"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Info & Action Buttons beside the logo */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {fullName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  {email}
                </p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                  {department}
                </p>
              </div>

              {/* Photo Action Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                />

                {/* Edit / Upload Photo Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {/* Preset Avatars Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Presets</span>
                </button>

                {/* View Full Image Button */}
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setShowLightbox(true)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-blue-500" />
                    <span>View Full</span>
                  </button>
                )}

                {/* Delete Photo Button */}
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={uploadingPhoto}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preset Avatars Selection Drawer */}
          {showPresets && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  Choose a Predefined Profile Avatar:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPresets(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-purple-500 hover:shadow transition-all text-left"
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Details Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department / Unit
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500"
                placeholder="Designation or Department"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              CyberGuard Profile Security System • Active
            </span>
            <button
              type="submit"
              disabled={saving || uploadingPhoto}
              className={`py-2.5 px-6 font-bold text-xs rounded-xl text-white shadow-md transition-all flex items-center gap-2 ${
                isAdmin
                  ? 'bg-purple-700 hover:bg-purple-800'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Full Size Image Preview Modal */}
      <ImageLightboxModal
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        imageUrl={photoPreview || profilePhoto}
        title={fullName}
        subtitle={department}
      />

      {/* Live Camera Capture Modal */}
      <LiveCameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={async (capturedDataUrl) => {
          await savePhotoDirect(capturedDataUrl);
        }}
      />
    </div>
  );
};

export default UserProfileModule;

