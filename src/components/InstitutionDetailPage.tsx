import React, { useState, useMemo } from 'react';
import { Institution } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  CartesianGrid,
  Legend,
  Line
} from 'recharts';
import { LocalLedgerView } from './LocalLedgerView';
import { WhitelistView } from './WhitelistView';
import { BlacklistView } from './BlacklistView';
import { LedgerDetailPage } from './LedgerDetailPage';
import { AutoSyncConfigView } from './AutoSyncConfigView';
import { BatchImportView } from './BatchImportView';
import { ManualAddView } from './ManualAddView';
import { StaticLogView, generateMockSnapshotLogs } from './StaticLogView';
import { ReportPushConfigView } from './ReportPushConfigView';
import { SubjectTypeDistributionSection } from './SubjectTypeDistributionSection';
import { LedgerItem, initialMockLedgers } from '../mockLedgerData';

interface InstitutionDetailPageProps {
  institution: Institution;
  onBack: () => void;
}

export const InstitutionDetailPage: React.FC<InstitutionDetailPageProps> = ({ institution, onBack }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'ledger' | 'whitelist' | 'blacklist' | 'sync' | 'import' | 'manual' | 'static_log' | 'report'>('basic');
  // Default empty for new institutions until auto-sync rule is configured & saved, or manual/batch import is done
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const [isSyncConfigured, setIsSyncConfigured] = useState(false);
  const [selectedLedgerForDetail, setSelectedLedgerForDetail] = useState<LedgerItem | null>(null);

  const handleSaveSyncConfig = (enabled: boolean, _configData: any) => {
    setIsSyncConfigured(true);
    setIsSyncEnabled(enabled);
    if (enabled) {
      // Automatically synchronize ledgers from internet pool
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

  // Handler for adding manually searched candidate items into the local ledger list
  const handleAddManualLedgers = (items: any[], category: 'whitelist' | 'blacklist' = 'whitelist') => {
    setLedgers(prev => {
      let updated = [...prev];
      items.forEach((item, idx) => {
        const existingIdx = updated.findIndex(l => l.name === item.name);
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            category: category,
            reason: category === 'blacklist' ? '人工拉黑' : undefined
          };
        } else {
          const newItem: LedgerItem = {
            id: Date.now() + idx + Math.floor(Math.random() * 1000),
            name: item.name,
            platform: item.platform,
            badgeType: item.badgeType || 'normal',
            avatar: item.avatar,
            authType: item.authType,
            judgmentType: item.judgmentType,
            tags: item.ledgerTags || ['手动添加'],
            addresses: item.addresses || [{ icon: '🏛', text: '河南/郑州' }],
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
              ledgerId: `manual_${Date.now()}_${idx}`,
              ledgerUrl: `https://weibo.com/u/${Date.now() + idx}`,
              collectStatus: (item.collectStatus as any) || '未采集',
              collectParam: `${Date.now() + idx}`,
              lastPostTime: '2026-08-15 21:30:00',
              lastPostLocation: '河南/郑州',
              registeredCity: '河南/郑州',
              ipLocation: '河南',
              jurisdictionLocation: '河南/郑州',
              authInfo: {
                nickname: item.name,
                accountId: `${Date.now() + idx}`,
                vType: item.badgeType === 'redV' ? '红V' : item.badgeType === 'blueV' ? '蓝V' : '未认证',
                fansCount: item.fansDisplay || '1,000',
                followCount: '256',
                likesCount: '1.2万',
                worksCount: '320',
                serviceUnit: item.subjectName,
                serviceCategory: '信息发布'
              }
            }
          };
          updated = [newItem, ...updated];
        }
      });
      return updated;
    });
  };

  const handleRemoveManualLedger = (item: any) => {
    setLedgers(prev => prev.map(l => {
      if (l.name === item.name) {
        return { ...l, category: 'normal' };
      }
      return l;
    }));
  };

  // Snapshot logs for Trend Chart
  const [basicLogs] = useState(() => generateMockSnapshotLogs());
  const [basicDateRange, setBasicDateRange] = useState<'30' | '14' | '7'>('30');

  const basicChartData = useMemo(() => {
    const days = parseInt(basicDateRange, 10);
    const sliced = basicLogs.slice(0, days).reverse();
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
  }, [basicLogs, basicDateRange]);

  const latestSnapshot = basicLogs[0];

  const donutData = [
    { name: '非国有企业', value: 168495, color: '#00bcd4' },
    { name: '个人', value: 78836, color: '#3b82f6' },
    { name: '社会组织', value: 5778, color: '#f59e0b' },
    { name: '事业单位', value: 4333, color: '#10b981' },
    { name: '党政机关', value: 3623, color: '#8b5cf6' },
    { name: '国有企业', value: 4889, color: '#ec4899' },
    { name: '境外机构', value: 7990, color: '#6366f1' },
  ];

  const barData = [
    { name: '网站', count: 1767 },
    { name: '微信公众号', count: 770 },
    { name: '抖音', count: 462 },
    { name: '今日头条', count: 384 },
    { name: '新浪微博', count: 240 },
  ];

  const douyinTop10 = [
    { rank: 1, name: '木森（卷土重来）', desc: '仁汇网络科技（陕西）有限公司', count: '3647.96万', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80' },
    { rank: 2, name: '宝藏好剧安利官', desc: '抖音放映厅官方矩阵账号', count: '2800.23万', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80' },
    { rank: 3, name: '董宇辉', desc: '与辉同行主播', count: '2743.61万', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    { rank: 4, name: '冯巩', desc: '相声演员、影视演员', count: '2537.39万', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' },
    { rank: 5, name: '塔斯汀（中国汉堡）美食局', desc: '商家认证账号', count: '2305.80万', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' },
    { rank: 6, name: '• 惠子ssica •', desc: '抖音音乐人、人气视频创作者', count: '2214.75万', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80' },
    { rank: 7, name: '爆笑办公室', desc: '剧情短视频创作者', count: '2109.44万', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80' },
  ];

  const weiboTop10 = [
    { rank: 1, name: '财经评论', desc: '财经评论官方微博', count: '2768.28万', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
    { rank: 2, name: '王尼玛', desc: '《暴走大事件》主持人 微博原创视...', count: '1698.97万', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80' },
    { rank: 3, name: '现代快报', desc: '现代快报官方微博', count: '1436.29万', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80' },
    { rank: 4, name: '白宇WHITE', desc: '演员白宇', count: '1195.05万', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80' },
    { rank: 5, name: '于和伟', desc: '演员于和伟', count: '1178.46万', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80' },
    { rank: 6, name: '华商报', desc: '华商报官方微博', count: '1126.70万', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=80' },
    { rank: 7, name: '黛燕儿姨妹', desc: '情感博主', count: '1102.74万', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80' },
  ];

  const toutiaoTop10 = [
    { rank: 1, name: '家有情感戏', desc: '影视版权官方账号', count: '885.90万', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' },
    { rank: 2, name: '武侠影视汇', desc: '影视版权官方账号', count: '843.20万', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80' },
    { rank: 3, name: '西瓜铁血剧场', desc: '-', count: '817.20万', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80' },
    { rank: 4, name: '一起纪录片', desc: '西瓜纪录片官方账号', count: '729.60万', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80' },
    { rank: 5, name: '香港电影看不停', desc: '优质影视领域创作者', count: '694.80万', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80' },
    { rank: 6, name: '都市侠剧场', desc: '影视版权官方账号', count: '575.70万', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80' },
    { rank: 7, name: '好片儿天天看', desc: '影视版权官方账号', count: '558.70万', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80' },
  ];

  // If a ledger is selected for detail view, render LedgerDetailPage
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
      {/* Top Header Bar with Back & Title */}
      <div className="flex items-center justify-between mb-5 bg-white px-0 py-0 rounded-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-[#1677ff] cursor-pointer text-base bg-transparent border-none p-0 flex items-center"
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
          属地台账
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
          onClick={() => setActiveTab('report')}
          className={`py-2.5 px-4 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === 'report' ? 'border-[#1677ff] text-[#1677ff]' : 'border-transparent text-gray-600 hover:text-[#1677ff]'
          }`}
        >
          报告推送配置
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <LocalLedgerView
          ledgers={ledgers}
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
          onViewDetail={(item) => setSelectedLedgerForDetail(item)}
          onRemoveFromBlacklist={handleRemoveFromBlacklist}
          onBatchRemoveFromBlacklist={handleBatchRemoveFromBlacklist}
          onAddToWhitelist={handleAddToWhitelist}
          onBatchAddToWhitelist={handleBatchAddToWhitelist}
          onNavigateToTab={(tab) => setActiveTab(tab as any)}
        />
      ) : activeTab === 'sync' ? (
        <AutoSyncConfigView
          tipText="配置同步规则系统自动从互联网台账关联对应的台账信息"
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
          onRemoveFromWhitelist={handleRemoveManualLedger}
          onRemoveFromBlacklist={handleRemoveManualLedger}
          onBatchAddToWhitelist={(items) => handleAddManualLedgers(items, 'whitelist')}
          onBatchAddToBlacklist={(items) => handleAddManualLedgers(items, 'blacklist')}
        />
      ) : activeTab === 'static_log' ? (
        <StaticLogView
          institutionName={institution.name}
        />
      ) : activeTab === 'report' ? (
        <ReportPushConfigView />
      ) : (
        <>
          {/* Stat Cards (Top Cards: 台账总数 + 5 大平台卡片，包含右上角日新增标签、大字号统计、占总比与日新增说明) */}
          <div className="grid grid-cols-6 gap-3 mb-5">
            {/* 台账总数 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3.5 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <div className="w-5 h-5 bg-blue-500 text-white rounded flex items-center justify-center text-xs">
                    <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <span className="text-xs font-semibold">台账总数</span>
                </span>
                <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-mono font-medium">
                  +{latestSnapshot?.totalIncrement ? latestSnapshot.totalIncrement.toLocaleString() : '44,244'}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono my-1">
                {latestSnapshot?.totalCount ? latestSnapshot.totalCount.toLocaleString() : '32,553,646'}
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between items-center mt-1">
                <span>全机构累计</span>
                <span>日新增</span>
              </div>
            </div>

            {/* 网站 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3.5 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-solid fa-globe text-blue-500 text-sm"></i>
                  <span className="text-xs">网站</span>
                </span>
                <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-mono font-medium">
                  +{latestSnapshot?.platforms.website.increment ? latestSnapshot.platforms.website.increment.toLocaleString() : '392'}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono my-1">
                {latestSnapshot?.platforms.website.total ? latestSnapshot.platforms.website.total.toLocaleString() : '167,917'}
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between items-center mt-1">
                <span>占总比: {latestSnapshot ? ((latestSnapshot.platforms.website.total / latestSnapshot.totalCount) * 100).toFixed(1) : '0.5'}%</span>
                <span>日新增</span>
              </div>
            </div>

            {/* 抖音 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3.5 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-brands fa-tiktok text-black text-sm"></i>
                  <span className="text-xs">抖音</span>
                </span>
                <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-mono font-medium">
                  +{latestSnapshot?.platforms.douyin.increment ? latestSnapshot.platforms.douyin.increment.toLocaleString() : '22,174'}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono my-1">
                {latestSnapshot?.platforms.douyin.total ? latestSnapshot.platforms.douyin.total.toLocaleString() : '21,745,802'}
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between items-center mt-1">
                <span>占总比: {latestSnapshot ? ((latestSnapshot.platforms.douyin.total / latestSnapshot.totalCount) * 100).toFixed(1) : '67.0'}%</span>
                <span>日新增</span>
              </div>
            </div>

            {/* 新浪微博 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3.5 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-brands fa-weibo text-red-500 text-sm"></i>
                  <span className="text-xs">新浪微博</span>
                </span>
                <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-mono font-medium">
                  +{latestSnapshot?.platforms.weibo.increment ? latestSnapshot.platforms.weibo.increment.toLocaleString() : '11,310'}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono my-1">
                {latestSnapshot?.platforms.weibo.total ? latestSnapshot.platforms.weibo.total.toLocaleString() : '7,662,174'}
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between items-center mt-1">
                <span>占总比: {latestSnapshot ? ((latestSnapshot.platforms.weibo.total / latestSnapshot.totalCount) * 100).toFixed(1) : '23.6'}%</span>
                <span>日新增</span>
              </div>
            </div>

            {/* 今日头条 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3.5 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-solid fa-newspaper text-red-500 text-sm"></i>
                  <span className="text-xs">今日头条</span>
                </span>
                <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-mono font-medium">
                  +{latestSnapshot?.platforms.toutiao.increment ? latestSnapshot.platforms.toutiao.increment.toLocaleString() : '4,311'}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono my-1">
                {latestSnapshot?.platforms.toutiao.total ? latestSnapshot.platforms.toutiao.total.toLocaleString() : '2,664,865'}
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between items-center mt-1">
                <span>占总比: {latestSnapshot ? ((latestSnapshot.platforms.toutiao.total / latestSnapshot.totalCount) * 100).toFixed(1) : '8.2'}%</span>
                <span>日新增</span>
              </div>
            </div>

            {/* 微信公众号 */}
            <div className="bg-white border border-[#e8e8e8] rounded-sm p-3.5 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center space-x-1.5 font-medium text-gray-700">
                  <i className="fa-brands fa-weixin text-green-500 text-sm"></i>
                  <span className="text-xs">微信公众号</span>
                </span>
                <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-mono font-medium">
                  +{latestSnapshot?.platforms.wechat.increment ? latestSnapshot.platforms.wechat.increment.toLocaleString() : '411'}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900 font-mono my-1">
                {latestSnapshot?.platforms.wechat.total ? latestSnapshot.platforms.wechat.total.toLocaleString() : '225,523'}
              </div>
              <div className="text-[11px] text-gray-400 flex justify-between items-center mt-1">
                <span>占总比: {latestSnapshot ? ((latestSnapshot.platforms.wechat.total / latestSnapshot.totalCount) * 100).toFixed(1) : '0.7'}%</span>
                <span>日新增</span>
              </div>
            </div>
          </div>

          {/* 近一个月每天新增台账趋势图 (Trend Chart placed below stat cards & above Donut/Bar charts) */}
          <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-xs space-y-3 mb-6">
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
                    onClick={() => setBasicDateRange('7')}
                    className={`px-3 py-1 cursor-pointer transition-colors ${
                      basicDateRange === '7' ? 'bg-[#1677ff] text-white font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    近7天
                  </button>
                  <button
                    onClick={() => setBasicDateRange('14')}
                    className={`px-3 py-1 cursor-pointer border-l border-[#d9d9d9] transition-colors ${
                      basicDateRange === '14' ? 'bg-[#1677ff] text-white font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    近14天
                  </button>
                  <button
                    onClick={() => setBasicDateRange('30')}
                    className={`px-3 py-1 cursor-pointer border-l border-[#d9d9d9] transition-colors ${
                      basicDateRange === '30' ? 'bg-[#1677ff] text-white font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
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
                <ComposedChart data={basicChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
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

          {/* Subject Type Distribution Section with Carousel & Linked Bar Chart */}
          <SubjectTypeDistributionSection />

          {/* Top 10 Lists (3 columns) */}
          <div className="grid grid-cols-3 gap-6">
            {/* Douyin */}
            <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-black text-white rounded flex items-center justify-center mr-2 text-xs">
                    <i className="fa-brands fa-tiktok"></i>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800">抖音 Top10</h3>
                </div>
                <span className="text-xs text-gray-400">粉丝数</span>
              </div>
              <div className="space-y-3">
                {douyinTop10.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className={`w-4 text-center font-bold ${item.rank <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {item.rank}
                      </span>
                      <img src={item.avatar} alt={item.name} className="w-7 h-7 rounded-full object-cover" />
                      <div className="truncate">
                        <div className="font-medium text-gray-800 truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{item.desc}</div>
                      </div>
                    </div>
                    <span className="font-mono text-gray-600 ml-2 whitespace-nowrap">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weibo */}
            <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-orange-500 text-white rounded flex items-center justify-center mr-2 text-xs">
                    <i className="fa-brands fa-weibo"></i>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800">新浪微博 Top10</h3>
                </div>
                <span className="text-xs text-gray-400">粉丝数</span>
              </div>
              <div className="space-y-3">
                {weiboTop10.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className={`w-4 text-center font-bold ${item.rank <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {item.rank}
                      </span>
                      <img src={item.avatar} alt={item.name} className="w-7 h-7 rounded-full object-cover" />
                      <div className="truncate">
                        <div className="font-medium text-gray-800 truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{item.desc}</div>
                      </div>
                    </div>
                    <span className="font-mono text-gray-600 ml-2 whitespace-nowrap">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toutiao */}
            <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-500 text-white rounded flex items-center justify-center mr-2 text-xs">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800">今日头条 Top10</h3>
                </div>
                <span className="text-xs text-gray-400">粉丝数</span>
              </div>
              <div className="space-y-3">
                {toutiaoTop10.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className={`w-4 text-center font-bold ${item.rank <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {item.rank}
                      </span>
                      <img src={item.avatar} alt={item.name} className="w-7 h-7 rounded-full object-cover" />
                      <div className="truncate">
                        <div className="font-medium text-gray-800 truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{item.desc}</div>
                      </div>
                    </div>
                    <span className="font-mono text-gray-600 ml-2 whitespace-nowrap">{item.count}</span>
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
