import http from "@/http";
import { WxUserListParm,WxUser} from "./WxUserModel";
//查询微信用户列表
export const getListApi = (parm:WxUserListParm) => {
    return http.get("/api/wxUser/list", parm)
}

// 停用
export const stopUserApi = (parm: WxUser) => {
    return http.post("/api/wxUser/stopUser", parm)
}
//重置密码
export const updatePasseordApi = (parm:WxUser)=>{
    return http.post("/api/wxUser/updatePassword",parm)
}
//删除
export const deleteApi = (parm:WxUser)=>{
    return http.delete(`/api/wxUser/${parm.userId}`)
}