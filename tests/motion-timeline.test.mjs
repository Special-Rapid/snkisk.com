import test from 'node:test';
import assert from 'node:assert/strict';
import { pose, DURATION, HOME_AT, READING_HOLDS, clockAt, storyTime, travelEase, settleEase, departureEase, ease } from '../src/components/motion-led/timeline.ts';
import { resolveLocale } from '../src/components/motion-led/copy.ts';

test('carrier, pieces and camera are geometrically continuous across every narrative boundary', () => {
  for (const height of [620, 1200, 1700]) {
    for (const boundary of [900,1050,1200,2300,2600,2800,3300,3750,4300,5600,6800,7050,7550,7650,7700,7900,8100,8350,8550,9300,9700,10300,11400,11500,11700,12100,12600,13100,13590,13600,16000,16600,17400].map(clockAt)) {
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
  for (const height of [250,330,400,540,620,900,901,1000,1200,1700]) for(const p of pose(clockAt(15000),height).parts) {
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
  for(let time=7650;time<end;time+=10){const p=pose(clockAt(time),height);const part=p.parts[0];const radians=part.angle*Math.PI/180;const left=part.x-(Math.abs(Math.cos(radians))*part.w+Math.abs(Math.sin(radians))*part.h)/2;assert.ok(Math.abs(p.blockRevealEdge-left)<1e-8)}
  assert.ok(pose(clockAt(end),height).blockRevealEdge<55);assert.ok(pose(clockAt(9300),height).parts[0].x>pose(clockAt(end),height).parts[0].x);assert.ok(pose(clockAt(9700),height).blockRevealEdge<55);
  if(height<=900){assert.equal(pose(clockAt(7899),height).blockType,0);assert.equal(pose(clockAt(8550),height).parts[0].angle,0);assert.ok(pose(clockAt(8550),height).parts[0].y+pose(clockAt(8550),height).parts[0].h/2<height*.17)}
 }
});

test('role-specific easing has distinct timing and a stronger travel peak',()=>{
 const h=.001, slope=f=>(f(.5+h,0,1)-f(.5-h,0,1))/(2*h);
 assert.ok(slope(travelEase)>slope(ease)*1.3);
 assert.ok(settleEase(.5,0,1)>.6 && departureEase(.5,0,1)<.4);
 for(const f of [travelEase,settleEase,departureEase]){assert.equal(f(0,0,1),0);assert.equal(f(1,0,1),1)}
 assert.ok(DURATION<17400 && clockAt(3300)/3300 !== (DURATION-clockAt(16000))/(17400-16000));
 let previous=storyTime(0);for(let t=1;t<=DURATION;t++){const next=storyTime(t);assert.ok(next>previous,`timeline reversed at ${t}`);previous=next}
});
test('the moving object and camera cross editorial beats without a velocity jump',()=>{
 for(const height of [620,1200])for(const beat of [3300,6800,11700,13590,16000,16600]){
  const t=clockAt(beat),dt=.5;
  const sample=x=>{const p=pose(x,height),worldX=v=>p.camera.pan+500+p.camera.scale*(v-500),worldY=v=>height/2+p.camera.scale*(v-height/2);return [worldX(p.core.x),worldY(p.core.y),p.core.w,p.camera.pan,p.camera.scale,...p.parts.flatMap(q=>[worldX(q.x),worldY(q.y),q.w,q.angle])];};
  const a=sample(t-dt),b=sample(t),c=sample(t+dt);
  for(let i=0;i<a.length;i++)assert.ok(Math.abs((b[i]-a[i])/dt-(c[i]-b[i])/dt)<.02,`velocity beat ${beat}, field ${i}`);
  assert.ok(Math.abs(storyTime(t)-beat)<1e-8);
  const storyStep=.1;assert.ok(Math.abs((storyTime(t)-storyTime(t-storyStep))/storyStep-(storyTime(t+storyStep)-storyTime(t))/storyStep)<.001,`story velocity beat ${beat}`);
 }
});

test('each settled composition remains still for 0.8–1.0 seconds',()=>{
 for(const [name,[start,end]] of Object.entries(READING_HOLDS)){
  const from=clockAt(start),to=clockAt(end);assert.ok(to-from>=800&&to-from<=1000,`${name}: ${to-from}ms`);
  for(const height of [390,620,901,1700]){
   const freeze=t=>{const {clock,time,...visual}=pose(t,height);return visual};
   assert.deepEqual(freeze(from+1),freeze(to-1),`${name} should remain still`);
  }
 }
});
