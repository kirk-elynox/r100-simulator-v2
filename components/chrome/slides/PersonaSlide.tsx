import type { PersonaScene } from '@/lib/types';
export default function PersonaSlide({ scene }: { scene: PersonaScene }) {
  const body = (scene as PersonaScene & { body?: { initials?: string; cards?: { label: string; text: string }[]; callout?: string } }).body ?? {};
  const cards = body.cards ?? [];
  return (
    <div className="slide slide-persona">
      <div className="pc-card">
        <div className="pc-header">
          <div className="pc-avatar">{body.initials ?? ''}</div>
          <div className="pc-header-text">
            <div className="pc-name">{scene.name ?? ''}</div>
            <div className="pc-role">{(scene as PersonaScene & { subtitle?: string }).subtitle ?? ''}</div>
          </div>
        </div>
        <div className="pc-grid">
          {cards.map((card, i) => (
            <div key={i} className="pc-field">
              <div className="pc-field-label">{card.label}</div>
              <div className="pc-field-text">{card.text}</div>
            </div>
          ))}
        </div>
        <div className="pc-callout">{body.callout ?? ''}</div>
      </div>
    </div>
  );
}
