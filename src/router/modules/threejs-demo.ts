import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const threejsDemoRoutes: RouteConfig = {
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
        },
        {
          path: 'demo03',
          component: () => import('@/views/demo-threejs/demo03/index.vue'),
          name: 'ThreejsDemo03',
          meta: {
            title: 'ThreejsDemo03'
          }
        },
        {
          path: 'demo04',
          component: () => import('@/views/demo-threejs/demo04/index.vue'),
          name: 'ThreejsDemo04',
          meta: {
            title: 'ThreejsDemo04'
          }
        },
        {
          path: 'demo05',
          component: () => import('@/views/demo-threejs/demo05/index.vue'),
          name: 'ThreejsDemo05',
          meta: {
            title: 'ThreejsDemo05'
          }
        }
      ]
    }
  ]
}

export default threejsDemoRoutes
