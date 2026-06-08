import { jsPDF } from 'jspdf';

/**
 * Generate a styled A4 landscape achievement certificate as a downloadable PDF.
 */
export function generateCertificate({ childName, achievementName, category, date }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297; // A4 landscape width
  const H = 210; // A4 landscape height

  // Category color mapping
  const categoryColors = {
    literacy: { r: 66, g: 165, b: 245 },   // Blue
    math: { r: 102, g: 187, b: 106 },       // Green
    creative: { r: 255, g: 138, b: 101 },   // Coral
    emotion: { r: 255, g: 107, b: 157 },    // Pink
    brain: { r: 124, g: 77, b: 255 },       // Purple
    science: { r: 46, g: 196, b: 182 },     // Teal
    default: { r: 245, g: 166, b: 35 },     // Orange
  };

  const cc = categoryColors[category] || categoryColors.default;

  // ---- Background gradient ----
  for (let i = 0; i < H; i++) {
    const ratio = i / H;
    const r = Math.round(255 - ratio * (255 - 255));
    const g = Math.round(253 - ratio * (253 - 248));
    const b = Math.round(247 - ratio * (247 - 236));
    doc.setFillColor(r, g, b);
    doc.rect(0, i, W, 1, 'F');
  }

  // ---- Decorative border ----
  doc.setDrawColor(cc.r, cc.g, cc.b);
  doc.setLineWidth(3);
  doc.roundedRect(10, 10, W - 20, H - 20, 8, 8, 'S');
  doc.setLineWidth(1);
  doc.roundedRect(15, 15, W - 30, H - 30, 6, 6, 'S');

  // ---- Corner decorations (stars) ----
  const starPositions = [[24, 24], [W - 24, 24], [24, H - 24], [W - 24, H - 24]];
  doc.setFontSize(16);
  starPositions.forEach(([x, y]) => {
    doc.setTextColor(cc.r, cc.g, cc.b);
    doc.text('★', x, y, { align: 'center' });
  });

  // ---- Header: SpacECE Logo Text ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text('SpacECE India', W / 2, 35, { align: 'center' });

  // ---- Decorative line ----
  doc.setDrawColor(cc.r, cc.g, cc.b);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 50, 40, W / 2 + 50, 40);

  // ---- Title ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(cc.r, cc.g, cc.b);
  doc.text('Certificate of Achievement', W / 2, 58, { align: 'center' });

  // ---- Stars decoration ----
  doc.setFontSize(12);
  doc.setTextColor(245, 166, 35);
  doc.text('⭐  ⭐  ⭐  ⭐  ⭐', W / 2, 68, { align: 'center' });

  // ---- "Awarded to" ----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('This certificate is proudly awarded to', W / 2, 82, { align: 'center' });

  // ---- Child Name ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(45, 45, 45);
  doc.text(childName || 'Explorer', W / 2, 100, { align: 'center' });

  // ---- Decorative underline ----
  const nameWidth = doc.getTextWidth(childName || 'Explorer');
  doc.setDrawColor(cc.r, cc.g, cc.b);
  doc.setLineWidth(1.5);
  doc.line(W / 2 - nameWidth / 2 - 10, 104, W / 2 + nameWidth / 2 + 10, 104);

  // ---- Achievement description ----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('for outstanding achievement in', W / 2, 118, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(cc.r, cc.g, cc.b);
  doc.text(achievementName || 'Learning Excellence', W / 2, 132, { align: 'center' });

  // ---- Date ----
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text(`Date: ${formattedDate}`, W / 2, 150, { align: 'center' });

  // ---- Signature line ----
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 40, 168, W / 2 + 40, 168);
  doc.setFontSize(10);
  doc.setTextColor(140, 140, 140);
  doc.text('SpacECE India Learning Platform', W / 2, 174, { align: 'center' });

  // ---- Footer stars ----
  doc.setFontSize(8);
  doc.setTextColor(cc.r, cc.g, cc.b);
  doc.text('★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★', W / 2, H - 18, { align: 'center' });

  // ---- Save ----
  const safeName = (childName || 'certificate').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`SpacECE_Certificate_${safeName}.pdf`);
}
