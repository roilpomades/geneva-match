(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`geneva-match-dashboard (cursor-cloud-agent; chess-wcc-2026)`;async function t(t){try{let n=`https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(t)}&multiPv=1`,r=await fetch(n,{headers:{Accept:`application/json`,"User-Agent":e}});if(!r.ok)return null;let i=await r.json(),a=i.pvs?.[0];return a?{fen:i.fen,cp:typeof a.cp==`number`?a.cp:null,mate:typeof a.mate==`number`?a.mate:null,depth:i.depth,knodes:i.knodes}:null}catch{return null}}function n(e,t,n){if(e.mate!=null){let r=e.mate>0?`white`:`black`,i=r===`white`?t:n;return{bar:+(r===`white`),label:`Мат в ${Math.abs(e.mate)} · лучше ${i}`,side:r}}let r=e.cp??0,i=Math.min(1,Math.max(0,.5+r/600));if(Math.abs(r)<25)return{bar:i,label:`Равно (~0.00)`,side:`equal`};let a=(Math.abs(r)/100).toFixed(2);return{bar:i,label:`${r>0?`+`:`−`}${a} · лучше ${r>0?t:n}`,side:r>0?`white`:`black`}}var r={gukesh:{id:`gukesh`,name:`Gukesh`,fullName:`Gukesh Dommaraju`,fed:`IND`,flag:`🇮🇳`,rating:2710},sindarov:{id:`sindarov`,name:`Sindarov`,fullName:`Javokhir Sindarov`,fed:`UZB`,flag:`🇺🇿`,rating:2782}},i=`qfkdt8mn`,a=[{id:`g1`,kind:`game`,gameNumber:1,date:`2026-11-24`,startsAtIso:`2026-11-24T15:00:00+01:00`,labelRu:`Партия 1`},{id:`g2`,kind:`game`,gameNumber:2,date:`2026-11-25`,startsAtIso:`2026-11-25T15:00:00+01:00`,labelRu:`Партия 2`},{id:`g3`,kind:`game`,gameNumber:3,date:`2026-11-26`,startsAtIso:`2026-11-26T15:00:00+01:00`,labelRu:`Партия 3`},{id:`r1`,kind:`rest`,date:`2026-11-27`,labelRu:`День отдыха`},{id:`g4`,kind:`game`,gameNumber:4,date:`2026-11-28`,startsAtIso:`2026-11-28T15:00:00+01:00`,labelRu:`Партия 4`},{id:`g5`,kind:`game`,gameNumber:5,date:`2026-11-29`,startsAtIso:`2026-11-29T15:00:00+01:00`,labelRu:`Партия 5`},{id:`g6`,kind:`game`,gameNumber:6,date:`2026-11-30`,startsAtIso:`2026-11-30T15:00:00+01:00`,labelRu:`Партия 6`},{id:`r2`,kind:`rest`,date:`2026-12-01`,labelRu:`День отдыха`},{id:`g7`,kind:`game`,gameNumber:7,date:`2026-12-02`,startsAtIso:`2026-12-02T15:00:00+01:00`,labelRu:`Партия 7`},{id:`g8`,kind:`game`,gameNumber:8,date:`2026-12-03`,startsAtIso:`2026-12-03T15:00:00+01:00`,labelRu:`Партия 8`},{id:`g9`,kind:`game`,gameNumber:9,date:`2026-12-04`,startsAtIso:`2026-12-04T15:00:00+01:00`,labelRu:`Партия 9`},{id:`r3`,kind:`rest`,date:`2026-12-05`,labelRu:`День отдыха`},{id:`g10`,kind:`game`,gameNumber:10,date:`2026-12-06`,startsAtIso:`2026-12-06T15:00:00+01:00`,labelRu:`Партия 10`},{id:`g11`,kind:`game`,gameNumber:11,date:`2026-12-07`,startsAtIso:`2026-12-07T15:00:00+01:00`,labelRu:`Партия 11`},{id:`g12`,kind:`game`,gameNumber:12,date:`2026-12-08`,startsAtIso:`2026-12-08T15:00:00+01:00`,labelRu:`Партия 12`},{id:`r4`,kind:`rest`,date:`2026-12-09`,labelRu:`День отдыха`},{id:`g13`,kind:`game`,gameNumber:13,date:`2026-12-10`,startsAtIso:`2026-12-10T15:00:00+01:00`,labelRu:`Партия 13`},{id:`g14`,kind:`game`,gameNumber:14,date:`2026-12-11`,startsAtIso:`2026-12-11T15:00:00+01:00`,labelRu:`Партия 14`},{id:`tb`,kind:`tiebreak`,date:`2026-12-12`,labelRu:`Тай-брейк (если нужно)`}];function o(e){return e%2==1?`sindarov`:`gukesh`}function s(e){return o(e)===`gukesh`?`sindarov`:`gukesh`}function c(e,t){let n=e.replace(`1/2`,`½`).trim();if(n===`*`||n===``||!n)return null;let r=0,i=0;if(n===`1-0`)r=1;else if(n===`0-1`)i=1;else if(n===`½-½`||n===`1/2-1/2`)r=.5,i=.5;else return null;let a=t===`gukesh`?`sindarov`:`gukesh`,o={gukesh:0,sindarov:0};return o[t]+=r,o[a]+=i,o}function l(e){if(!e)return;let t=e.trim().split(/\s+/),n=Number(t[5]),r=t[1];if(!(!Number.isFinite(n)||n<1))return r===`w`?Math.max(0,n-1):n}function u(e){if(Number.isInteger(e))return String(e);let t=Math.floor(e),n=e-t;return Math.abs(n-.5)<1e-9?t===0?`½`:`${t}½`:String(e)}function d(e){if(e.gukesh>=7.5&&e.sindarov<7.5)return`Чемпион: Gukesh`;if(e.sindarov>=7.5&&e.gukesh<7.5)return`Чемпион: Sindarov`;let t=e.games.filter(e=>e.finished).length;return t>=14&&e.gukesh===e.sindarov?`Тай-брейк`:t===0?`Матч ещё не начался`:`Матч идёт`}function f(e,t){return new Intl.DateTimeFormat(`ru-RU`,{timeZone:`Europe/Moscow`,...t}).format(new Date(e))}function p(e){return f(e,{weekday:`short`,day:`numeric`,month:`long`})}function m(e){return f(e,{weekday:`short`,day:`numeric`,month:`long`,hour:`2-digit`,minute:`2-digit`})}function h(e){return f(Date.parse(`${e}T12:00:00Z`),{weekday:`short`,day:`numeric`,month:`long`})}function g(e,t){let n=e.replace(`1/2`,`½`).trim();return n===`½-½`||n===`1/2-1/2`?`Ничья`:n===`1-0`?`Победа ${r[t].name}`:n===`0-1`?`Победа ${r[t===`gukesh`?`sindarov`:`gukesh`].name}`:n===`*`?`Идёт`:n||`—`}function _(e){return e.replace(`1/2`,`½`).trim()||`—`}function v(e){let t=a.filter(e=>e.kind===`game`).map(e=>{let t=e.gameNumber,n=o(t),r=e.startsAtIso?Date.parse(e.startsAtIso):Date.parse(`${e.date}T15:00:00+01:00`);return t===1?{gameNumber:1,startsAt:r,finished:!0,white:n,black:s(1),status:`½-½`,moves:38}:{gameNumber:t,startsAt:r,finished:!1,white:n,black:s(t),status:`*`}});return{source:`fallback`,fetchedAt:Date.now(),gukesh:.5,sindarov:.5,games:t,phase:y(t),error:e}}function y(e,t=Date.now()){let n=e.find(e=>e.live&&!e.finished);if(n)return{kind:`live`,gameNumber:n.gameNumber,startsAt:n.startsAt,white:n.white,black:n.black,fen:n.fen,moves:n.moves,status:n.status};let r=e.find(e=>!e.finished);return r?a.find(e=>e.kind===`rest`&&Date.parse(`${e.date}T00:00:00+01:00`)<=t&&Date.parse(`${e.date}T23:59:59+01:00`)>=t&&r.startsAt>t)&&t<r.startsAt?{kind:`rest`,gameNumber:r.gameNumber,startsAt:r.startsAt,white:r.white,black:r.black}:{kind:`countdown`,gameNumber:r.gameNumber,startsAt:r.startsAt,white:r.white,black:r.black}:{kind:`done`}}function b(e){if(e<=0)return`00:00:00`;let t=Math.floor(e/1e3),n=Math.floor(t/3600),r=Math.floor(t%3600/60),i=t%60,a=e=>String(e).padStart(2,`0`);return n>48?`${Math.floor(n/24)}д ${a(n%24)}:${a(r)}:${a(i)}`:`${a(n)}:${a(r)}:${a(i)}`}var x=`geneva-match-dashboard (cursor-cloud-agent; chess-wcc-2026)`,S=`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR`;async function C(e){let t=await fetch(e,{headers:{Accept:`application/json`,"User-Agent":x}});if(!t.ok)throw Error(`Lichess ${t.status}: ${e}`);return t.json()}function w(e){let t=e.name.match(/(\d+)/);if(t)return Number(t[1]);let n=e.slug.match(/(\d+)/);return n?Number(n[1]):null}function T(e,t){let n=(e.players?.[0]?.name??e.name.split(`-`)[0]??``).toLowerCase();return n.includes(`gukesh`)?`gukesh`:n.includes(`sindarov`)?`sindarov`:t}function E(e){let t=a.find(t=>t.kind===`game`&&t.gameNumber===e);return t?.startsAtIso?Date.parse(t.startsAtIso):Date.now()}function D(e,t,n,r,i){if(n)return!1;if(e?.ongoing)return!0;let a=t?.status??`*`;if(a!==`*`&&a!==``)return!1;let o=t?.fen??``;return!!(t?.lastMove||o&&!o.startsWith(S)||i>=r&&i<r+252e5)}async function O(){try{let e=await C(`https://lichess.org/api/broadcast/${i}`),t=new Map;for(let n of e.rounds??[]){let e=w(n);e!=null&&t.set(e,n)}let n=Date.now(),r=[...t.entries()].filter(([,e])=>{if(e.finished||e.ongoing)return!0;let t=e.startsAt??0;return t>0&&t<=n+216e5}),a=await Promise.all(r.map(async([,e])=>await C(`https://lichess.org/api/broadcast/-/-/${e.id}`))),u=new Map(a.map(e=>[e.round.id,e])),d=0,f=0,p=[];for(let e=1;e<=14;e++){let r=t.get(e),i=(r?u.get(r.id):void 0)?.games?.[0],a=i?T(i,o(e)):o(e),m=r?.startsAt??E(e),h=!!r?.finished,g=h?i?.status??`½-½`:i?.status??`*`,_=i?.fen,v=D(r,i,h,m,n);if(h){let e=c(g,a);e&&(d+=e.gukesh,f+=e.sindarov)}p.push({gameNumber:e,startsAt:m,finished:h,white:a,black:s(e),status:g,moves:l(_),roundId:r?.id,fen:_,live:v})}return{source:`lichess`,fetchedAt:Date.now(),gukesh:d,sindarov:f,games:p,phase:y(p,n)}}catch(e){return v(e instanceof Error?e.message:`Сеть недоступна`)}}var k={gukesh:{decimal:3.25,implied:.28},sindarov:{decimal:1.33,implied:.72},source:`bet365 / Kalshi`,asOfLabel:`снимок рынка · ноя 2026`};function A(e,t,n){return Math.min(n,Math.max(t,e))}function j(e,t=1.06){let n=A(e,.03,.92),r=n;return{decimal:Math.round(t/n*100)/100,implied:r}}function M(e,t){let n=t===`gukesh`?`sindarov`:`gukesh`,i=r[t].rating+32,a=r[n].rating-i,o=1/(1+10**(a/400)),s=A(.58-Math.abs(a)*55e-5,.42,.62),c=1-s,l=A(.5+(o-.5)*1.35,.28,.72),u=c*l,d=c*(1-l);return{gameNumber:e,white:t,black:n,whiteWin:j(u),draw:j(s),blackWin:j(d),source:`модель Elo (классика)`,asOfLabel:`партия ${e} · с маржой ~6%`}}function N(e){return e.toFixed(2)}function P(e){return`${Math.round(e*100)}%`}function F(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function I(e){return new Set(e.games.filter(e=>e.finished).map(e=>e.gameNumber))}function L(e){let t=I(e),n=Date.now();return a.filter(e=>e.kind===`game`&&e.gameNumber!=null?!t.has(e.gameNumber):Date.parse(`${e.date}T23:59:59+03:00`)>=n-432e5)}function R(e){let t=I(e);return a.filter(e=>e.kind===`game`&&e.gameNumber!=null?t.has(e.gameNumber):e.kind===`rest`&&Date.parse(`${e.date}T23:59:59+03:00`)<Date.now())}function z(e){let t=r[e];return`<span class="flag" title="${t.fed}" aria-label="${t.fed}">${t.flag}</span> ${F(t.name)}`}function B(e,t){let i=e.phase;if(i.kind===`live`&&i.gameNumber!=null){let e=i.white??`gukesh`,a=i.black??`sindarov`,o=i.moves==null?`партия началась`:`${i.moves} ходов`,s=``;if(t.evalLoading)s=`<p class="eval-meta">Считаем оценку Lichess…</p>`;else if(t.positionEval){let i=n(t.positionEval,r[e].name,r[a].name),o=t.positionEval.depth?` · глубина ${t.positionEval.depth}`:``;s=`
        <div class="eval-block">
          <div class="eval-bar" aria-hidden="true">
            <div class="eval-fill" style="width:${(i.bar*100).toFixed(1)}%"></div>
          </div>
          <p class="eval-label">${F(i.label)}</p>
          <p class="eval-meta">Cloud eval Lichess${F(o)}</p>
        </div>`}else s=`<p class="eval-meta">Оценка позиции пока недоступна</p>`;return`
      <section class="pulse live" aria-live="polite">
        <div class="pulse-head">
          <span class="live-dot" aria-hidden="true"></span>
          <h2>Партия ${i.gameNumber} идёт</h2>
        </div>
        <p class="pulse-sub">
          Белые: ${z(e)} · чёрные: ${z(a)} · ${F(o)}
        </p>
        ${s}
      </section>`}if(i.kind===`countdown`||i.kind===`rest`){let e=i.startsAt??Date.now(),t=i.kind===`rest`?`День отдыха`:`До партии ${i.gameNumber??``}`,n=i.white,r=n==null?`<p class="pulse-sub">Старт ${F(m(e))} MSK</p>`:`<p class="pulse-sub">Белые: ${z(n)} · старт ${F(m(e))} MSK</p>`;return`
      <section class="pulse countdown" aria-live="polite">
        <div class="pulse-head">
          <h2>${F(t.trim())}</h2>
        </div>
        ${r}
        <p class="countdown-clock" id="countdown-clock" data-starts-at="${e}">
          ${F(b(e-Date.now()))}
        </p>
        <p class="eval-meta">Обратный отсчёт по Москве</p>
      </section>`}return`
    <section class="pulse">
      <div class="pulse-head"><h2>Матч завершён</h2></div>
    </section>`}function V(e){let t=e.games.find(e=>!e.finished),n=null;t&&(n=M(t.gameNumber,t.white));let r=k;return`
    <section class="section odds-section" aria-labelledby="odds-heading">
      <h2 id="odds-heading">Коэффициенты</h2>
      ${n?`
      <div class="odds-card">
        <h3>На партию ${n.gameNumber}</h3>
        <p class="odds-note">${F(n.source)} · ${F(n.asOfLabel)}</p>
        <ul class="odds-rows">
          <li>
            <span>${z(n.white)} победа</span>
            <strong>${N(n.whiteWin.decimal)}</strong>
            <em>${P(n.whiteWin.implied)}</em>
          </li>
          <li>
            <span>Ничья</span>
            <strong>${N(n.draw.decimal)}</strong>
            <em>${P(n.draw.implied)}</em>
          </li>
          <li>
            <span>${z(n.black)} победа</span>
            <strong>${N(n.blackWin.decimal)}</strong>
            <em>${P(n.blackWin.implied)}</em>
          </li>
        </ul>
      </div>`:``}
      <div class="odds-card">
        <h3>Победитель матча</h3>
        <p class="odds-note">${F(r.source)} · ${F(r.asOfLabel)}</p>
        <ul class="odds-rows">
          <li>
            <span>${z(`gukesh`)}</span>
            <strong>${N(r.gukesh.decimal)}</strong>
            <em>${P(r.gukesh.implied)}</em>
          </li>
          <li>
            <span>${z(`sindarov`)}</span>
            <strong>${N(r.sindarov.decimal)}</strong>
            <em>${P(r.sindarov.implied)}</em>
          </li>
        </ul>
      </div>
    </section>`}function H(e){let t=e.games.filter(e=>e.finished||e.live);return t.length===0?`<p class="empty">Сыгранных партий пока нет.</p>`:`
    <ul class="list results">
      ${t.map((e,t)=>{let n=e.moves==null?``:`${e.moves} ходов`,r=e.live?`Идёт сейчас`:g(e.status,e.white),i=e.live?`LIVE`:_(e.status);return`
            <li class="row ${e.live?`is-live`:``}" style="--i:${t}">
              <span class="badge">№${e.gameNumber}</span>
              <div class="row-main">
                <div class="row-title">${F(r)}</div>
                <div class="row-meta">
                  ${F(p(e.startsAt))} · белые: ${z(e.white)}
                  ${n?` · ${F(n)}`:``}
                </div>
              </div>
              <span class="score-pill">${F(i)}</span>
            </li>`}).join(``)}
    </ul>`}function U(e){let t=L(e).filter(t=>t.kind===`game`&&t.gameNumber!=null?!e.games.find(e=>e.gameNumber===t.gameNumber)?.live:!0);return t.length===0?`<p class="empty">Ближайших событий нет.</p>`:`
    <ul class="list upcoming">
      ${t.map((e,t)=>{let n=e.kind===`game`&&e.startsAtIso?`${m(Date.parse(e.startsAtIso))} MSK`:h(e.date),i=e.kind===`rest`?`отдых`:e.kind===`tiebreak`?`тай-брейк`:`партия`,a=e.gameNumber==null?null:e.gameNumber%2==1?`sindarov`:`gukesh`,o=a==null?``:` · белые: ${r[a].flag} ${r[a].name}`;return`
            <li class="row" style="--i:${t}">
              <span class="badge badge-${e.kind}">${F(i)}</span>
              <div class="row-main">
                <div class="row-title">${F(e.labelRu)}</div>
                <div class="row-meta">${F(n)}${o}</div>
              </div>
            </li>`}).join(``)}
    </ul>`}function W(e){let t=R(e);return t.length===0?`<p class="empty">Пока нет.</p>`:`
    <ul class="list past-dates">
      ${t.map(e=>{let t=e.kind===`game`&&e.startsAtIso?m(Date.parse(e.startsAtIso)):h(e.date);return`
            <li class="row compact">
              <div class="row-main">
                <div class="row-title">${F(e.labelRu)}</div>
                <div class="row-meta">${F(t)} MSK</div>
              </div>
            </li>`}).join(``)}
    </ul>`}function G(e,t,n={}){let i=d(t),a=t.source===`lichess`?`Данные Lichess · обновите страницу для свежих результатов`:`Офлайн-срез${t.error?`: ${t.error}`:``}`;e.innerHTML=`
    <div class="page">
      <div class="atmosphere" aria-hidden="true"></div>
      <header class="hero">
        <p class="brand">Матч за звание чемпиона мира по шахматам</p>
        <h1 class="matchup">
          <span class="name">${r.gukesh.flag} ${r.gukesh.name}</span>
          <span class="vs">—</span>
          <span class="name">${r.sindarov.flag} ${r.sindarov.name}</span>
        </h1>
        <p class="sub">Женева 2026 · классика до 7½ очков</p>
      </header>

      ${B(t,n)}

      <section class="scoreboard" aria-label="Счёт матча">
        <div class="score-grid">
          <div class="player left">
            <span class="fed">${r.gukesh.flag} ${r.gukesh.fed}</span>
            <span class="pname">${r.gukesh.name}</span>
          </div>
          <div class="score-pair">
            <span class="pts">${u(t.gukesh)}</span>
            <span class="dash">—</span>
            <span class="pts">${u(t.sindarov)}</span>
          </div>
          <div class="player right">
            <span class="fed">${r.sindarov.flag} ${r.sindarov.fed}</span>
            <span class="pname">${r.sindarov.name}</span>
          </div>
        </div>
        <p class="status-line">${F(i)}</p>
        <button type="button" class="refresh" id="refresh-btn">Обновить</button>
        <p class="source">${F(a)}</p>
      </section>

      ${V(t)}

      <section class="section" aria-labelledby="results-heading">
        <h2 id="results-heading">Результаты партий</h2>
        ${H(t)}
      </section>

      <section class="section" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Ближайшие партии</h2>
        ${U(t)}
      </section>

      <section class="section past-section">
        <details class="past-details">
          <summary>Прошедшие даты</summary>
          ${W(t)}
        </details>
      </section>

      <footer class="footer">
        <p>Время — MSK. Трансляция и оценка — Lichess. Коэффициенты на партию: Elo-модель; победитель матча — снимок bet365/Kalshi.</p>
      </footer>
    </div>
  `,e.querySelector(`#refresh-btn`)?.addEventListener(`click`,()=>{location.reload()})}function K(e){e.innerHTML=`
    <div class="page is-loading">
      <div class="atmosphere" aria-hidden="true"></div>
      <header class="hero">
        <p class="brand">Матч за звание чемпиона мира по шахматам</p>
        <h1 class="matchup">
          <span class="name">${r.gukesh.flag} Gukesh</span>
          <span class="vs">—</span>
          <span class="name">${r.sindarov.flag} Sindarov</span>
        </h1>
        <p class="sub">Загрузка результатов…</p>
      </header>
    </div>
  `}function q(e){let t=e.querySelector(`#countdown-clock`);if(!t)return()=>{};let n=Number(t.dataset.startsAt);if(!Number.isFinite(n))return()=>{};let r=()=>{let e=n-Date.now();t.textContent=b(e),e<=0&&(t.textContent=`00:00:00`)};r();let i=window.setInterval(r,1e3);return()=>window.clearInterval(i)}var J=document.querySelector(`#app`),Y;async function X(){if(!J)return;Y?.(),K(J);let e=await O();if(e.phase.kind===`live`&&e.phase.fen){G(J,e,{evalLoading:!0}),Y=q(J);let n=await t(e.phase.fen);Y?.(),G(J,e,{positionEval:n,evalLoading:!1}),Y=q(J)}else G(J,e),Y=q(J)}X();