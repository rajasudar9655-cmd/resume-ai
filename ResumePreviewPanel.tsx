'use client';
import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Printer } from 'lucide-react';
import type { ResumeData } from '@/lib/resumeData';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ATSTemplate from './templates/ATSTemplate';

interface Props {
  resume: ResumeData;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export default function ResumePreviewPanel({ resume, zoom, onZoomChange }: Props) {
  const handlePrint = () => window.print();

  const templateMap: Record<string, React.ReactNode> = {
    modern: <ModernTemplate resume={resume} />,
    professional: <ProfessionalTemplate resume={resume} />,
    creative: <CreativeTemplate resume={resume} />,
    minimal: <MinimalTemplate resume={resume} />,
    ats: <ATSTemplate resume={resume} />,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card flex-shrink-0">
        <span className="text-xs font-medium text-muted-foreground">Live Preview</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Zoom out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="font-mono-data text-xs text-foreground w-10 text-center">{zoom}%</span>
          <button
            onClick={() => onZoomChange(Math.min(150, zoom + 10))}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Zoom in"
          >
            <ZoomIn size={15} />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={handlePrint} className="btn-ghost p-1.5 rounded-lg" aria-label="Print resume">
            <Printer size={15} />
          </button>
          <button className="btn-ghost p-1.5 rounded-lg" aria-label="Full page preview">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto scrollbar-thin p-6 flex justify-center bg-muted/50">
        <div
          id="resume-preview-root"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', width: '210mm', minHeight: '297mm' }}
          className="resume-paper"
        >
          {templateMap[resume.templateId] || templateMap['modern']}
        </div>
      </div>
    </div>
  );
}