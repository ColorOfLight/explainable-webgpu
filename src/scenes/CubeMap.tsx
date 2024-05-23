import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

import Yokohama3PxJpg from "/textures/cube-map/Yokohama3/px.jpg";
import Yokohama3NxJpg from "/textures/cube-map/Yokohama3/nx.jpg";
import Yokohama3PyJpg from "/textures/cube-map/Yokohama3/py.jpg";
import Yokohama3NyJpg from "/textures/cube-map/Yokohama3/ny.jpg";
import Yokohama3PzJpg from "/textures/cube-map/Yokohama3/pz.jpg";
import Yokohama3NzJpg from "/textures/cube-map/Yokohama3/nz.jpg";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const cubeMapTexture = new SAM.CubeMapTexture({
    px: Yokohama3PxJpg,
    nx: Yokohama3NxJpg,
    py: Yokohama3PyJpg,
    ny: Yokohama3NyJpg,
    pz: Yokohama3PzJpg,
    nz: Yokohama3NzJpg,
  });
  await cubeMapTexture.load();

  const scene = new SAM.Scene();
  scene.setEnvironment(cubeMapTexture);

  const camera = new SAM.PerspectiveCamera(
    Math.PI / 2,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );

  camera.eye = new SAM.Vector3([0, 0, 1.5]);

  const orbitalControl = new SAM.OrbitalControl(canvas);
  orbitalControl.attachTo(camera);

  const resizeObserver = renderer.generateResizeObserver();
  resizeObserver.observe(canvas);

  renderer.render(scene, camera);

  SAM.runTick(() => {
    renderer.render(scene, camera);
  });
};

const TextureScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default TextureScene;
