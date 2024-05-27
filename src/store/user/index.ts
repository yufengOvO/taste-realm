import { defineStore } from "pinia";
// 创建store
// 用户成功登陆后的数据
export const userStore = defineStore('userStore', {
    state: () => {
        return {
            userId: '',
            nickName: '',
            menuList:[],
            codeList:[]
        }
    },
    // 获取值
    getters: {
        getUserId(state) {
            return state.userId
        },
        getMenuList(state) {
            return state.menuList
        },
        getCodeList(state) {
            return state.codeList
        }

    },
    // 改变state的值
    actions: {
        setUserId(userId: string) {
            this.userId = userId;
        },
        setMenuList(menuList: any) {
            this.menuList = menuList;
        },
        setCodeList(codeList: any) {
            this.codeList = codeList;
        },
    },
    // 持久化
    persist:{
        storage:localStorage,paths:['userId','nickName','menuList','codeList']
    }
})