import { useRef, useState } from 'react';
import {
  collectPetal,
  createWishFlow,
  plantSeed,
  restartWishFlow,
  wakeGarden,
} from './wishFlow.js';

const BLESSINGS = [
  '愿你永远有被爱包围的勇气',
  '愿每次出发都通往新的惊喜',
  '愿你自由盛开，成为喜欢的自己',
];

export function App() {
  const [flow, setFlow] = useState(createWishFlow);
  const [dragPosition, setDragPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [latestBlessing, setLatestBlessing] = useState('');
  const stageRef = useRef(null);
  const flowerRef = useRef(null);
  const draggingRef = useRef(false);

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    if (!draggingRef.current || !stageRef.current) return;
    const stage = stageRef.current.getBoundingClientRect();
    setDragPosition({ x: event.clientX - stage.left, y: event.clientY - stage.top });
  }

  function finishSeedDrop(clientX, clientY) {
    const flower = flowerRef.current?.getBoundingClientRect();
    const isInsideFlower = flower
      && clientX >= flower.left
      && clientX <= flower.right
      && clientY >= flower.top
      && clientY <= flower.bottom;

    draggingRef.current = false;
    setIsDragging(false);
    setDragPosition(null);
    if (isInsideFlower) setFlow((current) => plantSeed(current));
  }

  function handlePointerUp(event) {
    if (!draggingRef.current) return;
    finishSeedDrop(event.clientX, event.clientY);
  }

  function handleSeedKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setFlow((current) => plantSeed(current));
    }
  }

  function handlePetal(petalIndex) {
    setLatestBlessing(BLESSINGS[petalIndex]);
    setFlow((current) => collectPetal(current, petalIndex));
  }

  function restart() {
    draggingRef.current = false;
    setLatestBlessing('');
    setDragPosition(null);
    setFlow(restartWishFlow());
  }

  return (
    <main className="garden-stage" data-phase={flow.phase} ref={stageRef}>
      <picture className="garden-background" aria-hidden="true">
        <source media="(max-width: 700px)" srcSet={`${import.meta.env.BASE_URL}assets/secret-garden-mobile.png`} />
        <img src={`${import.meta.env.BASE_URL}assets/secret-garden-desktop.png`} alt="" />
      </picture>
      <div className="garden-veil" aria-hidden="true" />

      <header className="stage-header">
        <span className="stage-kicker">A LITTLE GARDEN FOR YOU</span>
        <span className="stage-progress" aria-label={`许愿进度 ${flow.phase === 'arrival' ? 1 : flow.phase === 'seed' ? 2 : 3} / 3`}>
          {flow.phase === 'arrival' ? '01' : flow.phase === 'seed' ? '02' : '03'} / 03
        </span>
      </header>

      {flow.phase === 'arrival' ? (
        <section className="intro-panel">
          <p className="eyebrow">今天，花园只为你醒来</p>
          <h1>愿你的新一岁<br />盛开成喜欢的模样</h1>
          <p className="intro-copy">这里藏着三份祝福。先唤醒花园，再亲手种下一颗愿望。</p>
          <button className="primary-button" type="button" onClick={() => setFlow((current) => wakeGarden(current))}>唤醒花园</button>
        </section>
      ) : null}

      {flow.phase === 'seed' ? (
        <section className="seed-step" aria-labelledby="seed-title">
          <div className="step-copy">
            <p className="eyebrow">把这一刻交给愿望</p>
            <h1 id="seed-title">拖动愿望种子<br />放进花心</h1>
            <p>按住花瓣拖到发光的花心；也可以用键盘选中后按 Enter。</p>
          </div>
          <button
            aria-label="拖动愿望种子到花心"
            className={`wish-seed ${isDragging ? 'is-dragging' : ''}`}
            onKeyDown={handleSeedKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={dragPosition ? { left: dragPosition.x, top: dragPosition.y } : undefined}
            type="button"
          >
            <img src={`${import.meta.env.BASE_URL}assets/wish-petal.png`} alt="" draggable="false" />
            <span>愿望种子</span>
          </button>
          <button
            aria-label="花心，愿望种子的目标"
            className="flower-drop-target"
            onClick={() => setFlow((current) => plantSeed(current))}
            ref={flowerRef}
            type="button"
          >
            <span>把愿望种在这里</span>
          </button>
          <button className="seed-fallback" type="button" onClick={() => setFlow((current) => plantSeed(current))}>轻触种下愿望</button>
        </section>
      ) : null}

      {flow.phase === 'petals' ? (
        <section className="petal-step" aria-labelledby="petal-title">
          <div className="step-copy petal-copy">
            <p className="eyebrow">愿望已经发芽</p>
            <h1 id="petal-title">收集三片<br />祝福花瓣</h1>
            <p>每片花瓣，都藏着一句只想说给你的话。</p>
          </div>
          <div className="petal-orbit" aria-label="祝福花瓣">
            {BLESSINGS.map((blessing, index) => {
              const collected = flow.collectedPetals.includes(index);
              return (
                <button
                  aria-label={`祝福花瓣 ${index + 1}${collected ? '，已收集' : ''}`}
                  className={`blessing-petal petal-${index + 1} ${collected ? 'is-collected' : ''}`}
                  disabled={collected}
                  key={blessing}
                  onClick={() => handlePetal(index)}
                  type="button"
                >
                  <img src={`${import.meta.env.BASE_URL}assets/wish-petal.png`} alt="" />
                  <span>0{index + 1}</span>
                </button>
              );
            })}
          </div>
          <p className="blessing-live" aria-live="polite">{latestBlessing || `已收集 ${flow.collectedPetals.length} / 3`}</p>
        </section>
      ) : null}

      {flow.phase === 'letter' ? (
        <section className="letter-layer" aria-live="polite">
          <article className="birthday-letter">
            <p className="eyebrow">三片花瓣，拼成一封信</p>
            <h1>写给你的生日信</h1>
            <div className="letter-divider" aria-hidden="true" />
            <p>愿你在新的一岁里，仍然敢于期待，也始终被温柔回应。<br />愿每一次出发都有惊喜，每一次停留都有爱。<br />生日快乐，愿你自由盛开，成为自己最喜欢的模样。</p>
            <p className="letter-signature">— 永远站在你这边的朋友</p>
            <button className="primary-button" type="button" onClick={restart}>再走一次花路</button>
          </article>
        </section>
      ) : null}
    </main>
  );
}
