//定义用户的数据类型:interface 和 type 
// 与后端管理员实体类同
export type User = {
    userId?: string,
    username: string,
    password: string,
    nickName: string,
    phone: string,
    sex: string,
    status: string
}

// 定义列表
// 与后端实体类PageParam相同
export type ListParam = {
    currentPage: number,
    pageSize: number,
    nickName: string,
    total?: number//新增参数查询总条数
}