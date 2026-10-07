"use client";

import { useState } from "react";
import { ClassicResumeTemplate } from "./classic-resume";
import type { ExperienceView, ResumeData } from "./resume-document";
import { ModernResumeTemplate } from "./modern-resume";

type TemplateName = "modern" | "classic";

export function TemplatePicker({ data }: { data: ResumeData }) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("modern");
  const [experienceView, setExperienceView] = useState<ExperienceView>("company");
  const ResumeTemplate =
    selectedTemplate === "modern" ? ModernResumeTemplate : ClassicResumeTemplate;

  return (
    <main className="resume-stage min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <div className="template-picker screen-only">
        <div className="picker-control">
          <span className="text-sm font-medium text-[#496168]">Template</span>
          <div className="template-switcher" role="group" aria-label="Resume template">
            <button
              aria-pressed={selectedTemplate === "modern"}
              className="template-choice"
              onClick={() => setSelectedTemplate("modern")}
              type="button"
            >
              Modern
            </button>
            <button
              aria-pressed={selectedTemplate === "classic"}
              className="template-choice"
              onClick={() => setSelectedTemplate("classic")}
              type="button"
            >
              Classic
            </button>
          </div>
        </div>
        <div className="picker-control">
          <span className="text-sm font-medium text-[#496168]">Experience</span>
          <div className="experience-view-toggle" role="group" aria-label="Experience view">
            <button
              aria-pressed={experienceView === "company"}
              onClick={() => setExperienceView("company")}
              type="button"
            >
              By company
            </button>
            <button
              aria-pressed={experienceView === "role"}
              onClick={() => setExperienceView("role")}
              type="button"
            >
              By role
            </button>
          </div>
        </div>
      </div>
      <ResumeTemplate
        data={data}
        experienceView={experienceView}
      />
    </main>
  );
}