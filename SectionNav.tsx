'use client';
import React from 'react';
import {
  User, FileText, Briefcase, GraduationCap, Code2,
  FolderOpen, Award, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import type { ResumeData } from '@/lib/resumeData';
import Icon from '@/components/ui/AppIcon';



const SECTION_ICONS: Record<string, React.ElementType> = {
  personal: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code2,
  projects: FolderOpen,
  certifications: Award,
  languages: Globe,
};

function sectionFilled(resume: ResumeData, sectionId: string): boolean {
  switch (sectionId) {
    case 'personal': return !!(resume.personalInfo.fullName && resume.personalInfo.email);
    case 'summary': return resume.summary.length > 20;
    case 'experience': return resume.experience.length > 0;
    case 'education': return resume.education.length > 0;
    case 'skills': return resume.technicalSkills.length > 0;
    case 'projects': return resume.projects.length > 0;
    case 'certifications': return resume.certifications.length > 0;
    case 'languages': return resume.languages.length > 0;
    default: return false;
  }
}

interface Props {
  sections: { id: string; label: string }[];
  activeSection: string;
  onSelect: (id: string) => void;
  resume: ResumeData;
  collapsed: boolean;
  onToggle: () => void;
}

export default function SectionNav({ sections, activeSection, onSelect, resume, collapsed, onToggle }: Props) {
  return (
   <div className="space-y-3">
      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-end p-2 mb-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {sections.map((section) => {
        const Icon = SECTION_ICONS[section.id] || FileText;
        const isActive = activeSection === section.id;
        const filled = sectionFilled(resume, section.id);

        return (
          <button
  key={`section-nav-${section.id}`}
  onClick={() => onSelect(section.id)}
  className={`
    w-full flex items-center gap-3
    px-4 py-3 rounded-xl
    text-left
    ${isActive
      ? 'bg-purple-100 text-purple-700'
      : 'hover:bg-gray-100 text-gray-700'
    }
  `}
>
            <div className="relative flex-shrink-0">
              <Icon size={17} />
              {filled && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent border border-card" />
              )}
            </div>
            <span className="text-base font-medium">
  {section.label}
</span>
            {!collapsed && filled && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}