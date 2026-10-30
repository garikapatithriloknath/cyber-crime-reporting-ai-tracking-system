/**
 * migrate_to_mongo.js
 * -------------------
 * Safe, idempotent migration script.
 * Reads db_store.json and upserts all records into MongoDB Atlas.
 * Uses { id } as unique key — will NOT duplicate records if run again.
 * Does NOT delete db_store.json.
 *
 * Run: node --input-type=module migrate_to_mongo.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// ─── Models ───────────────────────────────────────────────────────────────────
import User from './models/User.js';
import Complaint from './models/Complaint.js';
import Notification from './models/Notification.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function upsertAll(Model, records, label) {
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const record of records) {
    try {
      const filter = { id: record.id };
      // $setOnInsert: only sets fields when inserting (not when updating)
      // So if the record already exists it is skipped entirely
      const result = await Model.updateOne(
        filter,
        { $setOnInsert: record },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`  ✗ Failed to upsert ${label} id=${record.id}: ${err.message}`);
      failed++;
    }
  }

  console.log(`  ${label}: inserted=${inserted}, already_existed=${skipped}, failed=${failed}`);
  return { inserted, skipped, failed };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Read JSON file
  const jsonPath = path.join(__dirname, 'data', 'db_store.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('ERROR: db_store.json not found at', jsonPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const store = JSON.parse(raw);

  const jsonUsers         = store.users            || [];
  const jsonComplaints    = store.complaints        || [];
  const jsonNotifications = store.notifications     || [];
  const jsonDeleted       = store.deletedComplaints || [];

  // All complaints (active + deleted) go into the same collection
  const allComplaints = [...jsonComplaints, ...jsonDeleted];

  console.log('');
  console.log('=== db_store.json SOURCE COUNTS ===');
  console.log(`  Users              : ${jsonUsers.length}`);
  console.log(`  Complaints (active): ${jsonComplaints.length}`);
  console.log(`  Complaints (deleted): ${jsonDeleted.length}`);
  console.log(`  Notifications      : ${jsonNotifications.length}`);
  console.log(`  Total complaints   : ${allComplaints.length}`);
  console.log('');

  // 2. Connect to MongoDB Atlas
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected successfully.');
  console.log('');

  // 3. Show BEFORE counts
  const beforeUsers  = await User.countDocuments();
  const beforeComp   = await Complaint.countDocuments();
  const beforeNotif  = await Notification.countDocuments();
  console.log('=== MONGODB COUNTS BEFORE MIGRATION ===');
  console.log(`  Users         : ${beforeUsers}`);
  console.log(`  Complaints    : ${beforeComp}`);
  console.log(`  Notifications : ${beforeNotif}`);
  console.log('');

  // 4. Migrate
  console.log('=== MIGRATING ===');
  await upsertAll(User,         jsonUsers,         'Users        ');
  await upsertAll(Complaint,    allComplaints,     'Complaints   ');
  await upsertAll(Notification, jsonNotifications, 'Notifications');
  console.log('');

  // 5. Show AFTER counts
  const afterUsers  = await User.countDocuments();
  const afterComp   = await Complaint.countDocuments();
  const afterNotif  = await Notification.countDocuments();
  console.log('=== MONGODB COUNTS AFTER MIGRATION ===');
  console.log(`  Users         : ${afterUsers}`);
  console.log(`  Complaints    : ${afterComp}`);
  console.log(`  Notifications : ${afterNotif}`);
  console.log('');

  // 6. Verification summary
  console.log('=== VERIFICATION SUMMARY ===');
  const uOk = afterUsers  >= jsonUsers.length;
  const cOk = afterComp   >= allComplaints.length;
  const nOk = afterNotif  >= jsonNotifications.length;
  console.log(`  Users         : JSON=${jsonUsers.length}  MongoDB=${afterUsers}  ${uOk ? '✓ OK' : '✗ MISMATCH'}`);
  console.log(`  Complaints    : JSON=${allComplaints.length}  MongoDB=${afterComp}  ${cOk ? '✓ OK' : '✗ MISMATCH'}`);
  console.log(`  Notifications : JSON=${jsonNotifications.length}  MongoDB=${afterNotif}  ${nOk ? '✓ OK' : '✗ MISMATCH'}`);
  console.log('');

  if (uOk && cOk && nOk) {
    console.log('✅ Migration completed successfully!');
    console.log('   db_store.json is kept intact as backup.');
  } else {
    console.log('⚠️  Some counts do not match. Check error messages above.');
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB Atlas.');
}

main().catch(err => {
  console.error('FATAL ERROR:', err.message);
  process.exit(1);
});

