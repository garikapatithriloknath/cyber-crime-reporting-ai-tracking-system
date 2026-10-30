import mongoose from 'mongoose';

const evidenceFileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  mimetype: String,
  size: Number,
  url: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const timelineItemSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: '',
  },
});

const complaintSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Phishing',
      'Online Fraud',
      'Identity Theft',
      'Social Media Scam',
      'CyberBullying',
      'Malware/Ransomware',
      'Other',
    ],
    default: 'Online Fraud',
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  status: {
    type: String,
    required: true,
    enum: ['Submitted', 'Under Review', 'Investigating', 'Resolved', 'Rejected'],
    default: 'Submitted',
  },
  date: {
    type: String,
    required: true,
  },
  confidenceCategory: {
    type: Number,
    default: 90,
  },
  confidencePriority: {
    type: Number,
    default: 85,
  },
  evidenceCount: {
    type: Number,
    default: 0,
  },
  evidenceFiles: [evidenceFileSchema],
  assignedOfficer: {
    type: String,
    default: 'Cyber Defense Triage Team',
  },
  timeline: [timelineItemSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
export default Complaint;
