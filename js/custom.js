// ---------- 第四组：我的菜谱（自定义菜谱的加载 / 上传 / 删除） ----------

// 从数据库加载自定义菜谱，合并进全局 RECIPES（id 1000+，与内置菜谱区隔）
async function loadCustomRecipes() {
  try {
    const res = await fetch("/api/recipes");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const list = await res.json();
    list.forEach((r) => {
      r.keys = r.ingredients.map(extractKey).filter(Boolean).slice(0, 4); // 冰箱找菜匹配用
      if (!RECIPES.some((x) => x.id === r.id)) RECIPES.push(r);
    });
    renderRecipes(); // 新菜直接出现在列表
  } catch (e) {
    console.error("自定义菜谱加载失败:", e.message);
  }
}

// 从"番茄 2 个"这类文本里提取食材名，供冰箱找菜匹配
function extractKey(ing) {
  return (ing || "").trim().split(/[\s\d+~、.．]/)[0] || "";
}

// ---------- 上传表单 ----------
const UPL_EMOJIS = ["📝", "🍲", "🥘", "🍳", "🍜", "🍚", "🥟", "🍤", "🍗", "🥩", "🐟", "🥗", "🍰", "🍮"];
let uplEmoji = "📝";
let uplImageData = null; // 压缩后的 dataURL

$("#btn-upload").addEventListener("click", () => {
  showModal("upload-modal");
  renderEmojiPicker();
  if (!$("#upl-ings").children.length) addLine("upl-ings", "比如：番茄 2 个");
  if (!$("#upl-steps").children.length) addLine("upl-steps", "比如：热锅下油，炒香蒜末");
});

function renderEmojiPicker() {
  $("#upl-emojis").innerHTML = UPL_EMOJIS.map(
    (e) => `<button class="upl__emoji${e === uplEmoji ? " on" : ""}" data-e="${e}" type="button">${e}</button>`
  ).join("");
}
$("#upl-emojis").addEventListener("click", (e) => {
  const b = e.target.closest(".upl__emoji");
  if (!b) return;
  uplEmoji = b.dataset.e;
  renderEmojiPicker();
});

// 动态行（食材 / 步骤）
function addLine(containerId, placeholder) {
  const div = document.createElement("div");
  div.className = "upl__line";
  div.innerHTML = `<input class="upl__input" type="text" maxlength="60" placeholder="${placeholder}" />
    <button class="upl__line__del" type="button" title="删除">✕</button>`;
  div.querySelector(".upl__line__del").addEventListener("click", () => div.remove());
  $("#" + containerId).appendChild(div);
  div.querySelector("input").focus();
}
$("#upl-add-ing").addEventListener("click", () => addLine("upl-ings", "比如：五花肉 300g"));
$("#upl-add-step").addEventListener("click", () => addLine("upl-steps", "比如：小火慢炖 20 分钟"));

// 选图 → canvas 压缩到最长边 1200px / JPEG 85%
$("#upl-img").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const max = 1200;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      uplImageData = canvas.toDataURL("image/jpeg", 0.85);
      const preview = $("#upl-preview");
      preview.hidden = false;
      preview.querySelector("img").src = uplImageData;
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// 保存
$("#btn-upload-save").addEventListener("click", async () => {
  const name = $("#upl-name").value.trim();
  const ingredients = [...$("#upl-ings").querySelectorAll("input")].map((i) => i.value.trim()).filter(Boolean);
  const steps = [...$("#upl-steps").querySelectorAll("input")].map((i) => i.value.trim()).filter(Boolean);
  if (!name) return showToast("先给菜起个名字吧 🏷");
  if (!ingredients.length) return showToast("至少要有一 样食材 🧺");
  if (!steps.length) return showToast("至少要有一个步骤 📝");

  const tips = $("#upl-tips").value.split("\n").map((t) => t.trim()).filter(Boolean);
  const payload = {
    name,
    cat: $("#upl-cat").value,
    cuisine: $("#upl-cuisine").value,
    time: ($("#upl-time").value || "30") + " 分钟",
    servings: ($("#upl-servings").value || "2") + " 人份",
    level: $("#upl-level").value,
    flavor: $("#upl-flavor").value,
    emoji: uplEmoji,
    ingredients,
    steps,
    tips,
    imageData: uplImageData,
  };

  const btn = $("#btn-upload-save");
  btn.disabled = true;
  btn.textContent = "保存中…";
  try {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "保存失败");
    // 立即并入本地列表，无需重新拉取
    RECIPES.push({
      id: data.id, ...payload,
      imageData: undefined,
      img: data.img,
      keys: ingredients.map(extractKey).filter(Boolean).slice(0, 4),
      custom: true,
      customId: data.id - 1000,
    });
    closeModal();
    renderRecipes();
    showToast(`「${name}」已入库 🎉 现在就能做、能收藏、能分享`);
    // 重置表单
    $("#upl-name").value = "";
    $("#upl-ings").innerHTML = "";
    $("#upl-steps").innerHTML = "";
    $("#upl-tips").value = "";
    $("#upl-img").value = "";
    $("#upl-preview").hidden = true;
    uplImageData = null;
    uplEmoji = "📝";
  } catch (e) {
    showToast("保存失败：" + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "保存菜谱 ✓";
  }
});

// 删除自定义菜谱（详情页）
document.addEventListener("click", async (e) => {
  const del = e.target.closest("#btn-del-recipe");
  if (!del || !detailRecipe?.custom) return;
  if (!confirm(`确定删除「${detailRecipe.name}」？不可恢复`)) return;
  try {
    const res = await fetch("/api/recipes/" + detailRecipe.id, { method: "DELETE" });
    if (!res.ok) throw new Error("删除失败");
    const idx = RECIPES.findIndex((x) => x.id === detailRecipe.id);
    if (idx >= 0) RECIPES.splice(idx, 1);
    if (isFav(detailRecipe.id)) toggleFav(detailRecipe.id);   // 从缓存与数据库同步清除
    if (plans.includes(detailRecipe.id)) togglePlan(detailRecipe.id);
    showToast("已删除");
    switchScreen(detailScreen, recipesScreen);
    renderRecipes();
  } catch (err) {
    showToast(err.message);
  }
});

loadCustomRecipes();
