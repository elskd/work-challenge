const KEY="webDesigner150kGame";
const GOAL=150000;
const TOTAL_DAYS=90;
const XP_PER_TASK=10;

const base={
  money:0,
  tasks:{},
  nextId:1
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(base);
let start=localStorage.getItem(KEY+"_start");
if(!start){start=new Date().toISOString().slice(0,10);localStorage.setItem(KEY+"_start",start)}

const $=s=>document.querySelector(s);
const rub=n=>new Intl.NumberFormat("ru-RU").format(Math.max(0,Math.round(n)))+" ₽";
const dateFrom=(iso,add)=>{
  const d=new Date(iso+"T00:00:00Z");
  d.setUTCDate(d.getUTCDate()+add);
  return d.toISOString().slice(0,10);
};
const todayISO=()=>new Date().toISOString().slice(0,10);
const currentDay=()=>{
  const a=new Date(start+"T00:00:00Z"),b=new Date(todayISO()+"T00:00:00Z");
  return Math.min(TOTAL_DAYS,Math.max(1,Math.floor((b-a)/86400000)+1));
};
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));

function allTasks(){return Object.values(state.tasks).flat()}
function xp(){return allTasks().filter(t=>t.done).length*XP_PER_TASK}
function level(){return Math.floor(xp()/100)+1}
function streak(){
  let s=0;
  for(let d=currentDay();d>=1;d--){
    const tasks=state.tasks[d]||[];
    if(tasks.length&&tasks.every(t=>t.done))s++;else break;
  }
  return s;
}
function dayDone(d){
  const t=state.tasks[d]||[];
  return t.length>0&&t.every(x=>x.done);
}

function render(){
  const d=currentDay(), x=xp(), tasks=state.tasks[d]||[];
  const moneyPct=Math.min(100,state.money/GOAL*100);
  $("#dayLabel").textContent=`DAY ${d} / ${TOTAL_DAYS}`;
  $("#levelLabel").textContent=`LEVEL ${level()} · ${x} XP`;
  $("#money").textContent=rub(state.money);
  $("#moneyProgress").style.width=moneyPct+"%";
  $("#xp").textContent=x;
  $("#streak").textContent=streak();
  $("#done").textContent=allTasks().filter(t=>t.done).length;
  const completed=tasks.filter(t=>t.done).length;
  $("#taskCount").textContent=`${completed} / ${tasks.length}`;
  $("#tasks").innerHTML=tasks.length?tasks.map(t=>`
    <label class="task ${t.done?"done":""}">
      <input type="checkbox" data-id="${t.id}" ${t.done?"checked":""}>
      <span class="task-text">${escapeHtml(t.text)}</span>
      <button class="delete" type="button" data-delete="${t.id}" aria-label="Удалить">×</button>
    </label>`).join(""):'<div class="empty">Пока нет задач. Добавь первую.</div>';
  document.querySelectorAll("#tasks input").forEach(el=>el.addEventListener("change",()=>{
    const t=tasks.find(t=>String(t.id)===el.dataset.id);
    if(t){t.done=el.checked;save();render()}
  }));
  document.querySelectorAll("[data-delete]").forEach(el=>el.addEventListener("click",e=>{
    e.preventDefault();
    state.tasks[d]=tasks.filter(t=>String(t.id)!==el.dataset.delete);
    save();render();
  }));
  renderDays(d);
}
function renderDays(d){
  let completedDays=0;
  $("#days").innerHTML=Array.from({length:TOTAL_DAYS},(_,i)=>{
    const n=i+1,done=dayDone(n);
    if(done)completedDays++;
    return `<div class="day ${done?"done":""} ${n===d?"today":""}" title="День ${n}">${n}</div>`;
  }).join("");
  $("#calendarPercent").textContent=Math.round(completedDays/TOTAL_DAYS*100)+"%";
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}

$("#taskForm").addEventListener("submit",e=>{
  e.preventDefault();
  const input=$("#taskInput"),text=input.value.trim();
  if(!text)return;
  const d=currentDay();
  if(!state.tasks[d])state.tasks[d]=[];
  state.tasks[d].push({id:state.nextId++,text,done:false});
  input.value="";
  save();render();input.focus();
});

$("#resetBtn").addEventListener("click",()=>{
  if(confirm("Сбросить весь прогресс игры?")){
    state=structuredClone(base);
    start=todayISO();
    localStorage.setItem(KEY+"_start",start);
    save();render();
  }
});

$("#money").addEventListener("click",()=>{});
document.querySelector(".money").addEventListener("click",()=>{
  const value=prompt("Сколько денег добавить в прогресс?","50000");
  if(value===null)return;
  const n=Number(String(value).replace(/\\s/g,"").replace(",","."));
  if(Number.isFinite(n)&&n>0){state.money=Math.min(GOAL,state.money+n);save();render()}
});

render();
