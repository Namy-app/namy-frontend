(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var i=e.i(75555),r=e.i(40143),s=e.i(86491),a=e.i(15823),n=e.i(93803),o=e.i(19273),u=e.i(80166),l=class extends a.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#i=(0,n.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#r=void 0;#s=void 0;#a=void 0;#n;#o;#i;#t;#u;#l;#d;#c;#p;#h;#m=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#r.addObserver(this),d(this.#r,this.options)?this.#y():this.updateResult(),this.#g())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return c(this.#r,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return c(this.#r,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#v(),this.#f(),this.#r.removeObserver(this)}setOptions(e){let t=this.options,i=this.#r;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,o.resolveEnabled)(this.options.enabled,this.#r))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#b(),this.#r.setOptions(this.options),t._defaulted&&!(0,o.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#r,observer:this});let r=this.hasListeners();r&&p(this.#r,i,this.options,t)&&this.#y(),this.updateResult(),r&&(this.#r!==i||(0,o.resolveEnabled)(this.options.enabled,this.#r)!==(0,o.resolveEnabled)(t.enabled,this.#r)||(0,o.resolveStaleTime)(this.options.staleTime,this.#r)!==(0,o.resolveStaleTime)(t.staleTime,this.#r))&&this.#T();let s=this.#E();r&&(this.#r!==i||(0,o.resolveEnabled)(this.options.enabled,this.#r)!==(0,o.resolveEnabled)(t.enabled,this.#r)||s!==this.#h)&&this.#x(s)}getOptimisticResult(e){var t,i;let r=this.#e.getQueryCache().build(this.#e,e),s=this.createResult(r,e);return t=this,i=s,(0,o.shallowEqualObjects)(t.getCurrentResult(),i)||(this.#a=s,this.#o=this.options,this.#n=this.#r.state),s}getCurrentResult(){return this.#a}trackResult(e,t){return new Proxy(e,{get:(e,i)=>(this.trackProp(i),t?.(i),"promise"===i&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#i.status||this.#i.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,i))})}trackProp(e){this.#m.add(e)}getCurrentQuery(){return this.#r}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),i=this.#e.getQueryCache().build(this.#e,t);return i.fetch().then(()=>this.createResult(i,t))}fetch(e){return this.#y({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#a))}#y(e){this.#b();let t=this.#r.fetch(this.options,e);return e?.throwOnError||(t=t.catch(o.noop)),t}#T(){this.#v();let e=(0,o.resolveStaleTime)(this.options.staleTime,this.#r);if(o.isServer||this.#a.isStale||!(0,o.isValidTimeout)(e))return;let t=(0,o.timeUntilStale)(this.#a.dataUpdatedAt,e);this.#c=u.timeoutManager.setTimeout(()=>{this.#a.isStale||this.updateResult()},t+1)}#E(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#r):this.options.refetchInterval)??!1}#x(e){this.#f(),this.#h=e,!o.isServer&&!1!==(0,o.resolveEnabled)(this.options.enabled,this.#r)&&(0,o.isValidTimeout)(this.#h)&&0!==this.#h&&(this.#p=u.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||i.focusManager.isFocused())&&this.#y()},this.#h))}#g(){this.#T(),this.#x(this.#E())}#v(){this.#c&&(u.timeoutManager.clearTimeout(this.#c),this.#c=void 0)}#f(){this.#p&&(u.timeoutManager.clearInterval(this.#p),this.#p=void 0)}createResult(e,t){let i,r=this.#r,a=this.options,u=this.#a,l=this.#n,c=this.#o,m=e!==r?e.state:this.#s,{state:y}=e,g={...y},v=!1;if(t._optimisticResults){let i=this.hasListeners(),n=!i&&d(e,t),o=i&&p(e,r,t,a);(n||o)&&(g={...g,...(0,s.fetchState)(y.data,e.options)}),"isRestoring"===t._optimisticResults&&(g.fetchStatus="idle")}let{error:f,errorUpdatedAt:b,status:T}=g;i=g.data;let E=!1;if(void 0!==t.placeholderData&&void 0===i&&"pending"===T){let e;u?.isPlaceholderData&&t.placeholderData===c?.placeholderData?(e=u.data,E=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#d?.state.data,this.#d):t.placeholderData,void 0!==e&&(T="success",i=(0,o.replaceData)(u?.data,e,t),v=!0)}if(t.select&&void 0!==i&&!E)if(u&&i===l?.data&&t.select===this.#u)i=this.#l;else try{this.#u=t.select,i=t.select(i),i=(0,o.replaceData)(u?.data,i,t),this.#l=i,this.#t=null}catch(e){this.#t=e}this.#t&&(f=this.#t,i=this.#l,b=Date.now(),T="error");let x="fetching"===g.fetchStatus,A="pending"===T,I="error"===T,R=A&&x,U=void 0!==i,S={status:T,fetchStatus:g.fetchStatus,isPending:A,isSuccess:"success"===T,isError:I,isInitialLoading:R,isLoading:R,data:i,dataUpdatedAt:g.dataUpdatedAt,error:f,errorUpdatedAt:b,failureCount:g.fetchFailureCount,failureReason:g.fetchFailureReason,errorUpdateCount:g.errorUpdateCount,isFetched:g.dataUpdateCount>0||g.errorUpdateCount>0,isFetchedAfterMount:g.dataUpdateCount>m.dataUpdateCount||g.errorUpdateCount>m.errorUpdateCount,isFetching:x,isRefetching:x&&!A,isLoadingError:I&&!U,isPaused:"paused"===g.fetchStatus,isPlaceholderData:v,isRefetchError:I&&U,isStale:h(e,t),refetch:this.refetch,promise:this.#i,isEnabled:!1!==(0,o.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===S.status?e.reject(S.error):void 0!==S.data&&e.resolve(S.data)},i=()=>{t(this.#i=S.promise=(0,n.pendingThenable)())},s=this.#i;switch(s.status){case"pending":e.queryHash===r.queryHash&&t(s);break;case"fulfilled":("error"===S.status||S.data!==s.value)&&i();break;case"rejected":("error"!==S.status||S.error!==s.reason)&&i()}}return S}updateResult(){let e=this.#a,t=this.createResult(this.#r,this.options);if(this.#n=this.#r.state,this.#o=this.options,void 0!==this.#n.data&&(this.#d=this.#r),(0,o.shallowEqualObjects)(t,e))return;this.#a=t;let i=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,i="function"==typeof t?t():t;if("all"===i||!i&&!this.#m.size)return!0;let r=new Set(i??this.#m);return this.options.throwOnError&&r.add("error"),Object.keys(this.#a).some(t=>this.#a[t]!==e[t]&&r.has(t))};this.#A({listeners:i()})}#b(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#r)return;let t=this.#r;this.#r=e,this.#s=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#g()}#A(e){r.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#a)}),this.#e.getQueryCache().notify({query:this.#r,type:"observerResultsUpdated"})})}};function d(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&c(e,t,t.refetchOnMount)}function c(e,t,i){if(!1!==(0,o.resolveEnabled)(t.enabled,e)&&"static"!==(0,o.resolveStaleTime)(t.staleTime,e)){let r="function"==typeof i?i(e):i;return"always"===r||!1!==r&&h(e,t)}return!1}function p(e,t,i,r){return(e!==t||!1===(0,o.resolveEnabled)(r.enabled,e))&&(!i.suspense||"error"!==e.state.status)&&h(e,i)}function h(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,o.resolveStaleTime)(t.staleTime,e))}e.i(47167);var m=e.i(71645),y=e.i(12598);e.i(43476);var g=m.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),v=m.createContext(!1);v.Provider;var f=(e,t,i)=>t.fetchOptimistic(e).catch(()=>{i.clearReset()});function b(e,t){return function(e,t,i){let s=m.useContext(v),a=m.useContext(g),n=(0,y.useQueryClient)(i),u=n.defaultQueryOptions(e);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(u),u._optimisticResults=s?"isRestoring":"optimistic",u.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=u.staleTime;u.staleTime="function"==typeof t?(...i)=>e(t(...i)):e(t),"number"==typeof u.gcTime&&(u.gcTime=Math.max(u.gcTime,1e3))}(u.suspense||u.throwOnError||u.experimental_prefetchInRender)&&!a.isReset()&&(u.retryOnMount=!1),m.useEffect(()=>{a.clearReset()},[a]);let l=!n.getQueryCache().get(u.queryHash),[d]=m.useState(()=>new t(n,u)),c=d.getOptimisticResult(u),p=!s&&!1!==e.subscribed;if(m.useSyncExternalStore(m.useCallback(e=>{let t=p?d.subscribe(r.notifyManager.batchCalls(e)):o.noop;return d.updateResult(),t},[d,p]),()=>d.getCurrentResult(),()=>d.getCurrentResult()),m.useEffect(()=>{d.setOptions(u)},[u,d]),u?.suspense&&c.isPending)throw f(u,d,a);if((({result:e,errorResetBoundary:t,throwOnError:i,query:r,suspense:s})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(s&&void 0===e.data||(0,o.shouldThrowError)(i,[e.error,r])))({result:c,errorResetBoundary:a,throwOnError:u.throwOnError,query:n.getQueryCache().get(u.queryHash),suspense:u.suspense}))throw c.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(u,c),u.experimental_prefetchInRender&&!o.isServer&&c.isLoading&&c.isFetching&&!s){let e=l?f(u,d,a):n.getQueryCache().get(u.queryHash)?.promise;e?.catch(o.noop).finally(()=>{d.updateResult()})}return u.notifyOnChangeProps?c:d.trackResult(c)}(e,l,t)}e.s(["useQuery",()=>b],66027)},54616,e=>{"use strict";var t=e.i(71645),i=e.i(14272),r=e.i(40143),s=e.i(15823),a=e.i(19273),n=class extends s.Subscribable{#e;#a=void 0;#I;#R;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#U()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,a.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#I,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,a.hashKey)(t.mutationKey)!==(0,a.hashKey)(this.options.mutationKey)?this.reset():this.#I?.state.status==="pending"&&this.#I.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#I?.removeObserver(this)}onMutationUpdate(e){this.#U(),this.#A(e)}getCurrentResult(){return this.#a}reset(){this.#I?.removeObserver(this),this.#I=void 0,this.#U(),this.#A()}mutate(e,t){return this.#R=t,this.#I?.removeObserver(this),this.#I=this.#e.getMutationCache().build(this.#e,this.options),this.#I.addObserver(this),this.#I.execute(e)}#U(){let e=this.#I?.state??(0,i.getDefaultState)();this.#a={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#A(e){r.notifyManager.batch(()=>{if(this.#R&&this.hasListeners()){let t=this.#a.variables,i=this.#a.context,r={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#R.onSuccess?.(e.data,t,i,r),this.#R.onSettled?.(e.data,null,t,i,r)):e?.type==="error"&&(this.#R.onError?.(e.error,t,i,r),this.#R.onSettled?.(void 0,e.error,t,i,r))}this.listeners.forEach(e=>{e(this.#a)})})}},o=e.i(12598);function u(e,i){let s=(0,o.useQueryClient)(i),[u]=t.useState(()=>new n(s,e));t.useEffect(()=>{u.setOptions(e)},[u,e]);let l=t.useSyncExternalStore(t.useCallback(e=>u.subscribe(r.notifyManager.batchCalls(e)),[u]),()=>u.getCurrentResult(),()=>u.getCurrentResult()),d=t.useCallback((e,t)=>{u.mutate(e,t).catch(a.noop)},[u]);if(l.error&&(0,a.shouldThrowError)(u.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:d,mutateAsync:l.mutate}}e.s(["useMutation",()=>u],54616)},88417,e=>{"use strict";let t=`
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
`,g=`
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
`,v=`
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
`,f=`
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
`,T=`
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
`,x=`
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
`,R=`
  mutation CancelPremium {
    cancelPremiumSubscription {
      message
    }
  }
`,U=`
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
`,_=`
  mutation PayPremiumWithWallet {
    payPremiumWithWallet {
      message
    }
  }
`,C=`
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
`,N=`
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
`,$=`
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
`,D=`
  mutation WatchVideoAd($input: WatchVideoAdInput!) {
    watchVideoAd(input: $input) {
      success
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`,w=`
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
`,Q=`
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
`,V=`
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
`,k=`
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
`,q=`
  query MuralFeed($input: MuralFeedInput) {
    muralFeed(input: $input) {
      posts {
        ${k}
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
        ${k}
      }
      total
      page
      hasMore
    }
  }
`,F=`
  query MuralPost($id: ID!) {
    muralPost(id: $id) {
      ${k}
    }
  }
`,G=`
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
`,Y=`
  mutation CreateMuralPost($input: CreateMuralPostInput!) {
    createMuralPost(input: $input) {
      ${k}
    }
  }
`,K=`
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
`,B=`
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
`,J=`
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
`,Z=`
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
`;e.s(["CANCEL_PREMIUM_SUBSCRIPTION_MUTATION",0,R,"CITY_LEADERBOARD_QUERY",0,Z,"COUPONS_QUERY",0,x,"CREATE_MURAL_COMMENT_MUTATION",0,z,"CREATE_MURAL_POST_MUTATION",0,Y,"CREATE_PREMIUM_CHECKOUT_MUTATION",0,I,"CREATE_REVIEW_MUTATION",0,V,"CREATE_STORE_MUTATION",0,c,"CREATE_VIDEO_AD_MUTATION",0,M,"DELETE_MURAL_COMMENT_MUTATION",0,H,"DELETE_MURAL_POST_MUTATION",0,K,"DELETE_STORE_MUTATION",0,h,"DELETE_VIDEO_AD_MUTATION",0,O,"EXCHANGE_UNLOCK_MUTATION",0,E,"FORGOT_PASSWORD_MUTATION",0,a,"GENERATE_COUPON_MUTATION",0,f,"GET_ALL_STORES_QUERY",0,d,"GET_ALL_VIDEO_ADS_QUERY",0,$,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,g,"GET_CATEGORY_BY_NAME_QUERY",0,m,"GET_COUPON_REDEEM_DETAILS_QUERY",0,v,"GET_CURRENT_USER_QUERY",0,o,"GET_MURAL_FEED_QUERY",0,q,"GET_MURAL_POST_COMMENTS_QUERY",0,G,"GET_MURAL_POST_QUERY",0,F,"GET_MY_LEVEL_QUERY",0,T,"GET_MY_MURAL_POSTS_QUERY",0,L,"GET_STORE_REVIEWS_QUERY",0,Q,"GET_SUBCATEGORIES_BY_CATEGORY_QUERY",0,y,"GET_USER_BY_ID_QUERY",0,u,"GET_VIDEO_AD_PAIR_QUERY",0,P,"LIKE_MURAL_POST_MUTATION",0,W,"LOGIN_MUTATION",0,t,"MY_CHALLENGES_QUERY",0,X,"MY_POINTS_HISTORY_QUERY",0,J,"MY_SUBSCRIPTION_STATUS_QUERY",0,S,"PAY_PREMIUM_WITH_WALLET_MUTATION",0,_,"QUICK_PAY_FOR_DISCOUNT_MUTATION",0,b,"REDEEM_COUPON_BY_STAFF_MUTATION",0,A,"REQUEST_AVATAR_UPLOAD_MUTATION",0,j,"REQUEST_VIDEO_UPLOAD_MUTATION",0,C,"RESEND_VERIFICATION_MUTATION",0,s,"RESET_PASSWORD_MUTATION",0,n,"SIGNUP_MUTATION",0,i,"TOGGLE_PREMIUM_AUTO_RENEW_MUTATION",0,U,"UNLIKE_MURAL_POST_MUTATION",0,B,"UPDATE_ME_MUTATION",0,w,"UPDATE_STORE_MUTATION",0,p,"UPDATE_USER_MUTATION",0,l,"UPDATE_VIDEO_AD_MUTATION",0,N,"VERIFY_EMAIL_MUTATION",0,r,"WATCH_VIDEO_AD_MUTATION",0,D])},27612,e=>{"use strict";let t=(0,e.i(75254).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",()=>t],27612)},43531,e=>{"use strict";let t=(0,e.i(75254).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",()=>t],43531)},48063,e=>{"use strict";var t=e.i(54616),i=e.i(66027),r=e.i(12598),s=e.i(97903),a=e.i(88417);function n(e){return(0,i.useQuery)({queryKey:["video-ad-pair",e],queryFn:async()=>(await s.graphqlClient.request(a.GET_VIDEO_AD_PAIR_QUERY,{deviceId:e})).getVideoAdPair,staleTime:0,gcTime:0})}function o(){return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.WATCH_VIDEO_AD_MUTATION,{input:e})).watchVideoAd})}function u(){return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.REQUEST_VIDEO_UPLOAD_MUTATION,{input:e})).requestVideoUpload})}function l(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.CREATE_VIDEO_AD_MUTATION,{input:e})).createVideoAd,onSuccess:()=>{e.invalidateQueries({queryKey:["video-ads"]})}})}function d(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.UPDATE_VIDEO_AD_MUTATION,{input:e})).updateVideoAd,onSuccess:()=>{e.invalidateQueries({queryKey:["video-ads"]})}})}function c(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.DELETE_VIDEO_AD_MUTATION,{id:e})).deleteVideoAd,onSuccess:()=>{e.invalidateQueries({queryKey:["video-ads"]})}})}function p(){return(0,i.useQuery)({queryKey:["video-ads","all"],queryFn:async()=>(await s.graphqlClient.request(a.GET_ALL_VIDEO_ADS_QUERY)).getAllVideoAds})}e.s(["useCreateVideoAd",()=>l,"useDeleteVideoAd",()=>c,"useGetAllVideoAds",()=>p,"useGetVideoAdPair",()=>n,"useRequestVideoUpload",()=>u,"useUpdateVideoAd",()=>d,"useWatchVideoAd",()=>o])},69074,e=>{"use strict";let t=(0,e.i(75254).default)("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]);e.s(["Upload",()=>t],69074)},61165,e=>{"use strict";var t=e.i(43476),i=e.i(69074),r=e.i(78716),s=e.i(27612);let a=(0,e.i(75254).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);var n=e.i(37727),o=e.i(43531),u=e.i(71645),l=e.i(48063),d=e.i(74911),c=e.i(31924);function p(){let{toast:e}=(0,d.useToast)(),[p,h]=(0,u.useState)(!1),[m,y]=(0,u.useState)(null),[g,v]=(0,u.useState)(0),[f,b]=(0,u.useState)(!1),[T,E]=(0,u.useState)(null),[x,A]=(0,u.useState)(null),[I,R]=(0,u.useState)(0),[U,S]=(0,u.useState)({title:"",description:"",priority:1}),{data:_,isLoading:C}=(0,l.useGetAllVideoAds)(),M=(0,l.useRequestVideoUpload)(),N=(0,l.useCreateVideoAd)(),O=(0,l.useUpdateVideoAd)(),$=(0,l.useDeleteVideoAd)(),P=async()=>{if(!T||!U.title||0===I)return void e({title:"Error",description:"Please fill all required fields and select a video",variant:"destructive"});try{b(!0),v(10);let t=await M.mutateAsync({fileName:T.name,fileSize:T.size,mimeType:T.type});if(v(20),!(await fetch(t.uploadUrl,{method:"PUT",body:T,headers:{"Content-Type":T.type}})).ok)throw Error("Failed to upload video to S3");v(70);let i={videoKey:t.videoKey,title:U.title,description:U.description||void 0,duration:I,fileSize:T.size,mimeType:T.type,priority:U.priority};await N.mutateAsync(i),v(100),e({title:"Success",description:"Video ad created successfully"}),h(!1),E(null),A(null),S({title:"",description:"",priority:1}),R(0)}catch(t){e({title:"Error",description:(0,c.extractErrorMessage)(t),variant:"destructive"})}finally{b(!1),v(0)}},D=async()=>{if(m)try{await O.mutateAsync({id:m.id,title:U.title,description:U.description||void 0,priority:U.priority}),e({title:"Success",description:"Video ad updated successfully"}),y(null),S({title:"",description:"",priority:1})}catch(t){e({title:"Error",description:(0,c.extractErrorMessage)(t),variant:"destructive"})}},w=async t=>{if(confirm("Are you sure you want to delete this video ad?"))try{await $.mutateAsync(t),e({title:"Success",description:"Video ad deleted successfully"})}catch(t){e({title:"Error",description:(0,c.extractErrorMessage)(t),variant:"destructive"})}},j=async t=>{try{await O.mutateAsync({id:t.id,active:!t.active}),e({title:"Success",description:`Video ad ${t.active?"deactivated":"activated"} successfully`})}catch(t){e({title:"Error",description:(0,c.extractErrorMessage)(t),variant:"destructive"})}},Q=e=>e<1024?e+" B":e<1048576?(e/1024).toFixed(2)+" KB":(e/1048576).toFixed(2)+" MB",V=e=>{let t=Math.floor(e/60);return`${t}:${(e%60).toString().padStart(2,"0")}`};return(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,t.jsxs)("div",{className:"mb-8",children:[(0,t.jsx)("h1",{className:"text-4xl font-bold text-foreground mb-2",children:"Video Ads Management"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Upload and manage video advertisements for the platform"})]}),p?(0,t.jsxs)("div",{className:"bg-card rounded-lg shadow-lg p-6 mb-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-foreground",children:m?"Edit Video Ad":"Upload New Video Ad"}),(0,t.jsx)("button",{onClick:()=>{h(!1),y(null),E(null),A(null),S({title:"",description:"",priority:1})},className:"p-2 hover:bg-muted rounded-lg transition-colors",children:(0,t.jsx)(n.X,{className:"w-5 h-5"})})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[!m&&(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-foreground mb-2",children:"Video File *"}),(0,t.jsx)("div",{className:"border-2 border-dashed border-border rounded-lg p-8 text-center",children:x?(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)("video",{src:x,controls:!0,className:"max-h-64 mx-auto rounded-lg"}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:[T?.name," (",Q(T?.size||0),")"]}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Duration: ",V(I)]}),(0,t.jsx)("button",{onClick:()=>{E(null),A(null),R(0)},className:"text-sm text-destructive hover:underline",children:"Remove"})]}):(0,t.jsxs)("label",{className:"cursor-pointer",children:[(0,t.jsx)(i.Upload,{className:"w-12 h-12 mx-auto text-muted-foreground mb-4"}),(0,t.jsx)("p",{className:"text-sm text-foreground mb-2",children:"Click to upload or drag and drop"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"MP4, WebM, or MOV (max 100MB)"}),(0,t.jsx)("input",{type:"file",accept:"video/*",onChange:t=>{let i=t.target.files?.[0];if(!i)return;if(!i.type.startsWith("video/"))return void e({title:"Error",description:"Please select a valid video file",variant:"destructive"});if(i.size>0x1400000)return void e({title:"Error",description:"File size must be less than 20MB",variant:"destructive"});E(i);let r=URL.createObjectURL(i);A(r);let s=document.createElement("video");s.preload="metadata",s.onloadedmetadata=()=>{R(Math.floor(s.duration)),URL.revokeObjectURL(s.src)},s.src=r},className:"hidden"})]})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-foreground mb-2",children:"Title *"}),(0,t.jsx)("input",{type:"text",value:U.title,onChange:e=>S({...U,title:e.target.value}),placeholder:"Enter video ad title",className:"w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-foreground mb-2",children:"Description"}),(0,t.jsx)("textarea",{value:U.description,onChange:e=>S({...U,description:e.target.value}),placeholder:"Enter video ad description (optional)",rows:3,className:"w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-foreground mb-2",children:"Priority"}),(0,t.jsx)("input",{type:"number",value:U.priority,onChange:e=>S({...U,priority:parseInt(e.target.value)||1}),min:1,max:10,className:"w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:"Higher priority ads are shown more frequently (1-10)"})]}),f?(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"w-full bg-muted rounded-full h-2 mb-2",children:(0,t.jsx)("div",{className:"bg-primary h-2 rounded-full transition-all",style:{width:`${g}%`}})}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground text-center",children:["Uploading... ",g,"%"]})]}):null,(0,t.jsx)("button",{onClick:()=>void(m?D():P()),disabled:f||!m&&!T,className:"w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:f?"Uploading...":m?"Update Video Ad":"Upload & Create Video Ad"})]})]}):null,!p&&(0,t.jsxs)("button",{onClick:()=>h(!0),className:"mb-6 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold flex items-center gap-2 transition-colors",children:[(0,t.jsx)(i.Upload,{className:"w-5 h-5"}),"Upload New Video Ad"]}),(0,t.jsxs)("div",{className:"bg-card rounded-lg shadow-lg p-6",children:[(0,t.jsxs)("h2",{className:"text-2xl font-bold text-foreground mb-6",children:["Video Ads (",_?.length||0,")"]}),C?(0,t.jsx)("div",{className:"flex items-center justify-center py-12",children:(0,t.jsx)("div",{className:"inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"})}):_&&_.length>0?(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:_.map(e=>(0,t.jsxs)("div",{className:"border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow",children:[(0,t.jsxs)("div",{className:"relative bg-black aspect-video",children:[(0,t.jsx)("video",{src:e.videoUrl,className:"w-full h-full object-contain",controls:!0}),(0,t.jsx)("div",{className:"absolute top-2 right-2 flex gap-2",children:(0,t.jsx)("span",{className:`px-2 py-1 text-xs font-semibold rounded ${e.active?"bg-green-500 text-white":"bg-gray-500 text-white"}`,children:e.active?"Active":"Inactive"})})]}),(0,t.jsxs)("div",{className:"p-4 space-y-3",children:[(0,t.jsx)("h3",{className:"font-bold text-foreground text-lg line-clamp-1",children:e.title}),e.description?(0,t.jsx)("p",{className:"text-sm text-muted-foreground line-clamp-2",children:e.description}):null,(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2 text-xs text-muted-foreground",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-semibold",children:"Duration"}),(0,t.jsx)("p",{children:V(e.duration)})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-semibold",children:"Size"}),(0,t.jsx)("p",{children:Q(e.fileSize)})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-semibold",children:"Views"}),(0,t.jsx)("p",{children:e.watchCount})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-semibold",children:"Priority"}),(0,t.jsx)("p",{children:e.priority})]})]}),(0,t.jsxs)("div",{className:"flex gap-2 pt-2",children:[(0,t.jsx)("button",{onClick:()=>void j(e),className:"flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors",children:e.active?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.X,{className:"w-4 h-4"}),"Deactivate"]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Check,{className:"w-4 h-4"}),"Activate"]})}),(0,t.jsx)("button",{onClick:()=>{y(e),S({title:e.title,description:e.description||"",priority:e.priority}),h(!0)},className:"px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors",children:(0,t.jsx)(a,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:()=>void w(e.id),className:"px-3 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors",children:(0,t.jsx)(s.Trash2,{className:"w-4 h-4"})})]})]})]},e.id))}):(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)(r.Video,{className:"w-16 h-16 mx-auto text-muted-foreground mb-4"}),(0,t.jsx)("p",{className:"text-muted-foreground mb-4",children:"No video ads yet. Upload your first video ad to get started."})]})]})]})}e.s(["default",()=>p],61165)}]);