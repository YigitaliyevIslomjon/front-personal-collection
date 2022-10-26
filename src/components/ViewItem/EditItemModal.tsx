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
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import api from "../../utils/api";
import { ItemDataType } from "../../pages/ViewItem/ViewItem";
import { ItemExtraFieldListType, ItemFormTypes } from "../Item/CreateItemModal";
import { imgURlToFile } from "../Collection/ConvertImgURltoFile";
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import UploadImage from "../Collection/UploadImage";
import CircularProgress from "@mui/material/CircularProgress";

type ModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  itemId: string | undefined;
  getItemDataByIdApi: (a: number, b: number) => void;
};

type CollectionListType = {
  collection_name: string;
  _id: string;
}[];

function EditItemModal({
  setVisible,
  visible,
  itemId,
  getItemDataByIdApi,
}: ModalProp) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ItemFormTypes>();

  const [images, setImages] = useState<any>([]);
  const [tagList, setTagList] = useState([]);
  const [itemData, setItemData] = useState({} as ItemDataType);
  const [collectionList, setCollectionList] = useState(
    [] as CollectionListType
  );

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [itemExtraField, setItemExtraField] = useState(
    {} as ItemExtraFieldListType
  );
  const [itemExtraFieldDefValue, setItemExtraFieldDefValue] = useState(
    {} as ItemExtraFieldListType
  );
  const [decitionItemField, setDesctionItemField] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  const getCollectionsList = () => {
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
      });
  };

  const editItemApi = (body: any) => {
    setSaveLoading(true);
    api
      .put(`item/${itemId}`, body)
      .then((res) => {
        setVisible(false);
        reset();
        toastifyMessage({});
        getItemDataByIdApi(1, 8);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const getTagListApi = () => {
    api
      .get("tag/list")
      .then((res) => {
        let tagList = res.data.map((item: any) => item.tag_name);

        setTagList(tagList);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };
  const getItemExtraField = (
    value: {
      collection_name: string;
      _id: string;
    } | null
  ) => {
    if (itemData.collection_id._id === value!._id) {
      setItemExtraField(itemExtraFieldDefValue);
      setDesctionItemField(true);
    } else {
      setDesctionItemField(false);

      api
        .get(`item-extra-field/${value!._id}`)
        .then((res) => {
          setItemExtraField(res.data);
          reset();
        })
        .catch((err) => {
          toastifyMessage({ type: "error", message: err.response.data.error });
        });
    }
  };

  const onSubmit = (data: any) => {
    data.img = images[0].file;
    data.collection_id = data.collection_id._id;
    let form_data = new FormData();
    for (let key in data) {
      if (key !== "img") {
        form_data.append(key, JSON.stringify(data[key]));
      } else {
        form_data.append(key, data[key]);
      }
    }

    editItemApi(form_data);
  };

  const getItemById = () => {
    api
      .get(`item/${itemId}`)
      .then((res) => {
        setItemExtraFieldDefValue(res.data.item_extra_field);
        setItemExtraField(res.data.item_extra_field);

        let item = res.data.item;
        item.tags = item.tags.map((tag: any) => tag.tag_name);
        setItemData(item);
        imgURlToFile(item.path, setImages);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };
  useEffect(() => {
    getCollectionsList();
    getTagListApi();
    getItemById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <DialogTitle id="alert-dialog-title">Edit item</DialogTitle>
      <DialogContent className="overflow-y-auto">
        {Object.values(itemData).length > 1 ? (
          <Box
            id="itemForm"
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
                    name="item_name"
                    rules={{ required: "name is required" }}
                    defaultValue={itemData.item_name}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        size="small"
                        required
                        value={value}
                        fullWidth
                        onChange={onChange}
                        label="Name"
                        variant="outlined"
                        error={!!errors.item_name}
                        helperText={
                          errors.item_name && errors.item_name.message
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid xs={6}>
                  <Controller
                    control={control}
                    name="collection_id"
                    defaultValue={itemData.collection_id}
                    rules={{ required: "collection is required" }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        value={value}
                        fullWidth
                        onChange={(e, val) => {
                          onChange(val);
                          getItemExtraField(val);
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
                <Grid xs={6}>
                  <Controller
                    control={control}
                    name="img"
                    rules={
                      images.length === 0
                        ? { required: "image is required" }
                        : { required: false }
                    }
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
                <Grid xs={6} className="flex flex-cols gap-y-2">
                  <Controller
                    control={control}
                    name="tags"
                    defaultValue={itemData?.tags}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        value={value}
                        multiple
                        fullWidth
                        freeSolo
                        size="small"
                        onChange={(e, value) => {
                          onChange(value);
                        }}
                        options={tagList}
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => {
                            console.log(option, index);
                            return (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            );
                          })
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
                {Object.keys(itemExtraField).length !== 0 ? (
                  <>
                    {decitionItemField ? (
                      <>
                        {itemExtraField?.int_field.map((item, index) => (
                          <Grid xs={6} key={index}>
                            <Controller
                              control={control}
                              defaultValue={Object.values(item)[0]}
                              name={`int_field.${index}.${
                                Object.keys(item)[0]
                              }`}
                              rules={{
                                required: `${Object.keys(item)[0]} is required`,
                              }}
                              render={({ field: { onChange, value } }) => (
                                <TextField
                                  size="small"
                                  fullWidth
                                  value={value}
                                  onChange={onChange}
                                  label={Object.keys(item)[0]}
                                  variant="outlined"
                                  error={
                                    !!errors.int_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ]
                                  }
                                  helperText={
                                    errors.int_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ] &&
                                    errors.int_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ]?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                        ))}
                        {itemExtraField?.str_field.map((item, index) => (
                          <Grid xs={6} key={index}>
                            <Controller
                              control={control}
                              defaultValue={Object.values(item)[0]}
                              name={`str_field.${index}.${
                                Object.keys(item)[0]
                              }`}
                              rules={{
                                required: `${Object.keys(item)[0]} is required`,
                              }}
                              render={({ field: { onChange, value } }) => (
                                <TextField
                                  size="small"
                                  fullWidth
                                  value={value}
                                  onChange={onChange}
                                  label={Object.keys(item)[0]}
                                  variant="outlined"
                                  error={
                                    !!errors.str_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ]
                                  }
                                  helperText={
                                    errors.str_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ] &&
                                    errors.str_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ]?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                        ))}
                        {itemExtraField?.textare_field.map((item, index) => (
                          <Grid xs={6} key={index}>
                            <Controller
                              defaultValue={Object.values(item)[0]}
                              control={control}
                              name={`textare_field.${index}.${
                                Object.keys(item)[0]
                              }`}
                              rules={{
                                required: `${Object.keys(item)[0]} is required`,
                              }}
                              render={({ field: { onChange, value } }) => (
                                <TextField
                                  multiline
                                  maxRows={4}
                                  size="small"
                                  fullWidth
                                  name="count"
                                  value={value}
                                  onChange={onChange}
                                  label={Object.keys(item)[0]}
                                  variant="outlined"
                                  helperText={
                                    errors.textare_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ] &&
                                    errors.textare_field?.[index]?.[
                                      Object.keys(item)[0]
                                    ]?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                        ))}
                        {itemExtraField?.checkbox_field.map((item, index) => (
                          <Grid xs={6} key={index}>
                            <Controller
                              control={control}
                              defaultValue={Object.values(item)[0]}
                              name={`checkbox_field.${index}.${
                                Object.keys(item)[0]
                              }`}
                              rules={{
                                required: `${Object.keys(item)[0]} is required`,
                              }}
                              render={({ field: { onChange, value } }) => (
                                <>
                                  <FormControlLabel
                                    control={<Checkbox />}
                                    value={value}
                                    onChange={onChange}
                                    label={Object.keys(item)[0]}
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
                        {itemExtraField?.date_field.map((item, index) => (
                          <Grid xs={6} key={index}>
                            <Controller
                              control={control}
                              defaultValue={Object.values(item)[0]}
                              name={`date_field.${index}.${
                                Object.keys(item)[0]
                              }`}
                              rules={{
                                required: `${Object.keys(item)[0]} is required`,
                              }}
                              render={({ field: { onChange, value } }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DesktopDatePicker
                                    value={value}
                                    onChange={onChange}
                                    label={Object.keys(item)[0]}
                                    renderInput={(params) => (
                                      <TextField
                                        size="small"
                                        {...params}
                                        fullWidth
                                        helperText={
                                          errors.date_field?.[index]?.[
                                            Object.keys(item)[0]
                                          ] &&
                                          errors.date_field?.[index]?.[
                                            Object.keys(item)[0]
                                          ]?.message
                                        }
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Grid>
                        ))}
                      </>
                    ) : (
                      <>
                        {itemExtraField?.int_field.map((item, index) => (
                          <Grid xs={6} key={index}>
                            <Controller
                              control={control}
                              name={`int_field.${index}.${item.name}`}
                              rules={{ required: `${item.name} is required` }}
                              render={({ field: { onChange } }) => (
                                <TextField
                                  InputLabelProps={{ shrink: true }}
                                  size="small"
                                  fullWidth
                                  onChange={onChange}
                                  label={item.name}
                                  variant="outlined"
                                  error={
                                    !!errors.int_field?.[index]?.[item.name]
                                  }
                                  helperText={
                                    errors.int_field?.[index]?.[item.name] &&
                                    errors.int_field?.[index]?.[item.name]
                                      ?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                        ))}
                        {itemExtraField?.str_field.map(
                          (item: any, index: any) => (
                            <Grid xs={6} key={index}>
                              <Controller
                                control={control}
                                name={`str_field.${index}.${item.name}`}
                                rules={{
                                  required: `${item.name} is required`,
                                }}
                                render={({ field: { onChange } }) => (
                                  <TextField
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    onChange={onChange}
                                    label={item.name}
                                    variant="outlined"
                                    error={
                                      !!errors.str_field?.[index]?.[item.name]
                                    }
                                    helperText={
                                      errors.str_field?.[index]?.[item.name] &&
                                      errors.str_field?.[index]?.[item.name]
                                        ?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>
                          )
                        )}
                        {itemExtraField?.textare_field.map(
                          (item: any, index: any) => (
                            <Grid xs={6} key={index}>
                              <Controller
                                control={control}
                                name={`textare_field.${index}.${item.name}`}
                                rules={{
                                  required: `${item.name} is required`,
                                }}
                                render={({ field: { onChange } }) => (
                                  <TextField
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    fullWidth
                                    name="count"
                                    onChange={onChange}
                                    label={item.name}
                                    variant="outlined"
                                    helperText={
                                      errors.textare_field?.[index]?.[
                                        item.name
                                      ] &&
                                      errors.textare_field?.[index]?.[item.name]
                                        ?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>
                          )
                        )}
                        {itemExtraField?.date_field.map(
                          (item: any, index: any) => (
                            <Grid xs={6} key={index}>
                              <Controller
                                control={control}
                                name={`date_field.${index}.${item.name}`}
                                rules={{
                                  required: `${item.name} is required`,
                                }}
                                render={({ field: { onChange, value } }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DesktopDatePicker
                                      label={item.name}
                                      value={value}
                                      onChange={onChange}
                                      renderInput={(params) => (
                                        <TextField
                                          size="small"
                                          {...params}
                                          fullWidth
                                          helperText={
                                            errors.date_field?.[index]?.[
                                              item.name
                                            ] &&
                                            errors.date_field?.[index]?.[
                                              item.name
                                            ]?.message
                                          }
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                            </Grid>
                          )
                        )}
                        {itemExtraField?.checkbox_field.map(
                          (item: any, index: any) => (
                            <Grid xs={6} key={index}>
                              <Controller
                                control={control}
                                name={`checkbox_field.${index}.${item.name}`}
                                rules={{
                                  required: `${item.name} is required`,
                                }}
                                render={({ field: { onChange } }) => (
                                  <>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label={item.name}
                                      onChange={onChange}
                                    />
                                    <FormHelperText>
                                      {errors.checkbox_field?.[index]?.[
                                        item.name
                                      ] &&
                                        errors.checkbox_field?.[index]?.[
                                          item.name
                                        ]?.message}
                                    </FormHelperText>
                                  </>
                                )}
                              />
                            </Grid>
                          )
                        )}
                      </>
                    )}
                  </>
                ) : null}
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
          form="itemForm"
          variant="outlined"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default EditItemModal;
