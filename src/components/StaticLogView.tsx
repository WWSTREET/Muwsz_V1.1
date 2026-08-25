import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export interface RetryRecord {
  retryCount: number;
  retryTime: string; // e.g. "2026-08-15 00:10:00"
  interval: '10分钟' | '1小时';
  status: 'FAILED' | 'SUCCESS';
  reason?: string;
}

export interface DailySnapshotLog {
  id: string;
  date: string; // YYYY-MM-DD
  snapshotTime: string; // e.g. "2026-08-15 00:00:00"
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'RETRYING';
  totalCount: number;
  totalIncrement: number; // 当天净新增
  // Platform counts and increments
  platforms: {
    website: { total: number; increment: number };
    douyin: { total: number; increment: number };
    weibo: { total: number; increment: number };
    toutiao: { total: number; increment: number };
    wechat: { total: number; increment: number };
  };
  durationMs: number; // 静态化耗时，毫秒
  operator: string; // "系统定时任务"
  remark?: string;
  retryCount?: number;
  retries?: RetryRecord[];
  isRetriedSuccess?: boolean; // 经过重试后成功
}

// Generate realistic mock snapshot logs for the past 30 days up to 2026-08-15
export const generateMockSnapshotLogs = (): DailySnapshotLog[] => {
  const logs: DailySnapshotLog[] = [];
  
  // Base numbers 30 days ago
  let currWeb = 158200;
  let currDouyin = 20850000;
  let currWeibo = 7350000;
  let currToutiao = 2540000;
  let currWechat = 210000;

  // We generate 30 days from 2026-07-17 to 2026-08-15
  const startDate = new Date('2026-07-17');
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Increments for each platform
    const webInc = Math.floor(280 + Math.sin(i / 2) * 120 + (i % 5 === 0 ? 160 : 0));
    const douyinInc = Math.floor(28000 + Math.cos(i / 3) * 6000 + (i % 7 === 0 ? 12000 : 0));
    const weiboInc = Math.floor(9500 + Math.sin(i / 4) * 2200 + (i % 6 === 0 ? 4500 : 0));
    const toutiaoInc = Math.floor(3800 + Math.cos(i / 2.5) * 900 + (i % 4 === 0 ? 1500 : 0));
    const wechatInc = Math.floor(450 + Math.sin(i / 3) * 160 + (i % 8 === 0 ? 280 : 0));

    currWeb += webInc;
    currDouyin += douyinInc;
    currWeibo += weiboInc;
    currToutiao += toutiaoInc;
    currWechat += wechatInc;

    const totalInc = webInc + douyinInc + weiboInc + toutiaoInc + wechatInc;
    const totalCount = currWeb + currDouyin + currWeibo + currToutiao + currWechat;

    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 1);
    const nextDateStr = nextD.toISOString().split('T')[0];

    let status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'RETRYING' = 'SUCCESS';
    let retries: RetryRecord[] | undefined = undefined;
    let retryCount: number | undefined = undefined;
    let isRetriedSuccess: boolean | undefined = undefined;
    let remark = i === 29 ? '今日凌晨静态化完成，数据正常归档' : '定时静态化已归档';

    if (i === 28) {
      status = 'SUCCESS';
      isRetriedSuccess = true;
      retryCount = 4;
      remark = '首次触发连接超时异常，经 4 次自动重试（前3次每10分钟，第4次每1小时）后全量入库';
      retries = [
        { retryCount: 1, retryTime: `${nextDateStr} 00:10:00`, interval: '10分钟', status: 'FAILED', reason: '抖音 API 数据接收超时 (10分钟重试 1/3)' },
        { retryCount: 2, retryTime: `${nextDateStr} 00:20:00`, interval: '10分钟', status: 'FAILED', reason: '抖音 API 数据接收超时 (10分钟重试 2/3)' },
        { retryCount: 3, retryTime: `${nextDateStr} 00:30:00`, interval: '10分钟', status: 'FAILED', reason: '上游网关 502 错误 (10分钟重试 3/3，已切换至 1小时重试模式)' },
        { retryCount: 4, retryTime: `${nextDateStr} 01:30:00`, interval: '1小时', status: 'SUCCESS', reason: '重试连接成功，增量数据校验完成归档' },
      ];
    } else if (i === 24) {
      status = 'SUCCESS';
      isRetriedSuccess = true;
      retryCount = 5;
      remark = '重试 5 次后恢复正常（前3次每10分钟，后2次每1小时）';
      retries = [
        { retryCount: 1, retryTime: `${nextDateStr} 00:10:00`, interval: '10分钟', status: 'FAILED', reason: '微信公众号接口限流 (10分钟重试 1/3)' },
        { retryCount: 2, retryTime: `${nextDateStr} 00:20:00`, interval: '10分钟', status: 'FAILED', reason: '微信公众号接口限流 (10分钟重试 2/3)' },
        { retryCount: 3, retryTime: `${nextDateStr} 00:30:00`, interval: '10分钟', status: 'FAILED', reason: '微信公众号接口限流 (10分钟重试 3/3，已切换至 1小时重试模式)' },
        { retryCount: 4, retryTime: `${nextDateStr} 01:30:00`, interval: '1小时', status: 'FAILED', reason: '服务节点例行维护中 (1小时重试 1/次)' },
        { retryCount: 5, retryTime: `${nextDateStr} 02:30:00`, interval: '1小时', status: 'SUCCESS', reason: '维护结束，数据同步补扣成功' },
      ];
    } else if (i === 21) {
      status = 'RETRYING';
      retryCount = 4;
      remark = '静态化服务响应异常，当前正在以 1 小时频率循环重试中';
      retries = [
        { retryCount: 1, retryTime: `${nextDateStr} 00:10:00`, interval: '10分钟', status: 'FAILED', reason: '今日头条接口无响应 (10分钟重试 1/3)' },
        { retryCount: 2, retryTime: `${nextDateStr} 00:20:00`, interval: '10分钟', status: 'FAILED', reason: '今日头条接口无响应 (10分钟重试 2/3)' },
        { retryCount: 3, retryTime: `${nextDateStr} 00:30:00`, interval: '10分钟', status: 'FAILED', reason: '今日头条接口无响应 (10分钟重试 3/3，转入 1小时轮询模式)' },
        { retryCount: 4, retryTime: `${nextDateStr} 01:30:00`, interval: '1小时', status: 'FAILED', reason: '等待下一次 1小时轮询重试 (预计 02:30:00 执行)' },
      ];
    }

    logs.push({
      id: `snap_${dateStr.replace(/-/g, '')}`,
      date: dateStr,
      snapshotTime: `${nextDateStr} 00:00:00`,
      status,
      totalCount,
      totalIncrement: totalInc,
      platforms: {
        website: { total: currWeb, increment: webInc },
        douyin: { total: currDouyin, increment: douyinInc },
        weibo: { total: currWeibo, increment: weiboInc },
        toutiao: { total: currToutiao, increment: toutiaoInc },
        wechat: { total: currWechat, increment: wechatInc },
      },
      durationMs: Math.floor(1800 + Math.random() * 850),
      operator: '系统定时任务',
      remark,
      retryCount,
      retries,
      isRetriedSuccess,
    });
  }

  // Return reverse (latest first)
  return logs.reverse();
};

interface StaticLogViewProps {
  institutionName?: string;
}

export const StaticLogView: React.FC<StaticLogViewProps> = ({
  institutionName = '中共陕西省委网络安全和信息化委员会办公室'
}) => {
  const [logs, setLogs] = useState<DailySnapshotLog[]>(() => generateMockSnapshotLogs());
  const [dateRange, setDateRange] = useState<'30' | '14' | '7'>('30');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isManualRunning, setIsManualRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected detail modal log
  const [detailModalLog, setDetailModalLog] = useState<DailySnapshotLog | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filtered logs for table
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (startDate && log.date < startDate) return false;
      if (endDate && log.date > endDate) return false;
      if (statusFilter === 'SUCCESS') return log.status === 'SUCCESS' && !log.isRetriedSuccess;
      if (statusFilter === 'RETRY_SUCCESS') return log.status === 'SUCCESS' && log.isRetriedSuccess;
      if (statusFilter === 'RETRYING') return log.status === 'RETRYING' || log.status === 'FAILED';
      return true;
    });
  }, [logs, startDate, endDate, statusFilter]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, statusFilter]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Chart data prepared based on dateRange (sorted chronologically for chart)
  const chartData = useMemo(() => {
    const days = parseInt(dateRange, 10);
    const sliced = logs.slice(0, days).reverse();
    return sliced.map(item => ({
      date: item.date.substring(5), // MM-DD
      fullDate: item.date,
      总新增: item.totalIncrement,
      抖音: item.platforms.douyin.increment,
      新浪微博: item.platforms.weibo.increment,
      今日头条: item.platforms.toutiao.increment,
      网站: item.platforms.website.increment,
      微信公众号: item.platforms.wechat.increment,
      总台账数: item.totalCount
    }));
  }, [logs, dateRange]);

  // Summary Metrics of latest snapshot
  const latestLog = logs[0];
  const previousLog = logs[1] || logs[0];
  const dayOnDayRate = previousLog.totalIncrement > 0
    ? (((latestLog.totalIncrement - previousLog.totalIncrement) / previousLog.totalIncrement) * 100).toFixed(1)
    : '0.0';

  // Manual retry trigger for a single log record
  const handleManualRetrySingleLog = (logId: string) => {
    setLogs(prev => prev.map(log => {
      if (log.id !== logId) return log;
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newCount = (log.retryCount || 0) + 1;
      const newRetryRecord: RetryRecord = {
        retryCount: newCount,
        retryTime: nowStr,
        interval: newCount <= 3 ? '10分钟' : '1小时',
        status: 'SUCCESS',
        reason: '管理员在控制台手动触发重试，增量数据同步成功'
      };
      const updated: DailySnapshotLog = {
        ...log,
        status: 'SUCCESS',
        isRetriedSuccess: true,
        retryCount: newCount,
        retries: [...(log.retries || []), newRetryRecord],
        remark: `经过 ${newCount} 次重试后成功（管理员于 ${nowStr} 手动发起即时重试）`
      };
      setDetailModalLog(updated);
      return updated;
    }));
    setToastMessage('手动即时重试成功！数据已全量补扣同步并归档。');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Manual trigger instant staticize
  const handleTriggerManualSnapshot = () => {
    setIsManualRunning(true);
    setTimeout(() => {
      setIsManualRunning(false);
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const todayStr = nowStr.substring(0, 10);

      // Create or update today's log
      const updatedLog: DailySnapshotLog = {
        id: `manual_snap_${Date.now()}`,
        date: todayStr,
        snapshotTime: nowStr,
        status: 'SUCCESS',
        totalCount: (latestLog?.totalCount || 32553646) + 128,
        totalIncrement: (latestLog?.totalIncrement || 42500) + 128,
        platforms: {
          website: { total: latestLog.platforms.website.total + 8, increment: latestLog.platforms.website.increment + 8 },
          douyin: { total: latestLog.platforms.douyin.total + 75, increment: latestLog.platforms.douyin.increment + 75 },
          weibo: { total: latestLog.platforms.weibo.total + 32, increment: latestLog.platforms.weibo.increment + 32 },
          toutiao: { total: latestLog.platforms.toutiao.total + 11, increment: latestLog.platforms.toutiao.increment + 11 },
          wechat: { total: latestLog.platforms.wechat.total + 2, increment: latestLog.platforms.wechat.increment + 2 },
        },
        durationMs: 1420,
        operator: '管理员手动触发',
        remark: '手动执行即时静态化成功，各平台数量已校验入库'
      };

      setLogs(prev => [updatedLog, ...prev.filter(l => l.id !== updatedLog.id)]);
      setToastMessage('手动执行静态化成功！已生成最新数据快照。');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col space-y-4 pb-12 text-xs">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-[#f6ffed] border border-[#b7eb8f] text-[#389e0d] px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 animate-in slide-in-from-top-2">
          <i className="fa-solid fa-circle-check text-base text-[#52c41a]"></i>
          <span className="font-medium text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header Info & Cron Schedule Tip */}
      <div className="flex items-center justify-between bg-blue-50/60 border border-blue-100 rounded-sm p-3.5 gap-4">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#1677ff]/10 text-[#1677ff] flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="font-bold text-gray-800 text-xs">每日凌晨静态化归档与失败自动重试机制</span>
              <span className="bg-[#e6f4ff] text-[#1677ff] border border-[#91caff] px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap">
                每日 00:00:00 自动执行
              </span>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center space-x-1 whitespace-nowrap">
                <i className="fa-solid fa-arrows-rotate text-[10px]"></i>
                <span>失败重试: 10分钟/次(前3次) → 1小时/次</span>
              </span>
              <span className="bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full text-[10px] flex items-center space-x-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>定时与重试调度正常</span>
              </span>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              系统每日 00:00 自动对网站、抖音、新浪微博、今日头条、微信公众号执行数据快照静态化归档。如因网络、接口异常归档失败将自动重试：前 3 次间隔 10 分钟重试；3 次仍失败则改为每 1 小时重试，直至执行成功。
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 whitespace-nowrap">
          <div className="text-right text-[11px] text-gray-500 hidden md:block whitespace-nowrap leading-relaxed shrink-0">
            <div className="whitespace-nowrap">上次静态化时间：<span className="font-mono text-gray-700 font-medium whitespace-nowrap">{latestLog?.snapshotTime || '--'}</span></div>
            <div className="whitespace-nowrap">静态化总台账：<strong className="text-[#1677ff] font-mono whitespace-nowrap">{latestLog?.totalCount.toLocaleString() || '0'}</strong> 条</div>
          </div>
          <button
            onClick={handleTriggerManualSnapshot}
            disabled={isManualRunning}
            className="bg-[#1677ff] text-white px-3.5 py-1.5 rounded text-xs hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
          >
            {isManualRunning ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                <span>静态化执行中...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt text-xs"></i>
                <span>即时静态化</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 Core Platform Snapshot Overview Cards */}
      {(() => {
        const isLatestManual = latestLog?.operator?.includes('手动');
        const incrementLabel = isLatestManual ? '今日新增' : '昨日新增';

        return (
          <div className="grid grid-cols-5 gap-3">
            {/* 网站 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-solid fa-globe text-blue-500"></i>
                  <span>网站</span>
                </span>
                <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded font-mono">
                  +{latestLog?.platforms.website.increment.toLocaleString()}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 font-mono">
                {latestLog?.platforms.website.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                <span>总占比: {((latestLog?.platforms.website.total / latestLog?.totalCount) * 100).toFixed(1)}%</span>
                <span>{incrementLabel}</span>
              </div>
            </div>

            {/* 抖音 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-brands fa-tiktok text-black"></i>
                  <span>抖音</span>
                </span>
                <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded font-mono">
                  +{latestLog?.platforms.douyin.increment.toLocaleString()}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 font-mono">
                {latestLog?.platforms.douyin.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                <span>总占比: {((latestLog?.platforms.douyin.total / latestLog?.totalCount) * 100).toFixed(1)}%</span>
                <span>{incrementLabel}</span>
              </div>
            </div>

            {/* 新浪微博 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-brands fa-weibo text-red-500"></i>
                  <span>新浪微博</span>
                </span>
                <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded font-mono">
                  +{latestLog?.platforms.weibo.increment.toLocaleString()}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 font-mono">
                {latestLog?.platforms.weibo.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                <span>总占比: {((latestLog?.platforms.weibo.total / latestLog?.totalCount) * 100).toFixed(1)}%</span>
                <span>{incrementLabel}</span>
              </div>
            </div>

            {/* 今日头条 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-solid fa-newspaper text-red-500"></i>
                  <span>今日头条</span>
                </span>
                <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded font-mono">
                  +{latestLog?.platforms.toutiao.increment.toLocaleString()}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 font-mono">
                {latestLog?.platforms.toutiao.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                <span>总占比: {((latestLog?.platforms.toutiao.total / latestLog?.totalCount) * 100).toFixed(1)}%</span>
                <span>{incrementLabel}</span>
              </div>
            </div>

            {/* 微信公众号 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-brands fa-weixin text-green-500"></i>
                  <span>微信公众号</span>
                </span>
                <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded font-mono">
                  +{latestLog?.platforms.wechat.increment.toLocaleString()}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 font-mono">
                {latestLog?.platforms.wechat.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                <span>总占比: {((latestLog?.platforms.wechat.total / latestLog?.totalCount) * 100).toFixed(1)}%</span>
                <span>{incrementLabel}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 近一个月每天新增台账趋势图 (Trend Chart) */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
            <h3 className="font-bold text-gray-800 text-xs">近一个月每天新增台账趋势图</h3>
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              (展示各平台每日静态化净新增与总台账趋势)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex border border-[#d9d9d9] rounded-sm overflow-hidden text-xs">
              <button
                onClick={() => setDateRange('7')}
                className={`px-3 py-1 cursor-pointer transition-colors ${
                  dateRange === '7' ? 'bg-[#1677ff] text-white font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                近7天
              </button>
              <button
                onClick={() => setDateRange('14')}
                className={`px-3 py-1 cursor-pointer border-l border-[#d9d9d9] transition-colors ${
                  dateRange === '14' ? 'bg-[#1677ff] text-white font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                近14天
              </button>
              <button
                onClick={() => setDateRange('30')}
                className={`px-3 py-1 cursor-pointer border-l border-[#d9d9d9] transition-colors ${
                  dateRange === '30' ? 'bg-[#1677ff] text-white font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                近30天 (近一个月)
              </button>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#666' }}
                tickFormatter={(val) => val >= 10000 ? `${(val / 10000).toFixed(0)}万` : val}
                label={{ value: '每日新增 (条)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#999' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={['dataMin - 100000', 'dataMax + 100000']}
                tick={{ fontSize: 11, fill: '#8884d8' }}
                tickFormatter={(val) => `${(val / 10000).toFixed(0)}万`}
                label={{ value: '累计总台账 (条)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#8884d8' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.96)', borderRadius: '4px', fontSize: '11px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #e8e8e8' }}
                formatter={(value: any, name: any) => [Number(value).toLocaleString() + ' 条', name]}
                labelFormatter={(label) => `日期: 2026-${label}`}
                itemSorter={(item: any) => (item.name === '总台账数' || item.dataKey === '总台账数' ? -100 : 1)}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="rect"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="总台账数"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                legendType="circle"
              />
              <Bar yAxisId="left" dataKey="网站" stackId="a" fill="#3b82f6" />
              <Bar yAxisId="left" dataKey="抖音" stackId="a" fill="#06b6d4" />
              <Bar yAxisId="left" dataKey="新浪微博" stackId="a" fill="#f59e0b" />
              <Bar yAxisId="left" dataKey="今日头条" stackId="a" fill="#fb923c" />
              <Bar yAxisId="left" dataKey="微信公众号" stackId="a" fill="#10b981" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter / Search Bar for Snapshot Logs */}
      <div className="bg-white p-3.5 border border-[#e8e8e8] rounded-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            {/* 静态化日期 (时间段组件选择) */}
            <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] bg-white">
              <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] shrink-0">静态化日期</span>
              <div className="flex items-center px-2 py-1 space-x-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="outline-none text-gray-700 text-xs cursor-pointer font-mono"
                />
                <span className="text-gray-400 font-mono">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="outline-none text-gray-700 text-xs cursor-pointer font-mono"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="ml-1 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    title="清空日期范围"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            {/* 执行状态 */}
            <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] relative">
              <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9]">静态化状态</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-transparent outline-none text-gray-700 cursor-pointer pr-7 appearance-none"
              >
                <option value="all">全部状态</option>
                <option value="SUCCESS">常规成功</option>
                <option value="RETRY_SUCCESS">重试后成功</option>
                <option value="RETRYING">异常重试中</option>
              </select>
              <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <span>
              共 <strong className="text-[#1677ff] font-semibold">{filteredLogs.length}</strong> 条静态化日志记录
            </span>
          </div>
        </div>
      </div>

      {/* Snapshot Logs Data Table */}
      <div className="border border-[#e8e8e8] rounded-sm overflow-x-auto bg-white shadow-xs">
        <table className="w-full text-left text-xs min-w-[1000px]">
          <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
            <tr>
              <th className="px-3 py-3 font-normal w-12 text-center">序号</th>
              <th className="px-3 py-3 font-normal w-32">静态化日期</th>
              <th className="px-3 py-3 font-normal w-40">快照执行时间</th>
              <th className="px-3 py-3 font-normal w-24">执行状态</th>
              <th className="px-3 py-3 font-normal w-32 text-right">当日总台账数</th>
              <th className="px-3 py-3 font-normal w-28 text-right">当日总净增</th>
              <th className="px-3 py-3 font-normal w-56">平台数量分布</th>
              <th className="px-3 py-3 font-normal w-40">执行者</th>
              <th className="px-3 py-3 font-normal w-28 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8e8]">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, index) => {
                const globalIdx = (currentPage - 1) * pageSize + index + 1;
                const isAbsoluteLatest = globalIdx === 1;
                const displayOperator = log.operator.replace(/\s*\(\d{2}:\d{2}:\d{2}\)/, '');

                return (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-3 text-center text-gray-400 font-mono">{globalIdx}</td>
                    <td className="px-3 py-3 font-mono font-medium text-gray-800">
                      {log.date}
                      {isAbsoluteLatest && (
                        <span className="ml-1.5 px-1.5 py-0.2 bg-blue-50 text-[#1677ff] border border-blue-200 text-[10px] rounded-xs font-normal">
                          最新
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-mono text-gray-600">{log.snapshotTime}</td>
                    <td className="px-3 py-3">
                      {log.status === 'SUCCESS' && !log.isRetriedSuccess && (
                        <span className="inline-flex items-center text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-[11px]">
                          <i className="fa-solid fa-circle-check mr-1 text-[10px]"></i> 成功
                        </span>
                      )}
                      {log.status === 'SUCCESS' && log.isRetriedSuccess && (
                        <span className="inline-flex items-center text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]" title={`首次异常，重试${log.retryCount}次后同步成功`}>
                          <i className="fa-solid fa-rotate-right mr-1 text-[10px]"></i> 重试{log.retryCount}次成功
                        </span>
                      )}
                      {log.status === 'RETRYING' && (
                        <span className="inline-flex items-center text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]" title="1小时重试轮询中">
                          <i className="fa-solid fa-arrows-rotate fa-spin mr-1 text-[10px] text-amber-600"></i> 重试中({log.retryCount}次)
                        </span>
                      )}
                      {log.status === 'FAILED' && (
                        <span className="inline-flex items-center text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                          <i className="fa-solid fa-circle-xmark mr-1 text-[10px]"></i> 异常
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-semibold text-gray-800">
                      {log.totalCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      <span className="text-green-600 font-medium">
                        +{log.totalIncrement.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-mono">
                          <i className="fa-solid fa-globe mr-1 text-[10px]"></i> {log.platforms.website.total.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded border border-gray-200 font-mono">
                          <i className="fa-brands fa-tiktok mr-1 text-[10px]"></i> {log.platforms.douyin.total.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-red-50 text-red-700 rounded border border-red-100 font-mono">
                          <i className="fa-brands fa-weibo mr-1 text-[10px]"></i> {log.platforms.weibo.total.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-100 font-mono">
                          <i className="fa-solid fa-newspaper mr-1 text-[10px]"></i> {log.platforms.toutiao.total.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-green-50 text-green-700 rounded border border-green-100 font-mono">
                          <i className="fa-brands fa-weixin mr-1 text-[10px]"></i> {log.platforms.wechat.total.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      <span className="truncate block max-w-[140px]" title={displayOperator}>
                        {displayOperator}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => setDetailModalLog(log)}
                        className="text-[#1677ff] hover:underline cursor-pointer flex items-center justify-center mx-auto space-x-1"
                      >
                        <i className="fa-solid fa-file-lines text-[11px]"></i>
                        <span>快照详情</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-400">
                  <i className="fa-regular fa-folder-open text-2xl text-gray-300 mb-1 block"></i>
                  <span>暂无匹配的静态化日志</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-[#fafafa] border-t border-[#e8e8e8] text-xs text-gray-500 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span>显示第 <strong className="text-gray-800 font-mono">{filteredLogs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> - <strong className="text-gray-800 font-mono">{Math.min(currentPage * pageSize, filteredLogs.length)}</strong> 条，共 <strong className="text-[#1677ff] font-mono">{filteredLogs.length}</strong> 条日志</span>
            <span className="text-gray-300">|</span>
            <span>每页</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-[#d9d9d9] rounded px-1.5 py-0.5 bg-white text-gray-700 outline-none focus:border-[#1677ff] cursor-pointer"
            >
              <option value={10}>10 条</option>
              <option value={20}>20 条</option>
              <option value={50}>50 条</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-[#d9d9d9] rounded text-xs text-gray-600 hover:text-[#1677ff] hover:border-[#1677ff] disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-[#d9d9d9] cursor-pointer disabled:cursor-not-allowed bg-white"
            >
              上一页
            </button>

            {/* Page number buttons */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-0.5 rounded border text-xs font-mono cursor-pointer transition-colors ${
                    currentPage === page
                      ? 'bg-[#1677ff] text-white border-[#1677ff]'
                      : 'bg-white text-gray-600 border-[#d9d9d9] hover:border-[#1677ff] hover:text-[#1677ff]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1 border border-[#d9d9d9] rounded text-xs text-gray-600 hover:text-[#1677ff] hover:border-[#1677ff] disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:border-[#d9d9d9] cursor-pointer disabled:cursor-not-allowed bg-white"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal for Snapshot */}
      {detailModalLog && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-camera-retro text-[#1677ff]"></i>
                <h3 className="font-bold text-gray-800 text-sm">
                  {detailModalLog.date} 静态化数据快照详情
                </h3>
              </div>
              <button
                onClick={() => setDetailModalLog(null)}
                className="text-gray-400 hover:text-gray-600 text-base cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                <div>
                  <span className="text-gray-500">快照时间：</span>
                  <span className="font-mono text-gray-800 font-medium">{detailModalLog.snapshotTime}</span>
                </div>
                <div>
                  <span className="text-gray-500">执行状态：</span>
                  {detailModalLog.status === 'SUCCESS' && !detailModalLog.isRetriedSuccess && (
                    <span className="text-green-600 font-medium">执行成功 (耗时 {detailModalLog.durationMs}ms)</span>
                  )}
                  {detailModalLog.status === 'SUCCESS' && detailModalLog.isRetriedSuccess && (
                    <span className="text-blue-700 font-medium">重试后成功 (共重试 {detailModalLog.retryCount} 次)</span>
                  )}
                  {detailModalLog.status === 'RETRYING' && (
                    <span className="text-amber-600 font-medium animate-pulse">异常重试中 (已重试 {detailModalLog.retryCount} 次 / 1小时间隔)</span>
                  )}
                  {detailModalLog.status === 'FAILED' && (
                    <span className="text-red-600 font-medium">执行异常</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500">执行主体：</span>
                  <span className="text-gray-800">{detailModalLog.operator}</span>
                </div>
                <div>
                  <span className="text-gray-500">归档备注：</span>
                  <span className="text-gray-800">{detailModalLog.remark}</span>
                </div>
              </div>

              {/* Retry History Section */}
              {detailModalLog.retries && detailModalLog.retries.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 flex items-center space-x-1.5">
                      <i className="fa-solid fa-clock-rotate-left text-amber-500"></i>
                      <span>失败自动重试历史记录流水 ({detailModalLog.retries.length} 次重试)</span>
                    </h4>
                    <span className="text-[10px] text-gray-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      重试机制：前 3 次每 10 分钟 → 之后每 1 小时
                    </span>
                  </div>

                  <div className="border border-gray-200 rounded overflow-hidden max-h-44 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-amber-50/60 text-gray-700 border-b border-gray-200 sticky top-0 bg-amber-50 z-10">
                        <tr>
                          <th className="px-3 py-1.5 w-16 text-center">重试轮次</th>
                          <th className="px-3 py-1.5 w-36">触发时间</th>
                          <th className="px-3 py-1.5 w-24">策略间隔</th>
                          <th className="px-3 py-1.5 w-20 text-center">重试结果</th>
                          <th className="px-3 py-1.5">异常说明 / 结果</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-mono">
                        {detailModalLog.retries.map((r) => (
                          <tr key={r.retryCount} className="hover:bg-gray-50">
                            <td className="px-3 py-1 text-center text-gray-500 font-medium">第 {r.retryCount} 次</td>
                            <td className="px-3 py-1 text-gray-800">{r.retryTime}</td>
                            <td className="px-3 py-1">
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-sans ${
                                r.interval === '10分钟' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {r.interval}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-center">
                              {r.status === 'SUCCESS' ? (
                                <span className="text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.2 rounded text-[10px] font-sans">成功</span>
                              ) : (
                                <span className="text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded text-[10px] font-sans">失败</span>
                              )}
                            </td>
                            <td className="px-3 py-1 text-gray-600 text-[11px] font-sans">{r.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Manual retry callout banner in modal */}
              {(detailModalLog.status === 'RETRYING' || detailModalLog.status === 'FAILED') && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-900 text-xs">
                    <i className="fa-solid fa-circle-info text-amber-500"></i>
                    <span>该任务正在按每 1 小时自动重试。您可以手动立即触发重试。</span>
                  </div>
                  <button
                    onClick={() => handleManualRetrySingleLog(detailModalLog.id)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-xs cursor-pointer transition-colors flex items-center space-x-1 shrink-0 font-medium shadow-xs"
                  >
                    <i className="fa-solid fa-arrows-rotate text-[10px]"></i>
                    <span>立即手动重试</span>
                  </button>
                </div>
              )}

              {/* 5 Platforms Breakdown Table */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-1.5 flex items-center space-x-1">
                  <span>五大核心平台静态化数量明细</span>
                </h4>
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-3 py-1.5">平台名称</th>
                        <th className="px-3 py-1.5 text-right">静态化总台账</th>
                        <th className="px-3 py-1.5 text-right">当日净新增</th>
                        <th className="px-3 py-1.5 text-right">平台占比</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: '网站', icon: 'fa-solid fa-globe text-blue-500', data: detailModalLog.platforms.website },
                        { name: '抖音', icon: 'fa-brands fa-tiktok text-black', data: detailModalLog.platforms.douyin },
                        { name: '新浪微博', icon: 'fa-brands fa-weibo text-red-500', data: detailModalLog.platforms.weibo },
                        { name: '今日头条', icon: 'fa-solid fa-newspaper text-red-500', data: detailModalLog.platforms.toutiao },
                        { name: '微信公众号', icon: 'fa-brands fa-weixin text-green-500', data: detailModalLog.platforms.wechat }
                      ].map(p => (
                        <tr key={p.name} className="hover:bg-gray-50">
                          <td className="px-3 py-1 flex items-center space-x-2">
                            <i className={`${p.icon} w-4`}></i>
                            <span className="font-medium text-gray-800">{p.name}</span>
                          </td>
                          <td className="px-3 py-1 text-right font-mono font-medium text-gray-900">
                            {p.data.total.toLocaleString()}
                          </td>
                          <td className="px-3 py-1 text-right font-mono text-green-600 font-medium">
                            +{p.data.increment.toLocaleString()}
                          </td>
                          <td className="px-3 py-1 text-right font-mono text-gray-500">
                            {((p.data.total / detailModalLog.totalCount) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50/50 font-semibold text-gray-900">
                        <td className="px-3 py-1.5">合计</td>
                        <td className="px-3 py-1.5 text-right font-mono text-[#1677ff]">
                          {detailModalLog.totalCount.toLocaleString()}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-green-600">
                          +{detailModalLog.totalIncrement.toLocaleString()}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">100.00%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
              <button
                onClick={() => setDetailModalLog(null)}
                className="bg-[#1677ff] text-white px-5 py-1.5 rounded text-xs hover:bg-blue-600 transition-colors cursor-pointer shadow-xs font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
