'use client';
import TitleSlide          from './TitleSlide';
import PersonaSlide        from './PersonaSlide';
import BrandedGraphicSlide from './BrandedGraphicSlide';
import MarkerGuideSlide    from './MarkerGuideSlide';
import ClosingSlide        from './ClosingSlide';
import ConceptOverlaySlide from './ConceptOverlaySlide';
import type { SlideScene } from '@/lib/types';

const LAYOUTS: Record<string, React.ComponentType<{ scene: SlideScene }>> = {
  'title':           TitleSlide          as React.ComponentType<{ scene: SlideScene }>,
  'persona':         PersonaSlide        as React.ComponentType<{ scene: SlideScene }>,
  'branded-graphic': BrandedGraphicSlide as React.ComponentType<{ scene: SlideScene }>,
  'marker-guide':    MarkerGuideSlide    as React.ComponentType<{ scene: SlideScene }>,
  'closing':         ClosingSlide        as React.ComponentType<{ scene: SlideScene }>,
  'concept-overlay': ConceptOverlaySlide as React.ComponentType<{ scene: SlideScene }>,
};

export default function SlidesRoot({ scene }: { scene: SlideScene }) {
  const Layout = LAYOUTS[scene.layout];
  if (!Layout) return <div className="slide flex items-center justify-center text-[var(--muted)]">Unknown layout: {scene.layout}</div>;
  return <Layout scene={scene} />;
}
