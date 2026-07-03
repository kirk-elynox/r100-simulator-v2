import type { BrandedGraphicScene } from '@/lib/types';
interface Body { numbers?: { value: string; label: string }[]; levels?: { label: string; title: string; text: string }[]; footer?: string }
export default function BrandedGraphicSlide({ scene }: { scene: BrandedGraphicScene }) {
  const body = (scene.body as Body) ?? {};
  const numbers = body.numbers ?? [];
  const levels  = body.levels  ?? [];
  return (
    <div className="slide slide-branded">
      <div className="bg-numbers">
        {numbers.map((num, i) => (
          <span key={i}>
            <div className="bg-number-card">
              <div className="bg-number">{num.value}</div>
              <div className="bg-number-label">{num.label}</div>
            </div>
            {i < numbers.length - 1 && <div className="bg-arrow">→</div>}
          </span>
        ))}
      </div>
      <div className="bg-levels">
        {levels.map((level, i) => (
          <div key={i} className="bg-level">
            <div className="bg-level-tag">{level.label}</div>
            <div className="bg-level-title">{level.title}</div>
            <div className="bg-level-text">{level.text}</div>
          </div>
        ))}
      </div>
      <div className="bg-footer">{body.footer ?? ''}</div>
    </div>
  );
}
