/**
 * Patient Services Portal - Vanilla JavaScript Engine
 */

(function () {
  'use strict';

  // Constants & Data Sets

  const DEFAULT_EMAIL = 'filimonatsibeha28@gmail.com';

  const SERVICES_LIST = [
    'General Consultation',
    'Annual Health Check-up',
    'Laboratory Tests',
    'X-Ray / Imaging',
    'Specialist Referral',
    'Prescription Renewal',
    'Vaccination',
    'Mental Health Counseling',
    'Physical Therapy',
    'Dental Check-up'
  ];

  const RATING_CATEGORIES = [
    { id: 'overall', label: 'Overall Visit Experience' },
    { id: 'staff', label: 'Staff Friendliness & Professionalism' },
    { id: 'wait', label: 'Waiting Time' },
    { id: 'cleanliness', label: 'Cleanliness & Environment' },
    { id: 'communication', label: 'Communication & Clarity' }
  ];

  const RATING_OPTIONS = [
    { value: '5', label: 'Excellent' },
    { value: '4', label: 'Good' },
    { value: '3', label: 'Average' },
    { value: '2', label: 'Poor' },
    { value: '1', label: 'Very Poor' }
  ];

  const RECOMMEND_OPTIONS = ['Yes, definitely', 'Maybe', 'No'];

  const FEEDBACK_QUESTIONS = [
    {
      id: 'q1',
      label: 'How would you describe your overall experience at our office?',
      placeholder: 'Share what stood out — positive or negative…'
    },
    {
      id: 'q2',
      label: 'How did our staff treat you? Were they helpful and respectful?',
      placeholder: 'Tell us about your interaction with our team…'
    },
    {
      id: 'q3',
      label: 'Was the waiting time acceptable? If not, what could be improved?',
      placeholder: 'Describe your wait experience and any suggestions…'
    },
    {
      id: 'q4',
      label: 'Is there anything specific you would like us to improve or add?',
      placeholder: 'Your suggestions help us serve you better…'
    }
  ];

  // Application State
  const state = {
    officeName: localStorage.getItem('psp_office_name') || '',
    activeTab: 'appointment', // 'appointment' | 'satisfaction' | 'feedback'
    adminTab: 'appointments', // 'appointments' | 'satisfactions' | 'feedbacks'
    isAdminOpen: false,
    toastTimer: null,
    selectedServices: [],
    ratings: {},
    wouldRecommend: '',
    appointments: JSON.parse(localStorage.getItem('psp_appointments') || '[]'),
    satisfactions: JSON.parse(localStorage.getItem('psp_satisfactions') || '[]'),
    feedbacks: JSON.parse(localStorage.getItem('psp_feedbacks') || '[]')
  };

  // Helper Functions
  function saveStorage() {
    if (state.officeName) {
      localStorage.setItem('psp_office_name', state.officeName);
    } else {
      localStorage.removeItem('psp_office_name');
    }
    localStorage.setItem('psp_appointments', JSON.stringify(state.appointments));
    localStorage.setItem('psp_satisfactions', JSON.stringify(state.satisfactions));
    localStorage.setItem('psp_feedbacks', JSON.stringify(state.feedbacks));
  }

  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    if (state.toastTimer) {
      clearTimeout(state.toastTimer);
    }

    toastContainer.innerHTML = `
      <div class="toast">
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>${escapeHtml(message)}</span>
      </div>
    `;

    state.toastTimer = setTimeout(() => {
      toastContainer.innerHTML = '';
      state.toastTimer = null;
    }, 4000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Initial Render & Event Setup
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    renderMainView();
    bindWelcomeEvents();
    bindNavEvents();
    bindAppointmentForm();
    bindSatisfactionForm();
    bindFeedbackForm();
    bindAdminDrawer();
  }

  function renderMainView() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const portalLayout = document.getElementById('portal-layout');
    const sidebarOfficeName = document.getElementById('sidebar-office-name');
    const headerOfficeName = document.getElementById('header-office-name');

    if (!state.officeName) {
      welcomeScreen.classList.remove('hidden');
      portalLayout.classList.add('hidden');
    } else {
      welcomeScreen.classList.add('hidden');
      portalLayout.classList.remove('hidden');

      if (sidebarOfficeName) sidebarOfficeName.textContent = state.officeName;
      if (headerOfficeName) headerOfficeName.textContent = state.officeName;

      switchTab(state.activeTab);
    }
  }

  // Welcome Screen Handlers
  function bindWelcomeEvents() {
    const form = document.getElementById('welcome-form');
    const input = document.getElementById('welcome-office-input');
    const errorText = document.getElementById('welcome-error');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) {
          if (errorText) errorText.classList.remove('hidden');
          return;
        }
        if (errorText) errorText.classList.add('hidden');
        state.officeName = val;
        saveStorage();
        renderMainView();
      });
    }

    const changeBtn = document.getElementById('btn-change-office');
    if (changeBtn) {
      changeBtn.addEventListener('click', () => {
        state.officeName = '';
        saveStorage();
        if (input) input.value = '';
        renderMainView();
      });
    }
  }

  // Navigation Handlers
  function bindNavEvents() {
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) switchTab(tab);
      });
    });
  }

  function switchTab(tabName) {
    state.activeTab = tabName;

    // Update Nav Buttons Active state
    document.querySelectorAll('.nav-item').forEach((btn) => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Hide/Show view containers
    const aptView = document.getElementById('view-appointment');
    const satView = document.getElementById('view-satisfaction');
    const fbView = document.getElementById('view-feedback');

    if (aptView) aptView.classList.toggle('hidden', tabName !== 'appointment');
    if (satView) satView.classList.toggle('hidden', tabName !== 'satisfaction');
    if (fbView) fbView.classList.toggle('hidden', tabName !== 'feedback');
  }

  // 1. Appointment Form Logic
  function bindAppointmentForm() {
    const servicesGrid = document.getElementById('services-grid');
    const submitBtn = document.getElementById('btn-submit-appointment');
    const counterText = document.getElementById('services-counter');
    const form = document.getElementById('appointment-form');

    if (servicesGrid) {
      servicesGrid.innerHTML = SERVICES_LIST.map((svc) => `
        <label class="checkbox-card" data-service="${svc}">
          <div class="custom-box">
            <svg class="check-icon hidden" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <span class="text-sm font-medium">${svc}</span>
        </label>
      `).join('');

      servicesGrid.querySelectorAll('.checkbox-card').forEach((card) => {
        card.addEventListener('click', () => {
          const service = card.dataset.service;
          if (state.selectedServices.includes(service)) {
            state.selectedServices = state.selectedServices.filter((s) => s !== service);
            card.classList.remove('selected');
            card.querySelector('.check-icon').classList.add('hidden');
          } else {
            state.selectedServices.push(service);
            card.classList.add('selected');
            card.querySelector('.check-icon').classList.remove('hidden');
          }

          // Update Counter & Submit Button state
          const count = state.selectedServices.length;
          if (counterText) {
            counterText.textContent = count > 0 ? `${count} service${count > 1 ? 's' : ''} selected` : '';
          }
          if (submitBtn) submitBtn.disabled = count === 0;
        });
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (state.selectedServices.length === 0) return;

        const patientName = document.getElementById('apt-patient-name').value.trim();
        const prefDate = document.getElementById('apt-pref-date').value;
        const prefTime = document.getElementById('apt-pref-time').value;
        const notes = document.getElementById('apt-notes').value.trim();

        // Create submission record
        const submission = {
          id: 'apt-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          officeName: state.officeName,
          patientName: patientName || 'Anonymous',
          preferredDate: prefDate || 'Not specified',
          preferredTime: prefTime || 'Not specified',
          services: [...state.selectedServices],
          additionalNotes: notes || 'None'
        };

        state.appointments.unshift(submission);
        saveStorage();

        // Open Mailto
        const emailBody = [
          `Office: ${state.officeName}`,
          `Patient Name: ${submission.patientName}`,
          `Preferred Date: ${submission.preferredDate}`,
          `Preferred Time: ${submission.preferredTime}`,
          `Selected Services:\n${state.selectedServices.map((s) => `  - ${s}`).join('\n')}`,
          `Additional Notes: ${submission.additionalNotes}`
        ].join('\n\n');

        const subject = encodeURIComponent(`Appointment Request — ${state.officeName}`);
        const body = encodeURIComponent(emailBody);
        window.location.href = `mailto:${DEFAULT_EMAIL}?subject=${subject}&body=${body}`;

        showToast('Appointment request opened in your email client.');

        // Reset Form
        form.reset();
        state.selectedServices = [];
        if (servicesGrid) {
          servicesGrid.querySelectorAll('.checkbox-card').forEach((c) => {
            c.classList.remove('selected');
            c.querySelector('.check-icon').classList.add('hidden');
          });
        }
        if (counterText) counterText.textContent = '';
        if (submitBtn) submitBtn.disabled = true;
      });
    }
  }

  // 2. Satisfaction Survey Logic
  function bindSatisfactionForm() {
    const ratingsContainer = document.getElementById('satisfaction-ratings-container');
    const recommendContainer = document.getElementById('recommend-options-container');
    const submitBtn = document.getElementById('btn-submit-satisfaction');
    const form = document.getElementById('satisfaction-form');

    // Render Categories
    if (ratingsContainer) {
      ratingsContainer.innerHTML = RATING_CATEGORIES.map((cat) => `
        <div class="rating-group" data-category="${cat.id}">
          <div class="rating-category-title">${cat.label}</div>
          <div class="radio-options-row">
            ${RATING_OPTIONS.map((opt) => `
              <label class="radio-chip" data-cat="${cat.id}" data-val="${opt.value}">
                <div class="custom-circle">
                  <div class="dot-inner hidden"></div>
                </div>
                <span>${opt.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('');

      ratingsContainer.querySelectorAll('.radio-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const catId = chip.dataset.cat;
          const val = chip.dataset.val;
          state.ratings[catId] = val;

          // Highlight selected chip in category
          const row = chip.closest('.radio-options-row');
          row.querySelectorAll('.radio-chip').forEach((c) => {
            c.classList.remove('selected');
            c.querySelector('.dot-inner').classList.add('hidden');
          });
          chip.classList.add('selected');
          chip.querySelector('.dot-inner').classList.remove('hidden');

          validateSatisfactionForm();
        });
      });
    }

    // Render Recommend Options
    if (recommendContainer) {
      recommendContainer.innerHTML = RECOMMEND_OPTIONS.map((opt) => `
        <label class="radio-chip radio-chip-navy" data-recommend="${opt}">
          <div class="custom-circle">
            <div class="dot-inner hidden"></div>
          </div>
          <span>${opt}</span>
        </label>
      `).join('');

      recommendContainer.querySelectorAll('.radio-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          state.wouldRecommend = chip.dataset.recommend;
          recommendContainer.querySelectorAll('.radio-chip').forEach((c) => {
            c.classList.remove('selected');
            c.querySelector('.dot-inner').classList.add('hidden');
          });
          chip.classList.add('selected');
          chip.querySelector('.dot-inner').classList.remove('hidden');

          validateSatisfactionForm();
        });
      });
    }

    function validateSatisfactionForm() {
      const isComplete = RATING_CATEGORIES.every((cat) => state.ratings[cat.id]);
      if (submitBtn) submitBtn.disabled = !isComplete;
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isComplete = RATING_CATEGORIES.every((cat) => state.ratings[cat.id]);
        if (!isComplete) return;

        const visitDate = document.getElementById('sat-visit-date').value;

        const submission = {
          id: 'sat-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          officeName: state.officeName,
          visitDate: visitDate || 'Not specified',
          ratings: { ...state.ratings },
          wouldRecommend: state.wouldRecommend || 'Not answered'
        };

        state.satisfactions.unshift(submission);
        saveStorage();

        // Format Mailto
        const formattedRatings = RATING_CATEGORIES.map((cat) => {
          const opt = RATING_OPTIONS.find((o) => o.value === state.ratings[cat.id]);
          return `  ${cat.label}: ${opt ? opt.label : ''} (${state.ratings[cat.id]}/5)`;
        }).join('\n');

        const emailBody = [
          `Office: ${state.officeName}`,
          `Visit Date: ${submission.visitDate}`,
          `Satisfaction Ratings:\n${formattedRatings}`,
          `Would Recommend: ${submission.wouldRecommend}`
        ].join('\n\n');

        const subject = encodeURIComponent(`Satisfaction Survey — ${state.officeName}`);
        const body = encodeURIComponent(emailBody);
        window.location.href = `mailto:${DEFAULT_EMAIL}?subject=${subject}&body=${body}`;

        showToast('Satisfaction survey opened in your email client.');

        // Reset
        form.reset();
        state.ratings = {};
        state.wouldRecommend = '';
        ratingsContainer.querySelectorAll('.radio-chip').forEach((c) => {
          c.classList.remove('selected');
          c.querySelector('.dot-inner').classList.add('hidden');
        });
        recommendContainer.querySelectorAll('.radio-chip').forEach((c) => {
          c.classList.remove('selected');
          c.querySelector('.dot-inner').classList.add('hidden');
        });
        if (submitBtn) submitBtn.disabled = true;
      });
    }
  }

  // 3. Feedback Form Logic
  function bindFeedbackForm() {
    const questionsContainer = document.getElementById('feedback-questions-container');
    const submitBtn = document.getElementById('btn-submit-feedback');
    const form = document.getElementById('feedback-form');

    if (questionsContainer) {
      questionsContainer.innerHTML = FEEDBACK_QUESTIONS.map((q, idx) => `
        <div class="feedback-card">
          <div class="feedback-q-header">
            <div class="q-number-badge">${idx + 1}</div>
            <label class="q-label" for="fb-input-${q.id}">${q.label}</label>
          </div>
          <textarea
            id="fb-input-${q.id}"
            data-qid="${q.id}"
            rows="3"
            class="form-textarea feedback-textarea"
            placeholder="${q.placeholder}"
          ></textarea>
        </div>
      `).join('');

      questionsContainer.querySelectorAll('textarea').forEach((ta) => {
        ta.addEventListener('input', () => {
          validateFeedbackForm();
        });
      });
    }

    function validateFeedbackForm() {
      const textareas = questionsContainer.querySelectorAll('textarea');
      const hasAtLeastOne = Array.from(textareas).some((ta) => ta.value.trim().length > 0);
      if (submitBtn) submitBtn.disabled = !hasAtLeastOne;
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const textareas = questionsContainer.querySelectorAll('textarea');
        const answers = {};
        textareas.forEach((ta) => {
          const val = ta.value.trim();
          if (val) answers[ta.dataset.qid] = val;
        });

        if (Object.keys(answers).length === 0) return;

        const authorName = document.getElementById('fb-author-name').value.trim();

        const submission = {
          id: 'fb-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          officeName: state.officeName,
          authorName: authorName || 'Anonymous',
          answers
        };

        state.feedbacks.unshift(submission);
        saveStorage();

        // Format Mailto
        const formattedQA = FEEDBACK_QUESTIONS.map(
          (q) => `Q: ${q.label}\nA: ${answers[q.id] || 'No answer provided'}`
        ).join('\n\n');

        const emailBody = [
          `Office: ${state.officeName}`,
          `Submitted by: ${submission.authorName}`,
          '---',
          formattedQA
        ].join('\n\n');

        const subject = encodeURIComponent(`Patient Feedback — ${state.officeName}`);
        const body = encodeURIComponent(emailBody);
        window.location.href = `mailto:${DEFAULT_EMAIL}?subject=${subject}&body=${body}`;

        showToast('Feedback opened in your email client.');

        // Reset
        form.reset();
        textareas.forEach((ta) => (ta.value = ''));
        if (submitBtn) submitBtn.disabled = true;
      });
    }
  }

  // 4. Admin Drawer & Inspector Logic
  function bindAdminDrawer() {
    const openBtn = document.getElementById('btn-open-admin');
    const closeBtn = document.getElementById('btn-close-admin');
    const modal = document.getElementById('admin-drawer-modal');
    const clearBtn = document.getElementById('btn-clear-local-data');

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        state.isAdminOpen = true;
        if (modal) modal.classList.remove('hidden');
        renderAdminDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        state.isAdminOpen = false;
        if (modal) modal.classList.add('hidden');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          state.isAdminOpen = false;
          modal.classList.add('hidden');
        }
      });
    }

    // Drawer Tabs
    const drawerTabs = document.querySelectorAll('.drawer-tab-btn');
    drawerTabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.adminTab = btn.dataset.admintab;
        drawerTabs.forEach((b) => b.classList.toggle('active', b === btn));
        renderAdminDrawer();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.appointments = [];
        state.satisfactions = [];
        state.feedbacks = [];
        saveStorage();
        renderAdminDrawer();
        showToast('Local submissions cleared.');
      });
    }
  }

  function renderAdminDrawer() {
    const countApt = document.getElementById('count-appointments');
    const countSat = document.getElementById('count-satisfactions');
    const countFb = document.getElementById('count-feedbacks');
    const drawerBody = document.getElementById('admin-drawer-body');

    if (countApt) countApt.textContent = state.appointments.length;
    if (countSat) countSat.textContent = state.satisfactions.length;
    if (countFb) countFb.textContent = state.feedbacks.length;

    if (!drawerBody) return;

    const list = state[state.adminTab] || [];

    if (list.length === 0) {
      drawerBody.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📥</div>
          <div class="empty-title">No local submissions recorded</div>
          <div class="empty-desc">Form submissions will be listed here for inspection.</div>
        </div>
      `;
      return;
    }

    if (state.adminTab === 'appointments') {
      drawerBody.innerHTML = list.map((item) => `
        <div class="card-response">
          <div class="card-response-head">
            <span class="card-name">${escapeHtml(item.patientName)}</span>
            <span class="card-time">${escapeHtml(item.timestamp)}</span>
          </div>
          <div class="card-detail">📅 <strong>Date:</strong> ${escapeHtml(item.preferredDate)} at ${escapeHtml(item.preferredTime)}</div>
          <div>
            ${(item.services || []).map((s) => `<span class="badge-tag">${escapeHtml(s)}</span>`).join('')}
          </div>
          ${item.additionalNotes && item.additionalNotes !== 'None' ? `<div class="card-notes">"${escapeHtml(item.additionalNotes)}"</div>` : ''}
        </div>
      `).join('');
    } else if (state.adminTab === 'satisfactions') {
      drawerBody.innerHTML = list.map((item) => `
        <div class="card-response">
          <div class="card-response-head">
            <span class="card-name">Satisfaction Survey</span>
            <span class="card-time">${escapeHtml(item.timestamp)}</span>
          </div>
          <div class="card-detail">📅 <strong>Visit Date:</strong> ${escapeHtml(item.visitDate)} | <strong>Recommend:</strong> ${escapeHtml(item.wouldRecommend)}</div>
          <div class="card-detail">
            ${Object.entries(item.ratings || {}).map(([k, v]) => `
              <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #faf8f5;">
                <span style="text-transform:capitalize;">${escapeHtml(k)}:</span>
                <strong style="color:var(--color-teal);">${escapeHtml(v)}/5</strong>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    } else if (state.adminTab === 'feedbacks') {
      drawerBody.innerHTML = list.map((item) => `
        <div class="card-response">
          <div class="card-response-head">
            <span class="card-name">Author: ${escapeHtml(item.authorName)}</span>
            <span class="card-time">${escapeHtml(item.timestamp)}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
            ${Object.entries(item.answers || {}).map(([qId, ans]) => `
              <div style="background-color:var(--color-bg); padding:8px; border:1px solid var(--color-border-light);">
                <span style="color:var(--color-teal); font-size:10px; font-weight:700; text-transform:uppercase;">Question (${escapeHtml(qId)})</span>
                <p style="font-size:12px; color:var(--color-navy-dark); margin-top:2px;">${escapeHtml(ans)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }
  }

})();
