export function cls(...args: (string | undefined | false | null)[]): string {
  return args.filter(Boolean).join(" ");
}

export function genId(prefix: string): string {
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}
