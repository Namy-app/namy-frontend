(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,66027,t=>{"use strict";let e;var r=t.i(75555),n=t.i(40143),i=t.i(86491),s=t.i(15823),o=t.i(93803),a=t.i(19273),u=t.i(80166),l=class extends s.Subscribable{constructor(t,e){super(),this.options=e,this.#t=t,this.#e=null,this.#r=(0,o.pendingThenable)(),this.bindMethods(),this.setOptions(e)}#t;#n=void 0;#i=void 0;#s=void 0;#o;#a;#r;#e;#u;#l;#c;#h;#f;#p;#d=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#n.addObserver(this),c(this.#n,this.options)?this.#y():this.updateResult(),this.#g())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return h(this.#n,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return h(this.#n,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#b(),this.#m(),this.#n.removeObserver(this)}setOptions(t){let e=this.options,r=this.#n;if(this.options=this.#t.defaultQueryOptions(t),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,a.resolveEnabled)(this.options.enabled,this.#n))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#v(),this.#n.setOptions(this.options),e._defaulted&&!(0,a.shallowEqualObjects)(this.options,e)&&this.#t.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#n,observer:this});let n=this.hasListeners();n&&f(this.#n,r,this.options,e)&&this.#y(),this.updateResult(),n&&(this.#n!==r||(0,a.resolveEnabled)(this.options.enabled,this.#n)!==(0,a.resolveEnabled)(e.enabled,this.#n)||(0,a.resolveStaleTime)(this.options.staleTime,this.#n)!==(0,a.resolveStaleTime)(e.staleTime,this.#n))&&this.#w();let i=this.#I();n&&(this.#n!==r||(0,a.resolveEnabled)(this.options.enabled,this.#n)!==(0,a.resolveEnabled)(e.enabled,this.#n)||i!==this.#p)&&this.#S(i)}getOptimisticResult(t){var e,r;let n=this.#t.getQueryCache().build(this.#t,t),i=this.createResult(n,t);return e=this,r=i,(0,a.shallowEqualObjects)(e.getCurrentResult(),r)||(this.#s=i,this.#a=this.options,this.#o=this.#n.state),i}getCurrentResult(){return this.#s}trackResult(t,e){return new Proxy(t,{get:(t,r)=>(this.trackProp(r),e?.(r),"promise"===r&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#r.status||this.#r.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(t,r))})}trackProp(t){this.#d.add(t)}getCurrentQuery(){return this.#n}refetch({...t}={}){return this.fetch({...t})}fetchOptimistic(t){let e=this.#t.defaultQueryOptions(t),r=this.#t.getQueryCache().build(this.#t,e);return r.fetch().then(()=>this.createResult(r,e))}fetch(t){return this.#y({...t,cancelRefetch:t.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#s))}#y(t){this.#v();let e=this.#n.fetch(this.options,t);return t?.throwOnError||(e=e.catch(a.noop)),e}#w(){this.#b();let t=(0,a.resolveStaleTime)(this.options.staleTime,this.#n);if(a.isServer||this.#s.isStale||!(0,a.isValidTimeout)(t))return;let e=(0,a.timeUntilStale)(this.#s.dataUpdatedAt,t);this.#h=u.timeoutManager.setTimeout(()=>{this.#s.isStale||this.updateResult()},e+1)}#I(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#n):this.options.refetchInterval)??!1}#S(t){this.#m(),this.#p=t,!a.isServer&&!1!==(0,a.resolveEnabled)(this.options.enabled,this.#n)&&(0,a.isValidTimeout)(this.#p)&&0!==this.#p&&(this.#f=u.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||r.focusManager.isFocused())&&this.#y()},this.#p))}#g(){this.#w(),this.#S(this.#I())}#b(){this.#h&&(u.timeoutManager.clearTimeout(this.#h),this.#h=void 0)}#m(){this.#f&&(u.timeoutManager.clearInterval(this.#f),this.#f=void 0)}createResult(t,e){let r,n=this.#n,s=this.options,u=this.#s,l=this.#o,h=this.#a,d=t!==n?t.state:this.#i,{state:y}=t,g={...y},b=!1;if(e._optimisticResults){let r=this.hasListeners(),o=!r&&c(t,e),a=r&&f(t,n,e,s);(o||a)&&(g={...g,...(0,i.fetchState)(y.data,t.options)}),"isRestoring"===e._optimisticResults&&(g.fetchStatus="idle")}let{error:m,errorUpdatedAt:v,status:w}=g;r=g.data;let I=!1;if(void 0!==e.placeholderData&&void 0===r&&"pending"===w){let t;u?.isPlaceholderData&&e.placeholderData===h?.placeholderData?(t=u.data,I=!0):t="function"==typeof e.placeholderData?e.placeholderData(this.#c?.state.data,this.#c):e.placeholderData,void 0!==t&&(w="success",r=(0,a.replaceData)(u?.data,t,e),b=!0)}if(e.select&&void 0!==r&&!I)if(u&&r===l?.data&&e.select===this.#u)r=this.#l;else try{this.#u=e.select,r=e.select(r),r=(0,a.replaceData)(u?.data,r,e),this.#l=r,this.#e=null}catch(t){this.#e=t}this.#e&&(m=this.#e,r=this.#l,v=Date.now(),w="error");let S="fetching"===g.fetchStatus,E="pending"===w,R="error"===w,A=E&&S,C=void 0!==r,O={status:w,fetchStatus:g.fetchStatus,isPending:E,isSuccess:"success"===w,isError:R,isInitialLoading:A,isLoading:A,data:r,dataUpdatedAt:g.dataUpdatedAt,error:m,errorUpdatedAt:v,failureCount:g.fetchFailureCount,failureReason:g.fetchFailureReason,errorUpdateCount:g.errorUpdateCount,isFetched:g.dataUpdateCount>0||g.errorUpdateCount>0,isFetchedAfterMount:g.dataUpdateCount>d.dataUpdateCount||g.errorUpdateCount>d.errorUpdateCount,isFetching:S,isRefetching:S&&!E,isLoadingError:R&&!C,isPaused:"paused"===g.fetchStatus,isPlaceholderData:b,isRefetchError:R&&C,isStale:p(t,e),refetch:this.refetch,promise:this.#r,isEnabled:!1!==(0,a.resolveEnabled)(e.enabled,t)};if(this.options.experimental_prefetchInRender){let e=t=>{"error"===O.status?t.reject(O.error):void 0!==O.data&&t.resolve(O.data)},r=()=>{e(this.#r=O.promise=(0,o.pendingThenable)())},i=this.#r;switch(i.status){case"pending":t.queryHash===n.queryHash&&e(i);break;case"fulfilled":("error"===O.status||O.data!==i.value)&&r();break;case"rejected":("error"!==O.status||O.error!==i.reason)&&r()}}return O}updateResult(){let t=this.#s,e=this.createResult(this.#n,this.options);if(this.#o=this.#n.state,this.#a=this.options,void 0!==this.#o.data&&(this.#c=this.#n),(0,a.shallowEqualObjects)(e,t))return;this.#s=e;let r=()=>{if(!t)return!0;let{notifyOnChangeProps:e}=this.options,r="function"==typeof e?e():e;if("all"===r||!r&&!this.#d.size)return!0;let n=new Set(r??this.#d);return this.options.throwOnError&&n.add("error"),Object.keys(this.#s).some(e=>this.#s[e]!==t[e]&&n.has(e))};this.#E({listeners:r()})}#v(){let t=this.#t.getQueryCache().build(this.#t,this.options);if(t===this.#n)return;let e=this.#n;this.#n=t,this.#i=t.state,this.hasListeners()&&(e?.removeObserver(this),t.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#g()}#E(t){n.notifyManager.batch(()=>{t.listeners&&this.listeners.forEach(t=>{t(this.#s)}),this.#t.getQueryCache().notify({query:this.#n,type:"observerResultsUpdated"})})}};function c(t,e){return!1!==(0,a.resolveEnabled)(e.enabled,t)&&void 0===t.state.data&&("error"!==t.state.status||!1!==e.retryOnMount)||void 0!==t.state.data&&h(t,e,e.refetchOnMount)}function h(t,e,r){if(!1!==(0,a.resolveEnabled)(e.enabled,t)&&"static"!==(0,a.resolveStaleTime)(e.staleTime,t)){let n="function"==typeof r?r(t):r;return"always"===n||!1!==n&&p(t,e)}return!1}function f(t,e,r,n){return(t!==e||!1===(0,a.resolveEnabled)(n.enabled,t))&&(!r.suspense||"error"!==t.state.status)&&p(t,r)}function p(t,e){return!1!==(0,a.resolveEnabled)(e.enabled,t)&&t.isStaleByTime((0,a.resolveStaleTime)(e.staleTime,t))}t.i(47167);var d=t.i(71645),y=t.i(12598);t.i(43476);var g=d.createContext((e=!1,{clearReset:()=>{e=!1},reset:()=>{e=!0},isReset:()=>e})),b=d.createContext(!1);b.Provider;var m=(t,e,r)=>e.fetchOptimistic(t).catch(()=>{r.clearReset()});function v(t,e){return function(t,e,r){let i=d.useContext(b),s=d.useContext(g),o=(0,y.useQueryClient)(r),u=o.defaultQueryOptions(t);if(o.getDefaultOptions().queries?._experimental_beforeQuery?.(u),u._optimisticResults=i?"isRestoring":"optimistic",u.suspense){let t=t=>"static"===t?t:Math.max(t??1e3,1e3),e=u.staleTime;u.staleTime="function"==typeof e?(...r)=>t(e(...r)):t(e),"number"==typeof u.gcTime&&(u.gcTime=Math.max(u.gcTime,1e3))}(u.suspense||u.throwOnError||u.experimental_prefetchInRender)&&!s.isReset()&&(u.retryOnMount=!1),d.useEffect(()=>{s.clearReset()},[s]);let l=!o.getQueryCache().get(u.queryHash),[c]=d.useState(()=>new e(o,u)),h=c.getOptimisticResult(u),f=!i&&!1!==t.subscribed;if(d.useSyncExternalStore(d.useCallback(t=>{let e=f?c.subscribe(n.notifyManager.batchCalls(t)):a.noop;return c.updateResult(),e},[c,f]),()=>c.getCurrentResult(),()=>c.getCurrentResult()),d.useEffect(()=>{c.setOptions(u)},[u,c]),u?.suspense&&h.isPending)throw m(u,c,s);if((({result:t,errorResetBoundary:e,throwOnError:r,query:n,suspense:i})=>t.isError&&!e.isReset()&&!t.isFetching&&n&&(i&&void 0===t.data||(0,a.shouldThrowError)(r,[t.error,n])))({result:h,errorResetBoundary:s,throwOnError:u.throwOnError,query:o.getQueryCache().get(u.queryHash),suspense:u.suspense}))throw h.error;if(o.getDefaultOptions().queries?._experimental_afterQuery?.(u,h),u.experimental_prefetchInRender&&!a.isServer&&h.isLoading&&h.isFetching&&!i){let t=l?m(u,c,s):o.getQueryCache().get(u.queryHash)?.promise;t?.catch(a.noop).finally(()=>{c.updateResult()})}return u.notifyOnChangeProps?h:c.trackResult(h)}(t,l,e)}t.s(["useQuery",()=>v],66027)},54616,t=>{"use strict";var e=t.i(71645),r=t.i(14272),n=t.i(40143),i=t.i(15823),s=t.i(19273),o=class extends i.Subscribable{#t;#s=void 0;#R;#A;constructor(t,e){super(),this.#t=t,this.setOptions(e),this.bindMethods(),this.#C()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(t){let e=this.options;this.options=this.#t.defaultMutationOptions(t),(0,s.shallowEqualObjects)(this.options,e)||this.#t.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#R,observer:this}),e?.mutationKey&&this.options.mutationKey&&(0,s.hashKey)(e.mutationKey)!==(0,s.hashKey)(this.options.mutationKey)?this.reset():this.#R?.state.status==="pending"&&this.#R.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#R?.removeObserver(this)}onMutationUpdate(t){this.#C(),this.#E(t)}getCurrentResult(){return this.#s}reset(){this.#R?.removeObserver(this),this.#R=void 0,this.#C(),this.#E()}mutate(t,e){return this.#A=e,this.#R?.removeObserver(this),this.#R=this.#t.getMutationCache().build(this.#t,this.options),this.#R.addObserver(this),this.#R.execute(t)}#C(){let t=this.#R?.state??(0,r.getDefaultState)();this.#s={...t,isPending:"pending"===t.status,isSuccess:"success"===t.status,isError:"error"===t.status,isIdle:"idle"===t.status,mutate:this.mutate,reset:this.reset}}#E(t){n.notifyManager.batch(()=>{if(this.#A&&this.hasListeners()){let e=this.#s.variables,r=this.#s.context,n={client:this.#t,meta:this.options.meta,mutationKey:this.options.mutationKey};t?.type==="success"?(this.#A.onSuccess?.(t.data,e,r,n),this.#A.onSettled?.(t.data,null,e,r,n)):t?.type==="error"&&(this.#A.onError?.(t.error,e,r,n),this.#A.onSettled?.(void 0,t.error,e,r,n))}this.listeners.forEach(t=>{t(this.#s)})})}},a=t.i(12598);function u(t,r){let i=(0,a.useQueryClient)(r),[u]=e.useState(()=>new o(i,t));e.useEffect(()=>{u.setOptions(t)},[u,t]);let l=e.useSyncExternalStore(e.useCallback(t=>u.subscribe(n.notifyManager.batchCalls(t)),[u]),()=>u.getCurrentResult(),()=>u.getCurrentResult()),c=e.useCallback((t,e)=>{u.mutate(t,e).catch(s.noop)},[u]);if(l.error&&(0,s.shouldThrowError)(u.options.throwOnError,[l.error]))throw l.error;return{...l,mutate:c,mutateAsync:l.mutate}}t.s(["useMutation",()=>u],54616)},39616,t=>{"use strict";let e=(0,t.i(75254).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);t.s(["Settings",()=>e],39616)},8402,t=>{"use strict";let e=(0,t.i(75254).default)("ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]]);t.s(["Ticket",()=>e],8402)},84614,t=>{"use strict";let e=(0,t.i(75254).default)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);t.s(["User",()=>e],84614)},90571,t=>{"use strict";var e=function(t,r){return(e=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(t,r)};function r(t,r){if("function"!=typeof r&&null!==r)throw TypeError("Class extends value "+String(r)+" is not a constructor or null");function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}var n=function(){return(n=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var i in e=arguments[r])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)};function i(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&0>e.indexOf(n)&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,n=Object.getOwnPropertySymbols(t);i<n.length;i++)0>e.indexOf(n[i])&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(r[n[i]]=t[n[i]]);return r}"function"==typeof SuppressedError&&SuppressedError,t.s(["__assign",()=>n,"__extends",()=>r,"__rest",()=>i])},64659,t=>{"use strict";let e=(0,t.i(75254).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);t.s(["ChevronDown",()=>e],64659)},67034,(t,e,r)=>{var n={675:function(t,e){"use strict";e.byteLength=function(t){var e=u(t),r=e[0],n=e[1];return(r+n)*3/4-n},e.toByteArray=function(t){var e,r,s=u(t),o=s[0],a=s[1],l=new i((o+a)*3/4-a),c=0,h=a>0?o-4:o;for(r=0;r<h;r+=4)e=n[t.charCodeAt(r)]<<18|n[t.charCodeAt(r+1)]<<12|n[t.charCodeAt(r+2)]<<6|n[t.charCodeAt(r+3)],l[c++]=e>>16&255,l[c++]=e>>8&255,l[c++]=255&e;return 2===a&&(e=n[t.charCodeAt(r)]<<2|n[t.charCodeAt(r+1)]>>4,l[c++]=255&e),1===a&&(e=n[t.charCodeAt(r)]<<10|n[t.charCodeAt(r+1)]<<4|n[t.charCodeAt(r+2)]>>2,l[c++]=e>>8&255,l[c++]=255&e),l},e.fromByteArray=function(t){for(var e,n=t.length,i=n%3,s=[],o=0,a=n-i;o<a;o+=16383)s.push(function(t,e,n){for(var i,s=[],o=e;o<n;o+=3)i=(t[o]<<16&0xff0000)+(t[o+1]<<8&65280)+(255&t[o+2]),s.push(r[i>>18&63]+r[i>>12&63]+r[i>>6&63]+r[63&i]);return s.join("")}(t,o,o+16383>a?a:o+16383));return 1===i?s.push(r[(e=t[n-1])>>2]+r[e<<4&63]+"=="):2===i&&s.push(r[(e=(t[n-2]<<8)+t[n-1])>>10]+r[e>>4&63]+r[e<<2&63]+"="),s.join("")};for(var r=[],n=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=0,a=s.length;o<a;++o)r[o]=s[o],n[s.charCodeAt(o)]=o;function u(t){var e=t.length;if(e%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");-1===r&&(r=e);var n=r===e?0:4-r%4;return[r,n]}n[45]=62,n[95]=63},72:function(t,e,r){"use strict";var n=r(675),i=r(783),s="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function o(t){if(t>0x7fffffff)throw RangeError('The value "'+t+'" is invalid for option "size"');var e=new Uint8Array(t);return Object.setPrototypeOf(e,a.prototype),e}function a(t,e,r){if("number"==typeof t){if("string"==typeof e)throw TypeError('The "string" argument must be of type string. Received type number');return c(t)}return u(t,e,r)}function u(t,e,r){if("string"==typeof t){var n=t,i=e;if(("string"!=typeof i||""===i)&&(i="utf8"),!a.isEncoding(i))throw TypeError("Unknown encoding: "+i);var s=0|p(n,i),u=o(s),l=u.write(n,i);return l!==s&&(u=u.slice(0,l)),u}if(ArrayBuffer.isView(t))return h(t);if(null==t)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(B(t,ArrayBuffer)||t&&B(t.buffer,ArrayBuffer)||"undefined"!=typeof SharedArrayBuffer&&(B(t,SharedArrayBuffer)||t&&B(t.buffer,SharedArrayBuffer)))return function(t,e,r){var n;if(e<0||t.byteLength<e)throw RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),a.prototype),n}(t,e,r);if("number"==typeof t)throw TypeError('The "value" argument must not be of type number. Received type number');var c=t.valueOf&&t.valueOf();if(null!=c&&c!==t)return a.from(c,e,r);var d=function(t){if(a.isBuffer(t)){var e=0|f(t.length),r=o(e);return 0===r.length||t.copy(r,0,0,e),r}return void 0!==t.length?"number"!=typeof t.length||function(t){return t!=t}(t.length)?o(0):h(t):"Buffer"===t.type&&Array.isArray(t.data)?h(t.data):void 0}(t);if(d)return d;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return a.from(t[Symbol.toPrimitive]("string"),e,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function l(t){if("number"!=typeof t)throw TypeError('"size" argument must be of type number');if(t<0)throw RangeError('The value "'+t+'" is invalid for option "size"')}function c(t){return l(t),o(t<0?0:0|f(t))}function h(t){for(var e=t.length<0?0:0|f(t.length),r=o(e),n=0;n<e;n+=1)r[n]=255&t[n];return r}e.Buffer=a,e.SlowBuffer=function(t){return+t!=t&&(t=0),a.alloc(+t)},e.INSPECT_MAX_BYTES=50,e.kMaxLength=0x7fffffff,a.TYPED_ARRAY_SUPPORT=function(){try{var t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return!1}}(),a.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(a.prototype,"parent",{enumerable:!0,get:function(){if(a.isBuffer(this))return this.buffer}}),Object.defineProperty(a.prototype,"offset",{enumerable:!0,get:function(){if(a.isBuffer(this))return this.byteOffset}}),a.poolSize=8192,a.from=function(t,e,r){return u(t,e,r)},Object.setPrototypeOf(a.prototype,Uint8Array.prototype),Object.setPrototypeOf(a,Uint8Array),a.alloc=function(t,e,r){return(l(t),t<=0)?o(t):void 0!==e?"string"==typeof r?o(t).fill(e,r):o(t).fill(e):o(t)},a.allocUnsafe=function(t){return c(t)},a.allocUnsafeSlow=function(t){return c(t)};function f(t){if(t>=0x7fffffff)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|t}function p(t,e){if(a.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||B(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);var r=t.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var i=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return A(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return O(t).length;default:if(i)return n?-1:A(t).length;e=(""+e).toLowerCase(),i=!0}}function d(t,e,r){var i,s,o,a=!1;if((void 0===e||e<0)&&(e=0),e>this.length||((void 0===r||r>this.length)&&(r=this.length),r<=0||(r>>>=0)<=(e>>>=0)))return"";for(t||(t="utf8");;)switch(t){case"hex":return function(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var i="",s=e;s<r;++s)i+=x[t[s]];return i}(this,e,r);case"utf8":case"utf-8":return m(this,e,r);case"ascii":return function(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}(this,e,r);case"latin1":case"binary":return function(t,e,r){var n="";r=Math.min(t.length,r);for(var i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}(this,e,r);case"base64":return i=this,s=e,o=r,0===s&&o===i.length?n.fromByteArray(i):n.fromByteArray(i.slice(s,o));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(t,e,r){for(var n=t.slice(e,r),i="",s=0;s<n.length;s+=2)i+=String.fromCharCode(n[s]+256*n[s+1]);return i}(this,e,r);default:if(a)throw TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),a=!0}}function y(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function g(t,e,r,n,i){var s;if(0===t.length)return -1;if("string"==typeof r?(n=r,r=0):r>0x7fffffff?r=0x7fffffff:r<-0x80000000&&(r=-0x80000000),(s=r*=1)!=s&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length)if(i)return -1;else r=t.length-1;else if(r<0)if(!i)return -1;else r=0;if("string"==typeof e&&(e=a.from(e,n)),a.isBuffer(e))return 0===e.length?-1:b(t,e,r,n,i);if("number"==typeof e){if(e&=255,"function"==typeof Uint8Array.prototype.indexOf)if(i)return Uint8Array.prototype.indexOf.call(t,e,r);else return Uint8Array.prototype.lastIndexOf.call(t,e,r);return b(t,[e],r,n,i)}throw TypeError("val must be string, number or Buffer")}function b(t,e,r,n,i){var s,o=1,a=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return -1;o=2,a/=2,u/=2,r/=2}function l(t,e){return 1===o?t[e]:t.readUInt16BE(e*o)}if(i){var c=-1;for(s=r;s<a;s++)if(l(t,s)===l(e,-1===c?0:s-c)){if(-1===c&&(c=s),s-c+1===u)return c*o}else -1!==c&&(s-=s-c),c=-1}else for(r+u>a&&(r=a-u),s=r;s>=0;s--){for(var h=!0,f=0;f<u;f++)if(l(t,s+f)!==l(e,f)){h=!1;break}if(h)return s}return -1}a.isBuffer=function(t){return null!=t&&!0===t._isBuffer&&t!==a.prototype},a.compare=function(t,e){if(B(t,Uint8Array)&&(t=a.from(t,t.offset,t.byteLength)),B(e,Uint8Array)&&(e=a.from(e,e.offset,e.byteLength)),!a.isBuffer(t)||!a.isBuffer(e))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;for(var r=t.length,n=e.length,i=0,s=Math.min(r,n);i<s;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:+(n<r)},a.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},a.concat=function(t,e){if(!Array.isArray(t))throw TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return a.alloc(0);if(void 0===e)for(r=0,e=0;r<t.length;++r)e+=t[r].length;var r,n=a.allocUnsafe(e),i=0;for(r=0;r<t.length;++r){var s=t[r];if(B(s,Uint8Array)&&(s=a.from(s)),!a.isBuffer(s))throw TypeError('"list" argument must be an Array of Buffers');s.copy(n,i),i+=s.length}return n},a.byteLength=p,a.prototype._isBuffer=!0,a.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)y(this,e,e+1);return this},a.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)y(this,e,e+3),y(this,e+1,e+2);return this},a.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)y(this,e,e+7),y(this,e+1,e+6),y(this,e+2,e+5),y(this,e+3,e+4);return this},a.prototype.toString=function(){var t=this.length;return 0===t?"":0==arguments.length?m(this,0,t):d.apply(this,arguments)},a.prototype.toLocaleString=a.prototype.toString,a.prototype.equals=function(t){if(!a.isBuffer(t))throw TypeError("Argument must be a Buffer");return this===t||0===a.compare(this,t)},a.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},s&&(a.prototype[s]=a.prototype.inspect),a.prototype.compare=function(t,e,r,n,i){if(B(t,Uint8Array)&&(t=a.from(t,t.offset,t.byteLength)),!a.isBuffer(t))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return -1;if(e>=r)return 1;if(e>>>=0,r>>>=0,n>>>=0,i>>>=0,this===t)return 0;for(var s=i-n,o=r-e,u=Math.min(s,o),l=this.slice(n,i),c=t.slice(e,r),h=0;h<u;++h)if(l[h]!==c[h]){s=l[h],o=c[h];break}return s<o?-1:+(o<s)},a.prototype.includes=function(t,e,r){return -1!==this.indexOf(t,e,r)},a.prototype.indexOf=function(t,e,r){return g(this,t,e,r,!0)},a.prototype.lastIndexOf=function(t,e,r){return g(this,t,e,r,!1)};function m(t,e,r){r=Math.min(t.length,r);for(var n=[],i=e;i<r;){var s,o,a,u,l=t[i],c=null,h=l>239?4:l>223?3:l>191?2:1;if(i+h<=r)switch(h){case 1:l<128&&(c=l);break;case 2:(192&(s=t[i+1]))==128&&(u=(31&l)<<6|63&s)>127&&(c=u);break;case 3:s=t[i+1],o=t[i+2],(192&s)==128&&(192&o)==128&&(u=(15&l)<<12|(63&s)<<6|63&o)>2047&&(u<55296||u>57343)&&(c=u);break;case 4:s=t[i+1],o=t[i+2],a=t[i+3],(192&s)==128&&(192&o)==128&&(192&a)==128&&(u=(15&l)<<18|(63&s)<<12|(63&o)<<6|63&a)>65535&&u<1114112&&(c=u)}null===c?(c=65533,h=1):c>65535&&(c-=65536,n.push(c>>>10&1023|55296),c=56320|1023&c),n.push(c),i+=h}var f=n,p=f.length;if(p<=4096)return String.fromCharCode.apply(String,f);for(var d="",y=0;y<p;)d+=String.fromCharCode.apply(String,f.slice(y,y+=4096));return d}function v(t,e,r){if(t%1!=0||t<0)throw RangeError("offset is not uint");if(t+e>r)throw RangeError("Trying to access beyond buffer length")}function w(t,e,r,n,i,s){if(!a.isBuffer(t))throw TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<s)throw RangeError('"value" argument is out of bounds');if(r+n>t.length)throw RangeError("Index out of range")}function I(t,e,r,n,i,s){if(r+n>t.length||r<0)throw RangeError("Index out of range")}function S(t,e,r,n,s){return e*=1,r>>>=0,s||I(t,e,r,4,34028234663852886e22,-34028234663852886e22),i.write(t,e,r,n,23,4),r+4}function E(t,e,r,n,s){return e*=1,r>>>=0,s||I(t,e,r,8,17976931348623157e292,-17976931348623157e292),i.write(t,e,r,n,52,8),r+8}a.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else if(isFinite(e))e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var i,s,o,a,u,l,c,h,f=this.length-e;if((void 0===r||r>f)&&(r=f),t.length>0&&(r<0||e<0)||e>this.length)throw RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var p=!1;;)switch(n){case"hex":return function(t,e,r,n){r=Number(r)||0;var i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;var s=e.length;n>s/2&&(n=s/2);for(var o=0;o<n;++o){var a,u=parseInt(e.substr(2*o,2),16);if((a=u)!=a)break;t[r+o]=u}return o}(this,t,e,r);case"utf8":case"utf-8":return i=e,s=r,T(A(t,this.length-i),this,i,s);case"ascii":return o=e,a=r,T(C(t),this,o,a);case"latin1":case"binary":return function(t,e,r,n){return T(C(e),t,r,n)}(this,t,e,r);case"base64":return u=e,l=r,T(O(t),this,u,l);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return c=e,h=r,T(function(t,e){for(var r,n,i=[],s=0;s<t.length&&!((e-=2)<0);++s)n=(r=t.charCodeAt(s))>>8,i.push(r%256),i.push(n);return i}(t,this.length-c),this,c,h);default:if(p)throw TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),p=!0}},a.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},a.prototype.slice=function(t,e){var r=this.length;t=~~t,e=void 0===e?r:~~e,t<0?(t+=r)<0&&(t=0):t>r&&(t=r),e<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);var n=this.subarray(t,e);return Object.setPrototypeOf(n,a.prototype),n},a.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||v(t,e,this.length);for(var n=this[t],i=1,s=0;++s<e&&(i*=256);)n+=this[t+s]*i;return n},a.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||v(t,e,this.length);for(var n=this[t+--e],i=1;e>0&&(i*=256);)n+=this[t+--e]*i;return n},a.prototype.readUInt8=function(t,e){return t>>>=0,e||v(t,1,this.length),this[t]},a.prototype.readUInt16LE=function(t,e){return t>>>=0,e||v(t,2,this.length),this[t]|this[t+1]<<8},a.prototype.readUInt16BE=function(t,e){return t>>>=0,e||v(t,2,this.length),this[t]<<8|this[t+1]},a.prototype.readUInt32LE=function(t,e){return t>>>=0,e||v(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+0x1000000*this[t+3]},a.prototype.readUInt32BE=function(t,e){return t>>>=0,e||v(t,4,this.length),0x1000000*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},a.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||v(t,e,this.length);for(var n=this[t],i=1,s=0;++s<e&&(i*=256);)n+=this[t+s]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*e)),n},a.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||v(t,e,this.length);for(var n=e,i=1,s=this[t+--n];n>0&&(i*=256);)s+=this[t+--n]*i;return s>=(i*=128)&&(s-=Math.pow(2,8*e)),s},a.prototype.readInt8=function(t,e){return(t>>>=0,e||v(t,1,this.length),128&this[t])?-((255-this[t]+1)*1):this[t]},a.prototype.readInt16LE=function(t,e){t>>>=0,e||v(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?0xffff0000|r:r},a.prototype.readInt16BE=function(t,e){t>>>=0,e||v(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?0xffff0000|r:r},a.prototype.readInt32LE=function(t,e){return t>>>=0,e||v(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},a.prototype.readInt32BE=function(t,e){return t>>>=0,e||v(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},a.prototype.readFloatLE=function(t,e){return t>>>=0,e||v(t,4,this.length),i.read(this,t,!0,23,4)},a.prototype.readFloatBE=function(t,e){return t>>>=0,e||v(t,4,this.length),i.read(this,t,!1,23,4)},a.prototype.readDoubleLE=function(t,e){return t>>>=0,e||v(t,8,this.length),i.read(this,t,!0,52,8)},a.prototype.readDoubleBE=function(t,e){return t>>>=0,e||v(t,8,this.length),i.read(this,t,!1,52,8)},a.prototype.writeUIntLE=function(t,e,r,n){if(t*=1,e>>>=0,r>>>=0,!n){var i=Math.pow(2,8*r)-1;w(this,t,e,r,i,0)}var s=1,o=0;for(this[e]=255&t;++o<r&&(s*=256);)this[e+o]=t/s&255;return e+r},a.prototype.writeUIntBE=function(t,e,r,n){if(t*=1,e>>>=0,r>>>=0,!n){var i=Math.pow(2,8*r)-1;w(this,t,e,r,i,0)}var s=r-1,o=1;for(this[e+s]=255&t;--s>=0&&(o*=256);)this[e+s]=t/o&255;return e+r},a.prototype.writeUInt8=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,1,255,0),this[e]=255&t,e+1},a.prototype.writeUInt16LE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},a.prototype.writeUInt16BE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},a.prototype.writeUInt32LE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,4,0xffffffff,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},a.prototype.writeUInt32BE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,4,0xffffffff,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},a.prototype.writeIntLE=function(t,e,r,n){if(t*=1,e>>>=0,!n){var i=Math.pow(2,8*r-1);w(this,t,e,r,i-1,-i)}var s=0,o=1,a=0;for(this[e]=255&t;++s<r&&(o*=256);)t<0&&0===a&&0!==this[e+s-1]&&(a=1),this[e+s]=(t/o|0)-a&255;return e+r},a.prototype.writeIntBE=function(t,e,r,n){if(t*=1,e>>>=0,!n){var i=Math.pow(2,8*r-1);w(this,t,e,r,i-1,-i)}var s=r-1,o=1,a=0;for(this[e+s]=255&t;--s>=0&&(o*=256);)t<0&&0===a&&0!==this[e+s+1]&&(a=1),this[e+s]=(t/o|0)-a&255;return e+r},a.prototype.writeInt8=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},a.prototype.writeInt16LE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},a.prototype.writeInt16BE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},a.prototype.writeInt32LE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,4,0x7fffffff,-0x80000000),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},a.prototype.writeInt32BE=function(t,e,r){return t*=1,e>>>=0,r||w(this,t,e,4,0x7fffffff,-0x80000000),t<0&&(t=0xffffffff+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},a.prototype.writeFloatLE=function(t,e,r){return S(this,t,e,!0,r)},a.prototype.writeFloatBE=function(t,e,r){return S(this,t,e,!1,r)},a.prototype.writeDoubleLE=function(t,e,r){return E(this,t,e,!0,r)},a.prototype.writeDoubleBE=function(t,e,r){return E(this,t,e,!1,r)},a.prototype.copy=function(t,e,r,n){if(!a.isBuffer(t))throw TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r||0===t.length||0===this.length)return 0;if(e<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(n<0)throw RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var i=n-r;if(this===t&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(e,r,n);else if(this===t&&r<e&&e<n)for(var s=i-1;s>=0;--s)t[s+e]=this[s+r];else Uint8Array.prototype.set.call(t,this.subarray(r,n),e);return i},a.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw TypeError("encoding must be a string");if("string"==typeof n&&!a.isEncoding(n))throw TypeError("Unknown encoding: "+n);if(1===t.length){var i,s=t.charCodeAt(0);("utf8"===n&&s<128||"latin1"===n)&&(t=s)}}else"number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw RangeError("Out of range index");if(r<=e)return this;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else{var o=a.isBuffer(t)?t:a.from(t,n),u=o.length;if(0===u)throw TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=o[i%u]}return this};var R=/[^+/0-9A-Za-z-_]/g;function A(t,e){e=e||1/0;for(var r,n=t.length,i=null,s=[],o=0;o<n;++o){if((r=t.charCodeAt(o))>55295&&r<57344){if(!i){if(r>56319||o+1===n){(e-=3)>-1&&s.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&s.push(239,191,189),i=r;continue}r=(i-55296<<10|r-56320)+65536}else i&&(e-=3)>-1&&s.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;s.push(r)}else if(r<2048){if((e-=2)<0)break;s.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;s.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((e-=4)<0)break;s.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return s}function C(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}function O(t){return n.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(R,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function T(t,e,r,n){for(var i=0;i<n&&!(i+r>=e.length)&&!(i>=t.length);++i)e[i+r]=t[i];return i}function B(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}var x=function(){for(var t="0123456789abcdef",e=Array(256),r=0;r<16;++r)for(var n=16*r,i=0;i<16;++i)e[n+i]=t[r]+t[i];return e}()},783:function(t,e){e.read=function(t,e,r,n,i){var s,o,a=8*i-n-1,u=(1<<a)-1,l=u>>1,c=-7,h=r?i-1:0,f=r?-1:1,p=t[e+h];for(h+=f,s=p&(1<<-c)-1,p>>=-c,c+=a;c>0;s=256*s+t[e+h],h+=f,c-=8);for(o=s&(1<<-c)-1,s>>=-c,c+=n;c>0;o=256*o+t[e+h],h+=f,c-=8);if(0===s)s=1-l;else{if(s===u)return o?NaN:1/0*(p?-1:1);o+=Math.pow(2,n),s-=l}return(p?-1:1)*o*Math.pow(2,s-n)},e.write=function(t,e,r,n,i,s){var o,a,u,l=8*s-i-1,c=(1<<l)-1,h=c>>1,f=5960464477539062e-23*(23===i),p=n?0:s-1,d=n?1:-1,y=+(e<0||0===e&&1/e<0);for(isNaN(e=Math.abs(e))||e===1/0?(a=+!!isNaN(e),o=c):(o=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-o))<1&&(o--,u*=2),o+h>=1?e+=f/u:e+=f*Math.pow(2,1-h),e*u>=2&&(o++,u/=2),o+h>=c?(a=0,o=c):o+h>=1?(a=(e*u-1)*Math.pow(2,i),o+=h):(a=e*Math.pow(2,h-1)*Math.pow(2,i),o=0));i>=8;t[r+p]=255&a,p+=d,a/=256,i-=8);for(o=o<<i|a,l+=i;l>0;t[r+p]=255&o,p+=d,o/=256,l-=8);t[r+p-d]|=128*y}}},i={};function s(t){var e=i[t];if(void 0!==e)return e.exports;var r=i[t]={exports:{}},o=!0;try{n[t](r,r.exports,s),o=!1}finally{o&&delete i[t]}return r.exports}s.ab="/ROOT/node_modules/next/dist/compiled/buffer/",e.exports=s(72)},11870,t=>{"use strict";var e=t.i(43476),r=t.i(18566),n=t.i(71645),i=t.i(19284);function s({children:t}){let s=(0,r.useRouter)(),{isAuthenticated:o,checkExpiration:a}=(0,i.useAuthStore)(),[u,l]=(0,n.useState)(()=>i.useAuthStore.persist.hasHydrated());return((0,n.useEffect)(()=>{if(u)return;let t=i.useAuthStore.persist.onFinishHydration(()=>{l(!0)});return i.useAuthStore.persist.hasHydrated()&&setTimeout(()=>l(!0),0),t},[u]),(0,n.useEffect)(()=>{if(!u)return;let t=a();o&&t||s.push("/")},[u,o,a,s]),u)?o?(0,e.jsx)(e.Fragment,{children:t}):null:(0,e.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,e.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})})}t.s(["ProtectedRoute",()=>s])},63209,t=>{"use strict";let e=(0,t.i(75254).default)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);t.s(["AlertCircle",()=>e],63209)},48643,t=>{"use strict";var e=t.i(54616),r=t.i(66027),n=t.i(12598),i=t.i(97903);t.i(11643);var s=t.i(85056);let o=s.gql`
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
`,a=s.gql`
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
`,h=s.gql`
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
`;let f=s.gql`
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
`,d=s.gql`
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
`,y=s.gql`
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
`;let g=s.gql`
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
`;function b(t){return(0,r.useQuery)({queryKey:["wallet",t],queryFn:async()=>(await i.graphqlClient.request(o,{input:t})).wallet,enabled:!!(t.id||t.userId)})}function m(t){return(0,r.useQuery)({queryKey:["walletBalance",t],queryFn:async()=>(await i.graphqlClient.request(a,{walletId:t})).walletBalance,enabled:!!t})}function v(t){return(0,r.useQuery)({queryKey:["walletTransactions",t],queryFn:async()=>(await i.graphqlClient.request(u,{input:t})).walletTransactions,enabled:!!t.walletId})}function w(){let t=(0,n.useQueryClient)();return(0,e.useMutation)({mutationFn:async t=>(await i.graphqlClient.request(l,{input:t})).createWallet,onSuccess:()=>{t.invalidateQueries({queryKey:["wallet"]})}})}function I(){let t=(0,n.useQueryClient)();return(0,e.useMutation)({mutationFn:async t=>(await i.graphqlClient.request(c,{input:t})).spendFromWallet,onSuccess:(e,r)=>{t.invalidateQueries({queryKey:["wallet",{id:r.walletId}]}),t.invalidateQueries({queryKey:["walletBalance",r.walletId]}),t.invalidateQueries({queryKey:["walletTransactions",{walletId:r.walletId}]})}})}function S(){return(0,e.useMutation)({mutationFn:async t=>(await i.graphqlClient.request(h,{input:t})).createPaymentIntent})}function E(t){return(0,r.useQuery)({queryKey:["subscriptions",{walletId:t}],queryFn:async()=>(await i.graphqlClient.request(f,{walletId:t})).subscriptionsByWallet,enabled:!!t})}function R(t){return(0,r.useQuery)({queryKey:["subscriptionBillingHistory",t],queryFn:async()=>(await i.graphqlClient.request(p,{subscriptionId:t})).subscriptionBillingHistory,enabled:!!t})}function A(){let t=(0,n.useQueryClient)();return(0,e.useMutation)({mutationFn:async t=>(await i.graphqlClient.request(d,{input:t})).createSubscription,onSuccess:e=>{t.invalidateQueries({queryKey:["subscriptions",{walletId:e.walletId}]}),t.invalidateQueries({queryKey:["activeSubscriptions",{walletId:e.walletId}]}),t.invalidateQueries({queryKey:["wallet",{id:e.walletId}]})}})}function C(){let t=(0,n.useQueryClient)();return(0,e.useMutation)({mutationFn:async t=>(await i.graphqlClient.request(y,{input:t})).cancelSubscription,onSuccess:e=>{t.invalidateQueries({queryKey:["subscription",e.id]}),t.invalidateQueries({queryKey:["subscriptions",{walletId:e.walletId}]}),t.invalidateQueries({queryKey:["activeSubscriptions",{walletId:e.walletId}]})}})}function O(){let t=(0,n.useQueryClient)();return(0,e.useMutation)({mutationFn:async t=>(await i.graphqlClient.request(g,{subscriptionId:t})).processSubscriptionBilling,onSuccess:e=>{t.invalidateQueries({queryKey:["subscription",e.subscriptionId]}),t.invalidateQueries({queryKey:["subscriptionBillingHistory",e.subscriptionId]}),t.invalidateQueries({queryKey:["walletTransactions"]})}})}t.s(["useCancelSubscription",()=>C,"useCreatePaymentIntent",()=>S,"useCreateSubscription",()=>A,"useCreateWallet",()=>w,"useProcessSubscriptionBilling",()=>O,"useSpendFromWallet",()=>I,"useSubscriptionBillingHistory",()=>R,"useSubscriptionsByWallet",()=>E,"useWallet",()=>b,"useWalletBalance",()=>m,"useWalletTransactions",()=>v],48643)}]);