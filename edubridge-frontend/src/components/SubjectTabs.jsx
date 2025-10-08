// src/components/SubjectTabs.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SUBJECTS = [
  { key: "", label: "All" },
  { key: "it", label: "IT" },
  { key: "english", label: "English" },
  { key: "maths", label: "Math" },
];

export default function SubjectTabs() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const active = (params.get("subject") || "").toLowerCase();

  const onClick = (key) => {
    const next = new URLSearchParams(params);
    if (key) next.set("subject", key);
    else next.delete("subject");
    navigate(`/courses?${next.toString()}`);
  };

  return (
    <div className="d-flex gap-2 flex-wrap mb-3">
      {SUBJECTS.map((s) => {
        const isActive = (active || "") === s.key;
        return (
          <button
            key={s.key}
            className={`btn btn-sm ${
              isActive ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => onClick(s.key)}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
