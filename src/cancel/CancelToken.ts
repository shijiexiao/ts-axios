import { CancelExecutor, CancelTokenSource, Canceler } from '../types/index';
import Cancel from './Cancel'; // 不能从types中取 因为我们要把它当作值去使用

interface ResolvePromise {
    (reason?: Cancel): void
}
export default class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel
    constructor(executor: CancelExecutor) {
        let resolvePromise: any;
        this.promise = new Promise<Cancel>(resolve => {
            resolvePromise = resolve
            // resolvePromise指向resolve函数
            // 把pending变成resolve
        })
        executor(message => {
            // 防止多次调用
            if (this.reason) {
                return
            }
            this.reason = new Cancel(message)
            resolvePromise(this.reason)
        })
    }

    throwIfRequested(): void {
        if (this.reason) {
            throw this.reason
        }
    }
    static souce(): CancelTokenSource {
        let cancel!: Canceler  // 断言它是优质的
        const token = new CancelToken(executor => {
            cancel = executor
        })
        return {
            cancel,
            token
        }
    }
}