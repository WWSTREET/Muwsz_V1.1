import React, { useState, useRef, useEffect } from 'react';

interface SyncItem {
  id: number;
  name: string;
  platform: string;
  platformIcon?: string;
  avatar: string;
  authType: string;
  judgmentType: string;
  ledgerTags: string[];
  addresses: { icon: string; text: string; isIP?: boolean }[];
  subjectName: string;
  subjectType: string;
  fans: string;
  collectStatus: string;
  ledgerStatus: string;
  authDesc?: string;
  intro?: string;
}

const mockSyncData: SyncItem[] = [
  {
    id: 1,
    name: '淡然天地',
    platform: '今日头条',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
    authType: '其他',
    judgmentType: '未研判',
    ledgerTags: ['媒体属性', '政务发布', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '四川/成都/青羊区' },
      { icon: '👤', text: '四川' },
      { icon: '▲', text: '四川' },
      { icon: '✈', text: '四川/成都' }
    ],
    subjectName: '四川省总工会',
    subjectType: '编办直接管理机构编...',
    fans: '2.49万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    authDesc: '四川省总工会官方账号',
    intro: '发布四川工会权威动态、职工维权指引及便民普惠服务。'
  },
  {
    id: 2,
    name: '郑州市文化广...',
    platform: '微博/蓝V',
    platformIcon: 'fa-brands fa-weibo text-red-500',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '政务发布', '级别', '地市级'],
    addresses: [
      { icon: '🏛', text: '河南/郑州/金水区' },
      { icon: '👤', text: '河南/安阳/殷都区...' },
      { icon: '▲', text: '河南/郑州' },
      { icon: '✈', text: '河南/郑州/登封市' }
    ],
    subjectName: '郑州市文化广电和旅...',
    subjectType: '机关',
    fans: '30.07万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    authDesc: '郑州市文化广电和旅游局官方微博',
    intro: '发布郑州文旅资讯、景区动态与精彩文旅活动推荐。'
  },
  {
    id: 3,
    name: '内蒙古新视听',
    platform: '微博/蓝V',
    platformIcon: 'fa-brands fa-weibo text-red-500',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['省级A', '废弃政务类废弃', '媒体属性', '政务发布', '级别', '省级'],
    addresses: [
      { icon: 'IP', text: '内蒙古', isIP: true },
      { icon: '🏛', text: '内蒙古/呼和浩特/...' },
      { icon: '👤', text: '内蒙古/呼和浩特' },
      { icon: '▲', text: '内蒙古/呼和浩特/...' },
      { icon: '✈', text: '内蒙古/呼和浩特' }
    ],
    subjectName: '内蒙古自治区广播电...',
    subjectType: '机关',
    fans: '15.04万',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    authDesc: '内蒙古自治区广播电视局官方微博',
    intro: '内蒙古广播电视行业官方信息发布与政策宣传窗口。'
  },
  {
    id: 4,
    name: '九江中院',
    platform: '微博/蓝V',
    platformIcon: 'fa-brands fa-weibo text-red-500',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['地市级A', '废弃政务类废弃', '媒体属性', '政务发布', '级别'],
    addresses: [
      { icon: '🏛', text: '江西/九江市/濂溪...' },
      { icon: '👤', text: '江西' },
      { icon: '▲', text: '江西/九江市' }
    ],
    subjectName: '江西省九江市中级人...',
    subjectType: '机关',
    fans: '4,459',
    collectStatus: '未采集',
    ledgerStatus: '正常',
    authDesc: '九江市中级人民法院官方微博',
    intro: '九江市中级人民法院官方司法公开与法治宣传平台。'
  },
  {
    id: 5,
    name: '陕西网信',
    platform: '微博/蓝V',
    platformIcon: 'fa-brands fa-weibo text-red-500',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '政务发布', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '陕西/西安/雁塔区' },
      { icon: 'IP', text: '陕西', isIP: true }
    ],
    subjectName: '中共陕西省委网络安全和信息化委员会办公室',
    subjectType: '机关',
    fans: '88.52万',
    collectStatus: '已采集',
    ledgerStatus: '正常',
    authDesc: '中共陕西省委网信办官方微博',
    intro: '陕西省委网信办官方发布，传递网信动态，共建清朗网络空间。'
  },
  {
    id: 6,
    name: '西安发布',
    platform: '微信公众号',
    platformIcon: 'fa-brands fa-weixin text-green-500',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    authType: '机构',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '政务发布', '级别', '地市级'],
    addresses: [
      { icon: '🏛', text: '陕西/西安/未央区' },
      { icon: '▲', text: '陕西/西安' }
    ],
    subjectName: '中共西安市委宣传部',
    subjectType: '机关',
    fans: '350.20万',
    collectStatus: '已采集',
    ledgerStatus: '正常',
    authDesc: '中共西安市委宣传部官方微信',
    intro: '西安市委宣传部官方发布平台，权威发布西安政务与民生资讯。'
  },
  {
    id: 7,
    name: '陕视新闻',
    platform: '抖音',
    platformIcon: 'fa-brands fa-tiktok text-black',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '陕西/西安/曲江新区' },
      { icon: 'IP', text: '陕西', isIP: true }
    ],
    subjectName: '陕西广电融媒体集团',
    subjectType: '事业单位',
    fans: '1,280.60万',
    collectStatus: '已采集',
    ledgerStatus: '正常',
    authDesc: '陕西广电融媒体集团陕视新闻官方抖音',
    intro: '陕西广电旗下权威时政民生短视频平台。'
  },
  {
    id: 8,
    name: '华商网',
    platform: '网站',
    platformIcon: 'fa-solid fa-globe text-blue-500',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    authType: '媒体',
    judgmentType: '精准匹配',
    ledgerTags: ['媒体属性', '新闻媒体', '级别', '省级'],
    addresses: [
      { icon: '🏛', text: '陕西/西安/高新区' },
      { icon: 'IP', text: '陕西', isIP: true }
    ],
    subjectName: '华商传媒集团',
    subjectType: '企业',
    fans: '560.40万',
    collectStatus: '已采集',
    ledgerStatus: '正常',
    authDesc: '华商传媒集团华商网官方门户',
    intro: '立足陕西主流综合新闻门户网站，服务千万市民。'
  }
];

export interface AutoSyncRuleConfig {
  isEnabled: boolean;
  syncSource: 'local' | 'internet';
  nameField: string;
  ledgerName: string;
  excludeWord: string;
  platform: string;
  authType: string;
  addressMode: string;
  addressApp: string;
  isCustomAddressScope?: boolean;
  personalAddressFields?: Record<string, boolean>;
  orgAddressFields?: Record<string, boolean>;
  judgmentType: string;
  collectStatus: string;
  minFans: string;
  maxFans: string;
  ledgerStatus: string;
  isExpandedFilters: boolean;
  mediaAttrOptions: { [key: string]: boolean };
  levelOptions: { [key: string]: boolean };
  subjectTypes: { [key: string]: boolean };
  subjectTags: { [key: string]: boolean };
  ledgerTags: { [key: string]: boolean };
  isPreviewShown?: boolean;
}

interface AutoSyncConfigViewProps {
  tipText?: string;
  isSyncEnabled?: boolean;
  isSyncConfigured?: boolean;
  onSaveConfig?: (enabled: boolean, configData: any) => void;
  sourceTypeName?: string;
  initialSyncSource?: 'local' | 'internet';
  institutionName?: string;
  allowSourceSelection?: boolean;
  savedConfig?: Partial<AutoSyncRuleConfig> | null;
  onAddToWhitelist?: (item: SyncItem) => void;
  onAddToBlacklist?: (item: SyncItem) => void;
  onBatchAddToWhitelist?: (items: SyncItem[]) => void;
  onBatchAddToBlacklist?: (items: SyncItem[]) => void;
}

export const AutoSyncConfigView: React.FC<AutoSyncConfigViewProps> = ({
  tipText,
  isSyncEnabled = true, // 默认开启状态
  isSyncConfigured = false,
  onSaveConfig,
  sourceTypeName = '互联网台账',
  initialSyncSource = 'internet',
  institutionName = '中共陕西省委网络安全和信息化委员会办公室',
  allowSourceSelection = false,
  savedConfig,
  onAddToWhitelist,
  onAddToBlacklist,
  onBatchAddToWhitelist,
  onBatchAddToBlacklist
}) => {
  const storageKey = `auto_sync_rule_${institutionName}_${allowSourceSelection ? 'error' : 'standard'}`;

  // Helper to load cached configuration from localStorage
  const loadInitialConfig = (): Partial<AutoSyncRuleConfig> | null => {
    if (savedConfig) return savedConfig;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  };

  const initialValues = loadInitialConfig();

  const [isEnabled, setIsEnabled] = useState(
    initialValues?.isEnabled !== undefined ? initialValues.isEnabled : (isSyncEnabled !== undefined ? isSyncEnabled : true)
  );
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ text: string; type: 'success' | 'warn' } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [itemActionStatus, setItemActionStatus] = useState<{ [id: number]: 'whitelist' | 'blacklist' | 'normal' }>({
    1: 'whitelist',
    2: 'whitelist',
    4: 'blacklist',
    5: 'whitelist',
    7: 'whitelist'
  });

  const showToast = (text: string, type: 'success' | 'warn' = 'success') => {
    setToastInfo({ text, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 3000);
  };
  const [syncSource, setSyncSource] = useState<'local' | 'internet'>(
    initialValues?.syncSource || initialSyncSource
  );

  useEffect(() => {
    if (isSyncEnabled !== undefined && !initialValues) {
      setIsEnabled(isSyncEnabled);
    }
  }, [isSyncEnabled]);

  useEffect(() => {
    if (initialSyncSource && !initialValues?.syncSource) {
      setSyncSource(initialSyncSource);
    }
  }, [initialSyncSource]);

  const [nameField, setNameField] = useState(initialValues?.nameField || '台账名称');
  const [ledgerName, setLedgerName] = useState(initialValues?.ledgerName || '');
  const [excludeWord, setExcludeWord] = useState(initialValues?.excludeWord || '');
  const [platform, setPlatform] = useState(initialValues?.platform || '');
  const [authType, setAuthType] = useState(initialValues?.authType || '');
  const [addressMode, setAddressMode] = useState(initialValues?.addressMode || '包含');
  const [addressApp, setAddressApp] = useState(initialValues?.addressApp || '');
  const [judgmentType, setJudgmentType] = useState(initialValues?.judgmentType || '');
  const [collectStatus, setCollectStatus] = useState(initialValues?.collectStatus || '');
  const [minFans, setMinFans] = useState(initialValues?.minFans || '');
  const [maxFans, setMaxFans] = useState(initialValues?.maxFans || '');
  const [ledgerStatus, setLedgerStatus] = useState(initialValues?.ledgerStatus || '');

  // Whether data list preview is triggered (默认不自动展示列表，点击【台账预览】后展示)
  const [isPreviewShown, setIsPreviewShown] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Popover state for 地址检索范围
  const [showAddressRangePopover, setShowAddressRangePopover] = useState(false);
  const [isCustomAddressScope, setIsCustomAddressScope] = useState(
    initialValues?.isCustomAddressScope !== undefined ? initialValues.isCustomAddressScope : false
  );
  const [personalAddressFields, setPersonalAddressFields] = useState<Record<string, boolean>>(
    initialValues?.personalAddressFields || {
      jurisdiction: true,
      ip: true,
      lastPublish: true,
      regCity: true,
      regionModel: true,
      unconfirmedRegionModel: false,
    }
  );
  const [orgAddressFields, setOrgAddressFields] = useState<Record<string, boolean>>(
    initialValues?.orgAddressFields || {
      jurisdiction: true,
      ip: true,
      lastPublish: true,
      regCity: true,
      regionModel: true,
      unconfirmedRegionModel: false,
    }
  );
  
  // Collapsible toggle for extended filters
  const [isExpandedFilters, setIsExpandedFilters] = useState(initialValues?.isExpandedFilters || false);

  // Active Dropdown Popover Key (default none active)
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sub-option states for dropdowns
  const [mediaAttrOptions, setMediaAttrOptions] = useState<{ [key: string]: boolean }>(
    initialValues?.mediaAttrOptions || {
      govPublish: true, // 政务发布
      newsMedia: false, // 新闻媒体
      businessMedia: false, // 商业媒体
      foreignMedia: false, // 驻华外媒废弃转到屏
      otherMedia: false // 其他媒体废弃
    }
  );

  const [levelOptions, setLevelOptions] = useState<{ [key: string]: boolean }>(
    initialValues?.levelOptions || {
      province: false,
      city: false,
      county: false,
      town: false
    }
  );

  // Checkbox group states
  const [subjectTypes, setSubjectTypes] = useState<{ [key: string]: boolean }>(
    initialValues?.subjectTypes || {
      org: false, diplomacy: false, justice: false, tourism: false, civil: false,
      religion: false, union: false, business: false, cpc: false, housing: false,
      agriculture: false, overseas: false, trade: false, culture: false, none: false
    }
  );

  const [subjectTags, setSubjectTags] = useState<{ [key: string]: boolean }>(
    initialValues?.subjectTags || {
      edu: false, publicSecurity: false, medical: false, noneTag: false
    }
  );

  const [ledgerTags, setLedgerTags] = useState<{ [key: string]: boolean }>(
    initialValues?.ledgerTags || {
      media: true, level: false, tempHide: false, discardGov: false, discardMedia: false, noneLedgerTag: false
    }
  );

  // When institutionName or storageKey changes, load saved config if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          if (parsed.isEnabled !== undefined) setIsEnabled(parsed.isEnabled);
          if (parsed.syncSource) setSyncSource(parsed.syncSource);
          if (parsed.nameField) setNameField(parsed.nameField);
          if (parsed.ledgerName !== undefined) setLedgerName(parsed.ledgerName);
          if (parsed.excludeWord !== undefined) setExcludeWord(parsed.excludeWord);
          if (parsed.platform !== undefined) setPlatform(parsed.platform);
          if (parsed.authType !== undefined) setAuthType(parsed.authType);
          if (parsed.addressMode !== undefined) setAddressMode(parsed.addressMode);
          if (parsed.addressApp !== undefined) setAddressApp(parsed.addressApp);
          if (parsed.judgmentType !== undefined) setJudgmentType(parsed.judgmentType);
          if (parsed.collectStatus !== undefined) setCollectStatus(parsed.collectStatus);
          if (parsed.minFans !== undefined) setMinFans(parsed.minFans);
          if (parsed.maxFans !== undefined) setMaxFans(parsed.maxFans);
          if (parsed.ledgerStatus !== undefined) setLedgerStatus(parsed.ledgerStatus);
          if (parsed.mediaAttrOptions) setMediaAttrOptions(parsed.mediaAttrOptions);
          if (parsed.levelOptions) setLevelOptions(parsed.levelOptions);
          if (parsed.subjectTypes) setSubjectTypes(parsed.subjectTypes);
          if (parsed.subjectTags) setSubjectTags(parsed.subjectTags);
          if (parsed.ledgerTags) setLedgerTags(parsed.ledgerTags);
          if (parsed.isExpandedFilters !== undefined) setIsExpandedFilters(parsed.isExpandedFilters);
          // 规则列表默认不显示，仅点击【台账预览】后展现
          setIsPreviewShown(false);
        }
      } else {
        setIsPreviewShown(false);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  // Calculate selected count for Media Attribute
  const selectedMediaCount = Object.values(mediaAttrOptions).filter(Boolean).length;

  const toggleMediaOption = (key: string) => {
    const updated = { ...mediaAttrOptions, [key]: !mediaAttrOptions[key] };
    setMediaAttrOptions(updated);
    const hasAny = Object.values(updated).some(Boolean);
    setLedgerTags({ ...ledgerTags, media: hasAny });
  };

  const resetMediaOptions = () => {
    const cleared = {
      govPublish: false, newsMedia: false, businessMedia: false, foreignMedia: false, otherMedia: false
    };
    setMediaAttrOptions(cleared);
    setLedgerTags({ ...ledgerTags, media: false });
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // activeDropdownKey will be closed if click outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    const currentSourceTypeName = syncSource === 'local' ? '属地机构的属地台账' : '互联网台账';
    const configData: AutoSyncRuleConfig & { isSaved: boolean } = {
      isSaved: true,
      isEnabled,
      syncSource,
      nameField,
      ledgerName,
      excludeWord,
      platform,
      authType,
      addressMode,
      addressApp,
      isCustomAddressScope,
      personalAddressFields,
      orgAddressFields,
      judgmentType,
      collectStatus,
      minFans,
      maxFans,
      ledgerStatus,
      isExpandedFilters,
      mediaAttrOptions,
      levelOptions,
      subjectTypes,
      subjectTags,
      ledgerTags,
      isPreviewShown
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(configData));
    } catch {
      // ignore
    }

    if (onSaveConfig) {
      onSaveConfig(isEnabled, configData);
    }
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3500);
  };

  // Checkbox Selection & Batch Action Handlers
  const isAllSelected = isPreviewShown && mockSyncData.length > 0 && selectedIds.length === mockSyncData.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < mockSyncData.length;

  const handleToggleSelectAll = () => {
    if (selectedIds.length === mockSyncData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockSyncData.map(item => item.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSingleAddToWhitelist = (item: SyncItem) => {
    setItemActionStatus(prev => ({ ...prev, [item.id]: 'whitelist' }));
    if (onAddToWhitelist) {
      onAddToWhitelist(item);
    }
    showToast(`已成功将【${item.name}】加入白名单！`, 'success');
  };

  const handleSingleAddToBlacklist = (item: SyncItem) => {
    setItemActionStatus(prev => ({ ...prev, [item.id]: 'blacklist' }));
    if (onAddToBlacklist) {
      onAddToBlacklist(item);
    }
    showToast(`已成功将【${item.name}】加入黑名单！`, 'warn');
  };

  const handleBatchRemoveWhitelist = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选需要移出白名单的台账！');
      return;
    }
    const newStatuses: { [id: number]: 'whitelist' | 'blacklist' | null } = {};
    selectedIds.forEach(id => {
      newStatuses[id] = null;
    });
    setItemActionStatus(prev => ({ ...prev, ...(newStatuses as any) }));
    showToast(`已成功将选中的 ${selectedIds.length} 条台账批量移出白名单！`, 'warn');
    setSelectedIds([]);
  };

  const handleBatchAddToWhitelist = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选需要批量加入白名单的台账！');
      return;
    }
    const selectedItems = mockSyncData.filter(i => selectedIds.includes(i.id));
    const newStatuses: { [id: number]: 'whitelist' | 'blacklist' } = {};
    selectedIds.forEach(id => {
      newStatuses[id] = 'whitelist';
    });
    setItemActionStatus(prev => ({ ...prev, ...newStatuses }));

    if (onBatchAddToWhitelist) {
      onBatchAddToWhitelist(selectedItems);
    } else if (onAddToWhitelist) {
      selectedItems.forEach(item => onAddToWhitelist(item));
    }
    showToast(`已成功将选中的 ${selectedIds.length} 条台账批量加入白名单！`, 'success');
    setSelectedIds([]);
  };

  const handleBatchAddToBlacklist = () => {
    if (selectedIds.length === 0) {
      alert('请先勾选需要批量加入黑名单的台账！');
      return;
    }
    const selectedItems = mockSyncData.filter(i => selectedIds.includes(i.id));
    const newStatuses: { [id: number]: 'whitelist' | 'blacklist' } = {};
    selectedIds.forEach(id => {
      newStatuses[id] = 'blacklist';
    });
    setItemActionStatus(prev => ({ ...prev, ...newStatuses }));

    if (onBatchAddToBlacklist) {
      onBatchAddToBlacklist(selectedItems);
    } else if (onAddToBlacklist) {
      selectedItems.forEach(item => onAddToBlacklist(item));
    }
    showToast(`已成功将选中的 ${selectedIds.length} 条台账批量加入黑名单！`, 'warn');
    setSelectedIds([]);
  };

  const currentSourceTypeName = syncSource === 'local' ? '属地机构的属地台账' : '互联网台账';
  const effectiveTipText = tipText || (syncSource === 'local'
    ? '配置同步规则，系统自动从属地机构的属地台账关联对应的台账信息'
    : '配置同步规则，系统自动从互联网台账关联对应的台账信息');

  return (
    <div className="bg-white flex flex-col space-y-4 relative">
      {/* Toast Feedback */}
      {showSaveToast && (
        <div className="fixed top-16 right-8 z-50 bg-gray-900/90 backdrop-blur-xs text-white px-4 py-3 rounded shadow-lg flex items-center space-x-2.5 text-xs animate-fade-in border border-gray-700">
          <i className={`fa-solid ${isEnabled ? 'fa-circle-check text-green-400' : 'fa-circle-exclamation text-amber-400'} text-base`}></i>
          <div>
            <div className="font-semibold text-sm">
              {isEnabled ? `同步规则已保存并开启 (${currentSourceTypeName})` : '同步规则已保存 (已停用)'}
            </div>
            <div className="text-gray-300 text-[11px] mt-0.5">
              {isEnabled
                ? `系统已启用自动同步，正在持续从【${currentSourceTypeName}】中同步符合规则的最新台账。`
                : `自动同步已关闭，台账列表将不再接收新增量数据，现有台账保持不变。`}
            </div>
          </div>
        </div>
      )}

      {/* Action Notification Toast (White/Black list) */}
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

      {/* Top Banner: Auto Sync Switch & Sync Source Radio Options & Info */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-y-2">
        <div className="flex items-center space-x-3.5 flex-wrap gap-y-2">
          <span className="text-xs font-bold text-gray-800">自动同步规则配置</span>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
              isEnabled ? 'bg-[#1677ff]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            ></div>
          </button>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${isEnabled ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
            {isEnabled ? '同步开关：已开启' : '同步开关：未开启'}
          </span>

          {/* Sync Source Radio Options in Top Header Line */}
          {allowSourceSelection && (
            <div className="flex items-center space-x-4 pl-3 border-l border-gray-200 text-xs">
              <label 
                className="flex items-center space-x-1.5 cursor-pointer select-none group"
              >
                <input
                  type="radio"
                  name="syncSourceRadio"
                  value="local"
                  checked={syncSource === 'local'}
                  onChange={() => setSyncSource('local')}
                  className="w-3.5 h-3.5 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                />
                <span className={syncSource === 'local' ? 'text-[#1677ff] font-medium' : 'text-gray-700 group-hover:text-[#1677ff]'}>
                  从属地机构的属地台账中同步
                </span>
              </label>

              <label 
                className="flex items-center space-x-1.5 cursor-pointer select-none group"
              >
                <input
                  type="radio"
                  name="syncSourceRadio"
                  value="internet"
                  checked={syncSource === 'internet'}
                  onChange={() => setSyncSource('internet')}
                  className="w-3.5 h-3.5 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                />
                <span className={syncSource === 'internet' ? 'text-[#1677ff] font-medium' : 'text-gray-700 group-hover:text-[#1677ff]'}>
                  从互联网台账中同步
                </span>
              </label>
            </div>
          )}
        </div>
        
        <span className="text-xs text-gray-500 flex items-center shrink-0">
          <i className="fa-solid fa-circle-info mr-1 text-[#1677ff]"></i> {effectiveTipText}
        </span>
      </div>

      {/* Filter Section (Bordered Card) */}
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
              placeholder="请输入排除词，多个以英..."
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
              <option value="sichuan">四川</option>
              <option value="henan">河南</option>
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
                {/* Backdrop to close popover on outside click */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAddressRangePopover(false)}
                />

                <div className="absolute top-full right-0 mt-2 z-50 w-[380px] bg-white rounded-md shadow-xl border border-gray-200 p-4 text-xs font-sans text-gray-700 animate-in fade-in zoom-in-95">
                  {/* Top Arrow */}
                  <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 pointer-events-none" />

                  {/* Header */}
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
                    /* 默认模式内容 */
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
                    /* 自定义模式内容 */
                    <div className="space-y-3.5 text-xs">
                      <p className="text-gray-400 font-normal">
                        自定义模式下，两组认证类型下均需至少选择一个地址字段。
                      </p>

                      {/* 个人、其他、疑似个人 */}
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

                      {/* 机构、媒体、疑似机构、疑似媒体 */}
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

        {/* Row 3 */}
        <div className="grid grid-cols-4 gap-3">
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
                    const updated: any = {};
                    Object.keys(subjectTypes).forEach(k => updated[k] = val);
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
                    id={`subject-${item.key}`}
                    checked={subjectTypes[item.key]}
                    onChange={e => setSubjectTypes({ ...subjectTypes, [item.key]: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <label htmlFor={`subject-${item.key}`} className="cursor-pointer flex items-center">
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
                    const updated: any = {};
                    Object.keys(subjectTags).forEach(k => updated[k] = val);
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
                    id={`tag-${item.key}`}
                    checked={subjectTags[item.key]}
                    onChange={e => setSubjectTags({ ...subjectTags, [item.key]: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <label htmlFor={`tag-${item.key}`} className="cursor-pointer flex items-center">
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
              
              {/* Indeterminate or checked 全选 */}
              <label className="flex items-center space-x-1 cursor-pointer">
                <div className="w-3.5 h-3.5 bg-[#1677ff] rounded-xs flex items-center justify-center text-white text-[9px]">
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
                  <div className="absolute left-0 top-7 w-56 bg-white border border-[#e8e8e8] shadow-lg rounded-sm p-3 z-50 space-y-2 text-xs animate-in fade-in zoom-in-95 duration-100">
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
                  id="tag-tempHide"
                  checked={ledgerTags.tempHide}
                  onChange={e => setLedgerTags({ ...ledgerTags, tempHide: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="tag-tempHide" className="cursor-pointer flex items-center">
                  <span>暂时屏蔽</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 废弃政务类废弃 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="tag-discardGov"
                  checked={ledgerTags.discardGov}
                  onChange={e => setLedgerTags({ ...ledgerTags, discardGov: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="tag-discardGov" className="cursor-pointer flex items-center">
                  <span>废弃政务类废弃</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 废弃媒体类废弃 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="tag-discardMedia"
                  checked={ledgerTags.discardMedia}
                  onChange={e => setLedgerTags({ ...ledgerTags, discardMedia: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="tag-discardMedia" className="cursor-pointer flex items-center">
                  <span>废弃媒体类废弃</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 无标签 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="tag-noneLedgerTag"
                  checked={ledgerTags.noneLedgerTag}
                  onChange={e => setLedgerTags({ ...ledgerTags, noneLedgerTag: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="tag-noneLedgerTag" className="cursor-pointer">
                  <span>无标签</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Count & Action Buttons Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center space-x-3 text-gray-700">
          <div className="flex items-center space-x-1.5">
            <i className="fa-solid fa-chart-simple text-[#1677ff] text-sm"></i>
            <span>
              (共 <strong className="text-[#1677ff] font-semibold">
                {isPreviewShown ? (syncSource === 'local' ? '152,430' : '1,433,536,120') : '0'}
              </strong> 条台账)
            </span>
          </div>
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

          {/* 台账预览 Button (White BG) */}
          <button
            onClick={() => {
              setIsLoadingPreview(true);
              setTimeout(() => {
                setIsPreviewShown(true);
                setIsLoadingPreview(false);
              }, 250);
            }}
            className="bg-white border border-[#d9d9d9] text-gray-700 px-4 py-1.5 rounded-sm text-xs hover:bg-gray-50 hover:border-[#1677ff] hover:text-[#1677ff] transition-colors cursor-pointer flex items-center"
          >
            {isLoadingPreview ? (
              <i className="fa-solid fa-spinner fa-spin mr-1.5 text-[11px] text-[#1677ff]"></i>
            ) : (
              <i className="fa-solid fa-magnifying-glass mr-1.5 text-[11px] text-gray-500"></i>
            )}
            <span>台账预览</span>
          </button>

          {/* 保存配置 Button (Blue BG) */}
          <button
            onClick={handleSave}
            className="bg-[#1677ff] text-white px-5 py-1.5 rounded-sm text-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center shadow-xs font-medium"
          >
            <i className="fa-solid fa-floppy-disk mr-1.5 text-[11px]"></i>
            <span>保存配置</span>
          </button>
        </div>
      </div>

      {/* Batch Operations Bar (与标注图完全一致) */}
      <div className="flex items-center justify-between bg-[#e6f4ff] border border-[#91caff] px-3.5 py-2 rounded-sm text-xs text-gray-700">
        <div className="flex items-center space-x-1.5">
          <i className="fa-solid fa-circle-info text-[#1677ff]"></i>
          <span>已选择 <strong className="text-[#1677ff] font-semibold">{selectedIds.length}</strong> 项目</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* 批量加入白名单 */}
          <button
            onClick={handleBatchAddToWhitelist}
            className="bg-white border border-[#52c41a] text-[#52c41a] px-3 py-1 rounded-sm text-xs hover:bg-green-50 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-shield-halved mr-1.5 text-[11px]"></i> 批量加入白名单
          </button>
          {/* 批量移出白名单 */}
          <button
            onClick={handleBatchRemoveWhitelist}
            className="bg-white border border-[#fa8c16] text-[#fa8c16] px-3 py-1 rounded-sm text-xs hover:bg-orange-50 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-user-minus mr-1.5 text-[11px]"></i> 批量移出白名单
          </button>
          {/* 批量加入黑名单 */}
          <button
            onClick={handleBatchAddToBlacklist}
            className="bg-white border border-[#ff4d4f] text-[#ff4d4f] px-3 py-1 rounded-sm text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-ban mr-1.5 text-[11px]"></i> 批量加入黑名单
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs table-fixed">
          <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
            <tr>
              <th className="px-1.5 py-2.5 font-normal w-[32px] text-center whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={el => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={handleToggleSelectAll}
                  disabled={!isPreviewShown}
                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                  title="全选 / 反选"
                />
              </th>
              <th className="px-1 py-2.5 font-normal w-[36px] text-center whitespace-nowrap">序号</th>
              <th className="px-2 py-2.5 font-normal w-[16%] whitespace-nowrap">台账信息</th>
              <th className="px-2 py-2.5 font-normal w-[14%] whitespace-nowrap">简介</th>
              <th className="px-1.5 py-2.5 font-normal w-[95px] whitespace-nowrap">认证/研判</th>
              <th className="px-1.5 py-2.5 font-normal w-[100px] whitespace-nowrap">台账标签</th>
              <th className="px-1.5 py-2.5 font-normal w-[105px] whitespace-nowrap">应用地址</th>
              <th className="px-1.5 py-2.5 font-normal w-[14%] whitespace-nowrap">主体名称/类型</th>
              <th className="px-1 py-2.5 font-normal w-[70px] whitespace-nowrap text-right">
                <div className="flex items-center justify-end cursor-pointer">
                  <span>粉丝数</span>
                  <i className="fa-solid fa-sort ml-0.5 text-gray-400 text-[9px]"></i>
                </div>
              </th>
              <th className="px-1 py-2.5 font-normal w-[58px] text-center whitespace-nowrap">采集状态</th>
              <th className="px-1 py-2.5 font-normal w-[52px] text-center whitespace-nowrap">台账状态</th>
              <th className="px-1 py-2.5 font-normal w-[65px] text-center whitespace-nowrap">台账类型</th>
              <th className="px-1.5 py-2.5 font-normal w-[125px] text-center whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8e8]">
            {isPreviewShown ? (
              mockSyncData.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const actionStatus = itemActionStatus[item.id];
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${isSelected ? 'bg-blue-50/40' : 'hover:bg-gray-50/80'}`}
                  >
                    <td className="px-1.5 py-2 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                      />
                    </td>
                    <td className="px-1 py-2 text-center text-gray-500 whitespace-nowrap">{index + 1}</td>
                    <td className="px-2 py-2 overflow-hidden">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-6 h-6 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="font-medium text-[#1677ff] hover:underline cursor-pointer truncate text-xs" title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-[10px] space-y-0.2">
                            <div className="text-gray-400 flex items-center space-x-1 truncate">
                              {item.platformIcon ? (
                                <i className={item.platformIcon}></i>
                              ) : (
                                <i className="fa-solid fa-newspaper text-red-500"></i>
                              )}
                              <span className="truncate">{item.platform}</span>
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
                    <td className="px-1 py-2 font-mono text-gray-800 whitespace-nowrap text-right text-[11px] overflow-hidden truncate" title={String(item.fans)}>
                      {item.fans}
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                      <span className="inline-flex items-center text-gray-500 text-[10px]" title={item.collectStatus}>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1 flex-shrink-0"></span>
                        <span className="truncate">{item.collectStatus}</span>
                      </span>
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                      <span className="text-gray-700 text-[10px] truncate" title={item.ledgerStatus}>{item.ledgerStatus}</span>
                    </td>
                    {/* 台账类型 (显示是否在白名单/黑名单中/自动匹配) */}
                    <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                      {actionStatus === 'whitelist' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-green-50 text-[#52c41a] border border-[#b7eb8f] rounded-xs text-[10px] font-medium">
                          白名单
                        </span>
                      ) : actionStatus === 'blacklist' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-red-50 text-[#ff4d4f] border border-[#ffa39e] rounded-xs text-[10px] font-medium">
                          黑名单
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xs text-[10px] font-medium">
                          自动匹配
                        </span>
                      )}
                    </td>
                    {/* 操作栏 */}
                    <td className="px-1.5 py-2 text-center whitespace-nowrap overflow-hidden">
                      <div className="flex items-center justify-center space-x-1.5 text-xs">
                        {actionStatus === 'whitelist' ? (
                          <button
                            onClick={() => {
                              setItemActionStatus(prev => ({ ...prev, [item.id]: null as any }));
                              showToast(`已将【${item.name}】移出白名单！`, 'warn');
                            }}
                            className="text-[#fa8c16] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                            title="移出白名单"
                          >
                            移出白名单
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSingleAddToWhitelist(item)}
                            className="text-[#52c41a] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                            title="加入白名单"
                          >
                            加入白名单
                          </button>
                        )}

                        {actionStatus === 'blacklist' ? (
                          <button
                            onClick={() => {
                              setItemActionStatus(prev => ({ ...prev, [item.id]: null as any }));
                              showToast(`已将【${item.name}】移出黑名单！`, 'warn');
                            }}
                            className="text-[#fa8c16] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                            title="移出黑名单"
                          >
                            移出黑名单
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSingleAddToBlacklist(item)}
                            className="text-[#ff4d4f] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                            title="加入黑名单"
                          >
                            加入黑名单
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={13} className="py-14 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                    <p className="text-xs text-gray-400">暂无数据，请点击上方「台账预览」按钮获取列表数据</p>
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
