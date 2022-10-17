const { withEsbuildOverride } = require("remix-esbuild-override");
const GlobalsPolyfills = require("@esbuild-plugins/node-globals-polyfill").default;

withEsbuildOverride((option, { isServer }) => {
    if (isServer)
        option.plugins = [
            GlobalsPolyfills({
                "buffer": true,
            }),
            ...option.plugins,
        ];

    return option;
});

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
    "serverBuildTarget": "cloudflare-pages",
    "server": "./server.js",
    "ignoredRouteFiles": ["**/.*"],
    "devServerBroadcastDelay": 1000
};
