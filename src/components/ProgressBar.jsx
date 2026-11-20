export default function ProgressBar({ value = 0, label, compact = false }) {
  return (
    <div className={`progress-block ${compact ? 'compact' : ''}`}>
      {label && <div className="progress-label"><span>{label}</span><strong>{value}%</strong></div>}
      <div className="progress-track" role="progressbar" aria-label={label || 'Progress'} aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}>
        <i style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
