import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const scene = new SAM.Scene();

  // const geometry = new SAM.CubeGeometry(0.5, 0.5, 0.5);
  const geometry = new SAM.SimpleTriangleGeometry(0.5);
  const material = new SAM.BasicMaterial([1, 0, 0, 0]);

  const mesh = new SAM.Mesh(geometry, material);

  scene.add(mesh);

  const camera = new SAM.PerspectiveCamera(Math.PI / 2, 1, 0.1, 100);
  // const camera = new SAM.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position = new SAM.Vector3([1, 1, 1]);

  renderer.render(scene, camera);

  const resizeObserver = renderer.generateResizeObserver(() =>
    renderer.render(scene, camera)
  );
  resizeObserver.observe(canvas);
};

const DrawCubeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default DrawCubeCanvas;
