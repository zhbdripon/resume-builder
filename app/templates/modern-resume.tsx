import type { ResumeTemplateProps } from "./resume-document";
import { ResumeDocument } from "./resume-document";

export function ModernResumeTemplate(props: ResumeTemplateProps) {
  return <ResumeDocument {...props} variant="modern" />;
}