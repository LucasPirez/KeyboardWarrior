export function replaceTextSpaceHelper(text: string): string {
  return text.replace(/\s+/g, ' ').replace('\n', '').substring(1);
}
