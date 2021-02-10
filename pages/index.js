import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import XHRUpload from "@uppy/xhr-upload";

const uppy = new Uppy({
  meta: { type: "iphoneAdPix" },
  restrictions: {
    maxNumberOfFiles: 3,
    maxFileSize: 1048576 * 4,
    allowedFileTypes: [".jpg", ".jpeg", ".png", ".docx"],
  },
  autoProceed: true,
});

uppy.use(XHRUpload, {
  endpoint: "/api/adPix",
  fieldName: "iphoneAdPix",
  formData: true,
});

uppy.use(ThumbnailGenerator, {
  thumbnailWidth: 200,
  waitForThumbnailsBeforeUpload: false,
});

uppy.on("thumbnail:generated", (file, preview) => {
  console.log(file.name, preview);
});

uppy.on("complete", (result) => {
  const url = result.successful[0].uploadURL;
  console.log("successful upload", result);
});

uppy.on("error", (error) => {
  console.error(error.stack);
});

uppy.on("restriction-failed", (file, error) => {
  const err = error.stack.includes("exceeds maximum allowed size of 4 MB")
    ? "A fájl mérete nagyobb mint 4MB"
    : error;

  alert(
    "Feltöltési hiba: " +
      err +
      "\n" +
      file.name +
      " Mérete : " +
      Math.round(file.size / 1024 / 1024) +
      "MB"
  );
});

/*

    From:   https://uppy.io/examples/dashboard/
            https://uppy.io/docs/react/

 */

const ImageUpload = () => {
  return (
    <form action="/api/adPix" enctype="multipart/form-data" method="post">
      <input type="text" name="title" />
      <input type="file" name="upload" multiple="multiple" />
      <input type="submit" value="Upload" />
    </form>
  );
};

export default ImageUpload;
