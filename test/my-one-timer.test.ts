import { describe, expect, test } from '@jest/globals';
import MyOneTimer from '../src/my-one-timer';

describe('my one timer', () => {
  test('총 5초 1초주기 테스트', async () => {
    return new Promise((resolve, reject) => {
      const timestamp = 5000;
      const timerDeley = 1000;
      const myOneTimer = new MyOneTimer(timestamp, timerDeley); // 총 5초 1초주기
  
      myOneTimer.addEventListener('completed', async (e) => {
        const completedTime = e.callTimestamp - e.startTimestamp;
  
        resolve(expect(completedTime).toBe(timestamp + e.errorDeley));
      });
    });
  });
});