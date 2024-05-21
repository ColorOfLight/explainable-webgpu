import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const scene = new SAM.Scene();

  const material = new SAM.PhongMaterial({
    color: new SAM.Color([1, 1, 1]),
  });

  const cubeGeometry = new SAM.CubeGeometry(0.5, 0.5, 0.5);
  const sphereGeometry = new SAM.SphereGeometry(0.3);
  const planeGeometry = new SAM.PlaneGeometry(1, 1);

  const cube = new SAM.Mesh(cubeGeometry, material);
  const sphere = new SAM.Mesh(sphereGeometry, material);
  const plane = new SAM.Mesh(planeGeometry, material);

  cube.setTranslate(new SAM.Vector3([-0.5, -0.5, 0]));
  sphere.setTranslate(new SAM.Vector3([0, 0.5, 0]));
  plane.setTranslate(new SAM.Vector3([0.5, -0.5, 0]));

  scene.add(cube);
  scene.add(sphere);
  scene.add(plane);

  const light1 = new SAM.AmbientLight(new SAM.Color([1, 1, 1]), 1);
  scene.add(light1);

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

  SAM.runTick(() => {
    cube.setRotateY(0.01);
    sphere.setRotateY(0.01);
    plane.setRotateY(0.01);

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
