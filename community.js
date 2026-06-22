const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

document.querySelectorAll(".topic-filters button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".topic-filters button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".community-card").forEach((card) => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
    });
  });
});

document.getElementById("checkinBtn").addEventListener("click", (event) => {
  if (event.currentTarget.classList.contains("done")) return;
  const count = document.getElementById("checkinCount");
  count.textContent = (Number(count.textContent.replace(",", "")) + 1).toLocaleString("zh-CN");
  event.currentTarget.textContent = "已打卡 ✓";
  event.currentTarget.classList.add("done");
  showToast("打卡成功，连续记录第 4 天");
});

const composer = document.getElementById("composer");
const content = document.getElementById("postContent");
document.getElementById("openComposerBtn").addEventListener("click", () => {
  composer.hidden = false;
  content.focus();
  composer.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.getElementById("closeComposerBtn").addEventListener("click", () => {
  composer.hidden = true;
});
content.addEventListener("input", () => {
  document.getElementById("postLength").textContent = content.value.length;
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = content.value.trim();
  if (!text) {
    showToast("先写下想分享的内容");
    return;
  }
  const topic = document.getElementById("postTopic");
  const card = document.createElement("article");
  card.className = "community-card new-post-card";
  card.dataset.category = topic.value;
  card.innerHTML = `<div class="tip-cover user-post-cover"><span>${topic.options[topic.selectedIndex].text.replace("# ", "")}</span><strong>刚刚发布的<br>陪伴瞬间</strong><small>来自我的动态</small></div><div class="post-body"><div class="user-row"><span class="avatar avatar-blue">我</span><div><strong>我的陪伴空间</strong><small>刚刚</small></div></div><p></p><div class="post-actions"><button class="like-button" type="button">♡ <span>0</span></button><button class="save-button" type="button">收藏</button></div></div>`;
  card.querySelector("p").textContent = text;
  document.getElementById("communityGrid").prepend(card);
  bindPostActions(card);
  content.value = "";
  document.getElementById("postLength").textContent = "0";
  composer.hidden = true;
  showToast("动态发布成功");
});

function bindPostActions(scope = document) {
  scope.querySelectorAll(".like-button:not([data-bound])").forEach((button) => {
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      const liked = button.classList.toggle("liked");
      const number = button.querySelector("span");
      number.textContent = Number(number.textContent) + (liked ? 1 : -1);
      button.firstChild.textContent = liked ? "♥ " : "♡ ";
    });
  });
  scope.querySelectorAll(".save-button:not([data-bound])").forEach((button) => {
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      button.classList.toggle("saved");
      button.textContent = button.classList.contains("saved") ? "已收藏" : "收藏";
    });
  });
}
bindPostActions();
