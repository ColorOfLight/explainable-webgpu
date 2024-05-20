import { useRef, useEffect } from "react";
import * as SAM from "@site/src/SAM";

const drawCanvas = async (canvas: HTMLCanvasElement) => {
  const renderer = new SAM.WebGPURenderer(canvas);
  await renderer.init();

  const scene = new SAM.Scene();

  const geometry = new SAM.CubeGeometry(0.5, 0.5, 0.5, {
    colors: {
      front: new SAM.Color([0.5, 0.5, 0]),
      back: new SAM.Color([0.5, 0, 0.5]),
      top: new SAM.Color([0, 0.5, 0.5]),
      bottom: new SAM.Color([0.5, 0, 0]),
      left: new SAM.Color([0, 0.5, 0]),
      right: new SAM.Color([0, 0, 0.5]),
    },
  });

  const mesh1 = new SAM.Mesh(
    geometry,
    new SAM.BasicMaterial({ color: new SAM.Color([1, 0, 0]) })
  );
  mesh1.setTranslate(new SAM.Vector3([-0.5, 0, 0]));

  scene.add(mesh1);

  const mesh2 = new SAM.Mesh(geometry, new SAM.BasicMaterial());
  mesh2.setTranslate(new SAM.Vector3([0.5, 0, 0]));

  scene.add(mesh2);

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
    mesh1.setRotateX(0.01);
    mesh2.setRotateY(0.01);

    renderer.render(scene, camera);
  });
};

const BasicMaterialScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    drawCanvas(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default BasicMaterialScene;
