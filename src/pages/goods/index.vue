<template>
  <view class="wrapper" v-if="goodsInfo">
    <!-- 商品图片 -->
    <swiper
      class="pics"
      indicator-dots
      indicator-color="rgba(255, 255, 255, 0.6)"
      indicator-active-color="#fff"
    >
      <swiper-item v-for="item in goodsInfo.pics" :key="item.pics_id">
        <image :src="item.pics_sma" />
      </swiper-item>
    </swiper>
    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{goodsInfo.goods_price}}</view>
      <view class="name">{{goodsInfo.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
    </view>
    <!-- 操作 -->
    <view class="action">
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @click="goCart(goodsInfo.goods_id)">购物车</text>
      <text class="add" @click="addShoppingCar">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 商品详情对象
      goodsInfo: null,
      //购物车信息
      carts: uni.getStorageSync("carts") || []
    }
  },
  onLoad(params) {
    const { id } = params
    this.getGoodsDetail(Number(id))
  },

  methods: {
    addShoppingCar() {
      // if(uni.getstorage("token")){
      //     this.request({

      //     })
      // } else{
      //   uni.swicthTab()
      // }
      const {
        goods_id,
        goods_name,
        goods_price,
        goods_small_logo
      } = this.goodsInfo

      // flag是否存在相同的goods_id
      let flag = false
      this.carts.forEach(item => {
        if (item.goods_id == goods_id) {
          flag = true
          item.goods_number++
        }
      })
      if (!flag) {
        this.carts.push({
          goods_id,
          goods_small_logo,
          goods_name,
          goods_price,
          goods_number: 1,
          goods_checked: true
        })
      }
      uni.setStorageSync("carts", this.carts)
    },
    async getGoodsDetail(id) {
      const message = await this.request({
        url: "/api/public/v1/goods/detail",
        data: {
          goods_id: id
        }
      })
      this.goodsInfo = message
      // console.log(message);
    }
    ,
    goCart(id) {
      // console.log(id);
      uni.switchTab({
        url: "/pages/shoppingCar/index"
      }
      )
    },
    createOrder() {
      uni.navigateTo({
        url: '/pages/order/index'
      })
    }
  }
}
</script>

<style scoped lang="less">
image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
.wrapper {
  margin-bottom: 100rpx;
  background-color: #f4f4f4;
}

.pics {
  height: 640rpx;
}

.meta {
  height: 250rpx;
  line-height: 1;
  padding: 30rpx 180rpx 30rpx 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  position: relative;

  .price {
    font-size: 36rpx;
    color: #ea4451;
    margin-bottom: 20rpx;
  }

  .name {
    color: #333;
    line-height: 1.4;
    font-size: 33rpx;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .shipment {
    font-size: 27rpx;
    color: #999;
    position: absolute;
    bottom: 30rpx;
  }

  .collect {
    width: 140rpx;
    height: 88rpx;
    text-align: center;
    box-sizing: border-box;
    border-left: 1rpx solid #ddd;
    font-size: 24rpx;
    color: #999;

    position: absolute;
    right: 10rpx;
    top: 91rpx;
  }

  [class*="icon-"]::before {
    display: block;
    font-size: 45rpx;
    margin-bottom: 10rpx;
  }
}

.detail image {
  width: 100%;
  height: 480rpx;
  margin-top: 20rpx;
}

.action {
  width: 100%;
  height: 98rpx;
  background-color: #fff;

  position: fixed;
  left: 0;
  bottom: 0;

  display: flex;
  align-items: center;

  text {
    display: block;
  }

  .add,
  .buy {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 210rpx;
    text-align: center;
    font-size: 27rpx;
    color: #fff;
  }

  .add {
    background-color: #f4b73f;
  }

  .buy {
    background-color: #ea4451;
  }

  button {
    padding: 0;
    border-radius: 0;
    background-color: #fff;

    &::after {
      border: none;
    }
  }

  button,
  .cart {
    flex: 1;
    text-align: center;
    color: #989898;
    font-size: 24rpx;
    box-sizing: border-box;
  }

  [class*="icon"]::before {
    display: block;
    font-size: 45rpx;
    margin-bottom: 2rpx;
  }
}
</style>
