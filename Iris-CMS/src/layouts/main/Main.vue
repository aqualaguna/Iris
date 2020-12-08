<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    class="layout--main"
    :class="[
      layoutTypeClass,
      navbarClasses,
      footerClasses,
      { 'no-scroll': isAppPage },
    ]"
  >
    <v-nav-menu
      :navMenuItems="navMenuItems"
      title="IRIS CMS"
      parent=".layout--main"
    />

    <div
      id="content-area"
      :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]"
    >
      <div id="content-overlay" />

      <!-- Navbar -->
      <template v-if="mainLayoutType === 'horizontal' && windowWidth >= 1200">
        <the-navbar-horizontal
          :navbarType="navbarType"
          :class="[
            { 'text-white': isNavbarDark && !isThemeDark },
            { 'text-base': !isNavbarDark && isThemeDark },
          ]"
        />

        <div style="height: 62px" v-if="navbarType === 'static'"></div>

        <h-nav-menu
          :class="[
            { 'text-white': isNavbarDark && !isThemeDark },
            { 'text-base': !isNavbarDark && isThemeDark },
          ]"
          :navMenuItems="navMenuItems"
        />
      </template>

      <template v-else>
        <the-navbar-vertical
          :navbarColor="navbarColor"
          :class="[
            { 'text-white': isNavbarDark && !isThemeDark },
            { 'text-base': !isNavbarDark && isThemeDark },
          ]"
        />
      </template>
      <!-- /Navbar -->

      <div class="content-wrapper">
        <div class="router-view">
          <div class="router-content">
            <transition :name="routerTransition">
              <div
                v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
                class="router-header flex flex-wrap items-center mb-6"
              >
                <div
                  class="content-area__heading"
                  :class="{
                    'pr-4 border-0 md:border-r border-solid border-grey-light':
                      $route.meta.breadcrumb,
                  }"
                >
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb
                  class="ml-4 md:block hidden"
                  v-if="$route.meta.breadcrumb"
                  :route="$route"
                  :isRTL="$vs.rtl"
                />

              </div>
            </transition>

            <div class="content-area__content">
              <back-to-top
                bottom="5%"
                :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'"
                visibleoffset="500"
                v-if="!hideScrollToTop"
              >
                <vs-button
                  icon-pack="feather"
                  icon="icon-arrow-up"
                  class="shadow-lg btn-back-to-top"
                />
              </back-to-top>

              <transition :name="routerTransition" mode="out-in">
                <router-view
                  @changeRouteTitle="changeRouteTitle"
                  @setAppClasses="
                    (classesStr) => $emit('setAppClasses', classesStr)
                  "
                />
              </transition>
            </div>
          </div>
        </div>
      </div>
      <the-footer />
    </div>
  </div>
</template>

<script>
import BackToTop from "vue-backtotop";
import HNavMenu from "@/layouts/components/horizontal-nav-menu/HorizontalNavMenu.vue";
import navMenuItems from "@/layouts/components/vertical-nav-menu/navMenuItems.js";
import TheNavbarHorizontal from "@/layouts/components/navbar/TheNavbarHorizontal.vue";
import TheNavbarVertical from "@/layouts/components/navbar/TheNavbarVertical.vue";
import TheFooter from "@/layouts/components/TheFooter.vue";
import themeConfig from "@/../themeConfig.js";
import VNavMenu from "@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue";

export default {
  components: {
    BackToTop,
    HNavMenu,
    TheFooter,
    TheNavbarHorizontal,
    TheNavbarVertical,
    VNavMenu,
  },
  data() {
    return {
      footerType: themeConfig.footerType || "static",
      hideScrollToTop: themeConfig.hideScrollToTop,
      isNavbarDark: false,
      navbarColor: themeConfig.navbarColor || "#fff",
      navbarType: themeConfig.navbarType || "floating",
      routerTransition: themeConfig.routerTransition || "none",
      routeTitle: this.$route.meta.pageTitle,
    };
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
    },
    isThemeDark(val) {
      const color = this.navbarColor === "#fff" && val ? "#10163a" : "#fff";
      this.updateNavbarColor(color);
    },
    "$store.state.mainLayoutType"(val) {
      this.setNavMenuVisibility(val);
    },
  },
  computed: {
    irisContentModel() {
      return this.$store.state.content_model.irisContentModel;
    },
    navMenuItems() {
      let additional = {
        header: "Shared Content",
        icon: "LayoutIcon",
        items: [],
      };
      let items = [];

      for (const cm of this.irisContentModel) {
        if(cm.archived) continue;
        items.push({
          url: "/dashboard/content-model-custom/" + cm.id,
          name: cm.title,
          icon: cm.icon || 'KeyIcon',
        });
      }
      additional.items = items;
      return items.length > 0
        ? navMenuItems.concat([additional])
        : navMenuItems;
    },
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay;
    },
    contentAreaClass() {
      if (this.mainLayoutType === "vertical") {
        if (this.verticalNavMenuWidth === "default")
          return "content-area-reduced";
        else if (this.verticalNavMenuWidth === "reduced")
          return "content-area-lg";
        else return "content-area-full";
      } else return "content-area-full";
    },
    footerClasses() {
      return {
        "footer-hidden": this.footerType === "hidden",
        "footer-sticky": this.footerType === "sticky",
        "footer-static": this.footerType === "static",
      };
    },
    isAppPage() {
      return this.$route.meta.no_scroll;
    },

    isNeedPermission() {
      let meta = this.$route.meta;
      return typeof meta.resource == 'string' && typeof meta.action == 'string';
    },
    isThemeDark() {
      return this.$store.state.theme === "dark";
    },
    layoutTypeClass() {
      return `main-${this.mainLayoutType}`;
    },
    mainLayoutType() {
      return this.$store.state.mainLayoutType;
    },
    navbarClasses() {
      return {
        "navbar-hidden": this.navbarType === "hidden",
        "navbar-sticky": this.navbarType === "sticky",
        "navbar-static": this.navbarType === "static",
        "navbar-floating": this.navbarType === "floating",
      };
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  methods: {
    changeRouteTitle(title) {
      this.routeTitle = title;
    },
    updateNavbarColor(val) {
      this.navbarColor = val;
      if (val === "#fff") this.isNavbarDark = false;
      else this.isNavbarDark = true;
    },
    setNavMenuVisibility(layoutType) {
      if (
        (layoutType === "horizontal" && this.windowWidth >= 1200) ||
        (layoutType === "vertical" && this.windowWidth < 1200)
      ) {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);
        this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");
      } else {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);
      }
    },
    listenUserUntilCalled() {
      setTimeout(async () => {
        let res = await this.$store.dispatch("listenUser", this.app);
        if (!res) {
          this.listenUserUntilCalled();
        }
      }, 1000);
    },
    listenCollectionUntilCalled() {
      setTimeout(async () => {
        let res = await this.$store.dispatch(
          "content_model/listenIrisContentModel",
          this.app
        );
        if (!res) {
          this.listenCollectionUntilCalled();
        }
      }, 1000);
    },
  },
  created() {
    if(!this.app) return this.$router.push('/');
    setTimeout(() => {
      if(!this.app.auth().currentUser) return this.$router.push('/pages/login');
    }, 1800);
    const color =
      this.navbarColor === "#fff" && this.isThemeDark
        ? "#10163a"
        : this.navbarColor;
    this.updateNavbarColor(color);
    this.setNavMenuVisibility(this.$store.state.mainLayoutType);
    this.listenUserUntilCalled();
    // listen to iris_collection
    this.listenCollectionUntilCalled();
    // check for functions if exists
    var checkVersion = this.app.functions().httpsCallable("version");
    checkVersion().then((result) => {
      // Read result of the Cloud Function.
      this.$store.commit('setFunctionAvailable', true);
      this.$store.commit('setFunctionVersion', result.data);
    }).catch(() => {
      this.$store.commit('setFunctionAvailable', false);
      console.log('functions is not available');
    });
  },
};
</script>
