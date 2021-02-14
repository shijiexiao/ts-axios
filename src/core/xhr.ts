import { AxiosRequestConfig } from '../types';
import { AxiosPromise, AxiosResponse } from '../types/index';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';
import { isURLSameOrigin } from '../helpers/url';
import cookie from '../helpers/cookie';
import { isFormData } from '../helpers/utils';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, validateStatus, auth, method = 'get', headers, responseType, timeout, cancelToken, withCredentials, xsrfCookieName, xsrfHeaderName, onDownloadProgress, onUploadProgress } = config

        const request = new XMLHttpRequest()

        // yibu
        request.open(method.toUpperCase(), url!, true)

        configureRequest()

        addEvents()

        processHeaders()

        processCancel()

        // 把字符串传给xmlhttprequest（）
        request.send(data)

        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType
            }
            if (timeout) {
                request.timeout = timeout
            }
            if (withCredentials) {
                request.withCredentials = withCredentials
            }
        }

        function addEvents(): void {
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
                handleResponse(response);
            }
            request.onerror = function handleError() {
                reject(createError('Network Error', config, null, request))
            }

            request.ontimeout = function handleTimeout() {
                reject(createError(`TIMEout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
            }
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }

        function processHeaders(): void {
            if (isFormData(data)) {
                delete headers['Content-type']
            }

            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue
                }
            }
            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }


            headers && Object.keys(headers).forEach(name => {
                console.log(name);
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }
            })
        }
        function processCancel(): void {
            if (cancelToken) {
                // promise异步分离
                cancelToken.promise.then(reason => {
                    request.abort()
                    reject(reason)
                })
            }
        }

        function handleResponse(response: AxiosResponse): void {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response)
            } else {
                reject(createError(`Request faild with status code ${response.status}`, config, null, request, response))
            }
        }
    })
}