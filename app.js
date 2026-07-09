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

    const state = loadState();
    const experiment = loadExperiment();
    let timerHandle = null;

    const messageInput = document.getElementById('unsent-message');
    const doNotSave = document.getElementById('do-not-save');
    const messageStatus = document.getElementById('message-status');
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
    restoreScreen();
    trackEvent('page_view');

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
        messageStatus.textContent = doNotSave.checked ? 'Not saved' : 'Saved locally';
        resetFlow.classList.remove('hidden');
        timerGuidance.textContent = safetyFlag
            ? 'Safety note: if you or someone else may be unsafe, contact local emergency services or a trusted person near you now.'
            : 'Do not decide from the spike. Let your body come down first.';
        startTimer();
        trackEvent('reset_started', { saveMode: doNotSave.checked ? 'no_save' : 'local_save', safetyFlag });
        resetFlow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    messageInput.addEventListener('input', () => {
        messageStatus.textContent = messageInput.value.trim() ? 'Private draft' : 'Private draft';
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
        trackEvent('message_exported');
    });

    deleteMessageButton.addEventListener('click', () => {
        if (!confirm('Delete the local unsent message?')) return;
        state.unsentMessage = '';
        state.messageSaved = false;
        saveState();
        messageInput.value = '';
        messageStatus.textContent = 'Deleted locally';
        trackEvent('message_deleted');
    });

    saveCounterButton.addEventListener('click', () => {
        if (!lastContactInput.value) return;
        state.lastContactAt = new Date(lastContactInput.value).getTime();
        saveState();
        renderCounter();
        trackEvent('counter_saved');
    });

    restartCounterButton.addEventListener('click', () => {
        state.lastContactAt = Date.now();
        lastContactInput.value = toDatetimeLocal(state.lastContactAt);
        saveState();
        renderCounter();
        trackEvent('counter_restarted');
    });

    realityForm.addEventListener('submit', (event) => {
        event.preventDefault();
        state.realityBox = Object.fromEntries(new FormData(realityForm).entries());
        saveState();
        trackEvent('reality_saved');
        const button = realityForm.querySelector('button[type="submit"]');
        const previous = button.textContent;
        button.textContent = 'Saved locally';
        setTimeout(() => { button.textContent = previous; }, 1200);
    });

    exportRealityButton.addEventListener('click', () => {
        const data = Object.fromEntries(new FormData(realityForm).entries());
        downloadFile('echo-box-reality-box.json', JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
        trackEvent('reality_exported');
    });

    clearRealityButton.addEventListener('click', () => {
        if (!confirm('Clear the local Reality Box?')) return;
        state.realityBox = {};
        saveState();
        realityForm.reset();
        trackEvent('reality_cleared');
    });

    necessaryReason.addEventListener('change', () => {
        necessaryGuidance.textContent = necessaryCopy[necessaryReason.value] || necessaryCopy.miss;
        trackEvent('necessary_filter_used', { reason: necessaryReason.value });
    });

    window.addEventListener('beforeunload', () => {
        if (state.resetEndsAt && Date.now() < state.resetEndsAt) {
            trackEvent('left_during_reset');
        }
    });

    function restoreScreen() {
        if (state.unsentMessage) {
            messageInput.value = state.unsentMessage;
            messageStatus.textContent = 'Saved locally';
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
        }
        necessaryGuidance.textContent = necessaryCopy[necessaryReason.value];
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
        if (existing && existing.headline && existing.cta) return existing;
        const created = {
            headline: Math.random() < 0.5 ? 'pause' : 'peace',
            cta: Math.random() < 0.5 ? 'box' : 'wait'
        };
        localStorage.setItem(keys.experiment, JSON.stringify(created));
        return created;
    }

    function applyExperiment() {
        const headline = document.getElementById('hero-headline');
        const cta = document.getElementById('put-in-box-button');
        headline.textContent = experiment.headline === 'peace'
            ? 'Protect your peace before you text.'
            : 'Do not send that message yet.';
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
        const events = safeJson(localStorage.getItem(keys.events)) || [];
        const session = getSessionId();
        const params = new URLSearchParams(window.location.search);
        const event = {
            name,
            at: new Date().toISOString(),
            path: window.location.pathname,
            session,
            experiment,
            device: window.matchMedia('(max-width: 640px)').matches ? 'mobile' : 'desktop',
            source: params.get('utm_source') || '',
            campaign: params.get('utm_campaign') || '',
            details: sanitizeDetails(details)
        };
        events.push(event);
        localStorage.setItem(keys.events, JSON.stringify(events.slice(-80)));
    }

    function getSessionId() {
        let session = localStorage.getItem(keys.session);
        if (!session) {
            session = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            localStorage.setItem(keys.session, session);
        }
        return session;
    }

    function sanitizeDetails(details) {
        const allowed = {};
        ['trigger', 'reason', 'saveMode', 'safetyFlag'].forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(details, key)) allowed[key] = details[key];
        });
        return allowed;
    }
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
    initBreakupReset();
});