<template>
  <div class="file-info flex-none" v-if="selectedFile">
    <div v-if="selectedFile" class="w-full">
      <div class="flex flex-nowrap">
        <div class="flex-auto">
          <a
            :href="selectedFile.meta ? selectedFile.meta.downloadUrl : '#'"
            target="_blank"
            style="overflow-wrap: break-word;overflow: visible;"
            >{{ selectedFile.filename }}</a
          >
        </div>
        <feather-icon
          icon="XIcon"
          class="px-4 cursor-pointer h-full close-search-icon"
          @click="selectedFile = null"
        />
      </div>

      <center
        v-if="selectedFile.meta && selectedFile.meta.contentType.match('image')"
        class="my-4"
      >
        <img
          :src="selectedFile.meta.downloadUrl"
          style="height: 140px;width: 252px;"
          class="img-contain"
        />
      </center>
      <p class="file-info-label">Type</p>
      <p>{{ selectedFile.type }}</p>
      <template v-if="selectedFile.type == 'file'">
        <p class="file-info-label">Size</p>
        <p>{{ selectedFile.size }} Bytes</p>
        <p class="file-info-label">Content Type</p>
        <p>{{ selectedFile.meta.contentType }}</p>
        <p class="file-info-label">Created At</p>
        <p>
          {{ new Date(selectedFile.meta.createdAt).toLocaleString() }}
        </p>
        <p class="file-info-label">Updated At</p>
        <p>
          {{ new Date(selectedFile.meta.updatedAt).toLocaleString() }}
        </p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileInfoSidebar",
  props: ["selectedFile"],
};
</script>

<style>
.file-info-label {
  font-size: 9pt;
  color: #b8c2cc;
}
.file-info {
  width: 260px !important;
  padding: 10px;
  border-left: 1px solid #d4dae0;
}
</style>
