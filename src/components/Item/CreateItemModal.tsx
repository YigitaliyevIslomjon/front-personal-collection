import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";

import Grid from "@mui/material/Unstable_Grid2";
import api from "../../utils/api";

export type FormField = {
  user_name: string;
  email: string;
  role: string;
  block?: boolean;
  unblock?: boolean;
  view?: boolean;
};

type ModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
};

type RoleType = {
  id: string;
  title: string;
}[];

function CreateItemModal({ setVisible, visible }: ModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormField>();

  const [roleData, setRoleData] = useState<RoleType>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setVisible(false);
  };

  const onFinish = (data: FormField) => {
    console.log(data);
  };

  const selectRole = (value: { title: string; id: string } | null) => {
    setIsAdmin(value?.title !== "admin" ? true : false);
  };

  const getRoleApi = () => {
    api
      .get("/role")
      .then((res) => {
        console.log(res.data);
        setRoleData(
          res.data.map((item: any) => ({
            title: item.role_name,
            id: item._id,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRoleApi();
  }, []);

  return (
    <Dialog
      onClose={handleCloseDialog}
      open={visible}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="lg"
      sx={{
        height: "90vh",
      }}
    >
      <DialogTitle id="alert-dialog-title">Edit User</DialogTitle>
      <DialogContent id="alert-dialog-description">
        <Box
          id="countField"
          component={"form"}
          className="flex flex-col gap-y-5 pt-2"
          onSubmit={handleSubmit(onFinish)}
        >
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid xs={12}>
              <Controller
                control={control}
                name={"user_name"}
                rules={{ required: "name is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    size="small"
                    fullWidth
                    onChange={onChange}
                    label={"name"}
                    variant="outlined"
                    error={!!errors.user_name}
                    helperText={errors.user_name && errors.user_name.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={12}>
              <Controller
                control={control}
                name={"email"}
                rules={{ required: "email is required" }}
                render={({ field: { onChange } }) => (
                  <TextField
                    size="small"
                    fullWidth
                    onChange={onChange}
                    label={"email"}
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email && errors.email.message}
                  />
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                control={control}
                name={"role"}
                rules={{ required: "role is required" }}
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    fullWidth
                    onChange={(e, value) => {
                      onChange(value);
                      selectRole(value);
                    }}
                    options={roleData}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        error={!!errors.role}
                        helperText={errors.role && errors.role.message}
                        label="Role"
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {isAdmin ? (
              <Grid container xs={12} rowSpacing={0}>
                <Grid xs={12}>
                  <Controller
                    control={control}
                    name={"block"}
                    render={({ field: { onChange } }) => (
                      <FormControlLabel
                        control={<Checkbox onChange={onChange} />}
                        label="block"
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12}>
                  <Controller
                    control={control}
                    name={"unblock"}
                    render={({ field: { onChange } }) => (
                      <FormControlLabel
                        control={<Checkbox onChange={onChange} />}
                        label="unblock"
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12}>
                  <Controller
                    control={control}
                    name={"view"}
                    render={({ field: { onChange } }) => (
                      <FormControlLabel
                        control={<Checkbox onChange={onChange} />}
                        label="view"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit" form="countField" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateItemModal;
