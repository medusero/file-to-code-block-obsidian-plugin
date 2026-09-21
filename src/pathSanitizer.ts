export function sanitizePath(path: string): string {
    return path
        .trim()
        .replace(/^["']|["']$/g, "")
        .trim();
}
