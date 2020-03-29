<template>
  <view>
    <button open-type="getUserInfo" @getuserinfo="getuser" type="primary">微信登录</button>
    <view></view>
  </view>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  async onLoad() {
    // (1).已授权
    // 判断是否授权 未授权 return
    const [error, result] = await uni.getSetting()
    console.log(result.authSetting["scope.userInfo"]);
    if (!result.authSetting["scope.userInfo"]) return
    // 获取用户信息
    const [err, res] = await uni.getUserInfo()
    // 解构 用户信息
    const { encryptedData, iv, rawData, signature } = res
    // 获取code 用户登录凭证 （有效期五分钟）
    const [er, re] = await uni.login()
    // 发送请求token
    this.getToken({
      code: re.code,
      encryptedData,
      iv,
      rawData,
      signature
    })
  },
  methods: {
    // (2).未授权
    // 点击获取授权
    // 获取用户授权的用户信息
    async getuser(ev) {
      // console.log(ev);
      if (!ev.rawData) return;
      const { encryptedData, iv, rawData, signature } = ev.detail
      // 获取code 用户登录凭证 （有效期五分钟）
      const [er, re] = await uni.login()
      this.getToken({
        code: re.code,
        encryptedData,
        iv,
        rawData,
        signature
      })
    },
    async getToken({ code, encryptedData, iv, rawData, signature }) {
      const res = await this.request({
        url: "/api/public/v1/users/wxlogin",
        method: "post",
        data: {
          code,
          encryptedData,
          iv,
          rawData,
          signature
        }
      })
      const { token } = res.message
      uni.setStorageSync("token", token)
      uni.navigateBack();
      // console.log(res);
      // id不同所以必错误，无法完成token（todo）

    }
  }
}
</script>

<style lang="less" scoped>
button {
  width: 600rpx;
  margin: 200rpx auto 0;
}
</style>