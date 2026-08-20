import assert from 'node:assert/strict';
import test from 'node:test';

async function loadFlow() {
  try {
    return await import('../src/wishFlow.js');
  } catch {
    assert.fail('wish flow model is missing');
  }
}

test('wish ritual advances from arrival to seed planting', async () => {
  const { createWishFlow, wakeGarden, plantSeed } = await loadFlow();
  const arrival = createWishFlow();
  const awakened = wakeGarden(arrival);

  assert.equal(arrival.phase, 'arrival');
  assert.equal(awakened.phase, 'seed');
  assert.equal(plantSeed(awakened).phase, 'petals');
});

test('three unique petals unlock the final letter', async () => {
  const { createWishFlow, collectPetal } = await loadFlow();
  let state = { ...createWishFlow(), phase: 'petals' };

  state = collectPetal(state, 0);
  state = collectPetal(state, 0);
  assert.deepEqual(state.collectedPetals, [0]);

  state = collectPetal(collectPetal(state, 1), 2);
  assert.equal(state.phase, 'letter');
  assert.deepEqual(state.collectedPetals, [0, 1, 2]);
});

test('restart returns the experience to its initial state', async () => {
  const { restartWishFlow } = await loadFlow();

  assert.deepEqual(restartWishFlow(), {
    phase: 'arrival',
    collectedPetals: [],
  });
});
