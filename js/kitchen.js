// ---------- 模拟做饭：SVG 厨房场景 + 卡通厨师（方案A：做菜模式的厨房视角） ----------
// 监听 detail.js 派发的事件：
//   kitchen-reset {recipe}  进入做菜模式
//   kitchen-step  {text}    每换一步，自动分类动作并播放
//   kitchen-stop            退出做菜模式

const kitchen = (() => {
  let wrap = null;
  let built = false;
  let recipe = null;

  // 步骤文本 → 动作类型（顺序即优先级）
  function classifyStep(text) {
    if (/装盘|出锅|完成|上桌|盛入|开吃/.test(text)) return "plate";
    if (/撒|淋入|淋上|加盐|加糖|加[一的两]?勺|调味|勾芡|倒入|浇/.test(text)) return "season";
    if (/炒|煎|爆|煸|炸|烤|翻/.test(text)) return "stirfry";  // 烹饪动作优先于配料描述
    if (/切|片|丝|丁|末|块|剁|剞|剥/.test(text)) return "cutting";
    if (/炖|焖|煮|蒸|烧|煨|焯|泡|腌|醒|加热/.test(text)) return "stew";
    return "prep";
  }

  // ---------- SVG 场景 ----------
  function build() {
    wrap = document.getElementById("kitchen-wrap");
    if (!wrap || built) return;
    wrap.innerHTML = `
    <svg id="kitchen-svg" viewBox="0 0 800 380" role="img" aria-label="厨房场景">
      <!-- 墙面 -->
      <rect x="0" y="0" width="800" height="300" fill="#f9ead2"/>
      <rect x="0" y="242" width="800" height="58" fill="#e8dfc8"/>
      ${tiles()}
      <!-- 窗户 -->
      <g>
        <rect x="52" y="38" width="150" height="118" rx="6" fill="#aederf5"/>
        <rect x="52" y="38" width="150" height="118" rx="6" fill="none" stroke="#fff" stroke-width="8"/>
        <line x1="127" y1="38" x2="127" y2="156" stroke="#fff" stroke-width="6"/>
        <line x1="52" y1="97" x2="202" y2="97" stroke="#fff" stroke-width="6"/>
        <circle cx="88" cy="72" r="12" fill="#ffe28a" opacity=".9"/>
        <path d="M60 140 q20 -14 40 0 t40 0 t40 0" stroke="#8fc7a8" stroke-width="5" fill="none"/>
        <rect x="38" y="26" width="178" height="8" rx="4" fill="#c8b28a"/>
        <path d="M60 34 l-6 52 q14 10 26 0 l4 -52 z" fill="#f2a65e" opacity=".85"/>
        <path d="M196 34 l6 52 q-14 10 -26 0 l-4 -52 z" fill="#f2a65e" opacity=".85"/>
      </g>
      <!-- 抽油烟机 -->
      <g>
        <rect x="368" y="8" width="64" height="26" fill="#aeb6be"/>
        <path d="M330 34 h140 l14 34 h-168 z" fill="#c3cad1"/>
        <rect x="344" y="56" width="112" height="6" rx="3" fill="#9aa2aa"/>
        <circle cx="366" cy="46" r="4" fill="#f26b3a"/>
        <circle cx="434" cy="46" r="4" fill="#f26b3a"/>
      </g>
      <!-- 置物架 -->
      <g>
        <rect x="560" y="64" width="180" height="8" rx="4" fill="#c8a06a"/>
        <rect x="578" y="30" width="26" height="34" rx="5" fill="#e8b04b"/>
        <rect x="616" y="24" width="30" height="40" rx="5" fill="#a8c686"/>
        <rect x="660" y="34" width="24" height="30" rx="5" fill="#e88a5e"/>
        <circle cx="712" cy="48" r="14" fill="#f26b3a" opacity=".85"/>
      </g>
      <!-- 橱柜台面 -->
      <rect x="0" y="300" width="800" height="16" fill="#b5875a"/>
      <rect x="0" y="316" width="800" height="64" fill="#a0713f"/>
      <rect x="0" y="300" width="800" height="6" fill="#8f6236"/>

      <!-- 灶台 -->
      <rect x="316" y="284" width="180" height="18" rx="9" fill="#5b6167"/>
      <ellipse cx="406" cy="293" rx="66" ry="8" fill="#454a50"/>

      <!-- 火焰 -->
      <g id="kFlame" class="flame flame--off">
        <path class="f1" d="M386 302 q6 -22 20 -26 q-4 14 8 20 q10 -8 14 -18 q8 16 -2 30 z" fill="#ff9d3c"/>
        <path class="f2" d="M394 302 q5 -13 12 -15 q-2 8 5 12 q6 -4 8 -10 q5 9 -2 16 z" fill="#ffd166"/>
      </g>

      <!-- 锅（含锅盖/食物） -->
      <g id="kPot">
        <g id="kFood" opacity="0">
          <circle cx="392" cy="262" r="7" fill="#e88a5e"/>
          <circle cx="412" cy="266" r="6" fill="#a8c686"/>
          <circle cx="424" cy="260" r="6" fill="#f2c14e"/>
        </g>
        <path d="M352 258 h108 a10 10 0 0 1 10 10 v20 a12 12 0 0 1 -12 12 h-104 a12 12 0 0 1 -12 -12 v-20 a10 10 0 0 1 10 -10 z" fill="#8b959e"/>
        <rect x="338" y="254" width="128" height="12" rx="6" fill="#6d767e"/>
        <rect x="322" y="256" width="18" height="8" rx="4" fill="#5b6167"/>
        <rect x="464" y="256" width="18" height="8" rx="4" fill="#5b6167"/>
        <g id="kLid" opacity="0">
          <ellipse cx="402" cy="252" rx="70" ry="12" fill="#aab4bc"/>
          <rect x="394" y="234" width="16" height="12" rx="5" fill="#454a50"/>
        </g>
      </g>

      <!-- 蒸汽 -->
      <g id="kSteam" class="steam">
        <ellipse class="s1" cx="378" cy="238" rx="14" ry="8" fill="#fff"/>
        <ellipse class="s2" cx="406" cy="242" rx="12" ry="7" fill="#fff"/>
        <ellipse class="s3" cx="430" cy="236" rx="13" ry="8" fill="#fff"/>
      </g>

      <!-- 调味粒子 -->
      <g id="kSeason" opacity="0">
        ${[0,1,2,3,4,5].map(i => `<circle class="sp" style="animation-delay:${i * 0.12}s" cx="${370 + i * 14}" cy="196" r="3.5" fill="${["#e88a5e","#a8c686","#f2c14e","#f26b3a"][i % 4]}"/>`).join("")}
      </g>

      <!-- 砧板 + 食材（切配） -->
      <g id="kBoard">
        <rect x="560" y="282" width="150" height="16" rx="4" fill="#d9a86c"/>
        <rect x="560" y="282" width="150" height="16" rx="4" fill="none" stroke="#b5875a" stroke-width="2"/>
        <g id="kVeg"><rect x="610" y="268" width="34" height="14" rx="7" fill="#e88a5e"/></g>
      </g>

      <!-- 卡通厨师 -->
      <g id="kChef" class="chef chef--idle">
        <g id="kBody">
          <path d="M512 300 v-52 a48 40 0 0 1 96 0 v52 z" fill="#fff"/>
          <path d="M522 300 v-46 a38 32 0 0 1 76 0 v46 z" fill="none"/>
          <path d="M536 300 v-40 q24 -14 48 0 v40 z" fill="#4f6f46"/>
          <rect x="548" y="242" width="24" height="10" rx="4" fill="#f26b3a"/>
          <rect x="530" y="296" width="60" height="8" rx="4" fill="#3f5a38"/>
        </g>
        <g id="kHead" class="head">
          <circle cx="560" cy="150" r="46" fill="#ffd9b8"/>
          <path d="M520 128 q40 -26 80 0 l-4 -14 q-36 -22 -72 0 z" fill="#fff"/>
          <circle cx="532" cy="98" r="18" fill="#fff"/>
          <circle cx="560" cy="88" r="21" fill="#fff"/>
          <circle cx="588" cy="98" r="18" fill="#fff"/>
          <rect x="526" y="112" width="68" height="16" rx="8" fill="#f7f7f7"/>
          <g id="kEyes" class="eyes">
            <circle cx="544" cy="152" r="4.5" fill="#2f3a2b"/>
            <circle cx="576" cy="152" r="4.5" fill="#2f3a2b"/>
          </g>
          <circle cx="532" cy="166" r="7" fill="#ffb3a0" opacity=".7"/>
          <circle cx="588" cy="166" r="7" fill="#ffb3a0" opacity=".7"/>
          <path d="M550 172 q10 8 20 0" stroke="#2f3a2b" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M560 158 q-2 10 0 14" stroke="#e8b04b" stroke-width="0" fill="none"/>
        </g>
        <g id="kArmL" class="arm arm-l">
          <path d="M520 214 q-16 26 -6 52" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/>
          <circle cx="514" cy="268" r="9" fill="#ffd9b8"/>
        </g>
        <g id="kArmR" class="arm arm-r">
          <path d="M600 214 q16 26 6 52" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/>
          <circle cx="606" cy="268" r="9" fill="#ffd9b8"/>
          <!-- 菜刀（切配时显示） -->
          <g id="kKnife" class="tool" opacity="0">
            <rect x="600" y="268" width="10" height="30" rx="4" fill="#c8a06a" transform="rotate(40 605 275)"/>
            <path d="M612 292 l34 -18 q6 8 -2 14 l-26 12 z" fill="#b8c0c8" transform="rotate(40 605 275)"/>
          </g>
          <!-- 锅铲（翻炒时显示） -->
          <g id="kSpatula" class="tool" opacity="0">
            <rect x="602" y="270" width="9" height="46" rx="4" fill="#c8a06a" transform="rotate(-35 606 275)"/>
            <path d="M628 300 h30 a6 6 0 0 1 6 6 v14 a8 8 0 0 1 -8 8 h-24 a8 8 0 0 1 -8 -8 v-14 a6 6 0 0 1 4 -6 z" fill="#8b959e" transform="rotate(-35 606 275)"/>
          </g>
        </g>
      </g>

      <!-- 装盘庆祝 -->
      <g id="kPlateGroup" class="plate-group">
        <ellipse cx="620" cy="300" rx="62" ry="12" fill="#fff"/>
        <ellipse cx="620" cy="297" rx="48" ry="8" fill="#f2ede2"/>
        <g id="kDish" class="dish"></g>
      </g>
      <g id="kStars" class="stars" opacity="0">
        ${[0,1,2].map(i => `<path class="star" style="animation-delay:${i * 0.25}s" transform="translate(${520 + i * 90}, 210) scale(0)" d="M0 -16 L4 -5 L16 -4 L7 4 L10 16 L0 9 L-10 16 L-7 4 L-16 -4 L-4 -5 Z" fill="#ffd166"/>`).join("")}
      </g>
    </svg>`;
    built = true;
  }

  function tiles() {
    let s = "";
    for (let x = 0; x < 800; x += 40) {
      s += `<line x1="${x}" y1="242" x2="${x}" y2="300" stroke="#d8ceb4" stroke-width="2"/>`;
    }
    s += `<line x1="0" y1="271" x2="800" y2="271" stroke="#d8ceb4" stroke-width="2"/>`;
    return s;
  }

  // ---------- 姿态控制 ----------
  function setPose(action) {
    const pose = action === "prep" ? "idle" : action;
    wrap.className = "kitchen-wrap kitchen--" + pose;
    // 道具显隐
    const map = { kKnife: "cutting", kSpatula: "stirfry", kLid: "stew", kSeason: "season" };
    Object.entries(map).forEach(([id, act]) => {
      const el = document.getElementById(id);
      if (el) el.style.opacity = act === pose ? "1" : act === "stew" ? "0" : "0";
    });
    // 火焰档位
    const flame = document.getElementById("kFlame");
    flame.className.baseVal =
      "flame " + (pose === "stirfry" ? "flame--big" : pose === "stew" ? "flame--low" : pose === "cutting" ? "flame--low" : "flame--off");
    // 锅内食物
    document.getElementById("kFood").style.opacity = ["stirfry", "stew", "season"].includes(pose) ? "1" : "0";
  }

  function celebrate(r) {
    const dish = document.getElementById("kDish");
    if (r.img) {
      dish.innerHTML = `<clipPath id="dishClip"><rect x="576" y="252" width="88" height="66" rx="8"/></clipPath>
        <image href="${r.img}" x="576" y="252" width="88" height="66" preserveAspectRatio="xMidYMid slice" clip-path="url(#dishClip)"/>`;
    } else {
      dish.innerHTML = `<text x="620" y="300" font-size="40" text-anchor="middle">${r.emoji || "🍽"}</text>`;
    }
    wrap.classList.add("kitchen--celebrate");
  }

  function play(action, r) {
    if (!built) build();
    if (action === "plate") {
      setPose("idle");
      celebrate(r);
    } else {
      wrap.classList.remove("kitchen--celebrate");
      setPose(action);
    }
  }

  function reset(r) {
    if (!built) build();
    recipe = r;
    wrap.classList.remove("kitchen--celebrate");
    setPose("idle");
  }

  function stop() {
    if (built) {
      wrap.classList.remove("kitchen--celebrate");
      wrap.className = "kitchen-wrap kitchen--idle";
    }
  }

  window.addEventListener("kitchen-step", (e) => {
    const { text, recipe: r } = e.detail;
    play(classifyStep(text), r || recipe);
  });
  window.addEventListener("kitchen-reset", (e) => reset(e.detail.recipe));
  window.addEventListener("kitchen-stop", stop);

  return { classifyStep };
})();
