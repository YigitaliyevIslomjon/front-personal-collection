import React from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Box,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

type SignInFormValues = {
  email: string;
  password: string;
};
function SignIn() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormValues>();

  const navigate = useNavigate();

  const signInUser = (body: SignInFormValues) => {
    api
      .post("/user/login", body)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("access_token", res.data.token);
        if (!res.data.user.status) {
          navigate("/admin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const submitSignInForm = (data: SignInFormValues) => {
    console.log("salom", data);
    signInUser(data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Box sx={{ maxWidth: "350px" }} className="flex flex-col items-center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
            rules={{ required: "Email is required" }}
            render={({ field: { onChange } }) => (
              <TextField
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              Don't have an account ?
            </Grid>
            <Grid item>
              <Link to="/sign-up" className="no-underline">
                {" "}
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default SignIn;
