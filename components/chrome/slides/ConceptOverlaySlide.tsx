import type { ConceptOverlayScene } from '@/lib/types';
export default function ConceptOverlaySlide({ scene }: { scene: ConceptOverlayScene }) {
  const kicker = scene.kicker ?? scene.subtitle ?? '';
  const headline = scene.title ?? '';
  const attribution = scene.kicker ? scene.subtitle : '';
  return (
    <div className="slide slide-concept">
      <div className="co-frame">
        {kicker && <div className="co-kicker">{kicker}</div>}
        {kicker && <div className="co-rule" />}
        <div className="co-headline">{headline}</div>
        {attribution && <div className="co-attribution">{attribution}</div>}
      </div>
    </div>
  );
}
