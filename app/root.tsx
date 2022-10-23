import { PropsWithChildren } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, useCatch } from "@remix-run/react";
import { ColorScheme, Divider, Global, MantineProvider } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import montserrat from "a/font/montserrat.ttf";
import { config } from "~/data/config";
import { details } from "~/data/details";
import { MetaDescriptor } from "@remix-run/cloudflare";

// TODO: Sitemap generator
// TODO: Privacy policy / GDPR compliance

interface BasicDocumentProps extends PropsWithChildren {
    "colorScheme"?: ColorScheme
}

interface DocumentProps extends BasicDocumentProps {
    "title"?: string,
    "prefix"?: boolean
}

export function meta() {
    return {
        "title": details.name,
        "description": "An easily browsable index of Devin's Badges.",
        "og:image": "https://cdn.jsdelivr.net/gh/intergrav/devins-badges-docs/src/assets/images/website-logo_512h.png",
        "twitter:card": "summary",
        "theme-color": "#e8590c",
        "charset": "utf-8",
        "viewport": "width=device-width,initial-scale=1"
    } as MetaDescriptor;
}

export function links() {
    return [{
        "rel": "icon",
        "sizes": "32x32",
        "href": "/favicon/favicon-32x32.png",
        "type": "image/png"
    }, {
        "rel": "icon",
        "sizes": "16x16",
        "href": "/favicon/favicon-16x16.png",
        "type": "image/png"
    }, {
        "rel": "apple-touch-icon",
        "sizes": "180x180",
        "href": "/favicon/apple-touch-icon.png"
    }, {
        "rel": "mask-icon",
        "href": "/favicon/safari-pinned-tab.svg",
        "color": "#40c057"
    }, {
        "rel": "manifest",
        "href": "/favicon/site.webmanifest"
    }];
}

const fonts = {
    "montserrat": "Montserrat, sans-serif"
};

export default function App() {
    return (
        <Document>
            <Outlet />
        </Document>
    );
}

function BasicDocument({ colorScheme = config.colorScheme, children }: BasicDocumentProps) {
    return (
        <html lang="en">
            <head>
                <title>{details.name}</title>
                <Meta />
                <Links />
                <StylesPlaceholder />
            </head>
            <body>
                <MantineProvider withGlobalStyles withNormalizeCSS theme={{
                    "headings": {
                        "fontFamily": fonts.montserrat
                    },
                    "other": {
                        "fonts": fonts
                    },
                    "primaryColor": config.accentColor,
                    colorScheme
                }}>
                    <Global styles={[{
                        "button": {
                            "fontFamily": `${fonts.montserrat} !important`
                        }
                    }, {
                        "@font-face": {
                            "fontFamily": "Montserrat",
                            "src": `url("${montserrat}") format("truetype")`
                        }
                    }]} />
                    {children}
                </MantineProvider>
                <Scripts />
            </body>
        </html>
    );
}

function Document({ children }: DocumentProps) {
    return (
        <BasicDocument colorScheme={config.colorScheme}>
            {children}
        </BasicDocument>
    );
}
