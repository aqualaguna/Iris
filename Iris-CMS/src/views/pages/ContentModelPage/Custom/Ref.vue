<template>
  <div>
    <template v-if="!selectedData">
      <label for="" class="vs-input--label">{{ label }}</label>
      <vx-auto-suggest
        ref="refSearch"
        :data="refAutoSuggestData"
        search_key="title"
        class="w-full mb-base"
        :placeholder="placeholder"
        inputClassses="w-full vs-input-no-border vs-input-no-shdow-focus"
        :async-search="handleSearch"
        hideGroupTitle
        appendToBody
        @selected="selected"
      >
        <!-- Pages Suggestion -->
        <template v-slot:pages="{ suggestion }">
          <div
            class="vs-list--title"
            v-for="field in normalField(suggestion)"
            :key="field"
          >
            <div class="flex w-full">
              <p class="mx-3 w-1/6 text-right font-black">
                <b>{{ field | title }}</b>
              </p>
              <p class="mx-3">{{ suggestion[field] }}</p>
            </div>
          </div>
        </template>
      </vx-auto-suggest>
    </template>
    <div v-else>
      <vx-card class="mb-base" :title="label" hasAction removeCardAction @remove="selectedData = null">
        <vs-divider class="mt-0" />
        <div
          class="vs-list--title"
          v-for="field in normalField(selectedData)"
          :key="field"
        >
          <div class="flex w-full">
            <p class="mx-3 w-1/6 text-right font-black">
              <b>{{ field | title }}</b>
            </p>
            <p class="mx-3">{{ selectedData[field] }}</p>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import VxAutoSuggest from "@/components/vx-auto-suggest/VxAutoSuggest.vue";
const algoliasearch = require("algoliasearch");

export default {
  name: "RefField",
  components: {
    VxAutoSuggest,
  },
  props: {
    value: {},
    schema: {
      type: Object,
      required: true,
    },
    label: String,
    placeholder: String,
  },
  computed: {
    projectId() {
      let appConfig = this.$store.state.selectedApp;
      return appConfig ? appConfig.projectId : null;
    },
    app() {
      return this.projectId ? this.$app(this.projectId) : null;
    },
    IrisSettings() {
      return this.$store.state.IrisSettings;
    },
    contentModel() {
      return this.$store.state.content_model.irisContentModel.find(
        (t) => t.collection_name === this.schema.collection_name
      );
    },
  },
  methods: {
    reset() {
      this.selectedData = null;
    },
    selected(item) {
      const { pages } = item;
      this.selectedData = pages;
      const { objectID } = pages;
      const docref = this.app
        .firestore()
        .collection(this.contentModel.collection_name)
        .doc(objectID);

      this.$emit("input", {
        id: docref,
        ...this.schema.fieldFromRef.reduce((acc, val) => {
          acc[val] = pages[val];
        }, {}),
      });
    },
    normalField(suggestion) {
      return Object.keys(suggestion).filter(
        (k) =>
          !k.startsWith("_") &&
          !["objectID", "createdAt", "updatedAt", "archived"].includes(k)
      );
    },
    validate(val) {
      if (this.schema.type && this.schema.type.includes("null") && val == "") {
        this.val = null;
        this.validate(null);
        return;
      }
      let validateFunc = this.$ajv.compile(this.schema);
      if (val instanceof Date) {
        val = val.toISOString();
      }

      var valid = validateFunc(val);
      if (!valid) {
        this.danger = true;
        this.dangerText = validateFunc.errors[0].message;
      } else {
        this.danger = false;
      }
    },
    handleSearch(term) {
      if (term === "")
        return Promise.resolve({
          pages: {
            key: "all",
            data: [],
          },
        });
      return this.algolia_index
        .search(term, {
          page: 0,
          hitsPerPage: 5,
        })
        .then((result) => {
          const { hits, nbHits } = result;
          console.log(result);
          this.algolia_meta.nbHits = nbHits;
          this.algolia_meta.hits = hits;
          this.refAutoSuggestData.pages.data = hits;
          return {
            pages: {
              key: "all",
              data: hits,
            },
          };
        });
    },
  },
  mounted() {
    // check for algolia
    if (this.contentModel.algolia_index != "" && this.IrisSettings) {
      const { app_id, app_search_secret } = this.IrisSettings.algolia;
      const client = algoliasearch(app_id, app_search_secret);
      this.algolia_index = client.initIndex(this.contentModel.algolia_index);
    } else {
      this.$vs.notify({
        title: "this collection does not indexed at algolia!",
        text:
          "Please enable algolia in this collection to referencing with auto complete.",
        color: "danger",
        iconPack: "feather",
        icon: "icon-alert-circle",
        position: "bottom-center",
      });
    }
  },
  data() {
    return {
      algolia_index: null,
      algolia_meta: {
        nbHits: 0,
        query: "",
      },
      selectedData: null,
      refAutoSuggestData: {
        pages: {
          key: "name",
          data: [],
        },
      },
      val: "",
      danger: false,
      dangerText: "",
    };
  },
};
</script>

<style></style>
