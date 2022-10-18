import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import api from "../../utils/api";
import ReactMarkdown from "react-markdown";
import "./CreateCollectionModal.scss";
import UploadImage from "./UploadImage";
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";

export type CollectionFormFieldType = {
  collection_name: string;
  description: string;
  topic_id: string;
  img: {
    dataUrl: string;
    file: any[];
  }[];
  file?: any;
  mark_down: boolean;
};
type ModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
};
type TopicListType = {
  topic_name: string;
  _id: string;
}[];

function CreateCollectionModal({ setVisible, visible }: ModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CollectionFormFieldType>();

  const [markDownContent, setMarkDownContent] = useState<string>("");
  const [markDown, setMarkDown] = useState<boolean>(false);
  const [topicList, setTopicList] = useState([] as TopicListType);
  const [images, setImages] = React.useState([]);

  const closeModal = () => {
    setVisible(false);
  };

  const getTopisListApi = () => {
    api
      .get("topic")
      .then((res) => {
        setTopicList(res.data);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  //  becouse of tsx problem , given any type
  const createColleactionApi = (body: any) => {
    api
      .post("collection", body)
      .then((res) => {
        setVisible(false);
        toastifyMessage({});
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  //  becouse of tsx problem , given any type
  const onSubmit = (data: any) => {
    data.img = data.img[0].file;
    let form_data = new FormData();

    for (let key in data) {
      form_data.append(key, data[key]);
    }
    createColleactionApi(form_data);
  };

  useEffect(() => {
    getTopisListApi();
  }, []);

  return (
    <Dialog
      onClose={() => {
        setVisible(false);
      }}
      open={visible}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: "100%",
          height: 500,
        },
      }}
      className="create_colleaction"
    >
      <DialogTitle id="alert-dialog-title">Create collection</DialogTitle>
      <DialogContent id="alert-dialog-description">
        <Box
          id="countField"
          component={"form"}
          className="flex flex-col gap-y-5 pt-2"
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="collection_name"
                  rules={{ required: "name is required" }}
                  render={({ field: { onChange } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      onChange={onChange}
                      label="Name"
                      variant="outlined"
                      error={!!errors.collection_name}
                      helperText={
                        errors.collection_name && errors.collection_name.message
                      }
                    />
                  )}
                />
              </Grid>

              <Grid xs={6}>
                <Controller
                  control={control}
                  name="topic_id"
                  rules={{ required: "topic is required" }}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      fullWidth
                      onChange={(e, value) => {
                        onChange(value?._id);
                      }}
                      size="small"
                      getOptionLabel={(option) => option.topic_name}
                      options={topicList}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.topic_id}
                          helperText={
                            errors.topic_id && errors.topic_id.message
                          }
                          label="Topic"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="img"
                  rules={{ required: "image is required" }}
                  render={({ field: { onChange } }) => (
                    <UploadImage
                      onChange={onChange}
                      setImages={setImages}
                      images={images}
                      errors={errors}
                    />
                  )}
                />
              </Grid>

              <Grid xs={6} className="flex flex-col gap-y-2">
                <Controller
                  control={control}
                  name="mark_down"
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={value}
                          onChange={(e) => {
                            onChange(e);
                            setMarkDown(e.target.checked);
                          }}
                        />
                      }
                      label="Support Markdown"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  rules={{ required: "description is required" }}
                  render={({ field: { onChange } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={4}
                      maxRows={8}
                      onChange={(e) => {
                        onChange(e);
                        setMarkDownContent(e.target.value);
                      }}
                      label="description"
                      variant="outlined"
                      error={!!errors.description}
                      helperText={
                        errors.description && errors.description.message
                      }
                    />
                  )}
                />

                {markDown ? (
                  <Typography variant="body1" component="h2">
                    <ReactMarkdown className="border border-solid border-indigo-600 rounded-md px-3 py-2">
                      {markDownContent}
                    </ReactMarkdown>
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit" form="countField" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateCollectionModal;
