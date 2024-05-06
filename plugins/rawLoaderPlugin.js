function rawLoaderPlugin(context, options) {
  return {
    name: "custom-loaders",
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.(wgsl)$/,
              use: [
                {
                  loader: "raw-loader",
                },
              ],
            },
          ],
        },
      };
    },
  };
};

module.exports = rawLoaderPlugin;