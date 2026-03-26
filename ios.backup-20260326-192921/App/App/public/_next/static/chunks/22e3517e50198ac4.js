(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var i=e.i(75555),r=e.i(40143),s=e.i(86491),a=e.i(15823),n=e.i(93803),o=e.i(19273),u=e.i(80166),l=class extends a.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#i=(0,n.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#r=void 0;#s=void 0;#a=void 0;#n;#o;#i;#t;#u;#l;#d;#c;#p;#h;#m=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#r.addObserver(this),d(this.#r,this.options)?this.#y():this.updateResult(),this.#f())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return c(this.#r,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return c(this.#r,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#g(),this.#R(),this.#r.removeObserver(this)}setOptions(e){let t=this.options,i=this.#r;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,o.resolveEnabled)(this.options.enabled,this.#r))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#v(),this.#r.setOptions(this.options),t._defaulted&&!(0,o.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#r,observer:this});let r=this.hasListeners();r&&p(this.#r,i,this.options,t)&&this.#y(),this.updateResult(),r&&(this.#r!==i||(0,o.resolveEnabled)(this.options.enabled,this.#r)!==(0,o.resolveEnabled)(t.enabled,this.#r)||(0,o.resolveStaleTime)(this.options.staleTime,this.#r)!==(0,o.resolveStaleTime)(t.staleTime,this.#r))&&this.#I();let s=this.#T();r&&(this.#r!==i||(0,o.resolveEnabled)(this.options.enabled,this.#r)!==(0,o.resolveEnabled)(t.enabled,this.#r)||s!==this.#h)&&this.#E(s)}getOptimisticResult(e){var t,i;let r=this.#e.getQueryCache().build(this.#e,e),s=this.createResult(r,e);return t=this,i=s,(0,o.shallowEqualObjects)(t.getCurrentResult(),i)||(this.#a=s,this.#o=this.options,this.#n=this.#r.state),s}getCurrentResult(){return this.#a}trackResult(e,t){return new Proxy(e,{get:(e,i)=>(this.trackProp(i),t?.(i),"promise"===i&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#i.status||this.#i.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,i))})}trackProp(e){this.#m.add(e)}getCurrentQuery(){return this.#r}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),i=this.#e.getQueryCache().build(this.#e,t);return i.fetch().then(()=>this.createResult(i,t))}fetch(e){return this.#y({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#a))}#y(e){this.#v();let t=this.#r.fetch(this.options,e);return e?.throwOnError||(t=t.catch(o.noop)),t}#I(){this.#g();let e=(0,o.resolveStaleTime)(this.options.staleTime,this.#r);if(o.isServer||this.#a.isStale||!(0,o.isValidTimeout)(e))return;let t=(0,o.timeUntilStale)(this.#a.dataUpdatedAt,e);this.#c=u.timeoutManager.setTimeout(()=>{this.#a.isStale||this.updateResult()},t+1)}#T(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#r):this.options.refetchInterval)??!1}#E(e){this.#R(),this.#h=e,!o.isServer&&!1!==(0,o.resolveEnabled)(this.options.enabled,this.#r)&&(0,o.isValidTimeout)(this.#h)&&0!==this.#h&&(this.#p=u.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||i.focusManager.isFocused())&&this.#y()},this.#h))}#f(){this.#I(),this.#E(this.#T())}#g(){this.#c&&(u.timeoutManager.clearTimeout(this.#c),this.#c=void 0)}#R(){this.#p&&(u.timeoutManager.clearInterval(this.#p),this.#p=void 0)}createResult(e,t){let i,r=this.#r,a=this.options,u=this.#a,l=this.#n,c=this.#o,m=e!==r?e.state:this.#s,{state:y}=e,f={...y},g=!1;if(t._optimisticResults){let i=this.hasListeners(),n=!i&&d(e,t),o=i&&p(e,r,t,a);(n||o)&&(f={...f,...(0,s.fetchState)(y.data,e.options)}),"isRestoring"===t._optimisticResults&&(f.fetchStatus="idle")}let{error:R,errorUpdatedAt:v,status:I}=f;i=f.data;let T=!1;if(void 0!==t.placeholderData&&void 0===i&&"pending"===I){let e;u?.isPlaceholderData&&t.placeholderData===c?.placeholderData?(e=u.data,T=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#d?.state.data,this.#d):t.placeholderData,void 0!==e&&(I="success",i=(0,o.replaceData)(u?.data,e,t),g=!0)}if(t.select&&void 0!==i&&!T)if(u&&i===l?.data&&t.select===this.#u)i=this.#l;else try{this.#u=t.select,i=t.select(i),i=(0,o.replaceData)(u?.data,i,t),this.#l=i,this.#t=null}catch(e){this.#t=e}this.#t&&(R=this.#t,i=this.#l,v=Date.now(),I="error");let E="fetching"===f.fetchStatus,A="pending"===I,U="error"===I,b=A&&E,_=void 0!==i,S={status:I,fetchStatus:f.fetchStatus,isPending:A,isSuccess:"success"===I,isError:U,isInitialLoading:b,isLoading:b,data:i,dataUpdatedAt:f.dataUpdatedAt,error:R,errorUpdatedAt:v,failureCount:f.fetchFailureCount,failureReason:f.fetchFailureReason,errorUpdateCount:f.errorUpdateCount,isFetched:f.dataUpdateCount>0||f.errorUpdateCount>0,isFetchedAfterMount:f.dataUpdateCount>m.dataUpdateCount||f.errorUpdateCount>m.errorUpdateCount,isFetching:E,isRefetching:E&&!A,isLoadingError:U&&!_,isPaused:"paused"===f.fetchStatus,isPlaceholderData:g,isRefetchError:U&&_,isStale:h(e,t),refetch:this.refetch,promise:this.#i,isEnabled:!1!==(0,o.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===S.status?e.reject(S.error):void 0!==S.data&&e.resolve(S.data)},i=()=>{t(this.#i=S.promise=(0,n.pendingThenable)())},s=this.#i;switch(s.status){case"pending":e.queryHash===r.queryHash&&t(s);break;case"fulfilled":("error"===S.status||S.data!==s.value)&&i();break;case"rejected":("error"!==S.status||S.error!==s.reason)&&i()}}return S}updateResult(){let e=this.#a,t=this.createResult(this.#r,this.options);if(this.#n=this.#r.state,this.#o=this.options,void 0!==this.#n.data&&(this.#d=this.#r),(0,o.shallowEqualObjects)(t,e))return;this.#a=t;let i=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,i="function"==typeof t?t():t;if("all"===i||!i&&!this.#m.size)return!0;let r=new Set(i??this.#m);return this.options.throwOnError&&r.add("error"),Object.keys(this.#a).some(t=>this.#a[t]!==e[t]&&r.has(t))};this.#A({listeners:i()})}#v(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#r)return;let t=this.#r;this.#r=e,this.#s=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#f()}#A(e){r.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#a)}),this.#e.getQueryCache().notify({query:this.#r,type:"observerResultsUpdated"})})}};function d(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&c(e,t,t.refetchOnMount)}function c(e,t,i){if(!1!==(0,o.resolveEnabled)(t.enabled,e)&&"static"!==(0,o.resolveStaleTime)(t.staleTime,e)){let r="function"==typeof i?i(e):i;return"always"===r||!1!==r&&h(e,t)}return!1}function p(e,t,i,r){return(e!==t||!1===(0,o.resolveEnabled)(r.enabled,e))&&(!i.suspense||"error"!==e.state.status)&&h(e,i)}function h(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,o.resolveStaleTime)(t.staleTime,e))}e.i(47167);var m=e.i(71645),y=e.i(12598);e.i(43476);var f=m.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),g=m.createContext(!1);g.Provider;var R=(e,t,i)=>t.fetchOptimistic(e).catch(()=>{i.clearReset()});function v(e,t){return function(e,t,i){let s=m.useContext(g),a=m.useContext(f),n=(0,y.useQueryClient)(i),u=n.defaultQueryOptions(e);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(u),u._optimisticResults=s?"isRestoring":"optimistic",u.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=u.staleTime;u.staleTime="function"==typeof t?(...i)=>e(t(...i)):e(t),"number"==typeof u.gcTime&&(u.gcTime=Math.max(u.gcTime,1e3))}(u.suspense||u.throwOnError||u.experimental_prefetchInRender)&&!a.isReset()&&(u.retryOnMount=!1),m.useEffect(()=>{a.clearReset()},[a]);let l=!n.getQueryCache().get(u.queryHash),[d]=m.useState(()=>new t(n,u)),c=d.getOptimisticResult(u),p=!s&&!1!==e.subscribed;if(m.useSyncExternalStore(m.useCallback(e=>{let t=p?d.subscribe(r.notifyManager.batchCalls(e)):o.noop;return d.updateResult(),t},[d,p]),()=>d.getCurrentResult(),()=>d.getCurrentResult()),m.useEffect(()=>{d.setOptions(u)},[u,d]),u?.suspense&&c.isPending)throw R(u,d,a);if((({result:e,errorResetBoundary:t,throwOnError:i,query:r,suspense:s})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(s&&void 0===e.data||(0,o.shouldThrowError)(i,[e.error,r])))({result:c,errorResetBoundary:a,throwOnError:u.throwOnError,query:n.getQueryCache().get(u.queryHash),suspense:u.suspense}))throw c.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(u,c),u.experimental_prefetchInRender&&!o.isServer&&c.isLoading&&c.isFetching&&!s){let e=l?R(u,d,a):n.getQueryCache().get(u.queryHash)?.promise;e?.catch(o.noop).finally(()=>{d.updateResult()})}return u.notifyOnChangeProps?c:d.trackResult(c)}(e,l,t)}e.s(["useQuery",()=>v],66027)},54616,e=>{"use strict";var t=e.i(71645),i=e.i(14272),r=e.i(40143),s=e.i(15823),a=e.i(19273),n=class extends s.Subscribable{#e;#a=void 0;#U;#b;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#_()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,a.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#U,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,a.hashKey)(t.mutationKey)!==(0,a.hashKey)(this.options.mutationKey)?this.reset():this.#U?.state.status==="pending"&&this.#U.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#U?.removeObserver(this)}onMutationUpdate(e){this.#_(),this.#A(e)}getCurrentResult(){return this.#a}reset(){this.#U?.removeObserver(this),this.#U=void 0,this.#_(),this.#A()}mutate(e,t){return this.#b=t,this.#U?.removeObserver(this),this.#U=this.#e.getMutationCache().build(this.#e,this.options),this.#U.addObserver(this),this.#U.execute(e)}#_(){let e=this.#U?.state??(0,i.getDefaultState)();this.#a={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#A(e){r.notifyManager.batch(()=>{if(this.#b&&this.hasListeners()){let t=this.#a.variables,i=this.#a.context,r={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#b.onSuccess?.(e.data,t,i,r),this.#b.onSettled?.(e.data,null,t,i,r)):e?.type==="error"&&(this.#b.onError?.(e.error,t,i,r),this.#b.onSettled?.(void 0,e.error,t,i,r))}this.listeners.forEach(e=>{e(this.#a)})})}},o=e.i(12598);function u(e,i){let s=(0,o.useQueryClient)(i),[u]=t.useState(()=>new n(s,e));t.useEffect(()=>{u.setOptions(e)},[u,e]);let l=t.useSyncExternalStore(t.useCallback(e=>u.subscribe(r.notifyManager.batchCalls(e)),[u]),()=>u.getCurrentResult(),()=>u.getCurrentResult()),d=t.useCallback((e,t)=>{u.mutate(e,t).catch(a.noop)},[u]);if(l.error&&(0,a.shouldThrowError)(u.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:d,mutateAsync:l.mutate}}e.s(["useMutation",()=>u],54616)},88417,e=>{"use strict";let t=`
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
`,i=`
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
`,r=`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      message
    }
  }
`,s=`
  mutation ResendVerification($input: ResendVerificationInput!) {
    resendVerification(input: $input) {
      message
    }
  }
`,a=`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      message
    }
  }
`,n=`
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
`,d=`
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
`,c=`
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
`,p=`
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
`,m=`
  query GetCategoryByName($name: String!) {
    categoryByName(name: $name) {
      id
      name
      iconUrl
      isActive
    }
  }
`,y=`
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
`,f=`
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
`,R=`
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
`,I=`
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
`,T=`
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
`,E=`
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
`,U=`
  mutation CreatePremiumCheckout($input: CreatePremiumCheckoutInput!) {
    createPremiumCheckoutSession(input: $input) {
      sessionId
      url
    }
  }
`,b=`
  mutation CancelPremium {
    cancelPremiumSubscription {
      message
    }
  }
`,_=`
  mutation ToggleAutoRenew($enabled: Boolean!) {
    togglePremiumAutoRenew(enabled: $enabled) {
      message
    }
  }
`,S=`
  query MySubscriptionStatus {
    mySubscriptionStatus {
      isPremium
      premiumStartDate
      premiumEndDate
      autoRenew
    }
  }
`,C=`
  mutation PayPremiumWithWallet {
    payPremiumWithWallet {
      message
    }
  }
`,O=`
  mutation RequestVideoUpload($input: RequestVideoUploadInput!) {
    requestVideoUpload(input: $input) {
      uploadUrl
      videoKey
      publicUrl
    }
  }
`,M=`
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
`,$=`
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
`,P=`
  mutation DeleteVideoAd($id: String!) {
    deleteVideoAd(id: $id)
  }
`,N=`
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
`,D=`
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
`,Q=`
  mutation WatchVideoAd($input: WatchVideoAdInput!) {
    watchVideoAd(input: $input) {
      success
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`,x=`
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      id
      displayName
      avatarUrl
      email
    }
  }
`,w=`
  mutation RequestAvatarUpload($fileName: String!) {
    requestAvatarUpload(fileName: $fileName) {
      uploadUrl
      publicUrl
    }
  }
`,L=`
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
`,k=`
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
`,q=`
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
`,V=`
  query MuralFeed($input: MuralFeedInput) {
    muralFeed(input: $input) {
      posts {
        ${q}
      }
      total
      page
      hasMore
    }
  }
`,G=`
  query MyMuralPosts($page: Int, $pageSize: Int) {
    myMuralPosts(page: $page, pageSize: $pageSize) {
      posts {
        ${q}
      }
      total
      page
      hasMore
    }
  }
`,Y=`
  query MuralPost($id: ID!) {
    muralPost(id: $id) {
      ${q}
    }
  }
`,F=`
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
`,W=`
  mutation CreateMuralPost($input: CreateMuralPostInput!) {
    createMuralPost(input: $input) {
      ${q}
    }
  }
`,B=`
  mutation DeleteMuralPost($id: ID!) {
    deleteMuralPost(id: $id)
  }
`,j=`
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
`,z=`
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
`,H=`
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
`;e.s(["CANCEL_PREMIUM_SUBSCRIPTION_MUTATION",0,b,"CITY_LEADERBOARD_QUERY",0,J,"COUPONS_QUERY",0,E,"CREATE_MURAL_COMMENT_MUTATION",0,z,"CREATE_MURAL_POST_MUTATION",0,W,"CREATE_PREMIUM_CHECKOUT_MUTATION",0,U,"CREATE_REVIEW_MUTATION",0,k,"CREATE_STORE_MUTATION",0,c,"CREATE_VIDEO_AD_MUTATION",0,M,"DELETE_MURAL_COMMENT_MUTATION",0,H,"DELETE_MURAL_POST_MUTATION",0,B,"DELETE_STORE_MUTATION",0,h,"DELETE_VIDEO_AD_MUTATION",0,P,"EXCHANGE_UNLOCK_MUTATION",0,T,"FORGOT_PASSWORD_MUTATION",0,a,"GENERATE_COUPON_MUTATION",0,R,"GET_ALL_STORES_QUERY",0,d,"GET_ALL_VIDEO_ADS_QUERY",0,N,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,f,"GET_CATEGORY_BY_NAME_QUERY",0,m,"GET_COUPON_REDEEM_DETAILS_QUERY",0,g,"GET_CURRENT_USER_QUERY",0,o,"GET_MURAL_FEED_QUERY",0,V,"GET_MURAL_POST_COMMENTS_QUERY",0,F,"GET_MURAL_POST_QUERY",0,Y,"GET_MY_LEVEL_QUERY",0,I,"GET_MY_MURAL_POSTS_QUERY",0,G,"GET_STORE_REVIEWS_QUERY",0,L,"GET_SUBCATEGORIES_BY_CATEGORY_QUERY",0,y,"GET_USER_BY_ID_QUERY",0,u,"GET_VIDEO_AD_PAIR_QUERY",0,D,"LIKE_MURAL_POST_MUTATION",0,j,"LOGIN_MUTATION",0,t,"MY_CHALLENGES_QUERY",0,X,"MY_POINTS_HISTORY_QUERY",0,Z,"MY_SUBSCRIPTION_STATUS_QUERY",0,S,"PAY_PREMIUM_WITH_WALLET_MUTATION",0,C,"QUICK_PAY_FOR_DISCOUNT_MUTATION",0,v,"REDEEM_COUPON_BY_STAFF_MUTATION",0,A,"REQUEST_AVATAR_UPLOAD_MUTATION",0,w,"REQUEST_VIDEO_UPLOAD_MUTATION",0,O,"RESEND_VERIFICATION_MUTATION",0,s,"RESET_PASSWORD_MUTATION",0,n,"SIGNUP_MUTATION",0,i,"TOGGLE_PREMIUM_AUTO_RENEW_MUTATION",0,_,"UNLIKE_MURAL_POST_MUTATION",0,K,"UPDATE_ME_MUTATION",0,x,"UPDATE_STORE_MUTATION",0,p,"UPDATE_USER_MUTATION",0,l,"UPDATE_VIDEO_AD_MUTATION",0,$,"VERIFY_EMAIL_MUTATION",0,r,"WATCH_VIDEO_AD_MUTATION",0,Q])},84534,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(31924);let s=i.forwardRef(({className:e,...i},s)=>(0,t.jsx)("div",{ref:s,className:(0,r.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...i}));s.displayName="Card",i.forwardRef(({className:e,...i},s)=>(0,t.jsx)("div",{ref:s,className:(0,r.cn)("flex flex-col space-y-1.5 p-6",e),...i})).displayName="CardHeader",i.forwardRef(({className:e,...i},s)=>(0,t.jsx)("h3",{ref:s,className:(0,r.cn)("text-2xl font-semibold leading-none tracking-tight",e),...i})).displayName="CardTitle",i.forwardRef(({className:e,...i},s)=>(0,t.jsx)("p",{ref:s,className:(0,r.cn)("text-sm text-muted-foreground",e),...i})).displayName="CardDescription";let a=i.forwardRef(({className:e,...i},s)=>(0,t.jsx)("div",{ref:s,className:(0,r.cn)("p-6 pt-0",e),...i}));a.displayName="CardContent",i.forwardRef(({className:e,...i},s)=>(0,t.jsx)("div",{ref:s,className:(0,r.cn)("flex items-center p-6 pt-0",e),...i})).displayName="CardFooter",e.s(["Card",()=>s,"CardContent",()=>a])},72214,e=>{"use strict";let t,i,r;var s=e.i(43476),a=e.i(71645),n=e.i(20783),o=Symbol.for("react.lazy"),u=a[" use ".trim().toString()];function l(e){var t;return null!=e&&"object"==typeof e&&"$$typeof"in e&&e.$$typeof===o&&"_payload"in e&&"object"==typeof(t=e._payload)&&null!==t&&"then"in t}var d=((r=a.forwardRef((e,t)=>{let{children:i,...r}=e;if(l(i)&&"function"==typeof u&&(i=u(i._payload)),a.isValidElement(i)){var s;let e,o,u=(s=i,(o=(e=Object.getOwnPropertyDescriptor(s.props,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?s.ref:(o=(e=Object.getOwnPropertyDescriptor(s,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?s.props.ref:s.props.ref||s.ref),l=function(e,t){let i={...t};for(let r in t){let s=e[r],a=t[r];/^on[A-Z]/.test(r)?s&&a?i[r]=(...e)=>{let t=a(...e);return s(...e),t}:s&&(i[r]=s):"style"===r?i[r]={...s,...a}:"className"===r&&(i[r]=[s,a].filter(Boolean).join(" "))}return{...e,...i}}(r,i.props);return i.type!==a.Fragment&&(l.ref=t?(0,n.composeRefs)(t,u):u),a.cloneElement(i,l)}return a.Children.count(i)>1?a.Children.only(null):null})).displayName="Slot.SlotClone",t=r,(i=a.forwardRef((e,i)=>{let{children:r,...n}=e;l(r)&&"function"==typeof u&&(r=u(r._payload));let o=a.Children.toArray(r),d=o.find(p);if(d){let e=d.props.children,r=o.map(t=>t!==d?t:a.Children.count(e)>1?a.Children.only(null):a.isValidElement(e)?e.props.children:null);return(0,s.jsx)(t,{...n,ref:i,children:a.isValidElement(e)?a.cloneElement(e,void 0,r):null})}return(0,s.jsx)(t,{...n,ref:i,children:r})})).displayName="Slot.Slot",i),c=Symbol("radix.slottable");function p(e){return a.isValidElement(e)&&"function"==typeof e.type&&"__radixId"in e.type&&e.type.__radixId===c}var h=e.i(25913),m=e.i(31924);let y=(0,h.cva)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),f=a.forwardRef(({className:e,variant:t,size:i,asChild:r=!1,...a},n)=>(0,s.jsx)(r?d:"button",{className:(0,m.cn)(y({variant:t,size:i,className:e})),ref:n,...a}));f.displayName="Button",e.s(["Button",()=>f],72214)}]);