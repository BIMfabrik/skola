const state={stars:Number(localStorage.getItem('skolaStars')||0),completed:new Set(JSON.parse(localStorage.getItem('skolaCompleted')||'[]')),game:null,gameStars:0};
const C={purple:'#7b68eb',mint:'#66c7a6',pink:'#ef7da5',yellow:'#ffc65d',blue:'#65a7f4'};
const lessons={
1:[
 {type:'shape',target:'circle',options:['triangle','square','circle','diamond'],answer:2},
 {type:'shape',target:'triangle',options:['circle','diamond','square','triangle'],answer:3},
 {type:'shape',target:'square',options:['square','triangle','circle','diamond'],answer:0}
],
2:[
 {type:'fraction',target:{parts:2,fill:1},options:[{parts:3,fill:1},{parts:2,fill:1},{parts:4,fill:1},{parts:4,fill:3}],answer:1},
 {type:'fraction',target:{parts:3,fill:1},options:[{parts:4,fill:1},{parts:3,fill:2},{parts:3,fill:1},{parts:2,fill:1}],answer:2},
 {type:'fraction',target:{parts:4,fill:3},options:[{parts:4,fill:2},{parts:3,fill:2},{parts:2,fill:1},{parts:4,fill:3}],answer:3}
],
3:[
 {type:'sym',target:{c1:C.pink,c2:C.pink},options:[{c1:C.pink,c2:C.blue},{c1:C.pink,c2:C.pink},{c1:C.blue,c2:C.yellow},{c1:C.mint,c2:C.purple}],answer:1},
 {type:'sym',target:{c1:C.blue,c2:C.blue},options:[{c1:C.yellow,c2:C.blue},{c1:C.blue,c2:C.blue},{c1:C.blue,c2:C.pink},{c1:C.mint,c2:C.blue}],answer:1}
],
4:[
 {type:'shape',target:'diamond',options:['square','circle','diamond','triangle'],answer:2},
 {type:'shape',target:'square',options:['triangle','square','diamond','circle'],answer:1}
],
5:[
 {type:'tiles',target:4,options:[3,5,4,6],answer:2},
 {type:'tiles',target:6,options:[5,6,7,4],answer:1},
 {type:'tiles',target:8,options:[6,7,9,8],answer:3}
],
6:[
 {type:'angle',target:90,options:[45,120,90,155],answer:2},
 {type:'angle',target:45,options:[90,45,135,165],answer:1},
 {type:'angle',target:135,options:[45,90,135,165],answer:2}
],
7:[
 {type:'triangle',target:'wide',options:['tall','wide','right','tiny'],answer:1},
 {type:'triangle',target:'right',options:['wide','tall','tiny','right'],answer:3}
],
8:[
 {type:'grid',target:{x:70,y:30},options:[{x:30,y:30},{x:70,y:70},{x:70,y:30},{x:30,y:70}],answer:2},
 {type:'grid',target:{x:30,y:70},options:[{x:70,y:30},{x:30,y:70},{x:30,y:30},{x:70,y:70}],answer:1}
],
9:[
 {type:'math',target:'purple',options:['mint','yellow','purple','pink'],answer:2},
 {type:'math',target:'yellow',options:['yellow','pink','purple','mint'],answer:0}
],
10:[
 {type:'ratio',target:{top:C.pink,bottom:C.purple},options:[{top:C.mint,bottom:C.purple},{top:C.pink,bottom:C.yellow},{top:C.pink,bottom:C.purple},{top:C.purple,bottom:C.pink}],answer:2},
 {type:'ratio',target:{top:C.yellow,bottom:C.mint},options:[{top:C.yellow,bottom:C.mint},{top:C.mint,bottom:C.yellow},{top:C.pink,bottom:C.mint},{top:C.yellow,bottom:C.purple}],answer:0}
]};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const game=$('#game');
function save(){localStorage.setItem('skolaStars',state.stars);localStorage.setItem('skolaCompleted',JSON.stringify([...state.completed]));}
function dashboard(){
 $('#starCount').textContent=state.stars;
 const dots=$('#progressDots');dots.innerHTML='';
 for(let i=1;i<=10;i++){const d=document.createElement('i');if(state.completed.has(i))d.className='done';dots.appendChild(d)}
 const next=Math.min(10,Math.max(1,(state.completed.size?Math.max(...state.completed):0)+1));
 $$('.level').forEach(el=>{const n=+el.dataset.level;el.classList.toggle('completed',state.completed.has(n));el.classList.toggle('current',!state.completed.has(n)&&n===next);el.querySelector('.mini-stars').textContent=state.completed.has(n)?'★★★':''});
}
function tone(ok=true){
 try{const A=window.AudioContext||window.webkitAudioContext;const ctx=tone.ctx||(tone.ctx=new A());const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type='sine';o.frequency.setValueAtTime(ok?620:190,ctx.currentTime);if(ok)o.frequency.exponentialRampToValueAtTime(920,ctx.currentTime+.12);g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.12,ctx.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.22);o.start();o.stop(ctx.currentTime+.23)}catch(e){}
}
function spark(big=false){const layer=$('#sparkles'),cols=[C.purple,C.mint,C.pink,C.yellow,C.blue],count=big?36:18;for(let i=0;i<count;i++){const s=document.createElement('i');s.className='spark';const a=Math.PI*2*i/count+Math.random()*.25,r=(big?210:120)+Math.random()*90;s.style.setProperty('--x',`${Math.cos(a)*r}px`);s.style.setProperty('--y',`${Math.sin(a)*r}px`);s.style.setProperty('--r',`${Math.random()*300}deg`);s.style.setProperty('--c',cols[i%cols.length]);layer.appendChild(s);setTimeout(()=>s.remove(),800)}}
function visual(type,v){
 if(type==='shape')return `<div class="visual"><span class="v-${v}"></span></div>`;
 if(type==='fraction'){let x='';for(let i=0;i<v.parts;i++)x+=`<span class="${i<v.fill?'fill':''}"></span>`;return `<div class="visual"><div class="v-frac p${v.parts}">${x}</div></div>`}
 if(type==='sym')return `<div class="visual"><div class="v-sym" style="--c1:${v.c1};--c2:${v.c2}"><i></i><b></b></div></div>`;
 if(type==='tiles'){let x='';for(let i=0;i<9;i++)x+=`<i class="${i<v?'fill':''}"></i>`;return `<div class="visual"><div class="v-tiles">${x}</div></div>`}
 if(type==='angle')return `<div class="visual"><div class="v-angle" style="--a:-${v}deg"></div></div>`;
 if(type==='triangle'){const dims={wide:[50,72],tall:[38,96],right:[52,82],tiny:[33,60]}[v];return `<div class="visual"><span style="width:0;height:0;border-left:${dims[0]}px solid transparent;border-right:${v==='right'?0:dims[0]}px solid transparent;border-bottom:${dims[1]}px solid ${C.yellow};display:block"></span></div>`}
 if(type==='grid')return `<div class="visual"><div class="v-grid"><i style="--x:${v.x}%;--y:${v.y}%"></i></div></div>`;
 if(type==='math'){const col=C[v];return `<div class="visual"><div class="v-math"><span class="sq" style="background:${col}"></span><span>²</span><span>+</span><span class="sq yellow"></span><span>²</span></div></div>`}
 if(type==='ratio')return `<div class="visual"><div class="v-ratio" style="--top:${v.top};--bottom:${v.bottom}"><i></i><em></em><b></b></div></div>`;
 return '';
}
function openGame(level){state.game={level,index:0};state.gameStars=0;game.classList.add('open');game.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';render();}
function closeGame(){game.classList.remove('open');game.setAttribute('aria-hidden','true');document.body.style.overflow='';state.game=null;}
function render(){
 const qs=lessons[state.game.level],q=qs[state.game.index];$('#gameStars').textContent=state.gameStars;
 const pg=$('#gameProgress');pg.innerHTML='';qs.forEach((_,i)=>{const d=document.createElement('i');if(i<state.game.index)d.className='done';pg.appendChild(d)});
 $('#target').innerHTML=visual(q.type,q.target);$('#gesture').style.display=state.game.index===0?'block':'none';
 const box=$('#choices');box.innerHTML='';q.options.forEach((o,i)=>{const b=document.createElement('button');b.className='choice';b.setAttribute('aria-label',`Choice ${i+1}`);b.innerHTML=visual(q.type,o);b.onclick=()=>choose(b,i,q,qs);box.appendChild(b)});
}
function choose(btn,i,q,qs){if(btn.dataset.locked)return;$$('.choice').forEach(x=>x.dataset.locked='1');if(i===q.answer){btn.classList.add('correct');state.gameStars++;$('#gameStars').textContent=state.gameStars;tone(true);spark();setTimeout(()=>{if(!state.game)return;if(state.game.index===qs.length-1)finish();else{state.game.index++;render()}},650)}else{btn.classList.add('wrong');tone(false);setTimeout(()=>{$$('.choice').forEach(x=>delete x.dataset.locked);btn.classList.remove('wrong')},430)}}
function finish(){const level=state.game.level,newOne=!state.completed.has(level);state.completed.add(level);if(newOne)state.stars+=state.gameStars;save();dashboard();tone(true);setTimeout(()=>tone(true),90);spark(true);setTimeout(closeGame,850)}
$$('.level').forEach(b=>b.onclick=()=>openGame(+b.dataset.level));
$('#closeGame').onclick=closeGame;game.onclick=e=>{if(e.target===game)closeGame()};
$('#homeButton').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
$$('.subject').forEach(b=>b.onclick=()=>{if(b.dataset.subject==='geometry')return;const old=b.style.transform;b.style.transform='scale(.88) rotate(-5deg)';setTimeout(()=>b.style.transform=old,220);tone(false)});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.game)closeGame()});
dashboard();
