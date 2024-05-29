import * as SAM from "@site/src/SAM_NEW";

const BIND_DATA_BUFFER_USAGE: Record<
  SAM.BindData<SAM.Node>["data"]["type"],
  GPUFlagsConstant
> = {
  float32Array: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  vertex: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  index: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
};

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

    const watchItems = this.getWatchItems(node);
    this.nodeMediator.watchAll(watchItems);
  }

  protected getWatchItems(node: N): SAM.MediatorWatchItem<keyof N>[] {
    throw new Error("You must override this method, setMediatorWatchers");
  }

  protected initObservableBuffer(
    bindData: SAM.BindData<N>
  ): SAM.ObservableGPUBuffer {
    const bufferUsage = BIND_DATA_BUFFER_USAGE[bindData.data.type];
    if (bufferUsage === undefined) {
      throw new Error("Unsupported bind data type");
    }

    const typedData = bindData.data.getValue();
    const buffer = this.device.createBuffer({
      label: bindData.label,
      size: typedData.byteLength,
      usage: bufferUsage,
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
                usage: bufferUsage,
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

  protected generateBindGroupSet(
    bindDataList: SAM.BindData<N>[],
    observableBuffers: SAM.ObservableGPUBuffer[]
  ): [GPUBindGroupLayout, SAM.ObservableBindGroup] {
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: bindDataList.map((bindData, index) => {
        if (bindData.data.type === "float32Array") {
          return {
            label: `Bind data layout(${index}): ${bindData.label}`,
            binding: index,
            visibility: bindData.data.visibility,
            buffer: {
              type: "uniform",
            },
          };
        }

        throw new Error("Unsupported bind data type");
      }),
    });

    const bindGroup = this.generateBindGroup(
      bindGroupLayout,
      bindDataList,
      observableBuffers
    );

    const observableBindGroup = new SAM.ObservableBindGroup(bindGroup);
    observableBuffers.forEach((observableBuffer) => {
      const watchItem: SAM.MediatorWatchItem<keyof typeof observableBuffer> = {
        key: "buffer",
        onChange: () => {
          observableBindGroup.bindGroup = this.generateBindGroup(
            bindGroupLayout,
            bindDataList,
            observableBuffers
          );
        },
      };
      observableBuffer.mediator.watch(watchItem);
    });

    return [bindGroupLayout, observableBindGroup];
  }

  private generateBindGroup(
    bindGroupLayout: GPUBindGroupLayout,
    bindDataList: SAM.BindData<N>[],
    observableBuffers: SAM.ObservableGPUBuffer[]
  ): GPUBindGroup {
    return this.device.createBindGroup({
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
  }
}
