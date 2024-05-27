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

export function normalizeAngle(angle: number): number {
  // Use the modulus operator to bring the angle within the range of -2π to 2π
  angle = angle % (2 * Math.PI);

  // Adjust the angle to be within the range of -π to π
  if (angle < -Math.PI) {
    angle += 2 * Math.PI;
  } else if (angle > Math.PI) {
    angle -= 2 * Math.PI;
  }

  return angle;
}

export function generateNumberArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
