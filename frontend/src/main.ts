import { createApp } from 'vue'
import Game from './Game.vue'
import autowirePlugin from '@/plugins/autowire.plugin'
import interactjsPlugin from '@/plugins/interactjs.plugin'
import { createPinia } from 'pinia'
import { router } from '@/router'

createApp(Game)
  .use(createPinia())
  .use(autowirePlugin)
  .use(router)
  .use(interactjsPlugin)
  .mount('#app')

