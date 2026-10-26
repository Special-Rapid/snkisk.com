import test from 'node:test';
import assert from 'node:assert/strict';
import { pose, DURATION } from '../src/components/motion-led/timeline.ts';
import { resolveLocale } from '../src/components/motion-led/copy.ts';

test('carrier stays continuous and monotone at every chapter boundary', () => {
  let previous = pose(0).carrier;
  for (let time = 1; time <= DURATION; time++) {
    const current = pose(time);
    assert.ok(current.carrier >= previous);
    assert.ok(current.carrier - previous <= 25 / 450 + 1e-10);
    previous = current.carrier;
  }
  for (const boundary of [3300, 6600, 9900]) {
    assert.ok(Math.abs(pose(boundary).carrier - pose(boundary - .001).carrier) < .001);
  }
});
test('type and imagery settle for a real reading interval, and endpoints clamp', () => {
  for (const start of [0, 3300, 6600, 9900]) {
    for (let time = start + 450; time < start + 2850; time += 50) {
      assert.equal(pose(time).offset, 0);
      assert.equal(pose(time).opacity, 1);
    }
  }
  assert.deepEqual(pose(-100), pose(0));
  assert.deepEqual(pose(DURATION + 1000), pose(DURATION));
  assert.equal(pose(DURATION).finished, true);
});
test('system locale resolves exact/base language and unsupported fallback deterministically', () => {
  for (const [input, expected] of [['en', 'en'], ['en-GB', 'en'], ['EN-us', 'en'], ['ja-JP', 'ja'], ['fr-FR', 'ja'], ['', 'ja']]) assert.equal(resolveLocale(input), expected);
});
