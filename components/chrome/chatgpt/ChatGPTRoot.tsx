'use client';
import ChatScene from './ChatScene';
import GptEditorScene from './GptEditorScene';
import type { ChatGPTScene } from '@/lib/types';

interface Props { scene: ChatGPTScene }

export default function ChatGPTRoot({ scene }: Props) {
  if (scene.layout === 'chat') return <ChatScene scene={scene} />;
  if (scene.layout === 'gpt-editor' || scene.layout === 'gpt-editor-split')
    return <GptEditorScene scene={scene} />;
  return <div className="flex h-screen items-center justify-center text-[var(--muted)]">Unknown layout: {scene.layout}</div>;
}
