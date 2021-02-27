import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================

        {
          path: "/",
          name: "first",
          component: () => import("./views/pages/FirstPage/FirstPage.vue"),
        },
        {
          path: "/init",
          name: "init",
          component: () => import("./views/pages/InitPage/InitPage.vue"),
        },
      ],
    },
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "/dashboard",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: "/dashboard",
          name: "home",
          component: () => import("./views/Home.vue"),
        },
        {
          path: "/dashboard/content-model",
          name: "ContentModel",
          component: () =>
            import("./views/pages/ContentModelPage/ContentModelPage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Content Model", active: true },
            ],
            pageTitle: "Content Model",
            resource: "content_model",
            action: "read",
          },
        },
        {
          path: "/dashboard/content-model-create",
          name: "ContentModelCreate",
          component: () =>
            import("./views/pages/ContentModelPage/CreateContentModel.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Content Model", url: "/dashboard/content-model" },
              { title: "Create", active: true },
            ],
            pageTitle: "Create Content Model",
            resource: "content_model",
            action: "create",
          },
        },
        {
          path: "/dashboard/content-model-update",
          name: "ContentModelUpdate",
          component: () =>
            import("./views/pages/ContentModelPage/CreateContentModel.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Content Model", url: "/dashboard/content-model" },
              { title: "Update", active: true },
            ],
            pageTitle: "Update Content Model",
            resource: "content_model",
            action: "update",
          },
        },

        {
          path: "/dashboard/role",
          name: "Role",
          component: () => import("./views/pages/RolePage/RolePage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Role", active: true },
            ],
            pageTitle: "Role",
            resource: "role",
            action: "read",
          },
        },
        {
          path: "/dashboard/role-create",
          name: "RoleCreate",
          component: () => import("./views/pages/RolePage/CreateRolePage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Content Model", url: "/dashboard/role" },
              { title: "Create", active: true },
            ],
            pageTitle: "Create Role",
            resource: "role",
            action: "create",
          },
        },
        {
          path: "/dashboard/role-update",
          name: "RoleUpdate",
          component: () => import("./views/pages/RolePage/CreateRolePage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Content Model", url: "/dashboard/role" },
              { title: "Update", active: true },
            ],
            pageTitle: "Update Role",
            resource: "role",
            action: "update",
          },
        },
        {
          path: "/dashboard/user",
          name: "User",
          component: () => import("./views/pages/UserPage/UserPage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "User", active: true },
            ],
            pageTitle: "User",
            resource: "user",
            action: "read",
          },
        },
        {
          path: "/dashboard/user-update",
          name: "UserUpdate",
          component: () => import("./views/pages/UserPage/UpdateUser.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "User", url: "/dashboard/user" },
              { title: "Update", active: true },
            ],
            pageTitle: "Update User",
            // resource: "user",
            // action: "update",
          },
        },
        {
          path: "/dashboard/plugin",
          name: "User",
          component: () => import("./views/pages/PluginPage/PluginPage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Plugin", active: true },
            ],
            pageTitle: "Plugin",
            role: 'super_admin',
          },
        },
        {
          path: "/dashboard/settings",
          name: "User",
          component: () => import("./views/pages/SettingsPage/SettingsPage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Settings", active: true },
            ],
            pageTitle: "Settings",
            role: 'super_admin',
          },
        },
        {
          path: "/dashboard/storage",
          name: "Storage",
          component: () => import("./views/pages/StoragePage/StoragePage.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/dashboard" },
              { title: "Storage", active: true },
            ],
            pageTitle: "Storage",
            resource: "storage",
            action: "read",
          },
        },
        {
          path: "/dashboard/content-model-custom/:id",
          name: "ContentModelCustomPage",
          component: () => import("./views/pages/ContentModelPage/Custom/Custom.vue"),
        },
        {
          path: "/dashboard/content-model-custom/:id/create",
          name: "CreateContentModelCustomPage",
          component: () => import("./views/pages/ContentModelPage/Custom/Create.vue"),
        },
        {
          path: "/dashboard/content-model-custom/:id/update",
          name: "UpdateContentModelCustomPage",
          component: () => import("./views/pages/ContentModelPage/Custom/Create.vue"),
        },
      ],
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: "/pages/login",
          name: "page-login",
          component: () => import("@/views/pages/Login.vue"),
        },
        {
          path: "/pages/error-404",
          name: "page-error-404",
          component: () => import("@/views/pages/Error404.vue"),
        },
        {
          path: "/pages/error-unauthorized",
          name: "page-error-unauthorized",
          component: () => import("@/views/pages/ErrorUnauthorized.vue"),
        },
      ],
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/pages/error-404",
    },
  ],
});
import store from "./store/store";
router.afterEach((to) => {
  let { resource, action, role } = to.meta;
  if (typeof resource == "string" && typeof action == "string") {
    // check for permission
    let can = Vue.prototype.$can(resource, action);
    if (!can) {
      router.push("/pages/error-unauthorized");
    }
  }
  if (typeof role == "string") {
    // check if role equal
    if (store.state.role.role !== role) { 
      router.push("/pages/error-unauthorized");
    }
  }
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
