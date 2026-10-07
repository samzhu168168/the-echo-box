(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.EchoBoxWave1 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const COUNTER_MILESTONES = Object.freeze([1, 3, 7, 14, 30]);
    const DAY_MS = 86400000;
    const HOUR_MS = 3600000;
    const MINUTE_MS = 60000;

    function calculateNoContactDuration(lastContactAt, now = Date.now()) {
        const start = Number(lastContactAt);
        const current = Number(now);
        if (!Number.isFinite(start) || !Number.isFinite(current)) {
            return { valid: false, elapsed: null, days: null, hours: null, minutes: null, nextMilestone: null };
        }
        const elapsed = Math.max(0, current - start);
        const days = Math.floor(elapsed / DAY_MS);
        const hours = Math.floor((elapsed % DAY_MS) / HOUR_MS);
        const minutes = Math.floor((elapsed % HOUR_MS) / MINUTE_MS);
        const nextMilestone = COUNTER_MILESTONES.find((day) => day > days) || 30;
        return { valid: true, elapsed, days, hours, minutes, nextMilestone };
    }

    function formatDuration(ms) {
        const duration = Number(ms);
        if (!Number.isFinite(duration)) return '0d 0h';
        const safe = Math.max(0, duration);
        const days = Math.floor(safe / DAY_MS);
        const hours = Math.floor((safe % DAY_MS) / HOUR_MS);
        return `${days}d ${hours}h`;
    }

    const PATTERNS = Object.freeze([
        'CLEAR_AND_CONSISTENT',
        'WARM_THEN_ABSENT',
        'LOW_EFFORT_ONLY',
        'LOGISTICS_THEN_EMOTIONAL',
        'BOUNDARY_NOT_RESPECTED'
    ]);
    const GOALS = Object.freeze([
        'ANSWER_A_CLEAR_REQUEST',
        'SEE_IF_ACTION_BECOMES_CONSISTENT',
        'KEEP_CONTACT_PRACTICAL',
        'STOP_OR_REDUCE_CONTACT'
    ]);
    const RESULTS = Object.freeze([
        'BRIEF_REPLY',
        'WAIT_FOR_CONSISTENCY',
        'SET_BOUNDARY',
        'DO_NOT_ENGAGE'
    ]);

    function evaluateMixedSignals(pattern, goal, safetyMode = false) {
        if (safetyMode === true) return 'DO_NOT_ENGAGE';
        if (!PATTERNS.includes(pattern) || !GOALS.includes(goal)) return null;
        if (pattern === 'BOUNDARY_NOT_RESPECTED') return 'DO_NOT_ENGAGE';
        if (goal === 'STOP_OR_REDUCE_CONTACT') return 'DO_NOT_ENGAGE';
        if (pattern === 'LOGISTICS_THEN_EMOTIONAL' || goal === 'KEEP_CONTACT_PRACTICAL') return 'SET_BOUNDARY';
        if (pattern === 'WARM_THEN_ABSENT' || pattern === 'LOW_EFFORT_ONLY' || goal === 'SEE_IF_ACTION_BECOMES_CONSISTENT') {
            return 'WAIT_FOR_CONSISTENCY';
        }
        if (pattern === 'CLEAR_AND_CONSISTENT' && goal === 'ANSWER_A_CLEAR_REQUEST') return 'BRIEF_REPLY';
        return null;
    }

    return {
        COUNTER_MILESTONES,
        DAY_MS,
        calculateNoContactDuration,
        formatDuration,
        PATTERNS,
        GOALS,
        RESULTS,
        evaluateMixedSignals
    };
});
