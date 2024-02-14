module.exports = function (api) {
  api.cache(true);
  console.log("hello");
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-paper/babel",
      ["transform-inline-environment-variables"],
      [
        "module-resolver",
        {
          alias: {
            "@assets": "./src/assets",
            "@firebaseConfig": "./firebaseConfig.js",
            "@utils": "./src/utils.js",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
