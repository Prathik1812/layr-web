export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: any;

    return function (this: any, ...args: any[]) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = undefined;
            func.apply(this, args);
        }, wait);
    } as T;
}
