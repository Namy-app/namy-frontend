export type AnalyticsPlatform = "web" | "ios" | "android";

export type LogoutReason = "user" | "expiry" | "auth_error";

export type CouponUnlockMethod = "ad" | "quick_pay" | "premium";

export type NotificationClickSource = "push" | "inbox";

export interface IdentifyTraits {
  user_id: string;
  role?: string;
  verified?: boolean;
  is_premium?: boolean;
  auto_renew?: boolean;
  city?: string;
  country?: string;
  created_at?: string;
}

export interface AnalyticsEventMap {
  screen_viewed: {
    screen: string;
    path: string;
    store_id?: string;
  };
  app_opened: Record<string, never>;
  app_foregrounded: Record<string, never>;
  signup_completed: {
    has_referral_code: boolean;
  };
  login_completed: {
    remember_me: boolean;
  };
  logout: {
    reason?: LogoutReason;
  };
  email_verified: Record<string, never>;
  explore_viewed: {
    is_authenticated: boolean;
  };
  restaurant_viewed: {
    store_id: string;
    store_type?: string;
    discount_id?: string;
  };
  discount_unlock_started: {
    store_id: string;
    discount_id?: string;
    is_premium: boolean;
  };
  ad_session_started: {
    session_id: string;
    discount_id?: string;
    ad_count: number;
  };
  ad_completed: {
    video_ad_id: string;
    session_id?: string;
    watch_duration: number;
  };
  ad_failed: {
    reason: string;
    session_id?: string;
    video_ad_id?: string;
  };
  coupon_generated: {
    store_id?: string;
    discount_id?: string;
    method: CouponUnlockMethod;
    coupon_id?: string;
  };
  coupon_qr_viewed: {
    coupon_id: string;
    store_id?: string;
  };
  coupon_redeemed: {
    store_id: string;
    leveled_up: boolean;
  };
  coupon_redeem_failed: {
    store_id?: string;
    reason?: string;
  };
  level_up: {
    old_level: number;
    new_level: number;
  };
  notification_received: {
    novu_message_id?: string;
    type?: string;
  };
  notification_clicked: {
    source: NotificationClickSource;
    novu_message_id?: string;
    deep_link?: string;
  };
  promo_banner_viewed: {
    novu_message_id?: string;
    promo_id?: string;
    deep_link?: string;
  };
  promo_banner_clicked: {
    novu_message_id?: string;
    deep_link?: string;
  };
  promo_banner_dismissed: {
    novu_message_id?: string;
  };
  subscription_viewed: {
    is_premium?: boolean;
  };
  subscription_checkout_started: Record<string, never>;
  subscription_activated: Record<string, never>;
  subscription_checkout_canceled: Record<string, never>;
  wallet_deposit_succeeded: Record<string, never>;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
