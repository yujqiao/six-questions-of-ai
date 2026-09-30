import {score} from './data.js';
import {content, initialLanguage, rememberLanguage} from './locale.js';

const app = document.querySelector('#app');
const count = document.querySelector('#page-count');
const footer = document.querySelector('#footer');
const languageToggle = document.querySelector('#language-toggle');
let language = initialLanguage();
let {ui, questions, profiles} = content(language);
let answers = Array(6).fill(null);
let current = 0;
let resultVisible = false;

function updateLanguage(){
  ({ui, questions, profiles} = content(language));
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelector('.wordmark').textContent = ui.title;
  document.querySelector('meta[name="description"]').content = `${ui.title}. ${ui.intro}`;
  languageToggle.textContent = language === 'zh' ? 'EN' : '中文';
  languageToggle.setAttribute('aria-label', ui.language);
  languageToggle.lang = language === 'zh' ? 'en' : 'zh-CN';
}
languageToggle.addEventListener('click',()=>{
  language = language === 'zh' ? 'en' : 'zh';
  rememberLanguage(language);
  updateLanguage();
  if(resultVisible)renderResult(false);else renderQuestion(false);
});

function focusHeading(){ app.querySelector('h1').focus({preventScroll:true}); window.scrollTo(0,0); }
function renderQuestion(focus = true){
  resultVisible = false;
  document.body.className = '';
  document.body.removeAttribute('style');
  document.title = ui.title;
  count.textContent = `${String(current+1).padStart(2,'0')} / 06`;
  footer.textContent = ui.intro;
  const question = questions[current];
  app.innerHTML = `<section aria-labelledby="question-title"><h1 id="question-title" tabindex="-1">${question.text}</h1><form><fieldset aria-labelledby="question-title"><div class="options">${question.options.map((text,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${answers[current]===i?'checked':''}><span class="letter" aria-hidden="true">${i===0?'A':'B'}</span><span class="option-text">${text}</span></label>`).join('')}</div></fieldset><nav class="navigation" aria-label="${ui.nav}"><button class="button secondary" type="button" id="previous" ${current===0?'disabled':''}>${ui.previous}</button><button class="button" type="submit" id="next" ${answers[current]===null?'disabled':''}>${current===5?ui.seeResult:ui.next}</button></nav></form></section>`;
  app.querySelector('form').addEventListener('change',e=>{ if(e.target.name==='answer'){answers[current]=Number(e.target.value);app.querySelector('#next').disabled=false;} });
  app.querySelector('#previous').addEventListener('click',()=>{if(current>0){current--;renderQuestion();}});
  app.querySelector('form').addEventListener('submit',e=>{e.preventDefault();if(answers[current]===null)return;if(current===5)renderResult();else{current++;renderQuestion();}});
  if(focus)focusHeading();
}

function dimension(title, value, left, right, explanation){
  const side = value>=2?right:left;
  const strength = value===0||value===3?ui.strong:ui.slight;
  return `<div class="dimension"><div class="dimension-head"><span>${title}</span><strong>${strength} · ${side}</strong></div><div class="track" role="img" aria-label="${title}: ${strength} · ${side}. ${ui.evidence(Math.max(value,3-value))}"><i class="tick"></i><i class="tick"></i><i class="tick"></i><i class="tick"></i><span class="marker" style="--position:${value/3*100}%"></span></div><div class="ends"><span>${left}</span><span>${right}</span></div><p class="dimension-description">${explanation}</p></div>`;
}

function coordinatePlane(h, p, key){
  const x = 90 - h / 3 * 80;
  const y = 90 - p / 3 * 80;
  const hDirection = h >= 2 ? ui.axes[0].right : ui.axes[0].left;
  const pDirection = p >= 2 ? ui.axes[1].right : ui.axes[1].left;
  const strength = value => value === 0 || value === 3 ? ui.strong : ui.slight;
  const summary = `${strength(h)} · ${hDirection}; ${strength(p)} · ${pDirection}`;
  return `<figure class="coordinate-chart" aria-label="${ui.coordinateLabel}: ${profiles[key].name}. ${summary}. ${ui.orientation}"><div class="plane-pole"><strong>${ui.high}</strong><span>${ui.axes[1].right}</span></div><div class="coordinate-plane" aria-hidden="true"><div class="quadrants">${['technical','autonomous','pure','reform'].map(k=>`<div class="quadrant ${key===k?'active':''}" data-profile="${k}"><span>${profiles[k].name}</span></div>`).join('')}</div><span class="plane-axis horizontal"></span><span class="plane-axis vertical"></span><span class="coordinate-point" style="left:${x}%;top:${y}%" data-h="${h}" data-p="${p}"></span></div><div class="plane-horizontal-labels"><span>Hands-on<span>${ui.handsOn}</span></span><span>Hands-off<span>${ui.handsOff}</span></span></div><div class="plane-pole bottom-pole"><strong>${ui.low}</strong><span>${ui.axes[1].left}</span></div><figcaption><span class="point-key" aria-hidden="true"></span><span>${ui.position}</span></figcaption></figure>`;
}

function renderResult(focus = true){
  const {h,p,key}=score(answers);
  const profile=profiles[key];
  resultVisible=true;
  document.body.className='result';
  document.body.style.setProperty('--accent',profile.color);
  document.body.style.setProperty('--wash',profile.wash);
  document.title=`${profile.name} · ${ui.title}`;
  count.textContent=ui.result;
  footer.textContent=ui.disclaimer;
  app.innerHTML=`<section aria-labelledby="result-title"><div class="result-heading"><p class="kicker">${ui.kicker}</p><h1 id="result-title" class="result-title" tabindex="-1">${profile.name}</h1><p class="subtitle">${profile.subtitle}</p></div><p class="commentary">${profile.note}</p><section aria-labelledby="dimensions-title"><h2 class="section-title" id="dimensions-title">${ui.dimensions}</h2><div class="result-measures"><div class="dimensions">${ui.axes.map((axis,i)=>dimension(axis.title,i===0?h:p,axis.left,axis.right,axis.description)).join('')}</div>${coordinatePlane(h,p,key)}</div></section><nav class="navigation result-actions" aria-label="${ui.actions}"><button type="button" class="button secondary" id="review">${ui.review}</button><button type="button" class="button secondary" id="restart">${ui.restart}</button><button type="button" class="button" id="share-result">${ui.share}</button></nav></section>`;
  app.querySelector('#share-result').addEventListener('click',async e=>{
    const button=e.currentTarget;button.disabled=true;
    try{const {openResultShare}=await import('./share.js');await openResultShare({h,p,key,language},button);}
    catch{button.textContent=ui.retry;}
    finally{button.disabled=false;}
  });
  app.querySelector('#review').addEventListener('click',()=>{current=0;renderQuestion();});
  app.querySelector('#restart').addEventListener('click',()=>{answers=Array(6).fill(null);current=0;renderQuestion();});
  if(focus)focusHeading();
}
updateLanguage();
renderQuestion(false);

// Optional structured access uses the same validation and state as the form.
const context=document.modelContext;
if(context?.registerTool){
  const lifecycle=new AbortController();
  const tool={name:'submit_ai_inclination_answers',title:'提交 AI 倾向测试答案',description:'仅在用户明确提供六道题答案后提交问卷并显示结果。不要代用户推测答案。按题号顺序传入 A 或 B；返回分类和两个维度分数。',inputSchema:{type:'object',properties:{answers:{type:'array',items:{type:'string',enum:['A','B']},minItems:6,maxItems:6}},required:['answers'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).some(k=>k!=='answers')||!Array.isArray(input.answers)||input.answers.length!==6||!input.answers.every(a=>a==='A'||a==='B'))throw new Error('请按顺序提供六个 A 或 B。');const next=input.answers.map(a=>a==='A'?0:1);const result=score(next);answers=next;renderResult();return{classification:profiles[result.key].name,h:result.h,p:result.p};}};
  try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
