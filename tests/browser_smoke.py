import asyncio
import json
import sys

import aiohttp
import requests

DEBUG_URL = 'http://127.0.0.1:9333/json/list'
APP_PREFIX = 'http://127.0.0.1:8877'

pages = requests.get(DEBUG_URL, timeout=5).json()
page = next(p for p in pages if p.get('type') == 'page' and p.get('url', '').startswith(APP_PREFIX))

async def main():
    bad_events = []
    warnings = []
    seq = 0
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(page['webSocketDebuggerUrl'], origin='http://127.0.0.1:9333') as ws:
            async def cmd(method, params=None):
                nonlocal seq
                seq += 1
                ident = seq
                await ws.send_json({'id': ident, 'method': method, 'params': params or {}})
                while True:
                    msg = await ws.receive()
                    data = json.loads(msg.data)
                    if data.get('method') == 'Runtime.exceptionThrown':
                        bad_events.append(data)
                    if data.get('method') == 'Log.entryAdded':
                        entry = data['params']['entry']
                        (bad_events if entry.get('level') == 'error' else warnings).append(data)
                    if data.get('id') == ident:
                        if 'error' in data:
                            raise RuntimeError(data['error'])
                        return data.get('result', {})

            async def ev(expr):
                result = await cmd('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': True})
                if result.get('exceptionDetails'):
                    raise RuntimeError(result['exceptionDetails'])
                return result.get('result', {}).get('value')

            async def click(selector):
                ok = await ev(f"(()=>{{const e=document.querySelector({json.dumps(selector)});if(!e)return false;e.click();return true}})()")
                if not ok:
                    raise AssertionError(f'missing {selector}')

            async def drag(source, target, pointer=1):
                expr = f"""(()=>{{
                  const a=document.querySelector({json.dumps(source)}),b=document.querySelector({json.dumps(target)});
                  if(!a||!b)return false;
                  const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
                  const ax=ar.left+ar.width/2,ay=ar.top+ar.height/2,bx=br.left+br.width/2,by=br.top+br.height/2;
                  a.dispatchEvent(new PointerEvent('pointerdown',{{bubbles:true,clientX:ax,clientY:ay,pointerId:{pointer}}}));
                  window.dispatchEvent(new PointerEvent('pointermove',{{bubbles:true,clientX:bx,clientY:by,pointerId:{pointer}}}));
                  window.dispatchEvent(new PointerEvent('pointerup',{{bubbles:true,clientX:bx,clientY:by,pointerId:{pointer}}}));
                  return true;
                }})()"""
                if not await ev(expr):
                    raise AssertionError(f'drag {source} -> {target}')

            async def open_game(world, activity):
                await click(f'.world-node[data-world="{world}"]')
                await asyncio.sleep(.08)
                await click(f'[data-activity="{activity}"]')
                await asyncio.sleep(.12)
                assert await ev("document.querySelector('#gameOverlay').classList.contains('open')")

            async def close_game():
                await click('#closeGame')
                await asyncio.sleep(.05)

            await cmd('Runtime.enable')
            await cmd('Log.enable')
            await cmd('Emulation.setDeviceMetricsOverride', {'width': 1024, 'height': 768, 'deviceScaleFactor': 1, 'mobile': False})
            await ev("localStorage.removeItem('skola-silent-v3');localStorage.setItem('skola-silent-v4',JSON.stringify({muted:true}));location.reload();true")
            await asyncio.sleep(.7)

            assert await ev("document.querySelectorAll('.world-node').length") == 5
            assert await ev("document.querySelectorAll('.world-tabs').length") == 0
            assert await ev("document.querySelectorAll('.activity-card').length") == 5

            await open_game('math', 'shapes')
            await asyncio.sleep(.62)
            assert await ev("Boolean(document.querySelector('.gesture-hand'))")
            assert await ev("Boolean(state.seenDemos.fit)")
            await drag('.fit-piece[data-correct="false"]', '.fit-drop', 10)
            await asyncio.sleep(.1)
            await drag('.fit-piece[data-correct="true"]', '.fit-drop', 11)
            await asyncio.sleep(.82)
            await close_game()

            await open_game('math', 'parts')
            await drag('.fraction-piece', '.fraction-build-cell', 12)
            await asyncio.sleep(.82)
            await close_game()

            await open_game('math', 'pattern')
            await drag('.pattern-piece[data-correct="true"]', '.pattern-drop', 13)
            await asyncio.sleep(.82)
            await close_game()

            await open_game('math', 'mirror')
            await ev("document.querySelectorAll('.mirror-cell[data-correct=true]').forEach(e=>e.click());true")
            await asyncio.sleep(.82)
            await close_game()

            await open_game('math', 'turn')
            target = await ev("ACTIVITIES.turn.stages[state.session.index].target")
            await ev(f"(()=>{{const p=document.querySelector('.angle-pad'),r=p.getBoundingClientRect(),a={target}*Math.PI/180,R=104,x=r.left+r.width/2+Math.cos(a)*R,y=r.top+r.height/2-Math.sin(a)*R;p.dispatchEvent(new PointerEvent('pointerdown',{{bubbles:true,clientX:x,clientY:y,pointerId:14}}));return true}})()")
            await asyncio.sleep(.82)
            await close_game()

            await open_game('music', 'rhythm')
            await asyncio.sleep(1.35)
            rhythm = await ev("ACTIVITIES.rhythm.stages[state.session.index].sequence")
            for note in rhythm:
                await click(f'.xylophone-bar[data-note="{note}"]')
                await asyncio.sleep(.08)
            await asyncio.sleep(.82)
            await close_game()

            await open_game('physics', 'ramp')
            target = await ev("ACTIVITIES.ramp.stages[state.session.index].target")
            await ev(f"(()=>{{const p=document.querySelector('.ramp-lab'),r=p.getBoundingClientRect(),ratio=({target}-5)/75,x=r.left+r.width*ratio,y=r.top+r.height/2;p.dispatchEvent(new PointerEvent('pointerdown',{{bubbles:true,clientX:x,clientY:y,pointerId:15}}));return true}})()")
            await asyncio.sleep(.82)
            await close_game()

            await open_game('chemistry', 'mix')
            answer = await ev("ACTIVITIES.mix.stages[state.session.index].answer")
            for index in answer:
                await click(f'.drop[data-index="{index}"]')
            await asyncio.sleep(.82)
            await close_game()

            await open_game('nature', 'grow')
            order = await ev("ACTIVITIES.grow.stages[state.session.index].order")
            for idx, name in enumerate(order):
                await drag(f'.order-item[data-item="{name}"]', f'.order-slot[data-slot="{idx}"]', 30 + idx)
                await asyncio.sleep(.05)
            await asyncio.sleep(.82)
            await close_game()

            stored = await ev("JSON.parse(localStorage.getItem('skola-silent-v4'))")
            assert stored['progress']['shapes'] >= 1
            assert stored['progress']['parts'] >= 1
            assert stored['progress']['pattern'] >= 1
            assert stored['progress']['rhythm'] >= 1
            assert stored['progress']['ramp'] >= 1
            assert stored['progress']['mix'] >= 1
            assert stored['progress']['grow'] >= 1
            assert stored['skills']['shapes']['errors'] >= 1
            assert stored['skills']['shapes']['successes'] >= 1
            assert stored['skills']['shapes']['mastery'] > 0
            assert stored['stars'] >= 9
            adaptive = await ev("(()=>{const old=state.skills.shapes.mastery;state.skills.shapes.mastery=0;const easy=chooseStageIndex('shapes');state.skills.shapes.mastery=.98;const hard=chooseStageIndex('shapes');state.skills.shapes.mastery=old;return {easy,hard}})()")
            assert adaptive['easy'] == 0
            assert adaptive['hard'] == len([1,2,3,4,5]) - 1

            await cmd('Emulation.setDeviceMetricsOverride', {'width': 844, 'height': 390, 'deviceScaleFactor': 1, 'mobile': True})
            await ev("location.reload();true")
            await asyncio.sleep(.55)
            await click('.world-node[data-world="math"]')
            await asyncio.sleep(.08)
            await click('[data-activity="shapes"]')
            await asyncio.sleep(.15)
            landscape_ok = await ev("(()=>{const b=document.querySelector('.stage-board').getBoundingClientRect(),d=document.querySelector('.fit-drop').getBoundingClientRect();return d.top>=b.top&&d.bottom<=b.bottom&&d.left>=b.left&&d.right<=b.right})()")
            assert landscape_ok
            await close_game()

            print('PASS: browser smoke')
            print('stars', stored['stars'])
            print('shape mastery', round(stored['skills']['shapes']['mastery'], 3), 'errors', stored['skills']['shapes']['errors'])
            print('runtime errors', len(bad_events), 'warnings', len(warnings))
            for event in bad_events[:5]:
                print(json.dumps(event)[:700])
            return 1 if bad_events else 0

sys.exit(asyncio.run(main()))
