export const keyBy = <T extends string | number, R>(arr: T[], cb: (t: T) => R): Record<T, R> => Object.fromEntries(
  arr.map(side => [side, cb(side)])
)
