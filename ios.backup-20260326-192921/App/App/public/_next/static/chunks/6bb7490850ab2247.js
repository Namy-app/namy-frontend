(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var r=e.i(75555),i=e.i(40143),n=e.i(86491),s=e.i(15823),a=e.i(93803),o=e.i(19273),u=e.i(80166),l=class extends s.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#r=(0,a.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#i=void 0;#n=void 0;#s=void 0;#a;#o;#r;#t;#u;#l;#c;#d;#h;#p;#f=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#i.addObserver(this),c(this.#i,this.options)?this.#m():this.updateResult(),this.#y())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return d(this.#i,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return d(this.#i,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#g(),this.#x(),this.#i.removeObserver(this)}setOptions(e){let t=this.options,r=this.#i;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,o.resolveEnabled)(this.options.enabled,this.#i))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#b(),this.#i.setOptions(this.options),t._defaulted&&!(0,o.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#i,observer:this});let i=this.hasListeners();i&&h(this.#i,r,this.options,t)&&this.#m(),this.updateResult(),i&&(this.#i!==r||(0,o.resolveEnabled)(this.options.enabled,this.#i)!==(0,o.resolveEnabled)(t.enabled,this.#i)||(0,o.resolveStaleTime)(this.options.staleTime,this.#i)!==(0,o.resolveStaleTime)(t.staleTime,this.#i))&&this.#v();let n=this.#w();i&&(this.#i!==r||(0,o.resolveEnabled)(this.options.enabled,this.#i)!==(0,o.resolveEnabled)(t.enabled,this.#i)||n!==this.#p)&&this.#I(n)}getOptimisticResult(e){var t,r;let i=this.#e.getQueryCache().build(this.#e,e),n=this.createResult(i,e);return t=this,r=n,(0,o.shallowEqualObjects)(t.getCurrentResult(),r)||(this.#s=n,this.#o=this.options,this.#a=this.#i.state),n}getCurrentResult(){return this.#s}trackResult(e,t){return new Proxy(e,{get:(e,r)=>(this.trackProp(r),t?.(r),"promise"===r&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#r.status||this.#r.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,r))})}trackProp(e){this.#f.add(e)}getCurrentQuery(){return this.#i}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),r=this.#e.getQueryCache().build(this.#e,t);return r.fetch().then(()=>this.createResult(r,t))}fetch(e){return this.#m({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#s))}#m(e){this.#b();let t=this.#i.fetch(this.options,e);return e?.throwOnError||(t=t.catch(o.noop)),t}#v(){this.#g();let e=(0,o.resolveStaleTime)(this.options.staleTime,this.#i);if(o.isServer||this.#s.isStale||!(0,o.isValidTimeout)(e))return;let t=(0,o.timeUntilStale)(this.#s.dataUpdatedAt,e);this.#d=u.timeoutManager.setTimeout(()=>{this.#s.isStale||this.updateResult()},t+1)}#w(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#i):this.options.refetchInterval)??!1}#I(e){this.#x(),this.#p=e,!o.isServer&&!1!==(0,o.resolveEnabled)(this.options.enabled,this.#i)&&(0,o.isValidTimeout)(this.#p)&&0!==this.#p&&(this.#h=u.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||r.focusManager.isFocused())&&this.#m()},this.#p))}#y(){this.#v(),this.#I(this.#w())}#g(){this.#d&&(u.timeoutManager.clearTimeout(this.#d),this.#d=void 0)}#x(){this.#h&&(u.timeoutManager.clearInterval(this.#h),this.#h=void 0)}createResult(e,t){let r,i=this.#i,s=this.options,u=this.#s,l=this.#a,d=this.#o,f=e!==i?e.state:this.#n,{state:m}=e,y={...m},g=!1;if(t._optimisticResults){let r=this.hasListeners(),a=!r&&c(e,t),o=r&&h(e,i,t,s);(a||o)&&(y={...y,...(0,n.fetchState)(m.data,e.options)}),"isRestoring"===t._optimisticResults&&(y.fetchStatus="idle")}let{error:x,errorUpdatedAt:b,status:v}=y;r=y.data;let w=!1;if(void 0!==t.placeholderData&&void 0===r&&"pending"===v){let e;u?.isPlaceholderData&&t.placeholderData===d?.placeholderData?(e=u.data,w=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#c?.state.data,this.#c):t.placeholderData,void 0!==e&&(v="success",r=(0,o.replaceData)(u?.data,e,t),g=!0)}if(t.select&&void 0!==r&&!w)if(u&&r===l?.data&&t.select===this.#u)r=this.#l;else try{this.#u=t.select,r=t.select(r),r=(0,o.replaceData)(u?.data,r,t),this.#l=r,this.#t=null}catch(e){this.#t=e}this.#t&&(x=this.#t,r=this.#l,b=Date.now(),v="error");let I="fetching"===y.fetchStatus,A="pending"===v,E="error"===v,T=A&&I,N=void 0!==r,C={status:v,fetchStatus:y.fetchStatus,isPending:A,isSuccess:"success"===v,isError:E,isInitialLoading:T,isLoading:T,data:r,dataUpdatedAt:y.dataUpdatedAt,error:x,errorUpdatedAt:b,failureCount:y.fetchFailureCount,failureReason:y.fetchFailureReason,errorUpdateCount:y.errorUpdateCount,isFetched:y.dataUpdateCount>0||y.errorUpdateCount>0,isFetchedAfterMount:y.dataUpdateCount>f.dataUpdateCount||y.errorUpdateCount>f.errorUpdateCount,isFetching:I,isRefetching:I&&!A,isLoadingError:E&&!N,isPaused:"paused"===y.fetchStatus,isPlaceholderData:g,isRefetchError:E&&N,isStale:p(e,t),refetch:this.refetch,promise:this.#r,isEnabled:!1!==(0,o.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===C.status?e.reject(C.error):void 0!==C.data&&e.resolve(C.data)},r=()=>{t(this.#r=C.promise=(0,a.pendingThenable)())},n=this.#r;switch(n.status){case"pending":e.queryHash===i.queryHash&&t(n);break;case"fulfilled":("error"===C.status||C.data!==n.value)&&r();break;case"rejected":("error"!==C.status||C.error!==n.reason)&&r()}}return C}updateResult(){let e=this.#s,t=this.createResult(this.#i,this.options);if(this.#a=this.#i.state,this.#o=this.options,void 0!==this.#a.data&&(this.#c=this.#i),(0,o.shallowEqualObjects)(t,e))return;this.#s=t;let r=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,r="function"==typeof t?t():t;if("all"===r||!r&&!this.#f.size)return!0;let i=new Set(r??this.#f);return this.options.throwOnError&&i.add("error"),Object.keys(this.#s).some(t=>this.#s[t]!==e[t]&&i.has(t))};this.#A({listeners:r()})}#b(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#i)return;let t=this.#i;this.#i=e,this.#n=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#y()}#A(e){i.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#s)}),this.#e.getQueryCache().notify({query:this.#i,type:"observerResultsUpdated"})})}};function c(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&d(e,t,t.refetchOnMount)}function d(e,t,r){if(!1!==(0,o.resolveEnabled)(t.enabled,e)&&"static"!==(0,o.resolveStaleTime)(t.staleTime,e)){let i="function"==typeof r?r(e):r;return"always"===i||!1!==i&&p(e,t)}return!1}function h(e,t,r,i){return(e!==t||!1===(0,o.resolveEnabled)(i.enabled,e))&&(!r.suspense||"error"!==e.state.status)&&p(e,r)}function p(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,o.resolveStaleTime)(t.staleTime,e))}e.i(47167);var f=e.i(71645),m=e.i(12598);e.i(43476);var y=f.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),g=f.createContext(!1);g.Provider;var x=(e,t,r)=>t.fetchOptimistic(e).catch(()=>{r.clearReset()});function b(e,t){return function(e,t,r){let n=f.useContext(g),s=f.useContext(y),a=(0,m.useQueryClient)(r),u=a.defaultQueryOptions(e);if(a.getDefaultOptions().queries?._experimental_beforeQuery?.(u),u._optimisticResults=n?"isRestoring":"optimistic",u.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=u.staleTime;u.staleTime="function"==typeof t?(...r)=>e(t(...r)):e(t),"number"==typeof u.gcTime&&(u.gcTime=Math.max(u.gcTime,1e3))}(u.suspense||u.throwOnError||u.experimental_prefetchInRender)&&!s.isReset()&&(u.retryOnMount=!1),f.useEffect(()=>{s.clearReset()},[s]);let l=!a.getQueryCache().get(u.queryHash),[c]=f.useState(()=>new t(a,u)),d=c.getOptimisticResult(u),h=!n&&!1!==e.subscribed;if(f.useSyncExternalStore(f.useCallback(e=>{let t=h?c.subscribe(i.notifyManager.batchCalls(e)):o.noop;return c.updateResult(),t},[c,h]),()=>c.getCurrentResult(),()=>c.getCurrentResult()),f.useEffect(()=>{c.setOptions(u)},[u,c]),u?.suspense&&d.isPending)throw x(u,c,s);if((({result:e,errorResetBoundary:t,throwOnError:r,query:i,suspense:n})=>e.isError&&!t.isReset()&&!e.isFetching&&i&&(n&&void 0===e.data||(0,o.shouldThrowError)(r,[e.error,i])))({result:d,errorResetBoundary:s,throwOnError:u.throwOnError,query:a.getQueryCache().get(u.queryHash),suspense:u.suspense}))throw d.error;if(a.getDefaultOptions().queries?._experimental_afterQuery?.(u,d),u.experimental_prefetchInRender&&!o.isServer&&d.isLoading&&d.isFetching&&!n){let e=l?x(u,c,s):a.getQueryCache().get(u.queryHash)?.promise;e?.catch(o.noop).finally(()=>{c.updateResult()})}return u.notifyOnChangeProps?d:c.trackResult(d)}(e,l,t)}e.s(["useQuery",()=>b],66027)},54616,e=>{"use strict";var t=e.i(71645),r=e.i(14272),i=e.i(40143),n=e.i(15823),s=e.i(19273),a=class extends n.Subscribable{#e;#s=void 0;#E;#T;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#N()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,s.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#E,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,s.hashKey)(t.mutationKey)!==(0,s.hashKey)(this.options.mutationKey)?this.reset():this.#E?.state.status==="pending"&&this.#E.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#E?.removeObserver(this)}onMutationUpdate(e){this.#N(),this.#A(e)}getCurrentResult(){return this.#s}reset(){this.#E?.removeObserver(this),this.#E=void 0,this.#N(),this.#A()}mutate(e,t){return this.#T=t,this.#E?.removeObserver(this),this.#E=this.#e.getMutationCache().build(this.#e,this.options),this.#E.addObserver(this),this.#E.execute(e)}#N(){let e=this.#E?.state??(0,r.getDefaultState)();this.#s={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#A(e){i.notifyManager.batch(()=>{if(this.#T&&this.hasListeners()){let t=this.#s.variables,r=this.#s.context,i={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#T.onSuccess?.(e.data,t,r,i),this.#T.onSettled?.(e.data,null,t,r,i)):e?.type==="error"&&(this.#T.onError?.(e.error,t,r,i),this.#T.onSettled?.(void 0,e.error,t,r,i))}this.listeners.forEach(e=>{e(this.#s)})})}},o=e.i(12598);function u(e,r){let n=(0,o.useQueryClient)(r),[u]=t.useState(()=>new a(n,e));t.useEffect(()=>{u.setOptions(e)},[u,e]);let l=t.useSyncExternalStore(t.useCallback(e=>u.subscribe(i.notifyManager.batchCalls(e)),[u]),()=>u.getCurrentResult(),()=>u.getCurrentResult()),c=t.useCallback((e,t)=>{u.mutate(e,t).catch(s.noop)},[u]);if(l.error&&(0,s.shouldThrowError)(u.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:c,mutateAsync:l.mutate}}e.s(["useMutation",()=>u],54616)},88417,e=>{"use strict";let t=`
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
`,h=`
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
`,p=`
  mutation DeleteStore($id: String!) {
    deleteStore(id: $id) {
      id
      name
    }
  }
`,f=`
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
`,x=`
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
`,b=`
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
`,v=`
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
`,w=`
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
`,I=`
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
`,E=`
  mutation CreatePremiumCheckout($input: CreatePremiumCheckoutInput!) {
    createPremiumCheckoutSession(input: $input) {
      sessionId
      url
    }
  }
`,T=`
  mutation CancelPremium {
    cancelPremiumSubscription {
      message
    }
  }
`,N=`
  mutation ToggleAutoRenew($enabled: Boolean!) {
    togglePremiumAutoRenew(enabled: $enabled) {
      message
    }
  }
`,C=`
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
`,R=`
  mutation RequestVideoUpload($input: RequestVideoUploadInput!) {
    requestVideoUpload(input: $input) {
      uploadUrl
      videoKey
      publicUrl
    }
  }
`,U=`
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
`,j=`
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
`,_=`
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
`,M=`
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
`,P=`
  mutation WatchVideoAd($input: WatchVideoAdInput!) {
    watchVideoAd(input: $input) {
      success
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`,$=`
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      id
      displayName
      avatarUrl
      email
    }
  }
`,q=`
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
`,D=`
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
`,B=`
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
        ${B}
      }
      total
      page
      hasMore
    }
  }
`,L=`
  query MyMuralPosts($page: Int, $pageSize: Int) {
    myMuralPosts(page: $page, pageSize: $pageSize) {
      posts {
        ${B}
      }
      total
      page
      hasMore
    }
  }
`,F=`
  query MuralPost($id: ID!) {
    muralPost(id: $id) {
      ${B}
    }
  }
`,W=`
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
      ${B}
    }
  }
`,Y=`
  mutation DeleteMuralPost($id: ID!) {
    deleteMuralPost(id: $id)
  }
`,V=`
  mutation LikeMuralPost($id: ID!) {
    likeMuralPost(id: $id) {
      id
      likes
    }
  }
`,K=`
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
`,z=`
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
`;e.s(["CANCEL_PREMIUM_SUBSCRIPTION_MUTATION",0,T,"CITY_LEADERBOARD_QUERY",0,J,"COUPONS_QUERY",0,I,"CREATE_MURAL_COMMENT_MUTATION",0,H,"CREATE_MURAL_POST_MUTATION",0,G,"CREATE_PREMIUM_CHECKOUT_MUTATION",0,E,"CREATE_REVIEW_MUTATION",0,D,"CREATE_STORE_MUTATION",0,d,"CREATE_VIDEO_AD_MUTATION",0,U,"DELETE_MURAL_COMMENT_MUTATION",0,z,"DELETE_MURAL_POST_MUTATION",0,Y,"DELETE_STORE_MUTATION",0,p,"DELETE_VIDEO_AD_MUTATION",0,O,"EXCHANGE_UNLOCK_MUTATION",0,w,"FORGOT_PASSWORD_MUTATION",0,s,"GENERATE_COUPON_MUTATION",0,x,"GET_ALL_STORES_QUERY",0,c,"GET_ALL_VIDEO_ADS_QUERY",0,_,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,y,"GET_CATEGORY_BY_NAME_QUERY",0,f,"GET_COUPON_REDEEM_DETAILS_QUERY",0,g,"GET_CURRENT_USER_QUERY",0,o,"GET_MURAL_FEED_QUERY",0,Q,"GET_MURAL_POST_COMMENTS_QUERY",0,W,"GET_MURAL_POST_QUERY",0,F,"GET_MY_LEVEL_QUERY",0,v,"GET_MY_MURAL_POSTS_QUERY",0,L,"GET_STORE_REVIEWS_QUERY",0,k,"GET_SUBCATEGORIES_BY_CATEGORY_QUERY",0,m,"GET_USER_BY_ID_QUERY",0,u,"GET_VIDEO_AD_PAIR_QUERY",0,M,"LIKE_MURAL_POST_MUTATION",0,V,"LOGIN_MUTATION",0,t,"MY_CHALLENGES_QUERY",0,X,"MY_POINTS_HISTORY_QUERY",0,Z,"MY_SUBSCRIPTION_STATUS_QUERY",0,C,"PAY_PREMIUM_WITH_WALLET_MUTATION",0,S,"QUICK_PAY_FOR_DISCOUNT_MUTATION",0,b,"REDEEM_COUPON_BY_STAFF_MUTATION",0,A,"REQUEST_AVATAR_UPLOAD_MUTATION",0,q,"REQUEST_VIDEO_UPLOAD_MUTATION",0,R,"RESEND_VERIFICATION_MUTATION",0,n,"RESET_PASSWORD_MUTATION",0,a,"SIGNUP_MUTATION",0,r,"TOGGLE_PREMIUM_AUTO_RENEW_MUTATION",0,N,"UNLIKE_MURAL_POST_MUTATION",0,K,"UPDATE_ME_MUTATION",0,$,"UPDATE_STORE_MUTATION",0,h,"UPDATE_USER_MUTATION",0,l,"UPDATE_VIDEO_AD_MUTATION",0,j,"VERIFY_EMAIL_MUTATION",0,i,"WATCH_VIDEO_AD_MUTATION",0,P])},39616,e=>{"use strict";let t=(0,e.i(75254).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",()=>t],39616)},8402,e=>{"use strict";let t=(0,e.i(75254).default)("ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]]);e.s(["Ticket",()=>t],8402)},84614,e=>{"use strict";let t=(0,e.i(75254).default)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);e.s(["User",()=>t],84614)},90571,e=>{"use strict";var t=function(e,r){return(t=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,r)};function r(e,r){if("function"!=typeof r&&null!==r)throw TypeError("Class extends value "+String(r)+" is not a constructor or null");function i(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(i.prototype=r.prototype,new i)}var i=function(){return(i=Object.assign||function(e){for(var t,r=1,i=arguments.length;r<i;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)};function n(e,t){var r={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&0>t.indexOf(i)&&(r[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,i=Object.getOwnPropertySymbols(e);n<i.length;n++)0>t.indexOf(i[n])&&Object.prototype.propertyIsEnumerable.call(e,i[n])&&(r[i[n]]=e[i[n]]);return r}"function"==typeof SuppressedError&&SuppressedError,e.s(["__assign",()=>i,"__extends",()=>r,"__rest",()=>n])},64659,e=>{"use strict";let t=(0,e.i(75254).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",()=>t],64659)},67034,(e,t,r)=>{var i={675:function(e,t){"use strict";t.byteLength=function(e){var t=u(e),r=t[0],i=t[1];return(r+i)*3/4-i},t.toByteArray=function(e){var t,r,s=u(e),a=s[0],o=s[1],l=new n((a+o)*3/4-o),c=0,d=o>0?a-4:a;for(r=0;r<d;r+=4)t=i[e.charCodeAt(r)]<<18|i[e.charCodeAt(r+1)]<<12|i[e.charCodeAt(r+2)]<<6|i[e.charCodeAt(r+3)],l[c++]=t>>16&255,l[c++]=t>>8&255,l[c++]=255&t;return 2===o&&(t=i[e.charCodeAt(r)]<<2|i[e.charCodeAt(r+1)]>>4,l[c++]=255&t),1===o&&(t=i[e.charCodeAt(r)]<<10|i[e.charCodeAt(r+1)]<<4|i[e.charCodeAt(r+2)]>>2,l[c++]=t>>8&255,l[c++]=255&t),l},t.fromByteArray=function(e){for(var t,i=e.length,n=i%3,s=[],a=0,o=i-n;a<o;a+=16383)s.push(function(e,t,i){for(var n,s=[],a=t;a<i;a+=3)n=(e[a]<<16&0xff0000)+(e[a+1]<<8&65280)+(255&e[a+2]),s.push(r[n>>18&63]+r[n>>12&63]+r[n>>6&63]+r[63&n]);return s.join("")}(e,a,a+16383>o?o:a+16383));return 1===n?s.push(r[(t=e[i-1])>>2]+r[t<<4&63]+"=="):2===n&&s.push(r[(t=(e[i-2]<<8)+e[i-1])>>10]+r[t>>4&63]+r[t<<2&63]+"="),s.join("")};for(var r=[],i=[],n="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,o=s.length;a<o;++a)r[a]=s[a],i[s.charCodeAt(a)]=a;function u(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");-1===r&&(r=t);var i=r===t?0:4-r%4;return[r,i]}i[45]=62,i[95]=63},72:function(e,t,r){"use strict";var i=r(675),n=r(783),s="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function a(e){if(e>0x7fffffff)throw RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return Object.setPrototypeOf(t,o.prototype),t}function o(e,t,r){if("number"==typeof e){if("string"==typeof t)throw TypeError('The "string" argument must be of type string. Received type number');return c(e)}return u(e,t,r)}function u(e,t,r){if("string"==typeof e){var i=e,n=t;if(("string"!=typeof n||""===n)&&(n="utf8"),!o.isEncoding(n))throw TypeError("Unknown encoding: "+n);var s=0|p(i,n),u=a(s),l=u.write(i,n);return l!==s&&(u=u.slice(0,l)),u}if(ArrayBuffer.isView(e))return d(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(R(e,ArrayBuffer)||e&&R(e.buffer,ArrayBuffer)||"undefined"!=typeof SharedArrayBuffer&&(R(e,SharedArrayBuffer)||e&&R(e.buffer,SharedArrayBuffer)))return function(e,t,r){var i;if(t<0||e.byteLength<t)throw RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(i=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),o.prototype),i}(e,t,r);if("number"==typeof e)throw TypeError('The "value" argument must not be of type number. Received type number');var c=e.valueOf&&e.valueOf();if(null!=c&&c!==e)return o.from(c,t,r);var f=function(e){if(o.isBuffer(e)){var t=0|h(e.length),r=a(t);return 0===r.length||e.copy(r,0,0,t),r}return void 0!==e.length?"number"!=typeof e.length||function(e){return e!=e}(e.length)?a(0):d(e):"Buffer"===e.type&&Array.isArray(e.data)?d(e.data):void 0}(e);if(f)return f;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return o.from(e[Symbol.toPrimitive]("string"),t,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function l(e){if("number"!=typeof e)throw TypeError('"size" argument must be of type number');if(e<0)throw RangeError('The value "'+e+'" is invalid for option "size"')}function c(e){return l(e),a(e<0?0:0|h(e))}function d(e){for(var t=e.length<0?0:0|h(e.length),r=a(t),i=0;i<t;i+=1)r[i]=255&e[i];return r}t.Buffer=o,t.SlowBuffer=function(e){return+e!=e&&(e=0),o.alloc(+e)},t.INSPECT_MAX_BYTES=50,t.kMaxLength=0x7fffffff,o.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),o.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(o.prototype,"parent",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.buffer}}),Object.defineProperty(o.prototype,"offset",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.byteOffset}}),o.poolSize=8192,o.from=function(e,t,r){return u(e,t,r)},Object.setPrototypeOf(o.prototype,Uint8Array.prototype),Object.setPrototypeOf(o,Uint8Array),o.alloc=function(e,t,r){return(l(e),e<=0)?a(e):void 0!==t?"string"==typeof r?a(e).fill(t,r):a(e).fill(t):a(e)},o.allocUnsafe=function(e){return c(e)},o.allocUnsafeSlow=function(e){return c(e)};function h(e){if(e>=0x7fffffff)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|e}function p(e,t){if(o.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||R(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,i=arguments.length>2&&!0===arguments[2];if(!i&&0===r)return 0;for(var n=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return T(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return C(e).length;default:if(n)return i?-1:T(e).length;t=(""+t).toLowerCase(),n=!0}}function f(e,t,r){var n,s,a,o=!1;if((void 0===t||t<0)&&(t=0),t>this.length||((void 0===r||r>this.length)&&(r=this.length),r<=0||(r>>>=0)<=(t>>>=0)))return"";for(e||(e="utf8");;)switch(e){case"hex":return function(e,t,r){var i=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>i)&&(r=i);for(var n="",s=t;s<r;++s)n+=U[e[s]];return n}(this,t,r);case"utf8":case"utf-8":return x(this,t,r);case"ascii":return function(e,t,r){var i="";r=Math.min(e.length,r);for(var n=t;n<r;++n)i+=String.fromCharCode(127&e[n]);return i}(this,t,r);case"latin1":case"binary":return function(e,t,r){var i="";r=Math.min(e.length,r);for(var n=t;n<r;++n)i+=String.fromCharCode(e[n]);return i}(this,t,r);case"base64":return n=this,s=t,a=r,0===s&&a===n.length?i.fromByteArray(n):i.fromByteArray(n.slice(s,a));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r){for(var i=e.slice(t,r),n="",s=0;s<i.length;s+=2)n+=String.fromCharCode(i[s]+256*i[s+1]);return n}(this,t,r);default:if(o)throw TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),o=!0}}function m(e,t,r){var i=e[t];e[t]=e[r],e[r]=i}function y(e,t,r,i,n){var s;if(0===e.length)return -1;if("string"==typeof r?(i=r,r=0):r>0x7fffffff?r=0x7fffffff:r<-0x80000000&&(r=-0x80000000),(s=r*=1)!=s&&(r=n?0:e.length-1),r<0&&(r=e.length+r),r>=e.length)if(n)return -1;else r=e.length-1;else if(r<0)if(!n)return -1;else r=0;if("string"==typeof t&&(t=o.from(t,i)),o.isBuffer(t))return 0===t.length?-1:g(e,t,r,i,n);if("number"==typeof t){if(t&=255,"function"==typeof Uint8Array.prototype.indexOf)if(n)return Uint8Array.prototype.indexOf.call(e,t,r);else return Uint8Array.prototype.lastIndexOf.call(e,t,r);return g(e,[t],r,i,n)}throw TypeError("val must be string, number or Buffer")}function g(e,t,r,i,n){var s,a=1,o=e.length,u=t.length;if(void 0!==i&&("ucs2"===(i=String(i).toLowerCase())||"ucs-2"===i||"utf16le"===i||"utf-16le"===i)){if(e.length<2||t.length<2)return -1;a=2,o/=2,u/=2,r/=2}function l(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}if(n){var c=-1;for(s=r;s<o;s++)if(l(e,s)===l(t,-1===c?0:s-c)){if(-1===c&&(c=s),s-c+1===u)return c*a}else -1!==c&&(s-=s-c),c=-1}else for(r+u>o&&(r=o-u),s=r;s>=0;s--){for(var d=!0,h=0;h<u;h++)if(l(e,s+h)!==l(t,h)){d=!1;break}if(d)return s}return -1}o.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==o.prototype},o.compare=function(e,t){if(R(e,Uint8Array)&&(e=o.from(e,e.offset,e.byteLength)),R(t,Uint8Array)&&(t=o.from(t,t.offset,t.byteLength)),!o.isBuffer(e)||!o.isBuffer(t))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,i=t.length,n=0,s=Math.min(r,i);n<s;++n)if(e[n]!==t[n]){r=e[n],i=t[n];break}return r<i?-1:+(i<r)},o.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},o.concat=function(e,t){if(!Array.isArray(e))throw TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return o.alloc(0);if(void 0===t)for(r=0,t=0;r<e.length;++r)t+=e[r].length;var r,i=o.allocUnsafe(t),n=0;for(r=0;r<e.length;++r){var s=e[r];if(R(s,Uint8Array)&&(s=o.from(s)),!o.isBuffer(s))throw TypeError('"list" argument must be an Array of Buffers');s.copy(i,n),n+=s.length}return i},o.byteLength=p,o.prototype._isBuffer=!0,o.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)m(this,t,t+1);return this},o.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)m(this,t,t+3),m(this,t+1,t+2);return this},o.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)m(this,t,t+7),m(this,t+1,t+6),m(this,t+2,t+5),m(this,t+3,t+4);return this},o.prototype.toString=function(){var e=this.length;return 0===e?"":0==arguments.length?x(this,0,e):f.apply(this,arguments)},o.prototype.toLocaleString=o.prototype.toString,o.prototype.equals=function(e){if(!o.isBuffer(e))throw TypeError("Argument must be a Buffer");return this===e||0===o.compare(this,e)},o.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},s&&(o.prototype[s]=o.prototype.inspect),o.prototype.compare=function(e,t,r,i,n){if(R(e,Uint8Array)&&(e=o.from(e,e.offset,e.byteLength)),!o.isBuffer(e))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===i&&(i=0),void 0===n&&(n=this.length),t<0||r>e.length||i<0||n>this.length)throw RangeError("out of range index");if(i>=n&&t>=r)return 0;if(i>=n)return -1;if(t>=r)return 1;if(t>>>=0,r>>>=0,i>>>=0,n>>>=0,this===e)return 0;for(var s=n-i,a=r-t,u=Math.min(s,a),l=this.slice(i,n),c=e.slice(t,r),d=0;d<u;++d)if(l[d]!==c[d]){s=l[d],a=c[d];break}return s<a?-1:+(a<s)},o.prototype.includes=function(e,t,r){return -1!==this.indexOf(e,t,r)},o.prototype.indexOf=function(e,t,r){return y(this,e,t,r,!0)},o.prototype.lastIndexOf=function(e,t,r){return y(this,e,t,r,!1)};function x(e,t,r){r=Math.min(e.length,r);for(var i=[],n=t;n<r;){var s,a,o,u,l=e[n],c=null,d=l>239?4:l>223?3:l>191?2:1;if(n+d<=r)switch(d){case 1:l<128&&(c=l);break;case 2:(192&(s=e[n+1]))==128&&(u=(31&l)<<6|63&s)>127&&(c=u);break;case 3:s=e[n+1],a=e[n+2],(192&s)==128&&(192&a)==128&&(u=(15&l)<<12|(63&s)<<6|63&a)>2047&&(u<55296||u>57343)&&(c=u);break;case 4:s=e[n+1],a=e[n+2],o=e[n+3],(192&s)==128&&(192&a)==128&&(192&o)==128&&(u=(15&l)<<18|(63&s)<<12|(63&a)<<6|63&o)>65535&&u<1114112&&(c=u)}null===c?(c=65533,d=1):c>65535&&(c-=65536,i.push(c>>>10&1023|55296),c=56320|1023&c),i.push(c),n+=d}var h=i,p=h.length;if(p<=4096)return String.fromCharCode.apply(String,h);for(var f="",m=0;m<p;)f+=String.fromCharCode.apply(String,h.slice(m,m+=4096));return f}function b(e,t,r){if(e%1!=0||e<0)throw RangeError("offset is not uint");if(e+t>r)throw RangeError("Trying to access beyond buffer length")}function v(e,t,r,i,n,s){if(!o.isBuffer(e))throw TypeError('"buffer" argument must be a Buffer instance');if(t>n||t<s)throw RangeError('"value" argument is out of bounds');if(r+i>e.length)throw RangeError("Index out of range")}function w(e,t,r,i,n,s){if(r+i>e.length||r<0)throw RangeError("Index out of range")}function I(e,t,r,i,s){return t*=1,r>>>=0,s||w(e,t,r,4,34028234663852886e22,-34028234663852886e22),n.write(e,t,r,i,23,4),r+4}function A(e,t,r,i,s){return t*=1,r>>>=0,s||w(e,t,r,8,17976931348623157e292,-17976931348623157e292),n.write(e,t,r,i,52,8),r+8}o.prototype.write=function(e,t,r,i){if(void 0===t)i="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)i=t,r=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(r)?(r>>>=0,void 0===i&&(i="utf8")):(i=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var n,s,a,o,u,l,c,d,h=this.length-t;if((void 0===r||r>h)&&(r=h),e.length>0&&(r<0||t<0)||t>this.length)throw RangeError("Attempt to write outside buffer bounds");i||(i="utf8");for(var p=!1;;)switch(i){case"hex":return function(e,t,r,i){r=Number(r)||0;var n=e.length-r;i?(i=Number(i))>n&&(i=n):i=n;var s=t.length;i>s/2&&(i=s/2);for(var a=0;a<i;++a){var o,u=parseInt(t.substr(2*a,2),16);if((o=u)!=o)break;e[r+a]=u}return a}(this,e,t,r);case"utf8":case"utf-8":return n=t,s=r,S(T(e,this.length-n),this,n,s);case"ascii":return a=t,o=r,S(N(e),this,a,o);case"latin1":case"binary":return function(e,t,r,i){return S(N(t),e,r,i)}(this,e,t,r);case"base64":return u=t,l=r,S(C(e),this,u,l);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return c=t,d=r,S(function(e,t){for(var r,i,n=[],s=0;s<e.length&&!((t-=2)<0);++s)i=(r=e.charCodeAt(s))>>8,n.push(r%256),n.push(i);return n}(e,this.length-c),this,c,d);default:if(p)throw TypeError("Unknown encoding: "+i);i=(""+i).toLowerCase(),p=!0}},o.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},o.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var i=this.subarray(e,t);return Object.setPrototypeOf(i,o.prototype),i},o.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);for(var i=this[e],n=1,s=0;++s<t&&(n*=256);)i+=this[e+s]*n;return i},o.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);for(var i=this[e+--t],n=1;t>0&&(n*=256);)i+=this[e+--t]*n;return i},o.prototype.readUInt8=function(e,t){return e>>>=0,t||b(e,1,this.length),this[e]},o.prototype.readUInt16LE=function(e,t){return e>>>=0,t||b(e,2,this.length),this[e]|this[e+1]<<8},o.prototype.readUInt16BE=function(e,t){return e>>>=0,t||b(e,2,this.length),this[e]<<8|this[e+1]},o.prototype.readUInt32LE=function(e,t){return e>>>=0,t||b(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+0x1000000*this[e+3]},o.prototype.readUInt32BE=function(e,t){return e>>>=0,t||b(e,4,this.length),0x1000000*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},o.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);for(var i=this[e],n=1,s=0;++s<t&&(n*=256);)i+=this[e+s]*n;return i>=(n*=128)&&(i-=Math.pow(2,8*t)),i},o.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);for(var i=t,n=1,s=this[e+--i];i>0&&(n*=256);)s+=this[e+--i]*n;return s>=(n*=128)&&(s-=Math.pow(2,8*t)),s},o.prototype.readInt8=function(e,t){return(e>>>=0,t||b(e,1,this.length),128&this[e])?-((255-this[e]+1)*1):this[e]},o.prototype.readInt16LE=function(e,t){e>>>=0,t||b(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?0xffff0000|r:r},o.prototype.readInt16BE=function(e,t){e>>>=0,t||b(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?0xffff0000|r:r},o.prototype.readInt32LE=function(e,t){return e>>>=0,t||b(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},o.prototype.readInt32BE=function(e,t){return e>>>=0,t||b(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},o.prototype.readFloatLE=function(e,t){return e>>>=0,t||b(e,4,this.length),n.read(this,e,!0,23,4)},o.prototype.readFloatBE=function(e,t){return e>>>=0,t||b(e,4,this.length),n.read(this,e,!1,23,4)},o.prototype.readDoubleLE=function(e,t){return e>>>=0,t||b(e,8,this.length),n.read(this,e,!0,52,8)},o.prototype.readDoubleBE=function(e,t){return e>>>=0,t||b(e,8,this.length),n.read(this,e,!1,52,8)},o.prototype.writeUIntLE=function(e,t,r,i){if(e*=1,t>>>=0,r>>>=0,!i){var n=Math.pow(2,8*r)-1;v(this,e,t,r,n,0)}var s=1,a=0;for(this[t]=255&e;++a<r&&(s*=256);)this[t+a]=e/s&255;return t+r},o.prototype.writeUIntBE=function(e,t,r,i){if(e*=1,t>>>=0,r>>>=0,!i){var n=Math.pow(2,8*r)-1;v(this,e,t,r,n,0)}var s=r-1,a=1;for(this[t+s]=255&e;--s>=0&&(a*=256);)this[t+s]=e/a&255;return t+r},o.prototype.writeUInt8=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,1,255,0),this[t]=255&e,t+1},o.prototype.writeUInt16LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},o.prototype.writeUInt16BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},o.prototype.writeUInt32LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0xffffffff,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},o.prototype.writeUInt32BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0xffffffff,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},o.prototype.writeIntLE=function(e,t,r,i){if(e*=1,t>>>=0,!i){var n=Math.pow(2,8*r-1);v(this,e,t,r,n-1,-n)}var s=0,a=1,o=0;for(this[t]=255&e;++s<r&&(a*=256);)e<0&&0===o&&0!==this[t+s-1]&&(o=1),this[t+s]=(e/a|0)-o&255;return t+r},o.prototype.writeIntBE=function(e,t,r,i){if(e*=1,t>>>=0,!i){var n=Math.pow(2,8*r-1);v(this,e,t,r,n-1,-n)}var s=r-1,a=1,o=0;for(this[t+s]=255&e;--s>=0&&(a*=256);)e<0&&0===o&&0!==this[t+s+1]&&(o=1),this[t+s]=(e/a|0)-o&255;return t+r},o.prototype.writeInt8=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},o.prototype.writeInt16LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},o.prototype.writeInt16BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},o.prototype.writeInt32LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0x7fffffff,-0x80000000),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},o.prototype.writeInt32BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0x7fffffff,-0x80000000),e<0&&(e=0xffffffff+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},o.prototype.writeFloatLE=function(e,t,r){return I(this,e,t,!0,r)},o.prototype.writeFloatBE=function(e,t,r){return I(this,e,t,!1,r)},o.prototype.writeDoubleLE=function(e,t,r){return A(this,e,t,!0,r)},o.prototype.writeDoubleBE=function(e,t,r){return A(this,e,t,!1,r)},o.prototype.copy=function(e,t,r,i){if(!o.isBuffer(e))throw TypeError("argument should be a Buffer");if(r||(r=0),i||0===i||(i=this.length),t>=e.length&&(t=e.length),t||(t=0),i>0&&i<r&&(i=r),i===r||0===e.length||0===this.length)return 0;if(t<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(i<0)throw RangeError("sourceEnd out of bounds");i>this.length&&(i=this.length),e.length-t<i-r&&(i=e.length-t+r);var n=i-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,i);else if(this===e&&r<t&&t<i)for(var s=n-1;s>=0;--s)e[s+t]=this[s+r];else Uint8Array.prototype.set.call(e,this.subarray(r,i),t);return n},o.prototype.fill=function(e,t,r,i){if("string"==typeof e){if("string"==typeof t?(i=t,t=0,r=this.length):"string"==typeof r&&(i=r,r=this.length),void 0!==i&&"string"!=typeof i)throw TypeError("encoding must be a string");if("string"==typeof i&&!o.isEncoding(i))throw TypeError("Unknown encoding: "+i);if(1===e.length){var n,s=e.charCodeAt(0);("utf8"===i&&s<128||"latin1"===i)&&(e=s)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw RangeError("Out of range index");if(r<=t)return this;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(n=t;n<r;++n)this[n]=e;else{var a=o.isBuffer(e)?e:o.from(e,i),u=a.length;if(0===u)throw TypeError('The value "'+e+'" is invalid for argument "value"');for(n=0;n<r-t;++n)this[n+t]=a[n%u]}return this};var E=/[^+/0-9A-Za-z-_]/g;function T(e,t){t=t||1/0;for(var r,i=e.length,n=null,s=[],a=0;a<i;++a){if((r=e.charCodeAt(a))>55295&&r<57344){if(!n){if(r>56319||a+1===i){(t-=3)>-1&&s.push(239,191,189);continue}n=r;continue}if(r<56320){(t-=3)>-1&&s.push(239,191,189),n=r;continue}r=(n-55296<<10|r-56320)+65536}else n&&(t-=3)>-1&&s.push(239,191,189);if(n=null,r<128){if((t-=1)<0)break;s.push(r)}else if(r<2048){if((t-=2)<0)break;s.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;s.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((t-=4)<0)break;s.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return s}function N(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function C(e){return i.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(E,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function S(e,t,r,i){for(var n=0;n<i&&!(n+r>=t.length)&&!(n>=e.length);++n)t[n+r]=e[n];return n}function R(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}var U=function(){for(var e="0123456789abcdef",t=Array(256),r=0;r<16;++r)for(var i=16*r,n=0;n<16;++n)t[i+n]=e[r]+e[n];return t}()},783:function(e,t){t.read=function(e,t,r,i,n){var s,a,o=8*n-i-1,u=(1<<o)-1,l=u>>1,c=-7,d=r?n-1:0,h=r?-1:1,p=e[t+d];for(d+=h,s=p&(1<<-c)-1,p>>=-c,c+=o;c>0;s=256*s+e[t+d],d+=h,c-=8);for(a=s&(1<<-c)-1,s>>=-c,c+=i;c>0;a=256*a+e[t+d],d+=h,c-=8);if(0===s)s=1-l;else{if(s===u)return a?NaN:1/0*(p?-1:1);a+=Math.pow(2,i),s-=l}return(p?-1:1)*a*Math.pow(2,s-i)},t.write=function(e,t,r,i,n,s){var a,o,u,l=8*s-n-1,c=(1<<l)-1,d=c>>1,h=5960464477539062e-23*(23===n),p=i?0:s-1,f=i?1:-1,m=+(t<0||0===t&&1/t<0);for(isNaN(t=Math.abs(t))||t===1/0?(o=+!!isNaN(t),a=c):(a=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-a))<1&&(a--,u*=2),a+d>=1?t+=h/u:t+=h*Math.pow(2,1-d),t*u>=2&&(a++,u/=2),a+d>=c?(o=0,a=c):a+d>=1?(o=(t*u-1)*Math.pow(2,n),a+=d):(o=t*Math.pow(2,d-1)*Math.pow(2,n),a=0));n>=8;e[r+p]=255&o,p+=f,o/=256,n-=8);for(a=a<<n|o,l+=n;l>0;e[r+p]=255&a,p+=f,a/=256,l-=8);e[r+p-f]|=128*m}}},n={};function s(e){var t=n[e];if(void 0!==t)return t.exports;var r=n[e]={exports:{}},a=!0;try{i[e](r,r.exports,s),a=!1}finally{a&&delete n[e]}return r.exports}s.ab="/ROOT/node_modules/next/dist/compiled/buffer/",t.exports=s(72)},63059,e=>{"use strict";let t=(0,e.i(75254).default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",()=>t],63059)},11870,e=>{"use strict";var t=e.i(43476),r=e.i(18566),i=e.i(71645),n=e.i(19284);function s({children:e}){let s=(0,r.useRouter)(),{isAuthenticated:a,checkExpiration:o}=(0,n.useAuthStore)(),[u,l]=(0,i.useState)(()=>n.useAuthStore.persist.hasHydrated());return((0,i.useEffect)(()=>{if(u)return;let e=n.useAuthStore.persist.onFinishHydration(()=>{l(!0)});return n.useAuthStore.persist.hasHydrated()&&setTimeout(()=>l(!0),0),e},[u]),(0,i.useEffect)(()=>{if(!u)return;let e=o();a&&e||s.push("/")},[u,a,o,s]),u)?a?(0,t.jsx)(t.Fragment,{children:e}):null:(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})})}e.s(["ProtectedRoute",()=>s])},39990,e=>{"use strict";var t=e.i(66027),r=e.i(97903),i=e.i(88417),n=e.i(19284);function s(){let{isAuthenticated:e}=(0,n.useAuthStore)();return(0,t.useQuery)({queryKey:["myLevel"],queryFn:async()=>(await (0,r.graphqlRequest)(i.GET_MY_LEVEL_QUERY)).myLevel,enabled:e,staleTime:3e5})}e.s(["useMyLevel",()=>s])},66145,e=>{"use strict";var t=e.i(66027),r=e.i(97903),i=e.i(88417),n=e.i(19284);function s(){let e=(0,n.useAuthStore)(e=>e.isAuthenticated);return(0,t.useQuery)({queryKey:["currentUser"],queryFn:async()=>(await (0,r.graphqlRequest)(i.GET_CURRENT_USER_QUERY)).me,enabled:e,staleTime:3e5})}e.s(["useCurrentUser",()=>s])},88493,919,90932,44868,85076,55715,8453,68362,e=>{"use strict";e.i(66145),e.i(66027);var t=e.i(97903),r=e.i(88417),i=e.i(54616),n=e.i(19284);function s(){let e=(0,n.useAuthStore)(e=>e.setAuth);return(0,i.useMutation)({mutationFn:async({rememberMe:e,...i})=>({...(await (0,t.graphqlRequest)(r.LOGIN_MUTATION,{input:i})).signIn,rememberMe:e}),onSuccess:t=>{e(t.user,t.accessToken,t.rememberMe)}})}function a(){let e=(0,n.useAuthStore)(e=>e.setAuth);return(0,i.useMutation)({mutationFn:async e=>(await (0,t.graphqlRequest)(r.SIGNUP_MUTATION,{input:e})).signUp,onSuccess:t=>{e(t.user,t.accessToken)}})}function o(){let e=(0,n.useAuthStore)(e=>e.clearAuth);return(0,i.useMutation)({mutationFn:async()=>Promise.resolve(),onSuccess:()=>{e(),window.$crisp?.push(["do","session:reset"])}})}function u(){return(0,i.useMutation)({mutationFn:async e=>(await (0,t.graphqlRequest)(r.FORGOT_PASSWORD_MUTATION,{input:e})).forgotPassword})}function l(){return(0,i.useMutation)({mutationFn:async e=>(await (0,t.graphqlRequest)(r.RESET_PASSWORD_MUTATION,{input:e})).resetPassword})}e.s(["useLogin",()=>s],919),e.s(["useSignup",()=>a],90932),e.s(["useLogout",()=>o],44868),e.i(12598),e.s(["useVerifyEmail",0,()=>(0,i.useMutation)({mutationFn:async e=>(await t.graphqlClient.request(r.VERIFY_EMAIL_MUTATION,{input:e})).verifyEmail})],85076),e.s(["useResendVerification",0,()=>(0,i.useMutation)({mutationFn:async e=>(await t.graphqlClient.request(r.RESEND_VERIFICATION_MUTATION,{input:e})).resendVerification})],55715),e.s(["useForgotPassword",()=>u],8453),e.s(["useResetPassword",()=>l],68362),e.s([],88493)},69638,e=>{"use strict";let t=(0,e.i(75254).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",()=>t],69638)},16064,e=>{"use strict";var t=e.i(66027),r=e.i(97903),i=e.i(88417),n=e.i(19284);function s(e=20){return(0,t.useQuery)({queryKey:["cityLeaderboard",e],queryFn:async()=>(await (0,r.graphqlRequest)(i.CITY_LEADERBOARD_QUERY,{limit:e})).cityLeaderboard,staleTime:6e4})}function a(){let e=(0,n.useAuthStore)(e=>e.isAuthenticated);return(0,t.useQuery)({queryKey:["myChallenges","on-going"],queryFn:async()=>(await (0,r.graphqlRequest)(i.MY_CHALLENGES_QUERY,{status:"on-going"})).myChallenges,enabled:e,staleTime:3e4})}function o(e=200){let s=(0,n.useAuthStore)(e=>e.isAuthenticated);return(0,t.useQuery)({queryKey:["myPointsHistory",e],queryFn:async()=>(await (0,r.graphqlRequest)(i.MY_POINTS_HISTORY_QUERY,{limit:e})).myPointsHistory,enabled:s,staleTime:3e4})}function u(){let e=(0,n.useAuthStore)(e=>e.isAuthenticated);return(0,t.useQuery)({queryKey:["loginStreak"],queryFn:async()=>(await (0,r.graphqlRequest)(i.GET_CURRENT_USER_QUERY)).me.loginStreak??0,enabled:e,staleTime:3e5})}e.s(["useCityLeaderboard",()=>s,"useLoginStreak",()=>u,"useMyActiveChallenges",()=>a,"useMyPointsHistory",()=>o])},74886,e=>{"use strict";let t=(0,e.i(75254).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",()=>t],74886)},94983,e=>{"use strict";let t=(0,e.i(75254).default)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]);e.s(["MessageCircle",()=>t],94983)},48643,e=>{"use strict";var t=e.i(54616),r=e.i(66027),i=e.i(12598),n=e.i(97903);e.i(11643);var s=e.i(85056);let a=s.gql`
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
`,o=s.gql`
  query GetWalletBalance($walletId: ID!) {
    walletBalance(walletId: $walletId) {
      balance
      availableBalance
      currency
    }
  }
`,u=s.gql`
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
`,l=s.gql`
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
`;s.gql`
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
`,s.gql`
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
`;let c=s.gql`
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
`,d=s.gql`
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
`;s.gql`
  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
    createCheckoutSession(input: $input) {
      id
      url
      amount
      currency
      status
    }
  }
`,s.gql`
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
`,s.gql`
  mutation CancelPaymentIntent($paymentIntentId: String!) {
    cancelPaymentIntent(paymentIntentId: $paymentIntentId) {
      id
      status
    }
  }
`,s.gql`
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
`;let h=s.gql`
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
`;s.gql`
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
`;let p=s.gql`
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
`,f=s.gql`
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
`,m=s.gql`
  mutation CancelSubscription($input: CancelSubscriptionInput!) {
    cancelSubscription(input: $input) {
      id
      status
      endDate
      updatedAt
    }
  }
`;s.gql`
  mutation PauseSubscription($subscriptionId: ID!) {
    pauseSubscription(subscriptionId: $subscriptionId) {
      id
      status
      updatedAt
    }
  }
`,s.gql`
  mutation ResumeSubscription($subscriptionId: ID!) {
    resumeSubscription(subscriptionId: $subscriptionId) {
      id
      status
      nextBillingDate
      updatedAt
    }
  }
`;let y=s.gql`
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
`;function g(e){return(0,r.useQuery)({queryKey:["wallet",e],queryFn:async()=>(await n.graphqlClient.request(a,{input:e})).wallet,enabled:!!(e.id||e.userId)})}function x(e){return(0,r.useQuery)({queryKey:["walletBalance",e],queryFn:async()=>(await n.graphqlClient.request(o,{walletId:e})).walletBalance,enabled:!!e})}function b(e){return(0,r.useQuery)({queryKey:["walletTransactions",e],queryFn:async()=>(await n.graphqlClient.request(u,{input:e})).walletTransactions,enabled:!!e.walletId})}function v(){let e=(0,i.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await n.graphqlClient.request(l,{input:e})).createWallet,onSuccess:()=>{e.invalidateQueries({queryKey:["wallet"]})}})}function w(){let e=(0,i.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await n.graphqlClient.request(c,{input:e})).spendFromWallet,onSuccess:(t,r)=>{e.invalidateQueries({queryKey:["wallet",{id:r.walletId}]}),e.invalidateQueries({queryKey:["walletBalance",r.walletId]}),e.invalidateQueries({queryKey:["walletTransactions",{walletId:r.walletId}]})}})}function I(){return(0,t.useMutation)({mutationFn:async e=>(await n.graphqlClient.request(d,{input:e})).createPaymentIntent})}function A(e){return(0,r.useQuery)({queryKey:["subscriptions",{walletId:e}],queryFn:async()=>(await n.graphqlClient.request(h,{walletId:e})).subscriptionsByWallet,enabled:!!e})}function E(e){return(0,r.useQuery)({queryKey:["subscriptionBillingHistory",e],queryFn:async()=>(await n.graphqlClient.request(p,{subscriptionId:e})).subscriptionBillingHistory,enabled:!!e})}function T(){let e=(0,i.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await n.graphqlClient.request(f,{input:e})).createSubscription,onSuccess:t=>{e.invalidateQueries({queryKey:["subscriptions",{walletId:t.walletId}]}),e.invalidateQueries({queryKey:["activeSubscriptions",{walletId:t.walletId}]}),e.invalidateQueries({queryKey:["wallet",{id:t.walletId}]})}})}function N(){let e=(0,i.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await n.graphqlClient.request(m,{input:e})).cancelSubscription,onSuccess:t=>{e.invalidateQueries({queryKey:["subscription",t.id]}),e.invalidateQueries({queryKey:["subscriptions",{walletId:t.walletId}]}),e.invalidateQueries({queryKey:["activeSubscriptions",{walletId:t.walletId}]})}})}function C(){let e=(0,i.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await n.graphqlClient.request(y,{subscriptionId:e})).processSubscriptionBilling,onSuccess:t=>{e.invalidateQueries({queryKey:["subscription",t.subscriptionId]}),e.invalidateQueries({queryKey:["subscriptionBillingHistory",t.subscriptionId]}),e.invalidateQueries({queryKey:["walletTransactions"]})}})}e.s(["useCancelSubscription",()=>N,"useCreatePaymentIntent",()=>I,"useCreateSubscription",()=>T,"useCreateWallet",()=>v,"useProcessSubscriptionBilling",()=>C,"useSpendFromWallet",()=>w,"useSubscriptionBillingHistory",()=>E,"useSubscriptionsByWallet",()=>A,"useWallet",()=>g,"useWalletBalance",()=>x,"useWalletTransactions",()=>b],48643)},39312,e=>{"use strict";let t=(0,e.i(75254).default)("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);e.s(["Zap",()=>t],39312)},68553,e=>{"use strict";let t=(0,e.i(75254).default)("camera",[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);e.s(["Camera",()=>t],68553)},52754,e=>{"use strict";let t=(0,e.i(75254).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",()=>t],52754)},74875,e=>{"use strict";let t=(0,e.i(75254).default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["HelpCircle",()=>t],74875)},13278,e=>{"use strict";var t=e.i(43476),r=e.i(66027),i=e.i(12598),n=e.i(52754),s=e.i(39312),a=e.i(74875),o=e.i(92270),u=e.i(63059),l=e.i(43553),c=e.i(74886),d=e.i(69638),h=e.i(94983),p=e.i(68553),f=e.i(37727),m=e.i(8402);let y=(0,e.i(75254).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);var g=e.i(57688),x=e.i(22016),b=e.i(18566),v=e.i(71645),w=e.i(74080),I=e.i(11870),A=e.i(16064),E=e.i(48643);e.i(88493);var T=e.i(44868),N=e.i(66145),C=e.i(39990),S=e.i(74911),R=e.i(98439),U=e.i(97903),j=e.i(88417);function O(e){if(!e||"string"!=typeof e)return"";let t=e.trim().split(/\s+/).filter(e=>e.length>0);return 0===t.length?"":1===t.length?t[0]?.[0]?.toUpperCase()??"":(t[0]?.[0]?.toUpperCase()??"")+(t[1]?.[0]?.toUpperCase()??"")}var _=e.i(31924);function M(){return(0,v.useEffect)(()=>{let e,t="32fa577d-5d7c-4c5c-b2de-a2e17a071424";if("undefined"!=typeof document){if(window.$crisp&&window.CRISP_WEBSITE_ID===t)return;if(e=document.querySelector('script[src="https://client.crisp.chat/l.js"]')){window.$crisp=window.$crisp||[],window.CRISP_WEBSITE_ID=t;return}window.$crisp=window.$crisp||[],window.CRISP_WEBSITE_ID=t,window.$crisp.push(["do","chat:hide"]),window.$crisp.push(["on","chat:closed",()=>{window.$crisp.push(["do","chat:hide"])}]);let r=document.createElement("script");r.src="https://client.crisp.chat/l.js",r.async=!0,document.head.appendChild(r)}return()=>{e?.parentNode&&e.parentNode.removeChild(e),delete window.$crisp,delete window.CRISP_WEBSITE_ID}},[]),null}e.i(47167);var P=e.i(19284);let $=["🐶","🐱","🦊","🐻","🐼","🐨","🦁","🐯","🦋","🐙","🦄","🐸","🐧","🦉","🐺","🦊","🐷","🐮","🐵","🦖"];function q({currentAvatarUrl:e,displayName:r,onClose:i,onSave:n}){let s=(0,v.useRef)(null),[a,o]=(0,v.useState)(e??null),[u,l]=(0,v.useState)(null),[c,d]=(0,v.useState)(!1),h=async()=>{if(a){d(!0);try{if(u){let{uploadUrl:e,publicUrl:t}=(await (0,U.graphqlRequest)(j.REQUEST_AVATAR_UPLOAD_MUTATION,{fileName:u.name})).requestAvatarUpload;await fetch(e,{method:"PUT",body:u,headers:{"Content-Type":u.type}}),await n(t)}else await n(a)}finally{d(!1),i()}}},m=a&&!a.startsWith("data:")&&!a.startsWith("http");return(0,w.createPortal)((0,t.jsx)("div",{className:"fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center px-4",onClick:i,children:(0,t.jsxs)("div",{className:"bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl mb-4 sm:mb-0",onClick:e=>e.stopPropagation(),children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-5",children:[(0,t.jsx)("h2",{className:"text-base font-black text-gray-900",children:"Editar foto de perfil"}),(0,t.jsx)("button",{onClick:i,className:"text-gray-400 hover:text-gray-600",children:(0,t.jsx)(f.X,{className:"w-5 h-5"})})]}),(0,t.jsx)("div",{className:"flex justify-center mb-5",children:(0,t.jsx)("div",{className:"w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shadow-md ring-4 ring-orange-200",children:a?m?(0,t.jsx)("span",{className:"text-5xl",children:a}):(0,t.jsx)(g.default,{src:a,alt:"preview",width:96,height:96,className:"w-full h-full object-cover",unoptimized:!0}):(0,t.jsx)("span",{className:"text-3xl font-black text-orange-500",children:O(r??"")})})}),(0,t.jsx)("input",{ref:s,type:"file",accept:"image/*",className:"hidden",onChange:e=>{let t=e.target.files?.[0];if(!t)return;l(t);let r=new FileReader;r.onload=()=>o(r.result),r.readAsDataURL(t)}}),(0,t.jsxs)("button",{onClick:()=>s.current?.click(),className:"w-full flex items-center justify-center gap-2 border-2 border-dashed border-orange-300 rounded-2xl py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors mb-4",children:[(0,t.jsx)(p.Camera,{className:"w-4 h-4"}),"Subir foto"]}),(0,t.jsx)("p",{className:"text-xs font-bold text-gray-500 uppercase tracking-wide mb-2",children:"O elige un avatar"}),(0,t.jsx)("div",{className:"grid grid-cols-10 gap-1 mb-5",children:$.map(e=>(0,t.jsx)("button",{onClick:()=>{l(null),o(e)},className:`text-xl rounded-lg p-1 transition-transform active:scale-90 ${a===e?"bg-orange-100 ring-2 ring-orange-400":"hover:bg-gray-100"}`,children:e},e))}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:i,className:"flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors",children:"Cancelar"}),(0,t.jsx)("button",{onClick:()=>void h(),disabled:!a||c,className:"flex-1 py-3 rounded-2xl bg-orange-500 text-white text-sm font-bold disabled:opacity-50 hover:bg-orange-600 transition-colors",children:c?"Guardando...":"Guardar"})]})]})}),document.body)}function k({size:e="sm",avatarUrl:r,displayName:i,onOpenModal:n}){return(0,t.jsxs)("div",{className:"relative inline-block",children:[(0,t.jsxs)("button",{onClick:n,className:`relative ${"lg"===e?"w-24 h-24":"w-16 h-16"} rounded-full bg-orange-100 flex items-center justify-center overflow-hidden ring-2 ring-orange-200 group`,children:[r?r.startsWith("data:")||r.startsWith("http")?(0,t.jsx)(g.default,{src:r,alt:"avatar",width:"lg"===e?96:64,height:"lg"===e?96:64,className:"w-full h-full object-cover",unoptimized:!0}):(0,t.jsx)("span",{className:"lg"===e?"text-5xl":"text-3xl",children:r}):(0,t.jsx)("span",{className:`${"lg"===e?"text-2xl":"text-xl"} font-black text-orange-500`,children:O(i??void 0)}),(0,t.jsx)("div",{className:"absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",children:(0,t.jsx)(p.Camera,{className:"w-4 h-4 text-white"})})]}),(0,t.jsx)("div",{className:"absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow",children:(0,t.jsx)(p.Camera,{className:"w-2.5 h-2.5 text-white"})})]})}function D({level:e,monthlyUsageCount:r,discountPercentage:i,levelProgress:n,getTotalForLevel:s}){return(0,t.jsx)(x.default,{href:"/level",children:(0,t.jsxs)("div",{className:"border-2 border-yellow-400 rounded-2xl p-4 bg-white",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between mb-1",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h3",{className:"text-lg font-black text-foreground",children:["Nivel ",e,": ",function(e){switch(e){case 2:return"Explorador";case 3:return"Maestro";default:return"Novato"}}(e)]}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Usa ",s(e)," descuentos al mes para subir de nivel"]})]}),(0,t.jsxs)("span",{className:"text-lg font-black text-orange-500",children:[i,"%"]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mt-3",children:[(0,t.jsx)("span",{className:"text-xs font-bold text-muted-foreground",children:e}),(0,t.jsxs)("div",{className:"relative flex-1 h-5 bg-yellow-100 rounded-full overflow-hidden flex items-center px-1",children:[(0,t.jsx)("div",{className:"h-3 bg-yellow-400 rounded-full transition-all",style:{width:`${Math.min(n,100)}%`}}),(0,t.jsxs)("span",{className:"absolute inset-0 flex items-center justify-center text-[10px] font-bold text-yellow-700 pointer-events-none",children:["⭐ ",r,"/",s(e)," usos"]})]}),(0,t.jsx)("span",{className:"text-xs font-bold text-muted-foreground",children:e+1})]})]})})}function B({walletLoading:e,walletBalance:r,couponCount:i,onOpenCrisp:s}){return(0,t.jsxs)("div",{className:"grid grid-cols-3 gap-3",children:[(0,t.jsxs)(x.default,{href:"/wallet",className:"flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center",children:(0,t.jsx)(n.Wallet,{className:"w-5 h-5 text-green-600"})}),e?(0,t.jsx)("div",{className:"w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"}):(0,t.jsxs)("p",{className:"text-sm font-black text-foreground",children:["$",(r/100).toFixed(2)]}),(0,t.jsx)("p",{className:"text-[10px] font-semibold text-muted-foreground uppercase tracking-wide",children:"Billetera"})]}),(0,t.jsxs)("button",{onClick:s,className:"flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center",children:(0,t.jsx)(h.MessageCircle,{className:"w-5 h-5 text-blue-600"})}),(0,t.jsx)("p",{className:"text-sm font-black text-foreground",children:"24/7"}),(0,t.jsx)("p",{className:"text-[10px] font-semibold text-muted-foreground uppercase tracking-wide",children:"Ayuda"})]}),(0,t.jsxs)(x.default,{href:"/my-coupons",className:"flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center",children:(0,t.jsx)(m.Ticket,{className:"w-5 h-5 text-pink-600"})}),(0,t.jsx)("p",{className:"text-sm font-black text-foreground",children:i}),(0,t.jsx)("p",{className:"text-[10px] font-semibold text-muted-foreground uppercase tracking-wide",children:"Mis Cupones"})]})]})}function Q({misionesOpen:e,onToggleMisiones:r,newMissionsCount:i,loginStreak:n,streakProgress:s,streakTarget:a,streakPoints:o}){return(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-lg font-black text-foreground mb-3",children:"Misiones y Logros"}),(0,t.jsxs)("div",{className:"bg-white rounded-2xl border border-border shadow-sm divide-y divide-border",children:[(0,t.jsxs)("button",{onClick:r,className:"w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors rounded-t-2xl",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center",children:(0,t.jsx)("span",{className:"text-lg",children:"📋"})}),(0,t.jsx)("span",{className:"font-semibold text-foreground",children:"Misiones diarias"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[i>0?(0,t.jsxs)("span",{className:"text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full",children:["¡",i," Nuevas!"]}):null,(0,t.jsx)(u.ChevronRight,{className:`w-4 h-4 text-muted-foreground transition-transform ${e?"rotate-90":""}`})]})]}),e?(0,t.jsxs)("div",{className:"px-4 py-4 bg-orange-50/60",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{className:"text-lg",children:"🔥"}),(0,t.jsx)("span",{className:"text-sm font-bold text-foreground",children:"Racha de inicio de sesión"})]}),(0,t.jsxs)("span",{className:"text-xs font-bold text-orange-500",children:[n," días"]})]}),(0,t.jsx)("div",{className:"relative h-4 bg-orange-100 rounded-full overflow-hidden",children:(0,t.jsx)("div",{className:"h-full bg-orange-400 rounded-full transition-all",style:{width:`${Math.min(s/a*100,100)}%`}})}),(0,t.jsxs)("div",{className:"flex justify-between mt-1",children:[(0,t.jsxs)("span",{className:"text-[10px] text-muted-foreground",children:[s,"/",a," días consecutivos"]}),(0,t.jsxs)("span",{className:"text-[10px] font-bold text-orange-500",children:["+",o," pts"]})]}),(0,t.jsxs)(x.default,{href:"/league/puntos",className:"mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline",children:["Ver todas las misiones ",(0,t.jsx)(u.ChevronRight,{className:"w-3 h-3"})]})]}):null,(0,t.jsxs)(x.default,{href:"/league",className:"flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors rounded-b-2xl",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center",children:(0,t.jsx)("span",{className:"text-lg",children:"🏆"})}),(0,t.jsx)("span",{className:"font-semibold text-foreground",children:"Premios ganados"})]}),(0,t.jsx)(u.ChevronRight,{className:"w-4 h-4 text-muted-foreground"})]})]})]})}function L({isPremium:e,discountPercentage:r}){return e?(0,t.jsxs)("div",{className:"flex items-center justify-between bg-gradient-primary rounded-2xl px-5 py-4 shadow-lg",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)(l.Crown,{className:"w-8 h-8 text-white"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-black text-white text-sm",children:"Miembro Premium Activo"}),(0,t.jsxs)("p",{className:"text-white/80 text-xs",children:["Descuento ",r,"% activo"]})]})]}),(0,t.jsx)(s.Zap,{className:"w-6 h-6 text-white/80"})]}):(0,t.jsxs)(x.default,{href:"/subscription",className:"flex items-center justify-between bg-black rounded-2xl px-5 py-4 shadow-lg",children:[(0,t.jsx)(g.default,{width:68,height:68,src:"/premiumbadge.png",alt:"restairant Image"}),(0,t.jsx)("div",{className:"flex items-center gap-3",children:(0,t.jsx)("p",{className:"font-black text-white text-sm",children:"Más Descuentos, Sin Anuncios"})}),(0,t.jsx)("span",{className:"bg-purple-500 text-white text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap",children:"Hazte Premium"})]})}function F({logoutPending:e,onLogout:r,onOpenCrisp:i}){return(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-lg font-black text-foreground mb-3",children:"Mi Cuenta"}),(0,t.jsxs)("div",{className:"bg-white rounded-2xl border border-border shadow-sm divide-y divide-border",children:[(0,t.jsxs)(x.default,{href:"/help",className:"flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center",children:(0,t.jsx)(a.HelpCircle,{className:"w-4 h-4 text-gray-500"})}),(0,t.jsx)("span",{className:"font-semibold text-foreground",children:"Ayuda & Preguntas"})]}),(0,t.jsx)(u.ChevronRight,{className:"w-4 h-4 text-muted-foreground"})]}),(0,t.jsxs)("button",{onClick:i,className:"w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center",children:(0,t.jsx)(y,{className:"w-4 h-4 text-gray-500"})}),(0,t.jsx)("span",{className:"font-semibold text-foreground",children:"Notificaciones"})]}),(0,t.jsx)(u.ChevronRight,{className:"w-4 h-4 text-muted-foreground"})]}),(0,t.jsx)("button",{onClick:r,disabled:e,className:"w-full flex items-center justify-between px-4 py-4 hover:bg-red-50 transition-colors rounded-b-2xl",children:(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center",children:(0,t.jsx)(o.LogOut,{className:"w-4 h-4 text-red-500"})}),(0,t.jsx)("span",{className:"font-semibold text-red-500",children:e?"Cerrando sesión...":"Cerrar sesión"})]})})]})]})}function W(){let e=(0,b.useRouter)(),{toast:n}=(0,S.useToast)(),{user:s,updateUser:a}=(0,P.useAuthStore)(),o=(0,i.useQueryClient)(),{data:u}=(0,C.useMyLevel)(),{data:h}=(0,N.useCurrentUser)(),p=(0,T.useLogout)(),[f,m]=(0,v.useState)(!1),[y,g]=(0,v.useState)(!1),[x,w]=(0,v.useState)(!1),O=async e=>{try{await (0,U.graphqlRequest)(j.UPDATE_ME_MUTATION,{input:{avatarUrl:e}}),a({avatarUrl:e}),await o.invalidateQueries({queryKey:["currentUser"]}),n({title:"Avatar actualizado"})}catch(e){n({variant:"destructive",title:"Error al guardar",description:e instanceof Error?e.message:"Intenta de nuevo."})}};(0,v.useEffect)(()=>{h&&a(h)},[h,a]);let{data:$}=(0,E.useWallet)({userId:s?.id}),{data:W,isLoading:G}=(0,E.useWalletBalance)($?.id||""),Y=(s?.isPremium?15:u?.discountPercentage)??10,{data:V=0}=(0,A.useLoginStreak)(),{data:K=[]}=(0,A.useMyActiveChallenges)(),{data:H}=(0,r.useQuery)({queryKey:["coupons","unused"],queryFn:()=>(0,U.graphqlRequest)(j.COUPONS_QUERY,{filters:{used:!1}}).then(e=>e.myCoupons),enabled:!!s}),z=H?.length??0,X=K.length;if(!s)return null;let Z=e=>3===e||2===e?10:5,J=async()=>{if(s.referralCode){let e=`\xa1Usa mi c\xf3digo de referido "${s.referralCode}" y gana $99mxn en tu billetera!`;await navigator.clipboard.writeText(e),m(!0),setTimeout(()=>m(!1),2e3),n({title:"¡Código copiado!",description:"Código de referido copiado al portapapeles"})}},ee=async()=>{try{await p.mutateAsync(),n({title:"Sesión cerrada",description:"Has cerrado sesión exitosamente."}),e.push("/")}catch(e){n({variant:"destructive",title:"Error al cerrar sesión",description:(0,_.extractErrorMessage)(e)||"No se pudo cerrar sesión"})}},et=()=>{window.$crisp&&(window.$crisp.push(["do","chat:show"]),window.$crisp.push(["do","chat:open"]))},er=(u?.monthlyUsageCount??0)/Z(u?.level)*100,ei=K.find(e=>e.challenge?.entityType==="LOGIN_STREAKS"||e.challenge?.entityType==="login_streaks"),en=ei?.challenge?.count??1,es=ei?.count??0;return(0,t.jsx)(I.ProtectedRoute,{children:(0,t.jsxs)(R.BasicLayout,{children:[(0,t.jsxs)("div",{className:"lg:hidden pb-10 max-w-xl mx-auto w-full",children:[(0,t.jsx)("div",{className:"px-5 pt-16 pb-4",children:(0,t.jsx)("h1",{className:"text-2xl font-black text-foreground",children:"Perfil"})}),(0,t.jsxs)("div",{className:"px-5 flex items-center justify-between mb-5",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)(k,{size:"sm",avatarUrl:s.avatarUrl,displayName:s.displayName,onOpenModal:()=>g(!0)}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-lg font-black text-foreground leading-tight",children:s.displayName||s.email?.split("@")[0]}),s.isPremium?(0,t.jsxs)("div",{className:"inline-flex items-center gap-1 text-xs font-bold text-orange-500",children:[(0,t.jsx)(l.Crown,{className:"w-3 h-3"})," Premium"]}):(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:["@",s.email?.split("@")[0]]})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5",children:[(0,t.jsx)("span",{className:"text-lg",children:"🔥"}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-base font-black text-orange-500 leading-none",children:V}),(0,t.jsx)("p",{className:"text-[10px] text-orange-400 leading-none",children:"Racha diaria"})]})]})]}),y?(0,t.jsx)(q,{currentAvatarUrl:s.avatarUrl,displayName:s.displayName,onClose:()=>g(!1),onSave:O}):null,(0,t.jsx)("div",{className:"px-5 mb-5",children:(0,t.jsx)(D,{level:u?.level??1,monthlyUsageCount:u?.monthlyUsageCount??0,discountPercentage:Y,levelProgress:er,getTotalForLevel:Z})}),(0,t.jsx)("div",{className:"px-5 mb-5",children:(0,t.jsx)(B,{walletLoading:G,walletBalance:W?.balance||0,couponCount:z,onOpenCrisp:et})}),s.referralCode?(0,t.jsxs)("div",{className:"px-5 mb-5",children:[(0,t.jsxs)("button",{onClick:()=>void J(),className:"w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Código referido:"}),(0,t.jsx)("span",{className:"font-mono font-black text-foreground",children:s.referralCode})]}),f?(0,t.jsx)(d.CheckCircle,{className:"w-4 h-4 text-green-500"}):(0,t.jsx)(c.Copy,{className:"w-4 h-4 text-primary"})]}),(0,t.jsx)("p",{className:"text-[10px] text-muted-foreground text-center mt-1",children:"🎁 Gana 1 mes Premium gratis cuando alguien use tu código"})]}):null,(0,t.jsx)("div",{className:"px-5 mb-5",children:(0,t.jsx)(Q,{misionesOpen:x,onToggleMisiones:()=>w(e=>!e),newMissionsCount:X,loginStreak:V,streakProgress:es,streakTarget:en,streakPoints:ei?.challenge?.points??5})}),(0,t.jsx)("div",{className:"px-5 mb-5",children:(0,t.jsx)(L,{isPremium:s.isPremium??!1,discountPercentage:Y})}),(0,t.jsx)("div",{className:"px-5 mb-5",children:(0,t.jsx)(F,{logoutPending:p.isPending,onLogout:()=>void ee(),onOpenCrisp:et})}),(0,t.jsx)("div",{className:"text-center py-4",children:(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Ñamy — Come inteligente, ahorra más 🍴💚"})})]}),(0,t.jsxs)("div",{className:"hidden lg:block pb-16 max-w-5xl mx-auto w-full px-8 pt-20",children:[(0,t.jsx)("div",{className:"mb-8",children:(0,t.jsx)("h1",{className:"text-3xl font-black text-foreground",children:"Perfil"})}),(0,t.jsxs)("div",{className:"grid grid-cols-[320px_1fr] gap-8 items-start",children:[(0,t.jsxs)("div",{className:"space-y-5 sticky top-24",children:[(0,t.jsxs)("div",{className:"bg-white rounded-3xl border border-border shadow-sm p-6 flex flex-col items-center gap-3 text-center",children:[(0,t.jsx)(k,{size:"lg",avatarUrl:s.avatarUrl,displayName:s.displayName,onOpenModal:()=>g(!0)}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black text-foreground leading-tight",children:s.displayName||s.email?.split("@")[0]}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:["@",s.email?.split("@")[0]]}),s.isPremium?(0,t.jsxs)("div",{className:"inline-flex items-center gap-1 text-xs font-bold text-orange-500 mt-1",children:[(0,t.jsx)(l.Crown,{className:"w-3 h-3"})," Miembro Premium"]}):null]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2",children:[(0,t.jsx)("span",{className:"text-xl",children:"🔥"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-lg font-black text-orange-500 leading-none",children:V}),(0,t.jsx)("p",{className:"text-[10px] text-orange-400 leading-none",children:"Racha diaria"})]})]}),s.referralCode?(0,t.jsxs)("div",{className:"w-full",children:[(0,t.jsxs)("button",{onClick:()=>void J(),className:"w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Código:"}),(0,t.jsx)("span",{className:"font-mono font-black text-foreground",children:s.referralCode})]}),f?(0,t.jsx)(d.CheckCircle,{className:"w-4 h-4 text-green-500"}):(0,t.jsx)(c.Copy,{className:"w-4 h-4 text-primary"})]}),(0,t.jsx)("p",{className:"text-[10px] text-muted-foreground text-center mt-1",children:"🎁 Gana 1 mes Premium gratis con tu código"})]}):null]}),(0,t.jsx)(B,{walletLoading:G,walletBalance:W?.balance||0,couponCount:z,onOpenCrisp:et}),(0,t.jsx)("div",{className:"text-center py-2",children:(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Ñamy — Come inteligente, ahorra más 🍴💚"})})]}),(0,t.jsxs)("div",{className:"space-y-5",children:[(0,t.jsx)(D,{level:u?.level??1,monthlyUsageCount:u?.monthlyUsageCount??0,discountPercentage:Y,levelProgress:er,getTotalForLevel:Z}),(0,t.jsx)(Q,{misionesOpen:x,onToggleMisiones:()=>w(e=>!e),newMissionsCount:X,loginStreak:V,streakProgress:es,streakTarget:en,streakPoints:ei?.challenge?.points??5}),(0,t.jsx)(L,{isPremium:s.isPremium??!1,discountPercentage:Y})]})]}),(0,t.jsx)("div",{className:"mt-8",children:(0,t.jsx)(F,{logoutPending:p.isPending,onLogout:()=>void ee(),onOpenCrisp:et})})]}),y?(0,t.jsx)(q,{currentAvatarUrl:s.avatarUrl,displayName:s.displayName,onClose:()=>g(!1),onSave:O}):null,(0,t.jsx)(M,{})]})})}e.s(["default",()=>W],13278)}]);