export const objectMap = <T extends string | number, R, Res>(obj: Record<T, R>, cb: (el: R) => Res) =>
  Object.fromEntries(
    Object.entries(obj)
      .map(([key, el]) => [key, cb(el)])
  )