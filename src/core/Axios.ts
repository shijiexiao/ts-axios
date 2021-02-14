import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from '../types/index';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import dispatchRequest, { transformURL } from './dipatchRequest';

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
    resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default class Axios {
    defaults: AxiosRequestConfig
    interceptors: Interceptors
    constructor(initConfig: AxiosRequestConfig) {
        this.defaults = initConfig
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }
    request(url: any, config?: any): AxiosPromise {
        if (typeof url === 'string') {
            if (!config) { config = {} }
            config.url = url
        } else {
            config = url
        }
        // 一堆拦截器 现在是初始值
        // 这个初始值很重要
        // 

        // hebin
        config = mergeConfig(this.defaults, config)


        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]

        // this.interceptors 通过InterceptorManager收集起来了
        // axios。request 就会进行相应的触发  触发拦截器
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor) // 先添加的后执行
        })
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor) // 响应拦截器 先添加的先执行
        })
        // 让链条依次执行
        let promise = Promise.resolve(config)
        while (chain.length) {
            // 类型强制断言
            const { resolved, rejected } = chain.shift()!
            // console.log(resolved);
            // console.log(resolved);
            // resolved 一堆request之后  执行初始值 会返回res 所以后面的interceptor 就是responsechain.push(interceptor) 就会执行
            promise = promise.then(resolved, rejected)
            // console.log(promise);
        }
        return promise
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        console.log(this);
        return this._requestMethodWithoutData('get', url, config)
    }
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('delete', url, config)
    }
    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('head', url, config)
    }
    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('options', url, config)
    }
    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('post', url, data, config)
    }
    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('put', url, data, config)
    }
    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('patch', url, data, config)
    }
    _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
        return this.request(Object.assign(config || {}, {
            method,
            url
        }))
    }
    _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request(Object.assign(config || {}, {
            method,
            url,
            data
        }))
    }
    getUri(config?: AxiosRequestConfig): string {
        config = mergeConfig(this.defaults, config!)
        return transformURL(config)
    }
}