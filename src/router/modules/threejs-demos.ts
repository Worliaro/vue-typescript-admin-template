import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const threejsDemoRoutes: RouteConfig = {
  path: '/MyThreejsDemos',
  component: Layout,
  redirect: '/MyThreejsDemos/MyThreeDemosHome',
  name: 'MyThreejsDemos',
  meta: {
    title: 'MyThreejsDemos',
    icon: 'table',
    alwaysShow: true
  },
  children: [
    {
      path: 'MyThreejsDemosHome',
      component: () => import('@/views/threejs-demos/index.vue'),
      name: 'MyThreejsDemosHome',
      meta: {
        title: 'MyThreejsDemosHome',
        alwaysShow: true
      },
      children: [
        {
          path: 'MyThreejsDemosHomeDemo01',
          component: () => import('@/views/threejs-demos/demo01/index.vue'),
          name: 'MyThreejsDemosHomeDemo01',
          meta: {
            title: 'MyThreejsDemosHomeDemo01'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo02',
          component: () => import('@/views/threejs-demos/demo02/index.vue'),
          name: 'MyThreejsDemosHomeDemo02',
          meta: {
            title: 'MyThreejsDemosHomeDemo02'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo03',
          component: () => import('@/views/threejs-demos/demo03/index.vue'),
          name: 'MyThreejsDemosHomeDemo03',
          meta: {
            title: 'MyThreejsDemosHomeDemo03'
          }
        }
      ]
    }
  ]
}
export default threejsDemoRoutes
