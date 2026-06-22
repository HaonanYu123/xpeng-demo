const loginForm = document.getElementById("loginForm");
const phoneInput = document.getElementById("phoneInput");
const codeInput = document.getElementById("codeInput");
const agreementInput = document.getElementById("agreementInput");
const sendCodeBtn = document.getElementById("sendCodeBtn");
const phoneError = document.getElementById("phoneError");
const codeError = document.getElementById("codeError");
const toast = document.getElementById("toast");
let countdownTimer;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
  phoneError.textContent = "";
});

codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
  codeError.textContent = "";
});

sendCodeBtn.addEventListener("click", () => {
  if (!isValidPhone(phoneInput.value)) {
    phoneError.textContent = "请输入正确的 11 位手机号";
    phoneInput.focus();
    return;
  }

  let seconds = 60;
  sendCodeBtn.disabled = true;
  sendCodeBtn.textContent = `${seconds}s 后重试`;
  showToast("验证码已发送（当前为前端演示）");

  countdownTimer = setInterval(() => {
    seconds -= 1;
    sendCodeBtn.textContent = `${seconds}s 后重试`;
    if (seconds <= 0) {
      clearInterval(countdownTimer);
      sendCodeBtn.disabled = false;
      sendCodeBtn.textContent = "重新获取";
    }
  }, 1000);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let valid = true;

  if (!isValidPhone(phoneInput.value)) {
    phoneError.textContent = "请输入正确的 11 位手机号";
    valid = false;
  }
  if (!/^\d{6}$/.test(codeInput.value)) {
    codeError.textContent = "请输入 6 位验证码";
    valid = false;
  }
  if (!agreementInput.checked) {
    showToast("请先阅读并同意用户协议与隐私政策");
    valid = false;
  }
  if (!valid) return;

  showToast("登录成功，正在进入互动体验");
  setTimeout(() => {
    window.location.href = "./index.html#experiences";
  }, 650);
});
