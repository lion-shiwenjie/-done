<template>
  <view :class="{toggleColor:istoggleColor}">
    <!-- 搜索框 -->
    <view class="search">
      <!-- placeholder="搜索" placeholder-class="searchPH" -->
      <input
        type="text"
        v-model="searchValue"
        @focus="onfocus"
        @input="oninput"
        :placeholder="placeholder"
        @confirm="onconfirm"
      />
      <text v-if="istoggleColor" @click="onblur">取消</text>
    </view>
    <!-- 搜索结果 -->
    <view class="search_result">
      <div class="content">
        <block v-if="!searchValue">
          <div class="title">
            搜索历史
            <span class="clear" @click="clearHistory"></span>
          </div>
          <div class="history">
            <navigator
              :url="'/pages/list/index?query='+historyItem"
              v-for="(historyItem,index) in searchHistory"
              :key="index"
            >{{historyItem}}</navigator>
          </div>
        </block>
        <!-- 结果 -->
        <scroll-view scroll-y class="result" v-else>
          <navigator
            :url="'/pages/goods/index?id='+item.goods_id"
            v-for="item in searchResult"
            :key="item.goods_id"
          >{{item.goods_name}}</navigator>
        </scroll-view>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 切换底色与现实隐藏
      istoggleColor: false,
      //   占位值
      placeholder: "",
      //   搜索历史是否显示
      //   搜索框的值
      searchValue: "",
      //   查询结果列表
      searchResult: [],
      //   查询寻历史列表
      searchHistory: uni.getStorageSync('searchHistory') || [],
      // 搜索限制锁
      locked: false
    };
  },

  methods: {
    clearHistory() {
      uni.removeStorageSync("searchHistory")
      this.searchHistory = []
    },
    onfocus() {
      this.istoggleColor = true;
      this.placeholder = "请输入您想要的商品"
      const { windowHeight } = uni.getSystemInfoSync()
      this.$emit("defaultcScroll", {
        height: windowHeight + "px"
      })
      uni.hideTabBar()
    },
    onblur() {
      this.istoggleColor = false
      this.placeholder = ""
      this.$emit("defaultcScroll", {
        height: "auto"
      })
      this.searchValue = ""
      this.searchResult = []
      uni.showTabBar()
    },
    async oninput() {
      if (this.locked) return
      this.locked = true
      this.searchResult = await this.request({
        url: "/api/public/v1/goods/qsearch",
        data: {
          query: this.searchValue
        }
      })
      this.locked = false
    },
    onconfirm() {

      this.searchHistory.push(this.searchValue)
      this.searchHistory = [...new Set(this.searchHistory)]
      uni.setStorageSync(
        "searchHistory", this.searchHistory
      )
      wx.navigateTo({
        url: "/page/list/index?query=" + this.searchValue
      })

    }

  }
}
</script>

<style lang="less">
.search {
  display: flex;
  padding: 20rpx 16rpx;
  background-color: #ea4451;
  position: relative;
  &::after {
    position: absolute;
    content: "搜索";
    display: block;
    height: 32rpx;
    line-height: 32rpx;
    color: #c7c7c7;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
    background-size: 32rpx 32rpx;
    background-repeat: no-repeat;
    padding-left: 48rpx;
  }
  &::before {
    position: absolute;
    content: "";
    display: none;
    width: 32rpx;
    height: 32rpx;
    top: 50%;
    transform: translate(0, -50%);
    background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
    background-size: 32rpx 32rpx;
    background-repeat: no-repeat;
    margin-left: 22rpx;
  }
  input {
    flex: 1;
    background-color: white;
    font-size: 24rpx;
    padding-left: 70rpx;
    height: 60rpx;
    border-radius: 5rpx;
  }
  text {
    display: inline-block;
    margin-left: 20rpx;
    text-align: center;
    width: 160rpx;
    height: 60rpx;
    line-height: 60rpx;
    border: 1rpx solid #bfbebf;
    border-radius: 10rpx;
    box-sizing: border-box;
  }
}
.search_result {
  display: none;
  position: absolute;
  top: 100rpx;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 9;
}
.toggleColor {
  .search {
    background-color: #eeeeee;
    &::after {
      display: none;
    }
    &::before {
      display: block;
    }
  }
  .search_result {
    display: block;
  }
}
.content {
  //   display: none;
  //     flex: 1;
  //   top: 60rpx;
  //   bottom: 0;
  //   padding: 27rpx;
  //   background-color: #fff;
  //   position: absolute;

  .title {
    font-size: 27rpx;
    line-height: 1;
    color: #333;
  }

  .clear {
    display: block;
    width: 27rpx;
    height: 27rpx;
    float: right;
    background-image: url(http://static.botue.com/ugo/images/clear.png);
    background-size: cover;
  }

  .history {
    padding-top: 30rpx;

    navigator {
      display: inline-block;
      line-height: 1;
      padding: 15rpx 20rpx 12rpx;
      background-color: #ddd;
      font-size: 24rpx;
      margin-right: 20rpx;
      margin-bottom: 15rpx;
      color: #333;
    }
  }

  .result {
    // display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;

    navigator {
      line-height: 1;
      padding: 20rpx 30rpx;
      font-size: 24rpx;
      color: #666;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
