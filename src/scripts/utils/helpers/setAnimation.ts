import IAnimationId from '../../types/interfaces/iAnimationId';

export default function setAnimation(car: HTMLElement, htmlDistance: number, animationTime: number) {
  let start: number | null = null;

  const state: IAnimationId = { animationId: 0 };

  function step(timestamp: number) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    const passed = Math.round(time * (htmlDistance / animationTime));

    car.style.transform = `translateX(${passed}px)`;

    if (passed < htmlDistance) {
      state.animationId = window.requestAnimationFrame(step);
    }
  }
  state.animationId = window.requestAnimationFrame(step);

  return state;
}
