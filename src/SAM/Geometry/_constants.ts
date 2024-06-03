export const BASE_VERTEX_BUFFER_LAYOUT: GPUVertexBufferLayout = {
  arrayStride: (3 + 3 + 2 + 3) * 4,
  attributes: [
    {
      format: "float32x3" as const,
      offset: 0,
      shaderLocation: 0,
    },
    {
      // Normal
      format: "float32x3" as const,
      offset: 4 * 3,
      shaderLocation: 1,
    },
    {
      // texCoord
      format: "float32x2" as const,
      offset: 4 * (3 + 3),
      shaderLocation: 2,
    },
    {
      // Color
      format: "float32x3" as const,
      offset: 4 * (3 + 3 + 2),
      shaderLocation: 3,
    },
  ],
};
