'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Presentation, BookOpen, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CHROME_META, VALID_CHROMES, type ChromeId, type WfId } from '@/lib/types';
import ExportButton from './ExportButton';

const ICONS: Record<ChromeId, React.ComponentType<{ className?: string }>> = {
  'chatgpt':     MessageSquare,
  'slides':      Presentation,
  'google-docs': BookOpen,
};

interface Props { chrome: ChromeId; wf: WfId }

export default function TopNav({ chrome, wf }: Props) {
  const pathname = usePathname();

  return (
    <header className="h-12 flex items-center px-4 border-b border-zinc-800 bg-zinc-950 shrink-0 z-20">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-6 group">
        <div className="h-6 w-6 rounded-md bg-electric-violet/20 flex items-center justify-center group-hover:bg-electric-violet/30 transition-colors">
          <Zap className="h-3.5 w-3.5 text-electric-violet-dark" />
        </div>
        <span className="text-sm font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors hidden sm:block">
          R100
        </span>
      </Link>

      {/* Divider */}
      <div className="h-5 w-px bg-zinc-800 mr-4 hidden sm:block" />

      {/* Chrome switcher */}
      <nav className="flex items-center gap-1">
        {VALID_CHROMES.map((c) => {
          const Icon     = ICONS[c];
          const isActive = c === chrome;
          return (
            <Link
              key={c}
              href={`/simulator/${c}/${wf}`}
              className={cn(
                'flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium transition-colors',
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:block">{CHROME_META[c].label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right slot */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-zinc-600 hidden md:block">Press S to hide sidebar · ←→ to navigate</span>
        <ExportButton wf={wf} />
      </div>
    </header>
  );
}
