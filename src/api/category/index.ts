
import http from "@/http";
import{ Category,CategoryListParm,IngredCategory,IngredCategoryListParm,} from "./CategoryModel";
// import exp from "constants";
//菜品新增
export const addCategoryApi = (parm:Category)=>{
    return http.post("/api/category",parm)
}
//菜品查询
export const listApi = (parm:CategoryListParm)=>{
    return http.get("/api/category/list",parm)
}
//菜品编辑
export const editCategoryApi = (parm:Category)=>{
    return http.put("/api/category",parm)
}
//菜品删除
export const deleteCategoryApi = (parm:Category)=>{
    return http.delete(`/api/category/${parm.categoryId}`)
}


//食材新增
export const addIngredCategoryApi = (parm:IngredCategory)=>{
    return http.post("/api/ingredients",parm)
}
//食材查询
export const listIngredApi = (parm:IngredCategoryListParm)=>{
    return http.get("/api/ingredients/list",parm)
}
//食材编辑
export const editIngredCategoryApi = (parm:IngredCategory)=>{
    return http.put("/api/ingredients",parm)
}
//食材删除
export const deleteIngredCategoryApi = (parm:IngredCategory)=>{
    return http.delete(`/api/ingredients/${parm.ingredId}`)
}
