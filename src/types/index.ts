export type Method = 'get' | 'GET'
    | 'delete' | 'Delete'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
export interface AxiosRequestConfig {
    url?: string
    method?: Method
    data?: any
    params?: any
    headers?: any
    responseType?: XMLHttpRequestResponseType, // 响应的数据类型
    timeout?: number
    transformRequest?: AxiosTransformer | AxiosTransformer[]
    transformResponse?: AxiosTransformer | AxiosTransformer[]

    cancelToken?: CancelToken
    withCredentials?: boolean

    [propName: string]: any
}
export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}
export interface AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any
    response?: AxiosResponse
}

export interface Axios {
    defaults: AxiosRequestConfig
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }
    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}
export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}
export interface AxiosStatic extends AxiosInstance {
    // 实现一个静态方法
    create(config?: AxiosRequestConfig): AxiosInstance

    CancelToken: CancelTokenStatic
    Cancel: CancelStatic,
    isCancel: (value: any) => boolean
}

// 拦截器接口完毕
export interface AxiosInterceptorManager<T> {
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
    eject(id: number): void
}
export interface ResolvedFn<T> {
    (val: T): T | Promise<T>
}
export interface RejectedFn {
    (error: any): any
}
// 拦截器接口完毕


export interface AxiosTransformer {
    (data: any, headers?: any): any
}

// 因此在这个场景下，我们除了做 debounce，还希望后面的请求发出去的时候，如果前面的请求还没有响应，我们可以把前面的请求取消。

export interface CancelToken { // 实力类型
    promise: Promise<Cancel>
    reason?: Cancel

    throwIfRequested(): void
}
export interface Canceler {
    (message?: string): void
}
export interface CancelExecutor {
    (cancel: Canceler): void
}

export interface CancelTokenSource {
    token: CancelToken
    cancel: Canceler
}

export interface CancelTokenStatic { // 类类型
    new(excutor: CancelExecutor): CancelToken

    source(): CancelTokenSource
}
export interface Cancel {
    message?: string
}
export interface CancelStatic {
    new(message?: string): Cancel
}