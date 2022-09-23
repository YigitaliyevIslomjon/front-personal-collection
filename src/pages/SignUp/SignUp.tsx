import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import { useForm, Controller } from "react-hook-form";

type SignUpFormValues = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

function SignUp() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const onFinish = (data: SignUpFormValues) => {
    console.log(data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Box sx={{ maxWidth: "350px" }} className="flex flex-col items-center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onFinish)}
          noValidate
          sx={{ mt: 3 }}
        >
          <Grid container columnSpacing={2} rowSpacing={4}>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="first_name"
                rules={{ required: "First name is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={errors.first_name && errors.first_name.message}
                    label="First name"
                    error={errors.first_name ? true : false}
                  />
                )}
              />
            </Grid>{" "}
            <Grid item xs={6}>
              <Controller
                control={control}
                name="last_name"
                rules={{ required: "Last name is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={errors.last_name && errors.last_name.message}
                    label="Last name"
                    error={errors.last_name ? true : false}
                  />
                )}
              />
            </Grid>{" "}
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <Controller
                control={control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    onChange={onChange}
                    required
                    fullWidth
                    helperText={errors.password && errors.password.message}
                    label="Password"
                    error={errors.password ? true : false}
                  />
                )}
              />
            </Grid>
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
