import qrcode from './vendor/qrcode.js';
import {content} from './locale.js';

const quizURL = 'https://pages.yqiao.me/six-questions-of-ai/';
const sans = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
const serif = '"Songti SC", "STSong", "Noto Serif CJK SC", serif';

export async function createResultImage({h,p,key,language='zh'}) {
  await document.fonts.ready;
  const {profiles,ui} = content(language);
  const profile = profiles[key];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('浏览器暂不支持生成图片。');
  const width = 1080, margin = 76, contentWidth = width - margin * 2;
  const font = (size, family = sans, weight = 400) => { ctx.font = `${weight} ${size}px ${family}`; };
  const lines = (text, maxWidth) => {
    const result = []; let line = '';
    const tokens = language === 'en' ? text.match(/\S+\s*/g) || [] : [...text];
    for (const token of tokens) {
      if (line && ctx.measureText(line + token.trimEnd()).width > maxWidth && !'，。！？；：、」）》'.includes(token)) { result.push(line.trimEnd()); line = token; }
      else line += token;
    }
    if(line) result.push(line);
    return result;
  };
  font(34); const subtitleLines = lines(profile.subtitle, contentWidth);
  font(40,serif); const commentLines = lines(profile.note, contentWidth - 76);
  const commentTop = 278 + subtitleLines.length * 54;
  const commentHeight = commentLines.length * 66 + 68;
  const chartTop = commentTop + commentHeight + 150;
  const chartSize = 440, chartLeft = width - margin - chartSize;
  const footerTop = chartTop + chartSize + 170;
  const qr = qrcode(0,'M'); qr.addData(quizURL); qr.make();
  const modules=qr.getModuleCount(), cell=6, quiet=4, qrSize=(modules+quiet*2)*cell;
  canvas.width=width;canvas.height=footerTop+qrSize+76;
  ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textBaseline='top';ctx.fillStyle='#65676d';font(30);ctx.fillText(ui.title,margin,58);
  ctx.fillStyle='#e4e4e7';ctx.fillRect(margin,115,contentWidth,1);
  ctx.fillStyle=profile.color;font(72,serif,600);if(ctx.measureText(profile.name).width>contentWidth)font(72*contentWidth/ctx.measureText(profile.name).width,serif,600);ctx.fillText(profile.name,margin,164);
  ctx.fillStyle='#53555a';font(34);subtitleLines.forEach((line,i)=>ctx.fillText(line,margin,268+i*54));
  ctx.fillStyle=profile.wash;ctx.fillRect(margin,commentTop,contentWidth,commentHeight);
  ctx.fillStyle=profile.color;ctx.fillRect(margin,commentTop,3,commentHeight);
  ctx.fillStyle='#202124';font(40,serif);commentLines.forEach((line,i)=>ctx.fillText(line,margin+38,commentTop+34+i*66));
  font(30);ctx.fillStyle='#202124';ctx.fillText(ui.dimensions,margin,commentTop+commentHeight+48);
  ctx.textAlign='center';font(30,sans,500);ctx.fillText(ui.high,chartLeft+chartSize/2,chartTop-54);
  const quadrantKeys=['technical','autonomous','pure','reform'];
  quadrantKeys.forEach((k,i)=>{
    const x=chartLeft+(i%2)*chartSize/2,y=chartTop+Math.floor(i/2)*chartSize/2;
    if(k===key){ctx.fillStyle=profile.wash;ctx.fillRect(x,y,chartSize/2,chartSize/2);}
    ctx.fillStyle=k===key?profile.color:'#74767b';font(26,sans,k===key?600:400);
    const labelLines=lines(profiles[k].name,chartSize/2-24);
    labelLines.forEach((line,j)=>ctx.fillText(line,x+chartSize/4,y+chartSize/4-labelLines.length*17+j*34));
  });
  ctx.strokeStyle='#dedee2';ctx.lineWidth=2;ctx.strokeRect(chartLeft,chartTop,chartSize,chartSize);
  ctx.beginPath();ctx.moveTo(chartLeft+chartSize/2,chartTop);ctx.lineTo(chartLeft+chartSize/2,chartTop+chartSize);ctx.moveTo(chartLeft,chartTop+chartSize/2);ctx.lineTo(chartLeft+chartSize,chartTop+chartSize/2);ctx.stroke();
  const dotX=chartLeft+chartSize*(.9-h/3*.8),dotY=chartTop+chartSize*(.9-p/3*.8);
  ctx.beginPath();ctx.arc(dotX,dotY,18,0,2*Math.PI);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=profile.color;ctx.stroke();
  ctx.beginPath();ctx.arc(dotX,dotY,11,0,2*Math.PI);ctx.fillStyle=profile.color;ctx.fill();
  ctx.fillStyle='#202124';font(25);ctx.textAlign='left';ctx.fillText('Hands-on',chartLeft,chartTop+chartSize+24);
  ctx.textAlign='right';ctx.fillText('Hands-off',chartLeft+chartSize,chartTop+chartSize+24);
  ctx.textAlign='center';ctx.fillText(ui.low,chartLeft+chartSize/2,chartTop+chartSize+80);
  function drawDimension(title,value,left,right,y){
    const end=chartLeft-56,span=end-margin;
    ctx.textAlign='left';ctx.fillStyle='#202124';font(language==='en'?26:29,sans,500);ctx.fillText(title,margin,y);
    ctx.fillStyle=profile.color;font(language==='en'?23:25);const biasLines=lines(`${value===0||value===3?ui.strong:ui.slight} · ${value>=2?right:left}`,span);biasLines.forEach((line,i)=>ctx.fillText(line,margin,y+40+i*27));
    ctx.fillStyle='#dddde1';ctx.fillRect(margin,y+102,span,3);
    for(let i=0;i<4;i++)ctx.fillRect(margin+span*i/3,y+96,2,15);
    ctx.beginPath();ctx.arc(margin+span*value/3,y+103,9,0,2*Math.PI);ctx.fillStyle=profile.color;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#686a70';font(language==='en'?22:24);lines(left,span*.48).forEach((line,i)=>ctx.fillText(line,margin,y+130+i*27));ctx.textAlign='right';lines(right,span*.48).forEach((line,i)=>ctx.fillText(line,end,y+130+i*27));
  }
  ui.axes.forEach((axis,i)=>drawDimension(axis.title,i===0?h:p,axis.left,axis.right,chartTop+32+i*224));
  ctx.fillStyle='#e4e4e7';ctx.fillRect(margin,footerTop-35,contentWidth,1);
  const qrLeft=width-margin-qrSize;
  ctx.fillStyle='#fff';ctx.fillRect(qrLeft,footerTop,qrSize,qrSize);
  ctx.fillStyle='#191919';
  for(let row=0;row<modules;row++)for(let col=0;col<modules;col++)if(qr.isDark(row,col))ctx.fillRect(qrLeft+(col+quiet)*cell,footerTop+(row+quiet)*cell,cell,cell);
  ctx.textAlign='left';ctx.fillStyle='#202124';font(34,sans,500);ctx.fillText(ui.invite,margin,footerTop+44);
  ctx.fillStyle='#65676d';font(28);ctx.fillText(ui.scan,margin,footerTop+103);
  font(24);ctx.fillText(ui.title,margin,footerTop+153);
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('图片生成失败，请重试。')),'image/png'));
  return {blob,file:new File([blob],`${ui.title}-${profile.name}.png`,{type:'image/png'}),width:canvas.width,height:canvas.height};
}

export async function openResultShare(result, trigger=document.activeElement) {
  const {profiles,ui} = content(result.language || 'zh');
  const dialog=document.createElement('dialog');dialog.className='share-dialog';dialog.setAttribute('aria-labelledby','share-title');
  dialog.innerHTML=`<div class="share-header"><h2 id="share-title">${ui.share}</h2><button class="button secondary" id="share-close" type="button" autofocus>${ui.close}</button></div><p class="share-status" role="status">${ui.generating}</p><div class="share-preview"></div><div class="share-actions"></div>`;
  let imageURL=null;
  dialog.addEventListener('close',()=>{if(imageURL)URL.revokeObjectURL(imageURL);dialog.remove();if(trigger?.isConnected)trigger.focus();},{once:true});
  dialog.querySelector('#share-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  document.body.append(dialog);dialog.showModal();
  try {
    const {blob,file,width,height}=await createResultImage(result);
    if(!dialog.isConnected)return;
    imageURL=URL.createObjectURL(blob);
    const img=document.createElement('img');img.src=imageURL;img.width=width;img.height=height;img.alt=`${profiles[result.key].name}: ${ui.imageAlt}`;
    dialog.querySelector('.share-preview').append(img);
    const status=dialog.querySelector('.share-status');status.textContent=ui.saveHint;
    const actions=dialog.querySelector('.share-actions');
    const download=document.createElement('a');download.className='button';download.textContent=ui.save;download.href=imageURL;download.download=file.name;actions.append(download);
    if(navigator.canShare?.({files:[file]})){
      const share=document.createElement('button');share.className='button secondary';share.textContent=ui.shareImage;share.type='button';
      share.addEventListener('click',async()=>{try{await navigator.share({files:[file],title:ui.title});}catch(e){if(e.name!=='AbortError')status.textContent=ui.shareUnavailable;}});actions.append(share);
    }
  } catch {if(dialog.isConnected)dialog.querySelector('.share-status').textContent=ui.imageFailed;}
}
