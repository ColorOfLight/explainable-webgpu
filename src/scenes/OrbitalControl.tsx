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
  const material = new SAM.BasicMaterial();

  const mesh = new SAM.Mesh(geometry, material);
  mesh.setRotateX(Math.PI / 4);
  mesh.setRotateY(Math.PI / 4);

  scene.add(mesh);

  const camera = new SAM.PerspectiveCamera(
    Math.PI / 2,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  // const camera = new SAM.OrthographicCamera(-1, 1, 1, -1, -2, 2);
  camera.eye = new SAM.Vector3([0, 0, 1]);

  const orbitalControl = new SAM.OrbitalControl(canvas);
  orbitalControl.attachTo(camera);

  const resizeObserver = renderer.generateResizeObserver();
  resizeObserver.observe(canvas);

  SAM.runTick(() => {
    renderer.render(scene, camera);
  });
};

const OrbitalControlScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default OrbitalControlScene;
