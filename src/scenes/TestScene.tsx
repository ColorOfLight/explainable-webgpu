import { useRef, useEffect } from "react";
import WebGPURenderer from "@site/src/renderer";

const runScene = async (canvas: HTMLCanvasElement) => {
  if (navigator.gpu == null) {
    throw new Error("WebGPU not supported on this browser.");
  }

  const renderer = new WebGPURenderer(canvas);
  await renderer.init();

  const module = renderer.device.createShaderModule({
    label: "our hardcoded red triangle shaders",
    code: `
      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> @builtin(position) vec4f {
        let pos = array(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5)   // bottom right
        );

        return vec4f(pos[vertexIndex], 0.0, 1.0);
      }

      @fragment fn fs() -> @location(0) vec4f {
        return vec4f(1, 0, 0, 1);
      }
    `,
  });

  const pipeline = renderer.device.createRenderPipeline({
    label: "our hardcoded red triangle pipeline",
    layout: "auto",
    vertex: {
      module,
    },
    fragment: {
      module,
      targets: [{ format: renderer.presentationFormat }],
    },
  });

  const renderPassDescriptor = {
    label: "our basic canvas renderPass",
    colorAttachments: [
      {
        clearValue: [0.3, 0.3, 0.3, 1],
        loadOp: "clear" as const,
        storeOp: "store" as const,
        view: undefined,
      },
    ],
  };

  function render() {
    // Get the current texture from the canvas context and
    // set it as the texture to render to.
    renderPassDescriptor.colorAttachments[0].view = renderer.context
      .getCurrentTexture()
      .createView();

    // make a command encoder to start encoding commands
    const encoder = renderer.device.createCommandEncoder({
      label: "our encoder",
    });

    // make a render pass encoder to encode render specific commands
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.draw(3); // call our vertex shader 3 times.
    pass.end();

    const commandBuffer = encoder.finish();
    renderer.device.queue.submit([commandBuffer]);
  }

  render();
};

const TestScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    runScene(canvasRef.current);
  }, []);

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default TestScene;
