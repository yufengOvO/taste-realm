// 定义菜品分类数据类型
export type Category ={
    categoryId:string,
    categoryName:string,
    orderNum:string,
}

// 菜品列表查询数据类
export type CategoryListParm={
    currentPage:number,
    pageSize:number,
    categoryName:string,
    total?:number
}



// 定义食品材料分类数据类型
export type IngredCategory ={
    ingredId:string,
    ingredName:string,
    ingredNum:string,
}

// 食品材料列表查询数据类
export type IngredCategoryListParm={
    currentPage:number,
    pageSize:number,
    ingredName:string,
    total?:number
}