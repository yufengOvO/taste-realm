import http from "@/http";
import { WxUserListParm } from "./WxUserModel";
//查询微信用户列表
export const getListApi = (parm:WxUserListParm) => {
    return http.get("/api/wxUser/list", parm)
}   