<template>
    <SysDialog :title="dialog.title" :width="dialog.width" :height="dialog.height" :visible="dialog.visible"
        @onClose="onClose" @onConfirm="commit">
        <template v-slot:content>
            <!-- 菜单树 -->
            <el-tree ref="assignTree" :data="assignTreeData.list" node-key="menuId" :props="defaultProps" empty-text="暂无数据"
    show-checkbox default-expand-all highlight-current @node-click=""></el-tree>

        </template>
    </SysDialog>
</template>

<script setup lang="ts">
import { User } from "@/api/user/UserModel";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { getAssignTreeApi, assignSaveApi } from "@/api/user/index";
import { reactive, ref } from "vue";
import { userStore } from "@/store/user";
import { ElTree, ElMessage } from "element-plus";
// import { da } from "element-plus/lib/locale/index.js";

// 配置选项
const defaultProps = {
    children: 'children',//指定子树为节点对象的某个属性值
    label: 'title',//指定节点标签为节点对象的某个属性值
}
// 共享数据
const store = userStore()
//获取弹框属性
// const { dialog, onClose, onConfirm, onShow } = useDialog();
const { dialog, onClose, onShow } = useDialog();
// 引入树的ref属性结构
const assignTree = ref<InstanceType<typeof ElTree>>();


//查询树的参数
const parms = reactive({
    userId: "",
    //当前登录用户的id  
    assId: "",
});
//弹框显示的方法
const show = (row: User) => {
    // 先清空之前的选择
    commitParm.assId = "";
    commitParm.list = [];
    // 用户id,即将交互的用户id
    commitParm.assId = row.userId;

    //要分配的用户的id
    parms.assId = row.userId;
    parms.userId = store.getUserId
    console.log(parms)
    getAssignTree();
    console.log(row);
    dialog.title = "为【" + row.nickName + "】分配菜单";
    dialog.width = 300;
    dialog.height = 450;
    onShow();
};
//定义树的数据
const assignTreeData = reactive({

    list: [],
    // 已经分配到权限，点击分配，要回显之前的数据
    assignTreeChecked: []//数据回显
});
//获取树数据
const getAssignTree = async () => {
    let res = await getAssignTreeApi(parms);
    if (res && res.code == 200) {
        assignTreeData.list = res.data.menuList;
        // 读取管理员权限id
        assignTreeData.assignTreeChecked = res.data.checkList;
        // 排除树的半选节点
        // 数据回显。判断角色原来是否已经分配过权限，如果有，回显
        if (assignTreeData.assignTreeChecked.length > 0) {
            let newArr: any = [];
            assignTreeData.assignTreeChecked.forEach((item => {
                checked(item, assignTreeData.list, newArr)
            }))
            assignTreeData.assignTreeChecked = newArr;
        }
    }
};

const checked = (id: number, data: any[], newArr: number[]) => {
    data.forEach(item => {
        if (item.menuId === id) {
            if (item.children && item.children.length === 0) {
                newArr.push(item.menuId);
            } else if (item.children && item.children.length !== 0) {
                checked(id, item.children, newArr);
            }
        }
    });
};





//暴露出去，给外部组件调用
defineExpose({
    show,
});
//表单提交参数
const commitParm = reactive({
    assId: "",
    list: [] as string[]
})

const commit = async () => {
    // 选择的节点Id
    let checkedIds = assignTree.value?.getCheckedKeys(false) as string[];
    // 半选节点
    let halfIds = assignTree.value?.getHalfCheckedKeys() as string[];
    let ids = checkedIds.concat(halfIds) as string[];
    if (ids.length === 0) {
        ElMessage.warning("请选择菜单");
        return;
    }
    // 提交表单
    commitParm.list = ids;
    console.log(commitParm.list);
    // 提交数据到API
    let res = await assignSaveApi(commitParm);
    if (res && res.code === 200) {
        ElMessage.success(res.msg);
        onClose();
    }
};

</script>

<style scoped></style>