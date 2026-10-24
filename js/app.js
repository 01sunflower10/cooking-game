// ---------- 屏幕切换 ----------
const welcomeScreen = $("#screen-welcome");
const recipesScreen = $("#screen-recipes");
const detailScreen = $("#screen-detail");
let lastListScreen = null; // 打开详情前所在的列表屏（选菜谱/我的食光）

function switchScreen(from, to) {
  // 不依赖 from：全局清除，保证任意入口跳转都只有一个活动屏
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("screen--active"));
  to.classList.add("screen--active");
  if (to === recipesScreen) {
    // 重新触发卡片入场动画
    renderRecipes();
  }
}

$("#btn-start").addEventListener("click", () => switchScreen(welcomeScreen, recipesScreen));
$("#btn-back").addEventListener("click", () => switchScreen(recipesScreen, welcomeScreen));

// ---------- 菜谱卡片渲染（分类/菜系/耗时/口味/难度 五维筛选，均可选） ----------
function renderRecipes() {
  const grid = $("#recipe-grid");
  const cat = $("#cats .cat--active").dataset.cat;
  const cuisine = $("#cuisines .cat--active").dataset.cuisine;
  const time = $("#times .cat--active").dataset.time;
  const flavor = $("#flavors .cat--active").dataset.flavor;
  const level = $("#levels .cat--active").dataset.level;

  const minutes = (r) => parseInt(r.time, 10);
  const timeOk = (r) =>
    time === "all" ||
    (time === "20" && minutes(r) <= 20) ||
    (time === "40" && minutes(r) > 20 && minutes(r) <= 40) ||
    (time === "41" && minutes(r) > 40);
  const flavorOk = (r) => flavor === "不限" || (flavor === "辣" ? /辣/.test(r.flavor) : r.flavor === flavor);

  const list = RECIPES.filter(
    (r) =>
      (cat === "全部" || r.cat === cat) &&
      (cuisine === "不限" || r.cuisine === cuisine) &&
      timeOk(r) &&
      flavorOk(r) &&
      (level === "不限" || r.level === level)
  );

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">这个组合下暂时没有菜谱 🥲<br/>换个筛选条件试试吧</div>`;
    return;
  }

  grid.innerHTML = list
    .map(
      (r, i) => `
      <article class="recipe-card" style="animation-delay:${i * 0.07}s" data-id="${r.id}">
        <div class="recipe-card__img">
          ${r.img
            ? `<img src="${r.img}" alt="${r.name}" loading="lazy" />`
            : `<div class="img-placeholder"><span class="img-placeholder__emoji">${r.emoji || "🍽"}</span><span class="img-placeholder__text">图片待补</span></div>`}
          <span class="recipe-card__badge">${r.cat}</span>
          <button class="fav-btn${isFav(r.id) ? " on" : ""}" data-fav="${r.id}" type="button" title="收藏">${isFav(r.id) ? "❤️" : "🤍"}</button>
        </div>
        <div class="recipe-card__body">
          <h3 class="recipe-card__name">${r.name}</h3>
          <div class="recipe-card__meta">
            <span>⏱ ${r.time}</span><span>🔥 ${r.level}</span><span>🍽 ${r.cuisine}</span>
          </div>
          <button class="recipe-card__btn" type="button">查看菜谱</button>
        </div>
      </article>`
    )
    .join("");
}

// ---------- 筛选切换（分类组 / 菜系组各自独立高亮） ----------
function bindFilterGroup(groupId) {
  $(groupId).addEventListener("click", (e) => {
    const btn = e.target.closest(".cat");
    if (!btn) return;
    document.querySelectorAll(`${groupId} .cat`).forEach((c) => c.classList.remove("cat--active"));
    btn.classList.add("cat--active");
    renderRecipes();
  });
}
bindFilterGroup("#cats");
bindFilterGroup("#cuisines");
bindFilterGroup("#times");
bindFilterGroup("#flavors");
bindFilterGroup("#levels");

// ---------- 框架占位交互 ----------
$("#recipe-grid").addEventListener("click", (e) => {
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    const id = Number(favBtn.dataset.fav);
    const on = toggleFav(id);
    favBtn.classList.toggle("on", on);
    favBtn.textContent = on ? "❤️" : "🤍";
    showToast(on ? "已加入收藏 ❤️ 想吃的都记着" : "已取消收藏");
    return; // 不触发进详情
  }
  const card = e.target.closest(".recipe-card");
  if (!card) return;
  openDetail(Number(card.dataset.id));
});

$("#search-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") showToast(`搜索功能开发中：${e.target.value.trim() || "（空）"}`);
});

// ---------- Toast ----------
let toastTimer;
function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("toast--show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("toast--show"), 2200);
}

// ---------- 弹窗通用 ----------
const modalMask = $("#modal-mask");
function showModal(id) {
  modalMask.hidden = false;
  document.querySelectorAll(".modal").forEach((m) => (m.hidden = true));
  $("#" + id).hidden = false;
}
function closeModal() {
  modalMask.hidden = true;
  stopSlot();
}
modalMask.addEventListener("click", (e) => {
  if (e.target === modalMask || e.target.closest("[data-close]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalMask.hidden) closeModal();
});

// ---------- 今日灵感老虎机 ----------
let slotTimer = null;
let slotPick = null;

function stopSlot() {
  if (slotTimer) clearTimeout(slotTimer);
  slotTimer = null;
}

function openSlot() {
  showModal("slot-modal");
  runSlot();
}

function runSlot() {
  stopSlot();
  const stage = $("#slot-stage");
  stage.classList.remove("done");
  let delay = 60;

  const tick = () => {
    slotPick = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    $("#slot-emoji").textContent = slotPick.emoji || "🍽️";
    $("#slot-name").textContent = slotPick.name;
    $("#slot-meta").textContent = `${slotPick.cuisine} · ${slotPick.time} · ${slotPick.level}`;
  };
  tick();

  // 间隔逐步拉长，像老虎机减速停下
  const schedule = () => {
    slotTimer = setTimeout(() => {
      delay = Math.min(delay * 1.35, 430);
      tick();
      if (delay < 430) {
        schedule();
      } else {
        stage.classList.add("done");
        $("#slot-meta").textContent = `就决定是你了！${slotPick.cuisine} · ${slotPick.time} · ${slotPick.level}`;
      }
    }, delay);
  };
  schedule();
}

$("#btn-slot").addEventListener("click", openSlot);
$("#btn-slot-again").addEventListener("click", runSlot);
$("#btn-slot-go").addEventListener("click", () => {
  if (!slotPick) return;
  closeModal();
  openDetail(slotPick.id);
});

// ---------- 冰箱找菜 ----------
let fridgeSel = new Set();

function openFridge() {
  showModal("fridge-modal");
  renderFridgeChips();
  renderFridgeResults();
}

function renderFridgeChips() {
  const pool = [];
  RECIPES.forEach((r) => r.keys.forEach((k) => { if (!pool.includes(k)) pool.push(k); }));
  $("#fridge-chips").innerHTML = pool
    .map((k) => `<button class="fchip${fridgeSel.has(k) ? " on" : ""}" data-k="${k}" type="button">${fridgeSel.has(k) ? "✓ " : ""}${k}</button>`)
    .join("");
}

function renderFridgeResults() {
  const box = $("#fridge-results");
  if (!fridgeSel.size) {
    box.innerHTML = `<div class="fridge__empty">先勾选几个食材吧，马上告诉你能做什么 🥕</div>`;
    return;
  }
  const scored = RECIPES.map((r) => ({
    r,
    have: r.keys.filter((k) => fridgeSel.has(k)),
    miss: r.keys.filter((k) => !fridgeSel.has(k)),
  }))
    .filter((x) => x.have.length > 0)
    .sort((a, b) => b.have.length - a.have.length);

  if (!scored.length) {
    box.innerHTML = `<div class="fridge__empty">这些食材暂时配不上菜谱，再添几样试试 🤔</div>`;
    return;
  }
  box.innerHTML = scored
    .map(({ r, have, miss }) => {
      const ok = miss.length === 0;
      const note = ok
        ? "✅ 马上就能做"
        : `还差 ${miss.length} 样：${miss.join("、")}`;
      return `<div class="fridge__row" data-id="${r.id}">
        <span class="fridge__row__emoji">${r.emoji || "🍽️"}</span>
        <span class="fridge__row__name">${r.name}</span>
        <span class="fridge__row__note${ok ? " fridge__row__note--ok" : ""}">${note}</span>
      </div>`;
    })
    .join("");
}

$("#btn-fridge").addEventListener("click", openFridge);
$("#fridge-chips").addEventListener("click", (e) => {
  const chip = e.target.closest(".fchip");
  if (!chip) return;
  const k = chip.dataset.k;
  fridgeSel.has(k) ? fridgeSel.delete(k) : fridgeSel.add(k);
  renderFridgeChips();
  renderFridgeResults();
});
$("#fridge-results").addEventListener("click", (e) => {
  const row = e.target.closest(".fridge__row");
  if (!row) return;
  closeModal();
  openDetail(Number(row.dataset.id));
});

// ---------- 初始化 ----------

// ---------- 欢迎页气泡打字机 ----------
const BUBBLE_LINES = ["今日吃什么？", "今天想吃辣的吗？", "30 分钟能搞定吗？", "冰箱里还有土豆…"];
const bubbleText = $("#bubble-text");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  bubbleText.textContent = "";
  (async () => {
    for (let i = 0; ; i++) {
      const line = BUBBLE_LINES[i % BUBBLE_LINES.length];
      for (const ch of line) {
        bubbleText.textContent += ch;
        await wait(130);
      }
      await wait(2100);
      while (bubbleText.textContent.length) {
        bubbleText.textContent = bubbleText.textContent.slice(0, -1);
        await wait(45);
      }
      await wait(450);
    }
  })();
}

// ---------- 初始化 ----------
renderRecipes(); // 首屏渲染（数据就绪后再刷一次，让收藏心形等状态正确）
document.addEventListener("store-ready", () => renderRecipes());
