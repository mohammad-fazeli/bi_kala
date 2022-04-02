import { object, string, boolean } from "yup";

export const setPaymentSchema = object({
  body: object({
    token: string().required("توکن را وارد کنید"),
    successful: boolean().required("وضعیت پرداخت را وارد کنید"),
  }),
});
