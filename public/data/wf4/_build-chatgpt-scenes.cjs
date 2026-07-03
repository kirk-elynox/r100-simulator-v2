/**
 * Programmatic builder for WF04 chatgpt-scenes.json.
 * Mirrors the archived wf4-simulator.html buildScenes() output for the
 * 18 chatgpt-rendered scenes (16 gpt-editor + 2 chat).
 *
 * Run: node _build-chatgpt-scenes.cjs > chatgpt-scenes.json
 */

const fs = require('fs');
const path = require('path');

// ---- Instruction constants (verbatim from archive lines 519-534) ----
const INSTRUCTIONS_PART_1 =
  "You are a career coach AI specialized in resume optimization. Your role is to analyze the user's resume alongside the target job posting, identify gaps between what the resume communicates and what the role requires, and provide specific, actionable feedback to strengthen the match.";

const INSTRUCTIONS_PART_2 =
  "In each conversation:\n1. Ask the user to provide their resume and a job posting or job description.\n2. Analyze the resume against the job posting—look for keyword alignment, experience gaps, and missing context.\n3. Provide feedback in three sections: Strengths, Gaps, and Specific Recommendations.\n4. After feedback, ask if they want to revise. If yes, paste the revised resume, and repeat the analysis cycle.";

const INSTRUCTIONS_PART_3 =
  "Keep feedback concise and actionable. Do not rewrite the resume for them—guide them to improve their own version. Prioritize keywords and phrasing that appear in the job posting. If the resume is already a strong match, say so explicitly.";

const FULL_INSTRUCTIONS =
  `PART 1: Role and Context\n${INSTRUCTIONS_PART_1}\n\nPART 2: Interaction Protocol\n${INSTRUCTIONS_PART_2}\n\nPART 3: Output Constraints\n${INSTRUCTIONS_PART_3}`;

const INSTRUCTIONS_ITERATION_UPDATE =
  "Always suggest no more than three changes per iteration to avoid overwhelming the user.";

const INSTRUCTIONS_ADVANCED_UPDATE =
  "If the user's resume is already a 9/10 match, respond with affirmation and suggest only minor polishing. If it's below a 5/10, recommend a more fundamental restructure before diving into specific feedback.";

const ITERATED = FULL_INSTRUCTIONS + '\n\n' + INSTRUCTIONS_ITERATION_UPDATE;
const ADVANCED = ITERATED + '\n\n' + INSTRUCTIONS_ADVANCED_UPDATE;

// Resume description (used across many scenes)
const DESC = "A career coach AI that helps refine resumes for specific roles by analyzing job postings, providing targeted feedback, and iterating on resume content until it's a strong match.";

// Knowledge file pills
const KNOWLEDGE_FILES = [
  { name: 'Context: About Me.docx',         color: 'blue'   },
  { name: 'Context: My Resume.docx',        color: 'blue'   },
  { name: 'Context: My Cover Letter.docx',  color: 'blue'   },
  { name: 'Context: My References.docx',    color: 'blue'   },
  { name: 'Reference: Best Practices.docx', color: 'green'  },
  { name: 'Template: Resume.docx',          color: 'orange' },
  { name: 'Template: Cover Letter.docx',    color: 'orange' }
];

const STARTER = ['Analyze this job posting against my resume and highlight gaps'];

const CAPS_OFF = { webBrowsing: false, dalleImageGen: false, codeInterpreter: false, fileRetrieval: false };
const CAPS_ON  = { webBrowsing: false, dalleImageGen: false, codeInterpreter: true,  fileRetrieval: true  };

// ---- Scene authoring ----
const scenes = [];

// wf4-02: Blank GPT form
scenes.push({
  id: 'wf4-02',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'GPT Editor: Blank Form',
  activeTab: 'create',
  headerText: 'New GPT \u2022 Draft',
  name: '',
  description: '',
  instructions: '',
  conversationStarters: [],
  knowledgeFiles: [],
  capabilities: CAPS_OFF,
  imageGenerated: false,
  isPublished: false,
  showSidebar: false
});

// wf4-03: Name + Description
scenes.push({
  id: 'wf4-03',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Name and Description',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: '',
  conversationStarters: [],
  knowledgeFiles: [],
  capabilities: CAPS_OFF,
  imageGenerated: false,
  isPublished: false,
  showSidebar: false
});

// wf4-04: DALL-E icon generated
scenes.push({
  id: 'wf4-04',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'DALL-E Image Generation',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: '',
  conversationStarters: [],
  knowledgeFiles: [],
  capabilities: CAPS_OFF,
  imageGenerated: true,
  isPublished: false,
  showSidebar: false
});

// wf4-06: Instructions Part 1 (split in archive — rendered as plain gpt-editor per handoff §3 deferred)
scenes.push({
  id: 'wf4-06',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Instructions: Role and Context',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: [],
  knowledgeFiles: [],
  capabilities: CAPS_OFF,
  imageGenerated: true,
  isPublished: false,
  highlightParts: [1],
  showSidebar: false
});

// wf4-07: Instructions Parts 2-3
scenes.push({
  id: 'wf4-07',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Instructions: Protocol and Constraints',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: [],
  knowledgeFiles: [],
  capabilities: CAPS_OFF,
  imageGenerated: true,
  isPublished: false,
  highlightParts: [2, 3],
  showSidebar: false
});

// wf4-09: Starters (split → plain)
scenes.push({
  id: 'wf4-09',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Starters: Seeding the Workflow',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: [],
  capabilities: CAPS_OFF,
  imageGenerated: true,
  isPublished: false,
  showSidebar: false
});

// wf4-10: Capabilities
scenes.push({
  id: 'wf4-10',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Capabilities: Code Interpreter and File Retrieval',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: [],
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: false,
  showSidebar: false
});

// wf4-12: Knowledge Upload (split → plain)
scenes.push({
  id: 'wf4-12',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Knowledge: Adding Context Files',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: false,
  showSidebar: false
});

// wf4-13: Configure tab view
scenes.push({
  id: 'wf4-13',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Configure vs Create Tab',
  activeTab: 'configure',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: false,
  showSidebar: false
});

// wf4-14: Test chat [0,1]
scenes.push({
  id: 'wf4-14',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Testing: Initial Message',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: false,
  testChatIndices: [0, 1],
  showSidebar: false
});

// wf4-15: Test chat [0,1,2,3]
scenes.push({
  id: 'wf4-15',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Testing: Resume Analysis',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: false,
  testChatIndices: [0, 1, 2, 3],
  showSidebar: false
});

// wf4-16: Feedback Loop — Review (0-3)
scenes.push({
  id: 'wf4-16',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Feedback Loop: Reviewing Analysis',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: false,
  testChatIndices: [0, 1, 2, 3],
  showSidebar: false
});

// wf4-17: Feedback Loop — Revision (0-5)
scenes.push({
  id: 'wf4-17',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Feedback Loop: Revision Cycle',
  activeTab: 'create',
  headerText: 'ResumeOptimizer \u2022 Draft',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: false,
  testChatIndices: [0, 1, 2, 3, 4, 5],
  showSidebar: false
});

// wf4-18: Published
scenes.push({
  id: 'wf4-18',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Saving and Publishing',
  activeTab: 'create',
  headerText: 'ResumeOptimizer',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: FULL_INSTRUCTIONS,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: true,
  showSidebar: false
});

// wf4-19: Chat — Reuse Different Role (chatIndices [6,7])
scenes.push({
  id: 'wf4-19',
  layout: 'chat',
  workflow: 'WF04',
  label: 'Reuse: Different Role, Same Tool',
  showSidebar: true,
  recentChats: ['ResumeOptimizer Test', 'AI Marketing Leader Resume', 'Job Hunt Scaffold Creation', 'Self-Interview Question Framework'],
  activeChat: 'ResumeOptimizer Test',
  turns: [
    {
      role: 'user',
      content: "I have a resume for a UX Designer role. Here's my resume:\n\nAlex Rivera, UX Designer with 4 years of experience in product design, user research, and design systems. Skilled in Figma, prototyping, and accessibility-focused design.\n\nJob: Senior UX Designer at DesignFirst. Looking for someone with 3+ years UX experience, portfolio of shipped products, experience with design systems, user research methodology expertise."
    },
    {
      role: 'assistant',
      content: "## Resume Analysis: Alex Rivera for Senior UX Designer \u2014 DesignFirst\n\n### Strengths\n\n**Experience Match:** 4 years of UX experience exceeds the 3+ year requirement. Your core skills (Figma, prototyping, design systems) align directly with the role.\n\n### Gaps\n\n**Portfolio of Shipped Products:** The resume mentions experience but doesn't reference specific shipped products. Senior roles need evidence of end-to-end ownership.\n\n**User Research Methodology:** Listed as a skill but not demonstrated through specific methods or outcomes."
    }
  ]
});

// wf4-20: Chat — Table Output Format (chatIndices [6,7,8,9])
scenes.push({
  id: 'wf4-20',
  layout: 'chat',
  workflow: 'WF04',
  label: 'Variation: Table Output Format',
  showSidebar: true,
  recentChats: ['ResumeOptimizer Test', 'AI Marketing Leader Resume', 'Job Hunt Scaffold Creation', 'Self-Interview Question Framework'],
  activeChat: 'ResumeOptimizer Test',
  turns: [
    {
      role: 'user',
      content: "I have a resume for a UX Designer role. Here's my resume:\n\nAlex Rivera, UX Designer with 4 years of experience in product design, user research, and design systems. Skilled in Figma, prototyping, and accessibility-focused design.\n\nJob: Senior UX Designer at DesignFirst. Looking for someone with 3+ years UX experience, portfolio of shipped products, experience with design systems, user research methodology expertise."
    },
    {
      role: 'assistant',
      content: "## Resume Analysis: Alex Rivera for Senior UX Designer \u2014 DesignFirst\n\n### Strengths\n\n**Experience Match:** 4 years of UX experience exceeds the 3+ year requirement. Your core skills (Figma, prototyping, design systems) align directly with the role.\n\n### Gaps\n\n**Portfolio of Shipped Products:** The resume mentions experience but doesn't reference specific shipped products. Senior roles need evidence of end-to-end ownership.\n\n**User Research Methodology:** Listed as a skill but not demonstrated through specific methods or outcomes."
    },
    {
      role: 'user',
      content: "Can you give me a table comparing my resume against the job requirements?"
    },
    {
      role: 'assistant',
      content: "## Resume vs. Job Requirements Comparison\n\n| Job Requirement | Resume Evidence | Match |\n|---|---|---|\n| 3+ years UX experience | 4 years product design | **Strong** |\n| Portfolio of shipped products | Not specified in resume | **Gap** |\n| Design systems experience | Listed as core skill | **Moderate** |\n| User research methodology | Listed but not demonstrated | **Moderate** |\n| Figma proficiency | Listed as core skill | **Strong** |\n\n### Summary\n- **Strong matches:** 2 of 5 requirements\n- **Moderate matches:** 2 of 5\n- **Gaps:** 1 of 5"
    }
  ]
});

// wf4-22: Iteration — refined instructions
scenes.push({
  id: 'wf4-22',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Iteration: Refining Instructions',
  activeTab: 'create',
  headerText: 'ResumeOptimizer',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: ITERATED,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: true,
  showSidebar: false
});

// wf4-23: Advanced — conditional logic
scenes.push({
  id: 'wf4-23',
  layout: 'gpt-editor',
  workflow: 'WF04',
  label: 'Advanced: Conditional Logic',
  activeTab: 'create',
  headerText: 'ResumeOptimizer',
  name: 'ResumeOptimizer',
  description: DESC,
  instructions: ADVANCED,
  conversationStarters: STARTER,
  knowledgeFiles: KNOWLEDGE_FILES,
  capabilities: CAPS_ON,
  imageGenerated: true,
  isPublished: true,
  showSidebar: false
});

// ---- Output ----
const outPath = path.join(__dirname, 'chatgpt-scenes.json');
fs.writeFileSync(outPath, JSON.stringify(scenes, null, 2) + '\n', 'utf8');
console.log('Wrote ' + scenes.length + ' scenes to ' + outPath);
for (const s of scenes) console.log('  ' + s.id + ' (' + s.layout + ')');
