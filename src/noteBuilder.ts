export function computeFence(trimmedContent: string): string {
    const backtickRegex = /`+/g;
    const matches = trimmedContent.match(backtickRegex);
    const maxLength = matches
        ? Math.max(...matches.map((match) => match.length))
        : 0;
    const fenceLength = Math.max(3, maxLength + 1);
    const fence = "`".repeat(fenceLength);
    return fence;
}
export function buildCodeBlock(
    content: string,
    language: string | undefined,
): string {
    const trimmedContent = content.trimEnd();
    const fence = computeFence(trimmedContent);
    return `${fence}${language ?? ""}\n${trimmedContent}\n${fence}`;
}
