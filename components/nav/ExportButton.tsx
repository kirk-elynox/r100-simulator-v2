'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, FileText, Images, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { exportWorkflowAsImages, exportWorkflowAsPdf, type ExportProgress } from '@/lib/export';
import type { WfId } from '@/lib/types';

interface Props { wf: WfId }

export default function ExportButton({ wf }: Props) {
  const [open, setOpen]         = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const busy = progress !== null;

  const run = async (fn: (wf: WfId, onProgress: (p: ExportProgress) => void) => Promise<void>) => {
    setOpen(false);
    setProgress({ current: 0, total: 0, label: 'Starting…' });
    try {
      await fn(wf, setProgress);
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((p) => !p)}
        disabled={busy}
        className="gap-1.5"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        {busy
          ? progress!.total
            ? `Exporting ${progress!.current}/${progress!.total}…`
            : 'Preparing…'
          : 'Export'}
      </Button>

      {open && !busy && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-md border border-zinc-800 bg-zinc-950 shadow-lg z-30 overflow-hidden">
          <button
            onClick={() => run(exportWorkflowAsPdf)}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors'
            )}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span>
              Download as PDF
              <span className="block text-[10px] text-zinc-600">All chromes &middot; this workflow</span>
            </span>
          </button>
          <button
            onClick={() => run(exportWorkflowAsImages)}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors border-t border-zinc-900'
            )}
          >
            <Images className="h-3.5 w-3.5 shrink-0" />
            <span>
              Download as images (.zip)
              <span className="block text-[10px] text-zinc-600">All chromes &middot; this workflow</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
