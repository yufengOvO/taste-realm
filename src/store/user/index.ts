import { defineStore } from "pinia";
// 创建store
// 用户成功登陆后的数据
export const userStore = defineStore('userStore', {
    state: () => {
        return {
            userId: '',
            nickName: ''
        }
    },
    // 获取值
    getters: {
        getUserId(state) {
            return state.userId
        }
    },
    // 改变state的值
    actions: {
        setUserId(userId: string) {
            this.userId = userId;
        }
    }
})