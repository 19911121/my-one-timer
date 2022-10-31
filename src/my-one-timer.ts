/**
 * MyOneTimer
 */

type TimerCallBack = (timestamp: number) => void;
type ComplatedCallBack = (completed: boolean) => void;

interface EventMap {
  timer: TimerCallBack;
  completed: ComplatedCallBack;
};

type Events = {
  [key in keyof EventMap]: EventMap[key][];
}

class MyOneTimer {
  private timer: ReturnType<typeof setInterval> | null = null;
  private events: Events = {
    timer: [],
    completed: [],
  };

  /** 타이머 진행 시간 */
  private timestamp = 0;
  /** 타이머 진행 주기 */
  private unit = 0;

  /**
   * @constructor MyOneTimer
   * 
   * @param timestamp - milliseconds
   * @param unit - milliseconds
   */
  constructor(timestamp: number, unit = 1) {
    if (0 >= timestamp) throw new RangeError('0보다 큰 숫자를 입력해 주세요.');
    if (1 > unit) {
      console.warn('타이머 주기가 1 milliseconds 보다 작아 1 milliseconds로 설정되었습니다.');

      this.unit = 1;
    }
    
    this.unit = unit;
    this.timestamp = timestamp;
    this.create();
  }

  /**
   * create timer
   *
   * @private
   * @return {void}
   */
  private create() {
    if (this.timer) this.dispose();

    this.timer = setInterval(() => {
      this.timestamp -= this.unit;

      if (0 >= this.timestamp) {
        this.timestamp = 0;
        this.eventCall('timer');
        this.eventCall('completed');
        this.destroy();
      } else {
        this.eventCall('timer');
      }
    }, this.unit);
  }

  /**
   * dispose timer
   *
   * @private
   * @return {void}
   */
  private dispose() {
    if (this.timer) clearInterval(this.timer);
  }

  /**
   * callback 이벤트 호출
   *
   * @private
   * @param {string} name
   * @return {void}
   */
  private eventCall(name: string) {
    switch (name) {
      case 'timer':
        for (const cb of this.events.timer) {
          cb(this.timestamp);
        }

        break;
      case 'completed':
        for (const cb of this.events.completed) {
          cb(true);
        }

        break;
    }
  }

  /**
   * destroy class
   */
  public destroy(): void {
    this.dispose();
  }

  /**
   * 콜백 이벤트를 등록합니다.
   * 
   * @param name - 이벤트명
   * @param cb - 콜백 함수
   */
  public addEventListener<K extends keyof EventMap>(name: K, cb: EventMap[K]): void {
    this.events[name].push(cb);
  }

  /**
   * 콜백 이벤트를 제거합니다.
   * 
   * @param name - 이벤트명
   * @param cb - 콜백 함수
   */
  public removeEventListener<K extends keyof EventMap>(name: K, cb: EventMap[K]): void {
    let events = null;
    let eventIndex = -1;

    if (Reflect.has(this.events, name)) {
      events = this.events[name];
      eventIndex = events.findIndex((v) => v === cb);

      if (-1 !== eventIndex) events.splice(eventIndex, 1);
      if (!events.length) delete this.events[name];
    }
  }
}

export default MyOneTimer;
