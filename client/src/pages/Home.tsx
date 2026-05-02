/**
 * 央行政策鹰鸽量化追踪器 - 主页面
 * Design: 金十数据风格 · 专业暗金
 * Fix v2: 移动端溢出修复 + 委员改用中文姓名 + 整体精致化
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fomcMembers,
  overallHawkishScore,
  overallHawkishScoreChange,
  stanceDistribution,
  policyRate,
  hawkishHistory,
  recentEconData,
  assetImpacts,
  stanceLabels,
  type FomcMember,
  type Stance,
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
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
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

// ─── Member Avatar（中文名版）────────────────────────────────────────────────
function MemberAvatar({ member, size = 'md' }: { member: FomcMember; size?: 'sm' | 'md' | 'lg' }) {
  // 取中文姓名的第一个字（姓）
  const chineseChar = member.nameZh.slice(0, 1);
  const sizeMap = {
    sm: { outer: 'w-9 h-9', text: 'text-sm' },
    md: { outer: 'w-11 h-11', text: 'text-base' },
    lg: { outer: 'w-14 h-14', text: 'text-lg' },
  };
  return (
    <div
      className={`${sizeMap[size].outer} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${sizeMap[size].text}`}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${member.color}40, ${member.color}15)`,
        border: `1.5px solid ${member.color}60`,
        color: member.color,
        boxShadow: `0 0 12px ${member.color}25`,
        fontFamily: 'Noto Sans SC, sans-serif',
      }}
    >
      {chineseChar}
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
          {/* 姓名行 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm text-white/90 whitespace-nowrap">{member.nameZh}</span>
            {member.isPermanentVoter && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E8B84B]/15 text-[#E8B84B] border border-[#E8B84B]/20 whitespace-nowrap">永久票委</span>
            )}
            {member.isCurrentVoter && !member.isPermanentVoter && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/8 text-white/50 border border-white/10 whitespace-nowrap">轮值票委</span>
            )}
          </div>
          {/* 职位行 */}
          <div className="text-white/40 text-xs mt-0.5 truncate">{member.titleZh}</div>
          {/* 评分行 */}
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
        {/* 右侧迷你评分条 */}
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
    { key: 'dove',     label: '强鸽', count: stanceDistribution.dove,     color: '#00BFA5' },
    { key: 'dovish',   label: '偏鸽', count: stanceDistribution.dovish,   color: '#4DB6AC' },
    { key: 'centrist', label: '中性', count: stanceDistribution.centrist, color: '#6B7280' },
    { key: 'hawkish',  label: '偏鹰', count: stanceDistribution.hawkish,  color: '#EF5350' },
    { key: 'hawk',     label: '强鹰', count: stanceDistribution.hawk,     color: '#C62828' },
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
function CustomTooltip({ active, payload, label }: any) {
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

// ─── Econ Data Row ────────────────────────────────────────────────────────────
function EconDataRow({ data }: { data: typeof recentEconData[0] }) {
  const [expanded, setExpanded] = useState(false);
  const impactColors = { hawkish: '#EF5350', dovish: '#00BFA5', neutral: '#9E9E9E' };
  const impactLabels = { hawkish: '鹰派信号', dovish: '鸽派信号', neutral: '中性' };
  const deviationColor = data.deviation > 1 ? '#EF5350' : data.deviation < -1 ? '#00BFA5' : '#9E9E9E';
  const isUpcoming = data.actual === '—' || data.forecast === '—';

  return (
    <motion.div
      layout
      className={`border rounded-lg overflow-hidden transition-colors duration-200 ${
        expanded ? 'border-[#E8B84B]/30' : 'border-white/6 hover:border-white/12'
      }`}
      style={{ background: 'linear-gradient(135deg, rgba(26,31,46,0.8) 0%, rgba(20,24,38,0.8) 100%)' }}
    >
      <div className="flex items-center gap-2 p-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {/* 左：名称 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-white/90 truncate">{data.nameZh}</span>
            {isUpcoming && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E8B84B]/15 text-[#E8B84B] border border-[#E8B84B]/20 whitespace-nowrap flex-shrink-0">即将公布</span>
            )}
          </div>
          <div className="text-white/40 text-xs mt-0.5 truncate">{data.date}</div>
        </div>
        {/* 右：数值组 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-white/40">实际</div>
            <div className="font-mono-data font-bold text-sm text-white/90 tabular-nums">{data.actual}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-white/40">预期</div>
            <div className="font-mono-data text-sm text-white/50 tabular-nums">{data.forecast}</div>
          </div>
          {!isUpcoming && data.deviation !== 0 && (
            <div className="text-right">
              <div className="text-[10px] text-white/40">偏差</div>
              <div className="font-mono-data font-bold text-sm tabular-nums" style={{ color: deviationColor }}>
                {data.deviation > 0 ? '+' : ''}{data.deviation.toFixed(1)}σ
              </div>
            </div>
          )}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: impactColors[data.impact] }} />
            <span className="text-xs font-medium whitespace-nowrap hidden sm:inline" style={{ color: impactColors[data.impact] }}>
              {impactLabels[data.impact]}
            </span>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/30 text-xs flex-shrink-0"
          >▼</motion.span>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-white/5 pt-3 space-y-2">
              {/* 移动端补充显示 */}
              <div className="flex items-center gap-1.5 sm:hidden">
                <div className="w-2 h-2 rounded-full" style={{ background: impactColors[data.impact] }} />
                <span className="text-xs font-medium" style={{ color: impactColors[data.impact] }}>{impactLabels[data.impact]}</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{data.impactDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-[#E8B84B]/5 border border-[#E8B84B]/15 rounded-lg p-2.5">
                  <div className="text-[#E8B84B] text-xs font-semibold mb-1">🥇 黄金影响</div>
                  <div className="text-white/70 text-xs leading-relaxed">{data.goldImpact}</div>
                </div>
                <div className="bg-[#4DB6AC]/5 border border-[#4DB6AC]/15 rounded-lg p-2.5">
                  <div className="text-[#4DB6AC] text-xs font-semibold mb-1">💱 外汇影响</div>
                  <div className="text-white/70 text-xs leading-relaxed">{data.forexImpact}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [selectedMember, setSelectedMember] = useState<FomcMember | null>(null);
  const [activeFilter, setActiveFilter] = useState<Stance | 'all' | 'voter'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
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
    setSelectedMember(prev => prev?.id === member.id ? null : member);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  };

  const overallColor = overallHawkishScore > 20 ? '#EF5350' : overallHawkishScore < -20 ? '#00BFA5' : '#9E9E9E';
  const overallLabel = overallHawkishScore > 30 ? '整体偏鹰' : overallHawkishScore > 10 ? '中性偏鹰' : overallHawkishScore < -30 ? '整体偏鸽' : overallHawkishScore < -10 ? '中性偏鸽' : '中性';

  return (
    <div className="min-h-screen bg-[#0D1117] overflow-x-hidden">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/6" style={{ background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="container">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8B84B, #C9922A)' }}>
                <span className="text-[10px] font-black text-[#0D1117]">金</span>
              </div>
              <span className="text-white/90 font-semibold text-sm whitespace-nowrap" style={{ fontFamily: 'Space Grotesk' }}>金十数据</span>
              <span className="text-[#E8B84B] text-xs font-medium whitespace-nowrap">· VIP专享</span>
            </div>
            {/* Right controls */}
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

          {/* ── Key Metrics ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
            {[
              { label: '综合鹰鸽指数', valueNum: overallHawkishScore, prefix: overallHawkishScore > 0 ? '+' : '', suffix: '', color: overallColor, sub: overallLabel, change: overallHawkishScoreChange },
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
                  {overallHawkishScore > 0 ? '+' : ''}{overallHawkishScore}
                </div>
                <div className="text-xs" style={{ color: overallColor }}>{overallLabel}</div>
              </div>
            </div>
            <OverallSpectrumBar />

            {/* 投票委员 - 中文名版 */}
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
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-110"
                      style={{
                        background: `${m.color}20`,
                        border: `1.5px solid ${m.color}50`,
                        color: m.color,
                        fontFamily: 'Noto Sans SC, sans-serif',
                      }}
                    >
                      {m.nameZh.slice(0, 1)}
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
              <p className="text-white/40 text-xs mt-0.5">点击任意委员查看最新讲话与评分</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap mb-4">
              {[
                { key: 'all',      label: `全部 (${fomcMembers.length})` },
                { key: 'voter',    label: `投票委员 (${fomcMembers.filter(m => m.isCurrentVoter).length})` },
                { key: 'dove',     label: '强鸽' },
                { key: 'dovish',   label: '偏鸽' },
                { key: 'centrist', label: '中性' },
                { key: 'hawkish',  label: '偏鹰' },
                { key: 'hawk',     label: '强鹰' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key as any)}
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

          {/* Detail + Asset Panel */}
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
                  {/* Header */}
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

                  {/* Quote */}
                  <div className="rounded-lg p-3" style={{ background: `${selectedMember.color}08`, border: `1px solid ${selectedMember.color}20` }}>
                    <div className="text-[10px] text-white/40 mb-1.5">💬 最新表态 · {selectedMember.quoteDate}</div>
                    <p className="text-xs text-white/75 leading-relaxed italic">"{selectedMember.latestQuote}"</p>
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
                  <div className="text-white/30 text-xs mt-1">查看详细立场与最新讲话</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Asset Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              className="card-gold-glow rounded-xl p-4 sm:p-5"
            >
              <div className="mb-3">
                <h2 className="text-white/90 font-semibold text-sm">资产联动分析</h2>
                <p className="text-white/40 text-xs mt-0.5">当前鹰派偏移对各品种的影响</p>
              </div>
              <div className="space-y-3">
                {assetImpacts.map(asset => (
                  <div key={asset.asset} className="flex items-start gap-3">
                    <div className="w-14 flex-shrink-0 pt-0.5">
                      <div className="font-mono-data text-xs font-bold text-white/80">{asset.asset}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{asset.currentPrice}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-white/40">{asset.assetZh}</span>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < asset.sensitivity ? '#E8B84B' : 'rgba(255,255,255,0.08)' }} />
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] text-[#EF5350]/80 leading-snug">{asset.hawkishImpact}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-white/25">
                ●●●●● = 对政策利率最敏感
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Row 3: Economic Data ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          className="card-gold-glow rounded-xl p-4 sm:p-5"
        >
          <div className="flex items-start justify-between mb-4 gap-2">
            <div>
              <h2 className="text-white/90 font-semibold text-sm">重大数据预期差分析</h2>
              <p className="text-white/40 text-xs mt-0.5">实际值 vs 市场预期 · 点击展开交易影响</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] flex-shrink-0">
              {[{ c: '#EF5350', l: '鹰' }, { c: '#00BFA5', l: '鸽' }, { c: '#9E9E9E', l: '中性' }].map(x => (
                <div key={x.l} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: x.c }} />
                  <span className="text-white/40">{x.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deviation bars */}
          <div className="grid grid-cols-5 gap-2 mb-4 px-1">
            {recentEconData.map(data => {
              const isUpcoming = data.actual === '—';
              const barH = isUpcoming ? 0 : Math.min(Math.abs(data.deviation) * 22, 55);
              const barColor = data.impact === 'hawkish' ? '#EF5350' : data.impact === 'dovish' ? '#00BFA5' : '#6B7280';
              const shortName = data.nameZh.length > 5 ? data.nameZh.slice(0, 5) + '…' : data.nameZh;
              return (
                <div key={data.id} className="flex flex-col items-center gap-1">
                  <div className="text-[9px] text-white/40 text-center leading-tight h-7 flex items-end justify-center w-full overflow-hidden">
                    {shortName}
                  </div>
                  <div className="relative w-full h-14 flex items-center justify-center">
                    <div className="absolute top-1/2 w-full h-px bg-white/10" />
                    {!isUpcoming && data.deviation !== 0 && (
                      <motion.div
                        className="absolute w-5 rounded-sm"
                        style={{
                          background: barColor,
                          height: `${barH}px`,
                          bottom: data.deviation > 0 ? '50%' : 'auto',
                          top: data.deviation < 0 ? '50%' : 'auto',
                          opacity: 0.85,
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${barH}px` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    )}
                    {isUpcoming && <span className="text-[9px] text-[#E8B84B]">待公布</span>}
                  </div>
                  <div className="font-mono-data text-[10px] font-bold text-center tabular-nums" style={{ color: isUpcoming ? '#E8B84B' : barColor }}>
                    {isUpcoming ? '—' : `${data.deviation > 0 ? '+' : ''}${data.deviation.toFixed(1)}σ`}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {recentEconData.map(data => <EconDataRow key={data.id} data={data} />)}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-white/20 text-[11px] py-4 border-t border-white/5 leading-relaxed">
          <p>数据来源：路透社（票委立场）· TradingEconomics（经济数据）· 2026年5月2日更新</p>
          <p className="mt-1">本工具仅供参考，不构成任何投资建议 · 金十数据 VIP 专享功能 Demo</p>
        </div>
      </div>
    </div>
  );
}
