const OPTIONS = [
  { label: "Any time",     value: null },
  { label: "Under 15 min", value: 15   },
  { label: "Under 30 min", value: 30   },
  { label: "Under 1 hour", value: 60   },
];

export default function TimeFilter({ activeMax, onChange }) {
  return (
    <div className="time-filter">
      {OPTIONS.map((opt) => (
        <button
          key={opt.label}
          className={`time-filter-btn ${activeMax === opt.value ? "time-filter-btn--active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
