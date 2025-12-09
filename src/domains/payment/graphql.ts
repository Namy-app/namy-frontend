import { gql } from "graphql-request";

// ==================== Wallet Queries ====================

export const GET_WALLET = gql`
  query GetWallet($input: GetWalletInput!) {
    wallet(input: $input) {
      id
      userId
      balance
      currency
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_WALLET_BALANCE = gql`
  query GetWalletBalance($walletId: ID!) {
    walletBalance(walletId: $walletId) {
      balance
      availableBalance
      currency
    }
  }
`;

export const GET_WALLET_TRANSACTIONS = gql`
  query GetWalletTransactions($input: GetTransactionsInput!) {
    walletTransactions(input: $input) {
      data {
        id
        walletId
        type
        status
        amount
        balanceBefore
        balanceAfter
        currency
        description
        metadata
        referenceId
        referenceType
        createdAt
        updatedAt
        processedAt
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

// ==================== Wallet Mutations ====================

export const CREATE_WALLET = gql`
  mutation CreateWallet($input: CreateWalletInput!) {
    createWallet(input: $input) {
      id
      userId
      balance
      currency
      isActive
      frozenAmount
      createdAt
      updatedAt
    }
  }
`;

export const DEPOSIT_TO_WALLET = gql`
  mutation DepositToWallet(
    $walletId: ID!
    $amount: Int!
    $description: String
    $referenceId: String
    $referenceType: String
  ) {
    depositToWallet(
      walletId: $walletId
      amount: $amount
      description: $description
      referenceId: $referenceId
      referenceType: $referenceType
    ) {
      id
      amount
      balanceAfter
      status
      description
      createdAt
    }
  }
`;

export const WITHDRAW_FROM_WALLET = gql`
  mutation WithdrawFromWallet(
    $walletId: ID!
    $amount: Int!
    $description: String
  ) {
    withdrawFromWallet(
      walletId: $walletId
      amount: $amount
      description: $description
    ) {
      id
      amount
      balanceAfter
      status
      description
      createdAt
    }
  }
`;

export const SPEND_FROM_WALLET = gql`
  mutation SpendFromWallet($input: SpendFromWalletInput!) {
    spendFromWallet(input: $input) {
      id
      walletId
      type
      status
      amount
      balanceBefore
      balanceAfter
      currency
      description
      metadata
      referenceId
      referenceType
      createdAt
      updatedAt
      processedAt
    }
  }
`;

// ==================== Payment Mutations ====================

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      id
      clientSecret
      amount
      currency
      status
      description
    }
  }
`;

export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
    createCheckoutSession(input: $input) {
      id
      url
      amount
      currency
      status
    }
  }
`;

export const GET_PAYMENT_INTENT = gql`
  query GetPaymentIntent($paymentIntentId: String!) {
    paymentIntent(paymentIntentId: $paymentIntentId) {
      id
      clientSecret
      amount
      currency
      status
      description
    }
  }
`;

export const CANCEL_PAYMENT_INTENT = gql`
  mutation CancelPaymentIntent($paymentIntentId: String!) {
    cancelPaymentIntent(paymentIntentId: $paymentIntentId) {
      id
      status
    }
  }
`;

// ==================== Subscription Queries ====================

export const GET_SUBSCRIPTION = gql`
  query GetSubscription($id: ID!) {
    subscription(id: $id) {
      id
      walletId
      name
      amount
      currency
      interval
      intervalCount
      status
      startDate
      nextBillingDate
      endDate
      trialEndDate
      description
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUBSCRIPTIONS_BY_WALLET = gql`
  query GetSubscriptionsByWallet($walletId: ID!) {
    subscriptionsByWallet(walletId: $walletId) {
      id
      walletId
      name
      amount
      currency
      interval
      intervalCount
      status
      startDate
      nextBillingDate
      endDate
      trialEndDate
      description
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_SUBSCRIPTIONS_BY_WALLET = gql`
  query GetActiveSubscriptionsByWallet($walletId: ID!) {
    activeSubscriptionsByWallet(walletId: $walletId) {
      id
      walletId
      name
      amount
      currency
      interval
      intervalCount
      status
      startDate
      nextBillingDate
      endDate
      trialEndDate
      description
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUBSCRIPTION_BILLING_HISTORY = gql`
  query GetSubscriptionBillingHistory($subscriptionId: ID!) {
    subscriptionBillingHistory(subscriptionId: $subscriptionId) {
      id
      subscriptionId
      transactionId
      amount
      status
      billingDate
      paidAt
      failureReason
      retryCount
      createdAt
    }
  }
`;

// ==================== Subscription Mutations ====================

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      id
      walletId
      name
      amount
      currency
      interval
      intervalCount
      status
      startDate
      nextBillingDate
      endDate
      trialEndDate
      description
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription($input: CancelSubscriptionInput!) {
    cancelSubscription(input: $input) {
      id
      status
      endDate
      updatedAt
    }
  }
`;

export const PAUSE_SUBSCRIPTION = gql`
  mutation PauseSubscription($subscriptionId: ID!) {
    pauseSubscription(subscriptionId: $subscriptionId) {
      id
      status
      updatedAt
    }
  }
`;

export const RESUME_SUBSCRIPTION = gql`
  mutation ResumeSubscription($subscriptionId: ID!) {
    resumeSubscription(subscriptionId: $subscriptionId) {
      id
      status
      nextBillingDate
      updatedAt
    }
  }
`;

export const PROCESS_SUBSCRIPTION_BILLING = gql`
  mutation ProcessSubscriptionBilling($subscriptionId: ID!) {
    processSubscriptionBilling(subscriptionId: $subscriptionId) {
      id
      subscriptionId
      transactionId
      amount
      status
      billingDate
      paidAt
      failureReason
      retryCount
      createdAt
    }
  }
`;
