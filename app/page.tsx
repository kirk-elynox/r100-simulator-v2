import Link from 'next/link';
import { MessageSquare, Presentation, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { CHROME_META, WF_META, type ChromeId, type WfId, VALID_CHROMES, VALID_WFS } from '@/lib/types';

const CHROME_ICONS: Record<ChromeId, React.ComponentType<{ className?: string }>> = {
  'chatgpt':     MessageSquare,
  'slides':      Presentation,
  'google-docs': BookOpen,
};

const CHROME_ACCENT: Record<ChromeId, string> = {
  'chatgpt':     'group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/10',
  'slides':      'group-hover:border-violet-500/60 group-hover:shadow-violet-500/10',
  'google-docs': 'group-hover:border-blue-500/60 group-hover:shadow-blue-500/10',
};

const CHROME_ICON_COLOR: Record<ChromeId, string> = {
  'chatgpt':     'bg-emerald-500/15 text-emerald-400',
  'slides':      'bg-violet-500/15 text-violet-400',
  'google-docs': 'bg-blue-500/15 text-blue-400',
};

export default function HomePage() {
  const defaultWf: WfId = 'wf1';

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-8 py-5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-electric-violet/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-electric-violet-dark" />
          </div>
          <span className="font-semibold text-zinc-100 tracking-tight">Rule of 100</span>
          <span className="text-zinc-600 text-sm">/ Simulator</span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 pt-16 pb-12 max-w-4xl">
        <p className="text-xs font-semibold tracking-widest text-electric-violet-dark uppercase mb-4">Interactive Simulator</p>
        <h1 className="text-4xl font-bold text-zinc-50 leading-tight mb-4">
          Pick a chrome.<br />Pick a workflow.
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl">
          Step through ChatGPT conversations, slide decks, and workbook pages exactly as they appear in the course.
        </p>
      </section>

      {/* Chrome cards */}
      <section className="px-8 pb-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
        {VALID_CHROMES.map((chrome) => {
          const meta   = CHROME_META[chrome];
          const Icon   = CHROME_ICONS[chrome];
          const accent = CHROME_ACCENT[chrome];
          const iconCl = CHROME_ICON_COLOR[chrome];
          return (
            <Link
              key={chrome}
              href={`/simulator/${chrome}/${defaultWf}`}
              className={`group relative flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-200 hover:bg-zinc-900 hover:shadow-lg ${accent}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconCl}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-100 mb-1">{meta.label}</h2>
                <p className="text-sm text-zinc-500">{meta.description}</p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">
                Open simulator <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Workflow quick-jump */}
      <section className="px-8 pb-20 max-w-4xl">
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-4">Quick jump</p>
        <div className="flex flex-wrap gap-2">
          {VALID_WFS.map((wf) => (
            <Link
              key={wf}
              href={`/simulator/chatgpt/${wf}`}
              className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
            >
              {WF_META[wf].short} — {WF_META[wf].label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
