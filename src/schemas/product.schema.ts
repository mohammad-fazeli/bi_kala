import { array, number, object, string } from "yup";

export const addProductSchema = object({
  body: object({
    name: string().required("لطفا نام را وارد کنید"),
    brand: string().required("لطفا برند را وارد کنید"),
    number: string().required("لطفا تعداد را وارد کنید"),
    price: number().required("لطفا قیمت را وارد کنید"),
    id: string().required("لطفا شناسه را وارد کنید"),
  }),
  files: object({
    gallery: array()
      .of(object({}))
      .required("هیچ تصویری برای گالری ارائه نشده است"),
    image: array().of(object({})).required("تصویر ارائه نشده است"),
  }),
});

export const addImageSchema = object({
  files: object({
    gallery: array().of(object({})).required("تصویر ارائه نشده است"),
  }),
});

export const deleteImageSchema = object({
  body: object({
    filename: string().required("لطفا نام فایل را وارد کنید"),
  }),
});

export const getProductSchema = object({
  body: object({
    id: string().required("لطفا شناسه را وارد کنید"),
    page: number().required("شماره صفحه را وارد کنید"),
    limit: number().required("تعداد آیتم در هر صفحه را وارد کنید"),
    filters: array().of(object({})),
    sort: string(),
  }),
});
