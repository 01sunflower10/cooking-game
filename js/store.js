// ---------- 本地数据层：MySQL 存储版 ----------
// 启动时从后端 API 拉取全部数据到内存缓存；
// 之后所有读写与原来一致（同步内存操作），保存时异步回写数据库。
// 接口: GET /api/all · POST /api/favs · POST /api/plans · POST /api/plans/checked · POST /api/timeline

const store = {
  async load() {
    try {
      const res = await fetch("/api/all");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      favs = data.favs || [];
      plans = data.plans || [];
      timeline = data.timeline || [];
      planChecked = data.planChecked || {};
      return true;
    } catch (e) {
      console.error("数据加载失败（请确认后端已启动、数据库已初始化）:", e.message);
      return false;
    }
  },
  post(url, body) {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((e) => console.error("保存失败:", url, e.message));
  },
};

// 以下四个变量被 app/detail/mine 各处直接引用，保持原名
let favs = [];        // 收藏的菜谱 id
let plans = [];       // 采购计划中的菜谱 id
let timeline = [];    // 做饭记录 [{recipeId→id, date, rating, note}]
let planChecked = {}; // 采购清单勾选状态 {id:[食材下标]}

const saveFavs = () => store.post("/api/favs", { ids: favs });
const savePlans = () => store.post("/api/plans", { ids: plans });
const savePlanChecked = (recipeId, index, on) => store.post("/api/plans/checked", { recipeId, index, on });
const saveTimeline = () => {}; // 时光轴走逐条新增（见 pushTimeline）

// 新增做饭记录：内存 + 数据库
function pushTimeline(entry) {
  timeline.push(entry);
  store.post("/api/timeline", {
    recipeId: entry.id,
    date: entry.date,
    rating: entry.rating,
    note: entry.note,
  });
}

const isFav = (id) => favs.includes(id);
function toggleFav(id) {
  const i = favs.indexOf(id);
  i >= 0 ? favs.splice(i, 1) : favs.push(id);
  saveFavs();
  return i < 0;
}
function togglePlan(id) {
  const i = plans.indexOf(id);
  i >= 0 ? plans.splice(i, 1) : plans.push(id);
  savePlans();
  return i < 0;
}
function fmtDate(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
// 连续做饭天数（今天或昨天起算）
function cookStreak() {
  const days = [...new Set(timeline.map((t) => t.date))];
  if (!days.length) return 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!days.includes(fmtDate(cursor))) cursor = new Date(cursor.getTime() - 86400000);
  let n = 0;
  while (days.includes(fmtDate(cursor))) {
    n++;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return n;
}

// 数据就绪后通知页面刷新（app.js 会监听并重渲染）
store.load().then((ok) => {
  window.dispatchEvent(new CustomEvent("store-ready", { detail: { ok } }));
});
