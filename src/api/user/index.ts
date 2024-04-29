import http from "@/http";
import { ListParam, User } from "./UserModel";

// 新增管理员
export const addAdminUserApi = (parm: User) => {
    return http.post("/api/sysUser", parm)
}
//查询管理员
export const getListApi = (parm: ListParam) => {
    return http.get("/api/sysUser/getList", parm)
}
//修改管理员
export const editAdminApi = (parm:User)=>{
    return http.put("/api/sysUser",parm)
}
//删除管理员
export const deleteAdminApi = (userId:string)=>{
    return http.delete(`/api/sysUser/${userId}`)
}