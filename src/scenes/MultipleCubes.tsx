import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const sceneManager = renderer.createSceneManager();

  const geometry = new SAM.CubeGeometry(0.5, 0.5, 0.5, {
    colors: {
      front: new SAM.Color(0.5, 0.5, 0),
      back: new SAM.Color(0.5, 0, 0.5),
      top: new SAM.Color(0, 0.5, 0.5),
      bottom: new SAM.Color(0.5, 0, 0),
      left: new SAM.Color(0, 0.5, 0),
      right: new SAM.Color(0, 0, 0.5),
    },
  });
  const material = new SAM.BasicMaterial();

  const mesh1 = new SAM.Mesh(geometry, material);
  mesh1.setRotateX(Math.PI / 4);
  mesh1.setRotateY(Math.PI / 4);
  mesh1.setTranslate(new SAM.Vector3(-0.5, 0, 0));

  sceneManager.add(mesh1);

  const mesh2 = new SAM.Mesh(geometry, material);
  mesh2.setTranslate(new SAM.Vector3(0.5, 0, 0));

  sceneManager.add(mesh2);

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
    mesh2.setRotateY(0.01);

    renderer.render(sceneManager, camera);
  });
};

const MultipleCubeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default MultipleCubeScene;
