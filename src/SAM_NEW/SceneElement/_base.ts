import * as SAM from "@site/src/SAM_NEW";

export class SceneElement {
  device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }
}

export class NodeElement<N extends SAM.Node> extends SceneElement {
  nodeId: Symbol;
  mediator: SAM.Mediator<N>;

  constructor(device: GPUDevice, node: N) {
    super(device);

    this.nodeId = node.getId();
    this.mediator = new SAM.Mediator(node);

    const watchItems = this.getWatchItems();
    this.mediator.watchAll(watchItems);
  }

  protected getWatchItems(): SAM.MediatorWatchItem<keyof N>[] {
    throw new Error("You must override this method, setMediatorWatchers");
  }

  protected initDynamicBuffer(bindData: SAM.BindData<N>): SAM.DynamicGPUBuffer {
    if (bindData.data.type === "float32Array") {
      const typedData = bindData.data.getValue();

      const newDynamicBuffer = {
        buffer: this.device.createBuffer({
          label: bindData.label,
          size: typedData.byteLength,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        }),
      };

      this.device.queue.writeBuffer(newDynamicBuffer.buffer, 0, typedData);

      const watchKeys = bindData.watchKeys as (keyof N)[];
      if (watchKeys) {
        const getValue = bindData.data.getValue;
        const watchItems = watchKeys.map((key) => {
          return {
            key,
            onChange: () => {
              const newData = getValue();
              if (newData.byteLength === newDynamicBuffer.buffer.size) {
                this.device.queue.writeBuffer(
                  newDynamicBuffer.buffer,
                  0,
                  newData
                );
              } else {
                const newBuffer = this.device.createBuffer({
                  label: bindData.label,
                  size: newData.byteLength,
                  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                });
                this.device.queue.writeBuffer(newBuffer, 0, newData);
                newDynamicBuffer.buffer.destroy();
                newDynamicBuffer.buffer = newBuffer;
              }
            },
          };
        });

        this.mediator.watchAll(watchItems);
      }

      return newDynamicBuffer;
    }

    throw new Error("Unsupported bind data type");
  }

  protected generateBindGroupSet(
    bindDataList: SAM.BindData<N>[],
    dynamicBuffers: SAM.DynamicGPUBuffer[]
  ): [GPUBindGroupLayout, GPUBindGroup] {
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: bindDataList.map((bindData, index) => {
        if (bindData.data.type === "float32Array") {
          return {
            label: `Bind data layout(${index}): ${bindData.label}`,
            binding: index,
            visibility: bindDataList[index].visibility,
            buffer: {
              type: "uniform",
            },
          };
        }

        throw new Error("Unsupported bind data type");
      }),
    });

    const bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: bindDataList.map((bindData, index) => {
        if (bindData.data.type === "float32Array") {
          return {
            binding: index,
            resource: {
              buffer: dynamicBuffers[index].buffer,
            },
          };
        }

        throw new Error("Unsupported bind data type");
      }),
    });

    return [bindGroupLayout, bindGroup];
  }
}
