<template>
  <view class="wrapper" v-if="cartsInfo.length">
    <!-- 收货信息 -->
    <view class="shipment">
      <block v-if="address">
        <view class="dt">收货人:</view>
        <view class="dd meta">
          <text class="name">{{address.userName}}</text>
          <text class="phone">{{address.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{detailAddress}}</view>
      </block>
      <button v-else type="primary" @click="getAdress">获取收货地址</button>
    </view>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
        <view class="goods" v-for=" (item,index) in cartsInfo " :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo" />
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>
              {{item.goods_price}}
              <text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="changeNumber(index,-1)">-</text>
              <input type="number" v-model="item.goods_number" class="number" @blur="onblur(index)" />
              <text class="plus" @click="changeNumber(index,1)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon
              type="success"
              size="20"
              :color="item.goods_checked?'#ea4451':'#ccc'"
              @click="toggleChecked(index)"
            ></icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall" @click="checkAll">
        <icon type="success" :color="all?'#ea4451':'#ccc'" size="20"></icon>全选
      </label>
      <view class="total">
        合计:
        <text>￥</text>
        <label>{{amount}}</label>
        <text>.00</text>
      </view>
      <view class="pay" @click="pay">结算({{cheNumber}})</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cartsInfo: [],
      address: null
    }
  },
  computed: {
    detailAddress() {
      return this.address && this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
    },
    cheNumber() {
      let num = 0
      this.checkedGoods.forEach(item => {
        num += item.goods_number
      })
      return num
    },
    amount() {
      let amount = 0
      this.checkedGoods.forEach(item => {
        amount += item.goods_price * item.goods_number
      })
      return amount
    },
    all() {
      return this.checkedGoods.length === this.cartsInfo.length
    },
    checkedGoods() {
      return this.cartsInfo.filter(item => {
        return item.goods_checked
      })
    }
  },
  methods: {
    getAdress() {
      let that = this
      uni.chooseAddress({
        success: (res) => {
          this.address = res
        }
      })
    },
    pay() {
      if (!this.address) return uni.showToast({
        title: "地址不能为空",
        icon: "loading"
      })
      if (!this.checkedGoods.length) return uni.showToast({
        title: "请先选择一件商品",
        icon: "loading"
      })
      if (!uni.getStorageSync("token")) {
        console.log(1)
        return uni.navigateTo({
          url: "/pages/auth/index"
        })
      }
    },
    checkAll() {
      if (this.all) {
        this.cartsInfo.forEach(item => {
          item.goods_checked = false
        })
      } else {
        this.cartsInfo.forEach(item => {
          item.goods_checked = true
        })
      }
      uni.setStorageSync('carts', this.cartsInfo)
    },
    toggleChecked(index) {
      this.cartsInfo[index].goods_checked = !this.cartsInfo[index].goods_checked
      uni.setStorageSync('carts', this.cartsInfo)
    },
    onblur(index) {
      const num = this.cartsInfo[index].goods_number
      if (num <= 1) {
        this.cartsInfo[index].goods_number = 1
        uni.setStorageSync('carts', this.cartsInfo)

      }
      if (num >= 100) {
        this.cartsInfo[index].goods_number = 100
        uni.setStorageSync('carts', this.cartsInfo)

      }
    },
    getcartsInfo() {
      this.cartsInfo = uni.getStorageSync("carts")
    },
    changeNumber(index, step) {
      const num = this.cartsInfo[index].goods_number
      if (step === -1 && num <= 1) return
      if (step === 1 && num >= 100) return
      this.cartsInfo[index].goods_number += step
      uni.setStorageSync('carts', this.cartsInfo)

    }
  },
  onLoad() {
    this.getcartsInfo()
  }



}
</script>

<style scoped lang="less">
.shipment {
  height: 100rpx;
  line-height: 2;
  padding: 30rpx 30rpx 40rpx 30rpx;
  font-size: 27rpx;
  color: #333;
  background-color: #fff;
  background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;

  .dt {
    width: 140rpx;
    float: left;
    clear: both;
  }

  .dd {
    padding-left: 160rpx;
  }

  .meta {
    padding-right: 50rpx;
  }

  text.phone {
    float: right;
  }
}

.carts {
  background-color: #f4f4f4;
  padding-bottom: 110rpx;
  overflow: hidden;

  .shopname {
    padding: 30rpx;
    margin-top: 20rpx;
    font-size: 30rpx;
    color: #333;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    border-bottom: 1rpx solid #eee;
  }

  .goods {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 100rpx;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;

    position: relative;

    .checkbox {
      width: 101rpx;
      height: 100%;
      background-color: #fff;

      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      left: -100rpx;
      top: 0;
    }

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }

    .amount {
      position: absolute;
      bottom: 0;
      right: 20rpx;

      height: 48rpx;
      text-align: center;
      border: 1rpx solid #ddd;
      border-radius: 8rpx;

      display: flex;
      align-items: center;

      text {
        display: block;
        width: 60rpx;
        line-height: 48rpx;
        font-size: 36rpx;
        color: #ddd;
        text-align: center;
      }

      input {
        width: 60rpx;
        height: 48rpx;
        min-height: 48rpx;
        font-size: 27rpx;
        border-left: 1rpx solid #ddd;
        border-right: 1rpx solid #ddd;
      }
    }
  }
}

.extra {
  position: fixed;
  bottom: 0;
  /* #ifdef H5 */
  bottom: 50px;
  /* #endif */
  left: 0;
  z-index: 9;

  width: 750rpx;
  height: 96rpx;
  text-align: center;
  line-height: 96rpx;
  font-size: 36rpx;
  border-top: 1rpx solid #eee;
  background-color: #fff;
  color: #333;
  display: flex;

  .checkall {
    width: 140rpx;
    line-height: 1;
    margin-left: 25rpx;
    display: flex;
    align-items: center;

    icon {
      margin-right: 20rpx;
    }
  }

  .total {
    display: flex;
    justify-content: center;
    flex: 1;

    label,
    text {
      color: #ea4451;
      vertical-align: bottom;
      position: relative;
      bottom: -2rpx;
    }

    text {
      position: relative;
      bottom: -3rpx;
      font-size: 24rpx;

      &:first-child {
        margin-left: 10rpx;
      }
    }
  }

  .pay {
    width: 200rpx;
    background-color: #ea4451;
    color: #fff;
  }
}
</style>

