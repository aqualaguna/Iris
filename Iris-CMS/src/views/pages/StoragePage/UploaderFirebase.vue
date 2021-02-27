<template>
  <div class="con-upload">
    <view-upload v-if="viewActive" :src="viewSrc" />

    <div class="con-img-upload flex flex-col">
      <!-- <transition-group v-for="(img,index) in getFilesFilter" :key="index" name="upload"> -->
      <template v-if="!noBody">
        <template v-if="!listOnly">
          <div
            v-for="(img, index) in getFilesFilter"
            :class="{
              fileError: img.error,
              removeItem: itemRemove.includes(index),
            }"
            :key="index"
            class="img-upload"
          >
            <button class="btn-x-file" type="button" @click="removeFile(index)">
              <i translate="no" class="material-icons notranslate">
                clear
              </i>
            </button>
            <button
              v-if="showUploadButton"
              :class="{
                'on-progress': img.percent,
                'ready-progress': img.percent >= 100,
              }"
              :style="{
                height: `${img.percent}%`,
              }"
              class="btn-upload-file"
              @click="upload(index)"
            >
              <i translate="no" class="material-icons notranslate">
                {{
                  img.percent >= 100
                    ? img.error
                      ? "report_problem"
                      : "cloud_done"
                    : "cloud_upload"
                }}
              </i>
              <span>{{ img.percent }} %</span>
            </button>
            <img
              v-if="img.src"
              :style="{
                maxWidth: img.orientation == 'h' ? '100%' : 'none',
                maxHeight: img.orientation == 'w' ? '100%' : 'none',
              }"
              :key="index"
              :src="img.src"
              @touchend="viewImage(img.src, $event)"
              @click="viewImage(img.src, $event)"
            />

            <h4 v-if="!img.src" class="text-archive">
              <i translate="no" class="material-icons notranslate">
                description
              </i>
              <span>
                {{ img.name }}
              </span>
            </h4>
          </div>
        </template>
        <vx-card v-else no-shadow v-show="getFilesFilter.length > 0">
          <vs-list>
            <div
              class="vs-list--item"
              :class="{
                fileError: img.error,
                removeItem: itemRemove.includes(index),
              }"
              v-for="(img, index) in getFilesFilter"
              :key="index"
            >
              <div class="list-titles w-full">
                <div class="vs-list--title" style="word-wrap:break-word;">
                  <a class="link" href="#" @click.prevent="openLink(img.url)"
                    >{{ img.name }}
                  </a>
                </div>
                <div class="vs-list--subtitle w-full" v-if="img.percent">
                  <vs-row>
                    <vs-col>
                      <vs-progress
                        :percent="img.percent"
                        color="primary"
                      ></vs-progress>
                    </vs-col>
                    <vs-col> {{ img.percent.toFixed(2) }} % </vs-col>
                  </vs-row>
                </div>
              </div>
              <div class="vs-list--slot">
                <!-- <feather-icon icon="UploadIcon" v-if="showUploadButton" svgClasses="w-5 h-5 hover:text-primary stroke-current" class="ml-2" @click="upload(index)"/> -->
                <feather-icon
                  icon="TrashIcon"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  class="ml-2"
                  @click="removeFile(index)"
                />
              </div>
            </div>
          </vs-list>
        </vx-card>
      </template>
      <!-- </transition-group > -->
      <div
        v-if="!isSmallerScreen && !alwaysButton"
        :class="{
          'on-progress-all-upload': percent != 0,
          'is-ready-all-upload': percent >= 100,
          'disabled-upload':
            $attrs.hasOwnProperty('disabled') || limit
              ? srcs.length - itemRemove.length >= Number(limit)
              : false,
          focusInput,
        }"
        class="con-input-upload m-auto"
        style="width: 85%;"
      >
        <input
          ref="fileInput"
          :multiple="multiple"
          :accept="accept"
          v-bind="$attrs"
          :disabled="
            $attrs.disabled || limit
              ? srcs.length - itemRemove.length >= Number(limit)
              : false
          "
          type="file"
          @focus="focusInput = true"
          @blur="focusInput = false"
          @change="getFiles"
        />
        <span class="text-input">
          {{ text }}
        </span>
      </div>
      <vs-button v-else @click="$refs.fileInput.click()" class="my-2 mx-auto">
        {{ text }}
        <input
          v-show="false"
          ref="fileInput"
          :multiple="multiple"
          :accept="accept"
          v-bind="$attrs"
          :disabled="
            $attrs.disabled || limit
              ? srcs.length - itemRemove.length >= Number(limit)
              : false
          "
          type="file"
          @change="getFiles"
        />
      </vs-button>
    </div>
  </div>
</template>
<script>
import viewUpload from "./ViewUpload";
var lastTap = 0;
export default {
  name: "UploaderFirebase",
  components: {
    viewUpload,
  },
  inheritAttrs: false,
  props: {
    listOnly: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    alwaysButton: {
      type: Boolean,
      default: false,
    },
    noBody: {
      type: Boolean,
      default: false,
    },
    text: {
      default: "Upload File",
      type: String,
    },
    textMax: {
      default: "Maximum of files reached",
      type: String,
    },
    limit: {
      default: null,
      type: [Number, String],
    },
    data: {
      default: () => ({}),
      type: Object,
    },
    automatic: {
      default: false,
      type: Boolean,
    },
    showUploadButton: {
      default: true,
      type: Boolean,
    },
    accept: {
      type: String,
      default: "*/*",
    },
    storingPath: {
      default: "temporary",
      type: String,
    },
  },
  data: () => ({
    inputValue: null,
    type: null,
    srcs: [],
    filesx: [],
    itemRemove: [],
    percent: 0,
    viewActive: false,
    viewSrc: null,
    focusInput: false,
  }),
  computed: {
    isSmallerScreen() {
      return this.$store.state.windowWidth < 768;
    },
    getFilesFilter() {
      let files = this.srcs.filter((item) => {
        return !item.remove;
      });

      return files;
    },
    postFiles() {
      let postFiles = Array.prototype.slice.call(this.filesx);
      postFiles = postFiles.filter((item) => {
        return !item.hasOwnProperty("remove");
      });
      return postFiles.length;
    },
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
  },
  watch: {
    percent() {
      if (this.percent >= 100) {
        this.$emit("finish");
        this.srcs.forEach((file) => {
          file.percent = 100;
        });
        setTimeout(() => {
          this.percent = 0;
        }, 1000);
      }
    },
  },
  methods: {
    setUrls(data) {
      this.srcs = data;
      this.filesx = data;
    },
    openLink(url) {
      window.open(url, "_blank");
    },
    reset() {
      this.srcs = [];
      this.filesx = [];
      this.itemRemove = [];
      this.percent = 0;
    },
    viewImage(src, evt) {
      var timeout;

      var eventx =
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
          ? "touchstart"
          : "click";
      if (eventx == "click") {
        this.viewActive = true;
        this.viewSrc = src;
      } else {
        if (evt.type == "touchend") {
          var currentTime = new Date().getTime();
          var tapLength = currentTime - lastTap;
          clearTimeout(timeout);
          if (tapLength < 500 && tapLength > 0) {
            this.viewActive = true;
            this.viewSrc = src;
            event.preventDefault();
          }
          lastTap = currentTime;
        }
      }
    },
    removeFile(index) {
      this.$emit("on-delete", {
        index,
        file: this.filesx[index],
      });
      // if(index == 0) {
      //   this.srcs.shift();
      //   this.filesx.shift();
      // } else {
      this.srcs = this.srcs.filter((t, i) => i != index);
      this.filesx = this.filesx.filter((t, i) => i != index);
      // }

    },
    getFiles(e) {
      this.$emit("update:vsFile", e.target.value);
      let _this = this;
      function uploadImage(e) {
        let orientation = "h";
        var image = new Image();
        image.src = e.target.result;
        image.name = e.target.fileName;
        image.onload = function() {
          if (this.width > this.height) {
            orientation = "w";
          }
          switchImage(this, orientation);
        };
      }
      function switchImage(image, orientation) {
        _this.srcs.push({
          name: image.name,
          src: image.src,
          orientation: orientation,
          type: _this.typex,
          percent: null,
          error: false,
          remove: null,
        });
      }

      var files = e.target.files;
      let count = this.srcs.length - this.itemRemove.length;
      for (const file in files) {
        if (files.hasOwnProperty(file)) {
          if (this.limit) {
            count++;
            if (count > Number(this.limit)) {
              break;
            }
          }

          var reader = new FileReader();
          const filex = files[file];
          if (/image.*/.test(filex.type)) {
            this.typex = "image";
            this.filesx.push(filex);
            reader.onload = uploadImage;
            reader.fileName = filex.name;
            reader.readAsDataURL(filex);
          } else if (/video.*/.test(filex.type)) {
            this.typex = "video";
            this.filesx.push(filex);
            _this.srcs.push({
              src: null,
              name: filex.name,
              type: "video",
              percent: null,
              error: false,
              remove: null,
            });
          } else {
            this.filesx.push(filex);
            _this.srcs.push({
              src: null,
              name: filex.name,
              percent: null,
              error: false,
              remove: null,
            });
          }
          this.$emit("change", e.target.value, this.filesx);
        }
      }
      const input = this.$refs.fileInput;
      input.type = "text";
      input.type = "file";

      // if (this.automatic) {
      this.upload("all");
      // }
    },
    upload(index) {
      this.$emit("start");
      let postFiles = Array.prototype.slice.call(this.filesx);
      if (typeof index == "number") {
        postFiles = [postFiles[index]];
      } else if (index == "all") {
        postFiles = postFiles.filter((item) => {
          return !item.hasOwnProperty("remove");
        });
      }

      postFiles.forEach((filex, i) => {
        this.uploadx(i, filex);
      });
    },
    uploadx(index, file) {
      let self = this;
      let storage = this.app.storage();
      let ref = storage.ref().child(this.storingPath + "/" + file.name);
      let uploadTask = ref.put(file, this.data);
      uploadTask.on(
        'state_changed', // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          self.srcs[index].percent = progress;
          switch (snapshot.state) {
            case 'paused': // or 'paused'
              // eslint-disable-next-line no-console
              console.log("Upload is paused");
              break;
            case 'running': // or 'running'
              // eslint-disable-next-line no-console
              console.log("Upload is running");
              break;
          }
        },
        function(error) {
          self.$emit("on-error", {
            index,
            code: error.code,
            error,
          });
          self.srcs[index].error = true;
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            self.filesx[index].url = downloadURL;
            self.percent += 100 / self.filesx.length;
            self.$emit("on-success", {
              index,
              url: downloadURL,
            });
          });
        }
      );
    },
  },
};
</script>
<style>
.focusInput {
  border-color: rgb(var(--vs-primary)) !important;
}
.con-img-upload {
  width: 100% important;
}
</style>
