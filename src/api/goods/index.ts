import http from "@/http";
import { GoodsListParm,StatusParm } from "./GoodsModel";

//查询菜品列表api
export const getGoodsListApi = (parm: GoodsListParm ) => {
    return http.get("/api/goods/list", parm)
}
// 上架下架
export const upanddownApi = (parm:StatusParm)=>{
    return http.post("/api/goods/upanddown",parm)
}
// 推荐首页
export const setIndexApi = (parm:StatusParm)=>{
    return http.post("/api/goods/setIndex",parm)
}
// 删除
export const deleteApi = (parm:StatusParm)=>{
    return http.post("/api/goods/delete",parm)
}
