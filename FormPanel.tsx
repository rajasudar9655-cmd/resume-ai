'use client';
import PersonalInfoForm from './resume-builder/components/forms/PersonalInfoForm';
import SummaryForm from './resume-builder/components/forms/SummaryForm';
import ExperienceForm from './resume-builder/components/forms/ExperienceForm';
import EducationForm from './resume-builder/components/forms/EducationForm';
import SkillsForm from './resume-builder/components/forms/SkillsForm';
import ProjectsForm from './resume-builder/components/forms/ProjectsForm';
import CertificationsForm from './resume-builder/components/forms/CertificationsForm';
import LanguagesForm from './resume-builder/components/forms/LanguagesForm';
interface Props {
  resume: ResumeData;
  activeSection: string;
  onUpdate: (updater: (prev: ResumeData) => ResumeData) => void;
}

export default function FormPanel({ resume, activeSection, onUpdate }: Props) {
  const sectionMap: Record<string, React.ReactNode> = {
    personal: <PersonalInfoForm resume={resume} onUpdate={onUpdate} />,
    summary: <SummaryForm resume={resume} onUpdate={onUpdate} />,
    experience: <ExperienceForm resume={resume} onUpdate={onUpdate} />,
    education: <EducationForm resume={resume} onUpdate={onUpdate} />,
    skills: <SkillsForm resume={resume} onUpdate={onUpdate} />,
    projects: <ProjectsForm resume={resume} onUpdate={onUpdate} />,
    certifications: <CertificationsForm resume={resume} onUpdate={onUpdate} />,
    languages: <LanguagesForm resume={resume} onUpdate={onUpdate} />,
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-6 animate-fade-in">
      {sectionMap[activeSection] || null}
    </div>
  );
}