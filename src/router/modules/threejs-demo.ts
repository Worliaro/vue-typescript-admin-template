import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const threejsDemoRoutes:RouteConfig = {
  path: '/threejsDemo',
  component: Layout,
  redirect: '/threejsDemo/demolist',
  name: 'ThreejsDemo',
  meta: {
    title: 'ThreejsDemo',
    icon: 'table',
    alwaysShow: true
  },
  children: [
    {
      path: 'demolist',
      component: () => import('@/views/demo-threejs/index.vue'),
      name: 'ThreejsDemoList',
      meta: {
        title: 'ThreejsDemoList'
      },
      children: [
        {
          path: 'demo01',
          component: () => import('@/views/demo-threejs/demo01/index.vue'),
          name: 'ThreejsDemo01',
          meta: {
            title: 'ThreejsDemo01'
          }
        },
        {
          path: 'demo02',
          component: () => import('@/views/demo-threejs/demo02/index.vue'),
          name: 'ThreejsDemo02',
          meta: {
            title: 'ThreejsDemo02'
          }
        }
      ]
    }
  ]
}

export default threejsDemoRoutes
