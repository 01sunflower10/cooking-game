// ---------- 菜谱详情页 ----------
let detailRecipe = null;
let detailScale = 1; // 相对菜谱原方的倍数

// 解析菜谱基准人数："2-3 人份" → 2
function baseServings(servings) {
  const m = servings.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
}

// 按倍数换算食材文本里的用量："番茄 2 个"×2 → "番茄 4 个"；"半个"→"1 个"；"盐 适量"不变
function scaleIngredient(text, scale) {
  if (scale === 1) return text;
  return text.replace(
    /(半|(\d+(?:\.\d+)?))\s*(小勺|大勺|kg|毫升|ml|克|g|个|片|瓣|勺|根|颗|只|条|块|碗|份)/g,
    (m, num, digit, unit) => {
      const v = num === "半" ? 0.5 : parseFloat(digit);
      let nv = Math.round(v * scale * 10) / 10;
      const ns = String(nv).replace(/\.0$/, "");
      return ns + unit;
    }
  );
}

function renderIngredientList(r, scale) {
  return `<ul class="ing-list">
    ${r.ingredients.map((ing) => `<li class="ing"><span class="ing__box"></span><span class="ing__name">${scaleIngredient(ing, scale)}</span></li>`).join("")}
  </ul>`;
}

// 上次做饭笔记条（做菜笔记的核心：下次做给自己看）
function renderLastNote(r) {
  const last = timeline.filter((t) => t.id === r.id).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  if (!last) return "";
  const stars = last.rating ? "⭐".repeat(last.rating) : "";
  const note = last.note ? `「${last.note}」` : "";
  return `<div class="last-note">📅 上次做 ${last.date} ${stars} ${note}</div>`;
}

function renderServingButtons(r) {
  const base = baseServings(r.servings);
  const opts = [
    { scale: 1, label: `原方（${r.servings}）` },
    { scale: 2 / base, label: "2 人份" },
    { scale: 4 / base, label: "4 人份" },
    { scale: 6 / base, label: "6 人份" },
  ].filter((o, i, arr) => arr.findIndex((x) => x.scale === o.scale) === i); // 与原方同倍数的选项去重
  return `<div class="detail__servings">
    <span class="filter-label">份量</span>
    ${opts.map((o) => `<button class="serving-btn${Math.abs(o.scale - detailScale) < 0.01 ? " serving-btn--active" : ""}" data-scale="${o.scale}" type="button">${o.label}</button>`).join("")}
  </div>`;
}

function openDetail(id, from) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return;
  detailRecipe = r;
  detailScale = 1;

  $("#detail-body").innerHTML = `
    <div class="detail__hero">
      <div class="polaroid polaroid--detail">
        <div class="photo">${r.img
          ? `<img src="${r.img}" alt="${r.name}" />`
          : `<div class="img-placeholder"><span class="img-placeholder__emoji">${r.emoji || "🍽"}</span><span class="img-placeholder__text">图片待补</span></div>`}</div>
      </div>
    </div>
    <div class="detail__info">
      <div class="detail__title-row">
        <h2 class="detail__title">${r.name}</h2>
        <button class="fav-btn fav-btn--detail${isFav(r.id) ? " on" : ""}" id="detail-fav" type="button" title="收藏">${isFav(r.id) ? "❤️" : "🤍"}</button>
      </div>
      <div class="detail__badges">
        <span class="badge badge--cat">${r.cat}</span>
        <span class="badge">${r.cuisine}</span>
      </div>
      <div class="detail__meta">
        <span class="meta-chip">⏱ ${r.time}</span>
        <span class="meta-chip">🔥 ${r.level}</span>
        <span class="meta-chip">🍽 ${r.servings}</span>
      </div>

      ${renderLastNote(r)}
      ${renderServingButtons(r)}

      <div class="detail__card">
        <h3 class="detail__section-title">🧺 食材清单<small>点击勾选，备料时逐项确认</small></h3>
        ${renderIngredientList(r, detailScale)}
      </div>

      <div class="detail__card">
        <h3 class="detail__section-title">📝 做法步骤</h3>
        <ol class="step-list">
          ${r.steps.map((s, i) => `<li class="step"><span class="step__num">${i + 1}</span><p class="step__text">${s}</p></li>`).join("")}
        </ol>
      </div>

      <div class="detail__tips">
        <h3 class="detail__section-title">💡 主厨小贴士</h3>
        <ul class="tips-list">${r.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>

      <div class="detail__actions">
        <button class="btn-start btn-start--detail" id="btn-cook" type="button">开始做菜 🔥</button>
        <button class="btn-plan${plans.includes(r.id) ? " on" : ""}" id="btn-plan" type="button">${plans.includes(r.id) ? "✓ 已在采购计划" : "🛒 加入采购计划"}</button>
      </div>
      ${r.custom ? `<button class="btn-del-recipe" id="btn-del-recipe" type="button">🗑 删除这道自定义菜谱</button>` : ""}
    </div>`;

  lastListScreen = from || recipesScreen;
  switchScreen(lastListScreen, detailScreen);
  detailScreen.scrollTop = 0;
}

// 详情页交互：份量换算 + 收藏 + 采购计划 + 食材勾选 + 做菜按钮
$("#detail-body").addEventListener("click", (e) => {
  const favBtn = e.target.closest("#detail-fav");
  if (favBtn) {
    const on = toggleFav(detailRecipe.id);
    favBtn.classList.toggle("on", on);
    favBtn.textContent = on ? "❤️" : "🤍";
    showToast(on ? "已加入收藏 ❤️" : "已取消收藏");
    return;
  }
  const planBtn = e.target.closest("#btn-plan");
  if (planBtn) {
    const on = togglePlan(detailRecipe.id);
    planBtn.classList.toggle("on", on);
    planBtn.textContent = on ? "✓ 已在采购计划" : "🛒 加入采购计划";
    showToast(on ? "已加入采购计划 🛒 去超市前记得打开采购清单" : "已移出采购计划");
    return;
  }
  const sBtn = e.target.closest(".serving-btn");
  if (sBtn) {
    detailScale = parseFloat(sBtn.dataset.scale);
    // 只重渲染份量条与食材清单，避免整页重建跳动
    document.querySelector(".detail__servings").outerHTML = renderServingButtons(detailRecipe);
    document.querySelector(".detail__card .ing-list").outerHTML = renderIngredientList(detailRecipe, detailScale);
    return;
  }
  const ing = e.target.closest(".ing");
  if (ing) {
    ing.classList.toggle("checked");
    return;
  }
  if (e.target.closest("#btn-cook")) {
    openCooking(detailRecipe);
  }
});

$("#btn-detail-back").addEventListener("click", () => {
  const back = lastListScreen || recipesScreen;
  if (back === mineScreen) renderMine(); // 返回我的食光前刷新收藏/计划状态
  switchScreen(detailScreen, back);
});

// ---------- 做菜模式：步骤翻页 + 一键计时 + 响铃 + 屏幕常亮 ----------
const cookingScreen = $("#screen-cooking");
let cookRecipe = null;
let stepIndex = 0;
let timer = null;      // { interval, running, endAt, left }
let audioCtx = null;
let wakeLock = null;

// 从步骤文字里识别时长（如 "炖 30 分钟"、"焖 3-4 分钟"、"半小时"）
function findMinutes(text) {
  const m = text.match(/(\d+)(?:\s*[-~]\s*\d+)?\s*分钟/);
  if (m) return parseInt(m[1], 10);
  if (/半[个]?小时/.test(text)) return 30;
  return 0;
}

function openCooking(r) {
  if (!r) return;
  cookRecipe = r;
  stepIndex = 0;
  renderCookStep();
  switchScreen(detailScreen, cookingScreen);
  requestWakeLock();
}

function renderCookStep() {
  const r = cookRecipe;
  if (!r) return;
  const s = r.steps[stepIndex];
  $("#cook-dish").textContent = r.name;
  $("#cook-step-now").textContent = stepIndex + 1;
  $("#cook-step-total").textContent = r.steps.length;
  $("#cook-num").textContent = stepIndex + 1;
  $("#cook-text").textContent = s;
  $("#cook-progress").style.width = ((stepIndex + 1) / r.steps.length) * 100 + "%";
  $("#btn-prev").disabled = stepIndex === 0;
  $("#btn-next").textContent = stepIndex === r.steps.length - 1 ? "完成做菜 🎉" : "下一步 →";
  // 重放浮现动画
  const main = $("#cook-main");
  main.classList.remove("pop");
  void main.offsetWidth;
  main.classList.add("pop");
  renderTimerChip(findMinutes(s));
}

function fmt(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return m + ":" + s;
}

function clearTimer() {
  if (timer && timer.interval) clearInterval(timer.interval);
  timer = null;
}

// 步骤含时长时显示计时入口
function renderTimerChip(mins) {
  clearTimer();
  const box = $("#cook-timer");
  if (!mins) { box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  box.innerHTML = `<button class="cook-timer__chip" id="timer-start" type="button">⏱ 这一步约 ${mins} 分钟 · 点击开始计时</button>`;
  $("#timer-start").addEventListener("click", () => startTimer(mins * 60));
}

function startTimer(total) {
  clearTimer(); // 启动新计向前，确保旧计时已停止
  ensureCtx();
  const box = $("#cook-timer");
  box.innerHTML = `
    <div class="cook-timer__big" id="timer-display">${fmt(total)}</div>
    <div class="cook-timer__row">
      <button class="cook-timer__btn" id="timer-pause" type="button">暂停</button>
      <button class="cook-timer__btn cook-timer__btn--ghost" id="timer-reset" type="button">跳过</button>
    </div>`;
  let left = total;
  let running = true;
  let endAt = Date.now() + total * 1000;

  const tick = () => {
    if (!running) return;
    left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    const disp = $("#timer-display");
    if (disp) disp.textContent = fmt(left);
    if (left <= 0) timerDone(total);
  };

  timer = { interval: setInterval(tick, 250) };
  $("#timer-pause").addEventListener("click", () => {
    const btn = $("#timer-pause");
    if (!btn) return;
    if (running) {
      running = false;
      clearInterval(timer.interval);
      timer.interval = null;
      btn.textContent = "继续";
    } else {
      running = true;
      endAt = Date.now() + left * 1000;
      timer.interval = setInterval(tick, 250);
      btn.textContent = "暂停";
    }
  });
  $("#timer-reset").addEventListener("click", () => renderTimerChip(Math.round(total / 60)));
}

function timerDone(total) {
  if (timer) { clearInterval(timer.interval); timer.interval = null; }
  beep();
  const disp = $("#timer-display");
  if (disp) {
    disp.textContent = "⏰ 时间到！";
    disp.classList.add("cook-timer__big--done");
  }
  const row = document.querySelector(".cook-timer__row");
  if (row) row.innerHTML = `<button class="cook-timer__btn" id="timer-done-ok" type="button">收到，继续 👌</button>`;
  const ok = $("#timer-done-ok");
  if (ok) ok.addEventListener("click", () => renderTimerChip(Math.round(total / 60)));
  showToast("时间到了，回到灶台看看吧 🔥");
}

// WebAudio 三声蜂鸣
function ensureCtx() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (e) {}
}
function beep() {
  if (!audioCtx) return;
  try {
    for (let i = 0; i < 3; i++) {
      const t0 = audioCtx.currentTime + i * 0.55;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
      o.connect(g).connect(audioCtx.destination);
      o.start(t0);
      o.stop(t0 + 0.45);
    }
  } catch (e) {}
}

// 屏幕常亮（支持时申请，失败静默降级）
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen");
  } catch (e) {}
}
function releaseWakeLock() {
  try { if (wakeLock) wakeLock.release(); } catch (e) {}
  wakeLock = null;
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && cookingScreen.classList.contains("screen--active")) {
    requestWakeLock();
  }
});

function closeCooking() {
  clearTimer();
  releaseWakeLock();
  cookRecipe = null;
  switchScreen(cookingScreen, detailScreen);
}

$("#btn-prev").addEventListener("click", () => {
  if (!cookRecipe || stepIndex === 0) return;
  clearTimer();
  stepIndex--;
  renderCookStep();
});
$("#btn-next").addEventListener("click", () => {
  if (!cookRecipe) return;
  clearTimer();
  if (stepIndex < cookRecipe.steps.length - 1) {
    stepIndex++;
    renderCookStep();
  } else {
    // 完成做菜 → 弹出记录（打分+心得写入时光轴）
    showRecordModal();
  }
});
$("#btn-cook-exit").addEventListener("click", closeCooking);

// ---------- 做饭记录弹窗 ----------
let recordRating = 0;

function showRecordModal() {
  recordRating = 0;
  $("#record-dish").textContent = `「${cookRecipe.name}」出锅！`;
  $("#record-note").value = "";
  renderStars();
  showModal("record-modal");
}

function renderStars() {
  $("#record-star-row").innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<button class="record__star${n <= recordRating ? " lit" : ""}" data-n="${n}" type="button">${n <= recordRating ? "★" : "☆"}</button>`)
    .join("");
}

$("#record-star-row").addEventListener("click", (e) => {
  const star = e.target.closest(".record__star");
  if (!star) return;
  recordRating = Number(star.dataset.n);
  renderStars();
});

$("#btn-record-save").addEventListener("click", () => {
  pushTimeline({
    id: cookRecipe.id,
    date: fmtDate(new Date()),
    rating: recordRating,
    note: $("#record-note").value.trim(),
  });
  closeModal();
  closeCooking();
  const streak = cookStreak();
  showToast(streak >= 3 ? `记录成功！🔥 已连续做饭 ${streak} 天` : "已记入时光轴 📖 今天也是好好吃饭的一天");
});

$("#btn-record-skip").addEventListener("click", () => {
  pushTimeline({ id: cookRecipe.id, date: fmtDate(new Date()), rating: 0, note: "" });
  closeModal();
  closeCooking();
  showToast("已记入时光轴 📖");
});
