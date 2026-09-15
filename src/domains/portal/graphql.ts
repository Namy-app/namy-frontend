import { gql } from "graphql-request";

export const PORTAL_LOGIN_MUTATION = gql`
  mutation PortalLogin($email: String!, $password: String!) {
    portalLogin(email: $email, password: $password) {
      tempToken
      mustChangePassword
      stores {
        id
        name
        city
        type
      }
    }
  }
`;

export const PORTAL_VERIFY_PIN_MUTATION = gql`
  mutation PortalVerifyPin(
    $tempToken: String!
    $storeId: String!
    $pin: String!
  ) {
    portalVerifyPin(tempToken: $tempToken, storeId: $storeId, pin: $pin) {
      accessToken
      mustChangePassword
      owner {
        id
        email
        mustChangePassword
      }
    }
  }
`;

export const PORTAL_SWITCH_STORE_MUTATION = gql`
  mutation PortalSwitchStore($storeId: String!) {
    portalSwitchStore(storeId: $storeId) {
      accessToken
    }
  }
`;

export const PORTAL_CHANGE_PASSWORD_MUTATION = gql`
  mutation PortalChangePassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    portalChangePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    )
  }
`;

export const MY_STORES_QUERY = gql`
  query MyStores {
    myStores {
      id
      name
      description
      imageUrl
      image1Url
      image2Url
      image3Url
      city
      type
      address
      price
      openDays
      billingEnabled
      billingStatus
      accumulatedBalance
      billing {
        accumulatedBalance
        lastBilledAt
        lastChargedAmount
      }
    }
  }
`;

export const MY_INVOICES_QUERY = gql`
  query MyInvoices($storeId: String!) {
    myInvoices(storeId: $storeId) {
      id
      storeId
      month
      totalRedemptions
      amountCharged
      status
      createdAt
    }
  }
`;

export const MY_OWNER_BILLING_QUERY = gql`
  query MyOwnerBilling {
    myOwnerBilling {
      accumulatedBalance
      lastBilledAt
      lastChargedAmount
      hasStripeCustomer
    }
  }
`;

export const MY_OWNER_INVOICES_QUERY = gql`
  query MyOwnerInvoices {
    myOwnerInvoices {
      id
      month
      totalRedemptions
      amountCharged
      status
      storeBreakdown {
        storeId
        storeName
        redemptions
        balance
      }
      createdAt
    }
  }
`;

export const MY_STORES_BALANCE_QUERY = gql`
  query MyStoresBalance {
    myStoresBalance {
      storeId
      storeName
      accumulatedBalance
      billingEnabled
      billingStatus
      redemptionsThisMonth
    }
  }
`;

export const MY_REDEMPTIONS_QUERY = gql`
  query MyRedemptions($storeId: String!, $month: String) {
    myRedemptions(storeId: $storeId, month: $month) {
      id
      storeId
      redeemedAt
      billTotalCents
      discountCents
    }
  }
`;

export const MY_ACTIVE_COUPONS_QUERY = gql`
  query MyActiveCoupons($storeId: String!) {
    myActiveCoupons(storeId: $storeId) {
      id
      code
      value
      expiresAt
      used
      storeId
      discountType
      discountTitle
    }
  }
`;

export const MY_DISCOUNTS_QUERY = gql`
  query MyDiscounts($storeId: String!) {
    myDiscounts(storeId: $storeId) {
      id
      title
      type
      value
      customText
      startDate
      endDate
    }
  }
`;

export const UPDATE_STORE_INFO_MUTATION = gql`
  mutation UpdateStoreInfo(
    $storeId: String!
    $description: String
    $imageUrl: String
    $image1Url: String
    $image2Url: String
    $image3Url: String
  ) {
    updateStoreInfo(
      storeId: $storeId
      description: $description
      imageUrl: $imageUrl
      image1Url: $image1Url
      image2Url: $image2Url
      image3Url: $image3Url
    ) {
      id
      name
      description
      imageUrl
      image1Url
      image2Url
      image3Url
      openDays
      billingEnabled
      billingStatus
      accumulatedBalance
      billing {
        accumulatedBalance
        lastBilledAt
        lastChargedAmount
      }
    }
  }
`;

export const UPDATE_STORE_HOURS_MUTATION = gql`
  mutation UpdateStoreHours($storeId: String!, $openDays: JSON!) {
    updateStoreHours(storeId: $storeId, openDays: $openDays) {
      id
      name
      description
      imageUrl
      image1Url
      image2Url
      image3Url
      openDays
      billingEnabled
      billingStatus
      accumulatedBalance
      billing {
        accumulatedBalance
        lastBilledAt
        lastChargedAmount
      }
    }
  }
`;

export const MY_PAYMENT_METHOD_QUERY = gql`
  query MyPaymentMethod {
    myPaymentMethod {
      last4
      brand
      expMonth
      expYear
    }
  }
`;

export const CREATE_SETUP_INTENT_MUTATION = gql`
  mutation CreateSetupIntent {
    createSetupIntent
  }
`;

export const SET_DEFAULT_PAYMENT_METHOD_MUTATION = gql`
  mutation SetDefaultPaymentMethod($paymentMethodId: String!) {
    setDefaultPaymentMethod(paymentMethodId: $paymentMethodId)
  }
`;
