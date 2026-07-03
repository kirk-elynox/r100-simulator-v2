'use client';
import { useState, useCallback } from 'react';
import TopNav            from '@/components/nav/TopNav';
import Sidebar           from '@/components/nav/Sidebar';
import SimulatorViewport from '@/components/chrome/SimulatorViewport';
import type { ChromeId, WfId, AnyScene } from '@/lib/types';

interface Props { chrome: ChromeId; wf: WfId; initialScene: number }

export default function SimulatorShell({ chrome, wf, initialScene }: Props) {
  const [scenes,      setScenes]      = useState<AnyScene[]>([]);
  const [activeIndex, setActiveIndex] = useState(initialScene);

  const handleScenesLoaded = useCallback((s: AnyScene[]) => { setScenes(s); setActiveIndex(0); }, []);
  const handleIndexChange  = useCallback((i: number) => setActiveIndex(i), []);

  return (
    <>
      <TopNav chrome={chrome} wf={wf} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          chrome={chrome}
          wf={wf}
          scenes={scenes}
          activeIndex={activeIndex}
          onNavigate={handleIndexChange}
        />
        <SimulatorViewport
          chrome={chrome}
          wf={wf}
          initialScene={initialScene}
          onScenesLoaded={handleScenesLoaded}
          onIndexChange={handleIndexChange}
          externalIndex={activeIndex}
        />
      </div>
    </>
  );
}
