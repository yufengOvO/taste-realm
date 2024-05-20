import http from "@/http";
import { Menu } from "./MenuModel";

// 获取上级菜单树数据
export const getParentApi = () => {
    return http.get("/api/menu/getParent")
}

// 新增
export const addApi = (parm : Menu) => {
    return http.post("/api/menu",parm)
}

// 查询
// export const listApi = () => {
//     return http.get("/api/menu/list")
// }