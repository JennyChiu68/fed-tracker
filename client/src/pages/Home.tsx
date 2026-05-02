/**
 * 央行政策鹰鸽量化追踪器 - 主页面 v3
 * 优化：官方照片头像 + 中文表态 + 动态资产联动 + 替换数据预期差模块
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import {
  fomcMembers,
  overallHawkishScore,
  overallHawkishScoreChange,
  stanceDistribution,
  policyRate,
  hawkishHistory,
  assetLiveData,
  stanceLabels,
  type FomcMember,
  type Stance,
  type AssetLiveData,
} from '@/lib/fomcData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1200, decimals = 0 }: { value: number; duration?: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if ((step > 0 && start >= value) || (step < 0 && start <= value)) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(parseFloat(start.toFixed(decimals)));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration, decimals]);
  return <>{display.toFixed(decimals)}</>;
}

// ─── Stance Badge ─────────────────────────────────────────────────────────────
function StanceBadge({ stance }: { stance: Stance }) {
  const colorMap: Record<Stance, string> = {
    dove: 'bg-[#00BFA5]/15 text-[#00BFA5] border-[#00BFA5]/30',
    dovish: 'bg-[#4DB6AC]/15 text-[#4DB6AC] border-[#4DB6AC]/30',
    centrist: 'bg-[#9E9E9E]/15 text-[#9E9E9E] border-[#9E9E9E]/30',
    hawkish: 'bg-[#EF5350]/15 text-[#EF5350] border-[#EF5350]/30',
    hawk: 'bg-[#C62828]/15 text-[#C62828] border-[#C62828]/30',
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap ${colorMap[stance]}`}>
      {stanceLabels[stance]}
    </span>
  );
}

// ─── Member Avatar（官方照片版）────────────────────────────────────────────────
function MemberAvatar({ member, size = 'md' }: { member: FomcMember; size?: 'sm' | 'md' | 'lg' }) {
  const [imgError, setImgError] = useState(false);
  const sizeMap = {
    sm: { outer: 'w-9 h-9', text: 'text-sm' },
    md: { outer: 'w-11 h-11', text: 'text-base' },
    lg: { outer: 'w-14 h-14', text: 'text-lg' },
  };
  const hasPhoto = member.photoUrl && !imgError;

  return (
    <div
      className={`${sizeMap[size].outer} rounded-full flex-shrink-0 overflow-hidden`}
      style={{
        border: `2px solid ${member.color}60`,
        boxShadow: `0 0 12px ${member.color}30`,
      }}
    >
      {hasPhoto ? (
        <img
          src={member.photoUrl}
          alt={member.nameZh}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-bold ${sizeMap[size].text}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${member.color}40, ${member.color}15)`,
            color: member.color,
            fontFamily: 'Noto Sans SC, sans-serif',
          }}
        >
          {member.nameZh.slice(0, 1)}
        </div>
      )}
    </div>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score < -20 ? '#00BFA5' : score > 20 ? '#EF5350' : '#9E9E9E';
  const leftPct = score >= 0 ? 50 : 50 + score / 2;
  const widthPct = Math.abs(score) / 2;
  return (
    <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden w-full">
      <motion.div
        className="absolute top-0 h-full rounded-full"
        style={{ background: color, left: `${leftPct}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${widthPct}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      />
      <div className="absolute top-0 left-1/2 w-px h-full bg-white/20" />
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({ member, onClick, isSelected }: { member: FomcMember; onClick: () => void; isSelected: boolean }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -1 }}
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border border-[#E8B84B]/40 bg-[#E8B84B]/5'
          : 'border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-3">
        <MemberAvatar member={member} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm text-white/90 whitespace-nowrap">{member.nameZh}</span>
            {member.isPermanentVoter && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E8B84B]/15 text-[#E8B84B] border border-[#E8B84B]/20 whitespace-nowrap">永久票委</span>
            )}
            {member.isCurrentVoter && !member.isPermanentVoter && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/8 text-white/50 border border-white/10 whitespace-nowrap">轮值票委</span>
            )}
          </div>
          <div className="text-white/40 text-xs mt-0.5 truncate">{member.titleZh}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <StanceBadge stance={member.stance} />
            <span className="font-mono-data text-xs tabular-nums" style={{ color: member.color }}>
              {member.score > 0 ? '+' : ''}{member.score}
            </span>
            <span className={`font-mono-data text-xs tabular-nums ${member.scoreChange > 0 ? 'text-[#EF5350]' : 'text-[#00BFA5]'}`}>
              {member.scoreChange > 0 ? '▲' : '▼'}{Math.abs(member.scoreChange)}
            </span>
          </div>
        </div>
        <div className="w-16 flex-shrink-0">
          <ScoreBar score={member.score} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Overall Spectrum Bar ─────────────────────────────────────────────────────
function OverallSpectrumBar() {
  const total = Object.values(stanceDistribution).reduce((a, b) => a + b, 0);
  const segments = [
    { key: 'dove', label: '强鸽', count: stanceDistribution.dove, color: '#00BFA5' },
    { key: 'dovish', label: '偏鸽', count: stanceDistribution.dovish, color: '#4DB6AC' },
    { key: 'centrist', label: '中性', count: stanceDistribution.centrist, color: '#6B7280' },
    { key: 'hawkish', label: '偏鹰', count: stanceDistribution.hawkish, color: '#EF5350' },
    { key: 'hawk', label: '强鹰', count: stanceDistribution.hawk, color: '#C62828' },
  ];
  return (
    <div className="space-y-3">
      <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.key}
            initial={{ width: 0 }}
            animate={{ width: `${(seg.count / total) * 100}%` }}
            transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
            className="h-full"
            style={{ background: seg.color, minWidth: seg.count > 0 ? '4px' : 0 }}
            title={`${seg.label}: ${seg.count}人`}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {segments.map(seg => (
          <div key={seg.key} className="flex flex-col items-center gap-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
            <span className="text-[10px] text-white/40 whitespace-nowrap">{seg.label}</span>
            <span className="font-mono-data text-xs font-bold" style={{ color: seg.color }}>{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const color = val > 0 ? '#EF5350' : '#00BFA5';
  return (
    <div className="bg-[#1A1F2E] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-white/50 mb-1">{label}</div>
      <div className="font-mono-data font-bold" style={{ color }}>
        {val > 0 ? '鹰派 +' : '鸽派 '}{val}
      </div>
    </div>
  );
}

// ─── Dynamic Asset Panel ──────────────────────────────────────────────────────
// 核心：接入真实行情 + 根据鹰鸽指数动态计算联动估值
function DynamicAssetPanel({ hawkScore }: { hawkScore: number }) {
  const [prevScore, setPrevScore] = useState(hawkScore);
  const [flashAsset, setFlashAsset] = useState<string | null>(null);

  // 接入真实行情，每60秒刷新一次
  const { data: liveData, isLoading: pricesLoading } = trpc.market.prices.useQuery(
    undefined,
    { refetchInterval: 60_000, staleTime: 30_000 }
  );

  useEffect(() => {
    if (hawkScore !== prevScore) {
      const maxSensAsset = assetLiveData.reduce((a, b) => a.sensitivity > b.sensitivity ? a : b);
      setFlashAsset(maxSensAsset.asset);
      setTimeout(() => setFlashAsset(null), 1500);
      setPrevScore(hawkScore);
    }
  }, [hawkScore, prevScore]);

  // 计算联动价格：基准价格 + (鹰鸽指数/10) * 每10点敏感度
  const calcLinkedPrice = (asset: AssetLiveData) => {
    const delta = (hawkScore / 10) * asset.sensitivityPer10;
    return asset.basePrice + delta;
  };

  // 获取真实当前价（优先用API数据，fallback用静态数据）
  const getLivePrice = (asset: AssetLiveData): number => {
    const live = liveData?.[asset.asset];
    return live?.price ?? asset.currentPrice;
  };

  const getLiveChange = (asset: AssetLiveData): { change: number; changePct: number } => {
    const live = liveData?.[asset.asset];
    return { change: live?.change ?? 0, changePct: live?.changePct ?? 0 };
  };

  // 计算当前价格偏离联动价格的幅度
  const calcDeviation = (asset: AssetLiveData) => {
    const linked = calcLinkedPrice(asset);
    const current = getLivePrice(asset);
    return current - linked;
  };

  return (
    <div className="space-y-2.5">
      {pricesLoading && (
        <div className="text-center text-white/30 text-xs py-3 flex items-center justify-center gap-2">
          <div className="w-3 h-3 border border-[#E8B84B]/40 border-t-[#E8B84B] rounded-full animate-spin" />
          正在获取实时行情…
        </div>
      )}
      {assetLiveData.map((asset) => {
        const livePrice = getLivePrice(asset);
        const { change, changePct } = getLiveChange(asset);
        const linkedPrice = calcLinkedPrice(asset);
        const deviation = calcDeviation(asset);
        const isHawkishPositive = asset.hawkishDirection === 1;
        const priceColor = isHawkishPositive
          ? (hawkScore > 0 ? '#EF5350' : '#00BFA5')
          : (hawkScore > 0 ? '#00BFA5' : '#EF5350');
        const isFlashing = flashAsset === asset.asset;
        const deviationAbs = Math.abs(deviation);
        const deviationPct = (deviationAbs / asset.basePrice) * 100;
        const isLive = !!(liveData?.[asset.asset]);

        return (
          <motion.div
            key={asset.asset}
            animate={isFlashing ? { scale: [1, 1.02, 1], opacity: [1, 0.7, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="rounded-lg p-3 border border-white/6 bg-white/[0.02]"
          >
            {/* 顶部：品种名 + 当前价 + 联动价 */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-data text-sm font-bold text-white/85">{asset.asset}</span>
                  <span className="text-[10px] text-white/40">{asset.assetZh}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full" style={{ background: i < asset.sensitivity ? '#E8B84B' : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-white/35 mt-0.5">{asset.description}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end mb-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLive ? 'bg-[#00BFA5] live-dot' : 'bg-white/20'}`} />
                  <div className="text-[10px] text-white/40">{isLive ? '实时价' : '参考价'}</div>
                </div>
                <motion.div
                  key={livePrice}
                  initial={{ opacity: 0.6, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono-data font-bold text-sm text-white/90 tabular-nums"
                >
                  {asset.unit}{livePrice.toFixed(asset.precision)}
                </motion.div>
                {isLive && (
                  <div className={`text-[10px] font-mono-data tabular-nums ${change >= 0 ? 'text-[#EF5350]' : 'text-[#00BFA5]'}`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(asset.precision)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%)
                  </div>
                )}
              </div>
            </div>

            {/* 联动价格展示 */}
            <div className="grid grid-cols-3 gap-2">
              {/* 基准价（中性） */}
              <div className="bg-white/4 rounded-md p-2 text-center">
                <div className="text-[9px] text-white/35 mb-0.5">中性基准</div>
                <div className="font-mono-data text-xs text-white/50 tabular-nums">
                  {asset.unit}{asset.basePrice.toFixed(asset.precision)}
                </div>
              </div>
              {/* 联动价（基于当前鹰鸽指数） */}
              <div className="rounded-md p-2 text-center" style={{ background: `${priceColor}12`, border: `1px solid ${priceColor}30` }}>
                <div className="text-[9px] text-white/35 mb-0.5">联动估值</div>
                <motion.div
                  key={hawkScore}
                  initial={{ scale: 1.1, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="font-mono-data text-xs font-bold tabular-nums"
                  style={{ color: priceColor }}
                >
                  {asset.unit}{linkedPrice.toFixed(asset.precision)}
                </motion.div>
              </div>
              {/* 偏离度（当前价 vs 联动价） */}
              <div className="bg-white/4 rounded-md p-2 text-center">
                <div className="text-[9px] text-white/35 mb-0.5">市场偏离</div>
                <div className={`font-mono-data text-xs font-bold tabular-nums ${deviation > 0 ? 'text-[#EF5350]' : deviation < 0 ? 'text-[#00BFA5]' : 'text-white/40'}`}>
                  {deviation > 0 ? '+' : ''}{deviation.toFixed(asset.precision)}
                  <span className="text-[8px] ml-0.5 opacity-60">({deviationPct.toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            {/* 方向指示条 */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: priceColor, width: `${Math.min(Math.abs(hawkScore), 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(hawkScore), 100)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="text-[10px] font-mono-data flex-shrink-0" style={{ color: priceColor }}>
                {isHawkishPositive ? (hawkScore > 0 ? '↑ 鹰派利好' : '↓ 鸽派利好') : (hawkScore > 0 ? '↓ 鹰派利空' : '↑ 鸽派利好')}
              </span>
            </div>
          </motion.div>
        );
      })}

      <div className="text-[10px] text-white/25 pt-1 leading-relaxed">
        联动估值 = 中性基准 + 鹰鸽指数联动量 · 市场偏离 = 当前价 - 联动估值
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [selectedMember, setSelectedMember] = useState<FomcMember | null>(
    fomcMembers.find(m => m.id === 'powell') ?? fomcMembers[0]
  );
  const [activeFilter, setActiveFilter] = useState<Stance | 'all' | 'voter'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  // 模拟鹰鸽指数可以被用户调整（用于演示联动效果）
  const [demoScore, setDemoScore] = useState(overallHawkishScore);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredMembers = fomcMembers.filter(m => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'voter') return m.isCurrentVoter;
    return m.stance === activeFilter;
  });

  const handleMemberClick = (member: FomcMember) => {
    setSelectedMember(prev => (prev && prev.id === member.id) ? null : member);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  };

  const overallColor = demoScore > 20 ? '#EF5350' : demoScore < -20 ? '#00BFA5' : '#9E9E9E';
  const overallLabel = demoScore > 30 ? '整体偏鹰' : demoScore > 10 ? '中性偏鹰' : demoScore < -30 ? '整体偏鸽' : demoScore < -10 ? '中性偏鸽' : '中性';

  return (
    <div className="min-h-screen bg-[#0D1117] overflow-x-hidden">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/6" style={{ background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="container">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8B84B, #C9922A)' }}>
                <span className="text-[10px] font-black text-[#0D1117]">金</span>
              </div>
              <span className="text-white/90 font-semibold text-sm whitespace-nowrap" style={{ fontFamily: 'Space Grotesk' }}>金十数据</span>
              <span className="text-[#E8B84B] text-xs font-medium whitespace-nowrap">· VIP专享</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00BFA5] live-dot flex-shrink-0" />
                <span className="font-mono-data">实时更新</span>
              </div>
              <div className="font-mono-data text-xs text-white/30 tabular-nums">
                {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/309938607060186295/HFw9hCho6jimhD6QwVi5QK/hero-bg-3M6hcBw5towcfDCzy7AQyS.webp)` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,17,23,0.55) 0%, rgba(13,17,23,0.85) 65%, rgba(13,17,23,1) 100%)' }} />
        <div className="relative container py-8 sm:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded-full bg-[#E8B84B]" />
              <span className="text-[#E8B84B] text-xs font-medium tracking-widest">FED HAWK-DOVE TRACKER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
              美联储政策立场<br className="sm:hidden" />
              <span className="text-[#E8B84B]">鹰鸽量化追踪器</span>
            </h1>
            <p className="text-white/50 text-sm max-w-md leading-relaxed">
              实时量化16位FOMC成员的货币政策立场，将模糊的央行语言转化为精确的交易信号
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
            {[
              { label: '综合鹰鸽指数', valueNum: demoScore, prefix: demoScore > 0 ? '+' : '', suffix: '', color: overallColor, sub: overallLabel, change: overallHawkishScoreChange },
              { label: '当前政策利率', valueStr: policyRate.current, color: '#E8B84B', sub: '目标区间', change: null },
              { label: '鹰派票委', valueNum: stanceDistribution.hawk + stanceDistribution.hawkish, prefix: '', suffix: '人', color: '#EF5350', sub: `共${fomcMembers.length}位成员`, change: null },
              { label: '下次会议', valueStr: '6月17日', color: '#9E9E9E', sub: '预期维持不变', change: null },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="card-gold-glow rounded-xl p-3 sm:p-4"
              >
                <div className="text-white/40 text-[11px] mb-1.5 leading-tight">{m.label}</div>
                <div className="font-mono-data font-bold leading-none" style={{ color: m.color, fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>
                  {'valueNum' in m ? (
                    <>{m.prefix}<AnimatedNumber value={m.valueNum!} />{m.suffix}</>
                  ) : m.valueStr}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-white/40 text-[11px] truncate">{m.sub}</span>
                  {m.change !== null && (
                    <span className={`text-[11px] font-mono-data flex-shrink-0 ${m.change > 0 ? 'text-[#EF5350]' : 'text-[#00BFA5]'}`}>
                      {m.change > 0 ? '▲' : '▼'}{Math.abs(m.change)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container pb-16 space-y-5 mt-2">

        {/* ── Row 1: Spectrum + History ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Spectrum Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="lg:col-span-2 card-gold-glow rounded-xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white/90 font-semibold text-sm">整体鹰鸽分布</h2>
                <p className="text-white/40 text-xs mt-0.5">当前FOMC全体成员立场</p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="font-mono-data font-bold text-xl tabular-nums" style={{ color: overallColor }}>
                  {demoScore > 0 ? '+' : ''}{demoScore}
                </div>
                <div className="text-xs" style={{ color: overallColor }}>{overallLabel}</div>
              </div>
            </div>
            <OverallSpectrumBar />

            {/* 投票委员 - 官方照片版 */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-white/40 text-xs mb-3">当前投票委员（共10票）</div>
              <div className="flex flex-wrap gap-2">
                {fomcMembers.filter(m => m.isCurrentVoter).map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleMemberClick(m)}
                    className="flex flex-col items-center gap-1 group"
                    title={`${m.nameZh}（${stanceLabels[m.stance]}）`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden transition-transform group-hover:scale-110"
                      style={{ border: `2px solid ${m.color}50`, boxShadow: `0 0 8px ${m.color}20` }}>
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.nameZh} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold"
                          style={{ background: `${m.color}20`, color: m.color, fontFamily: 'Noto Sans SC' }}>
                          {m.nameZh.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-white/40 whitespace-nowrap">{m.nameZh}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Policy context */}
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              {[
                { label: '4月FOMC决议', value: '维持利率不变', color: 'text-white/70' },
                { label: '异议票数', value: '3票鹰派异议', color: 'text-[#EF5350] font-bold' },
                { label: '2026年降息预期', value: '1次（25bp）', color: 'text-white/70' },
                { label: '下任主席', value: 'Kevin Warsh', color: 'text-[#E8B84B]' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-white/40 flex-shrink-0">{row.label}</span>
                  <span className={`font-mono-data ${row.color} text-right`}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* History Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="lg:col-span-3 card-gold-glow rounded-xl p-4 sm:p-5"
          >
            <div className="flex items-start justify-between mb-4 gap-2">
              <div>
                <h2 className="text-white/90 font-semibold text-sm">鹰鸽指数历史走势</h2>
                <p className="text-white/40 text-xs mt-0.5">过去12个月综合立场变化</p>
              </div>
              <div className="flex items-center gap-3 text-xs flex-shrink-0">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#EF5350]" />
                  <span className="text-white/40">鹰</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#00BFA5]" />
                  <span className="text-white/40">鸽</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={hawkishHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="hawkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF5350" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF5350" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[-40, 40]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="score" stroke="#E8B84B" strokeWidth={2} fill="url(#hawkGrad)"
                  dot={{ fill: '#E8B84B', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#E8B84B', stroke: '#0D1117', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 rounded-lg bg-[#EF5350]/8 border border-[#EF5350]/15">
              <p className="text-xs text-white/60 leading-relaxed">
                <span className="text-[#EF5350] font-semibold">趋势解读：</span>
                自2026年2月起，美联储整体立场持续向鹰派偏移，主因伊朗战争推升油价导致通胀压力重燃。4月FOMC会议出现3票鹰派异议，为近年罕见，显示内部分歧加剧。
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Row 2: Member List + Detail ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Member List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="lg:col-span-3 card-gold-glow rounded-xl p-4 sm:p-5"
          >
            <div className="mb-4">
              <h2 className="text-white/90 font-semibold text-sm">票委立场详情</h2>
              <p className="text-white/40 text-xs mt-0.5">点击任意委员查看官方照片与最新讲话</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap mb-4">
              {[
                { key: 'all', label: `全部 (${fomcMembers.length})` },
                { key: 'voter', label: `投票委员 (${fomcMembers.filter(m => m.isCurrentVoter).length})` },
                { key: 'dove', label: '强鸽' },
                { key: 'dovish', label: '偏鸽' },
                { key: 'centrist', label: '中性' },
                { key: 'hawkish', label: '偏鹰' },
                { key: 'hawk', label: '强鹰' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key as Stance | 'all' | 'voter')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all duration-150 font-medium whitespace-nowrap ${
                    activeFilter === f.key
                      ? 'bg-[#E8B84B]/15 text-[#E8B84B] border border-[#E8B84B]/30'
                      : 'bg-white/4 text-white/40 border border-white/6 hover:bg-white/8 hover:text-white/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-0.5">
              <AnimatePresence mode="popLayout">
                {filteredMembers.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <MemberCard member={member} onClick={() => handleMemberClick(member)} isSelected={selectedMember?.id === member.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Detail Panel */}
          <div className="lg:col-span-2 space-y-4" ref={detailRef}>
            <AnimatePresence mode="wait">
              {selectedMember ? (
                <motion.div
                  key={selectedMember.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl p-4 sm:p-5 space-y-4"
                  style={{
                    border: `1px solid ${selectedMember.color}30`,
                    background: 'linear-gradient(135deg, rgba(26,31,46,0.95) 0%, rgba(20,24,38,0.95) 100%)',
                    boxShadow: `0 0 30px ${selectedMember.color}12`,
                  }}
                >
                  {/* Header with official photo */}
                  <div className="flex items-start gap-3">
                    <MemberAvatar member={selectedMember} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-bold text-base leading-tight">{selectedMember.nameZh}</h3>
                        <StanceBadge stance={selectedMember.stance} />
                      </div>
                      <div className="text-white/40 text-xs mt-0.5 truncate">{selectedMember.name}</div>
                      <div className="text-white/50 text-xs truncate">{selectedMember.titleZh}</div>
                    </div>
                  </div>

                  {/* Score grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '鹰鸽评分', value: `${selectedMember.score > 0 ? '+' : ''}${selectedMember.score}`, color: selectedMember.color },
                      { label: '月度变化', value: `${selectedMember.scoreChange > 0 ? '+' : ''}${selectedMember.scoreChange}`, color: selectedMember.scoreChange > 0 ? '#EF5350' : '#00BFA5' },
                      { label: '投票权', value: selectedMember.isPermanentVoter ? '永久' : selectedMember.isCurrentVoter ? '轮值' : '无', color: selectedMember.isPermanentVoter ? '#E8B84B' : selectedMember.isCurrentVoter ? '#9E9E9E' : '#555' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/4 rounded-lg p-2.5 text-center">
                        <div className="text-white/40 text-[10px] mb-1">{s.label}</div>
                        <div className="font-mono-data font-bold text-lg tabular-nums" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Spectrum indicator */}
                  <div>
                    <div className="flex justify-between text-[10px] text-white/25 mb-1.5">
                      <span>极鸽 -100</span>
                      <span>+100 极鹰</span>
                    </div>
                    <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #00BFA5, #4DB6AC, #6B7280, #EF5350, #C62828)' }}>
                      <motion.div
                        className="absolute top-0 h-full w-0.5 bg-white rounded-full shadow-lg"
                        initial={{ left: '50%' }}
                        animate={{ left: `${((selectedMember.score + 100) / 200) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ transform: 'translateX(-50%)' }}
                      />
                    </div>
                  </div>

                  {/* Chinese quote */}
                  <div className="rounded-lg p-3" style={{ background: `${selectedMember.color}08`, border: `1px solid ${selectedMember.color}20` }}>
                    <div className="text-[10px] text-white/40 mb-1.5">💬 最新表态 · {selectedMember.quoteDate}</div>
                    <p className="text-sm text-white/85 leading-relaxed font-medium">
                      {selectedMember.latestQuoteZh}
                    </p>
                    <p className="text-[10px] text-white/30 leading-relaxed mt-2 italic border-t border-white/5 pt-2">
                      原文："{selectedMember.latestQuote}"
                    </p>
                  </div>

                  <button onClick={() => setSelectedMember(null)} className="w-full text-xs text-white/25 hover:text-white/45 transition-colors py-1">
                    收起 ↑
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card-gold-glow rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[160px]"
                >
                  <div className="text-3xl mb-2">🦅</div>
                  <div className="text-white/50 text-sm">点击左侧委员</div>
                  <div className="text-white/30 text-xs mt-1">查看官方照片与最新表态（中文）</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Row 3: Dynamic Asset Linkage ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="card-gold-glow rounded-xl p-4 sm:p-5"
        >
          <div className="flex items-start justify-between mb-2 gap-3">
            <div>
              <h2 className="text-white/90 font-semibold text-sm">资产实时联动分析</h2>
              <p className="text-white/40 text-xs mt-0.5">鹰鸽指数变化时，各资产联动估值实时重算</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded px-2 py-1 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8B84B] live-dot" />
              <span className="text-[#E8B84B] text-[10px] font-medium">联动中</span>
            </div>
          </div>

          {/* 鹰鸽指数滑块（Demo交互：拖动查看联动效果） */}
          <div className="mb-4 p-3 rounded-lg bg-white/3 border border-white/6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">🎛️ 拖动模拟鹰鸽指数变化，观察资产联动</span>
              <span className="font-mono-data text-sm font-bold tabular-nums" style={{ color: overallColor }}>
                {demoScore > 0 ? '+' : ''}{demoScore}
              </span>
            </div>
            <input
              type="range"
              min="-80"
              max="80"
              value={demoScore}
              onChange={(e) => setDemoScore(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00BFA5 0%, #6B7280 50%, #EF5350 100%)`,
                accentColor: overallColor,
              }}
            />
            <div className="flex justify-between text-[9px] text-white/25 mt-1">
              <span>极鸽 -80</span>
              <span>中性 0</span>
              <span>+80 极鹰</span>
            </div>
          </div>

          <DynamicAssetPanel hawkScore={demoScore} />
        </motion.div>

        {/* Footer */}
        <div className="text-center text-white/20 text-[11px] py-4 border-t border-white/5 leading-relaxed">
          <p>数据来源：路透社（票委立场）· 美联储官网（官方照片）· TradingEconomics（经济数据）· 2026年5月2日更新</p>
          <p className="mt-1">本工具仅供参考，不构成任何投资建议 · 金十数据 VIP 专享功能 Demo</p>
        </div>
      </div>
    </div>
  );
}
