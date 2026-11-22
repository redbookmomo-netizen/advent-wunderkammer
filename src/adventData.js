// Complete metadata, architectural 5x5 layout, mechanical actions & horologist's winter lore
// for all 24 compartments of "The Grand Advent Wunderkammer · 黑森林 24 格机械降临节秘柜"

export const ROMAN = [
  '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV'
];

export const ADVENT_DAYS = [
  {
    day: 1,
    row: 1, col: 0, rowSpan: 1, style: 'casement', hinge: 'left',
    title: '钟罩冰晶冬青玫瑰',
    german: 'Die Kristallrose unter Glas',
    actionLabel: '✨ 唤醒玫瑰微光与霜尘',
    sfx: 'crystal',
    summary: '吹制琉璃钟罩内，一株绯红冰晶玫瑰与冬青金叶在呼吸微光中缓缓旋舞。',
    lore: '1884 年初雪夜，制表匠约翰内斯将花园最后一朵未谢的红玫瑰封入吹制薄玻璃钟罩。底座暗藏一枚微缩日内瓦十字发条——每当松果重锤垂落一寸，花瓣边缘凝结的糖霜状水晶便折射出暖红微光，仿佛把整个十一月的余温锁进了冬夜。'
  },
  {
    day: 2,
    row: 2, col: 1, rowSpan: 1, style: 'casement', hinge: 'double',
    title: '胡桃夹子近卫锡兵',
    german: 'Der Nussknacker-Gardist',
    actionLabel: '⚔️ 拧动发条 · 举刀敬礼',
    sfx: 'soldier',
    summary: '身着绯红金穗礼服的椴木胡桃夹子近卫官，随小军鼓节奏咔哒立正、挥刀致意。',
    lore: '用整块陈年厄尔士山脉椴木削刻而成，帽徽嵌着一颗小米粒大的黄铜星芒。守柜人总把第二格留给这位神情严肃的小卫兵——只要他在绒龛里咔哒一声举起佩刀，窗外呼啸的暴风雪与鼠王的影子便一步也不敢踏进书房。'
  },
  {
    day: 3,
    row: 0, col: 1, rowSpan: 1, style: 'arch', hinge: 'double',
    title: '青金石黄道浑天仪',
    german: 'Die Lapislazuli-Armillarsphäre',
    actionLabel: '🪐 校准冬至三星连珠',
    sfx: 'celestial',
    summary: '三道镌刻黄道十二宫的拉丝铜环交错回旋，拱卫中央洒金青金石地球与珍珠银月。',
    lore: '黑森林的钟表匠不仅丈量人间时刻，也痴迷冬夜漫长天幕上的星辰轨度。拨动外圈赤道铜环，三枚同心黄铜轨便在惯性中交叠成十字星芒，精准指向十二月二十二日冬至子夜太阳重返北半球的那一刻。'
  },
  {
    day: 4,
    row: 3, col: 3, rowSpan: 1, style: 'casement', hinge: 'double',
    title: '威尼斯六骏旋转木马',
    german: 'Das Venezianische Karussell',
    actionLabel: '🎠 加速圆舞曲木马飞旋',
    sfx: 'carousel',
    summary: '红白条纹烫金穹顶之下，六匹手绘白瓷小马沿扭花铜柱轻盈起伏回旋。',
    lore: '灵感来自冬日市集雪地中央蒸汽风琴伴奏的古董木马。每一匹小瓷马只有拇指大小，马鞍却描着真正的金箔卷草纹；当发条全速释放，灯影与流苏飞旋成一圈温暖的光晕，连大人也会在玻璃前屏住呼吸。'
  },
  {
    day: 5,
    row: 1, col: 4, rowSpan: 1, style: 'casement', hinge: 'right',
    title: '铸铁暖炉与糖霜姜饼屋',
    german: 'Lebkuchenhaus & Gussofen',
    actionLabel: '🔥 添柴拨火 · 迸发火星',
    sfx: 'hearth',
    summary: '淋满蛋白糖霜的微缩姜饼木屋依偎着铸铁小火炉，炉膛红炭明灭，烟囱吐出甜香白雾。',
    lore: '在黑森林的深冬，没有什么比推开木门闻见肉桂、蜂蜜与烤杏仁焦香更令人心安。小龛左侧的微型铸铁炉里嵌着红琉璃炭块，下方风叶一转，炉火便忽明忽暗地舔舐着姜饼屋檐垂下的糖霜冰凌。'
  },
  {
    day: 6,
    row: 3, col: 1, rowSpan: 1, style: 'casement', hinge: 'double',
    title: '阿尔卑斯环山蒸汽火车',
    german: 'Die Alpen-Dampfeisenbahn',
    actionLabel: '🚂 拉响汽笛 · 喷吐白烟圈',
    sfx: 'train',
    summary: '黄铜锅炉微型蒸汽机车拖着两节红漆车厢，绕着覆雪冷杉与石拱桥欢快驰骋。',
    lore: '12 月 6 日是圣尼古拉斯节，也是孩子们把擦亮的皮靴摆在壁炉边的夜晚。这列直径不足三寸的发条小火车沿着银锡铁轨穿行雪松林，每次轻触黄铜烟囱，都会发出一声清亮的双音汽笛，吐出一串圆滚滚的棉花白烟。'
  },
  {
    day: 7,
    row: 0, col: 3, rowSpan: 1, style: 'arch', hinge: 'double',
    title: '天鹅湖冰晶芭蕾伶人',
    german: 'Die Porzellan-Ballerina auf Eis',
    actionLabel: '🩰 触发挥鞭转与琶音',
    sfx: 'crystal',
    summary: '镜面银冰湖上，素白纱裙骨瓷舞者迎着月色足尖轻旋，四周银苇摇曳生姿。',
    lore: '底座是一整块打磨如镜的银锡圆盘，倒映着骨瓷伶人纤毫毕现的羽衣与皇冠。暗藏在冰面之下的磁吸齿轮带着她滑出优美的八字弧线，仿佛柴可夫斯基笔下永远不会融化的冬夜梦境。'
  },
  {
    day: 8,
    row: 2, col: 0, rowSpan: 1, style: 'casement', hinge: 'left',
    title: '冬至热红酒铜螺旋蒸馏台',
    german: 'Das Glühwein-Alchemielabor',
    actionLabel: '🍷 催旺蓝焰 · 翻涌香气金泡',
    sfx: 'bubble',
    summary: '酒精灯幽蓝火苗轻舔圆底烧瓶，红宝石色香料酒液微沸翻泡，顺紫铜盘管滴入水晶杯。',
    lore: '老药剂师与制表匠是多年的酒友，他们用吹制硼硅玻璃与紫铜螺旋管造了这座微型炼金台。细看烧瓶内还浮着微雕八角与血橙片——火苗升腾时，琥珀与绯红气泡鱼贯而上，连视线都仿佛染上了微醺暖意。'
  },
  {
    day: 9,
    row: 4, col: 4, rowSpan: 1, style: 'drawer', hinge: 'drawer',
    title: '哥特六棱彩绘琉璃提灯',
    german: 'Die Gotische Glasmalerei-Laterne',
    actionLabel: '🏮 拨转提灯 · 流转彩窗光斑',
    sfx: 'bell',
    summary: '丝绒抽屉中立着一盏锻铁六棱小提灯，六面古法彩绘玻璃将宝石色光斑洒满四周。',
    lore: '取自斯特拉斯堡大教堂玫瑰窗修缮时留下的指甲盖大小的古法彩色玻璃碎料，镶成六面冬夜圣咏图景。抽屉拉开的一瞬，灯芯自动亮起，钴蓝、圣血红与琥珀金的光斑便在天鹅绒褶皱上缓缓流淌。'
  },
  {
    day: 10,
    row: 1, col: 3, rowSpan: 1, style: 'casement', hinge: 'double',
    title: '黄金枝笼发条夜莺',
    german: 'Die Goldene Singvogel-Dose',
    actionLabel: '🐦 拨动鸟哨 · 婉转啼鸣',
    sfx: 'bird',
    summary: '鎏金花丝鸟笼内，镶嵌蓝宝石羽翼的机械夜莺立于珍珠花枝上，振翅摆尾、启喙清啼。',
    lore: '致敬瑞士纳沙泰尔十八世纪传奇自动鸣鸟匣（Tabatière à Oiseau Chanteur）。笼底藏着一枚拇指大的微型皮革风箱与滑动活塞笛，轻轻触碰，夜莺便灵巧地偏过小脑袋，抖动翠蓝尾羽吹出清脆如山涧解冻般的颤音。'
  },
  {
    day: 11,
    row: 3, col: 4, rowSpan: 1, style: 'casement', hinge: 'right',
    title: '极夜猎户座黄铜望远镜',
    german: 'Das Sternwarte-Messingteleskop',
    actionLabel: '🔭 仰角巡天 · 划落冬夜流星',
    sfx: 'celestial',
    summary: '三脚架拉丝黄铜折射望远镜缓缓俯仰寻星，背后深蓝珐琅星图上猎户座与天狼星熠熠闪烁。',
    lore: '十二月中旬的双子座流星雨总是如约造访黑森林冷冽晴朗的夜空。背板以掐丝金线镶出冬季大三角，每当望远镜镜筒微微抬升对准猎户腰带三星，深蓝天幕上便有一道银白流星悄然划落。'
  },
  {
    day: 12,
    row: 0, col: 2, rowSpan: 1, style: 'arch', hinge: 'double',
    title: '吹号六翼炽天使转轮',
    german: 'Das Goldene Seraphim-Rad',
    actionLabel: '🎺 敲响银钟 · 圣咏齐鸣',
    sfx: 'bell',
    summary: '位于圣殿正上方的双扇拱门内，巴洛克太阳芒光环与鎏金天使羽翼逆时针庄严回旋。',
    lore: '第十二格恰逢降临节半程，高踞于整座秘柜中轴穹顶之下。双扇雕花拱门如祭坛画般向两侧对称展开，内外双层镀金日冕齿轮相向慢旋，每一次轻触都会叩响背面悬垂的三枚纯银小钟。'
  },
  {
    day: 13,
    row: 2, col: 3, rowSpan: 1, style: 'casement', hinge: 'double',
    title: '黑森林金箔吹制水晶球',
    german: 'Die Schwarzwald-Schneekugel',
    actionLabel: '❄️ 猛摇球体 · 掀起金箔雪暴',
    sfx: 'crystal',
    summary: '圆润厚玻璃球体内封存着雪夜尖顶小教堂，轻触即翻涌起漫天 24K 金箔与白雪涡流。',
    lore: '相传 1889 年巴黎世博会后，水晶雪景球成了欧洲冬日最浪漫的案头珍玩。守柜人在蒸馏水里掺入了细碎如微尘的锤揲纯金叶——摇晃之后，白雪落向松枝，而金箔却在烛光折射下久久悬停如星云。'
  },
  {
    day: 14,
    row: 0, col: 0, rowSpan: 1, style: 'arch', hinge: 'left',
    title: '守林人的金砂时计沙漏',
    german: 'Die Goldsand-Stundenglas',
    actionLabel: '⏳ 180° 翻转黄铜沙漏',
    sfx: 'sand',
    summary: '螺旋铜柱夹持双泡吹制玻璃胆，细密闪烁的流金细砂正从腰口静静倾泻成锥。',
    lore: '在机械擒纵轮问世之前，修道院守夜人靠沙漏丈量晨祷前的寂静。玻璃胆中装的不是寻常石英砂，而是淘洗自莱茵河畔的细金云母砂；手指一拨令框架利落翻转，金砂坠落的沙沙声比炉火还要催眠。'
  },
  {
    day: 15,
    row: 4, col: 2, rowSpan: 1, style: 'drawer', hinge: 'drawer',
    title: '丝绒魔术礼帽与白瓷小兔',
    german: 'Der Zylinder des Illusionisten',
    actionLabel: '🎩 轻敲魔杖 · 跃出白瓷小兔',
    sfx: 'pop',
    summary: '中轴丝绒抽屉里倒扣着一顶缀冬青枝的黑色大礼帽，象牙头魔杖一挥，长耳白兔携星芒跃出。',
    lore: '维多利亚时代的圣诞家庭晚会总少不了一位穿燕尾服的客厅魔术师。帽檐内侧藏着精密的剪刀式弹簧升降台——平时只见两只粉白瓷耳尖悄悄探出帽口，轻点一下，小家伙便顶着金粉星花欢快地蹦出来打招呼。'
  },
  {
    day: 16,
    row: 1, col: 1, rowSpan: 1, style: 'casement', hinge: 'double',
    title: '玫瑰木手摇管风琴匣',
    german: 'Die Miniatur-Drehorgel',
    actionLabel: '🎼 摇动曲柄 · 吹响七管圣咏',
    sfx: 'organ',
    summary: '裸露的黄铜刺钉音筒联动七根银锡风管，小曲柄飞转时管口喷出细微白雾与温暖和弦。',
    lore: '这是黑森林街头手摇风琴（Drehorgel）的掌上缩影。七根高低错落的锡铅合金音管按纯律调音，下方迷你储风囊随曲柄一呼一吸，奏出的木笛音色带着老教堂冬日暖气般的醇厚鼻音。'
  },
  {
    day: 17,
    row: 2, col: 4, rowSpan: 1, style: 'casement', hinge: 'right',
    title: '镂空陀飞轮怀表机芯',
    german: 'Das Offene Tourbillon-Uhrwerk',
    actionLabel: '⚙️ 激发游丝 · 齿轮倍速咬合',
    sfx: 'clockwork',
    summary: '敞开的黄金怀表露出红宝石轴承、蓝钢螺丝与层叠黄铜齿轮，摆轮游丝正高频呼吸震颤。',
    lore: '整座秘柜最纯粹的钟表机械炫技之作。直径一寸的镂空夹板上，五组大小渐变的摆线黄铜齿轮严丝合缝地啮合传动，中央红宝石擒纵叉以每秒八次的清脆「滴答」将无形光阴切分成看得见的金光。'
  },
  {
    day: 18,
    row: 4, col: 0, rowSpan: 1, style: 'drawer', hinge: 'drawer',
    title: '红金火漆封印与白鹅毛笔',
    german: 'Siegellack & Schwanenfeder',
    actionLabel: '✉️ 蘸墨挥毫 · 落下火漆金印',
    sfx: 'stamp',
    summary: '斜坡胡桃木写字匣上铺着象牙信封，洁白鹅毛笔自动书写冬夜问候，红金火漆印章熠熠生辉。',
    lore: '没有电子邮件的年代，寄往远方的圣诞贺信要在十一月底就早早动笔。融化的朱砂虫胶混入松脂与金粉，趁热在信封折口按下一枚玫瑰雪花印鉴——哪怕翻越阿尔卑斯山的邮车满身风雪，拆信人指尖触到的依然是一枚滚烫的心意。'
  },
  {
    day: 19,
    row: 0, col: 4, rowSpan: 1, style: 'arch', hinge: 'right',
    title: '北欧极光银角白鹿林',
    german: 'Der Silberhirsch im Polarlicht',
    actionLabel: '🦌 点亮鹿角 · 唤起翠紫极光',
    sfx: 'celestial',
    summary: '层叠覆雪冷杉林间，一头银角白鹿昂首跃起，背后飘荡着翠绿与紫罗兰交织的极光纱幔。',
    lore: '古日耳曼传说里，冬至最漫长的黑夜会有双角挂满星霜的牡鹿引路，带领迷途旅人走出暴风雪。当指尖点亮它的十二叉银角，龛顶暗藏的棱镜便投下流动如水波的极光绿影。'
  },
  {
    day: 20,
    row: 3, col: 0, rowSpan: 1, style: 'casement', hinge: 'left',
    title: '维多利亚天鹅绒纸雕剧场',
    german: 'Das Papiertheater · Nussknacker',
    actionLabel: '🎭 挽起红幕 · 切换舞台追光',
    sfx: 'curtain',
    summary: '烫金拱门与深红丝绒大幕缓缓向两侧拉开，多层水彩纸雕舞台上克拉拉与王子翩然对舞。',
    lore: '十九世纪伦敦与维也纳的冬夜客厅里，波洛克玩具纸剧场（Toy Theatre）是孩子们最着迷的造梦机器。四层镂空景片制造出不可思议的纵深感，底部煤气足光灯一亮，薄薄的棉纸人物便拥有了滚烫的灵魂。'
  },
  {
    day: 21,
    row: 4, col: 1, rowSpan: 1, style: 'drawer', hinge: 'drawer',
    title: '树干奶油蛋糕与银茶炊盘',
    german: 'Bûche de Noël & Silbersamowar',
    actionLabel: '🍵 倾注红茶 · 升腾伯爵茶雾',
    sfx: 'bubble',
    summary: '骨瓷托盘盛着缀杏仁小蘑菇与糖霜冬青的巧克力树干蛋糕，身旁纯银茶壶正袅袅冒着热气。',
    lore: '源自古老冬至焚烧整根橡木原木驱寒祈福的习俗（Yule Log），后来化作了巴黎甜点师手下涂满巧克力甘纳许年轮纹的树干蛋糕。配上一壶佛手柑香气氤氲的锡兰热红茶，便是平安夜前最温柔的犒赏。'
  },
  {
    day: 22,
    row: 4, col: 3, rowSpan: 1, style: 'drawer', hinge: 'drawer',
    title: '中世纪烫金时祷书微缩珍本',
    german: 'Das Illuminierte Stundenbuch',
    actionLabel: '📖 吹拂书页 · 翻动泥金插画',
    sfx: 'page',
    summary: '天鹅绒托书架上摊开一册三寸精装羊皮纸《时祷书》，烫金书页正随无形微风一页页轻盈翻动。',
    lore: '向旧书店镇店珍本致敬的袖珍泥金写本。拉近细看，微缩羊皮纸页首用群青与纯金箔绘着花体首字母与冬日牧羊人图卷；每次轻点，都有一页薄纸带着清脆的摩挲声翩然翻过。'
  },
  {
    day: 23,
    row: 3, col: 2, rowSpan: 1, style: 'casement', hinge: 'double',
    title: '伯利恒二十六角琉璃星灯',
    german: 'Der Herrnhuter Adventsstern',
    actionLabel: '🌟 绽放琥珀绯红星芒',
    sfx: 'bell',
    summary: '黄铜细链悬垂着一枚精密几何二十六角摩拉维亚星芒灯，暖金与绯红棱角呼吸般明灭闪耀。',
    lore: '平安夜前夕的最后一格，悬挂着发源于德国赫恩胡特寄宿学校的经典几何星灯（Herrnhuter Stern）——由十八个正方锥与八个三角锥严丝合缝拼合而成，象征穿透寒夜迷雾、指引归途的伯利恒晨星。'
  },
  {
    day: 24,
    row: 1, col: 2, rowSpan: 2, style: 'sanctuary', hinge: 'double',
    title: '平安夜玫瑰花窗圣咏大祭坛',
    german: 'Das Große Weihnachtssanktuarium',
    actionLabel: '🔔 奏响平安夜全柜大机关！',
    sfx: 'finale',
    summary: '双倍挑高鎏金拱门缓缓洞开：彩绘玫瑰花窗、十六根黄金管风琴音管与十二盏红烛环绕双层旋转圣咏台！',
    lore: '整座黑森林秘柜的心脏与终章。当第 XXIV 号双扇鎏金圣殿门洞开，不仅龛内十六根黄金风管、彩绘玫瑰花窗与双层螺钿旋转圣咏台尽数苏醒，更会联动秘柜顶阁的布谷鸟与吹号天使破门而出——漫天风雪化作金尘，祝你拥有一个温暖、璀璨而奇遇不绝的圣诞夜。'
  }
];

export const ADVENT_BY_DAY = Object.fromEntries(ADVENT_DAYS.map((d) => [d.day, d]));
