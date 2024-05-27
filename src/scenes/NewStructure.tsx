import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM_NEW";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const sceneManager = renderer.createSceneManager();

  const geometry = new SAM.SimpleTriangleGeometry(0.5);
  const material = new SAM.BasicMaterial("basic material", {
    color: new SAM.Color(1, 0, 0),
  });

  const mesh = new SAM.Mesh(geometry, material);

  // const camera = new SAM.OrthographicCamera(-1, 1, 1, -1, -2, 2);
  // camera.eye = new SAM.Vector3([0, 0, 1]);

  sceneManager.add(mesh);

  renderer.render(sceneManager);
};

const NewStructureScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default NewStructureScene;
