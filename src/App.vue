<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="less">
@import "./fonts";
.clearfix::before,
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.clearfix {
  zoom: 1;
}
</style>
