(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,e=>{"use strict";let t;var i=e.i(75555),r=e.i(40143),a=e.i(86491),s=e.i(15823),n=e.i(93803),u=e.i(19273),o=e.i(80166),l=class extends s.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#t=null,this.#i=(0,n.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#r=void 0;#a=void 0;#s=void 0;#n;#u;#i;#t;#o;#l;#c;#d;#h;#p;#g=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#r.addObserver(this),c(this.#r,this.options)?this.#y():this.updateResult(),this.#m())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return d(this.#r,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return d(this.#r,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#T(),this.#E(),this.#r.removeObserver(this)}setOptions(e){let t=this.options,i=this.#r;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,u.resolveEnabled)(this.options.enabled,this.#r))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#C(),this.#r.setOptions(this.options),t._defaulted&&!(0,u.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#r,observer:this});let r=this.hasListeners();r&&h(this.#r,i,this.options,t)&&this.#y(),this.updateResult(),r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||(0,u.resolveStaleTime)(this.options.staleTime,this.#r)!==(0,u.resolveStaleTime)(t.staleTime,this.#r))&&this.#f();let a=this.#S();r&&(this.#r!==i||(0,u.resolveEnabled)(this.options.enabled,this.#r)!==(0,u.resolveEnabled)(t.enabled,this.#r)||a!==this.#p)&&this.#I(a)}getOptimisticResult(e){var t,i;let r=this.#e.getQueryCache().build(this.#e,e),a=this.createResult(r,e);return t=this,i=a,(0,u.shallowEqualObjects)(t.getCurrentResult(),i)||(this.#s=a,this.#u=this.options,this.#n=this.#r.state),a}getCurrentResult(){return this.#s}trackResult(e,t){return new Proxy(e,{get:(e,i)=>(this.trackProp(i),t?.(i),"promise"===i&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#i.status||this.#i.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,i))})}trackProp(e){this.#g.add(e)}getCurrentQuery(){return this.#r}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),i=this.#e.getQueryCache().build(this.#e,t);return i.fetch().then(()=>this.createResult(i,t))}fetch(e){return this.#y({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#s))}#y(e){this.#C();let t=this.#r.fetch(this.options,e);return e?.throwOnError||(t=t.catch(u.noop)),t}#f(){this.#T();let e=(0,u.resolveStaleTime)(this.options.staleTime,this.#r);if(u.isServer||this.#s.isStale||!(0,u.isValidTimeout)(e))return;let t=(0,u.timeUntilStale)(this.#s.dataUpdatedAt,e);this.#d=o.timeoutManager.setTimeout(()=>{this.#s.isStale||this.updateResult()},t+1)}#S(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#r):this.options.refetchInterval)??!1}#I(e){this.#E(),this.#p=e,!u.isServer&&!1!==(0,u.resolveEnabled)(this.options.enabled,this.#r)&&(0,u.isValidTimeout)(this.#p)&&0!==this.#p&&(this.#h=o.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||i.focusManager.isFocused())&&this.#y()},this.#p))}#m(){this.#f(),this.#I(this.#S())}#T(){this.#d&&(o.timeoutManager.clearTimeout(this.#d),this.#d=void 0)}#E(){this.#h&&(o.timeoutManager.clearInterval(this.#h),this.#h=void 0)}createResult(e,t){let i,r=this.#r,s=this.options,o=this.#s,l=this.#n,d=this.#u,g=e!==r?e.state:this.#a,{state:y}=e,m={...y},T=!1;if(t._optimisticResults){let i=this.hasListeners(),n=!i&&c(e,t),u=i&&h(e,r,t,s);(n||u)&&(m={...m,...(0,a.fetchState)(y.data,e.options)}),"isRestoring"===t._optimisticResults&&(m.fetchStatus="idle")}let{error:E,errorUpdatedAt:C,status:f}=m;i=m.data;let S=!1;if(void 0!==t.placeholderData&&void 0===i&&"pending"===f){let e;o?.isPlaceholderData&&t.placeholderData===d?.placeholderData?(e=o.data,S=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#c?.state.data,this.#c):t.placeholderData,void 0!==e&&(f="success",i=(0,u.replaceData)(o?.data,e,t),T=!0)}if(t.select&&void 0!==i&&!S)if(o&&i===l?.data&&t.select===this.#o)i=this.#l;else try{this.#o=t.select,i=t.select(i),i=(0,u.replaceData)(o?.data,i,t),this.#l=i,this.#t=null}catch(e){this.#t=e}this.#t&&(E=this.#t,i=this.#l,C=Date.now(),f="error");let I="fetching"===m.fetchStatus,v="pending"===f,R="error"===f,q=v&&I,A=void 0!==i,U={status:f,fetchStatus:m.fetchStatus,isPending:v,isSuccess:"success"===f,isError:R,isInitialLoading:q,isLoading:q,data:i,dataUpdatedAt:m.dataUpdatedAt,error:E,errorUpdatedAt:C,failureCount:m.fetchFailureCount,failureReason:m.fetchFailureReason,errorUpdateCount:m.errorUpdateCount,isFetched:m.dataUpdateCount>0||m.errorUpdateCount>0,isFetchedAfterMount:m.dataUpdateCount>g.dataUpdateCount||m.errorUpdateCount>g.errorUpdateCount,isFetching:I,isRefetching:I&&!v,isLoadingError:R&&!A,isPaused:"paused"===m.fetchStatus,isPlaceholderData:T,isRefetchError:R&&A,isStale:p(e,t),refetch:this.refetch,promise:this.#i,isEnabled:!1!==(0,u.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=e=>{"error"===U.status?e.reject(U.error):void 0!==U.data&&e.resolve(U.data)},i=()=>{t(this.#i=U.promise=(0,n.pendingThenable)())},a=this.#i;switch(a.status){case"pending":e.queryHash===r.queryHash&&t(a);break;case"fulfilled":("error"===U.status||U.data!==a.value)&&i();break;case"rejected":("error"!==U.status||U.error!==a.reason)&&i()}}return U}updateResult(){let e=this.#s,t=this.createResult(this.#r,this.options);if(this.#n=this.#r.state,this.#u=this.options,void 0!==this.#n.data&&(this.#c=this.#r),(0,u.shallowEqualObjects)(t,e))return;this.#s=t;let i=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,i="function"==typeof t?t():t;if("all"===i||!i&&!this.#g.size)return!0;let r=new Set(i??this.#g);return this.options.throwOnError&&r.add("error"),Object.keys(this.#s).some(t=>this.#s[t]!==e[t]&&r.has(t))};this.#v({listeners:i()})}#C(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#r)return;let t=this.#r;this.#r=e,this.#a=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#m()}#v(e){r.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#s)}),this.#e.getQueryCache().notify({query:this.#r,type:"observerResultsUpdated"})})}};function c(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&d(e,t,t.refetchOnMount)}function d(e,t,i){if(!1!==(0,u.resolveEnabled)(t.enabled,e)&&"static"!==(0,u.resolveStaleTime)(t.staleTime,e)){let r="function"==typeof i?i(e):i;return"always"===r||!1!==r&&p(e,t)}return!1}function h(e,t,i,r){return(e!==t||!1===(0,u.resolveEnabled)(r.enabled,e))&&(!i.suspense||"error"!==e.state.status)&&p(e,i)}function p(e,t){return!1!==(0,u.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,u.resolveStaleTime)(t.staleTime,e))}e.i(47167);var g=e.i(71645),y=e.i(12598);e.i(43476);var m=g.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),T=g.createContext(!1);T.Provider;var E=(e,t,i)=>t.fetchOptimistic(e).catch(()=>{i.clearReset()});function C(e,t){return function(e,t,i){let a=g.useContext(T),s=g.useContext(m),n=(0,y.useQueryClient)(i),o=n.defaultQueryOptions(e);if(n.getDefaultOptions().queries?._experimental_beforeQuery?.(o),o._optimisticResults=a?"isRestoring":"optimistic",o.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=o.staleTime;o.staleTime="function"==typeof t?(...i)=>e(t(...i)):e(t),"number"==typeof o.gcTime&&(o.gcTime=Math.max(o.gcTime,1e3))}(o.suspense||o.throwOnError||o.experimental_prefetchInRender)&&!s.isReset()&&(o.retryOnMount=!1),g.useEffect(()=>{s.clearReset()},[s]);let l=!n.getQueryCache().get(o.queryHash),[c]=g.useState(()=>new t(n,o)),d=c.getOptimisticResult(o),h=!a&&!1!==e.subscribed;if(g.useSyncExternalStore(g.useCallback(e=>{let t=h?c.subscribe(r.notifyManager.batchCalls(e)):u.noop;return c.updateResult(),t},[c,h]),()=>c.getCurrentResult(),()=>c.getCurrentResult()),g.useEffect(()=>{c.setOptions(o)},[o,c]),o?.suspense&&d.isPending)throw E(o,c,s);if((({result:e,errorResetBoundary:t,throwOnError:i,query:r,suspense:a})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(a&&void 0===e.data||(0,u.shouldThrowError)(i,[e.error,r])))({result:d,errorResetBoundary:s,throwOnError:o.throwOnError,query:n.getQueryCache().get(o.queryHash),suspense:o.suspense}))throw d.error;if(n.getDefaultOptions().queries?._experimental_afterQuery?.(o,d),o.experimental_prefetchInRender&&!u.isServer&&d.isLoading&&d.isFetching&&!a){let e=l?E(o,c,s):n.getQueryCache().get(o.queryHash)?.promise;e?.catch(u.noop).finally(()=>{c.updateResult()})}return o.notifyOnChangeProps?d:c.trackResult(d)}(e,l,t)}e.s(["useQuery",()=>C],66027)},54616,e=>{"use strict";var t=e.i(71645),i=e.i(14272),r=e.i(40143),a=e.i(15823),s=e.i(19273),n=class extends a.Subscribable{#e;#s=void 0;#R;#q;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#A()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,s.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#R,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,s.hashKey)(t.mutationKey)!==(0,s.hashKey)(this.options.mutationKey)?this.reset():this.#R?.state.status==="pending"&&this.#R.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#R?.removeObserver(this)}onMutationUpdate(e){this.#A(),this.#v(e)}getCurrentResult(){return this.#s}reset(){this.#R?.removeObserver(this),this.#R=void 0,this.#A(),this.#v()}mutate(e,t){return this.#q=t,this.#R?.removeObserver(this),this.#R=this.#e.getMutationCache().build(this.#e,this.options),this.#R.addObserver(this),this.#R.execute(e)}#A(){let e=this.#R?.state??(0,i.getDefaultState)();this.#s={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#v(e){r.notifyManager.batch(()=>{if(this.#q&&this.hasListeners()){let t=this.#s.variables,i=this.#s.context,r={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#q.onSuccess?.(e.data,t,i,r),this.#q.onSettled?.(e.data,null,t,i,r)):e?.type==="error"&&(this.#q.onError?.(e.error,t,i,r),this.#q.onSettled?.(void 0,e.error,t,i,r))}this.listeners.forEach(e=>{e(this.#s)})})}},u=e.i(12598);function o(e,i){let a=(0,u.useQueryClient)(i),[o]=t.useState(()=>new n(a,e));t.useEffect(()=>{o.setOptions(e)},[o,e]);let l=t.useSyncExternalStore(t.useCallback(e=>o.subscribe(r.notifyManager.batchCalls(e)),[o]),()=>o.getCurrentResult(),()=>o.getCurrentResult()),c=t.useCallback((e,t)=>{o.mutate(e,t).catch(s.noop)},[o]);if(l.error&&(0,s.shouldThrowError)(o.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:c,mutateAsync:l.mutate}}e.s(["useMutation",()=>o],54616)},4018,e=>{"use strict";e.i(11643);var t=e.i(85056);let i=t.gql`
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
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
      plainPin
    }
  }
`,r=t.gql`
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
`,a=t.gql`
  mutation DeleteStore($id: String!) {
    deleteStore(id: $id)
  }
`,s=t.gql`
  mutation ToggleStoreActive($id: String!) {
    toggleStoreActive(id: $id) {
      id
      name
      active
    }
  }
`,n=t.gql`
  query GetStoreStatistics($filters: StoreFiltersInput) {
    storeStatistics(filters: $filters) {
      total
      active
      inactive
      byType {
        restaurant
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
`,u=t.gql`
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
        type
        city
        address
        placeId
        lat
        lng
        phoneNumber
        categoryIds
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
`,o=t.gql`
  query GetStoreById($id: String!) {
    store(id: $id) {
      id
      name
      description
      imageUrl
      image1Url
      image2Url
      image3Url
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
      categoryIds
      tags
      restrictions
      pin
      plainPin
      averageRating
      reviewCounter
      additionalInfo
      createdAt
      updatedAt
    }
  }
`,l=t.gql`
  query GetStorePin($id: String!) {
    storePin(id: $id)
  }
`,c=t.gql`
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
        availableDaysAndTimes
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
`,d=t.gql`
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
`,h=t.gql`
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
`,p=t.gql`
  mutation DeleteDiscount($id: String!) {
    deleteDiscount(id: $id)
  }
`,g=t.gql`
  query GetStoreCoupons(
    $filters: CouponFiltersInput
    $pagination: PaginationInput
  ) {
    coupons(filters: $filters, pagination: $pagination) {
      data {
        id
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
`,y=t.gql`
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
`,m=t.gql`
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
`,T=t.gql`
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
`;t.gql`
  query GetCatalogItems($catalogId: String!) {
    catalogItems(catalogId: $catalogId) {
      id
      catalogId
      name
      url
    }
  }
`,t.gql`
  mutation CreateCatalogItem($input: CreateCatalogItemInput!) {
    createCatalogItem(input: $input) {
      id
      catalogId
      name
      url
    }
  }
`;let E=t.gql`
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
`,C=t.gql`
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
        value
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
`,f=`
  mutation ResendStorePinEmail($id: String!, $email: String!) {
    resendStorePinEmail(id: $id, email: $email)
  }
`,S=t.gql`
  query GetCategoriesByName($name: String!, $pagination: PaginationInput) {
    categories(filters: { name: $name }, pagination: $pagination) {
      data {
        id
        name
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
`,I=t.gql`
  query GetCategoriesByStoreType(
    $storeType: String
    $name: String
    $pagination: PaginationInput
  ) {
    categories(
      filters: { storeType: $storeType, name: $name }
      pagination: $pagination
    ) {
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
`,v=t.gql`
  query GetCategories(
    $filters: CategoryFiltersInput
    $pagination: PaginationInput
  ) {
    categories(filters: $filters, pagination: $pagination) {
      data {
        id
        name
        iconUrl
        storeType
        isActive
        createdAt
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
`,R=`
  id
  name
  entityType
  entityId
  count
  points
  isActive
  expiresAt
  createdAt
  updatedAt
`,q=t.gql`
  query GetChallenges($isActive: Boolean, $entityType: String) {
    challenges(isActive: $isActive, entityType: $entityType) {
      ${R}
    }
  }
`;t.gql`
  query GetChallenge($id: String!) {
    challenge(id: $id) {
      ${R}
    }
  }
`;let A=t.gql`
  mutation CreateChallenge($input: CreateChallengeInput!) {
    createChallenge(input: $input) {
      ${R}
    }
  }
`,U=t.gql`
  mutation UpdateChallenge($id: String!, $input: UpdateChallengeInput!) {
    updateChallenge(id: $id, input: $input) {
      ${R}
    }
  }
`,O=t.gql`
  mutation DeleteChallenge($id: String!) {
    deleteChallenge(id: $id) {
      message
    }
  }
`,_=`
  id
  userId
  storeId
  imageUrl
  status
  rejectionNote
  likes
  createdAt
  user {
    id
    displayName
    avatarUrl
    email
  }
  store {
    id
    name
    city
  }
`,b=t.gql`
  query MuralModerationQueue($input: MuralModerationQueueInput) {
    muralModerationQueue(input: $input) {
      posts {
        ${_}
      }
      total
      page
      hasMore
    }
  }
`,Q=t.gql`
  mutation ModerateMuralPost($id: ID!, $input: ModerateMuralPostInput!) {
    moderateMuralPost(id: $id, input: $input) {
      id
      status
      rejectionNote
    }
  }
`,$=t.gql`
  query GetAdminReviews(
    $filters: ReviewFiltersInput
    $pagination: ReviewPaginationInput
  ) {
    reviews(filters: $filters, pagination: $pagination) {
      data {
        id
        storeId
        userId
        title
        description
        rating
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
`,M=t.gql`
  query GetCategoryById($id: String!) {
    category(id: $id) {
      id
      name
      iconUrl
      storeType
      isActive
      createdAt
    }
  }
`,D=t.gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      iconUrl
      storeType
      isActive
      createdAt
    }
  }
`,P=t.gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      iconUrl
      storeType
      isActive
      createdAt
    }
  }
`,w=t.gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`,G=t.gql`
  mutation AdminDeleteReview($id: String!) {
    adminDeleteReview(id: $id)
  }
`;e.s(["ADMIN_DELETE_REVIEW_MUTATION",0,G,"CREATE_CATALOG",0,m,"CREATE_CATEGORY_MUTATION",0,D,"CREATE_CHALLENGE_MUTATION",0,A,"CREATE_DISCOUNT",0,d,"CREATE_STORE_MUTATION",0,i,"DELETE_CATEGORY_MUTATION",0,w,"DELETE_CHALLENGE_MUTATION",0,O,"DELETE_DISCOUNT",0,p,"DELETE_STORE_MUTATION",0,a,"GET_ADMIN_REVIEWS",0,$,"GET_ALL_STORES",0,u,"GET_CATEGORIES_BY_NAME_QUERY",0,S,"GET_CATEGORIES_BY_STORE_TYPE_QUERY",0,I,"GET_CATEGORIES_QUERY",0,v,"GET_CATEGORY_BY_ID_QUERY",0,M,"GET_CHALLENGES_QUERY",0,q,"GET_MURAL_MODERATION_QUEUE",0,b,"GET_STORE_BY_ID",0,o,"GET_STORE_CATALOGS",0,y,"GET_STORE_COUPONS",0,g,"GET_STORE_DISCOUNTS",0,c,"GET_STORE_PIN",0,l,"GET_STORE_STATISTICS",0,n,"GET_USERS",0,E,"GET_USER_DETAILS_WITH_ACTIVITY",0,C,"MODERATE_MURAL_POST_MUTATION",0,Q,"RESEND_STORE_PIN_EMAIL",0,f,"TOGGLE_STORE_ACTIVE_MUTATION",0,s,"UPDATE_CATALOG",0,T,"UPDATE_CATEGORY_MUTATION",0,P,"UPDATE_CHALLENGE_MUTATION",0,U,"UPDATE_DISCOUNT",0,h,"UPDATE_STORE_MUTATION",0,r])},45984,e=>{"use strict";var t=e.i(54616),i=e.i(66027),r=e.i(12598),a=e.i(97903),s=e.i(4018);function n(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>{let t=Object.fromEntries(Object.entries(e).filter(([e,t])=>""!==t&&null!=t));return(await a.graphqlClient.request(s.CREATE_STORE_MUTATION,{input:t})).createStore},onSuccess:()=>{e.invalidateQueries({queryKey:["stores"]}),e.invalidateQueries({queryKey:["store-statistics"]})}})}function u(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async({id:e,input:t})=>(await a.graphqlClient.request(s.UPDATE_STORE_MUTATION,{id:e,input:t})).updateStore,onSuccess:(t,i)=>{e.invalidateQueries({queryKey:["stores"]}),e.invalidateQueries({queryKey:["store",i.id]}),e.invalidateQueries({queryKey:["store-pin",i.id]}),e.invalidateQueries({queryKey:["store-statistics"]})}})}function o(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.DELETE_STORE_MUTATION,{id:e})).deleteStore,onSuccess:()=>{e.invalidateQueries({queryKey:["stores"]}),e.invalidateQueries({queryKey:["store-statistics"]})}})}function l(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.TOGGLE_STORE_ACTIVE_MUTATION,{id:e})).toggleStoreActive,onSuccess:(t,i)=>{e.invalidateQueries({queryKey:["stores"]}),e.invalidateQueries({queryKey:["store",i]}),e.invalidateQueries({queryKey:["store-statistics"]})}})}function c(e){return(0,i.useQuery)({queryKey:["store-statistics",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_STORE_STATISTICS,{filters:e})).storeStatistics})}function d(e,t){return(0,i.useQuery)({queryKey:["stores",e,t],queryFn:async()=>(await a.graphqlClient.request(s.GET_ALL_STORES,{filters:e,pagination:t})).stores})}function h(e){return(0,i.useQuery)({queryKey:["store",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_STORE_BY_ID,{id:e})).store,enabled:!!e})}function p(e,t,r){return(0,i.useQuery)({queryKey:["discounts",e,t],queryFn:async()=>(await a.graphqlClient.request(s.GET_STORE_DISCOUNTS,{filters:e,pagination:t})).discounts,enabled:r?.enabled!==!1})}function g(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.CREATE_DISCOUNT,{input:e})).createDiscount,onSuccess:()=>{e.invalidateQueries({queryKey:["discounts"]})}})}function y(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async({id:e,input:t})=>(await a.graphqlClient.request(s.UPDATE_DISCOUNT,{id:e,input:t})).updateDiscount,onSuccess:()=>{e.invalidateQueries({queryKey:["discounts"]})}})}function m(e,t,r){return(0,i.useQuery)({queryKey:["store-coupons",e,t],queryFn:async()=>(await a.graphqlClient.request(s.GET_STORE_COUPONS,{filters:e,pagination:t})).coupons,enabled:r?.enabled!==!1&&(!!e?.storeId||!!e?.storeIds?.length||r?.enabled===!0)})}function T(e){let t=(0,i.useQuery)({queryKey:["store-coupon-counts-total",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_STORE_COUPONS,{filters:{storeIds:e,includeExpired:!0},pagination:{page:1,first:1e3}})).coupons,enabled:e.length>0}),r=(0,i.useQuery)({queryKey:["store-coupon-counts-redeemed",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_STORE_COUPONS,{filters:{storeIds:e,used:!0,includeExpired:!0},pagination:{page:1,first:1e3}})).coupons,enabled:e.length>0}),n=new Map,u=new Map;for(let e of t.data?.data??[])n.set(e.storeId,(n.get(e.storeId)??0)+1);for(let e of r.data?.data??[])u.set(e.storeId,(u.get(e.storeId)??0)+1);return{totalByStore:n,redeemedByStore:u,isLoading:t.isLoading||r.isLoading}}function E(e){return(0,i.useQuery)({queryKey:["catalogs",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_STORE_CATALOGS,{storeId:e})).storeCatalogs.data,enabled:!!e})}function C(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.CREATE_CATALOG,{input:e})).createCatalog,onSuccess:(t,i)=>{e.invalidateQueries({queryKey:["catalogs",i.storeId]})}})}function f(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.UPDATE_CATALOG,{input:e})).updateCatalog,onSuccess:t=>{e.invalidateQueries({queryKey:["catalogs",t.storeId]})}})}function S(e,t,r,n){return(0,i.useQuery)({queryKey:["users",e,t,r,n],queryFn:async()=>(await a.graphqlClient.request(s.GET_USERS,{page:e,first:t,includeDisabled:r,search:n})).users})}function I(e){return(0,i.useQuery)({queryKey:["user-details",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_USER_DETAILS_WITH_ACTIVITY,{userId:e})).userDetailsWithActivity,enabled:!!e})}function v(){return(0,t.useMutation)({mutationFn:async e=>a.graphqlClient.request(s.RESEND_STORE_PIN_EMAIL,e)})}function R(e,t){return(0,i.useQuery)({queryKey:["categories",e,t],queryFn:async()=>(await a.graphqlClient.request(s.GET_CATEGORIES_QUERY,{filters:e,pagination:t})).categories})}function q(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.CREATE_CATEGORY_MUTATION,{input:e})).createCategory,onSuccess:()=>{e.invalidateQueries({queryKey:["categories"]}),e.invalidateQueries({queryKey:["categories-by-name"]}),e.invalidateQueries({queryKey:["categories-by-store-type"]})}})}function A(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async({id:e,input:t})=>(await a.graphqlClient.request(s.UPDATE_CATEGORY_MUTATION,{id:e,input:t})).updateCategory,onSuccess:(t,i)=>{e.invalidateQueries({queryKey:["categories"]}),e.invalidateQueries({queryKey:["category",i.id]}),e.invalidateQueries({queryKey:["categories-by-name"]}),e.invalidateQueries({queryKey:["categories-by-store-type"]})}})}function U(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.DELETE_CATEGORY_MUTATION,{id:e})).deleteCategory,onSuccess:()=>{e.invalidateQueries({queryKey:["categories"]}),e.invalidateQueries({queryKey:["categories-by-name"]}),e.invalidateQueries({queryKey:["categories-by-store-type"]})}})}function O(e){return(0,i.useQuery)({queryKey:["challenges",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_CHALLENGES_QUERY,e)).challenges})}function _(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.CREATE_CHALLENGE_MUTATION,{input:e})).createChallenge,onSuccess:()=>{e.invalidateQueries({queryKey:["challenges"]})}})}function b(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async({id:e,input:t})=>(await a.graphqlClient.request(s.UPDATE_CHALLENGE_MUTATION,{id:e,input:t})).updateChallenge,onSuccess:()=>{e.invalidateQueries({queryKey:["challenges"]})}})}function Q(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async e=>(await a.graphqlClient.request(s.DELETE_CHALLENGE_MUTATION,{id:e})).deleteChallenge,onSuccess:()=>{e.invalidateQueries({queryKey:["challenges"]})}})}function $(e){return(0,i.useQuery)({queryKey:["muralModerationQueue",e],queryFn:async()=>(await a.graphqlClient.request(s.GET_MURAL_MODERATION_QUEUE,{input:e})).muralModerationQueue,staleTime:3e4})}function M(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async({id:e,input:t})=>(await a.graphqlClient.request(s.MODERATE_MURAL_POST_MUTATION,{id:e,input:t})).moderateMuralPost,onSuccess:()=>{e.invalidateQueries({queryKey:["muralModerationQueue"]})}})}function D(e){return(0,i.useQuery)({queryKey:["adminReviews",e],queryFn:async()=>{let t={};return e.storeId&&(t.storeId=e.storeId),e.userId&&(t.userId=e.userId),(await a.graphqlClient.request(s.GET_ADMIN_REVIEWS,{filters:Object.keys(t).length?t:void 0,pagination:{page:e.page??1,first:e.pageSize??20}})).reviews},staleTime:3e4})}function P(){let e=(0,r.useQueryClient)();return(0,t.useMutation)({mutationFn:async({id:e})=>(await a.graphqlClient.request(s.ADMIN_DELETE_REVIEW_MUTATION,{id:e})).adminDeleteReview,onSuccess:()=>{e.invalidateQueries({queryKey:["adminReviews"]})}})}e.s(["useAdminDeleteReview",()=>P,"useAdminReviews",()=>D,"useCategories",()=>R,"useChallenges",()=>O,"useCreateCatalog",()=>C,"useCreateCategory",()=>q,"useCreateChallenge",()=>_,"useCreateDiscount",()=>g,"useCreateStore",()=>n,"useDeleteCategory",()=>U,"useDeleteChallenge",()=>Q,"useDeleteStore",()=>o,"useModerateMuralPost",()=>M,"useMuralModerationQueue",()=>$,"useResendStorePinEmail",()=>v,"useStore",()=>h,"useStoreCatalogs",()=>E,"useStoreCouponCounts",()=>T,"useStoreCoupons",()=>m,"useStoreDiscounts",()=>p,"useStoreStatistics",()=>c,"useStores",()=>d,"useToggleStoreActive",()=>l,"useUpdateCatalog",()=>f,"useUpdateCategory",()=>A,"useUpdateChallenge",()=>b,"useUpdateDiscount",()=>y,"useUpdateStore",()=>u,"useUserDetailsWithActivity",()=>I,"useUsers",()=>S])}]);