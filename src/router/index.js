import Vue from 'vue'
import Router from 'vue-router'

import testIndex from '@/components/Index'
import Detail from '@/components/Detail'
import homepage from '@/components/homepage/homepage'
import rootIndex from '@/components/root/RootIndex'
import Login from '../views/Login'
import Index from '../views/Index'

Vue.use(Router)

// 每次用户请求都需要创建router实例
export default function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            {path: '/testIndex', component: testIndex},
            {path: '/detail', component: Detail},
            {path: '/',name: 'Login',component: Login},
            {path: '/index',name: 'Index',component: Index},
            {path: '/about',name: 'About',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
            },
            {path: '/homepage',component: homepage},
            {path: '/rootIndex',component: rootIndex},
            {path: '*',redirect: '/'}
        ]
    })
}
