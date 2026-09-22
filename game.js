(function () {
  "use strict";

  const SAVE_KEY = "taixuan-code-saga-save-v1";

  const PATHS = {
    ds: {
      key: "ds",
      course: "data",
      glyph: "阵",
      name: "阵修 · 数据结构",
      book: "万象图经",
      color: "#8c9df0",
      stats: { soul: 9, body: 6, insight: 6, fate: 1 },
      intro: "图、树、栈与队列，皆可为阵。以拓扑定天雷，以查找锁乾坤。",
      skill: { name: "拓扑引雷阵", cost: 12 }
    },
    os: {
      key: "os",
      course: "os",
      glyph: "剑",
      name: "剑修 · 操作系统",
      book: "九霄心典",
      color: "#e8b96c",
      stats: { soul: 6, body: 6, insight: 8, fate: 2 },
      intro: "并发分神，调度万法。破死锁，御进程，一念之间千剑齐出。",
      skill: { name: "并发分神剑", cost: 12 }
    },
    net: {
      key: "net",
      course: "net",
      glyph: "符",
      name: "符修 · 计算机网络",
      book: "玄网符箓",
      color: "#67c9d5",
      stats: { soul: 7, body: 5, insight: 7, fate: 3 },
      intro: "七层符箓，路由万里。三握成约，一问即达，以符篆签下天罗地网。",
      skill: { name: "三层封禁符", cost: 12 }
    },
    arch: {
      key: "arch",
      course: "arch",
      glyph: "器",
      name: "器修 · 计算机组成原理",
      book: "天工机枢",
      color: "#e98c69",
      stats: { soul: 5, body: 9, insight: 6, fate: 2 },
      intro: "五脏六腑皆可炼作法宝。流水线、Cache、总线，以身作器，力破万法。",
      skill: { name: "流水线千机臂", cost: 12 }
    }
  };

  const COURSES = {
    data: {
      name: "数据结构与算法",
      short: "数据结构",
      book: "万象图经",
      color: "#8c9df0",
      glyph: "阵",
      concept: "栈与队列、树与图、排序、查找与哈希"
    },
    os: {
      name: "操作系统",
      short: "操作系统",
      book: "九霄心典",
      color: "#e8b96c",
      glyph: "剑",
      concept: "进程与线程、调度、同步互斥、死锁与虚拟内存"
    },
    net: {
      name: "计算机网络",
      short: "计算机网络",
      book: "玄网符箓",
      color: "#67c9d5",
      glyph: "符",
      concept: "分层协议、物理链路、IP路由、TCP与UDP"
    },
    arch: {
      name: "计算机组成原理",
      short: "组成原理",
      book: "天工机枢",
      color: "#e98c69",
      glyph: "器",
      concept: "CPU、存储系统、指令流水线、总线与I/O"
    }
  };

  const REALMS = [
    { name: "凡俗", min: 0, line: "身无灵根，只得仰望云端。" },
    { name: "炼气", min: 28, line: "一缕灵气入体，自此超凡。" },
    { name: "筑基", min: 88, line: "道基初成，气脉周流不息。" },
    { name: "金丹", min: 210, line: "一粒金丹吞入腹，我命由我不由天。" },
    { name: "元婴", min: 420, line: "元婴出窍，俯瞰山河万里。" },
    { name: "化神", min: 760, line: "神念化物，法则俯首。" },
    { name: "合道", min: 1300, line: "身与道合，万象皆代码。" }
  ];

  const CHAPTERS = [
    { id: 0, title: "序章 · 山门之外", short: "山门之外", objective: "藏经阁异动，去寻四部天书。" },
    { id: 1, title: "第一章 · 入门试", short: "入门试", objective: "通过照心三问，击退阁中栈灵。" },
    { id: 2, title: "第二章 · 黑雾村", short: "黑雾村", objective: "查清死锁之雾，救出被困村民。" },
    { id: 3, title: "第三章 · 书院大比", short: "书院大比", objective: "连胜三场，让四脉天骄记住你的名字。" },
    { id: 4, title: "第四章 · 万魔洞", short: "万魔洞", objective: "穿过心魔网，直面篡改者。" },
    { id: 5, title: "第五章 · 补天", short: "补天", objective: "在天道源代码前，写下最后的抉择。" }
  ];

  const SPEAKERS = {
    narrator: { name: "旁白", role: "" },
    protag: { name: "林砚", role: "天机书院 · 外门弟子" },
    shen: { name: "沈青梧", role: "剑峰首席" },
    lu: { name: "陆重楼", role: "阵阁首席" },
    su: { name: "苏流萤", role: "符海弟子" },
    mo: { name: "墨九渊", role: "器窟师叔" },
    elder: { name: "照心长老", role: "考核使" },
    rival: { name: "周伏波", role: "外门第一" },
    demon: { name: "栈灵", role: "被魔气侵蚀的藏书" },
    lock: { name: "锁灵童", role: "死锁魔雾的化身" },
    thief: { name: "白无咎", role: "窃天者" }
  };

  const CHARACTERS = {
    shen: { name: "沈青梧", title: "剑峰首席大师姐", glyph: "沈", color: "#e8b96c", desc: "冷面热心，剑道第一。" },
    lu: { name: "陆重楼", title: "阵阁首席懒鬼", glyph: "陆", color: "#8c9df0", desc: "万事不争，阵道通神。" },
    su: { name: "苏流萤", title: "符海小师妹", glyph: "苏", color: "#67c9d5", desc: "机灵多话，消息最灵。" },
    mo: { name: "墨九渊", title: "器窟师叔", glyph: "墨", color: "#e98c69", desc: "沉默寡言，重器无锋。" }
  };

  const STORY = {
    prologue: {
      id: "prologue",
      chapter: 0,
      location: "青峰 · 三千石阶",
      scene: "mountain",
      speaker: "narrator",
      title: "山门之外",
      text: "天机书院悬于青峰之巅，传说山腹中封着天道最初的一行源代码。凡入此门者，须先读四部天书：\n\n《万象图经》管天地万物的结构，\n《九霄心典》管万物运行的心志，\n《玄网符箓》管苍生之间的联系，\n《天工机枢》管肉身与法宝的构造。\n\n外门杂役 {name} 在石阶下醒来。昨夜藏经阁红光冲霄，今日却一切如常。",
      choices: [
        {
          text: "一骨碌爬起来，奔上藏经阁",
          resultText: "{name} 踏着晨露上山。少年求道之心，从这一刻起再难回头。",
          next: "library"
        },
        {
          text: "再赖半刻，天塌下来也有长老顶着",
          check: { type: "fate", difficulty: 2 },
          success: { text: "睡意如潮，却被一道剑鸣劈开。", next: "late", effects: [] },
          failure: { text: "一觉睡到日上三竿，杂役院的铜钟险些被敲破。", next: "late", effects: [{ type: "add", field: "fate", value: 1 }] }
        }
      ]
    },

    late: {
      id: "late",
      chapter: 0,
      location: "青峰 · 山道",
      scene: "bamboo",
      speaker: "shen",
      title: "迟了半刻",
      text: "山道上，一袭青衫御剑掠过。剑锋擦着 {name} 的鬓角，带起几缕碎发。\n\n“新来的？书院不收没有时间观念的人。”\n\n来人收剑落地，正是剑峰首席沈青梧。她瞥了 {name} 一眼，没有多言。",
      next: "library",
      onEnter: [{ type: "add", field: "relations.shen", value: 2 }]
    },

    library: {
      id: "library",
      chapter: 0,
      location: "藏经阁 · 一层",
      scene: "library",
      speaker: "narrator",
      title: "四部天书",
      text: "藏经阁空无一人，四部天书却悬在书案上自行翻页。纸页之间，无数符文如萤火流转。\n\n“四部天书，对应剑、阵、符、器四脉。你本命只有一脉，但天书说：四脉同修，方见大道。”\n\n你的本命是《{book}》所载的{path}。此刻，先参哪一页？",
      choices: [
        { text: "《万象图经》· 数据结构", kicker: "阵 · 图、树、栈与队列", check: { type: "mastery", course: "data", difficulty: 15 }, success: { text: "图成天网，树生万象。你对图论生出明悟。", next: "exam_call", effects: [{ type: "add", field: "mastery.data", value: 12 }, { type: "add", field: "cultivation", value: 5 }] }, failure: { text: "符文晦涩，你只记下三五分。", next: "exam_call", effects: [{ type: "add", field: "mastery.data", value: 5 }] } },
        { text: "《九霄心典》· 操作系统", kicker: "剑 · 进程、调度与死锁", check: { type: "mastery", course: "os", difficulty: 15 }, success: { text: "一念千剑，进程如潮。你悟到并发之意。", next: "exam_call", effects: [{ type: "add", field: "mastery.os", value: 12 }, { type: "add", field: "cultivation", value: 5 }] }, failure: { text: "心典只翻过一页，尚不得其法。", next: "exam_call", effects: [{ type: "add", field: "mastery.os", value: 5 }] } },
        { text: "《玄网符箓》· 计算机网络", kicker: "符 · 分层、路由与协议", check: { type: "mastery", course: "net", difficulty: 15 }, success: { text: "七层符箓，一网通玄。你听见天地间的信路。", next: "exam_call", effects: [{ type: "add", field: "mastery.net", value: 12 }, { type: "add", field: "cultivation", value: 5 }] }, failure: { text: "符线交错，只辨得一条来路。", next: "exam_call", effects: [{ type: "add", field: "mastery.net", value: 5 }] } },
        { text: "《天工机枢》· 计算机组成原理", kicker: "器 · CPU、存储与流水线", check: { type: "mastery", course: "arch", difficulty: 15 }, success: { text: "你听见体内经脉如流水线般轰鸣。", next: "exam_call", effects: [{ type: "add", field: "mastery.arch", value: 12 }, { type: "add", field: "cultivation", value: 5 }] }, failure: { text: "机枢自晦，只容你窥见一角。", next: "exam_call", effects: [{ type: "add", field: "mastery.arch", value: 5 }] } }
      ]
    },

    exam_call: {
      id: "exam_call",
      chapter: 1,
      location: "天机书院 · 演武场",
      scene: "arena",
      speaker: "elder",
      title: "照心三问",
      text: "“外门弟子 {name}，入门试开始。第一问，不考你背了多少经文，只考你遇事时如何破题。”\n\n照心长老拂尘一甩，演武场中央浮现一座乱序石阵。石柱错位，互相锁死，正是一座由无数“死循环”撑起的囚笼。",
      next: "exam_puzzle"
    },

    exam_puzzle: {
      id: "exam_puzzle",
      chapter: 1,
      location: "演武场 · 乱序石阵",
      scene: "arena",
      speaker: "elder",
      title: "第一问",
      text: "“乱序石阵，进得去，出不来。你要如何破？”",
      choices: [
        { text: "以栈为牢，逆序归位", kicker: "本命 · {path}", check: { type: "mastery", course: "data", difficulty: 18 }, success: { text: "栈顶弹回，乱序自解。石阵轰然归位。", next: "exam_pass", effects: [{ type: "add", field: "mastery.data", value: 8 }, { type: "add", field: "cultivation", value: 6 }] }, failure: { text: "压入一半，栈溢出，石阵反噬。", next: "exam_stumble", effects: [{ type: "add", field: "hp", value: -8 }] } },
        { text: "并发分神，同时推开所有石柱", kicker: "剑 · 操作系统", check: { type: "mastery", course: "os", difficulty: 20 }, success: { text: "数道剑意并发而出，石锁来不及反应。", next: "exam_pass", effects: [{ type: "add", field: "mastery.os", value: 8 }, { type: "add", field: "cultivation", value: 6 }] }, failure: { text: "分神过多，进程互相抢占，反被石阵绞住。", next: "exam_stumble", effects: [{ type: "add", field: "qi", value: -8 }] } },
        { text: "循着最短路径，找到隐藏阵眼", kicker: "符 · 计算机网络", check: { type: "mastery", course: "net", difficulty: 20 }, success: { text: "路由算尽，阵眼无处遁形。", next: "exam_pass", effects: [{ type: "add", field: "mastery.net", value: 8 }, { type: "add", field: "cultivation", value: 6 }] }, failure: { text: "信路被魔气干扰，你走错了节点。", next: "exam_stumble", effects: [{ type: "add", field: "hp", value: -6 }] } },
        { text: "把自己当作流水线，逐段拆解", kicker: "器 · 计算机组成原理", check: { type: "mastery", course: "arch", difficulty: 20 }, success: { text: "取指、译码、执行，一气呵成。", next: "exam_pass", effects: [{ type: "add", field: "mastery.arch", value: 8 }, { type: "add", field: "cultivation", value: 6 }] }, failure: { text: "流水线冒险，你的经脉一滞。", next: "exam_stumble", effects: [{ type: "add", field: "qi", value: -8 }] } }
      ]
    },

    exam_stumble: {
      id: "exam_stumble",
      chapter: 1,
      location: "演武场 · 乱序石阵",
      scene: "arena",
      speaker: "elder",
      title: "阵未破",
      text: "石阵重新合拢，照心长老摇了摇头：“学问不是背下来的，要在绝境里活过来。”",
      next: "exam_retry"
    },

    exam_retry: {
      id: "exam_retry",
      chapter: 1,
      location: "演武场 · 乱序石阵",
      scene: "arena",
      speaker: "protag",
      title: "绝境再试",
      text: "{name} 吐出一口浊气，把毕生所学按在掌心。这一次，不再求快，只求每一步都有依据。",
      choices: [
        { text: "以本命法门强攻", kicker: "{path} · 本命加成", check: { type: "path", difficulty: 14 }, success: { text: "本命道法如臂使指，石阵被一击贯穿。", next: "exam_pass", effects: [{ type: "add", field: "cultivation", value: 8 }, { type: "add", field: "insight", value: 1 }] }, failure: { text: "石阵仍在，但你在反噬中找到了一丝破绽。", next: "exam_pass", effects: [{ type: "add", field: "hp", value: -10 }, { type: "add", field: "fate", value: 1 }] } }
      ]
    },

    exam_pass: {
      id: "exam_pass",
      chapter: 1,
      location: "演武场 · 照心台",
      scene: "arena",
      speaker: "elder",
      title: "第一问，过",
      text: "石阵崩解，照心长老眼中闪过一丝异色：“四部天书会自己择主。你今日，已经入了它们的眼。”\n\n话音未落，四脉首席各占一方。与你本命最契合的那一位，第一次记住了你的名字。",
      next: "bell_ring",
      onEnter: [{ type: "add", field: "cultivation", value: 12 }, { type: "add", field: "reputation", value: 4 }, { type: "add", field: "relations.mo", value: 3 }]
    },

    bell_ring: {
      id: "bell_ring",
      chapter: 1,
      location: "藏经阁 · 惊变",
      scene: "library",
      speaker: "narrator",
      title: "阁中惊变",
      text: "“当——”\n\n一声不属于任何铜钟的轰鸣从藏经阁传出。阁门被黑雾撞开，无数书页在雾中化作齿状巨口。\n\n“是栈灵！它把整座藏经阁当成了自己的栈，一层一层压住了逃不出去的修士！”",
      next: "stack_demon"
    },

    stack_demon: {
      id: "stack_demon",
      chapter: 1,
      location: "藏经阁 · 魔雾之中",
      scene: "library",
      speaker: "demon",
      title: "栈灵",
      text: "雾中升起一座由书页堆成的塔。最顶上的书封睁开一只竖瞳：“后进先出……你既闯进来，就做我的栈底吧。”",
      battle: {
        enemy: { name: "栈灵", title: "藏经阁魔物", glyph: "栈", hp: 68, atk: [5, 11], weak: "data", accent: "#9b8ff0" },
        victory: "stack_down",
        defeat: "game_over"
      }
    },

    stack_down: {
      id: "stack_down",
      chapter: 1,
      location: "藏经阁 · 一层",
      scene: "library",
      speaker: "shen",
      title: "后进先出",
      text: "书塔轰塌，被困的弟子自雾中跌出。沈青梧御剑落在檐角，只淡淡说了一句：“做得不坏。”\n\n陆重楼却从书堆后探出头：“你这破阵方式太糙了，栈该拿来装瓜子壳，一层一层，别有韵味。”",
      next: "village",
      onEnter: [{ type: "add", field: "cultivation", value: 15 }, { type: "add", field: "reputation", value: 6 }, { type: "add", field: "relations.shen", value: 4 }, { type: "add", field: "relations.lu", value: 4 }, { type: "item", name: "灵石", value: 15 }, { type: "item", name: "回气丹", value: 1 }]
    },

    village: {
      id: "village",
      chapter: 2,
      location: "黑雾村 · 村口",
      scene: "village",
      speaker: "su",
      title: "死锁之雾",
      text: "苏流萤在村口来回踱步：“三天前，村里的水车停了，磨坊也停了。所有活物都像被什么东西同时锁住，谁也不肯先让一步。”\n\n远处，黑雾盘成巨大的环。环形雾气彼此咬合，竟像一个正在等待资源的死锁。",
      choices: [
        { text: "先向村民问清雾起的时间", kicker: "运气 · 察言观色", check: { type: "fate", difficulty: 2 }, success: { text: "一个孩子指向后山：昨夜有人在那里念了一整晚经文。", next: "deadlock_core", effects: [{ type: "add", field: "insight", value: 1 }, { type: "add", field: "relations.su", value: 3 }] }, failure: { text: "村民噤若寒蝉，只塞给你半块干饼。", next: "deadlock_core", effects: [{ type: "item", name: "干粮", value: 1 }] } },
        { text: "看雾中队列：谁先进，谁先出", kicker: "阵 · 队列", check: { type: "mastery", course: "data", difficulty: 20 }, success: { text: "雾中木偶列队而行，队首已断，队尾却在无限补位。", next: "deadlock_core", effects: [{ type: "add", field: "mastery.data", value: 5 }, { type: "add", field: "cultivation", value: 4 }] }, failure: { text: "队列回环，你看得头晕目眩。", next: "deadlock_core", effects: [{ type: "add", field: "hp", value: -5 }] } },
        { text: "放出一缕符光，追踪雾的来路", kicker: "符 · 路由追踪", check: { type: "mastery", course: "net", difficulty: 20 }, success: { text: "符光逐跳回溯，终点指向村中枯井。", next: "deadlock_core", effects: [{ type: "add", field: "mastery.net", value: 5 }, { type: "add", field: "cultivation", value: 4 }] }, failure: { text: "符光被黑雾吞掉，只带回一句低语。", next: "deadlock_core", effects: [{ type: "add", field: "fate", value: 1 }] } }
      ]
    },

    deadlock_core: {
      id: "deadlock_core",
      chapter: 2,
      location: "黑雾村 · 枯井",
      scene: "village",
      speaker: "narrator",
      title: "枯井",
      text: "枯井深处，两股魔气各执一枚铜环。甲魔等乙先松手，乙魔等甲先交环。它们谁都以为自己会赢，结果谁也无法前进。\n\n这便是最原始的“死锁”：资源与等待，闭环相扣。",
      choices: [
        { text: "抢占资源，强行夺下其中一枚铜环", kicker: "剑 · 抢占式调度", check: { type: "mastery", course: "os", difficulty: 22 }, success: { text: "你一剑挑飞铜环，死锁瞬间崩溃。", next: "lock_reveal", effects: [{ type: "add", field: "mastery.os", value: 7 }, { type: "add", field: "cultivation", value: 6 }] }, failure: { text: "双魔同时来抢，你被反震出井口。", next: "lock_reveal", effects: [{ type: "add", field: "hp", value: -12 }] } },
        { text: "给它们一条超时重传的退路", kicker: "符 · 超时重传", check: { type: "mastery", course: "net", difficulty: 22 }, success: { text: "你点燃一张符，定下“三息不答便重来”。双魔松开铜环。", next: "lock_reveal", effects: [{ type: "add", field: "mastery.net", value: 7 }, { type: "add", field: "cultivation", value: 6 }] }, failure: { text: "符纸被雾浸湿，重传变成重死。", next: "lock_reveal", effects: [{ type: "add", field: "qi", value: -10 }] } },
        { text: "用哈希锁死它们的地址，不让它们换身", kicker: "阵 · 散列存储", check: { type: "mastery", course: "data", difficulty: 23 }, success: { text: "地址固定，死锁无路可绕，阵纹寸寸崩裂。", next: "lock_reveal", effects: [{ type: "add", field: "mastery.data", value: 7 }, { type: "add", field: "cultivation", value: 6 }] }, failure: { text: "哈希碰撞，两魔反而合为一体。", next: "lock_reveal", effects: [{ type: "add", field: "hp", value: -12 }] } }
      ]
    },

    lock_reveal: {
      id: "lock_reveal",
      chapter: 2,
      location: "黑雾村 · 枯井深处",
      scene: "cavern",
      speaker: "lock",
      title: "锁灵童",
      text: "死锁崩开后，雾中走出一个扎着红绳的童子。他怀里抱着半块破碎的“天道源码”，眼中有黑气翻涌。\n\n“再等一刻……就一刻……我的村子还没有编译完。”",
      battle: {
        enemy: { name: "锁灵童", title: "死锁魔雾化身", glyph: "锁", hp: 102, atk: [8, 16], weak: "os", accent: "#e97f71" },
        victory: "lock_down",
        defeat: "game_over"
      }
    },

    lock_down: {
      id: "lock_down",
      chapter: 2,
      location: "黑雾村 · 村中",
      scene: "village",
      speaker: "su",
      title: "雾散",
      text: "锁灵童倒地，怀中的半块源码化作光点，回到村中每一口水井、每一座磨坊。鸡鸣重新响起，苏流萤冲你笑得眼睛弯成月牙。",
      choices: [
        { text: "先安置受伤的村民", resultText: "苏流萤说，会替你记下这份人情。黑雾村的声望传回书院。", next: "trial_pre", effects: [{ type: "add", field: "reputation", value: 5 }, { type: "add", field: "relations.su", value: 5 }, { type: "add", field: "fate", value: 1 }] },
        { text: "捡起那半块源码细看", resultText: "代码断处藏着“while(true)”的残痕。你把它拓入神魂。", next: "trial_pre", effects: [{ type: "add", field: "insight", value: 2 }, { type: "add", field: "cultivation", value: 8 }, { type: "add", field: "mastery.os", value: 4 }] }
      ]
    },

    trial_pre: {
      id: "trial_pre",
      chapter: 3,
      location: "天机书院 · 大比会场",
      scene: "arena",
      speaker: "elder",
      title: "书院大比",
      text: "回山第七日，书院大比开锣。四脉天骄尽出，山门外更有三千散修围观。\n\n“外门弟子 {name}，对阵外门第一，周伏波。”\n\n看台上嘘声如潮。没人相信一个杂役能走到这里。",
      next: "trial_r1"
    },

    trial_r1: {
      id: "trial_r1",
      chapter: 3,
      location: "大比会场 · 第一阵",
      scene: "arena",
      speaker: "rival",
      title: "第一阵",
      text: "周伏波张开折扇，扇面上竟是三十六道机关符。“你从哪一页天书里爬出来的，我就把你塞回哪一页。”",
      choices: [
        { text: "以本命道法破他的三十六符", kicker: "本命 · {path}", check: { type: "path", difficulty: 24 }, success: { text: "本命道法撕裂符阵，周伏波退了三步。", next: "trial_r1_win", effects: [{ type: "add", field: "cultivation", value: 10 }, { type: "add", field: "reputation", value: 3 }] }, failure: { text: "符阵三十六变，你被削去一角衣袖。", next: "trial_r1_lose", effects: [{ type: "add", field: "hp", value: -10 }] } },
        { text: "算他机关符的最短失效路径", kicker: "跨修 · 图论", check: { type: "mastery", course: "data", difficulty: 26 }, success: { text: "最短路径一断，三十六符同时哑火。", next: "trial_r1_win", effects: [{ type: "add", field: "mastery.data", value: 6 }, { type: "add", field: "cultivation", value: 10 }] }, failure: { text: "图太密，你算到一半，符火已到面门。", next: "trial_r1_lose", effects: [{ type: "add", field: "hp", value: -13 }] } },
        { text: "以流水线般的连续身法硬拆", kicker: "跨修 · 组成原理", check: { type: "mastery", course: "arch", difficulty: 26 }, success: { text: "你的动作拆成数级，同时推进，周伏波应接不暇。", next: "trial_r1_win", effects: [{ type: "add", field: "mastery.arch", value: 6 }, { type: "add", field: "cultivation", value: 10 }] }, failure: { text: "流水线冒险，他的符追上了你的残影。", next: "trial_r1_lose", effects: [{ type: "add", field: "qi", value: -12 }] } }
      ]
    },

    trial_r1_win: {
      id: "trial_r1_win",
      chapter: 3,
      location: "大比会场 · 第一阵",
      scene: "arena",
      speaker: "narrator",
      title: "先胜一场",
      text: "“外门弟子 {name}，胜！”\n\n看台安静一瞬，继而叫好声如雷。周伏波咬牙退场。",
      next: "trial_r2",
      onEnter: [{ type: "add", field: "reputation", value: 5 }]
    },

    trial_r1_lose: {
      id: "trial_r1_lose",
      chapter: 3,
      location: "大比会场 · 第一阵",
      scene: "arena",
      speaker: "narrator",
      title: "一败",
      text: "周伏波先下一城。你没有退路，只能把所有底牌留到下一场。",
      next: "trial_r2",
      onEnter: [{ type: "add", field: "fate", value: 1 }]
    },

    trial_r2: {
      id: "trial_r2",
      chapter: 3,
      location: "大比会场 · 第二阵",
      scene: "arena",
      speaker: "rival",
      title: "第二阵",
      text: "第二场，周伏波不再试探。他踏出九宫，擂台化作战阵，每一步都锁住你的一线退路。",
      choices: [
        { text: "分神并发，正面与背面同时出剑", kicker: "跨修 · 并发", check: { type: "mastery", course: "os", difficulty: 27 }, success: { text: "两道身影同时出剑，周伏波首尾难顾。", next: "trial_r2_win", effects: [{ type: "add", field: "mastery.os", value: 7 }, { type: "add", field: "cultivation", value: 11 }] }, failure: { text: "分神被阵法定住，你险些心念崩溃。", next: "trial_r2_lose", effects: [{ type: "add", field: "qi", value: -12 }] } },
        { text: "符光三握，先与他完成一次可靠连接", kicker: "跨修 · 三次握手", check: { type: "mastery", course: "net", difficulty: 27 }, success: { text: "三握既成，你借他的气机反客为主。", next: "trial_r2_win", effects: [{ type: "add", field: "mastery.net", value: 7 }, { type: "add", field: "cultivation", value: 11 }] }, failure: { text: "连接超时，反被他的符阵拉进漩涡。", next: "trial_r2_lose", effects: [{ type: "add", field: "hp", value: -11 }] } },
        { text: "Cache他的招式，预判下一次出手", kicker: "跨修 · 存储系统", check: { type: "mastery", course: "arch", difficulty: 27 }, success: { text: "他的招式已被缓存，下一次出手尽在你掌握。", next: "trial_r2_win", effects: [{ type: "add", field: "mastery.arch", value: 7 }, { type: "add", field: "cultivation", value: 11 }] }, failure: { text: "缓存未中，他的变招快得惊人。", next: "trial_r2_lose", effects: [{ type: "add", field: "hp", value: -11 }] } }
      ]
    },

    trial_r2_win: {
      id: "trial_r2_win",
      chapter: 3,
      location: "大比会场 · 第二阵",
      scene: "arena",
      speaker: "lu",
      title: "再胜一场",
      text: "看台上，陆重楼懒洋洋地鼓起掌：“有点意思。照这么打，你很快就能替我值日了。”",
      next: "trial_r3",
      onEnter: [{ type: "add", field: "reputation", value: 6 }, { type: "add", field: "relations.lu", value: 3 }]
    },

    trial_r2_lose: {
      id: "trial_r2_lose",
      chapter: 3,
      location: "大比会场 · 第二阵",
      scene: "arena",
      speaker: "shen",
      title: "二败",
      text: "沈青梧的声音穿过看台：“还有一场。你的剑不为你自己，也为山门前三千双眼睛。”",
      next: "trial_r3",
      onEnter: [{ type: "add", field: "fate", value: 1 }, { type: "add", field: "relations.shen", value: 2 }]
    },

    trial_r3: {
      id: "trial_r3",
      chapter: 3,
      location: "大比会场 · 终阵",
      scene: "arena",
      speaker: "rival",
      title: "终阵",
      text: "第三场，周伏波终于动了真火。他咬破指尖，折扇化作一柄长刀，刀光如断电的黑夜。",
      battle: {
        enemy: { name: "周伏波", title: "外门第一", glyph: "周", hp: 128, atk: [10, 18], weak: "net", accent: "#e8b96c" },
        victory: "trial_won",
        defeat: "game_over"
      }
    },

    trial_won: {
      id: "trial_won",
      chapter: 3,
      location: "大比会场 · 领奖台",
      scene: "arena",
      speaker: "elder",
      title: "一战成名",
      text: "长刀坠地，周伏波长揖一礼：“我输了。不是输给运气，是输给你身后那四部天书。”\n\n大比之后，四位首席与师叔都来见你。今夜风清，明月正圆。",
      next: "night_talk",
      onEnter: [{ type: "add", field: "cultivation", value: 28 }, { type: "add", field: "reputation", value: 10 }, { type: "item", name: "大衍玉简", value: 1 }, { type: "item", name: "回气丹", value: 2 }]
    },

    night_talk: {
      id: "night_talk",
      chapter: 3,
      location: "天机书院 · 月下剑坪",
      scene: "mountain",
      speaker: "narrator",
      title: "月下问心",
      text: "众人散去，月下只剩你与一方石桌。有人先开了口，你选择听谁说完？",
      choices: [
        { text: "沈青梧：她说你不像外门杂役", resultText: "沈青梧说，你的眼睛让她想起十年前死在魔潮里的师兄。她的剑，愿意借你一次。", next: "night_after", effects: [{ type: "add", field: "relations.shen", value: 7 }, { type: "add", field: "insight", value: 1 }] },
        { text: "陆重楼：他教你偷懒的法门", resultText: "陆重楼说，会休息的人才会修行。你从“时间片轮转”里悟出休憩之道。", next: "night_after", effects: [{ type: "add", field: "relations.lu", value: 7 }, { type: "add", field: "qi", value: 12 }] },
        { text: "苏流萤：她带回魔渊的消息", resultText: "苏流萤压低声音：四大门派的高手都失踪在万魔洞，那里有一座会编译人心的古碑。", next: "night_after", effects: [{ type: "add", field: "relations.su", value: 7 }, { type: "add", field: "fate", value: 1 }] },
        { text: "墨九渊：他赠你一枚铜钱", resultText: "墨九渊只留下一句：“此物是总线，亦是退路。别死。”", next: "night_after", effects: [{ type: "add", field: "relations.mo", value: 7 }, { type: "item", name: "护心铜钱", value: 1 }] }
      ]
    },

    night_after: {
      id: "night_after",
      chapter: 4,
      location: "万魔洞 · 入口",
      scene: "cavern",
      speaker: "su",
      title: "万魔洞",
      text: "次日清晨，书院收到一封血书。失踪者被困万魔洞，洞中黑雾已经能模拟出每个人心中最深的执念。\n\n苏流萤咬牙道：“那里被布成了一张递归迷宫。每一条岔路，都会召唤一个‘你’。",
      next: "maze"
    },

    maze: {
      id: "maze",
      chapter: 4,
      location: "万魔洞 · 心魔网",
      scene: "cavern",
      speaker: "narrator",
      title: "心魔网",
      text: "洞中无光，却有无数发亮的节点如星。每个节点都重复同一句话：\n\n“放弃吧。你还在上一个循环里。”\n\n要走到下一层，必须让递归真正结束。",
      choices: [
        { text: "写下一个明确的递归出口", kicker: "阵 · 递归", check: { type: "mastery", course: "data", difficulty: 30 }, success: { text: "出口一写，心魔分身们像断线的木偶般倒下。", next: "boss_before", effects: [{ type: "add", field: "mastery.data", value: 8 }, { type: "add", field: "cultivation", value: 10 }] }, failure: { text: "你的出口被心魔改写成另一个循环。", next: "boss_before", effects: [{ type: "add", field: "hp", value: -16 }] } },
        { text: "逐个杀死互相等待的执念进程", kicker: "剑 · 终止死锁", check: { type: "mastery", course: "os", difficulty: 30 }, success: { text: "你一剑斩断等待环，心魔网出现缺口。", next: "boss_before", effects: [{ type: "add", field: "mastery.os", value: 8 }, { type: "add", field: "cultivation", value: 10 }] }, failure: { text: "斩了一个，又补上两个。你的剑越来越沉。", next: "boss_before", effects: [{ type: "add", field: "qi", value: -16 }] } },
        { text: "追踪古碑发出的源地址", kicker: "符 · 溯源", check: { type: "mastery", course: "net", difficulty: 30 }, success: { text: "所有假路径都指向同一地址，你一步踏入碑前。", next: "boss_before", effects: [{ type: "add", field: "mastery.net", value: 8 }, { type: "add", field: "cultivation", value: 10 }] }, failure: { text: "地址被伪装，你又在原地绕了三圈。", next: "boss_before", effects: [{ type: "add", field: "qi", value: -16 }] } }
      ]
    },

    boss_before: {
      id: "boss_before",
      chapter: 4,
      location: "万魔洞 · 源代码碑",
      scene: "cavern",
      speaker: "thief",
      title: "窃天者",
      text: "古碑前站着一个人。他转过身，竟是白日里递给你伤药的那名外门执事。\n\n“自我介绍一下。白无咎，窃天者。”\n\n他伸手点在碑上，天地间所有文字同时倒流：“你们修的不是仙，是别人写好的程序。而我，要拿到最高权限。”",
      battle: {
        enemy: { name: "白无咎", title: "窃天者 · 心魔编译", glyph: "白", hp: 186, atk: [13, 23], weak: "data", accent: "#d77c8b" },
        victory: "boss_down",
        defeat: "game_over"
      }
    },

    boss_down: {
      id: "boss_down",
      chapter: 4,
      location: "万魔洞 · 古碑前",
      scene: "cavern",
      speaker: "narrator",
      title: "权限之战",
      text: "白无咎的身躯化作一行行错误代码，散进碑中。他最后的笑声还在洞中回荡：“你以为你在修仙？你只是在调试这个世界……”\n\n古碑裂开，露出一条通往星海深处的石阶。",
      next: "source_gate",
      onEnter: [{ type: "add", field: "cultivation", value: 45 }, { type: "add", field: "reputation", value: 15 }, { type: "item", name: "天道源码·残页", value: 1 }, { type: "add", field: "fate", value: 2 }]
    },

    source_gate: {
      id: "source_gate",
      chapter: 5,
      location: "星海 · 天道源代码",
      scene: "void",
      speaker: "narrator",
      title: "最后一页",
      text: "星海之中，无数光柱并立如碑，每一道都是一行源代码。它们从虚空中长出来，又向更深的虚空蔓延。\n\n天道缺了一行，正因如此，死锁、心魔与灾厄才会不断重启。\n\n现在，轮到 {name} 写下最后一页。",
      choices: [
        { text: "补全源代码，成为新的天道", kicker: "合道 · 改天换地", check: { type: "combined", courses: ["data", "os"], difficulty: 42 }, success: { text: "你落下最后一笔，万道轰鸣。", next: "ending_ascend", effects: [{ type: "add", field: "cultivation", value: 60 }] }, failure: { text: "你的指尖停在半空，天道仍在等待。", next: "ending_guard", effects: [{ type: "add", field: "cultivation", value: 20 }] } },
        { text: "不改天，只守护人间与书院", kicker: "守道 · 人间烟火", check: { type: "relation", char: "shen", min: 8 }, success: { text: "你选择把权限散入人间。", next: "ending_guard", effects: [{ type: "add", field: "cultivation", value: 30 }] }, failure: { text: "人间无回响，你只能先守住眼前。", next: "ending_guard", effects: [{ type: "add", field: "cultivation", value: 15 }] } },
        { text: "删除这一页，让众生自己书写", kicker: "破道 · 万法归凡", check: { type: "attribute", attr: "insight", difficulty: 12 }, success: { text: "你按下了最后的删除键。", next: "ending_destroy", effects: [{ type: "add", field: "cultivation", value: 20 }] }, failure: { text: "指尖颤抖，最终仍选择了补全。", next: "ending_ascend", effects: [{ type: "add", field: "cultivation", value: 20 }] } }
      ]
    },

    ending_ascend: {
      id: "ending_ascend",
      chapter: 5,
      location: "星海之上",
      scene: "void",
      speaker: "narrator",
      title: "结局 · 源代码补天",
      ending: "ascend",
      text: "你写下的那一行代码，让日月重新升起。四部天书自天而降，化为你身后四道虚影。\n\n许多年后，新入门的弟子还会听长老讲起一个名字：一个外门杂役，在星海尽头补全了天道源代码，从此万界再无死锁，也再无轮回。",
      next: null
    },

    ending_guard: {
      id: "ending_guard",
      chapter: 5,
      location: "天机书院 · 山门",
      scene: "mountain",
      speaker: "narrator",
      title: "结局 · 人间守道",
      ending: "guard",
      text: "你没有选择成为天道，而是回到三千石阶之下。清晨的钟声依旧，藏经阁的灯火依旧。\n\n从此世间少了一位高高在上的仙，多了一位每逢灾厄便下山护道的人。四部天书摊在石阶上，任风吹过，任众生来读。",
      next: null
    },

    ending_destroy: {
      id: "ending_destroy",
      chapter: 5,
      location: "星海 · 旧道残墟",
      scene: "void",
      speaker: "narrator",
      title: "结局 · 万法归凡",
      ending: "destroy",
      text: "最后一页被删除，星空安静下来。没有天道，没有既定的飞升，也没有被篡改的命运。\n\n众生从此自己修行，自己犯错，也自己成仙。你在废墟中坐下，听见千万里外，一个新生命写下了自己的第一行代码。",
      next: null
    },

    game_over: {
      id: "game_over",
      chapter: 5,
      location: "忘川 · 道途尽头",
      scene: "void",
      speaker: "narrator",
      title: "结局 · 道陨",
      ending: "death",
      text: "灵气散去，眼前的景象如断片般熄灭。你只来得及看见山门一角，和四部天书同时合上的声音。\n\n修仙一途，九死一生。此世已尽，重头再来，也未尝不是新的开始。",
      next: null
    }
  };

  function sceneArt(scene, accent) {
    const c = accent || "#e8b96c";
    const sky = {
      mountain: ["#15233f", "#0b111f"],
      library: ["#2a2018", "#0c1019"],
      village: ["#3b2637", "#0b1019"],
      arena: ["#243549", "#0b1019"],
      cavern: ["#171a2a", "#07090f"],
      void: ["#080b1a", "#03040a"],
      bamboo: ["#1b332d", "#0a1118"],
      forge: ["#3a1e19", "#0a0e18"]
    }[scene] || ["#15233f", "#0b111f"];

    let details = "";
    if (scene === "mountain") {
      details = `
        <circle cx="625" cy="68" r="38" fill="url(#moon-${scene})"/>
        <path d="M0 245 145 96l68 55 94-104 91 81 126-72 276 189v55H0z" fill="#101828"/>
        <path d="M0 275 210 170l62 48 83-75 105 76 340-118v99H0z" fill="#0a101c"/>
        <g stroke="#c0b795" opacity=".65" fill="none" stroke-width="2"><path d="M390 285v-45M420 285v-58M450 285v-45"/></g>`;
    } else if (scene === "library") {
      details = `
        <path d="M0 240h800v60H0z" fill="#0d111b"/>
        <path d="M55 245V70h60v175M685 245V70h-60v175" fill="#151d2d"/>
        <path d="M77 91h25v118M698 91h-25v118" stroke="#6f5b42" stroke-width="2"/>
        <circle cx="400" cy="90" r="7" fill="#ffd98c"/><path d="M398 90 400 55l2 35z" stroke="#ffd98c"/>
        <path d="M400 245 398 170h60l-58 75z" fill="#22283b"/>`;
    } else if (scene === "village") {
      details = `
        <circle cx="165" cy="86" r="31" fill="#c98c7b" opacity=".8"/>
        <path d="M0 244h800v56H0z" fill="#0b111d"/>
        <path d="M42 243V144l64-38 64 38v99h-24v-63H66v63z" fill="#161927"/>
        <path d="M580 243V130l80-45 80 45v113h-29v-68h-102v68z" fill="#171d2b"/>
        <path d="M0 210c120-54 240 38 400 8s290-48 400 16" fill="none" stroke="#7e5f73" opacity=".38" stroke-width="24"/>`;
    } else if (scene === "arena") {
      details = `
        <path d="M400 74 250 235h300z" fill="#141c2c"/>
        <path d="M400 104 294 235h212z" fill="#0d1422"/>
        <circle cx="400" cy="196" r="42" fill="none" stroke="${c}" stroke-width="3" opacity=".45"/>
        <path d="M0 246h800v54H0z" fill="#0b111d"/>
        <path d="M0 246c130-38 255 30 400 4s270-34 400-4" fill="none" stroke="#45536e" stroke-width="5"/>`;
    } else if (scene === "cavern") {
      details = `
        <path d="M0 0h800v260H0z" fill="url(#cave-${scene})"/>
        <path d="M70 0 170 240h105L150 0zm540 0-115 240H390L480 0z" fill="#0b0f1a"/>
        <path d="M400 262 345 78l45-25 75 22-10 187z" fill="#070a12" stroke="${c}" stroke-width="2" opacity=".75"/>
        <path d="m350 100 5-48 60 8-18 51-45-12z" fill="${c}" opacity=".22"/>
        <circle cx="190" cy="75" r="4" fill="#6ce3cd"/><circle cx="625" cy="130" r="6" fill="#6ce3cd"/><circle cx="270" cy="185" r="3" fill="#a98ff0"/>`;
    } else if (scene === "void") {
      details = `
        <g fill="#d8e6ff"><circle cx="105" cy="64" r="2"/><circle cx="206" cy="122" r="1.5"/><circle cx="320" cy="52" r="2"/><circle cx="490" cy="96" r="1.7"/><circle cx="590" cy="45" r="2.2"/><circle cx="705" cy="132" r="1.5"/><circle cx="660" cy="205" r="2"/><circle cx="120" cy="190" r="1.8"/></g>
        <circle cx="400" cy="125" r="62" fill="none" stroke="${c}" stroke-width="1.5" opacity=".65"/>
        <circle cx="400" cy="125" r="44" fill="${c}" opacity=".06"/>
        <circle cx="400" cy="125" r="21" fill="${c}" opacity=".13"/>
        <g opacity=".42" stroke="#8fa9c9" stroke-width="3"><path d="M0 245h130M142 245h35M235 245h120M420 245h135M615 245h90"/></g>`;
    } else if (scene === "bamboo") {
      details = `
        <path d="M90 260V28M150 260V62M214 260V18M286 260V70" stroke="#203a33" stroke-width="8"/>
        <path d="M82 105q30-32 28-66M205 76q-25 18-23 53M278 120q30-24 27-62" fill="none" stroke="#29483e" stroke-width="6"/>
        <path d="M0 247h800v53H0z" fill="#0b1419"/>`;
    } else if (scene === "forge") {
      details = `
        <path d="M0 240h800v60H0z" fill="#11101a"/>
        <path d="M270 235 300 135h180l31 100z" fill="#12131d"/>
        <path d="M320 195h140l15 45H305z" fill="#1a1a27"/>
        <path d="M380 195v-44h41v44" fill="none" stroke="${c}" stroke-width="4"/>
        <path d="M430 138c38-40 87-42 126-8" fill="none" stroke="#6c5035" stroke-width="6"/>
        <circle cx="505" cy="118" r="27" fill="${c}" opacity=".12"/><circle cx="505" cy="118" r="11" fill="#e78c55" opacity=".72"/>`;
    }

    return `
      <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky-${scene}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/>
          </linearGradient>
          <radialGradient id="moon-${scene}">
            <stop offset="0" stop-color="#ffe9b6"/><stop offset="1" stop-color="${c}" stop-opacity=".1"/>
          </radialGradient>
          <linearGradient id="cave-${scene}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#17172a"/><stop offset="1" stop-color="#0a0c14"/>
          </linearGradient>
        </defs>
        <rect width="800" height="300" fill="url(#sky-${scene})"/>
        <g opacity=".35" stroke="#8393ad"><path d="M-20 34h840M-20 71h840M-20 108h840"/></g>
        ${details}
      </svg>`;
  }

  const ICONS = {
    close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5zM4 19.5V4.5A2.5 2.5 0 0 1 6.5 2"/></svg>',
    people: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M6 2h12l3 5v14H3V7zM3 7h18M9 11a3 3 0 0 0 6 0"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="m9 4-5 2v14l5-2 6 2 5-2V4l-5 2zM9 4v14M15 6v14"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    undo: '<svg viewBox="0 0 24 24"><path d="M3 7v6h6M21 17a9 9 0 0 0-15-6.7L3 13"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>',
    sword: '<svg viewBox="0 0 24 24"><path d="m14.5 17.5 3-3 3 3-1 1-2-1-1 1zM5 5l10 10M15 5l4 4M12 8l4 4"/></svg>',
    scroll: '<svg viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 8h8M8 12h8M8 16h5"/></svg>'
  };

  const $ = (selector) => document.querySelector(selector);

  const els = {
    title: $("#title-screen"),
    creation: $("#creation-screen"),
    game: $("#game-screen"),
    newGame: $("#new-game"),
    continueGame: $("#continue-game"),
    backTitle: $("#creation-back"),
    name: $("#dao-name"),
    pathList: $("#path-list"),
    topChapter: $("#top-chapter"),
    topDay: $("#top-day"),
    sceneArt: $("#scene-art"),
    storyScroll: $("#story-scroll"),
    chapterPill: $("#chapter-pill"),
    locationLabel: $("#location-label"),
    narrative: $("#narrative"),
    choices: $("#choices"),
    hudRealm: $("#hud-realm"),
    hudHp: $("#hud-hp"),
    hudQi: $("#hud-qi"),
    hudQuest: $("#hud-quest"),
    studyDock: $("#study-dock"),
    studyDockGlyph: $("#study-dock-glyph"),
    studyDockTitle: $("#study-dock-title"),
    studyDockProgress: $("#study-dock-progress"),
    innerView: $("#inner-view"),
    journey: $("#journey"),
    gameMenu: $("#game-menu"),
    quickSave: $("#quick-save"),
    titleSound: $("#title-sound"),
    modalLayer: $("#modal-layer"),
    toastStack: $("#toast-stack")
  };

  const audio = {
    enabled: localStorage.getItem("taixuan-sound") !== "off",
    ctx: null,
    ensure() {
      if (!this.enabled) return null;
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        this.ctx = new Ctx();
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },
    tone(freq, duration, type, gain) {
      const ctx = this.ensure();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      vol.gain.setValueAtTime(gain || 0.03, ctx.currentTime);
      vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(vol).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    },
    play(kind) {
      if (kind === "success") this.tone(660, 0.22, "sine", 0.035);
      if (kind === "fail") this.tone(180, 0.28, "sawtooth", 0.025);
      if (kind === "hit") this.tone(110, 0.2, "square", 0.035);
      if (kind === "breakthrough") {
        this.tone(523, 0.22, "sine", 0.03);
        setTimeout(() => this.tone(784, 0.32, "sine", 0.025), 90);
      }
      if (kind === "save") this.tone(880, 0.12, "sine", 0.02);
    }
  };

  let state = null;
  let battle = null;
  let pendingNext = null;
  let modalOpen = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function interpolate(text) {
    if (!state || !text) return text || "";
    const path = PATHS[state.path];
    return text
      .replaceAll("{name}", state.name)
      .replaceAll("{path}", path.name)
      .replaceAll("{book}", COURSES[path.course].book)
      .replaceAll("{skill}", path.skill.name);
  }

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function defaultStudy() {
    return {
      data: { unlocked: 1, cleared: [], mastered: [], cursor: {} },
      os: { unlocked: 1, cleared: [], mastered: [], cursor: {} },
      net: { unlocked: 1, cleared: [], mastered: [], cursor: {} },
      arch: { unlocked: 1, cleared: [], mastered: [], cursor: {} }
    };
  }

  function ensureStudyProgress(courseKey) {
    const progress = state.study[courseKey] || { unlocked: 1, cleared: [] };
    if (!Array.isArray(progress.cleared)) progress.cleared = [];
    if (!Array.isArray(progress.mastered)) progress.mastered = [];
    if (!progress.cursor) progress.cursor = {};
    state.study[courseKey] = progress;
    return progress;
  }

  function curriculumChapter(courseKey, chapter) {
    const chapters = (window.CURRICULUM && window.CURRICULUM[courseKey]) || [];
    return chapters.find((item) => item.chapter === chapter) || { chapter, name: "", items: [] };
  }

  function createState(name, pathKey) {
    const path = PATHS[pathKey];
    const stats = path.stats;
    const mastery = { data: 4, os: 4, net: 4, arch: 4 };
    mastery[path.course] = 18;
    return {
      version: 4,
      name: name || "林砚",
      path: pathKey,
      course: path.course,
      soul: stats.soul,
      body: stats.body,
      insight: stats.insight,
      fate: stats.fate,
      hp: 80 + stats.body * 4,
      qi: 50 + stats.soul * 4,
      cultivation: 0,
      reputation: 0,
      mastery,
      study: defaultStudy(),
      relations: { shen: 2, lu: 2, su: 2, mo: 3 },
      inventory: { "灵石": 30, "回气丹": 2, "醒神散": 1 },
      flags: {},
      day: 1,
      current: "prologue",
      chapter: 0,
      ending: null,
      kills: 0,
      reviveUsed: false,
      history: []
    };
  }

  function maxHp() {
    return 80 + state.body * 4;
  }

  function maxQi() {
    return 50 + state.soul * 4;
  }

  function realmIndex() {
    let index = 0;
    for (let i = 0; i < REALMS.length; i += 1) {
      if (state.cultivation >= REALMS[i].min) index = i;
    }
    return index;
  }

  function realm() {
    return REALMS[realmIndex()];
  }

  function nextRealm() {
    const next = REALMS[realmIndex() + 1];
    return next || null;
  }

  function applyEffects(effects) {
    const gains = [];
    if (!effects) return gains;
    const oldRealm = realmIndex();
    effects.forEach((effect) => {
      if (effect.type === "add") {
        const field = effect.field;
        const value = Number(effect.value || 0);
        let before = 0;
        if (field === "hp") before = state.hp;
        if (field === "qi") before = state.qi;
        if (field === "cultivation") before = state.cultivation;
        if (field === "reputation") before = state.reputation;
        if (field === "soul") before = state.soul;
        if (field === "body") before = state.body;
        if (field === "insight") before = state.insight;
        if (field === "fate") before = state.fate;
        if (field.startsWith("mastery.")) before = state.mastery[field.split(".")[1]];
        if (field.startsWith("relations.")) before = state.relations[field.split(".")[1]];

        if (field === "hp") state.hp = clamp(state.hp + value, 1, maxHp());
        else if (field === "qi") state.qi = clamp(state.qi + value, 0, maxQi());
        else if (field === "cultivation") state.cultivation = Math.max(0, state.cultivation + value);
        else if (field === "reputation") state.reputation = Math.max(0, state.reputation + value);
        else if (field === "soul") state.soul = Math.max(1, state.soul + value);
        else if (field === "body") state.body = Math.max(1, state.body + value);
        else if (field === "insight") state.insight = Math.max(1, state.insight + value);
        else if (field === "fate") state.fate = Math.max(1, state.fate + value);
        else if (field.startsWith("mastery.")) {
          const key = field.split(".")[1];
          state.mastery[key] = clamp(state.mastery[key] + value, 0, 100);
        } else if (field.startsWith("relations.")) {
          const key = field.split(".")[1];
          state.relations[key] = clamp(state.relations[key] + value, 0, 20);
        } else if (field === "day") state.day = Math.max(1, state.day + value);

        if (field === "hp" && value > 0) gains.push(`气血 +${value}`);
        if (field === "hp" && value < 0) gains.push(`气血 ${value}`);
        if (field === "qi" && value > 0) gains.push(`灵气 +${value}`);
        if (field === "qi" && value < 0) gains.push(`灵气 ${value}`);
        if (field === "cultivation" && value > 0) gains.push(`修为 +${value}`);
        if (field === "reputation" && value > 0) gains.push(`声望 +${value}`);
        if (field === "soul" && value > 0) gains.push(`神魂 +${value}`);
        if (field === "body" && value > 0) gains.push(`体魄 +${value}`);
        if (field === "insight" && value > 0) gains.push(`悟性 +${value}`);
        if (field === "fate" && value > 0) gains.push(`气运 +${value}`);
        if (field.startsWith("mastery.") && value > 0) gains.push(`${COURSES[field.split(".")[1]].short} +${value}`);
        if (field.startsWith("relations.") && value > 0) gains.push(`${CHARACTERS[field.split(".")[1]].name} 好感 +${value}`);
        void before;
      } else if (effect.type === "item") {
        state.inventory[effect.name] = (state.inventory[effect.name] || 0) + (effect.value || 1);
        gains.push(`获得「${effect.name}」×${effect.value || 1}`);
      } else if (effect.type === "removeItem") {
        state.inventory[effect.name] = Math.max(0, (state.inventory[effect.name] || 0) - (effect.value || 1));
      } else if (effect.type === "flag") {
        state.flags[effect.flag] = effect.value !== false;
      }
    });

    if (realmIndex() > oldRealm) {
      toast(`${realm().name} · ${realm().line}`, "breakthrough");
      audio.play("breakthrough");
    }
    return gains;
  }

  function effectToClass(value) {
    return Number(value) < 0 ? "stat-loss" : "stat-gain";
  }

  function evaluateCheck(check) {
    if (!check) return { passed: true, label: "" };
    let chance = 0.55;
    let label = "";
    if (check.type === "mastery") {
      const course = check.course || state.course;
      const mastery = state.mastery[course] + (course === state.course ? 6 : 0);
      chance = clamp(0.34 + (mastery - check.difficulty) / 46 + state.fate * 0.025, 0.18, 0.95);
      label = `${COURSES[course].short}·${mastery}`;
    } else if (check.type === "path") {
      const mastery = state.mastery[state.course] + 8;
      chance = clamp(0.36 + (mastery - check.difficulty) / 42 + state.fate * 0.025, 0.2, 0.95);
      label = `本命·${mastery}`;
    } else if (check.type === "combined") {
      const mastery = (check.courses.reduce((sum, course) => sum + state.mastery[course], 0) / check.courses.length) + 4;
      chance = clamp(0.34 + (mastery - check.difficulty) / 48 + state.fate * 0.025, 0.18, 0.95);
      label = "四法合流";
    } else if (check.type === "attribute") {
      const attr = state[check.attr] || 1;
      chance = clamp(0.35 + (attr - check.difficulty) / 32 + state.fate * 0.025, 0.15, 0.95);
      label = ["soul", "body", "insight", "fate"].includes(check.attr) ? ({ soul: "神魂", body: "体魄", insight: "悟性", fate: "气运" }[check.attr]) : "道基";
    } else if (check.type === "fate") {
      chance = clamp(0.4 + state.fate * 0.09 + (check.difficulty ? -check.difficulty * 0.02 : 0), 0.2, 0.9);
      label = "气运";
    } else if (check.type === "relation") {
      chance = (state.relations[check.char] || 0) >= (check.min || 1) ? 1 : 0;
      label = `${CHARACTERS[check.char].name} 好感`;
    } else if (check.type === "flag") {
      chance = state.flags[check.flag] ? 1 : 0;
      label = "机缘";
    } else if (check.type === "item") {
      chance = (state.inventory[check.item] || 0) > 0 ? 1 : 0;
      label = `持有「${check.item}」`;
    } else if (check.type === "random") {
      chance = check.chance || 0.5;
      label = "天命";
    }
    return { passed: Math.random() <= chance, label };
  }

  function choiceKicker(choice) {
    return choice.kicker ? interpolate(choice.kicker) : "";
  }

  function questionBank(courseKey) {
    return (window.QUESTION_BANK && window.QUESTION_BANK[courseKey]) || [];
  }

  function currentStudyChapter(courseKey) {
    const bank = questionBank(courseKey);
    const unlocked = state.study[courseKey]?.unlocked || 1;
    return clamp(unlocked, 1, bank.length);
  }

  function bestOtherCourse() {
    const courses = Object.keys(COURSES).filter((key) => key !== state.course);
    return courses.reduce((best, key) => (state.mastery[key] > state.mastery[best] ? key : best), courses[0]);
  }

  function askQuestion(courseKey, chapter, onComplete) {
    const course = COURSES[courseKey];
    const bank = questionBank(courseKey);
    const chapterData = bank.find((item) => item.chapter === chapter) || bank[0];
    if (!chapterData || !chapterData.questions.length) {
      onComplete(true);
      return;
    }
    const question = chapterData.questions[rand(0, chapterData.questions.length - 1)];
    const letters = ["A", "B", "C", "D"];
    const options = question.options.map((option, index) => `
      <button class="option-row" type="button" data-option="${index}">
        <span class="option-key">${letters[index]}</span>
        <span>${option}</span>
      </button>`).join("");

    openModal(`${course.short} · 第${chapter}章`, `
      <div class="question-meta" style="--course-color:${course.color}">
        <span class="question-badge">${course.glyph} · 真题式推演</span>
        <span class="question-source">王道 2026 笔记 / 408 真题改编</span>
      </div>
      <p class="question-text">${question.q}</p>
      <div class="option-list">${options}</div>
      <div class="question-answer is-hidden" id="question-answer"></div>
      <button class="primary-button question-continue is-hidden" id="question-continue" type="button">印证此题</button>`);

    let answered = false;
    let correctAnswer = false;
    els.modalLayer.querySelectorAll(".option-row").forEach((button) => {
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const selected = Number(button.dataset.option);
        const correct = selected === question.answer;
        correctAnswer = correct;
        els.modalLayer.querySelectorAll(".option-row").forEach((item) => {
          item.disabled = true;
          const index = Number(item.dataset.option);
          if (index === question.answer) item.classList.add("is-correct");
          if (index === selected && !correct) item.classList.add("is-wrong");
        });
        const answer = els.modalLayer.querySelector("#question-answer");
        answer.classList.remove("is-hidden");
        answer.classList.add(correct ? "correct" : "wrong");
        answer.innerHTML = `<strong>${correct ? "道行印证" : "推演失准"}</strong> · ${question.explain}`;
        els.modalLayer.querySelector("#question-continue").classList.remove("is-hidden");
        audio.play(correct ? "success" : "fail");
      });
    });
    els.modalLayer.querySelector("#question-continue").addEventListener("click", () => {
      closeModal();
      onComplete(correctAnswer);
    });
  }

  function completeStudyAnswer(courseKey, chapter, correct) {
    const bank = questionBank(courseKey);
    const progress = ensureStudyProgress(courseKey);
    const lesson = curriculumChapter(courseKey, chapter);
    const mastered = new Set(progress.mastered);
    const remaining = lesson.items.filter((item) => !mastered.has(item.id)).length;
    if (correct) {
      if (remaining > 0) {
        toast(`尚有 ${remaining} 个知识点未完成，章节暂不解锁。`, "bad");
        setTimeout(() => openLesson(courseKey, chapter), 240);
        return;
      }
      state.mastery[courseKey] = clamp(state.mastery[courseKey] + 6, 0, 100);
      state.cultivation += 4;
      if (!progress.cleared.includes(chapter)) progress.cleared.push(chapter);
      if (progress.unlocked === chapter && chapter < bank.length) progress.unlocked = chapter + 1;
      toast(`${COURSES[courseKey].short}第${chapter}章悟通，下一章天书已解。`, "breakthrough");
      audio.play("breakthrough");
    } else {
      state.mastery[courseKey] = clamp(state.mastery[courseKey] + 2, 0, 100);
      toast("道纹倒转，再参一遍。", "bad");
    }
    save();
    updateHUD();
    setTimeout(() => openStudy(courseKey), 240);
  }

  function openStudy(courseKey) {
    const course = COURSES[courseKey];
    const bank = questionBank(courseKey);
    const progress = ensureStudyProgress(courseKey);
    const mastered = new Set(progress.mastered);
    const chapters = bank.map((item) => {
      const locked = item.chapter > progress.unlocked;
      const cleared = progress.cleared.includes(item.chapter);
      const lesson = curriculumChapter(courseKey, item.chapter);
      const learned = lesson.items.filter((point) => mastered.has(point.id)).length;
      const allLearned = lesson.items.length > 0 && learned === lesson.items.length;
      const stateText = cleared ? "已悟" : locked ? "未解锁" : allLearned ? "章节考核" : `${learned}/${lesson.items.length} 知识点`;
      return `
        <button class="chapter-row ${locked ? "is-locked" : ""} ${cleared ? "is-cleared" : ""}" type="button" data-chapter="${item.chapter}" ${locked ? "disabled" : ""} style="--course-color:${course.color}">
          <span class="chapter-num">${item.chapter}</span>
          <span class="chapter-copy"><strong>第${item.chapter}章 · ${item.name}</strong><small>${item.topic || course.concept}</small></span>
          <span class="chapter-state">${stateText}</span>
        </button>`;
    }).join("");
    openModal(`《${course.book}》· 悟道`, `
      <p class="study-intro">以学习为主：逐条研读原文知识，全部掌握后完成章节检测，才能解锁下一章。</p>
      <div class="chapter-list">${chapters}</div>`);
    els.modalLayer.querySelectorAll(".chapter-row:not(.is-locked)").forEach((button) => {
      button.addEventListener("click", () => {
        const chapter = Number(button.dataset.chapter);
        closeModal();
        const lesson = curriculumChapter(courseKey, chapter);
        const learned = new Set(progress.mastered);
        const allLearned = lesson.items.length > 0 && lesson.items.every((item) => learned.has(item.id));
        setTimeout(() => {
          if (allLearned) askQuestion(courseKey, chapter, (correct) => completeStudyAnswer(courseKey, chapter, correct));
          else openLesson(courseKey, chapter);
        }, 200);
      });
    });
  }

  function openLesson(courseKey, chapter, requestedIndex) {
    const course = COURSES[courseKey];
    const lesson = curriculumChapter(courseKey, chapter);
    const progress = ensureStudyProgress(courseKey);
    const mastered = new Set(progress.mastered);
    if (!lesson.items.length) {
      openModal(`${course.short} · 第${chapter}章`, `<p class="study-intro">来源汇总页未展开本章正文，暂不计为已覆盖。</p>`);
      return;
    }
    const firstUnmastered = lesson.items.findIndex((item) => !mastered.has(item.id));
    const saved = Number(progress.cursor[chapter] || 0);
    const index = clamp(Number.isFinite(requestedIndex) ? requestedIndex : (firstUnmastered >= 0 ? firstUnmastered : saved), 0, lesson.items.length - 1);
    progress.cursor[chapter] = index;
    const point = lesson.items[index];
    const isMastered = mastered.has(point.id);
    const learnedCount = lesson.items.filter((item) => mastered.has(item.id)).length;
    openModal(`${course.short} · 第${chapter}章`, `
      <div class="lesson-progress"><span>${escapeHtml(point.section)} · ${escapeHtml(point.subsection)}</span><strong>${learnedCount}/${lesson.items.length}</strong></div>
      <div class="lesson-meter"><i style="width:${(learnedCount / lesson.items.length) * 100}%"></i></div>
      <article class="lesson-card" style="--course-color:${course.color}">
        <small>知识点 ${index + 1} / ${lesson.items.length}</small>
        <h4>${escapeHtml(point.prompt)}</h4>
        <label class="lesson-input-label" for="lesson-input">填写空缺</label>
        <textarea id="lesson-input" class="lesson-input" rows="3" autocomplete="off" placeholder="在这里输入答案"></textarea>
        <div id="point-answer" class="point-answer is-hidden">
          <span>你的答案</span><p id="learner-answer"></p>
          <span>参考填空</span><p>${escapeHtml(point.answer || point.text)}</p>
          <span>原文全文</span><p>${escapeHtml(point.text)}</p>
        </div>
      </article>
      <div class="lesson-nav">
        <button id="lesson-prev" class="ghost-button" type="button" ${index === 0 ? "disabled" : ""}>上一条</button>
        <button id="lesson-later" class="ghost-button" type="button">稍后复习</button>
        <button id="lesson-check" class="primary-button" type="button">核对答案</button>
        <button id="lesson-master" class="primary-button is-hidden" type="button">${isMastered ? "已掌握 · 下一条" : "答对了 · 继续"}</button>
      </div>`);
    const reopen = (nextIndex) => {
      progress.cursor[chapter] = clamp(nextIndex, 0, lesson.items.length - 1);
      save();
      closeModal();
      setTimeout(() => openLesson(courseKey, chapter, progress.cursor[chapter]), 120);
    };
    els.modalLayer.querySelector("#lesson-check").addEventListener("click", (event) => {
      const input = els.modalLayer.querySelector("#lesson-input");
      const learnerAnswer = input.value.trim();
      if (!learnerAnswer) {
        input.focus();
        toast("请先填写空缺，再核对答案。", "bad");
        return;
      }
      els.modalLayer.querySelector("#learner-answer").textContent = learnerAnswer;
      els.modalLayer.querySelector("#point-answer").classList.remove("is-hidden");
      els.modalLayer.querySelector("#lesson-master").classList.remove("is-hidden");
      input.disabled = true;
      event.currentTarget.classList.add("is-hidden");
    });
    els.modalLayer.querySelector("#lesson-prev").addEventListener("click", () => reopen(index - 1));
    els.modalLayer.querySelector("#lesson-later").addEventListener("click", () => reopen((index + 1) % lesson.items.length));
    els.modalLayer.querySelector("#lesson-master").addEventListener("click", () => {
      if (!mastered.has(point.id)) progress.mastered.push(point.id);
      const complete = progress.mastered.filter((id) => id.startsWith(`${courseKey}-${chapter}-`)).length >= lesson.items.length;
      save();
      updateHUD();
      closeModal();
      if (complete) {
        toast("本章知识点已全部研读，进入章节检测。", "breakthrough");
        setTimeout(() => askQuestion(courseKey, chapter, (correct) => completeStudyAnswer(courseKey, chapter, correct)), 220);
      } else {
        setTimeout(() => openLesson(courseKey, chapter, (index + 1) % lesson.items.length), 120);
      }
    });
  }

  function renderPathCards() {
    els.pathList.innerHTML = "";
    Object.values(PATHS).forEach((path) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "path-card";
      card.style.setProperty("--path-color", path.color);
      card.innerHTML = `
        <span class="path-emblem">${path.glyph}</span>
        <span class="path-copy">
          <strong>${path.name}</strong>
          <small>${COURSES[path.course].name} · 《${path.book}》</small>
          <em>${path.intro}</em>
        </span>
        ${ICONS.chevron}
      `;
      card.addEventListener("click", () => beginGame(path.key));
      els.pathList.appendChild(card);
    });
  }

  function showScreen(screen) {
    [els.title, els.creation, els.game].forEach((item) => item.classList.remove("active"));
    screen.classList.add("active");
  }

  function startCreation() {
    renderPathCards();
    showScreen(els.creation);
  }

  function beginGame(pathKey) {
    state = createState(els.name.value.trim(), pathKey);
    battle = null;
    showScreen(els.game);
    save();
    go("prologue");
    audio.play("save");
  }

  function snapshot() {
    return JSON.parse(JSON.stringify({ ...state, history: [] }));
  }

  function save() {
    if (!state) return;
    try {
      const snapshotData = snapshot();
      snapshotData.history = [];
      localStorage.setItem(SAVE_KEY, JSON.stringify(snapshotData));
    } catch (error) {
      console.warn("Save failed", error);
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.current) return null;
      if (!parsed.study || Number(parsed.version || 0) < 4) parsed.study = defaultStudy();
      parsed.version = 4;
      Object.keys(COURSES).forEach((courseKey) => {
        const progress = parsed.study[courseKey] || { unlocked: 1, cleared: [] };
        if (!Array.isArray(progress.cleared)) progress.cleared = [];
        if (!Array.isArray(progress.mastered)) progress.mastered = [];
        if (!progress.cursor) progress.cursor = {};
        parsed.study[courseKey] = progress;
      });
      parsed.history = [];
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function updateMeta() {
    const chapter = CHAPTERS[state.chapter] || CHAPTERS[0];
    const node = STORY[state.current] || {};
    els.topChapter.textContent = chapter.title;
    els.topDay.textContent = `第${state.day}日 · ${chapter.short}`;
    els.chapterPill.textContent = chapter.title;
    els.locationLabel.textContent = node.location || "";
    els.hudQuest.textContent = chapter.short;
    document.title = `${chapter.short} · 源代码：四法问仙`;
  }

  function updateHUD() {
    const hpValue = Math.max(1, state.hp);
    const hpMax = maxHp();
    const qiValue = state.qi;
    const qiMax = maxQi();
    els.hudRealm.textContent = realm().name;
    els.hudHp.textContent = `${hpValue}/${hpMax}`;
    els.hudQi.textContent = `${qiValue}/${qiMax}`;
    const course = COURSES[state.course];
    const bank = questionBank(state.course);
    const progress = ensureStudyProgress(state.course);
    const activeChapter = clamp(progress.unlocked || 1, 1, Math.max(1, bank.length));
    const lesson = curriculumChapter(state.course, activeChapter);
    const learned = lesson.items.filter((item) => progress.mastered.includes(item.id)).length;
    els.studyDock.style.setProperty("--course-color", course.color);
    els.studyDockGlyph.textContent = course.glyph;
    els.studyDockTitle.textContent = `${course.short} · 第${activeChapter}章`;
    els.studyDockProgress.textContent = lesson.items.length ? `${learned}/${lesson.items.length}` : "待补全";
  }

  function storyTextHtml(text) {
    const paragraphs = interpolate(text).split(/\n\n+/);
    return paragraphs.map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`).join("");
  }

  function renderSpeaker(speakerKey) {
    const speaker = SPEAKERS[speakerKey] || SPEAKERS.narrator;
    const name = speakerKey === "protag" && state ? state.name : speaker.name;
    return `
      <div class="speaker-line">
        <span class="speaker-name">${name}</span>
        <span class="speaker-role">${speaker.role}</span>
      </div>`;
  }

  function renderNode() {
    const node = STORY[state.current];
    if (!node) {
      showScreen(els.title);
      return;
    }
    const accent = PATHS[state.path].color;
    els.sceneArt.innerHTML = sceneArt(node.scene || "mountain", accent);
    updateMeta();
    updateHUD();

    els.narrative.innerHTML = `
      ${renderSpeaker(node.speaker || "narrator")}
      <h2 class="story-title">${interpolate(node.title || "")}</h2>
      <div class="story-text">${storyTextHtml(node.text || "")}</div>`;

    els.choices.innerHTML = "";
    pendingNext = null;

    if (node.ending) {
      renderEnding(node);
    } else if (node.battle) {
      startBattle(node);
    } else if (Array.isArray(node.choices) && node.choices.length) {
      node.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-button";
        button.dataset.check = choice.check ? "true" : "false";
        button.innerHTML = `${interpolate(choice.text)}${choiceKicker(choice) ? `<span class="choice-kicker">${choiceKicker(choice)}</span>` : ""}`;
        button.addEventListener("click", () => resolveChoice(node, choice));
        els.choices.appendChild(button);
      });
    } else if (node.next) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "next-button";
      button.textContent = "继续";
      button.addEventListener("click", () => go(node.next));
      els.choices.appendChild(button);
    }

    setTimeout(() => {
      els.storyScroll.scrollTop = 0;
    }, 0);
  }

  function renderEnding(node) {
    state.ending = node.ending;
    const label = { ascend: "飞升合道", guard: "人间守道", destroy: "万法归凡", death: "此世道陨" }[node.ending] || "终章";
    const actions = document.createElement("div");
    actions.className = "choices";
    actions.innerHTML = `
      <div class="result-card success">
        <span class="result-label">${label}</span>
        本次道途已尽。四法修成：阵 ${state.mastery.data}，剑 ${state.mastery.os}，符 ${state.mastery.net}，器 ${state.mastery.arch}。
      </div>
      <button class="primary-button" type="button" style="width:100%;margin-top:10px">重入轮回</button>
    `;
    actions.querySelector("button").addEventListener("click", () => {
      localStorage.removeItem(SAVE_KEY);
      state = null;
      battle = null;
      els.continueGame.classList.add("is-hidden");
      showScreen(els.title);
    });
    els.choices.appendChild(actions);
  }

  function resolveChoice(node, choice) {
    const outcome = evaluateCheck(choice.check);
    let result;
    if (choice.check) {
      result = outcome.passed ? choice.success : choice.failure;
    } else {
      result = { text: choice.resultText || "", next: choice.next, effects: choice.effects || [] };
    }
    if (!result) {
      result = { text: "此路不通。", next: node.next };
    }
    const gains = applyEffects(result.effects || []);
    if (choice.check) audio.play(outcome.passed ? "success" : "fail");
    els.choices.innerHTML = "";

    const card = document.createElement("div");
    card.className = `result-card ${outcome.passed ? "success" : "failure"}`;
    const gainsHtml = gains.length ? `<span>${gains.map((gain) => `<i class="${effectToClass(gain.includes("+") ? 1 : -1)}">${gain}</i>`).join("")}</span>` : "";
    card.innerHTML = `<span class="result-label">${outcome.passed ? "道行印证" : "受挫"}</span>${interpolate(result.text)}${gainsHtml}`;
    els.choices.appendChild(card);

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "next-button";
    nextButton.textContent = "继续";
    nextButton.addEventListener("click", () => go(result.next));
    els.choices.appendChild(nextButton);
    pendingNext = result.next;
    updateHUD();
  }

  function go(nextId) {
    if (!nextId) {
      renderNode();
      return;
    }
    const previous = snapshot();
    state.history.push(previous);
    state.history = state.history.slice(-25);
    state.current = nextId;
    const node = STORY[nextId];
    if (node && node.chapter !== undefined) state.chapter = node.chapter;
    if (node && node.ending) state.ending = node.ending;
    if (node && node.onEnter) applyEffects(node.onEnter);
    save();
    renderNode();
  }

  function undo() {
    if (!state || !state.history.length) {
      toast("还没有可悔的一步。");
      return;
    }
    const previous = state.history.pop();
    state = { ...previous, history: state.history };
    battle = null;
    save();
    renderNode();
    toast("道心逆转，回到上一步。");
  }

  /* Battle */

  function startBattle(node) {
    const config = node.battle;
    battle = {
      node,
      enemy: { ...config.enemy },
      hp: config.enemy.hp,
      turn: 1,
      over: false,
      log: [interpolate(config.intro || `${config.enemy.name}挡住了去路。`)]
    };
    renderBattle();
  }

  function renderBattle() {
    els.choices.innerHTML = "";
    const enemy = battle.enemy;
    const hpMaxEnemy = enemy.hp;
    const playerHpMax = maxHp();
    const wrap = document.createElement("div");
    wrap.className = "battle-wrap";
    wrap.innerHTML = `
      <div class="battle-stage">
        <div class="combatant">
          <div class="combatant-avatar">${PATHS[state.path].glyph}</div>
          <strong>${state.name}</strong>
          <span>${realm().name} · ${PATHS[state.path].name}</span>
          <div class="healthbar"><i style="width:${clamp((state.hp / playerHpMax) * 100, 0, 100)}%"></i></div>
        </div>
        <div class="versus">对</div>
        <div class="combatant">
          <div class="combatant-avatar enemy-avatar">${enemy.glyph}</div>
          <strong>${enemy.name}</strong>
          <span>${enemy.title}</span>
          <div class="healthbar enemy"><i style="width:${clamp((battle.hp / hpMaxEnemy) * 100, 0, 100)}%"></i></div>
        </div>
      </div>
      <div class="battle-log"></div>
      <div class="battle-actions">
        <button class="battle-action" data-action="sword">本命法剑</button>
        <button class="battle-action" data-action="skill">${PATHS[state.path].skill.name}</button>
        <button class="battle-action" data-action="guard">调息御气</button>
        <button class="battle-action" data-action="pill">回气丹 ×${state.inventory["回气丹"] || 0}</button>
        <button class="battle-action" data-action="cross">四法轮转</button>
        <button class="battle-action" data-action="flee">${battle.node.id === "boss_before" ? "生死一搏" : "且战且退"}</button>
      </div>
    `;
    wrap.querySelectorAll(".battle-action").forEach((button) => {
      button.addEventListener("click", () => battleAction(button.dataset.action));
    });
    els.choices.appendChild(wrap);
    updateBattleUI(wrap);
  }

  function battleLog(text, className) {
    battle.log.push(text);
    battle.log = battle.log.slice(-8);
    const wrap = $(".battle-wrap");
    if (wrap) updateBattleLog(wrap);
    void className;
  }

  function updateBattleLog(wrap) {
    const log = wrap.querySelector(".battle-log");
    if (log) log.innerHTML = battle.log.map((line) => `<p>${line}</p>`).join("");
  }

  function updateBattleUI(wrap) {
    if (!wrap) return;
    const hpMaxEnemy = battle.enemy.hp;
    const playerHpMax = maxHp();
    const enemyBar = wrap.querySelector(".healthbar.enemy i");
    const playerBar = wrap.querySelector(".healthbar:not(.enemy) i");
    if (enemyBar) enemyBar.style.width = `${clamp((battle.hp / hpMaxEnemy) * 100, 0, 100)}%`;
    if (playerBar) playerBar.style.width = `${clamp((state.hp / playerHpMax) * 100, 0, 100)}%`;
    updateBattleLog(wrap);
  }

  function battleAction(action) {
    if (!battle || battle.over) return;
    const enemy = battle.enemy;

    if (action === "skill") {
      const cost = PATHS[state.path].skill.cost;
      if (state.qi < cost) {
        battleLog("灵气不足，你只能先吐纳一口。");
        audio.play("fail");
        return;
      }
    } else if (action === "cross") {
      if (state.qi < 8) {
        battleLog("灵气不足，无法运转四法。");
        audio.play("fail");
        return;
      }
    } else if (action === "guard") {
      state.qi = clamp(state.qi + 10, 0, maxQi());
      battleLog("你抱元守一，灵台清明，灵气 +10。");
      battle.turn += 1;
      updateHUD();
      updateBattleUI($(".battle-wrap"));
      return;
    } else if (action === "pill") {
      if ((state.inventory["回气丹"] || 0) < 1) {
        battleLog("行囊里已经没有回气丹。");
        return;
      }
      state.inventory["回气丹"] -= 1;
      const heal = Math.round(30 + state.body / 4);
      state.hp = clamp(state.hp + heal, 1, maxHp());
      battleLog(`你服下回气丹，气血恢复 ${heal}。`);
      battle.turn += 1;
      updateHUD();
      updateBattleUI($(".battle-wrap"));
      return;
    } else if (action === "flee") {
      if (battle.node.id === "boss_before") {
        battleLog("退路已断。此战，只能生死一搏。");
        return;
      }
      battle.over = true;
      state.reputation = Math.max(0, state.reputation - 3);
      const fallback = state.history[state.history.length - 1]?.current || "village";
      go(fallback);
      return;
    }

    const course = action === "cross" ? bestOtherCourse() : state.course;
    const chapter = currentStudyChapter(course);
    battleLog(`你凝神推演《${COURSES[course].book}》第${chapter}章，天书道纹在眼前展开……`);
    updateBattleUI($(".battle-wrap"));
    askQuestion(course, chapter, (correct) => finishBattleAction(action, course, correct));
  }

  function finishBattleAction(action, course, correct) {
    if (!battle || battle.over) return;
    const enemy = battle.enemy;
    if (!correct) {
      state.qi = Math.max(0, state.qi - 5);
      battleLog("题解有误，法诀走岔，灵气逆涌反噬。");
      updateHUD();
      updateBattleUI($(".battle-wrap"));
      enemyTurn(false);
      return;
    }

    let damage = 0;
    let cost = 0;
    let message = "";
    if (action === "sword") {
      damage = Math.round(7 + state.mastery[course] / 5 + state.body / 5 + rand(-1, 3));
      message = `天书印证无误，你以《${COURSES[course].book}》之法出剑，${enemy.name}受创 `;
    } else if (action === "skill") {
      cost = PATHS[state.path].skill.cost;
      damage = Math.round(14 + state.mastery[course] / 4 + state.soul / 5 + rand(0, 5));
      message = `${PATHS[state.path].skill.name}！题解入道，道痕横贯，${enemy.name}受创 `;
    } else if (action === "cross") {
      cost = 8;
      damage = Math.round(8 + state.mastery[course] / 5 + state.insight / 6 + rand(-1, 4));
      message = `四法轮转，借《${COURSES[course].book}》之力，伤敌 `;
    }
    if (state.qi < cost) {
      battleLog("灵气不足，法诀尚未成形。");
      audio.play("fail");
      return;
    }
    state.qi -= cost;
    damage = Math.round(damage * 1.18);
    if (enemy.weak === course) damage = Math.round(damage * 1.45);
    battle.hp -= damage;
    state.mastery[course] = clamp(state.mastery[course] + 1, 0, 100);
    battleLog(`${message}${damage}。`);
    audio.play("hit");

    updateHUD();
    const wrap = $(".battle-wrap");
    updateBattleUI(wrap);

    if (battle.hp <= 0) {
      battle.over = true;
      state.kills += 1;
      state.qi = clamp(state.qi + 6, 0, maxQi());
      battleLog(`${enemy.name}化作漫天符文，消散于风中。`);
      const victory = battle.node.battle.victory;
      setTimeout(() => go(victory), 520);
      return;
    }

    enemyTurn(false);
  }

  function enemyTurn(defending) {
    const enemy = battle.enemy;
    let min = enemy.atk[0];
    let max = enemy.atk[1];
    let moveText = `${enemy.name}携黑气扑来。`;
    const heavy = battle.turn % 3 === 0;
    if (heavy) {
      min = Math.round(enemy.atk[1] * 0.9);
      max = Math.round(enemy.atk[1] * 1.25);
      moveText = `${enemy.name}怒喝一声，魔气凝成巨爪！`;
    }
    let damage = rand(min, max);
    if (defending) damage = Math.max(1, Math.round(damage * 0.45));
    state.hp -= damage;
    if (defending) state.qi = clamp(state.qi + 3, 0, maxQi());
    battleLog(`${moveText}你损失气血 ${damage}。`);
    updateHUD();
    const wrap = $(".battle-wrap");
    updateBattleUI(wrap);
    audio.play("fail");
    if (state.hp <= 0) {
      handlePlayerDown();
      return;
    }
    battle.turn += 1;
  }

  function handlePlayerDown() {
    battle.over = true;
    if (!state.reviveUsed && (state.inventory["护心铜钱"] || 0) > 0) {
      state.inventory["护心铜钱"] -= 1;
      state.reviveUsed = true;
      state.hp = Math.round(maxHp() * 0.5);
      battle.log.push("护心铜钱嗡鸣，替你挡下致命一击。气血恢复。");
      battle.over = false;
      updateHUD();
      const wrap = $(".battle-wrap");
      updateBattleUI(wrap);
      toast("护心铜钱发动，绝境回生。", "good");
      return;
    }
    battleLog("眼前一黑，你栽倒在魔雾之中。");
    const defeat = battle.node.battle.defeat || "game_over";
    setTimeout(() => go(defeat), 520);
  }

  /* Modals */

  function openModal(title, bodyHtml) {
    closeModal(true);
    modalOpen = true;
    els.modalLayer.innerHTML = `
      <div class="modal-backdrop"></div>
      <section class="modal-sheet" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="modal-grab"></div>
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="icon-button modal-close" type="button" aria-label="关闭">${ICONS.close}</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
      </section>`;
    const backdrop = els.modalLayer.querySelector(".modal-backdrop");
    const sheet = els.modalLayer.querySelector(".modal-sheet");
    els.modalLayer.querySelector(".modal-close").addEventListener("click", () => closeModal());
    backdrop.addEventListener("click", () => closeModal());
    setTimeout(() => {
      backdrop.classList.add("show");
      sheet.classList.add("show");
    }, 0);
  }

  function closeModal(silent) {
    if (!silent && !modalOpen && !els.modalLayer.innerHTML) return;
    const backdrop = els.modalLayer.querySelector(".modal-backdrop");
    const sheet = els.modalLayer.querySelector(".modal-sheet");
    if (backdrop && sheet) {
      backdrop.classList.remove("show");
      sheet.classList.remove("show");
    }
    setTimeout(() => {
      if (!els.modalLayer.querySelector(".show")) els.modalLayer.innerHTML = "";
      modalOpen = false;
    }, 190);
  }

  function openGameMenu() {
    const body = `
      <div class="modal-menu-list">
        <button class="menu-row" data-open="courses">${ICONS.book}<span>闭关悟道<b><small>四部天书，按章节逐章晋级</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" data-open="stats">${ICONS.heart}<span>内视<b><small>气血、灵气、境界与四维</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" data-open="relations">${ICONS.people}<span>人物<b><small>同门情谊与旧识</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" data-open="inventory">${ICONS.bag}<span>行囊<b><small>丹、器、灵石与机缘</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" data-open="quest">${ICONS.map}<span>主线<b><small>五章仙途与当前目标</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" data-open="settings">${ICONS.gear}<span>设置<b><small>声音、存档与重开</small></b></span>${ICONS.chevron}</button>
      </div>`;
    openModal("太玄目录", body);
    els.modalLayer.querySelectorAll("[data-open]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.open;
        closeModal();
        setTimeout(() => openPanel(target), 200);
      });
    });
  }

  function openPanel(panel) {
    if (panel === "stats") openStats();
    if (panel === "courses") openCourses();
    if (panel === "relations") openRelations();
    if (panel === "inventory") openInventory();
    if (panel === "quest") openQuest();
    if (panel === "settings") openSettings();
  }

  function statCells() {
    return `
      <div class="stat-grid">
        <div class="stat-cell"><span>境界</span><strong>${realm().name}</strong></div>
        <div class="stat-cell"><span>修为</span><strong>${state.cultivation}</strong></div>
        <div class="stat-cell"><span>神魂</span><strong>${state.soul}</strong></div>
        <div class="stat-cell"><span>体魄</span><strong>${state.body}</strong></div>
        <div class="stat-cell"><span>悟性</span><strong>${state.insight}</strong></div>
        <div class="stat-cell"><span>气运</span><strong>${state.fate}</strong></div>
        <div class="stat-cell"><span>声望</span><strong>${state.reputation}</strong></div>
        <div class="stat-cell"><span>斩魔</span><strong>${state.kills}</strong></div>
      </div>`;
  }

  function realmProgress() {
    const current = REALMS[realmIndex()];
    const next = nextRealm();
    if (!next) return `<div class="progress-row"><div class="progress-head"><span>${current.name}</span><span>已臻极致</span></div><div class="progress-track"><i style="width:100%"></i></div></div>`;
    const percent = clamp(((state.cultivation - current.min) / (next.min - current.min)) * 100, 0, 100);
    return `
      <div class="progress-row">
        <div class="progress-head"><span>${current.name}</span><span>${next.name}还差 ${next.min - state.cultivation}</span></div>
        <div class="progress-track"><i style="width:${percent}%"></i></div>
      </div>
      <div class="progress-row">
        <div class="progress-head"><span>气血 ${state.hp}/${maxHp()}</span><span>灵气 ${state.qi}/${maxQi()}</span></div>
        <div class="progress-track"><i style="width:${clamp((state.hp / maxHp()) * 100, 0, 100)}%;--progress-color:#64d7b0"></i></div>
      </div>`;
  }

  function openStats() {
    openModal("内视", statCells() + realmProgress());
  }

  function openCourses() {
    const rows = Object.keys(COURSES).map((key) => {
      const course = COURSES[key];
      const level = Math.floor(state.mastery[key] / 20) + 1;
      return `
        <button class="course-row" type="button" data-course="${key}" style="--course-color:${course.color}">
          <div class="course-glyph">${course.glyph}</div>
          <div class="course-copy"><strong>${course.name}</strong><small>${course.concept}</small></div>
          <div class="course-level">${state.mastery[key]}</div>
        </button>`;
    }).join("");
    openModal("四部天书", `
      <p class="study-intro">点选一部天书闭关悟道。每一章都对应原文的一章知识点，逐章考校，逐章解锁。</p>
      <div class="course-list">${rows}</div>
      <div class="progress-row">
        <div class="progress-head"><span>本命 · ${PATHS[state.path].name}</span><span>第 ${currentStudyChapter(state.course)} 章</span></div>
        <div class="progress-track"><i style="width:${state.mastery[state.course]}%;--progress-color:${PATHS[state.path].color}"></i></div>
      </div>`);
    els.modalLayer.querySelectorAll("[data-course]").forEach((button) => {
      button.addEventListener("click", () => {
        const courseKey = button.dataset.course;
        closeModal();
        setTimeout(() => openStudy(courseKey), 200);
      });
    });
  }

  function openRelations() {
    const rows = Object.keys(CHARACTERS).map((key) => {
      const person = CHARACTERS[key];
      const value = state.relations[key] || 0;
      const hearts = "♥".repeat(Math.min(5, Math.ceil(value / 4))) + "♡".repeat(Math.max(0, 5 - Math.ceil(value / 4)));
      return `
        <div class="relation-row">
          <div class="relation-avatar" style="color:${person.color}">${person.glyph}</div>
          <div class="relation-copy"><strong>${person.name}</strong><small>${person.title} · ${person.desc}</small></div>
          <div class="relation-hearts">${hearts}</div>
        </div>`;
    }).join("");
    openModal("人物", `<div class="relation-list">${rows}</div>`);
  }

  function openInventory() {
    const entries = Object.entries(state.inventory).filter(([, value]) => value > 0);
    const body = entries.length
      ? `<div class="inventory-grid">${entries.map(([name, value]) => `<div class="item-cell"><span>${name}</span><b>×${value}</b></div>`).join("")}</div>`
      : `<p class="section-intro">行囊空空，去红尘中走一遭吧。</p>`;
    openModal("行囊", body);
  }

  function openQuest() {
    const activeChapter = state.chapter;
    const body = CHAPTERS.map((chapter) => {
      const status = chapter.id < activeChapter ? "done" : chapter.id === activeChapter ? "active" : "";
      const statusText = chapter.id < activeChapter ? "已过" : chapter.id === activeChapter ? "当前" : "未启";
      return `
        <div class="quest-step ${status}">
          <strong>${chapter.title}</strong>
          <span>${chapter.objective} · ${statusText}</span>
        </div>`;
    }).join("");
    openModal("主线", `<div class="quest-timeline">${body}</div>`);
  }

  function openSettings() {
    const soundText = audio.enabled ? "已开启" : "已关闭";
    const body = `
      <div class="modal-menu-list">
        <button class="menu-row" id="toggle-sound">${ICONS.gear}<span>声音<b><small>${soundText}</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" id="undo-step">${ICONS.undo}<span>悔一步<b><small>回到上一段剧情</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" id="manual-save">${ICONS.scroll}<span>立即存档<b><small>保存当前道途</small></b></span>${ICONS.chevron}</button>
        <button class="menu-row" id="confirm-reset">${ICONS.reset}<span class="menu-danger">舍弃此世<b><small>删除存档，重新开始</small></b></span>${ICONS.chevron}</button>
      </div>`;
    openModal("设置", body);
    els.modalLayer.querySelector("#toggle-sound").addEventListener("click", () => {
      audio.enabled = !audio.enabled;
      localStorage.setItem("taixuan-sound", audio.enabled ? "on" : "off");
      closeModal();
      toast(audio.enabled ? "声音已开启。" : "声音已关闭。");
      setTimeout(() => openSettings(), 200);
    });
    els.modalLayer.querySelector("#undo-step").addEventListener("click", () => {
      closeModal();
      undo();
    });
    els.modalLayer.querySelector("#manual-save").addEventListener("click", () => {
      save();
      closeModal();
      toast("道途已存档。", "good");
      audio.play("save");
    });
    els.modalLayer.querySelector("#confirm-reset").addEventListener("click", () => {
      closeModal();
      confirmReset();
    });
  }

  function confirmReset() {
    openModal("舍弃此世", `
      <p class="section-intro">当前存档将被永久删除，无法恢复。你确定要重头再来吗？</p>
      <div class="modal-menu-list" style="margin-top:14px">
        <button class="menu-row" id="reset-yes">${ICONS.reset}<span class="menu-danger">舍弃存档，重入轮回</span>${ICONS.chevron}</button>
        <button class="menu-row" id="reset-no">${ICONS.undo}<span>我再想想</span>${ICONS.chevron}</button>
      </div>`);
    els.modalLayer.querySelector("#reset-yes").addEventListener("click", () => {
      localStorage.removeItem(SAVE_KEY);
      state = null;
      battle = null;
      closeModal();
      els.continueGame.classList.add("is-hidden");
      showScreen(els.title);
    });
    els.modalLayer.querySelector("#reset-no").addEventListener("click", closeModal);
  }

  function toast(message, kind) {
    const node = document.createElement("div");
    node.className = `toast ${kind || ""}`;
    node.textContent = message;
    els.toastStack.appendChild(node);
    setTimeout(() => node.classList.add("show"), 0);
    setTimeout(() => {
      node.classList.remove("show");
      setTimeout(() => node.remove(), 250);
    }, 2300);
  }

  function setupTitle() {
    const saved = load();
    els.continueGame.classList.toggle("is-hidden", !saved);
    els.newGame.addEventListener("click", () => {
      audio.ensure();
      startCreation();
    });
    els.continueGame.addEventListener("click", () => {
      audio.ensure();
      state = saved;
      battle = null;
      showScreen(els.game);
      renderNode();
      toast("前缘已续。", "good");
    });
    els.backTitle.addEventListener("click", () => showScreen(els.title));
    els.titleSound.addEventListener("click", () => {
      audio.ensure();
      audio.enabled = !audio.enabled;
      localStorage.setItem("taixuan-sound", audio.enabled ? "on" : "off");
      els.titleSound.setAttribute("aria-label", audio.enabled ? "关闭音效" : "开启音效");
      toast(audio.enabled ? "声音已开启。" : "声音已关闭。");
    });
  }

  function setupGame() {
    els.gameMenu.addEventListener("click", openGameMenu);
    els.quickSave.addEventListener("click", () => {
      save();
      toast("道途已存档。", "good");
      audio.play("save");
    });
    els.innerView.addEventListener("click", () => openStats());
    els.journey.addEventListener("click", () => openQuest());
    els.studyDock.addEventListener("click", () => openStudy(state.course));
    els.name.addEventListener("input", () => {
      els.name.value = els.name.value.replace(/[^\u4e00-\u9fa5A-Za-z0-9·_-]/g, "");
    });
  }

  setupTitle();
  setupGame();
})();
