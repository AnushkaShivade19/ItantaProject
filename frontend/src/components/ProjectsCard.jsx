import { useState, useEffect } from "react";
import { FolderOpen, ClockCounterClockwise, Code, Desktop, CheckCircle, Warning, CircleDashed } from "@phosphor-icons/react";
import { fetchRuns } from "../lib/api";
import LivePreviewCard from "./LivePreviewCard";

export default function ProjectsCard() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchRuns()
      .then((data) => {
        if (mounted) {
          // Assuming data is an array of runs or data.runs
          const runsArray = Array.isArray(data) ? data : data?.runs || [];
          // Sort by newest first based on id or some timestamp if available. 
          // We'll reverse the array to show latest first if backend doesn't sort.
          setRuns(runsArray.reverse());
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to load projects");
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} weight="fill" className="text-emerald-500" />;
      case "error":
        return <Warning size={16} weight="fill" className="text-rose-500" />;
      default:
        return <CircleDashed size={16} className="text-amber-500 animate-spin-slow" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-ink">
        <p>Loading projects history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-rose-500 p-4 border border-rose-500/50 rounded-sm bg-rose-500/10">
        Error loading projects: {error}
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-ink glass-panel p-8">
        <FolderOpen size={48} className="mb-4 opacity-50" />
        <h3 className="text-lg font-heading text-primary-ink mb-2">No Projects Found</h3>
        <p className="text-sm">There are no historical runs available yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto h-full min-h-[calc(100vh-8rem)]">
      {/* Projects List sidebar */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="glass-panel p-5 flex flex-col h-full max-h-[800px]">
          <div className="flex items-center gap-2 mb-6 text-primary-ink border-b border-white/10 pb-4">
            <ClockCounterClockwise size={20} className="text-emerald-400" />
            <h2 className="font-heading text-lg font-medium tracking-wide">Project History</h2>
            <span className="ml-auto bg-white/5 px-2 py-0.5 rounded text-xs text-muted-ink font-mono">
              {runs.length} Runs
            </span>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-3">
            {runs.map((run) => (
              <button
                key={run.id}
                onClick={() => setSelectedRun(run)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  selectedRun?.id === run.id 
                    ? "bg-white/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                    : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/20"
                }`}
              >
                {selectedRun?.id === run.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="font-mono text-xs text-secondary-ink truncate pr-2">
                    {run.id.slice(0, 8)}...
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-mono">
                    {getStatusIcon(run.status)}
                    <span className={
                      run.status === "completed" ? "text-emerald-500" :
                      run.status === "error" ? "text-rose-500" : "text-amber-500"
                    }>{run.status}</span>
                  </div>
                </div>
                <div className="text-sm text-primary-ink line-clamp-2">
                  {run.spec_input || "No specification provided."}
                </div>
                
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-ink">
                  <div className="flex items-center gap-1">
                    <Code size={14} />
                    <span>{run.tasks?.length || 0} tasks</span>
                  </div>
                  {run.created_at && (
                    <div className="font-mono text-[10px]">
                      {new Date(run.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="w-full md:w-2/3 flex flex-col">
        {selectedRun ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-4">
                <h3 className="font-heading text-xl text-primary-ink flex items-center gap-2">
                   <Desktop className="text-emerald-400" />
                   Previewing Run: <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded text-secondary-ink">{selectedRun.id.slice(0,8)}</span>
                </h3>
             </div>
             {/* We wrap LivePreviewCard so it has some context. */}
             <div className="glass-panel overflow-hidden border border-white/10 shadow-2xl">
               <LivePreviewCard run={selectedRun} />
             </div>
          </div>
        ) : (
          <div className="glass-panel h-full flex flex-col items-center justify-center p-10 text-center border border-white/5 opacity-80">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
               <Desktop size={32} className="text-secondary-ink" />
             </div>
             <h2 className="text-2xl font-heading text-primary-ink mb-3">Select a Project</h2>
             <p className="text-secondary-ink max-w-sm">
               Choose a project from the history sidebar to view its live preview, source code, and run details.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
