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
import api from "../../utils/api";

type FormField = {
  topic_name: string;
};

interface ModalProp {
  setVisible: (value: boolean) => void;
  visible: boolean;
  getTopicTableData: (a: number, b: number) => void;
}

function CreateCollectTopicModal({
  setVisible,
  visible,
  getTopicTableData,
}: ModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormField>();

  const handleClose = () => {
    setVisible(false);
  };
  const createTopicApi = (body: FormField) => {
    api
      .post("/topic", body)
      .then((res) => {
        getTopicTableData(1, 10);
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const submitTopicForm = (data: FormField) => {
    createTopicApi(data);
  };

  return (
    <Dialog onClose={handleClose} open={visible} fullWidth maxWidth="sm">
      <DialogTitle id="alert-dialog-title">
        Create Collecation Topic
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        <Box
          id="createTopic"
          component={"form"}
          className="flex flex-col gap-y-5 pt-2"
          onSubmit={handleSubmit(submitTopicForm)}
        >
          <Controller
            control={control}
            name="topic_name"
            rules={{ required: "topic is required" }}
            render={({ field: { onChange } }) => (
              <TextField
                size="small"
                onChange={onChange}
                label="Topic"
                variant="outlined"
                error={!!errors.topic_name}
                helperText={errors.topic_name && errors.topic_name.message}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit" form="createTopic" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateCollectTopicModal;
