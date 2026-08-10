(function(){const b=document.createElement("link").relList;if(b&&b.supports&&b.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))y(r);new MutationObserver(r=>{for(const m of r)if(m.type==="childList")for(const e of m.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&y(e)}).observe(document,{childList:!0,subtree:!0});function v(r){const m={};return r.integrity&&(m.integrity=r.integrity),r.referrerPolicy&&(m.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?m.credentials="include":r.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function y(r){if(r.ep)return;r.ep=!0;const m=v(r);fetch(r.href,m)}})();(function(){const w="office@example.com",b=["General Consultation","Annual Health Check-up","Laboratory Tests","X-Ray / Imaging","Specialist Referral","Prescription Renewal","Vaccination","Mental Health Counseling","Physical Therapy","Dental Check-up"],v=[{id:"overall",label:"Overall Visit Experience"},{id:"staff",label:"Staff Friendliness & Professionalism"},{id:"wait",label:"Waiting Time"},{id:"cleanliness",label:"Cleanliness & Environment"},{id:"communication",label:"Communication & Clarity"}],y=[{value:"5",label:"Excellent"},{value:"4",label:"Good"},{value:"3",label:"Average"},{value:"2",label:"Poor"},{value:"1",label:"Very Poor"}],r=["Yes, definitely","Maybe","No"],m=[{id:"q1",label:"How would you describe your overall experience at our office?",placeholder:"Share what stood out — positive or negative…"},{id:"q2",label:"How did our staff treat you? Were they helpful and respectful?",placeholder:"Tell us about your interaction with our team…"},{id:"q3",label:"Was the waiting time acceptable? If not, what could be improved?",placeholder:"Describe your wait experience and any suggestions…"},{id:"q4",label:"Is there anything specific you would like us to improve or add?",placeholder:"Your suggestions help us serve you better…"}],e={officeName:localStorage.getItem("psp_office_name")||"",activeTab:"appointment",adminTab:"appointments",isAdminOpen:!1,toastTimer:null,selectedServices:[],ratings:{},wouldRecommend:"",appointments:JSON.parse(localStorage.getItem("psp_appointments")||"[]"),satisfactions:JSON.parse(localStorage.getItem("psp_satisfactions")||"[]"),feedbacks:JSON.parse(localStorage.getItem("psp_feedbacks")||"[]")};function g(){e.officeName?localStorage.setItem("psp_office_name",e.officeName):localStorage.removeItem("psp_office_name"),localStorage.setItem("psp_appointments",JSON.stringify(e.appointments)),localStorage.setItem("psp_satisfactions",JSON.stringify(e.satisfactions)),localStorage.setItem("psp_feedbacks",JSON.stringify(e.feedbacks))}function $(n){const s=document.getElementById("toast-container");s&&(e.toastTimer&&clearTimeout(e.toastTimer),s.innerHTML=`
      <div class="toast">
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>${l(n)}</span>
      </div>
    `,e.toastTimer=setTimeout(()=>{s.innerHTML="",e.toastTimer=null},4e3))}function l(n){return n?String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}document.addEventListener("DOMContentLoaded",()=>{T()});function T(){I(),x(),k(),A(),C(),O(),q()}function I(){const n=document.getElementById("welcome-screen"),s=document.getElementById("portal-layout"),a=document.getElementById("sidebar-office-name"),c=document.getElementById("header-office-name");e.officeName?(n.classList.add("hidden"),s.classList.remove("hidden"),a&&(a.textContent=e.officeName),c&&(c.textContent=e.officeName),B(e.activeTab)):(n.classList.remove("hidden"),s.classList.add("hidden"))}function x(){const n=document.getElementById("welcome-form"),s=document.getElementById("welcome-office-input"),a=document.getElementById("welcome-error");n&&n.addEventListener("submit",i=>{i.preventDefault();const t=s.value.trim();if(!t){a&&a.classList.remove("hidden");return}a&&a.classList.add("hidden"),e.officeName=t,g(),I()});const c=document.getElementById("btn-change-office");c&&c.addEventListener("click",()=>{e.officeName="",g(),s&&(s.value=""),I()})}function k(){document.querySelectorAll(".nav-item").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.tab;a&&B(a)})})}function B(n){e.activeTab=n,document.querySelectorAll(".nav-item").forEach(i=>{i.dataset.tab===n?i.classList.add("active"):i.classList.remove("active")});const s=document.getElementById("view-appointment"),a=document.getElementById("view-satisfaction"),c=document.getElementById("view-feedback");s&&s.classList.toggle("hidden",n!=="appointment"),a&&a.classList.toggle("hidden",n!=="satisfaction"),c&&c.classList.toggle("hidden",n!=="feedback")}function A(){const n=document.getElementById("services-grid"),s=document.getElementById("btn-submit-appointment"),a=document.getElementById("services-counter"),c=document.getElementById("appointment-form");n&&(n.innerHTML=b.map(i=>`
        <label class="checkbox-card" data-service="${i}">
          <div class="custom-box">
            <svg class="check-icon hidden" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <span class="text-sm font-medium">${i}</span>
        </label>
      `).join(""),n.querySelectorAll(".checkbox-card").forEach(i=>{i.addEventListener("click",()=>{const t=i.dataset.service;e.selectedServices.includes(t)?(e.selectedServices=e.selectedServices.filter(f=>f!==t),i.classList.remove("selected"),i.querySelector(".check-icon").classList.add("hidden")):(e.selectedServices.push(t),i.classList.add("selected"),i.querySelector(".check-icon").classList.remove("hidden"));const o=e.selectedServices.length;a&&(a.textContent=o>0?`${o} service${o>1?"s":""} selected`:""),s&&(s.disabled=o===0)})})),c&&c.addEventListener("submit",i=>{if(i.preventDefault(),e.selectedServices.length===0)return;const t=document.getElementById("apt-patient-name").value.trim(),o=document.getElementById("apt-pref-date").value,f=document.getElementById("apt-pref-time").value,p=document.getElementById("apt-notes").value.trim(),u={id:"apt-"+Date.now(),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),officeName:e.officeName,patientName:t||"Anonymous",preferredDate:o||"Not specified",preferredTime:f||"Not specified",services:[...e.selectedServices],additionalNotes:p||"None"};e.appointments.unshift(u),g();const h=[`Office: ${e.officeName}`,`Patient Name: ${u.patientName}`,`Preferred Date: ${u.preferredDate}`,`Preferred Time: ${u.preferredTime}`,`Selected Services:
${e.selectedServices.map(d=>`  - ${d}`).join(`
`)}`,`Additional Notes: ${u.additionalNotes}`].join(`

`),E=encodeURIComponent(`Appointment Request — ${e.officeName}`),S=encodeURIComponent(h);window.location.href=`mailto:${w}?subject=${E}&body=${S}`,$("Appointment request opened in your email client."),c.reset(),e.selectedServices=[],n&&n.querySelectorAll(".checkbox-card").forEach(d=>{d.classList.remove("selected"),d.querySelector(".check-icon").classList.add("hidden")}),a&&(a.textContent=""),s&&(s.disabled=!0)})}function C(){const n=document.getElementById("satisfaction-ratings-container"),s=document.getElementById("recommend-options-container"),a=document.getElementById("btn-submit-satisfaction"),c=document.getElementById("satisfaction-form");n&&(n.innerHTML=v.map(t=>`
        <div class="rating-group" data-category="${t.id}">
          <div class="rating-category-title">${t.label}</div>
          <div class="radio-options-row">
            ${y.map(o=>`
              <label class="radio-chip" data-cat="${t.id}" data-val="${o.value}">
                <div class="custom-circle">
                  <div class="dot-inner hidden"></div>
                </div>
                <span>${o.label}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `).join(""),n.querySelectorAll(".radio-chip").forEach(t=>{t.addEventListener("click",()=>{const o=t.dataset.cat,f=t.dataset.val;e.ratings[o]=f,t.closest(".radio-options-row").querySelectorAll(".radio-chip").forEach(u=>{u.classList.remove("selected"),u.querySelector(".dot-inner").classList.add("hidden")}),t.classList.add("selected"),t.querySelector(".dot-inner").classList.remove("hidden"),i()})})),s&&(s.innerHTML=r.map(t=>`
        <label class="radio-chip radio-chip-navy" data-recommend="${t}">
          <div class="custom-circle">
            <div class="dot-inner hidden"></div>
          </div>
          <span>${t}</span>
        </label>
      `).join(""),s.querySelectorAll(".radio-chip").forEach(t=>{t.addEventListener("click",()=>{e.wouldRecommend=t.dataset.recommend,s.querySelectorAll(".radio-chip").forEach(o=>{o.classList.remove("selected"),o.querySelector(".dot-inner").classList.add("hidden")}),t.classList.add("selected"),t.querySelector(".dot-inner").classList.remove("hidden"),i()})}));function i(){const t=v.every(o=>e.ratings[o.id]);a&&(a.disabled=!t)}c&&c.addEventListener("submit",t=>{if(t.preventDefault(),!v.every(d=>e.ratings[d.id]))return;const f=document.getElementById("sat-visit-date").value,p={id:"sat-"+Date.now(),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),officeName:e.officeName,visitDate:f||"Not specified",ratings:{...e.ratings},wouldRecommend:e.wouldRecommend||"Not answered"};e.satisfactions.unshift(p),g();const u=v.map(d=>{const L=y.find(D=>D.value===e.ratings[d.id]);return`  ${d.label}: ${L?L.label:""} (${e.ratings[d.id]}/5)`}).join(`
`),h=[`Office: ${e.officeName}`,`Visit Date: ${p.visitDate}`,`Satisfaction Ratings:
${u}`,`Would Recommend: ${p.wouldRecommend}`].join(`

`),E=encodeURIComponent(`Satisfaction Survey — ${e.officeName}`),S=encodeURIComponent(h);window.location.href=`mailto:${w}?subject=${E}&body=${S}`,$("Satisfaction survey opened in your email client."),c.reset(),e.ratings={},e.wouldRecommend="",n.querySelectorAll(".radio-chip").forEach(d=>{d.classList.remove("selected"),d.querySelector(".dot-inner").classList.add("hidden")}),s.querySelectorAll(".radio-chip").forEach(d=>{d.classList.remove("selected"),d.querySelector(".dot-inner").classList.add("hidden")}),a&&(a.disabled=!0)})}function O(){const n=document.getElementById("feedback-questions-container"),s=document.getElementById("btn-submit-feedback"),a=document.getElementById("feedback-form");n&&(n.innerHTML=m.map((i,t)=>`
        <div class="feedback-card">
          <div class="feedback-q-header">
            <div class="q-number-badge">${t+1}</div>
            <label class="q-label" for="fb-input-${i.id}">${i.label}</label>
          </div>
          <textarea
            id="fb-input-${i.id}"
            data-qid="${i.id}"
            rows="3"
            class="form-textarea feedback-textarea"
            placeholder="${i.placeholder}"
          ></textarea>
        </div>
      `).join(""),n.querySelectorAll("textarea").forEach(i=>{i.addEventListener("input",()=>{c()})}));function c(){const i=n.querySelectorAll("textarea"),t=Array.from(i).some(o=>o.value.trim().length>0);s&&(s.disabled=!t)}a&&a.addEventListener("submit",i=>{i.preventDefault();const t=n.querySelectorAll("textarea"),o={};if(t.forEach(d=>{const L=d.value.trim();L&&(o[d.dataset.qid]=L)}),Object.keys(o).length===0)return;const f=document.getElementById("fb-author-name").value.trim(),p={id:"fb-"+Date.now(),timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),officeName:e.officeName,authorName:f||"Anonymous",answers:o};e.feedbacks.unshift(p),g();const u=m.map(d=>`Q: ${d.label}
A: ${o[d.id]||"No answer provided"}`).join(`

`),h=[`Office: ${e.officeName}`,`Submitted by: ${p.authorName}`,"---",u].join(`

`),E=encodeURIComponent(`Patient Feedback — ${e.officeName}`),S=encodeURIComponent(h);window.location.href=`mailto:${w}?subject=${E}&body=${S}`,$("Feedback opened in your email client."),a.reset(),t.forEach(d=>d.value=""),s&&(s.disabled=!0)})}function q(){const n=document.getElementById("btn-open-admin"),s=document.getElementById("btn-close-admin"),a=document.getElementById("admin-drawer-modal"),c=document.getElementById("btn-clear-local-data");n&&n.addEventListener("click",()=>{e.isAdminOpen=!0,a&&a.classList.remove("hidden"),N()}),s&&s.addEventListener("click",()=>{e.isAdminOpen=!1,a&&a.classList.add("hidden")}),a&&a.addEventListener("click",t=>{t.target===a&&(e.isAdminOpen=!1,a.classList.add("hidden"))});const i=document.querySelectorAll(".drawer-tab-btn");i.forEach(t=>{t.addEventListener("click",()=>{e.adminTab=t.dataset.admintab,i.forEach(o=>o.classList.toggle("active",o===t)),N()})}),c&&c.addEventListener("click",()=>{e.appointments=[],e.satisfactions=[],e.feedbacks=[],g(),N(),$("Local submissions cleared.")})}function N(){const n=document.getElementById("count-appointments"),s=document.getElementById("count-satisfactions"),a=document.getElementById("count-feedbacks"),c=document.getElementById("admin-drawer-body");if(n&&(n.textContent=e.appointments.length),s&&(s.textContent=e.satisfactions.length),a&&(a.textContent=e.feedbacks.length),!c)return;const i=e[e.adminTab]||[];if(i.length===0){c.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">📥</div>
          <div class="empty-title">No local submissions recorded</div>
          <div class="empty-desc">Form submissions will be listed here for inspection.</div>
        </div>
      `;return}e.adminTab==="appointments"?c.innerHTML=i.map(t=>`
        <div class="card-response">
          <div class="card-response-head">
            <span class="card-name">${l(t.patientName)}</span>
            <span class="card-time">${l(t.timestamp)}</span>
          </div>
          <div class="card-detail">📅 <strong>Date:</strong> ${l(t.preferredDate)} at ${l(t.preferredTime)}</div>
          <div>
            ${(t.services||[]).map(o=>`<span class="badge-tag">${l(o)}</span>`).join("")}
          </div>
          ${t.additionalNotes&&t.additionalNotes!=="None"?`<div class="card-notes">"${l(t.additionalNotes)}"</div>`:""}
        </div>
      `).join(""):e.adminTab==="satisfactions"?c.innerHTML=i.map(t=>`
        <div class="card-response">
          <div class="card-response-head">
            <span class="card-name">Satisfaction Survey</span>
            <span class="card-time">${l(t.timestamp)}</span>
          </div>
          <div class="card-detail">📅 <strong>Visit Date:</strong> ${l(t.visitDate)} | <strong>Recommend:</strong> ${l(t.wouldRecommend)}</div>
          <div class="card-detail">
            ${Object.entries(t.ratings||{}).map(([o,f])=>`
              <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #faf8f5;">
                <span style="text-transform:capitalize;">${l(o)}:</span>
                <strong style="color:var(--color-teal);">${l(f)}/5</strong>
              </div>
            `).join("")}
          </div>
        </div>
      `).join(""):e.adminTab==="feedbacks"&&(c.innerHTML=i.map(t=>`
        <div class="card-response">
          <div class="card-response-head">
            <span class="card-name">Author: ${l(t.authorName)}</span>
            <span class="card-time">${l(t.timestamp)}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
            ${Object.entries(t.answers||{}).map(([o,f])=>`
              <div style="background-color:var(--color-bg); padding:8px; border:1px solid var(--color-border-light);">
                <span style="color:var(--color-teal); font-size:10px; font-weight:700; text-transform:uppercase;">Question (${l(o)})</span>
                <p style="font-size:12px; color:var(--color-navy-dark); margin-top:2px;">${l(f)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `).join(""))}})();
