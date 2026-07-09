(function () {
    const STORAGE_KEY = 'echoBoxAnalyticsEvents.v1';
    const SESSION_KEY = 'echoBoxAnalyticsSession.v1';
    const PRODUCT_VERSION = 'breakup-reset-mvp-2026-07-09';
    const ALLOWED_EVENTS = new Set([
        'landing_page_view',
        'unsent_message_started',
        'unsent_message_saved_local',
        'reset_started',
        'trigger_selected',
        'reset_completed',
        'no_contact_counter_created',
        'reality_box_created',
        'reality_box_reopened',
        'pricing_viewed',
        'paid_kit_cta_viewed',
        'paid_kit_cta_clicked',
        'gumroad_checkout_opened',
        'gumroad_checkout_failed',
        'return_visit_detected',
        'local_data_exported',
        'local_data_cleared'
    ]);
    const ALLOWED_PROPERTIES = new Set([
        'trigger',
        'reason',
        'saveMode',
        'safetyFlag',
        'completed',
        'productVersion',
        'price',
        'enabled',
        'destination'
    ]);

    function getSessionId() {
        let session = localStorage.getItem(SESSION_KEY);
        if (!session) {
            session = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            localStorage.setItem(SESSION_KEY, session);
        }
        return session;
    }

    function safeJson(value) {
        try {
            return JSON.parse(value || '[]');
        } catch (error) {
            return [];
        }
    }

    function sanitizeProperties(properties) {
        const clean = {};
        Object.entries(properties || {}).forEach(([key, value]) => {
            if (ALLOWED_PROPERTIES.has(key)) clean[key] = value;
        });
        clean.productVersion = PRODUCT_VERSION;
        return clean;
    }

    function readUtm() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_content: params.get('utm_content') || ''
        };
    }

    function trackEvent(eventName, properties = {}) {
        if (!ALLOWED_EVENTS.has(eventName)) return;
        const event = {
            eventName,
            at: new Date().toISOString(),
            session_id: getSessionId(),
            page: window.location.pathname,
            device: window.matchMedia('(max-width: 640px)').matches ? 'mobile' : 'desktop',
            utm: readUtm(),
            properties: sanitizeProperties(properties)
        };
        const events = safeJson(localStorage.getItem(STORAGE_KEY));
        events.push(event);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-150)));
        if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
            console.info('[EchoAnalytics]', event.eventName, event.properties);
        }
    }

    window.echoAnalytics = { trackEvent, STORAGE_KEY, PRODUCT_VERSION };
})();