/* ============================================================
   青雾寻桂顾问 · H5 内嵌智能体（自研规则引擎版）
   架构：意图识别 → 知识库检索 → 护栏检查 → 模板化输出
   四大能力：产品问答 / 种草文案生成 / 个性化推荐 / 趣味互动
   合规护栏：功效兜底 / 投诉转人工 / 竞品话术 / 知识库外不编造
   ============================================================ */

/* ---------- 知识库（与「青雾知识库.md」同源） ---------- */
const KB = {
  product: {
    name: "桂雾冷萃",
    desc: "金黄桂花漂浮于浅青茶汤之上，冷萃 8 小时，茶汤清冽回甘，桂香浮而不腻。入口先是绿茶的清，尾韵是金桂的甜。",
    ingredients: "鲜萃绿茶、金桂蜜、饮用冰水，茶底为冷萃 8 小时的鲜萃绿茶",
    sweetness: "三档可选：不另外加糖 / 微糖（默认）/ 低糖。默认微糖，茶味清爽、桂花香气足；怕甜选无糖也有淡淡桂花香～",
    temp: "冰饮 / 少冰 / 去冰",
    calories: "约 145 kcal / 500ml（按默认微糖测算）",
    price: "以门店实际定价为准哦～可以搭配 9 元新品尝鲜券，券后更划算",
    launch: "9 月 22 日上市，秋季限定，售完即止",
    slogan: "一杯桂雾冷萃，把江南秋天喝进嘴里",
  },
  stores: {
    "杭州": [
      ["湖滨银泰店", "上城区延安路 98 号银泰 in77 B 区 1F", true],
      ["武林路店", "拱墅区武林路 211 号", true],
      ["滨江天街店", "滨江区江汉路 151 号龙湖天街 3F", true],
      ["良渚大屋顶店", "余杭区良渚文化村晓书馆旁", false],
    ],
    "上海": [
      ["安福路店", "徐汇区安福路 132 号", true],
      ["静安嘉里中心店", "静安区南京西路 1515 号 N1-11", true],
      ["五角场合生汇店", "杨浦区翔殷路 1099 号 2F", false],
    ],
    "南京": [
      ["老门东店", "秦淮区剪子巷 54 号", true],
      ["德基广场店", "玄武区中山路 18 号德基广场 7F", false],
    ],
  },
  coupon: "9 元新品立减券：每个微信账号限领 1 张，领取后 7 天内有效，限到店自提或小程序下单使用。生成打卡海报并分享，还能再解锁一张满 20 减 3 通用券哦～",
  classic: "青雾经典系列：江南雪青（茉莉绿茶底）、竹雾乌龙（乌龙茶底）、白露青提（青提绿茶底）",
  pairing: "推荐搭配桂花糕，桂花香呼应，经典组合～",
  quiz: [
    ["桂花最常见的颜色是？", "金黄色"],
    ["桂雾冷萃的茶底是什么茶？", "绿茶"],
    ["桂雾冷萃冷萃了多少小时？", "8 小时"],
    ["青雾品牌主打什么风味？", "江南草本风味"],
    ["「秋日第一杯桂花冷萃」里\"第一杯\"指什么？", "秋天的第一杯桂花风味饮品，仪式感表达"],
  ],
};

/* ---------- 合规护栏话术 ---------- */
const GUARD = {
  efficacy: "这款饮品主要是风味和口感体验哦，不具备保健功效，大家根据自己的口味喜好选择就好～",
  complaint: "非常抱歉给你带来不好的体验，这边帮你转接人工客服详细处理哦～（工作时间 9:00-21:00，公众号「青雾茶饮」菜单栏「联系我们」）",
  competitor: "不同品牌各有特色哦，我们主打江南草本风味，欢迎你尝尝看～",
  foodSafety: "我们的产品都是严格按照食品安全标准制作的，原料都经过质检，可以放心饮用哦～如果有具体疑问可以帮你转接人工。",
  human: "好的～这就为你转接人工客服。工作日 9:00-21:00 在线，也可以在公众号「青雾茶饮」菜单栏「联系我们」找到我们。",
  unknownCity: "这个城市的门店信息暂未公布哦，可以关注「青雾茶饮」官方账号，新城市上线第一时间通知你～目前我们在杭州、上海、南京都有门店。",
  noInfo: "这个信息暂未公布哦，可以关注青雾官方账号第一时间获取～",
};

/* ---------- 三种种草文案模板（多版本随机） ---------- */
const TPL = {
  short: [
`🍂秋日第一杯桂花冷萃终于喝到了！
浅绿茶汤飘着金桂，一口清爽不甜腻
江南的秋天被锁进杯子里了✨
#桂雾冷萃 #秋日饮品 #新式茶饮 #桂花限定`,
`🍵打卡青雾·桂雾冷萃～
冷萃8小时的绿茶底，尾韵是桂花的甜
秋日限定，趁它还没下架冲！
#秋日第一杯桂花冷萃 #桂花冷萃 #奶茶打卡 #秋日限定`,
`🌙今天的快乐是桂雾冷萃给的
透明的杯子里装着整个江南的秋天
配一块桂花糕，松弛感拉满🍂
#桂雾冷萃 #下午茶打卡 #新式茶饮 #秋天的第一杯`,
  ],
  vibes: [
`降温之后，这座城市突然就有了秋天的样子。
路过青雾的时候闻到一缕桂花香，然后就走不动了——
桂雾冷萃的茶汤是很干净的浅青色，金桂浮在上面，像把九月的杭州封存进了杯子里。
冷萃的绿茶很清，不涩，咽下去之后桂花的甜才慢慢浮上来，很轻，不腻。
秋天大概就是这样，不需要很浓烈，淡淡的就刚刚好。
🍂 如果你也路过，替我喝一口秋天。
#桂雾冷萃 #秋日限定 #江南秋天 #生活里的小确幸`,
`加班到八点，走出写字楼的时候风已经凉了。
买了今年第一杯桂雾冷萃。捧在手里，桂花香混着茶香，突然觉得这个秋天也没那么难熬。
茶是冷萃8小时的鲜萃绿茶，很清冽，桂花的甜是若隐若现的那种——像小时候外婆院子里那棵桂花树，路过才闻得到，凑近了反而找不到。
有些季节限定，限定的是味道，收藏的是心情。
🌙 愿你的秋天，也有一杯恰到好处的甜。
#桂雾冷萃 #秋日治愈 #新式茶饮 #桂花季`,
  ],
  review: [
`【桂雾冷萃 · 真实测评】🍵
📍口味：鲜萃绿茶底+金桂蜜，茶味在前桂花香在后，层次分明
🍯甜度：默认微糖，怕甜的选无糖也有桂花香，甜度党选低糖桂花味更浓
🔥热量：约145kcal/500ml，在奶茶里算清爽挂的
📷颜值：浅青茶汤+金桂漂浮，随手拍出片，配桂花糕绝了
💰性价比：可叠加9元尝鲜券，尝鲜不心疼
👉 推荐人群：喜欢清淡茶感、不爱齁甜、注重氛围感的姐妹
#桂雾冷萃 #奶茶测评 #新式茶饮 #秋日限定`,
  ],
};

/* ---------- 会话状态 ---------- */
const state = { missCount: 0, quizOn: false, quizIdx: 0, quizScore: 0, lastCopy: "" };

/* ---------- 工具 ---------- */
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function hasAny(t, words){ return words.some(w => t.includes(w)); }

function pushMsg(text, who, badge){
  const body = document.getElementById("chatBody");
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.innerHTML = (badge && who==="bot" ? `<span class="mbadge">${badge}</span>` : "") + text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}
function botSay(text, badge){ pushMsg(text, "bot", badge); }
function trackSafe(name, props){ try{ if(typeof track==="function") track(name, props||{}); }catch(e){} }

function openChat(){
  document.getElementById("chat").classList.add("open");
  document.getElementById("chatLabel").classList.remove("show");
  if(!document.getElementById("chatBody").children.length){
    botSay("🍂 你好呀，我是青雾寻桂顾问～\n桂雾冷萃 9 月 22 日上市，一杯把江南的秋天喝进嘴里。\n产品咨询、门店查询、写种草文案、玩桂花问答，都可以找我！", "智能体");
    renderChips();
  }
  trackSafe("agent_chat", {intent:"open"});
}
function closeChat(){ document.getElementById("chat").classList.remove("open"); }
function renderChips(){
  document.getElementById("chatChips").innerHTML =
    ["桂雾冷萃甜不甜？","我在杭州，哪些门店上新了？","帮我写篇打卡文案","陪我玩个问答"].map(
      c=>`<div class="chip" onclick="chatFromChip(this)">${c}</div>`).join("");
}
function chatFromChip(el){ sendText(el.textContent); }

/* 首次访问 3 秒后弹出提示标签，引导发现智能体 */
setTimeout(()=>{
  const label = document.getElementById("chatLabel");
  if(label && !document.getElementById("chat").classList.contains("open")){
    label.classList.add("show");
    setTimeout(()=>label.classList.remove("show"), 5000);
  }
}, 3000);

function sendChat(){
  const inp = document.getElementById("chatInput");
  if(inp.value.trim()){ sendText(inp.value.trim()); inp.value=""; }
}
function sendText(t){
  pushMsg(t, "user");
  setTimeout(()=>{ botSay(understand(t), "智能体"); }, 350);
  trackSafe("agent_chat", {intent: classify(t)});
}

/* ---------- 意图分类（供埋点） ---------- */
function classify(t){
  if(hasAny(t,["减肥","养生","清火","保健","养颜","治病","美容","功效"])) return "guard_efficacy";
  if(hasAny(t,["投诉","退款","坏肚子","拉肚子","变质","有问题","差评"])) return "guard_complaint";
  if(hasAny(t,["喜茶","奈雪","蜜雪","瑞幸","茶百道","一点点","霸王茶姬","库迪","coco"])) return "guard_competitor";
  if(hasAny(t,["人工","真人"])) return "to_human";
  if(hasAny(t,["文案","小红书","笔记","写"])) return "copy_gen";
  if(hasAny(t,["门店","店","地址","营业"])) return "store_query";
  if(hasAny(t,["券","优惠","活动"])) return "coupon";
  if(hasAny(t,["甜","糖"])) return "product_sweet";
  if(hasAny(t,["热量","卡","胖"])) return "product_cal";
  if(hasAny(t,["配料","原料","成分","茶底"])) return "product_ing";
  if(hasAny(t,["多少钱","价格","贵"])) return "product_price";
  if(hasAny(t,["上市","什么时候","发售","还有吗"])) return "product_launch";
  if(hasAny(t,["推荐","怎么点","怕苦","怕甜"])) return "recommend";
  if(hasAny(t,["游戏","问答","玩"])) return "quiz";
  if(hasAny(t,["你好","hi","hello","嗨"])) return "greet";
  return "other";
}

/* ---------- 核心：理解与回复 ---------- */
function understand(raw){
  const t = raw.toLowerCase().replace(/\s/g,"");

  /* 答题模式优先（问答游戏中） */
  if(state.quizOn){
    const [q, a] = KB.quiz[state.quizIdx];
    if(t.includes(a.replace(" 小时","").replace("小时","").split("")[0]) || t.includes(a) || raw.includes(a)){
      state.quizScore++;
      const right = state.quizScore >= 3;
      state.quizIdx++;
      if(state.quizIdx >= KB.quiz.length){
        state.quizOn = false;
        const fin = `🌿 问答结束！本轮你答对 ${state.quizScore} 题。` +
          (right ? `太棒了，解锁隐藏福利！到店出示口令「寻桂达人」，可再享满 20 减 3 优惠～\n（口令有效期：活动期间，即 10 月 12 日前）` : `差一点点～答对 3 题才能解锁隐藏优惠券哦，回复「再玩一次」重新挑战！`);
        state.quizScore = 0; state.quizIdx = 0;
        return fin;
      }
      return `✅ 答对了！当前得分 ${state.quizScore}/3\n\n下一题：${KB.quiz[state.quizIdx][0]}`;
    } else {
      state.quizIdx++;
      if(state.quizIdx >= KB.quiz.length){
        state.quizOn = false;
        state.quizScore = 0; state.quizIdx = 0;
        return `🌿 没关系～本轮结束，答对 ${state.quizScore} 题。想解锁隐藏优惠券就回复「再玩一次」重新挑战！`;
      }
      return `🙈 不是哦～正确答案：${a}\n\n别灰心，继续：${KB.quiz[state.quizIdx][0]}`;
    }
  }

  /* 1. 合规护栏（最高优先级） */
  if(hasAny(t,["再玩一次","再来一次"]) && state.lastCopy==="quiz") { return startQuiz(); }
  if(hasAny(t,["减肥","瘦身","瘦"])) return GUARD.efficacy;
  if(hasAny(t,["养生","清火","降火","保健","养颜","治病","美容","功效","去火"])) return GUARD.efficacy;
  if(hasAny(t,["投诉","退款","退货","坏肚子","拉肚子","变质","食品质量","有问题"])) return GUARD.complaint;
  if(hasAny(t,["人工","真人客服"])) return GUARD.human;
  if(hasAny(t,["喜茶","奈雪","蜜雪","瑞幸","茶百道","一点点","霸王茶姬","库迪","coco"])) return GUARD.competitor;
  if(hasAny(t,["安全吗","干净吗","卫生"])) return GUARD.foodSafety;

  /* 2. 问候 */
  if(hasAny(t,["你好","您好","hi","hello","嗨","在吗"])) return "你好呀～我是青雾寻桂顾问 🍂\n" + KB.product.slogan + "\n想了解桂雾冷萃的口味、查门店、写文案还是玩问答？";

  /* 3. 文案生成 */
  if(hasAny(t,["文案","小红书","笔记","帮我写","写一篇","写个","写首"])){
    state.lastCopy = "copy";
    if(hasAny(t,["走心","氛围","情绪","深度"])) return "「走心氛围感版」来了～\n\n" + pick(TPL.vibes);
    if(hasAny(t,["测评","评价","客观"])) return "「测评向版」来了～\n\n" + pick(TPL.review);
    if(hasAny(t,["打卡","简短","随手","日常"]) || state.lastAskedCopy){
      return "「简短打卡版」来了～\n\n" + pick(TPL.short) + "\n\n还想要「走心氛围感版」或「测评向版」吗？直接说～";
    }
    state.lastAskedCopy = true;
    return "好呀～我准备了三种风格：\n1️⃣ 简短打卡版（随手发）\n2️⃣ 走心氛围感版（深度种草）\n3️⃣ 测评向版（客观评价）\n想要哪种？回复「打卡」「氛围」或「测评」即可～";
  }
  if(hasAny(t,["打卡"]) && state.lastCopy==="copy") { state.lastCopy="copy"; return "「简短打卡版」来了～\n\n" + pick(TPL.short); }
  if(hasAny(t,["氛围","走心"]) && state.lastCopy==="copy") return "「走心氛围感版」来了～\n\n" + pick(TPL.vibes);
  if(hasAny(t,["测评"]) && state.lastCopy==="copy") return "「测评向版」来了～\n\n" + pick(TPL.review);

  /* 4. 门店查询 */
  if(hasAny(t,["门店","门店地址","哪家店","地址","营业","上新","哪里买","哪里有","门店查询","在哪里买"])){
    const city = ["杭州","上海","南京"].find(c => t.includes(c));
    if(!city){
      const otherCity = ["北京","深圳","广州","成都","武汉","西安","重庆","苏州"].find(c => t.includes(c));
      if(otherCity) return GUARD.unknownCity;
      return "我们在杭州、上海、南京都有门店哦～告诉我你在哪个城市，我帮你查离你最近的门店和上新状态！";
    }
    let out = `📍${city}的门店情况来啦：\n`;
    KB.stores[city].forEach(([n,a,on])=>{
      out += `\n【${on?"🟢 已上线":"🟡 即将上线"}】${n}\n${a}\n营业时间：10:00-22:00`;
    });
    out += `\n\n「已上线」门店现在就能喝到桂雾冷萃啦，可以先领 9 元尝鲜券哦～`;
    return out;
  }

  /* 5. 活动咨询 */
  if(hasAny(t,["券","优惠券","优惠","活动","领","打折","便宜"])) return "🎟️ " + KB.coupon + "\n\n点击底部「优惠券」标签就能领取哦～";
  if(hasAny(t,["海报","上传","滤镜"])) return "做专属打卡海报超简单：点底部「AI海报」标签 → 上传一张照片 → 选滤镜 → 保存！分享出去还能解锁满 20 减 3 通用券～";

  /* 6. 产品问答 */
  if(hasAny(t,["甜","糖","腻"])) return "🍯 " + KB.product.sweetness;
  if(hasAny(t,["热量","卡路里","kcal","胖"])) return "🔥 " + KB.product.calories + "\n想控糖的话选「不另外加糖」或「微糖」都可以～（温馨提示：饮品是风味体验，不具备保健功效哦）";
  if(hasAny(t,["配料","原料","成分","茶底","什么东西"])) return "🍵 " + KB.product.ingredients + "\n可选：温度" + KB.product.temp;
  if(hasAny(t,["多少钱","价格","贵不贵","贵吗"])) return "💰 " + KB.product.price;
  if(hasAny(t,["上市","发售","什么时候卖","还有吗","下架","限定"])) return "🍂 " + KB.product.launch + "\n趁秋天的这阵桂花香还在，快去尝尝吧～";
  if(hasAny(t,["什么味道","好喝","口感","味道","怎么样"])) return "一口就是江南的秋天：\n" + KB.product.desc;

  /* 7. 个性化推荐 */
  if(hasAny(t,["推荐","怎么点","怕苦","怕涩","怕甜","选择困难","搭配","配什么","小食"])) 
    return "🍵 帮你点单：\n· 怕甜 → 「不另外加糖」，桂花香依然在\n· 想桂花味浓 → 「低糖」，桂花蜜随甜度调整\n· 怕负担 → 热量约 145kcal，选低糖最清爽\n· 加分搭配 → 桂花糕，桂花香呼应，经典组合\n\n经典系列也欢迎试试：" + KB.classic;

  /* 8. 趣味互动 */
  if(hasAny(t,["游戏","问答","玩","无聊","互动"])) { state.lastCopy="quiz"; return startQuiz(); }

  /* 9. 兜底：连续未匹配 → 转人工 */
  state.missCount++;
  if(state.missCount >= 2){
    state.missCount = 0;
    return "这个问题我暂时没听懂呢 😥 为免耽误你，帮你转接人工客服哦～（工作日 9:00-21:00 在线）\n\n也可以换个问法试试，比如：\n· 桂雾冷萃甜不甜？\n· 我在杭州，哪里能买到？";
  }
  return "这个我有点没听懂 🤔 你可以这样问我：\n· 产品口味 / 热量 / 配料\n· 城市 + 门店查询\n· 帮我写篇小红书文案\n· 陪我玩个问答赢优惠券";
}

function startQuiz(){
  state.quizOn = true; state.quizIdx = 0; state.quizScore = 0;
  return "🌿 秋日桂花小问答开始！答对 3 题解锁隐藏优惠券～\n\n第 1 题：" + KB.quiz[0][0];
}
