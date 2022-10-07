const dataURLtoFile = (dataurl: any, filename: any) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const imgURlToFile = (url: any, setStateImg: any) =>
  fetch(url)
    .then((response) => response.blob())
    .then((blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }).then((dataUrl) => {
        var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
        setStateImg([{ dataURL: dataUrl, file: fileData }]);
      })
    );
