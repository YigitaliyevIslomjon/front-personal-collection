import React, { useState, useEffect } from "react";
import { Avatar, Grid, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import "./AdminSignIn.scss";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { useTranslation } from "react-i18next";

type SignInFormValues = {
  email: string;
  password: string;
};

function AdminSignIn() {
  let { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormValues>();
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const navigate = useNavigate();

  const signInUser = (body: SignInFormValues) => {
    setLoadingButton(true);
    api
      .post("/user/login/admin", body)
      .then((res) => {
        localStorage.setItem("access_token", res.data.token);
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/admin/user");
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setLoadingButton(false);
      });
  };
  const submitSignInForm = (data: SignInFormValues) => {
    signInUser(data);
  };

  useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      navigate("/admin");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <Box
        sx={{
          padding: "40px 25px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "4px",
          maxWidth: "400px",
          background: "white",
        }}
        className="flex flex-col items-center"
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("adminPenel")}
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
                {t("signup")}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ToastContainer />
    </div>
  );
}

export default AdminSignIn;
