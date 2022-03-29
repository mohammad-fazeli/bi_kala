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
