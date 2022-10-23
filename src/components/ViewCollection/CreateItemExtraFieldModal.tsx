import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import SpecifyFieldCount from "./SpecifyFieldCount";
import api from "../../utils/api";
import { CollectionType } from "../../pages/ViewCollection/ViewCollection";
import LoadingButton from "@mui/lab/LoadingButton";
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";

interface DialogProp {
  setVisible: (value: boolean) => void;
  visible: boolean;
  collection: CollectionType;
}
type FormField = {
  selectedField?: string;
  int_field: { name: string }[];
  str_field: { name: string }[];
  textare_field: { name: string }[];
  checkbox_field: { name: string }[];
  date_field: { name: string }[];
  collection_id?: string;
};

function CreateItemExtraFieldModal({
  setVisible,
  visible,
  collection,
}: DialogProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormField>({});

  const [fieldCountDioVisible, setFieldCountDioVisible] = useState(false);
  const [itemFieldCount, setItemFieldCount] = useState({
    integer: "0",
    string: "0",
    textare: "0",
    date: "0",
    checkbox: "0",
  });

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [propertyName, setPropertyName] = useState("0");

  const handleClose = () => {
    setVisible(false);
  };
  const itemField = [
    { name: "Integer field", field: "integer" },
    { name: "String field", field: "string" },
    { name: "Multiline text fields", field: "textare" },
    { name: "Date field", field: "date" },
    { name: "Checkbox field", field: "checkbox" },
  ];

  const createExtraItemFieldApi = (body: FormField) => {
    setSaveLoading(true);
    api
      .post(`/item-extra-field/${collection._id}`, body)
      .then((res) => {
        setVisible(false);
        toastifyMessage({});
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };
  const onFinish = (data: FormField) => {
    data.collection_id = collection._id;
    createExtraItemFieldApi(data);
  };

  return (
    <Box>
      <Dialog
        onClose={() => {
          setVisible(false);
        }}
        open={visible}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create item field</DialogTitle>
        <DialogContent>
          <Box
            id="createItemField"
            component={"form"}
            className="flex flex-col gap-y-5 pt-2"
            onSubmit={handleSubmit(onFinish)}
          >
            <Controller
              control={control}
              name="selectedField"
              defaultValue={""}
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth size="small">
                  <InputLabel id="itemFields">Item Field</InputLabel>
                  <Select
                    onChange={onChange}
                    labelId="itemFields"
                    label="select field"
                    value={value}
                  >
                    {itemField.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={item.field}
                          onClick={() => {
                            setPropertyName(item.field);
                            setFieldCountDioVisible(true);
                          }}
                        >
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
            />

            <Grid container spacing={2}>
              <Grid xs={12}>
                {+itemFieldCount.integer > 0 ? (
                  <Typography variant="body2">
                    Specify interger filed name
                  </Typography>
                ) : null}
              </Grid>

              {Array(+itemFieldCount.integer)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`int_field.${index}.name`}
                        rules={{ required: "name is required" }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="Name"
                            variant="outlined"
                            error={!!errors.int_field?.[index]?.name}
                            helperText={
                              errors.int_field?.[index]?.name &&
                              errors.int_field?.[index]?.name?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  );
                })}
            </Grid>
            <Grid container spacing={2}>
              <Grid xs={12}>
                {+itemFieldCount.string > 0 ? (
                  <Typography variant="body2">
                    Specify string filed name
                  </Typography>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.string)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`str_field.${index}.name`}
                        rules={{ required: "name is required" }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="Name"
                            variant="outlined"
                            error={!!errors.str_field?.[index]?.name}
                            helperText={
                              errors.str_field?.[index]?.name &&
                              errors.str_field?.[index]?.name?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  );
                })}
            </Grid>
            <Grid container spacing={2}>
              <Grid xs={12}>
                {+itemFieldCount.textare > 0 ? (
                  <Typography variant="body2">
                    Specify textare filed name
                  </Typography>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.textare)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`textare_field.${index}.name`}
                        rules={{ required: "name is required" }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="Name"
                            variant="outlined"
                            error={!!errors.textare_field?.[index]?.name}
                            helperText={
                              errors.textare_field?.[index]?.name &&
                              errors.textare_field?.[index]?.name?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  );
                })}
            </Grid>
            <Grid container spacing={2}>
              <Grid xs={12}>
                {+itemFieldCount.date > 0 ? (
                  <Typography variant="body2">
                    Specify date filed name
                  </Typography>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.date)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`date_field.${index}.name`}
                        rules={{ required: "name is required" }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="Name"
                            variant="outlined"
                            error={!!errors.date_field?.[index]?.name}
                            helperText={
                              errors.date_field?.[index]?.name &&
                              errors.date_field?.[index]?.name?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  );
                })}
            </Grid>
            <Grid container spacing={2}>
              <Grid xs={12}>
                {+itemFieldCount.checkbox > 0 ? (
                  <Typography variant="body2">
                    Specify checkbox filed name
                  </Typography>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.checkbox)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`checkbox_field.${index}.name`}
                        rules={{ required: "name is required" }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="Name"
                            variant="outlined"
                            error={!!errors.checkbox_field?.[index]?.name}
                            helperText={
                              errors.checkbox_field?.[index]?.name &&
                              errors.checkbox_field?.[index]?.name?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions className="flex gap-x-1 pr-6 pb-3">
          <Button variant="contained" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={saveLoading}
            type="submit"
            form="createItemField"
            variant="outlined"
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {fieldCountDioVisible ? (
        <SpecifyFieldCount
          propertyName={propertyName}
          itemFieldCount={itemFieldCount}
          setItemFieldCount={setItemFieldCount}
          setVisible={setFieldCountDioVisible}
          visible={fieldCountDioVisible}
        />
      ) : null}
    </Box>
  );
}

export default CreateItemExtraFieldModal;
