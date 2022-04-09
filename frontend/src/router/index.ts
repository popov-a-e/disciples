import * as VueRouter from 'vue-router'
import UnitStackShop from '@/components/UnitStackShop.vue'
import Lobby from '@/components/Lobby.vue'
import BattleField from '@/components/BattleField.vue'

const routes: VueRouter.RouteRecordRaw[] = [
  { path: '/shop/:key', component: UnitStackShop },
  { path: '/lobby', component: Lobby, alias: '/' },
  { path: '/fight/:ally/:enemy', name: 'fight', component: BattleField },
]

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})
