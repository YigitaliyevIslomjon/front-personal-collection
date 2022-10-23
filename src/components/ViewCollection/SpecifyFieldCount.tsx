import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";

type FieldType = {
  integer: string;
  string: string;
  textare: string;
  date: string;
  checkbox: string;
};

type FormField = {
  count: string;
};

interface DialogProp {
  setVisible: (value: boolean) => void;
  visible: boolean;
  propertyName: string;
  itemFieldCount: FieldType;
  setItemFieldCount: (value: FieldType) => void;
}

function SpecifyFieldCount({
  setVisible,
  visible,
  setItemFieldCount,
  itemFieldCount,
  propertyName,
}: DialogProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormField>();

  const handleClose = () => {
    setVisible(false);
  };

  const onFinish = (data: FormField) => {
    setItemFieldCount({
      ...itemFieldCount,
      [propertyName]: data.count,
    });
    setVisible(false);
  };
  return (
    <Dialog
      onClose={() => {
        setVisible(false);
      }}
      open={visible}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Specify Count of Field</DialogTitle>
      <DialogContent>
        <Box
          id="countField"
          component={"form"}
          className="flex flex-col gap-y-5 pt-2"
          onSubmit={handleSubmit(onFinish)}
        >
          <Controller
            control={control}
            name="count"
            rules={{ max: { value: 3, message: "3 dan oshmasin" } }}
            render={({ field: { onChange } }) => (
              <TextField
                size="small"
                name="count"
                onChange={onChange}
                label="Field Count"
                variant="outlined"
                error={!!errors.count}
                helperText={errors.count && errors.count.message}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit" form="countField">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SpecifyFieldCount;
