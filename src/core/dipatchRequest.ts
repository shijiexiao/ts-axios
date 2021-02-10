import { AxiosRequestConfig } from '../types'
import xhr from './xhr';
import { buildURL } from '../helpers/url';
import { transformRequest, transformResponse } from '../helpers/data';
import { processHeaders } from '../helpers/headers';
import { AxiosPromise, AxiosResponse } from '../types/index';
export default  function axios(config: AxiosRequestConfig): AxiosPromise {
    processConfig(config)
    return xhr(config).then(res => {
        // 拿到响应对象  对数据进行 处理
        return transformResponseData(res)
        // return res
    })
}
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
    config.headers = transformHeaders(config)
    console.log(config.headers);
    config.data = transformRequestData(config);
}
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url!, params); // 判断不为空直接后main加个感叹号
}
function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}
function transformHeaders(config: AxiosRequestConfig): any {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}
function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transformResponse(res.data)
    return res
}
