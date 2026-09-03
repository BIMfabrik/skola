const state = {
  selectedAge: 'all',
  stars: Number(localStorage.getItem('skolaStars') || 24),
  completed: new Set(JSON.parse(localStorage.getItem('skolaCompleted') || '[1]')),
  lesson: null,
  selectedAnswer: null,
  checked: false,
  lessonStars: 0,
};

const lessons = {
  1: {
    title: 'Meet the shapes', kicker: 'WORLD 1 · MEET THE SHAPES',
    questions: [
      { prompt: 'Which one is a <strong>circle</strong>?', hint: 'A circle is round and has no corners.', type:'shape', options:['square','circle','triangle','diamond'], answer:1 },
      { prompt: 'Which one has <strong>3 sides</strong>?', hint: 'Count the straight edges.', type:'shape', options:['circle','square','diamond','triangle'], answer:3 }
    ]
  },
  2: {
    title: 'Split it!', kicker: 'WORLD 2 · SPLIT IT!',
    questions: [
      { prompt:'Tap the picture that shows <strong>one half</strong>.', hint:'One half means 2 equal pieces, with 1 piece selected.', type:'fraction', options:[{parts:2,fill:1},{parts:3,fill:1},{parts:4,fill:1},{parts:4,fill:2}], answer:0 },
      { prompt:'Now find <strong>one third</strong>.', hint:'Three equal pieces. Select just one.', type:'fraction', options:[{parts:2,fill:1},{parts:3,fill:2},{parts:3,fill:1},{parts:4,fill:1}], answer:2 },
      { prompt:'Which picture shows <strong>three quarters</strong>?', hint:'Four equal pieces, with three selected.', type:'fraction', options:[{parts:4,fill:2},{parts:4,fill:3},{parts:3,fill:2},{parts:2,fill:1}], answer:1 }
    ]
  },
  3: {
    title:'Mirror magic', kicker:'WORLD 3 · MIRROR MAGIC',
    questions:[{ prompt:'Which shape has the clearest <strong>mirror symmetry</strong>?', hint:'Imagine folding it down the middle.', type:'shape', options:['diamond','circle','triangle','square'], answer:1 }]
  },
  4: {
    title:'Walk the edge', kicker:'WORLD 4 · WALK THE EDGE',
    questions:[{ prompt:'A square has sides of 4 cm. What is its <strong>perimeter</strong>?', hint:'Walk around all four sides: 4 + 4 + 4 + 4.', type:'text', options:['8 cm','12 cm','16 cm','20 cm'], answer:2 }]
  },
  5: {
    title:'Fill the floor', kicker:'WORLD 5 · FILL THE FLOOR',
    questions:[{ prompt:'A rectangle is 3 squares wide and 4 high. What is its <strong>area</strong>?', hint:'Area counts the squares inside.', type:'text', options:['7','10','12','14'], answer:2 }]
  },
  6: {
    title:'Turn & measure', kicker:'WORLD 6 · TURN & MEASURE',
    questions:[{ prompt:'Which picture is closest to a <strong>right angle</strong>?', hint:'A right angle is exactly 90°.', type:'angle', options:[45,90,120,160], answer:1 }]
  },
  7: {
    title:'Triangle lab', kicker:'WORLD 7 · TRIANGLE LAB',
    questions:[{ prompt:'A triangle always has how many <strong>angles</strong>?', hint:'Trace each corner with your finger.', type:'text', options:['2','3','4','5'], answer:1 }]
  },
  8: {
    title:'Map the point', kicker:'WORLD 8 · MAP THE POINT',
    questions:[{ prompt:'Coordinates are written in which order?', hint:'First move sideways, then up or down.', type:'text', options:['(y, x)','(x, y)','(x + y)','(x ÷ y)'], answer:1 }]
  },
  9: {
    title:'The secret side', kicker:'WORLD 9 · THE SECRET SIDE',
    questions:[{ prompt:'For a right triangle, which rule finds the longest side?', hint:'It connects the squares built on all three sides.', type:'text', options:['a+b=c','a²+b²=c²','2a+2b=c','a×b=c²'], answer:1 }]
  },
  10: {
    title:'Triangle powers', kicker:'WORLD 10 · TRIANGLE POWERS',
    questions:[{ prompt:'In a right triangle, <strong>sin(θ)</strong> compares which sides?', hint:'SOH: sine = opposite ÷ hypotenuse.', type:'text', options:['opposite / hypotenuse','adjacent / hypotenuse','opposite / adjacent','hypotenuse / adjacent'], answer:0 }]
  }
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const overlay = $('#lessonOverlay');

function save() {
  localStorage.setItem('skolaStars', state.stars);
  localStorage.setItem('skolaCompleted', JSON.stringify([...state.completed]));
}
function updateDashboard() {
  $('#starCount').textContent = state.stars;
  const completeCount = state.completed.size;
  $('#courseProgress').style.width = `${Math.min(100, completeCount * 10)}%`;
  $('#progressText').textContent = `${completeCount} of 10 worlds explored`;
  $$('.level-card').forEach(card => {
    const n = Number(card.dataset.level);
    card.classList.toggle('completed', state.completed.has(n));
    card.classList.toggle('current', !state.completed.has(n) && n === Math.min(10, Math.max(...state.completed, 0) + 1));
    const node = card.querySelector('.level-node span');
    if (state.completed.has(n)) node.textContent = '✓'; else node.textContent = n;
  });
}
function toast(message) {
  const t = $('#toast'); t.textContent = message; t.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 1900);
}
function filterAge(age) {
  state.selectedAge = age;
  $$('.segmented button').forEach(b => b.classList.toggle('active', b.dataset.age === age));
  $$('.level-card').forEach(card => card.classList.toggle('filtered-out', age !== 'all' && card.dataset.age !== age));
}
function switchSubject(name) {
  if (name === 'geometry') return;
  toast(`${name[0].toUpperCase()+name.slice(1)} is ready for the next prototype step.`);
}

function openLesson(level) {
  const lesson = lessons[level]; if (!lesson) return;
  state.lesson = { level, index:0, data:lesson };
  state.selectedAnswer = null; state.checked = false; state.lessonStars = 0;
  overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  renderQuestion();
  setTimeout(() => $('#closeLesson').focus(), 60);
}
function closeLesson() {
  overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow=''; state.lesson=null;
}
function renderQuestion() {
  const {data,index} = state.lesson; const q=data.questions[index];
  state.selectedAnswer=null; state.checked=false;
  $('#lessonKicker').textContent=data.kicker;
  $('#lessonTitle').innerHTML=q.prompt;
  $('#lessonHint').textContent=q.hint;
  $('#lessonProgressBar').style.width=`${(index/data.questions.length)*100}%`;
  $('#lessonStars').textContent=state.lessonStars;
  $('#feedback').className='feedback'; $('#feedback').innerHTML='';
  const button=$('#continueButton'); button.textContent='Check'; button.disabled=true;
  const grid=$('#challengeGrid'); grid.innerHTML='';
  q.options.forEach((opt,i)=>{
    const card=document.createElement('button'); card.className='answer-card'; card.dataset.index=i;
    card.setAttribute('aria-label', `Answer ${i+1}`);
    card.innerHTML=renderOption(q.type,opt);
    card.addEventListener('click',()=>selectAnswer(i)); grid.appendChild(card);
  });
}
function renderOption(type,opt) {
  if(type==='fraction') {
    const cls=`cols-${opt.parts}`;
    const cells=Array.from({length:opt.parts},(_,i)=>`<span class="cell ${i<opt.fill?'fill':''}"></span>`).join('');
    return `<div class="fraction-shape ${cls}">${cells}</div>`;
  }
  if(type==='shape') return `<div class="shape-answer"><span class="${opt}"></span></div>`;
  if(type==='angle') return `<div class="angle-answer" style="--angle:-${opt}deg"><span>${opt}°</span></div>`;
  return `<div class="text-answer">${opt}</div>`;
}
function selectAnswer(i) {
  if(state.checked) return;
  state.selectedAnswer=i;
  $$('.answer-card').forEach((c,idx)=>c.classList.toggle('selected',idx===i));
  $('#continueButton').disabled=false;
}
function checkOrContinue() {
  if(!state.lesson) return;
  const {data,index,level}=state.lesson; const q=data.questions[index]; const btn=$('#continueButton');
  if(!state.checked) {
    state.checked=true;
    const correct=state.selectedAnswer===q.answer;
    const cards=$$('.answer-card');
    cards[q.answer].classList.add('correct');
    if(correct) {
      state.lessonStars+=1; $('#lessonStars').textContent=state.lessonStars;
      $('#feedback').className='feedback success'; $('#feedback').innerHTML='<span class="feedback-icon">✓</span><span>Nice. You saw it.</span>';
      burst();
    } else {
      cards[state.selectedAnswer].classList.add('wrong');
      $('#feedback').className='feedback error'; $('#feedback').innerHTML='<span class="feedback-icon">↻</span><span>Almost — compare the equal parts.</span>';
    }
    const last=index===data.questions.length-1;
    btn.textContent=last?'Finish':'Continue'; btn.disabled=false;
  } else {
    const last=index===data.questions.length-1;
    if(last) finishLesson(level); else { state.lesson.index+=1; renderQuestion(); }
  }
}
function finishLesson(level) {
  const newlyCompleted=!state.completed.has(level);
  state.completed.add(level);
  if(newlyCompleted) state.stars += state.lessonStars;
  save(); updateDashboard();
  $('#lessonProgressBar').style.width='100%';
  burst(true); closeLesson();
  toast(`World complete · +${newlyCompleted?state.lessonStars:0} stars`);
}
function burst(big=false) {
  const layer=$('#confettiLayer'); const colors=['#6755e7','#5bbf9c','#ffb84d','#eb6c9d','#5d9df5'];
  const count=big?34:18;
  for(let i=0;i<count;i++){
    const el=document.createElement('i'); el.className='confetti';
    const a=(Math.PI*2*i/count)+(Math.random()*.3); const r=(big?220:130)+Math.random()*100;
    el.style.setProperty('--x',`${Math.cos(a)*r}px`);el.style.setProperty('--y',`${Math.sin(a)*r}px`);el.style.setProperty('--r',`${Math.random()*140}deg`);el.style.setProperty('--c',colors[i%colors.length]);layer.appendChild(el);setTimeout(()=>el.remove(),900);
  }
}

$$('.level-card').forEach(card=>card.addEventListener('click',()=>openLesson(Number(card.dataset.level))));
$$('.segmented button').forEach(btn=>btn.addEventListener('click',()=>filterAge(btn.dataset.age)));
$$('.subject').forEach(btn=>btn.addEventListener('click',()=>switchSubject(btn.dataset.subject)));
$('#closeLesson').addEventListener('click',closeLesson);
$('#continueButton').addEventListener('click',checkOrContinue);
overlay.addEventListener('click',(e)=>{ if(e.target===overlay) closeLesson(); });
window.addEventListener('keydown',(e)=>{ if(e.key==='Escape'&&state.lesson) closeLesson(); });
$('#homeButton').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
$('#resetProgress').addEventListener('click',()=>{ state.completed=new Set([1]);state.stars=24;save();updateDashboard();toast('Demo progress reset'); });
updateDashboard();
