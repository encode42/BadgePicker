export type BadgeType =  "minimal" | "cozy" | "compact";
export const badgeType: BadgeType[] = ["minimal", "cozy", "compact"];

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
