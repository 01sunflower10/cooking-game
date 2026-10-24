// ---------- 本地数据（收藏/采购计划/做饭时光轴，存于浏览器 localStorage） ----------
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};
const favs = store.get("sgj_favs", []);        // 收藏的菜谱 id
const plans = store.get("sgj_plans", []);      // 采购计划中的菜谱 id
let timeline = store.get("sgj_timeline", []);  // 做饭记录 [{id, date, rating, note}]
let planChecked = store.get("sgj_plan_checked", {}); // 采购清单勾选状态 {id:[食材下标]}

const saveFavs = () => store.set("sgj_favs", favs);
const savePlans = () => store.set("sgj_plans", plans);
const saveTimeline = () => store.set("sgj_timeline", timeline);
const savePlanChecked = () => store.set("sgj_plan_checked", planChecked);

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
