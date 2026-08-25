import React, { useState, useRef, useEffect } from 'react';
import { LedgerItem } from '../mockLedgerData';
import { ConfirmModal } from './ConfirmModal';
import { ExportConfigModal } from './ExportConfigModal';
import { addDownloadTask } from '../data/downloadCenterStore';

interface LocalLedgerViewProps {
  ledgers: LedgerItem[];
  ledgerTypeName?: string;
  onViewDetail: (ledger: LedgerItem) => void;
  onAddToWhitelist: (id: number) => void;
  onRemoveFromWhitelist: (id: number) => void;
  onAddToBlacklist: (id: number) => void;
  onDeleteLedger: (id: number) => void;
  onBatchAddToWhitelist: (ids: number[]) => void;
  onBatchRemoveFromWhitelist: (ids: number[]) => void;
  onBatchAddToBlacklist: (ids: number[]) => void;
  onBatchDelete: (ids: number[]) => void;
  onNavigateToTab?: (tab: any) => void;
  institutionName?: string;
}

export const LocalLedgerView: React.FC<LocalLedgerViewProps> = ({
  ledgers,
  ledgerTypeName = '属地台账',
  onViewDetail,
  onAddToWhitelist,
  onRemoveFromWhitelist,
  onAddToBlacklist,
  onDeleteLedger,
  onBatchAddToWhitelist,
  onBatchRemoveFromWhitelist,
  onBatchAddToBlacklist,
  onBatchDelete,
  onNavigateToTab,
  institutionName
}) => {
  const getSavedSyncRule = () => {
    try {
      const isErrorLedger = ledgerTypeName === '错误表述台账';
      const instName = institutionName || '中共陕西省委网络安全和信息化委员会办公室';
      const keyName = `auto_sync_rule_${instName}_${isErrorLedger ? 'error' : 'standard'}`;
      const stored = localStorage.getItem(keyName);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isSaved) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return {
      isSaved: true,
      isEnabled: true,
      platform: 'toutiao',
      authType: 'agency',
      addressApp: 'sichuan',
      isCustomAddressScope: true,
      personalAddressFields: {
        jurisdiction: true,
        ip: true,
        lastPublish: true,
        regCity: true,
        regionModel: true,
        unconfirmedRegionModel: false,
      },
      orgAddressFields: {
        jurisdiction: true,
        ip: true,
        lastPublish: true,
        regCity: true,
        regionModel: true,
        unconfirmedRegionModel: false,
      },
      judgmentType: 'exact',
      collectStatus: 'collected',
      mediaAttrOptions: { govPublish: true },
      ledgerTags: { media: true }
    };
  };
  const syncRuleData = getSavedSyncRule();
  const [isRuleExpanded, setIsRuleExpanded] = useState(false);

  const buildConditionItems = (rule: any) => {
    if (!rule) return [];
    const items: { label: string; value: string }[] = [];

    const platformMap: { [k: string]: string } = {
      toutiao: '今日头条',
      douyin: '抖音',
      weibo: '新浪微博',
      weixin: '微信公众号',
      website: '网站'
    };
    const authTypeMap: { [k: string]: string } = {
      agency: '机构',
      personal: '个人认证',
      enterprise: '企业认证',
      other: '其他'
    };
    const addressAppMap: { [k: string]: string } = {
      sichuan: '四川',
      henan: '河南',
      shandong: '山东',
      neimenggu: '内蒙古',
      jiangxi: '江西'
    };
    const judgmentTypeMap: { [k: string]: string } = {
      unjudged: '未研判',
      exact: '精准匹配',
      fuzzy: '模糊匹配'
    };
    const collectStatusMap: { [k: string]: string } = {
      uncollected: '未采集',
      collected: '已采集'
    };
    const ledgerStatusMap: { [k: string]: string } = {
      normal: '正常',
      abnormal: '异常'
    };

    if (rule.ledgerName && String(rule.ledgerName).trim()) {
      items.push({
        label: rule.nameField || '包含关键词',
        value: String(rule.ledgerName).trim()
      });
    }

    if (rule.excludeWord && String(rule.excludeWord).trim()) {
      items.push({
        label: '排除词',
        value: String(rule.excludeWord).trim()
      });
    }

    if (rule.platform && String(rule.platform).trim()) {
      const pVal = String(rule.platform).trim();
      items.push({
        label: '平台',
        value: platformMap[pVal] || pVal
      });
    }

    if (rule.authType && String(rule.authType).trim()) {
      const aVal = String(rule.authType).trim();
      items.push({
        label: '认证类型',
        value: authTypeMap[aVal] || aVal
      });
    }

    if (rule.addressApp && String(rule.addressApp).trim()) {
      const addrVal = String(rule.addressApp).trim();
      const cnAddr = addressAppMap[addrVal] || addrVal;
      items.push({
        label: '归属地区',
        value: cnAddr
      });
    }

    const fieldLabelMap: Record<string, string> = {
      jurisdiction: '管辖归属地',
      ip: 'IP属地',
      lastPublish: '最后一天发文地址',
      regCity: '注册城市',
      regionModel: '区域模型地址',
      unconfirmedRegionModel: '待确认区域模型地址',
    };

    let personalFieldsStr = '';
    let orgFieldsStr = '';

    if (rule.isCustomAddressScope) {
      const personalSelected = rule.personalAddressFields
        ? Object.keys(rule.personalAddressFields)
            .filter(k => rule.personalAddressFields[k] && fieldLabelMap[k])
            .map(k => fieldLabelMap[k])
        : [];
      const orgSelected = rule.orgAddressFields
        ? Object.keys(rule.orgAddressFields)
            .filter(k => rule.orgAddressFields[k] && fieldLabelMap[k])
            .map(k => fieldLabelMap[k])
        : [];

      personalFieldsStr = personalSelected.join('、');
      orgFieldsStr = orgSelected.join('、');
    } else {
      personalFieldsStr = 'IP属地、注册城市、区域模型地址、最后一天发文地址、管辖归属地';
      orgFieldsStr = '管辖归属地';
    }

    const addressParts: string[] = [];
    if (personalFieldsStr) {
      addressParts.push(`个人、其他、疑似个人（${personalFieldsStr}）`);
    }
    if (orgFieldsStr) {
      addressParts.push(`机构、媒体、疑似机构、疑似媒体（${orgFieldsStr}）`);
    }

    if (addressParts.length > 0) {
      items.push({
        label: '地址检索范围',
        value: addressParts.join('，')
      });
    }

    if (rule.judgmentType && String(rule.judgmentType).trim()) {
      const jVal = String(rule.judgmentType).trim();
      items.push({
        label: '匹配判定',
        value: judgmentTypeMap[jVal] || jVal
      });
    }

    if (rule.collectStatus && String(rule.collectStatus).trim()) {
      const cVal = String(rule.collectStatus).trim();
      items.push({
        label: '采集状态',
        value: collectStatusMap[cVal] || cVal
      });
    }

    const hasMin = rule.minFans && String(rule.minFans).trim();
    const hasMax = rule.maxFans && String(rule.maxFans).trim();
    if (hasMin || hasMax) {
      items.push({
        label: '粉丝数',
        value: `${rule.minFans || '0'} ~ ${rule.maxFans || '不限'}`
      });
    }

    if (rule.ledgerStatus && String(rule.ledgerStatus).trim()) {
      const lVal = String(rule.ledgerStatus).trim();
      items.push({
        label: '台账状态',
        value: ledgerStatusMap[lVal] || lVal
      });
    }

    if (rule.mediaAttrOptions) {
      const mediaMap: { [k: string]: string } = {
        govPublish: '政务发布',
        newsMedia: '新闻媒体',
        businessMedia: '商业媒体',
        foreignMedia: '驻华外媒',
        otherMedia: '其他媒体'
      };
      const activeMedia = Object.keys(rule.mediaAttrOptions)
        .filter(k => rule.mediaAttrOptions[k] && mediaMap[k])
        .map(k => mediaMap[k]);
      if (activeMedia.length > 0) {
        items.push({
          label: '媒体属性',
          value: activeMedia.join('、')
        });
      }
    }

    if (rule.levelOptions) {
      const levelMap: { [k: string]: string } = {
        province: '省级',
        city: '地市级',
        county: '区县级',
        town: '乡镇级'
      };
      const activeLevel = Object.keys(rule.levelOptions)
        .filter(k => rule.levelOptions[k] && levelMap[k])
        .map(k => levelMap[k]);
      if (activeLevel.length > 0) {
        items.push({
          label: '级别',
          value: activeLevel.join('、')
        });
      }
    }

    if (rule.subjectTypes) {
      const subjectMap: { [k: string]: string } = {
        org: '机关编制', diplomacy: '外交', justice: '司法行政', tourism: '旅游', civil: '民政',
        religion: '宗教', union: '工会', business: '工商', cpc: '党务', housing: '住房城乡建设',
        agriculture: '农业', overseas: '侨联', trade: '贸易促进', culture: '文化', none: '无类型'
      };
      const activeSubjects = Object.keys(rule.subjectTypes)
        .filter(k => rule.subjectTypes[k] && subjectMap[k])
        .map(k => subjectMap[k]);
      if (activeSubjects.length > 0) {
        items.push({
          label: '主体类型',
          value: activeSubjects.join('、')
        });
      }
    }

    if (rule.subjectTags) {
      const tagMap: { [k: string]: string } = {
        edu: '教育类', publicSecurity: '公安', medical: '医疗', noneTag: '无标签'
      };
      const activeTags = Object.keys(rule.subjectTags)
        .filter(k => rule.subjectTags[k] && tagMap[k])
        .map(k => tagMap[k]);
      if (activeTags.length > 0) {
        items.push({
          label: '主体标签',
          value: activeTags.join('、')
        });
      }
    }

    if (rule.ledgerTags) {
      const ledgerTagMap: { [k: string]: string } = {
        media: '媒体属性', level: '级别', tempHide: '暂时屏蔽', discardGov: '废弃政务类废弃', discardMedia: '废弃媒体类废弃', noneLedgerTag: '无标签'
      };
      const activeLedgerTags = Object.keys(rule.ledgerTags)
        .filter(k => rule.ledgerTags[k] && ledgerTagMap[k])
        .map(k => ledgerTagMap[k]);
      if (activeLedgerTags.length > 0) {
        items.push({
          label: '台账标签',
          value: activeLedgerTags.join('、')
        });
      }
    }

    return items;
  };

  const conditionItems = buildConditionItems(syncRuleData);
  // Input and Select filters
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
  const [isCustomAddressScope, setIsCustomAddressScope] = useState(
    syncRuleData?.isCustomAddressScope !== undefined ? syncRuleData.isCustomAddressScope : false
  );
  const [personalAddressFields, setPersonalAddressFields] = useState<Record<string, boolean>>(
    syncRuleData?.personalAddressFields || {
      jurisdiction: true,
      ip: true,
      lastPublish: true,
      regCity: true,
      regionModel: true,
      unconfirmedRegionModel: false,
    }
  );
  const [orgAddressFields, setOrgAddressFields] = useState<Record<string, boolean>>(
    syncRuleData?.orgAddressFields || {
      jurisdiction: true,
      ip: true,
      lastPublish: true,
      regCity: true,
      regionModel: true,
      unconfirmedRegionModel: false,
    }
  );

  // Expand / Collapse state
  const [isExpandedFilters, setIsExpandedFilters] = useState(false);

  // Active Dropdown Popover Key
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal confirmation states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
    confirmText?: string;
    confirmType?: 'primary' | 'danger' | 'warning' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    content: '',
    onConfirm: () => {}
  });

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Checkbox group states: 主体类型
  const [subjectTypes, setSubjectTypes] = useState<{ [key: string]: boolean }>({
    org: false, diplomacy: false, justice: false, tourism: false, civil: false,
    religion: false, union: false, business: false, cpc: false, housing: false,
    agriculture: false, overseas: false, trade: false, culture: false, none: false
  });

  // Checkbox group states: 主体标签
  const [subjectTags, setSubjectTags] = useState<{ [key: string]: boolean }>({
    edu: false, publicSecurity: false, medical: false, noneTag: false
  });

  // Checkbox group states: 台账标签
  const [ledgerTags, setLedgerTags] = useState<{ [key: string]: boolean }>({
    media: true, level: false, tempHide: false, discardGov: false, discardMedia: false, noneLedgerTag: false
  });

  // Sub-option states for dropdowns
  const [mediaAttrOptions, setMediaAttrOptions] = useState<{ [key: string]: boolean }>({
    govPublish: false,
    newsMedia: true,
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

  // Selected row IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Active search query filter state (updated on clicking "查询")
  const [appliedFilters, setAppliedFilters] = useState({
    ledgerName: '',
    excludeWord: '',
    platform: '',
    authType: '',
    judgmentType: '',
    collectStatus: '',
    minFans: '',
    maxFans: '',
    ledgerStatus: ''
  });

  const handleSearch = () => {
    setAppliedFilters({
      ledgerName,
      excludeWord,
      platform,
      authType,
      judgmentType,
      collectStatus,
      minFans,
      maxFans,
      ledgerStatus
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
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
    resetMediaOptions();
    setAppliedFilters({
      ledgerName: '',
      excludeWord: '',
      platform: '',
      authType: '',
      judgmentType: '',
      collectStatus: '',
      minFans: '',
      maxFans: '',
      ledgerStatus: ''
    });
    setCurrentPage(1);
  };

  // Filter ledgers (exclude blacklisted items from this main local ledger page)
  const activeLedgers = ledgers.filter(item => {
    // Exclude blacklisted items entirely from local ledger list
    if (item.category === 'blacklist') return false;

    if (appliedFilters.ledgerName) {
      const matchName = item.name.toLowerCase().includes(appliedFilters.ledgerName.toLowerCase());
      const matchSub = item.subjectName.toLowerCase().includes(appliedFilters.ledgerName.toLowerCase());
      if (!matchName && !matchSub) return false;
    }

    if (appliedFilters.excludeWord) {
      const words = appliedFilters.excludeWord.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      const hasExclude = words.some(w => item.name.toLowerCase().includes(w));
      if (hasExclude) return false;
    }

    if (appliedFilters.platform) {
      const pMap: { [k: string]: string } = {
        weibo: '微博',
        douyin: '抖音',
        weixin: '微信公众号',
        toutiao: '今日头条',
        web: '网站'
      };
      if (item.platform !== pMap[appliedFilters.platform]) return false;
    }

    if (appliedFilters.authType) {
      const aMap: { [k: string]: string } = {
        media: '媒体',
        agency: '机构',
        personal: '个人认证',
        other: '其他'
      };
      if (item.authType !== aMap[appliedFilters.authType]) return false;
    }

    if (appliedFilters.judgmentType) {
      const jMap: { [k: string]: string } = {
        manual: '人工研判',
        exact: '精准匹配',
        fuzzy: '模糊匹配',
        unjudged: '未研判'
      };
      if (item.judgmentType !== jMap[appliedFilters.judgmentType]) return false;
    }

    if (appliedFilters.collectStatus) {
      const cMap: { [k: string]: string } = {
        uncollected: '未采集',
        collected: '已采集'
      };
      if (item.collectStatus !== cMap[appliedFilters.collectStatus]) return false;
    }

    if (appliedFilters.ledgerStatus) {
      const sMap: { [k: string]: string } = {
        normal: '正常',
        abnormal: '异常'
      };
      if (item.ledgerStatus !== sMap[appliedFilters.ledgerStatus]) return false;
    }

    if (appliedFilters.minFans && item.fans < Number(appliedFilters.minFans)) {
      return false;
    }
    if (appliedFilters.maxFans && item.fans > Number(appliedFilters.maxFans)) {
      return false;
    }

    return true;
  });

  // Dynamic statistics linked with query / current active ledgers
  const statCounts = {
    total: activeLedgers.length,
    website: activeLedgers.filter(i => i.platform === '网站').length,
    wechat: activeLedgers.filter(i => i.platform === '微信公众号').length,
    toutiao: activeLedgers.filter(i => i.platform === '今日头条').length,
    douyin: activeLedgers.filter(i => i.platform === '抖音').length,
    weibo: activeLedgers.filter(i => i.platform === '微博').length,
    whitelist: ledgers.filter(i => i.category === 'whitelist').length,
    blacklist: ledgers.filter(i => i.category === 'blacklist').length
  };

  // Pagination calculation
  const totalPages = Math.ceil(activeLedgers.length / pageSize) || 1;
  const pagedLedgers = activeLedgers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(pagedLedgers.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // ---------------- Modal Actions with Confirmations ---------------- //
  const triggerAddToWhitelist = (item: LedgerItem) => {
    setModalConfig({
      isOpen: true,
      title: '确认加入白名单',
      confirmType: 'success',
      confirmText: '确认加入',
      content: (
        <div>
          <p>
            确定要将台账 <strong className="text-gray-900 font-semibold">【{item.name}】</strong> 加入白名单吗？
          </p>
          <div className="mt-2 p-2.5 bg-green-50/80 rounded border border-green-200 text-[#389e0d] text-xs">
            <i className="fa-solid fa-shield-halved mr-1.5"></i>
            加入白名单的账号为客户<strong>重点关注台账</strong>，即使后续该台账地址发生变更不再属于管辖地区，<strong>系统也不会将其自动移出</strong>。
          </div>
        </div>
      ),
      onConfirm: () => {
        onAddToWhitelist(item.id);
        closeModal();
      }
    });
  };

  const triggerRemoveFromWhitelist = (item: LedgerItem) => {
    setModalConfig({
      isOpen: true,
      title: '确认移出白名单',
      confirmType: 'warning',
      confirmText: '确认移出',
      content: (
        <div>
          <p>
            确定要将台账 <strong className="text-gray-900 font-semibold">【{item.name}】</strong> 移出白名单吗？
          </p>
          <p className="mt-1.5 text-gray-500 text-xs">
            移出后将恢复为普通台账，当管辖地址或研判规则发生变更时将按常规规则自动同步或移出。
          </p>
        </div>
      ),
      onConfirm: () => {
        onRemoveFromWhitelist(item.id);
        closeModal();
      }
    });
  };

  const triggerAddToBlacklist = (item: LedgerItem) => {
    setModalConfig({
      isOpen: true,
      title: '确认加入黑名单',
      confirmType: 'danger',
      confirmText: '确认加入黑名单',
      content: (
        <div>
          <p>
            确定要将台账 <strong className="text-gray-900 font-semibold">【{item.name}】</strong> 加入黑名单吗？
          </p>
          <div className="mt-2 p-2.5 bg-red-50/80 rounded border border-red-200 text-[#cf1322] text-xs">
            <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
            加入黑名单后，该台账将<strong>立即从属地台账列表中移除</strong>，并进入「黑名单」页面独立管控。如需恢复，只能在黑名单页面中操作「移出黑名单」。
          </div>
        </div>
      ),
      onConfirm: () => {
        onAddToBlacklist(item.id);
        closeModal();
      }
    });
  };

  const triggerDeleteLedger = (item: LedgerItem) => {
    setModalConfig({
      isOpen: true,
      title: '确认删除台账',
      confirmType: 'danger',
      confirmText: '确认删除',
      content: (
        <div>
          <p>
            确定要彻底删除台账 <strong className="text-gray-900 font-semibold">【{item.name}】</strong> 吗？
          </p>
          <p className="mt-1.5 text-gray-500 text-xs">
            删除后该台账及其历史采集快照将从属地台账库中清除，请谨慎操作。
          </p>
        </div>
      ),
      onConfirm: () => {
        onDeleteLedger(item.id);
        closeModal();
      }
    });
  };

  // Batch Handlers
  const handleBatchAddWhitelist = () => {
    if (selectedIds.length === 0) {
      setModalConfig({
        isOpen: true,
        title: '提示',
        confirmType: 'primary',
        confirmText: '我知道了',
        content: <span>请先勾选需要批量加入白名单的台账。</span>,
        onConfirm: closeModal
      });
      return;
    }
    setModalConfig({
      isOpen: true,
      title: '批量加入白名单',
      confirmType: 'success',
      confirmText: '批量加入',
      content: (
        <div>
          <p>
            确定要将选中的 <strong className="text-green-600 font-semibold">{selectedIds.length}</strong> 项台账加入白名单吗？
          </p>
          <div className="mt-2 p-2.5 bg-green-50/80 rounded border border-green-200 text-[#389e0d] text-xs">
            <i className="fa-solid fa-shield-halved mr-1.5"></i>
            白名单账号将作为重点关注台账进行保护，不受属地变更自动移出影响。
          </div>
        </div>
      ),
      onConfirm: () => {
        onBatchAddToWhitelist(selectedIds);
        setSelectedIds([]);
        closeModal();
      }
    });
  };

  const handleBatchRemoveWhitelist = () => {
    if (selectedIds.length === 0) {
      setModalConfig({
        isOpen: true,
        title: '提示',
        confirmType: 'primary',
        confirmText: '我知道了',
        content: <span>请先勾选需要批量移出白名单的台账。</span>,
        onConfirm: closeModal
      });
      return;
    }
    setModalConfig({
      isOpen: true,
      title: '批量移出白名单',
      confirmType: 'warning',
      confirmText: '批量移出',
      content: (
        <div>
          <p>
            确定要将选中的 <strong className="text-orange-600 font-semibold">{selectedIds.length}</strong> 项台账移出白名单吗？
          </p>
        </div>
      ),
      onConfirm: () => {
        onBatchRemoveFromWhitelist(selectedIds);
        setSelectedIds([]);
        closeModal();
      }
    });
  };

  const handleBatchAddBlacklist = () => {
    if (selectedIds.length === 0) {
      setModalConfig({
        isOpen: true,
        title: '提示',
        confirmType: 'primary',
        confirmText: '我知道了',
        content: <span>请先勾选需要批量加入黑名单的台账。</span>,
        onConfirm: closeModal
      });
      return;
    }
    setModalConfig({
      isOpen: true,
      title: '批量加入黑名单',
      confirmType: 'danger',
      confirmText: '确认批量拉黑',
      content: (
        <div>
          <p>
            确定要将选中的 <strong className="text-red-600 font-semibold">{selectedIds.length}</strong> 项台账加入黑名单吗？
          </p>
          <div className="mt-2 p-2.5 bg-red-50/80 rounded border border-red-200 text-[#cf1322] text-xs">
            <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
            加入黑名单后将从属地台账列表中移除，并进入黑名单页面。
          </div>
        </div>
      ),
      onConfirm: () => {
        onBatchAddToBlacklist(selectedIds);
        setSelectedIds([]);
        closeModal();
      }
    });
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      setModalConfig({
        isOpen: true,
        title: '提示',
        confirmType: 'primary',
        confirmText: '我知道了',
        content: <span>请先勾选需要批量删除的台账。</span>,
        onConfirm: closeModal
      });
      return;
    }
    setModalConfig({
      isOpen: true,
      title: '批量删除台账',
      confirmType: 'danger',
      confirmText: '确认删除',
      content: (
        <div>
          <p>
            确定要删除选中的 <strong className="text-red-600 font-semibold">{selectedIds.length}</strong> 项台账吗？
          </p>
          <p className="mt-1.5 text-gray-500 text-xs">
            此操作不可恢复，删除后数据将从本地台账中清除。
          </p>
        </div>
      ),
      onConfirm: () => {
        onBatchDelete(selectedIds);
        setSelectedIds([]);
        closeModal();
      }
    });
  };

  // Export Configuration Modal & Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'selected' | 'all'>('all');
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const handleOpenExportModal = (mode: 'selected' | 'all') => {
    if (mode === 'selected') {
      if (selectedIds.length === 0) {
        setModalConfig({
          isOpen: true,
          title: '提示',
          confirmType: 'primary',
          confirmText: '我知道了',
          content: <span>请先勾选需要导出的台账。</span>,
          onConfirm: closeModal
        });
        return;
      }
    }
    setExportMode(mode);
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = (selectedFieldNames: string[]) => {
    setIsExportModalOpen(false);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    
    const isSelectedMode = exportMode === 'selected';
    const targetItems = isSelectedMode
      ? activeLedgers.filter(item => selectedIds.includes(item.id))
      : activeLedgers;

    const isErrorLedger = ledgerTypeName === '错误表述台账';
    const typePrefix = isErrorLedger ? '错误表述台账' : '台账';
    const taskTypeName = isSelectedMode ? `${typePrefix}选中导出` : `${typePrefix}一键导出`;
    const fileName = `${taskTypeName}_${timestamp}.xlsx`;

    const records = targetItems.map(item => ({
      name: item.name,
      platform: item.platform,
      homepage: item.detail?.ledgerUrl || `https://weibo.com/u/${item.id}`,
      fans: item.detail?.authInfo?.fansCount || '12.00万',
      authType: item.authType || '机构',
      badge: item.badgeType || '蓝V',
      authDesc: item.detail?.authInfo?.authDesc || item.name,
      summary: item.detail?.authInfo?.summary || item.summary || '发布权威政务信息与便民服务',
      region: item.detail?.jurisdictionLocation || '陕西省/西安市',
      ip: item.detail?.ipLocation || '陕西',
      lastPostLoc: item.detail?.lastPostLocation || '陕西西安',
      regLoc: item.detail?.registeredCity || '陕西西安',
      modelLoc: item.detail?.regionalModelLocation || '陕西省',
      pendingLoc: '-',
      judgmentType: item.judgmentType || '精准匹配',
      subjectName: item.subjectName || '中共陕西省委网络安全和信息化委员会办公室',
      subjectType: item.subjectType || '机关'
    }));

    addDownloadTask({
      fileName,
      taskType: taskTypeName,
      count: isSelectedMode ? selectedIds.length : (activeLedgers.length || 1567),
      status: 'processing',
      operator: '邓东升',
      selectedFields: selectedFieldNames,
      records
    });

    // Navigate to download center
    window.location.hash = '#/download_center';
  };

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownKey(null);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white flex flex-col space-y-4">
      {/* Export Configuration Modal */}
      <ExportConfigModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalCount={exportMode === 'selected' ? selectedIds.length : (activeLedgers.length || 1567)}
        exportMode={exportMode}
        ledgerTypeName={ledgerTypeName}
        onConfirmExport={handleConfirmExport}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        content={modalConfig.content}
        confirmText={modalConfig.confirmText}
        confirmType={modalConfig.confirmType}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />

      {/* 自动同步规则配置条件展示卡片 */}
      {syncRuleData && conditionItems.length > 0 && (
        <div className="bg-[#f0f7ff] border border-[#adc6ff] rounded-sm p-2.5 shadow-2xs flex items-start justify-between gap-3">
          {/* 规则匹配筛选条件明细摘要 - 默认只显示一行，大于一行点击右侧展开按钮 */}
          <div className={`flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600 transition-all ${isRuleExpanded ? 'h-auto' : 'h-[26px] overflow-hidden'}`}>
            <span className="text-[#1677ff] font-medium mr-1 flex items-center space-x-1 flex-shrink-0 h-[24px]">
              <i className="fa-solid fa-arrows-rotate text-xs"></i>
              <span>生效规则条件：</span>
            </span>
            {conditionItems.map((cond, idx) => (
              <span key={idx} className="bg-white border border-[#adc6ff] text-gray-700 px-2 py-0.5 rounded-xs flex items-center space-x-1 shadow-2xs h-[24px] flex-shrink-0">
                <span className="text-gray-500">{cond.label}:</span>
                <span className="text-[#1677ff] font-semibold">{cond.value}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 pt-0.5">
            {conditionItems.length > 3 && (
              <button
                onClick={() => setIsRuleExpanded(!isRuleExpanded)}
                className="text-[#1677ff] hover:text-blue-700 text-xs font-medium cursor-pointer flex items-center space-x-1 bg-white px-2.5 py-1 border border-[#91caff] rounded-xs shadow-2xs transition-all hover:bg-blue-50"
              >
                <span>{isRuleExpanded ? '收起' : `展开 (${conditionItems.length})`}</span>
                <i className={`fa-solid fa-chevron-${isRuleExpanded ? 'up' : 'down'} text-[10px]`}></i>
              </button>
            )}

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('sync')}
                className="text-[#1677ff] hover:text-blue-700 text-xs font-medium cursor-pointer flex items-center space-x-1.5 bg-white px-2.5 py-1 border border-[#91caff] rounded-xs shadow-2xs transition-all hover:bg-blue-50"
                title="点击跳转至自动同步规则配置调整参数"
              >
                <i className="fa-regular fa-pen-to-square text-[11px]"></i>
                <span>跳转调整规则</span>
                <i className="fa-solid fa-angle-right text-[10px]"></i>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 8 Top Stat Cards (Linkable to Whitelist & Blacklist) */}
      <div className="grid grid-cols-8 gap-2.5">
        {/* 台账总数 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 bg-[#00b96b] text-white rounded-xs flex items-center justify-center text-[10px]">
              <i className="fa-solid fa-list-check"></i>
            </div>
            <span className="text-xs text-gray-700">台账总数</span>
          </div>
          <div className="text-base font-bold font-mono text-gray-900 mt-1.5">{statCounts.total.toLocaleString()}</div>
        </div>

        {/* 网站 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 bg-[#1677ff] text-white rounded-xs flex items-center justify-center text-[10px]">
              <i className="fa-solid fa-earth-americas"></i>
            </div>
            <span className="text-xs text-gray-700">网站</span>
          </div>
          <div className="text-base font-bold font-mono text-gray-900 mt-1.5">{statCounts.website.toLocaleString()}</div>
        </div>

        {/* 微信公众号 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 bg-[#52c41a] text-white rounded-xs flex items-center justify-center text-[10px]">
              <i className="fa-brands fa-weixin"></i>
            </div>
            <span className="text-xs text-gray-700">微信公众号</span>
          </div>
          <div className="text-base font-bold font-mono text-gray-900 mt-1.5">{statCounts.wechat.toLocaleString()}</div>
        </div>

        {/* 今日头条 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 bg-[#ff4d4f] text-white rounded-xs flex items-center justify-center text-[10px]">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <span className="text-xs text-gray-700">今日头条</span>
          </div>
          <div className="text-base font-bold font-mono text-gray-900 mt-1.5">{statCounts.toutiao.toLocaleString()}</div>
        </div>

        {/* 抖音 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 bg-black text-white rounded-xs flex items-center justify-center text-[10px]">
              <i className="fa-brands fa-tiktok"></i>
            </div>
            <span className="text-xs text-gray-700">抖音</span>
          </div>
          <div className="text-base font-bold font-mono text-gray-900 mt-1.5">{statCounts.douyin.toLocaleString()}</div>
        </div>

        {/* 新浪微博 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 bg-[#fa8c16] text-white rounded-xs flex items-center justify-center text-[10px]">
              <i className="fa-brands fa-weibo"></i>
            </div>
            <span className="text-xs text-gray-700">新浪微博</span>
          </div>
          <div className="text-base font-bold font-mono text-gray-900 mt-1.5">{statCounts.weibo.toLocaleString()}</div>
        </div>

        {/* 白名单 (Clickable -> Jump to Whitelist tab) */}
        <div 
          onClick={() => onNavigateToTab('whitelist')}
          className="bg-white border border-[#b7eb8f] hover:border-[#52c41a] hover:bg-green-50/40 cursor-pointer rounded-sm p-3 flex flex-col justify-between shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 bg-[#52c41a] text-white rounded-xs flex items-center justify-center text-[10px]">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <span className="text-xs text-gray-700 group-hover:text-[#52c41a] font-medium">白名单</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-400 group-hover:text-[#52c41a]"></i>
          </div>
          <div className="text-base font-bold font-mono text-[#52c41a] mt-1.5">{statCounts.whitelist.toLocaleString()}</div>
        </div>

        {/* 黑名单 (Clickable -> Jump to Blacklist tab) */}
        <div 
          onClick={() => onNavigateToTab('blacklist')}
          className="bg-white border border-[#ffa39e] hover:border-[#ff4d4f] hover:bg-red-50/40 cursor-pointer rounded-sm p-3 flex flex-col justify-between shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 bg-[#ff4d4f] text-white rounded-xs flex items-center justify-center text-[10px]">
                <i className="fa-solid fa-ban"></i>
              </div>
              <span className="text-xs text-gray-700 group-hover:text-[#ff4d4f] font-medium">黑名单</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-400 group-hover:text-[#ff4d4f]"></i>
          </div>
          <div className="text-base font-bold font-mono text-[#ff4d4f] mt-1.5">{statCounts.blacklist.toLocaleString()}</div>
        </div>
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
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">
              排除词
            </span>
            <input
              type="text"
              className="flex-1 px-2.5 py-1.5 border-none outline-none text-gray-800 placeholder-gray-400"
              placeholder="请输入排除词，多个词以英文逗号分隔"
              value={excludeWord}
              onChange={e => setExcludeWord(e.target.value)}
              maxLength={2000}
            />
            <span className="px-2 text-gray-400 text-[11px] font-mono">{excludeWord.length} / 2000</span>
          </div>

          {/* 所属平台 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">
              所属平台
            </span>
            <select
              className="flex-1 px-2.5 py-1.5 bg-transparent border-none outline-none text-gray-700 cursor-pointer appearance-none pr-7"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            >
              <option value="">请选择所属平台</option>
              <option value="weibo">新浪微博</option>
              <option value="douyin">抖音</option>
              <option value="weixin">微信公众号</option>
              <option value="toutiao">今日头条</option>
              <option value="web">网站</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 认证类型 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">
              认证类型
            </span>
            <select
              className="flex-1 px-2.5 py-1.5 bg-transparent border-none outline-none text-gray-700 cursor-pointer appearance-none pr-7"
              value={authType}
              onChange={e => setAuthType(e.target.value)}
            >
              <option value="">请选择认证类型</option>
              <option value="media">媒体</option>
              <option value="agency">机构</option>
              <option value="personal">个人认证</option>
              <option value="other">其他</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 应用地址 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors relative">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">应用地址</span>
            <input
              type="text"
              className="flex-1 px-2.5 py-1.5 border-none outline-none text-gray-800 placeholder-gray-400"
              placeholder="请输入应用地址"
              value={addressApp}
              onChange={e => setAddressApp(e.target.value)}
            />
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
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">
              研判类型
            </span>
            <select
              className="flex-1 px-2.5 py-1.5 bg-transparent border-none outline-none text-gray-700 cursor-pointer appearance-none pr-7"
              value={judgmentType}
              onChange={e => setJudgmentType(e.target.value)}
            >
              <option value="">请选择研判类型</option>
              <option value="manual">人工研判</option>
              <option value="exact">精准匹配</option>
              <option value="fuzzy">模糊匹配</option>
              <option value="unjudged">未研判</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 采集状态 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">
              采集状态
            </span>
            <select
              className="flex-1 px-2.5 py-1.5 bg-transparent border-none outline-none text-gray-700 cursor-pointer appearance-none pr-7"
              value={collectStatus}
              onChange={e => setCollectStatus(e.target.value)}
            >
              <option value="">请选择采集状态</option>
              <option value="collected">已采集</option>
              <option value="uncollected">未采集</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 粉丝数 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">
              粉丝数
            </span>
            <input
              type="number"
              placeholder="最小粉丝数"
              className="w-1/2 px-2 py-1.5 border-none outline-none text-gray-800 text-center"
              value={minFans}
              onChange={e => setMinFans(e.target.value)}
            />
            <span className="text-gray-400 px-1">-</span>
            <input
              type="number"
              placeholder="最大粉丝数"
              className="w-1/2 px-2 py-1.5 border-none outline-none text-gray-800 text-center"
              value={maxFans}
              onChange={e => setMaxFans(e.target.value)}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-4 gap-3 items-center">
          {/* 台账状态 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">
              台账状态
            </span>
            <select
              className="flex-1 px-2.5 py-1.5 bg-transparent border-none outline-none text-gray-700 cursor-pointer appearance-none pr-7"
              value={ledgerStatus}
              onChange={e => setLedgerStatus(e.target.value)}
            >
              <option value="">请选择台账状态</option>
              <option value="normal">正常</option>
              <option value="abnormal">异常</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          <div className="col-span-3 flex items-center justify-end space-x-2">
            <button
              onClick={() => setIsExpandedFilters(!isExpandedFilters)}
              className="text-[#1677ff] hover:text-blue-700 cursor-pointer flex items-center space-x-1 px-2 py-1"
            >
              <span>{isExpandedFilters ? '收起' : '展开'}</span>
              <i className={`fa-solid ${isExpandedFilters ? 'fa-angle-up' : 'fa-angle-down'} text-[10px]`}></i>
            </button>
            <button
              onClick={handleReset}
              className="border border-[#d9d9d9] hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-sm cursor-pointer transition-colors"
            >
              重置
            </button>
            <button
              onClick={handleSearch}
              className="bg-[#1677ff] hover:bg-blue-600 text-white px-5 py-1.5 rounded-sm cursor-pointer shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
              <span>查询</span>
            </button>
          </div>
        </div>

        {/* Collapsible Extended Checkboxes Section */}
        {isExpandedFilters && (
          <div className="pt-3 border-t border-[#f0f0f0] space-y-2.5 text-xs">
            {/* 主体类型 Checkbox Grid */}
            <div className="flex items-start">
              <span className="w-16 pt-0.5 text-gray-500 flex-shrink-0">主体类型</span>
              <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1.5 text-gray-700">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.org}
                    onChange={e => setSubjectTypes({ ...subjectTypes, org: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>机构</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.diplomacy}
                    onChange={e => setSubjectTypes({ ...subjectTypes, diplomacy: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>外交外事</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.justice}
                    onChange={e => setSubjectTypes({ ...subjectTypes, justice: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>司法</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.tourism}
                    onChange={e => setSubjectTypes({ ...subjectTypes, tourism: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>旅游</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.civil}
                    onChange={e => setSubjectTypes({ ...subjectTypes, civil: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>民政</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.religion}
                    onChange={e => setSubjectTypes({ ...subjectTypes, religion: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>宗教</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.union}
                    onChange={e => setSubjectTypes({ ...subjectTypes, union: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>工会</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.business}
                    onChange={e => setSubjectTypes({ ...subjectTypes, business: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>工商</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.cpc}
                    onChange={e => setSubjectTypes({ ...subjectTypes, cpc: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>党团组织</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.housing}
                    onChange={e => setSubjectTypes({ ...subjectTypes, housing: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>房管</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.agriculture}
                    onChange={e => setSubjectTypes({ ...subjectTypes, agriculture: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>农业</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.overseas}
                    onChange={e => setSubjectTypes({ ...subjectTypes, overseas: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>侨务</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.trade}
                    onChange={e => setSubjectTypes({ ...subjectTypes, trade: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>外贸</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTypes.culture}
                    onChange={e => setSubjectTypes({ ...subjectTypes, culture: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>文化</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer text-gray-500">
                  <input
                    type="checkbox"
                    checked={subjectTypes.none}
                    onChange={e => setSubjectTypes({ ...subjectTypes, none: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>无</span>
                </label>
              </div>
            </div>

            {/* 主体标签 Checkbox Grid */}
            <div className="flex items-start">
              <span className="w-16 pt-0.5 text-gray-500 flex-shrink-0">主体标签</span>
              <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1.5 text-gray-700">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTags.edu}
                    onChange={e => setSubjectTags({ ...subjectTags, edu: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>教育</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTags.publicSecurity}
                    onChange={e => setSubjectTags({ ...subjectTags, publicSecurity: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>公安</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subjectTags.medical}
                    onChange={e => setSubjectTags({ ...subjectTags, medical: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>卫健</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer text-gray-500">
                  <input
                    type="checkbox"
                    checked={subjectTags.noneTag}
                    onChange={e => setSubjectTags({ ...subjectTags, noneTag: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>无</span>
                </label>
              </div>
            </div>

            {/* 台账标签 Checkbox Grid + Dropdown Popover */}
            <div className="flex items-start" ref={dropdownRef}>
              <span className="w-16 pt-0.5 text-gray-500 flex-shrink-0">台账标签</span>
              <div className="flex-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-gray-700 relative">
                {/* 媒体属性 (with Dropdown) */}
                <div className="relative inline-flex items-center">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ledgerTags.media}
                      onChange={e => {
                        const checked = e.target.checked;
                        setLedgerTags({ ...ledgerTags, media: checked });
                        if (!checked) {
                          resetMediaOptions();
                        } else {
                          setMediaAttrOptions(prev => ({ ...prev, newsMedia: true }));
                        }
                      }}
                      className="rounded border-gray-300 text-[#1677ff]"
                    />
                    <span>媒体属性</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveDropdownKey(activeDropdownKey === 'media' ? null : 'media')}
                    className="ml-1 text-gray-400 hover:text-[#1677ff] p-0.5 cursor-pointer bg-transparent border-none"
                  >
                    <i className="fa-solid fa-angle-down text-[10px]"></i>
                  </button>

                  {/* Dropdown Menu for 媒体属性 */}
                  {activeDropdownKey === 'media' && (
                    <div className="absolute top-6 left-0 z-30 bg-white border border-[#d9d9d9] shadow-lg rounded-sm p-3 w-56 space-y-2 text-xs">
                      <div className="font-medium text-gray-800 border-b border-gray-100 pb-1.5 flex justify-between items-center">
                        <span>选择媒体子属性</span>
                        <span className="text-[11px] text-gray-400 font-normal">已选 {selectedMediaCount} 项</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={mediaAttrOptions.govPublish}
                            onChange={() => toggleMediaOption('govPublish')}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>政务发布</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={mediaAttrOptions.newsMedia}
                            onChange={() => toggleMediaOption('newsMedia')}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>新闻媒体</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={mediaAttrOptions.businessMedia}
                            onChange={() => toggleMediaOption('businessMedia')}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>商业媒体</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={mediaAttrOptions.foreignMedia}
                            onChange={() => toggleMediaOption('foreignMedia')}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>境外媒体</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={mediaAttrOptions.otherMedia}
                            onChange={() => toggleMediaOption('otherMedia')}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>其他媒体</span>
                        </label>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => setActiveDropdownKey(null)}
                          className="bg-[#1677ff] text-white px-2.5 py-1 rounded text-[11px] hover:bg-blue-600 cursor-pointer"
                        >
                          完成
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 级别 (with Dropdown) */}
                <div className="relative inline-flex items-center">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ledgerTags.level}
                      onChange={e => setLedgerTags({ ...ledgerTags, level: e.target.checked })}
                      className="rounded border-gray-300 text-[#1677ff]"
                    />
                    <span>级别</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveDropdownKey(activeDropdownKey === 'level' ? null : 'level')}
                    className="ml-1 text-gray-400 hover:text-[#1677ff] p-0.5 cursor-pointer bg-transparent border-none"
                  >
                    <i className="fa-solid fa-angle-down text-[10px]"></i>
                  </button>

                  {/* Dropdown Menu for 级别 */}
                  {activeDropdownKey === 'level' && (
                    <div className="absolute top-6 left-0 z-30 bg-white border border-[#d9d9d9] shadow-lg rounded-sm p-3 w-48 space-y-2 text-xs">
                      <div className="font-medium text-gray-800 border-b border-gray-100 pb-1.5">
                        <span>选择级别</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={levelOptions.province}
                            onChange={() => setLevelOptions({ ...levelOptions, province: !levelOptions.province })}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>省级</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={levelOptions.city}
                            onChange={() => setLevelOptions({ ...levelOptions, city: !levelOptions.city })}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>市级</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={levelOptions.county}
                            onChange={() => setLevelOptions({ ...levelOptions, county: !levelOptions.county })}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>区县级</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={levelOptions.town}
                            onChange={() => setLevelOptions({ ...levelOptions, town: !levelOptions.town })}
                            className="rounded border-gray-300 text-[#1677ff]"
                          />
                          <span>乡镇街道</span>
                        </label>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => setActiveDropdownKey(null)}
                          className="bg-[#1677ff] text-white px-2.5 py-1 rounded text-[11px] hover:bg-blue-600 cursor-pointer"
                        >
                          完成
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ledgerTags.tempHide}
                    onChange={e => setLedgerTags({ ...ledgerTags, tempHide: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>临时隐藏</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ledgerTags.discardGov}
                    onChange={e => setLedgerTags({ ...ledgerTags, discardGov: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>废弃政务</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ledgerTags.discardMedia}
                    onChange={e => setLedgerTags({ ...ledgerTags, discardMedia: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>废弃媒体</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer text-gray-500">
                  <input
                    type="checkbox"
                    checked={ledgerTags.noneLedgerTag}
                    onChange={e => setLedgerTags({ ...ledgerTags, noneLedgerTag: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <span>无</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batch Operations Bar */}
      <div className="flex items-center justify-between bg-[#e6f4ff] border border-[#91caff] px-3.5 py-2 rounded-sm text-xs text-gray-700">
        <div className="flex items-center space-x-1.5">
          <i className="fa-solid fa-circle-info text-[#1677ff]"></i>
          <span>已选择 <strong className="text-[#1677ff] font-semibold">{selectedIds.length}</strong> 项目</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* 批量加入白名单 */}
          <button
            onClick={handleBatchAddWhitelist}
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
            onClick={handleBatchAddBlacklist}
            className="bg-white border border-[#ff4d4f] text-[#ff4d4f] px-3 py-1 rounded-sm text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-ban mr-1.5 text-[11px]"></i> 批量加入黑名单
          </button>
          {/* 导出按钮 Dropdown */}
          <div className="relative inline-block" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(prev => !prev)}
              className="bg-white border border-[#1677ff] text-[#1677ff] px-3 py-1 rounded-sm text-xs hover:bg-blue-50 transition-colors cursor-pointer flex items-center shadow-2xs"
            >
              <i className="fa-solid fa-arrow-down-to-line mr-1.5 text-[11px]"></i>
              <span>导出</span>
              <i className={`fa-solid fa-angle-down ml-1.5 text-[10px] transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded shadow-lg border border-gray-100 py-1 z-30 animate-fade-in text-xs">
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handleOpenExportModal('selected');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#e6f4ff] hover:text-[#1677ff] text-gray-700 transition-colors cursor-pointer flex items-center"
                >
                  <i className="fa-regular fa-square-check mr-1.5 text-[10px] text-gray-400"></i>
                  <span>导出选中项</span>
                </button>
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handleOpenExportModal('all');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#e6f4ff] hover:text-[#1677ff] text-gray-700 transition-colors cursor-pointer flex items-center"
                >
                  <i className="fa-solid fa-list-check mr-1.5 text-[10px] text-gray-400"></i>
                  <span>一键导出全部</span>
                </button>
              </div>
            )}
          </div>
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
                  checked={pagedLedgers.length > 0 && selectedIds.length === pagedLedgers.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                />
              </th>
              <th className="px-1 py-2.5 font-normal w-[36px] text-center whitespace-nowrap">序号</th>
              <th className="px-2 py-2.5 font-normal w-[13%] whitespace-nowrap">台账名称</th>
              <th className="px-1.5 py-2.5 font-normal w-[12%] whitespace-nowrap">主体名称/类型</th>
              <th className="px-2 py-2.5 font-normal w-[15%] whitespace-nowrap">URL地址/简介</th>
              <th className="px-1.5 py-2.5 font-normal w-[92px] whitespace-nowrap">认证/研判</th>
              <th className="px-1.5 py-2.5 font-normal w-[95px] whitespace-nowrap">台账标签</th>
              <th className="px-1.5 py-2.5 font-normal w-[100px] whitespace-nowrap">应用地址</th>
              <th className="px-1 py-2.5 font-normal w-[65px] whitespace-nowrap text-right">
                <div className="flex items-center justify-end cursor-pointer">
                  <span>粉丝数</span>
                  <i className="fa-solid fa-sort ml-1 text-gray-400 text-[10px]"></i>
                </div>
              </th>
              <th className="px-1 py-2.5 font-normal w-[58px] text-center whitespace-nowrap">采集状态</th>
              <th className="px-1 py-2.5 font-normal w-[52px] text-center whitespace-nowrap">台账状态</th>
              <th className="px-1 py-2.5 font-normal w-[58px] text-center whitespace-nowrap">台账来源</th>
              <th className="px-1 py-2.5 font-normal w-[55px] text-center whitespace-nowrap">台账类型</th>
              <th className="px-2 py-2.5 font-normal w-[140px] text-center whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8e8]">
            {pagedLedgers.length > 0 ? (
              pagedLedgers.map((item, idx) => {
                let rawUrl = item.detail?.ledgerUrl;
                if (!rawUrl || rawUrl === '-') {
                  if (item.platform === '微博') rawUrl = `https://weibo.com/u/${1672519560 + item.id}`;
                  else if (item.platform === '网站') rawUrl = `https://www.site${item.id}.gov.cn`;
                  else if (item.platform === '今日头条') rawUrl = `https://www.toutiao.com/c/user/token/TT_${item.id}`;
                  else if (item.platform === '抖音') rawUrl = `https://www.douyin.com/user/DY_${item.id}`;
                  else if (item.platform === '微信公众号') rawUrl = `https://mp.weixin.qq.com/s/gh_${item.id}`;
                  else rawUrl = `https://www.example.com/ledger/${item.id}`;
                }
                const hrefUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
                const introText = item.intro || item.detail?.authInfo?.summary || `${item.name}官方账号，发布权威政务信息与服务动态。`;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-1.5 py-2 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectOne(item.id)}
                        className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                      />
                    </td>
                    <td className="px-1 py-2 text-gray-500 text-center whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-2 py-2 overflow-hidden">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
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
                          <div
                            onClick={() => onViewDetail(item)}
                            className="font-medium text-[#1677ff] hover:underline cursor-pointer truncate text-xs"
                            title={`点击查看详情：${item.name}`}
                          >
                            {item.name}
                          </div>
                          <div className="text-[10px] space-y-0.2">
                            <div className="text-gray-400 truncate">{item.platformBadge || item.platform}</div>
                            <div
                              className="text-gray-500 truncate"
                              title={item.authDesc || item.detail?.authInfo?.authDesc || item.subjectName}
                            >
                              {item.authDesc || item.detail?.authInfo?.authDesc || item.subjectName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* 主体名称/类型 (调整到台账名称后面) */}
                    <td className="px-1.5 py-2 text-gray-600 overflow-hidden">
                      <div className="space-y-0.2 min-w-0">
                        <div className="text-gray-800 truncate text-xs font-normal" title={item.subjectName}>{item.subjectName}</div>
                        <div className="text-[10px] text-gray-400 truncate" title={item.subjectType}>{item.subjectType}</div>
                      </div>
                    </td>
                    {/* URL地址/简介 (简介上方增加URL地址，并可点击跳转) */}
                    <td className="px-2 py-2 text-gray-600 overflow-hidden">
                      <div className="min-w-0 space-y-0.5">
                        <a
                          href={hrefUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#1677ff] hover:underline font-mono text-[11px] truncate block leading-tight"
                          title={`点击跳转主页/地址：${rawUrl}`}
                        >
                          {rawUrl}
                        </a>
                        <div
                          className="text-[11px] text-gray-500 line-clamp-2 leading-tight"
                          title={introText}
                        >
                          {introText}
                        </div>
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
                        {item.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
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
                        {item.addresses.slice(0, 2).map((addr, aIdx) => (
                          <div key={aIdx} className="flex items-center text-[10px] text-gray-600 min-w-0" title={addr.text}>
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
                  <td className="px-1 py-2 font-mono text-gray-800 whitespace-nowrap text-right text-[11px] overflow-hidden truncate" title={item.fansDisplay}>
                    {item.fansDisplay}
                  </td>
                  <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                    <span className="inline-flex items-center text-gray-500 text-[10px]" title={item.collectStatus}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0 ${item.collectStatus === '已采集' ? 'bg-[#52c41a]' : 'bg-gray-400'}`}></span>
                      <span className="truncate">{item.collectStatus}</span>
                    </span>
                  </td>
                  <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                    <span className="text-gray-700 text-[10px] truncate" title={item.ledgerStatus}>{item.ledgerStatus}</span>
                  </td>
                  {/* 台账来源 */}
                  <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                    <span className="px-1 py-0.2 bg-blue-50 text-[#1677ff] text-[10px] rounded-xs border border-blue-200 whitespace-nowrap truncate inline-block" title={item.source}>
                      {item.source}
                    </span>
                  </td>
                  {/* 台账类型 */}
                  <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                    {item.category === 'whitelist' ? (
                      <span className="px-1 py-0.2 bg-green-50 text-[#52c41a] text-[10px] rounded-xs border border-green-200 font-medium whitespace-nowrap inline-block">
                        白名单
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  {/* 操作栏 */}
                  <td className="px-1.5 py-2 text-center whitespace-nowrap overflow-hidden">
                    <div className="flex items-center justify-center space-x-1.5 text-xs">
                      {item.category === 'whitelist' ? (
                        <button
                          onClick={() => triggerRemoveFromWhitelist(item)}
                          className="text-[#fa8c16] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                          title="移出白名单"
                        >
                          移出白名单
                        </button>
                      ) : (
                        <button
                          onClick={() => triggerAddToWhitelist(item)}
                          className="text-[#52c41a] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                          title="加入白名单"
                        >
                          加入白名单
                        </button>
                      )}

                      <button
                        onClick={() => triggerAddToBlacklist(item)}
                        className="text-[#ff4d4f] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                        title="加入黑名单"
                      >
                        加入黑名单
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={14} className="py-14 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400">
                      <i className="fa-regular fa-folder-open"></i>
                    </div>
                    {ledgers.length === 0 ? (
                      <>
                        <p className="text-xs text-gray-600 font-medium">当前机构暂无{ledgerTypeName}数据</p>
                        <p className="text-[11px] text-gray-400 max-w-md">
                          新开机构默认无台账，可通过「自动同步规则配置」开启同步，或通过「批量导入台账」/「手动添加台账」添加
                        </p>
                        {onNavigateToTab && (
                          <div className="flex items-center space-x-3 pt-1 text-xs">
                            <button
                              onClick={() => onNavigateToTab('sync')}
                              className="text-[#1677ff] hover:underline cursor-pointer flex items-center space-x-1"
                            >
                              <i className="fa-solid fa-gear text-[11px]"></i>
                              <span>前往配置自动同步</span>
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => onNavigateToTab('import')}
                              className="text-[#1677ff] hover:underline cursor-pointer flex items-center space-x-1"
                            >
                              <i className="fa-solid fa-file-import text-[11px]"></i>
                              <span>批量导入台账</span>
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => onNavigateToTab('manual')}
                              className="text-[#1677ff] hover:underline cursor-pointer flex items-center space-x-1"
                            >
                              <i className="fa-solid fa-plus text-[11px]"></i>
                              <span>手动添加台账</span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">暂无符合当前筛选条件的{ledgerTypeName}数据，请调整筛选条件</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1 py-1">
        <span>共 {activeLedgers.length} 条数据，每页 {pageSize} 条</span>
        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-2.5 py-1 border border-[#d9d9d9] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
          >
            上一页
          </button>
          <span className="px-3 py-1 font-mono text-[#1677ff] bg-blue-50 border border-blue-200 rounded-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-2.5 py-1 border border-[#d9d9d9] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};
