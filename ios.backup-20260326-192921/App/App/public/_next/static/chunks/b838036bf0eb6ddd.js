(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var i=e.i(75555),r=e.i(40143),s=e.i(86491),a=e.i(15823),n=e.i(93803),u=e.i(19273),o=e.i(80166),l=class extends a.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#i=(0,n.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#r=void 0;#s=void 0;#a=void 0;#n;#u;#i;#t;#o;#l;#d;#c;#h;#p;#m=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#r.addObserver(this),d(this.#r,this.options)?this.#y():this.updateResult(),this.#g())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return c(this.#r,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return c(this.#r,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#f(),this.#v(),this.#r.removeObserver(this)}setOptions(e){let t=this.options,i=this.#r;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,u.resolveEnabled)(this.options.enabled,this.#r))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#b(),this.#r.setOptions(this.options),t._defaulted&&!(0,u.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#r,observer:this});let r=this.hasListeners();r&&h(this.#r,i,this.options,t)&&this.#y(),this.updateResult(),r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||(0,u.resolveStaleTime)(this.options.staleTime,this.#r)!==(0,u.resolveStaleTime)(t.staleTime,this.#r))&&this.#T();let s=this.#E();r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||s!==this.#p)&&this.#I(s)}getOptimisticResult(e){var t,i;let r=this.#e.getQueryCache().build(this.#e,e),s=this.createResult(r,e);return t=this,i=s,(0,u.shallowEqualObjects)(t.getCurrentResult(),i)||(this.#a=s,this.#u=this.options,this.#n=this.#r.state),s}getCurrentResult(){return this.#a}trackResult(e,t){return new Proxy(e,{get:(e,i)=>(this.trackProp(i),t?.(i),"promise"===i&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#i.status||this.#i.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,i))})}trackProp(e){this.#m.add(e)}getCurrentQuery(){return this.#r}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),i=this.#e.getQueryCache().build(this.#e,t);return i.fetch().then(()=>this.createResult(i,t))}fetch(e){return this.#y({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#a))}#y(e){this.#b();let t=this.#r.fetch(this.options,e);return e?.throwOnError||(t=t.catch(u.noop)),t}#T(){this.#f();let e=(0,u.resolveStaleTime)(this.options.staleTime,this.#r);if(u.isServer||this.#a.isStale||!(0,u.isValidTimeout)(e))return;let t=(0,u.timeUntilStale)(this.#a.dataUpdatedAt,e);this.#c=o.timeoutManager.setTimeout(()=>{this.#a.isStale||this.updateResult()},t+1)}#E(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#r):this.options.refetchInterval)??!1}#I(e){this.#v(),this.#p=e,!u.isServer&&!1!==(0,u.resolveEnabled)(this.options.enabled,this.#r)&&(0,u.isValidTimeout)(this.#p)&&0!==this.#p&&(this.#h=o.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||i.focusManager.isFocused())&&this.#y()},this.#p))}#g(){this.#T(),this.#I(this.#E())}#f(){this.#c&&(o.timeoutManager.clearTimeout(this.#c),this.#c=void 0)}#v(){this.#h&&(o.timeoutManager.clearInterval(this.#h),this.#h=void 0)}createResult(e,t){let i,r=this.#r,a=this.options,o=this.#a,l=this.#n,c=this.#u,m=e!==r?e.state:this.#s,{state:y}=e,g={...y},f=!1;if(t._optimisticResults){let i=this.hasListeners(),n=!i&&d(e,t),u=i&&h(e,r,t,a);(n||u)&&(g={...g,...(0,s.fetchState)(y.data,e.options)}),"isRestoring"===t._optimisticResults&&(g.fetchStatus="idle")}let{error:v,errorUpdatedAt:b,status:T}=g;i=g.data;let E=!1;if(void 0!==t.placeholderData&&void 0===i&&"pending"===T){let e;o?.isPlaceholderData&&t.placeholderData===c?.placeholderData?(e=o.data,E=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#d?.state.data,this.#d):t.placeholderData,void 0!==e&&(T="success",i=(0,u.replaceData)(o?.data,e,t),f=!0)}if(t.select&&void 0!==i&&!E)if(o&&i===l?.data&&t.select===this.#o)i=this.#l;else try{this.#o=t.select,i=t.select(i),i=(0,u.replaceData)(o?.data,i,t),this.#l=i,this.#t=null}catch(e){this.#t=e}this.#t&&(v=this.#t,i=this.#l,b=Date.now(),T="error");let I="fetching"===g.fetchStatus,x="pending"===T,R="error"===T,A=x&&I,U=void 0!==i,_={status:T,fetchStatus:g.fetchStatus,isPending:x,isSuccess:"success"===T,isError:R,isInitialLoading:A,isLoading:A,data:i,dataUpdatedAt:g.dataUpdatedAt,error:v,errorUpdatedAt:b,failureCount:g.fetchFailureCount,failureReason:g.fetchFailureReason,errorUpdateCount:g.errorUpdateCount,isFetched:g.dataUpdateCount>0||g.errorUpdateCount>0,isFetchedAfterMount:g.dataUpdateCount>m.dataUpdateCount||g.errorUpdateCount>m.errorUpdateCount,isFetching:I,isRefetching:I&&!x,isLoadingError:R&&!U,isPaused:"paused"===g.fetchStatus,isPlaceholderData:f,isRefetchError:R&&U,isStale:p(e,t),refetch:this.refetch,promise:this.#i,isEnabled:!1!==(0,u.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===_.status?e.reject(_.error):void 0!==_.data&&e.resolve(_.data)},i=()=>{t(this.#i=_.promise=(0,n.pendingThenable)())},s=this.#i;switch(s.status){case"pending":e.queryHash===r.queryHash&&t(s);break;case"fulfilled":("error"===_.status||_.data!==s.value)&&i();break;case"rejected":("error"!==_.status||_.error!==s.reason)&&i()}}return _}updateResult(){let e=this.#a,t=this.createResult(this.#r,this.options);if(this.#n=this.#r.state,this.#u=this.options,void 0!==this.#n.data&&(this.#d=this.#r),(0,u.shallowEqualObjects)(t,e))return;this.#a=t;let i=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,i="function"==typeof t?t():t;if("all"===i||!i&&!this.#m.size)return!0;let r=new Set(i??this.#m);return this.options.throwOnError&&r.add("error"),Object.keys(this.#a).some(t=>this.#a[t]!==e[t]&&r.has(t))};this.#x({listeners:i()})}#b(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#r)return;let t=this.#r;this.#r=e,this.#s=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#g()}#x(e){r.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#a)}),this.#e.getQueryCache().notify({query:this.#r,type:"observerResultsUpdated"})})}};function d(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&c(e,t,t.refetchOnMount)}function c(e,t,i){if(!1!==(0,u.resolveEnabled)(t.enabled,e)&&"static"!==(0,u.resolveStaleTime)(t.staleTime,e)){let r="function"==typeof i?i(e):i;return"always"===r||!1!==r&&p(e,t)}return!1}function h(e,t,i,r){return(e!==t||!1===(0,u.resolveEnabled)(r.enabled,e))&&(!i.suspense||"error"!==e.state.status)&&p(e,i)}function p(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,u.resolveStaleTime)(t.staleTime,e))}e.i(47167);var m=e.i(71645),y=e.i(12598);e.i(43476);var g=m.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),f=m.createContext(!1);f.Provider;var v=(e,t,i)=>t.fetchOptimistic(e).catch(()=>{i.clearReset()});function b(e,t){return function(e,t,i){let s=m.useContext(f),a=m.useContext(g),n=(0,y.useQueryClient)(i),o=n.defaultQueryOptions(e);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(o),o._optimisticResults=s?"isRestoring":"optimistic",o.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=o.staleTime;o.staleTime="function"==typeof t?(...i)=>e(t(...i)):e(t),"number"==typeof o.gcTime&&(o.gcTime=Math.max(o.gcTime,1e3))}(o.suspense||o.throwOnError||o.experimental_prefetchInRender)&&!a.isReset()&&(o.retryOnMount=!1),m.useEffect(()=>{a.clearReset()},[a]);let l=!n.getQueryCache().get(o.queryHash),[d]=m.useState(()=>new t(n,o)),c=d.getOptimisticResult(o),h=!s&&!1!==e.subscribed;if(m.useSyncExternalStore(m.useCallback(e=>{let t=h?d.subscribe(r.notifyManager.batchCalls(e)):u.noop;return d.updateResult(),t},[d,h]),()=>d.getCurrentResult(),()=>d.getCurrentResult()),m.useEffect(()=>{d.setOptions(o)},[o,d]),o?.suspense&&c.isPending)throw v(o,d,a);if((({result:e,errorResetBoundary:t,throwOnError:i,query:r,suspense:s})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(s&&void 0===e.data||(0,u.shouldThrowError)(i,[e.error,r])))({result:c,errorResetBoundary:a,throwOnError:o.throwOnError,query:n.getQueryCache().get(o.queryHash),suspense:o.suspense}))throw c.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(o,c),o.experimental_prefetchInRender&&!u.isServer&&c.isLoading&&c.isFetching&&!s){let e=l?v(o,d,a):n.getQueryCache().get(o.queryHash)?.promise;e?.catch(u.noop).finally(()=>{d.updateResult()})}return o.notifyOnChangeProps?c:d.trackResult(c)}(e,l,t)}e.s(["useQuery",()=>b],66027)},54616,e=>{"use strict";var t=e.i(71645),i=e.i(14272),r=e.i(40143),s=e.i(15823),a=e.i(19273),n=class extends s.Subscribable{#e;#a=void 0;#R;#A;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#U()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,a.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#R,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,a.hashKey)(t.mutationKey)!==(0,a.hashKey)(this.options.mutationKey)?this.reset():this.#R?.state.status==="pending"&&this.#R.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#R?.removeObserver(this)}onMutationUpdate(e){this.#U(),this.#x(e)}getCurrentResult(){return this.#a}reset(){this.#R?.removeObserver(this),this.#R=void 0,this.#U(),this.#x()}mutate(e,t){return this.#A=t,this.#R?.removeObserver(this),this.#R=this.#e.getMutationCache().build(this.#e,this.options),this.#R.addObserver(this),this.#R.execute(e)}#U(){let e=this.#R?.state??(0,i.getDefaultState)();this.#a={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#x(e){r.notifyManager.batch(()=>{if(this.#A&&this.hasListeners()){let t=this.#a.variables,i=this.#a.context,r={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#A.onSuccess?.(e.data,t,i,r),this.#A.onSettled?.(e.data,null,t,i,r)):e?.type==="error"&&(this.#A.onError?.(e.error,t,i,r),this.#A.onSettled?.(void 0,e.error,t,i,r))}this.listeners.forEach(e=>{e(this.#a)})})}},u=e.i(12598);function o(e,i){let s=(0,u.useQueryClient)(i),[o]=t.useState(()=>new n(s,e));t.useEffect(()=>{o.setOptions(e)},[o,e]);let l=t.useSyncExternalStore(t.useCallback(e=>o.subscribe(r.notifyManager.batchCalls(e)),[o]),()=>o.getCurrentResult(),()=>o.getCurrentResult()),d=t.useCallback((e,t)=>{o.mutate(e,t).catch(a.noop)},[o]);if(l.error&&(0,a.shouldThrowError)(o.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:d,mutateAsync:l.mutate}}e.s(["useMutation",()=>o],54616)},88417,e=>{"use strict";let t=`
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
`,u=`
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
`,o=`
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
`,f=`
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
`,v=`
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
`,x=`
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
`,R=`
  mutation CreatePremiumCheckout($input: CreatePremiumCheckoutInput!) {
    createPremiumCheckoutSession(input: $input) {
      sessionId
      url
    }
  }
`,A=`
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
`,_=`
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
`,P=`
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
`,$=`
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
`,w=`
  mutation WatchVideoAd($input: WatchVideoAdInput!) {
    watchVideoAd(input: $input) {
      success
      canGenerateCoupon
      remaining
      token
      adsWatched
    }
  }
`,D=`
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      id
      displayName
      avatarUrl
      email
    }
  }
`,Q=`
  mutation RequestAvatarUpload($fileName: String!) {
    requestAvatarUpload(fileName: $fileName) {
      uploadUrl
      publicUrl
    }
  }
`,j=`
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
`,L=`
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
        ${L}
      }
      total
      page
      hasMore
    }
  }
`,V=`
  query MyMuralPosts($page: Int, $pageSize: Int) {
    myMuralPosts(page: $page, pageSize: $pageSize) {
      posts {
        ${L}
      }
      total
      page
      hasMore
    }
  }
`,G=`
  query MuralPost($id: ID!) {
    muralPost(id: $id) {
      ${L}
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
`,Y=`
  mutation CreateMuralPost($input: CreateMuralPostInput!) {
    createMuralPost(input: $input) {
      ${L}
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
`;e.s(["CANCEL_PREMIUM_SUBSCRIPTION_MUTATION",0,A,"CITY_LEADERBOARD_QUERY",0,Z,"COUPONS_QUERY",0,I,"CREATE_MURAL_COMMENT_MUTATION",0,H,"CREATE_MURAL_POST_MUTATION",0,Y,"CREATE_PREMIUM_CHECKOUT_MUTATION",0,R,"CREATE_REVIEW_MUTATION",0,k,"CREATE_STORE_MUTATION",0,c,"CREATE_VIDEO_AD_MUTATION",0,M,"DELETE_MURAL_COMMENT_MUTATION",0,z,"DELETE_MURAL_POST_MUTATION",0,K,"DELETE_STORE_MUTATION",0,p,"DELETE_VIDEO_AD_MUTATION",0,O,"EXCHANGE_UNLOCK_MUTATION",0,E,"FORGOT_PASSWORD_MUTATION",0,a,"GENERATE_COUPON_MUTATION",0,v,"GET_ALL_STORES_QUERY",0,d,"GET_ALL_VIDEO_ADS_QUERY",0,P,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,g,"GET_CATEGORY_BY_NAME_QUERY",0,m,"GET_COUPON_REDEEM_DETAILS_QUERY",0,f,"GET_CURRENT_USER_QUERY",0,u,"GET_MURAL_FEED_QUERY",0,q,"GET_MURAL_POST_COMMENTS_QUERY",0,F,"GET_MURAL_POST_QUERY",0,G,"GET_MY_LEVEL_QUERY",0,T,"GET_MY_MURAL_POSTS_QUERY",0,V,"GET_STORE_REVIEWS_QUERY",0,j,"GET_SUBCATEGORIES_BY_CATEGORY_QUERY",0,y,"GET_USER_BY_ID_QUERY",0,o,"GET_VIDEO_AD_PAIR_QUERY",0,$,"LIKE_MURAL_POST_MUTATION",0,W,"LOGIN_MUTATION",0,t,"MY_CHALLENGES_QUERY",0,X,"MY_POINTS_HISTORY_QUERY",0,J,"MY_SUBSCRIPTION_STATUS_QUERY",0,_,"PAY_PREMIUM_WITH_WALLET_MUTATION",0,S,"QUICK_PAY_FOR_DISCOUNT_MUTATION",0,b,"REDEEM_COUPON_BY_STAFF_MUTATION",0,x,"REQUEST_AVATAR_UPLOAD_MUTATION",0,Q,"REQUEST_VIDEO_UPLOAD_MUTATION",0,C,"RESEND_VERIFICATION_MUTATION",0,s,"RESET_PASSWORD_MUTATION",0,n,"SIGNUP_MUTATION",0,i,"TOGGLE_PREMIUM_AUTO_RENEW_MUTATION",0,U,"UNLIKE_MURAL_POST_MUTATION",0,B,"UPDATE_ME_MUTATION",0,D,"UPDATE_STORE_MUTATION",0,h,"UPDATE_USER_MUTATION",0,l,"UPDATE_VIDEO_AD_MUTATION",0,N,"VERIFY_EMAIL_MUTATION",0,r,"WATCH_VIDEO_AD_MUTATION",0,w])},43531,e=>{"use strict";let t=(0,e.i(75254).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",()=>t],43531)},31278,e=>{"use strict";let t=(0,e.i(75254).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},48063,e=>{"use strict";var t=e.i(54616),i=e.i(66027),r=e.i(12598),s=e.i(97903),a=e.i(88417);function n(e){return(0,i.useQuery)({queryKey:["video-ad-pair",e],queryFn:async()=>(await s.graphqlClient.request(a.GET_VIDEO_AD_PAIR_QUERY,{deviceId:e})).getVideoAdPair,staleTime:0,gcTime:0})}function u(){return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.WATCH_VIDEO_AD_MUTATION,{input:e})).watchVideoAd})}function o(){return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.REQUEST_VIDEO_UPLOAD_MUTATION,{input:e})).requestVideoUpload})}function l(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.CREATE_VIDEO_AD_MUTATION,{input:e})).createVideoAd,onSuccess:()=>{e.invalidateQueries({queryKey:["video-ads"]})}})}function d(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.UPDATE_VIDEO_AD_MUTATION,{input:e})).updateVideoAd,onSuccess:()=>{e.invalidateQueries({queryKey:["video-ads"]})}})}function c(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await s.graphqlClient.request(a.DELETE_VIDEO_AD_MUTATION,{id:e})).deleteVideoAd,onSuccess:()=>{e.invalidateQueries({queryKey:["video-ads"]})}})}function h(){return(0,i.useQuery)({queryKey:["video-ads","all"],queryFn:async()=>(await s.graphqlClient.request(a.GET_ALL_VIDEO_ADS_QUERY)).getAllVideoAds})}e.s(["useCreateVideoAd",()=>l,"useDeleteVideoAd",()=>c,"useGetAllVideoAds",()=>h,"useGetVideoAdPair",()=>n,"useRequestVideoUpload",()=>o,"useUpdateVideoAd",()=>d,"useWatchVideoAd",()=>u])},30699,e=>{"use strict";let t=(0,e.i(75254).default)("gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);e.s(["Gift",()=>t],30699)},68986,31343,5381,32519,e=>{"use strict";var t=e.i(43476),i=e.i(75254);let r=(0,i.default)("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]);e.s(["Play",()=>r],31343);let s=(0,i.default)("pause",[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]),a=(0,i.default)("volume-2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]),n=(0,i.default)("volume-x",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);var u=e.i(71645);function o({videoUrl:e,title:i,description:o,duration:l,autoplay:d=!1,shouldPauseOnComplete:c=!1,onWatchComplete:h,onProgress:p}){let m,y,g=(0,u.useRef)(null),[f,v]=(0,u.useState)(!1),[b,T]=(0,u.useState)(!1),[E,I]=(0,u.useState)(0),[x,R]=(0,u.useState)(!1);return(0,u.useEffect)(()=>()=>{let e=g.current;e&&(e.pause(),e.currentTime=0)},[]),(0,u.useEffect)(()=>{let e=g.current;if(!e)return;d&&e.play().catch(t=>{e.muted=!0,T(!0),e.play().catch(e=>console.error("Autoplay failed:",e))});let t=()=>{let t=e.currentTime;I(t),p&&p(t,l)},i=()=>v(!0),r=()=>v(!1),s=()=>{v(!1),!x&&(R(!0),h(Math.floor(e.duration)),c&&e.pause())};return e.addEventListener("timeupdate",t),e.addEventListener("play",i),e.addEventListener("pause",r),e.addEventListener("ended",s),()=>{e.removeEventListener("timeupdate",t),e.removeEventListener("play",i),e.removeEventListener("pause",r),e.removeEventListener("ended",s)}},[d,l,x,h,p,c]),(0,t.jsxs)("div",{className:"w-full mx-auto",children:[i?(0,t.jsxs)("div",{className:"mb-2",children:[(0,t.jsx)("h2",{className:"text-xl sm:text-2xl font-bold text-foreground",children:i}),o?(0,t.jsx)("p",{className:"text-xs sm:text-sm text-muted-foreground mt-1",children:o}):null]}):null,(0,t.jsxs)("div",{className:"relative bg-black overflow-hidden shadow-2xl",children:[(0,t.jsx)("video",{ref:g,src:e,className:"w-full h-[60vh] object-fit",playsInline:!0,loop:!1,preload:"auto",children:"Your browser does not support video playback."}),(0,t.jsxs)("div",{className:"absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3 sm:p-4",children:[(0,t.jsx)("div",{className:"mb-2 sm:mb-3",children:(0,t.jsx)("div",{className:"flex justify-between text-[10px] sm:text-xs text-white mt-1",children:(0,t.jsx)("span",{children:(m=Math.floor(E/60),y=Math.floor(E%60),`${m}:${y.toString().padStart(2,"0")}`)})})}),(0,t.jsx)("div",{className:"flex items-center justify-between",children:(0,t.jsxs)("div",{className:"flex items-center gap-2 sm:gap-3",children:[(0,t.jsx)("button",{onClick:()=>{let e=g.current;e&&(f?e.pause():e.play())},className:"w-full h-full p-2 flex items-center justify-center bg-primary rounded-full hover:bg-primary/80 transition-colors active:scale-95","aria-label":f?"Pause":"Play",children:f?(0,t.jsx)(s,{className:"w-4 h-4 sm:w-5 sm:h-5 text-white"}):(0,t.jsx)(r,{className:"w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5"})}),(0,t.jsx)("button",{onClick:()=>{let e=g.current;e&&(e.muted=!e.muted,T(!b))},className:"w-full h-full p-2  flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors active:scale-95","aria-label":b?"Unmute":"Mute",children:b?(0,t.jsx)(n,{className:"w-4 h-4 sm:w-5 sm:h-5 text-white"}):(0,t.jsx)(a,{className:"w-4 h-4 sm:w-5 sm:h-5 text-white"})})]})})]})]})]})}e.s(["VideoPlayer",()=>o],68986);var l=e.i(54616),d=e.i(97903),c=e.i(88417);function h(){return(0,l.useMutation)({mutationFn:async e=>(await (0,d.graphqlRequest)(c.EXCHANGE_UNLOCK_MUTATION,{input:e})).exchangeUnlock})}e.s(["useExchangeUnlock",()=>h],5381),e.i(48063),e.s([],32519)},36734,e=>{"use strict";var t=e.i(43476),i=e.i(43531),r=e.i(30699),s=e.i(31278),a=e.i(18566),n=e.i(71645),u=e.i(68986),o=e.i(5381);e.i(32519);var l=e.i(48063);function d(){return(0,t.jsx)(n.Suspense,{fallback:(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-background",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)(s.Loader2,{className:"w-12 h-12 animate-spin text-primary mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-lg text-muted-foreground",children:"Cargando..."})]})}),children:(0,t.jsx)(c,{})})}function c(){let e=(0,a.useSearchParams)(),d=(0,a.useRouter)(),c=e?.get("discountId")??null,[h,p]=(0,n.useState)(0),[m,y]=(0,n.useState)([]),[g,f]=(0,n.useState)(null),[v]=(0,n.useState)(()=>{{let e=localStorage.getItem("deviceId");return e||(e=`device-${Math.random().toString(36).substring(2,15)}`,localStorage.setItem("deviceId",e)),e}}),{data:b,isLoading:T,error:E}=(0,l.useGetVideoAdPair)(v),I=(0,l.useWatchVideoAd)(),x=(0,o.useExchangeUnlock)(),R=b?.ads||[],A=b?.sessionId,U=R[h],_=async e=>{if(U&&A)try{let t=await I.mutateAsync({videoAdId:U.id,videoKey:U.videoKey,watchDuration:Math.floor(e),deviceId:v,sessionId:A});y(e=>[...e,U.id]),t.canGenerateCoupon&&t.token?f(t.token):h<R.length-1&&setTimeout(()=>{p(h+1)},1500)}catch(e){}},S=async()=>{if(g&&c)try{let e=await x.mutateAsync({token:g,discountId:c});d.push(`/coupon/${e.code}`)}catch(e){}};return T?(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-background",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)(s.Loader2,{className:"w-12 h-12 animate-spin text-primary mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-lg text-muted-foreground",children:"Cargando anuncios..."})]})}):E||!R.length?(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-background p-6",children:(0,t.jsxs)("div",{className:"max-w-md w-full bg-card border border-border rounded-lg p-8 text-center",children:[(0,t.jsx)("div",{className:"w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",children:(0,t.jsx)("span",{className:"text-3xl",children:"❌"})}),(0,t.jsx)("h2",{className:"text-2xl font-bold text-foreground mb-2",children:"No hay anuncios disponibles"}),(0,t.jsx)("p",{className:"text-muted-foreground mb-6",children:E?"Error al cargar los anuncios. Por favor intenta más tarde.":"No hay suficientes anuncios disponibles. Por favor contacta soporte."}),(0,t.jsx)("button",{onClick:()=>d.back(),className:"px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors",children:"Volver"})]})}):g?(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-background p-6",children:(0,t.jsxs)("div",{className:"max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden",children:[(0,t.jsxs)("div",{className:"bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center",children:[(0,t.jsx)("div",{className:"w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4",children:(0,t.jsx)(r.Gift,{className:"w-10 h-10 text-green-500"})}),(0,t.jsx)("h1",{className:"text-3xl font-bold mb-2",children:"¡Felicitaciones!"}),(0,t.jsx)("p",{className:"text-lg opacity-90",children:"Has visto ambos anuncios de video"})]}),(0,t.jsxs)("div",{className:"p-8",children:[(0,t.jsx)("div",{className:"mb-6",children:(0,t.jsx)("h3",{className:"text-lg font-semibold text-foreground mb-4",children:"Anuncios vistos:"})}),(0,t.jsx)("button",{onClick:()=>void S(),disabled:x.isPending,className:"w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",children:x.isPending?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.Loader2,{className:"w-5 h-5 animate-spin"}),"Desbloqueando cupón..."]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.Gift,{className:"w-5 h-5"}),"Desbloquear tu cupón"]})}),x.isError?(0,t.jsx)("p",{className:"text-sm text-red-500 mt-4 text-center",children:"Error al desbloquear el cupón. Por favor intenta de nuevo."}):null]})]})}):(0,t.jsx)("div",{className:"min-h-screen bg-background p-6",children:(0,t.jsxs)("div",{className:"max-w-6xl mx-auto pt-8",children:[(0,t.jsxs)("div",{className:"mb-8 text-center",children:[(0,t.jsxs)("p",{className:"text-muted-foreground",children:["Video ",h+1," de ",R.length]}),(0,t.jsx)("div",{className:"flex items-center justify-center gap-4 mt-6",children:R.map((e,r)=>(0,t.jsxs)("div",{className:"flex flex-col items-center gap-2",children:[(0,t.jsx)("div",{className:`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${m.includes(e.id)?"bg-green-500 text-white":r===h?"bg-primary text-white ring-4 ring-primary/30":"bg-muted text-muted-foreground"}`,children:m.includes(e.id)?(0,t.jsx)(i.Check,{className:"w-6 h-6"}):r+1}),(0,t.jsx)("span",{className:"text-xs text-muted-foreground",children:m.includes(e.id)?"Completado":r===h?"Viendo":"Pendiente"})]},e.id))})]}),U?(0,t.jsx)(u.VideoPlayer,{videoUrl:U.videoUrl,title:U.title,description:U.description,duration:U.duration,autoplay:h>0,onWatchComplete:_}):null,I.isPending?(0,t.jsxs)("div",{className:"mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3",children:[(0,t.jsx)(s.Loader2,{className:"w-5 h-5 animate-spin text-blue-500"}),(0,t.jsx)("p",{className:"text-sm text-blue-700 dark:text-blue-300",children:"Registrando tu progreso..."})]}):null]})})}e.s(["default",()=>d])}]);