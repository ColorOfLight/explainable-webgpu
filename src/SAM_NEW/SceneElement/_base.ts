import * as SAM from "@site/src/SAM_NEW";

export class SceneElement extends SAM.Observable {
  device: GPUDevice;

  constructor(device: GPUDevice) {
    super();
    this.device = device;
  }
}

export class NodeElement<N extends SAM.Node> extends SceneElement {
  nodeId: Symbol;
  nodeMediator: SAM.Mediator<N>;

  constructor(device: GPUDevice, node: N) {
    super(device);

    this.nodeId = node.getId();
    this.nodeMediator = new SAM.Mediator(node);

    const watchItems = this.getWatchItems();
    this.nodeMediator.watchAll(watchItems);
  }

  protected getWatchItems(): SAM.MediatorWatchItem<keyof N>[] {
    throw new Error("You must override this method, setMediatorWatchers");
  }

  protected initObservableBuffer(
    bindData: SAM.BindData<N>
  ): SAM.ObservableGPUBuffer {
    if (bindData.data.type === "float32Array") {
      const typedData = bindData.data.getValue();

      const buffer = this.device.createBuffer({
        label: bindData.label,
        size: typedData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const newObservableBuffer = new SAM.ObservableGPUBuffer(buffer);

      this.device.queue.writeBuffer(newObservableBuffer.buffer, 0, typedData);

      const watchKeys = bindData.watchKeys as (keyof N)[];
      if (watchKeys) {
        const getValue = bindData.data.getValue;
        const watchItems = watchKeys.map((key) => {
          return {
            key,
            onChange: () => {
              const newData = getValue();
              if (newData.byteLength === newObservableBuffer.buffer.size) {
                this.device.queue.writeBuffer(
                  newObservableBuffer.buffer,
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
                newObservableBuffer.buffer.destroy();
                newObservableBuffer.buffer = newBuffer;
              }
            },
          };
        });

        this.nodeMediator.watchAll(watchItems);
      }

      return newObservableBuffer;
    }

    throw new Error("Unsupported bind data type");
  }

  protected generateBindGroupSet(
    bindDataList: SAM.BindData<N>[],
    observableBuffers: SAM.ObservableGPUBuffer[]
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
              buffer: observableBuffers[index].buffer,
            },
          };
        }

        throw new Error("Unsupported bind data type");
      }),
    });

    return [bindGroupLayout, bindGroup];
  }
}
