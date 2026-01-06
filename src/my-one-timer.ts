/**
 * MyOneTimer
 */

interface CompletedEvent {
  /** 이벤트 시작 timestamp */
  startTimestamp: number;
  /** 이벤트 발생 timestamp */
  callTimestamp: number;
  /** 오차 딜레이 */
  errorDeley: number;
}

interface TimerEvent extends CompletedEvent {
  /** 남은 timestamp */
  timestamp: number;
}

type ComplatedFunction = (event: CompletedEvent) => void;
type TimerFunction = (event: TimerEvent) => void;

interface EventMap {
  completed: ComplatedFunction;
  timer: TimerFunction;
}

type Events<K extends keyof EventMap = keyof EventMap> = {
  [key in K]: EventMap[key][];
};

class MyOneTimer {
  private isDestroy = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private events: Events = {
    completed: [],
    timer: []
  };

  /** 타이머 진행 시간 */
  private timestamp = 0;

  /** 타이머 진행 주기 */
  private delay = 0;

  /** timestamp를 delay로 나누었을 때 반복 해야 하는 횟수 */
  private loopCount = 0;

  /** 시작 시간 */
  private startTimestamp = 0;

  /**
   * @constructor MyOneTimer
   *
   * @param timestamp - milliseconds
   * @param delay - milliseconds
   */
  constructor(timestamp: number, delay = 1) {
    if (this.isDestroy) {
      console.error('Class that has already been destroyed');

      return;
    }

    // timestamp 체크
    if (0 >= timestamp) throw new RangeError('0보다 큰 숫자를 입력해 주세요.');

    // delay 체크
    if (1 > delay) {
      console.warn(
        '타이머 주기가 1 milliseconds 보다 작아 1 milliseconds로 설정되었습니다.'
      );

      this.delay = 1;
    } else {
      this.delay = delay;
    }

    this.timestamp = timestamp;
    this.loopCount = Math.ceil(timestamp / delay);
    this.startTimestamp = Date.now();
    this.start();
  }

  /**
   * 타이머 시작
   *
   * @param count 현재 루프 횟수
   * @param prevCumulativeErrorDeley 이전 누적 오차
   */
  private start(count = 1, prevCumulativeErrorDeley = 0) {
    this.timer = setTimeout(() => {
      const callTimestamp = Date.now();
      const event: Pick<CompletedEvent, 'startTimestamp' | 'callTimestamp'> = {
        startTimestamp: this.startTimestamp,
        callTimestamp: callTimestamp
      };
      const remainingTimestamp = Math.max(
        0,
        this.timestamp - (callTimestamp - this.startTimestamp)
      );
      const errorDeley =
        callTimestamp - this.startTimestamp - this.delay * count;

      if (this.loopCount === count) {
        this.eventCall('timer', {
          ...event,
          timestamp: remainingTimestamp,
          errorDeley
        });

        this.eventCall('completed', {
          ...event,
          errorDeley
        });

        this.destroy();
      } else {
        this.eventCall('timer', {
          ...event,
          timestamp: remainingTimestamp,
          errorDeley
        });

        this.start(count + 1, errorDeley);
      }
    }, this.delay - prevCumulativeErrorDeley);
  }

  /**
   * dispose timer
   */
  private dispose() {
    if (this.timer) {
      clearTimeout(this.timer);

      this.timestamp = 0;
      this.delay = 0;
      this.loopCount = 0;
      this.startTimestamp = 0;
    }
  }

  /**
   * callback 이벤트 호출
   *
   * @param name
   * @param args
   */
  private eventCall<K extends keyof EventMap>(
    name: K,
    payload: Parameters<EventMap[K]>[number]
  ) {
    for (const cb of this.events[name]) {
      cb(payload as any);
    }
  }

  /**
   * destroy class
   */
  public destroy(): void {
    this.dispose();
    this.isDestroy = true;
    this.events = {
      timer: [],
      completed: []
    };
  }

  /**
   * 콜백 이벤트를 등록합니다.
   *
   * @param name - 이벤트명
   * @param cb - 콜백 함수
   */
  public addEventListener<K extends keyof EventMap>(
    name: K,
    cb: EventMap[K]
  ): void {
    this.events[name].push(cb);
  }

  /**
   * 콜백 이벤트를 제거합니다.
   *
   * @param name - 이벤트명
   * @param cb - 콜백 함수
   */
  public removeEventListener<K extends keyof EventMap>(
    name: K,
    cb: EventMap[K]
  ): void {
    let events = null;
    let eventIndex = -1;

    if (Reflect.has(this.events, name)) {
      events = this.events[name];
      eventIndex = events.findIndex(v => v === cb);

      if (-1 !== eventIndex) events.splice(eventIndex, 1);
      if (!events.length) delete this.events[name];
    }
  }
}

export default MyOneTimer;
