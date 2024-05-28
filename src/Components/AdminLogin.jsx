import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { AdminAuthService } from "../services/AdminAuthService";

const loginSchema = Yup.object().shape({
  identifier: Yup.string().required("Email veya Kullanıcı Adı gerekli"),
  password: Yup.string().required("Parola gerekli"),
});

const onSubmit = async (values, actions, navigate, handleLogin) => {
  console.log("Form values submitted:", values);
  const hashedPassword = CryptoJS.SHA256(values.password).toString(
    CryptoJS.enc.Hex
  );
  try {
    let currentUser;
    currentUser = await AdminAuthService.adminSignIn(
      values.identifier,
      hashedPassword
    );
    console.log("Login successful:", currentUser);
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser.toJSON()));
    handleLogin(currentUser.toJSON());
    navigate("/"); // Yönlendirme buraya güncellendi
  } catch (error) {
    console.error("Login failed:", error);
    alert("Invalid email/username or password");
  }
  actions.setSubmitting(false);
};

export const AdminLogin = ({ handleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      identifier: "dilakocaman@mail.com",
      password: "Passw0rd!",
    },
    validationSchema: loginSchema,
    onSubmit: (values, actions) =>
      onSubmit(values, actions, navigate, handleLogin),
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "2rem",
      }}
    >
      <Stack
        direction={"row"}
        sx={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "white",
          p: 3,
          borderRadius: 2,
          alignItems: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h3" textAlign={"center"} marginBottom={3}>
          KANUN KUTUSU
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <Stack spacing={3} width="100%">
            <TextField
              sx={{ width: "100%" }}
              id="identifier"
              name="identifier"
              label="Email veya Kullanıcı Adı"
              variant="outlined"
              value={formik.values.identifier}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.identifier && Boolean(formik.errors.identifier)
              }
              helperText={formik.touched.identifier && formik.errors.identifier}
            />
            <TextField
              sx={{ width: "100%" }}
              id="password"
              name="password"
              label="Parola"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              type="submit"
              disabled={formik.isSubmitting}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default AdminLogin;
