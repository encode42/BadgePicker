/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
    "ignoredRouteFiles": ["**/.*"],
    "serverDependenciesToBundle": [
        /^rehype.*/,
        /^remark.*/,
        "mdx-bundler",
        "@mdx-js/react"
    ]
};
