import http from "@/http";
import { GoodsListParm } from "./GoodsModel";

//查询商品列表api
export const getGoodsListApi = (parm: GoodsListParm ) => {
    return http.get("/api/goods/list", parm)
}