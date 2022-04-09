export {}

declare global {
  interface ObjectConstructor {
    keys<T>(o: T): (keyof T)[];
    entries<K extends string, T>(o: Record<K, T>): [K, T][];
    fromEntries<K extends string | number, T>(o: [K, T][]): Record<K, T>;
  }
}