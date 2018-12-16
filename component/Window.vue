<template>
  <div :style="style">
    <slot name="winHeader"></slot>
    <slot name="winBody"></slot>
    <slot name="winFooter"></slot>
  </div>
</template>
<script>
export default {
  name: 'Window',
  data () {
    return {
      style: {
        'width': '100%',
        'height': '100%'
      }
    }
  }
}
</script>

<style scoped>
  @import url('../assets/css/base.css');
</style>
