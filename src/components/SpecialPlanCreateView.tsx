import React, { useState, useMemo } from 'react';
import { initialMockLedgers, LedgerItem } from '../mockLedgerData';
import { PlanItem } from './SpecialPlanView';
import { Tab2DataSourceView } from './Tab2DataSourceView';
import { Tab1ActionLedgersView } from './Tab1ActionLedgersView';
import { Tab3BlacklistView } from './Tab3BlacklistView';
import { InstitutionSearchSelect, ALL_INSTITUTIONS_DATABASE } from './InstitutionSearchSelect';
import { Step3KeywordConfigView, Mode2GroupItem } from './Step3KeywordConfigView';

export interface InstitutionLedgerScopeConfig {
  institutionName: string;
  activeTab: 'tab1' | 'tab2' | 'tab3';
  tab1Ledgers: (LedgerItem & { importSource: '属地导入' | '手动追加' })[];
  tab3Blacklist: (LedgerItem & { importSource: '属地导入' | '手动追加'; blacklistReason?: string })[];
  // Tab2 query state
  tab2Filter: {
    nameOrId: string;
    platform: string;
    authType: string;
    address: string;
    judgmentType: string;
    collectStatus: string;
    fansMin: string;
    fansMax: string;
    subjectName: string;
  };
  tab2Results: LedgerItem[];
  tab2SelectedIds: number[];
  tab1SearchText: string;
  tab1PlatformFilter: string;
  tab1SourceFilter: string;
  tab1GlobalStatusFilter: string;
  tab1SelectedIds: number[];
  tab3SearchText: string;
  tab3SelectedIds: number[];
}

export interface SpecialPlanCreateViewProps {
  initialPlan?: PlanItem | null;
  onBack: () => void;
  onSavePlan: (newPlan: PlanItem) => void;
}

// Available institutions for selection
export const AVAILABLE_INSTITUTIONS = ALL_INSTITUTIONS_DATABASE;

export const SpecialPlanCreateView: React.FC<SpecialPlanCreateViewProps> = ({
  initialPlan,
  onBack,
  onSavePlan,
}) => {
  // Current Step: 1 | 2 | 3 | 'preview'
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 'preview'>(1);

  // ----------------------------------------------------
  // Step 1: 基础信息 State
  // ----------------------------------------------------
  const [actionType, setActionType] = useState<'机构行动' | '统一行动'>(
    initialPlan?.type || '机构行动'
  );
  const [singleInstitution, setSingleInstitution] = useState<string>(
    initialPlan?.institution?.split(/、|,|;/)[0] || AVAILABLE_INSTITUTIONS[0]
  );
  const [multipleInstitutions, setMultipleInstitutions] = useState<string[]>(
    initialPlan?.type === '统一行动' && initialPlan.institution
      ? initialPlan.institution.split(/、|,|;/).map(s => s.trim()).filter(Boolean)
      : [AVAILABLE_INSTITUTIONS[0], AVAILABLE_INSTITUTIONS[1]]
  );
  const [planName, setPlanName] = useState<string>(initialPlan?.name || '');
  const [inspectType, setInspectType] = useState<'快速排查' | '深度排查'>(
    initialPlan?.inspectType || '快速排查'
  );
  const [startDate, setStartDate] = useState<string>(
    initialPlan?.startDate || '2026-08-01'
  );

  // ----------------------------------------------------
  // Step 2: 台账范围 State
  // ----------------------------------------------------
  // 二选一模式：'custom' (自定义台账集合) | 'nationwide' (全国范围台账)
  const [scopeMode, setScopeMode] = useState<'custom' | 'nationwide'>(
    initialPlan?.scope === '全国范围' ? 'nationwide' : 'custom'
  );

  // Helper to build initial ledger config for an institution
  const createInitialInstConfig = (instName: string): InstitutionLedgerScopeConfig => {
    // If editing and matching, seed with initial items
    let initialTab1: (LedgerItem & { importSource: '属地导入' | '手动追加' })[] = [];
    if (initialPlan && initialPlan.institution?.includes(instName)) {
      initialTab1 = initialMockLedgers.slice(0, 6).map((item, idx) => ({
        ...item,
        importSource: idx % 2 === 0 ? '属地导入' : '手动追加',
      }));
    }

    return {
      institutionName: instName,
      activeTab: 'tab1',
      tab1Ledgers: initialTab1,
      tab3Blacklist: [],
      tab2Filter: {
        nameOrId: '',
        platform: '全部',
        authType: '全部',
        address: '',
        judgmentType: '全部',
        collectStatus: '全部',
        fansMin: '',
        fansMax: '',
        subjectName: '',
      },
      tab2Results: [],
      tab2SelectedIds: [],
      tab1SearchText: '',
      tab1PlatformFilter: '全部',
      tab1SourceFilter: '全部',
      tab1GlobalStatusFilter: '全部',
      tab1SelectedIds: [],
      tab3SearchText: '',
      tab3SelectedIds: [],
    };
  };

  // Map of institution configurations
  const [instConfigs, setInstConfigs] = useState<{ [instName: string]: InstitutionLedgerScopeConfig }>(() => {
    const map: { [key: string]: InstitutionLedgerScopeConfig } = {};
    AVAILABLE_INSTITUTIONS.forEach(inst => {
      map[inst] = createInitialInstConfig(inst);
    });
    return map;
  });

  // Active institution tab for unified action mode
  const [activeInstTab, setActiveInstTab] = useState<string>(AVAILABLE_INSTITUTIONS[0]);

  // Current active institution name based on actionType
  const currentInstName = useMemo(() => {
    if (actionType === '机构行动') {
      return singleInstitution;
    }
    return activeInstTab;
  }, [actionType, singleInstitution, activeInstTab]);

  // Current active institution's ledger configuration
  const currentInstConfig: InstitutionLedgerScopeConfig = useMemo(() => {
    if (instConfigs[currentInstName]) {
      return instConfigs[currentInstName];
    }
    return createInitialInstConfig(currentInstName);
  }, [instConfigs, currentInstName]);

  // Helper to update active institution config
  const updateCurrentInstConfig = (
    updater: (prev: InstitutionLedgerScopeConfig) => Partial<InstitutionLedgerScopeConfig>
  ) => {
    setInstConfigs(prev => {
      const current = prev[currentInstName] || createInitialInstConfig(currentInstName);
      const updated = { ...current, ...updater(current) };
      return {
        ...prev,
        [currentInstName]: updated,
      };
    });
  };

  // ----------------------------------------------------
  // Step 3: 关键词 State (整套行动共用)
  // ----------------------------------------------------
  const [activeKeywordMode, setActiveKeywordMode] = useState<'mode1' | 'mode2'>('mode1');
  const [mode1Groups, setMode1Groups] = useState<string[][]>(() => {
    if (initialPlan?.keywords && initialPlan.keywords.length > 0) {
      return initialPlan.keywords;
    }
    return [['陕西省', '西安市', '雁塔区'], []];
  });

  const [mode2Groups, setMode2Groups] = useState<Mode2GroupItem[]>([
    {
      id: 'group_1',
      main: ['判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网'],
      sub: ['判决书', '新闻网'],
      secondary: ['判决书', '新闻网'],
    },
    {
      id: 'group_2',
      main: ['判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网', '判决书', '新闻网'],
      sub: ['判决书', '新闻网'],
      secondary: [],
    },
  ]);

  const [excludeKeywords, setExcludeKeywords] = useState<string[]>(() => {
    if (initialPlan?.excludeKeywords && initialPlan.excludeKeywords.length > 0) {
      return initialPlan.excludeKeywords;
    }
    return ['招聘', '二手转让', '商业广告'];
  });

  const [ignoreKeywords, setIgnoreKeywords] = useState<string[]>(() => {
    if (initialPlan?.ignoreKeywords && initialPlan.ignoreKeywords.length > 0) {
      return initialPlan.ignoreKeywords;
    }
    return ['会议纪要', '常规简报'];
  });

  // ----------------------------------------------------
  // UI Dialogs & Toast State
  // ----------------------------------------------------
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Exit Confirm Modal
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  // Reset Base Benchmark Confirm Modal
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Import to Tab1 Confirm Modal
  const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);

  // Direct Blacklist Confirm Modal
  const [showDirectBlacklistConfirmModal, setShowDirectBlacklistConfirmModal] = useState(false);

  // 预览聚焦关键词组 (用于 Step 3 左右分栏数据预览)
  const [selectedPreviewGroup, setSelectedPreviewGroup] = useState<{
    name: string;
    keywords: string[];
  } | null>(null);

  // ----------------------------------------------------
  // Step 1 Validation & Handlers
  // ----------------------------------------------------
  const handleValidateStep1 = (): boolean => {
    if (!planName.trim()) {
      showToast('请输入行动名称');
      return false;
    }
    if (actionType === '机构行动' && !singleInstitution) {
      showToast('请选择所属机构');
      return false;
    }
    if (actionType === '统一行动' && multipleInstitutions.length === 0) {
      showToast('统一行动请至少选择一个机构');
      return false;
    }
    if (!startDate) {
      showToast('请选择开始日期');
      return false;
    }
    return true;
  };

  const handleNextFromStep1 = () => {
    if (!handleValidateStep1()) return;

    // Ensure active institution tab is valid for unified action
    if (actionType === '统一行动') {
      if (!multipleInstitutions.includes(activeInstTab)) {
        setActiveInstTab(multipleInstitutions[0]);
      }
    }
    setCurrentStep(2);
  };

  // ----------------------------------------------------
  // Step 2: Tab2 Actions (一键勾选属地、查询、导入、加入黑名单)
  // ----------------------------------------------------
  // 1. 一键勾选本机构属地台账
  const handleOneClickSelectLocalLedgers = () => {
    // Determine matching ledgers based on institution name
    const queryTag = currentInstName.includes('陕西')
      ? '陕西'
      : currentInstName.includes('洛阳')
      ? '河南'
      : currentInstName.includes('阳泉')
      ? '山西'
      : '本地';

    const matched = initialMockLedgers.filter(
      item =>
        item.subjectName.includes(queryTag) ||
        item.name.includes(queryTag) ||
        item.addresses.some(a => a.text.includes(queryTag))
    );

    // Fallback if matched is small
    const finalResults = matched.length >= 8 ? matched : initialMockLedgers.slice(0, 15);
    const selectedIds = finalResults.map(item => item.id);

    updateCurrentInstConfig(() => ({
      tab2Results: finalResults,
      tab2SelectedIds: selectedIds,
    }));

    showToast(`已成功运算并勾选【${currentInstName}】属地台账共 ${finalResults.length} 条（含系统白名单台账）`);
  };

  // 2. 自由筛选查询
  const handleQueryTab2 = () => {
    const filter = currentInstConfig.tab2Filter;
    const results = initialMockLedgers.filter(item => {
      if (filter.nameOrId && !item.name.includes(filter.nameOrId) && !String(item.id).includes(filter.nameOrId)) {
        return false;
      }
      if (filter.platform && filter.platform !== '全部' && item.platform !== filter.platform) {
        return false;
      }
      if (filter.authType && filter.authType !== '全部' && item.authType !== filter.authType) {
        return false;
      }
      if (filter.judgmentType && filter.judgmentType !== '全部' && item.judgmentType !== filter.judgmentType) {
        return false;
      }
      if (filter.collectStatus && filter.collectStatus !== '全部' && item.collectStatus !== filter.collectStatus) {
        return false;
      }
      if (filter.subjectName && !item.subjectName.includes(filter.subjectName)) {
        return false;
      }
      if (filter.address && !item.addresses.some(a => a.text.includes(filter.address))) {
        return false;
      }
      return true;
    });

    updateCurrentInstConfig(() => ({
      tab2Results: results,
      tab2SelectedIds: [],
    }));

    showToast(`查询完成，找到 ${results.length} 条台账记录`);
  };

  // Reset Tab2 filters
  const handleResetTab2Filter = () => {
    updateCurrentInstConfig(() => ({
      tab2Filter: {
        nameOrId: '',
        platform: '全部',
        authType: '全部',
        address: '',
        judgmentType: '全部',
        collectStatus: '全部',
        fansMin: '',
        fansMax: '',
        subjectName: '',
      },
      tab2Results: [],
      tab2SelectedIds: [],
    }));
  };

  // 3. 将已勾选台账导入至本行动的台账 (Tab1)
  const handleConfirmImportToTab1 = () => {
    const selectedIds = currentInstConfig.tab2SelectedIds;
    if (selectedIds.length === 0) {
      showToast('请至少勾选一条台账');
      return;
    }

    const selectedItems = currentInstConfig.tab2Results.filter(item =>
      selectedIds.includes(item.id)
    );

    // Merge into Tab1 with deduplication
    const existingTab1Ids = new Set(currentInstConfig.tab1Ledgers.map(i => i.id));
    const newItems = selectedItems
      .filter(item => !existingTab1Ids.has(item.id))
      .map(item => ({
        ...item,
        importSource: (item.subjectName.includes('市') || item.subjectName.includes('省') ? '属地导入' : '手动追加') as '属地导入' | '手动追加',
      }));

    // If item was in Tab3 blacklist, remove from Tab3
    const newTab3 = currentInstConfig.tab3Blacklist.filter(b => !selectedIds.includes(b.id));

    updateCurrentInstConfig(prev => ({
      tab1Ledgers: [...prev.tab1Ledgers, ...newItems],
      tab3Blacklist: newTab3,
      tab2Results: prev.tab2Results.filter(item => !selectedIds.includes(item.id)),
      tab2SelectedIds: [],
    }));

    setShowImportConfirmModal(false);
    showToast(`已成功导入 ${newItems.length} 条新台账至【本专项行动台账】（已自动去重）`);
  };

  // 4. 将已勾选台账直接加入黑名单 (Tab3)
  const handleConfirmDirectBlacklist = () => {
    const selectedIds = currentInstConfig.tab2SelectedIds;
    if (selectedIds.length === 0) {
      showToast('请至少勾选一条台账');
      return;
    }

    const selectedItems = currentInstConfig.tab2Results.filter(item =>
      selectedIds.includes(item.id)
    );

    const existingBlacklistIds = new Set(currentInstConfig.tab3Blacklist.map(i => i.id));
    const newBlacklist = selectedItems
      .filter(item => !existingBlacklistIds.has(item.id))
      .map(item => ({
        ...item,
        importSource: '手动追加' as const,
        blacklistReason: '数据源选择阶段直接加入行动私有黑名单',
      }));

    // Remove from Tab1 if present
    const newTab1 = currentInstConfig.tab1Ledgers.filter(l => !selectedIds.includes(l.id));

    updateCurrentInstConfig(prev => ({
      tab1Ledgers: newTab1,
      tab3Blacklist: [...prev.tab3Blacklist, ...newBlacklist],
      tab2Results: prev.tab2Results.filter(item => !selectedIds.includes(item.id)),
      tab2SelectedIds: [],
    }));

    setShowDirectBlacklistConfirmModal(false);
    showToast(`已将 ${newBlacklist.length} 条台账加入【黑名单】`);
  };

  // 5. Tab1: 单条 / 批量加入黑名单
  const handleMoveTab1ToBlacklist = (ids: number[]) => {
    if (ids.length === 0) {
      showToast('请先勾选需要移入黑名单的台账');
      return;
    }

    const itemsToMove = currentInstConfig.tab1Ledgers.filter(item => ids.includes(item.id));
    const remainingTab1 = currentInstConfig.tab1Ledgers.filter(item => !ids.includes(item.id));

    const existingBlacklistIds = new Set(currentInstConfig.tab3Blacklist.map(i => i.id));
    const newBlacklistItems = itemsToMove
      .filter(item => !existingBlacklistIds.has(item.id))
      .map(item => ({
        ...item,
        blacklistReason: '从本行动台账列表移入黑名单',
      }));

    updateCurrentInstConfig(prev => ({
      tab1Ledgers: remainingTab1,
      tab3Blacklist: [...prev.tab3Blacklist, ...newBlacklistItems],
      tab1SelectedIds: [],
    }));

    showToast(`已将 ${itemsToMove.length} 条台账移入【本行动私有黑名单】`);
  };

  // Tab1: 单条 / 批量移出行动台账
  const handleRemoveFromTab1 = (ids: number[]) => {
    if (ids.length === 0) {
      showToast('请先勾选需要移出的台账');
      return;
    }
    const remainingTab1 = currentInstConfig.tab1Ledgers.filter(item => !ids.includes(item.id));
    updateCurrentInstConfig(() => ({
      tab1Ledgers: remainingTab1,
      tab1SelectedIds: [],
    }));
    showToast(`已将 ${ids.length} 条台账移出本行动`);
  };

  // 6. Tab3: 恢复至本行动台账
  const handleRestoreFromBlacklist = (ids: number[]) => {
    if (ids.length === 0) {
      showToast('请先勾选需要恢复的台账');
      return;
    }

    const itemsToRestore = currentInstConfig.tab3Blacklist.filter(item => ids.includes(item.id));
    const remainingBlacklist = currentInstConfig.tab3Blacklist.filter(item => !ids.includes(item.id));

    const existingTab1Ids = new Set(currentInstConfig.tab1Ledgers.map(i => i.id));
    const newTab1Items = itemsToRestore.filter(item => !existingTab1Ids.has(item.id));

    updateCurrentInstConfig(prev => ({
      tab1Ledgers: [...prev.tab1Ledgers, ...newTab1Items],
      tab3Blacklist: remainingBlacklist,
      tab3SelectedIds: [],
    }));

    showToast(`已将 ${itemsToRestore.length} 条台账恢复至【本行动的台账】`);
  };

  // 7. Tab3: 彻底删除
  const handleDeleteFromBlacklist = (ids: number[]) => {
    if (ids.length === 0) {
      showToast('请先勾选需要删除的台账');
      return;
    }

    const remainingBlacklist = currentInstConfig.tab3Blacklist.filter(item => !ids.includes(item.id));

    updateCurrentInstConfig(() => ({
      tab3Blacklist: remainingBlacklist,
      tab3SelectedIds: [],
    }));

    showToast(`已彻底删除 ${ids.length} 条黑名单台账`);
  };

  // 8. 重置属地基准
  const handleConfirmResetBenchmark = () => {
    // Clears Tab1 & Tab3, switches to Tab2 and automatically runs one-click select
    const queryTag = currentInstName.includes('陕西')
      ? '陕西'
      : currentInstName.includes('洛阳')
      ? '河南'
      : currentInstName.includes('阳泉')
      ? '山西'
      : '本地';

    const matched = initialMockLedgers.filter(
      item =>
        item.subjectName.includes(queryTag) ||
        item.name.includes(queryTag) ||
        item.addresses.some(a => a.text.includes(queryTag))
    );
    const finalResults = matched.length >= 8 ? matched : initialMockLedgers.slice(0, 15);
    const selectedIds = finalResults.map(item => item.id);

    updateCurrentInstConfig(() => ({
      tab1Ledgers: [],
      tab3Blacklist: [],
      tab1SelectedIds: [],
      tab3SelectedIds: [],
      activeTab: 'tab2',
      tab2Results: finalResults,
      tab2SelectedIds: selectedIds,
    }));

    setShowResetConfirmModal(false);
    showToast(`已重置台账：清空了本专项行动台账与黑名单，并在台账数据源中自动勾选了 ${finalResults.length} 条属地台账`);
  };

  // Step 2 Validation (Global Check for all selected institutions)
  const handleValidateStep2 = (): boolean => {
    if (scopeMode === 'nationwide') {
      return true;
    }

    const institutionsToCheck = actionType === '机构行动' ? [singleInstitution] : multipleInstitutions;

    for (const inst of institutionsToCheck) {
      const cfg = instConfigs[inst];
      const count = cfg ? cfg.tab1Ledgers.length : 0;
      if (count === 0) {
        showToast(`机构【${inst}】尚未配置本专项行动台账（数量为0），请至少导入1条台账`);
        if (actionType === '统一行动') {
          setActiveInstTab(inst);
          // switch to tab2 for fast config
          setInstConfigs(prev => ({
            ...prev,
            [inst]: {
              ...(prev[inst] || createInitialInstConfig(inst)),
              activeTab: 'tab2',
            },
          }));
        }
        return false;
      }
    }
    return true;
  };

  const handleNextFromStep2 = () => {
    if (!handleValidateStep2()) return;
    setCurrentStep(3);
  };

  // ----------------------------------------------------
  // Step 3 Validation & Handlers
  // ----------------------------------------------------
  const handleValidateStep3 = (): boolean => {
    if (activeKeywordMode === 'mode1') {
      const hasKeywords = mode1Groups.some(g => g.length > 0);
      if (!hasKeywords) {
        showToast('模式一请至少输入一组关键词并回车添加');
        return false;
      }
    } else {
      const hasKeywords = mode2Groups.some(
        g => g.main.length > 0 || g.sub.length > 0 || g.secondary.length > 0
      );
      if (!hasKeywords) {
        showToast('模式二请至少输入一组主/副/次关键词');
        return false;
      }
    }
    return true;
  };

  const handleTriggerPreview = () => {
    if (!handleValidateStep3()) return;
    setCurrentStep('preview');
  };

  // ----------------------------------------------------
  // Final Save Action
  // ----------------------------------------------------
  const handleSavePlanFinal = () => {
    const finalInstStr =
      actionType === '统一行动' ? multipleInstitutions.join('、') : singleInstitution;

    let keywordsParsed: string[][] = [];
    if (activeKeywordMode === 'mode1') {
      keywordsParsed = mode1Groups.filter(g => g.length > 0);
    } else {
      keywordsParsed = mode2Groups
        .map(g => [...g.main, ...g.sub, ...g.secondary])
        .filter(g => g.length > 0);
    }

    // Calculate total ledgers count across institutions
    let totalLedgerCount = 0;
    if (scopeMode === 'nationwide') {
      totalLedgerCount = 128450;
    } else {
      const insts = actionType === '统一行动' ? multipleInstitutions : [singleInstitution];
      insts.forEach(inst => {
        totalLedgerCount += instConfigs[inst]?.tab1Ledgers.length || 0;
      });
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newPlan: PlanItem = {
      id: initialPlan?.id || Date.now(),
      name: planName,
      type: actionType,
      institution: finalInstStr,
      startDate: startDate,
      inspectType: inspectType,
      status: inspectType === '快速排查' ? '更新中' : '深度更新中',
      operator: '邓东升',
      operateTime: nowStr,
      dataCount: 0,
      isOpen: true,
      platforms: ['网站', '微博', '微信公众号', '今日头条', '抖音'],
      subjectTypes: ['党政机关', '事业单位'],
      scope: scopeMode === 'nationwide' ? '全国范围' : '自定义范围',
      keywords: keywordsParsed.length > 0 ? keywordsParsed : [['专项排查']],
      excludeKeywords: excludeKeywords,
      ignoreKeywords: ignoreKeywords,
      summary: `经过对 ${finalInstStr} 属地 ${totalLedgerCount} 个台账进行排查，专项行动自 ${startDate} 起正式启动。`,
      recordsCount: {
        ledgerTotal: totalLedgerCount,
        dataTotal: 0,
        availableTotal: 0,
        unavailableTotal: 0,
        pendingTotal: 0,
      },
    };

    onSavePlan(newPlan);
    showToast(
      inspectType === '快速排查'
        ? `方案【${planName}】已保存并立即进入【更新中】状态！`
        : `方案【${planName}】已提交审核，审核通过后将进入【深度更新中】！`
    );
  };

  // Filtered Tab1 Ledgers
  const filteredTab1Ledgers = useMemo(() => {
    return currentInstConfig.tab1Ledgers.filter(item => {
      if (
        currentInstConfig.tab1SearchText &&
        !item.name.includes(currentInstConfig.tab1SearchText) &&
        !item.subjectName.includes(currentInstConfig.tab1SearchText) &&
        !item.detail.ledgerUrl?.includes(currentInstConfig.tab1SearchText)
      ) {
        return false;
      }
      if (
        currentInstConfig.tab1PlatformFilter !== '全部' &&
        item.platform !== currentInstConfig.tab1PlatformFilter
      ) {
        return false;
      }
      if (
        currentInstConfig.tab1SourceFilter !== '全部' &&
        item.importSource !== currentInstConfig.tab1SourceFilter
      ) {
        return false;
      }
      if (
        currentInstConfig.tab1GlobalStatusFilter !== '全部' &&
        item.category !== currentInstConfig.tab1GlobalStatusFilter
      ) {
        return false;
      }
      return true;
    });
  }, [currentInstConfig]);

  // Filtered Tab3 Blacklist
  const filteredTab3Blacklist = useMemo(() => {
    return currentInstConfig.tab3Blacklist.filter(item => {
      if (
        currentInstConfig.tab3SearchText &&
        !item.name.includes(currentInstConfig.tab3SearchText) &&
        !item.subjectName.includes(currentInstConfig.tab3SearchText)
      ) {
        return false;
      }
      return true;
    });
  }, [currentInstConfig]);

  // ----------------------------------------------------
  // RENDER: Preview Page (步骤3点击预览唤起)
  // ----------------------------------------------------
  if (currentStep === 'preview') {
    const instList = actionType === '统一行动' ? multipleInstitutions : [singleInstitution];

    return (
      <div className="flex-1 overflow-y-auto bg-[#f8f9fa] flex flex-col p-6 min-h-0 text-[#333]">
        {/* Top Header */}
        <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-200 mb-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentStep(3)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 cursor-pointer transition"
              title="返回上一步修改"
            >
              <i className="fa-solid fa-arrow-left text-sm"></i>
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-gray-900">专项行动方案数据预览与模拟运算</h2>
                <span className="px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-600 border border-purple-200 font-medium">
                  {actionType}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    inspectType === '快速排查'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {inspectType}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                基于步骤1、2、3全部配置进行模拟排查运算（只做模拟展示，尚未真正入库执行任务）
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 font-medium cursor-pointer transition"
            >
              <i className="fa-regular fa-pen-to-square mr-1"></i> 返回修改
            </button>
            <button
              type="button"
              onClick={handleSavePlanFinal}
              className="px-6 py-2 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium shadow-sm cursor-pointer transition flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-check"></i>
              <span>确定保存方案</span>
            </button>
          </div>
        </div>

        {/* Preview Content Grid */}
        <div className="grid grid-cols-12 gap-5 flex-1">
          {/* Left Column: 方案基础信息 & 关键词配置 */}
          <div className="col-span-4 space-y-5">
            {/* Card 1: 基础信息 */}
            <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-200 space-y-3.5">
              <div className="flex items-center space-x-2 pb-2.5 border-b border-gray-100">
                <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                <h3 className="text-xs font-bold text-gray-800">方案基础信息</h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">行动名称</span>
                  <span className="font-bold text-gray-800">{planName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">行动类型</span>
                  <span className="text-gray-800 font-medium">{actionType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">排查类型</span>
                  <span className="text-gray-800 font-medium">
                    {inspectType === '快速排查' ? '快速排查（保存直接更新）' : '深度排查（需审批）'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">开始日期</span>
                  <span className="font-mono text-gray-800">{startDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">台账模式</span>
                  <span className="text-[#1677ff] font-medium">
                    {scopeMode === 'nationwide' ? '全国范围台账（全量实时）' : '自定义台账集合（快照管理）'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: 关键词配置 */}
            <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-200 space-y-3.5">
              <div className="flex items-center space-x-2 pb-2.5 border-b border-gray-100">
                <div className="w-1 h-3.5 bg-[#52c41a] rounded-xs"></div>
                <h3 className="text-xs font-bold text-gray-800">
                  排查关键词规则（{activeKeywordMode === 'mode1' ? '手动输入-模式一' : '手动输入-模式二'}）
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                {activeKeywordMode === 'mode1' ? (
                  <div>
                    <div className="text-gray-400 mb-1.5 flex items-center justify-between">
                      <span>模式一关键词组（组内“且”，多组“或”）</span>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">命中入库</span>
                    </div>
                    <div className="space-y-1.5 p-2 bg-gray-50 rounded border border-gray-200">
                      {mode1Groups.filter(g => g.length > 0).length > 0 ? (
                        mode1Groups.filter(g => g.length > 0).map((grp, gIdx) => (
                          <div key={gIdx} className="flex items-center space-x-1.5 flex-wrap">
                            <span className="text-gray-500 text-[11px] font-mono">组{gIdx + 1}:</span>
                            {grp.map((kw, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                                {kw}
                              </span>
                            ))}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">未配置</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 mb-1.5 flex items-center justify-between">
                      <span>模式二词组（主/副/次）</span>
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">组合命中</span>
                    </div>
                    <div className="space-y-2 p-2 bg-gray-50 rounded border border-gray-200">
                      {mode2Groups.map((grp, gIdx) => (
                        <div key={grp.id} className="p-1.5 bg-white rounded border border-gray-100 space-y-1">
                          <div className="font-bold text-gray-700 text-[11px]">词组{gIdx + 1}:</div>
                          {grp.main.length > 0 && (
                            <div className="flex items-center space-x-1 flex-wrap text-[11px]">
                              <span className="text-gray-400">主:</span>
                              {grp.main.map((w, i) => (
                                <span key={i} className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200">
                                  {w}
                                </span>
                              ))}
                            </div>
                          )}
                          {grp.sub.length > 0 && (
                            <div className="flex items-center space-x-1 flex-wrap text-[11px]">
                              <span className="text-gray-400">副:</span>
                              {grp.sub.map((w, i) => (
                                <span key={i} className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                                  {w}
                                </span>
                              ))}
                            </div>
                          )}
                          {grp.secondary.length > 0 && (
                            <div className="flex items-center space-x-1 flex-wrap text-[11px]">
                              <span className="text-gray-400">次:</span>
                              {grp.secondary.map((w, i) => (
                                <span key={i} className="px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded border border-purple-200">
                                  {w}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-gray-400 mb-1.5 flex items-center justify-between">
                    <span>排除词</span>
                    <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded">直接过滤</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded border border-gray-200">
                    {excludeKeywords.length > 0 ? (
                      excludeKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs border border-red-200">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">未配置</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 mb-1.5 flex items-center justify-between">
                    <span>忽略词</span>
                    <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">跳过告警</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded border border-gray-200">
                    {ignoreKeywords.length > 0 ? (
                      ignoreKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs border border-gray-300">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">未配置</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 台账统计 & 模拟命中数据样例 */}
          <div className="col-span-8 space-y-5">
            {/* 台账统计卡片 (按机构分组展示) */}
            <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-200 space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-3.5 bg-[#fa8c16] rounded-xs"></div>
                  <h3 className="text-xs font-bold text-gray-800">台账范围统计快照</h3>
                </div>
                <span className="text-xs text-gray-500">
                  {actionType === '统一行动' ? `共 ${instList.length} 个机构协同排查` : '单机构独立排查'}
                </span>
              </div>

              {scopeMode === 'nationwide' ? (
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-gray-800 flex items-center space-x-2">
                      <i className="fa-solid fa-earth-americas text-blue-600"></i>
                      <span>全国全量台账模式</span>
                    </div>
                    <p className="text-gray-600">
                      系统将对平台登记的全部全国台账进行全面扫描与关键词判定。
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xl font-bold text-blue-600">128,450</div>
                    <div className="text-[10px] text-gray-500">有效扫描台账总量</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {instList.map((inst, idx) => {
                    const cfg = instConfigs[inst] || createInitialInstConfig(inst);
                    const localCount = cfg.tab1Ledgers.filter(l => l.importSource === '属地导入').length;
                    const manualCount = cfg.tab1Ledgers.filter(l => l.importSource === '手动追加').length;
                    const blacklistCount = cfg.tab3Blacklist.length;
                    const globalBlacklistOverlap = cfg.tab1Ledgers.filter(l => l.category === 'blacklist').length;
                    const effectiveScanCount = cfg.tab1Ledgers.length - globalBlacklistOverlap;

                    return (
                      <div
                        key={inst}
                        className="p-3.5 bg-gray-50 rounded-lg border border-gray-200/80 space-y-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-gray-800">{inst}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            有效扫描台账：<strong className="text-blue-600 font-bold">{effectiveScanCount}</strong> 条
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-[10px] text-gray-400">本行动台账</div>
                            <div className="text-sm font-bold text-gray-800">{cfg.tab1Ledgers.length}</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-[10px] text-gray-400">属地导入</div>
                            <div className="text-sm font-bold text-green-600">{localCount}</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-[10px] text-gray-400">手动追加</div>
                            <div className="text-sm font-bold text-blue-600">{manualCount}</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <div className="text-[10px] text-gray-400">行动私有黑名单</div>
                            <div className="text-sm font-bold text-red-500">{blacklistCount}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 模拟命中样例数据 */}
            <div className="bg-white rounded-lg p-5 shadow-xs border border-gray-200 space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-3.5 bg-[#722ed1] rounded-xs"></div>
                  <h3 className="text-xs font-bold text-gray-800">模拟命中样例数据（基于关键词推演）</h3>
                </div>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-medium">
                  模拟生成 3 条命中记录
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: '中共洛阳市委网络安全和信息化委员会办公室关于推进基层社工部与新媒体阵地建设的通报',
                    source: '微信公众号',
                    account: '网信洛阳',
                    keyword: '社工部',
                    time: '2026-08-22 14:30:12',
                    snippet:
                      '…为深入贯彻落实基层治理现代化要求，洛阳市委网信办联合市委社工部，开展新媒体矩阵属地规范治理专项行动，强化线上线下协同治理效能…',
                  },
                  {
                    title: '陕西省委网信办组织开展党政机关新媒体专项排查与社工部业务交流研讨会',
                    source: '网站',
                    account: '陕西网信网',
                    keyword: '社工部',
                    time: '2026-08-21 09:15:40',
                    snippet:
                      '…会议围绕全省网络安全保障和新时代社工部网民互动工作机制展开研讨，明确了多部门联合排查的总体工作要求…',
                  },
                  {
                    title: '西安网信关于加强重点领域舆情风险研判的通知',
                    source: '今日头条',
                    account: '西安发布',
                    keyword: '基层治理',
                    time: '2026-08-20 16:45:00',
                    snippet:
                      '…全面提升网络安全防护水平，压实属地主体责任，落实基层治理各项监管要求，严防违规信息传播扩散…',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/70 hover:bg-gray-50 space-y-2 text-xs transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 hover:text-[#1677ff] cursor-pointer">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] border border-blue-200 text-[10px] font-medium shrink-0">
                        {item.source}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed bg-white p-2.5 rounded border border-gray-200/60">
                      {item.snippet.split(item.keyword).map((chunk, ci, arr) => (
                        <React.Fragment key={ci}>
                          {chunk}
                          {ci < arr.length - 1 && (
                            <span className="bg-yellow-200 text-red-600 font-bold px-1 rounded">
                              {item.keyword}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                      <span>发文账号: <strong className="text-gray-700 font-normal">{item.account}</strong></span>
                      <span>命中关键字: <strong className="text-red-500 font-medium">{item.keyword}</strong></span>
                      <span>时间: {item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: Step 1 / Step 2 / Step 3 Main Wizard
  // ----------------------------------------------------
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white text-[#333] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1677ff] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center space-x-2 animate-bounce">
          <i className="fa-solid fa-circle-info"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Back and Stepper (Sticky Top) */}
      <div className="shrink-0 px-6 pt-5 pb-3 border-b border-gray-100 bg-white z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowExitConfirmModal(true)}
            className="flex items-center text-sm font-bold text-gray-800 hover:text-[#1677ff] cursor-pointer"
          >
            <i className="fa-solid fa-chevron-left mr-1.5 text-xs"></i>
            <span>{initialPlan ? '编辑专项行动方案' : '新建专项行动方案'}</span>
          </button>
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-normal ${
              actionType === '机构行动'
                ? 'bg-blue-50 text-[#1677ff] border border-blue-200'
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}
          >
            {actionType}
          </span>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Step 1 */}
          <div
            className={`flex items-center space-x-1.5 cursor-pointer ${
              currentStep === 1
                ? 'text-[#1677ff] font-bold'
                : currentStep > 1
                ? 'text-green-600 font-medium'
                : 'text-gray-400'
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1
                  ? 'bg-[#1677ff] text-white'
                  : currentStep > 1
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </span>
            <span>配置基础信息</span>
          </div>

          <span className="text-gray-300">──</span>

          {/* Step 2 */}
          <div
            className={`flex items-center space-x-1.5 cursor-pointer ${
              currentStep === 2
                ? 'text-[#1677ff] font-bold'
                : currentStep > 2
                ? 'text-green-600 font-medium'
                : 'text-gray-400'
            }`}
            onClick={() => {
              if (handleValidateStep1()) setCurrentStep(2);
            }}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2
                  ? 'bg-[#1677ff] text-white'
                  : currentStep > 2
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </span>
            <span>选择台账范围</span>
          </div>

          <span className="text-gray-300">──</span>

          {/* Step 3 */}
          <div
            className={`flex items-center space-x-1.5 cursor-pointer ${
              currentStep === 3 ? 'text-[#1677ff] font-bold' : 'text-gray-400'
            }`}
            onClick={() => {
              if (handleValidateStep1() && handleValidateStep2()) setCurrentStep(3);
            }}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-[#1677ff] text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </span>
            <span>设置关键词</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">

      {/* ---------------------------------------------------- */}
      {/* STEP 1: 配置基础信息 */}
      {/* ---------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="max-w-3xl mx-auto w-full space-y-6 text-xs flex-1 flex flex-col justify-between">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
              <h3 className="text-xs font-bold text-gray-800">第一步：配置行动基础信息</h3>
            </div>

            {/* 1. 行动类型单选 */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700 flex items-center">
                <span className="text-red-500 mr-1">*</span> 行动类型
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setActionType('机构行动')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-center space-x-3.5 relative ${
                    actionType === '机构行动'
                      ? 'border-[#1677ff] bg-blue-50/30 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#1677ff] text-white flex items-center justify-center text-lg shrink-0">
                    <i className="fa-regular fa-building"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">机构行动 (单机构)</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">仅选择并配置 1 个机构的专属排查方案</p>
                  </div>
                  {actionType === '机构行动' && (
                    <div className="absolute top-0 right-0 bg-[#1677ff] text-white w-4 h-4 rounded-bl-md flex items-center justify-center text-[9px]">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </div>

                <div
                  onClick={() => setActionType('统一行动')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-center space-x-3.5 relative ${
                    actionType === '统一行动'
                      ? 'border-[#1677ff] bg-blue-50/30 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#2f54eb] text-white flex items-center justify-center text-lg shrink-0">
                    <i className="fa-solid fa-cube"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs">统一行动 (多机构)</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">可多选多个机构，各机构独立配置台账范围</p>
                  </div>
                  {actionType === '统一行动' && (
                    <div className="absolute top-0 right-0 bg-[#1677ff] text-white w-4 h-4 rounded-bl-md flex items-center justify-center text-[9px]">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 机构选择 */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700 flex items-center">
                <span className="text-red-500 mr-1">*</span>
                {actionType === '机构行动' ? '选择所属机构' : '选择机构'}
              </label>

              {actionType === '机构行动' ? (
                <select
                  value={singleInstitution}
                  onChange={e => setSingleInstitution(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-xs focus:outline-none focus:border-[#1677ff] cursor-pointer"
                >
                  {AVAILABLE_INSTITUTIONS.map(inst => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              ) : (
                <InstitutionSearchSelect
                  selectedInstitutions={multipleInstitutions}
                  onChange={setMultipleInstitutions}
                  onToast={showToast}
                />
              )}
            </div>

            {/* 2. 行动名称 */}
            <div className="space-y-1.5">
              <label className="font-medium text-gray-700 flex items-center">
                <span className="text-red-500 mr-1">*</span> 行动名称
              </label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white focus-within:border-[#1677ff]">
                <input
                  type="text"
                  value={planName}
                  maxLength={50}
                  onChange={e => setPlanName(e.target.value)}
                  placeholder="请输入行动名称（同机构下行动名称唯一）"
                  className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                <span className="text-[10px] text-gray-400 select-none ml-2">{planName.length}/50</span>
              </div>
            </div>

            {/* 3. 排查类型 */}
            <div className="space-y-1.5">
              <label className="font-medium text-gray-700 flex items-center">
                <span className="text-red-500 mr-1">*</span> 排查类型
              </label>
              <select
                value={inspectType}
                onChange={e => setInspectType(e.target.value as '快速排查' | '深度排查')}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-xs focus:outline-none focus:border-[#1677ff] cursor-pointer"
              >
                <option value="快速排查">快速排查 (保存成功直接进入【更新中】)</option>
                <option value="深度排查">深度排查 (保存后进入【待审核】，审核通过后进入【深度更新中】)</option>
              </select>
              <p className="text-[11px] text-gray-400">
                {inspectType === '快速排查'
                  ? 'ⓘ 快速排查：保存后系统立即启动排查任务，无需审核流。'
                  : 'ⓘ 深度排查：保存后进入待审核，通过后执行全面深度扫描；已关闭的深度排查重新开启无需再次审核。'}
              </p>
            </div>

            {/* 4. 开始日期 */}
            <div className="space-y-1.5">
              <label className="font-medium text-gray-700 flex items-center">
                <span className="text-red-500 mr-1">*</span> 开始日期 (生效时间)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-xs focus:outline-none focus:border-[#1677ff] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 2: 选择台账范围 */}
      {/* ---------------------------------------------------- */}
      {currentStep === 2 && (
        <div className="flex flex-col bg-white space-y-3.5 text-xs">
          {/* Branch B: Multiple Institutions Tab Bar if Unified Action */}
          {actionType === '统一行动' && (
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
              <span className="text-xs font-bold text-gray-700 shrink-0 mr-1">机构标签：</span>
              {multipleInstitutions.map(inst => {
                const cfg = instConfigs[inst] || createInitialInstConfig(inst);
                const isActive = activeInstTab === inst;
                const count = cfg.tab1Ledgers.length;

                return (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => setActiveInstTab(inst)}
                    className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition flex items-center space-x-1.5 shrink-0 ${
                      isActive
                        ? 'bg-[#1677ff] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="truncate max-w-[200px]" title={inst}>
                      {inst}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white text-[#1677ff]' : count > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}条
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3 平级 Tabs: 本专项行动台账 | 台账数据源 | 黑名单 */}
          <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <button
                type="button"
                onClick={() => updateCurrentInstConfig(() => ({ activeTab: 'tab1' }))}
                className={`pb-2 text-xs font-bold cursor-pointer transition relative ${
                  currentInstConfig.activeTab === 'tab1'
                    ? 'text-[#1677ff]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                本专项行动台账 ({currentInstConfig.tab1Ledgers.length})
                {currentInstConfig.activeTab === 'tab1' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => updateCurrentInstConfig(() => ({ activeTab: 'tab3' }))}
                className={`pb-2 text-xs font-bold cursor-pointer transition relative ${
                  currentInstConfig.activeTab === 'tab3'
                    ? 'text-[#1677ff]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                黑名单 ({currentInstConfig.tab3Blacklist.length})
                {currentInstConfig.activeTab === 'tab3' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => updateCurrentInstConfig(() => ({ activeTab: 'tab2' }))}
                className={`pb-2 text-xs font-bold cursor-pointer transition relative ${
                  currentInstConfig.activeTab === 'tab2'
                    ? 'text-[#1677ff]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                台账检索
                {currentInstConfig.activeTab === 'tab2' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
                )}
              </button>
            </div>

            {/* Reset Button placed on Tab1 */}
            {currentInstConfig.activeTab === 'tab1' && (
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(true)}
                className="mb-1 text-xs text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded cursor-pointer transition font-medium flex items-center space-x-1"
                title="清空台账并重置台账"
              >
                <i className="fa-solid fa-rotate-left text-[11px]"></i>
                <span>重置台账</span>
              </button>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* TAB 1: 本行动的台账 (持久快照，扫描对象) */}
          {/* ---------------------------------------------------- */}
          {currentInstConfig.activeTab === 'tab1' && (
            <Tab1ActionLedgersView
              ledgers={currentInstConfig.tab1Ledgers}
              selectedIds={currentInstConfig.tab1SelectedIds}
              onSelectionChange={ids =>
                updateCurrentInstConfig(() => ({ tab1SelectedIds: ids }))
              }
              onMoveToBlacklist={handleMoveTab1ToBlacklist}
              onRemoveFromTab1={handleRemoveFromTab1}
              onGoToTab2={() => updateCurrentInstConfig(() => ({ activeTab: 'tab2' }))}
              onToast={showToast}
            />
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: 黑名单 (本行动私有) */}
          {/* ---------------------------------------------------- */}
          {currentInstConfig.activeTab === 'tab3' && (
            <Tab3BlacklistView
              blacklists={currentInstConfig.tab3Blacklist}
              selectedIds={currentInstConfig.tab3SelectedIds}
              onSelectionChange={ids =>
                updateCurrentInstConfig(() => ({ tab3SelectedIds: ids }))
              }
              onRestoreToTab1={handleRestoreFromBlacklist}
              onDeleteFromBlacklist={handleDeleteFromBlacklist}
              onToast={showToast}
            />
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: 台账检索 (临时工作台) */}
          {/* ---------------------------------------------------- */}
          {currentInstConfig.activeTab === 'tab2' && (
            <Tab2DataSourceView
              currentInstName={currentInstName}
              selectedIds={currentInstConfig.tab2SelectedIds}
              onSelectionChange={ids =>
                updateCurrentInstConfig(() => ({ tab2SelectedIds: ids }))
              }
              onImportToTab1={selectedItems => {
                const existingIds = new Set(currentInstConfig.tab1Ledgers.map(l => l.id));
                const newItems = selectedItems
                  .filter(item => !existingIds.has(item.id))
                  .map(item => ({
                    ...item,
                    fans: item.fans || item.fansCount || 0,
                    collectStatus: item.collectStatus || '已采集',
                    ledgerStatus: item.ledgerStatus || '正常',
                    importSource: '属地导入' as const,
                  }));
                const idsToRemoveFromBlacklist = new Set(selectedItems.map(i => i.id));
                updateCurrentInstConfig(prev => ({
                  tab1Ledgers: [...prev.tab1Ledgers, ...newItems],
                  tab3Blacklist: prev.tab3Blacklist.filter(b => !idsToRemoveFromBlacklist.has(b.id)),
                  tab2SelectedIds: [],
                }));
                showToast(
                  `已将 ${newItems.length} 条台账加入【本专项行动台账】`
                );
              }}
              onDirectBlacklist={selectedItems => {
                const existingBIds = new Set(currentInstConfig.tab3Blacklist.map(l => l.id));
                const newBItems = selectedItems
                  .filter(item => !existingBIds.has(item.id))
                  .map(item => ({
                    ...item,
                    fans: item.fans || item.fansCount || 0,
                    collectStatus: item.collectStatus || '已采集',
                    ledgerStatus: item.ledgerStatus || '正常',
                    importSource: '属地导入' as const,
                    blacklistReason: '从台账检索直接加入行动黑名单',
                  }));
                const idsToRemove = new Set(selectedItems.map(i => i.id));
                updateCurrentInstConfig(prev => ({
                  tab3Blacklist: [...prev.tab3Blacklist, ...newBItems],
                  tab1Ledgers: prev.tab1Ledgers.filter(l => !idsToRemove.has(l.id)),
                  tab2SelectedIds: [],
                }));
                showToast(
                  `已将 ${newBItems.length} 条台账加入【黑名单】`
                );
              }}
              onToast={showToast}
            />
          )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 3: 设置关键词 (左右分栏：左侧设置关键词，右侧数据预览) */}
        {/* ---------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="grid grid-cols-12 gap-5 w-full text-xs pb-4">
            {/* 左侧分栏：设置关键词区域 */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5 shadow-xs">
                <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h3 className="text-xs font-bold text-gray-800">设置关键词</h3>
                </div>

                <Step3KeywordConfigView
                  mode1Groups={mode1Groups}
                  onChangeMode1Groups={setMode1Groups}
                  mode2Groups={mode2Groups}
                  onChangeMode2Groups={setMode2Groups}
                  activeMode={activeKeywordMode}
                  onChangeActiveMode={setActiveKeywordMode}
                  excludeKeywords={excludeKeywords}
                  onChangeExcludeKeywords={setExcludeKeywords}
                  ignoreKeywords={ignoreKeywords}
                  onChangeIgnoreKeywords={setIgnoreKeywords}
                  onToast={showToast}
                  onPreviewGroup={(groupName, keywords) => {
                    setSelectedPreviewGroup({ name: groupName, keywords });
                    showToast(`右侧数据预览已聚焦【${groupName}】匹配推演结果`);
                  }}
                />
              </div>
            </div>

            {/* 右侧分栏：信息预览 面板 */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-xs flex flex-col h-full min-h-[560px]">
                {/* 顶部标题与可预览统计 (参考设计图) */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                    <h3 className="text-xs font-bold text-gray-800">信息预览</h3>
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      可预览：100条数据
                    </span>
                  </div>

                  {selectedPreviewGroup && (
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-[#1677ff]">
                      <span>聚焦: <strong>{selectedPreviewGroup.name}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewGroup(null)}
                        className="ml-1 hover:text-blue-800 cursor-pointer font-bold"
                        title="取消聚焦，恢复全量预览"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* 聚焦规则或默认提示 */}
                {selectedPreviewGroup && (
                  <div className="p-2 bg-blue-50/90 rounded border border-blue-200 text-[11px] text-blue-800 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <i className="fa-solid fa-circle-info text-[#1677ff]"></i>
                      <span>
                        当前聚焦预览 <strong>{selectedPreviewGroup.name}</strong>（关键词：
                        {selectedPreviewGroup.keywords.filter(Boolean).length > 0
                          ? selectedPreviewGroup.keywords.join('、')
                          : '暂无'}
                        ）
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPreviewGroup(null)}
                      className="text-[#1677ff] hover:underline cursor-pointer text-[10px] shrink-0 font-medium ml-2"
                    >
                      查看全部
                    </button>
                  </div>
                )}

                {/* 模拟信息预览列表 (严格匹配设计图格式: 蓝色平台icon、标题加粗红色高亮、摘要红色高亮、元数据底栏) */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[580px] pr-1">
                  {(() => {
                    // 收集用于红字高亮的关键词列表
                    const activeHighlightWords = selectedPreviewGroup
                      ? selectedPreviewGroup.keywords
                      : [
                          ...mode1Groups.flat(),
                          ...mode2Groups.flatMap(g => g.items),
                          '西安',
                          '陕西',
                          '陕西西安',
                        ].filter(Boolean);

                    const highlightText = (text: string) => {
                      if (!text) return '';
                      const words = (activeHighlightWords as (string | unknown)[])
                        .map(w => String(w || '').trim())
                        .filter(Boolean);
                      if (words.length === 0) return text;

                      // 长词优先，避免覆盖
                      const sortedWords = Array.from(new Set(words)).sort((a, b) => b.length - a.length);
                      const pattern = new RegExp(`(${sortedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

                      const parts = text.split(pattern);
                      return parts.map((part, index) => {
                        const isMatched = sortedWords.some(w => w.toLowerCase() === part.toLowerCase());
                        if (isMatched) {
                          return (
                            <span key={index} className="text-red-600 font-bold">
                              {part}
                            </span>
                          );
                        }
                        return part;
                      });
                    };

                    const mockList = [
                      {
                        title: '9月西安旅游正规的国际旅行社有哪几家？口碑好的本地社推荐？',
                        snippet:
                          '9月是西安旅游的黄金出行时段，气温舒适，游客数量相比暑期有所回落，非常适合打卡古城古迹、华山等知名景点，不少计划出行的游客都会纠结，9月西安旅游正规的国际旅行社有哪几家，如何挑选口碑好的本地社，「蒙旅国际旅行社」，认准官方认…',
                        source: '网易',
                        author: '漠星资讯',
                        ip: '内蒙古',
                        time: '2026-08-25 16:43:16',
                      },
                      {
                        title: '年轻人结伴出去玩花费高不高，陕西西安旅游三到五日年轻人攻略，靠谱导游推荐带着玩年…',
                        snippet:
                          '年轻人结伴出去玩花费高不高，陕西西安旅游三到五日年轻人攻略，靠谱导游推荐带着玩年轻人喜欢的项目，正规旅行社需购买意外险-西安+延安 年轻人结伴出去玩花费高不高？说实话，以前我也觉得出门就得花大钱。这次我们四个朋友走了一条西安…',
                        source: '网易',
                        author: '旅游达人爱分享',
                        ip: '湖南',
                        time: '2026-08-25 16:43:13',
                      },
                      {
                        title: '三个人带老人出行花销贵不贵，陕西西安三到五日游三人家庭攻略，经验丰富导游推荐可帮忙…',
                        snippet:
                          '三个人带老人出行花销贵不贵，陕西西安三到五日游三人家庭攻略，经验丰富导游推荐可帮忙照顾长辈，纯玩旅行社无隐形消费-西安+延安 以标题 《三个人带老人出行花销贵不贵，陕西西安三到五日游三人家庭攻略，经验丰富导游推荐可帮忙照顾长辈，…',
                        source: '网易',
                        author: '大美中国旅游攻略',
                        ip: '湖南',
                        time: '2026-08-25 16:37:33',
                      },
                      {
                        title: '售楼处发布:西安泰发祥檀府售楼处电话营销中心地址-营销中心电话--楼盘详情@售楼处AI热搜',
                        snippet:
                          '西安泰发祥檀府售楼处电话: 400-861-0709转接6666 (营销中心) 售楼处位置: 400-861-0709 (致电发送详情地址) ➢➢温馨提示——拨打400电话——听到一声后——输入分机号6666即可通话 在售户型图 | 项目详情介绍 | 剩余房源 | 项目周…',
                        source: '网易',
                        author: '甲方售楼处',
                        ip: '陕西',
                        time: '2026-08-25 16:37:15',
                      },
                      {
                        title: '9月一个人去西安旅游，报什么团比较合适？有纯玩小团吗？',
                        snippet:
                          '9月的西安秋高气爽，褪去盛夏的燥热，游客数量相比暑期有所回落，非常适合一个人出行旅游，不少独自出游的游客会纠结，单人出行到底选什么样的西安旅游报团产品，担心遇上低价购物团、大人多拥挤、单人补房差过高的问题，「蒙旅国际旅行…',
                        source: '网易',
                        author: '漠星资讯',
                        ip: '内蒙古',
                        time: '2026-08-25 16:43:16',
                      },
                    ];

                    return mockList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 transition shadow-2xs space-y-2 text-xs"
                      >
                        {/* 标题 */}
                        <div className="flex items-start space-x-2">
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#1677ff] text-white font-bold text-[10px] shrink-0 mt-0.5">
                            e
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm leading-snug flex-1">
                            {highlightText(item.title)}
                          </h4>
                        </div>

                        {/* 摘要正文 */}
                        <p className="text-xs text-gray-600 leading-relaxed font-normal pl-6">
                          {highlightText(item.snippet)}
                        </p>

                        {/* 底部元数据栏 */}
                        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-50 pl-6">
                          <div className="flex items-center space-x-4">
                            <span>来源：{item.source}</span>
                            <span>作者：{item.author}</span>
                            <span>IP属地：{item.ip}</span>
                          </div>
                          <span className="font-mono text-[11px] text-gray-400">{item.time}</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Bar (始终吸底冻结) */}
      <div className="shrink-0 px-6 py-3 bg-white border-t border-gray-200 shadow-sm flex items-center justify-between z-20">
        {currentStep === 1 && (
          <>
            <button
              type="button"
              onClick={() => setShowExitConfirmModal(true)}
              className="px-5 py-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer font-medium transition"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleNextFromStep1}
              className="px-6 py-2 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium cursor-pointer shadow-xs transition flex items-center space-x-1.5"
            >
              <span>下一步：选择台账范围</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer font-medium transition flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>上一步：配置基础信息</span>
            </button>
            <button
              type="button"
              onClick={handleNextFromStep2}
              className="px-6 py-2 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium cursor-pointer shadow-xs transition flex items-center space-x-1.5"
            >
              <span>下一步：设置关键词</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </>
        )}

        {currentStep === 3 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer font-medium transition flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>上一步：选择台账范围</span>
            </button>
            <button
              type="button"
              onClick={handleSavePlanFinal}
              className="px-6 py-2 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium cursor-pointer shadow-xs transition flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-check text-xs"></i>
              <span>确定保存方案</span>
            </button>
          </>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------- */}
      {/* Exit Confirm Modal */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl text-[#333]">
            <div className="flex items-center space-x-2 text-amber-600">
              <i className="fa-solid fa-circle-exclamation text-lg"></i>
              <h3 className="font-bold text-sm text-gray-800">确认退出配置？</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              退出将丢弃当前未保存的方案与台账配置，是否确认返回列表？
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                继续编辑
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  onBack();
                }}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Benchmark Confirm Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl text-[#333]">
            <div className="flex items-center space-x-2 text-orange-600">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <h3 className="font-bold text-sm text-gray-800">重置台账确认</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              重置会清空本专项行动台账、黑名单全部数据，跳转至【台账数据源】Tab并自动一键勾选本机构属地台账，等待您处理，确认执行？
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmResetBenchmark}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import to Tab1 Confirm Modal */}
      {showImportConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl text-[#333]">
            <div className="flex items-center space-x-2 text-blue-600">
              <i className="fa-solid fa-circle-question text-lg"></i>
              <h3 className="font-bold text-sm text-gray-800">导入至本行动的台账</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              确认将当前选中的 <strong className="text-[#1677ff]">{currentInstConfig.tab2SelectedIds.length}</strong> 条台账导入至【Tab1 本行动的台账】吗？导入后会自动去重，并清空当前临时查询结果。
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImportConfirmModal(false)}
                className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmImportToTab1}
                className="px-4 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-medium"
              >
                确认导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Blacklist Confirm Modal */}
      {showDirectBlacklistConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl text-[#333]">
            <div className="flex items-center space-x-2 text-red-600">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <h3 className="font-bold text-sm text-gray-800">加入行动私有黑名单</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              确认将当前选中的 <strong className="text-red-600">{currentInstConfig.tab2SelectedIds.length}</strong> 条台账直接加入【Tab3 本行动私有黑名单】吗？加入后本方案排查将直接跳过这些台账。
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDirectBlacklistConfirmModal(false)}
                className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDirectBlacklist}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium"
              >
                确认加入黑名单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
