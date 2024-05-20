import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const scene = new SAM.Scene();

  const material = new SAM.BasicMaterial({
    color: new SAM.Color([1, 0, 0, 0]),
    isWireframe: true,
  });

  const planeGeometry = new SAM.PlaneGeometry(0.5, 0.5, {
    widthSegments: 5,
    heightSegments: 5,
  });

  const cubeGeometry = new SAM.CubeGeometry(0.5, 0.5, 0.5, {
    widthSegments: 3,
    heightSegments: 4,
    depthSegments: 5,
  });

  const sphereGeometry = new SAM.SphereGeometry(0.25, {
    widthSegments: 32,
    heightSegments: 32,
  });

  const plane = new SAM.Mesh(planeGeometry, material);
  plane.setTranslate(new SAM.Vector3([-0.5, 0, 0]));

  const cube = new SAM.Mesh(cubeGeometry, material);
  cube.setTranslate(new SAM.Vector3([0.5, 0, 0]));

  const sphere = new SAM.Mesh(sphereGeometry, material);
  sphere.setTranslate(new SAM.Vector3([0, 0, 0.5]));

  scene.add(plane);
  scene.add(cube);
  scene.add(sphere);

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
    plane.setRotateX(0.01);

    renderer.render(scene, camera);
  });
};

const MoreGeometriesScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default MoreGeometriesScene;
