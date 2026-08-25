import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ErrorInstitutionItem } from './ErrorInstitutionView';
import { LocalLedgerView } from './LocalLedgerView';
import { WhitelistView } from './WhitelistView';
import { BlacklistView } from './BlacklistView';
import { LedgerDetailPage } from './LedgerDetailPage';
import { AutoSyncConfigView } from './AutoSyncConfigView';
import { BatchImportView } from './BatchImportView';
import { ManualAddView } from './ManualAddView';
import { StaticLogView } from './StaticLogView';
import { ErrorAlertPolicyView } from './ErrorAlertPolicyView';
import { ErrorPatrolPolicyView } from './ErrorPatrolPolicyView';
import { LedgerItem, initialMockLedgers } from '../mockLedgerData';

interface ErrorInstitutionDetailPageProps {
  institution: ErrorInstitutionItem;
  onBack: () => void;
}

// 平台分布数据 (环形图)
const PLATFORM_PIE_DATA = [
  { name: '微信公众号', value: 25604, percent: '77.8%', color: '#10b981' },
  { name: '网站', value: 7186, percent: '21.84%', color: '#1677ff' },
  { name: '今日头条', value: 69, percent: '0.21%', color: '#ff4d4f' },
  { name: '微博', value: 45, percent: '0.14%', color: '#fa8c16' },
  { name: '抖音', value: 4, percent: '0.01%', color: '#06b6d4' },
];

// 错误类型统计 (横轴类别多柱状图/折线图风格)
const ERROR_TYPE_DATA = [
  { name: '固定表述错误', count: 15258 },
  { name: '人物职务错误', count: 5633 },
  { name: '机构组织名称错误', count: 4268 },
  { name: '地名与区划错误', count: 2623 },
  { name: '数字与年份错误', count: 2368 },
  { name: '党的二十届四中全会', count: 2225 },
  { name: '法律法规名称', count: 1413 },
  { name: '特定术语规范', count: 1168 },
  { name: '政领范', count: 856 },
  { name: '标点及符号', count: 621 },
  { name: '错别字', count: 559 },
  { name: '抗战胜利80周年', count: 300 },
  { name: '双字重叠', count: 240 },
  { name: '语序颠倒', count: 180 },
  { name: '涉密及敏感', count: 152 },
  { name: '敏感词', count: 60 },
  { name: '涉恐涉暴', count: 24 },
  { name: '其他错误', count: 1 },
];

// 主体发现错误统计
const SUBJECT_ERROR_DATA = [
  { name: '党政机关', count: 20278 },
  { name: '事业单位', count: 12630 },
];

// 预警信息列表
const WARNING_LIST = [
  {
    id: 1,
    platform: 'toutiao',
    platformName: '头条',
    platformBg: '#ff4d4f',
    title: '西安新能源汽车购车礼包申领通道开启！最高4000元！',
    time: '2026-08-16 16:15:04',
  },
  {
    id: 2,
    platform: 'website',
    platformName: '网站',
    platformBg: '#1677ff',
    title: '失业工伤地址',
    time: '2026-08-16 15:34:06',
  },
  {
    id: 3,
    platform: 'website',
    platformName: '网站',
    platformBg: '#1677ff',
    title: '详细新闻',
    time: '2026-08-16 15:34:05',
  },
  {
    id: 4,
    platform: 'website',
    platformName: '网站',
    platformBg: '#1677ff',
    title: '失业工伤地址',
    time: '2026-08-16 15:34:05',
  },
  {
    id: 5,
    platform: 'website',
    platformName: '网站',
    platformBg: '#1677ff',
    title: '服务明细',
    time: '2026-08-16 15:32:47',
  },
];

// 发文排名 Top 10
const POST_RANKING = [
  { rank: 1, name: '安康市公...', count: 14229, max: 15000 },
  { rank: 2, name: '西安市临...', count: 14136, max: 15000 },
  { rank: 3, name: '延安市实...', count: 12291, max: 15000 },
  { rank: 4, name: '陕西省铜...', count: 6250, max: 15000 },
  { rank: 5, name: '西安南苑...', count: 5222, max: 15000 },
  { rank: 6, name: '永寿县不...', count: 4469, max: 15000 },
  { rank: 7, name: '中国共产...', count: 4245, max: 15000 },
  { rank: 8, name: '咸阳市广...', count: 3980, max: 15000 },
  { rank: 9, name: '三原县融...', count: 3620, max: 15000 },
  { rank: 10, name: '宝鸡市委...', count: 3210, max: 15000 },
];

// 发现表述错误排名 Top 10
const ERROR_RANKING = [
  { rank: 1, name: '中国共产...', count: 1202, max: 1300 },
  { rank: 2, name: '咸阳市广...', count: 671, max: 1300 },
  { rank: 3, name: '咸阳日报社', count: 582, max: 1300 },
  { rank: 4, name: '长安大学', count: 529, max: 1300 },
  { rank: 5, name: '陕西省归...', count: 482, max: 1300 },
  { rank: 6, name: '永寿县不...', count: 462, max: 1300 },
  { rank: 7, name: '西安统一...', count: 445, max: 1300 },
  { rank: 8, name: '华阴市网...', count: 390, max: 1300 },
  { rank: 9, name: '铜川市印...', count: 350, max: 1300 },
  { rank: 10, name: '商洛市政...', count: 310, max: 1300 },
];

// 已修正排名
const CORRECTED_RANKING = [
  { rank: 1, name: '中国共产...', count: 5, max: 5 },
];

export const ErrorInstitutionDetailPage: React.FC<ErrorInstitutionDetailPageProps> = ({
  institution,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'basic' | 'ledger' | 'whitelist' | 'blacklist' | 'static_log' | 'sync' | 'import' | 'manual' | 'alert_policy' | 'patrol_policy'
  >('basic');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'three_months' | 'half_year' | 'year'>('year');
  const [startDate, setStartDate] = useState('2025-08-16');
  const [endDate, setEndDate] = useState('2026-08-16');

  // Ledger state & management (Empty by default until auto sync is configured & saved, or batch/manual added)
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const [isSyncConfigured, setIsSyncConfigured] = useState(false);
  const [selectedLedgerForDetail, setSelectedLedgerForDetail] = useState<LedgerItem | null>(null);

  const handleSaveSyncConfig = (enabled: boolean, _configData: any) => {
    setIsSyncConfigured(true);
    setIsSyncEnabled(enabled);
    if (enabled) {
      // Synchronize data from local pool
      // 同步的台账默认没有台账类型（category: 'normal'，表格显示 '-'），只有手动操作加入白名单才显示为白名单
      setLedgers(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const syncedItems = initialMockLedgers
          .filter(item => !existingIds.has(item.id))
          .map(item => ({
            ...item,
            source: '同步匹配' as const,
            category: 'normal' as const
          }));
        return [...prev, ...syncedItems];
      });
    }
  };

  // Single handlers
  const handleAddToWhitelist = (id: number) => {
    setLedgers(prev => prev.map(item => item.id === id ? { ...item, category: 'whitelist' } : item));
    if (selectedLedgerForDetail && selectedLedgerForDetail.id === id) {
      setSelectedLedgerForDetail(prev => prev ? { ...prev, category: 'whitelist' } : null);
    }
  };

  const handleRemoveFromWhitelist = (id: number) => {
    setLedgers(prev => prev.map(item => item.id === id ? { ...item, category: 'normal' } : item));
    if (selectedLedgerForDetail && selectedLedgerForDetail.id === id) {
      setSelectedLedgerForDetail(prev => prev ? { ...prev, category: 'normal' } : null);
    }
  };

  const handleAddToBlacklist = (id: number) => {
    setLedgers(prev => prev.map(item => item.id === id ? { ...item, category: 'blacklist', reason: '人工审核拉黑' } : item));
    if (selectedLedgerForDetail && selectedLedgerForDetail.id === id) {
      setSelectedLedgerForDetail(prev => prev ? { ...prev, category: 'blacklist', reason: '人工审核拉黑' } : null);
    }
  };

  const handleRemoveFromBlacklist = (id: number) => {
    setLedgers(prev => prev.map(item => item.id === id ? { ...item, category: 'normal' } : item));
    if (selectedLedgerForDetail && selectedLedgerForDetail.id === id) {
      setSelectedLedgerForDetail(prev => prev ? { ...prev, category: 'normal' } : null);
    }
  };

  const handleDeleteLedger = (id: number) => {
    setLedgers(prev => prev.filter(item => item.id !== id));
    if (selectedLedgerForDetail && selectedLedgerForDetail.id === id) {
      setSelectedLedgerForDetail(null);
    }
  };

  // Batch handlers
  const handleBatchAddToWhitelist = (ids: number[]) => {
    setLedgers(prev => prev.map(item => ids.includes(item.id) ? { ...item, category: 'whitelist' } : item));
  };

  const handleBatchRemoveFromWhitelist = (ids: number[]) => {
    setLedgers(prev => prev.map(item => ids.includes(item.id) ? { ...item, category: 'normal' } : item));
  };

  const handleBatchAddToBlacklist = (ids: number[]) => {
    setLedgers(prev => prev.map(item => ids.includes(item.id) ? { ...item, category: 'blacklist', reason: '批量拉黑' } : item));
  };

  const handleBatchRemoveFromBlacklist = (ids: number[]) => {
    setLedgers(prev => prev.map(item => ids.includes(item.id) ? { ...item, category: 'normal' } : item));
  };

  const handleBatchDelete = (ids: number[]) => {
    setLedgers(prev => prev.filter(item => !ids.includes(item.id)));
  };

  const handleAddManualLedgers = (items: any[], category: 'whitelist' | 'blacklist' = 'whitelist') => {
    const newItems: LedgerItem[] = items.map((item, idx) => ({
      id: Date.now() + idx + Math.floor(Math.random() * 1000),
      name: item.name,
      platform: item.platform,
      badgeType: item.badgeType || 'normal',
      avatar: item.avatar,
      authType: item.authType,
      judgmentType: item.judgmentType,
      tags: item.ledgerTags || ['手动添加'],
      addresses: item.addresses || [{ icon: '🏛', text: '陕西/西安' }],
      subjectName: item.subjectName,
      subjectType: item.subjectType,
      fans: item.fans || 1000,
      fansDisplay: item.fansDisplay || '1,000',
      collectStatus: (item.collectStatus as any) || '未采集',
      ledgerStatus: (item.ledgerStatus as any) || '正常',
      source: '手动添加',
      category: category,
      reason: category === 'blacklist' ? '人工拉黑' : undefined,
      addedTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      detail: {
        ledgerId: `error_manual_${Date.now()}_${idx}`,
        ledgerUrl: `https://weibo.com/u/${Date.now() + idx}`,
        collectStatus: (item.collectStatus as any) || '未采集',
        collectParam: `${Date.now() + idx}`,
        lastPostTime: '2026-08-16 10:30:00',
        lastPostLocation: '陕西/西安',
        registeredCity: '陕西/西安',
        ipLocation: '陕西',
        jurisdictionLocation: '陕西/西安',
        authInfo: {
          nickname: item.name,
          accountId: `${Date.now() + idx}`,
          vType: item.badgeType === 'redV' ? '红V' : item.badgeType === 'blueV' ? '蓝V' : '未认证',
          fansCount: item.fansDisplay || '1,000',
          followCount: '256',
          likesCount: '1.2万',
          worksCount: '320',
          serviceUnit: item.subjectName,
          serviceCategory: '信息发布',
        },
      },
    }));

    setLedgers(prev => [...newItems, ...prev]);
  };

  // If a ledger detail is active, drill down to LedgerDetailPage
  if (selectedLedgerForDetail) {
    return (
      <div className="flex-1 overflow-y-auto bg-white">
        <LedgerDetailPage
          ledger={selectedLedgerForDetail}
          onBack={() => setSelectedLedgerForDetail(null)}
          onAddToWhitelist={handleAddToWhitelist}
          onRemoveFromWhitelist={handleRemoveFromWhitelist}
          onAddToBlacklist={handleAddToBlacklist}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-white flex flex-col">
      {/* Top Header: Title with Back chevron */}
      <div className="flex items-center justify-between mb-5 bg-white px-0 py-0 rounded-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-[#1677ff] cursor-pointer text-base bg-transparent border-none p-0 flex items-center"
            title="返回错误表述机构列表"
          >
            <i className="fa-solid fa-chevron-left mr-2"></i>
          </button>
          <h1 className="text-base font-bold text-gray-800">{institution.name}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e8e8e8] bg-white px-0 mb-5 rounded-t-sm">
        <button
          onClick={() => setActiveTab('basic')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'basic' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          基本情况
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'ledger' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          错误表述台账
        </button>
        <button
          onClick={() => setActiveTab('whitelist')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'whitelist' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          白名单
        </button>
        <button
          onClick={() => setActiveTab('blacklist')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'blacklist' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          黑名单
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'sync' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          自动同步规则配置
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'import' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          批量导入台账
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'manual' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          手动添加台账
        </button>
        <button
          onClick={() => setActiveTab('static_log')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'static_log' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          静态化日志
        </button>
        <button
          onClick={() => setActiveTab('alert_policy')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'alert_policy' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          预警策略
        </button>
        <button
          onClick={() => setActiveTab('patrol_policy')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'patrol_policy' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          巡查策略
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <LocalLedgerView
          ledgers={ledgers}
          ledgerTypeName="错误表述台账"
          institutionName={institution.name}
          onViewDetail={(item) => setSelectedLedgerForDetail(item)}
          onAddToWhitelist={handleAddToWhitelist}
          onRemoveFromWhitelist={handleRemoveFromWhitelist}
          onAddToBlacklist={handleAddToBlacklist}
          onDeleteLedger={handleDeleteLedger}
          onBatchAddToWhitelist={handleBatchAddToWhitelist}
          onBatchRemoveFromWhitelist={handleBatchRemoveFromWhitelist}
          onBatchAddToBlacklist={handleBatchAddToBlacklist}
          onBatchDelete={handleBatchDelete}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />
      ) : activeTab === 'whitelist' ? (
        <WhitelistView
          ledgers={ledgers}
          ledgerTypeName="错误表述台账"
          onViewDetail={(item) => setSelectedLedgerForDetail(item)}
          onRemoveFromWhitelist={handleRemoveFromWhitelist}
          onBatchRemoveFromWhitelist={handleBatchRemoveFromWhitelist}
          onAddToBlacklist={handleAddToBlacklist}
          onBatchAddToBlacklist={handleBatchAddToBlacklist}
          onNavigateToTab={(tab) => setActiveTab(tab as any)}
        />
      ) : activeTab === 'blacklist' ? (
        <BlacklistView
          ledgers={ledgers}
          ledgerTypeName="错误表述台账"
          onViewDetail={(item) => setSelectedLedgerForDetail(item)}
          onRemoveFromBlacklist={handleRemoveFromBlacklist}
          onBatchRemoveFromBlacklist={handleBatchRemoveFromBlacklist}
          onAddToWhitelist={handleAddToWhitelist}
          onBatchAddToWhitelist={handleBatchAddToWhitelist}
          onNavigateToTab={(tab) => setActiveTab(tab as any)}
        />
      ) : activeTab === 'sync' ? (
        <AutoSyncConfigView
          tipText="配置同步规则，系统自动从互联网台账关联对应的台账信息"
          isSyncEnabled={isSyncEnabled}
          isSyncConfigured={isSyncConfigured}
          onSaveConfig={handleSaveSyncConfig}
          onAddToWhitelist={(item) => handleAddManualLedgers([item], 'whitelist')}
          onAddToBlacklist={(item) => handleAddManualLedgers([item], 'blacklist')}
          onBatchAddToWhitelist={(items) => handleAddManualLedgers(items, 'whitelist')}
          onBatchAddToBlacklist={(items) => handleAddManualLedgers(items, 'blacklist')}
          sourceTypeName="互联网台账"
          initialSyncSource="internet"
          institutionName={institution.name}
          allowSourceSelection={false}
        />
      ) : activeTab === 'import' ? (
        <BatchImportView
          institutionName={institution.name}
          onImportLedgers={(items) => setLedgers(prev => [...items, ...prev])}
          onNavigateToWhitelist={() => setActiveTab('whitelist')}
        />
      ) : activeTab === 'manual' ? (
        <ManualAddView
          existingLedgers={ledgers}
          onAddLedgersToLocal={handleAddManualLedgers}
          onAddToWhitelist={(item) => handleAddManualLedgers([item], 'whitelist')}
          onAddToBlacklist={(item) => handleAddManualLedgers([item], 'blacklist')}
          onBatchAddToWhitelist={(items) => handleAddManualLedgers(items, 'whitelist')}
          onBatchAddToBlacklist={(items) => handleAddManualLedgers(items, 'blacklist')}
        />
      ) : activeTab === 'static_log' ? (
        <StaticLogView
          institutionName={institution.name}
        />
      ) : activeTab === 'alert_policy' ? (
        <ErrorAlertPolicyView />
      ) : activeTab === 'patrol_policy' ? (
        <ErrorPatrolPolicyView />
      ) : (
        <>
          {/* Time Filter Bar */}
          <div className="flex items-center space-x-3 bg-white p-3 border border-[#e8e8e8] rounded-sm text-xs mb-4">
            <div className="flex items-center border border-[#d9d9d9] rounded-sm">
              <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9]">统计时间</span>
              <input
                type="text"
                className="px-2 py-1.5 outline-none w-24 text-gray-700 text-center"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <span className="text-gray-400 px-1">~</span>
              <input
                type="text"
                className="px-2 py-1.5 outline-none w-24 text-gray-700 text-center"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
              <i className="fa-regular fa-calendar text-gray-400 px-2.5 text-xs border-l border-[#d9d9d9] py-2 bg-gray-50"></i>
            </div>

            {/* Quick time range pills */}
            <div className="flex items-center space-x-1">
              {[
                { key: 'today', label: '今日' },
                { key: 'week', label: '近一周' },
                { key: 'month', label: '近一月' },
                { key: 'three_months', label: '近三月' },
                { key: 'half_year', label: '近半年' },
                { key: 'year', label: '近一年' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setTimeRange(item.key as any)}
                  className={`px-3 py-1 rounded-xs text-xs cursor-pointer transition-colors ${
                    timeRange === item.key
                      ? 'bg-blue-50 text-[#1677ff] font-medium border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5 Top Statistics Cards */}
          <div className="grid grid-cols-5 gap-3.5 mb-5">
            {/* Card 1: 总发文数 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                <div className="w-5 h-5 rounded bg-[#e6fffb] text-[#13c2c2] flex items-center justify-center text-xs">
                  <i className="fa-regular fa-file-lines"></i>
                </div>
                <span>总发文数</span>
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">
                {institution.name.includes('陕西省委') ? '187,713' : '124,590'}
              </div>
            </div>

            {/* Card 2: 错误表述总数 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                <div className="w-5 h-5 rounded bg-[#fff7e6] text-[#fa8c16] flex items-center justify-center text-xs">
                  <i className="fa-solid fa-file-circle-exclamation"></i>
                </div>
                <span>错误表述总数</span>
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">
                {institution.name.includes('陕西省委') ? '32,908' : institution.errorTotal.toLocaleString()}
              </div>
            </div>

            {/* Card 3: 已修正数 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                <div className="w-5 h-5 rounded bg-[#f6ffed] text-[#52c41a] flex items-center justify-center text-xs">
                  <i className="fa-solid fa-check-double"></i>
                </div>
                <span>已修正数</span>
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">
                {institution.corrected.toLocaleString()}
              </div>
            </div>

            {/* Card 4: 未修正数 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                <div className="w-5 h-5 rounded bg-[#fff7e6] text-[#fa8c16] flex items-center justify-center text-xs">
                  <i className="fa-solid fa-file-circle-question"></i>
                </div>
                <span>未修正数</span>
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">
                {institution.name.includes('陕西省委') ? '32,902' : institution.uncorrected.toLocaleString()}
              </div>
            </div>

            {/* Card 5: 已删除数 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                <div className="w-5 h-5 rounded bg-[#fff1f0] text-[#ff4d4f] flex items-center justify-center text-xs">
                  <i className="fa-solid fa-trash-can"></i>
                </div>
                <span>已删除数</span>
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">
                {institution.deleted.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Row 1 Charts: 平台分布 + 错误类型统计 */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Left: 平台分布 (Donut Chart) */}
            <div className="col-span-4 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">平台分布</h3>
              </div>
              <div className="h-60 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PLATFORM_PIE_DATA}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {PLATFORM_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number, name: string) => [
                        `${val.toLocaleString()} 条`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[11px] text-gray-400 font-normal">总计</span>
                  <span className="text-lg font-bold font-mono text-gray-900 leading-tight">
                    32,908
                  </span>
                </div>

                {/* Callout Labels as rendered on image */}
                <div className="absolute right-2 top-2 text-[10px] text-gray-500 space-y-0.5 pointer-events-none text-right">
                  <div>抖音: <strong className="text-gray-800">4</strong> 0.01%</div>
                  <div>微博: <strong className="text-gray-800">45</strong> 0.14%</div>
                  <div>今日头条: <strong className="text-gray-800">69</strong> 0.21%</div>
                  <div>网站: <strong className="text-gray-800">7,186</strong> 21.84%</div>
                </div>
                <div className="absolute right-1 bottom-4 text-[10px] text-gray-500 pointer-events-none">
                  微信公众号: <strong className="text-gray-800">25,604</strong> 77.8%
                </div>
              </div>

              {/* Bottom Legend */}
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-600 mt-2">
                {PLATFORM_PIE_DATA.map(item => (
                  <div key={item.name} className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 错误类型统计 (Bar Chart with vertical needle-style bars) */}
            <div className="col-span-8 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">错误类型统计</h3>
              </div>
              <div className="h-64 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ERROR_TYPE_DATA}
                    margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#8c8c8c' }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8c8c8c' }}
                      ticks={[0, 3000, 6000, 9000, 12000, 15000, 18000]}
                      domain={[0, 18000]}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val.toLocaleString()} 次`, '出现次数']}
                    />
                    <Bar
                      dataKey="count"
                      fill="#1677ff"
                      barSize={10}
                      radius={[4, 4, 0, 0]}
                      label={{
                        position: 'top',
                        fontSize: 9,
                        fill: '#595959',
                        formatter: (val: number) => (val >= 100 ? val.toLocaleString() : val),
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2 Charts: 错误表述研判分析 + 主体发现错误统计 + 预警信息 */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Left: 错误表述研判分析 (Funnel / Trapezoid styled layers) */}
            <div className="col-span-4 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">错误表述研判分析</h3>
              </div>
              <div className="h-60 flex flex-col items-center justify-center relative px-2">
                {/* Layer 1: 采集发文数 */}
                <div
                  className="w-[85%] h-12 rounded-t flex items-center justify-between px-4 text-white text-xs font-bold shadow-2xs relative"
                  style={{
                    backgroundColor: '#36cfc9',
                    clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)',
                  }}
                >
                  <span className="font-mono text-sm pl-4">187,713</span>
                  <span className="text-[11px] font-normal text-white/90 pr-2">采集发文数</span>
                </div>

                {/* Layer 2: AI研判错误表述数 */}
                <div
                  className="w-[70%] h-12 flex items-center justify-between px-3 text-white text-xs font-bold shadow-2xs my-0.5 relative"
                  style={{
                    backgroundColor: '#85a5ff',
                    clipPath: 'polygon(10% 0, 90% 0, 80% 100%, 20% 100%)',
                  }}
                >
                  <span className="font-mono text-sm pl-4">32,908</span>
                  <span className="text-[10px] font-normal text-white/90">AI研判错误表述数</span>
                </div>

                {/* Layer 3: 人工研判错误表述数 */}
                <div
                  className="w-[55%] h-10 flex items-center justify-center text-white text-xs font-bold shadow-2xs my-0.5 relative"
                  style={{
                    backgroundColor: '#ffc53d',
                    clipPath: 'polygon(20% 0, 80% 0, 90% 100%, 10% 100%)',
                  }}
                >
                  <span className="font-mono text-sm">0</span>
                  <span className="text-[10px] font-normal text-white/90 ml-3">人工研判错误表述数</span>
                </div>

                {/* Layer 4: 错误表述预警数 */}
                <div
                  className="w-[75%] h-12 rounded-b flex items-center justify-between px-4 text-white text-xs font-bold shadow-2xs relative"
                  style={{
                    backgroundColor: '#ff7a45',
                    clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
                  }}
                >
                  <span className="font-mono text-sm pl-4">9,536</span>
                  <span className="text-[11px] font-normal text-white/90 pr-2">错误表述预警数</span>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center space-x-3 text-[10px] text-gray-500 mt-3 flex-wrap">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#36cfc9]"></span>
                    <span>采集发文数</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#85a5ff]"></span>
                    <span>AI研判错误表述数</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#ffc53d]"></span>
                    <span>人工研判错误表述数</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#ff7a45]"></span>
                    <span>错误表述预警数</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: 主体发现错误统计 */}
            <div className="col-span-4 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">主体发现错误统计</h3>
              </div>
              <div className="h-60 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SUBJECT_ERROR_DATA}
                    margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#595959' }} />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8c8c8c' }}
                      ticks={[0, 5000, 10000, 15000, 20000, 25000]}
                      domain={[0, 25000]}
                    />
                    <Tooltip formatter={(val: number) => [`${val.toLocaleString()} 条`, '发现错误数']} />
                    <Bar
                      dataKey="count"
                      fill="#1677ff"
                      barSize={12}
                      radius={[4, 4, 0, 0]}
                      label={{
                        position: 'top',
                        fontSize: 10,
                        fill: '#262626',
                        formatter: (val: number) => val.toLocaleString(),
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: 预警信息 */}
            <div className="col-span-4 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">预警信息</h3>
              </div>
              <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
                {WARNING_LIST.map(item => (
                  <div key={item.id} className="py-2.5 flex items-start space-x-2 text-xs">
                    <span
                      className="w-4 h-4 rounded text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: item.platformBg }}
                    >
                      {item.platformName}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 truncate font-normal hover:text-[#1677ff] cursor-pointer" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: 3 Rankings (发文排名 + 发现表述错误排名 + 已修正排名) */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* 1. 发文排名 */}
            <div className="col-span-4 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">发文排名</h3>
              </div>
              <div className="space-y-2.5">
                {POST_RANKING.map(item => (
                  <div key={item.rank} className="flex items-center space-x-2 text-xs">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        item.rank === 1
                          ? 'bg-[#fa8c16] text-white'
                          : item.rank === 2
                          ? 'bg-[#d9d9d9] text-gray-700'
                          : item.rank === 3
                          ? 'bg-[#ffd591] text-gray-800'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="w-20 truncate text-gray-700">{item.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#1677ff] h-full rounded-full transition-all duration-300"
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-14 text-right font-mono text-gray-700 text-[11px]">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. 发现表述错误排名 */}
            <div className="col-span-4 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">发现表述错误排名</h3>
              </div>
              <div className="space-y-2.5">
                {ERROR_RANKING.map(item => (
                  <div key={item.rank} className="flex items-center space-x-2 text-xs">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        item.rank === 1
                          ? 'bg-[#fa8c16] text-white'
                          : item.rank === 2
                          ? 'bg-[#d9d9d9] text-gray-700'
                          : item.rank === 3
                          ? 'bg-[#ffd591] text-gray-800'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="w-20 truncate text-gray-700">{item.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#fa8c16] h-full rounded-full transition-all duration-300"
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-14 text-right font-mono text-gray-700 text-[11px]">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 已修正排名 */}
            <div className="col-span-4 bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-xs">已修正排名</h3>
              </div>
              <div className="space-y-2.5">
                {CORRECTED_RANKING.map(item => (
                  <div key={item.rank} className="flex items-center space-x-2 text-xs">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-[#fa8c16] text-white">
                      {item.rank}
                    </span>
                    <span className="w-20 truncate text-gray-700">{item.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#13c2c2] h-full rounded-full transition-all duration-300"
                        style={{ width: `${(item.count / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-14 text-right font-mono text-gray-700 text-[11px]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
