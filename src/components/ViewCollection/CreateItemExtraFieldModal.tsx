import React, { useState } from "react";
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
  const { handleSubmit, control, register } = useForm<FormField>({});

  const handleClose = () => {
    setVisible(false);
  };
  const itemField = [
    { name: "Integer Field", field: "integer" },
    { name: "String Field", field: "string" },
    { name: "Multiline text fields", field: "textare" },
    { name: "Date Field", field: "date" },
    { name: "Checkbox Field", field: "checkbox" },
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Create Field Item</DialogTitle>
        <DialogContent id="alert-dialog-description">
          <Box
            id="createItemField"
            component={"form"}
            className="flex flex-col gap-y-5 pt-2"
            onSubmit={handleSubmit(onFinish)}
          >
            <Controller
              control={control}
              name="selectedField"
              render={({ field: { onChange } }) => (
                <FormControl fullWidth size="small">
                  <InputLabel id="itemFields">Item Fields</InputLabel>
                  <Select
                    onChange={onChange}
                    labelId="itemFields"
                    label="select Fields"
                  >
                    {itemField.map((item, index) => {
                      return (
                        <MenuItem
                          key={item.field}
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
                  <div>Specify interger filed Name</div>
                ) : null}
              </Grid>

              {Array(+itemFieldCount.integer)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name={`int_field.${index}.name`}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="integer Field"
                            variant="outlined"
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
                  <div>Specify string filed Name</div>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.string)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name={`str_field.${index}.name`}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="string Field"
                            variant="outlined"
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
                  <div>Specify textare filed Name</div>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.textare)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name={`textare_field.${index}.name`}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="textare Field"
                            variant="outlined"
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
                  <div>Specify date filed Name</div>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.date)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name={`date_field.${index}.name`}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="date Field"
                            variant="outlined"
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
                  <div>Specify checkbox filed Name</div>
                ) : null}
              </Grid>
              {Array(+itemFieldCount.checkbox)
                .fill(0)
                .map((item, index) => {
                  return (
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name={`checkbox_field.${index}.name`}
                        render={({ field: { onChange } }) => (
                          <TextField
                            fullWidth
                            size="small"
                            onChange={onChange}
                            label="checkbox Field"
                            variant="outlined"
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
      {true ? (
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
