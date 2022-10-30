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
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import { EditTopicModalProp, TopicForm } from "../../types/topic.types";

function EditTopicModal({
  setVisible,
  visible,
  topicTableRowData,
  getTopicTableData,
}: EditTopicModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TopicForm>();

  const coloseModal = () => {
    setVisible(false);
  };

  const updateTopicApi = (body: TopicForm) => {
    api
      .put(`topic/${topicTableRowData._id}`, body)
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
    updateTopicApi(data);
  };

  return (
    <Dialog onClose={coloseModal} open={visible} fullWidth maxWidth="sm">
      <DialogTitle>Edit collecation topic</DialogTitle>
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
            defaultValue={topicTableRowData.topic_name}
            rules={{ required: "topic is required" }}
            render={({ field: { onChange, value } }) => (
              <TextField
                size="small"
                onChange={onChange}
                value={value}
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
        <Button variant="contained" type="button" onClick={coloseModal}>
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
