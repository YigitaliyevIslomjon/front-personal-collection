import React, { useState } from "react";
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
// import remarkGfm from "remark-gfm";
import "./CreateCollectionModal.scss";

export type FieldError = {
  collection_name: string;
  description: string;
  topic: string;
  user_id: string;
  img: string;
  file?: any;
  mark_down: boolean;
};
interface ModalProp {
  setVisible: (value: boolean) => void;
  visible: boolean;
}

function CreateCollectionModal({ setVisible, visible }: ModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldError>();
  const [markDownContent, setMarkDownContent] = useState<string>("");
  const [markDown, setMarkDown] = useState<boolean>(false);
  const handleClose = () => {
    setVisible(false);
  };

  const createColleactionApi = (body: any) => {
    api
      .post("collection", body)
      .then((res) => {
        console.log(res);
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = (data: any) => {
    console.log(data);
    data.img = data.img[0].file;
    let form_data = new FormData();

    for (let key in data) {
      form_data.append(key, data[key]);
    }
    // createColleactionApi(form_data);
  };

  const [images, setImages] = React.useState([]);

  const onChangeImg = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const markdown = `Just a link: https://reactjs.com.`;
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
                  rules={{ required: "name is required" }}
                  render={({ field: { onChange } }) => (
                    <TextField
                      required
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
                  name="topic"
                  rules={{ required: "topic is required" }}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      fullWidth
                      onChange={onChange}
                      size="small"
                      options={["book"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.topic}
                          helperText={errors.topic && errors.topic.message}
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
                    <ImageUploading
                      multiple
                      value={images}
                      onChange={(e, b) => {
                        onChangeImg(e, b);
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
                  render={({ field: { onChange } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
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

export default CreateCollectionModal;
