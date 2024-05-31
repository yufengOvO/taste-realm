// 轮播图数据实体类
export type GoodsSwiper ={
    banId:string,
    title?:string,
    status?:string,
    orderNum?:string,
    images?:string
}
// 轮播分页查询数据类型
export type SwiperParm = {
    currentPage: number,
    pageSize: number,
    title: string,
    total?: number
}