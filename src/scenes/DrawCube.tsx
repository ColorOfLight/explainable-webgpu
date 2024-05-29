import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM_NEW";

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

  const mesh = new SAM.Mesh(geometry, material);
  mesh.setRotateX(Math.PI / 4);
  mesh.setRotateY(Math.PI / 4);

  sceneManager.add(mesh);

  const camera = new SAM.PerspectiveCamera(
    Math.PI / 2,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  // const camera = new SAM.OrthographicCamera(-1, 1, 1, -1, -2, 2);
  camera.eye = new SAM.Vector3(0, 0, 1);

  sceneManager.add(camera);

  renderer.render(sceneManager, camera);

  const resizeObserver = renderer.generateResizeObserver(() =>
    renderer.render(sceneManager, camera)
  );
  resizeObserver.observe(canvas);
};

const DrawCubeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default DrawCubeScene;
