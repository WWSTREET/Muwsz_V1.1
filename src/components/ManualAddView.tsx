import React, { useState, useRef, useEffect } from 'react';
import { LedgerItem } from '../mockLedgerData';

export interface ManualSearchItem {
  id: number;
  name: string;
  platform: '微博' | '今日头条' | '抖音' | '微信公众号' | '网站';
  platformIcon?: string;
  badgeType?: 'redV' | 'blueV' | 'normal';
  avatar: string;
  authType: string;
  judgmentType: string;
  ledgerTags: string[];
  addresses: { icon: string; text: string; isIP?: boolean }[];
  subjectName: string;
  subjectType: string;
  fans: number;
  fansDisplay: string;
  collectStatus: string;
  ledgerStatus: string;
  isExistingInLocal?: boolean; // Whether already exists in the current local ledger
  ledgerType?: '白名单' | '黑名单' | '自动匹配'; // 台账类型
  authDesc?: string;
  intro?: string;
}

// Initial mock candidates to search from
export const initialManualSearchData: ManualSearchItem[] = [
  {
    id: 101,
    name: '河南法制报',
    platform: '微博',
    platformIcon: 'fa-brands fa-weibo text-red-500',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '政务发布', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/金水区' },
      { icon: '▲', text: '河南/郑州' },
      { icon: 'IP', text: '河南', isIP: true }
    ],
    subjectName: '河南法制报社',
    subjectType: '事业单位',
    fans: 1850000,
    fansDisplay: '185.00万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    isExistingInLocal: true,
    ledgerType: '黑名单',
    authDesc: '河南法制报社官方微博',
    intro: '河南法制报社官方微博，宣传法治河南，弘扬公平正义。'
  },
  {
    id: 102,
    name: '安阳融媒',
    platform: '今日头条',
    platformIcon: 'fa-solid fa-newspaper text-red-500',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '新闻媒体', '级别', '地市级'],
    addresses: [
      { icon: '🏛', text: '河南/安阳/文峰区' },
      { icon: '▲', text: '河南/安阳' }
    ],
    subjectName: '安阳市融媒体中心',
    subjectType: '事业单位',
    fans: 620000,
    fansDisplay: '62.00万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    isExistingInLocal: false,
    authDesc: '安阳市融媒体中心官方账号',
    intro: '安阳市融媒体中心官方头条号，发布安阳本地权威资讯与民生信息。'
  },
  {
    id: 103,
    name: '猛犸新闻',
    platform: '微博',
    platformIcon: 'fa-brands fa-weibo text-red-500',
    badgeType: 'redV',
    avatar: 'https://images.unsplash.com/photo-1572945758420-279497e52002?w=100&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '精准匹配',
    ledgerTags: ['废弃媒体类废弃', '省级B', '媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/管城回族区' },
      { icon: '👤', text: '河南/安阳/殷都区/曲沟镇' },
      { icon: '✈', text: '浙江省/舟山市' }
    ],
    subjectName: '东方今报社',
    subjectType: '事业单位',
    fans: 10968300,
    fansDisplay: '1,096.83万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    isExistingInLocal: true, // Already exists in local
    ledgerType: '白名单',
    authDesc: '东方今报猛犸新闻官方微博',
    intro: '东方今报旗下新媒体猛犸新闻，深度报道与民生监督平台。'
  },
  {
    id: 104,
    name: '郑州发布',
    platform: '微信公众号',
    platformIcon: 'fa-brands fa-weixin text-green-500',
    badgeType: 'normal',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '政务发布', '级别', '地市级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/中原区' },
      { icon: 'IP', text: '河南', isIP: true }
    ],
    subjectName: '中共郑州市委宣传部',
    subjectType: '机关',
    fans: 3200000,
    fansDisplay: '320.00万',
    collectStatus: '已采集',
    ledgerStatus: '正常',
    isExistingInLocal: false,
    authDesc: '中共郑州市委宣传部官方微信公众号',
    intro: '郑州市委宣传部官方信息发布平台，权威发布郑州政务资讯与便民动态。'
  },
  {
    id: 105,
    name: '大象新闻',
    platform: '抖音',
    platformIcon: 'fa-brands fa-tiktok text-black',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=100&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/金水区' },
      { icon: 'IP', text: '河南', isIP: true }
    ],
    subjectName: '河南广播电视台',
    subjectType: '事业单位',
    fans: 8900000,
    fansDisplay: '890.00万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    isExistingInLocal: true, // Already exists in local
    ledgerType: '自动匹配',
    authDesc: '河南广播电视台大象新闻官方抖音号',
    intro: '河南广播电视台重点打造的新闻资讯类短视频平台。'
  },
  {
    id: 106,
    name: '清风中原',
    platform: '微博',
    platformIcon: 'fa-brands fa-weibo text-red-500',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '政务发布', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/金水区' },
      { icon: 'IP', text: '河南', isIP: true }
    ],
    subjectName: '中共河南省纪律检查委员会',
    subjectType: '机关',
    fans: 950000,
    fansDisplay: '95.00万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    isExistingInLocal: false,
    authDesc: '中共河南省纪律检查委员会官方微博',
    intro: '河南省纪委监委官方微博，权威通报党风廉政建设与反腐败工作。'
  },
  {
    id: 107,
    name: '河南交警',
    platform: '抖音',
    platformIcon: 'fa-brands fa-tiktok text-black',
    badgeType: 'blueV',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '政务发布', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/金水区' },
      { icon: 'IP', text: '河南', isIP: true }
    ],
    subjectName: '河南省公安厅交通警察总队',
    subjectType: '机关',
    fans: 4120000,
    fansDisplay: '412.00万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    isExistingInLocal: false,
    authDesc: '河南省公安厅交通警察总队官方抖音',
    intro: '河南交警官方权威发布，路况播报、交通安全提示与便民服务。'
  },
  {
    id: 108,
    name: '河南日报客户端',
    platform: '网站',
    platformIcon: 'fa-solid fa-globe text-blue-500',
    badgeType: 'normal',
    avatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/金水区' },
      { icon: 'IP', text: '河南', isIP: true }
    ],
    subjectName: '河南日报社',
    subjectType: '事业单位',
    fans: 15600000,
    fansDisplay: '1,560.00万',
    collectStatus: '已采集',
    ledgerStatus: '正常',
    isExistingInLocal: true, // Already exists in local
    ledgerType: '自动匹配',
    authDesc: '河南日报社官方客户端',
    intro: '河南日报社主办主流移动新闻客户端，全方位报道河南最新发展。'
  }
];

// Helper to determine display ledger type label
export const getDisplayLedgerType = (
  item: ManualSearchItem,
  isAlreadyIn: boolean,
  addedStatus?: 'whitelist' | 'blacklist' | 'removed',
  existingLedgers: LedgerItem[] = []
): '白名单' | '黑名单' | '自动匹配' | null => {
  if (addedStatus === 'blacklist') return '黑名单';
  if (addedStatus === 'whitelist') return '白名单';
  if (addedStatus === 'removed') {
    if (item.ledgerType === '自动匹配') return '自动匹配';
    const matched = existingLedgers.find(l => l.name === item.name);
    if (matched && (matched.source === '同步匹配' || matched.category === 'normal')) {
      return '自动匹配';
    }
    return null;
  }

  if (!isAlreadyIn) return null;

  // Check matching item in existingLedgers prop
  const matched = existingLedgers.find(l => l.name === item.name);
  if (matched) {
    if (matched.category === 'blacklist') return '黑名单';
    if (matched.category === 'whitelist') return '白名单';
    if (matched.source === '同步匹配' || matched.category === 'normal') return '自动匹配';
  }

  if (item.ledgerType) return item.ledgerType;

  return '自动匹配';
};

interface ManualAddViewProps {
  existingLedgers?: LedgerItem[];
  onAddLedgersToLocal?: (items: ManualSearchItem[], category?: 'whitelist' | 'blacklist') => void;
  onAddToWhitelist?: (item: ManualSearchItem) => void;
  onAddToBlacklist?: (item: ManualSearchItem) => void;
  onRemoveFromWhitelist?: (item: ManualSearchItem) => void;
  onRemoveFromBlacklist?: (item: ManualSearchItem) => void;
  onBatchAddToWhitelist?: (items: ManualSearchItem[]) => void;
  onBatchAddToBlacklist?: (items: ManualSearchItem[]) => void;
}

export const ManualAddView: React.FC<ManualAddViewProps> = ({
  existingLedgers = [],
  onAddLedgersToLocal,
  onAddToWhitelist,
  onAddToBlacklist,
  onRemoveFromWhitelist,
  onRemoveFromBlacklist,
  onBatchAddToWhitelist,
  onBatchAddToBlacklist
}) => {
  // Input and Select filters (same as AutoSyncConfigView)
  const [nameField, setNameField] = useState('台账名称');
  const [ledgerName, setLedgerName] = useState('');
  const [excludeWord, setExcludeWord] = useState('');
  const [platform, setPlatform] = useState('');
  const [authType, setAuthType] = useState('');
  const [addressMode, setAddressMode] = useState('包含');
  const [addressApp, setAddressApp] = useState('');
  const [judgmentType, setJudgmentType] = useState('');
  const [collectStatus, setCollectStatus] = useState('');
  const [minFans, setMinFans] = useState('');
  const [maxFans, setMaxFans] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('');

  // Popover state for 地址检索范围
  const [showAddressRangePopover, setShowAddressRangePopover] = useState(false);
  const [isCustomAddressScope, setIsCustomAddressScope] = useState(false);
  const [personalAddressFields, setPersonalAddressFields] = useState<Record<string, boolean>>({
    jurisdiction: true,
    ip: true,
    lastPublish: true,
    regCity: true,
    regionModel: true,
    unconfirmedRegionModel: false,
  });
  const [orgAddressFields, setOrgAddressFields] = useState<Record<string, boolean>>({
    jurisdiction: true,
    ip: true,
    lastPublish: true,
    regCity: true,
    regionModel: true,
    unconfirmedRegionModel: false,
  });

  // Retain "隐藏已存在台账" (Hide existing ledgers)
  const [hideExisting, setHideExisting] = useState(false);

  // Added status map for items added or removed in current session
  const [addedStatusMap, setAddedStatusMap] = useState<{ [id: number]: 'whitelist' | 'blacklist' | 'removed' }>({});

  // Collapsible toggle for extended filters (default expanded/collapsed as needed)
  const [isExpandedFilters, setIsExpandedFilters] = useState(false);

  // Active Dropdown Popover Key
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sub-option states for dropdowns
  const [mediaAttrOptions, setMediaAttrOptions] = useState<{ [key: string]: boolean }>({
    govPublish: false,
    newsMedia: false,
    businessMedia: false,
    foreignMedia: false,
    otherMedia: false
  });

  const [levelOptions, setLevelOptions] = useState<{ [key: string]: boolean }>({
    province: false,
    city: false,
    county: false,
    town: false
  });

  // Checkbox group states
  const [subjectTypes, setSubjectTypes] = useState<{ [key: string]: boolean }>({
    org: false, diplomacy: false, justice: false, tourism: false, civil: false,
    religion: false, union: false, business: false, cpc: false, housing: false,
    agriculture: false, overseas: false, trade: false, culture: false, none: false
  });

  const [subjectTags, setSubjectTags] = useState<{ [key: string]: boolean }>({
    edu: false, publicSecurity: false, medical: false, noneTag: false
  });

  const [ledgerTags, setLedgerTags] = useState<{ [key: string]: boolean }>({
    media: false, level: false, tempHide: false, discardGov: false, discardMedia: false, noneLedgerTag: false
  });

  // Search Results state (whether user clicked query - default false)
  const [hasQueried, setHasQueried] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  // Selected candidate item IDs for manual addition
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Toast notice for success
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate selected count for Media Attribute
  const selectedMediaCount = Object.values(mediaAttrOptions).filter(Boolean).length;

  const toggleMediaOption = (key: string) => {
    const updated = { ...mediaAttrOptions, [key]: !mediaAttrOptions[key] };
    setMediaAttrOptions(updated);
    const hasAny = Object.values(updated).some(Boolean);
    setLedgerTags(prev => ({ ...prev, media: hasAny }));
  };

  const resetMediaOptions = () => {
    const cleared = {
      govPublish: false, newsMedia: false, businessMedia: false, foreignMedia: false, otherMedia: false
    };
    setMediaAttrOptions(cleared);
    setLedgerTags(prev => ({ ...prev, media: false }));
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownKey(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter candidate data
  const existingNames = new Set(existingLedgers.map(l => l.name));

  const displayList = initialManualSearchData.filter(item => {
    const isAlreadyIn = item.isExistingInLocal || existingNames.has(item.name);
    
    // Check "hide existing"
    if (hideExisting && isAlreadyIn) {
      return false;
    }

    // Name / keyword filter
    if (ledgerName.trim()) {
      if (!item.name.toLowerCase().includes(ledgerName.trim().toLowerCase()) && 
          !item.subjectName.toLowerCase().includes(ledgerName.trim().toLowerCase())) {
        return false;
      }
    }

    // Platform filter
    if (platform) {
      const platformMap: Record<string, string> = {
        toutiao: '今日头条',
        douyin: '抖音',
        weibo: '微博',
        wechat: '微信公众号',
        website: '网站'
      };
      if (platformMap[platform] && item.platform !== platformMap[platform]) {
        return false;
      }
    }

    // AuthType filter
    if (authType) {
      const authMap: Record<string, string> = {
        other: '其他',
        agency: '机构',
        personal: '个人认证',
        enterprise: '企业'
      };
      if (authMap[authType] && item.authType !== authMap[authType]) {
        return false;
      }
    }

    // JudgmentType filter
    if (judgmentType) {
      const judgeMap: Record<string, string> = {
        unjudged: '未研判',
        exact: '精准匹配',
        fuzzy: '模糊匹配'
      };
      if (judgeMap[judgmentType] && item.judgmentType !== judgeMap[judgmentType]) {
        return false;
      }
    }

    // Collect status
    if (collectStatus) {
      const statusMap: Record<string, string> = {
        uncollected: '未采集',
        collected: '已采集'
      };
      if (statusMap[collectStatus] && item.collectStatus !== statusMap[collectStatus]) {
        return false;
      }
    }

    // Ledger status
    if (ledgerStatus) {
      const lMap: Record<string, string> = {
        normal: '正常',
        abnormal: '异常'
      };
      if (lMap[ledgerStatus] && item.ledgerStatus !== lMap[ledgerStatus]) {
        return false;
      }
    }

    return true;
  });

  // Selectable items are ONLY new ledgers (not already existing)
  const selectableItems = displayList.filter(item => {
    const isAlreadyIn = item.isExistingInLocal || existingNames.has(item.name);
    return !isAlreadyIn;
  });

  const isAllSelectableChecked = selectableItems.length > 0 && selectableItems.every(i => selectedIds.includes(i.id));
  const isIndeterminate = selectedIds.length > 0 && !isAllSelectableChecked;

  const [toastInfo, setToastInfo] = useState<{ text: string; type: 'success' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warn' = 'success') => {
    setToastInfo({ text, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 3500);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(selectableItems.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setNameField('台账名称');
    setLedgerName('');
    setExcludeWord('');
    setPlatform('');
    setAuthType('');
    setAddressMode('包含');
    setAddressApp('');
    setJudgmentType('');
    setCollectStatus('');
    setMinFans('');
    setMaxFans('');
    setLedgerStatus('');
    setHideExisting(false);
    setSelectedIds([]);

    setMediaAttrOptions({
      govPublish: false, newsMedia: false, businessMedia: false, foreignMedia: false, otherMedia: false
    });
    setLevelOptions({ province: false, city: false, county: false, town: false });
    setSubjectTypes({
      org: false, diplomacy: false, justice: false, tourism: false, civil: false,
      religion: false, union: false, business: false, cpc: false, housing: false,
      agriculture: false, overseas: false, trade: false, culture: false, none: false
    });
    setSubjectTags({ edu: false, publicSecurity: false, medical: false, noneTag: false });
    setLedgerTags({
      media: false, level: false, tempHide: false, discardGov: false, discardMedia: false, noneLedgerTag: false
    });
    setHasQueried(false);
  };

  // Handle Query
  const handleQuery = () => {
    setIsQuerying(true);
    setTimeout(() => {
      setHasQueried(true);
      setIsQuerying(false);
      setSelectedIds([]);
    }, 200);
  };

  // Single Item Add to Whitelist
  const handleSingleAddToWhitelist = (item: ManualSearchItem) => {
    setAddedStatusMap(prev => ({ ...prev, [item.id]: 'whitelist' }));
    if (onAddToWhitelist) {
      onAddToWhitelist(item);
    } else if (onAddLedgersToLocal) {
      onAddLedgersToLocal([item], 'whitelist');
    }
    showToast(`已成功将【${item.name}】加入白名单！`, 'success');
  };

  // Single Item Remove from Whitelist
  const handleSingleRemoveFromWhitelist = (item: ManualSearchItem) => {
    setAddedStatusMap(prev => ({ ...prev, [item.id]: 'removed' }));
    if (onRemoveFromWhitelist) {
      onRemoveFromWhitelist(item);
    }
    showToast(`已将【${item.name}】移出白名单！`, 'warn');
  };

  // Single Item Add to Blacklist
  const handleSingleAddToBlacklist = (item: ManualSearchItem) => {
    setAddedStatusMap(prev => ({ ...prev, [item.id]: 'blacklist' }));
    if (onAddToBlacklist) {
      onAddToBlacklist(item);
    } else if (onAddLedgersToLocal) {
      onAddLedgersToLocal([item], 'blacklist');
    }
    showToast(`已成功将【${item.name}】加入黑名单！`, 'warn');
  };

  // Single Item Remove from Blacklist
  const handleSingleRemoveFromBlacklist = (item: ManualSearchItem) => {
    setAddedStatusMap(prev => ({ ...prev, [item.id]: 'removed' }));
    if (onRemoveFromBlacklist) {
      onRemoveFromBlacklist(item);
    }
    showToast(`已将【${item.name}】移出黑名单！`, 'warn');
  };



  // Batch Add to Whitelist
  const handleBatchAddToWhitelist = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选需要添加的台账！');
      return;
    }

    const itemsToAdd = displayList.filter(item => selectedIds.includes(item.id));
    const newStatuses: { [id: number]: 'whitelist' | 'blacklist' } = {};
    selectedIds.forEach(id => {
      newStatuses[id] = 'whitelist';
    });
    setAddedStatusMap(prev => ({ ...prev, ...newStatuses }));

    if (onBatchAddToWhitelist) {
      onBatchAddToWhitelist(itemsToAdd);
    } else if (onAddLedgersToLocal) {
      onAddLedgersToLocal(itemsToAdd, 'whitelist');
    }

    showToast(`已成功将选中的 ${selectedIds.length} 条台账批量加入白名单！`, 'success');
    setSelectedIds([]);
  };

  // Batch Add to Blacklist
  const handleBatchAddToBlacklist = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选需要添加的台账！');
      return;
    }

    const itemsToAdd = displayList.filter(item => selectedIds.includes(item.id));
    const newStatuses: { [id: number]: 'whitelist' | 'blacklist' } = {};
    selectedIds.forEach(id => {
      newStatuses[id] = 'blacklist';
    });
    setAddedStatusMap(prev => ({ ...prev, ...newStatuses }));

    if (onBatchAddToBlacklist) {
      onBatchAddToBlacklist(itemsToAdd);
    } else if (onAddLedgersToLocal) {
      onAddLedgersToLocal(itemsToAdd, 'blacklist');
    }

    showToast(`已成功将选中的 ${selectedIds.length} 条台账批量加入黑名单！`, 'warn');
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col space-y-4 pb-6 relative">
      {/* Toast alert */}
      {toastInfo && (
        <div className="fixed top-16 right-8 z-50 bg-white border border-[#e8e8e8] shadow-xl rounded-md px-4 py-3 flex items-center space-x-3 text-xs animate-fade-in">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
            toastInfo.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            <i className={`fa-solid ${toastInfo.type === 'success' ? 'fa-shield-check' : 'fa-ban'}`}></i>
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-xs">操作成功</div>
            <div className="text-gray-600 text-[11px] mt-0.5">{toastInfo.text}</div>
          </div>
          <button
            onClick={() => setToastInfo(null)}
            className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer ml-2"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Top Banner / Description */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
          <span className="text-xs font-bold text-gray-800">手动添加台账</span>
          <span className="text-xs text-gray-500 flex items-center ml-2">
            <i className="fa-solid fa-circle-info mr-1 text-[#1677ff]"></i> 从互联网台账库中查询匹配台账并手动添加
          </span>
        </div>
      </div>

      {/* Filter Section (Bordered Card matching AutoSyncConfigView) */}
      <div className="space-y-3 text-xs bg-white p-3.5 border border-[#e8e8e8] rounded-sm">
        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 台账名称 / 台账ID */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors">
            <div className="flex items-center px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap cursor-pointer">
              <span>{nameField}</span>
              <i className="fa-solid fa-angle-down text-gray-400 text-[10px] ml-1.5"></i>
            </div>
            <input
              type="text"
              className="flex-1 px-2.5 py-1.5 border-none outline-none text-gray-800 placeholder-gray-400"
              placeholder="请输入台账名称"
              value={ledgerName}
              onChange={e => setLedgerName(e.target.value)}
              maxLength={2000}
            />
            <span className="px-2 text-gray-400 text-[11px] font-mono">{ledgerName.length} / 2000</span>
          </div>

          {/* 排除词 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">排除词</span>
            <input
              type="text"
              className="flex-1 px-2.5 py-1.5 border-none outline-none text-gray-800 placeholder-gray-400"
              placeholder="请输入排除词，多个以英文逗号分隔"
              value={excludeWord}
              onChange={e => setExcludeWord(e.target.value)}
              maxLength={2000}
            />
            <span className="px-2 text-gray-400 text-[11px] font-mono">{excludeWord.length} / 2000</span>
          </div>

          {/* 所属平台 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">所属平台</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            >
              <option value="">请选择所属平台</option>
              <option value="toutiao">今日头条</option>
              <option value="douyin">抖音</option>
              <option value="weibo">新浪微博</option>
              <option value="wechat">微信公众号</option>
              <option value="website">网站</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 认证类型 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">认证类型</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7"
              value={authType}
              onChange={e => setAuthType(e.target.value)}
            >
              <option value="">请选择认证类型</option>
              <option value="other">其他</option>
              <option value="agency">机构</option>
              <option value="personal">个人认证</option>
              <option value="enterprise">企业认证</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 应用地址 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors relative">
            <span className="px-2 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">应用地址</span>
            <select
              className="flex-1 px-2 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none"
              value={addressApp}
              onChange={e => setAddressApp(e.target.value)}
            >
              <option value="">请选择应用</option>
              <option value="henan">河南</option>
              <option value="sichuan">四川</option>
              <option value="shandong">山东</option>
              <option value="neimenggu">内蒙古</option>
              <option value="jiangxi">江西</option>
            </select>
            <button
              type="button"
              onClick={() => setShowAddressRangePopover(!showAddressRangePopover)}
              className={`px-2 text-gray-400 hover:text-[#1677ff] border-l border-[#d9d9d9] py-1.5 bg-transparent cursor-pointer transition-colors ${
                showAddressRangePopover ? 'text-[#1677ff] bg-blue-50/50' : ''
              }`}
              title="地址检索范围"
            >
              <i className="fa-solid fa-sliders text-[11px]"></i>
            </button>

            {/* 地址检索范围 Popover */}
            {showAddressRangePopover && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAddressRangePopover(false)}
                />

                <div className="absolute top-full right-0 mt-2 z-50 w-[380px] bg-white rounded-md shadow-xl border border-gray-200 p-4 text-xs font-sans text-gray-700 animate-in fade-in zoom-in-95">
                  <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 pointer-events-none" />

                  <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-sm">地址检索范围</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-medium select-none">
                        {isCustomAddressScope ? '自定义' : '默认'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomAddressScope(!isCustomAddressScope)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isCustomAddressScope ? 'bg-[#1677ff]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isCustomAddressScope ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {!isCustomAddressScope ? (
                    <div className="space-y-3.5 text-xs">
                      <p className="text-gray-400 font-normal">默认检索范围说明：</p>

                      <div className="space-y-1.5">
                        <div className="flex items-center font-bold text-gray-800">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          个人、其他、疑似个人
                        </div>
                        <p className="text-gray-500 leading-relaxed pl-2 text-[11px]">
                          匹配IP属地、注册城市、区域模型地址、最后一天发文地址、管辖归属地，其中任意一项匹配即命中。
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center font-bold text-gray-800">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          机构、媒体、疑似机构、疑似媒体
                        </div>
                        <p className="text-gray-500 leading-relaxed pl-2 text-[11px]">
                          仅匹配管辖归属地。
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3.5 text-xs">
                      <p className="text-gray-400 font-normal">
                        自定义模式下，两组认证类型下均需至少选择一个地址字段。
                      </p>

                      <div>
                        <div className="flex items-center font-bold text-gray-800 mb-2">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          个人、其他、疑似个人
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-2 pl-2">
                          {[
                            { id: 'jurisdiction', label: '管辖归属地' },
                            { id: 'ip', label: 'IP属地' },
                            { id: 'lastPublish', label: '最后一天发文地址' },
                            { id: 'regCity', label: '注册城市' },
                            { id: 'regionModel', label: '区域模型地址' },
                            { id: 'unconfirmedRegionModel', label: '待确认区域模型地址' },
                          ].map(opt => {
                            const checked = personalAddressFields[opt.id];
                            return (
                              <label
                                key={opt.id}
                                className="inline-flex items-center space-x-1.5 cursor-pointer select-none text-[11px]"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={e =>
                                    setPersonalAddressFields(prev => ({
                                      ...prev,
                                      [opt.id]: e.target.checked,
                                    }))
                                  }
                                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                                />
                                <span className={checked ? 'text-[#1677ff] font-medium' : 'text-gray-600'}>
                                  {opt.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center font-bold text-gray-800 mb-2">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          机构、媒体、疑似机构、疑似媒体
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-2 pl-2">
                          {[
                            { id: 'jurisdiction', label: '管辖归属地' },
                            { id: 'ip', label: 'IP属地' },
                            { id: 'lastPublish', label: '最后一天发文地址' },
                            { id: 'regCity', label: '注册城市' },
                            { id: 'regionModel', label: '区域模型地址' },
                            { id: 'unconfirmedRegionModel', label: '待确认区域模型地址' },
                          ].map(opt => {
                            const checked = orgAddressFields[opt.id];
                            return (
                              <label
                                key={opt.id}
                                className="inline-flex items-center space-x-1.5 cursor-pointer select-none text-[11px]"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={e =>
                                    setOrgAddressFields(prev => ({
                                      ...prev,
                                      [opt.id]: e.target.checked,
                                    }))
                                  }
                                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                                />
                                <span className={checked ? 'text-[#1677ff] font-medium' : 'text-gray-600'}>
                                  {opt.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 研判类型 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">研判类型</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7"
              value={judgmentType}
              onChange={e => setJudgmentType(e.target.value)}
            >
              <option value="">请选择研判类型</option>
              <option value="unjudged">未研判</option>
              <option value="exact">精准匹配</option>
              <option value="fuzzy">模糊匹配</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 采集状态 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">采集状态</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7"
              value={collectStatus}
              onChange={e => setCollectStatus(e.target.value)}
            >
              <option value="">请选择采集状态</option>
              <option value="uncollected">未采集</option>
              <option value="collected">已采集</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 粉丝数 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">粉丝数</span>
            <input
              type="text"
              className="w-16 px-2 py-1.5 border-none outline-none text-center text-gray-800 placeholder-gray-400"
              placeholder="最小值"
              value={minFans}
              onChange={e => setMinFans(e.target.value)}
            />
            <span className="text-gray-400 px-1">至</span>
            <input
              type="text"
              className="w-16 px-2 py-1.5 border-none outline-none text-center text-gray-800 placeholder-gray-400"
              placeholder="最大值"
              value={maxFans}
              onChange={e => setMaxFans(e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: 台账状态 + 隐藏已存在台账 (保留) */}
        <div className="grid grid-cols-4 gap-3 items-center">
          {/* 台账状态 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">台账状态</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7"
              value={ledgerStatus}
              onChange={e => setLedgerStatus(e.target.value)}
            >
              <option value="">请选择台账状态</option>
              <option value="normal">正常</option>
              <option value="abnormal">异常</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 保留：隐藏已存在台账 Checkbox */}
          <div className="flex items-center pl-1">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-700 select-none hover:text-[#1677ff]">
              <input
                type="checkbox"
                checked={hideExisting}
                onChange={e => setHideExisting(e.target.checked)}
                className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff]"
              />
              <span className="text-xs font-normal">隐藏已存在台账</span>
            </label>
          </div>
        </div>

        {/* Checkbox & Dropdown Groups (Collapsible) */}
        {isExpandedFilters && (
          <div className="space-y-2.5 pt-3 border-t border-[#f0f0f0] text-gray-700 select-none">
            {/* 主体类型 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-gray-800 font-normal w-16">主体类型</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Object.values(subjectTypes).every(Boolean)}
                  onChange={e => {
                    const val = e.target.checked;
                    const updated: Record<string, boolean> = {};
                    Object.keys(subjectTypes).forEach(k => { updated[k] = val; });
                    setSubjectTypes(updated);
                  }}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <span>全选</span>
              </label>

              {[
                { key: 'org', label: '机构编制' },
                { key: 'diplomacy', label: '外交' },
                { key: 'justice', label: '司法行政' },
                { key: 'tourism', label: '旅游' },
                { key: 'civil', label: '民政' },
                { key: 'religion', label: '宗教' },
                { key: 'union', label: '工会' },
                { key: 'business', label: '工商' },
                { key: 'cpc', label: '中央军委改革和编制办公室' },
                { key: 'housing', label: '住房城乡建设' },
                { key: 'agriculture', label: '农业' },
                { key: 'overseas', label: '侨联' },
                { key: 'trade', label: '贸易促进' },
                { key: 'culture', label: '文化' },
                { key: 'none', label: '无类型', hasArrow: false }
              ].map(item => (
                <div key={item.key} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    id={`manual-subject-${item.key}`}
                    checked={subjectTypes[item.key]}
                    onChange={e => setSubjectTypes({ ...subjectTypes, [item.key]: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <label htmlFor={`manual-subject-${item.key}`} className="cursor-pointer flex items-center">
                    <span>{item.label}</span>
                    {item.hasArrow !== false && (
                      <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {/* 主体标签 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-gray-800 font-normal w-16">主体标签</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Object.values(subjectTags).every(Boolean)}
                  onChange={e => {
                    const val = e.target.checked;
                    const updated: Record<string, boolean> = {};
                    Object.keys(subjectTags).forEach(k => { updated[k] = val; });
                    setSubjectTags(updated);
                  }}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <span>全选</span>
              </label>

              {[
                { key: 'edu', label: '教育类' },
                { key: 'publicSecurity', label: '公安' },
                { key: 'medical', label: '医疗' },
                { key: 'noneTag', label: '无标签', hasArrow: false }
              ].map(item => (
                <div key={item.key} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    id={`manual-tag-${item.key}`}
                    checked={subjectTags[item.key]}
                    onChange={e => setSubjectTags({ ...subjectTags, [item.key]: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <label htmlFor={`manual-tag-${item.key}`} className="cursor-pointer flex items-center">
                    <span>{item.label}</span>
                    {item.hasArrow !== false && (
                      <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {/* 台账标签 (with Dropdown Popover) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs relative" ref={dropdownRef}>
              <span className="text-gray-800 font-normal w-16">台账标签</span>
              
              <label className="flex items-center space-x-1 cursor-pointer">
                <div className="w-3.5 h-3.5 bg-gray-300 rounded-xs flex items-center justify-center text-white text-[9px]">
                  <i className="fa-solid fa-minus"></i>
                </div>
                <span>全选</span>
              </label>

              {/* 媒体属性 (with Dropdown & Count badge) */}
              <div className="relative">
                <div 
                  onClick={() => setActiveDropdownKey(activeDropdownKey === 'mediaAttr' ? null : 'mediaAttr')}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={ledgerTags.media}
                    onChange={e => {
                      e.stopPropagation();
                      const next = e.target.checked;
                      setLedgerTags({ ...ledgerTags, media: next });
                      if (next && selectedMediaCount === 0) {
                        setMediaAttrOptions({ ...mediaAttrOptions, govPublish: true });
                      }
                    }}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <div className="flex items-center space-x-1 text-gray-800 hover:text-[#1677ff]">
                    <span className={ledgerTags.media ? 'text-[#1677ff] font-medium' : ''}>媒体属性</span>
                    {selectedMediaCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-[#e6f4ff] text-[#1677ff] text-[10px] rounded border border-[#91caff] leading-tight">
                        {selectedMediaCount}
                      </span>
                    )}
                    <i className={`fa-solid fa-caret-${activeDropdownKey === 'mediaAttr' ? 'up' : 'down'} text-[10px] text-gray-500`}></i>
                  </div>
                </div>

                {/* Popover Dropdown Panel for 媒体属性 */}
                {activeDropdownKey === 'mediaAttr' && (
                  <div className="absolute left-0 top-7 w-56 bg-white border border-[#e8e8e8] shadow-lg rounded-sm p-3 z-50 space-y-2 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.govPublish}
                        onChange={() => toggleMediaOption('govPublish')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">政务发布</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.newsMedia}
                        onChange={() => toggleMediaOption('newsMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">新闻媒体</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.businessMedia}
                        onChange={() => toggleMediaOption('businessMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">商业媒体</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.foreignMedia}
                        onChange={() => toggleMediaOption('foreignMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">驻华外媒废弃转到屏</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.otherMedia}
                        onChange={() => toggleMediaOption('otherMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">其他媒体废弃</span>
                    </label>

                    <div className="pt-2 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={resetMediaOptions}
                        className="text-gray-500 hover:text-[#1677ff] text-[11px] flex items-center space-x-1 cursor-pointer bg-transparent border-none"
                      >
                        <i className="fa-solid fa-arrow-rotate-right text-[10px]"></i>
                        <span>重置</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 级别 */}
              <div className="relative">
                <div
                  onClick={() => setActiveDropdownKey(activeDropdownKey === 'level' ? null : 'level')}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={ledgerTags.level}
                    onChange={e => setLedgerTags({ ...ledgerTags, level: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <div className="flex items-center space-x-1 text-gray-800 hover:text-[#1677ff]">
                    <span>级别</span>
                    <i className={`fa-solid fa-caret-${activeDropdownKey === 'level' ? 'up' : 'down'} text-[10px] text-gray-500`}></i>
                  </div>
                </div>

                {activeDropdownKey === 'level' && (
                  <div className="absolute left-0 top-7 w-48 bg-white border border-[#e8e8e8] shadow-lg rounded-sm p-3 z-50 space-y-2 text-xs">
                    {['省级', '地市级', '县区级', '乡镇街道'].map(lvl => (
                      <label key={lvl} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={levelOptions[lvl]}
                          onChange={() => setLevelOptions({ ...levelOptions, [lvl]: !levelOptions[lvl] })}
                          className="rounded border-gray-300 text-[#1677ff]"
                        />
                        <span className="text-gray-800">{lvl}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 暂时屏蔽 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="manual-tag-tempHide"
                  checked={ledgerTags.tempHide}
                  onChange={e => setLedgerTags({ ...ledgerTags, tempHide: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="manual-tag-tempHide" className="cursor-pointer flex items-center">
                  <span>暂时屏蔽</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 废弃政务类废弃 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="manual-tag-discardGov"
                  checked={ledgerTags.discardGov}
                  onChange={e => setLedgerTags({ ...ledgerTags, discardGov: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="manual-tag-discardGov" className="cursor-pointer flex items-center">
                  <span>废弃政务类废弃</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 废弃媒体类废弃 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="manual-tag-discardMedia"
                  checked={ledgerTags.discardMedia}
                  onChange={e => setLedgerTags({ ...ledgerTags, discardMedia: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="manual-tag-discardMedia" className="cursor-pointer flex items-center">
                  <span>废弃媒体类废弃</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 无标签 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="manual-tag-noneLedgerTag"
                  checked={ledgerTags.noneLedgerTag}
                  onChange={e => setLedgerTags({ ...ledgerTags, noneLedgerTag: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="manual-tag-noneLedgerTag" className="cursor-pointer">
                  <span>无标签</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Count & Action Buttons Bar: 查询 + 重置 + 展开/收起 (保留) */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center space-x-2 text-gray-700">
          <i className="fa-solid fa-chart-simple text-[#1677ff] text-sm"></i>
          <span>
            (共查询到 <strong className="text-[#1677ff] font-semibold">{hasQueried ? displayList.length : '0'}</strong> 条台账)
          </span>
        </div>
        <div className="flex items-center space-x-2.5">
          {/* Expand/Collapse Trigger */}
          <span
            onClick={() => setIsExpandedFilters(!isExpandedFilters)}
            className="text-[#1677ff] cursor-pointer hover:underline flex items-center space-x-1 mr-2 select-none"
          >
            <span>{isExpandedFilters ? '收起' : '展开'}</span>
            <i className={`fa-solid fa-angle-${isExpandedFilters ? 'up' : 'down'} text-[10px]`}></i>
          </span>

          {/* 查询 Button (Blue BG) */}
          <button
            onClick={handleQuery}
            className="bg-[#1677ff] text-white px-5 py-1.5 rounded-sm text-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center shadow-xs"
          >
            {isQuerying ? (
              <i className="fa-solid fa-spinner fa-spin mr-1.5 text-[11px]"></i>
            ) : (
              <i className="fa-solid fa-magnifying-glass mr-1.5 text-[11px]"></i>
            )}
            <span>查询</span>
          </button>

          {/* 重置 Button (Gray/White BG) */}
          <button
            onClick={handleReset}
            className="bg-gray-50 text-gray-700 border border-[#d9d9d9] px-4 py-1.5 rounded-sm text-xs hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-arrow-rotate-right mr-1.5 text-[11px] text-gray-500"></i>
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 批量操作提示栏 (位于筛选区域下方与列表上方) */}
      <div className="flex items-center justify-between bg-[#e6f4ff] border border-[#91caff] px-3.5 py-2 rounded-sm text-xs text-gray-700">
        <div className="flex items-center space-x-1.5 text-gray-600 font-medium">
          <i className="fa-solid fa-circle-info text-[#1677ff] text-sm"></i>
          <span>已选择 <strong className="text-gray-900 font-semibold">{selectedIds.length}</strong> 项目</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBatchAddToWhitelist}
            className="px-3 py-1 bg-white hover:bg-green-50 text-[#52c41a] border border-[#b7eb8f] hover:border-[#52c41a] rounded-xs text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <i className="fa-solid fa-shield-halved text-xs"></i>
            <span>批量加入白名单</span>
          </button>
          <button
            onClick={handleBatchAddToBlacklist}
            className="px-3 py-1 bg-white hover:bg-red-50 text-[#ff4d4f] border border-[#ffa39e] hover:border-[#ff4d4f] rounded-xs text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <i className="fa-solid fa-ban text-xs"></i>
            <span>批量加入黑名单</span>
          </button>
        </div>
      </div>

      {/* Data Table with Columns Matching AutoSyncConfigView + 台账查重 */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs table-fixed">
          <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
            <tr>
              <th className="px-1.5 py-2.5 font-normal w-[32px] text-center whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isAllSelectableChecked}
                  ref={el => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  disabled={selectableItems.length === 0}
                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] disabled:opacity-40 cursor-pointer"
                  title={selectableItems.length === 0 ? '当前无可选新台账' : '全选新台账'}
                />
              </th>
              <th className="px-1 py-2.5 font-normal w-[36px] text-center whitespace-nowrap">序号</th>
              <th className="px-2 py-2.5 font-normal w-[15%] whitespace-nowrap">台账信息</th>
              <th className="px-2 py-2.5 font-normal w-[13%] whitespace-nowrap">简介</th>
              <th className="px-1.5 py-2.5 font-normal w-[92px] whitespace-nowrap">认证/研判</th>
              <th className="px-1.5 py-2.5 font-normal w-[95px] whitespace-nowrap">台账标签</th>
              <th className="px-1.5 py-2.5 font-normal w-[100px] whitespace-nowrap">应用地址</th>
              <th className="px-1.5 py-2.5 font-normal w-[13%] whitespace-nowrap">主体名称/类型</th>
              <th className="px-1 py-2.5 font-normal w-[65px] whitespace-nowrap text-right">粉丝数</th>
              <th className="px-1 py-2.5 font-normal w-[58px] text-center whitespace-nowrap">采集状态</th>
              <th className="px-1 py-2.5 font-normal w-[52px] text-center whitespace-nowrap">台账状态</th>
              <th className="px-1.5 py-2.5 font-normal w-[80px] text-center whitespace-nowrap">台账查重</th>
              <th className="px-1.5 py-2.5 font-normal w-[90px] text-center whitespace-nowrap">台账类型</th>
              <th className="px-1.5 py-2.5 font-normal w-[145px] text-center whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8e8]">
            {!hasQueried ? (
              <tr>
                <td colSpan={14} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 bg-blue-50/70 rounded-full flex items-center justify-center text-xl text-[#1677ff] border border-blue-100 mb-1">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">请设置上方筛选条件，点击「查询」按钮获取互联网台账数据</p>
                    <p className="text-[11px] text-gray-400">默认不显示列表数据，支持按台账名称、平台、认证类型、地址与主体标签等多维度筛选</p>
                  </div>
                </td>
              </tr>
            ) : displayList.length > 0 ? (
              displayList.map((item, index) => {
                const isRemoved = addedStatusMap[item.id] === 'removed';
                const isAddedInSession = addedStatusMap[item.id] === 'whitelist' || addedStatusMap[item.id] === 'blacklist';
                const isInitiallyIn = item.isExistingInLocal || existingNames.has(item.name);

                // If user manually removed it, it is no longer considered existing
                const isAlreadyIn = !isRemoved && (isAddedInSession || isInitiallyIn);

                let actionStatus: 'whitelist' | 'blacklist' | 'removed' | undefined = addedStatusMap[item.id];
                if (isRemoved) {
                  actionStatus = undefined;
                } else if (!actionStatus && isInitiallyIn) {
                  actionStatus = 'whitelist';
                }

                const isChecked = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isAlreadyIn ? 'bg-[#fafafa]/80 text-gray-500' : isChecked ? 'bg-blue-50/40' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <td className="px-1.5 py-2 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                      />
                    </td>
                    <td className="px-1 py-2 text-gray-500 text-center whitespace-nowrap">{index + 1}</td>
                    <td className="px-2 py-2 overflow-hidden">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className={`w-6 h-6 rounded-full object-cover border border-gray-200 ${isAlreadyIn ? 'grayscale opacity-75' : ''}`}
                          />
                          {item.badgeType === 'redV' && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[6px] font-bold border border-white">
                              V
                            </span>
                          )}
                          {item.badgeType === 'blueV' && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[6px] font-bold border border-white">
                              V
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className={`font-medium truncate text-xs ${isAlreadyIn ? 'text-gray-700' : 'text-[#1677ff] hover:underline cursor-pointer'}`} title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-[10px] space-y-0.2">
                            <div className="text-gray-400 flex items-center space-x-1 truncate">
                              {item.platformIcon ? (
                                <i className={item.platformIcon}></i>
                              ) : (
                                <i className="fa-solid fa-newspaper text-red-500"></i>
                              )}
                              <span>{item.platform}</span>
                            </div>
                            <div
                              className="text-gray-500 truncate"
                              title={item.authDesc || item.subjectName}
                            >
                              {item.authDesc || item.subjectName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-gray-600 overflow-hidden">
                      <div
                        className="text-[11px] text-gray-600 line-clamp-2 leading-tight"
                        title={item.intro || `${item.name}官方账号，发布权威政务信息与服务动态。`}
                      >
                        {item.intro || `${item.name}官方账号，发布权威政务信息与服务动态。`}
                      </div>
                    </td>
                    <td className="px-1.5 py-2 overflow-hidden">
                      <div className="flex flex-col space-y-0.5">
                        <span className="px-1 py-0.2 bg-gray-100 text-gray-600 rounded-xs text-[10px] border border-gray-200 truncate text-center" title={item.authType}>
                          {item.authType}
                        </span>
                        <span className="px-1 py-0.2 bg-gray-100 text-gray-600 rounded-xs text-[10px] border border-gray-200 truncate text-center" title={item.judgmentType}>
                          {item.judgmentType}
                        </span>
                      </div>
                    </td>
                    <td className="px-1.5 py-2 overflow-hidden">
                      <div className="flex flex-col gap-0.5">
                        {item.ledgerTags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1 py-0.2 bg-gray-100 text-gray-600 rounded-xs text-[10px] border border-gray-200 truncate"
                            title={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-1.5 py-2 text-gray-600 overflow-hidden">
                      <div className="space-y-0.5">
                        {item.addresses.slice(0, 2).map((addr, idx) => (
                          <div key={idx} className="flex items-center text-[10px] text-gray-600 min-w-0" title={addr.text}>
                            {addr.isIP ? (
                              <span className="px-0.5 bg-gray-200 rounded text-[7px] text-gray-600 mr-1 font-mono flex-shrink-0">
                                IP
                              </span>
                            ) : (
                              <span className="mr-1 text-[10px] text-gray-500 flex-shrink-0">{addr.icon}</span>
                            )}
                            <span className="truncate flex-1">{addr.text}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-1.5 py-2 text-gray-600 overflow-hidden">
                      <div className="space-y-0.2 min-w-0">
                        <div className="text-gray-800 truncate text-xs font-normal" title={item.subjectName}>{item.subjectName}</div>
                        <div className="text-[10px] text-gray-400 truncate" title={item.subjectType}>{item.subjectType}</div>
                      </div>
                    </td>
                    <td className="px-1 py-2 font-mono text-gray-800 whitespace-nowrap text-right text-[11px] overflow-hidden truncate" title={item.fansDisplay}>
                      {item.fansDisplay}
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                      <span className="inline-flex items-center text-gray-500 text-[10px]" title={item.collectStatus}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0 ${item.collectStatus === '已采集' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="truncate">{item.collectStatus}</span>
                      </span>
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                      <span className="text-gray-700 text-[10px] truncate" title={item.ledgerStatus}>{item.ledgerStatus}</span>
                    </td>
                    {/* 台账查重 状态 */}
                    <td className="px-1.5 py-2 text-center whitespace-nowrap overflow-hidden">
                      {isAlreadyIn ? (
                        <span className="inline-flex items-center px-1 py-0.2 rounded-xs text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200 truncate" title="已存在台账">
                          <i className="fa-solid fa-circle-info mr-1 text-[9px] flex-shrink-0"></i> 已存在
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1 py-0.2 rounded-xs text-[10px] font-medium bg-green-50 text-[#52c41a] border border-green-200 truncate" title="可添加">
                          <i className="fa-solid fa-circle-check mr-1 text-[9px] flex-shrink-0"></i> 可添加
                        </span>
                      )}
                    </td>
                    {/* 台账类型 列 */}
                    <td className="px-1.5 py-2 text-center whitespace-nowrap overflow-hidden">
                      {(() => {
                        const typeLabel = getDisplayLedgerType(item, isAlreadyIn, addedStatusMap[item.id], existingLedgers);
                        if (!typeLabel) {
                          return <span className="text-gray-400 font-mono text-center text-xs">-</span>;
                        }
                        return (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.2 rounded-xs text-[10px] font-medium border truncate ${
                              typeLabel === '黑名单'
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : typeLabel === '自动匹配'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-blue-50 text-[#1677ff] border-blue-200'
                            }`}
                            title={`台账类型：${typeLabel}`}
                          >
                            {typeLabel}
                          </span>
                        );
                      })()}
                    </td>
                    {/* 操作 列 */}
                    <td className="px-1.5 py-2 text-center whitespace-nowrap overflow-hidden">
                      {(() => {
                        const typeLabel = getDisplayLedgerType(item, isAlreadyIn, addedStatusMap[item.id], existingLedgers);

                        // 1. 台账类型为黑名单时：加入白名单 和 移出黑名单
                        if (typeLabel === '黑名单') {
                          return (
                            <div className="flex items-center justify-center space-x-2 text-xs">
                              <button
                                onClick={() => handleSingleAddToWhitelist(item)}
                                className="text-[#52c41a] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                                title="加入白名单"
                              >
                                加入白名单
                              </button>
                              <button
                                onClick={() => handleSingleRemoveFromBlacklist(item)}
                                className="text-[#fa8c16] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                                title="移出黑名单"
                              >
                                移出黑名单
                              </button>
                            </div>
                          );
                        }

                        // 2. 台账类型为白名单时：移出白名单 和 加入黑名单
                        if (typeLabel === '白名单') {
                          return (
                            <div className="flex items-center justify-center space-x-2 text-xs">
                              <button
                                onClick={() => handleSingleRemoveFromWhitelist(item)}
                                className="text-[#fa8c16] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                                title="移出白名单"
                              >
                                移出白名单
                              </button>
                              <button
                                onClick={() => handleSingleAddToBlacklist(item)}
                                className="text-[#ff4d4f] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                                title="加入黑名单"
                              >
                                加入黑名单
                              </button>
                            </div>
                          );
                        }

                        // 3. 台账类型为自动匹配 (或未添加/-)：加入白名单 和 加入黑名单
                        return (
                          <div className="flex items-center justify-center space-x-2 text-xs">
                            <button
                              onClick={() => handleSingleAddToWhitelist(item)}
                              className="text-[#52c41a] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                              title="加入白名单"
                            >
                              加入白名单
                            </button>
                            <button
                              onClick={() => handleSingleAddToBlacklist(item)}
                              className="text-[#ff4d4f] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                              title="加入黑名单"
                            >
                              加入黑名单
                            </button>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={14} className="py-14 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                    <p className="text-xs text-gray-400">暂无匹配台账，请调整筛选条件后重新点击「查询」</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
