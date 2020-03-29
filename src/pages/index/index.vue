<template>
  <view class="container" :style="{height: height,overflow:'hidden'}">
    <!-- 搜索框 -->
    <search @defaultcScroll="defaultcScroll" />
    <!-- 轮播图 -->

    <view class="swiper">
      <swiper
        indicator-dots
        autoplay
        circular
        indicator-color="rgba(255, 255, 255, .3)"
        indicator-active-color="white"
      >
        <swiper-item v-for="(item,index) in swiperInfo" :key="index">
          <navigator :url="'/pages/goods/index?id='+item.goods_id">
            <image :src="item.image_src" />
          </navigator>
        </swiper-item>
      </swiper>
    </view>

    <!-- 导航栏 -->
    <view class="nav">
      <navigator
        :url="item.navigator_url||''"
        :open-type="item.open_type||'navigator'"
        v-for="item in categoryInfo"
        :key="item.name"
      >
        <image :src="item.image_src" />
      </navigator>
    </view>

    <!-- 楼层区域 -->
    <view class="floors">
      <view class="floor" v-for="(item,index) in floorsInfo" :key="index">
        <view class="floor_title">
          <image :src="item.floor_title.image_src" mode />
        </view>
        <view class="floor_item clearfix">
          <navigator
            v-for="(i,key) in item.product_list"
            :key="key"
            :url="i.navigator_url"
            :open-type="i.open_type"
          >
            <image :src="i.image_src" mode />
          </navigator>
        </view>
      </view>
    </view>

    <!-- 电梯导航 -->
    <view class="elevator" @click="goTop" v-if="scrollTop>=200">
      <view class="icon-chevron-thin-up"></view>
      <view>电梯</view>
    </view>
  </view>
</template>

<script>
import search from "@/components/search.vue"
export default {
  data() {
    return {
      //可用区域高度
      height: "auto",
      //   首页轮播图数据
      swiperInfo: [],
      //   首页分类选项数据
      categoryInfo: [],
      //   首页楼层数据
      floorsInfo: [],
      scrollTop: 0
    }
  },
  components: {
    search
  },
  onLoad() {
    this.getSwiperInfo()
    this.getcategoryInfo()
    this.getfloorsInfo()
    // uni.showShareMenu()
  },
  onPageScroll(ev) {
    this.scrollTop = ev.scrollTop
  },
  onShareAppMessage() {
    return {
      title: "你好",
      path: "/page/index/index?a=1",
      imageUrl: "https://www.zhengzhicheng.cn/pyg/banner1.png"
    }
  },
  //   监听用户的刷新操作
  async onPullDownRefresh() {
    await this.getSwiperInfo()
    await this.getcategoryInfo()
    await this.getfloorsInfo()
    uni.stopPullDownRefresh()
  }
  ,
  methods: {
    //   电梯导航

    goTop() {
      uni.pageScrollTo({
        scrollTop: 0
      })
    },
    // 获取可有区域高度,设置搜索框效果
    defaultcScroll(e) {
      this.height = e.height
    },

    // 获取服务端轮播图数据
    async getSwiperInfo() {
      const message = await this.request({
        url: '/api/public/v1/home/swiperdata'
      })
      this.swiperInfo = message
    },

    // 获取首页分类选项数据数据
    async getcategoryInfo() {
      const message = await this.request({
        url: '/api/public/v1/home/catitems'
      })
      this.categoryInfo = message
    },

    // 获取首页楼层数据
    async getfloorsInfo() {
      const message = await this.request({
        url: '/api/public/v1/home/floordata'
      })
      this.floorsInfo = message
    }

  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #f4f4f4;
}
swiper {
  width: 750rpx;
  height: 340rpx;
  image {
    width: 750rpx;
    height: 340rpx;
  }
}

.nav {
  height: 192rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  image {
    width: 100rpx;
    height: 140rpx;
  }
}

.floor {
  image {
    width: 100%;
    height: 100%;
  }
  .floor_title {
    width: 750rpx;
    height: 90rpx;
    padding: 10rpx 0 0 10rpx;
    box-sizing: border-box;
  }
  .floor_item {
    navigator {
      width: 193rpx;
      height: 188rpx;
      padding-left: 10rpx;
      padding-bottom: 10rpx;
      float: left;
      &:first-child {
        width: 232rpx;
        height: 386rpx;
        padding-left: 16rpx;
      }
      &:nth-child(2),
      &:nth-child(5) {
        // padding-top: 10rpx;
        width: 272rpx;
      }
    }
  }
  &:first-child {
    .floor_item {
      navigator {
        width: 232rpx;
      }
    }
  }
}

.elevator {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 90rpx;
  height: 90rpx;
  background-color: red;
  text-align: center;
  border-radius: 45rpx;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 10rpx #ccc;
}
/*每个页面公共css */

@font-face {
  font-family: "icomoon";
  src: url("https://lion-shiwenjie.github.io/jingtaiziyuan/top/fonts/icomoon.eot?8a35yy");
  src: url("https://lion-shiwenjie.github.io/jingtaiziyuan/top/fonts/icomoon.eot?8a35yy#iefix")
      format("embedded-opentype"),
    url("https://lion-shiwenjie.github.io/jingtaiziyuan/top/fonts/icomoon.ttf?8a35yy")
      format("truetype"),
    url("https://lion-shiwenjie.github.io/jingtaiziyuan/top/fonts/icomoon.woff?8a35yy")
      format("woff"),
    url("https://lion-shiwenjie.github.io/jingtaiziyuan/top/fonts/icomoon.svg?8a35yy#icomoon")
      format("svg");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="icon-"],
[class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: "icomoon" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-chevron-thin-up:before {
  content: "\e900";
}
.icon-circle-up:before {
  content: "\ea41";
}
</style>
