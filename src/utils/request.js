export default function (config) {
    const {
        baseUrl
    } = config

    return function (Vue) {
        // 将请求挂载到Vue原型上
        Vue.prototype.request = async function (params) {
            const {
                url,
                method,
                data,
                header
            } = params
            uni.showLoading({
                title: "正在加载中...",
                mask: true
            })
            const res = await uni.request({
                url: baseUrl + url,
                method,
                data,
                header
            })
            uni.hideLoading()
            // 将关键数据提取出来
            return res[1].data.message
        }

    }

}