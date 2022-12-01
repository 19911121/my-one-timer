# my-one-timer

## 설치

`
npm i my-one-timer
`

## 사용

``` typescript
new MyOneTimer(타이머 시간, 타이머 실행 주기);

const myOneTimer = new MyOneTimer(10000, 1000); // 10초를 1초 단위로 호출
```

## Methods

### `destroy`

타이머를 해제합니다.

``` typescript
myOneTimer.destroy();
```

### `addEventListener`

타이머 콜백 이벤트를 등록 합니다.

#### `Props`

- timer
  타이머 주기 마다 이벤트를 받습니다.

  - Listener
  Type: `(e: TimerEvent) => void`  

- completed
  타이머가 완료 되면 이벤트를 받습니다.

  - Listener
  Type: `(e: CompletedEvent) => void`  

``` typescript
myOneTimer.addEventListener(Props, Listener);
```

### `removeEventListener`

타이머 콜백 이벤트를 제거 합니다.

``` typescript
myOneTimer.removeEventListener(Props, Listener);
```
