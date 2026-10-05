'use client';

import React from 'react';
import { Transaction, PipelineStage } from '@/lib/types';
import { 
  Film, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Play, 
  Sliders, 
  FileVideo, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

interface ActiveProjectsTimelineProps {
  transactions: Transaction[];
  onUpdateStage?: (id: string, stage: PipelineStage) => void;
  onOpenAddModal?: () => void;
}

const STAGES: { key: PipelineStage; label: string; short: string }[] = [
  { key: 'Footage Ingest', label: 'Ingest & Proxies', short: 'Ingest' },
  { key: 'Rough Cut', label: 'Assembly / Rough Cut', short: 'Rough' },
  { key: 'Client Review', label: 'Client V1/V2 Review', short: 'Review' },
  { key: 'Color & Audio', label: 'Color Grade & Audio Mix', short: 'Grade/Mix' },
  { key: 'Master Delivered', label: 'Master 4K Delivery', short: 'Master' },
  { key: 'Settled', label: 'Settled & Paid', short: 'Settled' },
];

export const ActiveProjectsTimeline: React.FC<ActiveProjectsTimelineProps> = ({
  transactions,
  onUpdateStage,
  onOpenAddModal
}) => {
  // Only show income video projects that are in production or recently delivered
  const videoProjects = transactions.filter(t => t.type === 'income' && t.project_type);

  const getStageIndex = (stage?: PipelineStage) => {
    if (!stage) return 1;
    const idx = STAGES.findIndex(s => s.key === stage);
    return idx >= 0 ? idx : 1;
  };

  return (
    <div className="studio-panel rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Active Cut Sequence & Delivery Milestones
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {videoProjects.length} CUTS IN PIPELINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Track video edit stages from raw footage ingest to color grading and master export
            </p>
          </div>
        </div>

        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ New Cut Milestone</span>
          </button>
        )}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {videoProjects.map((project) => {
          const currentStageIndex = getStageIndex(project.pipeline_stage);
          const isSettled = project.status === 'Paid';
          const isPendingReview = project.pipeline_stage === 'Client Review';

          return (
            <div
              key={project.id}
              className="p-4 sm:p-5 rounded-xl studio-panel-elevated hover:border-cyan-500/30 transition-all duration-200 space-y-4 group"
            >
              {/* Project Top Line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </span>
                    {project.aspect_ratio && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-white/10">
                        {project.aspect_ratio}
                      </span>
                    )}
                    {project.project_type && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {project.project_type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">Client: {project.client_name || 'Independent'}</span>
                    <span>•</span>
                    {project.deliverable && (
                      <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
                        {project.deliverable}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount & Timecode Badges */}
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  {project.timecode && (
                    <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-white/5 font-timecode text-xs text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{project.timecode}</span>
                    </div>
                  )}

                  <div className="text-right">
                    <div className="font-timecode font-bold text-sm sm:text-base text-white">
                      {project.currency === 'USD' ? `$${project.amount}` : `₹${project.amount.toLocaleString('en-IN')}`}
                    </div>
                    <div className="text-[11px] text-slate-400 font-timecode">
                      ≈ ₹{project.inr_amount.toLocaleString('en-IN')} INR
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Pipeline Track */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
                  {STAGES.map((stage, idx) => {
                    const isPassed = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isFuture = idx > currentStageIndex;

                    let bgClass = 'bg-slate-900/60 border-white/5 text-slate-500';
                    let dotColor = 'bg-slate-700';

                    if (isPassed) {
                      bgClass = 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400';
                      dotColor = 'bg-emerald-500';
                    } else if (isCurrent) {
                      if (stage.key === 'Client Review') {
                        bgClass = 'bg-amber-950/40 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30';
                        dotColor = 'bg-amber-400 animate-pulse';
                      } else {
                        bgClass = 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/30';
                        dotColor = 'bg-cyan-400 animate-pulse';
                      }
                    }

                    return (
                      <button
                        key={stage.key}
                        onClick={() => onUpdateStage && onUpdateStage(project.id, stage.key)}
                        title={`Click to set stage to: ${stage.label}`}
                        className={`p-2 rounded-lg border text-left transition-all ${bgClass} hover:brightness-125 cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                            Step 0{idx + 1}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                        </div>
                        <div className="font-semibold text-xs truncate">
                          {stage.short}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes & Hours */}
              {(project.notes || project.hours_logged) && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5 truncate max-w-xl">
                    <span className="text-slate-500 font-mono text-[11px]">EDIT LOG:</span>
                    <span className="truncate text-slate-300">{project.notes}</span>
                  </div>
                  {project.hours_logged && (
                    <div className="font-mono text-[11px] text-cyan-400 shrink-0">
                      ⏱ {project.hours_logged} hrs logged ({Math.round(project.inr_amount / project.hours_logged).toLocaleString('en-IN')} ₹/hr)
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
