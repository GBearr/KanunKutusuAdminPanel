import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const signUpSchema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir email giriniz")
    .required("Email girmek zorunludur"),
  username: yup
    .string()
    .min(3, "Lütfen Minimum 3 Karakter giriniz")
    .required("Kullanıcı adı girmek zorunludur"),
  firstName: yup
    .string()
    .min(3, "Lütfen Minimum 3 Karakter giriniz")
    .required("İsim girmek zorunludur"),
  lastName: yup
    .string()
    .min(3, "Lütfen Minimum 3 Karakter giriniz")
    .required("Soyisim girmek zorunludur"),
  password: yup
    .string()
    .min(5, "Lütfen minimum 5 karakter giriniz.")
    .matches(passwordRules, {
      message: "Lütfen en az 1 büyük harf 1 küçük harf ve 1 sayı giriniz",
    })
    .required("Şifre girmek zorunludur"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Tekrar Şifre Girmek Zorunludur"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir email giriniz")
    .required("Email girmek zorunludur"),
  password: yup
    .string()
    .min(5, "Lütfen minimum 5 karakter giriniz.")
    .matches(passwordRules, {
      message: "Lütfen en az 1 büyük harf 1 küçük harf ve 1 sayı giriniz",
    })
    .required("Şifre girmek zorunludur"),
});

export const createPostSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Lütfen minimum 5 karakter giriniz.")
    .required("Başlık girmek zorunludur"),
  content: yup
    .string()
    .min(80, "Lütfen minimum 80 karakter giriniz.")
    .required("İçerik girmek zorunludur"),
});
