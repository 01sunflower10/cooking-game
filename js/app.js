/* 食光机 · 框架版 v0.1
   仅包含：欢迎页 → 开始使用 → 选菜谱页 的页面流转 */

// ---------- 示例菜谱数据（框架占位，后续可接数据库） ----------
// cat = 分类  cuisine = 菜系（可不选）  ingredients/steps/tips = 详情页数据
const RECIPES = [
  {
    id: 1, name: "砂锅番茄土豆炖牛肉", cat: "家常菜", cuisine: "鲁菜",
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
    id: 3, name: "葱油拌面", cat: "主食", cuisine: "苏菜",
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
    id: 6, name: "日式豚骨拉面", cat: "主食", cuisine: "日式",
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
    id: 7, name: "三文鱼波奇碗", cat: "快手菜", cuisine: "日式",
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
    id: 8, name: "川香孜然烤串", cat: "家常菜", cuisine: "川菜",
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
  {
    id: 9, name: "农家小炒肉", cat: "家常菜", cuisine: "湘菜",
    time: "25 分钟", level: "简单", servings: "2 人份", img: null, emoji: "🌶️",
    ingredients: ["五花肉 300g", "螺丝椒或青辣椒 5 根", "大蒜 4 瓣", "豆豉 1 小勺", "生抽 1 勺", "老抽 几滴", "盐 适量"],
    steps: [
      "五花肉切 2mm 薄片，青椒斜刀切圈，蒜切片。",
      "干锅不放油，下青椒中火干煸至起虎皮，盛出。",
      "锅中少油，下五花肉中小火煸出油脂，至边缘微焦。",
      "下蒜片、豆豉炒香。",
      "淋生抽、几滴老抽上色炒匀。",
      "倒回青椒，大火翻炒 1 分钟，加盐调味出锅。"
    ],
    tips: ["青椒先干煸出虎皮，香味才出得来", "这道菜的灵魂是五花肉煸出的猪油，别把油全倒掉", "豆豉要小火炒，炒糊会发苦"]
  },
  {
    id: 10, name: "韩式石锅拌饭", cat: "主食", cuisine: "韩式",
    time: "35 分钟", level: "简单", servings: "1-2 人份", img: null, emoji: "🍲",
    ingredients: ["米饭 1 碗", "鸡蛋 1 个", "菠菜 100g", "黄豆芽 100g", "胡萝卜 半根", "香菇 2 朵", "牛肉末 80g", "韩式辣酱 2 勺", "香油 1 勺", "白芝麻 少许"],
    steps: [
      "菠菜、豆芽分别焯水，捞出拌少许盐和香油。",
      "胡萝卜、香菇切丝，少油炒软；牛肉末炒熟调味。",
      "石锅（或砂锅）内壁刷一层香油，倒入米饭。",
      "蔬菜和牛肉按颜色码在米饭上，中间放一个煎蛋。",
      "小火加热 3-4 分钟，听到滋滋声说明锅巴形成了。",
      "加韩式辣酱、撒白芝麻，拌匀趁热吃。"
    ],
    tips: ["锅底香油要刷足，才有金黄酥脆的锅巴", "没有石锅用铸铁锅或砂锅代替", "辣酱里加少许雪碧或糖，口感更顺"]
  },
  {
    id: 11, name: "糖醋里脊", cat: "家常菜", cuisine: "鲁菜",
    time: "30 分钟", level: "中等", servings: "2-3 人份", img: null, emoji: "🍖",
    ingredients: ["猪里脊 300g", "鸡蛋 1 个", "淀粉 80g", "面粉 20g", "番茄酱 3 勺", "白糖 2 勺", "白醋 1 勺", "料酒 1 勺", "盐 少许", "白芝麻 适量"],
    steps: [
      "里脊切 1cm 粗条，加盐、料酒抓匀腌 10 分钟。",
      "鸡蛋、淀粉、面粉加少许水调成浓稠蛋糊，能挂住肉条。",
      "油温六成热，肉条裹糊逐条下锅，炸至定型微黄捞出。",
      "油温升至八成热，复炸 30 秒至金黄酥脆。",
      "锅留底油，下番茄酱、白糖、白醋和半碗水，小火熬至起大泡。",
      "倒入肉条快速翻裹糖醋汁，撒白芝麻出锅。"
    ],
    tips: ["复炸是外壳酥脆的关键，别省这一步", "糖醋汁熬到冒大泡再下肉，挂汁才透亮", "裹汁后全程大火快翻，久了外壳会回软"]
  },
  {
    id: 12, name: "西湖醋鱼", cat: "家常菜", cuisine: "浙菜",
    time: "30 分钟", level: "中等", servings: "2 人份", img: null, emoji: "🐟",
    ingredients: ["草鱼 1 条(约 750g)", "绍酒 2 勺", "镇江香醋 2 勺", "白糖 3 勺", "生抽 2 勺", "姜 1 块", "水淀粉 适量"],
    steps: [
      "草鱼宰杀治净，从背部剖开成两片，鱼身剞斜刀。",
      "锅中水烧开，鱼皮朝上放入，加绍酒、姜片。",
      "小火煮 3-4 分钟，筷子能轻松扎入鱼背即熟，捞出装盘。",
      "取煮鱼原汤 3 勺，加生抽、白糖烧开。",
      "最后淋入香醋，水淀粉勾芡至浓稠透亮。",
      "把糖醋汁浇在鱼身上，撒姜末即成。"
    ],
    tips: ["煮鱼火候要轻，鱼肉刚断生最嫩", "醋要最后放，久煮酸味会挥发", "正宗做法不用一滴油，靠原汤勾芡出味"]
  },
  {
    id: 13, name: "荔枝肉", cat: "家常菜", cuisine: "闽菜",
    time: "30 分钟", level: "中等", servings: "2 人份", img: null, emoji: "🍒",
    ingredients: ["猪里脊 300g", "马蹄 6 颗", "葱 2 根", "蒜 3 瓣", "番茄酱 2 勺", "红糟 1 勺(可选)", "白糖 1 勺", "白醋 1 勺", "绍酒 1 勺", "鸡蛋 1 个", "淀粉 60g"],
    steps: [
      "里脊切成 2cm 厚片，表面剞十字花刀，再改成 3cm 见方块。",
      "肉块加盐、绍酒抓匀，裹上蛋液淀粉糊。",
      "马蹄切片，葱切段，蒜切末。",
      "油六成热下肉块，炸到花刀翻开、形似荔枝、金黄捞出。",
      "锅留底油爆香蒜末，下番茄酱、红糟、糖、醋和少许水烧开。",
      "倒入肉块和马蹄，大火翻炒裹匀酱汁，撒葱段出锅。"
    ],
    tips: ["花刀深浅要一致，炸后肉块卷缩才像荔枝", "加红糟是福州地道做法，颜色更红亮", "马蹄最后下锅，保留脆感"]
  },
  {
    id: 14, name: "红烧臭鳜鱼", cat: "家常菜", cuisine: "徽菜",
    time: "40 分钟", level: "中等", servings: "2 人份", img: null, emoji: "🥘",
    ingredients: ["腌制臭鳜鱼 1 条", "五花肉末 50g", "冬笋丁 50g", "姜 4 片", "蒜 4 瓣", "干辣椒 2 个", "生抽 1 勺", "老抽 半勺", "白糖 1 勺"],
    steps: [
      "臭鳜鱼冲洗擦干，两面剞斜刀。",
      "热锅热油，鱼两面煎至金黄定型，盛出。",
      "底油煸炒五花肉末出油，下姜蒜、干辣椒、笋丁炒香。",
      "鱼回锅，加生抽、老抽、糖和热水没过鱼身一半。",
      "中火烧 10 分钟，边烧边把汤汁淋在鱼身上。",
      "大火收汁，汤汁浓稠裹鱼即可。"
    ],
    tips: ["臭鳜鱼闻臭食香，是徽菜'腌鲜'工艺的代表作", "煎鱼的锅要够热才不破皮", "收汁时不断把汤汁淋在鱼上，鱼肉更入味"]
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
          ${r.img
            ? `<img src="${r.img}" alt="${r.name}" loading="lazy" />`
            : `<div class="img-placeholder"><span class="img-placeholder__emoji">${r.emoji || "🍽"}</span><span class="img-placeholder__text">图片待补</span></div>`}
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

function openDetail(id) {
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

      <button class="btn-start btn-start--detail" id="btn-cook" type="button">开始做菜 🔥</button>
    </div>`;

  switchScreen(recipesScreen, detailScreen);
  detailScreen.scrollTop = 0;
}

// 详情页交互：份量换算 + 食材勾选 + 做菜按钮
$("#detail-body").addEventListener("click", (e) => {
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

$("#btn-detail-back").addEventListener("click", () => switchScreen(detailScreen, recipesScreen));

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
    showToast(`「${cookRecipe.name}」出锅啦，祝你好胃口 🎉`);
    closeCooking();
  }
});
$("#btn-cook-exit").addEventListener("click", closeCooking);

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
