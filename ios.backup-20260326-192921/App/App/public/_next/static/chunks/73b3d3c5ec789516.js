(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var i=e.i(75555),r=e.i(40143),s=e.i(86491),a=e.i(15823),n=e.i(93803),u=e.i(19273),o=e.i(80166),l=class extends a.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#i=(0,n.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#r=void 0;#s=void 0;#a=void 0;#n;#u;#i;#t;#o;#l;#d;#c;#h;#p;#m=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#r.addObserver(this),d(this.#r,this.options)?this.#y():this.updateResult(),this.#g())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return c(this.#r,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return c(this.#r,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#f(),this.#I(),this.#r.removeObserver(this)}setOptions(e){let t=this.options,i=this.#r;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,u.resolveEnabled)(this.options.enabled,this.#r))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#T(),this.#r.setOptions(this.options),t._defaulted&&!(0,u.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#r,observer:this});let r=this.hasListeners();r&&h(this.#r,i,this.options,t)&&this.#y(),this.updateResult(),r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||(0,u.resolveStaleTime)(this.options.staleTime,this.#r)!==(0,u.resolveStaleTime)(t.staleTime,this.#r))&&this.#R();let s=this.#v();r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||s!==this.#p)&&this.#E(s)}getOptimisticResult(e){var t,i;let r=this.#e.getQueryCache().build(this.#e,e),s=this.createResult(r,e);return t=this,i=s,(0,u.shallowEqualObjects)(t.getCurrentResult(),i)||(this.#a=s,this.#u=this.options,this.#n=this.#r.state),s}getCurrentResult(){return this.#a}trackResult(e,t){return new Proxy(e,{get:(e,i)=>(this.trackProp(i),t?.(i),"promise"===i&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#i.status||this.#i.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,i))})}trackProp(e){this.#m.add(e)}getCurrentQuery(){return this.#r}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),i=this.#e.getQueryCache().build(this.#e,t);return i.fetch().then(()=>this.createResult(i,t))}fetch(e){return this.#y({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#a))}#y(e){this.#T();let t=this.#r.fetch(this.options,e);return e?.throwOnError||(t=t.catch(u.noop)),t}#R(){this.#f();let e=(0,u.resolveStaleTime)(this.options.staleTime,this.#r);if(u.isServer||this.#a.isStale||!(0,u.isValidTimeout)(e))return;let t=(0,u.timeUntilStale)(this.#a.dataUpdatedAt,e);this.#c=o.timeoutManager.setTimeout(()=>{this.#a.isStale||this.updateResult()},t+1)}#v(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#r):this.options.refetchInterval)??!1}#E(e){this.#I(),this.#p=e,!u.isServer&&!1!==(0,u.resolveEnabled)(this.options.enabled,this.#r)&&(0,u.isValidTimeout)(this.#p)&&0!==this.#p&&(this.#h=o.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||i.focusManager.isFocused())&&this.#y()},this.#p))}#g(){this.#R(),this.#E(this.#v())}#f(){this.#c&&(o.timeoutManager.clearTimeout(this.#c),this.#c=void 0)}#I(){this.#h&&(o.timeoutManager.clearInterval(this.#h),this.#h=void 0)}createResult(e,t){let i,r=this.#r,a=this.options,o=this.#a,l=this.#n,c=this.#u,m=e!==r?e.state:this.#s,{state:y}=e,g={...y},f=!1;if(t._optimisticResults){let i=this.hasListeners(),n=!i&&d(e,t),u=i&&h(e,r,t,a);(n||u)&&(g={...g,...(0,s.fetchState)(y.data,e.options)}),"isRestoring"===t._optimisticResults&&(g.fetchStatus="idle")}let{error:I,errorUpdatedAt:T,status:R}=g;i=g.data;let v=!1;if(void 0!==t.placeholderData&&void 0===i&&"pending"===R){let e;o?.isPlaceholderData&&t.placeholderData===c?.placeholderData?(e=o.data,v=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#d?.state.data,this.#d):t.placeholderData,void 0!==e&&(R="success",i=(0,u.replaceData)(o?.data,e,t),f=!0)}if(t.select&&void 0!==i&&!v)if(o&&i===l?.data&&t.select===this.#o)i=this.#l;else try{this.#o=t.select,i=t.select(i),i=(0,u.replaceData)(o?.data,i,t),this.#l=i,this.#t=null}catch(e){this.#t=e}this.#t&&(I=this.#t,i=this.#l,T=Date.now(),R="error");let E="fetching"===g.fetchStatus,A="pending"===R,S="error"===R,U=A&&E,b=void 0!==i,_={status:R,fetchStatus:g.fetchStatus,isPending:A,isSuccess:"success"===R,isError:S,isInitialLoading:U,isLoading:U,data:i,dataUpdatedAt:g.dataUpdatedAt,error:I,errorUpdatedAt:T,failureCount:g.fetchFailureCount,failureReason:g.fetchFailureReason,errorUpdateCount:g.errorUpdateCount,isFetched:g.dataUpdateCount>0||g.errorUpdateCount>0,isFetchedAfterMount:g.dataUpdateCount>m.dataUpdateCount||g.errorUpdateCount>m.errorUpdateCount,isFetching:E,isRefetching:E&&!A,isLoadingError:S&&!b,isPaused:"paused"===g.fetchStatus,isPlaceholderData:f,isRefetchError:S&&b,isStale:p(e,t),refetch:this.refetch,promise:this.#i,isEnabled:!1!==(0,u.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===_.status?e.reject(_.error):void 0!==_.data&&e.resolve(_.data)},i=()=>{t(this.#i=_.promise=(0,n.pendingThenable)())},s=this.#i;switch(s.status){case"pending":e.queryHash===r.queryHash&&t(s);break;case"fulfilled":("error"===_.status||_.data!==s.value)&&i();break;case"rejected":("error"!==_.status||_.error!==s.reason)&&i()}}return _}updateResult(){let e=this.#a,t=this.createResult(this.#r,this.options);if(this.#n=this.#r.state,this.#u=this.options,void 0!==this.#n.data&&(this.#d=this.#r),(0,u.shallowEqualObjects)(t,e))return;this.#a=t;let i=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,i="function"==typeof t?t():t;if("all"===i||!i&&!this.#m.size)return!0;let r=new Set(i??this.#m);return this.options.throwOnError&&r.add("error"),Object.keys(this.#a).some(t=>this.#a[t]!==e[t]&&r.has(t))};this.#A({listeners:i()})}#T(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#r)return;let t=this.#r;this.#r=e,this.#s=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#g()}#A(e){r.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#a)}),this.#e.getQueryCache().notify({query:this.#r,type:"observerResultsUpdated"})})}};function d(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&c(e,t,t.refetchOnMount)}function c(e,t,i){if(!1!==(0,u.resolveEnabled)(t.enabled,e)&&"static"!==(0,u.resolveStaleTime)(t.staleTime,e)){let r="function"==typeof i?i(e):i;return"always"===r||!1!==r&&p(e,t)}return!1}function h(e,t,i,r){return(e!==t||!1===(0,u.resolveEnabled)(r.enabled,e))&&(!i.suspense||"error"!==e.state.status)&&p(e,i)}function p(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,u.resolveStaleTime)(t.staleTime,e))}e.i(47167);var m=e.i(71645),y=e.i(12598);e.i(43476);var g=m.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),f=m.createContext(!1);f.Provider;var I=(e,t,i)=>t.fetchOptimistic(e).catch(()=>{i.clearReset()});function T(e,t){return function(e,t,i){let s=m.useContext(f),a=m.useContext(g),n=(0,y.useQueryClient)(i),o=n.defaultQueryOptions(e);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(o),o._optimisticResults=s?"isRestoring":"optimistic",o.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=o.staleTime;o.staleTime="function"==typeof t?(...i)=>e(t(...i)):e(t),"number"==typeof o.gcTime&&(o.gcTime=Math.max(o.gcTime,1e3))}(o.suspense||o.throwOnError||o.experimental_prefetchInRender)&&!a.isReset()&&(o.retryOnMount=!1),m.useEffect(()=>{a.clearReset()},[a]);let l=!n.getQueryCache().get(o.queryHash),[d]=m.useState(()=>new t(n,o)),c=d.getOptimisticResult(o),h=!s&&!1!==e.subscribed;if(m.useSyncExternalStore(m.useCallback(e=>{let t=h?d.subscribe(r.notifyManager.batchCalls(e)):u.noop;return d.updateResult(),t},[d,h]),()=>d.getCurrentResult(),()=>d.getCurrentResult()),m.useEffect(()=>{d.setOptions(o)},[o,d]),o?.suspense&&c.isPending)throw I(o,d,a);if((({result:e,errorResetBoundary:t,throwOnError:i,query:r,suspense:s})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(s&&void 0===e.data||(0,u.shouldThrowError)(i,[e.error,r])))({result:c,errorResetBoundary:a,throwOnError:o.throwOnError,query:n.getQueryCache().get(o.queryHash),suspense:o.suspense}))throw c.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(o,c),o.experimental_prefetchInRender&&!u.isServer&&c.isLoading&&c.isFetching&&!s){let e=l?I(o,d,a):n.getQueryCache().get(o.queryHash)?.promise;e?.catch(u.noop).finally(()=>{d.updateResult()})}return o.notifyOnChangeProps?c:d.trackResult(c)}(e,l,t)}e.s(["useQuery",()=>T],66027)},54616,e=>{"use strict";var t=e.i(71645),i=e.i(14272),r=e.i(40143),s=e.i(15823),a=e.i(19273),n=class extends s.Subscribable{#e;#a=void 0;#S;#U;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#b()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,a.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#S,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,a.hashKey)(t.mutationKey)!==(0,a.hashKey)(this.options.mutationKey)?this.reset():this.#S?.state.status==="pending"&&this.#S.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#S?.removeObserver(this)}onMutationUpdate(e){this.#b(),this.#A(e)}getCurrentResult(){return this.#a}reset(){this.#S?.removeObserver(this),this.#S=void 0,this.#b(),this.#A()}mutate(e,t){return this.#U=t,this.#S?.removeObserver(this),this.#S=this.#e.getMutationCache().build(this.#e,this.options),this.#S.addObserver(this),this.#S.execute(e)}#b(){let e=this.#S?.state??(0,i.getDefaultState)();this.#a={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#A(e){r.notifyManager.batch(()=>{if(this.#U&&this.hasListeners()){let t=this.#a.variables,i=this.#a.context,r={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#U.onSuccess?.(e.data,t,i,r),this.#U.onSettled?.(e.data,null,t,i,r)):e?.type==="error"&&(this.#U.onError?.(e.error,t,i,r),this.#U.onSettled?.(void 0,e.error,t,i,r))}this.listeners.forEach(e=>{e(this.#a)})})}},u=e.i(12598);function o(e,i){let s=(0,u.useQueryClient)(i),[o]=t.useState(()=>new n(s,e));t.useEffect(()=>{o.setOptions(e)},[o,e]);let l=t.useSyncExternalStore(t.useCallback(e=>o.subscribe(r.notifyManager.batchCalls(e)),[o]),()=>o.getCurrentResult(),()=>o.getCurrentResult()),d=t.useCallback((e,t)=>{o.mutate(e,t).catch(a.noop)},[o]);if(l.error&&(0,a.shouldThrowError)(o.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:d,mutateAsync:l.mutate}}e.s(["useMutation",()=>o],54616)},19284,e=>{"use strict";let t,i,r,s;var a,n=e.i(71645);let u=e=>{let t,i=new Set,r=(e,r)=>{let s="function"==typeof e?e(t):e;if(!Object.is(s,t)){let e=t;t=(null!=r?r:"object"!=typeof s||null===s)?s:Object.assign({},t,s),i.forEach(i=>i(t,e))}},s=()=>t,a={setState:r,getState:s,getInitialState:()=>n,subscribe:e=>(i.add(e),()=>i.delete(e))},n=t=e(r,s,a);return a},o=e=>t=>{try{let i=e(t);if(i instanceof Promise)return i;return{then:e=>o(e)(i),catch(e){return this}}}catch(e){return{then(e){return this},catch:t=>o(t)(e)}}};var l=e.i(97903);let d=(r=(a=(t=(e,t)=>({user:null,accessToken:null,isAuthenticated:!1,rememberMe:!1,expiresAt:null,setAuth:(t,i,r=!1)=>{(0,l.setAuthToken)(i);let s=r?2592e6:864e5;e({user:t,accessToken:i,isAuthenticated:!0,rememberMe:r,expiresAt:Date.now()+s})},clearAuth:()=>{(0,l.setAuthToken)(null),e({user:null,accessToken:null,isAuthenticated:!1,rememberMe:!1,expiresAt:null});{let e=window.location.pathname;["/","/explore","/restaurants","/stores","/service","/auth"].some(t=>e===t||e.startsWith(t+"/"))||(window.location.href="/")}},updateUser:t=>{e(e=>({user:e.user?{...e.user,...t}:null}))},checkExpiration:()=>{let e=t();return!(e.expiresAt&&Date.now()>e.expiresAt)||(t().clearAuth(),!1)}}),i={name:"namy-auth-storage",onRehydrateStorage:()=>e=>{if(e?.accessToken)if(e.expiresAt&&Date.now()>e.expiresAt)try{window.localStorage&&window.localStorage.removeItem("namy-auth-storage")}catch{}else(0,l.setAuthToken)(e.accessToken)}},(e,r,s)=>{let a,n={storage:function(e,t){let i;try{i=e()}catch(e){return}return{getItem:e=>{var t;let r=e=>null===e?null:JSON.parse(e,void 0),s=null!=(t=i.getItem(e))?t:null;return s instanceof Promise?s.then(r):r(s)},setItem:(e,t)=>i.setItem(e,JSON.stringify(t,void 0)),removeItem:e=>i.removeItem(e)}}(()=>localStorage),partialize:e=>e,version:0,merge:(e,t)=>({...t,...e}),...i},u=!1,l=new Set,d=new Set,c=n.storage;if(!c)return t((...t)=>{console.warn(`[zustand persist middleware] Unable to update item '${n.name}', the given storage is currently unavailable.`),e(...t)},r,s);let h=()=>{let e=n.partialize({...r()});return c.setItem(n.name,{state:e,version:n.version})},p=s.setState;s.setState=(e,t)=>(p(e,t),h());let m=t((...t)=>(e(...t),h()),r,s);s.getInitialState=()=>m;let y=()=>{var t,i;if(!c)return;u=!1,l.forEach(e=>{var t;return e(null!=(t=r())?t:m)});let s=(null==(i=n.onRehydrateStorage)?void 0:i.call(n,null!=(t=r())?t:m))||void 0;return o(c.getItem.bind(c))(n.name).then(e=>{if(e)if("number"!=typeof e.version||e.version===n.version)return[!1,e.state];else{if(n.migrate){let t=n.migrate(e.state,e.version);return t instanceof Promise?t.then(e=>[!0,e]):[!0,t]}console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}return[!1,void 0]}).then(t=>{var i;let[s,u]=t;if(e(a=n.merge(u,null!=(i=r())?i:m),!0),s)return h()}).then(()=>{null==s||s(a,void 0),a=r(),u=!0,d.forEach(e=>e(a))}).catch(e=>{null==s||s(void 0,e)})};return s.persist={setOptions:e=>{n={...n,...e},e.storage&&(c=e.storage)},clearStorage:()=>{null==c||c.removeItem(n.name)},getOptions:()=>n,rehydrate:()=>y(),hasHydrated:()=>u,onHydrate:e=>(l.add(e),()=>{l.delete(e)}),onFinishHydration:e=>(d.add(e),()=>{d.delete(e)})},n.skipHydration||y(),a||m}))?u(a):u,Object.assign(s=e=>(function(e,t=e=>e){let i=n.default.useSyncExternalStore(e.subscribe,n.default.useCallback(()=>t(e.getState()),[e,t]),n.default.useCallback(()=>t(e.getInitialState()),[e,t]));return n.default.useDebugValue(i),i})(r,e),r),s);(0,l.setAuthErrorCallback)(()=>{d.getState().clearAuth()}),e.s(["useAuthStore",0,d],19284)},88417,e=>{"use strict";let t=`
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
`,I=`
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
`,T=`
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
`,b=`
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
`,K=`
  mutation DeleteMuralPost($id: ID!) {
    deleteMuralPost(id: $id)
  }
`,B=`
  mutation LikeMuralPost($id: ID!) {
    likeMuralPost(id: $id) {
      id
      likes
    }
  }
`,H=`
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
`;e.s(["CANCEL_PREMIUM_SUBSCRIPTION_MUTATION",0,U,"CITY_LEADERBOARD_QUERY",0,Z,"COUPONS_QUERY",0,E,"CREATE_MURAL_COMMENT_MUTATION",0,z,"CREATE_MURAL_POST_MUTATION",0,W,"CREATE_PREMIUM_CHECKOUT_MUTATION",0,S,"CREATE_REVIEW_MUTATION",0,k,"CREATE_STORE_MUTATION",0,c,"CREATE_VIDEO_AD_MUTATION",0,M,"DELETE_MURAL_COMMENT_MUTATION",0,j,"DELETE_MURAL_POST_MUTATION",0,K,"DELETE_STORE_MUTATION",0,p,"DELETE_VIDEO_AD_MUTATION",0,P,"EXCHANGE_UNLOCK_MUTATION",0,v,"FORGOT_PASSWORD_MUTATION",0,a,"GENERATE_COUPON_MUTATION",0,I,"GET_ALL_STORES_QUERY",0,d,"GET_ALL_VIDEO_ADS_QUERY",0,N,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,g,"GET_CATEGORY_BY_NAME_QUERY",0,m,"GET_COUPON_REDEEM_DETAILS_QUERY",0,f,"GET_CURRENT_USER_QUERY",0,u,"GET_MURAL_FEED_QUERY",0,G,"GET_MURAL_POST_COMMENTS_QUERY",0,F,"GET_MURAL_POST_QUERY",0,Y,"GET_MY_LEVEL_QUERY",0,R,"GET_MY_MURAL_POSTS_QUERY",0,V,"GET_STORE_REVIEWS_QUERY",0,L,"GET_SUBCATEGORIES_BY_CATEGORY_QUERY",0,y,"GET_USER_BY_ID_QUERY",0,o,"GET_VIDEO_AD_PAIR_QUERY",0,D,"LIKE_MURAL_POST_MUTATION",0,B,"LOGIN_MUTATION",0,t,"MY_CHALLENGES_QUERY",0,J,"MY_POINTS_HISTORY_QUERY",0,X,"MY_SUBSCRIPTION_STATUS_QUERY",0,_,"PAY_PREMIUM_WITH_WALLET_MUTATION",0,O,"QUICK_PAY_FOR_DISCOUNT_MUTATION",0,T,"REDEEM_COUPON_BY_STAFF_MUTATION",0,A,"REQUEST_AVATAR_UPLOAD_MUTATION",0,x,"REQUEST_VIDEO_UPLOAD_MUTATION",0,C,"RESEND_VERIFICATION_MUTATION",0,s,"RESET_PASSWORD_MUTATION",0,n,"SIGNUP_MUTATION",0,i,"TOGGLE_PREMIUM_AUTO_RENEW_MUTATION",0,b,"UNLIKE_MURAL_POST_MUTATION",0,H,"UPDATE_ME_MUTATION",0,w,"UPDATE_STORE_MUTATION",0,h,"UPDATE_USER_MUTATION",0,l,"UPDATE_VIDEO_AD_MUTATION",0,$,"VERIFY_EMAIL_MUTATION",0,r,"WATCH_VIDEO_AD_MUTATION",0,Q])}]);