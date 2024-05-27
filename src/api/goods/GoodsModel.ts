// 商品分页查询数据类型
export type GoodsListParm = {
    currentPage: number,
    pageSize: number,
    goodsName: string,
    total?: number
}
// 商品状态数据
export type StatusParm ={
    goodsId :string,
    status?:string,
    setIndex?:string,

}