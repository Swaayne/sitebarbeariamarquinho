/** Public files follow the same base path as the framework, on both server and client. */
export function assetPath(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${path.replace(/^\/+/, "")}`;
}
