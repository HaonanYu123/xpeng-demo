let uploadedElement = null;

export function initUploadModule(fileInput, uploadPreview) {
  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];

    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    uploadPreview.innerHTML = "";

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "上传图片预览";

      uploadedElement = img.cloneNode(true);

      uploadPreview.appendChild(img);
    } else if (file.type.startsWith("video/")) {
      const video = document.createElement("video");

      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;

      uploadedElement = video.cloneNode(true);

      uploadPreview.appendChild(video);
    } else {
      alert("仅支持图片或视频文件");
    }
  });
}

export function getUploadedElement() {
  return uploadedElement;
}