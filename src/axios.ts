import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context)
    extend(instance, context)
    return instance as AxiosStatic
}
const axios = createInstance(defaults)

axios.create = function create(config) {
    // 通过类型推断 出config 还可以推断出函数的返回值的
    // 传入的config 和默认的config合并
    return createInstance(mergeConfig(defaults, config!))

}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
    return Promise.all(promises)
}

axios.spread = function spread(callback) {
    console.log(callback);
    return function (arr) {
        console.log(arr);
        return callback.apply(null, arr)
    }
    // console.log(wrap);
    // return wrap
}
axios.Axios = Axios

export default axios;