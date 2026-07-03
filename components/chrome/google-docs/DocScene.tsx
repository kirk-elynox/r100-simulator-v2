import type { DocScene as DocSceneType, WorkbookBlock } from '@/lib/types';

// ── Marker chip icon (SVG inline) ────────────────────────────────────────────
function MarkerChipIcon({ kind }: { kind: string }) {
  const common = { viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true, focusable: false };
  switch (kind) {
    case 'flag':
    case 'complete':
      return <svg {...common}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1={4} y1={22} x2={4} y2={15} /></svg>;
    case 'prompt':
      return <svg {...common}><rect x={4} y={4} width={16} height={16} rx={2} /><rect x={9} y={9} width={6} height={6} /><line x1={9} y1={2} x2={9} y2={4} /><line x1={15} y1={2} x2={15} y2={4} /><line x1={9} y1={20} x2={9} y2={22} /><line x1={15} y1={20} x2={15} y2={22} /></svg>;
    case 'save':
      return <svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
    case 'extend':
      return <svg {...common}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /></svg>;
    case 'info':
      return <svg {...common}><circle cx={12} cy={12} r={10} /><line x1={12} y1={16} x2={12} y2={12} /><line x1={12} y1={8} x2={12.01} y2={8} /></svg>;
    case 'warn':
      return <svg {...common}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2={12.01} y2={17} /></svg>;
    default: return null;
  }
}

// ── Block renderers ───────────────────────────────────────────────────────────
function TextBlock({ block }: { block: WorkbookBlock }) {
  const lvl = block.headingLevel;
  const text = block.text as string | undefined;
  return (
    <div className="section-block">
      {block.heading && lvl === 3 ? <h3>{block.heading}</h3>
        : block.heading && lvl === 4 ? <h4>{block.heading}</h4>
        : block.heading ? <h2>{block.heading}</h2>
        : null}
      {text && <p>{text}</p>}
    </div>
  );
}

function H4TextBlock({ block }: { block: WorkbookBlock }) {
  const text = block.text as string | undefined;
  return <div className="section-block"><h4>{block.heading}</h4>{text && <p>{text}</p>}</div>;
}

function CalloutBlock({ block }: { block: WorkbookBlock }) {
  return (
    <div className={`callout-box ${block.variant ?? ''}`}>
      {block.title && <strong>{block.title} </strong>}
      {block.body as string}
    </div>
  );
}

function CompactBlock({ block }: { block: WorkbookBlock }) {
  return <p className="wb-compact">{block.label && <strong>{block.label} </strong>}{block.text as string}</p>;
}

function MarkerBlock({ block }: { block: WorkbookBlock }) {
  const kind = block.kind as string;
  return (
    <p className="wb-marker">
      <span className={`wb-marker-chip marker-${kind}`}>
        {block.emoji ? block.emoji as string : <MarkerChipIcon kind={kind} />}
      </span>
      <span className="wb-marker-body">
        {block.label && <strong>{block.label} </strong>}
        {block.text as string}
      </span>
    </p>
  );
}

function PromptBoxBlock({ block }: { block: WorkbookBlock }) {
  const info = block.info as string | undefined;
  return (
    <div className="wb-prompt-box">
      <div className="prompt-header">🤖 {block.heading}</div>
      {info && <div className="prompt-info">ℹ️ {info}</div>}
      <div className="prompt-text">{block.text as string}</div>
    </div>
  );
}

function DeliverablesBlock({ block }: { block: WorkbookBlock }) {
  const docs = (block.documents as { code?: string; name?: string; purpose?: string }[]) ?? [];
  return (
    <div className="section-block wb-deliverables">
      {block.heading && <h3>{block.heading}</h3>}
      <ul>{docs.map((doc, i) => <li key={doc.code ?? i}><strong>{doc.code}: {doc.name}</strong> — {doc.purpose}</li>)}</ul>
    </div>
  );
}

function NextBlock({ block }: { block: WorkbookBlock }) {
  return <div className="section-block wb-next"><h2>{block.heading}</h2><p>{block.content as string}</p></div>;
}

function CardGridBlock({ block }: { block: WorkbookBlock }) {
  const cards = (block.cards as { title: string; body: string; accent?: boolean }[]) ?? [];
  return (
    <div className="card-grid" style={block.columns ? { gridTemplateColumns: `repeat(${block.columns as number}, minmax(0, 1fr))` } : undefined}>
      {cards.map((card, i) => (
        <div key={i} className={`card${card.accent ? ' accent' : ''}`}>
          <h3>{card.title}</h3><p>{card.body}</p>
        </div>
      ))}
    </div>
  );
}

function OutcomesBlock({ block }: { block: WorkbookBlock }) {
  const items = (block.items as { label?: string; text?: string }[]) ?? [];
  return (
    <div className="section-block">
      {block.heading && <h3>{block.heading}</h3>}
      <ul>{items.map((it, i) => <li key={i}>{it.label && <strong>{it.label} </strong>}{it.text}</li>)}</ul>
    </div>
  );
}

const BLOCK_RENDERERS: Record<string, React.ComponentType<{ block: WorkbookBlock }>> = {
  'text':         TextBlock,
  'h4-text':      H4TextBlock,
  'callout':      CalloutBlock,
  'compact':      CompactBlock,
  'marker':       MarkerBlock,
  'outcomes':     OutcomesBlock,
  'prompt-box':   PromptBoxBlock,
  'deliverables': DeliverablesBlock,
  'next':         NextBlock,
  'card-grid':    CardGridBlock,
};

function Block({ block, index }: { block: WorkbookBlock; index: number }) {
  const Renderer = BLOCK_RENDERERS[block?.type ?? ''];
  if (!Renderer)
    return <div style={{ padding: 'var(--space-3)', border: '1px solid var(--gd-callout-warning)', margin: 'var(--space-3) 0' }}>Unknown block type: {block?.type}</div>;
  return <Renderer block={block} key={index} />;
}

// ── Doc chrome surface ────────────────────────────────────────────────────────
const MENU_ITEMS = ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'];

function DocsToolbar() {
  return (
    <div className="docs-toolbar">
      <div className="docs-menu">
        {MENU_ITEMS.map((it) => <div key={it} className="docs-menu-item">{it}</div>)}
      </div>
    </div>
  );
}

interface Props { scene: DocSceneType }

export default function DocScene({ scene }: Props) {
  if (!scene) return <div>Loading…</div>;
  const header = scene.header ?? { title: '' };
  const blocks = scene.blocks ?? [];

  return (
    <div className="workbook-container">
      <DocsToolbar />
      <div className="breadcrumb-bar">{header.breadcrumb ?? ''}</div>
      {header.badge?.text && (
        <div className={`badge-pill ${header.badge.color === 'teal' ? 'teal' : 'purple'}`}>
          {header.badge.text}
        </div>
      )}
      <div className="docs-content">
        <div className="docs-page">
          {header.title && <h1>{header.title}</h1>}
          {blocks.map((b, i) => <Block key={(b as WorkbookBlock & { id?: string }).id ?? i} block={b} index={i} />)}
        </div>
      </div>
    </div>
  );
}
