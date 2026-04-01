(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var r=e.i(75555),i=e.i(40143),n=e.i(86491),s=e.i(15823),a=e.i(93803),o=e.i(19273),u=e.i(80166),l=class extends s.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#r=(0,a.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#i=void 0;#n=void 0;#s=void 0;#a;#o;#r;#t;#u;#l;#c;#d;#f;#h;#p=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#i.addObserver(this),c(this.#i,this.options)?this.#m():this.updateResult(),this.#y())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return d(this.#i,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return d(this.#i,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#g(),this.#b(),this.#i.removeObserver(this)}setOptions(e){let t=this.options,r=this.#i;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,o.resolveEnabled)(this.options.enabled,this.#i))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#v(),this.#i.setOptions(this.options),t._defaulted&&!(0,o.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#i,observer:this});let i=this.hasListeners();i&&f(this.#i,r,this.options,t)&&this.#m(),this.updateResult(),i&&(this.#i!==r||(0,o.resolveEnabled)(this.options.enabled,this.#i)!==(0,o.resolveEnabled)(t.enabled,this.#i)||(0,o.resolveStaleTime)(this.options.staleTime,this.#i)!==(0,o.resolveStaleTime)(t.staleTime,this.#i))&&this.#x();let n=this.#E();i&&(this.#i!==r||(0,o.resolveEnabled)(this.options.enabled,this.#i)!==(0,o.resolveEnabled)(t.enabled,this.#i)||n!==this.#h)&&this.#T(n)}getOptimisticResult(e){var t,r;let i=this.#e.getQueryCache().build(this.#e,e),n=this.createResult(i,e);return t=this,r=n,(0,o.shallowEqualObjects)(t.getCurrentResult(),r)||(this.#s=n,this.#o=this.options,this.#a=this.#i.state),n}getCurrentResult(){return this.#s}trackResult(e,t){return new Proxy(e,{get:(e,r)=>(this.trackProp(r),t?.(r),"promise"===r&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#r.status||this.#r.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,r))})}trackProp(e){this.#p.add(e)}getCurrentQuery(){return this.#i}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),r=this.#e.getQueryCache().build(this.#e,t);return r.fetch().then(()=>this.createResult(r,t))}fetch(e){return this.#m({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#s))}#m(e){this.#v();let t=this.#i.fetch(this.options,e);return e?.throwOnError||(t=t.catch(o.noop)),t}#x(){this.#g();let e=(0,o.resolveStaleTime)(this.options.staleTime,this.#i);if(o.isServer||this.#s.isStale||!(0,o.isValidTimeout)(e))return;let t=(0,o.timeUntilStale)(this.#s.dataUpdatedAt,e);this.#d=u.timeoutManager.setTimeout(()=>{this.#s.isStale||this.updateResult()},t+1)}#E(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#i):this.options.refetchInterval)??!1}#T(e){this.#b(),this.#h=e,!o.isServer&&!1!==(0,o.resolveEnabled)(this.options.enabled,this.#i)&&(0,o.isValidTimeout)(this.#h)&&0!==this.#h&&(this.#f=u.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||r.focusManager.isFocused())&&this.#m()},this.#h))}#y(){this.#x(),this.#T(this.#E())}#g(){this.#d&&(u.timeoutManager.clearTimeout(this.#d),this.#d=void 0)}#b(){this.#f&&(u.timeoutManager.clearInterval(this.#f),this.#f=void 0)}createResult(e,t){let r,i=this.#i,s=this.options,u=this.#s,l=this.#a,d=this.#o,p=e!==i?e.state:this.#n,{state:m}=e,y={...m},g=!1;if(t._optimisticResults){let r=this.hasListeners(),a=!r&&c(e,t),o=r&&f(e,i,t,s);(a||o)&&(y={...y,...(0,n.fetchState)(m.data,e.options)}),"isRestoring"===t._optimisticResults&&(y.fetchStatus="idle")}let{error:b,errorUpdatedAt:v,status:x}=y;r=y.data;let E=!1;if(void 0!==t.placeholderData&&void 0===r&&"pending"===x){let e;u?.isPlaceholderData&&t.placeholderData===d?.placeholderData?(e=u.data,E=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#c?.state.data,this.#c):t.placeholderData,void 0!==e&&(x="success",r=(0,o.replaceData)(u?.data,e,t),g=!0)}if(t.select&&void 0!==r&&!E)if(u&&r===l?.data&&t.select===this.#u)r=this.#l;else try{this.#u=t.select,r=t.select(r),r=(0,o.replaceData)(u?.data,r,t),this.#l=r,this.#t=null}catch(e){this.#t=e}this.#t&&(b=this.#t,r=this.#l,v=Date.now(),x="error");let T="fetching"===y.fetchStatus,A="pending"===x,I="error"===x,U=A&&T,R=void 0!==r,w={status:x,fetchStatus:y.fetchStatus,isPending:A,isSuccess:"success"===x,isError:I,isInitialLoading:U,isLoading:U,data:r,dataUpdatedAt:y.dataUpdatedAt,error:b,errorUpdatedAt:v,failureCount:y.fetchFailureCount,failureReason:y.fetchFailureReason,errorUpdateCount:y.errorUpdateCount,isFetched:y.dataUpdateCount>0||y.errorUpdateCount>0,isFetchedAfterMount:y.dataUpdateCount>p.dataUpdateCount||y.errorUpdateCount>p.errorUpdateCount,isFetching:T,isRefetching:T&&!A,isLoadingError:I&&!R,isPaused:"paused"===y.fetchStatus,isPlaceholderData:g,isRefetchError:I&&R,isStale:h(e,t),refetch:this.refetch,promise:this.#r,isEnabled:!1!==(0,o.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===w.status?e.reject(w.error):void 0!==w.data&&e.resolve(w.data)},r=()=>{t(this.#r=w.promise=(0,a.pendingThenable)())},n=this.#r;switch(n.status){case"pending":e.queryHash===i.queryHash&&t(n);break;case"fulfilled":("error"===w.status||w.data!==n.value)&&r();break;case"rejected":("error"!==w.status||w.error!==n.reason)&&r()}}return w}updateResult(){let e=this.#s,t=this.createResult(this.#i,this.options);if(this.#a=this.#i.state,this.#o=this.options,void 0!==this.#a.data&&(this.#c=this.#i),(0,o.shallowEqualObjects)(t,e))return;this.#s=t;let r=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,r="function"==typeof t?t():t;if("all"===r||!r&&!this.#p.size)return!0;let i=new Set(r??this.#p);return this.options.throwOnError&&i.add("error"),Object.keys(this.#s).some(t=>this.#s[t]!==e[t]&&i.has(t))};this.#A({listeners:r()})}#v(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#i)return;let t=this.#i;this.#i=e,this.#n=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#y()}#A(e){i.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#s)}),this.#e.getQueryCache().notify({query:this.#i,type:"observerResultsUpdated"})})}};function c(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&d(e,t,t.refetchOnMount)}function d(e,t,r){if(!1!==(0,o.resolveEnabled)(t.enabled,e)&&"static"!==(0,o.resolveStaleTime)(t.staleTime,e)){let i="function"==typeof r?r(e):r;return"always"===i||!1!==i&&h(e,t)}return!1}function f(e,t,r,i){return(e!==t||!1===(0,o.resolveEnabled)(i.enabled,e))&&(!r.suspense||"error"!==e.state.status)&&h(e,r)}function h(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,o.resolveStaleTime)(t.staleTime,e))}e.i(47167);var p=e.i(71645),m=e.i(12598);e.i(43476);var y=p.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),g=p.createContext(!1);g.Provider;var b=(e,t,r)=>t.fetchOptimistic(e).catch(()=>{r.clearReset()});function v(e,t){return function(e,t,r){let n=p.useContext(g),s=p.useContext(y),a=(0,m.useQueryClient)(r),u=a.defaultQueryOptions(e);if(a.getDefaultOptions().queries?._experimental_beforeQuery?.(u),u._optimisticResults=n?"isRestoring":"optimistic",u.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=u.staleTime;u.staleTime="function"==typeof t?(...r)=>e(t(...r)):e(t),"number"==typeof u.gcTime&&(u.gcTime=Math.max(u.gcTime,1e3))}(u.suspense||u.throwOnError||u.experimental_prefetchInRender)&&!s.isReset()&&(u.retryOnMount=!1),p.useEffect(()=>{s.clearReset()},[s]);let l=!a.getQueryCache().get(u.queryHash),[c]=p.useState(()=>new t(a,u)),d=c.getOptimisticResult(u),f=!n&&!1!==e.subscribed;if(p.useSyncExternalStore(p.useCallback(e=>{let t=f?c.subscribe(i.notifyManager.batchCalls(e)):o.noop;return c.updateResult(),t},[c,f]),()=>c.getCurrentResult(),()=>c.getCurrentResult()),p.useEffect(()=>{c.setOptions(u)},[u,c]),u?.suspense&&d.isPending)throw b(u,c,s);if((({result:e,errorResetBoundary:t,throwOnError:r,query:i,suspense:n})=>e.isError&&!t.isReset()&&!e.isFetching&&i&&(n&&void 0===e.data||(0,o.shouldThrowError)(r,[e.error,i])))({result:d,errorResetBoundary:s,throwOnError:u.throwOnError,query:a.getQueryCache().get(u.queryHash),suspense:u.suspense}))throw d.error;if(a.getDefaultOptions().queries?._experimental_afterQuery?.(u,d),u.experimental_prefetchInRender&&!o.isServer&&d.isLoading&&d.isFetching&&!n){let e=l?b(u,c,s):a.getQueryCache().get(u.queryHash)?.promise;e?.catch(o.noop).finally(()=>{c.updateResult()})}return u.notifyOnChangeProps?d:c.trackResult(d)}(e,l,t)}e.s(["useQuery",()=>v],66027)},88417,e=>{"use strict";let t=`
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
`,r=`
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
`,i=`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      message
    }
  }
`,n=`
  mutation ResendVerification($input: ResendVerificationInput!) {
    resendVerification(input: $input) {
      message
    }
  }
`,s=`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      message
    }
  }
`,a=`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`,o=`
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
      loginStreak
      referralCode
    }
  }
`,u=`
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
`,l=`
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
`,c=`
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
`,d=`
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
`,f=`
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
`,h=`
  mutation DeleteStore($id: String!) {
    deleteStore(id: $id) {
      id
      name
    }
  }
`,p=`
  query GetCategoryByName($name: String!) {
    categoryByName(name: $name) {
      id
      name
      iconUrl
      isActive
    }
  }
`,m=`
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
`,y=`
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
`,g=`
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
`,b=`
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
`,v=`
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
`,x=`
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
`,E=`
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
`,T=`
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
        imageUrl
      }
    }
  }
`,A=`
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
      challengeProgress
    }
  }
`,I=`
  mutation CreatePremiumCheckout($input: CreatePremiumCheckoutInput!) {
    createPremiumCheckoutSession(input: $input) {
      sessionId
      url
    }
  }
`,U=`
  mutation CancelPremium {
    cancelPremiumSubscription {
      message
    }
  }
`,R=`
  mutation ToggleAutoRenew($enabled: Boolean!) {
    togglePremiumAutoRenew(enabled: $enabled) {
      message
    }
  }
`,w=`
  query MySubscriptionStatus {
    mySubscriptionStatus {
      isPremium
      premiumStartDate
      premiumEndDate
      autoRenew
    }
  }
`,S=`
  mutation PayPremiumWithWallet {
    payPremiumWithWallet {
      message
    }
  }
`,_=`
  mutation RequestVideoUpload($input: RequestVideoUploadInput!) {
    requestVideoUpload(input: $input) {
      uploadUrl
      videoKey
      publicUrl
    }
  }
`,N=`
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
`,C=`
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
`,O=`
  mutation DeleteVideoAd($id: String!) {
    deleteVideoAd(id: $id)
  }
`,M=`
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
`,P=`
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
`,$=`
  mutation WatchVideoAd($input: WatchVideoAdInput!) {
    watchVideoAd(input: $input) {
      success
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`,L=`
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      id
      displayName
      avatarUrl
      email
    }
  }
`,j=`
  mutation RequestAvatarUpload($fileName: String!) {
    requestAvatarUpload(fileName: $fileName) {
      uploadUrl
      publicUrl
    }
  }
`,k=`
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
`,B=`
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
`,D=`
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
`,Q=`
  query MuralFeed($input: MuralFeedInput) {
    muralFeed(input: $input) {
      posts {
        ${D}
      }
      total
      page
      hasMore
    }
  }
`,q=`
  query MyMuralPosts($page: Int, $pageSize: Int) {
    myMuralPosts(page: $page, pageSize: $pageSize) {
      posts {
        ${D}
      }
      total
      page
      hasMore
    }
  }
`,F=`
  query MuralPost($id: ID!) {
    muralPost(id: $id) {
      ${D}
    }
  }
`,Y=`
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
`,G=`
  mutation CreateMuralPost($input: CreateMuralPostInput!) {
    createMuralPost(input: $input) {
      ${D}
    }
  }
`,V=`
  mutation DeleteMuralPost($id: ID!) {
    deleteMuralPost(id: $id)
  }
`,W=`
  mutation LikeMuralPost($id: ID!) {
    likeMuralPost(id: $id) {
      id
      likes
    }
  }
`,z=`
  mutation UnlikeMuralPost($id: ID!) {
    unlikeMuralPost(id: $id) {
      id
      likes
    }
  }
`,H=`
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
`,K=`
  mutation DeleteMuralComment($id: ID!) {
    deleteMuralComment(id: $id)
  }
`,X=`
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
`,Z=`
  query MyPointsHistory($limit: Int) {
    myPointsHistory(limit: $limit) {
      id
      pointsAmount
      description
      transactionType
      timestamp
      challenge {
        id
        name
        entityType
        count
        points
        isActive
      }
    }
  }
`,J=`
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
`;e.s(["CANCEL_PREMIUM_SUBSCRIPTION_MUTATION",0,U,"CITY_LEADERBOARD_QUERY",0,J,"COUPONS_QUERY",0,T,"CREATE_MURAL_COMMENT_MUTATION",0,H,"CREATE_MURAL_POST_MUTATION",0,G,"CREATE_PREMIUM_CHECKOUT_MUTATION",0,I,"CREATE_REVIEW_MUTATION",0,B,"CREATE_STORE_MUTATION",0,d,"CREATE_VIDEO_AD_MUTATION",0,N,"DELETE_MURAL_COMMENT_MUTATION",0,K,"DELETE_MURAL_POST_MUTATION",0,V,"DELETE_STORE_MUTATION",0,h,"DELETE_VIDEO_AD_MUTATION",0,O,"EXCHANGE_UNLOCK_MUTATION",0,E,"FORGOT_PASSWORD_MUTATION",0,s,"GENERATE_COUPON_MUTATION",0,b,"GET_ALL_STORES_QUERY",0,c,"GET_ALL_VIDEO_ADS_QUERY",0,M,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,y,"GET_CATEGORY_BY_NAME_QUERY",0,p,"GET_COUPON_REDEEM_DETAILS_QUERY",0,g,"GET_CURRENT_USER_QUERY",0,o,"GET_MURAL_FEED_QUERY",0,Q,"GET_MURAL_POST_COMMENTS_QUERY",0,Y,"GET_MURAL_POST_QUERY",0,F,"GET_MY_LEVEL_QUERY",0,x,"GET_MY_MURAL_POSTS_QUERY",0,q,"GET_STORE_REVIEWS_QUERY",0,k,"GET_SUBCATEGORIES_BY_CATEGORY_QUERY",0,m,"GET_USER_BY_ID_QUERY",0,u,"GET_VIDEO_AD_PAIR_QUERY",0,P,"LIKE_MURAL_POST_MUTATION",0,W,"LOGIN_MUTATION",0,t,"MY_CHALLENGES_QUERY",0,X,"MY_POINTS_HISTORY_QUERY",0,Z,"MY_SUBSCRIPTION_STATUS_QUERY",0,w,"PAY_PREMIUM_WITH_WALLET_MUTATION",0,S,"QUICK_PAY_FOR_DISCOUNT_MUTATION",0,v,"REDEEM_COUPON_BY_STAFF_MUTATION",0,A,"REQUEST_AVATAR_UPLOAD_MUTATION",0,j,"REQUEST_VIDEO_UPLOAD_MUTATION",0,_,"RESEND_VERIFICATION_MUTATION",0,n,"RESET_PASSWORD_MUTATION",0,a,"SIGNUP_MUTATION",0,r,"TOGGLE_PREMIUM_AUTO_RENEW_MUTATION",0,R,"UNLIKE_MURAL_POST_MUTATION",0,z,"UPDATE_ME_MUTATION",0,L,"UPDATE_STORE_MUTATION",0,f,"UPDATE_USER_MUTATION",0,l,"UPDATE_VIDEO_AD_MUTATION",0,C,"VERIFY_EMAIL_MUTATION",0,i,"WATCH_VIDEO_AD_MUTATION",0,$])},39616,e=>{"use strict";let t=(0,e.i(75254).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",()=>t],39616)},84614,e=>{"use strict";let t=(0,e.i(75254).default)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);e.s(["User",()=>t],84614)},8402,e=>{"use strict";let t=(0,e.i(75254).default)("ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]]);e.s(["Ticket",()=>t],8402)},90571,e=>{"use strict";var t=function(e,r){return(t=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,r)};function r(e,r){if("function"!=typeof r&&null!==r)throw TypeError("Class extends value "+String(r)+" is not a constructor or null");function i(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(i.prototype=r.prototype,new i)}var i=function(){return(i=Object.assign||function(e){for(var t,r=1,i=arguments.length;r<i;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)};function n(e,t){var r={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&0>t.indexOf(i)&&(r[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,i=Object.getOwnPropertySymbols(e);n<i.length;n++)0>t.indexOf(i[n])&&Object.prototype.propertyIsEnumerable.call(e,i[n])&&(r[i[n]]=e[i[n]]);return r}"function"==typeof SuppressedError&&SuppressedError,e.s(["__assign",()=>i,"__extends",()=>r,"__rest",()=>n])},64659,e=>{"use strict";let t=(0,e.i(75254).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",()=>t],64659)},67034,(e,t,r)=>{var i={675:function(e,t){"use strict";t.byteLength=function(e){var t=u(e),r=t[0],i=t[1];return(r+i)*3/4-i},t.toByteArray=function(e){var t,r,s=u(e),a=s[0],o=s[1],l=new n((a+o)*3/4-o),c=0,d=o>0?a-4:a;for(r=0;r<d;r+=4)t=i[e.charCodeAt(r)]<<18|i[e.charCodeAt(r+1)]<<12|i[e.charCodeAt(r+2)]<<6|i[e.charCodeAt(r+3)],l[c++]=t>>16&255,l[c++]=t>>8&255,l[c++]=255&t;return 2===o&&(t=i[e.charCodeAt(r)]<<2|i[e.charCodeAt(r+1)]>>4,l[c++]=255&t),1===o&&(t=i[e.charCodeAt(r)]<<10|i[e.charCodeAt(r+1)]<<4|i[e.charCodeAt(r+2)]>>2,l[c++]=t>>8&255,l[c++]=255&t),l},t.fromByteArray=function(e){for(var t,i=e.length,n=i%3,s=[],a=0,o=i-n;a<o;a+=16383)s.push(function(e,t,i){for(var n,s=[],a=t;a<i;a+=3)n=(e[a]<<16&0xff0000)+(e[a+1]<<8&65280)+(255&e[a+2]),s.push(r[n>>18&63]+r[n>>12&63]+r[n>>6&63]+r[63&n]);return s.join("")}(e,a,a+16383>o?o:a+16383));return 1===n?s.push(r[(t=e[i-1])>>2]+r[t<<4&63]+"=="):2===n&&s.push(r[(t=(e[i-2]<<8)+e[i-1])>>10]+r[t>>4&63]+r[t<<2&63]+"="),s.join("")};for(var r=[],i=[],n="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,o=s.length;a<o;++a)r[a]=s[a],i[s.charCodeAt(a)]=a;function u(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");-1===r&&(r=t);var i=r===t?0:4-r%4;return[r,i]}i[45]=62,i[95]=63},72:function(e,t,r){"use strict";var i=r(675),n=r(783),s="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function a(e){if(e>0x7fffffff)throw RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return Object.setPrototypeOf(t,o.prototype),t}function o(e,t,r){if("number"==typeof e){if("string"==typeof t)throw TypeError('The "string" argument must be of type string. Received type number');return c(e)}return u(e,t,r)}function u(e,t,r){if("string"==typeof e){var i=e,n=t;if(("string"!=typeof n||""===n)&&(n="utf8"),!o.isEncoding(n))throw TypeError("Unknown encoding: "+n);var s=0|h(i,n),u=a(s),l=u.write(i,n);return l!==s&&(u=u.slice(0,l)),u}if(ArrayBuffer.isView(e))return d(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(_(e,ArrayBuffer)||e&&_(e.buffer,ArrayBuffer)||"undefined"!=typeof SharedArrayBuffer&&(_(e,SharedArrayBuffer)||e&&_(e.buffer,SharedArrayBuffer)))return function(e,t,r){var i;if(t<0||e.byteLength<t)throw RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(i=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),o.prototype),i}(e,t,r);if("number"==typeof e)throw TypeError('The "value" argument must not be of type number. Received type number');var c=e.valueOf&&e.valueOf();if(null!=c&&c!==e)return o.from(c,t,r);var p=function(e){if(o.isBuffer(e)){var t=0|f(e.length),r=a(t);return 0===r.length||e.copy(r,0,0,t),r}return void 0!==e.length?"number"!=typeof e.length||function(e){return e!=e}(e.length)?a(0):d(e):"Buffer"===e.type&&Array.isArray(e.data)?d(e.data):void 0}(e);if(p)return p;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return o.from(e[Symbol.toPrimitive]("string"),t,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function l(e){if("number"!=typeof e)throw TypeError('"size" argument must be of type number');if(e<0)throw RangeError('The value "'+e+'" is invalid for option "size"')}function c(e){return l(e),a(e<0?0:0|f(e))}function d(e){for(var t=e.length<0?0:0|f(e.length),r=a(t),i=0;i<t;i+=1)r[i]=255&e[i];return r}t.Buffer=o,t.SlowBuffer=function(e){return+e!=e&&(e=0),o.alloc(+e)},t.INSPECT_MAX_BYTES=50,t.kMaxLength=0x7fffffff,o.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),o.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(o.prototype,"parent",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.buffer}}),Object.defineProperty(o.prototype,"offset",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.byteOffset}}),o.poolSize=8192,o.from=function(e,t,r){return u(e,t,r)},Object.setPrototypeOf(o.prototype,Uint8Array.prototype),Object.setPrototypeOf(o,Uint8Array),o.alloc=function(e,t,r){return(l(e),e<=0)?a(e):void 0!==t?"string"==typeof r?a(e).fill(t,r):a(e).fill(t):a(e)},o.allocUnsafe=function(e){return c(e)},o.allocUnsafeSlow=function(e){return c(e)};function f(e){if(e>=0x7fffffff)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|e}function h(e,t){if(o.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||_(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,i=arguments.length>2&&!0===arguments[2];if(!i&&0===r)return 0;for(var n=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return U(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return w(e).length;default:if(n)return i?-1:U(e).length;t=(""+t).toLowerCase(),n=!0}}function p(e,t,r){var n,s,a,o=!1;if((void 0===t||t<0)&&(t=0),t>this.length||((void 0===r||r>this.length)&&(r=this.length),r<=0||(r>>>=0)<=(t>>>=0)))return"";for(e||(e="utf8");;)switch(e){case"hex":return function(e,t,r){var i=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>i)&&(r=i);for(var n="",s=t;s<r;++s)n+=N[e[s]];return n}(this,t,r);case"utf8":case"utf-8":return b(this,t,r);case"ascii":return function(e,t,r){var i="";r=Math.min(e.length,r);for(var n=t;n<r;++n)i+=String.fromCharCode(127&e[n]);return i}(this,t,r);case"latin1":case"binary":return function(e,t,r){var i="";r=Math.min(e.length,r);for(var n=t;n<r;++n)i+=String.fromCharCode(e[n]);return i}(this,t,r);case"base64":return n=this,s=t,a=r,0===s&&a===n.length?i.fromByteArray(n):i.fromByteArray(n.slice(s,a));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r){for(var i=e.slice(t,r),n="",s=0;s<i.length;s+=2)n+=String.fromCharCode(i[s]+256*i[s+1]);return n}(this,t,r);default:if(o)throw TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),o=!0}}function m(e,t,r){var i=e[t];e[t]=e[r],e[r]=i}function y(e,t,r,i,n){var s;if(0===e.length)return -1;if("string"==typeof r?(i=r,r=0):r>0x7fffffff?r=0x7fffffff:r<-0x80000000&&(r=-0x80000000),(s=r*=1)!=s&&(r=n?0:e.length-1),r<0&&(r=e.length+r),r>=e.length)if(n)return -1;else r=e.length-1;else if(r<0)if(!n)return -1;else r=0;if("string"==typeof t&&(t=o.from(t,i)),o.isBuffer(t))return 0===t.length?-1:g(e,t,r,i,n);if("number"==typeof t){if(t&=255,"function"==typeof Uint8Array.prototype.indexOf)if(n)return Uint8Array.prototype.indexOf.call(e,t,r);else return Uint8Array.prototype.lastIndexOf.call(e,t,r);return g(e,[t],r,i,n)}throw TypeError("val must be string, number or Buffer")}function g(e,t,r,i,n){var s,a=1,o=e.length,u=t.length;if(void 0!==i&&("ucs2"===(i=String(i).toLowerCase())||"ucs-2"===i||"utf16le"===i||"utf-16le"===i)){if(e.length<2||t.length<2)return -1;a=2,o/=2,u/=2,r/=2}function l(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}if(n){var c=-1;for(s=r;s<o;s++)if(l(e,s)===l(t,-1===c?0:s-c)){if(-1===c&&(c=s),s-c+1===u)return c*a}else -1!==c&&(s-=s-c),c=-1}else for(r+u>o&&(r=o-u),s=r;s>=0;s--){for(var d=!0,f=0;f<u;f++)if(l(e,s+f)!==l(t,f)){d=!1;break}if(d)return s}return -1}o.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==o.prototype},o.compare=function(e,t){if(_(e,Uint8Array)&&(e=o.from(e,e.offset,e.byteLength)),_(t,Uint8Array)&&(t=o.from(t,t.offset,t.byteLength)),!o.isBuffer(e)||!o.isBuffer(t))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,i=t.length,n=0,s=Math.min(r,i);n<s;++n)if(e[n]!==t[n]){r=e[n],i=t[n];break}return r<i?-1:+(i<r)},o.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},o.concat=function(e,t){if(!Array.isArray(e))throw TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return o.alloc(0);if(void 0===t)for(r=0,t=0;r<e.length;++r)t+=e[r].length;var r,i=o.allocUnsafe(t),n=0;for(r=0;r<e.length;++r){var s=e[r];if(_(s,Uint8Array)&&(s=o.from(s)),!o.isBuffer(s))throw TypeError('"list" argument must be an Array of Buffers');s.copy(i,n),n+=s.length}return i},o.byteLength=h,o.prototype._isBuffer=!0,o.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)m(this,t,t+1);return this},o.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)m(this,t,t+3),m(this,t+1,t+2);return this},o.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)m(this,t,t+7),m(this,t+1,t+6),m(this,t+2,t+5),m(this,t+3,t+4);return this},o.prototype.toString=function(){var e=this.length;return 0===e?"":0==arguments.length?b(this,0,e):p.apply(this,arguments)},o.prototype.toLocaleString=o.prototype.toString,o.prototype.equals=function(e){if(!o.isBuffer(e))throw TypeError("Argument must be a Buffer");return this===e||0===o.compare(this,e)},o.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},s&&(o.prototype[s]=o.prototype.inspect),o.prototype.compare=function(e,t,r,i,n){if(_(e,Uint8Array)&&(e=o.from(e,e.offset,e.byteLength)),!o.isBuffer(e))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===i&&(i=0),void 0===n&&(n=this.length),t<0||r>e.length||i<0||n>this.length)throw RangeError("out of range index");if(i>=n&&t>=r)return 0;if(i>=n)return -1;if(t>=r)return 1;if(t>>>=0,r>>>=0,i>>>=0,n>>>=0,this===e)return 0;for(var s=n-i,a=r-t,u=Math.min(s,a),l=this.slice(i,n),c=e.slice(t,r),d=0;d<u;++d)if(l[d]!==c[d]){s=l[d],a=c[d];break}return s<a?-1:+(a<s)},o.prototype.includes=function(e,t,r){return -1!==this.indexOf(e,t,r)},o.prototype.indexOf=function(e,t,r){return y(this,e,t,r,!0)},o.prototype.lastIndexOf=function(e,t,r){return y(this,e,t,r,!1)};function b(e,t,r){r=Math.min(e.length,r);for(var i=[],n=t;n<r;){var s,a,o,u,l=e[n],c=null,d=l>239?4:l>223?3:l>191?2:1;if(n+d<=r)switch(d){case 1:l<128&&(c=l);break;case 2:(192&(s=e[n+1]))==128&&(u=(31&l)<<6|63&s)>127&&(c=u);break;case 3:s=e[n+1],a=e[n+2],(192&s)==128&&(192&a)==128&&(u=(15&l)<<12|(63&s)<<6|63&a)>2047&&(u<55296||u>57343)&&(c=u);break;case 4:s=e[n+1],a=e[n+2],o=e[n+3],(192&s)==128&&(192&a)==128&&(192&o)==128&&(u=(15&l)<<18|(63&s)<<12|(63&a)<<6|63&o)>65535&&u<1114112&&(c=u)}null===c?(c=65533,d=1):c>65535&&(c-=65536,i.push(c>>>10&1023|55296),c=56320|1023&c),i.push(c),n+=d}var f=i,h=f.length;if(h<=4096)return String.fromCharCode.apply(String,f);for(var p="",m=0;m<h;)p+=String.fromCharCode.apply(String,f.slice(m,m+=4096));return p}function v(e,t,r){if(e%1!=0||e<0)throw RangeError("offset is not uint");if(e+t>r)throw RangeError("Trying to access beyond buffer length")}function x(e,t,r,i,n,s){if(!o.isBuffer(e))throw TypeError('"buffer" argument must be a Buffer instance');if(t>n||t<s)throw RangeError('"value" argument is out of bounds');if(r+i>e.length)throw RangeError("Index out of range")}function E(e,t,r,i,n,s){if(r+i>e.length||r<0)throw RangeError("Index out of range")}function T(e,t,r,i,s){return t*=1,r>>>=0,s||E(e,t,r,4,34028234663852886e22,-34028234663852886e22),n.write(e,t,r,i,23,4),r+4}function A(e,t,r,i,s){return t*=1,r>>>=0,s||E(e,t,r,8,17976931348623157e292,-17976931348623157e292),n.write(e,t,r,i,52,8),r+8}o.prototype.write=function(e,t,r,i){if(void 0===t)i="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)i=t,r=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(r)?(r>>>=0,void 0===i&&(i="utf8")):(i=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var n,s,a,o,u,l,c,d,f=this.length-t;if((void 0===r||r>f)&&(r=f),e.length>0&&(r<0||t<0)||t>this.length)throw RangeError("Attempt to write outside buffer bounds");i||(i="utf8");for(var h=!1;;)switch(i){case"hex":return function(e,t,r,i){r=Number(r)||0;var n=e.length-r;i?(i=Number(i))>n&&(i=n):i=n;var s=t.length;i>s/2&&(i=s/2);for(var a=0;a<i;++a){var o,u=parseInt(t.substr(2*a,2),16);if((o=u)!=o)break;e[r+a]=u}return a}(this,e,t,r);case"utf8":case"utf-8":return n=t,s=r,S(U(e,this.length-n),this,n,s);case"ascii":return a=t,o=r,S(R(e),this,a,o);case"latin1":case"binary":return function(e,t,r,i){return S(R(t),e,r,i)}(this,e,t,r);case"base64":return u=t,l=r,S(w(e),this,u,l);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return c=t,d=r,S(function(e,t){for(var r,i,n=[],s=0;s<e.length&&!((t-=2)<0);++s)i=(r=e.charCodeAt(s))>>8,n.push(r%256),n.push(i);return n}(e,this.length-c),this,c,d);default:if(h)throw TypeError("Unknown encoding: "+i);i=(""+i).toLowerCase(),h=!0}},o.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},o.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var i=this.subarray(e,t);return Object.setPrototypeOf(i,o.prototype),i},o.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||v(e,t,this.length);for(var i=this[e],n=1,s=0;++s<t&&(n*=256);)i+=this[e+s]*n;return i},o.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||v(e,t,this.length);for(var i=this[e+--t],n=1;t>0&&(n*=256);)i+=this[e+--t]*n;return i},o.prototype.readUInt8=function(e,t){return e>>>=0,t||v(e,1,this.length),this[e]},o.prototype.readUInt16LE=function(e,t){return e>>>=0,t||v(e,2,this.length),this[e]|this[e+1]<<8},o.prototype.readUInt16BE=function(e,t){return e>>>=0,t||v(e,2,this.length),this[e]<<8|this[e+1]},o.prototype.readUInt32LE=function(e,t){return e>>>=0,t||v(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+0x1000000*this[e+3]},o.prototype.readUInt32BE=function(e,t){return e>>>=0,t||v(e,4,this.length),0x1000000*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},o.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||v(e,t,this.length);for(var i=this[e],n=1,s=0;++s<t&&(n*=256);)i+=this[e+s]*n;return i>=(n*=128)&&(i-=Math.pow(2,8*t)),i},o.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||v(e,t,this.length);for(var i=t,n=1,s=this[e+--i];i>0&&(n*=256);)s+=this[e+--i]*n;return s>=(n*=128)&&(s-=Math.pow(2,8*t)),s},o.prototype.readInt8=function(e,t){return(e>>>=0,t||v(e,1,this.length),128&this[e])?-((255-this[e]+1)*1):this[e]},o.prototype.readInt16LE=function(e,t){e>>>=0,t||v(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?0xffff0000|r:r},o.prototype.readInt16BE=function(e,t){e>>>=0,t||v(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?0xffff0000|r:r},o.prototype.readInt32LE=function(e,t){return e>>>=0,t||v(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},o.prototype.readInt32BE=function(e,t){return e>>>=0,t||v(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},o.prototype.readFloatLE=function(e,t){return e>>>=0,t||v(e,4,this.length),n.read(this,e,!0,23,4)},o.prototype.readFloatBE=function(e,t){return e>>>=0,t||v(e,4,this.length),n.read(this,e,!1,23,4)},o.prototype.readDoubleLE=function(e,t){return e>>>=0,t||v(e,8,this.length),n.read(this,e,!0,52,8)},o.prototype.readDoubleBE=function(e,t){return e>>>=0,t||v(e,8,this.length),n.read(this,e,!1,52,8)},o.prototype.writeUIntLE=function(e,t,r,i){if(e*=1,t>>>=0,r>>>=0,!i){var n=Math.pow(2,8*r)-1;x(this,e,t,r,n,0)}var s=1,a=0;for(this[t]=255&e;++a<r&&(s*=256);)this[t+a]=e/s&255;return t+r},o.prototype.writeUIntBE=function(e,t,r,i){if(e*=1,t>>>=0,r>>>=0,!i){var n=Math.pow(2,8*r)-1;x(this,e,t,r,n,0)}var s=r-1,a=1;for(this[t+s]=255&e;--s>=0&&(a*=256);)this[t+s]=e/a&255;return t+r},o.prototype.writeUInt8=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,1,255,0),this[t]=255&e,t+1},o.prototype.writeUInt16LE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},o.prototype.writeUInt16BE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},o.prototype.writeUInt32LE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,4,0xffffffff,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},o.prototype.writeUInt32BE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,4,0xffffffff,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},o.prototype.writeIntLE=function(e,t,r,i){if(e*=1,t>>>=0,!i){var n=Math.pow(2,8*r-1);x(this,e,t,r,n-1,-n)}var s=0,a=1,o=0;for(this[t]=255&e;++s<r&&(a*=256);)e<0&&0===o&&0!==this[t+s-1]&&(o=1),this[t+s]=(e/a|0)-o&255;return t+r},o.prototype.writeIntBE=function(e,t,r,i){if(e*=1,t>>>=0,!i){var n=Math.pow(2,8*r-1);x(this,e,t,r,n-1,-n)}var s=r-1,a=1,o=0;for(this[t+s]=255&e;--s>=0&&(a*=256);)e<0&&0===o&&0!==this[t+s+1]&&(o=1),this[t+s]=(e/a|0)-o&255;return t+r},o.prototype.writeInt8=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},o.prototype.writeInt16LE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},o.prototype.writeInt16BE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},o.prototype.writeInt32LE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,4,0x7fffffff,-0x80000000),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},o.prototype.writeInt32BE=function(e,t,r){return e*=1,t>>>=0,r||x(this,e,t,4,0x7fffffff,-0x80000000),e<0&&(e=0xffffffff+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},o.prototype.writeFloatLE=function(e,t,r){return T(this,e,t,!0,r)},o.prototype.writeFloatBE=function(e,t,r){return T(this,e,t,!1,r)},o.prototype.writeDoubleLE=function(e,t,r){return A(this,e,t,!0,r)},o.prototype.writeDoubleBE=function(e,t,r){return A(this,e,t,!1,r)},o.prototype.copy=function(e,t,r,i){if(!o.isBuffer(e))throw TypeError("argument should be a Buffer");if(r||(r=0),i||0===i||(i=this.length),t>=e.length&&(t=e.length),t||(t=0),i>0&&i<r&&(i=r),i===r||0===e.length||0===this.length)return 0;if(t<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(i<0)throw RangeError("sourceEnd out of bounds");i>this.length&&(i=this.length),e.length-t<i-r&&(i=e.length-t+r);var n=i-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,i);else if(this===e&&r<t&&t<i)for(var s=n-1;s>=0;--s)e[s+t]=this[s+r];else Uint8Array.prototype.set.call(e,this.subarray(r,i),t);return n},o.prototype.fill=function(e,t,r,i){if("string"==typeof e){if("string"==typeof t?(i=t,t=0,r=this.length):"string"==typeof r&&(i=r,r=this.length),void 0!==i&&"string"!=typeof i)throw TypeError("encoding must be a string");if("string"==typeof i&&!o.isEncoding(i))throw TypeError("Unknown encoding: "+i);if(1===e.length){var n,s=e.charCodeAt(0);("utf8"===i&&s<128||"latin1"===i)&&(e=s)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw RangeError("Out of range index");if(r<=t)return this;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(n=t;n<r;++n)this[n]=e;else{var a=o.isBuffer(e)?e:o.from(e,i),u=a.length;if(0===u)throw TypeError('The value "'+e+'" is invalid for argument "value"');for(n=0;n<r-t;++n)this[n+t]=a[n%u]}return this};var I=/[^+/0-9A-Za-z-_]/g;function U(e,t){t=t||1/0;for(var r,i=e.length,n=null,s=[],a=0;a<i;++a){if((r=e.charCodeAt(a))>55295&&r<57344){if(!n){if(r>56319||a+1===i){(t-=3)>-1&&s.push(239,191,189);continue}n=r;continue}if(r<56320){(t-=3)>-1&&s.push(239,191,189),n=r;continue}r=(n-55296<<10|r-56320)+65536}else n&&(t-=3)>-1&&s.push(239,191,189);if(n=null,r<128){if((t-=1)<0)break;s.push(r)}else if(r<2048){if((t-=2)<0)break;s.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;s.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((t-=4)<0)break;s.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return s}function R(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function w(e){return i.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(I,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function S(e,t,r,i){for(var n=0;n<i&&!(n+r>=t.length)&&!(n>=e.length);++n)t[n+r]=e[n];return n}function _(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}var N=function(){for(var e="0123456789abcdef",t=Array(256),r=0;r<16;++r)for(var i=16*r,n=0;n<16;++n)t[i+n]=e[r]+e[n];return t}()},783:function(e,t){t.read=function(e,t,r,i,n){var s,a,o=8*n-i-1,u=(1<<o)-1,l=u>>1,c=-7,d=r?n-1:0,f=r?-1:1,h=e[t+d];for(d+=f,s=h&(1<<-c)-1,h>>=-c,c+=o;c>0;s=256*s+e[t+d],d+=f,c-=8);for(a=s&(1<<-c)-1,s>>=-c,c+=i;c>0;a=256*a+e[t+d],d+=f,c-=8);if(0===s)s=1-l;else{if(s===u)return a?NaN:1/0*(h?-1:1);a+=Math.pow(2,i),s-=l}return(h?-1:1)*a*Math.pow(2,s-i)},t.write=function(e,t,r,i,n,s){var a,o,u,l=8*s-n-1,c=(1<<l)-1,d=c>>1,f=5960464477539062e-23*(23===n),h=i?0:s-1,p=i?1:-1,m=+(t<0||0===t&&1/t<0);for(isNaN(t=Math.abs(t))||t===1/0?(o=+!!isNaN(t),a=c):(a=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-a))<1&&(a--,u*=2),a+d>=1?t+=f/u:t+=f*Math.pow(2,1-d),t*u>=2&&(a++,u/=2),a+d>=c?(o=0,a=c):a+d>=1?(o=(t*u-1)*Math.pow(2,n),a+=d):(o=t*Math.pow(2,d-1)*Math.pow(2,n),a=0));n>=8;e[r+h]=255&o,h+=p,o/=256,n-=8);for(a=a<<n|o,l+=n;l>0;e[r+h]=255&a,h+=p,a/=256,l-=8);e[r+h-p]|=128*m}}},n={};function s(e){var t=n[e];if(void 0!==t)return t.exports;var r=n[e]={exports:{}},a=!0;try{i[e](r,r.exports,s),a=!1}finally{a&&delete n[e]}return r.exports}s.ab="/ROOT/node_modules/next/dist/compiled/buffer/",t.exports=s(72)},39990,e=>{"use strict";var t=e.i(66027),r=e.i(97903),i=e.i(88417),n=e.i(19284);function s(){let{isAuthenticated:e}=(0,n.useAuthStore)();return(0,t.useQuery)({queryKey:["myLevel"],queryFn:async()=>(await (0,r.graphqlRequest)(i.GET_MY_LEVEL_QUERY)).myLevel,enabled:e,staleTime:3e5})}e.s(["useMyLevel",()=>s])},16064,e=>{"use strict";var t=e.i(66027),r=e.i(97903),i=e.i(88417),n=e.i(19284);function s(e=20){return(0,t.useQuery)({queryKey:["cityLeaderboard",e],queryFn:async()=>(await (0,r.graphqlRequest)(i.CITY_LEADERBOARD_QUERY,{limit:e})).cityLeaderboard,staleTime:6e4})}function a(){let e=(0,n.useAuthStore)(e=>e.isAuthenticated);return(0,t.useQuery)({queryKey:["myChallenges","on-going"],queryFn:async()=>(await (0,r.graphqlRequest)(i.MY_CHALLENGES_QUERY,{status:"on-going"})).myChallenges,enabled:e,staleTime:3e4})}function o(e=200){let s=(0,n.useAuthStore)(e=>e.isAuthenticated);return(0,t.useQuery)({queryKey:["myPointsHistory",e],queryFn:async()=>(await (0,r.graphqlRequest)(i.MY_POINTS_HISTORY_QUERY,{limit:e})).myPointsHistory,enabled:s,staleTime:3e4})}function u(){let e=(0,n.useAuthStore)(e=>e.isAuthenticated);return(0,t.useQuery)({queryKey:["loginStreak"],queryFn:async()=>(await (0,r.graphqlRequest)(i.GET_CURRENT_USER_QUERY)).me.loginStreak??0,enabled:e,staleTime:3e5})}e.s(["useCityLeaderboard",()=>s,"useLoginStreak",()=>u,"useMyActiveChallenges",()=>a,"useMyPointsHistory",()=>o])},29288,e=>{"use strict";var t=e.i(43476),r=e.i(57688);let i=[{id:1,gemIcon:"/lvl1badge.svg",borderColor:"border-[#FDCA50]",shadowColor:"shadow-amber-100",discountColor:"text-amber-400",maxLabel:null,benefitsTitle:"Beneficios Novato:",benefits:["10% de descuento en todos los lugares","Ver negocios cercanos en el mapa","Aparecer en ranking mensual","Dejar reseñas","Participar en retos semanales"],maxSubtitle:"Usa 5 descuentos al mes para subir de nivel",downgradeNote:null,requiredUsesForLevel:0,requiredUsesForNext:5},{id:2,gemIcon:"/lvl2badge.png",borderColor:"border-blue-400",shadowColor:"shadow-blue-100",discountColor:"text-blue-400",maxLabel:null,benefitsTitle:"Beneficios Explorador:",benefits:["12% de descuento en todos los lugares","Reseñas destacadas","Acceso a retos mensuales","Recompensas sorpresa ocasionales"],maxSubtitle:"Usa 10 descuentos al mes para subir de nivel",downgradeNote:"Si no usas mínimo 1 descuento al mes bajas de nivel",requiredUsesForLevel:5,requiredUsesForNext:10},{id:3,gemIcon:"/lvl3badge.svg",borderColor:"border-red-400",shadowColor:"shadow-red-100",discountColor:"text-red-400",maxLabel:"Nivel Maximo",benefitsTitle:"Beneficios Maestro Local:",benefits:["15% de descuento en todos los lugares","Insignia visible en reseñas y liga","Promociones exclusivas","Acceso anticipado a funciones nuevas","Invitaciones a experiencias especiales"],maxSubtitle:"¡Yujuu! Has desbloqueado el nivel más alto de Ñamy",downgradeNote:"Si no usas mínimo 2 descuentos al mes bajas de nivel",requiredUsesForLevel:10,requiredUsesForNext:null},{id:4,gemIcon:"/premiumbadge.png",borderColor:"border-fuchsia-500",shadowColor:"shadow-fuchsia-100",discountColor:"text-fuchsia-500",maxLabel:"Estado Premium",benefitsTitle:"Con Premium obtienes:",benefits:["Descuentos instantáneos","Multiplicador de puntos en liga (x1.25)","Promociones exclusivas Premium","Recompensas mensuales mayores"],maxSubtitle:"Siente el poder. Sin anuncios. Sin límites.",downgradeNote:"Mientras otros esperan anuncios, tú ya estás comiendo.",requiredUsesForLevel:0,requiredUsesForNext:null}],n=i.map(e=>({id:e.id,icon:e.gemIcon}));function s(e){let t=e.level??1,r=t>3?4:t,n=i[r-1],s=`${e.discountPercentage}%`,a=null;null!==n.requiredUsesForNext&&(a={current:Math.min(e.monthlyUsageCount,n.requiredUsesForNext),total:n.requiredUsesForNext,from:r,to:r+1});let o=null!==n.requiredUsesForNext?`Usa ${n.requiredUsesForNext} descuentos al mes para subir de nivel`:n.maxSubtitle;return{id:r,gemIcon:n.gemIcon,name:e.levelName||`Nivel ${r}`,subtitle:o,discount:s,daysLabel:"",borderColor:n.borderColor,shadowColor:n.shadowColor,discountColor:n.discountColor,progress:a,maxLabel:n.maxLabel,downgradeNote:n.downgradeNote,streak:0,benefitsTitle:n.benefitsTitle,benefits:n.benefits}}function a({icon:e,active:i}){return(0,t.jsx)("div",{className:`relative shrink-0 transition-all duration-300 ${i?"scale-125 drop-shadow-lg":"scale-90 opacity-40"}`,children:(0,t.jsx)(r.default,{src:e,alt:"gem",width:64,height:72,className:"object-contain"})})}function o({current:e,total:r,from:i,to:n}){let s=Math.min(e/r*100,100);return(0,t.jsxs)("div",{className:"flex items-center gap-2 mt-3",children:[(0,t.jsx)("span",{className:"w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0",children:i}),(0,t.jsxs)("div",{className:"flex-1 h-7 bg-amber-50 rounded-full relative overflow-hidden border border-amber-300",children:[(0,t.jsx)("div",{className:"h-full rounded-full bg-linear-to-r from-amber-400 to-yellow-300 transition-all duration-1000",style:{width:`${s}%`}}),(0,t.jsxs)("div",{className:"absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-800",children:["⭐ ",e,"/",r," usos"]})]}),(0,t.jsx)("span",{className:"w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center shrink-0",children:n})]})}function u({label:e}){return(0,t.jsx)("div",{className:"mt-3 w-full py-2.5 rounded-full bg-linear-to-r from-amber-400 to-yellow-300 flex items-center justify-center",children:(0,t.jsx)("span",{className:"text-sm font-black text-white tracking-wide",children:e})})}e.s(["ALL_GEM_ICONS",0,n,"Gem",()=>a,"MaxBadge",()=>u,"ProgressBar",()=>o,"buildLevel",()=>s])},93076,e=>{"use strict";var t=e.i(43476),r=e.i(22016),i=e.i(71645),n=e.i(16064),s=e.i(39990),a=e.i(98439),o=e.i(29288);function u(){let{data:e,isLoading:u}=(0,s.useMyLevel)(),{data:l=0}=(0,n.useLoginStreak)(),c=(0,i.useMemo)(()=>e?(0,o.buildLevel)(e):null,[e]),d=e?.level??1;return(0,t.jsx)(a.BasicLayout,{className:"bg-gradient-hero",children:(0,t.jsxs)("div",{className:"max-w-5xl mx-auto min-h-screen flex flex-col pt-14",style:{fontFamily:"'Nunito', sans-serif"},children:[(0,t.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes streakPulse {
          0%, 100% { background-color: rgba(255,120,80,0.10); }
          50%       { background-color: rgba(255,120,80,0.20); }
        }
        @keyframes flame {
          0%, 100% { transform: scaleY(1) rotate(-3deg); }
          50%       { transform: scaleY(1.12) rotate(3deg); }
        }
        .fade-up-0 { animation: fadeUp 0.5s ease 0.00s both; }
        .fade-up-1 { animation: fadeUp 0.5s ease 0.07s both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.14s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.21s both; }
        .fade-up-4 { animation: fadeUp 0.5s ease 0.28s both; }
        .fade-up-5 { animation: fadeUp 0.5s ease 0.35s both; }
        .streak-pulse { animation: streakPulse 2s ease infinite; }
        .flame        { animation: flame 0.8s ease infinite; display: inline-block; }
      `}),(0,t.jsxs)("div",{className:"text-center px-6 pt-4 pb-4 fade-up-0",children:[(0,t.jsx)("h1",{className:"text-2xl font-black text-gray-900 tracking-tight",children:"Tu nivel en Ñamy"}),(0,t.jsxs)("p",{className:"text-sm text-gray-400 font-semibold mt-1 leading-snug",children:["Explora y usa cupones y sube de nivel",(0,t.jsx)("br",{}),"para mas beneficios"]})]}),u?(0,t.jsxs)("div",{className:"flex-1 px-5 py-4 flex flex-col gap-4 animate-pulse",children:[(0,t.jsx)("div",{className:"flex justify-center items-end gap-3 pb-4 px-4",children:[1,2,3,4].map(e=>(0,t.jsx)("div",{className:"w-14 h-16 bg-gray-200 rounded-xl"},e))}),(0,t.jsx)("div",{className:"h-px bg-gray-100 mx-6"}),(0,t.jsx)("div",{className:"h-4 bg-gray-200 rounded w-24"}),(0,t.jsx)("div",{className:"bg-white border-2 border-gray-200 rounded-2xl p-4 h-32"}),(0,t.jsx)("div",{className:"h-16 bg-gray-100 rounded-full mx-4"}),(0,t.jsx)("div",{className:"bg-yellow-50 border border-yellow-100 rounded-2xl p-5 h-40"})]}):null,!u&&c?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"flex justify-center items-end gap-3 pb-4 px-4 fade-up-1",children:o.ALL_GEM_ICONS.map(e=>(0,t.jsx)(o.Gem,{icon:e.icon,active:e.id===d},e.id))}),(0,t.jsx)("div",{className:"h-px bg-gray-100 mx-6"}),(0,t.jsxs)("div",{className:"flex-1 px-5 py-4 flex flex-col gap-4 overflow-y-auto",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center fade-up-1",children:[(0,t.jsx)("span",{className:"text-xs font-bold text-gray-400 uppercase tracking-wide",children:"Nivel actual"}),(0,t.jsxs)("span",{className:"text-xs font-semibold text-gray-400 flex items-center gap-1",children:["🕐 ",l," días"]})]}),(0,t.jsxs)("div",{className:`bg-white border-2 ${c.borderColor} rounded-2xl p-4 shadow-lg ${c.shadowColor} fade-up-2`,children:[(0,t.jsxs)("div",{className:"flex justify-between items-start",children:[(0,t.jsxs)("div",{className:"flex-1 pr-2",children:[(0,t.jsx)("h2",{className:"text-lg font-black text-gray-900",children:c.name}),(0,t.jsx)("p",{className:"text-xs text-gray-400 font-semibold mt-0.5",children:c.subtitle})]}),(0,t.jsx)("span",{className:`text-2xl font-black shrink-0 ${c.discountColor}`,children:c.discount})]}),c.progress?(0,t.jsx)(o.ProgressBar,{...c.progress}):(0,t.jsx)(o.MaxBadge,{label:c.maxLabel??""})]},c.id),(0,t.jsxs)("div",{className:"flex gap-3 fade-up-2",children:[(0,t.jsxs)("div",{className:"flex-1 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm",children:[(0,t.jsx)("p",{className:"text-2xl font-black text-gray-800",children:e?.monthlyUsageCount??0}),(0,t.jsx)("p",{className:"text-xs text-gray-400 font-semibold mt-0.5",children:"Usos este mes"})]}),(0,t.jsxs)("div",{className:"flex-1 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm",children:[(0,t.jsx)("p",{className:"text-2xl font-black text-gray-800",children:e?.totalUsageCount??0}),(0,t.jsx)("p",{className:"text-xs text-gray-400 font-semibold mt-0.5",children:"Usos totales"})]}),e?.usesUntilNextLevel!=null&&(0,t.jsxs)("div",{className:"flex-1 bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm",children:[(0,t.jsx)("p",{className:"text-2xl font-black text-amber-500",children:e.usesUntilNextLevel}),(0,t.jsx)("p",{className:"text-xs text-gray-400 font-semibold mt-0.5",children:"Para subir"})]})]}),c.downgradeNote?(0,t.jsx)("p",{className:"text-xs text-gray-400 font-semibold text-center px-2 -mt-1 fade-up-2",children:c.downgradeNote}):null,(0,t.jsxs)("div",{className:"mx-4 rounded-full flex items-center justify-center gap-3 py-4 streak-pulse fade-up-3",children:[(0,t.jsx)("span",{className:"text-4xl font-black text-orange-500",children:l}),(0,t.jsx)("span",{className:"text-2xl flame",children:"🔥"}),(0,t.jsx)("span",{className:"text-sm font-bold text-orange-700",children:"Racha diaria"})]}),(0,t.jsxs)("div",{className:"bg-yellow-50 border border-yellow-100 rounded-2xl p-5 fade-up-4",children:[(0,t.jsx)("h3",{className:"text-base font-black text-gray-900 mb-3",children:c.benefitsTitle}),(0,t.jsx)("div",{className:"flex flex-col gap-2",children:c.benefits.map((e,r)=>(0,t.jsxs)("div",{className:"flex items-center gap-2.5",children:[(0,t.jsx)("span",{className:"text-green-500 font-black text-base shrink-0",children:"✓"}),(0,t.jsx)("span",{className:"text-sm text-gray-600 font-semibold",children:e})]},r))})]}),d<4&&(0,t.jsxs)(r.default,{href:"/subscription",className:"rounded-2xl p-4 flex items-center gap-4 cursor-pointer fade-up-5 bg-linear-to-r from-fuchsia-500 via-pink-500 to-orange-400 shadow-lg shadow-pink-200 active:scale-95 transition-transform",children:[(0,t.jsx)("span",{className:"text-4xl",children:"🏅"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-white font-black text-sm",children:"Mejores descuentos y sin anuncios"}),(0,t.jsx)("p",{className:"text-white/75 text-xs font-semibold mt-0.5",children:"Ver beneficios"})]})]}),(0,t.jsx)("div",{className:"h-24"})]})]}):null]})})}e.s(["default",()=>u])}]);