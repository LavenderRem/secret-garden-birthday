export function createWishFlow() {
  return {
    phase: 'arrival',
    collectedPetals: [],
  };
}

export function wakeGarden(state) {
  return { ...state, phase: 'seed' };
}

export function plantSeed(state) {
  return { ...state, phase: 'petals' };
}

export function collectPetal(state, petalIndex) {
  if (state.collectedPetals.includes(petalIndex)) {
    return state;
  }

  const collectedPetals = [...state.collectedPetals, petalIndex];
  return {
    phase: collectedPetals.length === 3 ? 'letter' : state.phase,
    collectedPetals,
  };
}

export function restartWishFlow() {
  return createWishFlow();
}
