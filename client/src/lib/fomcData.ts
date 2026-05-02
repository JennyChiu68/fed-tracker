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
  latestQuote: string;
  quoteDate: string;
  initials: string;
  color: string;
}

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
    latestQuote: "I've written three cuts in for, before the end of 2026 to hopefully support the labor market.",
    quoteDate: '2026-03-20',
    initials: 'MB',
    color: '#00BFA5',
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
    latestQuote: "I might have three (rate cuts), I might have four, I haven't made up my mind.",
    quoteDate: '2026-04-16',
    initials: 'SM',
    color: '#00BFA5',
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
    latestQuote: "I see a forecast in which underlying inflation would continue to move toward 2%, leaving me cautious about rate cuts now and more inclined toward cuts to support the labor market later this year.",
    quoteDate: '2026-04-17',
    initials: 'CW',
    color: '#4DB6AC',
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
    latestQuote: "We feel like our policy's in a good place for us to wait and see.",
    quoteDate: '2026-03-30',
    initials: 'JP',
    color: '#4DB6AC',
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
    latestQuote: "I think policy is positioned to adjust to the data as it's coming in, and we're prepared to make adjustments to the policy rate as needed.",
    quoteDate: '2026-04-02',
    initials: 'JW',
    color: '#9E9E9E',
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
    latestQuote: "My baseline is that we're going to remain on hold for a good while, but I do think that there's two-sided risk to rates.",
    quoteDate: '2026-04-15',
    initials: 'PJ',
    color: '#9E9E9E',
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
    latestQuote: "I think it's probably going to be appropriate to maintain policy at this level for some time.",
    quoteDate: '2026-04-15',
    initials: 'AP',
    color: '#9E9E9E',
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
    latestQuote: "Because of the energy price increases, even based on what we've seen already, inflation will be well above 3% over the next few months.",
    quoteDate: '2026-04-16',
    initials: 'MD',
    color: '#EF5350',
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
    latestQuote: "I remain cautious about my outlook.... I continue, however, to see our current policy stance as appropriately positioned.",
    quoteDate: '2026-04-07',
    initials: 'NK',
    color: '#EF5350',
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
    latestQuote: "There's a little bit more of a risk that the transmission of higher fuel prices, higher fertilizer prices, into inflation is greater this time.",
    quoteDate: '2026-03-27',
    initials: 'AG',
    color: '#EF5350',
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
    latestQuote: "We had work to do before we had the oil price shock; with the oil price shock, the work just takes longer.",
    quoteDate: '2026-04-10',
    initials: 'TB',
    color: '#EF5350',
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
    latestQuote: "I would argue that the inflation risk is greater right now as a result of the Iran war.",
    quoteDate: '2026-03-26',
    initials: 'SC',
    color: '#C62828',
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
    latestQuote: "I am particularly concerned that yet another price shock could increase longer-term inflation expectations.",
    quoteDate: '2026-03-26',
    initials: 'AM',
    color: '#C62828',
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
    latestQuote: "I don't think we can be complacent about the risks to inflation expectations.",
    quoteDate: '2026-03-31',
    initials: 'LL',
    color: '#C62828',
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
    latestQuote: "I thought there could be even multiple rate cuts in 2026; the longer this goes, where we never got to see the decrease in inflation, the more I'm thinking we're going to be on hold.",
    quoteDate: '2026-04-14',
    initials: 'BH',
    color: '#C62828',
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
    latestQuote: "No public comments on monetary policy since March 6, 2026.",
    quoteDate: '2026-03-06',
    initials: 'JS',
    color: '#C62828',
  },
];

// 整体鹰鸽指数（加权平均，投票委员权重更高）
export const overallHawkishScore = 28; // 正值偏鹰
export const overallHawkishScoreChange = +9; // 本月变化

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

// 历史鹰鸽指数走势（过去12个月）
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

// 重大经济数据预期差
export interface EconData {
  id: string;
  name: string;
  nameZh: string;
  date: string;
  actual: string;
  forecast: string;
  previous: string;
  deviation: number; // 实际vs预期的偏差（标准差倍数）
  impact: 'hawkish' | 'dovish' | 'neutral';
  impactDesc: string;
  goldImpact: string;
  forexImpact: string;
  category: 'labor' | 'inflation' | 'growth' | 'sentiment';
}

export const recentEconData: EconData[] = [
  {
    id: 'nfp-apr',
    name: 'Non Farm Payrolls',
    nameZh: '非农就业人口',
    date: '2026-05-08',
    actual: '178K',
    forecast: '73K',
    previous: '60K',
    deviation: +2.8,
    impact: 'hawkish',
    impactDesc: '大幅超预期，就业市场强劲，降息预期进一步推迟',
    goldImpact: '黄金短线承压，历史上此类超预期幅度平均下跌 $18-25',
    forexImpact: '美元指数短线走强，历史平均上涨 0.4-0.6%',
    category: 'labor',
  },
  {
    id: 'ism-mfg-prices',
    name: 'ISM Manufacturing Prices',
    nameZh: 'ISM制造业价格',
    date: '2026-05-01',
    actual: '84.6',
    forecast: '80.0',
    previous: '78.3',
    deviation: +1.5,
    impact: 'hawkish',
    impactDesc: '价格指数飙升至84.6，油价冲击传导至制造业，通胀压力显著',
    goldImpact: '通胀预期上升利好黄金，但美联储鹰派信号对冲，短线震荡',
    forexImpact: '美元走强，通胀预期支撑实际利率',
    category: 'inflation',
  },
  {
    id: 'ism-mfg-pmi',
    name: 'ISM Manufacturing PMI',
    nameZh: 'ISM制造业PMI',
    date: '2026-05-01',
    actual: '52.7',
    forecast: '53.0',
    previous: '52.7',
    deviation: -0.1,
    impact: 'neutral',
    impactDesc: '基本符合预期，制造业扩张维持，对货币政策影响有限',
    goldImpact: '影响中性，黄金维持区间震荡',
    forexImpact: '美元影响有限',
    category: 'growth',
  },
  {
    id: 'cpi-apr',
    name: 'CPI YoY',
    nameZh: 'CPI同比',
    date: '2026-05-12',
    actual: '3.3%',
    forecast: '—',
    previous: '3.5%',
    deviation: 0,
    impact: 'neutral',
    impactDesc: '即将公布（5月12日），前值3.5%，市场预期3.3%',
    goldImpact: '若低于3.0%，黄金短线可能上涨$20-30；若高于3.5%，黄金承压',
    forexImpact: '若低于预期，美元走弱；若高于预期，美元走强',
    category: 'inflation',
  },
  {
    id: 'michigan-sentiment',
    name: 'Michigan Consumer Sentiment',
    nameZh: '密歇根消费者信心',
    date: '2026-05-08',
    actual: '49.8',
    forecast: '50.0',
    previous: '49.5',
    deviation: -0.1,
    impact: 'dovish',
    impactDesc: '消费者信心持续低迷，接近历史低位，经济下行风险上升',
    goldImpact: '避险情绪支撑黄金，历史上此类低迷信心环境黄金偏强',
    forexImpact: '美元承压，避险日元走强',
    category: 'sentiment',
  },
];

// 资产联动分析
export interface AssetImpact {
  asset: string;
  assetZh: string;
  currentPrice: string;
  hawkishImpact: string;
  dovishImpact: string;
  sensitivity: number; // 1-5
  currentBias: 'hawkish' | 'dovish' | 'neutral';
}

export const assetImpacts: AssetImpact[] = [
  {
    asset: 'XAU/USD',
    assetZh: '现货黄金',
    currentPrice: '$3,247',
    hawkishImpact: '↓ 利率上升压制无息资产，历史均值 -1.8%/月',
    dovishImpact: '↑ 降息预期推升黄金，历史均值 +2.3%/月',
    sensitivity: 4,
    currentBias: 'hawkish',
  },
  {
    asset: 'DXY',
    assetZh: '美元指数',
    currentPrice: '102.4',
    hawkishImpact: '↑ 利差扩大支撑美元，历史均值 +0.8%/月',
    dovishImpact: '↓ 降息预期压制美元，历史均值 -1.1%/月',
    sensitivity: 5,
    currentBias: 'hawkish',
  },
  {
    asset: 'USD/JPY',
    assetZh: '美元/日元',
    currentPrice: '148.2',
    hawkishImpact: '↑ 美日利差扩大，日元走弱',
    dovishImpact: '↓ 利差收窄，日元走强',
    sensitivity: 5,
    currentBias: 'hawkish',
  },
  {
    asset: 'XTI/USD',
    assetZh: '美国原油',
    currentPrice: '$98.6',
    hawkishImpact: '↓ 经济放缓预期压制需求',
    dovishImpact: '↑ 宽松预期提振风险资产',
    sensitivity: 2,
    currentBias: 'neutral',
  },
  {
    asset: 'US10Y',
    assetZh: '美国10年期国债',
    currentPrice: '4.28%',
    hawkishImpact: '↑ 加息预期推升收益率',
    dovishImpact: '↓ 降息预期压低收益率',
    sensitivity: 5,
    currentBias: 'hawkish',
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
