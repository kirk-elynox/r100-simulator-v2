import type { TitleScene } from '@/lib/types';
export default function TitleSlide({ scene }: { scene: TitleScene }) {
  const body = scene.body ?? {};
  return (
    <div className="slide slide-title">
      <div className="sc-label">{body.label ?? ''}</div>
      <div className="sc-title">{scene.title ?? ''}</div>
      <div className="sc-subtitle">{scene.subtitle ?? ''}</div>
      <div className="sc-module">
        <div className="sc-module-line" />
        <span>{body.moduleLabel ?? ''}</span>
        <div className="sc-module-line" />
      </div>
    </div>
  );
}
