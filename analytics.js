(function () {
    const STORAGE_KEY = 'echoBoxAnalyticsEvents.v1';
    const SESSION_KEY = 'echoBoxAnalyticsSession.v1';
    const PRODUCT_VERSION = 'relaunch-phase1-2026-08-31';
    const ANALYTICS_CONFIG = Object.assign({ enabled: false, provider: '', id: '', debug: false }, window.ANALYTICS_CONFIG || {});
    const ALLOWED_EVENTS = new Set([
        'landing_view',
        'echo_start',
        'unsent_message_started',
        'unsent_message_saved_local',
        'reset_start',
        'trigger_selected',
        'reset_complete',
        'no_contact_counter_created',
        'reality_box_created',
        'reality_box_reopened',
        'kit_view',
        'paid_kit_cta_viewed',
        'checkout_start',
        'gumroad_checkout_opened',
        'gumroad_checkout_failed',
        'gumroad_checkout_fallback_used',
        'necessary_contact_filter_used',
        'return_visit_detected',
        'return_visit_day_1',
        'return_visit_day_3',
        'return_visit_day_7',
        'local_data_exported',
        'local_data_cleared',
        'seo_tool_started',
        'seo_tool_completed',
        'email_opt_in_viewed',
        'email_opt_in_completed',
        'left_during_reset'
    ]);
    const ALLOWED_PROPERTIES = new Set([
        'page_slug',
        'cta_location',
        'utm_source',
        'utm_medium',
        'utm_campaign'
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
        return clean;
    }

    function readUtm() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            page_slug: window.location.pathname
        };
    }

    function trackEvent(eventName, properties = {}) {
        if (!ALLOWED_EVENTS.has(eventName)) return;
        const utm = readUtm();
        const event = {
            eventName,
            at: new Date().toISOString(),
            anonymous_session_id: getSessionId(),
            page: window.location.pathname,
            device_category: window.matchMedia('(max-width: 640px)').matches ? 'mobile' : 'desktop',
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            product_version: PRODUCT_VERSION,
            properties: sanitizeProperties({
                ...properties,
                page_slug: window.location.pathname,
                utm_source: utm.utm_source,
                utm_medium: utm.utm_medium,
                utm_campaign: utm.utm_campaign
            })
        };
        const events = safeJson(localStorage.getItem(STORAGE_KEY));
        events.push(event);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-150)));
        sendToProvider(event);
        if (ANALYTICS_CONFIG.debug) {
            console.info('[EchoAnalytics]', event.eventName, event.properties);
        }
    }

    function sendToProvider(event) {
        if (!ANALYTICS_CONFIG.enabled || !ANALYTICS_CONFIG.provider || !ANALYTICS_CONFIG.id) return;
        if (ANALYTICS_CONFIG.provider === 'plausible' && typeof window.plausible === 'function') {
            const PLAUSIBLE_FUNNEL_EVENTS = new Set([
                'landing_view',
                'echo_start',
                'reset_start',
                'reset_complete',
                'kit_view',
                'checkout_start'
            ]);
            if (!PLAUSIBLE_FUNNEL_EVENTS.has(event.eventName)) return;
            window.plausible(event.eventName, {
                props: {
                    page_slug: event.properties.page_slug,
                    cta_location: event.properties.cta_location || '',
                    utm_source: event.properties.utm_source,
                    utm_medium: event.properties.utm_medium,
                    utm_campaign: event.properties.utm_campaign
                }
            });
        }
    }

    window.echoAnalytics = { trackEvent, STORAGE_KEY, PRODUCT_VERSION, ANALYTICS_CONFIG };
})();
