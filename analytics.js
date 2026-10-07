(function () {
    const STORAGE_KEY = 'echoBoxAnalyticsEvents.v1';
    const SESSION_KEY = 'echoBoxAnalyticsSession.v1';
    const ATTRIBUTION_KEY = 'echoBoxAttribution.v2';
    const PRODUCT_VERSION = 'distribution-native-v1-2026-10-06';
    const ANALYTICS_CONFIG = Object.assign({ enabled: false, provider: '', id: '', debug: false }, window.ANALYTICS_CONFIG || {});
    const ALLOWED_EVENTS = new Set([
        'landing_view',
        'echo_start',
        'unsent_message_started',
        'unsent_message_saved_local',
        'reset_started',
        'trigger_selected',
        'reset_complete',
        'reset_completed',
        'no_contact_counter_created',
        'reality_box_created',
        'reality_box_opened',
        'reality_box_reopened',
        'kit_view',
        'paid_kit_cta_viewed',
        'paid_cta_clicked',
        'checkout_started',
        'reset_card_generated',
        'reset_card_downloaded',
        'share_clicked',
        'share_link_copied',
        'referral_visit',
        'gift_page_viewed',
        'no_contact_started',
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
        'tool_view',
        'tool_start',
        'tool_complete',
        'share_action',
        'email_opt_in_viewed',
        'email_opt_in_completed',
        'left_during_reset'
    ]);
    const ALLOWED_PROPERTIES = new Set([
        'page_slug',
        'cta_location',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'share_method',
        'referral_source',
        'tool_id',
        'result_type',
        'entry_source',
        'safety_mode'
    ]);
    const ALLOWED_TOOL_IDS = new Set(['no_contact_day_counter', 'mixed_signals_checker']);
    const ALLOWED_RESULT_TYPES = new Set([
        'KEEP_CURRENT_START', 'RESTART_COUNTER', 'NECESSARY_CONTACT_REVIEW', 'BOUNDARY_REVIEW',
        'BRIEF_REPLY', 'WAIT_FOR_CONSISTENCY', 'SET_BOUNDARY', 'DO_NOT_ENGAGE'
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
            if (!ALLOWED_PROPERTIES.has(key)) return;
            if (key === 'tool_id' && !ALLOWED_TOOL_IDS.has(value)) return;
            if (key === 'result_type' && !ALLOWED_RESULT_TYPES.has(value)) return;
            if (key === 'safety_mode' && typeof value !== 'boolean') return;
            clean[key] = value;
        });
        return clean;
    }

    function readStoredAttribution() {
        try {
            return JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function storeAttribution(attribution) {
        try {
            localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
        } catch (error) {
            // Attribution remains available for the current page when session storage is unavailable.
        }
    }

    function readUtm() {
        const params = new URLSearchParams(window.location.search);
        const stored = readStoredAttribution();
        const incoming = {
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            referral_source: ['reset-card', 'friend-share'].includes(params.get('ref')) ? params.get('ref') : ''
        };
        const hasIncoming = incoming.utm_source || incoming.utm_medium || incoming.utm_campaign || incoming.referral_source;
        const first = stored.first || (hasIncoming ? incoming : {});
        const last = hasIncoming ? incoming : (stored.last || first);
        if (hasIncoming || Object.keys(stored).length) {
            storeAttribution({ first, last });
        }
        return {
            utm_source: last.utm_source || '',
            utm_medium: last.utm_medium || '',
            utm_campaign: last.utm_campaign || '',
            referral_source: last.referral_source || '',
            firstSource: first.utm_source || '',
            firstMedium: first.utm_medium || '',
            firstCampaign: first.utm_campaign || '',
            lastSource: last.utm_source || '',
            lastMedium: last.utm_medium || '',
            lastCampaign: last.utm_campaign || '',
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
                referral_source: utm.referral_source,
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
                'reset_complete',
                'reset_started',
                'reset_completed',
                'reset_card_generated',
                'share_clicked',
                'share_link_copied',
                'referral_visit',
                'kit_view',
                'paid_cta_clicked',
                'checkout_started',
                'tool_view',
                'tool_start',
                'tool_complete',
                'share_action'
            ]);
            if (!PLAUSIBLE_FUNNEL_EVENTS.has(event.eventName)) return;
            window.plausible(event.eventName, {
                props: {
                    page_slug: event.properties.page_slug,
                    cta_location: event.properties.cta_location || '',
                    utm_source: event.properties.utm_source,
                    utm_medium: event.properties.utm_medium,
                    utm_campaign: event.properties.utm_campaign,
                    referral_source: event.properties.referral_source || '',
                    share_method: event.properties.share_method || '',
                    tool_id: event.properties.tool_id || '',
                    result_type: event.properties.result_type || '',
                    safety_mode: event.properties.safety_mode === true
                }
            });
        }
    }

    window.echoAnalytics = {
        trackEvent,
        getAttribution: readUtm,
        STORAGE_KEY,
        PRODUCT_VERSION,
        ANALYTICS_CONFIG
    };
})();
