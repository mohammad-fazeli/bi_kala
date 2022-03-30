import { array, number, object, string } from "yup";

export const addCategorySchema = object({
  body: object({
    name: string().required("لطفا نام را وارد کنید"),
  }),
});

export const updateCategorySchema = object({
  body: object({
    name: string().required("لطفا نام را وارد کنید"),
    id: string().required("لطفا id را وارد کنید"),
  }),
});

export const deleteCategorySchema = object({
  body: object({
    id: string().required("لطفا id را وارد کنید"),
  }),
});

export const getCategorySchema = object({
  body: object({
    filters: array().of(
      object({
        finder: string().required("فرمت فیلتر صحیح نیست"),
        option: array().required("فرمت فیلتر صحیح نیست"),
      })
    ),
    sort: string(),
  }),
  query: object({
    id: string().required("لطفا id را وارد کنید"),
    page: number().required("لطفا صفحه را وارد کنید"),
    limit: number().required("لطفا تعداد را وارد کنید"),
  }),
});
