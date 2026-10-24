// 食光机后端：Express + MySQL
// 接口约定：全量同步（单人本地使用，简单可靠）
const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();
app.use(express.json({ limit: "10mb" })); // 图片走 base64，放宽限制

// ---------- 自定义菜谱（第四组） ----------
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

function rowToRecipe(row) {
  return {
    id: 1000 + row.id, // 与内置菜谱 id 区隔
    name: row.name,
    cat: row.cat,
    cuisine: row.cuisine,
    time: row.time,
    level: row.level,
    servings: row.servings,
    flavor: row.flavor,
    emoji: row.emoji,
    img: row.img,
    ingredients: JSON.parse(row.ingredients || "[]"),
    steps: JSON.parse(row.steps || "[]"),
    tips: JSON.parse(row.tips || "[]"),
    custom: true,
    customId: row.id,
  };
}

// 列表
app.get("/api/recipes", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM custom_recipes ORDER BY id DESC");
    res.json(rows.map(rowToRecipe));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 新建（imageData 为可选的 dataURL，落盘到 uploads/）
app.post("/api/recipes", async (req, res) => {
  const b = req.body || {};
  if (!b.name || !Array.isArray(b.ingredients) || !b.ingredients.length || !Array.isArray(b.steps) || !b.steps.length) {
    return res.status(400).json({ error: "菜名、食材、步骤不能为空" });
  }
  try {
    let img = null;
    const m = typeof b.imageData === "string" ? b.imageData.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/) : null;
    if (m) {
      const ext = m[1] === "jpeg" ? "jpg" : m[1];
      const file = `recipe_${Date.now()}.${ext}`;
      fs.writeFileSync(path.join(uploadsDir, file), Buffer.from(m[2], "base64"));
      img = `/uploads/${file}`;
    }
    const [result] = await db.query(
      "INSERT INTO custom_recipes (name, cat, cuisine, time, level, servings, flavor, emoji, img, ingredients, steps, tips) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        b.name, b.cat || "家常菜", b.cuisine || "家常菜",
        b.time || "30 分钟", b.level || "简单", b.servings || "2 人份",
        b.flavor || "咸鲜", b.emoji || "📝", img,
        JSON.stringify(b.ingredients), JSON.stringify(b.steps), JSON.stringify(b.tips || []),
      ]
    );
    res.json({ ok: true, id: 1000 + result.insertId, img });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 删除（连带清理收藏/采购/图片文件）
app.delete("/api/recipes/:id", async (req, res) => {
  const customId = Number(req.params.id) - 1000;
  if (!Number.isInteger(customId) || customId <= 0) return res.status(400).json({ error: "无效 id" });
  try {
    const [rows] = await db.query("SELECT img FROM custom_recipes WHERE id = ?", [customId]);
    if (!rows.length) return res.status(404).json({ error: "菜谱不存在" });
    if (rows[0].img) {
      const imgPath = path.join(uploadsDir, path.basename(rows[0].img));
      fs.existsSync(imgPath) && fs.unlinkSync(imgPath);
    }
    await db.query("DELETE FROM custom_recipes WHERE id = ?", [customId]);
    await db.query("DELETE FROM favorites WHERE recipe_id = ?", [Number(req.params.id)]);
    await db.query("DELETE FROM shopping_plans WHERE recipe_id = ?", [Number(req.params.id)]);
    await db.query("DELETE FROM shopping_plan_checked WHERE recipe_id = ?", [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 上传图片目录
app.use("/uploads", express.static(uploadsDir));

// ---------- API ----------
app.get("/api/all", async (req, res) => {
  try {
    const [favs] = await db.query("SELECT recipe_id FROM favorites ORDER BY recipe_id");
    const [plans] = await db.query("SELECT recipe_id FROM shopping_plans ORDER BY recipe_id");
    const [checked] = await db.query("SELECT recipe_id, ingredient_index FROM shopping_plan_checked");
    const [timeline] = await db.query("SELECT recipe_id AS id, DATE_FORMAT(cook_date,'%Y-%m-%d') AS date, rating, note FROM cooking_log ORDER BY id");

    const planChecked = {};
    checked.forEach(({ recipe_id, ingredient_index }) => {
      (planChecked[recipe_id] = planChecked[recipe_id] || []).push(ingredient_index);
    });

    res.json({
      favs: favs.map((r) => r.recipe_id),
      plans: plans.map((r) => r.recipe_id),
      planChecked,
      timeline,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 收藏：全量覆盖同步
app.post("/api/favs", async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM favorites");
    if (ids.length) {
      await conn.query("INSERT INTO favorites (recipe_id) VALUES ?", [ids.map((id) => [id])]);
    }
    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

// 采购计划：全量覆盖同步
app.post("/api/plans", async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM shopping_plans");
    await conn.query("DELETE FROM shopping_plan_checked");
    if (ids.length) {
      await conn.query("INSERT INTO shopping_plans (recipe_id) VALUES ?", [ids.map((id) => [id])]);
    }
    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

// 采购清单勾选：单个更新（不整表覆盖，避免互相冲掉）
app.post("/api/plans/checked", async (req, res) => {
  const { recipeId, index, on } = req.body || {};
  try {
    if (on) {
      await db.query("INSERT IGNORE INTO shopping_plan_checked (recipe_id, ingredient_index) VALUES (?, ?)", [recipeId, index]);
    } else {
      await db.query("DELETE FROM shopping_plan_checked WHERE recipe_id = ? AND ingredient_index = ?", [recipeId, index]);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 新增一条做饭记录
app.post("/api/timeline", async (req, res) => {
  const { recipeId, date, rating, note } = req.body || {};
  try {
    await db.query("INSERT INTO cooking_log (recipe_id, cook_date, rating, note) VALUES (?, ?, ?, ?)", [
      recipeId, date, rating || 0, note || "",
    ]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- 静态托管前端（屏蔽 server 目录自身） ----------
app.use("/server", (req, res) => res.status(403).end("Forbidden"));
app.use(express.static(path.join(__dirname, "..")));

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`食光机已启动: http://127.0.0.1:${PORT}`);
  try {
    await db.query("SELECT 1");
    console.log("数据库连接正常 ✓");
  } catch (e) {
    console.error("数据库连接失败:", e.code || e.message);
    console.error("请检查 server/config.json 与数据库账号，或先运行 setup-db.bat");
  }
});
