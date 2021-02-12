import { ResolvedFn } from '../types';
import { RejectedFn } from '../types/index';

interface Interceptor<T> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn

}

export default class InterceptorManager<T> {
    // 存储我们这个拦截器  每个元素都是Interceptor这个接口 每个interceptor都有两个对象
    // 数组 数组的类型是Interceptor<T>  
    private interceptors: Array<Interceptor<T> | null>
    constructor() {
        this.interceptors = []
    }
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1
    }

    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        // 对我们的interceptors进行遍历
        // 定义的接口和类的实现 
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor)
            }
        })
    }

    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}