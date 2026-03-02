// GraphQL queries and mutations for namy-api

// ============ AUTH ============
export const LOGIN_MUTATION = `
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      user {
        id
        email
        phone
        displayName
        avatarUrl
        role
        city
        country
        verified
        active
        isPremium
        premiumStartDate
        premiumEndDate
        autoRenew
        createdAt
        updatedAt
        lastSeen
        referralCode
      }
      accessToken
    }
  }
`;

export const SIGNUP_MUTATION = `
  mutation SignUp($input: CreateUserInput!) {
    signUp(input: $input) {
      user {
        id
        email
        phone
        displayName
        avatarUrl
        role
        city
        country
        verified
        active
        isPremium
        premiumStartDate
        premiumEndDate
        autoRenew
        createdAt
        updatedAt
        lastSeen
        referralCode
      }
      accessToken
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = `
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      message
    }
  }
`;

export const RESEND_VERIFICATION_MUTATION = `
  mutation ResendVerification($input: ResendVerificationInput!) {
    resendVerification(input: $input) {
      message
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`;

export const GET_CURRENT_USER_QUERY = `
  query GetCurrentUser {
    me {
      id
      email
      phone
      displayName
      avatarUrl
      role
      city
      country
      verified
      active
      isPremium
      premiumStartDate
      premiumEndDate
      autoRenew
      createdAt
      updatedAt
      lastSeen
      referralCode
    }
  }
`;

// ============ USER ============
export const GET_USER_BY_ID_QUERY = `
  query GetUserById($id: String!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: String!, $firstName: String, $lastName: String, $phoneNumber: String) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
    ) {
      id
      email
      firstName
      lastName
      phoneNumber
      updatedAt
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      id
      email
    }
  }
`;

// ============ STORE ============
export const GET_ALL_STORES_QUERY = `
  query GetAllStores($pagination: PaginationInput, $filters: StoreFiltersInput) {
    stores(pagination: $pagination, filters: $filters) {
      data {
        id
        name
        description
        address
        phoneNumber
        imageUrl
        active
        createdAt
        updatedAt
        type
        categoryIds
        averageRating
        reviewCounter
        city
        lat
        lng
        discountAvailabilityStatus
        discountAvailabilityText
      }
      paginationInfo {
        total
        page
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_STORE_QUERY = `
  query GetStoreByID($id: String!) {
    store(id: $id) {
      id
      name
      description
      address
      phoneNumber
      imageUrl
      active
      createdAt
      updatedAt
      type
      categoryIds
      averageRating
      reviewCounter
      city
      lat
      lng
      placeId
      plainPin
    }
  }
`;

export const CREATE_STORE_MUTATION = `
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      store {
        id
        placeId
        name
        description
        address
        phoneNumber
        imageUrl
        active
        createdAt
        updatedAt
        type
        categoryIds
        city
        lat
        lng
        price
        averageRating
        reviewCounter
        additionalInfo
        openDays
        tags
        url
      }
      plainPin
    }
  }
`;

export const UPDATE_STORE_MUTATION = `
  mutation UpdateStore($id: String!, $input: UpdateStoreInput!) {
    updateStore(id: $id, input: $input) {
      store {
        id
        name
        description
        categoryIds
        type
        city
        address
        placeId
        lat
        lng
        phoneNumber
        email
        price
        active
        url
        openDays
        tags
        restrictions
        averageRating
        reviewCounter
        additionalInfo
        imageUrl
        image1Url
        image2Url
        image3Url
        createdAt
        updatedAt
      }
      newPin
    }
  }
`;

export const DELETE_STORE_MUTATION = `
  mutation DeleteStore($id: String!) {
    deleteStore(id: $id) {
      id
      name
    }
  }
`;

// ============ CATEGORY ============
export const GET_ALL_CATEGORIES_QUERY = `
  query GetAllCategories {
    categories {
      id
      name
      iconUrl
      isActive
      createdAt
    }
  }
`;

export const GET_CATEGORIES_BY_NAME_QUERY = `
  query GetCategoriesByName($name: String!) {
    categories(filters: { name: $name }) {
      id
      name
      isActive
    }
  }
`;

export const GET_CATEGORY_BY_ID_QUERY = `
  query GetCategoryById($id: String!) {
    category(id: $id) {
      id
      name
      iconUrl
      isActive
    }
  }
`;

export const GET_CATEGORY_BY_NAME_QUERY = `
  query GetCategoryByName($name: String!) {
    categoryByName(name: $name) {
      id
      name
      iconUrl
      isActive
    }
  }
`;

// ============ SUBCATEGORY ============
export const GET_ALL_SUBCATEGORIES_QUERY = `
  query GetAllSubcategories($exclude: Boolean) {
    subcategories(filters: { exclude: $exclude }) {
      data {
        id
        name
        categoryId
        iconUrl
        isActive
      }
      paginationInfo {
        total
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_SUBCATEGORIES_BY_CATEGORY_QUERY = `
  query GetSubcategoriesByCategory($categoryId: String!, $exclude: Boolean) {
    subcategories(filters: { categoryId: $categoryId, exclude: $exclude }) {
      data {
        id
        name
        categoryId
        iconUrl
        isActive
      }
      paginationInfo {
        total
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_CATEGORIES_BY_STORE_TYPE_QUERY = `
  query GetCategoriesByStoreType($storeType: String, $name: String, $pagination: PaginationInput) {
    categories(filters: { storeType: $storeType, name: $name }, pagination: $pagination) {
      data {
        id
        name
        iconUrl
        storeType
        isActive
      }
      paginationInfo {
        total
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// ============ DISCOUNT ============
export const GET_ALL_DISCOUNTS_QUERY = `
  query GetAllDiscounts {
    discounts {
      data {
        id
        code
        description
        discountType
        discountValue
        minOrderValue
        maxDiscountAmount
        availableDaysAndTimes
        validFrom
        validTo
        isActive
        usageLimit
        usageCount
        storeId
        createdAt
        updatedAt
      }
      paginationInfo {
        total
        page
        first
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_DISCOUNT_BY_CODE_QUERY = `
  query GetDiscountByCode($code: String!) {
    discounts(filters: { code: $code }) {
      data {
        id
        code
        description
        discountType
        discountValue
        minOrderValue
        maxDiscountAmount
        availableDaysAndTimes
        validFrom
        validTo
        isActive
        usageLimit
        usageCount
        storeId
      }
      paginationInfo {
        total
        page
        first
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const VALIDATE_DISCOUNT_QUERY = `
  query ValidateDiscount($code: String!, $orderValue: Float!) {
    validateDiscount(code: $code, orderValue: $orderValue) {
      isValid
      discount {
        id
        code
        discountType
        discountValue
        maxDiscountAmount
      }
      finalAmount
      discountAmount
      message
    }
  }
`;

// ============ REDEEM PAGE ============
export const GET_COUPON_REDEEM_DETAILS_QUERY = `
  query GetCouponRedeemDetails($code: String!) {
    couponRedeemDetails(code: $code) {
      id
      code
      used
      usedAt
      expiresAt
      createdAt
      valid
      value
      store {
        id
        name
        description
        address
        city
        phoneNumber
        averageRating
        reviewCounter
      }
      discount {
        id
        title
        description
        type
        value
        minPurchaseAmount
        maxDiscountAmount
        availableDaysAndTimes
        excludedDaysOfWeek
        excludedHours
        additionalRestrictions
        restrictions
      }
    }
  }
`;

// Note: `GET_DISCOUNT_BY_ID_QUERY` and `GET_STORE_FOR_REDEEM_QUERY` were
// removed. Redeem flows and coupon lists should use `MY_COUPONS_QUERY` or
// `GET_COUPON_REDEEM_DETAILS_QUERY` which already include nested `discount`
// and `store` payloads. If other flows require these specific lookups,
// add a focused query at the callsite instead of a global export.

// ============ COUPONS ============
export const GENERATE_COUPON_MUTATION = `
  mutation GenerateCoupon($input: GenerateCouponInput!) {
    generateCoupon(input: $input) {
      code
      qrCode
      url
      discount {
        id
        title
        description
        type
        value
        minPurchaseAmount
        maxDiscountAmount
        excludedDaysOfWeek
        availableDaysAndTimes
        excludedHours
        restrictions
      }
      store {
        id
        name
        address
        city
        phoneNumber
        averageRating
        reviewCounter
      }
    }
  }
`;

export const QUICK_PAY_FOR_DISCOUNT_MUTATION = `
  mutation QuickPayForDiscount($discountId: String!) {
    quickPayForDiscount(discountId: $discountId) {
      code
      qrCode
      url
      discount {
        id
        title
        description
        type
        value
        minPurchaseAmount
        maxDiscountAmount
        excludedDaysOfWeek
        availableDaysAndTimes
        excludedHours
        restrictions
      }
      store {
        id
        name
        address
        city
        phoneNumber
        averageRating
        reviewCounter
      }
    }
  }
`;

// ============ USER LEVEL ============
export const GET_MY_LEVEL_QUERY = `
  query GetMyLevel {
    myLevel {
      level
      levelName
      discountPercentage
      monthlyUsageCount
      previousMonthUsageCount
      totalUsageCount
      usesUntilNextLevel
      currentMonthStart
      lastLevelUpdate
    }
  }
`;

// ============ ADS ============
export const REWARD_AD_MUTATION = `
  mutation RewardAd($input: RewardAdInput!) {
    rewardAd(input: $input) {
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`;

export const EXCHANGE_UNLOCK_MUTATION = `
  mutation ExchangeUnlock($input: ExchangeUnlockInput!) {
    exchangeUnlock(input: $input) {
      id
      code
      qrCode
      url
      used
      usedAt
      value
      expiresAt
      createdAt
      storeId
      discountId
    }
  }
`;

export const COUPONS_QUERY = `
  query MyCoupons($filters: CouponFiltersInput) {
    myCoupons(filters: $filters) {
      id
      code
      qrCode
      url
      used
      usedAt
      value
      expiresAt
      createdAt
      storeId
      discountId
      discount {
        id
        title
        description
        type
        value
        availableDaysAndTimes
        excludedDaysOfWeek
        excludedHours
        additionalRestrictions
        restrictions
      }
      store {
        id
        name
        address
        city
        restrictions
      }
    }
  }
`;

export const REDEEM_COUPON_BY_STAFF_MUTATION = `
  mutation RedeemCouponByStaff(
    $code: String!
    $storeId: String!
    $staffPin: String!
    $deviceId: String
  ) {
    redeemCouponByStaff(
      code: $code
      storeId: $storeId
      staffPin: $staffPin
      deviceId: $deviceId
    ) {
      success
      leveledUp
      newLevel
      oldLevel
      message
      pointsEarned
    }
  }
`;

export const DELETE_COUPON_MUTATION = `
  mutation DeleteCoupon($couponId: String!) {
    deleteCoupon(couponId: $couponId) {
      code
      qrCode
      url
      discount {
        id
        title
        restrictions
      }
      store {
        id
        name
      }
    }
  }
`;

// ============ PREMIUM SUBSCRIPTION ============
export const CREATE_PREMIUM_CHECKOUT_MUTATION = `
  mutation CreatePremiumCheckout($input: CreatePremiumCheckoutInput!) {
    createPremiumCheckoutSession(input: $input) {
      sessionId
      url
    }
  }
`;

export const CANCEL_PREMIUM_SUBSCRIPTION_MUTATION = `
  mutation CancelPremium {
    cancelPremiumSubscription {
      message
    }
  }
`;

export const TOGGLE_PREMIUM_AUTO_RENEW_MUTATION = `
  mutation ToggleAutoRenew($enabled: Boolean!) {
    togglePremiumAutoRenew(enabled: $enabled) {
      message
    }
  }
`;

export const MY_SUBSCRIPTION_STATUS_QUERY = `
  query MySubscriptionStatus {
    mySubscriptionStatus {
      isPremium
      premiumStartDate
      premiumEndDate
      autoRenew
    }
  }
`;

export const PAY_PREMIUM_WITH_WALLET_MUTATION = `
  mutation PayPremiumWithWallet {
    payPremiumWithWallet {
      message
    }
  }
`;

export const RESEND_STORE_PIN_EMAIL_MUTATION = `
  mutation ResendStorePinEmail($id: String!, $email: String!) {
    resendStorePinEmail(id: $id, email: $email)
  }
`;

// ============ YOUTUBE ADS ============
export const GET_YOUTUBE_AD_PAIR_QUERY = `
  query GetYouTubeAdPair($deviceId: String) {
    getYouTubeAdPair(deviceId: $deviceId) {
      ads {
        id
        videoId
        youtubeUrl
        title
        description
        duration
        priority
      }
      sessionId
    }
  }
`;

export const WATCH_YOUTUBE_AD_MUTATION = `
  mutation WatchYouTubeAd($input: WatchYouTubeAdInput!) {
    watchYouTubeAd(input: $input) {
      success
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`;

// Super Admin YouTube Ad Management
export const GET_ALL_YOUTUBE_ADS_QUERY = `
  query GetAllYouTubeAds {
    getAllYouTubeAds {
      id
      videoId
      youtubeUrl
      title
      description
      duration
      active
      priority
      impressionCount
      watchCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_YOUTUBE_AD_MUTATION = `
  mutation CreateYouTubeAd($input: CreateYouTubeAdInput!) {
    createYouTubeAd(input: $input) {
      id
      videoId
      youtubeUrl
      title
      description
      duration
      active
      priority
      impressionCount
      watchCount
      createdAt
    }
  }
`;

export const UPDATE_YOUTUBE_AD_MUTATION = `
  mutation UpdateYouTubeAd($input: UpdateYouTubeAdInput!) {
    updateYouTubeAd(input: $input) {
      id
      videoId
      youtubeUrl
      title
      description
      duration
      active
      priority
      impressionCount
      watchCount
      updatedAt
    }
  }
`;

export const DELETE_YOUTUBE_AD_MUTATION = `
  mutation DeleteYouTubeAd($id: String!) {
    deleteYouTubeAd(id: $id)
  }
`;

// ============ VIDEO ADS ============
export const REQUEST_VIDEO_UPLOAD_MUTATION = `
  mutation RequestVideoUpload($input: RequestVideoUploadInput!) {
    requestVideoUpload(input: $input) {
      uploadUrl
      videoKey
      publicUrl
    }
  }
`;

export const CREATE_VIDEO_AD_MUTATION = `
  mutation CreateVideoAd($input: CreateVideoAdInput!) {
    createVideoAd(input: $input) {
      id
      videoKey
      videoUrl
      thumbnailKey
      thumbnailUrl
      title
      description
      duration
      fileSize
      mimeType
      active
      priority
      impressionCount
      watchCount
      createdAt
    }
  }
`;

export const UPDATE_VIDEO_AD_MUTATION = `
  mutation UpdateVideoAd($input: UpdateVideoAdInput!) {
    updateVideoAd(input: $input) {
      id
      videoKey
      videoUrl
      thumbnailKey
      thumbnailUrl
      title
      description
      duration
      fileSize
      mimeType
      active
      priority
      impressionCount
      watchCount
      updatedAt
    }
  }
`;

export const DELETE_VIDEO_AD_MUTATION = `
  mutation DeleteVideoAd($id: String!) {
    deleteVideoAd(id: $id)
  }
`;

export const GET_ALL_VIDEO_ADS_QUERY = `
  query GetAllVideoAds {
    getAllVideoAds {
      id
      videoKey
      videoUrl
      thumbnailKey
      thumbnailUrl
      title
      description
      duration
      fileSize
      mimeType
      active
      priority
      impressionCount
      watchCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_VIDEO_AD_PAIR_QUERY = `
  query GetVideoAdPair($deviceId: String) {
    getVideoAdPair(deviceId: $deviceId) {
      ads {
        id
        videoKey
        videoUrl
        thumbnailKey
        thumbnailUrl
        title
        description
        duration
        fileSize
        mimeType
        priority
      }
      sessionId
    }
  }
`;

export const WATCH_VIDEO_AD_MUTATION = `
  mutation WatchVideoAd($input: WatchVideoAdInput!) {
    watchVideoAd(input: $input) {
      success
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`;

// ============ USER PROFILE ============
export const UPDATE_ME_MUTATION = `
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      id
      displayName
      avatarUrl
      email
    }
  }
`;

export const REQUEST_AVATAR_UPLOAD_MUTATION = `
  mutation RequestAvatarUpload($fileName: String!) {
    requestAvatarUpload(fileName: $fileName) {
      uploadUrl
      publicUrl
    }
  }
`;

// ============ REVIEWS ============
export const GET_STORE_REVIEWS_QUERY = `
  query GetStoreReviews($storeId: String!, $pagination: ReviewPaginationInput) {
    storeReviews(storeId: $storeId, pagination: $pagination) {
      data {
        id
        storeId
        userId
        title
        description
        rating
        createdAt
      }
      paginationInfo {
        total
        page
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = `
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      storeId
      userId
      title
      description
      rating
      createdAt
      pointsAwarded
    }
  }
`;

// ============ MURAL ============

const MURAL_POST_FIELDS = `
  id
  userId
  storeId
  imageUrl
  badge
  likes
  points
  status
  rejectionNote
  createdAt
  updatedAt
  user {
    id
    displayName
    avatarUrl
  }
  store {
    id
    name
    address
  }
  commentsCount
  isLikedByMe
`;

export const GET_MURAL_FEED_QUERY = `
  query MuralFeed($input: MuralFeedInput) {
    muralFeed(input: $input) {
      posts {
        ${MURAL_POST_FIELDS}
      }
      total
      page
      hasMore
    }
  }
`;

export const GET_MY_MURAL_POSTS_QUERY = `
  query MyMuralPosts($page: Int, $pageSize: Int) {
    myMuralPosts(page: $page, pageSize: $pageSize) {
      posts {
        ${MURAL_POST_FIELDS}
      }
      total
      page
      hasMore
    }
  }
`;

export const GET_MURAL_POST_QUERY = `
  query MuralPost($id: ID!) {
    muralPost(id: $id) {
      ${MURAL_POST_FIELDS}
    }
  }
`;

export const GET_MURAL_POST_COMMENTS_QUERY = `
  query MuralPostComments($postId: ID!, $page: Int, $pageSize: Int) {
    muralPostComments(postId: $postId, page: $page, pageSize: $pageSize) {
      comments {
        id
        postId
        userId
        content
        createdAt
        updatedAt
        user {
          id
          displayName
          avatarUrl
        }
      }
      total
      page
      hasMore
    }
  }
`;

export const CREATE_MURAL_POST_MUTATION = `
  mutation CreateMuralPost($input: CreateMuralPostInput!) {
    createMuralPost(input: $input) {
      ${MURAL_POST_FIELDS}
    }
  }
`;

export const DELETE_MURAL_POST_MUTATION = `
  mutation DeleteMuralPost($id: ID!) {
    deleteMuralPost(id: $id)
  }
`;

export const LIKE_MURAL_POST_MUTATION = `
  mutation LikeMuralPost($id: ID!) {
    likeMuralPost(id: $id) {
      id
      likes
    }
  }
`;

export const UNLIKE_MURAL_POST_MUTATION = `
  mutation UnlikeMuralPost($id: ID!) {
    unlikeMuralPost(id: $id) {
      id
      likes
    }
  }
`;

export const CREATE_MURAL_COMMENT_MUTATION = `
  mutation CreateMuralComment($input: CreateMuralCommentInput!) {
    createMuralComment(input: $input) {
      id
      postId
      userId
      content
      createdAt
      user {
        id
        displayName
        avatarUrl
      }
    }
  }
`;

export const DELETE_MURAL_COMMENT_MUTATION = `
  mutation DeleteMuralComment($id: ID!) {
    deleteMuralComment(id: $id)
  }
`;

// ============ MURAL MODERATION ============
export const MURAL_MODERATION_QUEUE_QUERY = `
  query MuralModerationQueue($input: MuralModerationQueueInput) {
    muralModerationQueue(input: $input) {
      posts {
        id
        userId
        storeId
        imageUrl
        status
        rejectionNote
        likes
        createdAt
        user {
          id
          displayName
          avatarUrl
          email
        }
        store {
          id
          name
          city
        }
      }
      total
      page
      hasMore
    }
  }
`;

export const MODERATE_MURAL_POST_MUTATION = `
  mutation ModerateMuralPost($id: ID!, $input: ModerateMuralPostInput!) {
    moderateMuralPost(id: $id, input: $input) {
      id
      status
      rejectionNote
    }
  }
`;

// ============ CHALLENGES ============
export const MY_CHALLENGES_QUERY = `
  query MyChallenges($status: String) {
    myChallenges(status: $status) {
      id
      challengeId
      status
      count
      challenge {
        id
        name
        entityType
        count
        points
        isActive
        expiresAt
      }
    }
  }
`;

// ============ LEADERBOARD ============
export const CITY_LEADERBOARD_QUERY = `
  query CityLeaderboard($limit: Int) {
    cityLeaderboard(limit: $limit) {
      rank
      userId
      displayName
      avatarUrl
      city
      balance
      isCurrentUser
    }
  }
`;
