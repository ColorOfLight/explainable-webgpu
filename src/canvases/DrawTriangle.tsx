import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const scene = new SAM.Scene();

  const geometry = new SAM.SimpleTriangleGeometry(0.5);
  const material = new SAM.BasicMaterial(new SAM.Color([1, 0, 0, 0]));

  const mesh = new SAM.Mesh(geometry, material);

  const camera = new SAM.OrthographicCamera(-1, 1, 1, -1, -2, 2);
  camera.eye = new SAM.Vector3([0, 0, 1]);

  scene.add(mesh);

  renderer.render(scene, camera);
};

const DrawTriangleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default DrawTriangleCanvas;
