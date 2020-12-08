<template>
  <vs-list>
    <vs-list-header
      icon-pack="feather"
      icon="icon-users"
      title="Collection"
    ></vs-list-header>
    <vs-list-item
      v-for="item in irisContentModelActive"
      :key="item.collection_name"
      :title="item.title"
      @click.native="selected = item.id"
    >
      <template slot="avatar">
        <AvatarIcon :icon="item.icon" size="small" />
      </template>
      <vs-radio v-model="selected" vs-name="col" :vs-value="item.id"></vs-radio>
    </vs-list-item>
  </vs-list>
</template>

<script>
import AvatarIcon from './AvatarIcon';

export default {
  name: "RefFieldProperties",
  components: {
    AvatarIcon,
  },
  data() {
    return {
      selected: ""
    }
  },
  watch: {
    selected(newVal) {
      this.$emit('setRef', newVal);
    }
  },
  computed: {
    irisContentModel() {
      return this.$store.state.content_model.irisContentModel;
    },
    irisContentModelActive() {
      return this.irisContentModel.filter(t => t.archived == false);
    },
  },
};
</script>

<style></style>
