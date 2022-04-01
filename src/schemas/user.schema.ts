import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("لطفا نام را وارد کنید"),
    password: string()
      .required("لطفا پسورد را وارد کنید")
      .min(6, "رمزعبور باید بیشتر از 6 کاراکتر باشد")
      .matches(/^[a-zA-Z0-9_.-]*$/, "رمزعبور باید شامل حروف و اعداد باشد"),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "رمز عبور هماهنگ نیست"
    ),
    email: string()
      .email("ایمیل معتبر نیست")
      .required("لطفا ایمیل را وارد کنید"),
  }),
});

export const loginUserSchema = object({
  body: object({
    password: string()
      .required("لطفا پسورد را وارد کنید")
      .min(6, "رمزعبور باید بیشتر از 6 کاراکتر باشد")
      .matches(/^[a-zA-Z0-9_.-]*$/, "رمزعبور باید شامل حروف و اعداد باشد"),
    email: string()
      .email("ایمیل معتبر نیست")
      .required("لطفا ایمیل را وارد کنید"),
  }),
});

export const addAddressSchema = object({
  body: object({
    street: string().required("لطفا خیابان را وارد کنید"),
    city: string().required("لطفا شهر را وارد کنید"),
    state: string().required("لطفا استان را وارد کنید"),
    alley: string().required("لطفا کوچه را وارد کنید"),
    HouseNumber: string().required("لطفا پلاک را وارد کنید"),
  }),
});
