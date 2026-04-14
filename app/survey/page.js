"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import { LIKERT_SCALE, surveyMeta, surveyQuestions } from "@/data/survey";

const SECTIONS = [...new Set(surveyQuestions.map((q) => q.section))];

function verdictFromAvg(avg) {
  if (avg >= 4.5) return { label: "Strongly Pro-Sustainability", color: "#087741" };
  if (avg >= 3.5) return { label: "Moderately Pro-Sustainability", color: "#22b86a" };
  if (avg >= 2.5) return { label: "Neutral / Mixed", color: "#b08a00" };
  if (avg >= 1.5) return { label: "Moderately Resistant", color: "#954126" };
  return { label: "Low Eco-Consciousness Indicated", color: "#c0392b" };
}

function ScoreBar({ value, max = 5 }) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 80 ? "#22b86a" : pct >= 60 ? "#3ba7ff" : pct >= 40 ? "#f7b731" : "#e83e66";
  return (
    <div className="scoreBarWrap">
      <div className="scoreBarTrack">
        <div
          className="scoreBarFill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="scoreBarLabel">{value.toFixed(1)}/5</span>
    </div>
  );
}

export default function SurveyPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);

  const currentQuestions = useMemo(
    () => surveyQuestions.filter((q) => q.section === activeSection),
    [activeSection]
  );
  const currentIndex = SECTIONS.indexOf(activeSection);
  const isLast = currentIndex === SECTIONS.length - 1;
  const allAnswered = surveyQuestions.every((q) => answers[q.id] !== undefined);
  const currentComplete = currentQuestions.every((q) => answers[q.id] !== undefined);

  function handleAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleNext() {
    if (!isLast) setActiveSection(SECTIONS[currentIndex + 1]);
  }

  function handleBack() {
    if (currentIndex > 0) setActiveSection(SECTIONS[currentIndex - 1]);
  }

  const sectionAverages = useMemo(() => {
    return SECTIONS.map((section) => {
      const qs = surveyQuestions.filter((q) => q.section === section);
      const answered = qs.filter((q) => answers[q.id] !== undefined);
      if (!answered.length) return { section, avg: null };
      const avg = answered.reduce((sum, q) => sum + answers[q.id], 0) / answered.length;
      return { section, avg };
    });
  }, [answers]);

  const overallAvg = useMemo(() => {
    const answered = surveyQuestions.filter((q) => answers[q.id] !== undefined);
    if (!answered.length) return null;
    return answered.reduce((sum, q) => sum + answers[q.id], 0) / answered.length;
  }, [answers]);

  if (submitted) {
    const verdict = verdictFromAvg(overallAvg || 0);
    return (
      <main className="page">
        <div className="ambient ambient--one" />
        <div className="ambient ambient--two" />

        <Navbar />

        <section className="glass surveyResultsHero">
          <p className="eyebrow">Survey Complete</p>
          <h1>Your Sustainability Profile</h1>
          <div className="surveyVerdict" style={{ color: verdict.color }}>
            {verdict.label}
          </div>
          <p className="subtext">
            Based on your {surveyQuestions.length} responses — overall average score:{" "}
            <strong>{overallAvg?.toFixed(2)}/5.00</strong>
          </p>
        </section>

        <section className="surveySectionResults">
          {sectionAverages.map(({ section, avg }) => (
            <article key={section} className="glass sectionResultCard">
              <h3>{section}</h3>
              {avg !== null ? (
                <ScoreBar value={avg} />
              ) : (
                <p className="mutedLine">No answers recorded</p>
              )}
            </article>
          ))}
        </section>

        <section className="glass surveyBreakdown">
          <h2>Full Response Breakdown</h2>
          {SECTIONS.map((section) => (
            <div key={section} className="breakdownSection">
              <h3>{section}</h3>
              {surveyQuestions
                .filter((q) => q.section === section)
                .map((q) => {
                  const val = answers[q.id];
                  const scale = LIKERT_SCALE.find((s) => s.value === val);
                  return (
                    <div key={q.id} className="breakdownRow">
                      <p>{q.text}</p>
                      <span
                        className="breakdownBadge"
                        style={{
                          background:
                            val >= 4
                              ? "#d5f9e3"
                              : val === 3
                              ? "#f0f7cf"
                              : "#ffe5dc",
                          color:
                            val >= 4
                              ? "#087741"
                              : val === 3
                              ? "#5c7314"
                              : "#954126"
                        }}
                      >
                        {val} — {scale?.label || "N/A"}
                      </span>
                    </div>
                  );
                })}
            </div>
          ))}
        </section>

        <section className="glass ctaSection">
          <h2>Thank you for completing the survey.</h2>
          <p>
            Your responses contribute to USF research on student consumer behavior
            and environmental sustainability.{" "}
            <a href="https://env-blog.vercel.app/" target="_blank" rel="noreferrer">
              Read the full research paper.
            </a>
          </p>
          <div className="heroActions" style={{ justifyContent: "center" }}>
            <Link href="/marketplace" className="btnPrimary">Explore Marketplace</Link>
            <button
              type="button"
              className="btnGhost"
              onClick={() => { setAnswers({}); setSubmitted(false); setActiveSection(SECTIONS[0]); }}
            >
              Retake Survey
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <Navbar />

      <section className="glass marketHeader" data-reveal style={{ "--reveal-delay": "60ms" }}>
        <h1>{surveyMeta.title}</h1>
        <p className="mutedLine">{surveyMeta.subtitle}</p>
        <p>{surveyMeta.description}</p>
      </section>

      {/* Step progress */}
      <div className="surveyProgress glass" data-reveal style={{ "--reveal-delay": "80ms" }}>
        {SECTIONS.map((section, index) => {
          const qs = surveyQuestions.filter((q) => q.section === section);
          const done = qs.every((q) => answers[q.id] !== undefined);
          const active = section === activeSection;
          return (
            <button
              key={section}
              type="button"
              className={`surveyStep ${active ? "surveyStep--active" : ""} ${done ? "surveyStep--done" : ""}`}
              onClick={() => setActiveSection(section)}
            >
              <span className="surveyStepNum">{done ? "✓" : index + 1}</span>
              <span className="surveyStepLabel">{section}</span>
            </button>
          );
        })}
      </div>

      {/* Question block */}
      <section className="glass surveyBlock" data-reveal style={{ "--reveal-delay": "110ms" }}>
        <h2>{activeSection}</h2>
        <p className="mutedLine">
          Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).
        </p>

        <div className="questionList">
          {currentQuestions.map((q, qi) => {
            const answered = answers[q.id];
            return (
              <div key={q.id} className={`questionCard ${answered ? "questionCard--answered" : ""}`}>
                <p className="questionText">
                  <span className="questionNum">Q{surveyQuestions.indexOf(q) + 1}.</span> {q.text}
                </p>
                <div className="likertRow">
                  {LIKERT_SCALE.map((scale) => {
                    const selected = answers[q.id] === scale.value;
                    return (
                      <button
                        key={scale.value}
                        type="button"
                        onClick={() => handleAnswer(q.id, scale.value)}
                        className={`likertBtn ${selected ? "likertBtn--selected" : ""}`}
                        title={scale.label}
                      >
                        <span className="likertNum">{scale.value}</span>
                        <span className="likertLabel">{scale.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="surveyNav">
          {currentIndex > 0 && (
            <button type="button" className="btnGhost" onClick={handleBack}>
              ← Back
            </button>
          )}
          <span className="mutedLine" style={{ margin: "auto 0" }}>
            {Object.keys(answers).length} / {surveyQuestions.length} answered
          </span>
          {!isLast ? (
            <button
              type="button"
              className="btnPrimary"
              onClick={handleNext}
              disabled={!currentComplete}
            >
              Next Section →
            </button>
          ) : (
            <button
              type="button"
              className="btnPrimary"
              disabled={!allAnswered}
              onClick={() => setSubmitted(true)}
            >
              Submit Survey ✓
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
