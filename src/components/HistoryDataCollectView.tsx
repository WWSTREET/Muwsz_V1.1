import React, { useState, useMemo } from 'react';

export interface HistoryAccountDetail {
  id: number;
  name: string;
  platform: '网站' | '微信公众号';
  subjectType: string;
  status: '采集中' | '待采集' | '采集成功' | '采集失败';
  dataCount: number | '-';
  startTime: string;
  finishTime: string;
}

export interface HistoryCollectTask {
  id: number;
  taskId: number;
  scopeType: 'batch' | 'specific';
  scopeDesc: string;
  institutionName: string;
  startDate: string;
  endDate: string;
  priority: '顺序采集' | '优先采集';
  progress: number; // e.g. 79.66
  completedCount: number;
  totalCount: number;
  operator: string;
  dispatchTime: string;
  finishTime: string;
  status: '进行中' | '已完成' | '采集失败';
  accountDetails?: HistoryAccountDetail[];
}

export const INITIAL_HISTORY_TASKS: HistoryCollectTask[] = [
  {
    id: 1,
    taskId: 64,
    scopeType: 'batch',
    scopeDesc: '指定机构批量采集 (平台( 网站,微信公众号 );主体( 军队机构,党政机关,事业单位,个人,社会…',
    institutionName: '中共陕西省委网络安全和信息化委员会办公室',
    startDate: '2025-08-14',
    endDate: '2026-08-14',
    priority: '顺序采集',
    progress: 79.66,
    completedCount: 2283,
    totalCount: 2866,
    operator: '王琳娜',
    dispatchTime: '2026-08-14 10:15:06',
    finishTime: '-',
    status: '进行中',
    accountDetails: [
      {
        id: 1,
        name: '西安浐灞国际港管理委员会',
        platform: '网站',
        subjectType: '事业单位',
        status: '采集中',
        dataCount: 5260,
        startTime: '2026-08-19 16:35:26',
        finishTime: '-',
      },
      {
        id: 2,
        name: '定边县文艺网展',
        platform: '网站',
        subjectType: '党政机关',
        status: '待采集',
        dataCount: '-',
        startTime: '-',
        finishTime: '-',
      },
      {
        id: 3,
        name: '上海市宜川中学附属学校',
        platform: '网站',
        subjectType: '事业单位',
        status: '待采集',
        dataCount: '-',
        startTime: '-',
        finishTime: '-',
      },
      {
        id: 4,
        name: '榆林市横山区人民代表大会常务委员会办公室',
        platform: '网站',
        subjectType: '党政机关',
        status: '待采集',
        dataCount: '-',
        startTime: '-',
        finishTime: '-',
      },
      {
        id: 5,
        name: '西安市华山中心医院',
        platform: '网站',
        subjectType: '事业单位',
        status: '待采集',
        dataCount: '-',
        startTime: '-',
        finishTime: '-',
      },
      {
        id: 6,
        name: '商南档案信息网',
        platform: '网站',
        subjectType: '事业单位',
        status: '待采集',
        dataCount: '-',
        startTime: '-',
        finishTime: '-',
      },
      {
        id: 7,
        name: '铜川市耀州区人民医院',
        platform: '网站',
        subjectType: '事业单位',
        status: '待采集',
        dataCount: '-',
        startTime: '-',
        finishTime: '-',
      },
    ],
  },
  {
    id: 2,
    taskId: 63,
    scopeType: 'specific',
    scopeDesc: '指定具体台账采集',
    institutionName: '台湾省网信办',
    startDate: '2025-08-12',
    endDate: '2026-08-12',
    priority: '顺序采集',
    progress: 100,
    completedCount: 1,
    totalCount: 1,
    operator: '张小东',
    dispatchTime: '2026-08-12 15:08:46',
    finishTime: '2026-08-12 15:08:51',
    status: '已完成',
    accountDetails: [
      {
        id: 1,
        name: '台湾省网信办官方门户网站',
        platform: '网站',
        subjectType: '党政机关',
        status: '采集成功',
        dataCount: 1204,
        startTime: '2026-08-12 15:08:46',
        finishTime: '2026-08-12 15:08:51',
      },
    ],
  },
  {
    id: 3,
    taskId: 62,
    scopeType: 'specific',
    scopeDesc: '指定具体台账采集',
    institutionName: '台湾省网信办',
    startDate: '2025-08-12',
    endDate: '2026-08-12',
    priority: '顺序采集',
    progress: 100,
    completedCount: 1,
    totalCount: 1,
    operator: '张小东',
    dispatchTime: '2026-08-12 12:41:13',
    finishTime: '2026-08-12 12:41:15',
    status: '已完成',
    accountDetails: [
      {
        id: 1,
        name: '台湾省网信办微信发布',
        platform: '微信公众号',
        subjectType: '党政机关',
        status: '采集成功',
        dataCount: 680,
        startTime: '2026-08-12 12:41:13',
        finishTime: '2026-08-12 12:41:15',
      },
    ],
  },
  {
    id: 4,
    taskId: 61,
    scopeType: 'specific',
    scopeDesc: '指定具体台账采集',
    institutionName: '台湾省网信办',
    startDate: '2025-08-12',
    endDate: '2026-08-12',
    priority: '顺序采集',
    progress: 100,
    completedCount: 1,
    totalCount: 1,
    operator: '张小东',
    dispatchTime: '2026-08-12 12:40:47',
    finishTime: '2026-08-12 12:40:51',
    status: '已完成',
    accountDetails: [
      {
        id: 1,
        name: '台湾政务网信通',
        platform: '网站',
        subjectType: '党政机关',
        status: '采集成功',
        dataCount: 340,
        startTime: '2026-08-12 12:40:47',
        finishTime: '2026-08-12 12:40:51',
      },
    ],
  },
  {
    id: 5,
    taskId: 60,
    scopeType: 'batch',
    scopeDesc: '指定机构批量采集 (平台( 网站,微信公众号 );主体( 事业单位 ))',
    institutionName: '台湾省网信办',
    startDate: '2026-02-12',
    endDate: '2026-08-11',
    priority: '顺序采集',
    progress: 40.21,
    completedCount: 1168,
    totalCount: 2905,
    operator: '祝亚林',
    dispatchTime: '2026-08-11 11:30:01',
    finishTime: '-',
    status: '进行中',
    accountDetails: [
      {
        id: 1,
        name: '台北科技大学官方网站',
        platform: '网站',
        subjectType: '事业单位',
        status: '采集中',
        dataCount: 3120,
        startTime: '2026-08-11 11:30:01',
        finishTime: '-',
      },
      {
        id: 2,
        name: '台湾教育发展研究中心',
        platform: '微信公众号',
        subjectType: '事业单位',
        status: '待采集',
        dataCount: '-',
        startTime: '-',
        finishTime: '-',
      },
    ],
  },
  {
    id: 6,
    taskId: 59,
    scopeType: 'batch',
    scopeDesc: '指定机构批量采集 (平台( 网站,微信公众号 );主体( 党政机关 ))',
    institutionName: '中共佛山市委网络安全和信息化委员会办公室',
    startDate: '2026-02-11',
    endDate: '2026-08-10',
    priority: '优先采集',
    progress: 100,
    completedCount: 254,
    totalCount: 254,
    operator: '祝亚林',
    dispatchTime: '2026-08-10 16:16:04',
    finishTime: '2026-08-10 23:28:37',
    status: '已完成',
    accountDetails: [
      {
        id: 1,
        name: '佛山市人民政府网',
        platform: '网站',
        subjectType: '党政机关',
        status: '采集成功',
        dataCount: 4210,
        startTime: '2026-08-10 16:16:04',
        finishTime: '2026-08-10 17:10:02',
      },
    ],
  },
  {
    id: 7,
    taskId: 58,
    scopeType: 'specific',
    scopeDesc: '指定具体台账采集',
    institutionName: '台湾省网信办',
    startDate: '2025-08-10',
    endDate: '2026-08-10',
    priority: '顺序采集',
    progress: 100,
    completedCount: 1,
    totalCount: 1,
    operator: '张小东',
    dispatchTime: '2026-08-10 13:31:00',
    finishTime: '2026-08-10 13:31:07',
    status: '已完成',
  },
  {
    id: 8,
    taskId: 57,
    scopeType: 'specific',
    scopeDesc: '指定具体台账采集',
    institutionName: '台湾省网信办',
    startDate: '2025-08-10',
    endDate: '2026-08-10',
    priority: '顺序采集',
    progress: 100,
    completedCount: 1,
    totalCount: 1,
    operator: '张小东',
    dispatchTime: '2026-08-10 13:26:23',
    finishTime: '2026-08-10 13:26:46',
    status: '已完成',
  },
  {
    id: 9,
    taskId: 56,
    scopeType: 'specific',
    scopeDesc: '指定具体台账采集',
    institutionName: '台湾省网信办',
    startDate: '2025-08-10',
    endDate: '2026-08-10',
    priority: '顺序采集',
    progress: 100,
    completedCount: 1,
    totalCount: 1,
    operator: '张小东',
    dispatchTime: '2026-08-10 13:24:41',
    finishTime: '2026-08-10 13:24:45',
    status: '已完成',
  },
];

const AVAILABLE_INSTITUTIONS = [
  '中共陕西省委网络安全和信息化委员会办公室',
  '中共佛山市委网络安全和信息化委员会办公室',
  '台湾省网信办',
  '西安市雁塔区委网信办',
  '宝鸡市委网络安全和信息化委员会办公室',
  '咸阳市委网信办',
  '汉中市委网信办',
  '渭南市委网络安全和信息化委员会办公室',
  '延安市委网络安全和信息化委员会办公室',
  '榆林市委网络安全和信息化委员会办公室',
];

const AVAILABLE_LEDGERS = [
  { id: '1', name: '西安浐灞国际港管理委员会', platform: '网站' },
  { id: '2', name: '定边县文艺网展', platform: '网站' },
  { id: '3', name: '上海市宜川中学附属学校', platform: '网站' },
  { id: '4', name: '榆林市横山区人民代表大会常务委员会办公室', platform: '网站' },
  { id: '5', name: '西安市华山中心医院', platform: '网站' },
  { id: '6', name: '商南档案信息网', platform: '网站' },
  { id: '7', name: '铜川市耀州区人民医院', platform: '网站' },
  { id: '8', name: '陕西网信政务发布', platform: '微信公众号' },
  { id: '9', name: '网信佛山发布', platform: '微信公众号' },
  { id: '10', name: '台湾省政务在线', platform: '网站' },
];

const SUBJECT_TYPES = [
  '全部',
  '军队机构',
  '党政机关',
  '事业单位',
  '个人',
  '社会组织',
  '境外机构',
  '国内媒体',
  '国有企业',
  '非国有企业',
];

interface HistoryDataCollectViewProps {
  onBackToInstitution?: () => void;
}

export const HistoryDataCollectView: React.FC<HistoryDataCollectViewProps> = ({
  onBackToInstitution,
}) => {
  // Tasks list state
  const [tasks, setTasks] = useState<HistoryCollectTask[]>(INITIAL_HISTORY_TASKS);

  // Search Filter state
  const [instFilter, setInstFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Selected Detail Task View state
  const [detailTask, setDetailTask] = useState<HistoryCollectTask | null>(null);

  // Create Task Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalScopeTab, setModalScopeTab] = useState<'batch' | 'specific'>('batch');
  const [modalSelectedInst, setModalSelectedInst] = useState('');
  const [modalInstSearch, setModalInstSearch] = useState('');
  const [isInstDropdownOpen, setIsInstDropdownOpen] = useState(false);

  // Tab 1 (Batch) fields
  const [modalPlatformType, setModalPlatformType] = useState<'全部' | '网站' | '微信公众号'>('全部');
  const [modalSelectedSubjectTypes, setModalSelectedSubjectTypes] = useState<string[]>(['全部']);

  // Tab 2 (Specific) fields
  const [modalSelectedLedgerIds, setModalSelectedLedgerIds] = useState<string[]>([]);
  const [modalLedgerSearch, setModalLedgerSearch] = useState('');
  const [isLedgerDropdownOpen, setIsLedgerDropdownOpen] = useState(false);

  // Date range and quick preset
  const [quickDatePreset, setQuickDatePreset] = useState<'近半年' | '近一年' | '近两年' | '近三年' | '近五年'>('近一年');
  const [modalStartDate, setModalStartDate] = useState('2025-08-19');
  const [modalEndDate, setModalEndDate] = useState('2026-08-19');

  // Priority
  const [modalPriority, setModalPriority] = useState<'顺序采集' | '优先采集'>('顺序采集');

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Preset Date Calculation
  const handleSelectQuickPreset = (preset: '近半年' | '近一年' | '近两年' | '近三年' | '近五年') => {
    setQuickDatePreset(preset);
    const end = new Date('2026-08-19');
    const start = new Date(end);

    if (preset === '近半年') {
      start.setMonth(start.getMonth() - 6);
    } else if (preset === '近一年') {
      start.setFullYear(start.getFullYear() - 1);
    } else if (preset === '近两年') {
      start.setFullYear(start.getFullYear() - 2);
    } else if (preset === '近三年') {
      start.setFullYear(start.getFullYear() - 3);
    } else if (preset === '近五年') {
      start.setFullYear(start.getFullYear() - 5);
    }

    const format = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setModalStartDate(format(start));
    setModalEndDate(format(end));
  };

  // Toggle Subject Type in Tab 1
  const handleToggleSubjectType = (type: string) => {
    if (type === '全部') {
      setModalSelectedSubjectTypes(['全部']);
    } else {
      const withoutAll = modalSelectedSubjectTypes.filter(t => t !== '全部');
      if (withoutAll.includes(type)) {
        const next = withoutAll.filter(t => t !== type);
        setModalSelectedSubjectTypes(next.length === 0 ? ['全部'] : next);
      } else {
        setModalSelectedSubjectTypes([...withoutAll, type]);
      }
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setModalScopeTab('batch');
    setModalSelectedInst('');
    setModalInstSearch('');
    setModalPlatformType('全部');
    setModalSelectedSubjectTypes(['全部']);
    setModalSelectedLedgerIds([]);
    setModalLedgerSearch('');
    handleSelectQuickPreset('近一年');
    setModalPriority('顺序采集');
    setIsCreateModalOpen(true);
  };

  // Submit Create Task
  const handleConfirmCreateTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!modalSelectedInst) {
      alert('请选择需要采集的机构');
      return;
    }

    if (modalScopeTab === 'specific' && modalSelectedLedgerIds.length === 0) {
      alert('请至少选择一个具体台账');
      return;
    }

    const nextTaskId = Math.max(...tasks.map(t => t.taskId), 64) + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    let scopeDesc = '';
    let totalCount = 1;
    let details: HistoryAccountDetail[] = [];

    if (modalScopeTab === 'batch') {
      const subjectsStr = modalSelectedSubjectTypes.join(',');
      scopeDesc = `指定机构批量采集 (平台( ${modalPlatformType === '全部' ? '网站,微信公众号' : modalPlatformType} );主体( ${subjectsStr} ))`;
      totalCount = Math.floor(Math.random() * 800) + 150;
      details = [
        {
          id: 1,
          name: `${modalSelectedInst}门户网站`,
          platform: '网站',
          subjectType: '党政机关',
          status: '采集中',
          dataCount: 0,
          startTime: nowStr,
          finishTime: '-',
        },
        {
          id: 2,
          name: `${modalSelectedInst}官方公众号`,
          platform: '微信公众号',
          subjectType: '事业单位',
          status: '待采集',
          dataCount: '-',
          startTime: '-',
          finishTime: '-',
        },
      ];
    } else {
      scopeDesc = '指定具体台账采集';
      totalCount = modalSelectedLedgerIds.length;
      details = modalSelectedLedgerIds.map((id, idx) => {
        const item = AVAILABLE_LEDGERS.find(l => l.id === id);
        return {
          id: idx + 1,
          name: item?.name || '指定台账',
          platform: (item?.platform as any) || '网站',
          subjectType: '党政机关',
          status: idx === 0 ? '采集中' : '待采集',
          dataCount: idx === 0 ? 0 : '-',
          startTime: idx === 0 ? nowStr : '-',
          finishTime: '-',
        };
      });
    }

    const newTask: HistoryCollectTask = {
      id: Date.now(),
      taskId: nextTaskId,
      scopeType: modalScopeTab,
      scopeDesc,
      institutionName: modalSelectedInst,
      startDate: modalStartDate,
      endDate: modalEndDate,
      priority: modalPriority,
      progress: 0,
      completedCount: 0,
      totalCount,
      operator: '管理员',
      dispatchTime: `下发: ${nowStr}`,
      finishTime: '完成: -',
      status: '进行中',
      accountDetails: details,
    };

    setTasks([newTask, ...tasks]);
    setIsCreateModalOpen(false);
    showToast(`成功创建历史采集任务 (任务ID: ${nextTaskId})，系统已启动自动化采集`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setInstFilter('');
    setOperatorFilter('');
    setStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Filtered Task List
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (instFilter && !task.institutionName.toLowerCase().includes(instFilter.toLowerCase())) return false;
      if (operatorFilter && !task.operator.toLowerCase().includes(operatorFilter.toLowerCase())) return false;
      if (statusFilter && task.status !== statusFilter) return false;
      if (startDateFilter && task.dispatchTime < startDateFilter) return false;
      if (endDateFilter && task.dispatchTime > endDateFilter) return false;
      return true;
    });
  }, [tasks, instFilter, operatorFilter, statusFilter, startDateFilter, endDateFilter]);

  // Filtered institutions for search dropdown
  const filteredInstOptions = useMemo(() => {
    if (!modalInstSearch) return AVAILABLE_INSTITUTIONS;
    return AVAILABLE_INSTITUTIONS.filter(i => i.toLowerCase().includes(modalInstSearch.toLowerCase()));
  }, [modalInstSearch]);

  // Filtered ledgers for search dropdown
  const filteredLedgerOptions = useMemo(() => {
    if (!modalLedgerSearch) return AVAILABLE_LEDGERS;
    return AVAILABLE_LEDGERS.filter(l => l.name.toLowerCase().includes(modalLedgerSearch.toLowerCase()));
  }, [modalLedgerSearch]);

  // ----------------------------------------------------
  // VIEW 2: Detail View (Image 2)
  // ----------------------------------------------------
  if (detailTask) {
    const details = detailTask.accountDetails || [
      {
        id: 1,
        name: `${detailTask.institutionName}主要门户`,
        platform: '网站',
        subjectType: '事业单位',
        status: '采集成功',
        dataCount: 1280,
        startTime: detailTask.dispatchTime.replace('下发: ', ''),
        finishTime: detailTask.finishTime.replace('完成: ', '') || '-',
      },
    ];

    const completed = details.filter(d => d.status === '采集成功').length || detailTask.completedCount;
    const inProgressOrPending = details.filter(d => d.status === '采集中' || d.status === '待采集').length || Math.max(0, detailTask.totalCount - completed);
    const failed = details.filter(d => d.status === '采集失败').length || 0;

    return (
      <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 min-h-0 text-[#333]">
        {/* Top Header with Back */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setDetailTask(null)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-[#1677ff] cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-chevron-left mr-1.5 text-xs"></i>
            <span>详情</span>
          </button>
        </div>

        {/* Status Summary Banner Card (Image 2) */}
        <div className="rounded-lg border border-[#d6e4ff] bg-gradient-to-r from-[#eef5ff] via-[#f4f8ff] to-[#e8f1ff] p-6 mb-6 shadow-xs relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
            <i className="fa-solid fa-clock-rotate-left text-9xl text-blue-600"></i>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center relative z-10">
            {/* Left: Overall Total & Progress */}
            <div className="col-span-5 border-r border-[#d6e4ff]/80 pr-6 space-y-3">
              <div className="inline-flex items-center space-x-1.5 bg-blue-100/60 text-[#1677ff] text-xs px-2.5 py-1 rounded-full font-medium">
                <i className="fa-solid fa-layer-group text-[11px]"></i>
                <span>全部台账</span>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {detailTask.totalCount.toLocaleString()}
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center space-x-1.5 text-gray-700 font-medium">
                    <i className="fa-solid fa-arrows-rotate text-[#1677ff] text-[11px]"></i>
                    <span>整体自动化采集进度</span>
                  </span>
                  <span className="font-bold text-gray-900">{detailTask.progress}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      detailTask.progress === 100 ? 'bg-[#52c41a]' : 'bg-[#1677ff]'
                    }`}
                    style={{ width: `${detailTask.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right: 3 Metric Cards (采集完成, 采集中/待采集, 采集失败) */}
            <div className="col-span-7 grid grid-cols-3 gap-4 pl-2">
              {/* Metric 1: 采集完成 */}
              <div className="bg-white/90 border border-gray-100 rounded-lg p-4 shadow-2xs space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-5 h-5 rounded bg-blue-500 text-white flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <span className="font-medium">采集完成</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {completed.toLocaleString()}
                </div>
              </div>

              {/* Metric 2: 采集中/待采集 */}
              <div className="bg-white/90 border border-gray-100 rounded-lg p-4 shadow-2xs space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-5 h-5 rounded bg-cyan-500 text-white flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <span className="font-medium">采集中/待采集</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {inProgressOrPending.toLocaleString()}
                </div>
              </div>

              {/* Metric 3: 采集失败 */}
              <div className="bg-white/90 border border-gray-100 rounded-lg p-4 shadow-2xs space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-5 h-5 rounded bg-red-500 text-white flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-exclamation"></i>
                  </div>
                  <span className="font-medium">采集失败</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {failed.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading: 采集历史台账明细 */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
          <h3 className="text-sm font-bold text-gray-800">采集历史台账明细</h3>
        </div>

        {/* Detail Table */}
        <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs table-fixed">
              <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
                <tr>
                  <th className="px-3 py-2.5 font-medium w-[60px] text-center whitespace-nowrap">序号</th>
                  <th className="px-4 py-2.5 font-medium w-[28%] whitespace-nowrap">台账名称</th>
                  <th className="px-4 py-2.5 font-medium w-[15%] whitespace-nowrap">主体类型</th>
                  <th className="px-4 py-2.5 font-medium w-[15%] whitespace-nowrap">采集状态</th>
                  <th className="px-4 py-2.5 font-medium w-[14%] whitespace-nowrap">抓取数据量</th>
                  <th className="px-4 py-2.5 font-medium w-[15%] whitespace-nowrap">开始采集时间</th>
                  <th className="px-4 py-2.5 font-medium w-[15%] whitespace-nowrap">完成时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0] text-gray-600">
                {details.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                    {/* 序号 */}
                    <td className="px-3 py-3 text-center text-gray-500 font-normal align-middle">
                      {idx + 1}
                    </td>

                    {/* 台账名称 */}
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-start space-x-2">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-100 text-[#1677ff] flex items-center justify-center flex-shrink-0 text-[10px]">
                          {item.platform === '微信公众号' ? (
                            <i className="fa-brands fa-weixin text-green-600"></i>
                          ) : (
                            <i className="fa-solid fa-globe text-[#1677ff]"></i>
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <button className="text-[#1677ff] hover:underline font-medium text-left truncate block max-w-full cursor-pointer">
                            {item.name}
                          </button>
                          <div className="text-[11px] text-gray-400">{item.platform}</div>
                        </div>
                      </div>
                    </td>

                    {/* 主体类型 */}
                    <td className="px-4 py-3 text-gray-700 align-middle">
                      {item.subjectType}
                    </td>

                    {/* 采集状态 */}
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      {item.status === '采集中' ? (
                        <span className="inline-flex items-center space-x-1.5 text-blue-600 font-medium text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          <span>采集中</span>
                        </span>
                      ) : item.status === '待采集' ? (
                        <span className="inline-flex items-center space-x-1.5 text-amber-600 font-medium text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>待采集</span>
                        </span>
                      ) : item.status === '采集成功' ? (
                        <span className="inline-flex items-center space-x-1.5 text-green-600 font-medium text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          <span>已完成</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 text-red-600 font-medium text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span>采集失败</span>
                        </span>
                      )}
                    </td>

                    {/* 抓取数据量 */}
                    <td className="px-4 py-3 text-gray-700 font-mono align-middle">
                      {typeof item.dataCount === 'number' ? item.dataCount.toLocaleString() : '-'}
                    </td>

                    {/* 开始采集时间 */}
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px] align-middle whitespace-nowrap">
                      {item.startTime}
                    </td>

                    {/* 完成时间 */}
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px] align-middle whitespace-nowrap">
                      {item.finishTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#e8e8e8] bg-[#fafafa] text-xs text-gray-600">
            <div>
              共 <strong className="text-gray-800 font-medium">{details.length}</strong> 条台账采集记录
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <span>第 1 / 1 页</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 1: Main History Task List (Image 1)
  // ----------------------------------------------------
  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 min-h-0 text-[#333] relative">
      {/* Page Title & Create Task Button (Image 1) */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-bold text-gray-800">历史数据采集</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-4 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs font-medium"
          >
            <i className="fa-solid fa-plus text-[11px]"></i>
            <span>创建历史采集任务</span>
          </button>
        </div>
      </div>

      {/* Filter Card (Image 1) */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 mb-4 shadow-2xs space-y-3 text-xs">
        {/* Filter Input Row */}
        <div className="grid grid-cols-4 gap-4">
          {/* 机构名称 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">机构名称</span>
            <input
              type="text"
              value={instFilter}
              maxLength={100}
              onChange={e => setInstFilter(e.target.value)}
              placeholder="请输入机构名称"
              className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <span className="text-[10px] text-gray-400 select-none ml-1 whitespace-nowrap">
              {instFilter.length}/100
            </span>
          </div>

          {/* 操作人 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">操作人</span>
            <input
              type="text"
              value={operatorFilter}
              onChange={e => setOperatorFilter(e.target.value)}
              placeholder="请输入"
              className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* 采集状态 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">采集状态</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">请选择</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
              <option value="采集失败">采集失败</option>
            </select>
          </div>

          {/* 操作时间 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20 space-x-1.5">
            <span className="text-gray-600 font-medium whitespace-nowrap select-none">操作时间</span>
            <input
              type="date"
              value={startDateFilter}
              onChange={e => setStartDateFilter(e.target.value)}
              className="text-xs text-gray-700 focus:outline-none bg-transparent w-24"
              placeholder="开始日期"
            />
            <span className="text-gray-400">~</span>
            <input
              type="date"
              value={endDateFilter}
              onChange={e => setEndDateFilter(e.target.value)}
              className="text-xs text-gray-700 focus:outline-none bg-transparent w-24"
              placeholder="结束日期"
            />
            <i className="fa-regular fa-calendar text-gray-400 text-xs ml-auto"></i>
          </div>
        </div>

        {/* Action Buttons Aligned Right (Image 1) */}
        <div className="flex justify-end items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={() => {}}
            className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
          >
            <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
            <span>查询</span>
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="border border-[#d9d9d9] bg-white hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
          >
            <i className="fa-solid fa-rotate-right text-[11px]"></i>
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Main Task List Table (Image 1) */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-2 py-2.5 font-medium w-[45px] text-center whitespace-nowrap">序号</th>
                <th className="px-2 py-2.5 font-medium w-[55px] text-center whitespace-nowrap">任务ID</th>
                <th className="px-3 py-2.5 font-medium w-[22%] whitespace-nowrap">历史采集范围</th>
                <th className="px-3 py-2.5 font-medium w-[18%] whitespace-nowrap">关联机构</th>
                <th className="px-3 py-2.5 font-medium w-[110px] whitespace-nowrap">历史采集时间</th>
                <th className="px-2 py-2.5 font-medium w-[80px] text-center whitespace-nowrap">采集优先级</th>
                <th className="px-3 py-2.5 font-medium w-[150px] whitespace-nowrap">采集进度</th>
                <th className="px-2 py-2.5 font-medium w-[70px] text-center whitespace-nowrap">台账数量</th>
                <th className="px-2 py-2.5 font-medium w-[70px] text-center whitespace-nowrap">操作人</th>
                <th className="px-3 py-2.5 font-medium w-[150px] whitespace-nowrap">操作时间</th>
                <th className="px-2 py-2.5 font-medium w-[80px] text-center whitespace-nowrap">采集状态</th>
                <th className="px-2 py-2.5 font-medium w-[55px] text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-gray-600">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                      <span>暂无历史采集任务</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => {
                  return (
                    <tr key={task.id} className="hover:bg-[#fafafa] transition-colors">
                      {/* 序号 */}
                      <td className="px-2 py-3.5 text-center text-gray-500 font-normal align-middle">
                        {index + 1}
                      </td>

                      {/* 任务ID */}
                      <td className="px-2 py-3.5 text-center text-gray-700 font-mono align-middle">
                        {task.taskId}
                      </td>

                      {/* 历史采集范围 */}
                      <td className="px-3 py-3.5 align-middle">
                        <div className="text-gray-800 line-clamp-2 leading-relaxed" title={task.scopeDesc}>
                          {task.scopeDesc}
                        </div>
                      </td>

                      {/* 关联机构 */}
                      <td className="px-3 py-3.5 align-middle">
                        <div className="flex items-center space-x-1.5 text-gray-800 truncate" title={task.institutionName}>
                          <i className="fa-solid fa-chart-simple text-gray-400 text-[11px] flex-shrink-0"></i>
                          <span className="truncate font-normal">{task.institutionName}</span>
                        </div>
                      </td>

                      {/* 历史采集时间 */}
                      <td className="px-3 py-3.5 font-mono text-[11px] text-gray-600 align-middle whitespace-nowrap space-y-0.5">
                        <div>始: {task.startDate}</div>
                        <div>止: {task.endDate}</div>
                      </td>

                      {/* 采集优先级 */}
                      <td className="px-2 py-3.5 text-center align-middle whitespace-nowrap">
                        {task.priority === '顺序采集' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-blue-50 text-[#1677ff] border border-blue-200">
                            顺序采集
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal bg-green-50 text-green-600 border border-green-200">
                            优先采集
                          </span>
                        )}
                      </td>

                      {/* 采集进度 */}
                      <td className="px-3 py-3.5 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={task.progress === 100 ? 'text-[#52c41a] font-bold' : 'text-[#1677ff] font-bold'}>
                              {task.progress}%
                            </span>
                            <span className="text-gray-400 font-mono text-[10px]">
                              {task.completedCount.toLocaleString()}/{task.totalCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                task.progress === 100 ? 'bg-[#52c41a]' : 'bg-[#1677ff]'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* 台账数量 */}
                      <td className="px-2 py-3.5 text-center text-gray-700 font-mono align-middle">
                        {task.totalCount.toLocaleString()}
                      </td>

                      {/* 操作人 */}
                      <td className="px-2 py-3.5 text-center text-gray-700 align-middle whitespace-nowrap">
                        {task.operator}
                      </td>

                      {/* 操作时间 */}
                      <td className="px-3 py-3.5 font-mono text-[11px] text-gray-500 align-middle whitespace-nowrap space-y-0.5">
                        <div>{task.dispatchTime}</div>
                        <div>{task.finishTime}</div>
                      </td>

                      {/* 采集状态 */}
                      <td className="px-2 py-3.5 text-center align-middle whitespace-nowrap">
                        {task.status === '进行中' ? (
                          <span className="inline-flex items-center space-x-1 text-[#1677ff] font-medium text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1677ff] animate-pulse"></span>
                            <span>进行中</span>
                          </span>
                        ) : task.status === '已完成' ? (
                          <span className="inline-flex items-center space-x-1 text-[#52c41a] font-medium text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#52c41a]"></span>
                            <span>已完成</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[#ff4d4f] font-medium text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4f]"></span>
                            <span>采集失败</span>
                          </span>
                        )}
                      </td>

                      {/* 操作 */}
                      <td className="px-2 py-3.5 text-center align-middle whitespace-nowrap">
                        <button
                          onClick={() => setDetailTask(task)}
                          className="text-[#1677ff] hover:underline cursor-pointer font-medium"
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#e8e8e8] bg-[#fafafa] text-xs text-gray-600">
          <div>
            共 <strong className="text-gray-800 font-medium">{filteredTasks.length}</strong> 条历史采集任务
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <span>第 1 / 1 页</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Modal: 创建历史采集任务 (Image 3 & 4) */}
      {/* ---------------------------------------------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setIsCreateModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-2xl w-[680px] max-w-[92vw] max-h-[90vh] flex flex-col z-10 overflow-hidden text-[#333]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-base font-bold text-gray-800">创建历史采集任务</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmCreateTask} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Section 1: 选定历史采集范围 (Image 3 & 4) */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">选定历史采集范围</h4>
                </div>

                {/* Scope Switcher Tabs */}
                <div className="grid grid-cols-2 gap-0 border border-[#1677ff] rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setModalScopeTab('batch')}
                    className={`py-2 text-center text-xs font-medium cursor-pointer transition-colors ${
                      modalScopeTab === 'batch'
                        ? 'bg-white text-[#1677ff] border-r border-[#1677ff]'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-r border-gray-200'
                    }`}
                  >
                    指定机构批量采集
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalScopeTab('specific')}
                    className={`py-2 text-center text-xs font-medium cursor-pointer transition-colors ${
                      modalScopeTab === 'specific'
                        ? 'bg-white text-[#1677ff]'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    指定具体台账采集
                  </button>
                </div>

                {/* Tab 1: 指定机构批量采集 (Image 3) */}
                {modalScopeTab === 'batch' ? (
                  <div className="space-y-3.5 pt-1">
                    {/* 选择机构 */}
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-medium flex items-center">
                        <span className="text-red-500 mr-1">*</span> 选择机构
                      </label>
                      <div className="relative">
                        <div
                          onClick={() => setIsInstDropdownOpen(!isInstDropdownOpen)}
                          className="w-full border border-[#d9d9d9] rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer focus-within:border-[#1677ff]"
                        >
                          <span className={modalSelectedInst ? 'text-gray-800' : 'text-gray-400'}>
                            {modalSelectedInst || '请搜索选择机构'}
                          </span>
                          <i className="fa-solid fa-angle-down text-gray-400 text-xs"></i>
                        </div>

                        {/* Dropdown Menu */}
                        {isInstDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto z-30 p-1">
                            <div className="p-1.5 border-b border-gray-100">
                              <input
                                type="text"
                                value={modalInstSearch}
                                onChange={e => setModalInstSearch(e.target.value)}
                                placeholder="输入关键字搜索机构..."
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#1677ff]"
                                autoFocus
                              />
                            </div>
                            {filteredInstOptions.map(inst => (
                              <div
                                key={inst}
                                onClick={() => {
                                  setModalSelectedInst(inst);
                                  setIsInstDropdownOpen(false);
                                }}
                                className={`px-3 py-2 text-xs cursor-pointer rounded hover:bg-[#f0f7ff] hover:text-[#1677ff] transition-colors ${
                                  modalSelectedInst === inst ? 'bg-[#f0f7ff] text-[#1677ff] font-medium' : 'text-gray-700'
                                }`}
                              >
                                {inst}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 平台类型 (Image 3) */}
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-medium flex items-center">
                        <span className="text-red-500 mr-1">*</span> 平台类型
                      </label>
                      <div className="flex items-center space-x-3">
                        {(['全部', '网站', '微信公众号'] as const).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setModalPlatformType(p)}
                            className={`px-5 py-1.5 rounded text-xs transition-colors cursor-pointer border ${
                              modalPlatformType === p
                                ? 'border-[#1677ff] text-[#1677ff] bg-[#f0f7ff] font-medium shadow-2xs'
                                : 'border-[#d9d9d9] text-gray-700 bg-white hover:border-gray-400'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 主体类型 (Image 3) */}
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-medium flex items-center">
                        <span className="text-red-500 mr-1">*</span> 主体类型
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {SUBJECT_TYPES.map(type => {
                          const isSelected = modalSelectedSubjectTypes.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleToggleSubjectType(type)}
                              className={`py-1.5 px-1 text-center rounded text-xs transition-colors cursor-pointer border truncate ${
                                isSelected
                                  ? 'border-[#1677ff] text-[#1677ff] bg-[#f0f7ff] font-medium'
                                  : 'border-[#d9d9d9] text-gray-700 bg-white hover:border-gray-400'
                              }`}
                              title={type}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Tab 2: 指定具体台账采集 (Image 4) */
                  <div className="space-y-3.5 pt-1">
                    {/* 选择机构 */}
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-medium flex items-center">
                        <span className="text-red-500 mr-1">*</span> 选择机构
                      </label>
                      <div className="relative">
                        <div
                          onClick={() => setIsInstDropdownOpen(!isInstDropdownOpen)}
                          className="w-full border border-[#d9d9d9] rounded px-3 py-2 bg-white flex items-center justify-between cursor-pointer focus-within:border-[#1677ff]"
                        >
                          <span className={modalSelectedInst ? 'text-gray-800' : 'text-gray-400'}>
                            {modalSelectedInst || '请搜索选择机构'}
                          </span>
                          <i className="fa-solid fa-angle-down text-gray-400 text-xs"></i>
                        </div>

                        {isInstDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto z-30 p-1">
                            <div className="p-1.5 border-b border-gray-100">
                              <input
                                type="text"
                                value={modalInstSearch}
                                onChange={e => setModalInstSearch(e.target.value)}
                                placeholder="输入关键字搜索机构..."
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#1677ff]"
                                autoFocus
                              />
                            </div>
                            {filteredInstOptions.map(inst => (
                              <div
                                key={inst}
                                onClick={() => {
                                  setModalSelectedInst(inst);
                                  setIsInstDropdownOpen(false);
                                }}
                                className={`px-3 py-2 text-xs cursor-pointer rounded hover:bg-[#f0f7ff] hover:text-[#1677ff] transition-colors ${
                                  modalSelectedInst === inst ? 'bg-[#f0f7ff] text-[#1677ff] font-medium' : 'text-gray-700'
                                }`}
                              >
                                {inst}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 选择台账 (多选) */}
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-medium flex items-center">
                        <span className="text-red-500 mr-1">*</span> 选择台账
                      </label>
                      <div className="relative">
                        <div
                          onClick={() => setIsLedgerDropdownOpen(!isLedgerDropdownOpen)}
                          className="w-full min-h-[38px] border border-[#d9d9d9] rounded px-3 py-1.5 bg-white flex flex-wrap items-center gap-1.5 cursor-pointer focus-within:border-[#1677ff]"
                        >
                          {modalSelectedLedgerIds.length === 0 ? (
                            <span className="text-gray-400">请搜索选择台账，可多选（仅支持网站和微信公众号）</span>
                          ) : (
                            modalSelectedLedgerIds.map(id => {
                              const ledger = AVAILABLE_LEDGERS.find(l => l.id === id);
                              return (
                                <span
                                  key={id}
                                  className="inline-flex items-center space-x-1 bg-[#f0f7ff] text-[#1677ff] border border-blue-200 px-2 py-0.5 rounded text-[11px]"
                                >
                                  <span>{ledger?.name}</span>
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setModalSelectedLedgerIds(modalSelectedLedgerIds.filter(i => i !== id));
                                    }}
                                    className="hover:text-red-500 font-bold ml-1"
                                  >
                                    &times;
                                  </button>
                                </span>
                              );
                            })
                          )}
                          <i className="fa-solid fa-angle-down text-gray-400 text-xs ml-auto"></i>
                        </div>

                        {/* Ledger Multi-select Dropdown */}
                        {isLedgerDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-52 overflow-y-auto z-30 p-1">
                            <div className="p-1.5 border-b border-gray-100">
                              <input
                                type="text"
                                value={modalLedgerSearch}
                                onChange={e => setModalLedgerSearch(e.target.value)}
                                placeholder="输入关键字筛选台账..."
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#1677ff]"
                                autoFocus
                              />
                            </div>
                            {filteredLedgerOptions.map(l => {
                              const isChecked = modalSelectedLedgerIds.includes(l.id);
                              return (
                                <div
                                  key={l.id}
                                  onClick={() => {
                                    if (isChecked) {
                                      setModalSelectedLedgerIds(modalSelectedLedgerIds.filter(i => i !== l.id));
                                    } else {
                                      setModalSelectedLedgerIds([...modalSelectedLedgerIds, l.id]);
                                    }
                                  }}
                                  className="px-3 py-2 text-xs cursor-pointer rounded hover:bg-[#f0f7ff] flex items-center justify-between transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}}
                                      className="rounded text-[#1677ff] cursor-pointer"
                                    />
                                    <span className="text-gray-800">{l.name}</span>
                                  </div>
                                  <span className="text-[11px] text-gray-400">{l.platform}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: 配置历史采集时间 (Image 3 & 4) */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">配置历史采集时间</h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-medium flex items-center">
                    <span className="text-red-500 mr-1">*</span> 时间选择
                  </label>
                  <div className="flex items-center space-x-3">
                    {/* Date Input with calendar icon */}
                    <div className="flex items-center border border-[#d9d9d9] rounded px-3 py-1.5 bg-white space-x-2 focus-within:border-[#1677ff]">
                      <input
                        type="date"
                        value={modalStartDate}
                        onChange={e => setModalStartDate(e.target.value)}
                        className="text-xs text-gray-800 focus:outline-none bg-transparent"
                      />
                      <span className="text-gray-400">~</span>
                      <input
                        type="date"
                        value={modalEndDate}
                        onChange={e => setModalEndDate(e.target.value)}
                        className="text-xs text-gray-800 focus:outline-none bg-transparent"
                      />
                      <i className="fa-regular fa-calendar text-gray-400 text-xs ml-1"></i>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center space-x-1.5">
                      {(['近半年', '近一年', '近两年', '近三年', '近五年'] as const).map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleSelectQuickPreset(preset)}
                          className={`px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer border ${
                            quickDatePreset === preset
                              ? 'border-[#1677ff] text-[#1677ff] bg-[#f0f7ff] font-medium'
                              : 'border-[#d9d9d9] text-gray-600 bg-white hover:border-gray-400'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: 配置采集优先级 (Image 3 & 4) */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">配置采集优先级</h4>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="priority"
                      checked={modalPriority === '顺序采集'}
                      onChange={() => setModalPriority('顺序采集')}
                      className="text-[#1677ff] cursor-pointer"
                    />
                    <span className="text-gray-700 text-xs">顺序采集</span>
                  </label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="priority"
                      checked={modalPriority === '优先采集'}
                      onChange={() => setModalPriority('优先采集')}
                      className="text-[#1677ff] cursor-pointer"
                    />
                    <span className="text-gray-700 text-xs">优先采集</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] rounded text-xs text-white font-medium cursor-pointer transition-colors shadow-xs"
                >
                  确定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1677ff] text-white px-4 py-3 rounded shadow-xl flex items-center space-x-3 text-xs animate-in slide-in-from-bottom-2 duration-200">
          <i className="fa-solid fa-circle-check text-base"></i>
          <span>{toastMsg}</span>
          <button
            onClick={() => setToastMsg(null)}
            className="text-white/80 hover:text-white ml-2 text-sm leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};
