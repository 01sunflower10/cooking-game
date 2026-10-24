/* 食光机 · 框架版 v0.1
   仅包含：欢迎页 → 开始使用 → 选菜谱页 的页面流转 */

// ---------- 示例菜谱数据（框架占位，后续可接数据库） ----------
// cat = 分类  cuisine = 菜系（可不选）  ingredients/steps/tips = 详情页数据
const RECIPES = [
  {
    id: 1, name: "砂锅番茄土豆炖牛肉", cat: "家常菜", cuisine: "家常菜",
    time: "45 分钟", level: "中等", servings: "2-3 人份", img: "assets/images/hero-food.jpg",
    ingredients: ["牛腩 500g", "番茄 2 个", "土豆 2 个", "洋葱 半个", "姜 3 片", "蒜 3 瓣", "番茄酱 1 勺", "生抽 2 勺", "料酒 1 勺", "盐 适量"],
    steps: [
      "牛腩切 3cm 块，冷水下锅加姜片料酒，煮出浮沫后捞出，用温水冲净。",
      "番茄顶划十字烫去皮，切大块；土豆切滚刀块；洋葱切丝。",
      "砂锅少油，中火炒香姜片、蒜、洋葱丝。",
      "下番茄块边炒边压，炒出沙后加番茄酱炒匀。",
      "放入牛腩，加开水没过食材，倒生抽，大火烧开。",
      "转小火加盖炖 30 分钟。",
      "下土豆块再炖 15 分钟，至土豆软糯、牛肉酥烂。",
      "加盐调味，大火稍收汁即可上桌。"
    ],
    tips: ["焯水后的牛肉要用温水冲洗，冷水会让肉变紧", "番茄一定要炒出沙，汤底才浓郁", "土豆后放才不会炖散糊汤"]
  },
  {
    id: 2, name: "五彩时蔬温沙拉", cat: "快手菜", cuisine: "西餐",
    time: "15 分钟", level: "简单", servings: "1-2 人份", img: "assets/images/recipe-2.jpg",
    ingredients: ["西兰花 半颗", "圣女果 8 个", "甜玉米粒 50g", "紫甘蓝 少许", "鸡蛋 1 个", "橄榄油 1 勺", "黑胡椒 适量", "盐 少许"],
    steps: [
      "西兰花切小朵，沸水加一点盐焯 1 分钟，捞出。",
      "玉米粒煮 2 分钟捞出。",
      "鸡蛋冷水下锅煮 8 分钟，剥壳切瓣。",
      "紫甘蓝切细丝，圣女果对半切开。",
      "所有蔬菜微微带温摆入盘中，铺上鸡蛋。",
      "淋橄榄油，撒盐和现磨黑胡椒即可。"
    ],
    tips: ["西兰花焯水后过一下凉开水，颜色更翠绿", "温沙拉的蔬菜保留一点温度，口感和香味都更好"]
  },
  {
    id: 3, name: "葱油拌面", cat: "主食", cuisine: "江浙",
    time: "20 分钟", level: "简单", servings: "1 人份", img: "assets/images/recipe-3.jpg",
    ingredients: ["鲜面条 200g", "小葱 4 根", "生抽 2 勺", "老抽 半勺", "白糖 1 勺", "食用油 3 勺"],
    steps: [
      "小葱洗净彻底擦干，切 5cm 长段。",
      "冷油下葱段，全程小火慢炸。",
      "炸至葱段焦黄酥脆，捞出葱段，葱油留在锅里。",
      "生抽、老抽、白糖入锅小火搅至糖化，关火成酱汁。",
      "面条煮熟捞出沥干，装入碗中。",
      "淋葱油酱汁拌匀，摆上炸好的葱段即可。"
    ],
    tips: ["葱段务必擦干水分，否则下锅会溅油", "炸葱全程小火，焦了会发苦", "那勺糖是灵魂，千万别省"]
  },
  {
    id: 4, name: "奶香番茄意面", cat: "主食", cuisine: "西餐",
    time: "25 分钟", level: "简单", servings: "1-2 人份", img: "assets/images/recipe-4.jpg",
    ingredients: ["意面 100g", "番茄 2 个", "淡奶油 50ml", "蒜 2 瓣", "黄油 10g", "盐 适量", "黑胡椒 适量"],
    steps: [
      "水开加盐，意面煮 8 分钟，捞出前留半碗面水。",
      "番茄烫去皮切小丁，蒜切末。",
      "黄油入锅小火融化，下蒜末炒香。",
      "下番茄丁中火炒软，压成酱状。",
      "倒入淡奶油搅匀，小火煮 1 分钟。",
      "放入意面，加两勺面水，翻拌至酱汁浓稠挂面。",
      "盐、黑胡椒调味，装盘即成。"
    ],
    tips: ["面水含淀粉，是酱汁乳化挂面的关键", "淡奶油入锅后别久煮，容易油水分离"]
  },
  {
    id: 5, name: "广式腊味煲仔饭", cat: "主食", cuisine: "粤菜",
    time: "40 分钟", level: "中等", servings: "2 人份", img: "assets/images/recipe-1.jpg",
    ingredients: ["丝苗米 150g", "广式腊肠 1 根", "腊肉 50g", "鸡蛋 1 个", "青菜 2 棵", "生抽 2 勺", "蚝油 1 勺", "白糖 半勺", "香油 几滴"],
    steps: [
      "米淘净后浸泡 20 分钟，沥水。",
      "砂锅内部抹一层油，倒入米，加水至米面高出一指节。",
      "大火烧开后转小火，加盖焖 10 分钟。",
      "腊肠腊肉切薄片，铺在米饭表面。",
      "沿锅边淋一圈油（煎出锅巴的关键），继续小火焖 8 分钟。",
      "生抽、蚝油、糖、香油加一勺水煮开成调味汁。",
      "另起锅焯水青菜。",
      "关火再焖 5 分钟，打入鸡蛋、摆青菜、淋上调味汁，拌匀开吃。"
    ],
    tips: ["锅边淋油才有金黄酥脆的锅巴", "关火后的 5 分钟焖制别开盖，米饭才透", "腊味自带咸味，调味汁别做太咸"]
  },
  {
    id: 6, name: "日式豚骨拉面", cat: "主食", cuisine: "日韩",
    time: "60 分钟", level: "中等", servings: "1 人份", img: "assets/images/recipe-5.jpg",
    ingredients: ["拉面 生面 1 份", "豚骨汤底或浓高汤 500ml", "叉烧肉 3 片", "溏心蛋 半个", "木耳丝 适量", "葱花 适量", "海苔 1 片", "味噌 1 勺", "日式酱油 1 勺"],
    steps: [
      "汤底加热，调入味噌和酱油搅匀保温。",
      "溏心蛋对半切开备用。",
      "大锅水开下面，煮 2 分钟左右至芯还有一点硬度。",
      "面捞入提前用热水烫过的碗中。",
      "冲入热汤至九分满。",
      "摆上叉烧、溏心蛋、木耳丝、海苔，撒葱花完成。"
    ],
    tips: ["碗先用开水烫热，汤才不容易凉", "面煮到八九分即可，入汤后还会继续变软"]
  },
  {
    id: 7, name: "三文鱼波奇碗", cat: "快手菜", cuisine: "日韩",
    time: "15 分钟", level: "简单", servings: "1 人份", img: "assets/images/recipe-7.jpg",
    ingredients: ["刺身级三文鱼 150g", "热米饭 1 碗", "牛油果 半个", "黄瓜 半根", "生抽 1 勺", "芝麻油 几滴", "白芝麻 1 小勺", "海苔碎 适量"],
    steps: [
      "三文鱼切成 2cm 见方的小块。",
      "牛油果、黄瓜切同样大小的块。",
      "生抽、芝麻油、白芝麻混合成调味汁。",
      "米饭微晾后铺入碗底。",
      "码上三文鱼、牛油果、黄瓜。",
      "淋上调味汁，撒海苔碎即成。"
    ],
    tips: ["三文鱼务必购买刺身级，普通生食有风险", "米饭稍晾再码料，避免把鱼烫熟影响口感"]
  },
  {
    id: 8, name: "川香孜然烤串", cat: "家常菜", cuisine: "川湘",
    time: "45 分钟", level: "中等", servings: "2-3 人份", img: "assets/images/recipe-6.jpg",
    ingredients: ["羊腿肉或鸡腿肉 400g", "洋葱 半个", "孜然粉 2 勺", "辣椒粉 1 勺", "白芝麻 1 勺", "生抽 1 勺", "食用油 1 勺", "盐 适量"],
    steps: [
      "肉切 2cm 见方的块，洋葱切丝。",
      "肉块加洋葱丝、生抽、油、一半孜然粉和盐，抓匀腌 30 分钟。",
      "竹签提前泡水 10 分钟防烤焦。",
      "肉块间隔穿签。",
      "烤箱预热 220℃，中层烤 15 分钟后翻面。",
      "撒剩余孜然粉、辣椒粉、白芝麻，再烤 5 分钟出炉。"
    ],
    tips: ["竹签泡过水才不会被烤糊", "孜然辣椒最后撒，早撒容易糊发苦", "没有烤箱用平底锅高火煎，一样焦香"]
  },
];

const $ = (sel) => document.querySelector(sel);

// ---------- 屏幕切换 ----------
const welcomeScreen = $("#screen-welcome");
const recipesScreen = $("#screen-recipes");
const detailScreen = $("#screen-detail");

function switchScreen(from, to) {
  from.classList.remove("screen--active");
  to.classList.add("screen--active");
  if (to === recipesScreen) {
    // 重新触发卡片入场动画
    renderRecipes();
  }
}

$("#btn-start").addEventListener("click", () => switchScreen(welcomeScreen, recipesScreen));
$("#btn-back").addEventListener("click", () => switchScreen(recipesScreen, welcomeScreen));

// ---------- 菜谱卡片渲染（分类 + 菜系 双筛选，均可选） ----------
const currentCat = () => $("#cats .cat--active").dataset.cat;
const currentCuisine = () => $("#cuisines .cat--active").dataset.cuisine;

function renderRecipes() {
  const grid = $("#recipe-grid");
  const cat = currentCat();
  const cuisine = currentCuisine();
  const list = RECIPES.filter(
    (r) => (cat === "全部" || r.cat === cat) && (cuisine === "不限" || r.cuisine === cuisine)
  );

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">这个组合下暂时没有菜谱 🥲<br/>换个分类或菜系试试吧</div>`;
    return;
  }

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

// ---------- 框架占位交互 ----------
$("#recipe-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-card");
  if (!card) return;
  openDetail(Number(card.dataset.id));
});

$("#search-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") showToast(`搜索功能开发中：${e.target.value.trim() || "（空）"}`);
});

// ---------- 菜谱详情页 ----------
function openDetail(id) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return;

  $("#detail-body").innerHTML = `
    <div class="detail__hero">
      <div class="polaroid polaroid--detail">
        <div class="photo"><img src="${r.img}" alt="${r.name}" /></div>
      </div>
    </div>
    <div class="detail__info">
      <h2 class="detail__title">${r.name}</h2>
      <div class="detail__badges">
        <span class="badge badge--cat">${r.cat}</span>
        <span class="badge">${r.cuisine}</span>
      </div>
      <div class="detail__meta">
        <span class="meta-chip">⏱ ${r.time}</span>
        <span class="meta-chip">🔥 ${r.level}</span>
        <span class="meta-chip">🍽 ${r.servings}</span>
      </div>

      <div class="detail__card">
        <h3 class="detail__section-title">🧺 食材清单<small>点击勾选，备料时逐项确认</small></h3>
        <ul class="ing-list">
          ${r.ingredients.map((ing) => `<li class="ing"><span class="ing__box"></span><span class="ing__name">${ing}</span></li>`).join("")}
        </ul>
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

      <button class="btn-start btn-start--detail" id="btn-cook" type="button">开始做菜 🔥</button>
    </div>`;

  switchScreen(recipesScreen, detailScreen);
  detailScreen.scrollTop = 0;
}

// 详情页交互：食材勾选 + 做菜按钮占位
$("#detail-body").addEventListener("click", (e) => {
  const ing = e.target.closest(".ing");
  if (ing) {
    ing.classList.toggle("checked");
    return;
  }
  if (e.target.closest("#btn-cook")) {
    showToast("做菜模式马上上线，先照着步骤热热身 👨‍🍳");
  }
});

$("#btn-detail-back").addEventListener("click", () => switchScreen(detailScreen, recipesScreen));

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
