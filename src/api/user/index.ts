import http from "@/http";
import { ListParam, User,LoginParm,UpdateParm, AssignParm, SaveAssignParm } from "./UserModel";

// 新增管理员
export const addAdminUserApi = (parm: User) => {
    return http.post("/api/sysUser", parm)
}
//查询管理员
export const getListApi = (parm: ListParam) => {
    return http.get("/api/sysUser/getList", parm)
}
//修改管理员
export const editAdminApi = (parm: User) => {
    return http.put("/api/sysUser", parm)
}
//删除管理员
export const deleteAdminApi = (userId: string) => {
    return http.delete(`/api/sysUser/${userId}`)
}

// 生成验证码
export const imageApi = () => {
    return http.post("/api/sysUser/image")
}
// 后台登陆
export const lgoinApi = (parm:LoginParm) => {
    return http.post("/api/sysUser/login", parm)
}
// 修改密码
export const updatePasswordApi = (parm: UpdateParm) => {
    return http.put("/api/sysUser/updatePassword", parm)
}
// 获取树的数据
export const getAssignTreeApi =(parm:AssignParm)=>{
    return http.get("/api/menu/getAssignTree",parm)
}
// 提交分配权限
export const assignSaveApi = (parm:SaveAssignParm) => {
    return http.post("/api/menu/assignSave", parm)
}