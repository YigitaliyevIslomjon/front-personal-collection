import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";
import LoadingButton from "@mui/lab/LoadingButton";
import { EditUserModalProp, UserForm } from "../../types/user.types";

function EditUserModal({
  setVisible,
  visible,
  userTableRowData,
  getUserList,
}: EditUserModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserForm>();

  const navigate = useNavigate();
  const roleData = ["user", "admin"];
  const handleCloseDialog = () => {
    setVisible(false);
  };
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const editUserApi = (data: UserForm) => {
    setSaveLoading(true);
    api
      .put(`/user/${userTableRowData._id}`, data)
      .then((res) => {
        setVisible(false);
        getUserList(1, 7);
        toastifyMessage({});
        if (res.data.isInValidUser) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/");
        }
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };
  const onFinish = (data: UserForm) => {
    editUserApi(data);
  };

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
        {Object.keys(userTableRowData).length > 0 ? (
          <Box
            id="editUserForm"
            component={"form"}
            className="flex flex-col gap-y-5 pt-2"
            onSubmit={handleSubmit(onFinish)}
          >
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid xs={12}>
                <Controller
                  control={control}
                  name={"user_name"}
                  defaultValue={userTableRowData?.user_name}
                  rules={{ required: "name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      value={value}
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
                  defaultValue={userTableRowData?.email}
                  rules={{ required: "email is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      size="small"
                      value={value}
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
                  defaultValue={userTableRowData?.role}
                  rules={{ required: "role is required" }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      fullWidth
                      value={value}
                      onChange={(e, value) => {
                        onChange(value);
                      }}
                      options={roleData}
                      // getOptionLabel={(option) => option.title}
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

              <Grid container xs={12} rowSpacing={0}>
                <Grid xs={12}>
                  <Controller
                    defaultValue={userTableRowData?.permissions[0].block}
                    control={control}
                    name={`permissions.${0}.block`}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="block"
                            checked={value}
                            onChange={onChange}
                          />
                        }
                        label="block"
                      />
                    )}
                  />
                </Grid>

                <Grid xs={12}>
                  <Controller
                    control={control}
                    defaultValue={userTableRowData?.permissions[1].view}
                    name={`permissions.${1}.view`}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox checked={value} onChange={onChange} />
                        }
                        label="view"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={handleCloseDialog}>
          Cancel
        </Button>

        <LoadingButton
          loading={saveLoading}
          type="submit"
          form="editUserForm"
          variant="outlined"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserModal;
