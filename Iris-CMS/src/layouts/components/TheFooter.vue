<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template functional>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <p>
      <span>COPYRIGHT &copy;</span>
      <span>{{ new Date().getFullYear() }} </span>
      <a
        href="https://github.com/aqualagun/IRIS-CMS"
        target="_blank"
        rel="nofollow"
        >Aqualaguna</a
      >
      <span class="hidden sm:inline-block">, All rights Reserved. </span>
      
    </p>
    <span class="md:flex hidden items-center">
      <a
        href="https://github.com/aqualagun/IRIS-CMS"
        target="_blank"
        rel="nofollow"
        > Donate Us ! <img height="20" src="@/assets/images/logo/donate.png"></a
      >
    </span>
  </footer>
</template>

<script>
export default {
  name: "the-footer",
  props: {
    classes: {
      type: String,
    },
  },
};
</script>
