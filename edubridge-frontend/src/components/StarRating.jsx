import React from "react";

/**
 * Controlled star rating 1..5
 * props: value (number), onChange(newVal), size (px, optional)
 */
export default function StarRating({
  value = 0,
  onChange,
  size = 22,
  readOnly = false,
}) {
  const set = (n) => {
    if (!readOnly && onChange) onChange(n);
  };

  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= Math.round(value);
        return (
          <i
            key={idx}
            className={filled ? "bi bi-star-fill" : "bi bi-star"}
            style={{
              fontSize: size,
              cursor: readOnly ? "default" : "pointer",
              marginRight: 4,
            }}
            onClick={() => set(idx)}
            title={`${idx} star${idx > 1 ? "s" : ""}`}
          />
        );
      })}
    </div>
  );
}
