export function runTick(
  callback: (elapsed: number, deltaTime: number) => void
): () => void {
  let previousElapsedTime: number | undefined = undefined;

  const tick = (elapsed: number) => {
    if (previousElapsedTime !== elapsed) {
      const deltaTime =
        previousElapsedTime != null ? elapsed - previousElapsedTime : elapsed;
      callback(elapsed, deltaTime);
    }

    previousElapsedTime = elapsed;
    window.requestAnimationFrame(tick);
  };

  const frameId = window.requestAnimationFrame(tick);

  return () => cancelAnimationFrame(frameId);
}
