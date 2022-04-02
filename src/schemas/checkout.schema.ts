import { object, string } from "yup";

export const checkoutSchema = object({
  body: object({
    address: object({
      street: string().required("خیابان را وارد کنید"),
      city: string().required("شهر را وارد کنید"),
      state: string().required("استان را وارد کنید"),
      alley: string().required("کوچه را وارد کنید"),
      HouseNumber: string().required("پلاک را وارد کنید"),
    }).required("آدرس را وارد کنید"),
    paymentType: string().required("نوع پرداخت را وارد کنید"),
  }),
});
