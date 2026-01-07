# Namy UI Test Cases Documentation

## Test Coverage Overview

This document outlines comprehensive test cases for the Namy application features:
- Wallet Management
- Subscription Features
- Ad Viewing Flow
- Coupon Generation & Management

---

## 1. Wallet Functionality Test Cases

### 1.1 Wallet Page Display
**Test ID**: WALLET-001
**Priority**: High
**Description**: Verify wallet page renders correctly with user balance

**Test Steps**:
1. Navigate to /wallet as authenticated user
2. Verify wallet balance is displayed
3. Verify transaction history table is visible
4. Verify "Add Funds" button is present

**Expected Results**:
- Wallet page loads without errors
- Current balance shows correctly formatted currency
- Transaction history displays (or empty state if no transactions)
- UI elements are properly styled and accessible

---

### 1.2 Add Funds Flow
**Test ID**: WALLET-002
**Priority**: High
**Description**: Test adding funds to wallet

**Test Steps**:
1. Click "Add Funds" button
2. Enter amount (e.g., $50.00)
3. Select payment method
4. Confirm transaction

**Expected Results**:
- Modal/form opens for adding funds
- Amount input validates correctly (positive numbers only)
- Payment gateway integration works
- Balance updates after successful transaction
- Success message displayed
- Transaction appears in history

**Edge Cases**:
- Invalid amounts (negative, zero, non-numeric)
- Payment failure handling
- Network timeout scenarios

---

### 1.3 Transaction History
**Test ID**: WALLET-003
**Priority**: Medium
**Description**: Verify transaction history displays correctly

**Test Steps**:
1. View wallet page with existing transactions
2. Check transaction list ordering
3. Verify transaction details (amount, date, type, status)
4. Test pagination if applicable

**Expected Results**:
- Transactions ordered by date (newest first)
- Each transaction shows: date, amount, type, status
- Positive/negative amounts clearly indicated
- Pagination works correctly
- Empty state shown when no transactions

---

### 1.4 Wallet Access Control
**Test ID**: WALLET-004
**Priority**: High
**Description**: Verify wallet is protected (authentication required)

**Test Steps**:
1. Attempt to access /wallet without authentication
2. Log in and access /wallet
3. Log out while on wallet page

**Expected Results**:
- Unauthenticated users redirected to login
- Authenticated users can access wallet
- Session expiry redirects to login
- User's own wallet data only (not other users')

---

## 2. Subscription Test Cases

### 2.1 Subscription Plans Display
**Test ID**: SUB-001
**Priority**: High
**Description**: Verify subscription plans are displayed correctly

**Test Steps**:
1. Navigate to /subscription as guest
2. Navigate to /subscription as authenticated user
3. View all available plans
4. Check plan details (price, features, duration)

**Expected Results**:
- All plans visible and properly styled
- Free and Premium plans clearly distinguished
- Features list accurate for each plan
- Pricing displayed correctly
- Call-to-action buttons present

---

### 2.2 Subscribe to Premium
**Test ID**: SUB-002
**Priority**: High
**Description**: Test premium subscription purchase flow

**Test Steps**:
1. Click "Subscribe" on Premium plan
2. Review subscription details
3. Select payment method
4. Complete payment
5. Verify subscription activation

**Expected Results**:
- Subscription modal/page opens
- Payment process completes successfully
- User status updates to Premium
- Confirmation email sent (if applicable)
- Premium features immediately accessible
- Wallet balance deducted (if paying from wallet)

**Edge Cases**:
- Insufficient wallet balance
- Payment failure
- Already subscribed user
- Downgrade from higher tier

---

### 2.3 Subscription Status Display
**Test ID**: SUB-003
**Priority**: Medium
**Description**: Verify current subscription status is displayed

**Test Steps**:
1. Log in as free user - check status
2. Log in as premium user - check status
3. Check subscription expiry date
4. Verify renewal information

**Expected Results**:
- Current plan clearly indicated
- Expiry date shown for premium users
- Auto-renewal status visible
- Upgrade/downgrade options available

---

### 2.4 Subscription Benefits
**Test ID**: SUB-004
**Priority**: Medium
**Description**: Verify premium benefits are enforced

**Test Steps**:
1. As free user, attempt premium-only actions
2. Subscribe to premium
3. Verify premium features now accessible

**Expected Results**:
- Free users blocked from premium features
- Premium users have full access
- Instant coupon generation works for premium
- No ads/reduced ads for premium users
- Higher discount percentages applied

---

## 3. Ad Viewing Flow Test Cases

### 3.1 Video Ad Modal Display
**Test ID**: ADS-001
**Priority**: High
**Description**: Verify video ad modal opens and displays correctly

**Test Steps**:
1. Click "Watch Ads to Unlock" on discount
2. Verify modal opens
3. Check video player loads
4. Verify progress indicator (Video 1 of 2)

**Expected Results**:
- Modal opens smoothly
- Video player loads without errors
- Video autoplays (or shows play button)
- Progress text accurate
- Close button functional
- Mobile-responsive design (9:16 aspect ratio)

---

### 3.2 Video Playback Controls
**Test ID**: ADS-002
**Priority**: High
**Description**: Test video player controls functionality

**Test Steps**:
1. Open ad video modal
2. Test play/pause button
3. Test mute/unmute button
4. Observe progress bar
5. Wait for video to complete

**Expected Results**:
- Play/pause toggles correctly
- Mute/unmute works
- Progress bar updates in real-time
- Current time displayed
- Video completion detected
- Can't skip ahead (enforced viewing)

---

### 3.3 Multi-Video Sequence
**Test ID**: ADS-003
**Priority**: High
**Description**: Verify watching multiple ad videos in sequence

**Test Steps**:
1. Complete first video
2. Verify automatic transition to second video
3. Complete second video
4. Check unlock token generation

**Expected Results**:
- First video completion triggers second video
- Smooth transition between videos
- "Guardando..." indicator shows briefly
- No delay between videos
- After last video, success screen shows
- Unlock token generated

**Edge Cases**:
- Network interruption during video
- Closing modal mid-video
- Refreshing page during ad viewing
- API failure during progress tracking

---

### 3.4 Ad Completion and Rewards
**Test ID**: ADS-004
**Priority**: High
**Description**: Verify successful ad completion unlocks coupon

**Test Steps**:
1. Watch all required ads
2. See success message
3. Click "Desbloquear tu cupón"
4. Verify coupon generated

**Expected Results**:
- Success screen shows after all ads
- Confetti animation plays
- "Unlock Coupon" button enabled
- Clicking button generates coupon
- Redirected to my-coupons or success page
- Coupon appears in user's list

---

### 3.5 Ad Rate Limiting
**Test ID**: ADS-005
**Priority**: Medium
**Description**: Verify rate limiting for coupon generation

**Test Steps**:
1. Watch ads and generate coupon
2. Immediately try to generate another coupon
3. Wait specified cooldown period
4. Try again

**Expected Results**:
- Error message: "Ya generaste un cupón recientemente"
- Cooldown time displayed (e.g., "espera 27 minutos")
- Premium users bypass rate limit
- After cooldown, generation works again

---

## 4. Coupon Management Test Cases

### 4.1 My Coupons Page Display
**Test ID**: COUPON-001
**Priority**: High
**Description**: Verify my-coupons page displays user's coupons

**Test Steps**:
1. Navigate to /my-coupons
2. View coupon list
3. Check filtering options
4. Test empty state (no coupons)

**Expected Results**:
- All user coupons displayed
- Coupons show: code, QR, expiry, status
- Filter tabs work (All, Active, Redeemed, Expired)
- Empty state shows helpful message
- Guest users redirected to login

---

### 4.2 Coupon Filtering
**Test ID**: COUPON-002
**Priority**: Medium
**Description**: Test coupon filter tabs

**Test Steps**:
1. Click "Active" filter
2. Click "Redeemed" filter
3. Click "Expired" filter
4. Click "All" filter

**Expected Results**:
- Only active coupons shown in Active tab
- Only redeemed coupons in Redeemed tab
- Only expired coupons in Expired tab
- All coupons shown in All tab
- Counter updates for each filter
- Empty state if no coupons match filter

---

### 4.3 QR Code Display
**Test ID**: COUPON-003
**Priority**: High
**Description**: Verify QR code modal functionality

**Test Steps**:
1. Click "View QR" on a coupon
2. Verify QR code displays
3. Check coupon code shown
4. Test share functionality
5. Close modal

**Expected Results**:
- Modal opens smoothly
- QR code image loads
- Coupon code displayed clearly
- Share button works
- Restrictions shown (if any)
- Close button functional
- QR code scannable

---

### 4.4 Coupon Sharing
**Test ID**: COUPON-004
**Priority**: Medium
**Description**: Test coupon sharing functionality

**Test Steps**:
1. Click share button on coupon
2. Select share method
3. Verify share data

**Expected Results**:
- Share modal/native share opens
- Coupon code included in share
- Coupon URL included
- Share completes successfully
- Fallback: copy to clipboard works

---

### 4.5 Coupon Expiration
**Test ID**: COUPON-005
**Priority**: Medium
**Description**: Verify expired coupons are handled correctly

**Test Steps**:
1. View coupon list with expired coupons
2. Try to use expired coupon
3. Check visual indicators

**Expected Results**:
- Expired coupons marked clearly
- Cannot generate QR for expired
- Moved to "Expired" filter automatically
- Expiry date prominently displayed
- Warning message if trying to use

---

### 4.6 Coupon Redemption
**Test ID**: COUPON-006
**Priority**: High
**Description**: Verify coupon can be redeemed (merchant side)

**Test Steps**:
1. Merchant scans QR code
2. System validates coupon
3. Coupon marked as used
4. Discount applied

**Expected Results**:
- QR scan works correctly
- Coupon validation succeeds
- Used status updated immediately
- Cannot reuse same coupon
- User sees coupon in "Redeemed" filter
- Proper error if already used

---

## 5. Integration Test Cases

### 5.1 End-to-End: Guest to Coupon
**Test ID**: E2E-001
**Priority**: Critical
**Description**: Complete flow from guest to coupon generation

**Test Steps**:
1. Visit site as guest
2. Browse restaurants/services
3. Register/login
4. Select discount
5. Watch ads
6. Generate coupon
7. View in my-coupons

**Expected Results**:
- Smooth flow without errors
- Guest can browse freely
- Registration/login works
- Ad viewing completes
- Coupon generated successfully
- Appears in my-coupons immediately

---

### 5.2 Premium User Flow
**Test ID**: E2E-002
**Priority**: High
**Description**: Premium user instant coupon generation

**Test Steps**:
1. Login as premium user
2. Select discount
3. Generate coupon (no ads)
4. Verify coupon created

**Expected Results**:
- No ad viewing required
- Instant coupon generation
- No rate limiting
- Premium benefits active

---

## 6. Edge Cases & Error Handling

### 6.1 Network Failures
- **Test**: Disconnect network during ad viewing
- **Expected**: Graceful error handling, retry options

### 6.2 Concurrent Usage
- **Test**: Multiple tabs trying to generate coupons
- **Expected**: Proper synchronization, no duplicate coupons

### 6.3 Session Expiry
- **Test**: Session expires during wallet/coupon operations
- **Expected**: Redirect to login, state preserved where possible

### 6.4 Invalid Data
- **Test**: Malformed coupon codes, invalid wallet amounts
- **Expected**: Validation errors, clear user feedback

---

## 7. Performance Test Cases

### 7.1 Page Load Times
- Wallet page loads < 2s
- My Coupons page loads < 2s
- Video modal opens < 1s

### 7.2 Video Streaming
- Videos load and start playing < 3s
- No buffering for < 30s videos
- Smooth transitions between videos

### 7.3 Large Data Sets
- 100+ coupons render correctly
- Pagination works smoothly
- Filtering remains performant

---

## Test Execution Priority

**P0 (Critical - Must Pass)**:
- WALLET-004, ADS-003, ADS-004, COUPON-001, COUPON-006, E2E-001

**P1 (High - Should Pass)**:
- WALLET-001, WALLET-002, SUB-001, SUB-002, ADS-001, ADS-002, COUPON-003

**P2 (Medium - Nice to Pass)**:
- All remaining test cases

**P3 (Low - Future Enhancement)**:
- Performance tests, advanced edge cases
