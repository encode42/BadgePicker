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
        "charset": "utf-8",
        "viewport": "width=device-width,initial-scale=1"
    } as MetaDescriptor;
}

export function links() {
    return [{
        "rel": "icon",
        "href": "/favicon/favicon.svg",
        "type": "image/svg+xml"
    }, {
        "rel": "icon",
        "href": "/favicon/favicon.png",
        "type": "image/png"
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
