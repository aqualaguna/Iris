<template>
  <vs-popup title="Upload Popup" :active.sync="popupActive">
    <UploaderFirebase
      :storing-path="path"
      ref="uploader"
      @on-success="addFile"
      @on-delete="removeFile"
      @finish="$emit('finish')"
      listOnly
      multiple
    />
  </vs-popup>
</template>

<script>
import UploaderFirebase from "./UploaderFirebase";
export default {
  components: {
    UploaderFirebase,
  },
  props: {
    path: {
      type: String,
      default: "temporary/"
    },
  },
  name: "UploadPopup",
  data() {
    return {
      popupActive: false,
    };
  },
  watch: {
    popupActive(newval) {
      if (!newval) {
        this.reset();
        this.$refs.uploader.reset();
      } else {
        setTimeout(() => {
          this.focus();
        }, 1000);
      }
    },
  },
  methods: {
    removeFile() {
      //   if (this.customer._id) {
      //     // update
      //     this.customer.attachment_urls.splice(data.index, 1);
      //   } else {
      //     let url = data.file.url;
      //     this.customer.attachment_urls = this.customer.attachment_urls.filter(
      //       (t) => t != url
      //     );
      //   }
    },
    addFile() {
    },
    focus() {},
    open() {
      this.popupActive = true;
    },
    close() {
      this.popupActive = false;
    },
    toggle() {
      this.popupActive = !this.popupActive;
    },
    reset() {},
  },
};
</script>
