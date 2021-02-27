<template>
  <vs-sidebar
    position-right
    parent="body"
    :clickNotClose="true"
    default-index="1"
    color="primary"
    class="sidebarx sidebarpage add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div
      class="py-6 flex items-center justify-between px-6"
      style="background-color:#F7F7F7;border-bottom:1px solid #D6D6D6"
    >
      <h3>
        Add a New Field
      </h3>
      <feather-icon
        icon="XIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div>
        <div class="vx-row m-3">
          <div class="vx-col sm:w-1/2 w-full mb-2 flex flex-wrap flex-col">
            <vs-input
              class="w-full"
              name="flabel"
              label="Field Label"
              @input="setApiLabel"
              v-model="field_def.title"
              :danger="errors.some((t) => t.dataPath == '/title')"
              :danger-text="
                errors.find((t) => t.dataPath == '/title')
                  ? errors.find((t) => t.dataPath == '/title').message
                  : ''
              "
            />
            <vs-input
              class="w-full"
              label="Field API Name"
              v-model="field_def.api_label"
              :danger="errors.some((t) => t.dataPath == '/api_label')"
              :danger-text="
                errors.find((t) => t.dataPath == '/api_label')
                  ? errors.find((t) => t.dataPath == '/title').message
                  : ''
              "
              description-text="field name that will set to be referenced in API or SDK"
            />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <vs-textarea
              label="Description"
              class="mt-4"
              v-model="field_def.description"
            />
          </div>
        </div>

        <SelectFieldType :value="field_def.type" @setType="setType" />
        <span
          class="text-danger text-sm m-3"
          v-show="errors.some((t) => t.dataPath == '/type')"
          >{{
            errors.find((t) => t.dataPath == "/type")
              ? errors.find((t) => t.dataPath == "/type").message
              : ""
          }}</span
        >
        <div class="m-3">
          <h5>Field Properties</h5>
          <vs-divider />
          <div class="flex flex-col">
            <template v-if="this.field_def.type == 'dropdown'">
              <EnumFieldProperties
                @setEnum="field_def.schema.enum = $event"
                @setDefault="field_def.schema.default = $event"
                @setRequired="field_def.schema.isNotEmpty = $event"
                :schema="field_def.schema"
              />
            </template>
            <template v-else-if="this.field_def.type == 'ref'">
              <RefFieldProperties
                @setRef="field_def.schema.collection_name = $event"
                @setRequired="field_def.schema.required = $event"
                @setFieldFromRef="field_def.schema.fieldFromRef = $event"
                :schema="field_def.schema"
              />
            </template>
            <template v-else-if="this.field_def.type == 'image'">
              <ImageFieldProperties
                @setPath="field_def.schema.upload_folder = $event"
              />
            </template>
            <template v-else-if="this.field_def.type == 'file'">
              <FileFieldProperties
                @setPath="field_def.schema.upload_folder = $event"
                @setValidType="field_def.schema.valid_types = $event"
              />
            </template>
            <template v-else-if="this.field_def.type == 'filelist'">
              <FileListFieldProperties
                @setPath="field_def.schema.upload_folder = $event"
                @setValidType="field_def.schema.valid_types = $event"
                @setMax="field_def.schema.maxItem = $event"
              />
            </template>
            <div
              v-else
              v-for="(value, key, index) in properties"
              :key="key"
              class="flex w-full"
            >
              <template v-if="!value.hidden">
                <div
                  style=""
                  class="p-6 left-prop"
                  :class="{
                    'left-prop-last':
                      index == Object.keys(properties).length - 1,
                  }"
                >
                  <p>
                    <b>{{ value.title }}</b>
                  </p>
                  <span class="text-sm">{{ value.description }}</span>
                </div>
                <div class="flex-1 right-prop">
                  <template v-if="value.const">
                    <p class="m-3">{{ value.const }}</p>
                  </template>
                  <template v-else>
                    <AjvInput
                      :schema="value"
                      v-model="field_def.schema[key]"
                      :options="options"
                    />
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </component>
    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-progress
        class="w-full flex-initial my-3"
        indeterminate
        color="primary"
        v-show="isLoading"
      />
      <vs-button
        :disabled="isLoading"
        class="mr-6"
        @click="!isLoading ? submitData() : null"
        >Submit</vs-button
      >
      <vs-button
        type="border"
        color="danger"
        @click="isSidebarActiveLocal = false"
        >Cancel</vs-button
      >
    </div>
  </vs-sidebar>
</template>

<script>
import FieldButton from "./FieldButton";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import SelectFieldType from "./SelectFieldType";
import fieldProperties from "./fieldProperties";
import AjvInput from "./AjvInput";
import EnumFieldProperties from "./EnumFieldProperties";
import RefFieldProperties from "./RefFieldProperties";
import ImageFieldProperties from "./ImageFieldProperties";
import FileFieldProperties from "./FileFieldProperties";
import FileListFieldProperties from "./FileListFieldProperties";

export default {
  components: {
    FieldButton,
    VuePerfectScrollbar,
    SelectFieldType,
    AjvInput,
    EnumFieldProperties,
    RefFieldProperties,
    ImageFieldProperties,
    FileFieldProperties,
    FileListFieldProperties,
  },
  name: "CreateFieldSidebar",
  watch: {
    "field_def.schema.format"(val) {
      if (this.properties && this.properties.default)
        this.properties.default.format = val;
    },
  },
  data() {
    return {
      isLoading: false,
      active: false,
      field_def: {
        title: "",
        description: "",
        api_label: "",
        type: "",
        hidden_field: false,
        schema: {},
      },
      errors: [],
      field_def_schema: {
        properties: {
          title: {
            type: "string",
            isNotEmpty: true,
            errorMessage: {
              isNotEmpty: "Title is required.",
            },
          },
          api_label: {
            type: "string",
            isNotEmpty: true,
            errorMessage: {
              isNotEmpty: "Api label is required.",
            },
          },
          description: {
            type: "string",
          },
          type: {
            type: "string",
            isNotEmpty: true,
            errorMessage: {
              isNotEmpty: "type is required.",
            },
          },
          schema: {},
        },
      },
      properties: {},
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  methods: {
    focus() {
      this.$el.querySelector("input[name=flabel]").focus();
    },
    setMode(mode, data) {
      if (mode == "update") {
        this.properties = JSON.parse(
          JSON.stringify(fieldProperties[data.type].properties)
        );
        this.field_def = data;
      } else {
        this.reset();
      }
    },
    setType(type) {
      let clone = JSON.parse(JSON.stringify(fieldProperties[type].properties));
      this.properties = clone;

      this.field_def.type = type;
      this.field_def.schema = {};
      if (this.properties.type && this.properties.type.constant)
        this.field_def.schema.type = this.properties.type.constant;
    },
    setApiLabel(val) {
      this.field_def.api_label = val.replace(/\s/g, "_").toLowerCase();
    },
    submitData() {
      // check for forbidden field
      const FORBIDDEN_FIELD = ["createdAt", "updatedAt", "archived"];
      if (FORBIDDEN_FIELD.includes(this.field_def.api_label)) {
        this.$vs.notify({
          position: "bottom-center",
          time: 2500,
          title: "Api Label is Reserved !",
          text: "please change your api label field.",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        return;
      }
      this.field_def_schema.properties.schema = {
        properties: this.properties,
      };
      let validateFunc = this.$ajv.compile(this.field_def_schema);
      var valid = validateFunc(this.field_def);
      if (!valid) {
        let firstError = validateFunc.errors[0];
        this.$vs.notify({
          position: "bottom-center",
          time: 2500,
          title: firstError.dataPath,
          text: firstError.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        console.log(validateFunc.errors);
        this.errors = validateFunc.errors;
      } else {
        this.$emit("addField", this.field_def);
        this.reset();
        this.isSidebarActiveLocal = false;
      }
    },
    reset() {
      this.isLoading = false;
      this.field_def = {
        title: "",
        description: "",
        api_label: "",
        type: "",
        schema: {},
      };
      this.properties = {};
      this.errors = [];
    },
  },
  computed: {
    options() {
      let definitions = this.field_def.schema.definitions;
      if (Array.isArray(definitions)) {
        if (definitions.length === 1) {
          if (definitions[0].type === "object") {
            // return every key
            return definitions[0].schema.definitions.filter((t) => ['int', 'decimal', 'bool', 'dropdown', 'text', 'url'].includes(t.type)).map(t => t.api_label);
          } else {
            // other type
            return [];
          }
        } else {
          // multi type has no unique prop
          return [];
        }
      } else {
        return [];
      }
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    isSidebarActiveLocal: {
      get() {
        return this.active;
      },
      set(val) {
        this.active = val;
        if (!val) {
          this.$emit("closeSidebar");
          this.reset();
          // this.$validator.reset()
          // this.initValues()
        } else {
          setTimeout(this.focus, 800);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 900px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
.left-prop {
  width: 370px;
  border: 1px solid #e0e0e0;
  border-bottom: none;
}
.left-prop-last {
  border-bottom: 1px solid #e0e0e0;
}
.right-prop {
  width: 370px;
  border: 1px solid #e0e0e0;
  background-color: #f7f7f7;
  border-left: none;
}
</style>
