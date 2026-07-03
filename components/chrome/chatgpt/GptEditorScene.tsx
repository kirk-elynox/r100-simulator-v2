'use client';
import { Sidebar } from './Sidebar';
import InputBar from './InputBar';
import type { GptEditorScene as GptEditorSceneType } from '@/lib/types';

function fileColor(name: string): string {
  if (name.startsWith('Context:'))   return 'blue';
  if (name.startsWith('Reference:')) return 'green';
  if (name.startsWith('Template:'))  return 'orange';
  return 'blue';
}

function highlightInstructions(text: string, parts: number[]): string {
  let html = text;
  if (parts.includes(1)) {
    const s = html.indexOf('PART 1'), e = html.indexOf('PART 2');
    if (s !== -1 && e !== -1)
      html = html.slice(0, s) + `<span class="instruction-part instruction-part-1">${html.slice(s, e)}</span>` + html.slice(e);
  }
  if (parts.includes(2)) {
    const s = html.indexOf('PART 2'), e = html.indexOf('PART 3');
    if (s !== -1) {
      const end = e !== -1 ? e : html.length;
      html = html.slice(0, s) + `<span class="instruction-part instruction-part-2">${html.slice(s, end)}</span>` + html.slice(end);
    }
  }
  if (parts.includes(3)) {
    const s = html.indexOf('PART 3');
    if (s !== -1)
      html = html.slice(0, s) + `<span class="instruction-part instruction-part-3">${html.slice(s)}</span>`;
  }
  return html;
}

function EditorHeader({ name, isPublished, headerText }: { name?: string; isPublished?: boolean; headerText?: string }) {
  const titleText = headerText || name || 'New GPT';
  const badge = isPublished ? 'Published' : 'Draft';
  const cta   = isPublished ? 'Save' : 'Create';
  const skipBadge = !!headerText && headerText.includes('•');
  return (
    <div className="gpt-editor-header">
      <div className="gpt-editor-back">‹</div>
      <div>
        <div className="gpt-editor-title">{titleText}</div>
        {!skipBadge && <div className="gpt-editor-badge">• {badge}</div>}
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <button className="gpt-editor-create-btn" type="button">{cta}</button>
      </div>
    </div>
  );
}

function TabBar({ activeTab }: { activeTab: string }) {
  return (
    <div className="gpt-tabs">
      <div className={`gpt-tab${activeTab === 'create' ? ' active' : ''}`}>Create</div>
      <div className={`gpt-tab${activeTab === 'configure' ? ' active' : ''}`}>Configure</div>
    </div>
  );
}

function CapabilityRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className={`gpt-capability-item${checked ? ' is-checked' : ''}`}>
      <span className="gpt-capability-mark" aria-hidden>{checked ? '✓' : null}</span>
      {label}
    </label>
  );
}

function ConfigureTabBody({ scene }: { scene: GptEditorSceneType }) {
  const starters = scene.conversationStarters ?? (scene.starter ? [scene.starter] : []);
  const files = scene.knowledgeFiles ?? [];
  const cap = scene.capabilities ?? {};
  const instructionsHtml =
    scene.instructions && scene.highlightParts?.length
      ? highlightInstructions(scene.instructions, scene.highlightParts)
      : null;

  return (
    <div className="gpt-editor-left-body">
      <div className="gpt-field-label">Name</div>
      <input className="gpt-input" defaultValue={scene.name ?? ''} readOnly />

      <div className="gpt-field-label">Description</div>
      <input className="gpt-input" defaultValue={scene.description ?? ''} readOnly style={{ height: 60 }} />

      {scene.instructions && (
        <>
          <div className="gpt-field-label">Instructions</div>
          {instructionsHtml
            ? <div className="gpt-textarea" dangerouslySetInnerHTML={{ __html: instructionsHtml }}
                style={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', overflowY: 'auto' }} />
            : <textarea className="gpt-textarea" defaultValue={scene.instructions} readOnly
                style={{ fontFamily: 'monospace', fontSize: 12 }} />
          }
        </>
      )}

      {starters.length > 0 && (
        <>
          <div className="gpt-field-label">Conversation starters</div>
          <div className="gpt-starters-list">
            {starters.map((s, i) => <div key={i} className="gpt-starter-chip">{s}</div>)}
          </div>
        </>
      )}

      {files.length > 0 && (
        <>
          <div className="gpt-field-label">Knowledge</div>
          <div className="gpt-knowledge-chips">
            {files.map((f, i) => <div key={i} className={`gpt-file-chip ${f.color ?? fileColor(f.name)}`}>{f.name}</div>)}
          </div>
        </>
      )}

      <div className="gpt-field-label">Capabilities</div>
      <div className="gpt-capability-group">
        <CapabilityRow label="Web Browsing"            checked={!!cap.webBrowsing} />
        <CapabilityRow label="DALL-E Image Generation" checked={!!cap.dalleImageGen} />
        <CapabilityRow label="Code Interpreter"        checked={!!cap.codeInterpreter} />
        <CapabilityRow label="File Retrieval"          checked={!!cap.fileRetrieval} />
      </div>
    </div>
  );
}

function PreviewPane({ scene }: { scene: GptEditorSceneType }) {
  const starters = scene.conversationStarters ?? (scene.starter ? [scene.starter] : []);
  return (
    <div className="gpt-editor-right">
      <div className="gpt-editor-preview-meta">
        <span style={{ fontWeight: 500 }}>Preview</span>
        <span className="preview-model">Model ›</span>
      </div>
      <div className={`gpt-preview-icon${scene.imageGenerated ? ' generated' : ''}`}>
        <span>{scene.imageGenerated ? '💼' : 'R'}</span>
      </div>
      <div className="gpt-preview-name">{scene.name ?? 'Your GPT'}</div>
      <div className="gpt-preview-desc">{scene.description ?? ''}</div>
      {starters.length > 0 && (
        <div className="gpt-starters-preview">
          {starters.map((s, i) => <div key={i} className="gpt-starter-preview">{s}</div>)}
        </div>
      )}
      <div style={{ marginTop: 'auto', width: '100%' }}><InputBar /></div>
    </div>
  );
}

interface Props { scene: GptEditorSceneType }

export default function GptEditorScene({ scene }: Props) {
  const showSidebar = !!scene.showSidebar;
  const activeTab   = scene.activeTab ?? 'configure';

  return (
    <div className={`app${showSidebar ? '' : ' no-sidebar'}`}>
      {showSidebar && <Sidebar recentChats={[]} activeChat="" />}
      <div className="main">
        <EditorHeader key={`${scene.id}-header`} name={scene.name} isPublished={!!scene.isPublished} headerText={scene.headerText} />
        <div className="gpt-editor">
          <div className="gpt-editor-left">
            <TabBar key={`${scene.id}-tabs`} activeTab={activeTab} />
            <ConfigureTabBody key={`${scene.id}-body`} scene={scene} />
          </div>
          <PreviewPane key={`${scene.id}-preview`} scene={scene} />
        </div>
      </div>
    </div>
  );
}
