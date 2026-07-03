type IconPath = { tag: 'path' | 'rect' | 'circle'; props: Record<string, number | string> };

const icons: Record<string, IconPath[]> = {
  copy:    [{ tag: 'rect', props: { x:9, y:9, width:13, height:13, rx:2 } }, { tag: 'path', props: { d:'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' } }],
  like:    [{ tag: 'path', props: { d:'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z' } }, { tag: 'path', props: { d:'M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' } }],
  dislike: [{ tag: 'path', props: { d:'M10 15V9a3 3 0 0 1 3-3l4 9v11H5.72a2 2 0 0 1-2-1.7l-1.38-9a2 2 0 0 1 2-2.3H10z' } }, { tag: 'path', props: { d:'M17 22h3a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-3' } }],
  regen:   [{ tag: 'path', props: { d:'M1 4v6h6' } }, { tag: 'path', props: { d:'M23 20v-6h-6' } }, { tag: 'path', props: { d:'M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15' } }],
  more:    [{ tag: 'circle', props: { cx:12, cy:12, r:1 } }, { tag: 'circle', props: { cx:19, cy:12, r:1 } }, { tag: 'circle', props: { cx:5, cy:12, r:1 } }],
};

function Icon({ paths }: { paths: IconPath[] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      {paths.map((p, i) => {
        const Tag = p.tag;
        return <Tag key={i} {...(p.props as Record<string, unknown>)} />;
      })}
    </svg>
  );
}

export default function ActionBar() {
  return (
    <div className="action-bar">
      {Object.values(icons).map((paths, i) => (
        <div key={i} className="action-btn"><Icon paths={paths} /></div>
      ))}
    </div>
  );
}
