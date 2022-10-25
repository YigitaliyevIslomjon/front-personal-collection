import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormHelperText,
  Chip,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import api from "../../utils/api";
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";
import LoadingButton from "@mui/lab/LoadingButton";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import UploadImage from "../Collection/UploadImage";
import Skeleton from "@mui/material/Skeleton";

export type ItemFormTypes = {
  collection_id: {
    collection_name: string;
    _id: string;
  };
  item_name: string;
  tags: any[];
  img: string;
  int_field: { [key: string]: string }[];
  str_field: { [key: string]: string }[];
  textare_field: { [key: string]: string }[];
  checkbox_field: { [key: string]: boolean }[];
  date_field: { [key: string]: string }[];
};
type ModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  getItemListApi: (a: number, b: number) => void;
};
type CollectionListType = {
  collection_name: string;
  _id: string;
}[];

export type ItemExtraFieldListType = {
  int_field: { [key: string]: string }[];
  str_field: { [key: string]: string }[];
  textare_field: { [key: string]: string }[];
  checkbox_field: { [key: string]: boolean }[];
  date_field: { [key: string]: string }[];
};

function CreateItemModal({ setVisible, visible, getItemListApi }: ModalProp) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ItemFormTypes>();

  const [images, setImages] = React.useState([]);
  const [tagList, setTagList] = useState([]);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [collectionListLoading, setCollectionListLoading] =
    useState<boolean>(false);
  const [tagListLoading, setTagListLoading] = useState<boolean>(false);
  const [collectionList, setCollectionList] = useState(
    [] as CollectionListType
  );

  const [itemExtraFieldList, setItemExtraFieldList] = useState(
    {} as ItemExtraFieldListType
  );

  const handleClose = () => {
    setVisible(false);
  };

  const getCollectionsList = () => {
    setCollectionListLoading(true);
    api
      .get("collection/list")
      .then((res) => {
        setCollectionList(
          res.data.map((item: any) => ({
            collection_name: item.collection_name,
            _id: item._id,
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setCollectionListLoading(false);
      });
  };

  const createItemApi = (body: any) => {
    setSaveLoading(true);
    api
      .post("item", body)
      .then((res) => {
        setVisible(false);
        toastifyMessage({});
        getItemListApi(1, 8);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const getTagListApi = () => {
    setTagListLoading(true);
    api
      .get("tag/list")
      .then((res) => {
        let tagList = res.data.map((item: any) => item.tag_name);
        setTagList(tagList);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setTagListLoading(false);
      });
  };
  const getItemExtraField = (
    value: {
      collection_name: string;
      _id: string;
    } | null
  ) => {
    api
      .get(`item-extra-field/${value!._id}`)
      .then((res) => {
        setItemExtraFieldList(res.data);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const onSubmit = (data: any) => {
    data.img = data.img[0].file;
    data.collection_id = data.collection_id._id;
    let form_data = new FormData();
    for (let key in data) {
      if (key !== "img") {
        form_data.append(key, JSON.stringify(data[key]));
      } else {
        form_data.append(key, data[key]);
      }
    }
    reset();
    createItemApi(form_data);
  };

  useEffect(() => {
    getCollectionsList();
    getTagListApi();
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
          height: 2000,
        },
      }}
      className="create_colleaction"
    >
      <DialogTitle id="alert-dialog-title">Create item</DialogTitle>
      <DialogContent className="overflow-y-auto">
        <Box
          id="itemForm"
          component={"form"}
          className="flex flex-col gap-y-5 pt-2"
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box>
            <Grid container spacing={2}>
              <Grid xs={12} sm={12} md={6}>
                <Controller
                  control={control}
                  name="item_name"
                  rules={{ required: "name is required" }}
                  render={({ field: { onChange } }) => (
                    <TextField
                      required
                      size="small"
                      fullWidth
                      onChange={onChange}
                      label="Name"
                      variant="outlined"
                      error={!!errors.item_name}
                      helperText={errors.item_name && errors.item_name.message}
                    />
                  )}
                />
              </Grid>

              {!collectionListLoading ? (
                <Grid xs={12} sm={12} md={6}>
                  <Controller
                    control={control}
                    name="collection_id"
                    rules={{ required: "collection is required" }}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        fullWidth
                        onChange={(e, value) => {
                          onChange(value);
                          getItemExtraField(value);
                        }}
                        size="small"
                        getOptionLabel={(option) => option.collection_name}
                        options={collectionList}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.collection_id}
                            helperText={
                              errors.collection_id &&
                              errors.collection_id.message
                            }
                            label="Collection"
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              ) : (
                <Grid xs={12} sm={12} md={6}>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    className="h-[40px]"
                  />
                </Grid>
              )}
              <Grid xs={12} sm={12} md={6}>
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

              {!tagListLoading ? (
                <Grid xs={12} sm={12} md={6} className="flex flex-col gap-y-2">
                  <Controller
                    control={control}
                    name="tags"
                    rules={{ required: "tag is required" }}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        multiple
                        fullWidth
                        size="small"
                        id="tags-filled"
                        onChange={(e, value) => {
                          onChange(value);
                        }}
                        freeSolo
                        options={tagList}
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => (
                            <Chip
                              variant="outlined"
                              label={option}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="tags"
                            error={!!errors.tags}
                            helperText={errors.tags && errors.tags.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              ) : (
                <Grid xs={12} sm={12} md={6}>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    className="h-[40px]"
                  />
                </Grid>
              )}

              {Object.keys(itemExtraFieldList).length !== 0 ? (
                <>
                  {itemExtraFieldList?.int_field.map((item, index) => (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`int_field.${index}.${item.name}`}
                        rules={{ required: `${item.name} is required` }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            size="small"
                            fullWidth
                            type="number"
                            onChange={onChange}
                            label={item.name}
                            variant="outlined"
                            error={!!errors.int_field?.[index]?.[item.name]}
                            helperText={
                              errors.int_field?.[index]?.[item.name] &&
                              errors.int_field?.[index]?.[item.name]?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  ))}
                  {itemExtraFieldList?.str_field.map((item, index) => (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`str_field.${index}.${item.name}`}
                        rules={{ required: `${item.name} is required` }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            size="small"
                            fullWidth
                            onChange={onChange}
                            label={item.name}
                            variant="outlined"
                            error={!!errors.str_field?.[index]?.[item.name]}
                            helperText={
                              errors.str_field?.[index]?.[item.name] &&
                              errors.str_field?.[index]?.[item.name]?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  ))}
                  {itemExtraFieldList?.textare_field.map((item, index) => (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`textare_field.${index}.${item.name}`}
                        rules={{ required: `${item.name} is required` }}
                        render={({ field: { onChange } }) => (
                          <TextField
                            multiline
                            maxRows={4}
                            size="small"
                            fullWidth
                            onChange={onChange}
                            label={item.name}
                            variant="outlined"
                            helperText={
                              errors.textare_field?.[index]?.[item.name] &&
                              errors.textare_field?.[index]?.[item.name]
                                ?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  ))}
                  {itemExtraFieldList?.date_field.map((item, index) => (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`date_field.${index}.${item.name}`}
                        rules={{ required: `${item.name} is required` }}
                        render={({ field: { onChange, value } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                              label={item.name}
                              value={value}
                              onChange={onChange}
                              renderInput={(params) => (
                                <TextField
                                  size="small"
                                  {...params}
                                  helperText={
                                    errors.date_field?.[index]?.[item.name] &&
                                    errors.date_field?.[index]?.[item.name]
                                      ?.message
                                  }
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                  ))}

                  {itemExtraFieldList?.checkbox_field.map((item, index) => (
                    <Grid xs={6} key={index}>
                      <Controller
                        control={control}
                        name={`checkbox_field.${index}.${item.name}`}
                        rules={{ required: `${item.name} is required` }}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <FormControlLabel
                              control={<Checkbox />}
                              label={item.name}
                              onChange={onChange}
                            />
                            <FormHelperText>
                              {errors.checkbox_field?.[index]?.[
                                Object.keys(item)[0]
                              ] &&
                                errors.checkbox_field?.[index]?.[
                                  Object.keys(item)[0]
                                ]?.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>
                  ))}
                </>
              ) : null}
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="flex gap-x-1 pr-6 pb-3">
        <Button variant="contained" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={saveLoading}
          type="submit"
          form="itemForm"
          variant="outlined"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CreateItemModal;
