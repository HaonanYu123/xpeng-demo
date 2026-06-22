const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") === "family" ? "family" : "pet";
const toast = document.getElementById("toast");
let toastTimer;
let currentUploadUrl = { image: null, video: null };

const copy = {
  pet: {
    pill: "宠物互动",
    title: "和熟悉的小家伙，再玩一会儿。",
    subtitle: "完成三个简单步骤，即可开始沉浸式宠物互动。",
    profileStep: "创建宠物档案",
    interactionStep: "宠物互动",
    profileTitle: "创建宠物档案",
    interactionTitle: "宠物互动",
    nameLabel: "宠物昵称",
    namePlaceholder: "例如：豆包",
    relations: ["我的宠物", "家人的宠物", "共同陪伴的伙伴"],
    poster: "./assets/pet-interaction.png",
    actions: [
      ["喂食", "准备最爱的零食"],
      ["抚摸", "轻轻摸摸它"],
      ["握手", "熟悉的小默契"],
      ["玩耍", "一起快乐玩耍"],
    ],
  },
  family: {
    pill: "亲友互动",
    title: "让珍贵时光，再次鲜活。",
    subtitle: "完成三个简单步骤，即可开始沉浸式亲友互动。",
    profileStep: "创建亲友档案",
    interactionStep: "亲友互动",
    profileTitle: "创建亲友档案",
    interactionTitle: "亲友互动",
    nameLabel: "亲友称呼",
    namePlaceholder: "例如：外婆",
    relations: ["家人", "朋友", "重要的人"],
    poster: "./assets/family-interaction.png",
    actions: [
      ["分享美食", "重温熟悉的味道"],
      ["温暖拥抱", "感受久违的温度"],
      ["握手问候", "再次说声你好"],
      ["一起玩耍", "回到快乐时光"],
    ],
  },
};
const current = copy[mode];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

document.title = `${current.pill} - 小鹏陪伴空间`;
document.getElementById("modePill").textContent = current.pill;
document.getElementById("flowTitle").textContent = current.title;
document.getElementById("flowSubtitle").textContent = current.subtitle;
document.getElementById("profileStepName").textContent = current.profileStep;
document.getElementById("interactionStepName").textContent = current.interactionStep;
document.getElementById("profileTitle").textContent = current.profileTitle;
document.getElementById("interactionTitle").textContent = current.interactionTitle;
document.getElementById("nameLabel").textContent = current.nameLabel;
document.getElementById("profileName").placeholder = current.namePlaceholder;
document.getElementById("profileRelation").replaceChildren(...current.relations.map((relation) => new Option(relation)));
document.getElementById("interactionVideo").poster = current.poster;
document.querySelector(`[data-mode-link="${mode}"]`).classList.add("active");

document.querySelectorAll("#interactionActions button").forEach((button, index) => {
  const [name, description] = current.actions[index];
  button.dataset.action = name;
  button.querySelector("strong").textContent = name;
  button.querySelector("small").textContent = description;
});

function goToStep(step) {
  document.querySelectorAll(".flow-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === String(step)));
  document.querySelectorAll(".step-item").forEach((item) => item.classList.toggle("active", item.dataset.step === String(step)));
  document.querySelector(".flow-content").scrollIntoView({ behavior: "smooth", block: "start" });
}
document.querySelectorAll(".step-item").forEach((item) => item.addEventListener("click", () => goToStep(item.dataset.step)));

document.getElementById("connectBtn").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "正在扫描附近设备…";
  setTimeout(() => {
    document.getElementById("deviceStatus").innerHTML = "<i></i> 已连接 · 信号良好";
    document.getElementById("deviceStatus").classList.add("connected");
    document.querySelector('[data-step="1"]').classList.add("complete");
    button.textContent = "设备连接成功 ✓";
    showToast("XPENG HoloScreen · 01 已连接");
    setTimeout(() => goToStep(2), 550);
  }, 1200);
});

function previewFile(type, file) {
  if (!file) return;
  if (currentUploadUrl[type]) URL.revokeObjectURL(currentUploadUrl[type]);
  currentUploadUrl[type] = URL.createObjectURL(file);
  if (type === "image") {
    const preview = document.getElementById("profileImagePreview");
    preview.src = currentUploadUrl[type];
    preview.hidden = false;
    document.getElementById("imagePlaceholder").hidden = true;
  } else {
    const preview = document.getElementById("profileVideoPreview");
    preview.src = currentUploadUrl[type];
    preview.hidden = false;
    preview.play().catch(() => {});
    document.getElementById("videoPlaceholder").hidden = true;
  }
}
document.getElementById("profileImage").addEventListener("change", (event) => previewFile("image", event.target.files[0]));
document.getElementById("profileVideo").addEventListener("change", (event) => previewFile("video", event.target.files[0]));

document.getElementById("saveProfileBtn").addEventListener("click", () => {
  const name = document.getElementById("profileName").value.trim();
  if (!name) {
    showToast(`请输入${current.nameLabel}`);
    document.getElementById("profileName").focus();
    return;
  }
  if (!document.getElementById("profileImage").files[0] && !document.getElementById("profileVideo").files[0]) {
    showToast("请至少上传一张图片或一段视频");
    return;
  }
  document.querySelector('[data-step="2"]').classList.add("complete");
  showToast(`${name}的档案已保存`);
  setTimeout(() => goToStep(3), 450);
});

const interactionVideo = document.getElementById("interactionVideo");
document.querySelectorAll("#interactionActions button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#interactionActions button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.getElementById("videoIdle").hidden = true;
    interactionVideo.src = button.dataset.video;
    interactionVideo.controls = true;
    interactionVideo.load();
    interactionVideo.play().catch(() => showToast("点击视频画面即可开始播放"));
    const playing = document.getElementById("nowPlaying");
    playing.hidden = false;
    playing.querySelector("b").textContent = button.dataset.action;
    document.querySelector('[data-step="3"]').classList.add("complete");
  });
});
