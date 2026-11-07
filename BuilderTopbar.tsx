'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, EyeOff, Save, CheckCircle, Loader2, Clock } from 'lucide-react';
import type { ResumeData } from '@/lib/resumeData';
import { TEMPLATES } from '@/lib/resumeData';
import { useToast } from '@/components/ui/ToastProvider';

interface Props {
  resume: ResumeData;
  completion: number;
  atsScore: number;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  previewMode: boolean;
  onPreviewToggle: () => void;
  onResumeChange: (updater: (prev: ResumeData) => ResumeData) => void;
}

function ATSScorePill({ score }: { score: number }) {
  let color = 'text-green-600 bg-green-50 border-green-200';
  if (score < 60) color = 'text-red-600 bg-red-50 border-red-200';
  else if (score < 80) color = 'text-amber-600 bg-amber-50 border-amber-200';
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono-data ${color}`}>
      ATS {score}%
    </div>
  );
}

export default function BuilderTopbar({
  resume, completion, atsScore, saveStatus, previewMode, onPreviewToggle, onResumeChange
}: Props) {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('resume-preview-root');
    if (!element) {
      showToast('Preview not found. Please ensure the resume is visible.', 'error');
      return;
    }

    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // A4 dimensions in mm
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;

      // Temporarily reset transform so we capture at full resolution
      const prevTransform = element.style.transform;
      const prevTransformOrigin = element.style.transformOrigin;
      element.style.transform = 'scale(1)';
      element.style.transformOrigin = 'top left';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Restore transform
      element.style.transform = prevTransform;
      element.style.transformOrigin = prevTransformOrigin;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const canvasWidthPx = canvas.width;
      const canvasHeightPx = canvas.height;

      // Calculate how many pixels correspond to one A4 page height
      const pxPerMm = canvasWidthPx / A4_WIDTH_MM;
      const pageHeightPx = A4_HEIGHT_MM * pxPerMm;
      const totalPages = Math.ceil(canvasHeightPx / pageHeightPx);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidthPx;
        const sliceHeight = Math.min(pageHeightPx, canvasHeightPx - page * pageHeightPx);
        pageCanvas.height = sliceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, page * pageHeightPx,          // source x, y
            canvasWidthPx, sliceHeight,        // source width, height
            0, 0,                              // dest x, y
            canvasWidthPx, sliceHeight         // dest width, height
          );
        }

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        const pageHeightMm = (sliceHeight / pxPerMm);

        pdf.addImage(pageImgData, 'JPEG', 0, 0, A4_WIDTH_MM, pageHeightMm);
      }

      const fileName = (resume.name || 'resume').replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
      pdf.save(`${fileName}.pdf`);
      showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 flex-shrink-0 z-20">
      {/* Back */}
      <Link href="/my-resumes" className="btn-ghost p-2 rounded-lg flex-shrink-0" aria-label="Back to My Resumes">
        <ArrowLeft size={18} />
      </Link>

      <div className="h-5 w-px bg-border" />

      {/* Resume name */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <input
          type="text"
          value={resume.name}
          onChange={(e) => onResumeChange((prev) => ({ ...prev, name: e.target.value }))}
          className="text-sm font-semibold text-foreground bg-transparent border-none outline-none focus:bg-muted px-2 py-1 rounded-lg transition-colors w-full max-w-xs truncate"
        />
      </div>

      {/* Template selector */}
      <select
        value={resume.templateId}
        onChange={(e) => onResumeChange((prev) => ({ ...prev, templateId: e.target.value as ResumeData['templateId'] }))}
        className="form-input text-xs py-1.5 pr-7 w-36 hidden md:block"
      >
        {TEMPLATES.map((t) => (
          <option key={`topbar-tpl-${t.id}`} value={t.id}>{t.name}</option>
        ))}
      </select>

      <div className="h-5 w-px bg-border hidden md:block" />

      {/* Completion bar */}
      <div className="hidden lg:flex items-center gap-2 min-w-[140px]">
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Complete</span>
        <div className="progress-bar flex-1">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
        <span className="text-xs font-bold font-mono-data text-foreground">{completion}%</span>
      </div>

      {/* ATS Score */}
      <ATSScorePill score={atsScore} />

      <div className="h-5 w-px bg-border" />

      {/* Save status */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs">
        {saveStatus === 'saved' && <><CheckCircle size={13} className="text-green-500" /><span className="text-muted-foreground">Saved</span></>}
        {saveStatus === 'saving' && <><Loader2 size={13} className="animate-spin text-primary" /><span className="text-muted-foreground">Saving…</span></>}
        {saveStatus === 'unsaved' && <><Clock size={13} className="text-amber-500" /><span className="text-amber-600">Unsaved</span></>}
      </div>

      {/* Actions */}
      <button
        onClick={onPreviewToggle}
        className={`btn-ghost p-2 rounded-lg ${previewMode ? 'bg-secondary text-primary' : ''}`}
        aria-label="Toggle preview"
        title="Toggle full preview"
      >
        {previewMode ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn-primary py-2 px-3 text-xs gap-1.5 flex-shrink-0"
      >
        {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
        {downloading ? 'Exporting…' : 'Download PDF'}
      </button>
    </div>
  );
}