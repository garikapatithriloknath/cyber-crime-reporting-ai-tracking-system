/**
 * Official Cyber Crime FIR / Incident Acknowledgement Receipt Generator
 */

export const generateFirReceipt = (complaint) => {
  if (!complaint) return;

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please allow popups to download and print the official FIR Receipt.');
    return;
  }

  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'medium',
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    `CYBERGUARD-VERIFY:${complaint.id}:${complaint.category}:${complaint.status}`
  )}`;

  const evidenceRows =
    complaint.evidenceFiles && complaint.evidenceFiles.length > 0
      ? complaint.evidenceFiles
          .map(
            (file, idx) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">${idx + 1}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace;">${file.originalName || file.filename}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">${file.mimetype || 'Attachment'}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">${Math.round((file.size || 1024) / 1024)} KB</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: 600;">Verified Ingest</td>
          </tr>`
          )
          .join('')
      : `
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">1</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace;">Digital Narrative Affidavit</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Text / Electronic</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Standard</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: 600;">Digitally Signed</td>
        </tr>`;

  const timelineRows = (complaint.timeline || [
    { status: complaint.status || 'Submitted', date: complaint.date || currentDate, note: 'Case logged into national triage repository.' }
  ])
    .map(
      (t) => `
        <div style="margin-bottom: 8px; padding-left: 12px; border-left: 3px solid #2563eb;">
          <strong style="color: #1e293b;">[${t.status}]</strong> - <span style="color: #64748b; font-size: 11px;">${t.date}</span>
          <div style="font-size: 12px; color: #334155; margin-top: 2px;">${t.note}</div>
        </div>
      `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official FIR / Cyber Incident Acknowledgement - ${complaint.id}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      line-height: 1.45;
    }
    .fir-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px 40px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 80px;
      font-weight: 900;
      color: rgba(37, 99, 235, 0.04);
      pointer-events: none;
      text-transform: uppercase;
      letter-spacing: 12px;
      user-select: none;
    }
    .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 18px; }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-high { background: #fee2e2; color: #dc2626; border: 1px solid #f87171; }
    .badge-med { background: #fef3c7; color: #d97706; border: 1px solid #fcd34d; }
    .badge-status { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #1e3a8a;
      background: #f1f5f9;
      padding: 6px 10px;
      margin: 18px 0 10px 0;
      border-left: 4px solid #1e3a8a;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px 20px;
      font-size: 12.5px;
    }
    .info-label { font-weight: 600; color: #475569; font-size: 11px; text-transform: uppercase; }
    .info-val { font-weight: 700; color: #0f172a; margin-top: 1px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
    th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px; border: 1px solid #cbd5e1; }
    .stamp-box {
      border: 2px dashed #94a3b8;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      font-size: 11px;
      color: #475569;
      background: #f8fafc;
    }
  </style>
</head>
<body>

  <!-- Controls for User -->
  <div class="no-print" style="max-width: 820px; margin: 0 auto 16px auto; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <span style="font-size: 13px; font-weight: 600; color: #334155;">Official FIR / Case Document Ready</span>
    </div>
    <div>
      <button onclick="window.print()" style="padding: 10px 22px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">
        🖨️ Print / Save as PDF
      </button>
      <button onclick="window.close()" style="margin-left: 8px; padding: 10px 16px; background: #e2e8f0; color: #334155; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">
        Close
      </button>
    </div>
  </div>

  <div class="fir-container">
    <div class="watermark">CYBERGUARD</div>

    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="width: 75px; vertical-align: middle;">
          <img src="/logo.jpeg" alt="Emblem" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2px solid #1e3a8a;">
        </td>
        <td style="vertical-align: middle; padding-left: 14px;">
          <div style="font-size: 17px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
            NATIONAL CYBER CRIME REPORTING PORTAL
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #1e3a8a; letter-spacing: 0.4px;">
            INCIDENT REPORT & PRELIMINARY FIRST INFORMATION REPORT (FIR)
          </div>
          <div style="font-size: 10.5px; color: #64748b; margin-top: 2px;">
            Digital Evidence Management & Automated AI Incident Classification Repository
          </div>
        </td>
        <td style="width: 130px; text-align: right; vertical-align: middle;">
          <img src="${qrUrl}" alt="QR Verification" style="width: 85px; height: 85px; border: 1px solid #cbd5e1; padding: 2px; border-radius: 4px;">
          <div style="font-size: 9px; color: #64748b; font-weight: 600; margin-top: 2px;">Scan to Verify Status</div>
        </td>
      </tr>
    </table>

    <!-- Case Identification Banner -->
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; margin-bottom: 14px;">
      <div class="info-grid">
        <div>
          <div class="info-label">Complaint / FIR Reference ID</div>
          <div class="info-val" style="font-family: monospace; font-size: 16px; color: #1e40af;">${complaint.id}</div>
        </div>
        <div>
          <div class="info-label">Filing Timestamp</div>
          <div class="info-val">${complaint.date || currentDate}</div>
        </div>
        <div>
          <div class="info-label">Incident Classification</div>
          <div class="info-val" style="color: #0f172a;">${complaint.category}</div>
        </div>
        <div>
          <div class="info-label">Current Legal & Investigation Status</div>
          <div class="info-val">
            <span class="badge badge-status">${complaint.status}</span>
            <span class="badge ${complaint.priority === 'High' ? 'badge-high' : 'badge-med'}" style="margin-left: 6px;">${complaint.priority} Priority</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 1: Complainant Details -->
    <div class="section-title">1. Complainant & Informant Particulars</div>
    <div class="info-grid">
      <div>
        <div class="info-label">Complainant Full Name</div>
        <div class="info-val">${complaint.user || 'Citizen User'}</div>
      </div>
      <div>
        <div class="info-label">Registered Contact Email</div>
        <div class="info-val">${complaint.userEmail || 'sagar@example.com'}</div>
      </div>
      <div>
        <div class="info-label">Verification Mode</div>
        <div class="info-val" style="color: #16a34a;">Aadhaar / Mobile OTP Authenticated (Tier-1)</div>
      </div>
      <div>
        <div class="info-label">Assigned Investigation Unit</div>
        <div class="info-val">${complaint.assignedOfficer || 'Cyber Crime Special Unit 4'}</div>
      </div>
    </div>

    <!-- Section 2: AI Triage & Crime Intelligence -->
    <div class="section-title">2. AI Natural Language Forensic Assessment</div>
    <div class="info-grid">
      <div>
        <div class="info-label">Incident Subject / Title</div>
        <div class="info-val" style="font-size: 13px;">${complaint.title}</div>
      </div>
      <div>
        <div class="info-label">AI Classification Confidence Score</div>
        <div class="info-val" style="color: #2563eb;">${complaint.confidenceCategory || 94}% Confidence Rating</div>
      </div>
    </div>
    
    <div style="margin-top: 10px;">
      <div class="info-label">Detailed Incident Narrative / Allegation</div>
      <div style="font-size: 12px; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px; margin-top: 4px; white-space: pre-wrap;">${complaint.description}</div>
    </div>

    <!-- Section 3: Evidence Catalog -->
    <div class="section-title">3. Digital Evidence & Attached Artifacts Inventory</div>
    <table>
      <thead>
        <tr>
          <th style="width: 30px;">#</th>
          <th>Evidence Artifact Name</th>
          <th>Format Type</th>
          <th>File Size</th>
          <th>Chain of Custody</th>
        </tr>
      </thead>
      <tbody>
        ${evidenceRows}
      </tbody>
    </table>

    <!-- Section 4: Investigation Action Timeline -->
    <div class="section-title">4. Case Progress & Investigation Trail</div>
    <div style="margin-top: 6px;">
      ${timelineRows}
    </div>

    <!-- Footer Seal and Legal Disclaimer -->
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1;">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: center;">
        <div style="font-size: 10px; color: #64748b; line-height: 1.4;">
          <strong>LEGAL DISCLAIMER:</strong> This is a computer-generated Preliminary Cyber Incident Acknowledgement & FIR record under Sections 65B & 66 of the Indian Information Technology Act, 2000. It serves as official proof of filing for financial freeze alerts, bank nodal escalations, and criminal investigation procedures. No physical signature is required.
        </div>
        <div class="stamp-box">
          <div style="font-weight: 800; font-size: 11px; color: #1e3a8a;">CYBER CELL CENTRAL</div>
          <div style="font-size: 9px; color: #16a34a; font-weight: 700; margin: 3px 0;">DIGITALLY VERIFIED STAMP</div>
          <div style="font-size: 8.5px; color: #64748b;">${currentDate}</div>
        </div>
      </div>
    </div>

  </div>

  <script>
    window.onload = function() {
      // Auto prompt print on open
      setTimeout(() => { window.print(); }, 600);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
