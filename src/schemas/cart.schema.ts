import { array, number, object, string } from "yup";

export const updateItemSchema = object({
  body: object({
    id: string().required("id محصول را وارد کنید"),
    quantity: number().required("تعداد محصول را وارد کنید"),
  }),
});
