import data from "./data.json";
import { PrintButton } from "./print-button";

export default function Home() {
  return (
    <main className="resume-stage min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <div className="resume-toolbar mx-auto mb-4 flex w-full max-w-[210mm] items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#496168]">A4 resume</p>
        <PrintButton />
      </div>

      <article
        className="resume-paper mx-auto w-full max-w-[210mm] overflow-hidden bg-white shadow-[0_18px_60px_rgba(19,44,53,0.12)]"
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
                <div className="space-y-7">
                  {data.experience.map((job) => (
                    <article
                      className="experience-item relative border-l border-[#cddbd8] pl-5"
                      key={`${job.company}-${job.job_title}-${job.start_date}`}
                    >
                      <span
                        className="absolute -left-[5px] top-1.5 size-[9px] rounded-full border-[2px] border-white bg-[#318b7f]"
                        aria-hidden="true"
                      />
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold leading-6 text-[#172f38]">
                            {job.job_title}
                          </h3>
                          <p className="text-sm font-medium leading-6 text-[#318176]">
                            {job.company}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-[#53666c] sm:pt-0.5">
                          {job.start_date} to {job.end_date}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-[#687a7e]">
                        {[job.employment_type, job.work_type, job.location]
                          .filter(Boolean)
                          .join("  /  ")}
                        {job.duration ? `  /  ${job.duration}` : ""}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-sm leading-6 text-[#42545a]">
                        {job.responsibilities.map((responsibility) => (
                          <li className="resume-bullet" key={responsibility}>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section className="resume-section" aria-labelledby="projects-heading">
                <SectionHeading id="projects-heading">Selected projects</SectionHeading>
                <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
                  {data.projects.map((project) => (
                    <article className="project-item" key={project.name}>
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

            <aside className="resume-sidebar min-w-0 space-y-9 border-t border-[#dbe5e2] pt-8 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <section className="resume-section" aria-labelledby="skills-heading">
                <SectionHeading id="skills-heading">Core skills</SectionHeading>
                <ul className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <li
                      className="skill-badge rounded-sm border border-[#d8e5e1] bg-[#f3f8f6] text-xs font-medium text-[#315c58]"
                      key={skill}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="resume-section" aria-labelledby="education-heading">
                <SectionHeading id="education-heading">Education</SectionHeading>
                <div className="space-y-5">
                  {data.education.map((item) => (
                    <article key={`${item.institution}-${item.degree}`}>
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
                  {data.achievements.map((achievement) => (
                    <li className="resume-bullet" key={achievement}>
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
        </div>
      </article>
    </main>
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
