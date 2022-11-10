import "dotenv/config";

/**
 * Available environment variables
 */
export interface Env {
    /**
     * URL of the website.
     */
    "WEBSITE_URL": string,

    /**
     * Personal access token used for accessing GitHub's API.
     */
    "GITHUB_TOKEN": string,

    /**
     * Secret to use to encrypt cookies.
     */
    "COOKIE_AUTH_SECRET": string
}

/**
 * Get a key from the process env
 *
 * @param key Key to get
 */
export function getEnv<T extends keyof Env>(key: T): Env[T] | string | undefined;

/**
 * Get a key from the process env
 *
 * @param key Key to get
 * @param def Default value if not set
 */
export function getEnv<T extends keyof Env>(key: T, def: Env[T]): Env[T] | string;

/**
 * Get a key from the process env
 *
 * @param key Key to get
 * @param def Default value if not set
 * @param parse Function used to parse values
 */
export function getEnv<T extends keyof Env>(key: T, def: Env[T], parse?: (value: string | undefined) => Env[T]): Env[T] | string;

/**
 * Get a key from the process env
 *
 * @param key Key to get
 * @param def Default value if not set
 * @param parse Function used to parse values
 */
export function getEnv<T extends keyof Env>(key: T, def?: Env[T], parse?: (value: string | undefined) => Env[T]): Env[T] | string | undefined {
    let value: string | undefined | Env[T] = process.env[key] as string | undefined;

    if (parse) {
        value = parse(value);
    }

    return value ?? def;
}
