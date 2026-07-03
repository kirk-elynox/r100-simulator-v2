import type { FC } from 'react';

interface Props {
  recentChats?: string[];
  activeChat?: string;
  userInitial?: string;
  userName?: string;
}

const LogoSvg = () => (
  <svg viewBox="0 0 16 16" fill="#fff">
    <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z" />
  </svg>
);

const NavItem: FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <div className={`nav-item${active ? ' active' : ''}`}>
    {icon}
    {label}
  </div>
);

export const Sidebar: FC<Props> = ({ recentChats = [], activeChat = '', userInitial = 'DE', userName = 'Daniel Englebretson' }) => (
  <div className="sidebar">
    <div className="sidebar-header">
      <div className="sidebar-logo"><LogoSvg /></div>
      <div className="sidebar-toggle">
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <rect x={3} y={3} width={18} height={18} rx={2} />
          <path d="M9 3v18" />
          <path d="m16 15-3-3 3-3" />
        </svg>
      </div>
    </div>
    <div className="nav-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
      New chat
    </div>
    <div className="nav-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" /></svg>
      Search chats
    </div>
    <div className="nav-section-label">Projects</div>
    <div className="nav-item recent">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={2} y={4} width={20} height={16} rx={2} /><path d="M2 8h20" /></svg>
      LinkedIn Learning
    </div>
    <div className="nav-section-label">Recents</div>
    {recentChats.map((chat, i) => (
      <div key={i} className={`nav-item recent${chat === activeChat ? ' active' : ''}`}>{chat}</div>
    ))}
    <div className="sidebar-footer">
      <div className="avatar">{userInitial}</div>
      <div>
        <div className="avatar-name">{userName}</div>
        <div className="avatar-sub">Personal account</div>
      </div>
    </div>
  </div>
);
