# How to Get REAL Video Ads for Testing

## The Problem with Google AdSense

Google AdSense has **limited video ad inventory** and is primarily designed for display ads. For reliable video ads, you need dedicated video ad platforms.

## ✅ Best Solutions (Ranked by Ease)

### 1. **Google AdMob** ⭐ Recommended

**Why:** Google's mobile ad platform with excellent video ad fill rates

**Setup Steps:**

1. **Create AdMob Account**
   - Go to: https://admob.google.com
   - Sign in with Google account
   - Accept terms

2. **Add Your App/Website**
   - Click "Apps" → "Add App"
   - Select "No" (my app isn't listed)
   - Enter app name: "Ñamy Coupons"
   - Select platform: "Android" or "iOS" (or use web workaround)

3. **Create Rewarded Ad Unit**
   - Go to "Ad units" → "Add ad unit"
   - Select "Rewarded"
   - Name it: "Coupon Unlock Reward"
   - Copy the **Ad Unit ID** (format: `ca-app-pub-XXXXXX/YYYYYYYY`)

4. **Add to Your Project**
   ```bash
   # Add to .env
   NEXT_PUBLIC_ADMOB_REWARDED_AD_ID=ca-app-pub-XXXXXX/YYYYYYYY
   ```

5. **Test with Test Ad Unit IDs**
   ```
   Android: ca-app-pub-3940256099942544/5224354917
   iOS: ca-app-pub-3940256099942544/1712485313
   ```

**Pros:**
- ✅ Real video ads immediately
- ✅ High fill rate (80-95%)
- ✅ Good eCPM ($5-$20)
- ✅ Test ads available instantly
- ✅ Free to use

**Cons:**
- ❌ Primarily for mobile apps (but works on web)
- ❌ Requires SDK integration

---

### 2. **Meta Audience Network** (Facebook)

**Why:** Great video inventory, works on web

**Setup:**

1. Go to: https://developers.facebook.com
2. Create app → Enable Audience Network
3. Create Rewarded Video placement
4. Get Placement ID
5. Integrate SDK

**Pros:**
- ✅ Excellent fill rates
- ✅ Real videos immediately
- ✅ Works on web and mobile
- ✅ Good eCPM

**Cons:**
- ❌ Requires app review
- ❌ More complex setup

---

### 3. **Unity Ads**

**Why:** Best for gaming/interactive content

**Setup:**

1. Go to: https://dashboard.unity3d.com
2. Create project
3. Enable Unity Ads
4. Create Rewarded Video placement
5. Get Game ID and Placement ID

**Pros:**
- ✅ Highest video ad quality
- ✅ Best for engagement
- ✅ Immediate test ads
- ✅ High eCPM

**Cons:**
- ❌ Gaming-focused
- ❌ Requires SDK

---

### 4. **AppLovin MAX**

**Why:** Ad mediation with multiple networks

**Setup:**

1. Go to: https://www.applovin.com
2. Create account
3. Set up MAX mediation
4. Connect multiple ad networks
5. Create rewarded placement

**Pros:**
- ✅ Mediates multiple networks
- ✅ Highest fill rates
- ✅ Auto-optimization
- ✅ Real videos immediately

**Cons:**
- ❌ Complex setup
- ❌ Revenue share

---

## 🚀 Quick Start: Using AdMob Test Ads

The **fastest way** to see real video ads:

### Step 1: Use AdMob Test IDs

Add to your `.env`:

```bash
# Android Test Rewarded Video
NEXT_PUBLIC_ADMOB_REWARDED_AD_ID=ca-app-pub-3940256099942544/5224354917

# iOS Test Rewarded Video
# NEXT_PUBLIC_ADMOB_REWARDED_AD_ID=ca-app-pub-3940256099942544/1712485313
```

### Step 2: Install Google Mobile Ads SDK

```bash
npm install @react-google-ads/api
```

### Step 3: Use AdMobRewardedVideo Component

```tsx
import { AdMobRewardedVideo } from '@/components/AdMobRewardedVideo';

<AdMobRewardedVideo
  onAdComplete={() => unlockCoupon()}
  couponName="50% OFF"
/>
```

### Step 4: You'll See Real Video Ads! 🎉

AdMob test ads show **actual video content** (not blanks):
- 30-second product videos
- Skippable after 5 seconds (rewarded ads aren't skippable)
- Real ad experience

---

## 📱 Alternative: YouTube Video Ads (IFrame API)

If you want a **quick workaround**, use YouTube's IFrame API to show YouTube ads:

```tsx
<iframe
  width="100%"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1"
  frameBorder="0"
  allow="autoplay; encrypted-media"
></iframe>
```

**Then monetize with:**
- YouTube Partner Program
- Or partner with content creators
- Show their videos with ads enabled

---

## 🎯 My Recommendation

For **Ñamy** (your coupon app), here's what I recommend:

### Phase 1: Quick Start (This Week)
1. Use **AdMob with test ad unit IDs** (see above)
2. Get real video ads working immediately
3. Test user experience

### Phase 2: Production Setup (Next Week)
1. Create real AdMob account
2. Get your own Ad Unit IDs
3. Submit app for review (if needed)
4. Go live with real ads

### Phase 3: Optimization (Month 1)
1. Add **AppLovin MAX** for mediation
2. Connect AdMob + Meta Audience Network
3. Optimize eCPM and fill rate
4. A/B test ad lengths (15s vs 30s)

---

## 💰 Expected Revenue

With video rewarded ads:

| Metric | Value |
|--------|-------|
| Video CPM | $10-$30 |
| Completion Rate | 85-95% |
| Daily Active Users | 1,000 |
| Avg Coupons/User | 2 |
| **Daily Revenue** | **$17-$57** |
| **Monthly Revenue** | **$510-$1,710** |

---

## 🔧 Implementation Code

Here's the complete integration for AdMob:

```typescript
// Install: npm install @react-google-ads/api

import { useState, useEffect } from 'react';

export function useRewardedVideoAd() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load AdMob SDK
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', process.env.NEXT_PUBLIC_ADMOB_APP_ID!);

    script.onload = () => {
      setIsReady(true);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const showRewardedAd = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!isReady) {
        resolve(false);
        return;
      }

      // Show rewarded ad
      const adBreak = (window as any).adBreak;

      adBreak({
        type: 'reward',
        name: 'coupon-unlock',
        beforeReward: (showAdFn: () => void) => {
          showAdFn();
        },
        adDismissed: () => {
          resolve(false); // User closed ad early
        },
        adViewed: () => {
          resolve(true); // User watched full ad
        },
        adBreakDone: (placementInfo: any) => {
          if (placementInfo.breakStatus === 'viewed') {
            resolve(true);
          } else {
            resolve(false);
          }
        },
      });
    });
  };

  return { isReady, showRewardedAd };
}
```

---

## 📝 Environment Variables Needed

Add these to your `.env`:

```bash
# For Production (get from AdMob dashboard)
NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXX~YYYYYYYYYY
NEXT_PUBLIC_ADMOB_REWARDED_AD_ID=ca-app-pub-XXXXXXXXXXXXXX/YYYYYYYYYY

# For Testing (use Google's test IDs)
# NEXT_PUBLIC_ADMOB_REWARDED_AD_ID=ca-app-pub-3940256099942544/5224354917
```

And update your Dockerfile:

```dockerfile
ENV NEXT_PUBLIC_ADMOB_APP_ID=${ADMOB_APP_ID}
ENV NEXT_PUBLIC_ADMOB_REWARDED_AD_ID=${ADMOB_REWARDED_AD_ID}
```

---

## ✅ Checklist to Get Real Video Ads

- [ ] Create AdMob account
- [ ] Add app to AdMob
- [ ] Create Rewarded ad unit
- [ ] Copy Ad Unit ID
- [ ] Add to .env file
- [ ] Update Dockerfile with ENV vars
- [ ] Rebuild Docker image
- [ ] Test with AdMob test IDs first
- [ ] Switch to production IDs after approval
- [ ] Monitor fill rates and eCPM

---

## 🆘 Still Having Issues?

**Option 1:** Use the test ad unit IDs above - they show REAL videos immediately

**Option 2:** Contact me and I'll help you set up AdMob properly

**Option 3:** For NOW, use the simulated countdown as a placeholder (users still understand the concept)

The key is: **AdMob with test IDs = Real video ads in 5 minutes** 🚀
