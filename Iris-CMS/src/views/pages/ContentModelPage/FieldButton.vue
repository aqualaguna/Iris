<template>
  <div class="field-button flex flex-col" @click="$emit('click')">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FieldButton',
  
};
</script>

<style lang="scss">
.field-button {
  border: 1px solid #d6d6d6;
  border-radius: 5px;
  background-color: #f7f7f7;
  width: 80px;
  height: 70px;
  margin:3px;
  font-size: 8pt;
}
.field-button:hover {
  border: 1px solid rgba(var(--vs-primary), 1);
  border-radius: 5px;
  background-color: white;
  span {
    color: rgba(var(--vs-primary), 1) !important;
  }
  i {
    color: rgba(var(--vs-primary), 1) !important;
  }
}
.field-button.selected {
  border: 1px solid rgba(var(--vs-primary), 1);
  border-radius: 5px;
  background-color: white;
  span {
    color: rgba(var(--vs-primary), 1) !important;
  }
  i {
    color: rgba(var(--vs-primary), 1) !important;
  }
}
</style>
