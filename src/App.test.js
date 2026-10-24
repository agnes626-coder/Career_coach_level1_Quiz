import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { addDoc } from 'firebase/firestore';
import App from './App';

jest.mock('firebase/app', () => ({initializeApp: () => ({}), getApps: () => []}));
jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(), collection: (_db, name) => name, getFirestore: () => ({}),
  onSnapshot: () => () => {}, orderBy: () => ({}), query: () => ({}),
  serverTimestamp: () => 'mock-timestamp',
}));

let container, root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers('modern');
  addDoc.mockReset().mockResolvedValue({id: 'test'});
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<App />));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});
async function click(text) {
  const button = [...container.querySelectorAll('button')].find(b => b.textContent === text);
  if (!button) throw new Error(`Missing button: ${text}`);
  await act(async () => button.click());
}
async function begin() { await click('10문항'); await click('시작하기'); }
async function finish() {
  for (let i = 0; i < 9; i++) await click('다음 문제 →');
  await click('제출하기');
}
function seconds(n) { for (let i=0; i<n; i++) act(() => jest.advanceTimersByTime(1000)); }

test('stores elapsed time across navigation and saves each retry once', async () => {
  await begin();
  seconds(5);
  await click('다음 문제 →');
  seconds(3);
  await click('이전');
  await finish();
  expect(addDoc).toHaveBeenCalledTimes(1);
  expect(addDoc.mock.calls[0][1]).toMatchObject({spentSeconds:8,total:10,wrongCount:10,quizMode:'random'});
  expect(container.textContent).toContain('시험 결과가 저장되었습니다.');
  await click('오답만 다시 풀기');
  seconds(4);
  await finish();
  expect(addDoc).toHaveBeenCalledTimes(2);
  expect(addDoc.mock.calls[1][1]).toMatchObject({spentSeconds:4,total:10,quizMode:'wrong'});
});

test('timeout advances exactly one question and resets the countdown', async () => {
  await begin();
  seconds(60);
  expect(container.querySelector('h2').textContent).toMatch(/^2\./);
  expect(container.textContent).toContain('남은 시간: 60초');
  seconds(1);
  expect(container.querySelector('h2').textContent).toMatch(/^2\./);
  expect(container.textContent).toContain('남은 시간: 59초');
});

test('late save completion from an earlier attempt cannot mark a retry as saved', async () => {
  let resolveFirst;
  addDoc.mockImplementationOnce(() => new Promise(resolve => { resolveFirst = resolve; }));
  await begin();
  await finish();
  await click('오답만 다시 풀기');
  await act(async () => resolveFirst({id:'old'}));
  await finish();
  expect(addDoc).toHaveBeenCalledTimes(2);
  expect(container.textContent).toContain('시험 결과가 저장되었습니다.');
});
