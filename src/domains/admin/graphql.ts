import { gql } from "graphql-request";

// ==================== Store Mutations ====================

export const CREATE_STORE_MUTATION = gql`
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      store {
        id
        name
        description
        categoryId
        subCategory
        type
        city
        address
        lat
        lng
        phoneNumber
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
      plainPin
    }
  }
`;

export const UPDATE_STORE_MUTATION = gql`
  mutation UpdateStore($id: String!, $input: UpdateStoreInput!) {
    updateStore(id: $id, input: $input) {
      store {
        id
        name
        description
        categoryId
        subCategory
        type
        city
        address
        lat
        lng
        phoneNumber
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

export const DELETE_STORE_MUTATION = gql`
  mutation DeleteStore($id: String!) {
    deleteStore(id: $id)
  }
`;

export const TOGGLE_STORE_ACTIVE_MUTATION = gql`
  mutation ToggleStoreActive($id: String!) {
    toggleStoreActive(id: $id) {
      id
      name
      active
    }
  }
`;

// ==================== Store Queries ====================

export const GET_STORE_STATISTICS = gql`
  query GetStoreStatistics($filters: StoreFiltersInput) {
    storeStatistics(filters: $filters) {
      total
      active
      inactive
      byType {
        product
        service
      }
      byPriceRange {
        budget
        moderate
        expensive
        luxury
      }
    }
  }
`;

export const GET_ALL_STORES = gql`
  query GetAllStores(
    $filters: StoreFiltersInput
    $pagination: PaginationInput
  ) {
    stores(filters: $filters, pagination: $pagination) {
      data {
        id
        name
        description
        imageUrl
        image1Url
        image2Url
        image3Url
        categoryId
        subCategory
        type
        city
        address
        lat
        lng
        phoneNumber
        price
        active
        url
        openDays
        tags
        restrictions
        averageRating
        reviewCounter
        additionalInfo
        createdAt
        updatedAt
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

export const GET_STORE_BY_ID = gql`
  query GetStoreById($id: String!) {
    store(id: $id) {
      id
      name
      description
      imageUrl
      image1Url
      image2Url
      image3Url
      categoryId
      subCategory
      type
      city
      address
      lat
      lng
      phoneNumber
      price
      active
      url
      openDays
      tags
      restrictions
      pin
      averageRating
      reviewCounter
      additionalInfo
      createdAt
      updatedAt
    }
  }
`;

export const GET_STORE_PIN = gql`
  query GetStorePin($id: String!) {
    storePin(id: $id)
  }
`;

// ==================== Discount Queries & Mutations ====================

export const GET_STORE_DISCOUNTS = gql`
  query GetStoreDiscounts(
    $filters: DiscountFiltersInput
    $pagination: PaginationInput
  ) {
    discounts(filters: $filters, pagination: $pagination) {
      data {
        id
        storeId
        title
        description
        type
        value
        code
        startDate
        endDate
        active
        maxUses
        usedCount
        minPurchaseAmount
        maxDiscountAmount
        excludedDaysAndTime
        excludedDaysOfWeek
        excludedHours
        additionalRestrictions
        maxUsesPerUserPerMonth
        monthlyRedemptionCap
        createdAt
        updatedAt
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

export const CREATE_DISCOUNT = gql`
  mutation CreateDiscount($input: CreateDiscountInput!) {
    createDiscount(input: $input) {
      id
      storeId
      title
      description
      type
      value
      code
      startDate
      endDate
      active
      maxUses
      usedCount
      minPurchaseAmount
      maxDiscountAmount
      excludedDaysOfWeek
      excludedHours
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_DISCOUNT = gql`
  mutation UpdateDiscount($id: String!, $input: UpdateDiscountInput!) {
    updateDiscount(id: $id, input: $input) {
      id
      title
      description
      type
      value
      active
      updatedAt
    }
  }
`;

export const DELETE_DISCOUNT = gql`
  mutation DeleteDiscount($id: String!) {
    deleteDiscount(id: $id)
  }
`;

// ==================== Coupon Queries ====================

export const GET_STORE_COUPONS = gql`
  query GetStoreCoupons(
    $filters: CouponFiltersInput
    $pagination: PaginationInput
  ) {
    coupons(filters: $filters, pagination: $pagination) {
      data {
        id
        userId
        discountId
        storeId
        code
        qrCode
        used
        usedAt
        createdAt
        expiresAt
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

// ==================== Catalog Queries & Mutations ====================

// Note: We'll need to add these to the backend if they don't exist
export const GET_STORE_CATALOGS = gql`
  query GetStoreCatalogs(
    $storeId: String!
    $pagination: CatalogPaginationInput
  ) {
    storeCatalogs(storeId: $storeId, pagination: $pagination) {
      data {
        id
        storeId
        name
        description
        image1Url
        image2Url
        image3Url
        image4Url
        image5Url
        image6Url
        image7Url
        image8Url
        image9Url
        image10Url
        active
        createdAt
        updatedAt
      }
      total
      page
      totalPages
    }
  }
`;

export const CREATE_CATALOG = gql`
  mutation CreateCatalog($input: CreateCatalogInput!) {
    createCatalog(input: $input) {
      id
      storeId
      name
      description
      image1Url
      image2Url
      image3Url
      image4Url
      image5Url
      image6Url
      image7Url
      image8Url
      image9Url
      image10Url
      active
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATALOG = gql`
  mutation UpdateCatalog($input: UpdateCatalogInput!) {
    updateCatalog(input: $input) {
      id
      storeId
      name
      description
      image1Url
      image2Url
      image3Url
      image4Url
      image5Url
      image6Url
      image7Url
      image8Url
      image9Url
      image10Url
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATALOG_ITEMS = gql`
  query GetCatalogItems($catalogId: String!) {
    catalogItems(catalogId: $catalogId) {
      id
      catalogId
      name
      url
    }
  }
`;

export const CREATE_CATALOG_ITEM = gql`
  mutation CreateCatalogItem($input: CreateCatalogItemInput!) {
    createCatalogItem(input: $input) {
      id
      catalogId
      name
      url
    }
  }
`;

// ==================== User Management Queries ====================

export const GET_USERS = gql`
  query GetUsers(
    $page: Int
    $first: Int
    $includeDisabled: Boolean
    $search: String
  ) {
    users(
      page: $page
      first: $first
      includeDisabled: $includeDisabled
      search: $search
    ) {
      data {
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

export const GET_USER_DETAILS_WITH_ACTIVITY = gql`
  query GetUserDetailsWithActivity($userId: String!) {
    userDetailsWithActivity(userId: $userId) {
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
      level
      monthlyUsageCount
      totalCouponUsageCount
      totalCoupons
      totalRedemptions
      coupons {
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
      redemptions {
        id
        couponId
        userId
        storeId
        redeemedAt
        billTotalCents
        discountCents
        pointsEarned
        comment
        coupon {
          id
          code
          used
          usedAt
          expiresAt
          createdAt
          store {
            id
            name
            city
          }
          discount {
            id
            title
            type
            value
          }
        }
      }
    }
  }
`;
