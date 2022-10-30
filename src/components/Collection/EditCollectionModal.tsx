import { useState, useEffect } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import api from "../../utils/api";
import ReactMarkdown from "react-markdown";
import "./CreateCollectionModal.scss";
import { imgURlToFile } from "./ConvertImgURltoFile";
import UploadImage from "./UploadImage";
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import {
  CollectionForm,
  EditCollectionModalProp,
  ImageType,
} from "../../types/collection.types";
import { TopicList } from "../../types/topic.types";

function EditCollectionModal({
  setVisible,
  visible,
  collection,
  getCollectionByIdApi,
}: EditCollectionModalProp) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CollectionForm>();

  const [markDownContent, setMarkDownContent] = useState<string>("");
  const [markDown, setMarkDown] = useState<boolean>(false);
  const [topicList, setTopicList] = useState([] as TopicList);
  const [images, setImages] = useState<ImageType>([]);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const handleClose = () => {
    setVisible(false);
  };

  const getTopisList = () => {
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
  const editColleactionApi = (body: any) => {
    setSaveLoading(true);
    api
      .put(`collection/${collection._id}`, body)
      .then((res) => {
        setVisible(false);
        toastifyMessage({});
        getCollectionByIdApi();
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  //  becouse of tsx problem , given any type
  const submitCollectionForm = (data: any) => {
    data.img = images[0].file;
    data.topic_id = data.topic_id._id;
    let form_data = new FormData();

    for (let key in data) {
      form_data.append(key, data[key]);
    }
    editColleactionApi(form_data);
  };

  useEffect(() => {
    imgURlToFile(collection.path, setImages);
    getTopisList();
    // eslint-disable-next-line
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
      <DialogTitle id="alert-dialog-title">Edit collection</DialogTitle>
      <DialogContent id="alert-dialog-description">
        {Object.values(collection).length > 1 ? (
          <Box
            id="collectionField"
            component={"form"}
            className="flex flex-col gap-y-5 pt-2"
            encType="multipart/form-data"
            onSubmit={handleSubmit(submitCollectionForm)}
          >
            <Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={6} className="order-1 md:order-none">
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
                          errors.collection_name &&
                          errors.collection_name.message
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid xs={12} sm={12} md={6} className="order-2 md:order-none">
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

                <Grid xs={12} sm={12} md={6} className="order-4 md:order-none">
                  <Controller
                    control={control}
                    name="img"
                    rules={
                      images.length === 0
                        ? { required: "image is required" }
                        : { required: false }
                    }
                    render={({ field: { onChange, value } }) => (
                      <UploadImage
                        onChange={onChange}
                        setImages={setImages}
                        images={images}
                        errors={errors}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  xs={12}
                  sm={12}
                  md={6}
                  className="flex flex-col gap-y-2 order-3 md:order-none"
                >
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
        ) : (
          <Box className="flex items-center justify-center h-full">
            <CircularProgress color="secondary" />
          </Box>
        )}
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={saveLoading}
          type="submit"
          form="collectionField"
          variant="outlined"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default EditCollectionModal;
