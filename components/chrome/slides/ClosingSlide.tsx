import type { ClosingScene } from '@/lib/types';
interface ClosingBody { label?: string }
export default function ClosingSlide({ scene }: { scene: ClosingScene }) {
  const body = (scene.body as ClosingBody) ?? {};
  return (
    <div className="slide slide-closing">
      <div className="cc-label">{body.label ?? ''}</div>
      <div className="cc-title">{scene.title ?? ''}</div>
      <div className="cc-subtitle">{scene.subtitle ?? ''}</div>
      <div className="cc-arrow">→</div>
    </div>
  );
}
