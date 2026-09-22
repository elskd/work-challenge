const KEY="webDesigner150k";
const defaults={
 revenue:0,
 actions:[false,false,false,false,false],
 leads:[
  {name:"Анна · эксперт",price:50000,stage:"Новый лид"},
  {name:"Studio Forma",price:70000,stage:"Контакт"},
  {name:"Мария · психолог",price:45000,stage:"Бриф"},
  {name:"North Agency",price:60000,stage:"Предложение"},
  {name:"Brand Lab",price:50000,stage:"Переговоры"}
 ]
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaults);

const actions=[
 ["Собрать 10 лидов","Продажи","leads"],
 ["Отправить 5 сообщений","Продажи","sales"],
 ["Доделать 1 экран кейса","Портфолио","portfolio"],
 ["Пройти урок + практика","Навык","skill"],
 ["Сделать follow-up","Продажи","sales"]
];
const plan=[
 ["Сформулировать оффер «сайт под ключ»","Продажи"],
 ["Найти 10 подходящих экспертов / компаний","Продажи"],
 ["Собрать первый экран портфолио-кейса","Портфолио"],
 ["Разобрать структуру продающего лендинга","Навык"],
 ["Отправить 5 персональных сообщений","Продажи"],
 ["Добавить кейс в портфолио","Портфолио"],
 ["Провести первый разбор сайта потенциального клиента","Продажи"],
 ["Составить шаблон коммерческого предложения","Продажи"]
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
 ["02","Структура","Как строить страницу от первого экрана до заявки.","2 ч"],
 ["03","UX / UI","Сетка, иерархия, композиция, типографика.","3 ч"],
 ["04","Figma","Компоненты, auto layout, variables, prototype.","4 ч"],
 ["05","Tilda","Zero Block, адаптив, анимации, публикация.","4 ч"],
 ["06","Продажи","Цена, КП, созвон, возражения и закрытие.","3 ч"]
];
const stages=["Новый лид","Контакт","Бриф","Предложение","Переговоры"];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const rub=n=>new Intl.NumberFormat("ru-RU").format(n)+" ₽";

function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function renderDashboard(){
 const pct=Math.min(100,state.revenue/150000*100);
 $("#revenue").textContent=rub(state.revenue);
 $("#revenuePercent").textContent=Math.round(pct)+"%";
 $("#mainProgress").style.width=pct+"%";
 $("#sideProgress").style.width=pct+"%";
 $("#sideRevenue").textContent=rub(state.revenue)+" / 150 000 ₽";
 const deals=state.revenue?Math.max(1,Math.round(state.revenue/50000)):0;
 $("#dealCount").textContent=deals;
 $("#avgCheck").textContent=deals?rub(Math.round(state.revenue/deals)):"0 ₽";
 $("#daysLeft").textContent=Math.max(0,90-(Number(localStorage.getItem("challengeStart")||Date.now())-Date.now())/86400000|0);
 const done=state.actions.filter(Boolean).length;
 $("#actionCounter").textContent=done+" / 5";
 $("#todayActions").innerHTML=actions.map((a,i)=>`<label class="action ${state.actions[i]?"done":""}"><div><input type="checkbox" data-action="${i}" ${state.actions[i]?"checked":""}></div><div><div class="action-title">${a[0]}</div><small>${a[1]}</small></div></label>`).join("");
 $$("#todayActions input").forEach(x=>x.onchange=()=>{state.actions[+x.dataset.action]=x.checked;save();renderDashboard();toast(x.checked?"Действие отмечено":"Действие возвращено");});
 $("#funnel").innerHTML=stages.map((s,i)=>{const count=state.leads.filter(l=>l.stage===s).length;const width=Math.max(8,count/Math.max(1,state.leads.length)*100);return `<div class="funnel-row"><span>${s}</span><div class="funnel-bar"><i style="width:${width}%"></i></div><b>${count}</b></div>`}).join("");
 const start=localStorage.getItem("challengeStart")||Date.now(); if(!localStorage.getItem("challengeStart"))localStorage.setItem("challengeStart",start);
 const day=Math.min(90,Math.max(1,Math.floor((Date.now()-Number(start))/86400000)+1));$("#dayNumber").textContent=day;
}
function renderPlan(){
 $("#planList").innerHTML=plan.map((x,i)=>`<label class="plan-row"><input type="checkbox"><div><strong>${x[0]}</strong><small>${x[1]}</small></div><span class="plan-tag">ДЕНЬ ${Math.min(30,i+1)}</span></label>`).join("");
}
function renderLeads(){
 $("#pipeline").innerHTML=stages.map(stage=>`<div class="pipeline-col"><h3>${stage.toUpperCase()} · ${state.leads.filter(x=>x.stage===stage).length}</h3>${state.leads.filter(x=>x.stage===stage).map((l,idx)=>`<div class="lead-card"><strong>${l.name}</strong><p>Следующий шаг: связаться</p><div class="lead-price">${rub(l.price)}</div></div>`).join("")}</div>`).join("");
}
function renderPortfolio(){
 $("#portfolioGrid").innerHTML=portfolio.map(p=>`<article class="portfolio-card"><span class="project-status">${p[3]}</span><div class="project-num">${p[0]}</div><h3>${p[1]}</h3><p>${p[2]}</p></article>`).join("");
}
function renderLearning(){
 $("#learningGrid").innerHTML=lessons.map(l=>`<article class="learning-card"><div class="lesson-meta"><span>УРОК ${l[0]}</span><span>${l[3]}</span></div><h3>${l[1]}</h3><p>${l[2]}</p><button class="text-btn">Начать урок →</button></article>`).join("");
}
function renderAnalytics(){
 const leads=state.leads.length, contacts=state.leads.filter(l=>stages.indexOf(l.stage)>=1).length;
 const briefs=state.leads.filter(l=>["Бриф","Предложение","Переговоры"].includes(l.stage)).length;
 const deals=state.revenue?Math.max(1,Math.round(state.revenue/50000)):0;
 const stats=[["Выручка",rub(state.revenue)],["Лиды",leads],["До брифа",briefs],["Средний чек",deals?rub(Math.round(state.revenue/deals)):"—"]];
 $("#statsGrid").innerHTML=stats.map(s=>`<div class="stat"><span>${s[0]}</span><strong>${s[1]}</strong></div>`).join("");
 const values=Array.from({length:30},(_,i)=>Math.max(3,Math.round((state.revenue/150000)*100*(i/29)**2)));
 $("#chart").innerHTML=values.map((v,i)=>`<div class="bar ${i===29?"hot":""}" style="height:${v}%"></div>`).join("");
}
function renderAll(){renderDashboard();renderPlan();renderLeads();renderPortfolio();renderLearning();renderAnalytics();}
function showView(id){
 $$(".view").forEach(v=>v.classList.toggle("active",v.id===id));
 $$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
 window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-view]").forEach(b=>b.onclick=()=>showView(b.dataset.view));
$$("[data-view-target]").forEach(b=>b.onclick=()=>showView(b.dataset.viewTarget));
$("#addRevenueBtn").onclick=()=>{const value=Number(prompt("Сколько ₽ добавить в доход?","50000"));if(value>0){state.revenue+=value;save();renderAll();toast("Оплата добавлена");}};
$("#addLeadBtn").onclick=()=>{const name=prompt("Имя клиента / компания");if(!name)return;const price=Number(prompt("Потенциальный чек, ₽","50000"))||50000;state.leads.unshift({name,price,stage:"Новый лид"});save();renderAll();toast("Лид добавлен");};
$("#resetBtn").onclick=()=>{if(confirm("Сбросить прогресс приложения?")){state=structuredClone(defaults);localStorage.removeItem("challengeStart");save();renderAll();toast("Демо-прогресс сброшен");}};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800)}
renderAll();
