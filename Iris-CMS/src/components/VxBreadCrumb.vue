<template lang="html">
  <nav
    v-bind="$attrs"
    :class="`vs-align-${align}`"
    class="vs-breadcrumb w-full flex-grow"
    aria-label="breadcrumb"
    v-on="$listeners"
    @click="changeMode('input')"
    v-if="mode == 'normal'"
  >
    <ol class="vs-breadcrumb--ol">
      <slot />
      <li
        v-for="item in items"
        v-show="!hasSlot"
        :key="item.url"
        :class="{ 'vs-active': item.active, 'disabled-link': item.disabled }"
        :aria-current="item.active ? 'page' : null"
      >
        <a
          v-if="!item.active"
          @click.stop.prevent="$emit('url-click', item.url.slice(0))"
          :title="item.title"
          class="vs-breadcrumb--link"
          v-text="item.title"
        ></a>
        <template v-else>
          <span
            :class="textClass"
            :style="textStyle"
            class="vs-breadcrumb--text"
            v-text="item.title"
          ></span>
        </template>
        <span
          v-if="!item.active"
          :class="separator.length > 1 ? 'material-icons' : null"
          class="separator notranslate vs-breadcrum--separator"
          translate="no"
          aria-hidden="true"
          v-text="separator"
        ></span>
      </li>
    </ol>
  </nav>
  <div v-else class="w-full">
    <vs-input
      name="filepath"
      @blur="mode = 'normal'"
      class="w-full px-3"
      v-model="val"
      @keyup.enter="submit"
    />
  </div>
</template>

<script>
import _color from "@/assets/utils/color.js";
export default {
  name: "VxBreadcrumb",
  props: {
    items: {
      type: Array,
    },
    separator: {
      type: String,
      default: "/",
    },
    color: {
      type: String,
      default: "primary",
    },
    align: {
      type: String,
      default: "left",
    },
  },
  data() {
    return {
      mode: "normal",
      val: this.items[this.items.length - 1].url.slice(0),
    };
  },
  computed: {
    textClass() {
      const classes = {};
      if (_color.isColor(this.color)) {
        classes[`vs-breadcrumb-text-${this.color}`] = true;
      }
      return classes;
    },
    textStyle() {
      const style = {};
      if (!_color.isColor(this.color)) {
        style.color = _color.getColor(this.color);
      }
      return style;
    },
    hasSlot() {
      return !!this.$slots.default;
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this.val);
      this.changeMode('normal');
    },
    changeMode(mode) {
      if (mode == "input") {
        setTimeout(() => {
          this.$el.querySelector("input[name=filepath]").focus();
        }, 800);
      }
      this.mode = mode;
    },
  },
};
</script>
