import React, { useState } from 'react';
import { regionsList, categoriesList, typesList, statisticalUnitsList } from '../data/mockData';
import { ErrorInstitutionDetailPage } from './ErrorInstitutionDetailPage';

export interface ErrorInstitutionItem {
  id: number;
  name: string;
  region: string;
  category: string;
  type: string;
  ledgerCount: number;
  errorTotal: number;
  corrected: number;
  uncorrected: number;
  deleted: number;
  statusText: string; // '已开启 (试用)' | '已停用 (试用)' | '已开启 (正式)'
  isOpen: boolean; // true: green dot, false: red dot
  daysRemaining: number;
  startDate: string;
  endDate: string;
  isTrial: boolean;
}

export const initialErrorInstitutions: ErrorInstitutionItem[] = [
  {
    id: 1,
    name: '中共陕西省委网络安全和信息化委员会办公室',
    region: '陕西',
    category: '一类',
    type: '网信部门',
    ledgerCount: 7956,
    errorTotal: 59213,
    corrected: 5,
    uncorrected: 59207,
    deleted: 1,
    statusText: '已开启 (试用)',
    isOpen: true,
    daysRemaining: 106,
    startDate: '2026-08-14',
    endDate: '2026-11-30',
    isTrial: true,
  },
  {
    id: 2,
    name: '中共咸阳市委宣传部',
    region: '陕西/咸阳',
    category: '一类',
    type: '宣传部',
    ledgerCount: 0,
    errorTotal: 0,
    corrected: 0,
    uncorrected: 0,
    deleted: 0,
    statusText: '已开启 (试用)',
    isOpen: true,
    daysRemaining: 26,
    startDate: '2026-08-12',
    endDate: '2026-09-11',
    isTrial: true,
  },
  {
    id: 3,
    name: '随州市网信中心（随州市网络安全应急指挥中心、随州市...）',
    region: '湖北/随州市',
    category: '一类',
    type: '网信部门',
    ledgerCount: 83,
    errorTotal: 166,
    corrected: 0,
    uncorrected: 166,
    deleted: 0,
    statusText: '已开启 (试用)',
    isOpen: true,
    daysRemaining: 26,
    startDate: '2026-08-12',
    endDate: '2026-09-11',
    isTrial: true,
  },
  {
    id: 4,
    name: '南宁市委',
    region: '广西/南宁市',
    category: '一类',
    type: '网信部门',
    ledgerCount: 723,
    errorTotal: 9319,
    corrected: 0,
    uncorrected: 9319,
    deleted: 0,
    statusText: '已停用 (试用)',
    isOpen: false,
    daysRemaining: 25,
    startDate: '2026-08-11',
    endDate: '2026-09-10',
    isTrial: true,
  },
  {
    id: 5,
    name: '中共兰州市委网络安全和信息化委员会办公室',
    region: '甘肃/兰州',
    category: '一类',
    type: '网信部门',
    ledgerCount: 1946,
    errorTotal: 11232,
    corrected: 1,
    uncorrected: 11231,
    deleted: 0,
    statusText: '已停用 (试用)',
    isOpen: false,
    daysRemaining: 25,
    startDate: '2026-08-11',
    endDate: '2026-09-10',
    isTrial: true,
  },
  {
    id: 6,
    name: '阳泉市公安局',
    region: '山西/阳泉市',
    category: '一类',
    type: '网安部门',
    ledgerCount: 504,
    errorTotal: 1193,
    corrected: 0,
    uncorrected: 1193,
    deleted: 0,
    statusText: '已停用 (试用)',
    isOpen: false,
    daysRemaining: 10,
    startDate: '2026-08-11',
    endDate: '2026-08-26',
    isTrial: true,
  },
  {
    id: 7,
    name: '国网河南省电力公司商丘供电公司',
    region: '甘肃',
    category: '二类',
    type: '电力',
    ledgerCount: 216,
    errorTotal: 13,
    corrected: 0,
    uncorrected: 13,
    deleted: 0,
    statusText: '已停用 (试用)',
    isOpen: false,
    daysRemaining: 9,
    startDate: '2026-08-10',
    endDate: '2026-08-25',
    isTrial: true,
  },
  {
    id: 8,
    name: '河南城建学院',
    region: '陕西/西安',
    category: '三类',
    type: '职校高校',
    ledgerCount: 1167,
    errorTotal: 20744,
    corrected: 1,
    uncorrected: 20742,
    deleted: 1,
    statusText: '已停用 (试用)',
    isOpen: false,
    daysRemaining: 9,
    startDate: '2026-08-11',
    endDate: '2026-08-25',
    isTrial: true,
  },
  {
    id: 9,
    name: '中共峡江县委宣传部',
    region: '江西/吉安市/峡江县',
    category: '一类',
    type: '网信部门',
    ledgerCount: 18,
    errorTotal: 1,
    corrected: 0,
    uncorrected: 1,
    deleted: 0,
    statusText: '已开启 (试用)',
    isOpen: true,
    daysRemaining: 24,
    startDate: '2026-08-10',
    endDate: '2026-09-09',
    isTrial: true,
  },
  {
    id: 10,
    name: '中共佛山市委网络安全和信息化委员会办公室',
    region: '广东/佛山市',
    category: '一类',
    type: '网信部门',
    ledgerCount: 324,
    errorTotal: 1422,
    corrected: 0,
    uncorrected: 1422,
    deleted: 0,
    statusText: '已停用 (试用)',
    isOpen: false,
    daysRemaining: 55,
    startDate: '2026-08-10',
    endDate: '2026-10-10',
    isTrial: true,
  },
  {
    id: 11,
    name: '中共随州市委宣传部',
    region: '湖北/随州市',
    category: '一类',
    type: '宣传部',
    ledgerCount: 69,
    errorTotal: 517,
    corrected: 0,
    uncorrected: 517,
    deleted: 0,
    statusText: '已停用 (试用)',
    isOpen: false,
    daysRemaining: 24,
    startDate: '2026-08-10',
    endDate: '2026-09-09',
    isTrial: true,
  },
];

interface ErrorInstitutionViewProps {
  onBackToInstitution?: () => void;
  onNavigateToView?: (viewKey: string, params?: any) => void;
}

export const ErrorInstitutionView: React.FC<ErrorInstitutionViewProps> = ({
  onBackToInstitution,
  onNavigateToView,
}) => {
  const [data, setData] = useState<ErrorInstitutionItem[]>(initialErrorInstitutions);

  // Search Filters state
  const [nameFilter, setNameFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [openStatusFilter, setOpenStatusFilter] = useState(''); // 'open' | 'closed'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statisticalUnit, setStatisticalUnit] = useState('');

  // Dropdown action menu state
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<ErrorInstitutionItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter logic
  const filteredData = data.filter(item => {
    if (nameFilter && !item.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (regionFilter && !item.region.includes(regionFilter)) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (typeFilter && item.type !== typeFilter) return false;
    if (openStatusFilter === 'open' && !item.isOpen) return false;
    if (openStatusFilter === 'closed' && item.isOpen) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setNameFilter('');
    setRegionFilter('');
    setCategoryFilter('');
    setTypeFilter('');
    setOpenStatusFilter('');
    setStartDate('');
    setEndDate('');
    setStatisticalUnit('');
    setCurrentPage(1);
  };

  const handleActionClick = (action: string, item: ErrorInstitutionItem) => {
    setActiveMenuId(null);
    if (action === 'detail') {
      setSelectedInstitution(item);
    } else if (action === 'view_ledger') {
      if (onNavigateToView) {
        onNavigateToView('error_data', { institutionId: item.id, institutionName: item.name });
      } else {
        alert(`查看【${item.name}】的台账列表`);
      }
    } else if (action === 'view_errors') {
      if (onNavigateToView) {
        onNavigateToView('error_data', { institutionId: item.id, institutionName: item.name });
      } else {
        alert(`查看【${item.name}】的错误数据`);
      }
    } else if (action === 'collect_history') {
      if (onNavigateToView) {
        onNavigateToView('error_history', { institutionId: item.id, institutionName: item.name });
      } else {
        alert(`正在为【${item.name}】采集历史数据...`);
      }
    }
  };

  if (selectedInstitution) {
    return (
      <ErrorInstitutionDetailPage
        institution={selectedInstitution}
        onBack={() => setSelectedInstitution(null)}
      />
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-white flex flex-col" onClick={() => setActiveMenuId(null)}>
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-800">错误表述机构</h2>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Card 1: 错误表述台账总数 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#e6f4ff] text-[#1677ff] flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-regular fa-address-book"></i>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">错误表述台账总数</div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">12,805</div>
            </div>
          </div>
        </div>

        {/* Card 2: 总发文数 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#e6fffb] text-[#13c2c2] flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-regular fa-file-lines"></i>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">总发文数</div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">9,454,576</div>
            </div>
          </div>
        </div>

        {/* Card 3: 错误表述总数 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#fff7e6] text-[#fa8c16] flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-file-circle-exclamation"></i>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">错误表述总数</div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">105,309</div>
            </div>
          </div>
        </div>

        {/* Card 4: 存在错误机构 */}
        <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#fff1f0] text-[#ff4d4f] flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-building-circle-exclamation"></i>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">存在错误机构</div>
              <div className="text-2xl font-bold font-mono text-gray-900 leading-tight">14</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-condition Filter Bar */}
      <div className="bg-white p-4 border border-[#e8e8e8] rounded-sm text-xs mb-4 space-y-3 shadow-2xs">
        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 机构名称 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] whitespace-nowrap">机构名称</span>
            <input
              type="text"
              placeholder="请输入机构名称"
              className="px-2.5 py-1.5 outline-none flex-1 text-gray-800 placeholder-gray-400 min-w-0"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
            <span className="px-2 text-gray-300 text-[11px] font-mono">0 / 100</span>
          </div>

          {/* 所在地区 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] whitespace-nowrap">所在地区</span>
            <select
              className="px-2.5 py-1.5 outline-none bg-transparent text-gray-700 cursor-pointer pr-6 appearance-none flex-1"
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
            >
              <option value="">请选择所在地区</option>
              {regionsList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2 pointer-events-none text-[10px]"></i>
          </div>

          {/* 机构类别 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] whitespace-nowrap">机构类别</span>
            <select
              className="px-2.5 py-1.5 outline-none bg-transparent text-gray-700 cursor-pointer pr-6 appearance-none flex-1"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">请选择机构类别</option>
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2 pointer-events-none text-[10px]"></i>
          </div>

          {/* 机构类型 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] whitespace-nowrap">机构类型</span>
            <select
              className="px-2.5 py-1.5 outline-none bg-transparent text-gray-700 cursor-pointer pr-6 appearance-none flex-1"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">请选择机构类型</option>
              {typesList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2 pointer-events-none text-[10px]"></i>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* 开通状态 (3 cols) */}
          <div className="col-span-3 flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] whitespace-nowrap">开通状态</span>
            <select
              className="px-2.5 py-1.5 outline-none bg-transparent text-gray-700 cursor-pointer pr-6 appearance-none flex-1"
              value={openStatusFilter}
              onChange={e => setOpenStatusFilter(e.target.value)}
            >
              <option value="">请选择开通状态</option>
              <option value="open">已开启</option>
              <option value="closed">已停用</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2 pointer-events-none text-[10px]"></i>
          </div>

          {/* 开通时间 (4 cols) */}
          <div className="col-span-4 flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] whitespace-nowrap">开通时间</span>
            <input
              type="text"
              placeholder="开始日期"
              className="px-2 py-1.5 outline-none w-24 text-gray-700 placeholder-gray-400 text-center"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <span className="text-gray-400 px-1">~</span>
            <input
              type="text"
              placeholder="结束日期"
              className="px-2 py-1.5 outline-none w-24 text-gray-700 placeholder-gray-400 text-center"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
            <i className="fa-regular fa-calendar text-gray-400 px-2 text-xs"></i>
          </div>

          {/* 统计单元 (3 cols) */}
          <div className="col-span-3 flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border-r border-[#d9d9d9] whitespace-nowrap">统计单元</span>
            <select
              className="px-2.5 py-1.5 outline-none bg-transparent text-gray-700 cursor-pointer pr-6 appearance-none flex-1"
              value={statisticalUnit}
              onChange={e => setStatisticalUnit(e.target.value)}
            >
              <option value="">请选择统计单元名称</option>
              {statisticalUnitsList.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2 pointer-events-none text-[10px]"></i>
          </div>

          {/* Buttons (2 cols) */}
          <div className="col-span-2 flex items-center justify-end space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              className="bg-[#1677ff] hover:bg-blue-600 text-white px-4 py-1.5 rounded-sm cursor-pointer shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
              <span>查询</span>
            </button>
            <button
              onClick={handleReset}
              className="border border-[#d9d9d9] hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-sm cursor-pointer transition-colors flex items-center space-x-1"
            >
              <i className="fa-solid fa-rotate-left text-[11px] text-gray-500"></i>
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-[#e8e8e8] rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[1100px]">
          <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
            <tr>
              <th className="px-3 py-3 font-normal w-12 text-center">序号</th>
              <th className="px-3 py-3 font-normal w-60">机构信息</th>
              <th className="px-3 py-3 font-normal w-24">机构类别</th>
              <th className="px-3 py-3 font-normal w-20 text-right">台账总数</th>
              <th className="px-3 py-3 font-normal w-24 text-right">错误表述总数</th>
              <th className="px-3 py-3 font-normal w-16 text-right">已修正</th>
              <th className="px-3 py-3 font-normal w-20 text-right">未修正</th>
              <th className="px-3 py-3 font-normal w-16 text-right">已删除</th>
              <th className="px-3 py-3 font-normal w-28 text-center">开通权限/状态</th>
              <th className="px-3 py-3 font-normal w-32">开通时间</th>
              <th className="px-3 py-3 font-normal w-24 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8e8]">
            {pagedData.length > 0 ? (
              pagedData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* 序号 */}
                  <td className="px-3 py-3.5 text-center text-gray-500">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>

                  {/* 机构信息 */}
                  <td className="px-3 py-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-1.5 py-0.2 bg-[#fff7e6] text-[#fa8c16] border border-[#ffd591] text-[10px] rounded-xs font-normal">
                          {item.isTrial ? '试用' : '正式'}
                        </span>
                        <span 
                          onClick={() => setSelectedInstitution(item)}
                          className="font-medium text-gray-800 hover:text-[#1677ff] cursor-pointer" 
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400">{item.region}</div>
                    </div>
                  </td>

                  {/* 机构类别 */}
                  <td className="px-3 py-3.5">
                    <div className="space-y-0.5">
                      <div className="text-gray-700">{item.category}</div>
                      <div className="text-[11px] text-gray-400">{item.type}</div>
                    </div>
                  </td>

                  {/* 台账总数 */}
                  <td className="px-3 py-3.5 text-right font-mono text-gray-700">
                    {item.ledgerCount.toLocaleString()}
                  </td>

                  {/* 错误表述总数 */}
                  <td className="px-3 py-3.5 text-right font-mono text-gray-700">
                    {item.errorTotal.toLocaleString()}
                  </td>

                  {/* 已修正 */}
                  <td className="px-3 py-3.5 text-right font-mono text-gray-700">
                    {item.corrected.toLocaleString()}
                  </td>

                  {/* 未修正 */}
                  <td className="px-3 py-3.5 text-right font-mono text-gray-700">
                    {item.uncorrected.toLocaleString()}
                  </td>

                  {/* 已删除 */}
                  <td className="px-3 py-3.5 text-right font-mono text-gray-700">
                    {item.deleted.toLocaleString()}
                  </td>

                  {/* 开通权限/状态 */}
                  <td className="px-3 py-3.5 text-center">
                    <div className="flex flex-col items-center space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isOpen ? 'bg-[#52c41a]' : 'bg-[#ff4d4f]'}`}></span>
                        <span className={item.isOpen ? 'text-[#52c41a] font-medium' : 'text-[#ff4d4f] font-medium'}>
                          {item.statusText}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#fa8c16]">
                        {item.daysRemaining}天
                      </div>
                    </div>
                  </td>

                  {/* 开通时间 */}
                  <td className="px-3 py-3.5">
                    <div className="text-[11px] font-mono text-gray-500 space-y-0.5">
                      <div>始:{item.startDate}</div>
                      <div>止:{item.endDate}</div>
                    </div>
                  </td>

                  {/* 操作 */}
                  <td className="px-3 py-3.5 text-center relative" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleActionClick('detail', item)}
                        className="text-[#1677ff] hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        详情
                      </button>

                      {/* 更多下拉菜单 */}
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === item.id ? null : item.id);
                          }}
                          className="text-[#1677ff] hover:underline cursor-pointer flex items-center space-x-0.5 bg-transparent border-none p-0"
                        >
                          <span>更多</span>
                          <i className="fa-solid fa-angle-down text-[9px]"></i>
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === item.id && (
                          <div className="origin-top-right absolute right-0 mt-1 w-28 rounded-xs shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100 py-1 text-left">
                            <button
                              onClick={() => handleActionClick('view_ledger', item)}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#1677ff] transition-colors flex items-center space-x-1.5 cursor-pointer"
                            >
                              <i className="fa-solid fa-list-check text-[10px] text-gray-400"></i>
                              <span>查看台账</span>
                            </button>
                            <button
                              onClick={() => handleActionClick('view_errors', item)}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#1677ff] transition-colors flex items-center space-x-1.5 cursor-pointer"
                            >
                              <i className="fa-solid fa-triangle-exclamation text-[10px] text-gray-400"></i>
                              <span>查看错误数据</span>
                            </button>
                            <button
                              onClick={() => handleActionClick('collect_history', item)}
                              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#1677ff] transition-colors flex items-center space-x-1.5 cursor-pointer"
                            >
                              <i className="fa-solid fa-cloud-arrow-down text-[10px] text-gray-400"></i>
                              <span>采集历史数据</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <i className="fa-regular fa-folder-open text-2xl text-gray-300"></i>
                    <p className="text-xs">暂无匹配的错误表述机构数据</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1 py-3 mt-1">
        <span>共 {filteredData.length} 条数据，每页 {pageSize} 条</span>
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
    </main>
  );
};
