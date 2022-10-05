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

type SignInFormValues = {
  email: string;
  password: string;
};

function AdminSignIn() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormValues>();
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const notify = (message: string) => toast(message);
  const navigate = useNavigate();

  const signInUser = (body: SignInFormValues) => {
    setLoadingButton(true);
    api
      .post("/user/login/admin", body)
      .then((res) => {
        localStorage.setItem("access_token", res.data.token);
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (!res.data.user.status) {
          navigate("/admin");
        } else {
          notify("user is blocked");
        }
      })
      .catch((err) => {
        notify(err.response.data.error);
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
          Admin Panel
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
                label="Email Address"
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
                label="Password"
                error={errors.password ? true : false}
                type="password"
              />
            )}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <LoadingButton
            type="submit"
            loading={loadingButton}
            loadingPosition="start"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            fullWidth
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              Don't have an account ?
            </Grid>
            <Grid item>
              <Link to="/sign/up" className="no-underline">
                {" "}
                Sign Up
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
