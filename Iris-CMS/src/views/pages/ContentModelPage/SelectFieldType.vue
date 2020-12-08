<template>
  <div class="m-3">
    <h5>Select Field Type</h5>
    <vs-divider />
    <div>
      <div class="flex">
        <div class="flex flex-wrap flex-shrink">
          <div class="w-full">
            Text Fields
          </div>
          <FieldButton @click="setType('text')" :class="{selected: value == 'text'}">
            <center class="mt-1">
              <vs-icon icon="title" size="30px" color="rgb(0, 0, 0)"></vs-icon>
            </center>
            <span class="mb-1 text-center">Text</span>
          </FieldButton>
          <FieldButton @click="setType('rich_text')" :class="{selected: value == 'rich_text'}">
            <center class="mt-1">
              <vs-icon
                icon="format_indent_increase"
                size="25px"
                color="rgb(0, 0, 0)"
              ></vs-icon>
            </center>
            <span class="text-center mb-1">Multi-Line Text</span>
          </FieldButton>
          <FieldButton @click="setType('html')" :class="{selected: value == 'html'}">
            <center class="mt-1">
              <vs-icon icon="code" size="25px" color="rgb(0, 0, 0)"></vs-icon>
            </center>
            <span class="text-center mb-1">HTML</span>
          </FieldButton>
          <FieldButton @click="setType('dropdown')" :class="{selected: value == 'dropdown'}">
            <center class="mt-1">
              <vs-icon
                icon="format_list_bulleted"
                size="25px"
                color="rgb(0, 0, 0)"
              ></vs-icon>
            </center>
            <span class="text-center mb-1">Dropdown List</span>
          </FieldButton>
          <FieldButton @click="setType('url')" :class="{selected: value == 'url'}">
            <center class="mt-1">
              <vs-icon icon="link" size="25px" color="rgb(0, 0, 0)"></vs-icon>
            </center>
            <span class="text-center mb-1">URL</span>
          </FieldButton>
        </div>

        <div class="flex flex-wrap">
          <div class="w-full">
            Special Type Fields
          </div>
          <FieldButton @click="setType('ref')" :class="{selected: value == 'ref'}">
            <center class="mt-1">
              <feather-icon
                icon="LinkIcon"
                svgClasses="w-8 h-8"
                style="color:black;"
              />
            </center>
            <span class="mb-1 text-center">Model Reference</span>
          </FieldButton>
          <FieldButton @click="setType('array')" :class="{selected: value == 'array'}">
            <center class="mt-1">
              <vs-icon icon="view_array" size="25px" color="rgb(0, 0, 0)"></vs-icon>
            </center>
            <span class="mb-1 text-center">Array</span>
          </FieldButton>
          <FieldButton @click="setType('object')" :class="{selected: value == 'object'}">
            <center class="mt-1">
              <vs-icon icon="emoji_objects" size="25px" color="rgb(0, 0, 0)"></vs-icon>
            </center>
            <span class="mb-1 text-center">Object</span>
          </FieldButton>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="flex flex-wrap">
          <div class="w-full">
            Number, Date &amp; Binary Fields
          </div>
          <FieldButton @click="setType('int')" :class="{selected: value == 'int'}">
            <center class="mt-1">
              <feather-icon
                icon="HashIcon"
                svgClasses="w-8 h-8"
                style="color:black;"
              />
            </center>
            <span class="mb-1 text-center">Number</span>
          </FieldButton>
          <FieldButton @click="setType('decimal')" :class="{selected: value == 'decimal'}">
            <center class="mt-1">
              <vs-icon
                icon="exposure_plus_1"
                size="25px"
                color="rgb(0, 0, 0)"
              ></vs-icon>
            </center>
            <span class="mb-1 text-center">Decimal</span>
          </FieldButton>
          <FieldButton @click="setType('datetime')" :class="{selected: value == 'datetime'}">
            <center class="mt-1">
              <vs-icon
                icon="date_range"
                size="25px"
                color="rgb(0, 0, 0)"
              ></vs-icon>
            </center>
            <span class="mb-1 text-center">Date/Time</span>
          </FieldButton>
          <FieldButton @click="setType('bool')" :class="{selected: value == 'bool'}">
            <center class="mt-1">
              <vs-icon icon="check" size="25px" color="rgb(0, 0, 0)"></vs-icon>
            </center>
            <span class="mb-1 text-center">True/False</span>
          </FieldButton>
          <FieldButton @click="setType('blob')" :class="{selected: value == 'blob'}">
            <center class="mt-1">
              <img
                id="dimg_61"
                width="35"
                height="35"
                src="data:image/png;base64,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"
                alt="Image result for binary icon"
                data-atf="1"
              />
            </center>
            <span class="mb-1 text-center">BLOB</span>
          </FieldButton>
        </div>

        <div class="flex flex-wrap">
          <div class="w-full">
            Media &amp; Attachment Fields
          </div>
          <FieldButton @click="setType('image')" :class="{selected: value == 'image'}">
            <center class="mt-1">
              <feather-icon
                icon="ImageIcon"
                svgClasses="w-10 h-10"
                style="color:black;"
              />
            </center>
            <span class="mb-1 text-center">Image</span>
          </FieldButton>
          <!-- <FieldButton @click="setType('gallery')">
            <center class="mt-1">
              <vs-icon
                icon="collections"
                size="25px"
                color="rgb(0, 0, 0)"
              ></vs-icon>
            </center>
            <span class="mb-1 text-center">Gallery</span>
          </FieldButton> -->
          <FieldButton @click="setType('file')" :class="{selected: value == 'file'}">
            <center class="mt-1">
              <feather-icon
                icon="FileIcon"
                svgClasses="w-8 h-8"
                style="color:black;"
              />
            </center>
            <span class="mb-1 text-center">File</span>
          </FieldButton>
          <FieldButton @click="setType('filelist')" :class="{selected: value == 'filelist'}">
            <center class="mt-1">
              <feather-icon
                icon="FileTextIcon"
                svgClasses="w-8 h-8"
                style="color:black;"
              />
            </center>
            <span class="mb-1 text-center">List of Files</span>
          </FieldButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FieldButton from "./FieldButton";

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  components: {
    FieldButton
  },
  methods: {
    setType(type) {
      this.$emit('setType', type);
    }
  }
};
</script>

<style></style>
