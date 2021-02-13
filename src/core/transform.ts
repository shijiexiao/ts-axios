import { AxiosTransformer } from '../types/index';
export default function transform(data: any, headers: any
    , fns?: AxiosTransformer | AxiosTransformer[]): any {
    if (!fns) {
        return data
    }
    if (!Array.isArray(fns)) {
        fns = [fns] // 目的为的是 后面好遍历
    }
    fns.forEach(fn => {
        data = fn(data, headers)
    })
    return data
}