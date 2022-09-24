import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import api from "../../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SignUpFormValues = {
  email: string;
  password: string;
  name: string;
  confirm_password?: string;
};

function SignUp() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>();
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const createUserApi = (body: SignUpFormValues) => {
    api
      .post("/user", body)
      .then((res) => {
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitSignUpForm = (data: SignUpFormValues) => {
    delete data.confirm_password;
    createUserApi(data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Box sx={{ maxWidth: "400px" }} className="flex flex-col items-center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
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
                name="name"
                rules={{ required: "First name is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={errors.name && errors.name.message}
                    label="Name"
                    error={errors.name ? true : false}
                  />
                )}
              />
            </Grid>{" "}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={errors.email && errors.email.message}
                    label="Email"
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
                    onChange={(e) => {
                      onChange(e);
                      setPassword(e.target.value);
                    }}
                    required
                    fullWidth
                    helperText={errors.password && errors.password.message}
                    label="Password"
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
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={
                      errors.confirm_password && errors.confirm_password.message
                    }
                    label="Confirm password"
                    error={errors.confirm_password ? true : false}
                  />
                )}
              />
            </Grid>{" "}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default SignUp;
