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
  query GetAllStores {
    stores {
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
  }
`;

export const GET_STORE_BY_ID_QUERY = `
  query GetStoreById($id: String!) {
    store(id: $id) {
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
  }
`;

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
  }
`;

export const GET_DISCOUNT_BY_CODE_QUERY = `
  query GetDiscountByCode($code: String!) {
    discountByCode(code: $code) {
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
