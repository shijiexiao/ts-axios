import { AxiosRequestConfig } from '../types';
import { AxiosPromise, AxiosResponse } from '../types/index';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, responseType, timeout } = config

        const request = new XMLHttpRequest()

        if (responseType) {
            request.responseType = responseType
        }
        if (timeout) {
            request.timeout = timeout
        }

        // yibu
        request.open(method.toUpperCase(), url!, true)

        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) { // 为4接收到 不为4没接收到
                return;
            }
            if (request.status === 0) {
                return;
            }
            const responseHeaders = parseHeaders(request.getAllResponseHeaders());
            const responseData = responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            resolve(response);
        }
        request.onerror = function handleError() {
            reject(createError('Network Error', config, null, request))
        }

        request.ontimeout = function handleTimeout() {
            reject(createError(`TIMEout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
        }

        headers && Object.keys(headers).forEach(name => {
            console.log(name);
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        })
        // 把字符串传给xmlhttprequest（）
        request.send(data)
        function handleResponse(response: AxiosResponse): void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else {
                reject(createError(`Request faild with status code ${response.status}`, config, null, request, response))
            }
        }
    })
}