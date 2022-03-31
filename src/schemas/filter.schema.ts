import { object, string } from "yup";

export const addFilterSchema = object({
  body: object({
    title: string().required("عنوان فیلتر را وارد کنید"),
    finder: string().required("جستجوی فیلتر را وارد کنید"),
    id: string().required("id دسته بندی را وارد کنید"),
  }),
});
