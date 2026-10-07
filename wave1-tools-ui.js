(function () {
    const STORAGE_KEY = 'echoBoxBreakupData.v1';
    const tools = window.EchoBoxWave1;
    if (!tools) return;

    const track = (name, properties = {}) => window.echoAnalytics?.trackEvent?.(name, properties);
    const safeState = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch (_) { return {}; }
    };
    const saveState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const cleanToolUrl = () => `${window.location.origin}${window.location.pathname}`;

    async function copyToolLink(toolId, status) {
        const url = cleanToolUrl();
        try { await navigator.clipboard.writeText(url); }
        catch (_) {
            const field = document.createElement('textarea');
            field.value = url;
            field.setAttribute('readonly', '');
            field.style.position = 'fixed';
            field.style.opacity = '0';
            document.body.append(field);
            field.select();
            document.execCommand('copy');
            field.remove();
        }
        status.textContent = 'Tool link copied. No private inputs were included.';
        track('share_action', { tool_id: toolId, share_method: 'copy' });
    }

    function initCounter() {
        const form = document.getElementById('counter-tool-form');
        if (!form) return;
        const toolId = 'no_contact_day_counter';
        const input = document.getElementById('tool-last-contact');
        const error = document.getElementById('counter-error');
        const output = document.getElementById('counter-output');
        const timeText = document.getElementById('counter-time-text');
        const milestoneText = document.getElementById('counter-milestone-text');
        const restartFieldset = document.getElementById('restart-check');
        const restartResult = document.getElementById('restart-result');
        const restartButton = document.getElementById('confirm-restart');
        const shareStatus = document.getElementById('tool-share-status');
        let started = false;
        let resultType = 'KEEP_CURRENT_START';

        track('tool_view', { tool_id: toolId });
        const state = safeState();
        if (Number.isFinite(Number(state.lastContactAt))) input.value = toLocalValue(Number(state.lastContactAt));

        input.addEventListener('change', () => {
            if (!started) { track('tool_start', { tool_id: toolId }); started = true; }
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            error.textContent = '';
            if (!input.value) return showError('Choose your last direct contact date and time.');
            const timestamp = new Date(input.value).getTime();
            if (!Number.isFinite(timestamp)) return showError('Enter a valid date and time.');
            if (timestamp > Date.now()) return showError('The last contact time cannot be in the future.');
            if (!started) { track('tool_start', { tool_id: toolId }); started = true; }
            const currentState = safeState();
            currentState.lastContactAt = timestamp;
            const counter = tools.calculateNoContactDuration(timestamp, Date.now());
            currentState.longestNoContactMs = Math.max(Number(currentState.longestNoContactMs) || 0, counter.elapsed);
            saveState(currentState);
            renderCounter(counter, currentState.longestNoContactMs);
            resultType = 'KEEP_CURRENT_START';
        });

        restartFieldset.addEventListener('change', (event) => {
            const choice = event.target.value;
            const routes = {
                no_direct_contact: ['KEEP_CURRENT_START', 'Keep the current start time. No new direct contact was selected.'],
                initiated_personal: ['RESTART_COUNTER', 'A personal or emotional contact can mark a new start. Restart only after you confirm.'],
                practical_reply: ['NECESSARY_CONTACT_REVIEW', 'A narrow practical reply does not automatically require a restart. Keep the exchange limited to the task.'],
                required_logistics: ['NECESSARY_CONTACT_REVIEW', 'Required logistics can stay inside a no-contact boundary when they remain factual and limited.'],
                online_checking: ['BOUNDARY_REVIEW', 'Online checking can keep the loop active, but this tool will not silently change your start time.']
            };
            if (!routes[choice]) return;
            [resultType, restartResult.textContent] = routes[choice];
            restartResult.dataset.result = resultType;
            restartButton.hidden = resultType !== 'RESTART_COUNTER';
            track('tool_complete', { tool_id: toolId, result_type: resultType });
        });

        restartButton.addEventListener('click', () => {
            if (!confirm('Restart the counter from now? Your longest local record will be kept.')) return;
            const currentState = safeState();
            currentState.lastContactAt = Date.now();
            input.value = toLocalValue(currentState.lastContactAt);
            saveState(currentState);
            const counter = tools.calculateNoContactDuration(currentState.lastContactAt, Date.now());
            renderCounter(counter, Number(currentState.longestNoContactMs) || 0);
            restartResult.textContent = 'Counter restarted from now. Your longest local record was kept.';
        });

        document.getElementById('counter-share-link').addEventListener('click', () => copyToolLink(toolId, shareStatus));
        document.querySelector('[data-tool-paid="counter_result"]')?.addEventListener('click', () => {
            track('paid_cta_clicked', { tool_id: toolId, cta_location: 'counter_result' });
        });

        function renderCounter(counter, longest) {
            timeText.textContent = `${counter.days} days, ${counter.hours} hours, ${counter.minutes} minutes protected.`;
            milestoneText.textContent = `Next milestone: ${counter.nextMilestone} days. Longest local record: ${tools.formatDuration(longest)}.`;
            output.hidden = false;
            output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        function showError(message) { error.textContent = message; output.hidden = true; }
    }

    function initMixedSignals() {
        const form = document.getElementById('mixed-signals-form');
        if (!form) return;
        const toolId = 'mixed_signals_checker';
        const error = document.getElementById('checker-error');
        const resultCard = document.getElementById('checker-result');
        const resultTitle = document.getElementById('checker-result-title');
        const observed = document.getElementById('result-observed');
        const notClaiming = document.getElementById('result-not-claiming');
        const nextMove = document.getElementById('result-next-move');
        const resetOption = document.getElementById('result-reset-option');
        const normalActions = document.getElementById('checker-normal-actions');
        const safetyActions = document.getElementById('checker-safety-actions');
        const paidOption = document.getElementById('checker-paid-option');
        const oneContact = document.getElementById('one-contact-route');
        const shareStatus = document.getElementById('checker-share-status');
        let started = false;

        const copy = {
            BRIEF_REPLY: ['A clear request and repeated follow-through, with no boundary warning.', 'This does not prove romantic intent or a future outcome.', 'Answer the literal request briefly. Do not add a relationship conversation.', 'Draft it privately and wait ten minutes before sending.'],
            WAIT_FOR_CONSISTENCY: ['Contact is present, but action does not repeatedly follow.', 'We are not deciding why they do this or what they feel.', 'Do not chase clarification. Wait for a clear request or consistent action.', 'Use the Reality Box and Reset before replying to the next spike.'],
            SET_BOUNDARY: ['Practical contact is expanding beyond its purpose, or your goal is to keep it limited.', 'A boundary is not a diagnosis or punishment.', 'State one allowed topic, channel, or time and end the exchange when it moves outside that scope.', 'Put the boundary sentence in the Unsent Message box first.'],
            DO_NOT_ENGAGE: ['A stated boundary is not being respected, or a safety concern was selected.', 'This tool cannot determine motive or provide emergency or legal advice.', 'Do not answer through the tool. Preserve relevant records and seek appropriate support if needed.', 'Use the free reset only when you are safe; safety support comes first.']
        };

        track('tool_view', { tool_id: toolId });
        form.addEventListener('change', () => {
            if (!started) { track('tool_start', { tool_id: toolId }); started = true; }
        });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            error.textContent = '';
            resultCard.hidden = true;
            oneContact.hidden = true;
            const data = new FormData(form);
            const safety = data.get('safety');
            if (!safety) return showError('Choose a safety answer first.');
            if (safety === 'yes') return showResult('DO_NOT_ENGAGE', true);
            const windowValue = data.get('pattern_window');
            if (!windowValue) return showError('Choose how long this pattern has repeated.');
            if (windowValue === 'ONE_CONTACT_ONLY') {
                oneContact.hidden = false;
                oneContact.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            }
            const pattern = data.get('pattern');
            const goal = data.get('goal');
            if (!pattern) return showError('Choose the dominant observable pattern.');
            if (!goal) return showError('Choose one bounded goal.');
            const result = tools.evaluateMixedSignals(pattern, goal, false);
            if (!result) return showError('This combination has no approved result. Start over and try again.');
            showResult(result, false);
        });

        document.getElementById('checker-start-over').addEventListener('click', () => {
            form.reset();
            error.textContent = '';
            resultCard.hidden = true;
            oneContact.hidden = true;
            started = false;
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        document.getElementById('checker-share-link').addEventListener('click', () => copyToolLink(toolId, shareStatus));
        document.querySelector('[data-tool-paid="mixed_signals_result"]')?.addEventListener('click', () => {
            track('paid_cta_clicked', { tool_id: toolId, cta_location: 'mixed_signals_result' });
        });

        function showResult(result, safetyMode) {
            const content = copy[result];
            resultTitle.textContent = result.replaceAll('_', ' ');
            [observed.textContent, notClaiming.textContent, nextMove.textContent, resetOption.textContent] = content;
            normalActions.hidden = safetyMode;
            safetyActions.hidden = !safetyMode;
            paidOption.hidden = safetyMode;
            resultCard.hidden = false;
            resultCard.dataset.result = result;
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            track('tool_complete', { tool_id: toolId, result_type: result, safety_mode: safetyMode });
        }
        function showError(message) { error.textContent = message; }
    }

    function toLocalValue(timestamp) {
        const date = new Date(timestamp);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initCounter();
        initMixedSignals();
    });
})();
