<template>
  <component
    class="flex-auto"
    :is="scrollbarTag"
    :settings="settings"
    @contextmenu.native.prevent="
      !dropmode ? $emit('contextmenu', $event) : null
    "
    :key="$vs.rtl"
    @dragleave.native="dropmode = false"
    @drop.native.prevent="handleDrop"
    @dragenter.native.prevent="handleDragEnter"
    @dragover.native.prevent="handleDragOver"
  >
    <transition v-if="dropmode">
      <div class="drop-zone">
        <div class="inner-drop-zone flex justify-center">
          <div class="m-auto">
            <h5>Upload Here</h5>
          </div>
        </div>
      </div>
    </transition>
    <div
      class="flex-grow flex-1 flex flex-wrap not-selectable h-full justify-start justify-items-auto"
      style="background-color:white;align-content: flex-start;"
      v-else-if="mode == 'grid'"
      @mouseup.stop="mouseUpEvent = $event"
      @mousedown.stop="mouseDownEvent = $event"
      @mousemove.stop="mouseMoveEvent = $event"
    >
      <div ref="rubberBand" :style="divStyle" id="rubber-band"></div>
      <ItemGrid
        v-for="(file, index) in filesFiltered"
        @click="selectIndex(index)"
        @click-ctrl="selectCtrlIndex(index)"
        @click-shift="selectShiftIndex(index)"
        @stop-drop-mode="stopdropmode = true"
        @contextmenu.native.prevent="$emit('contextmenu', $event)"
        @dblclick.native="dive(file)"
        @move="$emit('move', $event)"
        :file="file"
        :key="index"
        ref="files"
      />
    </div>
    <div
      class="flex h-full not-selectable"
      style="background-color:white;"
      v-else
    >
      <vs-list class="flex-1 flex-grow">
        <template v-for="(file, index) in filesFiltered">
          <ItemList
            :key="index"
            ref="files"
            :file="file"
            @click="selectIndex(index)"
            @click-ctrl="selectCtrlIndex(index)"
            @click-shift="selectShiftIndex(index)"
            @contextmenu.native.prevent="$emit('contextmenu', $event)"
            @dblclick.native="dive(file)"
            @stop-drop-mode="stopdropmode = true"
            @move="$emit('move', $event)"
          />
        </template>
        <span></span>
      </vs-list>
    </div>
  </component>
</template>

<script>
import EventBus from "@/event-bus";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ItemGrid from "./ItemGrid";
import ItemList from "./ItemList";

export default {
  name: "StorageBody",
  components: {
    VuePerfectScrollbar,
    ItemList,
    ItemGrid,
  },
  props: {
    filesFiltered: Array,
    mode: String,
    local: Boolean,
  },
  data() {
    return {
      mouseDownEvent: null,
      mouseUpEvent: null,
      mouseMoveEvent: null,
      dropmode: false,
      stopdropmode: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
        suppressScrollX: true,
      },
    };
  },
  methods: {
    handleDragEnter() {
      if (this.stopdropmode) this.dropmode = false;
      else this.dropmode = true;
    },
    handleDragOver() {
      if (this.stopdropmode) this.dropmode = false;
      else this.dropmode = true;
    },
    handleDrop(evt) {
      if (evt.dataTransfer.files.length > 0) {
        this.$emit("drop-file", evt.dataTransfer.files);
      }
      this.dropmode = false;
      this.stopdropmode = false;
    },
    checkOverlap() {
      let rect2 = this.$refs.rubberBand.getBoundingClientRect();
      this.files = JSON.parse(JSON.stringify(this.files)).map((t, index) => {
        try {
          let rect1 = this.$refs.files[index].$el.getBoundingClientRect();
          var overlap = !(
            rect1.right <= rect2.left ||
            rect1.left >= rect2.right ||
            rect1.bottom <= rect2.top ||
            rect1.top >= rect2.bottom
          );
          let isCtrl = this.mouseMoveEvent.ctrlKey;
          if (isCtrl) {
            t.selected = overlap || t.selected;
          } else t.selected = overlap;
          this.$emit("select-file", t);
          // eslint-disable-next-line no-empty
        } catch (e) {
          console.log(e);
        }
        return t;
      });
    },
    dive(file) {
      if (file.type == "folder") {
        if (this.local) {
          this.$emit("folder-dive", file);
        } else {
          EventBus.$emit("folder-dive", file);
        }
      }
    },
    selectIndex(index) {
      let clone = JSON.parse(JSON.stringify(this.files));
      this.files = clone.map((t) => {
        t.selected = t.fullPath == this.filesFiltered[index].fullPath;
        if (t.fullPath == this.filesFiltered[index].fullPath) {
          this.$emit("select-file", t);
        }
        return t;
      });
    },
    selectCtrlIndex(index) {
      let clone = JSON.parse(JSON.stringify(this.files));
      clone[index].selected = true;
      this.files = clone;
      this.$emit("select-file", this.files[index]);
    },
    selectShiftIndex(index) {
      let indexRef = this.files.findIndex((t) => t.selected);
      let startIndex = Math.min(indexRef, index);
      let endIndex = Math.max(indexRef, index);
      let clone = JSON.parse(JSON.stringify(this.files));
      for (let i = startIndex; i <= endIndex; i++) {
        clone[i].selected = true;
      }
      this.files = clone;
      this.$emit("select-file", this.files[index]);
    },
  },
  watch: {
    mouseUpEvent() {
      if (this.mouseDownEvent && this.mouseDownEvent.which == 1)
        this.checkOverlap();
      this.mouseDownEvent = null;
      this.mouseUpEvent = null;
    },
    mouseMoveEvent() {
      let isRubberBandModeOn =
        this.mouseDownEvent &&
        this.mouseDownEvent.which == 1 &&
        this.mouseMoveEvent &&
        !this.mouseUpEvent;
      if (isRubberBandModeOn) {
        this.checkOverlap();
      }
    },
  },
  computed: {
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    divStyle() {
      let isRubberBandModeOn =
        this.mouseDownEvent &&
        this.mouseDownEvent.which == 1 &&
        this.mouseMoveEvent &&
        !this.mouseUpEvent;
      let top = "0px";
      let left = "0px";
      let width = "1px";
      let height = "1px";
      if (isRubberBandModeOn) {
        top = `${Math.min(this.mouseDownEvent.y, this.mouseMoveEvent.y)}px`;
        left = `${Math.min(this.mouseDownEvent.x, this.mouseMoveEvent.x)}px`;
        width = `${Math.max(
          Math.abs(this.mouseMoveEvent.x - this.mouseDownEvent.x),
          1
        )}px`;
        height = `${Math.max(
          Math.abs(this.mouseMoveEvent.y - this.mouseDownEvent.y),
          1
        )}px`;
      }

      let style = {
        position: "fixed",
        border: "1px solid red",
        top,
        left,
        width,
        height,
      };
      if (!isRubberBandModeOn) {
        style.display = "none";
      }
      return style;
    },

    files: {
      get() {
        return this.$store.state.storage.currentFolderData;
      },
      set(val) {
        this.$store.commit("storage/setCurrentFolderData", val);
      },
    },
  },
};
</script>

<style lang="scss">
.drop-zone {
  height: 100% !important ;
  padding: 15px;
  .inner-drop-zone {
    border: 1px dashed rgba(var(--vs-primary), 1);
    height: 100% !important ;
    margin: auto;
    border-radius: 10px;
  }
}
</style>
