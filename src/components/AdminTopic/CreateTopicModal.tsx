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
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";
import { CreateTopicModalProp, TopicForm } from "../../types/topic.types";

function EditTopicModal({
  setVisible,
  visible,
  getTopicTableData,
}: CreateTopicModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TopicForm>();

  const colseModal = () => {
    setVisible(false);
  };

  const createTopicApi = (body: TopicForm) => {
    api
      .post("/topic", body)
      .then((res) => {
        getTopicTableData(1, 10);
        setVisible(false);
        toastifyMessage({});
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const submitTopicForm = (data: TopicForm) => {
    createTopicApi(data);
  };

  return (
    <Dialog onClose={colseModal} open={visible} fullWidth maxWidth="sm">
      <DialogTitle>Create Collecation Topic</DialogTitle>
      <DialogContent>
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
        <Button variant="contained" type="button" onClick={colseModal}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit" form="createTopic" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditTopicModal;
