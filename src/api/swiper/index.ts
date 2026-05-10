import http from "@/http";
import { SwiperParm, GoodsSwiper } from "./SwiperModel";

// 新增轮播
export const addSwiperApi = (parm: GoodsSwiper) => {
    return http.post("/api/swiper/addswipr", parm)
}

//删除
export const deleteSwiperApi = (parm: GoodsSwiper) => {
    return http.post("/api/swiper/del", parm);
};
//查询菜品列表api
export const getSwiperListApi = (parm: SwiperParm) => {
    return http.get("/api/swiper/getList", parm)
}
// 停用
export const stopUserApi = (parm: GoodsSwiper) => {
    return http.post("/api/swiper/stopSwiper", parm)
}

