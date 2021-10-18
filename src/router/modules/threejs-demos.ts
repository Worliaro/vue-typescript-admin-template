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
        },
        {
          path: 'MyThreejsDemosHomeDemo04',
          component: () => import('@/views/threejs-demos/demo04/index.vue'),
          name: 'MyThreejsDemosHomeDemo04',
          meta: {
            title: 'MyThreejsDemosHomeDemo04'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo05',
          component: () => import('@/views/threejs-demos/demo05/index.vue'),
          name: 'MyThreejsDemosHomeDemo05',
          meta: {
            title: 'MyThreejsDemosHomeDemo05'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo06',
          component: () => import('@/views/threejs-demos/demo06/index.vue'),
          name: 'MyThreejsDemosHomeDemo06',
          meta: {
            title: 'MyThreejsDemosHomeDemo06'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo07',
          component: () => import('@/views/threejs-demos/demo07/index.vue'),
          name: 'MyThreejsDemosHomeDemo07',
          meta: {
            title: 'MyThreejsDemosHomeDemo07'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo08',
          component: () => import('@/views/threejs-demos/demo08/index.vue'),
          name: 'MyThreejsDemosHomeDemo08',
          meta: {
            title: 'MyThreejsDemosHomeDemo08'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo09',
          component: () => import('@/views/threejs-demos/demo09/index.vue'),
          name: 'MyThreejsDemosHomeDemo09',
          meta: {
            title: 'MyThreejsDemosHomeDemo09'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo10',
          component: () => import('@/views/threejs-demos/demo10/index.vue'),
          name: 'MyThreejsDemosHomeDemo10',
          meta: {
            title: 'MyThreejsDemosHomeDemo10'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo11',
          component: () => import('@/views/threejs-demos/demo11/index.vue'),
          name: 'MyThreejsDemosHomeDemo11',
          meta: {
            title: 'MyThreejsDemosHomeDemo11'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo12',
          component: () => import('@/views/threejs-demos/demo12/index.vue'),
          name: 'MyThreejsDemosHomeDemo12',
          meta: {
            title: 'MyThreejsDemosHomeDemo12'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo13',
          component: () => import('@/views/threejs-demos/demo13/index.vue'),
          name: 'MyThreejsDemosHomeDemo13',
          meta: {
            title: 'MyThreejsDemosHomeDemo13'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo14',
          component: () => import('@/views/threejs-demos/demo14/index.vue'),
          name: 'MyThreejsDemosHomeDemo14',
          meta: {
            title: 'MyThreejsDemosHomeDemo14'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo15',
          component: () => import('@/views/threejs-demos/demo15/index.vue'),
          name: 'MyThreejsDemosHomeDemo15',
          meta: {
            title: 'MyThreejsDemosHomeDemo15'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo16',
          component: () => import('@/views/threejs-demos/demo16/index.vue'),
          name: 'MyThreejsDemosHomeDemo16',
          meta: {
            title: 'MyThreejsDemosHomeDemo16'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo17',
          component: () => import('@/views/threejs-demos/demo17/index.vue'),
          name: 'MyThreejsDemosHomeDemo17',
          meta: {
            title: 'MyThreejsDemosHomeDemo17'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo18',
          component: () => import('@/views/threejs-demos/demo18/index.vue'),
          name: 'MyThreejsDemosHomeDemo18',
          meta: {
            title: 'MyThreejsDemosHomeDemo18'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo19',
          component: () => import('@/views/threejs-demos/demo19/index.vue'),
          name: 'MyThreejsDemosHomeDemo19',
          meta: {
            title: 'MyThreejsDemosHomeDemo19'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo20',
          component: () => import('@/views/threejs-demos/demo20/index.vue'),
          name: 'MyThreejsDemosHomeDemo20',
          meta: {
            title: 'MyThreejsDemosHomeDemo20'
          }
        },
        {
          path: 'MyThreejsDemosHomeDemo21',
          component: () => import('@/views/threejs-demos/demo21/index.vue'),
          name: 'MyThreejsDemosHomeDemo21',
          meta: {
            title: 'MyThreejsDemosHomeDemo21'
          }
        }
      ]
    }
  ]
}
export default threejsDemoRoutes
