// 商品分页查询数据类型
export type GoodsListParm = {
    currentPage: number,
    pageSize: number,
    goodsName: string,
    total?: number
}