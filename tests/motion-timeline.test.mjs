import test from 'node:test';
import assert from 'node:assert/strict';
import { pose, DURATION, HOME_AT } from '../src/components/motion-led/timeline.ts';
import { resolveLocale } from '../src/components/motion-led/copy.ts';

test('carrier, pieces and camera are geometrically continuous across every narrative boundary', () => {
  for (const height of [620, 1200, 1700]) {
    for (const boundary of [900,2150,2600,2750,3300,3750,4300,6800,7050,7550,7650,7700,7900,8100,8350,8550,9300,9700,11500,11700,12100,12600,13100,13600,16000,HOME_AT,DURATION]) {
      const a = pose(boundary - .001, height), b = pose(boundary + .001, height);
      for (const [left,right] of [[a.core,b.core],...a.parts.map((part,i)=>[part,b.parts[i]]),[a.camera,b.camera]]) {
        for (const key of Object.keys(left)) if (typeof left[key] === 'number') assert.ok(Math.abs(left[key]-right[key])<.02, `${boundary}/${key} discontinuity`);
      }
    }
  }
});
test('the film ends once through its handoff and clamps both time endpoints', () => {
  assert.deepEqual(pose(-100),pose(0)); assert.deepEqual(pose(DURATION+1000),pose(DURATION));
  assert.equal(pose(HOME_AT-1).showHome,false);assert.equal(pose(HOME_AT).showHome,true);
  assert.equal(pose(DURATION-1).finished,false);assert.equal(pose(DURATION).finished,true);
  assert.equal(pose(DURATION).handoffReveal,1);
});
test('all four untrimmed portrait media finish inside the landscape and portrait stage', () => {
  for (const height of [250,330,400,540,620,900,901,1000,1200,1700]) for(const p of pose(15000,height).parts) {
    assert.ok(p.x-p.w/2>=0&&p.x+p.w/2<=1000);
    assert.ok(p.y-p.h/2>=0&&p.y+p.h/2<=height);
    assert.ok(Math.abs(p.h/p.w-2622/1206)<1e-10);
    assert.equal(p.screen,1);
  }
});
test('type intervals avoid outgoing/incoming foreground title collisions',()=>{
 for(let time=0;time<=DURATION;time+=5){const p=pose(time);assert.ok([p.goType,p.legitType,p.blockType,p.paletteType].filter(v=>v>.01).length<=1)}
});
test('system locale uses supported language or Japanese fallback',()=>{
 for(const [input,expected] of [['en','en'],['en-GB','en'],['EN-us','en'],['ja-JP','ja'],['fr-FR','ja'],['','ja']])assert.equal(resolveLocale(input),expected)
});

test('Minecraft type waits for the print lane, follows the real edge, and retains its trail during docking',()=>{
 for(const height of [330,620,900,901,1700]) {
  const end=height>900?8350:8550;
  for(let time=7650;time<end;time+=10){const p=pose(time,height);const part=p.parts[0];const radians=part.angle*Math.PI/180;const left=part.x-(Math.abs(Math.cos(radians))*part.w+Math.abs(Math.sin(radians))*part.h)/2;assert.ok(Math.abs(p.blockRevealEdge-left)<1e-8)}
  assert.ok(pose(end,height).blockRevealEdge<55);assert.ok(pose(9300,height).parts[0].x>pose(end,height).parts[0].x);assert.ok(pose(9700,height).blockRevealEdge<55);
  if(height<=900){assert.equal(pose(7899,height).blockType,0);assert.equal(pose(8550,height).parts[0].angle,0);assert.ok(pose(8550,height).parts[0].y+pose(8550,height).parts[0].h/2<height*.17)}
 }
});
