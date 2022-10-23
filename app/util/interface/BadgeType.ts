export type BadgeType = "cozy" | "compact" | "minimal";
export const badgeType: BadgeType[] = ["cozy", "compact", "minimal"];

export interface Category {
    "value": string,
    "label": string,
    "files": File[]
}

export interface File {
    "value": string,
    "label": string,
    "url": string
}
