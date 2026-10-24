/* 食光机 · 框架版 v0.1
   仅包含：欢迎页 → 开始使用 → 选菜谱页 的页面流转 */

// ---------- 示例菜谱数据（框架占位，后续可接数据库） ----------
const RECIPES = [
  { id: 1, name: "砂锅番茄土豆炖牛肉", cat: "家常菜", time: "45 分钟", level: "中等", img: "assets/images/hero-food.jpg" },
  { id: 2, name: "五彩时蔬温沙拉",     cat: "快手菜", time: "15 分钟", level: "简单", img: "assets/images/recipe-2.jpg" },
  { id: 3, name: "葱油拌面",           cat: "主食",   time: "20 分钟", level: "简单", img: "assets/images/recipe-3.jpg" },
  { id: 4, name: "奶香番茄意面",       cat: "主食",   time: "25 分钟", level: "简单", img: "assets/images/recipe-4.jpg" },
];

const $ = (sel) => document.querySelector(sel);

// ---------- 屏幕切换 ----------
const welcomeScreen = $("#screen-welcome");
const recipesScreen = $("#screen-recipes");

function switchScreen(from, to) {
  from.classList.remove("screen--active");
  to.classList.add("screen--active");
  if (to === recipesScreen) {
    // 重新触发卡片入场动画
    renderRecipes($(".cat--active").dataset.cat);
  }
}

$("#btn-start").addEventListener("click", () => switchScreen(welcomeScreen, recipesScreen));
$("#btn-back").addEventListener("click", () => switchScreen(recipesScreen, welcomeScreen));

// ---------- 菜谱卡片渲染 ----------
function renderRecipes(cat = "全部") {
  const grid = $("#recipe-grid");
  const list = cat === "全部" ? RECIPES : RECIPES.filter((r) => r.cat === cat);
  grid.innerHTML = list
    .map(
      (r, i) => `
      <article class="recipe-card" style="animation-delay:${i * 0.07}s" data-id="${r.id}">
        <div class="recipe-card__img">
          <img src="${r.img}" alt="${r.name}" loading="lazy" />
          <span class="recipe-card__badge">${r.cat}</span>
        </div>
        <div class="recipe-card__body">
          <h3 class="recipe-card__name">${r.name}</h3>
          <div class="recipe-card__meta">
            <span>⏱ ${r.time}</span><span>🔥 ${r.level}</span>
          </div>
          <button class="recipe-card__btn" type="button">开始做菜</button>
        </div>
      </article>`
    )
    .join("");
}

// ---------- 分类切换 ----------
$("#cats").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat");
  if (!btn) return;
  document.querySelectorAll(".cat").forEach((c) => c.classList.remove("cat--active"));
  btn.classList.add("cat--active");
  renderRecipes(btn.dataset.cat);
});

// ---------- 框架占位交互 ----------
$("#recipe-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-card");
  if (!card) return;
  const recipe = RECIPES.find((r) => r.id === Number(card.dataset.id));
  showToast(`『${recipe.name}』做菜流程开发中，敬请期待 🍳`);
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
renderRecipes();
