const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const { startDevServer } = require("react-native-short-style-devtools");

const config = getDefaultConfig(__dirname);

// Add the local devtools folder to watchFolders
config.watchFolders = [
    path.resolve(__dirname, "../../react-native-short-style-devtools"),
];

// Ensure Metro resolves symlinks (linked modules)
config.resolver.extraNodeModules = new Proxy({}, {
    get: (_, name) => path.join(__dirname, "node_modules", name),
});

// Add font / ttf extensions
config.resolver.assetExts.push("ttf", "png", "jpg", "jpeg");

// Only run in Node + dev mode
if (process.env.NODE_ENV !== "production") {
    try {
        const root = path.resolve(
            __dirname,
            "./node_modules/react-native-short-style-devtools/dist"
        );

        startDevServer({ root });
        console.log("🌐 DevTools server started from Metro!");
    } catch (err) {
        console.error("Failed to start DevTools server:", err);
    }
}


module.exports = config;
