'use client';
import { useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import ActionBar from './ActionBar';
import InputBar from './InputBar';
import type { ChatScene as ChatSceneType } from '@/lib/types';

function renderMarkdown(src: string): string {
  // marked is loaded client-side; fallback to plain text if unavailable
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).marked) {
    try {
      return ((window as unknown as Record<string, { parse: (s: string) => string }>).marked).parse(src || '');
    } catch { return src; }
  }
  return src;
}

function UserTurn({ content }: { content: string }) {
  return (
    <div className="message user">
      <div className="user-bubble">{content}</div>
    </div>
  );
}

function AssistantTurn({ content }: { content: string }) {
  return (
    <div className="message assistant">
      <div className="assistant-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      <ActionBar />
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="main-header">
      <div className="model-selector">
        ChatGPT
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      <div className="header-actions">
        <div className="header-btn">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1={12} y1={2} x2={12} y2={15} />
          </svg>
          Share
        </div>
      </div>
    </div>
  );
}

interface Props { scene: ChatSceneType }

export default function ChatScene({ scene }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const turns = scene.turns ?? [];
  const showSidebar = scene.showSidebar !== false;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [scene.id]);

  return (
    <div className={`app${showSidebar ? '' : ' no-sidebar'}`}>
      {showSidebar && <Sidebar recentChats={scene.recentChats} activeChat={scene.activeChat} />}
      <div className="main">
        <ChatHeader />
        <div className="chat-scroll" ref={scrollRef}>
          <div className="chat-content">
            {turns.map((turn, i) =>
              turn.role === 'user'
                ? <UserTurn key={i} content={turn.content} />
                : <AssistantTurn key={i} content={turn.content} />
            )}
          </div>
        </div>
        <InputBar />
      </div>
    </div>
  );
}
