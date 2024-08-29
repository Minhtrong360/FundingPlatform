module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false,
            },
          },
          {
            test: /\.js$/,
            enforce: "pre",
            use: ["source-map-loader"],
            exclude: [
              /node_modules\/react-marquee-slider/,
              // Add more paths as needed
            ],
          },
        ],
      },
    },
  },
};
