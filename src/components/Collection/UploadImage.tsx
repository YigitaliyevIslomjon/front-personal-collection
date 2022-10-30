import React from "react";
import { Box, Button, FormHelperText } from "@mui/material";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { UploadImageProp } from "../../types/collection.types";

function UploadImage({ setImages, images, onChange, errors }: UploadImageProp) {
  const onChangeImg = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={(e, b) => {
        onChangeImg(e, b);
        onChange(e);
      }}
      maxNumber={1}
    >
      {({ imageList, onImageUpload, onImageRemoveAll, dragProps }) => (
        <Box className="flex flex-col gap-y-2 items-start w-full">
          <Box className="uplaod_img h-[220px] w-full sm:w-[260px] md:w-[330px] md:h-[220px]">
            {imageList.map((image, index) => (
              <img
                key={image.dataURL}
                src={image.dataURL}
                alt=""
                className="object-cover  w-full h-full"
              />
            ))}
          </Box>
          <FormHelperText className="text-red-500">
            {errors.img && errors.img.message}
          </FormHelperText>

          <Button
            className="w-full sm:w-[260px] md:w-[330px]"
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
              className="w-full sm:w-[260px] md:w-[330px]"
              variant={"outlined"}
              onClick={onImageRemoveAll}
            >
              remove image
            </Button>
          ) : null}
        </Box>
      )}
    </ImageUploading>
  );
}

export default UploadImage;
