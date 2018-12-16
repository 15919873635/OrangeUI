<template>
  <div :style="style" class="button" @click="cbMethod">{{value}}</div>
</template>

<script>
export default {
  name: 'RButton',
  props: {
    'height': {type: Number, require: false, default: 30},
    'width': {type: Number, require: false, default: 50},
    'value': {type: String, require: false, default: '确定'},
    'color': {type: String, require: false, default: 'rgb(255,255,255)'},
    'bgColor': {type: String, require: false, default: 'rgb(255,255,255)'},
    'callBack': {type: Function, require: false, default: () => {}}
  },
  data () {
    return {
      style: {
        'width': this.width + 'px',
        'height': this.height + 'px',
        'line-height': this.height + 'px',
        'color': this.color,
        'background-color': this.bgColor
      }
    }
  },
  methods: {
    'cbMethod': function () {
      (this.callBack)()
    }
  }
}
</script>

<style scoped>
  @import url('../assets/css/base.css');
  .button {
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    float: right;
    margin-right: 20px;
  }
</style>
