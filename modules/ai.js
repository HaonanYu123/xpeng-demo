let aiElement = null;

export function mockGenerateImage(promptInput, aiPreview) {
  const prompt = promptInput.value;

  aiPreview.innerHTML = "";

  const img = document.createElement("img");

  img.src = "https://picsum.photos/500/500?random=" + Date.now();
  img.alt = "AI生成图片";

  aiElement = img.cloneNode(true);

  aiPreview.appendChild(img);

  console.log("模拟调用即梦图片 API，Prompt:", prompt);
}

export function mockGenerateVideo(promptInput, aiPreview) {
  const prompt = promptInput.value;

  aiPreview.innerHTML = "";

  const box = document.createElement("div");

  box.style.width = "100%";
  box.style.height = "260px";
  box.style.display = "flex";
  box.style.alignItems = "center";
  box.style.justifyContent = "center";
  box.style.background = "linear-gradient(135deg, #0071e3, #1d1d1f)";
  box.style.borderRadius = "24px";
  box.style.color = "#ffffff";
  box.style.fontSize = "18px";
  box.innerHTML = "模拟生成视频结果";

  aiElement = box.cloneNode(true);

  aiPreview.appendChild(box);

  console.log("模拟调用即梦视频 API，Prompt:", prompt);
}

export function getAIElement() {
  return aiElement;
}