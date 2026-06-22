const mode = new URLSearchParams(location.search).get("mode") === "family" ? "family" : "pet";
const fileInput = document.getElementById("fileInput");
const uploadBox = document.getElementById("uploadBox");
const image = document.getElementById("creatorImage");
const placeholder = document.getElementById("creatorPlaceholder");
const replaceButton = document.getElementById("replaceImageBtn");
const generateButton = document.getElementById("generateVideoBtn");
const progress = document.getElementById("generationProgress");
const resultVideo = document.getElementById("resultVideo");
const resultEmpty = document.getElementById("resultEmpty");
const resultActions = document.getElementById("resultActions");
const resultStatus = document.getElementById("resultStatus");
const toast = document.getElementById("toast");
let imageUrl;
let selectedFile;
let timer;
let toastTimer;

document.getElementById("creatorMode").textContent = mode === "pet" ? "宠物视频创作" : "亲友视频创作";
document.querySelector(`[data-mode-link="${mode}"]`).classList.add("active");
document.getElementById("useVideoBtn").href = `./experience.html?mode=${mode}`;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

function setImage(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("请选择 JPG 或 PNG 图片");
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    showToast("图片大小不能超过 20MB");
    return;
  }
  if (imageUrl) URL.revokeObjectURL(imageUrl);
  selectedFile = file;
  imageUrl = URL.createObjectURL(file);
  image.src = imageUrl;
  image.hidden = false;
  placeholder.hidden = true;
  replaceButton.hidden = false;
  generateButton.disabled = false;
  showToast("图片已加载，可以生成视频");
}
fileInput.addEventListener("change", () => setImage(fileInput.files[0]));
replaceButton.addEventListener("click", (event) => {
  event.preventDefault();
  fileInput.click();
});
["dragenter", "dragover"].forEach((name) => uploadBox.addEventListener(name, (event) => {
  event.preventDefault();
  uploadBox.classList.add("dragging");
}));
["dragleave", "drop"].forEach((name) => uploadBox.addEventListener(name, (event) => {
  event.preventDefault();
  uploadBox.classList.remove("dragging");
}));
uploadBox.addEventListener("drop", (event) => setImage(event.dataTransfer.files[0]));

document.querySelectorAll("#styleOptions button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#styleOptions button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

async function generateVideo() {
  if (!selectedFile) return;
  generateButton.disabled = true;
  generateButton.innerHTML = "<span>✦</span> 正在生成…";
  progress.hidden = false;
  resultActions.hidden = true;
  resultVideo.hidden = true;
  resultEmpty.hidden = false;
  resultStatus.textContent = "生成中";
  let percent = 0;
  progress.querySelector("span").style.width = "0%";
  progress.querySelector("b").textContent = "0%";
  clearInterval(timer);
  timer = setInterval(() => {
    percent = Math.min(percent + Math.ceil(Math.random() * 13), 92);
    progress.querySelector("span").style.width = `${percent}%`;
    progress.querySelector("b").textContent = `${percent}%`;
  }, 180);

  try {
    let videoUrl;
    if (window.VIDEO_GENERATION_ENDPOINT) {
      const body = new FormData();
      body.append("image", selectedFile);
      body.append("mode", mode);
      body.append("style", document.querySelector("#styleOptions .active").dataset.style);
      const response = await fetch(window.VIDEO_GENERATION_ENDPOINT, { method: "POST", body });
      if (!response.ok) throw new Error("generation failed");
      const data = await response.json();
      videoUrl = data.videoUrl;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      videoUrl = mode === "pet" ? "./assets/玩耍.mp4" : "./assets/握手.mp4";
    }
    clearInterval(timer);
    progress.querySelector("span").style.width = "100%";
    progress.querySelector("b").textContent = "100%";
    resultVideo.src = videoUrl;
    resultVideo.hidden = false;
    resultEmpty.hidden = true;
    resultActions.hidden = false;
    resultStatus.textContent = "生成完成";
    resultStatus.classList.add("complete");
    resultVideo.play().catch(() => {});
    showToast("视频生成完成");
  } catch {
    clearInterval(timer);
    showToast("生成失败，请检查服务配置后重试");
    resultStatus.textContent = "生成失败";
  } finally {
    generateButton.disabled = false;
    generateButton.innerHTML = "<span>✦</span> 一键生成视频";
    setTimeout(() => { progress.hidden = true; }, 700);
  }
}
generateButton.addEventListener("click", generateVideo);
document.getElementById("regenerateBtn").addEventListener("click", generateVideo);
