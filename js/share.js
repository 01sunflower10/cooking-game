// ---------- 第四组：菜谱分享卡片（纯前端 canvas 绘制，可保存发朋友圈） ----------

// 详情页动作区加入分享按钮（跟随 detail.js 渲染）
const _origOpenDetail = openDetail;
openDetail = function (id, from) {
  _origOpenDetail(id, from);
  const actions = document.querySelector(".detail__actions");
  if (actions && !actions.querySelector("#btn-share")) {
    const btn = document.createElement("button");
    btn.className = "btn-plan";
    btn.id = "btn-share";
    btn.type = "button";
    btn.textContent = "🖼 分享卡片";
    actions.insertBefore(btn, actions.querySelector("#btn-plan"));
  }
};

document.addEventListener("click", (e) => {
  if (e.target.closest("#btn-share") && detailRecipe) showShareCard(detailRecipe);
});

let shareCanvas = null;

async function showShareCard(r) {
  showModal("share-modal");
  const stage = $("#share-stage");
  stage.querySelector("img") && (stage.querySelector("img").src = "");
  shareCanvas = await drawShareCard(r);
  $("#share-img").src = shareCanvas.toDataURL("image/png");
}

// 图片加载为 canvas 可用对象（跨域同源，直接用）
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// 文本自动换行，返回行数组
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  line && lines.push(line);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function drawShareCard(r) {
  const W = 900, H = 1300;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const FONT = '"Microsoft YaHei", "PingFang SC", sans-serif';

  // 米黄底
  ctx.fillStyle = "#fbf4e8";
  ctx.fillRect(0, 0, W, H);

  // 拍立得白卡（微倾斜）
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-0.015);
  ctx.translate(-W / 2, -H / 2);
  ctx.shadowColor = "rgba(63,90,56,0.25)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 60, 70, 780, 1060, 10);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // 照片区（或 emoji 占位）
  const px = 90, py = 100, pw = 720, ph = 540;
  const img = await loadImage(r.img);
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 8);
  ctx.clip();
  if (img) {
    const s = Math.max(pw / img.width, ph / img.height);
    const dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = "#f6ecd9";
    ctx.fillRect(px, py, pw, ph);
    ctx.font = `200px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(r.emoji || "🍽", px + pw / 2, py + ph / 2);
  }
  ctx.restore();

  // 和纸胶带
  ctx.save();
  ctx.translate(W / 2, 86);
  ctx.rotate(-0.05);
  ctx.fillStyle = "rgba(233,200,148,0.6)";
  ctx.fillRect(-60, -16, 120, 34);
  ctx.restore();

  // 菜名（超长自动缩小）
  let nameSize = 52;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  do {
    ctx.font = `bold ${nameSize}px ${FONT}`;
    nameSize -= 2;
  } while (ctx.measureText(r.name).width > 660 && nameSize > 26);
  ctx.fillStyle = "#2f3a2b";
  ctx.fillText(r.name, W / 2, 740);

  // 信息胶囊
  const chips = [r.cuisine, r.time, r.level, r.flavor + "口味"];
  ctx.font = `26px ${FONT}`;
  const widths = chips.map((c) => ctx.measureText(c).width + 44);
  const totalW = widths.reduce((a, b) => a + b, 0) + (chips.length - 1) * 18;
  let cx = (W - totalW) / 2;
  chips.forEach((c, i) => {
    ctx.fillStyle = i === 0 ? "rgba(242,107,58,0.12)" : "#e7efe2";
    roundRect(ctx, cx, 776, widths[i], 48, 24);
    ctx.fill();
    ctx.fillStyle = i === 0 ? "#f26b3a" : "#4f6f46";
    ctx.fillText(c, cx + widths[i] / 2, 810);
    cx += widths[i] + 18;
  });

  // 食材
  ctx.textAlign = "left";
  ctx.fillStyle = "#4f6f46";
  ctx.font = `bold 30px ${FONT}`;
  ctx.fillText("🧺 食材", 120, 892);
  ctx.font = `26px ${FONT}`;
  ctx.fillStyle = "#2f3a2b";
  let y = 940;
  r.ingredients.slice(0, 4).forEach((ing) => {
    ctx.fillText("· " + ing, 130, y);
    y += 42;
  });
  if (r.ingredients.length > 4) {
    ctx.fillStyle = "#8b927f";
    ctx.fillText(`…共 ${r.ingredients.length} 样`, 130, y);
  }

  ctx.restore(); // 结束倾斜

  // 小贴士（相纸下方的米黄区域）
  if (r.tips?.length) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#6b6247";
    ctx.font = `24px ${FONT}`;
    wrapText(ctx, "💡 " + r.tips[0], 700).slice(0, 2).forEach((l, i) => {
      ctx.fillText(l, W / 2, 1190 + i * 36);
    });
  }

  // 品牌
  ctx.fillStyle = "#8b927f";
  ctx.font = `bold 26px ${FONT}`;
  ctx.fillText("🧡 食光机 · 发现你的每日灵感菜单", W / 2, 1268);

  return canvas;
}

// 保存到本地
$("#btn-share-save").addEventListener("click", () => {
  if (!shareCanvas) return;
  const a = document.createElement("a");
  a.download = (detailRecipe?.name || "食光机菜谱") + "-分享卡片.png";
  a.href = shareCanvas.toDataURL("image/png");
  a.click();
  showToast("卡片已保存，可以去发朋友圈啦 🖼");
});
