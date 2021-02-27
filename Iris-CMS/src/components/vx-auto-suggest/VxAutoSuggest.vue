<template>
  <div class="vx-auto-suggest">
    <div class="flex items-center relative">
      <!-- Input -->
      <vs-input
        ref="input"
        :placeholder="placeholder"
        :class="inputClassses"
        class="z-50"
        :label="label"
        v-model="searchQuery"
        @keyup.esc="escPressed"
        @keyup.up="increaseIndex(false)"
        @keyup.down="increaseIndex"
        @keyup.enter="suggestionSelected"
        @focus="updateInputFocus"
        @blur="updateInputFocus(false)"
      />
    </div>

    <!-- Group List -->
    <ul
      v-show="open"
      ref="scrollContainer"
      :class="{ hidden: !inputFocused }"
      :style="suggestionStyle"
      class="overlay auto-suggest-suggestions-list z-50 rounded-lg mt-2 shadow-lg overflow-x-hidden"
      @mouseenter="insideSuggestions = true"
      @mouseleave="insideSuggestions = false"
      @focus="updateInputFocus"
      @blur="updateInputFocus(false)"
      tabindex="-1"
    >
      <template v-if="filteredCount">
        <li
          ref="grp_list"
          v-for="(suggestion_list, grp_name, grp_index) in filteredData"
          :key="grp_index"
          class="auto-suggest__suggestion-group-container"
        >
          <template v-if="suggestion_list.length > 0 && searchQuery">
            <!-- Group Header -->
            <p
              class="auto-suggest__suggestion-group-title pt-3 pb-1 px-4"
              v-if="!hideGroupTitle"
            >
              <slot name="group" :group_name="grp_name"></slot>
            </p>

            <!-- Suggestion List of each group -->
            <ul>
              <li
                v-for="(suggestion, index) in suggestion_list"
                :key="index"
                class="auto-suggest__suggestion-group__suggestion py-3 px-4 cursor-pointer"
                :style="[
                  currentSelected == `${grp_index}.${index}`
                    ? { 'background-color': selectedColor }
                    : {}
                ]"
                :class="{
                  'vx-auto-suggest__current-selected':
                    currentSelected == `${grp_index}.${index}`
                }"
                @mouseenter="currentSelected = `${grp_index}.${index}`"
                @keyup.enter.stop.prevent="suggestionSelected"
                @click="suggestionSelected"
              >
                <slot :name="grp_name" :suggestion="suggestion"></slot>
              </li>

              <!-- <li class="auto-suggest__suggestion-group__suggestion py-3 px-4 no-results" v-if="!suggestion_list.length && searchQuery">
                <slot name="noResult" :group_name="grp_name">
                    <p>No Results Found.</p>
                </slot>
              </li> -->
            </ul>
          </template>
        </li>
        <li v-if="pagination">
          <div class="btn-group ml-2 float-right">
            <vs-button
              style="display:inline-flex"
              no-highlight
              radius
              icon-pack="feather"
              icon="icon-chevron-left"
              @click="searchAsync('previous')"
            />
            <vs-button
              style="display:inline-flex"
              no-highlight
              radius
              icon-pack="feather"
              icon="icon-chevron-right"
              @click="searchAsync('next')"
            />
          </div>
        </li>
      </template>
      <template v-else>
        <li ref="grp_list" class="auto-suggest__suggestion-group-container">
          <ul>
            <li
              class="auto-suggest__suggestion-group__suggestion py-3 px-4 no-results"
            >
              <slot name="noResult">
                <p>{{ msg }}</p>
              </slot>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import utils from "@/assets/utils";

export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },
    offset: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: "Search.."
    },
    filterExcept: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ""
    },
    selectedColor: {
      type: String,
      default: "#F1F1F1"
    },
    customWidth: {
      type: String,
      default: null
    },
    customMaxHeight: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      required: true
    },
    initalData: {
      type: Object,
      default: () => new Object()
    },
    asyncSearch: {
      type: Function,
      default: null
    },
    inputClassses: {
      type: [String, Object, Array]
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    showPinned: {
      type: Boolean,
      default: false
    },
    searchLimit: {
      type: Number,
      default: 4
    },
    pagination: {
      type: Boolean,
      default: false
    },
    hideGroupTitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      el: null,
      open: false,
      msg: "No Results Found.",
      searchQuery: "",
      currentSelected: -1,
      inputFocused: false,
      insideSuggestions: false,
      asyncPromise: null,
      asyncResult: {},
      timeoutId: null
    };
  },
  watch: {
    // UPDATE SUGGESTIONS LIST
    searchQuery(val) {
      if (this.asyncSearch == null) {
        this.search(val);
      } else {
        if (this.timeoutId == null) {
          this.timeoutId = setTimeout(this.searchAsync, 1000);
        }
      }
    },
    autoFocus(val) {
      if (val) this.focusInput();
      else {
        this.searchQuery = "";
      }
    },
    filteredData(val) {
      // Auto Select first item if it's not item-404
      let grp_index = null;

      for (let [index, grp_suggestions] of Object.values(val).entries()) {
        if (grp_suggestions.length) {
          grp_index = index;
          break;
        }
      }

      if (grp_index != null) this.currentSelected = grp_index + ".0";
    }
  },
  computed: {
    filteredData() {
      let queried_data = {};
      let tempdata = this.asyncSearch == null ? this.data : this.asyncResult;
      const data_grps = Object.keys(tempdata);
      data_grps.forEach((grp, i) => {
        queried_data[data_grps[i]] = this.filterExcept.includes(grp)
          ? tempdata[grp].data
          : this.filter_grp(tempdata[grp]);
      });

      return queried_data;
    },
    suggestionStyle() {
      let style = {};
      if (typeof this.customWidth == "string") {
        style.width = this.customWidth;
      }
      if (typeof this.customMaxHeight == "string") {
        style["max-height"] = this.customMaxHeight;
      }
      if (this.appendToBody) {
        let rectinput = this.el
          ? this.el.querySelector("input").getBoundingClientRect()
          : { top: 0, left: 0, width: 0, height: 0 };
        style = {
          ...style,
          background: "white",
          "z-index": "5000!important",
          position: "absolute",
          top: rectinput.top + rectinput.height + 22 + "px",
          left: rectinput.left - this.offset + "px"
        };
      }
      return style;
    },
    filteredCount() {
      let count = 0;
      let keys = Object.keys(this.filteredData);
      for (let i = 0; i < keys.length; i++) {
        const element = this.filteredData[keys[i]];
        count += element && Array.isArray(element) ? element.length : 0;
      }
      return count;
    }
  },
  methods: {
    insertBody() {
      let elx = this.$refs.scrollContainer;
      if (!elx) {
        setTimeout(() => {
          this.insertBody();
        }, 500);
      } else {
        utils.insertBody(elx);
      }
    },
    searchAsync(page) {
      if (this.asyncPromise == null) {
        this.msg = "Loading....";
        this.asyncPromise = this.asyncSearch(this.searchQuery, page).then(
          result => {
            this.asyncResult = result;
            this.asyncPromise = null;
            this.msg = "No Results Found.";
            this.search();
            this.$forceUpdate();
            this.timeoutId = null;
          }
        );
      }
    },
    search() {
      let val = this.searchQuery;
      this.open = true;
      this.$emit("input", val);
    },
    escPressed() {
      console.log("est");
      this.$emit("closeSearchbar");
      this.open = false;
      this.searchQuery = "";
    },
    filter_grp(grp) {
      let tis = this;
      console.log(grp)
      let exactEle = grp.data.filter(item => {
        if (item.i18n) {
          return tis
            .$t(item.i18n)
            .toLowerCase()
            .match(this.searchQuery.toLowerCase());
        }
        if (grp.key == "all") {
          return true;
        }
        return item[grp.key]
          .toLowerCase()
          .match(this.searchQuery.toLowerCase());
      });
      return exactEle.slice(0, this.searchLimit);
    },
    updateInputFocus(val = true) {
      if (val) {
        setTimeout(() => {
          this.inputFocused = true;
        }, 100);
      } else {
        if (this.insideSuggestions) return;
        setTimeout(() => {
          this.inputFocused = false;
        }, 100);
        // this.escPressed()
      }
    },
    async removeBody() {
      if (this.appendToBody) {
        await this.$nextTick(() => {
          utils.removeBody(this.$refs.scrollContainer);
        });
      }
    },
    async suggestionSelected() {
      if (this.currentSelected > -1) {
        if (this.appendToBody) {
          await this.$nextTick(() => {
            utils.removeBody(this.$refs.scrollContainer);
          });
        }
        const [grp_index, item_index] = this.currentSelected.split(".");

        const grp_of_selected_item = Object.keys(this.data)[grp_index];
        const selected_item = this.filteredData[grp_of_selected_item][
          item_index
        ];

        this.$emit("selected", { [grp_of_selected_item]: selected_item });
        this.searchQuery = "";
        this.open = false;
      }
    },
    increaseIndex(val = true) {
      // If there's no matching items
      if (!Object.values(this.filteredData).some(grp_items => grp_items.length))
        return;

      const [grp_i, item_i] = this.currentSelected.split(".");

      const grp_arr = Object.entries(this.filteredData);
      const active_grp_total_items = grp_arr[grp_i][1].length;

      if (val) {
        // If active item is not of last item in grp
        if (active_grp_total_items - 1 > item_i) {
          this.currentSelected = grp_i + "." + (Number(item_i) + 1);

          // If active item grp is not last in grp list
        } else if (grp_i < grp_arr.length - 1) {
          for (let i = Number(grp_i) + 1; i < grp_arr.length; i++) {
            // If navigating group have items => Then move in that group
            if (grp_arr[i][1].length > 0) {
              this.currentSelected = Number(i) + ".0";
              break;
            }
          }
        }
      } else {
        // If active item is not of first item in grp
        if (Number(item_i)) {
          this.currentSelected = grp_i + "." + (Number(item_i) - 1);

          // If active item grp  is not first in grp list
        } else if (Number(grp_i)) {
          for (let i = Number(grp_i) - 1; i >= 0; i--) {
            // If navigating group have items => Then move in that group
            if (grp_arr[i][1].length > 0) {
              this.currentSelected = i + "." + (grp_arr[i][1].length - 1);
              break;
            }
          }
        }
      }
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.input.$el.querySelector("input").focus();
      });
    }
  },
  destroy() {
    if (this.appendToBody) {
      this.$nextTick(() => {
        utils.removeBody(this.$refs.scrollContainer);
      });
    }
  },
  mounted() {
    this.el = this.$el;
    if (this.autoFocus) this.focusInput();
    if (this.appendToBody) this.insertBody();
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/vxAutoSuggest.scss";
</style>
