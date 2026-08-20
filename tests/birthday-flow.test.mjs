import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('birthday page exposes the full three-stage ritual', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');

  assert.match(app, /唤醒花园/);
  assert.match(app, /拖动愿望种子/);
  assert.match(app, /祝福花瓣/);
  assert.match(app, /写给你的生日信/);
  assert.match(app, /onPointerDown/);
  assert.match(app, /onKeyDown/);
});

test('layout uses a fixed viewport stage with mobile artwork', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(app, /secret-garden-mobile/);
  assert.match(styles, /height:\s*100dvh/);
  assert.match(styles, /overflow:\s*hidden/);
  assert.match(styles, /@media\s*\(max-width:\s*700px\)/);
});

test('desktop headline stays within a compact two-line measure', async () => {
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(styles, /width:\s*min\(44vw,\s*620px\)/);
  assert.match(styles, /font-size:\s*clamp\(40px,\s*4vw,\s*64px\)/);
});

test('pointer drag reads an immediate ref instead of stale render state', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');

  assert.match(app, /draggingRef\.current\s*=\s*true/);
  assert.match(app, /if\s*\(!draggingRef\.current/);
});

test('wish seed avoids a native drag ghost that leaves the source behind', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(app, /draggable="true"/);
  assert.doesNotMatch(app, /onDragStart=/);
  assert.doesNotMatch(app, /onDragEnd=/);
  assert.match(app, /onPointerMove=\{handlePointerMove\}/);
});
