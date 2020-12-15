<template>
  <div>
      {{$route.params.id}}
  </div>
</template>

<script>
export default {
  name: 'CustomContentModel',
  computed: {
    modelName() {
      return this.$route.params.id;
    },
    irisContentModel() {
      return this.$store.state.content_model.irisContentModel.find(t => t.id ==  this.modelName);
    },
  }
}
</script>

<style>

</style>