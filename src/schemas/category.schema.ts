import { object, string } from "yup";

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
