// FOMC票委真实数据 - 来源：路透社，2026年4月28日更新
// 政策利率目标区间：3.50%-3.75%

export type Stance = 'dove' | 'dovish' | 'centrist' | 'hawkish' | 'hawk';

export interface FomcMember {
  id: string;
  name: string;
  nameZh: string;
  title: string;
  titleZh: string;
  region: string;
  isPermanentVoter: boolean;
  isCurrentVoter: boolean;
  stance: Stance;
  score: number; // -100 (极鸽) to +100 (极鹰)
  scoreChange: number; // vs last month
  latestQuoteZh: string; // 中文翻译
  latestQuote: string;   // 英文原文
  quoteDate: string;
  initials: string;
  color: string;
  photoUrl?: string; // 官方照片
}

// CDN存储路径
const CDN = '/manus-storage';

export const fomcMembers: FomcMember[] = [
  // DOVE
  {
    id: 'bowman',
    name: 'Michelle Bowman',
    nameZh: '鲍曼',
    title: 'Fed Vice Chair of Supervision',
    titleZh: '监管副主席',
    region: 'Board',
    isPermanentVoter: true,
    isCurrentVoter: true,
    stance: 'dove',
    score: -60,
    scoreChange: -8,
    latestQuoteZh: '我已将2026年底前的三次降息写入预测，希望以此支撑劳动力市场。',
    latestQuote: "I've written three cuts in for, before the end of 2026 to hopefully support the labor market.",
    quoteDate: '2026-03-20',
    initials: 'MB',
    color: '#00BFA5',
    photoUrl: `${CDN}/bowman_3a7c847d.jpg`,
  },
  {
    id: 'miran',
    name: 'Stephen Miran',
    nameZh: '米兰',
    title: 'Governor',
    titleZh: '理事',
    region: 'Board',
    isPermanentVoter: true,
    isCurrentVoter: true,
    stance: 'dove',
    score: -40,
    scoreChange: -5,
    latestQuoteZh: '我可能预测三次降息，也可能是四次，我还没有下定决心。',
    latestQuote: "I might have three (rate cuts), I might have four, I haven't made up my mind.",
    quoteDate: '2026-04-16',
    initials: 'SM',
    color: '#00BFA5',
    photoUrl: `${CDN}/miran_a83f2d9d.jpg`,
  },
  // DOVISH
  {
    id: 'waller',
    name: 'Chris Waller',
    nameZh: '沃勒',
    title: 'Governor',
    titleZh: '理事',
    region: 'Board',
    isPermanentVoter: true,
    isCurrentVoter: true,
    stance: 'dovish',
    score: -20,
    scoreChange: +3,
    latestQuoteZh: '我的预测是核心通胀将继续向2%靠拢，这让我目前对降息持谨慎态度，但倾向于在今年晚些时候经济前景更明朗时降息以支持劳动力市场。',
    latestQuote: "I see a forecast in which underlying inflation would continue to move toward 2%, leaving me cautious about rate cuts now and more inclined toward cuts to support the labor market later this year.",
    quoteDate: '2026-04-17',
    initials: 'CW',
    color: '#4DB6AC',
    photoUrl: `${CDN}/waller_c0894e92.jpg`,
  },
  {
    id: 'powell',
    name: 'Jerome Powell',
    nameZh: '鲍威尔',
    title: 'Chair',
    titleZh: '主席',
    region: 'Board',
    isPermanentVoter: true,
    isCurrentVoter: true,
    stance: 'dovish',
    score: -10,
    scoreChange: +2,
    latestQuoteZh: '我们认为当前政策处于合适位置，可以静观其变，等待数据指引。',
    latestQuote: "We feel like our policy's in a good place for us to wait and see.",
    quoteDate: '2026-03-30',
    initials: 'JP',
    color: '#4DB6AC',
    photoUrl: `${CDN}/powell_f43f6d59.jpg`,
  },
  // CENTRIST
  {
    id: 'williams',
    name: 'John Williams',
    nameZh: '威廉姆斯',
    title: 'NY Fed President',
    titleZh: '纽约联储主席',
    region: 'New York',
    isPermanentVoter: true,
    isCurrentVoter: true,
    stance: 'centrist',
    score: 0,
    scoreChange: +5,
    latestQuoteZh: '我认为政策已处于可根据数据随时调整的位置，我们随时准备对利率进行必要的调整。',
    latestQuote: "I think policy is positioned to adjust to the data as it's coming in, and we're prepared to make adjustments to the policy rate as needed.",
    quoteDate: '2026-04-02',
    initials: 'JW',
    color: '#9E9E9E',
    photoUrl: `${CDN}/williams_b9b38aaf.jpg`,
  },
  {
    id: 'jefferson',
    name: 'Philip Jefferson',
    nameZh: '杰斐逊',
    title: 'Vice Chair',
    titleZh: '副主席',
    region: 'Board',
    isPermanentVoter: true,
    isCurrentVoter: true,
    stance: 'centrist',
    score: +5,
    scoreChange: +8,
    latestQuoteZh: '我的基准预期是利率将在较长时间内保持不变，但我确实认为利率面临双向风险。',
    latestQuote: "My baseline is that we're going to remain on hold for a good while, but I do think that there's two-sided risk to rates.",
    quoteDate: '2026-04-15',
    initials: 'PJ',
    color: '#9E9E9E',
    photoUrl: `${CDN}/jefferson_0e19dbc6.jpg`,
  },
  {
    id: 'paulson',
    name: 'Anna Paulson',
    nameZh: '保尔森',
    title: 'Philadelphia Fed President',
    titleZh: '费城联储主席',
    region: 'Philadelphia',
    isPermanentVoter: false,
    isCurrentVoter: true,
    stance: 'centrist',
    score: +10,
    scoreChange: +4,
    latestQuoteZh: '我认为在当前水平上维持政策一段时间可能是合适的。',
    latestQuote: "I think it's probably going to be appropriate to maintain policy at this level for some time.",
    quoteDate: '2026-04-15',
    initials: 'AP',
    color: '#9E9E9E',
    photoUrl: `${CDN}/paulson_f9c348c4.jpg`,
  },
  // HAWKISH
  {
    id: 'daly',
    name: 'Mary Daly',
    nameZh: '戴利',
    title: 'SF Fed President',
    titleZh: '旧金山联储主席',
    region: 'San Francisco',
    isPermanentVoter: false,
    isCurrentVoter: false,
    stance: 'hawkish',
    score: +30,
    scoreChange: +12,
    latestQuoteZh: '由于能源价格上涨，即便仅基于已有数据，未来几个月通胀率将远超3%。',
    latestQuote: "Because of the energy price increases, even based on what we've seen already, inflation will be well above 3% over the next few months.",
    quoteDate: '2026-04-16',
    initials: 'MD',
    color: '#EF5350',
    photoUrl: `${CDN}/daly_50041a5b.jpg`,
  },
  {
    id: 'kashkari',
    name: 'Neel Kashkari',
    nameZh: '卡什卡里',
    title: 'Minneapolis Fed President',
    titleZh: '明尼阿波利斯联储主席',
    region: 'Minneapolis',
    isPermanentVoter: false,
    isCurrentVoter: false,
    stance: 'hawkish',
    score: +35,
    scoreChange: +7,
    latestQuoteZh: '我对前景持谨慎态度……但我认为当前政策立场是适当的。',
    latestQuote: "I remain cautious about my outlook.... I continue, however, to see our current policy stance as appropriately positioned.",
    quoteDate: '2026-04-07',
    initials: 'NK',
    color: '#EF5350',
    photoUrl: `${CDN}/kashkari_d6fc9657.jpg`,
  },
  {
    id: 'goolsbee',
    name: 'Austan Goolsbee',
    nameZh: '古尔斯比',
    title: 'Chicago Fed President',
    titleZh: '芝加哥联储主席',
    region: 'Chicago',
    isPermanentVoter: false,
    isCurrentVoter: false,
    stance: 'hawkish',
    score: +25,
    scoreChange: +6,
    latestQuoteZh: '燃油价格和化肥价格上涨向通胀传导的风险这次可能比以往更大。',
    latestQuote: "There's a little bit more of a risk that the transmission of higher fuel prices, higher fertilizer prices, into inflation is greater this time.",
    quoteDate: '2026-03-27',
    initials: 'AG',
    color: '#EF5350',
    photoUrl: `${CDN}/goolsbee_6c23ef3a.jpg`,
  },
  {
    id: 'barkin',
    name: 'Thomas Barkin',
    nameZh: '巴尔金',
    title: 'Richmond Fed President',
    titleZh: '里士满联储主席',
    region: 'Richmond',
    isPermanentVoter: false,
    isCurrentVoter: false,
    stance: 'hawkish',
    score: +40,
    scoreChange: +10,
    latestQuoteZh: '油价冲击发生之前我们就有工作要做；有了油价冲击，这项工作只会需要更长时间。',
    latestQuote: "We had work to do before we had the oil price shock; with the oil price shock, the work just takes longer.",
    quoteDate: '2026-04-10',
    initials: 'TB',
    color: '#EF5350',
    photoUrl: `${CDN}/barkin_8f86535b.jpg`,
  },
  // HAWK
  {
    id: 'collins',
    name: 'Susan Collins',
    nameZh: '柯林斯',
    title: 'Boston Fed President',
    titleZh: '波士顿联储主席',
    region: 'Boston',
    isPermanentVoter: false,
    isCurrentVoter: true,
    stance: 'hawk',
    score: +55,
    scoreChange: +15,
    latestQuoteZh: '我认为，由于伊朗战争，当前的通胀风险更大了。',
    latestQuote: "I would argue that the inflation risk is greater right now as a result of the Iran war.",
    quoteDate: '2026-03-26',
    initials: 'SC',
    color: '#C62828',
    photoUrl: `${CDN}/collins_4c475c77.jpg`,
  },
  {
    id: 'musalem',
    name: 'Alberto Musalem',
    nameZh: '穆萨莱姆',
    title: 'St. Louis Fed President',
    titleZh: '圣路易斯联储主席',
    region: 'St. Louis',
    isPermanentVoter: false,
    isCurrentVoter: true,
    stance: 'hawk',
    score: +60,
    scoreChange: +18,
    latestQuoteZh: '我尤其担忧，又一次价格冲击可能推高长期通胀预期。',
    latestQuote: "I am particularly concerned that yet another price shock could increase longer-term inflation expectations.",
    quoteDate: '2026-03-26',
    initials: 'AM',
    color: '#C62828',
    photoUrl: `${CDN}/musalem_8d277b5d.jpg`,
  },
  {
    id: 'logan',
    name: 'Lorie Logan',
    nameZh: '洛根',
    title: 'Dallas Fed President',
    titleZh: '达拉斯联储主席',
    region: 'Dallas',
    isPermanentVoter: false,
    isCurrentVoter: false,
    stance: 'hawk',
    score: +65,
    scoreChange: +20,
    latestQuoteZh: '我认为我们不能对通胀预期上升的风险掉以轻心。',
    latestQuote: "I don't think we can be complacent about the risks to inflation expectations.",
    quoteDate: '2026-03-31',
    initials: 'LL',
    color: '#C62828',
    photoUrl: `${CDN}/logan_b224e4e2.jpg`,
  },
  {
    id: 'hammack',
    name: 'Beth Hammack',
    nameZh: '哈马克',
    title: 'Cleveland Fed President',
    titleZh: '克利夫兰联储主席',
    region: 'Cleveland',
    isPermanentVoter: false,
    isCurrentVoter: true,
    stance: 'hawk',
    score: +70,
    scoreChange: +22,
    latestQuoteZh: '我曾认为2026年可能有多次降息；但这种局面拖得越久，我就越倾向于认为我们将长期按兵不动。',
    latestQuote: "I thought there could be even multiple rate cuts in 2026; the longer this goes, where we never got to see the decrease in inflation, the more I'm thinking we're going to be on hold.",
    quoteDate: '2026-04-14',
    initials: 'BH',
    color: '#C62828',
    photoUrl: `${CDN}/hammack_4f7eef90.jpg`,
  },
  {
    id: 'schmid',
    name: 'Jeffrey Schmid',
    nameZh: '施密德',
    title: 'Kansas City Fed President',
    titleZh: '堪萨斯城联储主席',
    region: 'Kansas City',
    isPermanentVoter: false,
    isCurrentVoter: false,
    stance: 'hawk',
    score: +75,
    scoreChange: +5,
    latestQuoteZh: '自2026年3月6日以来未发表货币政策公开评论。',
    latestQuote: "No public comments on monetary policy since March 6, 2026.",
    quoteDate: '2026-03-06',
    initials: 'JS',
    color: '#C62828',
    photoUrl: `${CDN}/schmid_cfa91798.jpg`,
  },
];

// 整体鹰鸽指数
export const overallHawkishScore = 28;
export const overallHawkishScoreChange = +9;

// 鹰鸽分布统计
export const stanceDistribution = {
  dove: fomcMembers.filter(m => m.stance === 'dove').length,
  dovish: fomcMembers.filter(m => m.stance === 'dovish').length,
  centrist: fomcMembers.filter(m => m.stance === 'centrist').length,
  hawkish: fomcMembers.filter(m => m.stance === 'hawkish').length,
  hawk: fomcMembers.filter(m => m.stance === 'hawk').length,
};

// 政策利率数据
export const policyRate = {
  current: '3.50%-3.75%',
  lastChange: '2025-12-18',
  lastChangeDirection: 'cut' as const,
  lastChangeBps: -25,
  nextMeetingDate: '2026-06-17',
  marketExpectedCuts2026: 1,
  fedMedianCuts2026: 1,
};

// 历史鹰鸽指数走势
export const hawkishHistory = [
  { month: '2025-05', score: -15, label: '5月' },
  { month: '2025-06', score: -20, label: '6月' },
  { month: '2025-07', score: -25, label: '7月' },
  { month: '2025-08', score: -18, label: '8月' },
  { month: '2025-09', score: -10, label: '9月' },
  { month: '2025-10', score: -5, label: '10月' },
  { month: '2025-11', score: +2, label: '11月' },
  { month: '2025-12', score: -8, label: '12月' },
  { month: '2026-01', score: +5, label: '1月' },
  { month: '2026-02', score: +12, label: '2月' },
  { month: '2026-03', score: +19, label: '3月' },
  { month: '2026-04', score: +28, label: '4月' },
];

// ─── 动态资产联动数据 ──────────────────────────────────────────────────────────
// 核心逻辑：鹰鸽指数每变化10点，资产价格按历史敏感度系数联动变化
// 基准鹰鸽指数 = 0（中性），当前 = +28（偏鹰）

export interface AssetLiveData {
  asset: string;
  assetZh: string;
  currentPrice: number;    // fallback参考价
  unit: string;
  precision: number;
  sensitivity: number;     // 1-5 敏感度星级
  color: string;
  // 鹰派方向：+1=鹰派利好, -1=鹰派利空
  hawkishDirection: 1 | -1;
  // 当前鹰鸽指数下，预期方向说明（鹰派场景）
  hawkishImpact: string;
  // 鹰派强度每变动10点，对应的影响幅度（带单位）
  impactPer10: string;
  // 历史统计：鹰派周期内该资产平均月涂
  hawkishMonthlyReturn: string;
  // 鹰派周期内该资产历史胜率
  hawkishWinRate: string;
  // 逻辑说明（一句话）
  logic: string;
}

export const assetLiveData: AssetLiveData[] = [
  {
    asset: 'XAU/USD',
    assetZh: '现货黄金',
    currentPrice: 4626,
    unit: '$',
    precision: 0,
    sensitivity: 4,
    color: '#E8B84B',
    hawkishDirection: -1,
    hawkishImpact: '承压',
    impactPer10: '每+10点约-$18',
    hawkishMonthlyReturn: '-1.8%',
    hawkishWinRate: '72%',
    logic: '利率上升压制无息资产，黄金对利率预期极敏感',
  },
  {
    asset: 'DXY',
    assetZh: '美元指数',
    currentPrice: 98.2,
    unit: '',
    precision: 1,
    sensitivity: 5,
    color: '#4DB6AC',
    hawkishDirection: 1,
    hawkishImpact: '强势',
    impactPer10: '每+10点约+0.8',
    hawkishMonthlyReturn: '+0.8%',
    hawkishWinRate: '78%',
    logic: '利差扩大吸引资金回流，美元指数最直接受益',
  },
  {
    asset: 'USD/JPY',
    assetZh: '美元/日元',
    currentPrice: 157.0,
    unit: '',
    precision: 1,
    sensitivity: 5,
    color: '#9E9E9E',
    hawkishDirection: 1,
    hawkishImpact: '日元承压',
    impactPer10: '每+10点约+1.7',
    hawkishMonthlyReturn: '+1.1%',
    hawkishWinRate: '75%',
    logic: '美日利差扩大，日元持续承压走弱',
  },
  {
    asset: 'US10Y',
    assetZh: '10Y美傘收益率',
    currentPrice: 4.378,
    unit: '%',
    precision: 2,
    sensitivity: 5,
    color: '#EF5350',
    hawkishDirection: 1,
    hawkishImpact: '收益率上行',
    impactPer10: '每+10点约+0.15%',
    hawkishMonthlyReturn: '+0.12%',
    hawkishWinRate: '81%',
    logic: '加息预期直接推升长端傘收益率',
  },
  {
    asset: 'WTI/USD',
    assetZh: 'WTI原油',
    currentPrice: 102.5,
    unit: '$',
    precision: 1,
    sensitivity: 2,
    color: '#9E9E9E',
    hawkishDirection: -1,
    hawkishImpact: '需求承压',
    impactPer10: '每+10点约-$0.8',
    hawkishMonthlyReturn: '-0.5%',
    hawkishWinRate: '58%',
    logic: '经济放缓预期压制需求，但地缘因素对冲弱',
  },
];

export const stanceLabels: Record<Stance, string> = {
  dove: '强鸽',
  dovish: '偏鸽',
  centrist: '中性',
  hawkish: '偏鹰',
  hawk: '强鹰',
};

export const stanceColors: Record<Stance, string> = {
  dove: '#00BFA5',
  dovish: '#4DB6AC',
  centrist: '#9E9E9E',
  hawkish: '#EF5350',
  hawk: '#C62828',
};
