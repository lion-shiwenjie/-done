import Vue from 'vue'
import App from './App'
import request from "@/utils/request"

const plugin = request({
  baseUrl: "https://www.uinav.com"
})
Vue.use(plugin)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()