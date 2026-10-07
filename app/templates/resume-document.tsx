import { PrintButton } from "../print-button";

export type ResumePosition = {
  job_title: string;
  start_date: string;
  end_date: string;
  duration: string | null;
  work_type: string;
  employment_type: string;
  responsibilities: string[];
};

export type ResumeData = {
  personal: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    avatar: string;
  };
  summary: string;
  experience: { company: string; location: string; positions: ResumePosition[] }[];
  skills: string[];
  education: {
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
    gpa: string;
  }[];
  hobbies: string[];
  achievements: string[];
  projects: { name: string; description: string }[];
};
type ResumeVariant = "modern" | "classic";
export type ExperienceView = "company" | "role";
export type ResumeTemplateProps = {
  data: ResumeData;
  experienceView: ExperienceView;
};

export function ResumeDocument({
  data,
  variant,
  experienceView,
}: {
  data: ResumeData;
  variant: ResumeVariant;
  experienceView: ExperienceView;
}) {
  return (
    <>
      <div className="resume-toolbar mx-auto mb-4 flex w-full max-w-[210mm] items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#496168]">A4 resume</p>
        <PrintButton />
      </div>

      <article
        className={`resume-paper resume-paper--${variant} ${experienceView === "role" ? "resume-paper--experience-role" : ""} mx-auto w-full max-w-[210mm] overflow-hidden bg-white shadow-[0_18px_60px_rgba(19,44,53,0.12)]`}
        id="resume-document"
      >
        <header className="resume-header relative overflow-hidden border-b-4 border-[#58b6a7] bg-[#132c35] px-7 py-8 text-white sm:px-11 sm:py-10">
          <div className="absolute inset-y-0 right-0 w-2 bg-[#d4a85e]" aria-hidden="true" />
          <div className="flex flex-col-reverse items-start justify-between gap-7 sm:flex-row sm:items-center sm:gap-10">
            <div className="min-w-0">
              <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl">
                {data.personal.name}
              </h1>
              <p className="mt-3 text-lg text-[#d5e5e4] sm:text-xl">
                {data.personal.title}
              </p>
              <div className="resume-contact mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#e0ebea]">
                <span>{data.personal.location}</span>
                <a className="resume-link" href={`mailto:${data.personal.email}`}>
                  {data.personal.email}
                </a>
                <a className="resume-link" href={`tel:${data.personal.phone}`}>
                  {data.personal.phone}
                </a>
                <a
                  className="resume-link"
                  href={data.personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.personal.linkedin}
                </a>
                <a
                  className="resume-link"
                  href={data.personal.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.personal.github}
                </a>
              </div>
            </div>
            {data.personal.avatar && (
              <div
                className="resume-avatar"
                role="img"
                aria-label={`${data.personal.name} portrait`}
                style={{ backgroundImage: `url(/${data.personal.avatar})` }}
              />
            )}
          </div>
        </header>

        <div className="px-7 py-8 sm:px-11 sm:py-10">
          <section className="resume-section mb-9" aria-labelledby="profile-heading">
            <SectionHeading id="profile-heading">Profile</SectionHeading>
            <p className="max-w-[76ch] text-[15px] leading-7 text-[#42545a]">
              {data.summary}
            </p>
          </section>

          <div className="resume-columns grid gap-6 md:grid-cols-[minmax(0,1.65fr)_minmax(0,0.9fr)] md:gap-6">
            <div className="min-w-0">
              <section className="resume-section mb-10" aria-labelledby="experience-heading">
                <SectionHeading id="experience-heading">Experience</SectionHeading>
                {experienceView === "company" ? (
                  <div className="space-y-7">
                    {data.experience.map((company, companyIndex) => (
                      <article
                        className="company-item relative border-l border-[#cddbd8] pl-5"
                        key={companyIndex}
                      >
                        <span
                          className="absolute -left-[5px] top-1.5 size-[9px] rounded-full border-[2px] border-white bg-[#318b7f]"
                          aria-hidden="true"
                        />
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                          <h3 className="font-semibold leading-6 text-[#172f38]">
                            {company.company}
                          </h3>
                          <p className="shrink-0 text-xs text-[#687a7e]">
                            {company.positions.length > 1 && (
                              <>
                                {company.positions.length} positions
                                {company.location ? "  /  " : ""}
                              </>
                            )}
                            {company.location}
                          </p>
                        </div>
                        <div className="company-positions mt-0 space-y-2">
                          {company.positions.map((position, positionIndex) => (
                            <PositionDetails
                              company={company.company}
                              position={position}
                              showCompany={false}
                              key={positionIndex}
                            />
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {data.experience.flatMap((company, companyIndex) =>
                      company.positions.map((position, positionIndex) => (
                        <article
                          className="role-item relative border-l border-[#cddbd8] pl-5"
                          key={`${companyIndex}-${positionIndex}`}
                        >
                          <span
                            className="absolute -left-[5px] top-1.5 size-[9px] rounded-full border-[2px] border-white bg-[#318b7f]"
                            aria-hidden="true"
                          />
                          <PositionDetails
                            company={company.company}
                            position={position}
                            showCompany
                          />
                        </article>
                      )),
                    )}
                  </div>
                )}
              </section>

            </div>

            <aside className="resume-sidebar min-w-0 space-y-9 border-t border-[#dbe5e2] pt-8 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <section className="resume-section" aria-labelledby="skills-heading">
                <SectionHeading id="skills-heading">Core skills</SectionHeading>
                <ul className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <li
                      className="skill-badge rounded-sm border border-[#d8e5e1] bg-[#f3f8f6] text-xs font-medium text-[#315c58]"
                      key={index}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="resume-section" aria-labelledby="education-heading">
                <SectionHeading id="education-heading">Education</SectionHeading>
                <div className="space-y-5">
                  {data.education.map((item, index) => (
                    <article key={index}>
                      <h3 className="font-semibold leading-6 text-[#172f38]">
                        {item.degree}
                      </h3>
                      <p className="mt-1 text-sm text-[#318176]">{item.institution}</p>
                      <p className="mt-1 text-xs leading-5 text-[#687a7e]">
                        {item.start_date} to {item.end_date} <span aria-hidden="true">/</span> GPA {item.gpa}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="resume-section" aria-labelledby="achievements-heading">
                <SectionHeading id="achievements-heading">Achievements</SectionHeading>
                <ul className="space-y-2 text-sm leading-6 text-[#42545a]">
                  {data.achievements.map((achievement, index) => (
                    <li className="resume-bullet" key={index}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="resume-section" aria-labelledby="interests-heading">
                <SectionHeading id="interests-heading">Interests</SectionHeading>
                <p className="text-sm leading-6 text-[#42545a]">
                  {data.hobbies.join("  /  ")}
                </p>
              </section>

            </aside>
          </div>

          <section className="resume-section projects-section mt-8" aria-labelledby="projects-heading">
            <SectionHeading id="projects-heading">Selected projects</SectionHeading>
            <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
              {data.projects.map((project, index) => (
                <article className="project-item" key={index}>
                  <h3 className="font-semibold leading-6 text-[#172f38]">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#53666c]">
                    {project.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}

function PositionDetails({
  company,
  position,
  showCompany,
}: {
  company: string;
  position: ResumeData["experience"][number]["positions"][number];
  showCompany: boolean;
}) {
  return (
    <div className="position-item">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
        <div>
          <h4 className="font-semibold leading-6 text-[#315c58]">{position.job_title}</h4>
          {showCompany && <p className="text-sm font-medium text-[#318176]">{company}</p>}
        </div>
        <p className="shrink-0 text-xs text-[#687a7e] sm:pt-0.5">
          {position.start_date} to {position.end_date}
        </p>
      </div>
      <p className="mt-1 text-xs text-[#687a7e]">
        {[position.employment_type, position.work_type]
          .filter(Boolean)
          .join("  /  ")}
        {position.duration ? `  /  ${position.duration}` : ""}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm leading-6 text-[#42545a]">
        {position.responsibilities.map((responsibility, index) => (
          <li className="resume-bullet" key={index}>
            {responsibility}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="mb-5 flex items-center gap-3 text-xs font-bold uppercase text-[#28766d]"
    >
      <span>{children}</span>
      <span className="h-px flex-1 bg-[#d9e5e1]" aria-hidden="true" />
    </h2>
  );
}