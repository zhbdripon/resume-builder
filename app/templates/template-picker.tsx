"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import sampleData from "../sampleData.json";
import { ClassicResumeTemplate } from "./classic-resume";
import type { ExperienceView, ResumeData } from "./resume-document";
import { ModernResumeTemplate } from "./modern-resume";
import { isResumeData, ResumeForm } from "./resume-form";
import { clearAvatar, deleteAvatar, getAvatar, saveAvatar } from "./avatar-store";

type TemplateName = "modern" | "classic";
const RESUME_STORAGE_KEY = "resume-builder:resume:v1";
const LOADING_RESUME_SNAPSHOT = "__resume_loading__";
const SAMPLE_AVATAR_URL = "/sample-profile.jpg";
const sampleResume: ResumeData = sampleData;
const emptyResume: ResumeData = {
  personal: {
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experience: [],
  skills: [],
  education: [],
  hobbies: [],
  achievements: [],
  projects: [],
};

let memoryResumeSnapshot: string | undefined;
const resumeStoreListeners = new Set<() => void>();

function getResumeSnapshot() {
  if (memoryResumeSnapshot !== undefined) return memoryResumeSnapshot;

  try {
    return window.localStorage.getItem(RESUME_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribeToResumeStore(listener: () => void) {
  resumeStoreListeners.add(listener);
  window.addEventListener("storage", handleResumeStorage);

  return () => {
    resumeStoreListeners.delete(listener);
    window.removeEventListener("storage", handleResumeStorage);
  };
}

function handleResumeStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== RESUME_STORAGE_KEY) return;

  memoryResumeSnapshot = undefined;
  resumeStoreListeners.forEach((listener) => listener());
}

function saveResumeSnapshot(data: ResumeData) {
  const snapshot = JSON.stringify(data);
  memoryResumeSnapshot = snapshot;

  try {
    window.localStorage.setItem(RESUME_STORAGE_KEY, snapshot);
  } catch {}

  resumeStoreListeners.forEach((listener) => listener());
}

function parseResumeSnapshot(snapshot: string): ResumeData {
  if (!snapshot) return sampleResume;

  try {
    const parsed: unknown = JSON.parse(snapshot);
    return isResumeData(parsed) ? parsed : sampleResume;
  } catch {
    return sampleResume;
  }
}

export function TemplatePicker() {
  const resumeSnapshot = useSyncExternalStore(
    subscribeToResumeStore,
    getResumeSnapshot,
    () => LOADING_RESUME_SNAPSHOT,
  );
  const isResumeReady = resumeSnapshot !== LOADING_RESUME_SNAPSHOT;
  const data = isResumeReady ? parseResumeSnapshot(resumeSnapshot) : sampleResume;
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("modern");
  const [experienceView, setExperienceView] = useState<ExperienceView>("company");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarRequestVersion = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const requestVersion = avatarRequestVersion.current;

    void getAvatar()
      .then((photo) => {
        if (cancelled || requestVersion !== avatarRequestVersion.current) return;
        if (photo === "cleared") {
          setHasCustomAvatar(false);
          setAvatarUrl(null);
          setIsAvatarReady(true);
          return;
        }
        if (photo) {
          setHasCustomAvatar(true);
          setAvatarUrl(URL.createObjectURL(photo));
        } else {
          setHasCustomAvatar(false);
          setAvatarUrl(SAMPLE_AVATAR_URL);
        }
        setIsAvatarReady(true);
      })
      .catch(() => {
        if (cancelled || requestVersion !== avatarRequestVersion.current) return;
        setHasCustomAvatar(false);
        setAvatarUrl(SAMPLE_AVATAR_URL);
        setAvatarError("The saved photo could not be loaded.");
        setIsAvatarReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!avatarUrl || avatarUrl === SAMPLE_AVATAR_URL) return;
    return () => URL.revokeObjectURL(avatarUrl);
  }, [avatarUrl]);

  function updateResume(nextData: ResumeData) {
    saveResumeSnapshot(nextData);
  }

  async function updateAvatar(file: File | null) {
    setAvatarError("");
    avatarRequestVersion.current += 1;

    if (!file) {
      try {
        await deleteAvatar();
        setHasCustomAvatar(false);
        setAvatarUrl(SAMPLE_AVATAR_URL);
      } catch {
        setAvatarError("The saved photo could not be removed.");
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("Choose an image file for the profile photo.");
      return;
    }

    setAvatarUrl(URL.createObjectURL(file));
    setHasCustomAvatar(true);
    try {
      await saveAvatar(file);
    } catch {
      setAvatarError("The photo could not be saved in this browser.");
    }
  }

  function loadSample() {
    updateResume(sampleResume);
    void updateAvatar(null);
  }

  function clearResume() {
    avatarRequestVersion.current += 1;
    updateResume(emptyResume);
    setAvatarUrl(null);
    setHasCustomAvatar(false);
    setAvatarError("");
    void clearAvatar().catch(() => {
      setAvatarError("The profile photo could not be cleared from this browser.");
    });
  }

  if (!isResumeReady || !isAvatarReady) {
    return (
      <main className="resume-loading-state">
        <div className="resume-loading-indicator" role="status" aria-live="polite">
          <span className="resume-loading-icon">
            <LoaderCircle aria-hidden="true" />
          </span>
          <span>Loading your resume...</span>
        </div>
      </main>
    );
  }

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
          <ResumeTemplate data={data} avatarUrl={avatarUrl} experienceView={experienceView} />
        </section>
        <aside className="resume-editor screen-only" aria-label="Resume editor">
          <ResumeForm
            avatarError={avatarError}
            hasCustomAvatar={hasCustomAvatar}
            avatarUrl={avatarUrl}
            data={data}
            onChange={updateResume}
            onClear={clearResume}
            onLoadSample={loadSample}
            onPhotoChange={(file) => void updateAvatar(file)}
          />
        </aside>
      </div>
    </main>
  );
}