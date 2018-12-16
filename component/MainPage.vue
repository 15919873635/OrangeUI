<template>
  <div class="mainDiv">
    <div class="mainWindow">
      <window>
        <window-header :showCloseButton=false title="我的窗体" slot="winHeader" :height=50 bgColor="rgb(169,169,169)"></window-header>
        <window-footer slot="winFooter">
          <ok-button value="确定" bgColor="rgb(0,255,0)" slot="okButton" :callBack="okCallBack"></ok-button>
          <cancel-button value="取消" bgColor="rgb(169,169,169)" slot="cancelButton" :callBack="cancelCallBack"></cancel-button>
        </window-footer>
      </window>
    </div>
  </div>
</template>
<script>
import RWindow from './RWindow'
import RHeader from './RHeader'
import RFooter from './RFooter'
import RButton from './RButton'

export default {
  name: 'MainPage',
  data () {
    return {
      'okCallBack': function () {
        alert('dddd')
      },
      'cancelCallBack': function () {
        alert('mmmmmm')
      }
    }
  },
  components: {
    'window': RWindow,
    'window-header': RHeader,
    'window-footer': RFooter,
    'ok-button': RButton,
    'cancel-button': RButton
  }
}
</script>
<style scoped>
  @import url('../assets/css/base.css');
  .mainDiv {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .mainWindow {
    position: absolute;
    width: 800px;
    height: 600px;
    top: 50%;
    left: 50%;
    margin: -300px 0 0 -400px;
    border: 1px red solid;
  }
</style>
