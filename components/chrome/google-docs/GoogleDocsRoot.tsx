'use client';
import DocScene from './DocScene';
import type { DocScene as DocSceneType } from '@/lib/types';
export default function GoogleDocsRoot({ scene }: { scene: DocSceneType }) {
  return <DocScene scene={scene} />;
}
