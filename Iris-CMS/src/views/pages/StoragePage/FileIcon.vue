<template>
  <div :class="{sel: selected}">
    <img
      v-if="name == 'folder'"
      src="@/assets/icon/023-folder.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="name == 'ai'"
      src="@/assets/icon/024-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="name == 'gif'"
      src="@/assets/icon/025-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="name == 'jpg'"
      src="@/assets/icon/026-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="['webp', 'svg'].includes(name)"
      src="@/assets/icon/002-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="name == 'png'"
      src="@/assets/icon/027-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="name == 'ps'"
      src="@/assets/icon/028-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="name == 'zip'"
      src="@/assets/icon/008-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="name == 'rar'"
      src="@/assets/icon/009-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="name == 'tar'"
      src="@/assets/icon/010-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="name == 'aac'"
      src="@/assets/icon/010-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="name == 'pdf'"
      src="@/assets/icon/029-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="['xls', 'xlsx'].includes(name)"
      src="@/assets/icon/030-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="['mp3', 'flac', 'm4a', 'wav', 'wma'].includes(name)"
      src="@/assets/icon/001-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="
        [
          'webm',
          'mkv',
          'avi',
          'flv',
          'vob',
          'ogv',
          'ogg',
          'drc',
          'mov',
          'mp4',
          'mpeg',
          'm4p',
          'mpg',
          'm4v',
          '3gp',
          'f4a',
          'f4v',
          'f4p',
        ].includes(name)
      "
      src="@/assets/icon/050-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="['bin', 'exe', 'jar'].includes(name)"
      src="@/assets/icon/031-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="['css', 'scss', 'sass'].includes(name)"
      src="@/assets/icon/032-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="['html', 'xhtml'].includes(name)"
      src="@/assets/icon/035-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="['java'].includes(name)"
      src="@/assets/icon/034-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else-if="['txt'].includes(name)"
      src="@/assets/icon/036-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
    <img
      v-else-if="['doc', 'docx'].includes(name)"
      src="@/assets/icon/037-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />

    <img
      v-else
      src="@/assets/icon/011-file.svg"
      alt="content-img"
      :height="height"
      :width="width"
    />
  </div>
</template>

<script>
export default {
  name: "FileIcon",
  props: {
    name: {
      type: String,
      required: true,
      default: "folder",
    },
    height: {
      type: String,
      default: "70",
    },
    width: {
      type: String,
      default: "70",
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.sel img {
  filter: brightness(60%);
}
div img {
  width: 100%;
  height: 100%;
}
</style>
