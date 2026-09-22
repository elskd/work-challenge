const KEY="webDesigner150k";
const GOAL=150000, DAYS=90, DEFAULT_CHECK=50000;
const stages=["Новый лид","Контакт","Бриф","Предложение","Переговоры"];
const phases=[
 {name:"FOUNDATION",from:1,to:30,focus:"Позиционирование, сильный оффер, базовая система продаж и 2 первых кейса."},
 {name:"CLIENTS",from:31,to:60,focus:"Ежедневный поток лидов, созвоны, предложения и первые сделки."},
 {name:"150K",from:61,to:90,focus:"Удержание темпа, рост среднего чека, follow-up и закрытие цели."}
];
const daily=[
 ["Собрать 10 новых лидов","Продажи"],["Отправить 5 персональных сообщений","Продажи"],["Доделать один фрагмент кейса","Портфолио"],["45–90 минут обучения + практика","Навык"],["Сделать follow-up всем, кому уже писала","Продажи"]
];
const ninety=[
["Определить нишу и 3 типовых боли клиента","Стратегия"],["Сформулировать оффер: результат + срок + формат","Продажи"],["Собрать 20 потенциальных клиентов","Продажи"],["Разобрать 5 сайтов из своей ниши","Навык"],["Собрать структуру первого кейса","Портфолио"],["Сделать первый экран кейса","Портфолио"],["Написать 10 персональных сообщений","Продажи"],["Провести первый мини-аудит сайта","Продажи"],["Собрать шаблон КП","Продажи"],["Провести тренировочный созвон","Продажи"],["Опубликовать кейс","Портфолио"],["Получить первую обратную связь от лида","Продажи"],["Улучшить оффер по ответам клиентов","Стратегия"],["Сделать второй кейс","Портфолио"],["Поднять чек после первых результатов","Продажи"]
];
const portfolio=[
["01","Эксперт / личный бренд","Лендинг, который показывает экспертность и ведёт к заявке.","Концепт"],
["02","Недвижимость","Каталог + подбор объекта + сильный CTA.","Концепт"],
["03","Beauty / premium","Имиджевый сайт с записью на услугу.","Не начат"],
["04","Сервис / компания","Корпоративный сайт с понятным УТП.","Не начат"],
["05","Редизайн","До/после с разбором маркетинговых решений.","Не начат"]
];
const lessons=[
["01","Маркетинг сайта","ЦА, боли, JTBD, оффер, путь клиента.","2 ч"],
["02","Структура","Первый экран, логика блоков, доказательства, CTA.","2 ч"],
["03","UX / UI","Сетка, иерархия, композиция, типографика.","3 ч"],
["04","Figma","Auto Layout, компоненты, variables, prototype.","4 ч"],
["05","Tilda","Zero Block, адаптив, анимации, публикация.","4 ч"],
["06","Продажи","Цена, КП, созвон, возражения, закрытие.","3 ч"],
["07","Кейс","Как показывать не дизайн, а решение бизнес-задачи.","2 ч"],
["08","Холодный outreach","Как находить людей и писать персонально.","2 ч"]
];
const scripts=[
["Первое сообщение","Холодный контакт","Здравствуйте! Посмотрела ваш сайт/профиль. Вижу несколько точек, где потенциально можно сделать путь до заявки понятнее. Я занимаюсь дизайном сайтов и могу бесплатно показать 2–3 конкретных изменения именно для вашего проекта. Если интересно — пришлю короткий разбор."],
["Follow-up","Нет ответа","Здравствуйте! Возвращаюсь к сообщению выше. Я уже набросала для вашего проекта одну конкретную идею по первому экрану. Могу отправить — это займёт у вас минуту на просмотр."],
["После интереса","Перевод в созвон","Отлично. Тогда предлагаю не растягивать переписку: на коротком созвоне я задам несколько вопросов про задачу, покажу, что именно можно улучшить, и скажу ориентир по срокам и стоимости."],
["Презентация цены","Цена","По вашей задаче я бы закладывала сайт под ключ: структура, UX/UI-дизайн и сборка. Стоимость — X ₽, срок — Y дней. На выходе у вас не просто визуал, а готовый путь пользователя от первого экрана до целевого действия."],
["Возражение «дорого»","Цена","Понимаю. Тогда давайте разделим: что для вас сейчас самое важное — уложиться в конкретный бюджет или получить определённый результат? От этого я предложу формат, который имеет смысл именно для вашей ситуации."],
["Закрытие","Следующий шаг","Если формат подходит, я фиксирую задачу, отправляю договор/условия и после предоплаты ставлю проект в работу. Могу предложить ближайшую дату старта."]
];
const defaults={revenue:0,goalCheck:50000,actions:{},leads:[
{name:"Анна · эксперт",price:50000,stage:"Новый лид",next:"Отправить первое сообщение"},
{name:"Studio Forma",price:70000,stage:"Контакт",next:"Follow-up"},
{name:"Мария · психолог",price:45000,stage:"Бриф",next:"Уточнить задачу"},
{name:"North Agency",price:60000,stage:"Предложение",next:"Дожать до решения"},
{name:"Brand Lab",price:50000,stage:"Переговоры",next:"Согласовать старт"}
],plan:{}};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaults);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], rub=n=>new Intl.NumberFormat("ru-RU").format(Math.round(n))+" ₽";
const start=()=>{let x=localStorage.getItem("challengeStart");if(!x){x=Date.now();localStorage.setItem("challengeStart",x)}return +x};
const day=()=>Math.min(90,Math.max(1,Math.floor((Date.now()-start())/86400000)+1));
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function goalMath(){const check=state.goalCheck||DEFAULT_CHECK;const deals=Math.ceil(GOAL/check);const closeRate=.25;const qualified=Math.ceil(deals/closeRate);const contactRate=.4;const leads=Math.ceil(qualified/contactRate);return{check,deals,qualified,leads}}
function renderDashboard(){
 const pct=Math.min(100,state.revenue/GOAL*100), d=day(), m=goalMath(), done=Object.keys(state.actions).filter(k=>state.actions[k]).length;
 $("#revenue").textContent=rub(state.revenue);$("#revenuePercent").textContent=Math.round(pct)+"%";$("#mainProgress").style.width=pct+"%";$("#sideProgress").style.width=pct+"%";$("#sideRevenue").textContent=rub(state.revenue)+" / "+rub(GOAL);
 $("#dealCount").textContent=state.revenue?Math.max(1,Math.round(state.revenue/(state.goalCheck||DEFAULT_CHECK))):0;$("#avgCheck").textContent=state.revenue?rub(state.revenue/Math.max(1,Math.round(state.revenue/(state.goalCheck||DEFAULT_CHECK)))):"0 ₽";$("#daysLeft").textContent=Math.max(0,DAYS-d+1);$("#dayNumber").textContent=d;
 $("#goalMathTitle").textContent=m.deals+" сайта × "+rub(m.check);$("#goalCheck").textContent=rub(m.check);$("#goalDeals").textContent=m.deals;
 $("#actionCounter").textContent=done+" / 5";
 $("#todayActions").innerHTML=daily.map((a,i)=>{const k=d+"-"+i,checked=!!state.actions[k];return `<label class="action ${checked?"done":""}"><div><input type="checkbox" data-action="${k}" ${checked?"checked":""}></div><div><div class="action-title">${a[0]}</div><small>${a[1]}</small></div></label>`}).join("");
 $$("#todayActions input").forEach(x=>x.onchange=()=>{state.actions[x.dataset.action]=x.checked;save();renderDashboard();toast(x.checked?"Действие отмечено":"Действие возвращено")});
 const phase=phases.find(p=>d>=p.from&&d<=p.to)||phases[2];$("#funnel").innerHTML=stages.map(s=>{const c=state.leads.filter(l=>l.stage===s).length,w=Math.max(5,c/Math.max(1,state.leads.length)*100);return `<div class="funnel-row"><span>${s}</span><div class="funnel-bar"><i style="width:${w}%"></i></div><b>${c}</b></div>`}).join("");
 $("#dailyTarget").innerHTML=`<div><span class="eyebrow">НОРМА ДНЯ · ДЕНЬ ${d}</span><h3>${phase.name}: ${phase.focus}</h3><p>Минимум для темпа: 10 новых лидов → 5 сообщений → 1 follow-up блок → 1 час навыка.</p></div><div class="target-number">${m.leads}<small style="display:block;font-size:9px;color:#999;font-weight:500">лидов для цели</small></div><div class="target-meter progress large"><i style="width:${Math.min(100,done/5*100)}%"></i></div>`;
}
function renderPlan(){
 const d=day();const tasks=[...ninety,...ninety,...ninety].slice(0,90);
 $("#planList").innerHTML=tasks.map((x,i)=>{const n=i+1,checked=!!state.plan[n];return `<label class="plan-row ${n===d?"is-today":""}"><input type="checkbox" data-plan="${n}" ${checked?"checked":""}><div><strong>День ${n}: ${x[0]}</strong><small>${x[1]} · ${n<=30?"FOUNDATION":n<=60?"CLIENTS":"150K"}</small></div><span class="plan-tag">${n===d?"СЕГОДНЯ":"ДЕНЬ "+n}</span></label>`}).join("");
 $$("#planList input").forEach(x=>x.onchange=()=>{state.plan[x.dataset.plan]=x.checked;save()});
}
function renderLeads(){
 $("#pipeline").innerHTML=stages.map(stage=>`<div class="pipeline-col"><h3>${stage.toUpperCase()} · ${state.leads.filter(x=>x.stage===stage).length}</h3>${state.leads.filter(x=>x.stage===stage).map((l)=>`<div class="lead-card" data-lead="${state.leads.indexOf(l)}"><strong>${l.name}</strong><p>${l.next||"Следующий шаг не указан"}</p><div class="lead-price">${rub(l.price)}</div><select class="lead-stage" data-lead-select="${state.leads.indexOf(l)}">${stages.map(s=>`<option ${s===l.stage?"selected":""}>${s}</option>`).join("")}</select></div>`).join("")}</div>`).join("");
 $$(".lead-stage").forEach(x=>x.onchange=()=>{state.leads[+x.dataset.leadSelect].stage=x.value;save();renderAll();toast("Стадия обновлена")});
}
function renderPortfolio(){$("#portfolioGrid").innerHTML=portfolio.map(p=>`<article class="portfolio-card"><span class="project-status">${p[3]}</span><div class="project-num">${p[0]}</div><h3>${p[1]}</h3><p>${p[2]}</p></article>`).join("")}
function renderLearning(){$("#learningGrid").innerHTML=lessons.map(l=>`<article class="learning-card"><div class="lesson-meta"><span>УРОК ${l[0]}</span><span>${l[3]}</span></div><h3>${l[1]}</h3><p>${l[2]}</p><button class="text-btn" onclick="toast('Урок добавлен в фокус дня')">Начать урок →</button></article>`).join("")}
function renderScripts(){$("#scriptsGrid").innerHTML=scripts.map(s=>`<article class="script-card"><span class="script-label">${s[1]}</span><h3>${s[0]}</h3><p>${s[2]}</p><blockquote>${s[2]}</blockquote></article>`).join("")}
function renderAnalytics(){
 const m=goalMath(),leads=state.leads.length,briefs=state.leads.filter(l=>["Бриф","Предложение","Переговоры"].includes(l.stage)).length,offers=state.leads.filter(l=>["Предложение","Переговоры"].includes(l.stage)).length,avg=state.revenue?state.revenue/Math.max(1,Math.round(state.revenue/(state.goalCheck||DEFAULT_CHECK))):0;
 $("#statsGrid").innerHTML=[["Выручка",rub(state.revenue)],["Лиды",leads],["Квалифицированные",briefs],["Средний чек",avg?rub(avg):"—"]].map(s=>`<div class="stat"><span>${s[0]}</span><strong>${s[1]}</strong></div>`).join("");
 $("#funnelMath").innerHTML=`<div class="panel-head"><div><span class="eyebrow">МАТЕМАТИКА ПРОДАЖ</span><h2>Сколько действий нужно для 150K</h2></div></div><div class="funnel-math-grid"><div class="math-step"><span>Цель</span><strong>${rub(GOAL)}</strong></div><div class="math-step"><span>Сделки при чеке ${rub(m.check)}</span><strong>${m.deals}</strong></div><div class="math-step"><span>Нужно квалифицированных при 25%</span><strong>${m.qualified}</strong></div><div class="math-step"><span>Лидов при 40% квалификации</span><strong>${m.leads}</strong></div></div>`;
 const values=Array.from({length:30},(_,i)=>Math.max(3,Math.round((state.revenue/GOAL)*100*(i/29)**2)));$("#chart").innerHTML=values.map((v,i)=>`<div class="bar ${i===29?"hot":""}" style="height:${v}%"></div>`).join("");
}
function renderAll(){renderDashboard();renderPlan();renderLeads();renderPortfolio();renderLearning();renderScripts();renderAnalytics()}
function showView(id){$$(".view").forEach(v=>v.classList.toggle("active",v.id===id));$$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===id));window.scrollTo({top:0,behavior:"smooth"})}
$$("[data-view]").forEach(b=>b.onclick=()=>showView(b.dataset.view));$$("[data-view-target]").forEach(b=>b.onclick=()=>showView(b.dataset.viewTarget));
$("#addRevenueBtn").onclick=()=>{const v=Number(prompt("Сколько ₽ добавить в доход?","50000"));if(v>0){state.revenue+=v;save();renderAll();toast("Оплата добавлена")}};
$("#addLeadBtn").onclick=()=>{const name=prompt("Имя клиента / компания");if(!name)return;const price=Number(prompt("Потенциальный чек, ₽",String(state.goalCheck||DEFAULT_CHECK)))||DEFAULT_CHECK;state.leads.unshift({name,price,stage:"Новый лид",next:"Отправить первое сообщение"});save();renderAll();toast("Лид добавлен")};
$("#resetBtn").onclick=()=>{if(confirm("Сбросить прогресс приложения?")){state=structuredClone(defaults);localStorage.removeItem("challengeStart");save();renderAll();toast("Прогресс сброшен")}};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800)}
renderAll();
