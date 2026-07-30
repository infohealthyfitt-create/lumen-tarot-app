export type AnalyticsEvent =
  | 'homepage_view'
  | 'start_reading'
  | 'category_selected'
  | 'question_submitted'
  | 'card_selected'
  | 'reading_completed'
  | 'premium_offer_viewed'
  | 'checkout_started'
  | 'purchase_completed'
  | 'daily_card_drawn'
  | 'share_clicked'
  | 'signup_completed';

type EventProps = Record<string, string | number | boolean | undefined>;

/**
 * Vendor-agnostic analytics dispatcher. Swap the internals to point at
 * Segment, PostHog, Plausible, GA4, etc. — call sites never need to change.
 * With NEXT_PUBLIC_ANALYTICS_PROVIDER unset ("none"), this is a safe no-op
 * that only logs in development.
 */
export function track(event: AnalyticsEvent, props: EventProps = {}) {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'none';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, props);
  }

  if (provider === 'none' || typeof window === 'undefined') return;

  const w = window as any;
  switch (provider) {
    case 'segment':
      w.analytics?.track?.(event, props);
      break;
    case 'posthog':
      w.posthog?.capture?.(event, props);
      break;
    case 'plausible':
      w.plausible?.(event, { props });
      break;
    case 'ga4':
      w.gtag?.('event', event, props);
      break;
    default:
      break;
  }
}
