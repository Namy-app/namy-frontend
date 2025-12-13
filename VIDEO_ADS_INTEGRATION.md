# Video Ads Integration Guide for Coupon Redemption

## Overview
This guide explains how to integrate rewarded video ads that users must watch before redeeming coupons.

## Components Created

### 1. `RewardedVideoAd` Component
**Location:** `src/components/RewardedVideoAd.tsx`

A reusable component that displays video ads and tracks completion.

**Props:**
- `onAdComplete: () => void` - Called when user finishes watching the ad
- `onAdSkipped?: () => void` - Called if user tries to skip
- `onAdError?: (error: Error) => void` - Called on ad loading errors
- `couponName?: string` - Name of the coupon being unlocked

**Features:**
- Shows video ad with countdown timer
- Prevents skipping during playback
- Rewards user only after complete view
- Fallback for test mode
- Progress bar visualization

### 2. Example Implementation
**Location:** `src/app/unlock-coupon/page.tsx`

A complete example showing:
- Locked coupon state (blurred preview)
- Video ad playback
- Unlocked coupon with QR code
- Full user flow

## Integration Steps

### Step 1: Add to Your Existing Coupon Page

```tsx
import { RewardedVideoAd } from '@/components/RewardedVideoAd';
import { useState } from 'react';

export default function YourCouponPage() {
  const [showAd, setShowAd] = useState(false);
  const [couponUnlocked, setCouponUnlocked] = useState(false);

  const handleAdComplete = async () => {
    // Call your backend to mark coupon as redeemed
    await redeemCoupon(couponId);
    setCouponUnlocked(true);
  };

  if (showAd) {
    return (
      <RewardedVideoAd
        onAdComplete={handleAdComplete}
        couponName="50% OFF Pizza"
      />
    );
  }

  if (couponUnlocked) {
    return <div>Show QR code / coupon details</div>;
  }

  return (
    <button onClick={() => setShowAd(true)}>
      Watch Video to Unlock
    </button>
  );
}
```

### Step 2: Get Video Ad Slot ID

1. Go to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. Navigate to **Ads** → **Ad units**
3. Create a new **Video ad unit** or **Rewarded ad unit**
4. Copy the **Ad Slot ID**
5. Update `src/components/RewardedVideoAd.tsx` line 89:
   ```tsx
   data-ad-slot="YOUR_VIDEO_AD_SLOT_ID"  // Replace this
   ```

### Step 3: Configure AdSense for Rewarded Ads

In your AdSense dashboard:
1. Enable **AdSense for games** (includes rewarded ads)
2. Create rewarded ad placements
3. Set reward values if needed
4. Enable video ad formats

### Step 4: Remove Test Mode for Production

In `src/components/RewardedVideoAd.tsx`, remove test attributes:
- Remove `data-adtest="on"` from line 89
- Remove test mode simulation logic (lines 50-55)

## Alternative: Using Video Ad Networks

For better video ad support, consider these alternatives:

### Option 1: Google AdMob (Recommended for Mobile Apps)
- Better video ad fill rates
- Rewarded video ads built-in
- Higher eCPM for video

**Setup:**
```bash
npm install @react-native-admob/admob
```

### Option 2: Unity Ads (Gaming Focus)
- Excellent video ad inventory
- Rewarded ads optimized
- Good for engagement

### Option 3: AppLovin MAX
- Video ad mediation
- Multiple ad networks
- Optimization built-in

## Backend Integration

Add coupon redemption tracking:

```typescript
// Example backend endpoint
POST /api/coupons/:id/redeem

{
  "adWatched": true,
  "adId": "ad-placement-id",
  "timestamp": "2025-12-09T17:00:00Z"
}

Response:
{
  "couponCode": "ABC123",
  "qrCode": "data:image/png;base64...",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

## User Flow

```
1. User sees locked coupon
   ↓
2. Clicks "Watch Video to Unlock"
   ↓
3. Video ad plays (30 seconds)
   ↓
4. Ad completes → Backend marks as redeemed
   ↓
5. Coupon code/QR code displayed
   ↓
6. User shows at restaurant
```

## Testing

Visit the demo page to test:
- **Test Page:** https://kiyoo.online/unlock-coupon
- **Ad Test Page:** https://kiyoo.online/test-ads

**Test Mode Features:**
- Simulates 30-second video
- Shows countdown timer
- No actual ads loaded
- Completes after countdown

## Important Notes

### Ad Loading Time
- Video ads can take 2-5 seconds to load
- Show loading state during this time
- Handle timeout scenarios

### Skip Prevention
- AdSense rewarded ads cannot be skipped by default
- Component tracks completion before calling `onAdComplete`
- Backend should verify ad completion before issuing coupon

### Ad Availability
- Not all regions have video ad inventory
- Fallback to display ads if video unavailable
- Consider showing "No ads available" state

### Revenue Optimization
- Video ads typically have higher eCPM than display
- Rewarded ads have best engagement
- Test different ad lengths (15s, 30s, 60s)

## Monetization Strategy

**Recommended Setup:**
1. **Primary:** Google AdSense Video/Rewarded Ads
2. **Secondary:** Display ads if video unavailable
3. **Fallback:** Allow coupon unlock after delay (poor UX but ensures functionality)

**Expected Revenue:**
- Video CPM: $5-$25 (varies by region)
- Completion Rate: 80-95% for rewarded ads
- Daily Active Users × Coupons Redeemed × CPM = Revenue

## Support

For issues or questions:
- Check browser console for ad loading errors
- Verify AdSense account is approved
- Ensure ad slots are created correctly
- Test with `data-adtest="on"` first
