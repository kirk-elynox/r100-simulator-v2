#!/usr/bin/env node
/**
 * _build-chatgpt-scenes.cjs — Programmatically author WF5's 13 chatgpt scenes.
 *
 * Mapping per WF05-Orchestrating-AI-Collaboration/tools/wf5-scene-configuration.md:
 *   gpt-editor (5): wf5-{02, 03, 04, 05, 12}
 *   chat       (8): wf5-{06, 08, 09, 10, 11, 13, 14, 15}
 *
 * Source-of-truth content mined from
 * WF05-Orchestrating-AI-Collaboration/tools/_archive/wf5-simulator.html:
 *   - Scene definitions: lines 362-381 (gptEditor fields + chat.visibleIndices + callouts)
 *   - chatMessages array: lines 309-358 (12 messages, indices 0..11)
 *
 * Run: node shared/simulator/data/wf5/_build-chatgpt-scenes.cjs
 *      Writes to shared/simulator/data/wf5/chatgpt-scenes.json
 */

const fs   = require('fs');
const path = require('path');

// ─── Knowledge file color binding (per WF04 convention) ──────────────────────
const COLOR = {
  context:   'blue',
  reference: 'green',
  template:  'green'  // archive uses green hex for both Reference + Template
};

// ─── Capabilities (WF5 baseline: all 4 enabled per archive) ──────────────────
const CAPS_ALL = {
  webBrowsing:     true,
  dalleImageGen:   true,
  codeInterpreter: true,
  fileRetrieval:   true
};

// ─── Knowledge progressions ──────────────────────────────────────────────────
const KNOWLEDGE_FOUNDATION = [
  { name: 'Context: About Me.docx',         color: COLOR.context   },
  { name: 'Context: My Resume.docx',        color: COLOR.context   },
  { name: 'Reference: Best Practices.docx', color: COLOR.reference }
];

const KNOWLEDGE_STACKED = [
  { name: 'Context: About Me.docx',             color: COLOR.context   },
  { name: 'Context: My Resume.docx',            color: COLOR.context   },
  { name: 'Template: Cover Letter.docx',        color: COLOR.template  },
  { name: 'Reference: Best Practices.docx',     color: COLOR.reference },
  { name: 'Reference: Cover Letter Guide.docx', color: COLOR.reference }
];

const KNOWLEDGE_UPDATED = [
  { name: 'Context: About Me (Updated).docx',   color: COLOR.context   },
  { name: 'Context: My Resume (v2).docx',       color: COLOR.context   },
  { name: 'Template: Cover Letter.docx',        color: COLOR.template  },
  { name: 'Reference: Best Practices.docx',     color: COLOR.reference },
  { name: 'Reference: Cover Letter Guide.docx', color: COLOR.reference }
];

// ─── Instructions strings (verbatim from archive lines 364, 366, 375) ───────
const INSTRUCTIONS_FOUNDATION = "You are a career coach AI specialized in resume optimization. Your role is to analyze the user's resume alongside the target job posting, identify gaps, and provide specific, actionable feedback to strengthen the match.\n\nIn each conversation:\n1. Ask the user to provide their resume and a job posting.\n2. Analyze the resume against the job posting.\n3. Provide feedback in three sections: Strengths, Gaps, and Specific Recommendations.\n4. After feedback, ask if they want to revise.\n\nKeep feedback concise and actionable. Do not rewrite the resume for them. Prioritize keywords from the job posting.";

const INSTRUCTIONS_STACKED = "You are a career coach AI and job hunt assistant. Your role is to help with resume optimization, cover letter drafting, multi-role evaluation, market analysis, and offer comparison — using the user's context, values, and goals as the foundation for all guidance.\n\nIn each conversation:\n1. Ask the user to provide their resume and a job posting (or multiple postings for comparison).\n2. Analyze against the posting — look for keyword alignment, experience gaps, and missing context.\n3. Provide feedback in three sections: Strengths, Gaps, and Specific Recommendations.\n4. For cover letters, use the uploaded template as the scaffold and customize for each role.\n5. For multi-role evaluation, rank opportunities against the user's stated criteria.\n6. For offer evaluation, use the personal perspective brief to ground the framework.\n\nKeep feedback concise and actionable. Prioritize the user's values and goals. Adapt strategy based on new market context as it arrives. Always suggest no more than three changes per iteration.";

// ─── Conversation starters ───────────────────────────────────────────────────
const STARTERS_FOUNDATION = [
  'Analyze my resume against this job posting',
  'What are my strongest qualifications for this role?',
  'Help me identify gaps in my application'
];
const STARTERS_STACKED = [
  'Analyze my resume against this job posting',
  'Draft a cover letter for this role',
  'Evaluate these roles against my criteria',
  'Compare these two offers side by side'
];

// ─── Common chat-shell metadata ──────────────────────────────────────────────
const RECENT_CHATS = [
  'Offer Comparison',
  'Multi-Job Evaluation',
  'Job Hunt Assistant',
  'ResumeOptimizer Test',
  'AI Marketing Leader Resume'
];
const ACTIVE_CHAT = 'Job Hunt Assistant';

// ─── Chat messages from archive lines 310-358 (indices 0..11) ────────────────
const CHAT_MSGS = [
  // 0
  { role: 'user',
    content: "I'm applying to Globe Bank for the VP of AI Marketing role. First, help me tailor my resume for this specific posting. Then, draft a cover letter that connects my experience to their specific needs." },
  // 1
  { role: 'assistant',
    content: "Here's how your resume stacks up against Globe Bank's VP of AI Marketing role:\n\n**Gaps & Misalignments**\n- **Seniority gap:** Your experience reads as strong Senior Manager level, but not yet clearly \"VP.\" Scope (team size, budget ownership, org influence) needs elevation.\n- **Team leadership scale:** You've led 4 people; role calls for 6\u20138 + broader org leadership narrative.\n- **Budget ownership missing:** No mention of owning or managing a marketing budget.\n- **Financial services experience:** No direct fintech/banking exposure, which is a stated preference.\n- **Enterprise buyer focus:** Your work leans developer/technical audiences; needs clearer enterprise GTM framing.\n\n**Strengths to Emphasize**\n- Strong AI/ML marketing foundation with credible technical fluency\n- Proven \"build from scratch\" experience \u2014 highly relevant to a scaling org\n- Clear impact metrics (adoption, engagement, conversion lift)\n- MBA + CS combo \u2014 exactly what they're signaling as ideal\n\n**Recommended Revisions**\n- Reframe title/scope upward: Add \"Head of Product Marketing, AI Products\"\n- Add budget responsibility: \"Managed $X marketing budget across product launches\"\n- Expand team leadership narrative: \"Scaled team from 0\u21924; established hiring plan\"\n\n---\n\nNow, a tailored cover letter:\n\nDear Globe Bank Hiring Team,\n\nI'm excited to apply for the VP of AI Marketing role at Globe Bank. Your mission to transform financial services through AI aligns closely with the work I've been leading over the past eight years: bringing technically sophisticated AI products to market in a way that drives real adoption and trust.\n\nIn my current role leading AI product marketing at Nexus AI, I built the function from the ground up, launching multiple AI products that exceeded adoption targets by 40% in their first quarter. A key part of that success has been translating complex machine learning capabilities into clear, credible narratives for business and technical buyers.\n\nI'd welcome the opportunity to help Globe Bank define the category for AI-powered banking.\n\nBest regards, Sarah Chen" },
  // 2
  { role: 'user',
    content: "That cover letter is solid. Can you tighten it to three focused paragraphs? Lead with the AI translation angle \u2014 that seems to be their core need." },
  // 3
  { role: 'assistant',
    content: "Here's a tighter version leading with the translation angle:\n\n---\n\nDear Globe Bank Hiring Team,\n\nThe most valuable skill in AI marketing isn't understanding the models \u2014 it's translating them. Over eight years building AI product marketing from the ground up at Nexus AI, I've learned that adoption lives or dies on whether the buyer trusts the technology. That's the challenge Globe Bank is solving, and it's exactly the work I'm built for.\n\nAt Nexus AI, I launched multiple AI products that exceeded adoption targets by 40% in Q1 \u2014 not by leading with features, but by making the technology feel credible, accessible, and consequential. I scaled a team of four, managed end-to-end GTM across product and sales, and developed a content strategy that lifted conversion by 18% while establishing a lasting voice in a crowded market.\n\nGlobe Bank is at an inflection point: the AI capabilities are real, but the market narrative isn't yet. I'd welcome the opportunity to build it.\n\nBest regards, Sarah Chen\n\n---\n\nThis version anchors the \"translator\" identity immediately, keeps the metrics but cuts the inventory, and ends with a sharp positioning statement rather than a generic close." },
  // 4
  { role: 'user',
    content: "I have five job postings I'm considering. Can you evaluate each one against my perspective brief and rank them by alignment?" },
  // 5
  { role: 'assistant',
    content: "I'll pressure-test each role against your non-negotiables and what you're actually optimizing for.\n\n---\n\n**1. Globe Bank \u2013 VP of AI Marketing** | Fit: Moderate\nVP title and strategic scope are promising, but fintech context often means heavier compliance and slower narrative iteration. Compensation is strong.\n\n**Take:** Looks good on paper, but likely drifts toward \"institutional marketing leader\" vs. AI narrative architect.\n\n---\n\n**2. Prism Analytics \u2013 Director of AI Marketing (Series B)** | Fit: Strong\nSeries B + complex domain AI = exactly where translation and narrative matter. Clear path to VP. Slightly below comp target.\n\n**Take:** Very aligned with your \"architecture over execution\" goal, assuming real autonomy.\n\n---\n\n**3. NeuralPath \u2013 Head of Product Marketing (Series D, healthcare AI)** | Fit: Very Strong\nHealthcare AI demands deep translation and credibility \u2014 your core strength. Series D means more structure.\n\n**Take:** Strong domain alignment, but confirm this isn't a \"polished execution\" PMM role.\n\n---\n\n**4. TechForge Labs \u2013 VP Marketing (public, dev tools)** | Fit: Weak-Moderate\nPublic company = scale, not build. Likely far from product decisions. Highest comp.\n\n**Take:** Best pay, worst alignment with your operating model.\n\n---\n\n**5. DataMind \u2013 Director of Growth (seed stage)** | Fit: Weak\n\"Growth\" signals execution and channels \u2014 not narrative architecture. Below comp range.\n\n**Take:** Too execution-heavy and too early.\n\n---\n\n## Overall Ranking\n1. **Prism Analytics** \u2013 Best balance of build opportunity and strategic ownership\n2. **NeuralPath** \u2013 Strong domain fit; depends on role scope\n3. **Globe Bank** \u2013 Good scope, but cultural and structural risks\n4. **TechForge Labs** \u2013 High comp, low alignment\n5. **DataMind** \u2013 Misaligned role design and compensation" },
  // 6
  { role: 'user',
    content: "I just read this article about AI in banking. How should this change my approach to the Globe Bank application?" },
  // 7
  { role: 'assistant',
    content: "Short answer: yes \u2014 this should absolutely influence how you position yourself. Not in a dramatic rewrite, but in a smart reframing.\n\n**What the shift means for your positioning:**\n\nBanks are past AI hype. They want people who understand *real-world application and impact*. That changes what Globe Bank is actually screening for.\n\n**Gaps to Address**\n- If your resume treats AI as a buzzword, that's a miss \u2014 they want demonstrated understanding of applied AI\n- If your experience is framed purely as \"marketing campaigns\" without tying to business outcomes (conversion, risk understanding, customer behavior), it may feel outdated\n- If you don't show ability to translate complex ideas into customer-friendly messaging, you're missing the core challenge\n\n**Strengths to Amplify**\n- Any experience explaining complex, technical, or abstract concepts to non-experts\n- Work tied to outcomes: growth, adoption, trust, retention\n- Data-informed decision-making\n- Cross-functional collaboration with product, data, or engineering\n\n**Recommended Reframes**\n\nInstead of: \"Led campaign for new digital product\"\nTry: \"Led campaign translating complex product functionality into customer-facing value, increasing adoption by X%\"\n\nAdd a thread of \"translator between tech and customer\" throughout. Even without direct AI experience, you can position yourself as someone who simplifies complexity and builds trust in new systems.\n\nConsider a summary line: \"Marketing professional focused on translating complex financial and technological capabilities into clear, customer-centered value.\"\n\n---\n\nGlobe Bank doesn't just want marketers \u2014 they want interpreters of AI-driven banking. Your goal is to show you can sit between the model and the customer and make it meaningful." },
  // 8
  { role: 'user',
    content: "I've received an offer from Globe Bank. Can you help me build an evaluation framework based on my perspective brief?" },
  // 9
  { role: 'assistant',
    content: "This is a strong offer on the surface. Let's turn your brief into a practical evaluation framework.\n\n---\n\n**1. Hard Filters (Pass / Risk / Fail)**\n\n- Strategic autonomy \u2192 Globe Bank: **UNCLEAR / RISK** (org layers)\n- Product integrity (AI is real, not hype) \u2192 Globe Bank: **RISK** (could be AI-washed)\n- Org structure (marketing not under sales) \u2192 Reports to CPO \u2192 **PASS**\n- Cultural standard (substance vs optics) \u2192 **UNKNOWN**\n- Work-life expectations \u2192 **UNKNOWN** (finance can skew intense)\n\n---\n\n**2. Role Design Fit (1\u20135 Scale)**\n\n- VP title + small team + hiring budget \u2192 **4\u20135 on design/build**\n- Reporting to CPO \u2192 strong **product influence potential**\n- Risk: in large orgs, \"VP\" can mean stakeholder management over true ownership\n\n---\n\n**3. Compensation & Risk Balance**\n\n- Base: $210K \u2192 top of your range\n- Bonus: 20% \u2192 solid\n- Equity: 0.15% \u2192 **lower upside vs startup**\n\nThis is a **cash-heavy, lower-risk package** \u2014 not a high-upside bet.\n\n---\n\n**Key Risks**\n\n- AI may not be differentiated enough to support your narrative work\n- You may spend more time navigating compliance + stakeholders than building frameworks\n- Culture could skew toward optics and consensus vs clarity\n\n**Key Upside Signals**\n\n- Reporting to CPO \u2192 suggests product-led marketing seat\n- Team small enough to shape \u2192 not inheriting a bloated org\n- Budget to hire \u2192 real ability to architect function\n\n---\n\n**Before deciding, explicitly validate:**\n- \"What AI capabilities are actually proprietary vs vendor-based?\"\n- \"What decisions will I fully own vs influence?\"\n- \"What has prevented strong AI adoption so far?\"\n\nTheir answers will tell you whether this is a true architecture role or a high-prestige execution role with constraints." },
  // 10
  { role: 'user',
    content: "I now have two offers. Can you compare them against my evaluation criteria and perspective brief?" },
  // 11
  { role: 'assistant',
    content: "Here's a clean comparison through the lens of your brief \u2014 not just comp/title, but actual fit to how you work.\n\n---\n\n## Offer 1 \u2014 Globe Bank (VP AI Marketing)\n\n**Gaps:** Large bank likely skews toward slower decision-making and \"optics over substance.\" AI product integrity is ambiguous. Stage mismatch: this is post-product optimization, not shaping from ambiguity.\n\n**Strengths:** VP title + team of 3\u21927 = immediate architectural authority. Reports to CPO. Remote-friendly. Budget to hire.\n\n---\n\n## Offer 2 \u2014 Prism Analytics (Director AI Marketing)\n\n**Gaps:** Director reporting to VP Marketing = higher risk of execution over strategy. Location friction: 3 days/week SF.\n\n**Strengths:** Strong product integrity \u2014 Series B, engineering-led, focused AI product. Closest to your sweet spot: market doesn't fully understand the product yet. High proximity to product. Substance over optics culture.\n\n---\n\n## Direct Comparison Against Your Criteria\n\n| Dimension | Globe Bank | Prism Analytics |\n|---|---|---|\n| Product Integrity | Risk | Strong |\n| Build vs Scale | Scale/optimize | Shape/build |\n| Proximity to Product | Moderate | High |\n| Cultural Fit | Risk | Strong |\n| Career Trajectory (2\u20133yr) | Title now | Differentiation |\n| Compensation | $210K + stronger | $190K + equity upside |\n\n---\n\n## My Read (Based on Your Brief)\n\n**If you choose Globe:** You're prioritizing title, stability, and immediate authority \u2014 but risking misalignment with how you actually create impact.\n\n**If you choose Prism:** You're prioritizing working on a real AI product in an ambiguous market, staying close to product and narrative creation \u2014 but you must solve for scope and autonomy upfront.\n\n**Critical question before deciding (for Prism):** Do you own positioning and GTM strategy, or support it? If the VP of Marketing is hands-off and you have direct access to product leadership \u2014 Prism aligns much better with your trajectory." }
];

// Build a chat scene from a list of message indices.
function chatScene(id, label, indices) {
  return {
    id, layout: 'chat', workflow: 'WF05', label,
    showSidebar: true,
    recentChats: RECENT_CHATS,
    activeChat: ACTIVE_CHAT,
    turns: indices.map(i => CHAT_MSGS[i])
  };
}

// ─── Scene assemblies ────────────────────────────────────────────────────────
const scenes = [
  // ── gpt-editor scenes ─────────────────────────────────────────────────────
  // wf5-02 — Foundation Review (part 1)
  {
    id: 'wf5-02', layout: 'gpt-editor', workflow: 'WF05',
    label: 'Foundation Review: Knowledge, Instructions, Starters (part 1)',
    activeTab: 'create',
    headerText: 'ResumeOptimizer \u2022 Draft',
    name: 'ResumeOptimizer',
    description: "A career coach AI that helps refine resumes for specific roles by analyzing job postings, providing targeted feedback, and iterating on resume content until it's a strong match.",
    instructions: INSTRUCTIONS_FOUNDATION,
    conversationStarters: STARTERS_FOUNDATION,
    knowledgeFiles: KNOWLEDGE_FOUNDATION,
    capabilities: CAPS_ALL,
    isPublished: false,
    showSidebar: false
  },
  // wf5-03 — Foundation Review (part 2) — same form, different beat (Configure tab)
  {
    id: 'wf5-03', layout: 'gpt-editor', workflow: 'WF05',
    label: 'Foundation Review: Knowledge, Instructions, Starters (part 2)',
    activeTab: 'create',
    headerText: 'ResumeOptimizer \u2022 Draft',
    name: 'ResumeOptimizer',
    description: "A career coach AI that helps refine resumes for specific roles by analyzing job postings, providing targeted feedback, and iterating on resume content until it's a strong match.",
    instructions: INSTRUCTIONS_FOUNDATION,
    conversationStarters: STARTERS_FOUNDATION,
    knowledgeFiles: KNOWLEDGE_FOUNDATION,
    capabilities: CAPS_ALL,
    isPublished: false,
    showSidebar: false
  },
  // wf5-04 — Capability Stacking: Cover Letter (part 1) — renamed + cover letter added
  {
    id: 'wf5-04', layout: 'gpt-editor', workflow: 'WF05',
    label: 'Capability Stacking: Add Cover Letter Template (part 1)',
    activeTab: 'create',
    headerText: 'Job Hunt Assistant \u2022 Draft',
    name: 'Job Hunt Assistant',
    description: "A career coach AI that helps with resume optimization, cover letter drafting, multi-role evaluation, and offer comparison \u2014 using your context, values, and goals as the foundation.",
    instructions: INSTRUCTIONS_STACKED,
    conversationStarters: STARTERS_STACKED,
    knowledgeFiles: KNOWLEDGE_STACKED,
    capabilities: CAPS_ALL,
    isPublished: false,
    showSidebar: false
  },
  // wf5-05 — Capability Stacking (part 2)
  {
    id: 'wf5-05', layout: 'gpt-editor', workflow: 'WF05',
    label: 'Capability Stacking: Add Cover Letter Template (part 2)',
    activeTab: 'create',
    headerText: 'Job Hunt Assistant \u2022 Draft',
    name: 'Job Hunt Assistant',
    description: "A career coach AI that helps with resume optimization, cover letter drafting, multi-role evaluation, and offer comparison \u2014 using your context, values, and goals as the foundation.",
    instructions: INSTRUCTIONS_STACKED,
    conversationStarters: STARTERS_STACKED,
    knowledgeFiles: KNOWLEDGE_STACKED,
    capabilities: CAPS_ALL,
    isPublished: false,
    showSidebar: false
  },
  // wf5-12 — Modular Updates (Future-Proofing) — knowledge files swapped to Updated/v2
  {
    id: 'wf5-12', layout: 'gpt-editor', workflow: 'WF05',
    label: 'Modular Updates: Future-Proofing Your Specification',
    activeTab: 'create',
    headerText: 'Job Hunt Assistant \u2022 Draft',
    name: 'Job Hunt Assistant',
    description: "A career coach AI that helps with resume optimization, cover letter drafting, multi-role evaluation, and offer comparison \u2014 using your context, values, and goals as the foundation.",
    instructions: INSTRUCTIONS_STACKED,
    conversationStarters: STARTERS_STACKED,
    knowledgeFiles: KNOWLEDGE_UPDATED,
    capabilities: CAPS_ALL,
    isPublished: false,
    showSidebar: false
  },

  // ── chat scenes ───────────────────────────────────────────────────────────
  // Archive chat-scene visibleIndices (lines 367, 368, 371, 372, 374, 376, 377):
  //   wf5-06 = scene 4  (First Use)             visibleIndices [0, 1]
  //   wf5-08 = scene 6  (Dual Capability)        visibleIndices [0, 1, 2, 3]
  //   wf5-09 = scene 9  (Multi-Job Evaluation)   visibleIndices [4, 5]
  //   wf5-10 = scene 10 (Market Context)         visibleIndices [6, 7]
  //   wf5-11 = scene 12 (Offer Evaluation)       visibleIndices [8, 9]
  //   wf5-13 = scene 14 (Multi-Thread Continuity) visibleIndices [0, 1]
  //   wf5-14 = scene 15 (Decision Support)        visibleIndices [10, 11]
  //   wf5-15 = scene 12 (Continuous Learning)    no archive equivalent — reuse [10,11]
  // Wait — the canonical scene config has WF5 chat scenes mapping a bit differently.
  // The 14-script-scenes / 18-SPA mapping says canonical chat slots are
  //   wf5-06 (Script 4 First Use), wf5-08/09 (Script 6 Multi-Job parts a/b),
  //   wf5-10 (Script 7 Market News), wf5-11 (Script 8 Company Research),
  //   wf5-13 (Script 10 Multi-Context), wf5-14 (Script 11 Multi-Offer),
  //   wf5-15 (Script 12 Continuous Learning).
  // We reuse the archive's visibleIndices map keyed by script-scene number.
  chatScene('wf5-06', 'First Use: Single Conversation, Dual Capability',  [0, 1]),
  chatScene('wf5-08', 'Multi-Job Evaluation: Scaling Decision Support (part 1)', [0, 1, 2, 3]),
  chatScene('wf5-09', 'Multi-Job Evaluation: Scaling Decision Support (part 2)', [4, 5]),
  chatScene('wf5-10', 'Market News Integration: Context Informs Strategy', [6, 7]),
  chatScene('wf5-11', 'Company Research for Offer Evaluation: Full Circle', [8, 9]),
  chatScene('wf5-13', 'Multi-Context Continuity: One Assistant, Many Threads', [0, 1]),
  chatScene('wf5-14', 'Decision Support: Comparing Multiple Offers', [10, 11]),
  chatScene('wf5-15', 'Continuous Learning and Iteration', [10, 11])
];

const out = path.resolve(__dirname, 'chatgpt-scenes.json');
fs.writeFileSync(out, JSON.stringify(scenes, null, 2) + '\n', 'utf8');
console.log('Wrote', scenes.length, 'scenes to', out);
