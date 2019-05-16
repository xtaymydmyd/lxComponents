/**
 * ========================
 * module_name:[选择人员]
 * module_author:chenmo
 * module_create_date: 2017/8/4
 * module_desc:
 * ========================
 */
import Index from '../pages/index.vue'

import editGroupList from '../components/selectComponent/editGroupList.vue'
import groupInfo from '../components/selectComponent/groupInfo.vue'
const routes = [
    {
        path: '*',
        name: 'index*',
        component: Index,
        meta: {
            requireAuth: false,
            keepAlive: false,
            title: ''
        }
    }, {
        path: '/index',
        name: 'index',
        component: Index,
        meta: {
            requireAuth: false,
            keepAlive: false,
            title: ''
        }
    }, {
        path: '/editGroupList',
        name: 'editGroupList',
        component: editGroupList,
        meta: {
            requireAuth: false,
            keepAlive: false,
            title: ''
        }
    }, {
        path: '/groupInfo',
        name: 'groupInfo',
        component: groupInfo,
        meta: {
            requireAuth: false,
            keepAlive: false,
            title: ''
        }
    }
]

export default routes