import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const sceneManager = renderer.createSceneManager();

  const cubeMaterial = new SAM.PhongMaterial({
    color: new SAM.Color(1, 0, 0),
  });

  const planeMaterial = new SAM.PhongMaterial({
    color: new SAM.Color(0, 0.5, 0),
  });

  const cubeGeometry = new SAM.CubeGeometry(0.5, 0.5, 0.5);
  const planeGeometry = new SAM.PlaneGeometry(5, 5);

  const cube = new SAM.Mesh(cubeGeometry, cubeMaterial);
  const plane = new SAM.Mesh(planeGeometry, planeMaterial);

  cube.setTranslate(new SAM.Vector3(0, 0, 0));

  plane.setRotateX(-Math.PI / 2);
  plane.setTranslate(new SAM.Vector3(0, -0.5, 0));

  sceneManager.add(cube);
  sceneManager.add(plane);

  const ambientLight = new SAM.AmbientLight(new SAM.Color(1, 1, 1), 0.3);
  sceneManager.add(ambientLight);

  const directionalLight = new SAM.DirectionalLight(
    new SAM.Color(1, 1, 1),
    0.5,
    new SAM.Vector3(-1, -1, -1),
    {
      shadow: {
        bias: 0.01,
        radius: 0.001,
      },
    }
  );
  sceneManager.add(directionalLight);

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

const DirectionalShadowScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default DirectionalShadowScene;
