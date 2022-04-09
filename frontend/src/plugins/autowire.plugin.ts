import { useUnitsStore } from '@/store/unitsStore'

const _files = require.context('@engine/units', true, /\.ts$/)

const files = Promise.all(_files.keys().map(async key => {
  const name = key.replace(/^\.\//, '').replace(/\.\w+$/, '')
  return [name, (await import(`@engine/units/${name}.ts`))]
}))

export default {
  async install () {
    const units = (await files).reduce(
      (obj, file) => ({...obj, ...file[1]}),
      {}
    )

    useUnitsStore().setUnits(units)
  },
}