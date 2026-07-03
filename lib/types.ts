export type ChromeId = 'chatgpt' | 'slides' | 'google-docs';
export type WfId     = 'wf0' | 'wf1' | 'wf2' | 'wf3' | 'wf4' | 'wf5';

export const VALID_CHROMES: ChromeId[] = ['chatgpt', 'slides', 'google-docs'];
export const VALID_WFS: WfId[]         = ['wf0', 'wf1', 'wf2', 'wf3', 'wf4', 'wf5'];

export const CHROME_META: Record<ChromeId, { label: string; description: string; color: string }> = {
  'chatgpt':     { label: 'ChatGPT',  description: 'GPT conversation & builder flows', color: 'from-emerald-500/20 to-teal-500/10' },
  'slides':      { label: 'Slides',   description: 'Presentation deck scenes',         color: 'from-violet-500/20 to-purple-500/10' },
  'google-docs': { label: 'Workbook', description: 'Google Doc workbook pages',        color: 'from-blue-500/20 to-sky-500/10' },
};

export const WF_META: Record<WfId, { label: string; short: string }> = {
  wf0: { label: 'Getting Started',          short: 'WF0' },
  wf1: { label: 'The Interview',            short: 'WF1' },
  wf2: { label: 'The Mindset Shift',        short: 'WF2' },
  wf3: { label: 'Establishing Your Toolbox',short: 'WF3' },
  wf4: { label: 'Codifying AI Tools',       short: 'WF4' },
  wf5: { label: 'Orchestrating AI',         short: 'WF5' },
};

// ChatGPT
export interface ChatTurn { role: 'user' | 'assistant'; content: string; }
export interface ChatScene {
  id: string; layout: 'chat'; workflow?: string; label?: string;
  turns: ChatTurn[]; recentChats?: string[]; activeChat?: string; showSidebar?: boolean;
}
export interface GptEditorScene {
  id: string; layout: 'gpt-editor' | 'gpt-editor-split'; workflow?: string; label?: string;
  name?: string; description?: string; instructions?: string; starter?: string;
  activeTab?: 'create' | 'configure'; headerText?: string; imageGenerated?: boolean;
  isPublished?: boolean; conversationStarters?: string[];
  knowledgeFiles?: Array<{ name: string; color?: string }>;
  capabilities?: { webBrowsing?: boolean; dalleImageGen?: boolean; codeInterpreter?: boolean; fileRetrieval?: boolean };
  highlightParts?: number[]; testChatIndices?: number[]; showSidebar?: boolean;
}
export type ChatGPTScene = ChatScene | GptEditorScene;

// Slides
export interface TitleScene      { id: string; layout: 'title';           workflow?: string; label?: string; title?: string; subtitle?: string; body?: { label?: string; moduleLabel?: string }; }
export interface PersonaScene    { id: string; layout: 'persona';         workflow?: string; label?: string; name?: string; subtitle?: string; body?: { initials?: string; cards?: { label: string; text: string }[]; callout?: string }; }
export interface BrandedGraphicScene { id: string; layout: 'branded-graphic'; workflow?: string; label?: string; body?: { numbers?: { value: string; label: string }[]; levels?: { label: string; title: string; text: string }[]; footer?: string }; }
export interface MarkerGuideScene { id: string; layout: 'marker-guide';  workflow?: string; label?: string; title?: string; markers?: { icon?: string; title?: string; desc?: string }[]; }
export interface ClosingScene    { id: string; layout: 'closing';         workflow?: string; label?: string; title?: string; subtitle?: string; body?: { label?: string }; }
export interface ConceptOverlayScene { id: string; layout: 'concept-overlay'; workflow?: string; label?: string; title?: string; subtitle?: string; kicker?: string; }
export type SlideScene = TitleScene | PersonaScene | BrandedGraphicScene | MarkerGuideScene | ClosingScene | ConceptOverlayScene;

// Google Docs
export interface WorkbookBlock {
  type: string; heading?: string; headingLevel?: number; text?: unknown; title?: string;
  body?: unknown; variant?: string; label?: string; emoji?: unknown; kind?: string;
  info?: unknown; content?: unknown; documents?: unknown; cards?: unknown; columns?: unknown;
  items?: { label?: string; text?: string }[]; appearsAt?: number; [k: string]: unknown;
}
export interface DocScene {
  id: string; layout?: 'doc'; workflow?: string; label?: string;
  header: { title: string; breadcrumb?: string; badge?: { text: string; color: 'purple' | 'teal' } };
  blocks: WorkbookBlock[]; states?: number[];
}

export type AnyScene = ChatGPTScene | SlideScene | DocScene;
