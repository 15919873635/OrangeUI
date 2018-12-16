<template>
  <div :style="style" class="footer">
    <slot name="okButton"></slot>
    <slot name="cancelButton"></slot>
  </div>
</template>

<script>
export default {
  name: 'RFooter',
  props: {
    'height': {type: Number, require: false, default: 50},
    'bgColor': {type: String, require: false, default: 'rgb(255,255,255)'}
  },
  data () {
    return {
      style: {
        'height': this.height + 'px',
        'background-color': this.bgColor
      }
    }
  }
}
</script>

<style scoped>
  @import url('../assets/css/base.css');
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>
