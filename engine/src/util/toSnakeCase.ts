export const toSnakeCase = (str: string) => str.replace(/\.?([A-Z])/g, (x: string, y: string) => `_${y.toLowerCase()}`).replace(/^_/, "")
