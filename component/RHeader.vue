<template>
  <div :style="style">{{title}}
    <did v-if="showCloseButton">
      <close-button value="X"></close-button>
    </did>
  </div>
</template>

<script>
import RButton from './RButton'
export default {
  name: 'RHeader',
  props: {
    'height': {type: Number, require: false, default: 30},
    'color': {type: String, require: false, default: 'rgb(0,0,0)'},
    'bgColor': {type: String, require: false, default: 'rgb(255,255,255)'},
    'title': {type: String, require: false, default: '新窗体'},
    'showCloseButton': {type: Boolean, require: false, default: true}
  },
  components: {
    'close-button': RButton
  },
  data () {
    return {
      style: {
        'position': 'absolute',
        'font-size': '24px',
        'width': '100%',
        'height': this.height + 'px',
        'line-height': this.height + 'px',
        'color': this.color,
        'background-color': this.bgColor
      }
    }
  }
}
</script>
<style scoped>
  @import url('../assets/css/base.css');
</style>
