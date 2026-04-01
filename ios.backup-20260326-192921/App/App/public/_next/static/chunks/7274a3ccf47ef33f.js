(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var i=e.i(75555),r=e.i(40143),a=e.i(86491),s=e.i(15823),n=e.i(93803),u=e.i(19273),o=e.i(80166),l=class extends s.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#i=(0,n.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#r=void 0;#a=void 0;#s=void 0;#n;#u;#i;#t;#o;#l;#d;#c;#p;#h;#m=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#r.addObserver(this),d(this.#r,this.options)?this.#y():this.updateResult(),this.#g())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return c(this.#r,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return c(this.#r,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#I(),this.#T(),this.#r.removeObserver(this)}setOptions(e){let t=this.options,i=this.#r;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,u.resolveEnabled)(this.options.enabled,this.#r))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#f(),this.#r.setOptions(this.options),t._defaulted&&!(0,u.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#r,observer:this});let r=this.hasListeners();r&&p(this.#r,i,this.options,t)&&this.#y(),this.updateResult(),r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||(0,u.resolveStaleTime)(this.options.staleTime,this.#r)!==(0,u.resolveStaleTime)(t.staleTime,this.#r))&&this.#R();let a=this.#v();r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||a!==this.#h)&&this.#E(a)}getOptimisticResult(e){var t,i;let r=this.#e.getQueryCache().build(this.#e,e),a=this.createResult(r,e);return t=this,i=a,(0,u.shallowEqualObjects)(t.getCurrentResult(),i)||(this.#s=a,this.#u=this.options,this.#n=this.#r.state),a}getCurrentResult(){return this.#s}trackResult(e,t){return new Proxy(e,{get:(e,i)=>(this.trackProp(i),t?.(i),"promise"===i&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#i.status||this.#i.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,i))})}trackProp(e){this.#m.add(e)}getCurrentQuery(){return this.#r}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),i=this.#e.getQueryCache().build(this.#e,t);return i.fetch().then(()=>this.createResult(i,t))}fetch(e){return this.#y({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#s))}#y(e){this.#f();let t=this.#r.fetch(this.options,e);return e?.throwOnError||(t=t.catch(u.noop)),t}#R(){this.#I();let e=(0,u.resolveStaleTime)(this.options.staleTime,this.#r);if(u.isServer||this.#s.isStale||!(0,u.isValidTimeout)(e))return;let t=(0,u.timeUntilStale)(this.#s.dataUpdatedAt,e);this.#c=o.timeoutManager.setTimeout(()=>{this.#s.isStale||this.updateResult()},t+1)}#v(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#r):this.options.refetchInterval)??!1}#E(e){this.#T(),this.#h=e,!u.isServer&&!1!==(0,u.resolveEnabled)(this.options.enabled,this.#r)&&(0,u.isValidTimeout)(this.#h)&&0!==this.#h&&(this.#p=o.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||i.focusManager.isFocused())&&this.#y()},this.#h))}#g(){this.#R(),this.#E(this.#v())}#I(){this.#c&&(o.timeoutManager.clearTimeout(this.#c),this.#c=void 0)}#T(){this.#p&&(o.timeoutManager.clearInterval(this.#p),this.#p=void 0)}createResult(e,t){let i,r=this.#r,s=this.options,o=this.#s,l=this.#n,c=this.#u,m=e!==r?e.state:this.#a,{state:y}=e,g={...y},I=!1;if(t._optimisticResults){let i=this.hasListeners(),n=!i&&d(e,t),u=i&&p(e,r,t,s);(n||u)&&(g={...g,...(0,a.fetchState)(y.data,e.options)}),"isRestoring"===t._optimisticResults&&(g.fetchStatus="idle")}let{error:T,errorUpdatedAt:f,status:R}=g;i=g.data;let v=!1;if(void 0!==t.placeholderData&&void 0===i&&"pending"===R){let e;o?.isPlaceholderData&&t.placeholderData===c?.placeholderData?(e=o.data,v=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#d?.state.data,this.#d):t.placeholderData,void 0!==e&&(R="success",i=(0,u.replaceData)(o?.data,e,t),I=!0)}if(t.select&&void 0!==i&&!v)if(o&&i===l?.data&&t.select===this.#o)i=this.#l;else try{this.#o=t.select,i=t.select(i),i=(0,u.replaceData)(o?.data,i,t),this.#l=i,this.#t=null}catch(e){this.#t=e}this.#t&&(T=this.#t,i=this.#l,f=Date.now(),R="error");let E="fetching"===g.fetchStatus,A="pending"===R,S="error"===R,U=A&&E,_=void 0!==i,b={status:R,fetchStatus:g.fetchStatus,isPending:A,isSuccess:"success"===R,isError:S,isInitialLoading:U,isLoading:U,data:i,dataUpdatedAt:g.dataUpdatedAt,error:T,errorUpdatedAt:f,failureCount:g.fetchFailureCount,failureReason:g.fetchFailureReason,errorUpdateCount:g.errorUpdateCount,isFetched:g.dataUpdateCount>0||g.errorUpdateCount>0,isFetchedAfterMount:g.dataUpdateCount>m.dataUpdateCount||g.errorUpdateCount>m.errorUpdateCount,isFetching:E,isRefetching:E&&!A,isLoadingError:S&&!_,isPaused:"paused"===g.fetchStatus,isPlaceholderData:I,isRefetchError:S&&_,isStale:h(e,t),refetch:this.refetch,promise:this.#i,isEnabled:!1!==(0,u.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===b.status?e.reject(b.error):void 0!==b.data&&e.resolve(b.data)},i=()=>{t(this.#i=b.promise=(0,n.pendingThenable)())},a=this.#i;switch(a.status){case"pending":e.queryHash===r.queryHash&&t(a);break;case"fulfilled":("error"===b.status||b.data!==a.value)&&i();break;case"rejected":("error"!==b.status||b.error!==a.reason)&&i()}}return b}updateResult(){let e=this.#s,t=this.createResult(this.#r,this.options);if(this.#n=this.#r.state,this.#u=this.options,void 0!==this.#n.data&&(this.#d=this.#r),(0,u.shallowEqualObjects)(t,e))return;this.#s=t;let i=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,i="function"==typeof t?t():t;if("all"===i||!i&&!this.#m.size)return!0;let r=new Set(i??this.#m);return this.options.throwOnError&&r.add("error"),Object.keys(this.#s).some(t=>this.#s[t]!==e[t]&&r.has(t))};this.#A({listeners:i()})}#f(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#r)return;let t=this.#r;this.#r=e,this.#a=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#g()}#A(e){r.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#s)}),this.#e.getQueryCache().notify({query:this.#r,type:"observerResultsUpdated"})})}};function d(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&c(e,t,t.refetchOnMount)}function c(e,t,i){if(!1!==(0,u.resolveEnabled)(t.enabled,e)&&"static"!==(0,u.resolveStaleTime)(t.staleTime,e)){let r="function"==typeof i?i(e):i;return"always"===r||!1!==r&&h(e,t)}return!1}function p(e,t,i,r){return(e!==t||!1===(0,u.resolveEnabled)(r.enabled,e))&&(!i.suspense||"error"!==e.state.status)&&h(e,i)}function h(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,u.resolveStaleTime)(t.staleTime,e))}e.i(47167);var m=e.i(71645),y=e.i(12598);e.i(43476);var g=m.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),I=m.createContext(!1);I.Provider;var T=(e,t,i)=>t.fetchOptimistic(e).catch(()=>{i.clearReset()});function f(e,t){return function(e,t,i){let a=m.useContext(I),s=m.useContext(g),n=(0,y.useQueryClient)(i),o=n.defaultQueryOptions(e);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(o),o._optimisticResults=a?"isRestoring":"optimistic",o.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=o.staleTime;o.staleTime="function"==typeof t?(...i)=>e(t(...i)):e(t),"number"==typeof o.gcTime&&(o.gcTime=Math.max(o.gcTime,1e3))}(o.suspense||o.throwOnError||o.experimental_prefetchInRender)&&!s.isReset()&&(o.retryOnMount=!1),m.useEffect(()=>{s.clearReset()},[s]);let l=!n.getQueryCache().get(o.queryHash),[d]=m.useState(()=>new t(n,o)),c=d.getOptimisticResult(o),p=!a&&!1!==e.subscribed;if(m.useSyncExternalStore(m.useCallback(e=>{let t=p?d.subscribe(r.notifyManager.batchCalls(e)):u.noop;return d.updateResult(),t},[d,p]),()=>d.getCurrentResult(),()=>d.getCurrentResult()),m.useEffect(()=>{d.setOptions(o)},[o,d]),o?.suspense&&c.isPending)throw T(o,d,s);if((({result:e,errorResetBoundary:t,throwOnError:i,query:r,suspense:a})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(a&&void 0===e.data||(0,u.shouldThrowError)(i,[e.error,r])))({result:c,errorResetBoundary:s,throwOnError:o.throwOnError,query:n.getQueryCache().get(o.queryHash),suspense:o.suspense}))throw c.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(o,c),o.experimental_prefetchInRender&&!u.isServer&&c.isLoading&&c.isFetching&&!a){let e=l?T(o,d,s):n.getQueryCache().get(o.queryHash)?.promise;e?.catch(u.noop).finally(()=>{d.updateResult()})}return o.notifyOnChangeProps?c:d.trackResult(c)}(e,l,t)}e.s(["useQuery",()=>f],66027)},19284,e=>{"use strict";let t,i,r,a;var s,n=e.i(71645);let u=e=>{let t,i=new Set,r=(e,r)=>{let a="function"==typeof e?e(t):e;if(!Object.is(a,t)){let e=t;t=(null!=r?r:"object"!=typeof a||null===a)?a:Object.assign({},t,a),i.forEach(i=>i(t,e))}},a=()=>t,s={setState:r,getState:a,getInitialState:()=>n,subscribe:e=>(i.add(e),()=>i.delete(e))},n=t=e(r,a,s);return s},o=e=>t=>{try{let i=e(t);if(i instanceof Promise)return i;return{then:e=>o(e)(i),catch(e){return this}}}catch(e){return{then(e){return this},catch:t=>o(t)(e)}}};var l=e.i(97903);let d=(r=(s=(t=(e,t)=>({user:null,accessToken:null,isAuthenticated:!1,rememberMe:!1,expiresAt:null,setAuth:(t,i,r=!1)=>{(0,l.setAuthToken)(i);let a=r?2592e6:864e5;e({user:t,accessToken:i,isAuthenticated:!0,rememberMe:r,expiresAt:Date.now()+a})},clearAuth:()=>{(0,l.setAuthToken)(null),e({user:null,accessToken:null,isAuthenticated:!1,rememberMe:!1,expiresAt:null});{let e=window.location.pathname;["/","/explore","/restaurants","/stores","/service","/auth"].some(t=>e===t||e.startsWith(t+"/"))||(window.location.href="/")}},updateUser:t=>{e(e=>({user:e.user?{...e.user,...t}:null}))},checkExpiration:()=>{let e=t();return!(e.expiresAt&&Date.now()>e.expiresAt)||(t().clearAuth(),!1)}}),i={name:"namy-auth-storage",onRehydrateStorage:()=>e=>{if(e?.accessToken)if(e.expiresAt&&Date.now()>e.expiresAt)try{window.localStorage&&window.localStorage.removeItem("namy-auth-storage")}catch{}else(0,l.setAuthToken)(e.accessToken)}},(e,r,a)=>{let s,n={storage:function(e,t){let i;try{i=e()}catch(e){return}return{getItem:e=>{var t;let r=e=>null===e?null:JSON.parse(e,void 0),a=null!=(t=i.getItem(e))?t:null;return a instanceof Promise?a.then(r):r(a)},setItem:(e,t)=>i.setItem(e,JSON.stringify(t,void 0)),removeItem:e=>i.removeItem(e)}}(()=>localStorage),partialize:e=>e,version:0,merge:(e,t)=>({...t,...e}),...i},u=!1,l=new Set,d=new Set,c=n.storage;if(!c)return t((...t)=>{console.warn(`[zustand persist middleware] Unable to update item '${n.name}', the given storage is currently unavailable.`),e(...t)},r,a);let p=()=>{let e=n.partialize({...r()});return c.setItem(n.name,{state:e,version:n.version})},h=a.setState;a.setState=(e,t)=>(h(e,t),p());let m=t((...t)=>(e(...t),p()),r,a);a.getInitialState=()=>m;let y=()=>{var t,i;if(!c)return;u=!1,l.forEach(e=>{var t;return e(null!=(t=r())?t:m)});let a=(null==(i=n.onRehydrateStorage)?void 0:i.call(n,null!=(t=r())?t:m))||void 0;return o(c.getItem.bind(c))(n.name).then(e=>{if(e)if("number"!=typeof e.version||e.version===n.version)return[!1,e.state];else{if(n.migrate){let t=n.migrate(e.state,e.version);return t instanceof Promise?t.then(e=>[!0,e]):[!0,t]}console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}return[!1,void 0]}).then(t=>{var i;let[a,u]=t;if(e(s=n.merge(u,null!=(i=r())?i:m),!0),a)return p()}).then(()=>{null==a||a(s,void 0),s=r(),u=!0,d.forEach(e=>e(s))}).catch(e=>{null==a||a(void 0,e)})};return a.persist={setOptions:e=>{n={...n,...e},e.storage&&(c=e.storage)},clearStorage:()=>{null==c||c.removeItem(n.name)},getOptions:()=>n,rehydrate:()=>y(),hasHydrated:()=>u,onHydrate:e=>(l.add(e),()=>{l.delete(e)}),onFinishHydration:e=>(d.add(e),()=>{d.delete(e)})},n.skipHydration||y(),s||m}))?u(s):u,Object.assign(a=e=>(function(e,t=e=>e){let i=n.default.useSyncExternalStore(e.subscribe,n.default.useCallback(()=>t(e.getState()),[e,t]),n.default.useCallback(()=>t(e.getInitialState()),[e,t]));return n.default.useDebugValue(i),i})(r,e),r),a);(0,l.setAuthErrorCallback)(()=>{d.getState().clearAuth()}),e.s(["useAuthStore",0,d],19284)},88417,e=>{"use strict";let t=`
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
`,a=`
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
`,I=`
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
`,T=`
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
`,f=`
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
`,R=`
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
`,v=`
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
`,S=`
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
`,_=`
  mutation ToggleAutoRenew($enabled: Boolean!) {
    togglePremiumAutoRenew(enabled: $enabled) {
      message
    }
  }
`,b=`
  query MySubscriptionStatus {
    mySubscriptionStatus {
      isPremium
      premiumStartDate
      premiumEndDate
      autoRenew
    }
  }
`,O=`
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
`,$=`
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
`,M=`
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
`,w=`
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      id
      displayName
      avatarUrl
      email
    }
  }
`,x=`
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
`,G=`
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
`,V=`
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
`,H=`
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
`,K=`
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
`,j=`
  mutation DeleteMuralComment($id: ID!) {
    deleteMuralComment(id: $id)
  }
`,J=`
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
`,X=`
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
`;e.s(["CANCEL_PREMIUM_SUBSCRIPTION_MUTATION",0,U,"CITY_LEADERBOARD_QUERY",0,Z,"COUPONS_QUERY",0,E,"CREATE_MURAL_COMMENT_MUTATION",0,K,"CREATE_MURAL_POST_MUTATION",0,W,"CREATE_PREMIUM_CHECKOUT_MUTATION",0,S,"CREATE_REVIEW_MUTATION",0,k,"CREATE_STORE_MUTATION",0,c,"CREATE_VIDEO_AD_MUTATION",0,$,"DELETE_MURAL_COMMENT_MUTATION",0,j,"DELETE_MURAL_POST_MUTATION",0,B,"DELETE_STORE_MUTATION",0,h,"DELETE_VIDEO_AD_MUTATION",0,P,"EXCHANGE_UNLOCK_MUTATION",0,v,"FORGOT_PASSWORD_MUTATION",0,s,"GENERATE_COUPON_MUTATION",0,T,"GET_ALL_STORES_QUERY",0,d,"GET_ALL_VIDEO_ADS_QUERY",0,N,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,g,"GET_CATEGORY_BY_NAME_QUERY",0,m,"GET_COUPON_REDEEM_DETAILS_QUERY",0,I,"GET_CURRENT_USER_QUERY",0,u,"GET_MURAL_FEED_QUERY",0,G,"GET_MURAL_POST_COMMENTS_QUERY",0,F,"GET_MURAL_POST_QUERY",0,Y,"GET_MY_LEVEL_QUERY",0,R,"GET_MY_MURAL_POSTS_QUERY",0,V,"GET_STORE_REVIEWS_QUERY",0,L,"GET_SUBCATEGORIES_BY_CATEGORY_QUERY",0,y,"GET_USER_BY_ID_QUERY",0,o,"GET_VIDEO_AD_PAIR_QUERY",0,D,"LIKE_MURAL_POST_MUTATION",0,H,"LOGIN_MUTATION",0,t,"MY_CHALLENGES_QUERY",0,J,"MY_POINTS_HISTORY_QUERY",0,X,"MY_SUBSCRIPTION_STATUS_QUERY",0,b,"PAY_PREMIUM_WITH_WALLET_MUTATION",0,O,"QUICK_PAY_FOR_DISCOUNT_MUTATION",0,f,"REDEEM_COUPON_BY_STAFF_MUTATION",0,A,"REQUEST_AVATAR_UPLOAD_MUTATION",0,x,"REQUEST_VIDEO_UPLOAD_MUTATION",0,C,"RESEND_VERIFICATION_MUTATION",0,a,"RESET_PASSWORD_MUTATION",0,n,"SIGNUP_MUTATION",0,i,"TOGGLE_PREMIUM_AUTO_RENEW_MUTATION",0,_,"UNLIKE_MURAL_POST_MUTATION",0,z,"UPDATE_ME_MUTATION",0,w,"UPDATE_STORE_MUTATION",0,p,"UPDATE_USER_MUTATION",0,l,"UPDATE_VIDEO_AD_MUTATION",0,M,"VERIFY_EMAIL_MUTATION",0,r,"WATCH_VIDEO_AD_MUTATION",0,Q])}]);