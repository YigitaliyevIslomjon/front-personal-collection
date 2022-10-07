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
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import ImageUploading, { ImageListType } from "react-images-uploading";
import api from "../../utils/api";
import ReactMarkdown from "react-markdown";
import "./CreateCollectionModal.scss";
import { imgURlToFile } from "./ConvertImgURltoFile";

export type FieldError = {
  collection_name: string;
  description: string;
  topic_id: {
    topic_name: string;
    _id: string;
  };
  img: string;
  file?: any;
  mark_down: boolean;
};
type ModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  collection: {
    collection_name: string;
    description: string;
    mark_down: boolean;
    path: string;
    topic_id: {
      topic_name: string;
      _id: string;
    };
    user_id: {
      user_name: string;
      _id: string;
    };
    _id: string;
  };
};
type TopicListType = {
  topic_name: string;
  _id: string;
}[];

function EditCollectionModal({ setVisible, visible, collection }: ModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldError>();

  const [markDownContent, setMarkDownContent] = useState<string>("");
  const [markDown, setMarkDown] = useState<boolean>(false);
  const [topicList, setTopicList] = useState([] as TopicListType);
  const [images, setImages] = useState<any>([]);

  const handleClose = () => {
    setVisible(false);
  };

  const getTopisList = () => {
    api
      .get("topic")
      .then((res) => {
        setTopicList(res.data);
      })
      .catch((err) => {});
  };

  const editColleactionApi = (body: any) => {
    api
      .put(`collection/${collection._id}`, body)
      .then((res) => {
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = (data: any) => {
    data.img = images[0].file;
    data.topic_id = data.topic_id._id;
    let form_data = new FormData();

    for (let key in data) {
      form_data.append(key, data[key]);
    }
    editColleactionApi(form_data);
  };

  const onChangeImg = (imageList: ImageListType) => {
    setImages(imageList as never[]);
  };

  useEffect(() => {
    imgURlToFile(collection.path, setImages);
    getTopisList();
  }, []);

  return (
    <Dialog
      onClose={() => {
        setVisible(false);
      }}
      open={visible}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
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
                  defaultValue={collection.collection_name}
                  rules={{ required: "name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      required
                      size="small"
                      fullWidth
                      value={value}
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
                  defaultValue={collection.topic_id}
                  rules={{ required: "topic is required" }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      fullWidth
                      value={value}
                      onChange={(e, value) => {
                        onChange(value);
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
                  rules={
                    images.length === 0
                      ? { required: "image is required" }
                      : { required: false }
                  }
                  render={({ field: { onChange, value } }) => (
                    <ImageUploading
                      multiple
                      value={images}
                      onChange={(e, b) => {
                        onChangeImg(e);
                        onChange(e);
                      }}
                      maxNumber={1}
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
                        dragProps,
                      }) => (
                        <div className="flex flex-col gap-y-2 items-start">
                          <div
                            style={{
                              width: "290px",
                              height: "220px",
                            }}
                            className="uplaod_img"
                          >
                            {imageList.map((image, index) => (
                              <img
                                src={image.dataURL}
                                alt=""
                                className="object-cover"
                                width="100%"
                                height="100%"
                              />
                            ))}
                          </div>
                          <FormHelperText className="text-red-500">
                            {errors.img && errors.img.message}
                          </FormHelperText>

                          <Button
                            className="button_width"
                            variant="contained"
                            onClick={() => {
                              if (imageList.length < 1) {
                                onImageUpload();
                              }
                            }}
                            {...dragProps}
                          >
                            upload image
                          </Button>
                          {imageList.length > 0 ? (
                            <Button
                              className="button_width"
                              variant={"outlined"}
                              onClick={onImageRemoveAll}
                            >
                              remove image
                            </Button>
                          ) : null}
                        </div>
                      )}
                    </ImageUploading>
                  )}
                />
              </Grid>

              <Grid xs={6} className="flex flex-col gap-y-2">
                <Controller
                  control={control}
                  name="mark_down"
                  defaultValue={collection.mark_down}
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
                  defaultValue={collection.description}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      size="small"
                      fullWidth
                      value={value}
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
                  <ReactMarkdown className="border border-solid border-indigo-600 rounded-md px-3 py-2">
                    {markDownContent}
                  </ReactMarkdown>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit" form="countField" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCollectionModal;
