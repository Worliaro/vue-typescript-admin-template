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
    alwaysShow: true,
  },
  children: [
    {
      path: 'MyThreejsDemosHome',
      component: () => import('@/views/threejs-demos/index.vue'),
      name: 'MyThreejsDemosHome',
      meta: {
        title: 'MyThreejsDemosHome',
        alwaysShow: true,
      },
      children: [
        {
          path: 'MyThreejsDemosHomeDemo01',
          component: () => import('@/views/threejs-demos/demo01/index.vue'),
          name: 'MyThreejsDemosHomeDemo01',
          meta: {
            title: 'MyThreejsDemosHomeDemo01',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo02',
          component: () => import('@/views/threejs-demos/demo02/index.vue'),
          name: 'MyThreejsDemosHomeDemo02',
          meta: {
            title: 'MyThreejsDemosHomeDemo02',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo03',
          component: () => import('@/views/threejs-demos/demo03/index.vue'),
          name: 'MyThreejsDemosHomeDemo03',
          meta: {
            title: 'MyThreejsDemosHomeDemo03',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo04',
          component: () => import('@/views/threejs-demos/demo04/index.vue'),
          name: 'MyThreejsDemosHomeDemo04',
          meta: {
            title: 'MyThreejsDemosHomeDemo04',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo05',
          component: () => import('@/views/threejs-demos/demo05/index.vue'),
          name: 'MyThreejsDemosHomeDemo05',
          meta: {
            title: 'MyThreejsDemosHomeDemo05',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo06',
          component: () => import('@/views/threejs-demos/demo06/index.vue'),
          name: 'MyThreejsDemosHomeDemo06',
          meta: {
            title: 'MyThreejsDemosHomeDemo06',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo07',
          component: () => import('@/views/threejs-demos/demo07/index.vue'),
          name: 'MyThreejsDemosHomeDemo07',
          meta: {
            title: 'MyThreejsDemosHomeDemo07',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo08',
          component: () => import('@/views/threejs-demos/demo08/index.vue'),
          name: 'MyThreejsDemosHomeDemo08',
          meta: {
            title: 'MyThreejsDemosHomeDemo08',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo09',
          component: () => import('@/views/threejs-demos/demo09/index.vue'),
          name: 'MyThreejsDemosHomeDemo09',
          meta: {
            title: 'MyThreejsDemosHomeDemo09',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo10',
          component: () => import('@/views/threejs-demos/demo10/index.vue'),
          name: 'MyThreejsDemosHomeDemo10',
          meta: {
            title: 'MyThreejsDemosHomeDemo10',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo11',
          component: () => import('@/views/threejs-demos/demo11/index.vue'),
          name: 'MyThreejsDemosHomeDemo11',
          meta: {
            title: 'MyThreejsDemosHomeDemo11',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo12',
          component: () => import('@/views/threejs-demos/demo12/index.vue'),
          name: 'MyThreejsDemosHomeDemo12',
          meta: {
            title: 'MyThreejsDemosHomeDemo12',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo13',
          component: () => import('@/views/threejs-demos/demo13/index.vue'),
          name: 'MyThreejsDemosHomeDemo13',
          meta: {
            title: 'MyThreejsDemosHomeDemo13',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo14',
          component: () => import('@/views/threejs-demos/demo14/index.vue'),
          name: 'MyThreejsDemosHomeDemo14',
          meta: {
            title: 'MyThreejsDemosHomeDemo14',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo15',
          component: () => import('@/views/threejs-demos/demo15/index.vue'),
          name: 'MyThreejsDemosHomeDemo15',
          meta: {
            title: 'MyThreejsDemosHomeDemo15',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo16',
          component: () => import('@/views/threejs-demos/demo16/index.vue'),
          name: 'MyThreejsDemosHomeDemo16',
          meta: {
            title: 'MyThreejsDemosHomeDemo16',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo17',
          component: () => import('@/views/threejs-demos/demo17/index.vue'),
          name: 'MyThreejsDemosHomeDemo17',
          meta: {
            title: 'MyThreejsDemosHomeDemo17',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo18',
          component: () => import('@/views/threejs-demos/demo18/index.vue'),
          name: 'MyThreejsDemosHomeDemo18',
          meta: {
            title: 'MyThreejsDemosHomeDemo18',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo19',
          component: () => import('@/views/threejs-demos/demo19/index.vue'),
          name: 'MyThreejsDemosHomeDemo19',
          meta: {
            title: 'MyThreejsDemosHomeDemo19',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo20',
          component: () => import('@/views/threejs-demos/demo20/index.vue'),
          name: 'MyThreejsDemosHomeDemo20',
          meta: {
            title: 'MyThreejsDemosHomeDemo20',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo21',
          component: () => import('@/views/threejs-demos/demo21/index.vue'),
          name: 'MyThreejsDemosHomeDemo21',
          meta: {
            title: 'MyThreejsDemosHomeDemo21',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo22',
          component: () => import('@/views/threejs-demos/demo22/index.vue'),
          name: 'MyThreejsDemosHomeDemo22',
          meta: {
            title: 'MyThreejsDemosHomeDemo22',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo23',
          component: () => import('@/views/threejs-demos/demo23/index.vue'),
          name: 'MyThreejsDemosHomeDemo23',
          meta: {
            title: 'MyThreejsDemosHomeDemo23',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo24',
          component: () => import('@/views/threejs-demos/demo24/index.vue'),
          name: 'MyThreejsDemosHomeDemo24',
          meta: {
            title: 'MyThreejsDemosHomeDemo24',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo25',
          component: () => import('@/views/threejs-demos/demo25/index.vue'),
          name: 'MyThreejsDemosHomeDemo25',
          meta: {
            title: 'MyThreejsDemosHomeDemo25',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo26',
          component: () => import('@/views/threejs-demos/demo26/index.vue'),
          name: 'MyThreejsDemosHomeDemo26',
          meta: {
            title: 'MyThreejsDemosHomeDemo26',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo27',
          component: () => import('@/views/threejs-demos/demo27/index.vue'),
          name: 'MyThreejsDemosHomeDemo27',
          meta: {
            title: 'MyThreejsDemosHomeDemo27',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo28',
          component: () => import('@/views/threejs-demos/demo28/index.vue'),
          name: 'MyThreejsDemosHomeDemo28',
          meta: {
            title: 'MyThreejsDemosHomeDemo28',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo29',
          component: () => import('@/views/threejs-demos/demo29/index.vue'),
          name: 'MyThreejsDemosHomeDemo29',
          meta: {
            title: 'MyThreejsDemosHomeDemo29',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo30',
          component: () => import('@/views/threejs-demos/demo30/index.vue'),
          name: 'MyThreejsDemosHomeDemo30',
          meta: {
            title: 'MyThreejsDemosHomeDemo30',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo31',
          component: () => import('@/views/threejs-demos/demo31/index.vue'),
          name: 'MyThreejsDemosHomeDemo31',
          meta: {
            title: 'MyThreejsDemosHomeDemo31',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo32',
          component: () => import('@/views/threejs-demos/demo32/index.vue'),
          name: 'MyThreejsDemosHomeDemo32',
          meta: {
            title: 'MyThreejsDemosHomeDemo32',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo33',
          component: () => import('@/views/threejs-demos/demo33/index.vue'),
          name: 'MyThreejsDemosHomeDemo33',
          meta: {
            title: 'MyThreejsDemosHomeDemo33',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo34',
          component: () => import('@/views/threejs-demos/demo34/index.vue'),
          name: 'MyThreejsDemosHomeDemo34',
          meta: {
            title: 'MyThreejsDemosHomeDemo34',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo35',
          component: () => import('@/views/threejs-demos/demo35/index.vue'),
          name: 'MyThreejsDemosHomeDemo35',
          meta: {
            title: 'MyThreejsDemosHomeDemo35',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo36',
          component: () => import('@/views/threejs-demos/demo36/index.vue'),
          name: 'MyThreejsDemosHomeDemo36',
          meta: {
            title: 'MyThreejsDemosHomeDemo36',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo37',
          component: () => import('@/views/threejs-demos/demo37/index.vue'),
          name: 'MyThreejsDemosHomeDemo37',
          meta: {
            title: 'MyThreejsDemosHomeDemo37',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo38',
          component: () => import('@/views/threejs-demos/demo38/index.vue'),
          name: 'MyThreejsDemosHomeDemo38',
          meta: {
            title: 'MyThreejsDemosHomeDemo38',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo39',
          component: () => import('@/views/threejs-demos/demo39/index.vue'),
          name: 'MyThreejsDemosHomeDemo39',
          meta: {
            title: 'MyThreejsDemosHomeDemo39',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo40',
          component: () => import('@/views/threejs-demos/demo40/index.vue'),
          name: 'MyThreejsDemosHomeDemo40',
          meta: {
            title: 'MyThreejsDemosHomeDemo40',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo41',
          component: () => import('@/views/threejs-demos/demo41/index.vue'),
          name: 'MyThreejsDemosHomeDemo41',
          meta: {
            title: 'MyThreejsDemosHomeDemo41',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo42',
          component: () => import('@/views/threejs-demos/demo42/index.vue'),
          name: 'MyThreejsDemosHomeDemo42',
          meta: {
            title: 'MyThreejsDemosHomeDemo42',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo43',
          component: () => import('@/views/threejs-demos/demo43/index.vue'),
          name: 'MyThreejsDemosHomeDemo43',
          meta: {
            title: 'MyThreejsDemosHomeDemo43',
          },
        },
        {
          path: 'MyThreejsDemosHomeDemo44',
          component: () => import('@/views/threejs-demos/demo44/index.vue'),
          name: 'MyThreejsDemosHomeDemo44',
          meta: {
            title: 'MyThreejsDemosHomeDemo44',
          },
        },
      ],
    },
  ],
}
export default threejsDemoRoutes
