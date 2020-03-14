import Router from 'vue-router'


const routeOptions = [{
    path: '/',
    component: 'Home'
  },
  {
    path: '/about',
    component: 'About'
  },
]

const routes = routeOptions.map(route => {
  return {
    ...route,
    component: () => import(`./pages/${route.component}.vue`)
  }
})

export default new Router({
  routes: routes,
  mode: 'history'
})