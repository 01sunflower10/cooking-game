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
    if (/炒|煎|爆|煸|炸|烤|翻/.test(text)) return "stirfry"; // 烹饪动作优先于配料描述
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
      <!-- 天花板与墙 -->
      <rect x="0" y="0" width="800" height="26" fill="#eadbc2"/>
      <rect x="0" y="26" width="800" height="274" fill="#f7ead4"/>
      <rect x="0" y="26" width="800" height="4" fill="#e3d2b4"/>

      <!-- 窗户 -->
      <g>
        <rect x="46" y="52" width="164" height="126" rx="8" fill="#aedcf0"/>
        <circle cx="92" cy="86" r="13" fill="#ffe28a"/>
        <path d="M150 92 q10 -8 20 0 q8 -6 16 2" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
        <path d="M58 158 q24 -16 48 0 t48 0 t48 0" stroke="#8fc7a8" stroke-width="6" fill="none"/>
        <rect x="46" y="52" width="164" height="126" rx="8" fill="none" stroke="#fdfaf2" stroke-width="9"/>
        <line x1="128" y1="52" x2="128" y2="178" stroke="#fdfaf2" stroke-width="6"/>
        <line x1="46" y1="115" x2="210" y2="115" stroke="#fdfaf2" stroke-width="6"/>
        <rect x="36" y="40" width="184" height="9" rx="4" fill="#c8a06a"/>
        <path d="M58 49 l-7 56 q15 11 28 0 l5 -56 z" fill="#f2a65e" opacity=".9"/>
        <path d="M198 49 l7 56 q-15 11 -28 0 l-5 -56 z" fill="#f2a65e" opacity=".9"/>
        <!-- 窗台小盆栽 -->
        <rect x="180" y="150" width="18" height="16" rx="3" fill="#d97b4f"/>
        <path d="M189 150 q-10 -14 -2 -22 q10 6 2 22 M189 150 q10 -12 4 -20" stroke="#7ba05b" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>

      <!-- 墙面装饰画 -->
      <g>
        <rect x="248" y="62" width="58" height="72" rx="4" fill="#fdfaf2" stroke="#c8a06a" stroke-width="4"/>
        <circle cx="277" cy="94" r="16" fill="none" stroke="#f26b3a" stroke-width="4"/>
        <path d="M266 104 q11 8 22 0" stroke="#f26b3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>

      <!-- 抽油烟机（正对锅，烟囱直连天花板） -->
      <g>
        <rect x="374" y="26" width="56" height="42" fill="#aeb6be"/>
        <rect x="366" y="60" width="72" height="8" fill="#9aa2aa"/>
        <path d="M312 68 h180 l-16 44 h-148 z" fill="#c3cad1"/>
        <rect x="298" y="112" width="208" height="10" rx="5" fill="#9aa2aa"/>
        <circle cx="330" cy="98" r="4.5" fill="#f2b04e"/>
        <circle cx="470" cy="98" r="4.5" fill="#f2b04e"/>
        <rect x="386" y="88" width="32" height="10" rx="5" fill="#e8edf1"/>
      </g>

      <!-- 置物架 -->
      <g>
        <rect x="580" y="66" width="170" height="8" rx="4" fill="#c8a06a"/>
        <rect x="596" y="32" width="26" height="34" rx="5" fill="#e8b04b"/>
        <rect x="634" y="26" width="30" height="40" rx="5" fill="#a8c686"/>
        <rect x="676" y="36" width="24" height="30" rx="5" fill="#e88a5e"/>
        <circle cx="726" cy="50" r="14" fill="#f26b3a" opacity=".85"/>
      </g>

      <!-- 灶台后挡水板瓷砖 -->
      <g>
        <rect x="268" y="150" width="268" height="146" fill="#f2ead9"/>
        ${(() => { let s = ""; for (let y = 150; y < 296; y += 24) { s += `<line x1="268" y1="${y}" x2="536" y2="${y}" stroke="#e0d5bd" stroke-width="2"/>`; } for (let x = 268; x <= 536; x += 34) { s += `<line x1="${x}" y1="150" x2="${x}" y2="296" stroke="#e0d5bd" stroke-width="2"/>`; } return s; })()}
        <rect x="268" y="150" width="268" height="146" fill="none" stroke="#e3d2b4" stroke-width="2"/>
      </g>

      <!-- 橱柜（台面+柜门） -->
      <g>
        <rect x="0" y="296" width="800" height="14" fill="#c2925f"/>
        <rect x="0" y="296" width="800" height="5" fill="#dcae76"/>
        <rect x="0" y="310" width="800" height="70" fill="#9a6f45"/>
        <rect x="30" y="322" width="160" height="58" rx="6" fill="#8a6238"/>
        <rect x="220" y="322" width="160" height="58" rx="6" fill="#8a6238"/>
        <rect x="410" y="322" width="160" height="58" rx="6" fill="#8a6238"/>
        <rect x="600" y="322" width="170" height="58" rx="6" fill="#8a6238"/>
        <rect x="96" y="346" width="26" height="6" rx="3" fill="#d9b56e"/>
        <rect x="286" y="346" width="26" height="6" rx="3" fill="#d9b56e"/>
        <rect x="476" y="346" width="26" height="6" rx="3" fill="#d9b56e"/>
        <rect x="668" y="346" width="26" height="6" rx="3" fill="#d9b56e"/>
      </g>

      <!-- 灶台面 -->
      <rect x="304" y="282" width="200" height="16" rx="8" fill="#4a4f55"/>
      <ellipse cx="404" cy="290" rx="78" ry="9" fill="#3b3f44"/>

      <!-- 锅底投影 -->
      <ellipse cx="404" cy="292" rx="72" ry="7" fill="rgba(0,0,0,0.18)"/>

      <!-- 火焰 -->
      <g id="kFlame" class="flame flame--off">
        <path class="f1" d="M382 304 q7 -26 22 -30 q-5 16 9 23 q12 -9 16 -21 q9 19 -2 34 z" fill="#ff9d3c"/>
        <path class="f2" d="M391 304 q6 -15 14 -17 q-2 9 6 14 q7 -5 9 -12 q6 11 -2 19 z" fill="#ffd166"/>
      </g>

      <!-- 调味粒子 -->
      <g id="kSeason" opacity="0">
        ${[0, 1, 2, 3, 4, 5].map(i => `<circle class="sp" style="animation-delay:${i * 0.12}s" cx="${368 + i * 15}" cy="190" r="3.5" fill="${["#e88a5e", "#a8c686", "#f2c14e", "#f26b3a"][i % 4]}"/>`).join("")}
      </g>

      <!-- 锅 -->
      <g id="kPot">
        <g id="kFood" opacity="0">
          <circle cx="388" cy="256" r="7" fill="#e88a5e"/>
          <circle cx="410" cy="260" r="6" fill="#a8c686"/>
          <circle cx="424" cy="254" r="6" fill="#f2c14e"/>
        </g>
        <path d="M348 252 h112 a11 11 0 0 1 11 11 v18 a13 13 0 0 1 -13 13 h-108 a13 13 0 0 1 -13 -13 v-18 a11 11 0 0 1 11 -11 z" fill="#8b959e"/>
        <path d="M356 260 q48 -8 96 0" stroke="#a7b1b9" stroke-width="4" fill="none"/>
        <rect x="332" y="248" width="140" height="12" rx="6" fill="#6d767e"/>
        <path d="M330 250 q-14 2 -12 12 M478 250 q14 2 12 12" stroke="#5b6167" stroke-width="8" fill="none" stroke-linecap="round"/>
        <g id="kLid" opacity="0">
          <ellipse cx="404" cy="246" rx="74" ry="12" fill="#aab4bc"/>
          <ellipse cx="404" cy="243" rx="74" ry="10" fill="#c3cad1"/>
          <rect x="396" y="228" width="16" height="12" rx="5" fill="#454a50"/>
        </g>
      </g>

      <!-- 蒸汽 -->
      <g id="kSteam" class="steam">
        <ellipse class="s1" cx="378" cy="230" rx="15" ry="9" fill="#fff"/>
        <ellipse class="s2" cx="408" cy="236" rx="13" ry="8" fill="#fff"/>
        <ellipse class="s3" cx="432" cy="228" rx="14" ry="9" fill="#fff"/>
      </g>

      <!-- 砧板 + 食材 -->
      <g id="kBoard">
        <ellipse cx="636" cy="298" rx="80" ry="6" fill="rgba(0,0,0,0.08)"/>
        <rect x="558" y="282" width="156" height="14" rx="4" fill="#d9a86c"/>
        <rect x="558" y="282" width="156" height="14" rx="4" fill="none" stroke="#b5875a" stroke-width="2"/>
        <g id="kVeg"><rect x="612" y="266" width="34" height="16" rx="7" fill="#e88a5e"/><rect x="604" y="274" width="10" height="8" rx="4" fill="#a8c686"/></g>
      </g>

      <!-- 调味瓶 -->
      <g>
        <rect x="286" y="270" width="16" height="18" rx="4" fill="#e8b04b"/>
        <rect x="290" y="264" width="8" height="8" rx="2" fill="#9a6f45"/>
        <rect x="256" y="272" width="16" height="16" rx="4" fill="#a8c686"/>
        <rect x="260" y="266" width="8" height="8" rx="2" fill="#9a6f45"/>
      </g>

      <!-- 卡通厨师 -->
      <g id="kChef" class="chef chef--idle">
        <g id="kBody">
          <!-- 身体（白上衣+绿围裙） -->
          <path d="M504 300 v-58 a56 46 0 0 1 112 0 v58 z" fill="#fdfaf2"/>
          <path d="M530 300 v-38 q30 -16 60 0 v38 z" fill="#4f6f46"/>
          <path d="M546 246 q14 -8 28 0 M546 246 v54 M574 246 v54" stroke="#3f5a38" stroke-width="3" fill="none"/>
          <rect x="548" y="238" width="24" height="10" rx="4" fill="#f26b3a"/>
        </g>
        <!-- 脖子 -->
        <rect x="546" y="192" width="28" height="16" fill="#f4c79e"/>
        <g id="kHead" class="head">
          <circle cx="510" cy="156" r="9" fill="#f4c79e"/>
          <circle cx="610" cy="156" r="9" fill="#f4c79e"/>
          <circle cx="560" cy="150" r="50" fill="#ffd9b8"/>
          <!-- 厨师帽 -->
          <circle cx="530" cy="92" r="20" fill="#fff"/>
          <circle cx="560" cy="80" r="24" fill="#fff"/>
          <circle cx="590" cy="92" r="20" fill="#fff"/>
          <rect x="512" y="98" width="96" height="20" rx="10" fill="#fdfaf2"/>
          <rect x="512" y="112" width="96" height="6" rx="3" fill="#e8dfc8"/>
          <!-- 五官 -->
          <g id="kEyes" class="eyes">
            <circle cx="541" cy="150" r="5" fill="#2f3a2b"/>
            <circle cx="579" cy="150" r="5" fill="#2f3a2b"/>
            <circle cx="543" cy="148" r="1.6" fill="#fff"/>
            <circle cx="581" cy="148" r="1.6" fill="#fff"/>
          </g>
          <path d="M533 138 q8 -6 15 -2 M572 136 q8 -4 15 2" stroke="#2f3a2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="528" cy="168" r="8" fill="#ffb3a0" opacity=".75"/>
          <circle cx="592" cy="168" r="8" fill="#ffb3a0" opacity=".75"/>
          <circle cx="560" cy="164" r="3.5" fill="#f4b26e"/>
          <path d="M550 174 q10 9 20 0" stroke="#2f3a2b" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
        <!-- 左臂（伸向锅） -->
        <g id="kArmL" class="arm arm-l">
          <path d="M512 226 q-24 18 -34 38" stroke="#ffd9b8" stroke-width="15" fill="none" stroke-linecap="round"/>
          <path d="M508 228 q-10 8 -16 18" stroke="#fdfaf2" stroke-width="21" fill="none" stroke-linecap="round"/>
          <circle cx="478" cy="264" r="9" fill="#ffd9b8"/>
        </g>
        <!-- 右臂（持工具） -->
        <g id="kArmR" class="arm arm-r">
          <path d="M608 226 q24 18 34 38" stroke="#ffd9b8" stroke-width="15" fill="none" stroke-linecap="round"/>
          <path d="M612 228 q10 8 16 18" stroke="#fdfaf2" stroke-width="21" fill="none" stroke-linecap="round"/>
          <circle cx="642" cy="264" r="9" fill="#ffd9b8"/>
          <g id="kKnife" class="tool" opacity="0">
            <rect x="624" y="250" width="12" height="22" rx="4" fill="#c8a06a"/>
            <path d="M622 270 h16 v8 q0 14 -8 20 q-8 -6 -8 -20 z" fill="#8b959e" stroke="#6d767e" stroke-width="1.5"/>
          </g>
          <g id="kSpatula" class="tool" opacity="0">
            <rect x="638" y="268" width="9" height="46" rx="4" fill="#c8a06a" transform="rotate(-35 642 273)"/>
            <path d="M664 298 h30 a6 6 0 0 1 6 6 v14 a8 8 0 0 1 -8 8 h-24 a8 8 0 0 1 -8 -8 v-14 a6 6 0 0 1 4 -6 z" fill="#8b959e" transform="rotate(-35 642 273)"/>
          </g>
        </g>
      </g>

      <!-- 装盘庆祝（台面左侧空位） -->
      <g id="kPlateGroup" class="plate-group">
        <ellipse cx="230" cy="292" rx="60" ry="11" fill="#fff"/>
        <ellipse cx="230" cy="289" rx="46" ry="7" fill="#f2ede2"/>
        <g id="kDish" class="dish"></g>
      </g>
      <g id="kStars" class="stars" opacity="0">
        ${[0, 1, 2].map(i => `<path class="star" style="animation-delay:${i * 0.25}s" transform="translate(${150 + i * 85}, 200) scale(0)" d="M0 -16 L4 -5 L16 -4 L7 4 L10 16 L0 9 L-10 16 L-7 4 L-16 -4 L-4 -5 Z" fill="#ffd166"/>`).join("")}
      </g>
    </svg>`;
    built = true;
  }

  function tiles() { return ""; }

  // ---------- 姿态控制 ----------
  function setPose(action) {
    const pose = action === "prep" ? "idle" : action;
    wrap.className = "kitchen-wrap kitchen--" + pose;
    const map = { kKnife: "cutting", kSpatula: "stirfry", kLid: "stew" };
    Object.entries(map).forEach(([id, act]) => {
      const el = document.getElementById(id);
      if (el) el.style.opacity = act === pose ? "1" : "0";
    });
    document.getElementById("kSeason").style.opacity = pose === "season" ? "1" : "0";
    const flame = document.getElementById("kFlame");
    flame.className.baseVal =
      "flame " + (pose === "stirfry" ? "flame--big" : pose === "stew" || pose === "cutting" ? "flame--low" : "flame--off");
    document.getElementById("kFood").style.opacity = ["stirfry", "stew", "season"].includes(pose) ? "1" : "0";
  }

  function celebrate(r) {
    const dish = document.getElementById("kDish");
    if (r.img) {
      dish.innerHTML = `<clipPath id="dishClip"><rect x="192" y="238" width="76" height="52" rx="6"/></clipPath>
        <image href="${r.img}" x="192" y="238" width="76" height="52" preserveAspectRatio="xMidYMid slice" clip-path="url(#dishClip)"/>`;
    } else {
      dish.innerHTML = `<text x="230" y="290" font-size="36" text-anchor="middle">${r.emoji || "🍽"}</text>`;
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
