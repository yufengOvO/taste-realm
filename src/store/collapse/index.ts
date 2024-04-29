import { defineStore } from "pinia";
//定义store
export const collapseStore = defineStore('collapseStore', {
    // 定义共享数据
    state: () => {
        return {
            collapse: false
        }
    },
    // 修改共享数据
    actions: {
        setCollapse(collapse: boolean) {
            this.collapse = collapse;
        }
    },
    // 获取共享数据
    getters: {
        getCollapse(state) {
            return state.collapse
        }
    }
})
