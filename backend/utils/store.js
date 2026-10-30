import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'db_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data - No hardcoded users
const initialUsers = [];

const initialComplaints = [
  {
    id: 'COM-2024-001',
    user: 'Rahul',
    userEmail: 'rahul@example.com',
    title: 'Phishing Website',
    category: 'Phishing',
    priority: 'High',
    status: 'Under Review',
    date: '20 May 2024',
    createdAt: '2024-05-20T10:00:00.000Z',
    description: 'Received a suspicious banking login email with a spoofed URL attempting to harvest netbanking passwords.',
    evidenceCount: 2,
    evidenceFiles: [],
    assignedOfficer: 'Cyber Defense Triage Team',
    confidenceCategory: 92,
    confidencePriority: 88,
    timeline: [
      { status: 'Submitted', date: '20 May 2024, 09:30 AM', note: 'Complaint submitted by citizen.' },
      { status: 'Under Review', date: '20 May 2024, 11:15 AM', note: 'Assigned to Cyber Defense Triage Team.' },
    ],
  },
  {
    id: 'COM-2024-002',
    user: 'Priya',
    userEmail: 'priya@example.com',
    title: 'Online Fraud - UPI Scam',
    category: 'Online Fraud',
    priority: 'High',
    status: 'Investigating',
    date: '20 May 2024',
    createdAt: '2024-05-20T10:30:00.000Z',
    description: 'Fraudulent QR code sent on WhatsApp demanding payment verification. Amount deducted without authorization.',
    evidenceCount: 3,
    evidenceFiles: [],
    assignedOfficer: 'Inspector K. Rao',
    confidenceCategory: 95,
    confidencePriority: 91,
    timeline: [
      { status: 'Submitted', date: '20 May 2024, 10:30 AM', note: 'Complaint registered successfully.' },
      { status: 'Under Review', date: '20 May 2024, 11:15 AM', note: 'Evidence verified by Officer K. Rao.' },
      { status: 'Investigating', date: '21 May 2024, 09:45 AM', note: 'Investigation in progress. Bank nodal officer alerted.' },
    ],
  },
  {
    id: 'COM-2024-003',
    user: 'Amit',
    userEmail: 'amit@example.com',
    title: 'Instagram Impersonation',
    category: 'Social Media Scam',
    priority: 'Medium',
    status: 'Resolved',
    date: '18 May 2024',
    createdAt: '2024-05-18T14:20:00.000Z',
    description: 'Fake Instagram profile created using personal photos requesting money from contacts.',
    evidenceCount: 4,
    evidenceFiles: [],
    assignedOfficer: 'Cyber Cell Special Unit',
    confidenceCategory: 89,
    confidencePriority: 82,
    timeline: [
      { status: 'Submitted', date: '18 May 2024, 02:20 PM', note: 'Incident logged.' },
      { status: 'Under Review', date: '18 May 2024, 03:00 PM', note: 'Profile link verified.' },
      { status: 'Investigating', date: '19 May 2024, 10:00 AM', note: 'Takedown notice sent to Meta Grievance Cell.' },
      { status: 'Resolved', date: '20 May 2024, 04:00 PM', note: 'Impersonation profile successfully deactivated.' },
    ],
  },
  {
    id: 'COM-2024-004',
    user: 'Neha',
    userEmail: 'neha@example.com',
    title: 'Fake Job Offer Scam',
    category: 'Online Fraud',
    priority: 'Medium',
    status: 'Under Review',
    date: '17 May 2024',
    createdAt: '2024-05-17T11:45:00.000Z',
    description: 'Received fake appointment letter from reputed IT firm asking for registration fee deposit.',
    evidenceCount: 1,
    evidenceFiles: [],
    assignedOfficer: 'Officer S. Verma',
    confidenceCategory: 90,
    confidencePriority: 79,
    timeline: [
      { status: 'Submitted', date: '17 May 2024, 11:45 AM', note: 'Case registered.' },
      { status: 'Under Review', date: '17 May 2024, 01:10 PM', note: 'Document authenticity under evaluation.' },
    ],
  },
  {
    id: 'COM-2024-005',
    user: 'Vikram',
    userEmail: 'vikram@example.com',
    title: 'Malicious Software',
    category: 'Malware/Ransomware',
    priority: 'High',
    status: 'Investigating',
    date: '16 May 2024',
    createdAt: '2024-05-16T16:10:00.000Z',
    description: 'Ransomware pop-up encrypted local drive demanding cryptocurrency transaction to restore files.',
    evidenceCount: 2,
    evidenceFiles: [],
    assignedOfficer: 'Malware Forensics Lab',
    confidenceCategory: 97,
    confidencePriority: 94,
    timeline: [
      { status: 'Submitted', date: '16 May 2024, 04:10 PM', note: 'Ransomware incident reported.' },
      { status: 'Under Review', date: '16 May 2024, 05:00 PM', note: 'Malware sample extracted.' },
      { status: 'Investigating', date: '17 May 2024, 09:30 AM', note: 'Decryption keys and C2 IP analysis initiated.' },
    ],
  },
];

const initialNotifications = [
  {
    id: 'notif-1',
    userId: 'priya@example.com',
    userEmail: 'priya@example.com',
    message: 'Your complaint COM-2024-002 status updated to Investigating.',
    date: '20 May 2024, 09:45 AM',
    read: false,
    type: 'status_update',
    complaintId: 'COM-2024-002',
  },
  {
    id: 'notif-2',
    userId: 'rahul@example.com',
    userEmail: 'rahul@example.com',
    message: 'Your complaint COM-2024-001 status updated to Under Review.',
    date: '20 May 2024, 11:15 AM',
    read: false,
    type: 'status_update',
    complaintId: 'COM-2024-001',
  },
  {
    id: 'notif-3',
    userId: 'all',
    userEmail: 'all',
    message: 'New announcement from admin: Cyber Awareness Workshop on Saturday.',
    date: '19 May 2024, 05:30 PM',
    read: true,
    type: 'announcement',
    complaintId: '',
  },
];

class StorageEngine {
  constructor() {
    this.memoryData = this.loadLocalFile();
  }

  isMongoActive() {
    return mongoose.connection.readyState === 1;
  }

  loadLocalFile() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.deletedComplaints) parsed.deletedComplaints = [];
        return parsed;
      }
    } catch (e) {
      console.warn('[Storage] Error reading persistent store, creating initial seed:', e.message);
    }

    const defaultState = {
      users: initialUsers,
      complaints: initialComplaints,
      notifications: initialNotifications,
      deletedComplaints: [],
    };
    this.saveLocalFile(defaultState);
    return defaultState;
  }

  saveLocalFile(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data || this.memoryData, null, 2), 'utf-8');
    } catch (e) {
      console.error('[Storage] Error saving persistent file:', e.message);
    }
  }

  // === USER OPERATIONS ===
  async getUsers() {
    if (this.isMongoActive()) {
      try {
        const users = await User.find().lean();
        return users || [];
      } catch (e) {
        console.warn('[Mongo Error getUsers]:', e.message);
      }
    }
    this.memoryData = this.loadLocalFile();
    return this.memoryData.users || [];
  }

  async findUserByEmail(email) {
    if (!email) return null;
    const lowerEmail = email.toLowerCase().trim();
    if (this.isMongoActive()) {
      try {
        const u = await User.findOne({ email: lowerEmail }).lean();
        return u || null;
      } catch (e) {
        console.warn('[Mongo Error findUserByEmail]:', e.message);
      }
    }
    this.memoryData = this.loadLocalFile();
    return (this.memoryData.users || []).find((u) => u.email && u.email.toLowerCase() === lowerEmail) || null;
  }

  async findUserById(id) {
    if (!id) return null;
    if (this.isMongoActive()) {
      try {
        const u = await User.findOne({ id }).lean();
        return u || null;
      } catch (e) {
        console.warn('[Mongo Error findUserById]:', e.message);
      }
    }
    this.memoryData = this.loadLocalFile();
    return (this.memoryData.users || []).find((u) => u.id === id) || null;
  }

  async createUser(userData) {
    // Hash password if not already hashed
    let hashedPassword = userData.password;
    if (hashedPassword && !hashedPassword.startsWith('$2a$') && !hashedPassword.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(userData.password, salt);
    }

    const newUser = {
      ...userData,
      id: userData.id || `user-${Date.now()}`,
      name: userData.name?.trim() || 'Citizen',
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone ? userData.phone.trim() : '',
      role: userData.role || 'citizen',
      profilePhoto: userData.profilePhoto || '',
      password: hashedPassword,
      settings: userData.settings || {},
      createdAt: userData.createdAt || new Date().toISOString(),
    };

    if (this.isMongoActive()) {
      try {
        const doc = await User.create(newUser);
        const result = doc.toObject ? doc.toObject() : newUser;
        // Keep memory cache in sync
        this.memoryData = this.loadLocalFile();
        if (!this.memoryData.users) this.memoryData.users = [];
        this.memoryData.users.push(result);
        this.saveLocalFile();
        return result;
      } catch (e) {
        console.error('[Mongo Error Creating User]:', e.message);
        throw e;
      }
    }

    this.memoryData = this.loadLocalFile();
    if (!this.memoryData.users) this.memoryData.users = [];
    this.memoryData.users.push(newUser);
    this.saveLocalFile();
    return newUser;
  }

  async updateUser(email, updates) {
    if (!email) return null;
    const lowerEmail = email.toLowerCase().trim();
    let updatedUser = null;

    if (this.isMongoActive()) {
      try {
        updatedUser = await User.findOneAndUpdate(
          { email: lowerEmail },
          { $set: updates },
          { new: true }
        ).lean();
      } catch (e) {
        console.error('[Mongo Error Updating User]:', e.message);
      }
    }

    this.memoryData = this.loadLocalFile();
    if (!this.memoryData.users) this.memoryData.users = [];
    const index = this.memoryData.users.findIndex((u) => u.email && u.email.toLowerCase() === lowerEmail);
    if (index !== -1) {
      this.memoryData.users[index] = { ...this.memoryData.users[index], ...updates };
      if (!updatedUser) updatedUser = this.memoryData.users[index];
      this.saveLocalFile();
    }
    return updatedUser;
  }

  // === COMPLAINT OPERATIONS ===
  async getComplaints(filter = {}) {
    if (this.isMongoActive()) {
      try {
        const query = {};
        if (filter.onlyDeleted) {
          query.isDeleted = true;
        } else if (!filter.includeDeleted) {
          query.isDeleted = { $ne: true };
        }
        if (filter.userEmail) {
          query.userEmail = new RegExp(`^${filter.userEmail.trim()}$`, 'i');
        }
        const mongoList = await Complaint.find(query).sort({ createdAt: -1 }).lean();
        return mongoList || [];
      } catch (e) {
        console.warn('[Mongo Error getComplaints]:', e.message);
      }
    }

    this.memoryData = this.loadLocalFile();
    let list = this.memoryData.complaints || [];

    if (filter.onlyDeleted) {
      return (this.memoryData.deletedComplaints || []).filter(c => {
        if (!filter.userEmail) return true;
        return c.userEmail?.toLowerCase() === filter.userEmail.toLowerCase();
      });
    }

    if (!filter.includeDeleted) {
      list = list.filter(c => !c.isDeleted);
    }
    return list;
  }

  async findComplaintById(id) {
    if (!id) return null;
    if (this.isMongoActive()) {
      try {
        const c = await Complaint.findOne({ id: new RegExp(`^${id}$`, 'i') }).lean();
        if (c) return c;
      } catch (e) {}
    }
    return this.memoryData.complaints.find((c) => c.id.toLowerCase() === id.toLowerCase()) || null;
  }

  async createComplaint(complaintData) {
    if (this.isMongoActive()) {
      try {
        await Complaint.create(complaintData);
      } catch (e) {
        console.warn('[Mongo Error Creating Complaint]:', e.message);
      }
    }

    this.memoryData.complaints.unshift(complaintData);
    this.saveLocalFile();
    return complaintData;
  }

  async updateComplaint(id, updates) {
    let updated = null;
    if (this.isMongoActive()) {
      try {
        updated = await Complaint.findOneAndUpdate({ id: new RegExp(`^${id}$`, 'i') }, updates, { new: true }).lean();
      } catch (e) {}
    }

    const index = this.memoryData.complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      this.memoryData.complaints[index] = { ...this.memoryData.complaints[index], ...updates };
      updated = this.memoryData.complaints[index];
      this.saveLocalFile();
    }
    return updated;
  }

  async deleteComplaint(id) {
    if (!id) return null;
    let deletedItem = null;

    if (this.isMongoActive()) {
      try {
        deletedItem = await Complaint.findOneAndUpdate(
          { id: new RegExp(`^${id}$`, 'i') },
          { $set: { isDeleted: true, deletedAt: new Date() } },
          { new: true }
        ).lean();
      } catch (e) {
        console.warn('[Mongo Error deleteComplaint]:', e.message);
      }
    }

    if (!this.memoryData.deletedComplaints) {
      this.memoryData.deletedComplaints = [];
    }

    const index = this.memoryData.complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      const localDeleted = { ...this.memoryData.complaints[index], isDeleted: true, deletedAt: new Date().toISOString() };
      this.memoryData.complaints.splice(index, 1);
      this.memoryData.deletedComplaints.unshift(localDeleted);
      if (!deletedItem) deletedItem = localDeleted;
      this.saveLocalFile();
    }

    return deletedItem;
  }

  async restoreComplaint(id) {
    if (!id) return null;
    let restoredItem = null;

    if (this.isMongoActive()) {
      try {
        restoredItem = await Complaint.findOneAndUpdate(
          { id: new RegExp(`^${id}$`, 'i'), isDeleted: true },
          { $set: { isDeleted: false, deletedAt: null } },
          { new: true }
        ).lean();
      } catch (e) {
        console.warn('[Mongo Error restoreComplaint]:', e.message);
      }
    }

    if (!this.memoryData.deletedComplaints) {
      this.memoryData.deletedComplaints = [];
    }

    const index = this.memoryData.deletedComplaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      const localRestored = { ...this.memoryData.deletedComplaints[index], isDeleted: false };
      delete localRestored.deletedAt;
      this.memoryData.deletedComplaints.splice(index, 1);
      this.memoryData.complaints.unshift(localRestored);
      if (!restoredItem) restoredItem = localRestored;
      this.saveLocalFile();
    }

    return restoredItem;
  }

  async getDeletedComplaints(userEmail = '') {
    if (this.isMongoActive()) {
      try {
        const query = { isDeleted: true };
        if (userEmail) {
          query.userEmail = new RegExp(`^${userEmail.trim()}$`, 'i');
        }
        const list = await Complaint.find(query).sort({ deletedAt: -1, createdAt: -1 }).lean();
        return list || [];
      } catch (e) {
        console.warn('[Mongo Error getDeletedComplaints]:', e.message);
      }
    }

    const list = this.memoryData.deletedComplaints || [];
    if (!userEmail) return list;
    return list.filter(c => c.userEmail?.toLowerCase() === userEmail.toLowerCase());
  }

  // === NOTIFICATION OPERATIONS ===
  async getNotifications(userEmail = '') {
    if (this.isMongoActive()) {
      try {
        const list = await Notification.find().sort({ createdAt: -1 }).lean();
        if (list.length > 0) {
          if (!userEmail) return list;
          return list.filter(
            (n) => n.userEmail === 'all' || n.userEmail.toLowerCase() === userEmail.toLowerCase()
          );
        }
      } catch (e) {}
    }

    if (!userEmail) return this.memoryData.notifications;
    return this.memoryData.notifications.filter(
      (n) => n.userEmail === 'all' || n.userEmail.toLowerCase() === userEmail.toLowerCase()
    );
  }

  async createNotification(notifData) {
    if (this.isMongoActive()) {
      try {
        await Notification.create(notifData);
      } catch (e) {}
    }

    this.memoryData.notifications.unshift(notifData);
    this.saveLocalFile();
    return notifData;
  }

  async markNotificationRead(id, read = true) {
    if (!id) return null;
    if (this.isMongoActive()) {
      try {
        await Notification.findOneAndUpdate({ id }, { read });
      } catch (e) {}
    }

    const notif = this.memoryData.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = read;
      this.saveLocalFile();
    }
    return notif;
  }

  async deleteNotification(id) {
    if (!id) return false;
    if (this.isMongoActive()) {
      try {
        await Notification.findOneAndDelete({ id });
      } catch (e) {}
    }

    const index = this.memoryData.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.memoryData.notifications.splice(index, 1);
      this.saveLocalFile();
      return true;
    }
    return false;
  }

  async deleteAllNotifications(userEmail = '', role = '') {
    const isGlobalClear = !userEmail || role === 'admin';
    if (this.isMongoActive()) {
      try {
        if (!isGlobalClear) {
          await Notification.deleteMany({
            $or: [{ userEmail: 'all' }, { userEmail: userEmail.toLowerCase() }],
          });
        } else {
          await Notification.deleteMany({});
        }
      } catch (e) {}
    }

    if (!isGlobalClear) {
      this.memoryData.notifications = this.memoryData.notifications.filter(
        (n) => n.userEmail !== 'all' && n.userEmail?.toLowerCase() !== userEmail.toLowerCase()
      );
    } else {
      this.memoryData.notifications = [];
    }
    this.saveLocalFile();
    return true;
  }

  async markAllNotificationsRead(userEmail = '') {
    if (this.isMongoActive()) {
      try {
        if (userEmail) {
          await Notification.updateMany(
            { $or: [{ userEmail: 'all' }, { userEmail: userEmail.toLowerCase() }] },
            { read: true }
          );
        } else {
          await Notification.updateMany({}, { read: true });
        }
      } catch (e) {}
    }

    this.memoryData.notifications = this.memoryData.notifications.map((n) => {
      if (!userEmail || n.userEmail === 'all' || n.userEmail.toLowerCase() === userEmail.toLowerCase()) {
        return { ...n, read: true };
      }
      return n;
    });
    this.saveLocalFile();
    return this.memoryData.notifications;
  }

  async seedMongoIfEmpty() {
    if (!this.isMongoActive()) return;
    try {
      const complaintCount = await Complaint.countDocuments();
      if (complaintCount === 0) {
        await Complaint.insertMany(initialComplaints);
        console.log('[MongoDB Atlas] Initialized complaints');
      }
      const notifCount = await Notification.countDocuments();
      if (notifCount === 0) {
        await Notification.insertMany(initialNotifications);
        console.log('[MongoDB Atlas] Initialized notifications');
      }
    } catch (e) {
      console.warn('[MongoDB Atlas Seeding]:', e.message);
    }
  }
}

export const dbStore = new StorageEngine();

