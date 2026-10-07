"use client";

import { useId, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus, Trash2, Upload } from "lucide-react";
import type { ResumeData, ResumePosition } from "./resume-document";

type ResumeFormProps = {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
};

const emptyPosition = (): ResumePosition => ({
  job_title: "",
  start_date: "",
  end_date: "",
  duration: "",
  work_type: "",
  employment_type: "",
  responsibilities: [],
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStringFields(value: unknown, fields: string[]): value is Record<string, string> {
  return isRecord(value) && fields.every((field) => typeof value[field] === "string");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isResumeData(value: unknown): value is ResumeData {
  if (
    !isRecord(value) ||
    !hasStringFields(value.personal, [
      "name",
      "title",
      "location",
      "email",
      "phone",
      "linkedin",
      "github",
      "avatar",
    ]) ||
    typeof value.summary !== "string" ||
    !Array.isArray(value.experience) ||
    !Array.isArray(value.education) ||
    !Array.isArray(value.projects) ||
    !isStringArray(value.skills) ||
    !isStringArray(value.hobbies) ||
    !isStringArray(value.achievements)
  ) {
    return false;
  }

  const validExperience = value.experience.every(
    (company) =>
      hasStringFields(company, ["company", "location"]) &&
      Array.isArray(company.positions) &&
      company.positions.every(
        (position) =>
          hasStringFields(position, [
            "job_title",
            "start_date",
            "end_date",
            "work_type",
            "employment_type",
          ]) &&
          (typeof position.duration === "string" || position.duration === null) &&
          isStringArray(position.responsibilities),
      ),
  );
  const validEducation = value.education.every((item) =>
    hasStringFields(item, ["degree", "institution", "start_date", "end_date", "gpa"]),
  );
  const validProjects = value.projects.every((project) =>
    hasStringFields(project, ["name", "description"]),
  );

  return validExperience && validEducation && validProjects;
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState("");

  function updatePersonal(field: keyof ResumeData["personal"], value: string) {
    onChange({ ...data, personal: { ...data.personal, [field]: value } });
  }

  function changeCompany(
    companyIndex: number,
    update: (company: ResumeData["experience"][number]) => ResumeData["experience"][number],
  ) {
    onChange({
      ...data,
      experience: data.experience.map((company, index) =>
        index === companyIndex ? update(company) : company,
      ),
    });
  }

  function changePosition(
    companyIndex: number,
    positionIndex: number,
    update: (position: ResumePosition) => ResumePosition,
  ) {
    changeCompany(companyIndex, (company) => ({
      ...company,
      positions: company.positions.map((position, index) =>
        index === positionIndex ? update(position) : position,
      ),
    }));
  }

  async function loadFile(file: File | undefined) {
    setImportError("");
    if (!file) return;

    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isResumeData(parsed)) {
        setImportError("That file does not match the resume JSON format.");
        return;
      }
      onChange(parsed);
    } catch {
      setImportError("Could not read that JSON file. Check that it is valid JSON.");
    }
  }

  function exportFile() {
    const file = new Blob([`${JSON.stringify(data, null, 2)}\n`], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "resume.json";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  return (
    <Card className="resume-form-card">
      <CardHeader className="resume-form-header">
        <div>
          <p className="resume-form-eyebrow">Editor</p>
          <CardTitle className="resume-form-title">Resume details</CardTitle>
        </div>
        <CardAction className="resume-file-actions">
          <input
            accept=".json,application/json"
            aria-label="Load a resume JSON file"
            className="sr-only"
            onChange={(event) => {
              void loadFile(event.currentTarget.files?.[0]);
              event.currentTarget.value = "";
            }}
            ref={fileInput}
            type="file"
          />
          <Button onClick={() => fileInput.current?.click()} size="sm" variant="outline" type="button">
            <Upload aria-hidden="true" />
            Load JSON
          </Button>
          <Button onClick={exportFile} size="sm" type="button">
            <Download aria-hidden="true" />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="resume-form-content">
        {importError && <p className="resume-import-error" role="alert">{importError}</p>}
        <Accordion className="resume-accordion" defaultValue={["personal", "profile"]} multiple>
          <AccordionItem className="resume-accordion-item" value="personal">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Personal details</span>
                <span className="resume-accordion-hint">Contact information</span>
              </span>
              <span className="resume-form-count">8 fields</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content resume-form-grid">
                <Field label="Full name" value={data.personal.name} onChange={(value) => updatePersonal("name", value)} />
                <Field label="Professional title" value={data.personal.title} onChange={(value) => updatePersonal("title", value)} />
                <Field label="Location" value={data.personal.location} onChange={(value) => updatePersonal("location", value)} />
                <Field label="Email" type="email" value={data.personal.email} onChange={(value) => updatePersonal("email", value)} />
                <Field label="Phone" type="tel" value={data.personal.phone} onChange={(value) => updatePersonal("phone", value)} />
                <Field label="LinkedIn URL" type="url" value={data.personal.linkedin} onChange={(value) => updatePersonal("linkedin", value)} />
                <Field label="GitHub URL" type="url" value={data.personal.github} onChange={(value) => updatePersonal("github", value)} />
                <Field label="Avatar filename or path" value={data.personal.avatar} onChange={(value) => updatePersonal("avatar", value)} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="resume-accordion-item" value="profile">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Profile</span>
                <span className="resume-accordion-hint">A short professional summary</span>
              </span>
              <span className="resume-form-count">1 field</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content">
                <Field
                  label="Summary"
                  multiline
                  value={data.summary}
                  onChange={(summary) => onChange({ ...data, summary })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="resume-accordion-item" value="experience">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Experience</span>
                <span className="resume-accordion-hint">Roles and responsibilities</span>
              </span>
              <span className="resume-form-count">{data.experience.length} companies</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content">
                <div className="resume-form-items">
          {data.experience.map((company, companyIndex) => (
            <div className="resume-form-item" key={companyIndex}>
              <div className="resume-form-item-heading">
                <h3>Company {companyIndex + 1}</h3>
                <Button
                  aria-label={`Remove company ${companyIndex + 1}`}
                  className="resume-remove-button"
                  onClick={() => onChange({
                    ...data,
                    experience: data.experience.filter((_, index) => index !== companyIndex),
                  })}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
              <div className="resume-form-grid">
                <Field label="Company" value={company.company} onChange={(value) => changeCompany(companyIndex, (item) => ({ ...item, company: value }))} />
                <Field label="Location" value={company.location} onChange={(value) => changeCompany(companyIndex, (item) => ({ ...item, location: value }))} />
              </div>
              <div className="resume-form-subitems">
                {company.positions.map((position, positionIndex) => (
                  <div className="resume-form-subitem" key={positionIndex}>
                    <div className="resume-form-item-heading">
                      <h4>Position {positionIndex + 1}</h4>
                      <Button
                        aria-label={`Remove position ${positionIndex + 1}`}
                        className="resume-remove-button"
                        onClick={() => changeCompany(companyIndex, (item) => ({
                          ...item,
                          positions: item.positions.filter((_, index) => index !== positionIndex),
                        }))}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                    <div className="resume-form-grid">
                      <Field label="Job title" value={position.job_title} onChange={(value) => changePosition(companyIndex, positionIndex, (item) => ({ ...item, job_title: value }))} />
                      <Field label="Start date" value={position.start_date} onChange={(value) => changePosition(companyIndex, positionIndex, (item) => ({ ...item, start_date: value }))} />
                      <Field label="End date" value={position.end_date} onChange={(value) => changePosition(companyIndex, positionIndex, (item) => ({ ...item, end_date: value }))} />
                      <Field label="Duration" value={position.duration ?? ""} onChange={(value) => changePosition(companyIndex, positionIndex, (item) => ({ ...item, duration: value }))} />
                      <Field label="Work type" value={position.work_type} onChange={(value) => changePosition(companyIndex, positionIndex, (item) => ({ ...item, work_type: value }))} />
                      <Field label="Employment type" value={position.employment_type} onChange={(value) => changePosition(companyIndex, positionIndex, (item) => ({ ...item, employment_type: value }))} />
                    </div>
                    <StringListEditor
                      label="Responsibilities"
                      addLabel="Add responsibility"
                      items={position.responsibilities}
                      onAdd={() => changePosition(companyIndex, positionIndex, (item) => ({ ...item, responsibilities: [...item.responsibilities, ""] }))}
                      onChange={(index, value) => changePosition(companyIndex, positionIndex, (item) => ({
                        ...item,
                        responsibilities: item.responsibilities.map((entry, itemIndex) => itemIndex === index ? value : entry),
                      }))}
                      onRemove={(index) => changePosition(companyIndex, positionIndex, (item) => ({
                        ...item,
                        responsibilities: item.responsibilities.filter((_, itemIndex) => itemIndex !== index),
                      }))}
                    />
                  </div>
                ))}
              </div>
              <Button
                className="resume-add-button"
                onClick={() => changeCompany(companyIndex, (item) => ({ ...item, positions: [...item.positions, emptyPosition()] }))}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus aria-hidden="true" />
                Add position
              </Button>
            </div>
          ))}
                </div>
                <Button
          className="resume-add-button"
          onClick={() => onChange({
            ...data,
            experience: [...data.experience, { company: "", location: "", positions: [] }],
          })}
          size="sm"
          type="button"
          variant="outline"
        >
                  <Plus aria-hidden="true" />
                  Add company
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="resume-accordion-item" value="skills">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Skills</span>
                <span className="resume-accordion-hint">Areas of expertise</span>
              </span>
              <span className="resume-form-count">{data.skills.length} skills</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content">
                <StringListEditor
                  label="Skill"
                  addLabel="Add skill"
                  items={data.skills}
                  onAdd={() => onChange({ ...data, skills: [...data.skills, ""] })}
                  onChange={(index, value) => onChange({ ...data, skills: data.skills.map((item, itemIndex) => itemIndex === index ? value : item) })}
                  onRemove={(index) => onChange({ ...data, skills: data.skills.filter((_, itemIndex) => itemIndex !== index) })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="resume-accordion-item" value="education">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Education</span>
                <span className="resume-accordion-hint">Degrees and institutions</span>
              </span>
              <span className="resume-form-count">{data.education.length} entries</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content">
                <div className="resume-form-items">
          {data.education.map((item, index) => (
            <div className="resume-form-item" key={index}>
              <div className="resume-form-item-heading">
                <h3>Education {index + 1}</h3>
                <Button aria-label={`Remove education ${index + 1}`} className="resume-remove-button" onClick={() => onChange({ ...data, education: data.education.filter((_, itemIndex) => itemIndex !== index) })} size="sm" type="button" variant="ghost"><Trash2 aria-hidden="true" /></Button>
              </div>
              <div className="resume-form-grid">
                <Field label="Degree" value={item.degree} onChange={(value) => onChange({ ...data, education: data.education.map((entry, itemIndex) => itemIndex === index ? { ...entry, degree: value } : entry) })} />
                <Field label="Institution" value={item.institution} onChange={(value) => onChange({ ...data, education: data.education.map((entry, itemIndex) => itemIndex === index ? { ...entry, institution: value } : entry) })} />
                <Field label="Start date" value={item.start_date} onChange={(value) => onChange({ ...data, education: data.education.map((entry, itemIndex) => itemIndex === index ? { ...entry, start_date: value } : entry) })} />
                <Field label="End date" value={item.end_date} onChange={(value) => onChange({ ...data, education: data.education.map((entry, itemIndex) => itemIndex === index ? { ...entry, end_date: value } : entry) })} />
                <Field label="GPA" value={item.gpa} onChange={(value) => onChange({ ...data, education: data.education.map((entry, itemIndex) => itemIndex === index ? { ...entry, gpa: value } : entry) })} />
              </div>
            </div>
          ))}
                </div>
                <Button className="resume-add-button" onClick={() => onChange({ ...data, education: [...data.education, { degree: "", institution: "", start_date: "", end_date: "", gpa: "" }] })} size="sm" type="button" variant="outline"><Plus aria-hidden="true" />Add education</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="resume-accordion-item" value="achievements">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Achievements</span>
                <span className="resume-accordion-hint">Recognition and highlights</span>
              </span>
              <span className="resume-form-count">{data.achievements.length} items</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content">
                <StringListEditor
                  label="Achievement"
                  addLabel="Add achievement"
                  items={data.achievements}
                  onAdd={() => onChange({ ...data, achievements: [...data.achievements, ""] })}
                  onChange={(index, value) => onChange({ ...data, achievements: data.achievements.map((item, itemIndex) => itemIndex === index ? value : item) })}
                  onRemove={(index) => onChange({ ...data, achievements: data.achievements.filter((_, itemIndex) => itemIndex !== index) })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="resume-accordion-item" value="interests">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Interests</span>
                <span className="resume-accordion-hint">Outside the workplace</span>
              </span>
              <span className="resume-form-count">{data.hobbies.length} items</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content">
                <StringListEditor
                  label="Interest"
                  addLabel="Add interest"
                  items={data.hobbies}
                  onAdd={() => onChange({ ...data, hobbies: [...data.hobbies, ""] })}
                  onChange={(index, value) => onChange({ ...data, hobbies: data.hobbies.map((item, itemIndex) => itemIndex === index ? value : item) })}
                  onRemove={(index) => onChange({ ...data, hobbies: data.hobbies.filter((_, itemIndex) => itemIndex !== index) })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="resume-accordion-item" value="projects">
            <AccordionTrigger className="resume-accordion-trigger">
              <span className="resume-accordion-trigger-copy">
                <span>Projects</span>
                <span className="resume-accordion-hint">Selected work</span>
              </span>
              <span className="resume-form-count">{data.projects.length} projects</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="resume-section-content">
                <div className="resume-form-items">
          {data.projects.map((project, index) => (
            <div className="resume-form-item" key={index}>
              <div className="resume-form-item-heading">
                <h3>Project {index + 1}</h3>
                <Button aria-label={`Remove project ${index + 1}`} className="resume-remove-button" onClick={() => onChange({ ...data, projects: data.projects.filter((_, itemIndex) => itemIndex !== index) })} size="sm" type="button" variant="ghost"><Trash2 aria-hidden="true" /></Button>
              </div>
              <Field label="Project name" value={project.name} onChange={(value) => onChange({ ...data, projects: data.projects.map((item, itemIndex) => itemIndex === index ? { ...item, name: value } : item) })} />
              <Field label="Description" multiline value={project.description} onChange={(value) => onChange({ ...data, projects: data.projects.map((item, itemIndex) => itemIndex === index ? { ...item, description: value } : item) })} />
            </div>
          ))}
                </div>
                <Button className="resume-add-button" onClick={() => onChange({ ...data, projects: [...data.projects, { name: "", description: "" }] })} size="sm" type="button" variant="outline"><Plus aria-hidden="true" />Add project</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "tel";
  multiline?: boolean;
}) {
  const id = useId();

  return (
    <div className="resume-field">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea className="resume-textarea-control" id={id} onChange={(event) => onChange(event.target.value)} rows={3} value={value} />
      ) : (
        <Input className="resume-field-control" id={id} onChange={(event) => onChange(event.target.value)} type={type} value={value} />
      )}
    </div>
  );
}

function StringListEditor({
  label,
  addLabel,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  label: string;
  addLabel: string;
  items: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="resume-string-list">
      {items.map((item, index) => (
        <div className="resume-list-row" key={index}>
          <Input
            aria-label={`${label} ${index + 1}`}
            className="resume-field-control"
            onChange={(event) => onChange(index, event.target.value)}
            value={item}
          />
          <Button
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            className="resume-icon-button"
            onClick={() => onRemove(index)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button className="resume-add-button" onClick={onAdd} size="sm" type="button" variant="outline">
        <Plus aria-hidden="true" />
        {addLabel}
      </Button>
    </div>
  );
}