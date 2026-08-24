import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import api from "../api/axiosClient.js";
import ResumePreview from "../components/ResumePreview.jsx";

const STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "summary", label: "Summary" },
  { id: "preview", label: "Preview & Export" },
];

const EMPTY_DRAFT = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  summary: "",
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "Saving...", "Saved", or error
  const [error, setError] = useState("");

  // AI Assist State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModal, setAiModal] = useState(null); // { section, index, suggestions, fieldName }

  // Ref for react-to-print
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: draft.personalInfo?.name
      ? `${draft.personalInfo.name.replace(/\s+/g, "_")}_Resume`
      : "Resume",
  });

  // Fetch draft on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/resume-builder");
        if (!cancelled && data.draft) {
          setDraft({
            ...EMPTY_DRAFT,
            ...data.draft,
            personalInfo: {
              ...EMPTY_DRAFT.personalInfo,
              ...(data.draft.personalInfo || {}),
            },
          });
        }
      } catch {
        if (!cancelled) setDraft(EMPTY_DRAFT);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced auto-save
  const saveToServer = useCallback(async (dataToSave) => {
    setSaving(true);
    setSaveStatus("Saving…");
    try {
      await api.put("/resume-builder", dataToSave);
      setSaveStatus("Saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch {
      setSaveStatus("Autosave failed");
    } finally {
      setSaving(false);
    }
  }, []);

  // Save on step change or navigation
  const handleStepChange = (newStep) => {
    saveToServer(draft);
    setCurrentStep(newStep);
  };

  // Field change helpers
  const handlePersonalInfoChange = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Education helpers
  const addEducation = () => {
    setDraft((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", startYear: "", endYear: "" },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setDraft((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Experience helpers
  const addExperience = () => {
    setDraft((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setDraft((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index) => {
    setDraft((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Projects helpers
  const addProject = () => {
    setDraft((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "", description: "", techUsed: "" },
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    setDraft((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Skills helpers
  const [skillInput, setSkillInput] = useState("");
  const addSkill = () => {
    if (!skillInput.trim()) return;
    const items = skillInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !draft.skills.includes(s));
    if (items.length > 0) {
      setDraft((prev) => ({
        ...prev,
        skills: [...prev.skills, ...items],
      }));
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // AI Assist Action
  const handleAiAssist = async (section, index, rawText) => {
    if (!rawText || rawText.trim().length < 10) {
      setError("Please enter at least 10 characters to let AI rewrite and improve.");
      return;
    }
    setError("");
    setAiLoading(true);
    try {
      const { data } = await api.post("/resume-builder/ai-assist", {
        section,
        rawText: rawText.trim(),
      });
      setAiModal({
        section,
        index,
        suggestions: data.suggestions || [],
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not generate AI suggestions. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = (suggestion) => {
    if (!aiModal) return;
    const { section, index } = aiModal;
    if (section === "experience") {
      updateExperience(index, "description", suggestion);
    } else if (section === "projects") {
      updateProject(index, "description", suggestion);
    }
    setAiModal(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="ticket-card flex items-center gap-3 p-8 text-text-primary/70">
            <span className="font-mono">•••</span>
            <span>Loading resume builder…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to="/dashboard"
            className="font-mono text-xs text-text-primary/70 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="font-mono text-xs text-text-primary/60">
                {saveStatus}
              </span>
            )}
            <button
              type="button"
              onClick={() => saveToServer(draft)}
              disabled={saving}
              className="rounded border border-white/10 px-3 py-1 font-mono text-xs text-text-primary hover:bg-stamp-navy/5 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {/* Wizard Shell */}
        <div className="mt-6">
          {/* Step Progress Bar */}
          <div className="ticket-card p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
                PREPPASS — RESUME BUILDER
              </div>
              <span className="font-mono text-xs text-text-primary/60">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1 sm:gap-2">
              {STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStepChange(idx)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] transition ${
                    currentStep === idx
                      ? "bg-stamp-navy text-white font-semibold"
                      : idx < currentStep
                      ? "bg-gold/20 text-text-primary hover:bg-gold/30"
                      : "bg-stamp-navy/10 text-text-primary/70 hover:bg-stamp-navy/15"
                  }`}
                >
                  {idx + 1}. {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 0: Personal Info */}
          {currentStep === 0 && (
            <div className="ticket-card p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-heading text-xl text-text-primary">
                  Personal & Contact Information
                </h2>
                <p className="mt-1 text-xs text-text-secondary/60">
                  Enter your full legal name, active email, phone number, and online profiles.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs text-text-primary/70 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sohom Giri"
                    value={draft.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3.5 py-2 text-sm text-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/20"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-primary/70 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. candidate@example.com"
                    value={draft.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3.5 py-2 text-sm text-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/20"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-primary/70 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={draft.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3.5 py-2 text-sm text-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/20"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-primary/70 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. linkedin.com/in/username"
                    value={draft.personalInfo.linkedin}
                    onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3.5 py-2 text-sm text-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/20"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-primary/70 mb-1">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. github.com/username"
                    value={draft.personalInfo.github}
                    onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3.5 py-2 text-sm text-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Education */}
          {currentStep === 1 && (
            <div className="ticket-card p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl text-text-primary">
                    Education History
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary/60">
                    Add your university degrees, diplomas, or high school certifications.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="rounded-lg bg-stamp-navy/10 px-3.5 py-1.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/20"
                >
                  + Add Degree
                </button>
              </div>

              {draft.education.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 p-6 text-center">
                  <p className="text-xs text-text-secondary/60">No education entries yet.</p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="mt-2 text-xs font-semibold text-text-primary hover:underline"
                  >
                    + Add your college/degree
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {draft.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-surface/50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-primary/60">
                          Education #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="font-mono text-xs text-stamp-maroon hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Institution / University
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. MAKAUT University"
                            value={edu.school}
                            onChange={(e) => updateEducation(idx, "school", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Degree & Major
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. B.Tech in Computer Science"
                            value={edu.degree}
                            onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Start Year
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2022"
                            value={edu.startYear}
                            onChange={(e) => updateEducation(idx, "startYear", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            End Year / Expected
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2026"
                            value={edu.endYear}
                            onChange={(e) => updateEducation(idx, "endYear", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <div className="ticket-card p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl text-text-primary">
                    Work & Internship Experience
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary/60">
                    Detail your professional roles, internships, or freelance positions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded-lg bg-stamp-navy/10 px-3.5 py-1.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/20"
                >
                  + Add Experience
                </button>
              </div>

              {draft.experience.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 p-6 text-center">
                  <p className="text-xs text-text-secondary/60">No experience added yet.</p>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="mt-2 text-xs font-semibold text-text-primary hover:underline"
                  >
                    + Add your first experience/internship
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {draft.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-surface/50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-primary/60">
                          Experience #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="font-mono text-xs text-stamp-maroon hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Acme Tech Solutions"
                            value={exp.company}
                            onChange={(e) => updateExperience(idx, "company", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Job Title / Role
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Full Stack Developer Intern"
                            value={exp.role}
                            onChange={(e) => updateExperience(idx, "role", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Start Date
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Jun 2024"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            End Date
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Aug 2024 or Present"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(idx, "endDate", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-mono text-[11px] text-text-primary/70">
                            Key Responsibilities & Quantified Achievements
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAiAssist("experience", idx, exp.description)}
                            disabled={aiLoading}
                            className="inline-flex items-center gap-1 rounded bg-gold/20 px-2 py-0.5 font-mono text-[10px] text-text-primary hover:bg-gold/30 disabled:opacity-50"
                          >
                            ✨ {aiLoading ? "Improving…" : "AI Improve"}
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="e.g. Developed REST APIs in Express.js handling 50k requests/day. Optimized database queries reducing latency by 25%."
                          value={exp.description}
                          onChange={(e) => updateExperience(idx, "description", e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-surface p-3 text-sm text-text-secondary focus:border-gold focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Projects */}
          {currentStep === 3 && (
            <div className="ticket-card p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl text-text-primary">
                    Key Technical Projects
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary/60">
                    Highlight impactful projects showcasing your engineering or technical skills.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="rounded-lg bg-stamp-navy/10 px-3.5 py-1.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/20"
                >
                  + Add Project
                </button>
              </div>

              {draft.projects.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 p-6 text-center">
                  <p className="text-xs text-text-secondary/60">No projects added yet.</p>
                  <button
                    type="button"
                    onClick={addProject}
                    className="mt-2 text-xs font-semibold text-text-primary hover:underline"
                  >
                    + Add your first key project
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {draft.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-surface/50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-primary/60">
                          Project #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="font-mono text-xs text-stamp-maroon hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. PrepPass AI Placement Platform"
                            value={proj.title}
                            onChange={(e) => updateProject(idx, "title", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] text-text-primary/70 mb-1">
                            Tech Stack Used
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. React, Node.js, MongoDB, Gemini API, Tailwind CSS"
                            value={proj.techUsed}
                            onChange={(e) => updateProject(idx, "techUsed", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-gold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-mono text-[11px] text-text-primary/70">
                            Project Description & Highlights
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAiAssist("projects", idx, proj.description)}
                            disabled={aiLoading}
                            className="inline-flex items-center gap-1 rounded bg-gold/20 px-2 py-0.5 font-mono text-[10px] text-text-primary hover:bg-gold/30 disabled:opacity-50"
                          >
                            ✨ {aiLoading ? "Improving…" : "AI Improve"}
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="e.g. Built an adaptive mock interview engine evaluating user responses in real time with Gemini 3.1. Achieved <1.5s latency and supported 20+ roles."
                          value={proj.description}
                          onChange={(e) => updateProject(idx, "description", e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-surface p-3 text-sm text-text-secondary focus:border-gold focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Skills */}
          {currentStep === 4 && (
            <div className="ticket-card p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-heading text-xl text-text-primary">
                  Skills & Competencies
                </h2>
                <p className="mt-1 text-xs text-text-secondary/60">
                  Add technical skills, frameworks, tools, and languages (comma-separated or hit Add).
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. JavaScript, React, Node.js, MongoDB, Git, Python, SQL"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-surface px-3.5 py-2 text-sm text-text-secondary focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-semibold text-[#0B0A14] hover:bg-gold-dark"
                >
                  Add Skills
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {draft.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full bg-stamp-navy/10 px-3 py-1 font-mono text-xs text-text-primary"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="text-text-primary/60 hover:text-stamp-maroon"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {draft.skills.length === 0 && (
                  <p className="text-xs text-text-secondary/50">No skills added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {currentStep === 5 && (
            <div className="ticket-card p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="font-heading text-xl text-text-primary">
                  Professional Summary
                </h2>
                <p className="mt-1 text-xs text-text-secondary/60">
                  A concise 2–3 sentence overview of your background, key strengths, and target opportunity.
                </p>
              </div>

              <div>
                <textarea
                  rows={6}
                  placeholder="e.g. Enthusiastic Computer Science undergraduate with hands-on experience building full-stack web applications and AI tools. Proven problem-solving ability in Data Structures and Algorithms with a strong drive for software excellence."
                  value={draft.summary}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface p-4 text-sm text-text-secondary focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Step 6: Preview & Export */}
          {currentStep === 6 && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="ticket-card p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg text-text-primary">
                    Resume Ready for Export
                  </h2>
                  <p className="text-xs text-text-secondary/60">
                    Clean, ATS-standard layout formatted for direct PDF download.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePrint()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-5 py-2.5 font-heading text-sm font-semibold text-[#0B0A14] hover:bg-gold-dark"
                  >
                    📄 Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/resume-matcher")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface px-4 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5"
                  >
                    🎯 Match with Job Description
                  </button>
                </div>
              </div>

              {/* Real Resume Preview */}
              <div className="overflow-x-auto rounded-lg bg-gray-200 p-4 sm:p-8">
                <ResumePreview ref={printRef} draft={draft} />
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="rounded-lg border border-white/10 px-5 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5 disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => handleStepChange(currentStep + 1)}
                className="rounded-lg bg-gold px-6 py-2.5 font-heading text-sm font-semibold text-[#0B0A14] hover:bg-gold-dark"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePrint()}
                className="rounded-lg bg-gold px-6 py-2.5 font-heading text-sm font-semibold text-[#0B0A14] hover:bg-gold-dark"
              >
                Print / Download PDF
              </button>
            )}
          </div>
        </div>

        {/* AI Rewrite Suggestions Modal */}
        {aiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="ticket-card max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-bg p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase text-text-primary">
                  AI ASSISTANT SUGGESTIONS
                </div>
                <button
                  type="button"
                  onClick={() => setAiModal(null)}
                  className="font-mono text-xs text-text-primary/60 hover:text-text-primary"
                >
                  ✕ Close
                </button>
              </div>

              <h3 className="mt-3 font-heading text-xl text-text-primary">
                Select an enhanced bullet point
              </h3>
              <p className="mt-1 text-xs text-text-secondary/60">
                Click any suggestion to insert it into your resume entry, or close to keep your original draft.
              </p>

              <div className="mt-5 space-y-3">
                {aiModal.suggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => applyAiSuggestion(sug)}
                    className="group block w-full rounded-lg border border-white/10 bg-surface p-4 text-left transition hover:border-white/10 hover:bg-surface/40"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-text-primary/60">
                        Option #{sIdx + 1}
                      </span>
                      <span className="font-mono text-[11px] text-white group-hover:underline">
                        Apply this suggestion →
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary/85 leading-relaxed">{sug}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setAiModal(null)}
                  className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-text-primary hover:bg-stamp-navy/5"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
