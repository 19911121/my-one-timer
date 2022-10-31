class MyOneTimer {
    constructor(timestamp, unit = 1) {
        this.timer = null;
        this.events = {
            timer: [],
            completed: [],
        };
        this.timestamp = 0;
        this.unit = 0;
        if (0 >= timestamp)
            throw new RangeError('0보다 큰 숫자를 입력해 주세요.');
        if (1 > unit) {
            console.warn('타이머 주기가 1 milliseconds 보다 작아 1 milliseconds로 설정되었습니다.');
            this.unit = 1;
        }
        this.unit = unit;
        this.timestamp = timestamp;
        this.create();
    }
    create() {
        if (this.timer)
            this.dispose();
        this.timer = setInterval(() => {
            this.timestamp -= this.unit;
            if (0 >= this.timestamp) {
                this.timestamp = 0;
                this.eventCall('timer');
                this.eventCall('completed');
                this.destroy();
            }
            else {
                this.eventCall('timer');
            }
        }, this.unit);
    }
    dispose() {
        if (this.timer)
            clearInterval(this.timer);
    }
    eventCall(name) {
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
    destroy() {
        this.dispose();
    }
    addEventListener(name, cb) {
        this.events[name].push(cb);
    }
    removeEventListener(name, cb) {
        let events = null;
        let eventIndex = -1;
        if (Reflect.has(this.events, name)) {
            events = this.events[name];
            eventIndex = events.findIndex((v) => v === cb);
            if (-1 !== eventIndex)
                events.splice(eventIndex, 1);
            if (!events.length)
                delete this.events[name];
        }
    }
}

export { MyOneTimer as default };
