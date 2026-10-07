"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClassicResumeTemplate } from "./classic-resume";
import type { ExperienceView, ResumeData } from "./resume-document";
import { ModernResumeTemplate } from "./modern-resume";
import { ResumeForm } from "./resume-form";

type TemplateName = "modern" | "classic";

const emptyResume: ResumeData = {
  personal: {
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    avatar: "",
  },
  summary: "",
  experience: [],
  skills: [],
  education: [],
  hobbies: [],
  achievements: [],
  projects: [],
};

export function TemplatePicker() {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("modern");
  const [experienceView, setExperienceView] = useState<ExperienceView>("company");
  const ResumeTemplate =
    selectedTemplate === "modern" ? ModernResumeTemplate : ClassicResumeTemplate;

  return (
    <main className="resume-stage min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <div className="workspace-layout">
        <section className="resume-preview" aria-label="Resume preview">
          <div className="template-picker screen-only flex-wrap">
            <div className="picker-control">
              <span className="picker-label">Template</span>
              <div className="template-switcher" role="group" aria-label="Resume template">
                <Button
                  aria-pressed={selectedTemplate === "modern"}
                  onClick={() => setSelectedTemplate("modern")}
                  size="sm"
                  variant={selectedTemplate === "modern" ? "default" : "ghost"}
                  type="button"
                >
                  Modern
                </Button>
                <Button
                  aria-pressed={selectedTemplate === "classic"}
                  onClick={() => setSelectedTemplate("classic")}
                  size="sm"
                  variant={selectedTemplate === "classic" ? "default" : "ghost"}
                  type="button"
                >
                  Classic
                </Button>
              </div>
            </div>
            <div className="picker-control">
              <span className="picker-label">Experience</span>
              <div className="experience-view-toggle" role="group" aria-label="Experience view">
                <Button
                  aria-pressed={experienceView === "company"}
                  onClick={() => setExperienceView("company")}
                  size="xs"
                  variant={experienceView === "company" ? "secondary" : "ghost"}
                  type="button"
                >
                  By company
                </Button>
                <Button
                  aria-pressed={experienceView === "role"}
                  onClick={() => setExperienceView("role")}
                  size="xs"
                  variant={experienceView === "role" ? "secondary" : "ghost"}
                  type="button"
                >
                  By role
                </Button>
              </div>
            </div>
          </div>
          <ResumeTemplate data={data} experienceView={experienceView} />
        </section>
        <aside className="resume-editor screen-only" aria-label="Resume editor">
          <ResumeForm data={data} onChange={setData} />
        </aside>
      </div>
    </main>
  );
}