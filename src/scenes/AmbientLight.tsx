import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM_NEW";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const sceneManager = renderer.createSceneManager();

  const material = new SAM.SimpleStandardMaterial({
    color: new SAM.Color(1, 1, 1),
  });

  const cubeGeometry = new SAM.CubeGeometry(0.5, 0.5, 0.5);

  const cube = new SAM.Mesh(cubeGeometry, material);

  sceneManager.add(cube);

  const light1 = new SAM.AmbientLight(new SAM.Color(1, 1, 0), 0.5);
  sceneManager.add(light1);

  const light2 = new SAM.AmbientLight(new SAM.Color(1, 0, 1), 0.2);
  sceneManager.add(light2);

  const camera = new SAM.PerspectiveCamera(
    Math.PI / 2,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.eye = new SAM.Vector3(0, 0, 1);

  sceneManager.add(camera);

  const orbitalControl = new SAM.OrbitalControl(canvas);
  orbitalControl.attachTo(camera);

  const resizeObserver = renderer.generateResizeObserver();
  resizeObserver.observe(canvas);

  SAM.runTick(() => {
    cube.setRotateY(0.01);

    renderer.render(sceneManager, camera);
  });
};

const AmbientLightScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default AmbientLightScene;
