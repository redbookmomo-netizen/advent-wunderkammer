// Pixel-exact door coordinates (on 1086 x 1448 original cabinet artwork),
// custom silhouette masks, bespoke animation profiles & collector's lore for all 24 days.

export const CABINET_WIDTH = 1086;
export const CABINET_HEIGHT = 1448;

export const ROMAN = [
  '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV'
];

export const ADVENT_DAYS = [
  {
    day: 1,
    rect: [262, 413, 376, 548],
    shape: 'arch',
    hinge: 'left',
    fxType: 'crystal-rose',
    sfx: 'crystal',
    title: '钟罩冰晶冬青玫瑰',
    subtitle: 'Crystal Holly Rose · 欧泊霜玫',
    actionLabel: '✨ 唤醒冰玫虹彩与霜尘',
    summary: '吹制琉璃钟罩之内，一朵泛着冰蓝与浅绯欧泊虹彩的水晶玫瑰伴着覆霜冬青静静吐曜。',
    lore: '初雪降临黑森林的第一夜，守柜人将一株凝满晨霜的冬青玫瑰封入吹制玻璃钟罩。底座黄铜发条缓缓啮合，两侧小壁灯将暖金烛火投进冰晶花瓣，折射出如极昼冰川般的幽蓝与粉紫微光。'
  },
  {
    day: 2,
    rect: [398, 457, 581, 535],
    shape: 'rect',
    hinge: 'left',
    fxType: 'orrery',
    sfx: 'celestial',
    title: '星月黄道太阳系仪',
    subtitle: 'Moonphase Orrery · 鎏金弦月轨仪',
    actionLabel: '🪐 拨转行星铜环与星芒',
    summary: '雕花黄金弯月怀抱精密黄铜行星齿轮轨仪，穹顶五重月相与深蓝星座金线交相辉映。',
    lore: '中世纪占星师与黑森林钟表匠合造的掌上天球。金色笑面弯月守护着蔚蓝琉璃地球，每当齿轮悄然走过一格，上方拱券的朔望月相便流转一轮，推演着冬至子夜群星归位的时刻。'
  },
  {
    day: 3,
    rect: [602, 435, 709, 557],
    shape: 'arch',
    hinge: 'right',
    fxType: 'snow-owl',
    sfx: 'bird',
    title: '哥特雪松白鸮龛',
    subtitle: 'Snowy Owl · 守夜雪鸮',
    actionLabel: '🦉 点亮琥珀双眸与飘雪',
    summary: '覆雪哥特花窗尖拱之下，羽衣如雪的白鸮立于黄铜栖架，琥珀金眸静静凝望风雪夜行人。',
    lore: '传说每逢十二月大雪封山，总有一只胸佩银星勋章的雪鸮停在钟表铺窗棂外替守林人报信。龛内两盏暖烛彻夜不熄，映得它蓬松洁白的覆羽染上一层温柔的蜜蜡光泽。'
  },
  {
    day: 4,
    rect: [727, 411, 843, 561],
    shape: 'arch',
    hinge: 'right',
    fxType: 'blue-butterflies',
    sfx: 'crystal',
    title: '琉璃暖房蓝蝶花笼',
    subtitle: 'Glass Conservatory · 幻彩蓝闪蝶',
    actionLabel: '🦋 惊起流光蓝蝶翩跹',
    summary: '重重银蕨与哥特玻璃花房中央，鎏金鸟笼护着一株幽蓝发光冰花，两只蓝闪蝶正绕笼翩飞。',
    lore: '外头是零下二十度的凛冽寒冬，这扇尖拱门后却藏着一座永远停留在仲夏夜的微缩水晶温室。只需指尖轻叩玻璃罩，栖息在银白霜叶间的发光蓝蝶便会振翅旋起一串幽蓝星尘。'
  },
  {
    day: 5,
    rect: [256, 561, 409, 650],
    shape: 'rect',
    hinge: 'left',
    fxType: 'moon-stag',
    sfx: 'celestial',
    title: '满月冰溪银角白鹿',
    subtitle: 'White Stag Forest · 寒林圣鹿',
    actionLabel: '🦌 洒下满月清辉与冰溪波光',
    summary: '皎洁冬月高悬覆雪冷杉林梢，通体胜雪的十二叉银角白鹿伫立于未封冻的冰溪水畔。',
    lore: '古日耳曼冬至神话中的引路圣兽。唯有心怀温热之人在暴风雪中迷途时，才能看见它踏碎冰凌而来；鹿角尖端闪烁的银霜落入溪水，化作一圈圈荡漾不息的月色涟漪。'
  },
  {
    day: 6,
    rect: [436, 556, 557, 660],
    shape: 'rect',
    hinge: 'left',
    fxType: 'botanical-book',
    sfx: 'page',
    title: '冬日圣诞玫瑰植物志',
    subtitle: 'Winter Botanical Book · 泥金本草卷',
    actionLabel: '📖 拂起书页金尘与草木香',
    summary: '摊开的羊皮纸古籍手绘着冬青红果、冷杉球果与破雪盛放的白色圣诞玫瑰（铁筷子）。',
    lore: '老药剂师毕生搜集的阿尔卑斯耐寒奇花异草图谱。细看泛黄棉麻纸页边缘还镶着巴洛克金箔卷草，书架下暗藏的发条每转半圈，干花标本间便浮起缕缕琥珀色的松脂微尘。'
  },
  {
    day: 7,
    rect: [585, 577, 721, 649],
    shape: 'rect',
    hinge: 'left',
    fxType: 'nutcracker',
    sfx: 'soldier',
    title: '胡桃夹子近卫发条官',
    subtitle: 'Nutcracker Soldier · 绯红近卫军',
    actionLabel: '⚔️ 拧转巨型金钥 · 剑锋流光',
    summary: '天鹅绒帷幕下，绯红金穗礼服的胡桃夹子高举银亮佩剑，身旁一枚鎏金发条钥匙蓄势待发。',
    lore: '整座秘柜最忠诚的守夜统帅。由整块风干三十年的椴木精雕彩绘，每当午夜钟声敲响第十二下，他身后的巨型黄铜钥匙便自行旋动，寒光凛冽的剑锋划破暗夜，为梦境劈开通往糖果王国的道路。'
  },
  {
    day: 8,
    rect: [745, 575, 847, 661],
    shape: 'rect',
    hinge: 'right',
    fxType: 'ballerina',
    sfx: 'carousel',
    title: '星冕八音芭蕾剧场',
    subtitle: 'Ballet Theater · 烛影独舞伶人',
    actionLabel: '🩰 点亮十二盏足光烛火',
    summary: '十二支象牙白蜡烛环绕鎏金圆舞台，金纱蓬裙舞者单足立于镜面中心，迎着追光舒展双臂。',
    lore: '致敬圣彼得堡马林斯基剧院 1892 年《胡桃夹子》首演之夜。舞台底部的黄铜棘轮与瑞士钢片音梳严丝合缝联动——只要第一个琶音跃出，烛火便随裙裾旋风一同摇曳生姿。'
  },
  {
    day: 9,
    rect: [254, 665, 371, 795],
    shape: 'arch',
    hinge: 'left',
    fxType: 'workshop',
    sfx: 'clockwork',
    title: '发条玩具工坊',
    subtitle: 'Clockwork Toy Workshop · 矮人制表台',
    actionLabel: '⚙️ 敲击工作台 · 迸发金星火花',
    summary: '黄铜吊灯暖光下，戴红帽的白胡子老工匠正俯身调试一只背插发条的白兔与木马。',
    lore: '这扇门后其实就是整座秘柜自己的诞生缩影！墙上挂满大大小小的摆线铜齿轮，老匠人手里的微型改锥每落下一记，白兔耳朵便机灵地抖上一抖，仿佛下一秒就要跳出画框。'
  },
  {
    day: 10,
    rect: [392, 679, 507, 787],
    shape: 'rect',
    hinge: 'left',
    fxType: 'jewel-butterfly',
    sfx: 'crystal',
    title: '蝴蝶珠宝音乐匣',
    subtitle: 'Jeweled Butterfly · 珐琅贝母宝匣',
    actionLabel: '💎 绽放紫晶双翼璀璨星芒',
    summary: '群青掐丝珐琅贝壳宝匣轻启，一只镶满紫水晶与蓝宝石的流光金蝶在珍珠簇拥下振翅欲飞。',
    lore: '仿俄国皇室法贝热（Fabergé）复活节彩蛋工艺打造的冬日珍宝。蝶翼薄如蝉纱，内部穿引着极细的光导琉璃丝——轻轻触碰，整只宝石蝴蝶便如呼吸般泛起迷离的紫罗兰霞光。'
  },
  {
    day: 11,
    rect: [548, 662, 698, 789],
    shape: 'arch',
    hinge: 'right',
    fxType: 'sky-balloon',
    sfx: 'celestial',
    title: '天空热气球探险记',
    subtitle: 'Sky Balloon · 云端摘星之旅',
    actionLabel: '🎈 催旺喷火器 · 飘越星月云海',
    summary: '红白条纹烫金热气球吊篮里，戴护目镜的小熊船长正举起单筒望远镜，穿行于满月云海与垂星之间。',
    lore: '谁说深冬不能远航？乘着热气球升上暴风雪之上的平流层，脚下是覆雪尖塔与翻涌如绵羊的银云，伸手便能摘下用金丝悬在天幕上的伯利恒小星。'
  },
  {
    day: 12,
    rect: [720, 683, 847, 803],
    shape: 'rect',
    hinge: 'right',
    fxType: 'carousel',
    sfx: 'carousel',
    title: '威尼斯运河旋转木马',
    subtitle: 'Venetian Carousel · 水城夜色木马',
    actionLabel: '🎠 点亮跑马灯与运河碎金倒影',
    summary: '缀满百颗暖黄灯泡的红白华盖旋转木马伫立水畔，远处叹息桥与贡多拉小船在蓝夜波光中轻晃。',
    lore: '将亚得里亚海冬夜嘉年华装进方寸木龛。木马华盖一圈圈流转的暖金灯珠映在幽蓝运河水面上，碎成万点跳跃的金箔，伴随着圆舞曲的三拍子轻轻摇荡。'
  },
  {
    day: 13,
    rect: [252, 815, 385, 903],
    shape: 'rect',
    hinge: 'left',
    fxType: 'amethyst',
    sfx: 'crystal',
    title: '晶洞矿物秘室',
    subtitle: 'Amethyst Grotto · 紫晶簇标本柜',
    actionLabel: '🔮 聚焦放大镜 · 闪耀紫晶星芒',
    summary: '硕大的天然紫水晶晶洞剖面在黄铜放大镜后熠熠生辉，案头陈列着药剂抽屉与钟罩晶簇。',
    lore: '黑森林深处银矿脉中偶然挖出的天然紫晶雷公蛋（Geode）。在幽暗木龛里封存千年后被劈开一角，成百上千枚六棱紫晶尖锥向心而生，每一道切面都藏着一缕凝固的星光。'
  },
  {
    day: 14,
    rect: [403, 813, 501, 905],
    shape: 'rect',
    hinge: 'left',
    fxType: 'nautilus-clock',
    sfx: 'clockwork',
    title: '螺旋贝壳珍珠时钟',
    subtitle: 'Seashell Clock · 斐波那契螺钿钟',
    actionLabel: '🐚 流转珍珠母贝虹彩与齿轮',
    summary: '泛着粉青虹彩的天然鹦鹉螺切片与黄金镂空齿轮完美嵌合，底座散落温润南洋白珠与白水晶。',
    lore: '大自然最完美对数螺线与人类精密机械时计的联姻。顺着鹦鹉螺一室室渐次扩大的珍珠母贝腔体望去，仿佛能听见远古深海潮汐与黄金摆轮滴答声跨越亿万年的合鸣。'
  },
  {
    day: 15,
    rect: [518, 800, 701, 909],
    shape: 'oval',
    hinge: 'left',
    fxType: 'ship-bottle',
    sfx: 'bubble',
    title: '瓶中乘风远洋帆船',
    subtitle: 'Ship in Bottle · 椭金框海图志',
    actionLabel: '⛵ 激起碧海白浪与罗盘微光',
    summary: '唯一一扇巴洛克椭圆形浮雕门后，横卧的软木塞玻璃瓶中三桅帆船正劈开碧蓝白浪全帆前进！',
    lore: '老船长退休定居黑森林山谷前亲手用长镊子在窄口瓶内竖起的微缩三桅快船。下方铺着羊皮古海图与黄铜罗盘——哪怕窗外大雪封门，只要看一眼鼓满海风的白帆，胸口便涌起辽阔潮声。'
  },
  {
    day: 16,
    rect: [716, 819, 851, 911],
    shape: 'rect',
    hinge: 'right',
    fxType: 'comet-scope',
    sfx: 'celestial',
    title: '天文学家的观星望远镜',
    subtitle: 'Astronomer Telescope · 寒夜掠过彗星',
    actionLabel: '☄️ 划落璀璨蓝白长尾大彗星！',
    summary: '堆满皮面星表与浑天仪的石拱书斋窗前，黄铜折射望远镜正对准深蓝夜空中曳尾掠过的大彗星。',
    lore: '记录着 1882 年大彗星掠过阿尔卑斯山脊的传奇冬夜。每当你在龛前驻足轻触，幽蓝天幕深处便会再次划过一道拖着银蓝尘埃长尾的流光，照亮案头摊开的《天体运行论》。'
  },
  {
    day: 17,
    rect: [256, 921, 359, 1041],
    shape: 'rect',
    hinge: 'left',
    fxType: 'robin-post',
    sfx: 'bird',
    title: '知更鸟冬夜邮局',
    subtitle: 'Robin Post Office · 红胸信使与火漆信',
    actionLabel: '🐦 摇曳邮局暖灯 · 派送火漆贺信',
    summary: '橘红胸羽的胖知更鸟衔着一枚红火漆封印的圣诞信笺，脚下黄铜传送带正源源不断送出冬夜家书。',
    lore: '在英国与德意志古老民俗里，胸前染红的知更鸟是平安夜邮差的化身。分信木格里塞满了寄往世界各地的思念，小家伙歪着脑袋一抖翅膀，信封上的朱红火漆便泛起融融暖意。'
  },
  {
    day: 18,
    rect: [380, 927, 483, 1031],
    shape: 'rect',
    hinge: 'left',
    fxType: 'gingerbread-hearth',
    sfx: 'hearth',
    title: '暖炉热可可与糖霜姜饼屋',
    subtitle: 'Gingerbread Hearth · 肉桂可可夜话',
    actionLabel: '🔥 催旺炉火火星 · 升腾热可可白雾',
    summary: '铸铁壁炉烈焰熊熊，案头摆着亮起暖灯的糖霜姜饼屋、插着肉桂棒的奶油热可可与挥手姜饼小人。',
    lore: '整座秘柜最有烟火甜香的一隅！炉膛里松柴噼啪炸开金红火星，马克杯顶的鲜奶油正随着热可可缓缓融化，升起一缕缕带着锡兰肉桂与烤榛子香气的袅袅白雾。'
  },
  {
    day: 19,
    rect: [603, 925, 711, 1035],
    shape: 'rect',
    hinge: 'right',
    fxType: 'snowflake-forge',
    sfx: 'bell',
    title: '冰晶雪花星环仪',
    subtitle: 'Snowflake Forge · 六出瑞雪天球',
    actionLabel: '❄️ 折射钻石六角冰晶星芒',
    summary: '多重鎏金星环中央悬停着一枚巨型切面水晶六角雪花，四周环绕着数枚精致小冰花与齿轮底座。',
    actionHint: '折射星芒',
    lore: '天文学家开普勒曾写下《论六角雪花》，惊叹每一片从天而降的冰晶都是造物主严苛的几何诗篇。这枚永不融化的切面水晶雪花在铜环间静静流转，将炉火折射成漫天碎钻。'
  },
  {
    day: 20,
    rect: [730, 923, 843, 1045],
    shape: 'rect',
    hinge: 'right',
    fxType: 'snowglobe',
    sfx: 'crystal',
    title: '阿尔卑斯雪夜地球仪',
    subtitle: 'Alpine Globe · 雪山木屋水晶球',
    actionLabel: '🌨️ 摇起球内漫天飞雪与万家灯火',
    summary: '黄铜子午线环抱的水晶球体内，巍峨雪峰脚下依偎着点亮橘黄窗灯的尖顶教堂与木屋村落。',
    lore: '把整座阿尔卑斯山谷缩进掌心圆球。轻轻触碰球壁，细密洁白的雪花便在球体弧面内打着旋儿纷纷扬扬飘落，覆盖在暖光盈盈的小木屋坡顶上。'
  },
  {
    day: 21,
    rect: [260, 1053, 345, 1175],
    shape: 'arch',
    hinge: 'left',
    fxType: 'aurora-swan',
    sfx: 'celestial',
    title: '极光冰湖白天鹅',
    subtitle: 'Swan Aurora Lake · 冰莲极光秘境',
    actionLabel: '🌌 舞动翠紫极光绸缎与湖面波影',
    summary: '垂满冰凌的拱窗外，翠绿与紫罗兰极光在夜空翻涌，头戴金冠的白天鹅优雅游过盛开冰莲的镜湖。',
    lore: '十二月二十一日冬至极夜之冠。冰湖四周凝结出晶莹剔透的蓝冰莲花，当极光纱幔在群峰之巅无声起伏，整片湖水便化作一面流淌着翡翠与紫霞的魔镜。'
  },
  {
    day: 22,
    rect: [360, 1065, 433, 1187],
    shape: 'rect',
    hinge: 'left',
    fxType: 'clockwork-heart',
    sfx: 'heartbeat',
    title: '绯红琉璃机械之心',
    subtitle: 'Clockwork Heart · 秘柜永动心室',
    actionLabel: '❤️ 倾听双拍心跳 · 激发绯红脉动！',
    summary: '黄铜主动脉与精密擒纵齿轮包裹着一颗通透的红宝石琉璃心脏，正随着发条律动发出温热红光！',
    lore: '传说守柜人在完工前最后一夜，将这枚吹制红琉璃与黄金游丝锻造的「机械之心」安放在圣殿门左侧——从此整座胡桃木秘柜便不再是冰冷的木石齿轮，而拥有了生生不息的温热脉搏。'
  },
  {
    day: 23,
    rect: [694, 1065, 803, 1191],
    shape: 'rect',
    hinge: 'right',
    fxType: 'star-hourglass',
    sfx: 'sand',
    title: '星砂流光秘钥沙漏',
    subtitle: 'Star Sand Hourglass · 平安夜开启之钥',
    actionLabel: '⏳ 倾泻双螺旋流金星砂',
    summary: '吹制水晶瓶腹内悬浮着一枚鎏金花丝钥匙，两道璀璨星砂化作金色双螺旋光带绕钥倾泻而下。',
    lore: '平安夜前夕的倒计时圣物。当最后一缕流金星砂在瓶底聚成光海，悬浮其中的黄金秘钥便会发出清越共鸣——指引你去推开正中央那扇双拱圣殿大门。'
  },
  {
    day: 24,
    rect: [446, 1019, 648, 1195],
    shape: 'arch',
    hinge: 'double',
    fxType: 'cathedral-finale',
    sfx: 'finale',
    title: '平安夜鎏金玫瑰大圣堂',
    subtitle: 'Christmas Eve Cathedral · 终章圣咏盛典',
    actionLabel: '🔔 敲响金钟 · 漫天金雪圣咏',
    summary: '双扇鎏金拱门庄严洞开：覆雪哥特金圣堂玫瑰花窗璀璨绽放，飞天吹号天使与双塔洪钟齐鸣！',
    lore: '整座《黑森林机械降临节秘柜》的辉煌终章！当第 24 号双扇雕花拱门向两侧敞开，金碧辉煌的哥特圣堂、绚烂玫瑰花窗、底层精密咬合的报时齿轮组与穹顶吹号天使同时苏醒——双钟齐鸣，漫天白雪化作璀璨金尘，祝你圣诞快乐，岁岁长安！'
  }
];

export const ADVENT_BY_DAY = Object.fromEntries(ADVENT_DAYS.map((d) => [d.day, d]));

// Exact coordinates (on 1086 x 1448) of painted warm fairy bulbs & lanterns for ambient twinkle
export const FAIRY_LIGHT_SPOTS = [
  [543, 952, 2.4], // Central glowing miniature lantern between #18 & #19!
  [386, 444, 1.0], [590, 446, 1.0], [718, 430, 1.0],
  [244, 554, 1.1], [422, 550, 1.1], [570, 566, 1.1], [734, 566, 1.1], [856, 568, 1.0],
  [380, 668, 1.1], [526, 664, 1.1], [708, 672, 1.1], [856, 676, 1.0],
  [244, 804, 1.1], [394, 804, 1.1], [510, 796, 1.1], [708, 806, 1.1], [858, 810, 1.0],
  [246, 912, 1.1], [368, 918, 1.1], [496, 916, 1.2], [590, 916, 1.2], [720, 916, 1.1], [854, 918, 1.0],
  [248, 1046, 1.1], [352, 1054, 1.1], [438, 1040, 1.2], [656, 1042, 1.2], [812, 1058, 1.0]
];
