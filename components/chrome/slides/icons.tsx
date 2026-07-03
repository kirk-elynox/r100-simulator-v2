import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;
const base: IconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

export const IconCheckbox = (p: IconProps) => <svg {...base} {...p}><rect x={3} y={3} width={18} height={18} rx={2} /><polyline points="9 12 12 15 15 9" /></svg>;
export const IconClipboard = (p: IconProps) => <svg {...base} {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x={8} y={2} width={8} height={4} rx={1} /></svg>;
export const IconSave = (p: IconProps) => <svg {...base} {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
export const IconStar = (p: IconProps) => <svg {...base} {...p}><polygon points="12 2 15.09 10.26 24 10.26 17.55 16.74 19.64 25 12 19.52 4.36 25 6.45 16.74 0 10.26 8.91 10.26 12 2" /></svg>;
export const IconInfo = (p: IconProps) => <svg {...base} {...p}><circle cx={12} cy={12} r={10} /><line x1={12} y1={16} x2={12} y2={12} /><line x1={12} y1={8} x2={12.01} y2={8} /></svg>;
export const IconWarning = (p: IconProps) => <svg {...base} {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2={12.01} y2={17} /></svg>;

type IconComponent = (p: IconProps) => JSX.Element;
export const ICONS: Record<string, IconComponent> = {
  checkbox: IconCheckbox, clipboard: IconClipboard, save: IconSave, star: IconStar, info: IconInfo, warning: IconWarning,
  flag: IconCheckbox, prompt: IconClipboard, extend: IconStar, warn: IconWarning,
};
