import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const scene = new SAM.Scene();

  const material = new SAM.PhongMaterial({
    color: new SAM.Color([1, 0, 0]),
  });

  const cubeGeometry = new SAM.CubeGeometry(0.5, 0.5, 0.5);
  const sphereGeometry = new SAM.SphereGeometry(0.3);

  const cube = new SAM.Mesh(cubeGeometry, material);
  const sphere = new SAM.Mesh(sphereGeometry, material);

  cube.setTranslate(new SAM.Vector3([-0.5, 0, 0]));
  sphere.setTranslate(new SAM.Vector3([0.5, 0, 0]));

  scene.add(cube);
  scene.add(sphere);

  const light1 = new SAM.AmbientLight(new SAM.Color([1, 1, 1]), 0.1);
  scene.add(light1);

  const light2 = new SAM.DirectionalLight(
    new SAM.Color([1, 1, 1]),
    0.5,
    new SAM.Vector3([1, 0, -1])
  );
  scene.add(light2);

  const camera = new SAM.PerspectiveCamera(
    Math.PI / 2,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );

  camera.eye = new SAM.Vector3([0, 0, 1]);

  const orbitalControl = new SAM.OrbitalControl(canvas);
  orbitalControl.attachTo(camera);

  const resizeObserver = renderer.generateResizeObserver();
  resizeObserver.observe(canvas);

  SAM.runTick(() => {
    cube.setRotateY(0.01);
    sphere.setRotateY(0.01);

    renderer.render(scene, camera);
  });
};

const DirectionalLightScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default DirectionalLightScene;
