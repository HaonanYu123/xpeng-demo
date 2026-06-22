export function syncToScreen(sourceElement, carContent) {
  if (!sourceElement) {
    alert("请先上传或生成内容");
    return;
  }

  carContent.innerHTML = "";

  const cloned = sourceElement.cloneNode(true);

  if (cloned.tagName === "VIDEO") {
    cloned.autoplay = true;
    cloned.loop = true;
    cloned.muted = true;
    cloned.controls = false;
  }

  carContent.appendChild(cloned);
}