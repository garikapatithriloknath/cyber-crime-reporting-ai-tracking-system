import express from 'express';
import { dbStore } from '../utils/store.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics calculated from active data
router.get('/stats', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const allComplaints = await dbStore.getComplaints();
    const allUsers = await dbStore.getUsers();

    // 1. Calculate REAL overall Admin stats (No fake offsets!)
    const totalComplaints = allComplaints.length;
    const submitted = allComplaints.filter((c) => c.status === 'Submitted').length;
    const underReview = allComplaints.filter((c) => c.status === 'Under Review').length;
    const investigating = allComplaints.filter((c) => c.status === 'Investigating').length;
    const resolved = allComplaints.filter((c) => c.status === 'Resolved').length;

    const totalSafe = totalComplaints || 1;
    const subPct = Math.round((submitted / totalSafe) * 100);
    const reviewPct = Math.round((underReview / totalSafe) * 100);
    const investPct = Math.round((investigating / totalSafe) * 100);
    const resolvedPct = Math.round((resolved / totalSafe) * 100);

    const adminStats = {
      totalComplaints,
      submitted,
      underReview,
      investigating,
      resolved,
      totalUsers: allUsers.length,
      resolutionRate: totalComplaints > 0 ? Math.round((resolved / totalComplaints) * 100) : 0,
      statusDistribution: [
        { name: 'Submitted', value: subPct, count: submitted, color: '#6366F1' },
        { name: 'Under Review', value: reviewPct, count: underReview, color: '#3B82F6' },
        { name: 'Investigating', value: investPct, count: investigating, color: '#06B6D4' },
        { name: 'Resolved', value: resolvedPct, count: resolved, color: '#10B981' },
      ],
    };

    // 2. Calculate REAL User specific stats
    let userComplaints = allComplaints;
    if (userEmail) {
      userComplaints = allComplaints.filter(
        (c) => c.userEmail && c.userEmail.toLowerCase() === userEmail.toLowerCase()
      );
    }

    const uTotal = userComplaints.length;
    const uSubmitted = userComplaints.filter((c) => c.status === 'Submitted').length;
    const uUnderReview = userComplaints.filter((c) => c.status === 'Under Review').length;
    const uInvestigating = userComplaints.filter((c) => c.status === 'Investigating').length;
    const uResolved = userComplaints.filter((c) => c.status === 'Resolved').length;

    const uTotalSafe = uTotal || 1;
    const uSubPct = Math.round((uSubmitted / uTotalSafe) * 100);
    const uReviewPct = Math.round((uUnderReview / uTotalSafe) * 100);
    const uInvestPct = Math.round((uInvestigating / uTotalSafe) * 100);
    const uResolvedPct = Math.round((uResolved / uTotalSafe) * 100);

    const userStats = {
      totalComplaints: uTotal,
      submitted: uSubmitted,
      underReview: uUnderReview,
      investigating: uInvestigating,
      resolved: uResolved,
      complaints: userComplaints,
      statusDistribution: [
        { name: 'Submitted', value: uSubPct, count: uSubmitted, color: '#6366F1' },
        { name: 'Under Review', value: uReviewPct, count: uUnderReview, color: '#3B82F6' },
        { name: 'Investigating', value: uInvestPct, count: uInvestigating, color: '#06B6D4' },
        { name: 'Resolved', value: uResolvedPct, count: uResolved, color: '#10B981' },
      ],
    };

    res.status(200).json({
      success: true,
      userStats,
      adminStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get chart analytics for trends and distribution from real complaints
router.get('/analytics', async (req, res) => {
  try {
    const complaints = await dbStore.getComplaints();
    const total = complaints.length || 1;

    // Real Category count
    const catMap = {};
    const categoryColors = {
      'Phishing': '#3B82F6',
      'Online Fraud': '#F97316',
      'Identity Theft': '#8B5CF6',
      'Social Media Scam': '#10B981',
      'CyberBullying': '#EC4899',
      'Malware/Ransomware': '#06B6D4',
      'Other': '#64748B',
    };

    complaints.forEach((c) => {
      const cat = c.category || 'Online Fraud';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(catMap).map(([name, count]) => {
      const percentage = Math.round((count / total) * 100);
      return {
        name,
        count,
        percentage,
        color: categoryColors[name] || '#3B82F6',
      };
    });

    // Monthly breakdown from real data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = {};
    monthNames.forEach((m) => {
      monthCounts[m] = 0;
    });

    complaints.forEach((c) => {
      const d = c.createdAt ? new Date(c.createdAt) : new Date();
      const m = monthNames[d.getMonth()];
      if (m) monthCounts[m]++;
    });

    // Provide the last 7 months
    const currentMonthIdx = new Date().getMonth();
    const recentMonths = [];
    for (let i = 6; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      const mName = monthNames[idx];
      recentMonths.push({
        month: mName,
        count: monthCounts[mName] || 0,
      });
    }

    res.status(200).json({
      success: true,
      categoryDistribution,
      monthlyComplaints: recentMonths,
      complaintsOverview: recentMonths,
      totalComplaints: complaints.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/notifications
// @desc    Get notifications for user/admin
router.get('/notifications', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const list = await dbStore.getNotifications(userEmail);
    res.status(200).json({
      success: true,
      notifications: list,
      unreadCount: list.filter((n) => !n.read).length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/notifications/read-all
// @desc    Mark all notifications as read
router.put('/notifications/read-all', async (req, res) => {
  try {
    const { userEmail } = req.body;
    const updated = await dbStore.markAllNotificationsRead(userEmail);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      notifications: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/notifications/:id/read
// @desc    Mark a single notification as read or unread
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const readStatus = read !== undefined ? read : true;

    const notif = await dbStore.markNotificationRead(id, readStatus);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Notification marked as ${readStatus ? 'read' : 'unread'}.`,
      notification: notif,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/notifications/clear-all
// @desc    Delete all notifications for user or admin
router.delete('/notifications/clear-all', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.body?.userEmail || '';
    const role = req.query.role || req.body?.role || '';
    await dbStore.deleteAllNotifications(userEmail, role);
    res.status(200).json({
      success: true,
      message: 'All notifications deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/notifications
// @desc    Delete all notifications alias
router.delete('/notifications', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.body?.userEmail || '';
    const role = req.query.role || req.body?.role || '';
    await dbStore.deleteAllNotifications(userEmail, role);
    res.status(200).json({
      success: true,
      message: 'All notifications deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/notifications/:id
// @desc    Delete a single notification
router.delete('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbStore.deleteNotification(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully.',
      id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

