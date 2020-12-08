<template>
  <vs-progress
    :style="{visibility: isProgress ? 'visible' : 'hidden'}"
    :percent="isFinite(progress) ? progress : 0"
    :indeterminate="progress == Infinity"
    color="primary"
  ></vs-progress>
</template>

<script>
import EventBus from "@/event-bus";
export default {
  name: "StorageProgress",
  data() {
    return {
      progress: 0,
      isProgress: false,
    };
  },
  beforeDestroy() {
    EventBus.$off("file-manager-loading");
    EventBus.$off("file-manager-loading-inc");
  },
  mounted() {
    EventBus.$on(
      "file-manager-loading",
      function(status) {
        if (typeof status == "object") {
          // manual
          this.isProgress =
            typeof status.isProgress == "boolean"
              ? status.isProgress
              : this.isProgress;
          this.progress = isFinite(status.progress)
            ? status.progress
            : this.progress;
        } else if (typeof status == "string")
          switch (status) {
            case "on":
              this.isProgress = true;
              this.progress = Infinity;
              break;
            case "off":
              this.isProgress = false;
              this.progress = 0;
              break;
          }
      }.bind(this)
    );
    EventBus.$on(
      "file-manager-loading-inc",
      function(val) {
        if (isFinite(val)) this.progress += val;
      }.bind(this)
    );
  },
};
</script>

<style></style>
