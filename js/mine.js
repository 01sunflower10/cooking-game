// ---------- 我的食光（收藏夹 / 采购清单 / 做饭时光轴） ----------
const mineScreen = $("#screen-mine");

$("#btn-mine").addEventListener("click", () => {
  renderMine();
  switchScreen(recipesScreen, mineScreen);
});
$("#btn-mine-back").addEventListener("click", () => {
  renderRecipes();
  switchScreen(mineScreen, recipesScreen);
});

// 数据统计（第四组：本月/累计/最常做 TOP3/省钱估算）
function renderStatsHtml() {
  if (!timeline.length) return "";
  const month = fmtDate(new Date()).slice(0, 7); // YYYY-MM
  const monthCount = timeline.filter((t) => t.date.startsWith(month)).length;
  const counts = {};
  timeline.forEach((t) => (counts[t.id] = (counts[t.id] || 0) + 1));
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, n]) => {
      const r = RECIPES.find((x) => x.id === Number(id));
      return `<b>${r ? r.name : "已下架的菜"}</b> ×${n}`;
    })
    .join("、");
  // 粗略估算：一餐外卖均价 30 元，自己做食材成本约 15 元
  const saved = timeline.length * 15;

  return `<div class="mine__section">
    <h3 class="mine__section-title">📊 数据统计 <small>每一顿亲手做的饭都算数</small></h3>
    <div class="stat-chips">
      <div class="stat-chip"><span class="stat-chip__num">${monthCount}<small>顿</small></span><span class="stat-chip__label">本月做饭</span></div>
      <div class="stat-chip"><span class="stat-chip__num">${timeline.length}<small>顿</small></span><span class="stat-chip__label">累计下厨</span></div>
      <div class="stat-chip"><span class="stat-chip__num">¥${saved}</span><span class="stat-chip__label">比外卖约省（按30元/餐估算）</span></div>
    </div>
    <p class="stat-top">最常做：${top}</p>
  </div>`;
}

function renderMine() {
  const streak = cookStreak();
  const streakHtml = streak >= 2
    ? `<div class="streak">${streak >= 7 ? "🏅" : "🔥"} 已连续做饭 ${streak} 天${streak >= 7 ? " · 一周不断火！" : "，继续保持"}</div>`
    : "";

  const favCards = favs
    .map((id) => RECIPES.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => `
      <div class="mine__fav-card" data-open="${r.id}">
        <span class="mine__fav-thumb">${r.img ? `<img src="${r.img}" alt="${r.name}" />` : (r.emoji || "🍽️")}</span>
        <span class="mine__fav-name">${r.name}<br/><small style="color:var(--muted);font-weight:500">${r.cuisine} · ${r.time}</small></span>
      </div>`)
    .join("");

  const planCards = plans
    .map((id) => RECIPES.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => {
      const checked = planChecked[r.id] || [];
      return `<div class="plan-card">
        <div class="plan-card__head">
          <span class="plan-card__name">${r.name}</span>
          <button class="plan-card__remove" data-remove="${r.id}" type="button">移出计划 ✕</button>
        </div>
        <ul class="ing-list">
          ${r.ingredients.map((ing, i) => `<li class="ing${checked.includes(i) ? " checked" : ""}" data-plan="${r.id}" data-i="${i}"><span class="ing__box"></span><span class="ing__name">${ing}</span></li>`).join("")}
        </ul>
      </div>`;
    })
    .join("");

  const tlItems = [...timeline]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((t) => {
      const r = RECIPES.find((x) => x.id === t.id);
      return `<div class="tl-item">
        <div class="tl-item__date">${t.date}</div>
        <div class="tl-item__name">${r ? r.name : "已下架的菜谱"}${t.rating ? ` <span class="tl-item__stars">${"⭐".repeat(t.rating)}</span>` : ""}</div>
        ${t.note ? `<div class="tl-item__note">「${t.note}」</div>` : ""}
      </div>`;
    })
    .join("");

  $("#mine-body").innerHTML = `
    ${renderStatsHtml()}
    <div class="mine__section">
      <h3 class="mine__section-title">❤️ 收藏夹 <small>想吃的都在这</small></h3>
      ${favs.length ? `<div class="mine__fav-grid">${favCards}</div>` : `<div class="mine__empty">还没有收藏～<br/>点菜谱卡片右上角的 🤍 收起来</div>`}
    </div>
    <div class="mine__section">
      <h3 class="mine__section-title">🛒 采购清单 <small>去超市前打开，逐项勾掉</small></h3>
      ${plans.length ? planCards : `<div class="mine__empty">采购计划是空的～<br/>在菜谱详情页点「🛒 加入采购计划」</div>`}
    </div>
    <div class="mine__section">
      <h3 class="mine__section-title">📖 做饭时光轴 <small>记录每一顿亲手做的饭</small></h3>
      ${streakHtml}
      ${timeline.length ? `<div class="tl">${tlItems}</div>` : `<div class="mine__empty">还没下过厨～<br/>做完一道菜会自动记到这里</div>`}
    </div>`;
}

$("#mine-body").addEventListener("click", (e) => {
  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    togglePlan(Number(removeBtn.dataset.remove));
    renderMine();
    showToast("已移出采购计划");
    return;
  }
  const ing = e.target.closest(".ing[data-plan]");
  if (ing) {
    const pid = ing.dataset.plan;
    const idx = Number(ing.dataset.i);
    const arr = planChecked[pid] || [];
    const pos = arr.indexOf(idx);
    pos >= 0 ? arr.splice(pos, 1) : arr.push(idx);
    planChecked[pid] = arr;
    savePlanChecked(Number(pid), idx, pos < 0);
    ing.classList.toggle("checked");
    return;
  }
  const card = e.target.closest("[data-open]");
  if (card) {
    openDetail(Number(card.dataset.open), mineScreen);
  }
});
