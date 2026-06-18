const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /[\\/\\\\]\.agents[\\/\\\\]/,
  /[\\/\\\\]\.claude[\\/\\\\]/,
  ...config.resolver.blockList,
];


// Intercept posthog-core's relative import of uuidv7.js to prevent exports subpath double-extension mapping (uuidv7.js.js)
// and redirect Clerk native spec modules to clerk-mock.js for web/ssr/node environments
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    (moduleName.includes("NativeClerkModule") ||
     moduleName.includes("NativeClerkGoogleSignIn") ||
     moduleName.includes("NativeClerkAuthView") ||
     moduleName.includes("NativeClerkUserButtonView") ||
     moduleName.includes("NativeClerkUserProfileView")) &&
    platform !== "ios" &&
    platform !== "android"
  ) {
    return {
      type: "sourceFile",
      filePath: require("path").join(__dirname, "clerk-mock.js"),
    };
  }

  if (moduleName === "./vendor/uuidv7.js" && context.originModulePath.includes("@posthog")) {
    return context.resolveRequest(context, "./vendor/uuidv7", platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });