'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { VALID_WFS, WF_META, type ChromeId, type WfId, type AnyScene } from '@/lib/types';

interface Props {
  chrome: ChromeId;
  wf: WfId;
  scenes: AnyScene[];
  activeIndex: number;
  onNavigate: (i: number) => void;
}

export default function Sidebar({ chrome, wf, scenes, activeIndex, onNavigate }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  // Keyboard: S toggles sidebar, arrows navigate
  const goto = useCallback(
    (i: number) => onNavigate(Math.max(0, Math.min(i, scenes.length - 1))),
    [onNavigate, scenes.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); setCollapsed((p) => !p); }
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goto(activeIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goto(activeIndex - 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, goto]);

  const activeScene = scenes[activeIndex];

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-200 shrink-0',
        collapsed ? 'w-12' : 'w-[260px]'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <PanelLeft className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
      </button>

      {!collapsed && (
        <>
          {/* Workflow tabs */}
          <div className="p-3 border-b border-zinc-800">
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest px-1 mb-2">Workflow</p>
            <div className="flex flex-col gap-0.5">
              {VALID_WFS.map((w) => {
                const isActive = w === wf;
                return (
                  <Link
                    key={w}
                    href={`/simulator/${chrome}/${w}`}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors',
                      isActive
                        ? 'bg-zinc-800 text-zinc-100 font-medium'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    )}
                  >
                    <span className={cn('text-[10px] font-mono font-bold tabular-nums', isActive ? 'text-electric-violet-dark' : 'text-zinc-700')}>
                      {WF_META[w].short}
                    </span>
                    <span className="truncate">{WF_META[w].label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Scene list */}
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest px-1 mb-2">
              Scenes
              <span className="ml-1 font-normal normal-case text-zinc-700">({scenes.length})</span>
            </p>
            <div className="flex flex-col gap-0.5">
              {scenes.map((scene, i) => {
                const isActive = i === activeIndex;
                const label    = scene.label ?? scene.id ?? `Scene ${i + 1}`;
                return (
                  <button
                    key={scene.id ?? i}
                    onClick={() => onNavigate(i)}
                    className={cn(
                      'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-left transition-colors',
                      isActive
                        ? 'bg-electric-violet/15 text-electric-violet-dark font-medium border border-electric-violet/20'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    )}
                  >
                    <span className={cn('text-[10px] tabular-nums shrink-0 w-5 text-right', isActive ? 'text-electric-violet-dark' : 'text-zinc-700')}>
                      {i + 1}
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav controls */}
          <div className="border-t border-zinc-800 p-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goto(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goto(activeIndex + 1)}
              disabled={activeIndex === scenes.length - 1}
              className="flex-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-zinc-600 shrink-0 tabular-nums">{activeIndex + 1}/{scenes.length}</span>
          </div>
        </>
      )}

      {/* Collapsed state — just scene counter + arrows */}
      {collapsed && (
        <div className="flex flex-col items-center gap-3 pt-4 px-1">
          <span className="text-[10px] text-zinc-600 tabular-nums font-mono">{activeIndex + 1}/{scenes.length}</span>
          <button onClick={() => goto(activeIndex - 1)} disabled={activeIndex === 0}
            className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => goto(activeIndex + 1)} disabled={activeIndex === scenes.length - 1}
            className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
