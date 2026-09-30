import {questions, profiles} from './data.js';

const englishQuestions = [
  {text: 'AI has made a well-structured presentation, but it still doesn’t quite feel like yours. You have six hours before it is due. What do you do next?', options: ['Adjust a few key slides yourself, then refine the overall style until you are happy with it.', 'Describe what feels wrong, add reference examples, and ask AI to produce a few more versions to choose from.']},
  {text: 'Your team increasingly uses AI for research, but its documents are scattered across systems in different formats. You have a budget to improve this. What comes first?', options: ['Standardize document structure, permissions, and data access so AI can read reliably, even if the team must change how it maintains documents.', 'Improve AI’s ability to search, read, and extract information across systems, while the team keeps its existing practices.']},
  {text: 'AI now does a task you once knew well, quickly and competently. After six months, you notice your own skills getting rusty. What do you do?', options: ['Accept the change and spend your time on things that need you more now.', 'Do some of these tasks yourself regularly, so you can still handle them independently.']},
  {text: 'Several companies are organizing an event together. Headcounts, budgets, and dates keep needing confirmation. You are asked to improve coordination. What would you introduce?', options: ['Have AI compile information from existing emails, group chats, and spreadsheets, so fewer details get missed.', 'Have each party check and deliver clear, accurate documents in the specified format.']},
  {text: 'AI has delivered work that meets your stated requirements, using a method you are unfamiliar with. What do you usually do?', options: ['Understand its method and key decisions before deciding whether to use the work.', 'Check it against the acceptance criteria and use it if it passes, looking into the method when needed.']},
  {text: 'Your company’s website has been redesigned, and the AI that enters orders has stopped working. This fix is straightforward, but it is the third time. Where would you spend the next maintenance budget?', options: ['Improve the agent’s page recognition, error handling, and retries so it can adapt to interface changes.', 'Modify the order system to provide a stable API and clear data formats for agents to read and write orders directly, accepting the development and coordination costs.']}
];

const englishProfiles = {
  technical: {name: 'Technological Humanism', subtitle: 'People develop their abilities through close collaboration with machines, while retaining their agency.', note: 'You welcome new technology, and you like to stay involved. If machines can do more, you have time to consider things more carefully. Others call this saving effort. You find you finally have time to be particular.'},
  autonomous: {name: 'Machine Autonomism', subtitle: 'Let machines settle machine affairs among themselves.', note: 'Your expectations of machines are modest: once things have been explained, they need not keep asking. Progress ought, eventually, to let a person enjoy a meal in peace. If the work is also finished by dessert, civilization will have made itself useful.'},
  pure: {name: 'Pure Humanism', subtitle: 'People should retain their skills and practice: understanding, creating, and taking charge themselves.', note: 'You have no objection to machines helping. Some things, though, only count once you have done them yourself. Time saved is valuable; knowing you still can is worth something too. Whether this is efficient is a calculation you are in no hurry to delegate.'},
  reform: {name: 'Machine Reformism', subtitle: 'The world is not changing just yet. Machines will have to learn to use a browser.', note: 'You are willing to hand work to machines, but would rather not rebuild the world before handing it over. The old system has its quirks; at least everyone knows them. A clever new colleague can reasonably be expected to learn a few things.'}
};

const ui = {
  zh: {
    title: 'AI 倾向测试', intro: '每题选一个最接近你判断的选项。', nav: '题目导航', previous: '上一题', next: '下一题', seeResult: '查看结果', result: '测试结果', kicker: '你的 AI 倾向', disclaimer: '这是六个情境中的选择倾向，不是对能力的评价，也不是心理诊断。', dimensions: '测评维度', actions: '结果操作', review: '修改答案', restart: '重新测试', share: '分享结果', retry: '生成失败，点击重试', strong: '明显偏向', slight: '略偏', high: 'Agent 渗透率高', low: 'Agent 渗透率低', handsOn: '人持续参与', handsOff: '人委托目标', position: '你的位置', coordinateLabel: '倾向坐标', orientation: '横轴左侧为持续参与，右侧为委托目标；纵轴上方为高渗透倾向，下方为低渗透倾向。', close: '关闭', generating: '正在生成图片…', saveHint: '保存图片，或长按图片分享。', save: '保存图片', shareImage: '分享图片', shareUnavailable: '暂时无法直接分享，可以先保存图片。', imageFailed: '图片生成失败，请关闭后重试。', imageAlt: '测评结果图，含评语、两条测评维度和测评入口二维码', invite: '你会怎么选？', scan: '扫描二维码，完成六道题。', language: '切换到英文',
    axes: [
      {title: '人的持续参与度', left: '委托目标', right: '持续参与', description: '从审美控制、能力保留和过程理解，看你如何安排自己的参与。'},
      {title: 'Agent 生态改造倾向', left: '适应现有系统', right: '为 Agent 改造', description: '从内部习惯、跨组织协作和基础设施投入，看你愿意为 Agent 改变多少。'}
    ],
    evidence: n => `三道题中有 ${n} 道支持这一倾向`
  },
  en: {
    title: 'AI Inclination Test', intro: 'Choose the option closest to your judgment for each question.', nav: 'Question navigation', previous: 'Previous', next: 'Next', seeResult: 'See result', result: 'Your result', kicker: 'Your AI inclination', disclaimer: 'This reflects your choices in six scenarios. It is neither an assessment of ability nor a psychological diagnosis.', dimensions: 'Test dimensions', actions: 'Result actions', review: 'Edit answers', restart: 'Start again', share: 'Share result', retry: 'Try generating again', strong: 'Strong lean', slight: 'Slight lean', high: 'High agent adoption', low: 'Low agent adoption', handsOn: 'Stay involved', handsOff: 'Delegate goals', position: 'Your position', coordinateLabel: 'Inclination map', orientation: 'Left: hands-on. Right: hands-off. Top: high agent adoption. Bottom: low agent adoption.', close: 'Close', generating: 'Generating image…', saveHint: 'Save the image, or touch and hold it to share.', save: 'Save image', shareImage: 'Share image', shareUnavailable: 'Direct sharing is unavailable. You can save the image instead.', imageFailed: 'Could not generate the image. Please close and try again.', imageAlt: 'result image with commentary, two test dimensions, and questionnaire QR code', invite: 'What would you choose?', scan: 'Scan to answer six questions.', language: 'Switch to Chinese',
    axes: [
      {title: 'Human involvement', left: 'Delegate goals', right: 'Stay involved', description: 'How you choose to participate through creative control, skill retention, and understanding the process.'},
      {title: 'Agent ecosystem adaptation', left: 'Adapt to existing systems', right: 'Redesign for agents', description: 'How much you would change for agents: team practices, collaboration across organizations, and infrastructure.'}
    ],
    evidence: n => `${n} of three answers support this inclination`
  }
};

export function initialLanguage() {
  try {const saved = localStorage.getItem('ai-test-language'); if (saved === 'zh' || saved === 'en') return saved;} catch {}
  return (navigator.languages?.[0] || navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function rememberLanguage(language) {
  try {localStorage.setItem('ai-test-language', language);} catch {}
}

export function content(language) {
  return {ui: ui[language], questions: language === 'zh' ? questions : englishQuestions,
    profiles: language === 'zh' ? profiles : Object.fromEntries(Object.entries(profiles).map(([key, profile]) => [key, {...profile, ...englishProfiles[key]}]))};
}
