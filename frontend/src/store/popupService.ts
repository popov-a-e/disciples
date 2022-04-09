import { defineStore } from 'pinia'
import { Component, DefineComponent, markRaw } from 'vue'
import { Unit } from '@engine/Unit'
import UnitSelectPopup from '@/components/UnitSelectPopup.vue'

type Popup = {
  component: DefineComponent,
  props: Record<string, any>,
  listeners: Record<string, any>,
}

export const usePopupService = defineStore('popup', {
  state: () => ({
    popup: null as Popup | null,
  }),
  actions: {
    open (component: DefineComponent, props: Record<string, any> = {}, listeners: Record<string, any>) {
      this.popup = {
        component: markRaw(component),
        props,
        listeners,
      }
    },
    selectUnit (): Promise<string | null> {
      let resolve !: (value: string | null) => void

      const promise = new Promise<string | null>(res => resolve = res)

      this.popup = {
        component: markRaw(UnitSelectPopup) as any,
        props: {},
        listeners: {
          input: resolve
        }
      }

      return promise
    },
    close () {
      this.popup = null
    }
  }
})