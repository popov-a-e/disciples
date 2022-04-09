import interact from 'interactjs'
import { App } from 'vue'

export default {
  async install (app: App) {
    app.directive('drag', {
      mounted: (el, binding) => {
        const { value } = binding

        if (value === null || value === undefined) {
          return
        }

        interact(el).draggable(value)
        interact(el).styleCursor(value.cursor)
      }
    })


    app.directive('dropzone', {
      mounted: (el, binding) => {
        const { value } = binding

        if (value === null || value === undefined) {
          return
        }

        interact(el).dropzone(value)
      }
    })
  },
}