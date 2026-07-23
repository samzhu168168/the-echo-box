const PAID_KIT_CONFIG = window.COMMERCE_CONFIG?.paidKit || {
    enabled: false,
    provider: 'gumroad',
    price: '$9.99',
    productName: 'The Echo Box - 30-Day No Contact Reset Kit',
    checkoutUrl: '',
    productVersion: '2026-07-v1'
};

function initStandalonePaidKitCtas() {
    if (document.getElementById('unsent-form')) return;
    const buttons = Array.from(document.querySelectorAll('[data-paid-kit-cta]'));
    if (!buttons.length) return;
    buttons.forEach((button) => {
        const placement = button.dataset.placement || 'standalone';
        button.textContent = PAID_KIT_CONFIG.enabled ? `Get the 30-Day Reset Kit - ${PAID_KIT_CONFIG.price}` : 'Coming soon';
        if (button.tagName.toLowerCase() === 'a') {
            button.href = PAID_KIT_CONFIG.enabled ? buildPaidKitCheckoutUrl(placement) : '#';
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
        }
        if (!PAID_KIT_CONFIG.enabled || !PAID_KIT_CONFIG.checkoutUrl) button.setAttribute('aria-disabled', 'true');
        button.addEventListener('click', (event) => {
            if (!PAID_KIT_CONFIG.enabled || !PAID_KIT_CONFIG.checkoutUrl) {
                event.preventDefault();
                trackGlobalEvent('gumroad_checkout_failed', { placement });
                return;
            }
            trackGlobalEvent('paid_kit_cta_clicked', { placement });
            trackGlobalEvent('gumroad_checkout_opened', { placement });
        });
    });
    trackGlobalEvent('paid_kit_cta_viewed', { placement: 'product_page' });
}

function buildPaidKitCheckoutUrl(placement) {
    const url = new URL(PAID_KIT_CONFIG.checkoutUrl);
    applyCheckoutUtm(url, placement);
    return url.toString();
}

function applyCheckoutUtm(url, placement) {
    const params = new URLSearchParams(window.location.search);
    url.searchParams.set('utm_source', params.get('utm_source') || 'website');
    url.searchParams.set('utm_medium', params.get('utm_medium') || 'checkout_cta');
    url.searchParams.set('utm_campaign', params.get('utm_campaign') || 'no_contact_reset_kit');
    url.searchParams.set('utm_content', params.get('utm_content') || placement);
}

function trackGlobalEvent(name, details = {}) {
    if (window.echoAnalytics && typeof window.echoAnalytics.trackEvent === 'function') {
        window.echoAnalytics.trackEvent(name, details);
    }
}

function initEmergencyBinder() {
    const form = document.getElementById('binder-form');
    if (!form) return;

    const preview = document.getElementById('binder-preview');
    const printButton = document.getElementById('print-button');
    const downloadTextButton = document.getElementById('download-text-button');
    const clearButton = document.getElementById('clear-button');
    const sampleFillButton = document.getElementById('sample-fill-button');
    const progressLabel = document.getElementById('progress-label');
    const progressBar = document.getElementById('progress-bar');
    const storageKey = 'echoBoxEmergencyBinderDraft';

    const fields = [
        { name: 'preparedFor', label: 'Prepared for' },
        { name: 'emergencyContacts', label: 'Emergency contacts' },
        { name: 'doctorsMedications', label: 'Doctors and medications' },
        { name: 'insuranceInfo', label: 'Insurance and ID information' },
        { name: 'billsSubscriptions', label: 'Bills, subscriptions, and accounts' },
        { name: 'documentsLocation', label: 'Where important documents are' },
        { name: 'homePets', label: 'Home, pets, and daily instructions' },
        { name: 'careWishes', label: 'Care preferences and wishes' },
        { name: 'finalNote', label: 'What I want my family to know' }
    ];

    const samples = {
        preparedFor: 'Elaine Carter',
        emergencyContacts: 'Call Daniel first: 555-0142. Neighbor with spare key: Mrs. Lopez, 555-0188. Sister: Nora, 555-0109.',
        doctorsMedications: 'Primary doctor: Dr. Hale, Greenview Family Clinic. Pharmacy: Northside CVS. Current meds: blood pressure medication every morning. Allergy: penicillin.',
        insuranceInfo: 'Medicare card is in the blue wallet. Supplemental insurance folder is in the top desk drawer. Photo ID is in the nightstand tray.',
        billsSubscriptions: 'Mortgage autopays on the 3rd. Electric and water autopay from checking. Phone bill due on the 12th. Cancel meal delivery if away from home for more than one week.',
        documentsLocation: 'Will, power of attorney, car title, and birth certificate are in the fireproof box in the closet. Attorney: Miller & Stone, 555-0199.',
        homePets: 'Feed Rosie half a cup morning and evening. Vet: Willow Animal Care. Main water shutoff is behind the laundry room panel. Spare key is with Mrs. Lopez.',
        careWishes: 'I prefer comfort, clarity, and family communication. Please check legal documents before making major decisions. This note is not a legal directive.',
        finalNote: 'Do not let a hard week make you feel alone. I made this so you would not have to guess. Start with the practical things, then breathe.'
    };

    function getData() {
        return fields.reduce((data, field) => {
            const input = form.elements[field.name];
            data[field.name] = input ? input.value.trim() : '';
            return data;
        }, {});
    }

    function setData(data) {
        fields.forEach((field) => {
            const input = form.elements[field.name];
            if (input && Object.prototype.hasOwnProperty.call(data, field.name)) {
                input.value = data[field.name];
            }
        });
        updateProgress();
    }

    function saveDraft() {
        localStorage.setItem(storageKey, JSON.stringify(getData()));
    }

    function loadDraft() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
            setData(saved);
        } catch (error) {
            localStorage.removeItem(storageKey);
        }
    }

    function updateProgress() {
        const data = getData();
        const started = fields.filter((field) => data[field.name].length > 0).length;
        progressLabel.textContent = `${started} of ${fields.length} sections started`;
        progressBar.style.width = `${Math.round((started / fields.length) * 100)}%`;
    }

    function createSection(label, value) {
        const section = document.createElement('section');
        section.className = 'print-section';
        const heading = document.createElement('h3');
        heading.textContent = label;
        const paragraph = document.createElement('p');
        paragraph.textContent = value || 'Not filled yet.';
        section.append(heading, paragraph);
        return section;
    }

    function generateBinder(data) {
        preview.classList.remove('empty');
        preview.replaceChildren();
        const article = document.createElement('article');
        article.className = 'print-doc';
        const title = document.createElement('h2');
        title.textContent = `${data.preparedFor || 'Family'} Emergency File`;
        const meta = document.createElement('div');
        meta.className = 'doc-meta';
        const updated = document.createElement('span');
        updated.textContent = `Updated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
        const disclaimer = document.createElement('span');
        disclaimer.textContent = 'Planning note only. Not legal, medical, or financial advice.';
        meta.append(updated, disclaimer);
        article.append(title, meta);
        fields.slice(1).forEach((field) => article.append(createSection(field.label, data[field.name])));
        preview.append(article);
        printButton.disabled = false;
        downloadTextButton.disabled = false;
    }

    function downloadText(data) {
        const lines = [
            'THE ECHO BOX - FAMILY EMERGENCY BINDER',
            `Updated: ${new Date().toLocaleDateString('en-US')}`,
            '',
            ...fields.flatMap((field) => [field.label.toUpperCase(), data[field.name] || 'Not filled yet.', '']),
            'Note: This file is an organization tool, not legal, medical, financial, or estate-planning advice.'
        ];
        downloadFile('echo-box-family-emergency-binder.txt', lines.join('\n'), 'text/plain;charset=utf-8');
    }

    form.addEventListener('input', () => {
        updateProgress();
        saveDraft();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = getData();
        generateBinder(data);
        saveDraft();
        preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    printButton.addEventListener('click', () => window.print());
    downloadTextButton.addEventListener('click', () => downloadText(getData()));

    clearButton.addEventListener('click', () => {
        if (!confirm('Clear this local draft?')) return;
        form.reset();
        localStorage.removeItem(storageKey);
        updateProgress();
        preview.className = 'binder-preview empty';
        preview.replaceChildren();
        const empty = document.createElement('p');
        empty.textContent = 'Your printable binder preview will appear here after you generate it.';
        preview.append(empty);
        printButton.disabled = true;
        downloadTextButton.disabled = true;
    });

    sampleFillButton.addEventListener('click', () => {
        setData(samples);
        saveDraft();
        generateBinder(getData());
        document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    loadDraft();
}

function initBreakupReset() {
    const form = document.getElementById('unsent-form');
    if (!form) return;

    const keys = {
        data: 'echoBoxBreakupData.v1',
        events: 'echoBoxBreakupEvents.v1',
        session: 'echoBoxBreakupSession.v1',
        experiment: 'echoBoxBreakupExperiment.v1'
    };

    const heroVariants = {
        direct_late_night: {
            headline: 'Alone at night with their chat open?',
            lede: 'Put the message here before the room gets quieter and the urge gets louder. The Echo Box gives you a private ten-minute pause, a no-contact counter, and a reality check. No login. Local browser storage. Delete anytime.'
        },
        second_person_alone: {
            headline: 'It is late. You are alone. Do not send it yet.',
            lede: 'Type the text here instead of reopening the thread. The Echo Box gives you ten private minutes before you decide, with a no-contact counter and a reality check. No login. Local browser storage. Delete anytime.'
        }
    };

    const state = loadState();
    const experiment = loadExperiment();
    let timerHandle = null;

    const messageInput = document.getElementById('unsent-message');
    const doNotSave = document.getElementById('do-not-save');
    const messageStatus = document.getElementById('message-status');
    const heroLede = document.getElementById('hero-lede');
    const chatPreview = document.getElementById('unsent-chat-preview');
    const chatEmptyState = document.getElementById('chat-empty-state');
    const resetFlow = document.getElementById('reset-flow');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const timerGuidance = document.getElementById('timer-guidance');
    const triggerGuidance = document.getElementById('trigger-guidance');
    const exportMessageButton = document.getElementById('export-message-button');
    const deleteMessageButton = document.getElementById('delete-message-button');
    const lastContactInput = document.getElementById('last-contact');
    const counterResult = document.getElementById('counter-result');
    const saveCounterButton = document.getElementById('save-counter-button');
    const restartCounterButton = document.getElementById('restart-counter-button');
    const realityForm = document.getElementById('reality-form');
    const exportRealityButton = document.getElementById('export-reality-button');
    const clearRealityButton = document.getElementById('clear-reality-button');
    const necessaryReason = document.getElementById('necessary-reason');
    const necessaryGuidance = document.getElementById('necessary-guidance');
    const paidKitPanel = document.getElementById('paid-kit-panel');
    const paidKitPrice = document.getElementById('paid-kit-price');
    const paidKitButton = document.getElementById('paid-kit-button');
    const paidKitButtons = Array.from(document.querySelectorAll('[data-paid-kit-cta]'));
    const paidKitNote = document.getElementById('paid-kit-note');
    const postResetOffer = document.getElementById('post-reset-offer');
    const exportAllDataButton = document.getElementById('export-all-data-button');
    const clearAllDataButton = document.getElementById('clear-all-data-button');

    const triggerCopy = {
        they_texted: ['A reply can wake up hope fast.', 'Read it later. You do not need to prove availability tonight.', 'Wait ten minutes before opening the thread again.'],
        miss_them: ['Missing someone is a body wave, not a command.', 'Name what you miss without turning it into proof that you should return.', 'Drink water, stand up, and reread your Reality Box.'],
        social_media: ['A post is not a full story.', 'Your brain is filling in the parts you cannot see.', 'Close the app for ten minutes and do not inspect their profile.'],
        lonely: ['Loneliness asks for contact. It does not always ask for that person.', 'Find one safe, non-romantic contact point instead.', 'Message a friend, step outside, or start a simple task before deciding.'],
        closure: ['Closure often becomes another conversation loop.', 'If the answer mattered, it would have shown up in the pattern.', 'Write the exact question here and do not send it tonight.'],
        angry: ['Anger wants a witness immediately.', 'A message sent from heat usually creates more cleanup.', 'Write the harsh version here, then export or delete it after the timer.'],
        drinking: ['Alcohol lowers the guardrails.', 'Tonight is not the night for emotional contact.', 'Put the phone away until morning if you can do that safely.'],
        meaningful_date: ['Dates can make the past feel present.', 'A memory is not an instruction.', 'Mark the date, breathe, and do one ordinary thing for the next ten minutes.'],
        broke_no_contact: ['One restart is not a full collapse.', 'The next choice still matters.', 'Restart the counter and make the next ten minutes clean.'],
        something_else: ['The urge is real even if the reason is unclear.', 'You only need the next small pause.', 'Stay with the timer and avoid sending while your body is activated.']
    };

    const necessaryCopy = {
        miss: 'If the real reason is missing them, keep using the reset. Missing someone is not an emergency message.',
        closure: 'Closure messages often reopen the loop. Write it in the Unsent Message box first and wait.',
        childcare: 'Use one topic, one request, and one deadline. Keep emotion out of the message.',
        work: 'Keep it practical: task, date, handoff, next step. No relationship discussion.',
        money: 'Keep it factual and documented. If it is formal or disputed, consider qualified advice.',
        legal: 'Use formal channels where appropriate. This tool is not legal advice.',
        safety: 'If someone is unsafe or threatened, contact local emergency services or a trusted person near you now.'
    };

    applyExperiment();
    setupPaidKit();
    setupPricingTracking();
    restoreScreen();
    trackEvent('landing_page_view');
    if (Object.keys(state).length > 0) {
        trackEvent('return_visit_detected');
        trackReturnVisitMilestones();
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (!message) {
            messageStatus.textContent = 'Write it first';
            messageInput.focus();
            return;
        }

        const safetyFlag = detectSafetyLanguage(message);
        state.unsentMessage = doNotSave.checked ? '' : message;
        state.messageSaved = !doNotSave.checked;
        state.resetEndsAt = Date.now() + 10 * 60 * 1000;
        state.lastStartedAt = Date.now();
        saveState();

        messageInput.value = doNotSave.checked ? '' : message;
        renderUnsentBubble(message);
        messageStatus.textContent = doNotSave.checked ? 'Not sent' : 'Not sent - saved locally';
        resetFlow.classList.remove('hidden');
        timerGuidance.textContent = safetyFlag
            ? 'Safety note: if you or someone else may be unsafe, contact local emergency services or a trusted person near you now.'
            : 'Do not decide from the spike. Let your body come down first.';
        startTimer();
        trackEvent('reset_started', { saveMode: doNotSave.checked ? 'no_save' : 'local_save', safetyFlag });
        if (!doNotSave.checked) trackEvent('unsent_message_saved_local', { saveMode: 'local_save' });
        resetFlow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    messageInput.addEventListener('input', () => {
        messageStatus.textContent = messageInput.value.trim() ? 'Private draft' : 'Private draft';
        if (messageInput.value.trim() && !messageInput.dataset.started) {
            messageInput.dataset.started = 'true';
            trackEvent('unsent_message_started');
        }
    });

    document.getElementById('trigger-grid').addEventListener('click', (event) => {
        const button = event.target.closest('[data-trigger]');
        if (!button) return;
        const copy = triggerCopy[button.dataset.trigger];
        if (!copy) return;
        triggerGuidance.innerHTML = `<strong>${copy[0]}</strong><span>${copy[1]}</span><em>${copy[2]}</em>`;
        trackEvent('trigger_selected', { trigger: button.dataset.trigger });
    });

    exportMessageButton.addEventListener('click', () => {
        const note = getCurrentMessage();
        if (!note) return;
        downloadFile('echo-box-unsent-message.txt', note, 'text/plain;charset=utf-8');
        trackEvent('local_data_exported', { reason: 'unsent_message' });
    });

    deleteMessageButton.addEventListener('click', () => {
        if (!confirm('Delete the local unsent message?')) return;
        state.unsentMessage = '';
        state.messageSaved = false;
        saveState();
        messageInput.value = '';
        messageStatus.textContent = 'Deleted locally';
        clearUnsentBubble();
        trackEvent('local_data_cleared', { reason: 'unsent_message' });
    });

    saveCounterButton.addEventListener('click', () => {
        if (!lastContactInput.value) return;
        state.lastContactAt = new Date(lastContactInput.value).getTime();
        saveState();
        renderCounter();
        trackEvent('no_contact_counter_created');
    });

    restartCounterButton.addEventListener('click', () => {
        state.lastContactAt = Date.now();
        lastContactInput.value = toDatetimeLocal(state.lastContactAt);
        saveState();
        renderCounter();
        trackEvent('no_contact_counter_created', { reason: 'restart' });
    });

    realityForm.addEventListener('submit', (event) => {
        event.preventDefault();
        state.realityBox = Object.fromEntries(new FormData(realityForm).entries());
        saveState();
        trackEvent('reality_box_created');
        const button = realityForm.querySelector('button[type="submit"]');
        const previous = button.textContent;
        button.textContent = 'Saved locally';
        setTimeout(() => { button.textContent = previous; }, 1200);
    });

    exportRealityButton.addEventListener('click', () => {
        const data = Object.fromEntries(new FormData(realityForm).entries());
        downloadFile('echo-box-reality-box.json', JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
        trackEvent('local_data_exported', { reason: 'reality_box' });
    });

    clearRealityButton.addEventListener('click', () => {
        if (!confirm('Clear the local Reality Box?')) return;
        state.realityBox = {};
        saveState();
        realityForm.reset();
        trackEvent('local_data_cleared', { reason: 'reality_box' });
    });

    necessaryReason.addEventListener('change', () => {
        necessaryGuidance.textContent = necessaryCopy[necessaryReason.value] || necessaryCopy.miss;
        trackEvent('necessary_contact_filter_used', { reason: necessaryReason.value });
    });

    if (exportAllDataButton) {
        exportAllDataButton.addEventListener('click', () => {
            const payload = {
                breakupData: state,
                analyticsEvents: safeJson(localStorage.getItem(window.echoAnalytics?.STORAGE_KEY || 'echoBoxAnalyticsEvents.v1')) || []
            };
            downloadFile('echo-box-local-data.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
            trackEvent('local_data_exported', { reason: 'all_local_data' });
        });
    }

    if (clearAllDataButton) {
        clearAllDataButton.addEventListener('click', () => {
            if (!confirm('Clear all local Echo Box data on this browser?')) return;
            trackEvent('local_data_cleared', { reason: 'all_local_data' });
            localStorage.removeItem(keys.data);
            localStorage.removeItem('echoBoxAnalyticsEvents.v1');
            localStorage.removeItem('echoBoxAnalyticsSession.v1');
            localStorage.removeItem(keys.experiment);
            form.reset();
            realityForm.reset();
            messageInput.value = '';
            resetFlow.classList.add('hidden');
            counterResult.innerHTML = '<strong>No counter set yet.</strong><span>Set a date to see your protected time.</span>';
            messageStatus.textContent = 'Cleared locally';
            clearUnsentBubble();
        });
    }

    window.addEventListener('beforeunload', () => {
        if (state.resetEndsAt && Date.now() < state.resetEndsAt) {
            trackEvent('left_during_reset');
        }
    });

    function setupPaidKit() {
        if (paidKitPrice) paidKitPrice.textContent = PAID_KIT_CONFIG.price;
        const label = PAID_KIT_CONFIG.enabled ? 'Get the 30-Day Reset Kit - ' + PAID_KIT_CONFIG.price : 'Coming soon';
        paidKitButtons.forEach((button) => {
            const placement = button.dataset.placement || 'unknown';
            button.textContent = label;
            button.disabled = !PAID_KIT_CONFIG.enabled || !PAID_KIT_CONFIG.checkoutUrl;
            button.addEventListener('click', () => openPaidKitCheckout(placement, button));
        });
        if (paidKitNote) {
            paidKitNote.textContent = PAID_KIT_CONFIG.enabled
                ? 'One-time purchase. No subscription. Opens the Gumroad product page in a new tab.'
                : 'Waiting for the Gumroad product URL. This button will not send users to the old Family Emergency Binder product.';
        }
    }

    function openPaidKitCheckout(placement, sourceButton) {
        trackEvent('paid_kit_cta_clicked', { placement });
        if (!PAID_KIT_CONFIG.enabled || !PAID_KIT_CONFIG.checkoutUrl) {
            trackEvent('gumroad_checkout_failed', { placement });
            return;
        }
        const checkoutUrl = buildCheckoutUrl(placement);
        try {
            const opened = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            if (opened) {
                trackEvent('gumroad_checkout_opened', { placement });
                return;
            }
            trackEvent('gumroad_checkout_fallback_used', { placement });
            window.location.href = checkoutUrl;
        } catch (error) {
            trackEvent('gumroad_checkout_failed', { placement });
            if (sourceButton && !sourceButton.parentElement.querySelector('.checkout-fallback-link')) {
                const fallback = document.createElement('a');
                fallback.href = checkoutUrl;
                fallback.target = '_blank';
                fallback.rel = 'noopener noreferrer';
                fallback.textContent = 'Open Gumroad checkout';
                fallback.className = 'button secondary checkout-fallback-link';
                sourceButton.insertAdjacentElement('afterend', fallback);
            }
        }
    }

    function buildCheckoutUrl(placement) {
        const url = new URL(PAID_KIT_CONFIG.checkoutUrl);
        applyCheckoutUtm(url, placement);
        return url.toString();
    }

    function setupPricingTracking() {
        if (!paidKitPanel) return;
        let viewed = false;
        const markViewed = () => {
            if (viewed) return;
            viewed = true;
            trackEvent('pricing_viewed');
            trackEvent('paid_kit_cta_viewed', { placement: 'pricing' });
        };
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    markViewed();
                    observer.disconnect();
                }
            }, { threshold: 0.45 });
            observer.observe(paidKitPanel);
        } else {
            markViewed();
        }
    }

    function restoreScreen() {
        if (state.unsentMessage) {
            messageInput.value = state.unsentMessage;
            messageStatus.textContent = 'Not sent - saved locally';
            renderUnsentBubble(state.unsentMessage);
        }
        if (state.resetEndsAt && Date.now() < state.resetEndsAt) {
            resetFlow.classList.remove('hidden');
            startTimer();
        } else {
            renderTimer(10 * 60 * 1000);
        }
        if (state.lastContactAt) {
            lastContactInput.value = toDatetimeLocal(state.lastContactAt);
        }
        renderCounter();
        if (state.realityBox) {
            Object.entries(state.realityBox).forEach(([name, value]) => {
                const field = realityForm.elements[name];
                if (field) field.value = value;
            });
            if (Object.values(state.realityBox).some((value) => String(value || '').trim())) {
                trackEvent('reality_box_reopened');
            }
        }
        necessaryGuidance.textContent = necessaryCopy[necessaryReason.value];
    }

    function renderUnsentBubble(message) {
        if (!chatPreview || !message) return;
        clearUnsentBubble();
        chatPreview.classList.add('has-message');
        if (chatEmptyState) chatEmptyState.classList.add('hidden');

        const row = document.createElement('div');
        row.className = 'chat-bubble-row';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble unsent-bubble';
        bubble.textContent = message;

        const receipt = document.createElement('div');
        receipt.className = 'chat-receipt';
        receipt.textContent = 'Not sent - stays on this device';

        row.append(bubble, receipt);
        chatPreview.append(row);
    }

    function clearUnsentBubble() {
        if (!chatPreview) return;
        chatPreview.querySelectorAll('.chat-bubble-row').forEach((row) => row.remove());
        chatPreview.classList.remove('has-message');
        if (chatEmptyState) chatEmptyState.classList.remove('hidden');
    }

    function trackReturnVisitMilestones() {
        if (!state.lastStartedAt) return;
        const elapsedDays = Math.floor((Date.now() - state.lastStartedAt) / 86400000);
        const milestones = [
            [1, 'return_visit_day_1'],
            [3, 'return_visit_day_3'],
            [7, 'return_visit_day_7']
        ];
        state.returnMilestones = state.returnMilestones || {};
        milestones.forEach(([day, eventName]) => {
            if (elapsedDays >= day && !state.returnMilestones[day]) {
                trackEvent(eventName, { day });
                state.returnMilestones[day] = true;
            }
        });
        saveState();
    }

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(keys.data) || '{}');
        } catch (error) {
            localStorage.removeItem(keys.data);
            return {};
        }
    }

    function saveState() {
        localStorage.setItem(keys.data, JSON.stringify(state));
    }

    function loadExperiment() {
        const existing = safeJson(localStorage.getItem(keys.experiment));
        const created = {
            hero: 'direct_late_night',
            cta: existing && existing.cta ? existing.cta : Math.random() < 0.5 ? 'box' : 'wait'
        };
        localStorage.setItem(keys.experiment, JSON.stringify(created));
        return created;
    }

    function applyExperiment() {
        const headline = document.getElementById('hero-headline');
        const cta = document.getElementById('put-in-box-button');
        const variant = heroVariants[experiment.hero] || heroVariants.direct_late_night;
        if (headline) headline.textContent = variant.headline;
        if (heroLede) heroLede.textContent = variant.lede;
        cta.textContent = experiment.cta === 'wait'
            ? 'Wait 10 minutes before sending'
            : 'Put it in the box for 10 minutes';
    }

    function startTimer() {
        clearInterval(timerHandle);
        timerHandle = setInterval(() => {
            const remaining = Math.max(0, state.resetEndsAt - Date.now());
            renderTimer(remaining);
            if (remaining <= 0) {
                clearInterval(timerHandle);
                timerGuidance.textContent = 'The spike passed. You can still choose silence, a factual message, or no action.';
                if (postResetOffer) postResetOffer.classList.remove('hidden');
                trackEvent('reset_completed');
            }
        }, 250);
    }

    function renderTimer(ms) {
        const seconds = Math.ceil(ms / 1000);
        const minutesPart = Math.floor(seconds / 60);
        const secondsPart = seconds % 60;
        timerMinutes.textContent = String(minutesPart).padStart(2, '0');
        timerSeconds.textContent = String(secondsPart).padStart(2, '0');
    }

    function renderCounter() {
        if (!state.lastContactAt) return;
        const elapsed = Math.max(0, Date.now() - state.lastContactAt);
        state.longestNoContactMs = Math.max(state.longestNoContactMs || 0, elapsed);
        saveState();
        const days = Math.floor(elapsed / 86400000);
        const hours = Math.floor((elapsed % 86400000) / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const milestones = [1, 3, 7, 14, 30];
        const next = milestones.find((day) => day > days) || 30;
        counterResult.innerHTML = `<strong>${days} days, ${hours} hours, ${minutes} minutes protected.</strong><span>Next milestone: ${next} days. Longest local record: ${formatDuration(state.longestNoContactMs)}.</span>`;
    }

    function getCurrentMessage() {
        return messageInput.value.trim() || state.unsentMessage || '';
    }

    function trackEvent(name, details = {}) {
        if (window.echoAnalytics && typeof window.echoAnalytics.trackEvent === 'function') {
            window.echoAnalytics.trackEvent(name, details);
        }
    }

    window.echoBoxBreakupResetReady = true;
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function safeJson(value) {
    try {
        return JSON.parse(value || 'null');
    } catch (error) {
        return null;
    }
}

function toDatetimeLocal(timestamp) {
    const date = new Date(timestamp);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
}

function formatDuration(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    return `${days}d ${hours}h`;
}

function detectSafetyLanguage(text) {
    const patterns = [
        /kill myself/i,
        /hurt myself/i,
        /end my life/i,
        /suicide/i,
        /hurt them/i,
        /stalk/i,
        /threat/i,
        /unsafe/i,
        /violence/i
    ];
    return patterns.some((pattern) => pattern.test(text));
}

document.addEventListener('DOMContentLoaded', () => {
    initEmergencyBinder();
    initStandalonePaidKitCtas();
    initBreakupReset();
});
