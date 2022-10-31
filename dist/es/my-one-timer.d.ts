declare type TimerCallBack = (timestamp: number) => void;
declare type ComplatedCallBack = (completed: boolean) => void;
interface EventMap {
    timer: TimerCallBack;
    completed: ComplatedCallBack;
}
declare class MyOneTimer {
    private timer;
    private events;
    private timestamp;
    private unit;
    constructor(timestamp: number, unit?: number);
    private create;
    private dispose;
    private eventCall;
    destroy(): void;
    addEventListener<K extends keyof EventMap>(name: K, cb: EventMap[K]): void;
    removeEventListener<K extends keyof EventMap>(name: K, cb: EventMap[K]): void;
}
export default MyOneTimer;
