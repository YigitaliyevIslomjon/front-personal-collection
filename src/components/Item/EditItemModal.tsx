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
import ImageUploading, { ImageListType } from "react-images-uploading";
import api from "../../utils/api";
import { ItemDataType } from "../../pages/ViewItem/ViewItem";

import { ItemExtraFieldListType, ItemFormTypes } from "./CreateItemModal";
import { imgURlToFile } from "../Collection/ConvertImgURltoFile";

type ModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  itemData: ItemDataType;
  itemExtraFieldList: ItemExtraFieldListType;
};
type CollectionListType = {
  collection_name: string;
  _id: string;
}[];

function EditItemModal({
  setVisible,
  visible,
  itemData,
  itemExtraFieldList,
}: ModalProp) {
  const {
    handleSubmit,
    control,
    resetField,
    reset,
    formState: { errors },
  } = useForm<ItemFormTypes>();

  const [images, setImages] = useState<any>([]);
  const [tagList, setTagList] = useState([]);
  const [decitionItemField, setDesctionItemField] = useState(true);
  const [collectionList, setCollectionList] = useState(
    [] as CollectionListType
  );

  const [itemExtraFields, setItemExtraFields] = useState(
    {} as ItemExtraFieldListType
  );

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
      .catch((err) => {});
  };

  const editItemApi = (body: any) => {
    api
      .put(`item/${itemData._id}`, body)
      .then((res) => {
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTagListApi = () => {
    api
      .get("tag/list")
      .then((res) => {
        let tagList = res.data.map((item: any) => item.tag_name);

        setTagList(tagList);
      })
      .catch((err) => {});
  };
  const getItemExtraField = (
    value: {
      collection_name: string;
      _id: string;
    } | null
  ) => {
    if (itemData.collection_id._id === value!._id) {
      setItemExtraFields(itemExtraFieldList);
      setDesctionItemField(true);
    } else {
      setDesctionItemField(false);

      api
        .get(`item-extra-field/${value!._id}`)
        .then((res) => {
          setItemExtraFields(res.data);
          reset();
        })
        .catch((err) => {});
    }
  };

  const onSubmit = (data: any) => {
    console.log("datas", data);
    data.img = images[0].file;
    data.collection_id = data.collection_id._id;
    let form_data = new FormData();
    console.log("onSubmit", data);
    for (let key in data) {
      if (key !== "img") {
        form_data.append(key, JSON.stringify(data[key]));
      } else {
        form_data.append(key, data[key]);
      }
    }
    // setVisible(false);
    reset();
    // editItemApi(form_data);
  };

  const onChangeImg = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    console.log("img list", imageList);
    setImages(imageList as never[]);
  };

  useEffect(() => {
    getCollectionsList();
    getTagListApi();
    setItemExtraFields(itemExtraFieldList);
    imgURlToFile(itemData.path, setImages);
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
                      helperText={errors.item_name && errors.item_name.message}
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
                            errors.collection_id && errors.collection_id.message
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
              <Grid xs={6} className="flex flex-cols gap-y-2">
                <Controller
                  control={control}
                  name="tags"
                  defaultValue={itemData?.tags}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      value={value}
                      multiple
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
              {Object.keys(itemExtraFields).length !== 0 ? (
                <>
                  {decitionItemField ? (
                    <>
                      {itemExtraFields?.int_field.map((item, index) => (
                        <Grid xs={6}>
                          <Controller
                            control={control}
                            defaultValue={Object.values(item)[0]}
                            name={`int_field.${index}.${Object.keys(item)[0]}`}
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
                      {itemExtraFields?.str_field.map((item, index) => (
                        <Grid xs={6}>
                          <Controller
                            control={control}
                            defaultValue={Object.values(item)[0]}
                            name={`str_field.${index}.${Object.keys(item)[0]}`}
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
                      {itemExtraFields?.textare_field.map((item, index) => (
                        <Grid xs={6}>
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
                      {itemExtraFields?.checkbox_field.map((item, index) => (
                        <Grid xs={6}>
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
                              <TextField
                                size="small"
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label={Object.keys(item)[0]}
                                variant="outlined"
                                helperText={
                                  errors.checkbox_field?.[index]?.[
                                    Object.keys(item)[0]
                                  ] &&
                                  errors.checkbox_field?.[index]?.[
                                    Object.keys(item)[0]
                                  ]?.message
                                }
                              />
                            )}
                          />
                        </Grid>
                      ))}
                      {itemExtraFields?.date_field.map((item, index) => (
                        <Grid xs={6}>
                          <Controller
                            control={control}
                            defaultValue={Object.values(item)[0]}
                            name={`date_field.${index}.${Object.keys(item)[0]}`}
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
                        </Grid>
                      ))}
                    </>
                  ) : (
                    <>
                      {itemExtraFields?.int_field.map((item, index) => (
                        <Grid xs={6}>
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
                                error={!!errors.int_field?.[index]?.[item.name]}
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
                      {itemExtraFields?.str_field.map(
                        (item: any, index: any) => (
                          <Grid xs={6}>
                            <Controller
                              control={control}
                              name={`str_field.${index}.${item.name}`}
                              rules={{ required: `${item.name} is required` }}
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
                      {itemExtraFields?.textare_field.map(
                        (item: any, index: any) => (
                          <Grid xs={6}>
                            <Controller
                              control={control}
                              name={`textare_field.${index}.${item.name}`}
                              rules={{ required: `${item.name} is required` }}
                              render={({ field: { onChange } }) => (
                                <TextField
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
                      {itemExtraFields?.checkbox_field.map(
                        (item: any, index: any) => (
                          <Grid xs={6}>
                            <Controller
                              control={control}
                              name={`checkbox_field.${index}.${item.name}`}
                              rules={{ required: `${item.name} is required` }}
                              render={({ field: { onChange } }) => (
                                <TextField
                                  size="small"
                                  fullWidth
                                  onChange={onChange}
                                  label={item.name}
                                  variant="outlined"
                                  helperText={
                                    errors.checkbox_field?.[index]?.[
                                      item.name
                                    ] &&
                                    errors.checkbox_field?.[index]?.[item.name]
                                      ?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                        )
                      )}
                      {itemExtraFields?.date_field.map(
                        (item: any, index: any) => (
                          <Grid xs={6}>
                            <Controller
                              control={control}
                              name={`date_field.${index}.${item.name}`}
                              rules={{ required: `${item.name} is required` }}
                              render={({ field: { onChange } }) => (
                                <TextField
                                  size="small"
                                  fullWidth
                                  onChange={onChange}
                                  label={item.name}
                                  variant="outlined"
                                  helperText={
                                    errors.date_field?.[index]?.[item.name] &&
                                    errors.date_field?.[index]?.[item.name]
                                      ?.message
                                  }
                                />
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

export default EditItemModal;
