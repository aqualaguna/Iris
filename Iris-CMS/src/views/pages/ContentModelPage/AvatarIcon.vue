<template>
  <div @click="$emit('click')" class="content-model-icon mx-3" :class="{
    'small': size == 'small',
    'big': size == 'big',
  }">
    <feather-icon :icon="icon || 'KeyIcon'" />
  </div>
</template>

<script>
export default {
  props: ['icon', 'size']
};
</script>

<style lang="scss">
.content-model-icon {
  background-color: #c3c3c3;
  border-radius: 100px;
  color: white;
  width: 50px;
  height: 50px;
  span {
    position: absolute; /* 2 */
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
  }
}
.content-model-icon.small {
  width: 30px;
  height: 30px;
}

.content-model-icon.big {
  width: 70px;
  height: 70px;
}
</style>

