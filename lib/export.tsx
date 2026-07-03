'use client';
import { createRoot } from 'react-dom/client';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import ChatGPTRoot from '@/components/chrome/chatgpt/ChatGPTRoot';
import SlidesRoot from '@/components/chrome/slides/SlidesRoot';
import GoogleDocsRoot from '@/components/chrome/google-docs/GoogleDocsRoot';
import { VALID_CHROMES, type AnyScene, type ChromeId, type WfId } from './types';

const CHROME_ROOTS: Record<ChromeId, React.ComponentType<{ scene: AnyScene }>> = {
  chatgpt:       ChatGPTRoot as React.ComponentType<{ scene: AnyScene }>,
  slides:        SlidesRoot as React.ComponentType<{ scene: AnyScene }>,
  'google-docs': GoogleDocsRoot as React.ComponentType<{ scene: AnyScene }>,
};

const CHROME_SIZE: Record<ChromeId, { width: number; height: number }> = {
  chatgpt:       { width: 1440, height: 900 },
  slides:        { width: 1920, height: 1080 },
  'google-docs': { width: 1440, height: 1000 },
};

async function fetchScenes(chrome: ChromeId, wf: WfId): Promise<AnyScene[]> {
  const res = await fetch(`/data/${wf}/${chrome}-scenes.json`);
  if (!res.ok) return [];
  return res.json() as Promise<AnyScene[]>;
}

async function captureScene(chrome: ChromeId, scene: AnyScene): Promise<string> {
  const { width, height } = CHROME_SIZE[chrome];

  // Clip via a zero-size wrapper instead of pushing the node far off-screen —
  // html-to-image renders blank output for elements positioned thousands of
  // pixels outside the viewport.
  const clip = document.createElement('div');
  clip.style.position = 'fixed';
  clip.style.top = '0';
  clip.style.left = '0';
  clip.style.width = '0';
  clip.style.height = '0';
  clip.style.overflow = 'hidden';
  clip.style.pointerEvents = 'none';

  const captureClass = `export-capture-${chrome}`;
  const container = document.createElement('div');
  container.className = captureClass;
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.overflow = 'hidden';
  clip.appendChild(container);
  document.body.appendChild(clip);

  // `.app` rules in chatgpt.css / google-docs.css use `height: 100vh`, which
  // resolves against the real browser viewport, not this detached container —
  // override it so captured content is sized to our target dimensions instead.
  const styleOverride = document.createElement('style');
  styleOverride.textContent = `.${captureClass} .app { height: 100% !important; width: 100% !important; }`;
  clip.appendChild(styleOverride);

  const Root = CHROME_ROOTS[chrome];
  const root = createRoot(container);
  root.render(<Root scene={scene} />);

  await new Promise((r) => setTimeout(r, 150));
  await document.fonts?.ready;

  try {
    return await toJpeg(container, { width, height, pixelRatio: 1.5, quality: 0.9, backgroundColor: '#ffffff' });
  } finally {
    root.unmount();
    clip.remove();
  }
}

export interface ExportProgress { current: number; total: number; label: string }

interface CapturedImage {
  chrome: ChromeId;
  label: string;
  dataUrl: string;
  width: number;
  height: number;
}

async function collectWorkflowImages(wf: WfId, onProgress?: (p: ExportProgress) => void): Promise<CapturedImage[]> {
  const perChrome = await Promise.all(
    VALID_CHROMES.map(async (chrome) => ({ chrome, scenes: await fetchScenes(chrome, wf) }))
  );
  const total = perChrome.reduce((n, c) => n + c.scenes.length, 0);
  let done = 0;
  const results: CapturedImage[] = [];

  for (const { chrome, scenes } of perChrome) {
    const { width, height } = CHROME_SIZE[chrome];
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i] as AnyScene & { label?: string; id?: string };
      const label = scene.label ?? scene.id ?? `${chrome}-${i + 1}`;
      onProgress?.({ current: done, total, label: `${chrome} — ${label}` });
      const dataUrl = await captureScene(chrome, scenes[i]);
      results.push({ chrome, label, dataUrl, width, height });
      done++;
    }
  }
  onProgress?.({ current: total, total, label: 'Done' });
  return results;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportWorkflowAsPdf(wf: WfId, onProgress?: (p: ExportProgress) => void) {
  const images = await collectWorkflowImages(wf, onProgress);
  if (!images.length) return;

  // Fixed A4-landscape page for every scene (rather than a bespoke page size
  // per chrome) so the PDF has a consistent, printable layout; each scene's
  // screenshot is scaled to fit within the page (preserving aspect ratio) and
  // centered, instead of being stretched or clipped.
  const doc = new jsPDF({ unit: 'px', orientation: 'landscape', format: 'a4' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  images.forEach((img, i) => {
    if (i > 0) doc.addPage('a4', 'landscape');

    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const scale = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (pageWidth - w) / 2;
    const y = (pageHeight - h) / 2;

    doc.addImage(img.dataUrl, 'JPEG', x, y, w, h);
  });
  doc.save(`r100-${wf}.pdf`);
}

export async function exportWorkflowAsImages(wf: WfId, onProgress?: (p: ExportProgress) => void) {
  const images = await collectWorkflowImages(wf, onProgress);
  if (!images.length) return;

  const zip = new JSZip();
  images.forEach((img, i) => {
    const num = String(i + 1).padStart(2, '0');
    const safeLabel = img.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    zip.file(`${num}-${img.chrome}-${safeLabel}.jpg`, img.dataUrl.split(',')[1], { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `r100-${wf}-images.zip`);
}
