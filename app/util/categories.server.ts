import { Category, File } from "~/util/interface/BadgeType";
import { getEnv } from "~/util/getEnv.server";

let categories: Category[];

declare global {
    var __categories: Category[] | undefined;
}

function parseName(name: string) {
    const filtered = name.replace(/-/g, " ").replace("_vector.svg", "");

    let capitalized = "";
    for (const word of filtered.split(" ")) {
        capitalized += `${word[0].toUpperCase()}${word.substring(1)} `;
    }

    return capitalized.trim();
}

async function getContents(path: string, token: string): Promise<Record<string, unknown>[]> {
    const request = await fetch(`https://api.github.com/repos/intergrav/devins-badges/contents/${path}`, {
        "headers": {
            "User-Agent": "BadgePicker/1.0.0 Encode42",
            "Authorization": `token ${token}`
        }
    });

    return await request.json();
}

export async function updateCategories() {
    const contents = await getContents("assets/cozy", getEnv("GITHUB_TOKEN", "unset"));

    const newCategories: Category[] = [];
    for await (const content of contents) {
        if (content.type !== "dir") {
            continue;
        }

        const files: File[] = [];

        const categoryContents = await getContents(content.path, getEnv("GITHUB_TOKEN", "unset"));
        for (const categoryContent of categoryContents) {
            if (!categoryContent.name.endsWith(".svg")) {
                continue;
            }

            files.push({
                "value": categoryContent.name,
                "label": parseName(categoryContent.name),
                "url": `${content.name}/${categoryContent.name}`
            });
        }

        newCategories.push({
            "value": content.name,
            "label": parseName(content.name),
            files
        });
    }

    global.__categories = newCategories;
    categories = newCategories;
}

export { categories };
