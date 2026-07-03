import { ICONS, IconInfo } from './icons';
import type { MarkerGuideScene } from '@/lib/types';
interface MarkerGuideScene2 extends MarkerGuideScene { title?: string; markers?: { icon?: string; title?: string; desc?: string }[] }
export default function MarkerGuideSlide({ scene }: { scene: MarkerGuideScene2 }) {
  const markers = scene.markers ?? [];
  return (
    <div className="slide slide-markers">
      <div className="mg-card">
        <div className="mg-title">{scene.title ?? ''}</div>
        {markers.map((marker, i) => {
          const Icon = (marker.icon && ICONS[marker.icon]) || IconInfo;
          return (
            <div key={i} className="mg-row">
              <div className="mg-icon"><Icon /></div>
              <div className="mg-content">
                <div className="mg-label">{marker.title ?? ''}</div>
                <div className="mg-desc">{marker.desc ?? ''}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
