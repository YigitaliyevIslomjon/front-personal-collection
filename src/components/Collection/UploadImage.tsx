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
  );
}

export default UploadImage;
