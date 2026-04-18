import type { AlarmFilters, Criticality } from "../../types/alarm";

interface Props {
  filters: AlarmFilters;
  onChange: (f: AlarmFilters) => void;
}

const CRITICALITY_OPTIONS: Criticality[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "UNKNOWN",
];

export default function AlarmFiltersPanel({ filters, onChange }: Props) {
  const update = (patch: Partial<AlarmFilters>) =>
    onChange({ ...filters, ...patch, page: 1 });

  const toggleCriticality = (c: Criticality) => {
    const current = filters.criticality ?? [];
    const next = current.includes(c)
      ? current.filter((x) => x !== c)
      : [...current, c];
    update({ criticality: next.length > 0 ? next : undefined });
  };

  return (
    <div className="card space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Filters</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Start Date</label>
          <input
            type="datetime-local"
            className="input"
            value={filters.start_date?.slice(0, 16) ?? ""}
            onChange={(e) =>
              update({
                start_date: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined,
              })
            }
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">End Date</label>
          <input
            type="datetime-local"
            className="input"
            value={filters.end_date?.slice(0, 16) ?? ""}
            onChange={(e) =>
              update({
                end_date: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined,
              })
            }
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Tag</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. FIC-101"
            value={filters.tag ?? ""}
            onChange={(e) =>
              update({ tag: e.target.value || undefined })
            }
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">Criticality</label>
        <div className="flex flex-wrap gap-2">
          {CRITICALITY_OPTIONS.map((c) => {
            const selected = filters.criticality?.includes(c);
            const cls = {
              CRITICAL: "border-red-600 bg-red-600",
              HIGH: "border-orange-600 bg-orange-600",
              MEDIUM: "border-yellow-600 bg-yellow-600",
              LOW: "border-green-600 bg-green-600",
              UNKNOWN: "border-gray-600 bg-gray-600",
            }[c];
            return (
              <button
                key={c}
                onClick={() => toggleCriticality(c)}
                className={`text-xs px-3 py-1 rounded border font-semibold transition-all ${
                  selected
                    ? `${cls} text-white`
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="btn-secondary"
          onClick={() => onChange({ page: 1, size: filters.size })}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
