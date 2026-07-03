'use client';
import { useEffect, useState, useCallback } from 'react';
import ChatGPTRoot    from './chatgpt/ChatGPTRoot';
import SlidesRoot     from './slides/SlidesRoot';
import GoogleDocsRoot from './google-docs/GoogleDocsRoot';
import type { AnyScene, ChromeId, WfId } from '@/lib/types';

function filterBlocksByState(scene: AnyScene, activeState: number): AnyScene {
  const s = scene as AnyScene & { blocks?: Array<{ appearsAt?: number }>; states?: unknown[] };
  if (!Array.isArray(s.blocks) || !Array.isArray(s.states) || s.states.length === 0) return scene;
  const visible = s.blocks.filter((b) => typeof b?.appearsAt !== 'number' || b.appearsAt <= activeState);
  if (visible.length === s.blocks.length) return scene;
  return { ...scene, blocks: visible } as AnyScene;
}

interface Props {
  chrome: ChromeId;
  wf: WfId;
  initialScene: number;
  onScenesLoaded: (scenes: AnyScene[]) => void;
  onIndexChange:  (i: number) => void;
  externalIndex?: number;   // controlled from parent
}

export default function SimulatorViewport({ chrome, wf, initialScene, onScenesLoaded, onIndexChange, externalIndex }: Props) {
  const [scenes,      setScenes]      = useState<AnyScene[]>([]);
  const [activeIndex, setActiveIndex] = useState(initialScene);
  const [activeState, setActiveState] = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // Sync external (sidebar) navigation into local state
  useEffect(() => {
    if (externalIndex !== undefined && externalIndex !== activeIndex) {
      setActiveIndex(externalIndex);
      setActiveState(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalIndex]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setActiveIndex(initialScene);
    setActiveState(0);
    fetch(`/data/${wf}/${chrome}-scenes.json`)
      .then((r) => { if (!r.ok) throw new Error(`${r.status} loading scene data`); return r.json() as Promise<AnyScene[]>; })
      .then((data) => { setScenes(data); onScenesLoaded(data); setLoading(false); })
      .catch((e: Error) => { setError(e.message); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome, wf]);

  const navigate = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(i, scenes.length - 1));
    setActiveIndex(clamped);
    setActiveState(0);
    onIndexChange(clamped);
  }, [scenes.length, onIndexChange]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-zinc-900">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading scenes…
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex items-center justify-center bg-zinc-900 text-red-400 text-sm">{error}</div>
  );

  if (!scenes.length) return (
    <div className="flex-1 flex items-center justify-center bg-zinc-900 text-zinc-500 text-sm">No scenes found.</div>
  );

  const scene = filterBlocksByState(scenes[activeIndex], activeState);

  return (
    <div className={`flex-1 overflow-auto relative${chrome === 'chatgpt' ? ' bg-white' : ''}`} data-chrome={chrome} data-wf={wf}>
      {chrome === 'chatgpt'     && <ChatGPTRoot    scene={scene as Parameters<typeof ChatGPTRoot>[0]['scene']} />}
      {chrome === 'slides'      && <SlidesRoot     scene={scene as Parameters<typeof SlidesRoot>[0]['scene']} />}
      {chrome === 'google-docs' && <GoogleDocsRoot scene={scene as Parameters<typeof GoogleDocsRoot>[0]['scene']} />}
    </div>
  );
}
