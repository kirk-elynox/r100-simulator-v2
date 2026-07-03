import { notFound } from 'next/navigation';
import { VALID_CHROMES, VALID_WFS, type ChromeId, type WfId } from '@/lib/types';
import SimulatorShell from '@/components/chrome/SimulatorShell';

interface Props { params: { chrome: string; wf: string }; searchParams: { scene?: string } }

export function generateStaticParams() {
  return VALID_CHROMES.flatMap((chrome) => VALID_WFS.map((wf) => ({ chrome, wf })));
}

export default function SimulatorPage({ params, searchParams }: Props) {
  const chrome = params.chrome as ChromeId;
  const wf     = params.wf     as WfId;
  if (!VALID_CHROMES.includes(chrome) || !VALID_WFS.includes(wf)) notFound();
  const initialScene = searchParams.scene ? parseInt(searchParams.scene, 10) : 0;
  return <SimulatorShell chrome={chrome} wf={wf} initialScene={initialScene} />;
}
