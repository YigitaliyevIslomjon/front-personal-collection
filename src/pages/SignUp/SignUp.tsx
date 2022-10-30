import Avatar from "@mui/material/Avatar";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import api from "../../utils/api";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { useTranslation } from "react-i18next";
import { SignUpForm } from "../../types/user.types";

function SignUp() {
  let { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpForm>();
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const createUserApi = (body: SignUpForm) => {
    setLoadingButton(true);
    api
      .post("/user/sign-up", body)
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

  const submitSignUpForm = (data: SignUpForm) => {
    delete data.confirm_password;
    createUserApi(data);
  };

  return (
    <div className="flex justify-center items-center">
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
          {t("signup")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitSignUpForm)}
          noValidate
          sx={{ mt: 3 }}
        >
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="user_name"
                rules={{ required: "name is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    size="small"
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={errors.user_name && errors.user_name.message}
                    label={t("name")}
                    error={errors.user_name ? true : false}
                  />
                )}
              />
            </Grid>{" "}
            <Grid item xs={12}>
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
                    required
                    fullWidth
                    helperText={errors.email && errors.email.message}
                    label={t("email")}
                    error={errors.email ? true : false}
                  />
                )}
              />
            </Grid>{" "}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    type="password"
                    size="small"
                    onChange={(e) => {
                      onChange(e);
                      setPassword(e.target.value);
                    }}
                    required
                    fullWidth
                    helperText={errors.password && errors.password.message}
                    label={t("password")}
                    error={errors.password ? true : false}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="confirm_password"
                rules={{
                  validate: (value) => {
                    console.log("value", password);
                    return value === password || "The passwords do not match";
                  },
                }}
                render={({ field: { onChange } }) => (
                  <TextField
                    size="small"
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={
                      errors.confirm_password && errors.confirm_password.message
                    }
                    type="password"
                    label={t("confirm_password")}
                    error={errors.confirm_password ? true : false}
                  />
                )}
              />
            </Grid>{" "}
          </Grid>
          <LoadingButton
            type="submit"
            loading={loadingButton}
            loadingPosition="start"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            fullWidth
          >
            {t("signup")}
          </LoadingButton>
        </Box>
      </Box>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
