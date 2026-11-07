'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_RESUMES, computeCompletion, computeATS, type ResumeData } from '@/lib/resumeData';
import BuilderTopbar from './BuilderTopbar';
import SectionNav from './SectionNav';
import FormPanel from './FormPanel';
import ResumePreviewPanel from './ResumePreviewPanel';
import AppLogo from '@/components/ui/AppLogo';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Languages' },
];

export default function ResumeBuilderApp() {
  const [resume, setResume] = useState<ResumeData>({
    ...MOCK_RESUMES[0],
    id: 'builder-active',
  });
  const [activeSection, setActiveSection] = useState('personal');
  const sidebarOpen = true;
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [zoom, setZoom] = useState(85);

  const completion = computeCompletion(resume);
  const atsScore = computeATS(resume);

  const updateResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setSaveStatus('unsaved');
    setResume((prev) => updater(prev));
  }, []);

  // Auto-save simulation
  // BACKEND: Replace with actual debounced API call to save resume
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 800);
    }, 1500);
    return () => clearTimeout(timer);
  }, [resume, saveStatus]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <BuilderTopbar
        resume={resume}
        completion={completion}
        atsScore={atsScore}
        saveStatus={saveStatus}
        previewMode={previewMode}
        onPreviewToggle={() => setPreviewMode(!previewMode)}
        onResumeChange={updateResume}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar toggle for mobile */}
        

        {/* Section Navigation Sidebar */}
        <aside
 
  style={{
    width: '280px',
    minWidth: '280px',
    background: 'white',
    borderRight: '1px solid #ddd'
  }}
>
        
          <div className="p-3">
            {/* Logo when sidebar is open */}
            {sidebarOpen && (
              <div className="flex items-center gap-2 px-2 py-2 mb-3">
                <Link href="/" className="flex items-center gap-2">
                  <AppLogo size={28} />
                  <span className="font-bold text-sm text-foreground hidden md:block">ResumeForge</span>
                </Link>
              </div>
            )}

            <SectionNav
  sections={SECTIONS}
  activeSection={activeSection}
  onSelect={setActiveSection}
  resume={resume}
  collapsed={false}
  onToggle={() => {}}
/>
          </div>
        </aside>

        {/* Form Panel */}
        {!previewMode && (
          <div className="flex-1 min-w-0 overflow-y-auto bg-muted/30">
            <FormPanel
              resume={resume}
              activeSection={activeSection}
              onUpdate={updateResume}
            />
          </div>
        )}

        {/* Preview Panel */}
        <div
          className={`
            bg-muted/50 overflow-hidden flex flex-col border-l border-border section-transition
            ${previewMode ? 'flex-1' : 'hidden xl:flex w-[420px]'}
          `}
        >
          <ResumePreviewPanel
            resume={resume}
            zoom={zoom}
            onZoomChange={setZoom}
          />
        </div>
      </div>
    </div>
  );
}