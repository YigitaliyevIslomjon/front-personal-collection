import React from "react";
import { Button, FormHelperText } from "@mui/material";
import ImageUploading, { ImageListType } from "react-images-uploading";

type UploadImageType = {
  setImages: any;
  images: any;
  onChange: any;
  errors: any;
};

function UploadImage({ setImages, images, onChange, errors }: UploadImageType) {
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
        <div className="flex flex-col gap-y-2 items-start w-full">
          <div className="uplaod_img h-[220px] w-full sm:w-[260px] md:w-[330px] md:h-[220px]">
            {imageList.map((image, index) => (
              <img
                key={image.dataURL}
                src={image.dataURL}
                alt=""
                className="object-cover  w-full h-full"
              />
            ))}
          </div>
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
        </div>
      )}
    </ImageUploading>
  );
}

export default UploadImage;
