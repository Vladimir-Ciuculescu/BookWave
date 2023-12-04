module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@api": "./src/api",
            "@components": "./src/components",
            "@consts": "./src/consts",
            "@hooks": "./src/hooks",
            "@navigation": "./src/navigation",
            "@redux": "./src/redux",
            "@screens": "./src/screens",
            "@types": "./src/types",
            "@utils": "./src/utils",
            "@yup": "./src/yup",
          },
        },
      ],

      "react-native-reanimated/plugin",
    ],
  };
};
