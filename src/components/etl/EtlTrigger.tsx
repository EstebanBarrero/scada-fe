import { useEtl } from "../../hooks/useEtl";
import type { ETLRunResponse } from "../../types/metrics";

export default function EtlTrigger() {
  const { mutate, isPending, data, error, isSuccess } = useEtl();

  const result = data as ETLRunResponse | undefined;

  const statusColor = {
    success: "text-green-400",
    partial: "text-yellow-400",
    failed: "text-red-400",
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white">ETL Pipeline</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Ingest → Clean → Normalize → Load
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => mutate()}
          disabled={isPending}
        >
          {isPending ? "Running…" : "Run ETL"}
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 rounded p-3 text-red-300 text-sm">
          {String(error)}
        </div>
      )}

      {isSuccess && result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Status:</span>
            <span
              className={`text-sm font-bold uppercase ${statusColor[result.status]}`}
            >
              {result.status}
            </span>
            <span className="text-xs text-gray-500 ml-auto">
              {result.duration_seconds}s
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { label: "Raw", value: result.raw_count },
              { label: "Loaded", value: result.loaded_count },
              { label: "Dupes Removed", value: result.duplicate_count },
              { label: "Rejected", value: result.rejected_count },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-800 rounded p-2">
                <div className="text-lg font-bold text-white">
                  {value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {result.errors.length > 0 && (
            <div className="bg-yellow-950 border border-yellow-800 rounded p-3">
              <p className="text-xs font-semibold text-yellow-400 mb-1">
                Warnings ({result.errors.length})
              </p>
              <ul className="text-xs text-yellow-300 space-y-0.5">
                {result.errors.map((e, i) => (
                  <li key={i}>• {e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
