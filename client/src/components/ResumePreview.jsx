import React, { forwardRef } from "react";

/**
 * Standard ATS-friendly, professional resume view component.
 * Uses clean typographic hierarchy and minimal styling for optimal PDF export and ATS readability.
 */
const ResumePreview = forwardRef(({ draft }, ref) => {
  if (!draft) return null;

  const {
    personalInfo = {},
    education = [],
    experience = [],
    projects = [],
    skills = [],
    summary = "",
  } = draft;

  const hasContact =
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.linkedin ||
    personalInfo.github;

  return (
    <div
      ref={ref}
      className="resume-preview-root mx-auto w-full max-w-[800px] bg-white p-8 sm:p-12 text-gray-900 shadow-md font-sans text-sm leading-normal print:shadow-none print:p-0 print:m-0"
      style={{ minHeight: "1050px" }}
    >
      {/* Header / Personal Info */}
      <header className="border-b border-gray-800 pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight uppercase text-gray-900 sm:text-3xl">
          {personalInfo.name || "YOUR NAME"}
        </h1>

        {hasContact && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-700">
            {personalInfo.email && (
              <span>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span>
                <span className="text-gray-400">|</span>{" "}
                <span className="font-semibold text-gray-900">Phone:</span>{" "}
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.linkedin && (
              <span>
                <span className="text-gray-400">|</span>{" "}
                <span className="font-semibold text-gray-900">LinkedIn:</span>{" "}
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.github && (
              <span>
                <span className="text-gray-400">|</span>{" "}
                <span className="font-semibold text-gray-900">GitHub:</span>{" "}
                {personalInfo.github}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && summary.trim() && (
        <section className="mt-5">
          <h2 className="border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-wider text-gray-900">
            Professional Summary
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-800 text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mt-5">
          <h2 className="border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-wider text-gray-900">
            Experience
          </h2>
          <div className="mt-3 space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between text-xs">
                  <span className="font-bold text-gray-900">
                    {exp.role || "Role"} {exp.company ? `— ${exp.company}` : ""}
                  </span>
                  <span className="font-medium text-gray-600">
                    {exp.startDate || ""} {exp.startDate && exp.endDate ? "–" : ""}{" "}
                    {exp.endDate || ""}
                  </span>
                </div>
                {exp.description && (
                  <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line pl-3">
                    {exp.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, lIdx) => (
                        <p key={lIdx} className="relative before:content-['•'] before:absolute before:-left-3 before:text-gray-600">
                          {line.replace(/^[•\-\*]\s*/, "")}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mt-5">
          <h2 className="border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-wider text-gray-900">
            Key Projects
          </h2>
          <div className="mt-3 space-y-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between text-xs">
                  <span className="font-bold text-gray-900">
                    {proj.title || "Project Title"}
                  </span>
                  {proj.techUsed && (
                    <span className="text-[11px] italic text-gray-600">
                      Technologies: {proj.techUsed}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line pl-3">
                    {proj.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, lIdx) => (
                        <p key={lIdx} className="relative before:content-['•'] before:absolute before:-left-3 before:text-gray-600">
                          {line.replace(/^[•\-\*]\s*/, "")}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mt-5">
          <h2 className="border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-wider text-gray-900">
            Education
          </h2>
          <div className="mt-3 space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900">{edu.school || "School / University"}</span>
                  {edu.degree && (
                    <span className="text-gray-700">, {edu.degree}</span>
                  )}
                </div>
                <span className="font-medium text-gray-600">
                  {edu.startYear || ""} {edu.startYear && edu.endYear ? "–" : ""}{" "}
                  {edu.endYear || ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mt-5">
          <h2 className="border-b border-gray-300 pb-1 text-xs font-bold uppercase tracking-wider text-gray-900">
            Technical & Soft Skills
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-800">
            {skills.join(" • ")}
          </p>
        </section>
      )}
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
