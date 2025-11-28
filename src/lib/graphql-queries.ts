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
        email
        logo
        coverImage
        isActive
        ownerId
        createdAt
        updatedAt
      }
      paginationInfo {
        total
        page
        limit
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// Removed `GET_STORE_BY_ID_QUERY` — use `GET_COUPON_REDEEM_DETAILS_QUERY`
// for redeem flows which already return `store` + `discount` nested data.

export const CREATE_STORE_MUTATION = `
  mutation CreateStore(
    $name: String!
    $description: String
    $address: String
    $phoneNumber: String
    $email: String
    $logo: String
    $coverImage: String
    $ownerId: String!
  ) {
    createStore(
      name: $name
      description: $description
      address: $address
      phoneNumber: $phoneNumber
      email: $email
      logo: $logo
      coverImage: $coverImage
      ownerId: $ownerId
    ) {
      id
      name
      description
      isActive
      createdAt
    }
  }
`;

export const UPDATE_STORE_MUTATION = `
  mutation UpdateStore(
    $id: String!
    $name: String
    $description: String
    $address: String
    $phoneNumber: String
    $email: String
    $logo: String
    $coverImage: String
    $isActive: Boolean
  ) {
    updateStore(
      id: $id
      name: $name
      description: $description
      address: $address
      phoneNumber: $phoneNumber
      email: $email
      logo: $logo
      coverImage: $coverImage
      isActive: $isActive
    ) {
      id
      name
      description
      isActive
      updatedAt
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
        limit
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
        limit
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

export const COUPONS_QUERY = `
  query Coupons($pagination: PaginationInput, $filters: CouponFiltersInput) {
    coupons(pagination: $pagination, filters: $filters) {
      id
      code
      qrCode
      url
      used
      usedAt
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
      }
      store {
        id
        name
        address
        city
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
      }
      store {
        id
        name
      }
    }
  }
`;
