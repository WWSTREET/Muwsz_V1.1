import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface SpecialInstitutionItem {
  id: number;
  name: string;
  region: string;
  isTrial: boolean;
  category: string; // e.g. '一类'
  deptType: string; // e.g. '网信部门' | '宣传部' | '网安部门'
  totalActions: number;
  instActions: number;
  unifiedActions: number;
  runningActions: number;
  closedActions: number;
  permissionStatus: '已开启' | '已关闭';
  remainingTime: string; // e.g. '103天' | '23天' | '22天' | '7天6时'
  startDate: string;
  endDate: string;
  statsUnit: string;
}

export const INITIAL_SPECIAL_INSTITUTIONS: SpecialInstitutionItem[] = [
  {
    id: 1,
    name: '中共陕西省委网络安全和信息化委员会办公室',
    region: '陕西',
    isTrial: true,
    category: '一类',
    deptType: '网信部门',
    totalActions: 2,
    instActions: 1,
    unifiedActions: 1,
    runningActions: 2,
    closedActions: 0,
    permissionStatus: '已开启',
    remainingTime: '103天',
    startDate: '2026-08-14',
    endDate: '2026-11-30',
    statsUnit: '省级网信',
  },
  {
    id: 2,
    name: '中共咸阳市委宣传部',
    region: '陕西/咸阳',
    isTrial: true,
    category: '一类',
    deptType: '宣传部',
    totalActions: 0,
    instActions: 0,
    unifiedActions: 0,
    runningActions: 0,
    closedActions: 0,
    permissionStatus: '已开启',
    remainingTime: '23天',
    startDate: '2026-08-12',
    endDate: '2026-09-11',
    statsUnit: '市级宣传',
  },
  {
    id: 3,
    name: '随州市网信中心（随州市网络安全应急指挥中心、随州市舆情监测中心）',
    region: '湖北/随州市',
    isTrial: true,
    category: '一类',
    deptType: '网信部门',
    totalActions: 0,
    instActions: 0,
    unifiedActions: 0,
    runningActions: 0,
    closedActions: 0,
    permissionStatus: '已开启',
    remainingTime: '23天',
    startDate: '2026-08-12',
    endDate: '2026-09-11',
    statsUnit: '市级网信',
  },
  {
    id: 4,
    name: '南宁市委',
    region: '广西/南宁市',
    isTrial: true,
    category: '一类',
    deptType: '网信部门',
    totalActions: 0,
    instActions: 0,
    unifiedActions: 0,
    runningActions: 0,
    closedActions: 0,
    permissionStatus: '已开启',
    remainingTime: '22天',
    startDate: '2026-08-11',
    endDate: '2026-09-10',
    statsUnit: '市级网信',
  },
  {
    id: 5,
    name: '中共兰州市委网络安全和信息化委员会办公室',
    region: '甘肃/兰州',
    isTrial: true,
    category: '一类',
    deptType: '网信部门',
    totalActions: 0,
    instActions: 0,
    unifiedActions: 0,
    runningActions: 0,
    closedActions: 0,
    permissionStatus: '已开启',
    remainingTime: '22天',
    startDate: '2026-08-11',
    endDate: '2026-09-10',
    statsUnit: '市级网信',
  },
  {
    id: 6,
    name: '阳泉市公安局',
    region: '山西/阳泉市',
    isTrial: true,
    category: '一类',
    deptType: '网安部门',
    totalActions: 4,
    instActions: 4,
    unifiedActions: 0,
    runningActions: 0,
    closedActions: 4,
    permissionStatus: '已开启',
    remainingTime: '7天6时',
    startDate: '2026-08-11',
    endDate: '2026-08-26',
    statsUnit: '市级公安',
  },
];

interface SpecialInstitutionViewProps {
  onBackToInstitution?: () => void;
  onNavigateToPlan?: () => void;
}

export const SpecialInstitutionView: React.FC<SpecialInstitutionViewProps> = ({
  onBackToInstitution,
  onNavigateToPlan,
}) => {
  // Main data list
  const [institutions] = useState<SpecialInstitutionItem[]>(INITIAL_SPECIAL_INSTITUTIONS);

  // Search Filter state (Row 1 & Row 2)
  const [nameFilter, setNameFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');

  // Active detail page state
  const [selectedInst, setSelectedInst] = useState<SpecialInstitutionItem | null>(null);
  const [detailTab, setDetailTab] = useState<'basic' | 'config'>('basic');

  // Detail Tab 1 Date Granularity filter
  const [trendGranularity, setTrendGranularity] = useState<'年' | '月' | '日' | '时'>('日');
  const [actionPlanTab, setActionPlanTab] = useState<'unified' | 'inst'>('unified');

  // Detail Tab 2 Config Form state
  const [maxPlans, setMaxPlans] = useState('30');
  const [maxRunningPlans, setMaxRunningPlans] = useState('5');
  const [maxExportRows, setMaxExportRows] = useState('10000');
  const [cleanupDays, setCleanupDays] = useState('15天');

  // View Plans Modal state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered institutions
  const filteredData = useMemo(() => {
    return institutions.filter(item => {
      if (nameFilter && !item.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      if (regionFilter && !item.region.includes(regionFilter)) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (typeFilter && item.deptType !== typeFilter) return false;
      if (statusFilter && item.permissionStatus !== statusFilter) return false;
      if (unitFilter && !item.statsUnit.includes(unitFilter)) return false;
      if (startDateFilter && item.startDate < startDateFilter) return false;
      if (endDateFilter && item.endDate > endDateFilter) return false;
      return true;
    });
  }, [
    institutions,
    nameFilter,
    regionFilter,
    categoryFilter,
    typeFilter,
    statusFilter,
    unitFilter,
    startDateFilter,
    endDateFilter,
  ]);

  const handleResetFilters = () => {
    setNameFilter('');
    setRegionFilter('');
    setCategoryFilter('');
    setTypeFilter('');
    setStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setUnitFilter('');
  };

  // Handle Save Configuration
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('行动方案配置已成功保存并同步应用');
  };

  // ----------------------------------------------------
  // Chart Data for Detail View (Image 2)
  // ----------------------------------------------------
  const actionTypeData = [
    { name: '机构行动', value: 1, color: '#36cfc9' },
    { name: '统一行动', value: 1, color: '#597ef7' },
  ];

  const inspectModeData = [
    { name: '快速排查', value: 2, color: '#ff7a45' },
  ];

  const actionStatusData = [
    { name: '更新中', value: 2, color: '#36cfc9' },
  ];

  const trendData = [
    { date: '2026-08-13', total: 320, available: 300, rate: 93.75 },
    { date: '2026-08-14', total: 430, available: 410, rate: 95.35 },
    { date: '2026-08-15', total: 260, available: 245, rate: 94.23 },
    { date: '2026-08-16', total: 240, available: 160, rate: 66.67 },
    { date: '2026-08-17', total: 720, available: 260, rate: 36.11 },
    { date: '2026-08-18', total: 80, available: 35, rate: 43.75 },
    { date: '2026-08-19', total: 20, available: 3, rate: 15.0 },
  ];

  const dataAnalysisPie = [
    { name: '不可用数据', value: 2004, color: '#ff7875', percentage: '1.02%' },
    { name: '可用数据', value: 1493, color: '#36cfc9', percentage: '0.76%' },
    { name: '未研判数据', value: 193473, color: '#597ef7', percentage: '98.22%' },
  ];

  // ----------------------------------------------------
  // VIEW 2: Detail Page (Image 2 & Image 3)
  // ----------------------------------------------------
  if (selectedInst) {
    return (
      <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 min-h-0 text-[#333] relative">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedInst(null)}
              className="text-base font-bold text-gray-800 hover:text-[#1677ff] flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
              <span>{selectedInst.name}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsPlanModalOpen(true)}
            className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-4 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs font-medium"
          >
            <i className="fa-regular fa-file-lines text-xs"></i>
            <span>查看方案</span>
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center space-x-8 border-b border-gray-200 mb-5">
          <button
            onClick={() => setDetailTab('basic')}
            className={`pb-2.5 text-xs font-medium cursor-pointer transition-colors relative ${
              detailTab === 'basic' ? 'text-[#1677ff]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            基本情况
            {detailTab === 'basic' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setDetailTab('config')}
            className={`pb-2.5 text-xs font-medium cursor-pointer transition-colors relative ${
              detailTab === 'config' ? 'text-[#1677ff]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            行动方案配置
            {detailTab === 'config' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677ff] rounded-full"></span>
            )}
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: 基本情况 (Image 2) */}
        {/* ==================================================== */}
        {detailTab === 'basic' ? (
          <div className="space-y-5 flex-1 flex flex-col">
            {/* Top 4 Metric Cards */}
            <div className="grid grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-[#f8faff] border border-[#e6f0ff] rounded-lg p-4 shadow-2xs flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center text-lg shadow-xs flex-shrink-0">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">累计行动方案数</div>
                  <div className="text-2xl font-bold text-gray-900">2</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#f4fdfc] border border-[#e0f7f5] rounded-lg p-4 shadow-2xs flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#36cfc9] text-white flex items-center justify-center text-lg shadow-xs flex-shrink-0">
                  <i className="fa-regular fa-file-code"></i>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">运行中方案数</div>
                  <div className="text-2xl font-bold text-gray-900">2</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#fcfaf7] border border-[#f7ede2] rounded-lg p-4 shadow-2xs flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#d48872] text-white flex items-center justify-center text-lg shadow-xs flex-shrink-0">
                  <i className="fa-solid fa-chart-column"></i>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">数据总量</div>
                  <div className="text-2xl font-bold text-gray-900">196,970</div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-[#fff9f8] border border-[#ffedea] rounded-lg p-4 shadow-2xs flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#ff7875] text-white flex items-center justify-center text-lg shadow-xs flex-shrink-0">
                  <i className="fa-regular fa-user"></i>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">人工研判为可用</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">1,493</span>
                    <span className="text-xs text-gray-500 font-normal">0.76%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 1: 3 Donut Charts */}
            <div className="grid grid-cols-3 gap-4">
              {/* Chart 1: 行动类型占比 */}
              <div className="border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">行动类型占比</h4>
                </div>
                <div className="h-44 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={actionTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {actionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-gray-400">总计</span>
                    <span className="text-base font-bold text-gray-800">2</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-600 pt-2 border-t border-gray-50">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#36cfc9]"></span>
                    <span>机构行动: 1 (50%)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#597ef7]"></span>
                    <span>统一行动: 1 (50%)</span>
                  </span>
                </div>
              </div>

              {/* Chart 2: 排查模式偏好 */}
              <div className="border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">排查模式偏好</h4>
                </div>
                <div className="h-44 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inspectModeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={68}
                        dataKey="value"
                      >
                        {inspectModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-gray-400">总计</span>
                    <span className="text-base font-bold text-gray-800">2</span>
                  </div>
                </div>
                <div className="flex justify-center items-center space-x-2 text-xs text-gray-600 pt-2 border-t border-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a45]"></span>
                  <span>快速排查: 2 (100%)</span>
                </div>
              </div>

              {/* Chart 3: 行动状态分布 */}
              <div className="border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">行动状态分布</h4>
                </div>
                <div className="h-44 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={actionStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={68}
                        dataKey="value"
                      >
                        {actionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-gray-400">总计</span>
                    <span className="text-base font-bold text-gray-800">2</span>
                  </div>
                </div>
                <div className="flex justify-center items-center space-x-2 text-xs text-gray-600 pt-2 border-t border-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#36cfc9]"></span>
                  <span>更新中: 2 (100%)</span>
                </div>
              </div>
            </div>

            {/* Row 2: 数据处理趋势 & 数据研判分析 */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left: 数据处理趋势 (7 cols) */}
              <div className="col-span-8 border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                    <h4 className="text-xs font-bold text-gray-800">数据处理趋势</h4>
                  </div>
                  {/* Filters */}
                  <div className="flex items-center space-x-2">
                    <div className="border border-[#d9d9d9] rounded px-2 py-0.5 text-xs flex items-center space-x-1 bg-white">
                      <span>2026-08-13 ~ 2026-08-19</span>
                      <i className="fa-regular fa-calendar text-gray-400 text-[11px]"></i>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      {(['按年', '按月', '按天', '按时'] as const).map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setTrendGranularity(g.replace('按', '') as any)}
                          className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            trendGranularity === g.replace('按', '')
                              ? 'bg-[#1677ff] text-white font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Composed Chart */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#888' }} domain={[0, 800]} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 10, fill: '#888' }}
                        domain={[0, 100]}
                        unit="%"
                      />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar yAxisId="left" dataKey="total" name="数据总量" fill="#1677ff" barSize={12} radius={[2, 2, 0, 0]} />
                      <Bar yAxisId="left" dataKey="available" name="可用数据量" fill="#36cfc9" barSize={12} radius={[2, 2, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="rate" name="可用率" stroke="#1677ff" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: 数据研判分析 (4 cols) */}
              <div className="col-span-4 border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">数据研判分析</h4>
                </div>

                <div className="h-56 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataAnalysisPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {dataAnalysisPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-gray-400">总计</span>
                    <span className="text-sm font-bold text-gray-800">196,970</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  {dataAnalysisPie.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span>{item.name}</span>
                      </span>
                      <span className="font-mono text-gray-800">
                        {item.value.toLocaleString()} ({item.percentage})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: 各平台可用数据排名 & 行动方案分析 */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left: 各平台可用数据排名 */}
              <div className="col-span-6 border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                  <h4 className="text-xs font-bold text-gray-800">各平台可用数据排名</h4>
                </div>

                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  {/* Item 1: 微信公众号 */}
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded bg-green-50 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                      <i className="fa-brands fa-weixin"></i>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#36cfc9] rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-800 w-12 text-right">960</span>
                  </div>

                  {/* Item 2: 网站 / 微博 */}
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded bg-blue-50 text-[#1677ff] flex items-center justify-center text-sm flex-shrink-0">
                      <i className="fa-solid fa-globe"></i>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1677ff] rounded-full" style={{ width: '22%' }}></div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-800 w-12 text-right">216</span>
                  </div>
                </div>
              </div>

              {/* Right: 行动方案分析 */}
              <div className="col-span-6 border border-[#e8e8e8] rounded-lg p-4 bg-white shadow-2xs flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
                    <h4 className="text-xs font-bold text-gray-800">行动方案分析</h4>
                    {/* Tabs */}
                    <div className="flex items-center space-x-1 ml-3">
                      <button
                        onClick={() => setActionPlanTab('unified')}
                        className={`px-2.5 py-0.5 rounded text-xs cursor-pointer transition-colors ${
                          actionPlanTab === 'unified'
                            ? 'bg-[#1677ff] text-white font-medium'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        统一行动
                      </button>
                      <button
                        onClick={() => setActionPlanTab('inst')}
                        className={`px-2.5 py-0.5 rounded text-xs cursor-pointer transition-colors ${
                          actionPlanTab === 'inst'
                            ? 'bg-[#1677ff] text-white font-medium'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        机构行动
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigateToPlan) onNavigateToPlan();
                      else setIsPlanModalOpen(true);
                    }}
                    className="text-xs text-[#1677ff] hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <span>全部行动方案</span>
                    <i className="fa-solid fa-angle-right text-[10px]"></i>
                  </button>
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5 flex-shrink-0 w-24">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold">
                        1
                      </span>
                      <span className="text-xs text-gray-700 truncate">社工部</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1677ff] rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-gray-700 whitespace-nowrap">
                      196,637 / 19
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================== */
          /* TAB 2: 行动方案配置 (Image 3) */
          /* ==================================================== */
          <form onSubmit={handleSaveConfig} className="border border-[#e8e8e8] rounded-lg p-6 bg-white shadow-2xs space-y-6">
            {/* Section Title & Description */}
            <div className="flex items-center space-x-2 pb-2">
              <div className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></div>
              <h4 className="text-xs font-bold text-gray-800">行动方案配置</h4>
              <span className="text-xs text-gray-400 flex items-center space-x-1">
                <i className="fa-regular fa-circle-question"></i>
                <span>设置该机构下用户使用专项行动的限制及数据清理规则</span>
              </span>
            </div>

            {/* Form Fields Row (3 Input Columns) */}
            <div className="grid grid-cols-3 gap-8">
              {/* Field 1: 最大可建方案数 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span> 最大可建方案数
                  </label>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center space-x-1">
                  <i className="fa-regular fa-circle-question text-[10px]"></i>
                  <span>允许机构创建的机构行动方案总数上限</span>
                </div>
                <div className="flex items-center border border-[#d9d9d9] rounded px-3 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
                  <input
                    type="number"
                    value={maxPlans}
                    onChange={e => setMaxPlans(e.target.value)}
                    className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                  />
                  <span className="text-xs text-gray-400 select-none ml-2">个</span>
                </div>
              </div>

              {/* Field 2: 最大可同时运行方案数 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span> 最大可同时运行方案数
                  </label>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center space-x-1">
                  <i className="fa-regular fa-circle-question text-[10px]"></i>
                  <span>同一时间允许并发执行的排查任务数量</span>
                </div>
                <div className="flex items-center border border-[#d9d9d9] rounded px-3 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
                  <input
                    type="number"
                    value={maxRunningPlans}
                    onChange={e => setMaxRunningPlans(e.target.value)}
                    className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                  />
                  <span className="text-xs text-gray-400 select-none ml-2">个</span>
                </div>
              </div>

              {/* Field 3: 最多每次可导出条数 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 flex items-center">
                    <span className="text-red-500 mr-1">*</span> 最多每次可导出条数
                  </label>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center space-x-1">
                  <i className="fa-regular fa-circle-question text-[10px]"></i>
                  <span>专项行动数据每次导出的最大行数限制</span>
                </div>
                <div className="flex items-center border border-[#d9d9d9] rounded px-3 py-1.5 bg-white focus-within:border-[#1677ff] focus-within:ring-1 focus-within:ring-[#1677ff]/20">
                  <input
                    type="number"
                    value={maxExportRows}
                    onChange={e => setMaxExportRows(e.target.value)}
                    className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                  />
                  <span className="text-xs text-gray-400 select-none ml-2">条</span>
                </div>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-dashed border-gray-200 pt-5 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-700">
                <span>行动方案停止</span>
                <select
                  value={cleanupDays}
                  onChange={e => setCleanupDays(e.target.value)}
                  className="border border-[#d9d9d9] rounded px-3 py-1 bg-white text-xs text-gray-800 focus:outline-none cursor-pointer focus:border-[#1677ff]"
                >
                  <option value="7天">7天</option>
                  <option value="15天">15天</option>
                  <option value="30天">30天</option>
                  <option value="60天">60天</option>
                </select>
                <span>后数据自动清理不可用数据</span>
              </div>
              <div className="text-[11px] text-gray-400 flex items-center space-x-1">
                <i className="fa-regular fa-circle-question text-[10px]"></i>
                <span>当行动方案停止后系统自动清理不可用的数据</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-6 py-2 rounded text-xs transition-colors cursor-pointer font-medium shadow-xs"
              >
                保存并更新设置
              </button>
            </div>
          </form>
        )}

        {/* Modal: 查看行动方案 */}
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
            <div
              onClick={() => setIsPlanModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-2xs"
            ></div>
            <div className="relative bg-white rounded-lg shadow-2xl w-[600px] max-w-[90vw] p-6 z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-800">
                  {selectedInst.name} - 行动方案列表
                </h3>
                <button
                  onClick={() => setIsPlanModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 rounded p-3 bg-gray-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-800">2026年度网络安全专项治理统一行动方案</div>
                    <div className="text-gray-500 mt-1">类型: 统一行动 | 状态: 运行中 | 覆盖台账: 120个</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-600 border border-green-200">
                    运行中
                  </span>
                </div>

                <div className="border border-gray-200 rounded p-3 bg-gray-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-800">涉企违规信息自查与排查自建方案</div>
                    <div className="text-gray-500 mt-1">类型: 机构行动 | 状态: 运行中 | 覆盖台账: 45个</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-600 border border-green-200">
                    运行中
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-1.5 bg-[#1677ff] text-white rounded text-xs hover:bg-[#4096ff] cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 1: Main Institution List View (Image 1)
  // ----------------------------------------------------
  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 min-h-0 text-[#333] relative">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-bold text-gray-800">专项行动机构</h2>
        </div>
      </div>

      {/* Top 5 Stat Cards Banner (Image 1) */}
      <div className="bg-[#f8faff] border border-[#e6f0ff] rounded-lg p-5 mb-4 shadow-2xs grid grid-cols-5 divide-x divide-[#e6f0ff]">
        {/* Metric 1 */}
        <div className="px-4 first:pl-2 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#1677ff] text-white flex items-center justify-center text-xs">
              <i className="fa-regular fa-folder-open"></i>
            </div>
            <span className="font-medium">专项行动机构总数</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">13</div>
        </div>

        {/* Metric 2 */}
        <div className="px-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#2f54eb] text-white flex items-center justify-center text-xs">
              <i className="fa-solid fa-sitemap"></i>
            </div>
            <span className="font-medium">机构行动方案数</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">15</div>
        </div>

        {/* Metric 3 */}
        <div className="px-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#597ef7] text-white flex items-center justify-center text-xs">
              <i className="fa-solid fa-cube"></i>
            </div>
            <span className="font-medium">统一行动方案数</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">5</div>
        </div>

        {/* Metric 4 */}
        <div className="px-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#36cfc9] text-white flex items-center justify-center text-xs">
              <i className="fa-regular fa-circle-play"></i>
            </div>
            <span className="font-medium">运行中</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">3</div>
        </div>

        {/* Metric 5 */}
        <div className="px-4 last:pr-2 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-6 h-6 rounded bg-[#ff7a45] text-white flex items-center justify-center text-xs">
              <i className="fa-regular fa-circle-xmark"></i>
            </div>
            <span className="font-medium">已关闭</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">17</div>
        </div>
      </div>

      {/* 2-Row Filter Bar (Image 1) */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 mb-4 shadow-2xs space-y-3 text-xs">
        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-4">
          {/* 机构名称 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">机构名称</span>
            <input
              type="text"
              value={nameFilter}
              maxLength={100}
              onChange={e => setNameFilter(e.target.value)}
              placeholder="请输入机构名称"
              className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <span className="text-[10px] text-gray-400 select-none ml-1 whitespace-nowrap">
              {nameFilter.length}/100
            </span>
          </div>

          {/* 所属区域 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">所属区域</span>
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">请选择所属区域</option>
              <option value="陕西">陕西</option>
              <option value="湖北">湖北</option>
              <option value="广西">广西</option>
              <option value="甘肃">甘肃</option>
              <option value="山西">山西</option>
            </select>
          </div>

          {/* 机构类别 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">机构类别</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">请选择机构类别</option>
              <option value="一类">一类</option>
              <option value="二类">二类</option>
            </select>
          </div>

          {/* 机构类型 */}
          <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
            <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">机构类型</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">请选择机构类型</option>
              <option value="网信部门">网信部门</option>
              <option value="宣传部">宣传部</option>
              <option value="网安部门">网安部门</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4 flex-1 mr-4">
            {/* 开通状态 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">开通状态</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择开通状态</option>
                <option value="已开启">已开启</option>
                <option value="已关闭">已关闭</option>
              </select>
            </div>

            {/* 开通时间 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff] space-x-1.5">
              <span className="text-gray-600 font-medium whitespace-nowrap select-none">开通时间</span>
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

            {/* 统计单元 */}
            <div className="flex items-center border border-[#d9d9d9] rounded px-2.5 py-1.5 bg-white focus-within:border-[#1677ff]">
              <span className="text-gray-600 font-medium whitespace-nowrap mr-2 select-none">统计单元</span>
              <select
                value={unitFilter}
                onChange={e => setUnitFilter(e.target.value)}
                className="w-full text-xs text-gray-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">请选择统计单元名称</option>
                <option value="省级网信">省级网信</option>
                <option value="市级宣传">市级宣传</option>
                <option value="市级网信">市级网信</option>
                <option value="市级公安">市级公安</option>
              </select>
            </div>
          </div>

          {/* Buttons Aligned Right */}
          <div className="flex items-center space-x-2">
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
      </div>

      {/* Main Table (Image 1) */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-2 py-2.5 font-medium w-[45px] text-center whitespace-nowrap">序号</th>
                <th className="px-3 py-2.5 font-medium w-[28%] whitespace-nowrap">机构信息</th>
                <th className="px-2 py-2.5 font-medium w-[85px] whitespace-nowrap">机构类别</th>
                <th className="px-2 py-2.5 font-medium w-[90px] text-center whitespace-nowrap">专项行动总数</th>
                <th className="px-2 py-2.5 font-medium w-[90px] text-center whitespace-nowrap">机构行动总数</th>
                <th className="px-2 py-2.5 font-medium w-[85px] text-center whitespace-nowrap">统一行动数</th>
                <th className="px-2 py-2.5 font-medium w-[70px] text-center whitespace-nowrap">运行中</th>
                <th className="px-2 py-2.5 font-medium w-[70px] text-center whitespace-nowrap">已关闭</th>
                <th className="px-3 py-2.5 font-medium w-[130px] whitespace-nowrap">开通权限/状态</th>
                <th className="px-3 py-2.5 font-medium w-[130px] whitespace-nowrap">开通时间</th>
                <th className="px-3 py-2.5 font-medium w-[110px] text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-gray-600">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                      <span>暂无专项行动机构数据</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                    {/* 序号 */}
                    <td className="px-2 py-3.5 text-center text-gray-500 font-normal align-middle">
                      {idx + 1}
                    </td>

                    {/* 机构信息 */}
                    <td className="px-3 py-3.5 align-middle">
                      <div className="space-y-0.5">
                        <div className="flex items-start space-x-1.5">
                          <span className="inline-block mt-0.5 px-1 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                            {item.isTrial ? '试用' : '正式'}
                          </span>
                          <span className="font-medium text-gray-900 leading-snug line-clamp-2">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 pl-8">{item.region}</div>
                      </div>
                    </td>

                    {/* 机构类别 */}
                    <td className="px-2 py-3.5 align-middle text-gray-700 text-[11px] whitespace-nowrap space-y-0.5">
                      <div>{item.category}</div>
                      <div className="text-gray-500">{item.deptType}</div>
                    </td>

                    {/* 专项行动总数 */}
                    <td className="px-2 py-3.5 text-center text-gray-700 font-mono align-middle">
                      {item.totalActions}
                    </td>

                    {/* 机构行动总数 */}
                    <td className="px-2 py-3.5 text-center text-gray-700 font-mono align-middle">
                      {item.instActions}
                    </td>

                    {/* 统一行动数 */}
                    <td className="px-2 py-3.5 text-center text-gray-700 font-mono align-middle">
                      {item.unifiedActions}
                    </td>

                    {/* 运行中 */}
                    <td className="px-2 py-3.5 text-center text-gray-700 font-mono align-middle">
                      {item.runningActions}
                    </td>

                    {/* 已关闭 */}
                    <td className="px-2 py-3.5 text-center text-gray-700 font-mono align-middle">
                      {item.closedActions}
                    </td>

                    {/* 开通权限/状态 */}
                    <td className="px-3 py-3.5 align-middle whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-[#52c41a] text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#52c41a]"></span>
                          <span>已开启 ({item.isTrial ? '试用' : '正式'})</span>
                        </div>
                        <div>
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] bg-orange-50 text-orange-600 border border-orange-200">
                            {item.remainingTime}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 开通时间 */}
                    <td className="px-3 py-3.5 font-mono text-[11px] text-gray-500 align-middle whitespace-nowrap space-y-0.5">
                      <div>始: {item.startDate}</div>
                      <div>止: {item.endDate}</div>
                    </td>

                    {/* 操作 */}
                    <td className="px-3 py-3.5 text-center align-middle whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedInst(item);
                            setDetailTab('basic');
                          }}
                          className="text-[#1677ff] hover:underline cursor-pointer font-medium"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInst(item);
                            setIsPlanModalOpen(true);
                          }}
                          className="text-[#1677ff] hover:underline cursor-pointer font-medium"
                        >
                          查看方案
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#e8e8e8] bg-[#fafafa] text-xs text-gray-600">
          <div>
            共 <strong className="text-gray-800 font-medium">{filteredData.length}</strong> 条机构记录
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <span>第 1 / 1 页</span>
          </div>
        </div>
      </div>

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
