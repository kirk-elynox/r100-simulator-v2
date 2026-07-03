interface Props { typing?: string }

export default function InputBar({ typing }: Props) {
  const placeholder = typing?.length ? typing : 'Ask anything';
  return (
    <div className="input-area">
      <div className="input-container">
        <div className="input-box">
          <div className="input-plus">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={12} cy={12} r={10} /><path d="M12 8v8M8 12h8" />
            </svg>
          </div>
          <div className="input-text">{placeholder}</div>
          <div className="input-mic">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1={12} y1={19} x2={12} y2={23} />
            </svg>
          </div>
          <div className="input-send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
        </div>
        <div className="footer-note">ChatGPT can make mistakes. Check important info.</div>
      </div>
    </div>
  );
}
