(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e07a4370"],{"0a0a":function(t,e,n){var r=n("da3c"),i=n("a7d3"),o=n("b457"),a=n("fda1"),s=n("3adc").f;t.exports=function(t){var e=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:a.f(t)})}},"31c2":function(t,e){e.f=Object.getOwnPropertySymbols},"31f4":function(t,e){t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},5539:function(t,e,n){},"565d":function(t,e,n){var r=n("6a9b"),i=n("d876").f,o={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return i(t)}catch(e){return a.slice()}};t.exports.f=function(t){return a&&"[object Window]"==o.call(t)?s(t):i(r(t))}},5927:function(t,e,n){n("93c4"),n("b42c"),t.exports=n("fda1").f("iterator")},"5d58":function(t,e,n){t.exports=n("5927")},"626e":function(t,e,n){var r=n("d74e"),i=n("f845"),o=n("6a9b"),a=n("2ea1"),s=n("43c8"),c=n("a47f"),u=Object.getOwnPropertyDescriptor;e.f=n("7d95")?u:function(t,e){if(t=o(t),e=a(e,!0),c)try{return u(t,e)}catch(n){}if(s(t,e))return i(!r.f.call(t,e),t[e])}},6277:function(t,e,n){var r=n("7b00")("meta"),i=n("6f8a"),o=n("43c8"),a=n("3adc").f,s=0,c=Object.isExtensible||function(){return!0},u=!n("d782")((function(){return c(Object.preventExtensions({}))})),l=function(t){a(t,r,{value:{i:"O"+ ++s,w:{}}})},f=function(t,e){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,r)){if(!c(t))return"F";if(!e)return"E";l(t)}return t[r].i},d=function(t,e){if(!o(t,r)){if(!c(t))return!0;if(!e)return!1;l(t)}return t[r].w},p=function(t){return u&&m.NEED&&c(t)&&!o(t,r)&&l(t),t},m=t.exports={KEY:r,NEED:!1,fastKey:f,getWeak:d,onFreeze:p}},"67bb":function(t,e,n){t.exports=n("b258")},7618:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));var r=n("5d58"),i=n.n(r),o=n("67bb"),a=n.n(o);function s(t){return s="function"===typeof a.a&&"symbol"===typeof i.a?function(t){return typeof t}:function(t){return t&&"function"===typeof a.a&&t.constructor===a.a&&t!==a.a.prototype?"symbol":typeof t},s(t)}},a887:function(t,e,n){"use strict";n("5539")},b258:function(t,e,n){n("d256"),n("12fd9"),n("d127"),n("d24f"),t.exports=n("a7d3").Symbol},b5aa:function(t,e,n){var r=n("6e1f");t.exports=Array.isArray||function(t){return"Array"==r(t)}},d127:function(t,e,n){n("0a0a")("asyncIterator")},d24f:function(t,e,n){n("0a0a")("observable")},d256:function(t,e,n){"use strict";var r=n("da3c"),i=n("43c8"),o=n("7d95"),a=n("d13f"),s=n("2312"),c=n("6277").KEY,u=n("d782"),l=n("7772"),f=n("c0d8"),d=n("7b00"),p=n("1b55"),m=n("fda1"),h=n("0a0a"),v=n("d2d6"),b=n("b5aa"),y=n("0f89"),g=n("6f8a"),w=n("0185"),P=n("6a9b"),x=n("2ea1"),O=n("f845"),_=n("7108"),j=n("565d"),k=n("626e"),C=n("31c2"),S=n("3adc"),E=n("7633"),D=k.f,$=S.f,I=j.f,N=r.Symbol,F=r.JSON,A=F&&F.stringify,U="prototype",T=p("_hidden"),R=p("toPrimitive"),J={}.propertyIsEnumerable,M=l("symbol-registry"),L=l("symbols"),Y=l("op-symbols"),q=Object[U],G="function"==typeof N&&!!C.f,K=r.QObject,W=!K||!K[U]||!K[U].findChild,z=o&&u((function(){return 7!=_($({},"a",{get:function(){return $(this,"a",{value:7}).a}})).a}))?function(t,e,n){var r=D(q,e);r&&delete q[e],$(t,e,n),r&&t!==q&&$(q,e,r)}:$,Q=function(t){var e=L[t]=_(N[U]);return e._k=t,e},B=G&&"symbol"==typeof N.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof N},H=function(t,e,n){return t===q&&H(Y,e,n),y(t),e=x(e,!0),y(n),i(L,e)?(n.enumerable?(i(t,T)&&t[T][e]&&(t[T][e]=!1),n=_(n,{enumerable:O(0,!1)})):(i(t,T)||$(t,T,O(1,{})),t[T][e]=!0),z(t,e,n)):$(t,e,n)},V=function(t,e){y(t);var n,r=v(e=P(e)),i=0,o=r.length;while(o>i)H(t,n=r[i++],e[n]);return t},X=function(t,e){return void 0===e?_(t):V(_(t),e)},Z=function(t){var e=J.call(this,t=x(t,!0));return!(this===q&&i(L,t)&&!i(Y,t))&&(!(e||!i(this,t)||!i(L,t)||i(this,T)&&this[T][t])||e)},tt=function(t,e){if(t=P(t),e=x(e,!0),t!==q||!i(L,e)||i(Y,e)){var n=D(t,e);return!n||!i(L,e)||i(t,T)&&t[T][e]||(n.enumerable=!0),n}},et=function(t){var e,n=I(P(t)),r=[],o=0;while(n.length>o)i(L,e=n[o++])||e==T||e==c||r.push(e);return r},nt=function(t){var e,n=t===q,r=I(n?Y:P(t)),o=[],a=0;while(r.length>a)!i(L,e=r[a++])||n&&!i(q,e)||o.push(L[e]);return o};G||(N=function(){if(this instanceof N)throw TypeError("Symbol is not a constructor!");var t=d(arguments.length>0?arguments[0]:void 0),e=function(n){this===q&&e.call(Y,n),i(this,T)&&i(this[T],t)&&(this[T][t]=!1),z(this,t,O(1,n))};return o&&W&&z(q,t,{configurable:!0,set:e}),Q(t)},s(N[U],"toString",(function(){return this._k})),k.f=tt,S.f=H,n("d876").f=j.f=et,n("d74e").f=Z,C.f=nt,o&&!n("b457")&&s(q,"propertyIsEnumerable",Z,!0),m.f=function(t){return Q(p(t))}),a(a.G+a.W+a.F*!G,{Symbol:N});for(var rt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),it=0;rt.length>it;)p(rt[it++]);for(var ot=E(p.store),at=0;ot.length>at;)h(ot[at++]);a(a.S+a.F*!G,"Symbol",{for:function(t){return i(M,t+="")?M[t]:M[t]=N(t)},keyFor:function(t){if(!B(t))throw TypeError(t+" is not a symbol!");for(var e in M)if(M[e]===t)return e},useSetter:function(){W=!0},useSimple:function(){W=!1}}),a(a.S+a.F*!G,"Object",{create:X,defineProperty:H,defineProperties:V,getOwnPropertyDescriptor:tt,getOwnPropertyNames:et,getOwnPropertySymbols:nt});var st=u((function(){C.f(1)}));a(a.S+a.F*st,"Object",{getOwnPropertySymbols:function(t){return C.f(w(t))}}),F&&a(a.S+a.F*(!G||u((function(){var t=N();return"[null]"!=A([t])||"{}"!=A({a:t})||"{}"!=A(Object(t))}))),"JSON",{stringify:function(t){var e,n,r=[t],i=1;while(arguments.length>i)r.push(arguments[i++]);if(n=e=r[1],(g(e)||void 0!==t)&&!B(t))return b(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!B(e))return e}),r[1]=e,A.apply(F,r)}}),N[U][R]||n("8ce0")(N[U],R,N[U].valueOf),f(N,"Symbol"),f(Math,"Math",!0),f(r.JSON,"JSON",!0)},d2d6:function(t,e,n){var r=n("7633"),i=n("31c2"),o=n("d74e");t.exports=function(t){var e=r(t),n=i.f;if(n){var a,s=n(t),c=o.f,u=0;while(s.length>u)c.call(t,a=s[u++])&&e.push(a)}return e}},d2f9:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"data-list-container",attrs:{id:"data-list-list-view"}},[n("vs-prompt",{attrs:{active:t.invitePrompt},on:{accept:t.inviteEmail,"update:active":function(e){t.invitePrompt=e}}},[n("div",{staticClass:"con-exemple-prompt"},[n("span",[t._v("Email")]),n("vs-input",{staticClass:"mt-3 w-full",model:{value:t.invite_email,callback:function(e){t.invite_email=e},expression:"invite_email"}})],1)]),n("vs-table",{ref:"table",attrs:{multiple:"",pagination:"","max-items":t.itemsPerPage,search:"",data:t.products},scopedSlots:t._u([{key:"default",fn:function(e){var r=e.data;return[n("tbody",t._l(r,(function(e,r){return n("vs-tr",{key:r,attrs:{state:e.archived?"dark":null,data:e}},[n("vs-td",[n("p",{staticClass:"product-name font-medium truncate"},[t._v("\n              "+t._s(t._f("title")(e.name))+"\n            ")])]),n("vs-td",[n("p",{staticClass:"product-category"},[t._v(t._s(e.email))])]),n("vs-td",[n("p",{staticClass:"product-name font-medium truncate"},[t._v("\n              "+t._s(t._f("title")(e.role_id))+"\n            ")])]),n("vs-td",{staticClass:"whitespace-no-wrap"},[n("div",{staticClass:"flex"},[t.$can("user","update")||e.id==t.currentUserUid?n("vx-tooltip",{attrs:{text:"Edit"}},[n("feather-icon",{attrs:{icon:"EditIcon",svgClasses:"w-5 h-5 hover:text-primary stroke-current"},on:{click:function(n){return n.stopPropagation(),t.editData(e)}}})],1):t._e(),n("vx-tooltip",{attrs:{text:"Delete"}},[t.$can("user","delete")?n("feather-icon",{staticClass:"ml-2",attrs:{icon:"TrashIcon",svgClasses:"w-5 h-5 hover:text-danger stroke-current"},on:{click:function(n){return n.stopPropagation(),t.confirmDelete(e)}}}):t._e()],1)],1)])],1)})),1)]}}]),model:{value:t.selected,callback:function(e){t.selected=e},expression:"selected"}},[n("div",{staticClass:"flex flex-wrap-reverse items-center flex-grow justify-between",attrs:{slot:"header"},slot:"header"},[n("div",{staticClass:"flex flex-wrap-reverse items-center data-list-btn-container"},[n("vs-dropdown",{staticClass:"dd-actions cursor-pointer mr-4 mb-4",attrs:{"vs-trigger-click":""}},[n("div",{staticClass:"p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full"},[n("span",{staticClass:"mr-2"},[t._v("Actions")]),n("feather-icon",{attrs:{icon:"ChevronDownIcon",svgClasses:"h-4 w-4"}})],1),n("vs-dropdown-menu",[t.$can("user","delete")?n("vs-dropdown-item",{on:{click:t.deleteGroup}},[n("span",{staticClass:"flex items-center"},[n("feather-icon",{staticClass:"mr-2",attrs:{icon:"TrashIcon",svgClasses:"h-4 w-4"}}),n("span",[t._v("Delete")])],1)]):t._e()],1)],1),n("div",{staticClass:"btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary",on:{click:t.addNewData}},[n("feather-icon",{attrs:{icon:"PlusIcon",svgClasses:"h-4 w-4"}}),n("span",{staticClass:"ml-2 text-base text-primary"},[t._v("Add New")])],1)],1),n("vs-dropdown",{staticClass:"cursor-pointer mb-4 mr-4 items-per-page-handler",attrs:{"vs-trigger-click":""}},[n("div",{staticClass:"p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"},[n("span",{staticClass:"mr-2"},[t._v(t._s(t.currentPage*t.itemsPerPage-(t.itemsPerPage-1))+" -\n            "+t._s(t.products.length-t.currentPage*t.itemsPerPage>0?t.currentPage*t.itemsPerPage:t.products.length)+"\n            of "+t._s(t.queriedItems))]),n("feather-icon",{attrs:{icon:"ChevronDownIcon",svgClasses:"h-4 w-4"}})],1),n("vs-dropdown-menu",[n("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=4}}},[n("span",[t._v("4")])]),n("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=10}}},[n("span",[t._v("10")])]),n("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=15}}},[n("span",[t._v("15")])]),n("vs-dropdown-item",{on:{click:function(e){t.itemsPerPage=20}}},[n("span",[t._v("20")])])],1)],1)],1),n("template",{slot:"thead"},[n("vs-th",{attrs:{"sort-key":"name"}},[t._v("Name")]),n("vs-th",{attrs:{"sort-key":"email"}},[t._v("Email")]),n("vs-th",{attrs:{"sort-key":"role"}},[t._v("Role")]),n("vs-th",[t._v("Action")])],1)],2)],1)},i=[],o=(n("1c01"),n("58b2"),n("8e6e"),n("f3e2"),n("d25f"),n("456d"),n("7618")),a=(n("ac6a"),n("5df3"),n("96cf"),n("3b8d")),s=(n("7514"),n("d92a"),n("bd86")),c=(n("6d67"),n("e836"));function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(Object(n),!0).forEach((function(e){Object(s["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var f={name:"UserPage",data:function(){return{invitePrompt:!1,invite_email:"",selected:[],itemsPerPage:4,products:[],isMounted:!1}},computed:{app:function(){var t=this.$store.state.selectedApp;return(t?this.$app(t.projectId):null)||null},currentUserUid:function(){return this.app.auth().currentUser.uid},currentPage:function(){return this.isMounted?this.$refs.table.currentx:0},queriedItems:function(){return this.$refs.table?this.$refs.table.queriedResults.length:this.products.length}},mounted:function(){var t=this;if(this.isMounted=!0,this.app){var e=this.app.firestore(),n=e.collection("iris_user");n.get().then((function(e){t.products=e.docs.map((function(t){return l(l({},t.data()),{},{id:t.id})}))})).catch(c["a"].bind(this))}},methods:{inviteEmail:function(){var t=this,e={type:"string",format:"email"},n=this.$ajv.compile(e),r=n(this.invite_email);if(r){var i=this.products.find((function(e){return e.email==t.invite_email}));if(i)this.$vs.notify({position:"bottom-center",color:"warning",title:"User Email Already Registered!"});else{var o={url:location.origin+"/pages/login?email="+this.invite_email,handleCodeInApp:!0};this.app.auth().sendSignInLinkToEmail(this.invite_email,o).then((function(){t.$vs.notify({position:"bottom-center",color:"success",title:"Email Login Already Sent!"})})).catch(c["a"].bind(this))}}else this.$vs.notify({position:"bottom-center",color:"warning",title:"Not Email Format!"})},deleteGroup:function(){var t=this;this.$vs.dialog({type:"confirm",color:"danger",title:"Confirm",text:"You are about to DELETE ".concat(this.selected.length," Collection. this is irreversible (cannot be undone)."),accept:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.selected.map((function(e){return t.deleteData(e,!1)})),e.next=3,Promise.all(n).then((function(){t.$vs.notify({position:"bottom-center",color:"success",title:"Success delete collection!"}),t.selected=[]})).catch(c["a"].bind(t));case 3:case"end":return e.stop()}}),e)})));function n(){return e.apply(this,arguments)}return n}()})},addNewData:function(){this.invitePrompt=!0},confirmDelete:function(t){this.$vs.dialog({type:"confirm",color:"danger",title:"Confirm",text:"You are about to DELETE '".concat(t.email,"' User. this is irreversible (cannot be undone)."),accept:this.deleteData.bind(this,t)})},deleteData:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(e){var n,r,i=arguments;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=!(i.length>1&&void 0!==i[1])||i[1],this.app){t.next=4;break}return this.$vs.notify({position:"bottom-center",color:"danger",text:"please select your app first!",title:"App not Selected."}),t.abrupt("return");case 4:if("super_admin"!=e.role_id){t.next=7;break}return this.$vs.notify({position:"bottom-center",color:"danger",text:"super admin user is immortal and may not deleted!",title:"Cannot Delete Super Admin!"}),t.abrupt("return");case 7:return t.next=9,this.$store.dispatch("user/deleteUser",e.id).catch(c["a"].bind(this));case 9:r=t.sent,"object"==Object(o["a"])(r)&&r.color&&n&&this.$vs.notify(r);case 11:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),editData:function(t){this.$store.commit("user/setUpdateData",t),this.$router.push("/dashboard/user-update")}}},d=f,p=(n("a887"),n("2877")),m=Object(p["a"])(d,r,i,!1,null,null,null);e["default"]=m.exports},d74e:function(t,e){e.f={}.propertyIsEnumerable},d876:function(t,e,n){var r=n("2695"),i=n("0029").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,i)}},d92a:function(t,e,n){var r=n("5ca1");r(r.P,"Function",{bind:n("f0c1")})},e836:function(t,e,n){"use strict";function r(t,e){t.code?this.$vs.notify({title:t.code,text:t.message,color:"danger",iconPack:"feather",icon:"icon-alert-circle",position:"bottom-center"}):this.$vs.notify({title:"Unexpected Error!",text:t.message,color:"danger",iconPack:"feather",icon:"icon-alert-circle",position:"bottom-center"}),console.log(t),"function"==typeof e&&e()}n.d(e,"a",(function(){return r}))},f0c1:function(t,e,n){"use strict";var r=n("d8e8"),i=n("d3f4"),o=n("31f4"),a=[].slice,s={},c=function(t,e,n){if(!(e in s)){for(var r=[],i=0;i<e;i++)r[i]="a["+i+"]";s[e]=Function("F,a","return new F("+r.join(",")+")")}return s[e](t,n)};t.exports=Function.bind||function(t){var e=r(this),n=a.call(arguments,1),s=function(){var r=n.concat(a.call(arguments));return this instanceof s?c(e,r.length,r):o(e,r,t)};return i(e.prototype)&&(s.prototype=e.prototype),s}},fda1:function(t,e,n){e.f=n("1b55")}}]);
//# sourceMappingURL=chunk-e07a4370.6b8ea684.js.map