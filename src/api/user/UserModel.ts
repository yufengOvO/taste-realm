//定义用户的数据类型:interface 和 type 
// 与后端管理员实体类同
export type User = {
    userId: string,
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

// 后端登录参数
export type LoginParm = {

    username: string,
    password: string,
    code: string
}

// 修改密码参数
export type UpdateParm={
    password:string,
    userId:string,
    oldPassword:string
}
// 分配权限参数
export type AssignParm={
    assId:string
    userId:string
}
// 保存权限的数据类型
export type SaveAssignParm={
    assId:string
    list:Array<string>
}