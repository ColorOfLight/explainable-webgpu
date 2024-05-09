import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const scene = new SAM.Scene();

  const geometry = new SAM.CubeGeometry(0.5, 0.5, 0.5, {
    colors: {
      front: new SAM.Color([0.5, 0.5, 0, 1]),
      back: new SAM.Color([0.5, 0, 0.5, 1]),
      top: new SAM.Color([0, 0.5, 0.5, 1]),
      bottom: new SAM.Color([0.5, 0, 0, 1]),
      left: new SAM.Color([0, 0.5, 0, 1]),
      right: new SAM.Color([0, 0, 0.5, 1]),
    },
  });
  const material = new SAM.BasicMaterial([1, 0, 0, 0]);

  const mesh = new SAM.Mesh(geometry, material);
  mesh.rotation = new SAM.Vector3([Math.PI / 4, Math.PI / 4, 0]);

  scene.add(mesh);

  // const camera = new SAM.PerspectiveCamera(
  //   Math.PI / 4,
  //   canvas.clientWidth / canvas.clientHeight,
  //   0.1,
  //   100
  // );
  const camera = new SAM.OrthographicCamera(-1, 1, 1, -1, -2, 2);
  camera.position = new SAM.Vector3([0, 0, 1]);

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
