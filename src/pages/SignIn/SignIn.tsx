import React, { useState } from "react";
import { Avatar, Grid, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ToastContainer } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import "./SignIn.scss";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from "@react-oauth/google";
import { SigninForm } from "../../types/user.types";

function SignIn() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SigninForm>();

  let { t } = useTranslation();
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const navigate = useNavigate();

  const signInUser = (body: SigninForm) => {
    setLoadingButton(true);
    api
      .post("/user/login", body)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("access_token", res.data.token);
        navigate("/");
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setLoadingButton(false);
      });
  };
  const submitSignInForm = (data: SigninForm) => {
    signInUser(data);
  };

  <GoogleLogin
    onSuccess={(credentialResponse) => {
      console.log(credentialResponse);
    }}
    onError={() => {
      console.log("Login Failed");
    }}
  />;

  return (
    <div className="flex justify-center items-center h-full">
      <Box
        sx={{
          padding: "40px 25px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "4px",
          maxWidth: { xs: "300px", sm: "350px", md: "400px" },
          bgcolor: "background.default",
          color: "text.primary",
        }}
        className="flex flex-col items-center"
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          sx={{
            fontSize: {
              lg: 24,
              md: 22,
              sm: 19,
              xs: 18,
            },
          }}
          variant="h5"
        >
          {t("signin")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitSignInForm)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            control={control}
            name="email"
            rules={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            }}
            render={({ field: { onChange } }) => (
              <TextField
                size="small"
                onChange={onChange}
                margin="normal"
                fullWidth
                label={t("email")}
                autoComplete="email"
                error={errors.email ? true : false}
                helperText={errors.email && errors.email.message}
                autoFocus
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field: { onChange } }) => (
              <TextField
                size="small"
                onChange={onChange}
                margin="normal"
                required
                fullWidth
                helperText={errors.password && errors.password.message}
                label={t("password")}
                error={errors.password ? true : false}
                type="password"
              />
            )}
          />
          <LoadingButton
            type="submit"
            loading={loadingButton}
            loadingPosition="start"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            fullWidth
          >
            {t("signin")}
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              {t("no-account")}
            </Grid>
            <Grid item>
              <Link to="/sign/up" className="no-underline">
                {" "}
                <Typography variant="body2" color="textPrimary">
                  {t("signup")}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <ToastContainer />
    </div>
  );
}

export default SignIn;
