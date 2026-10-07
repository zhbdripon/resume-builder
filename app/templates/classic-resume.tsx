import type { ResumeTemplateProps } from "./resume-document";
import { ResumeDocument } from "./resume-document";

export function ClassicResumeTemplate(props: ResumeTemplateProps) {
  return <ResumeDocument {...props} variant="classic" />;
}