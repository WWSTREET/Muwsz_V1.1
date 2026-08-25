import React, { useState } from 'react';
import { regionsList, categoriesList, typesList, statisticalUnitsList } from '../data/mockData';
import { InstitutionDetailPage } from './InstitutionDetailPage';
import { Institution } from '../types';

interface LocalInstitutionItem {
  id: number;
  name: string;
  region: string;
  category: string;
  type: string;
  totalLedgers: string;
  website: string;
  douyin: string;
  weibo: string;
  wechat: string;
  toutiao: string;
  statusText: string; // "已开启 (试用)" or "已开启 (正式)"
  daysRemaining: number;
  startDate: string;
  endDate: string;
  isTrial: boolean;
}

const initialLocalInstitutions: LocalInstitutionItem[] = [
  {
    id: 1,
    name: '中共陕西省委网络安全和信息化委员会办公室',
    region: '陕西',
    category: '一类',
    type: '网信部门',
    totalLedgers: '32,553,646',
    website: '168,656',
    douyin: '21,776,988',
    weibo: '7,699,279',
    wechat: '225,241',
    toutiao: '2,683,482',
    statusText: '已开启 (试用)',
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
    totalLedgers: '1,330,641',
    website: '8,683',
    douyin: '1,095,431',
    weibo: '203,366',
    wechat: '12,505',
    toutiao: '10,656',
    statusText: '已开启 (试用)',
    daysRemaining: 26,
    startDate: '2026-08-12',
    endDate: '2026-09-11',
    isTrial: true,
  },
  {
    id: 3,
    name: '随州市网信中心（随州市网络安全应急指挥中心、随州市舆情信息中心）',
    region: '湖北/随州市',
    category: '一类',
    type: '网信部门',
    totalLedgers: '409,590',
    website: '5,311',
    douyin: '324,102',
    weibo: '74,665',
    wechat: '1,672',
    toutiao: '3,840',
    statusText: '已开启 (试用)',
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
    totalLedgers: '47,157',
    website: '22,900',
    douyin: '22,877',
    weibo: '459',
    wechat: '830',
    toutiao: '91',
    statusText: '已开启 (试用)',
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
    totalLedgers: '2,667,427',
    website: '12,205',
    douyin: '1,504,728',
    weibo: '1,125,883',
    wechat: '11,001',
    toutiao: '13,610',
    statusText: '已开启 (试用)',
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
    totalLedgers: '337,277',
    website: '1,987',
    douyin: '235,994',
    weibo: '93,855',
    wechat: '2,442',
    toutiao: '2,999',
    statusText: '已开启 (试用)',
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
    totalLedgers: '53,293',
    website: '12,219',
    douyin: '28,363',
    weibo: '282',
    wechat: '12,295',
    toutiao: '134',
    statusText: '已开启 (试用)',
    daysRemaining: 9,
    startDate: '2026-08-10',
    endDate: '2026-08-25',
    isTrial: true,
  }
];

interface LocalInstitutionViewProps {
  onBackToInstitution: () => void;
}

export const LocalInstitutionView: React.FC<LocalInstitutionViewProps> = ({ onBackToInstitution }) => {
  const [filters, setFilters] = useState({
    name: '',
    region: '',
    category: '',
    type: '',
    openStatus: '',
    startDate: '',
    endDate: '',
    statisticalUnit: ''
  });

  const [viewingDetail, setViewingDetail] = useState<LocalInstitutionItem | null>(null);
  const [selectedInst, setSelectedInst] = useState<LocalInstitutionItem | null>(null);
  const [modalType, setModalType] = useState<'ledger' | null>(null);

  if (viewingDetail) {
    const mappedInst: Institution = {
      id: viewingDetail.id,
      name: viewingDetail.name,
      region: viewingDetail.region,
      category: viewingDetail.category,
      type: viewingDetail.type,
      salesName: '张经理',
      salesPhone: '138****8888',
      status: 'trial',
      isActive: true,
      startDate: viewingDetail.startDate,
      endDate: viewingDetail.endDate,
      daysRemaining: viewingDetail.daysRemaining,
      statisticalUnit: '陕西省委网信办单元'
    };
    return <InstitutionDetailPage institution={mappedInst} onBack={() => setViewingDetail(null)} />;
  }

  const filteredList = initialLocalInstitutions.filter(item => {
    if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.region && !item.region.includes(filters.region)) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.type && item.type !== filters.type) return false;
    return true;
  });

  const handleReset = () => {
    setFilters({
      name: '',
      region: '',
      category: '',
      type: '',
      openStatus: '',
      startDate: '',
      endDate: '',
      statisticalUnit: ''
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col">
      {/* Breadcrumb & Title */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-800">属地机构</h2>
      </div>

      {/* Statistics Cards */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 border border-[#e8e8e8] rounded-sm p-4 flex flex-col justify-between min-h-[90px] bg-white shadow-xs">
          <div className="flex items-center text-gray-600 mb-2">
            <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center mr-2 text-xs">
              <i className="fa-solid fa-building"></i>
            </div>
            <span className="text-xs">机构总数</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">15</div>
        </div>

        <div className="flex-1 border border-[#e8e8e8] rounded-sm p-4 flex flex-col justify-between min-h-[90px] bg-white shadow-xs">
          <div className="flex items-center text-gray-600 mb-2">
            <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center mr-2 text-xs">
              <i className="fa-solid fa-folder-open"></i>
            </div>
            <span className="text-xs">台账总数</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">43,870,545</div>
        </div>

        <div className="flex-1 border border-[#e8e8e8] rounded-sm p-4 flex flex-col justify-between min-h-[90px] bg-white shadow-xs">
          <div className="flex items-center text-gray-600 mb-2">
            <div className="w-6 h-6 bg-orange-500 text-white rounded flex items-center justify-center mr-2 text-xs">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <span className="text-xs">今日同步新增台账</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="mb-4">
        {/* Row 1 */}
        <div className="flex gap-4 mb-3">
          <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm">
            <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">机构名称</span>
            <input 
              type="text"
              className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none"
              placeholder="请输入机构名称"
              value={filters.name}
              maxLength={100}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <span className="px-2 text-xs text-gray-400">{filters.name.length} / 100</span>
          </div>

          <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm relative">
            <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">所在地区</span>
            <select 
              className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            >
              <option value="">请选择所在地区</option>
              {regionsList.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 px-2 text-[10px] pointer-events-none absolute right-0"></i>
          </div>

          <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm relative">
            <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">机构类别</span>
            <select 
              className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">请选择机构类别</option>
              {categoriesList.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 px-2 text-[10px] pointer-events-none absolute right-0"></i>
          </div>

          <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm relative">
            <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">机构类型</span>
            <select 
              className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">请选择机构类型</option>
              {typesList.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 px-2 text-[10px] pointer-events-none absolute right-0"></i>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm relative max-w-[calc(25%-12px)]">
            <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">开通状态</span>
            <select 
              className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
              value={filters.openStatus}
              onChange={(e) => setFilters({ ...filters, openStatus: e.target.value })}
            >
              <option value="">请选择开通状态</option>
              <option value="enabled">已开启</option>
              <option value="disabled">已关闭</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 px-2 text-[10px] pointer-events-none absolute right-0"></i>
          </div>

          <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm max-w-[calc(25%-12px)] px-2 py-1 bg-white">
            <span className="text-xs text-gray-600 bg-gray-50 px-2 border-r border-[#e8e8e8] mr-2 whitespace-nowrap">开通时间</span>
            <input 
              type="date"
              className="text-xs text-gray-600 border-none focus:outline-none w-28 bg-transparent"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <span className="text-gray-400 mx-1">~</span>
            <input 
              type="date"
              className="text-xs text-gray-600 border-none focus:outline-none w-28 bg-transparent"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm relative max-w-[calc(25%-12px)]">
            <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">统计单元</span>
            <select 
              className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
              value={filters.statisticalUnit}
              onChange={(e) => setFilters({ ...filters, statisticalUnit: e.target.value })}
            >
              <option value="">请选择统计单元名称</option>
              {statisticalUnitsList.map((su, idx) => (
                <option key={idx} value={su}>{su}</option>
              ))}
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 px-2 text-[10px] pointer-events-none absolute right-0"></i>
          </div>

          <div className="flex-1 flex justify-end gap-2 max-w-[calc(25%-12px)]">
            <button 
              onClick={() => {}}
              className="bg-[#1677ff] text-white px-5 py-1.5 rounded-sm text-xs flex items-center hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-magnifying-glass mr-1.5"></i> 查询
            </button>
            <button 
              onClick={handleReset}
              className="bg-gray-50 text-gray-700 border border-[#e8e8e8] px-5 py-1.5 rounded-sm text-xs flex items-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-arrow-rotate-right mr-1.5"></i> 重置
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-[#e8e8e8] rounded-t-sm bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs table-fixed">
          <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
            <tr>
              <th className="px-1.5 py-2.5 font-normal w-[36px] text-center whitespace-nowrap">序号</th>
              <th className="px-2 py-2.5 font-normal w-[22%] whitespace-nowrap">机构信息</th>
              <th className="px-2 py-2.5 font-normal w-[11%] whitespace-nowrap">机构类别</th>
              <th className="px-1.5 py-2.5 font-normal w-[75px] text-center whitespace-nowrap">台账总数</th>
              <th className="px-1 py-2.5 font-normal w-[60px] text-center whitespace-nowrap">网站</th>
              <th className="px-1 py-2.5 font-normal w-[65px] text-center whitespace-nowrap">抖音</th>
              <th className="px-1 py-2.5 font-normal w-[60px] text-center whitespace-nowrap">微博</th>
              <th className="px-1 py-2.5 font-normal w-[70px] text-center whitespace-nowrap">微信公众号</th>
              <th className="px-1 py-2.5 font-normal w-[60px] text-center whitespace-nowrap">今日头条</th>
              <th className="px-1.5 py-2.5 font-normal w-[100px] whitespace-nowrap">开通权限/状态</th>
              <th className="px-1.5 py-2.5 font-normal w-[110px] whitespace-nowrap">开通时间</th>
              <th className="px-1.5 py-2.5 font-normal w-[100px] text-center whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8e8]">
            {filteredList.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-1.5 py-2 text-gray-500 text-center whitespace-nowrap">{index + 1}</td>
                <td className="px-2 py-2 overflow-hidden">
                  <div className="flex items-center mb-0.5 min-w-0">
                    <span className="text-[#d46b08] bg-[#ffe7ba] border border-[#ffd591] text-[9px] px-1 rounded-xs mr-1.5 leading-tight flex-shrink-0">试用</span>
                    <span className="font-medium text-gray-800 truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[10px] truncate" title={item.region}>{item.region}</div>
                </td>
                <td className="px-2 py-2 text-gray-600 overflow-hidden">
                  <div className="text-xs truncate" title={item.category}>{item.category}</div>
                  <div className="text-[10px] text-gray-400 truncate" title={item.type}>{item.type}</div>
                </td>
                <td className="px-1.5 py-2 font-mono font-medium text-gray-800 text-center whitespace-nowrap truncate">{item.totalLedgers}</td>
                <td className="px-1 py-2 font-mono text-gray-600 text-center whitespace-nowrap truncate">{item.website}</td>
                <td className="px-1 py-2 font-mono text-gray-600 text-center whitespace-nowrap truncate">{item.douyin}</td>
                <td className="px-1 py-2 font-mono text-gray-600 text-center whitespace-nowrap truncate">{item.weibo}</td>
                <td className="px-1 py-2 font-mono text-gray-600 text-center whitespace-nowrap truncate">{item.wechat}</td>
                <td className="px-1 py-2 font-mono text-gray-600 text-center whitespace-nowrap truncate">{item.toutiao}</td>
                <td className="px-1.5 py-2 overflow-hidden whitespace-nowrap">
                  <div className="inline-flex items-center text-green-700 bg-green-50 border border-green-200 px-1 py-0.2 rounded-xs text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 flex-shrink-0"></span>
                    已开启 <span className="text-orange-600 ml-0.5">(试用)</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{item.daysRemaining}天</div>
                </td>
                <td className="px-1.5 py-2 text-gray-600 font-mono text-[10px] whitespace-nowrap overflow-hidden">
                  <div className="truncate" title={`始:${item.startDate}`}>始:{item.startDate}</div>
                  <div className="truncate" title={`止:${item.endDate}`}>止:{item.endDate}</div>
                </td>
                <td className="px-1.5 py-2 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center space-x-2">
                    <button 
                      onClick={() => setViewingDetail(item)}
                      className="text-[#1677ff] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
                    >
                      详情
                    </button>
                    <button 
                      onClick={() => { setSelectedInst(item); setModalType('ledger'); }}
                      className="text-[#1677ff] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
                    >
                      查看台账
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#fafafa] border-t border-[#e8e8e8] text-xs text-gray-500">
          <div>共 {filteredList.length} 条记录</div>
          <div className="flex items-center space-x-2">
            <button className="px-2.5 py-1 border border-[#d9d9d9] rounded bg-white hover:bg-gray-100 disabled:opacity-50">上一页</button>
            <span className="px-2 py-1 bg-[#1677ff] text-white rounded">1</span>
            <button className="px-2.5 py-1 border border-[#d9d9d9] rounded bg-white hover:bg-gray-100 disabled:opacity-50">下一页</button>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Detail or View Ledger */}
      {modalType && selectedInst && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8] bg-[#f0f5ff]">
              <h3 className="text-base font-bold text-gray-800">
                {modalType === 'detail' ? '机构详细信息' : `【${selectedInst.name}】属地台账明细`}
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer bg-transparent border-none"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              {modalType === 'detail' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-100">
                    <div><span className="text-gray-500">机构名称：</span><span className="font-medium text-gray-800">{selectedInst.name}</span></div>
                    <div><span className="text-gray-500">所在地区：</span><span className="text-gray-800">{selectedInst.region}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-100">
                    <div><span className="text-gray-500">机构类别：</span><span className="text-gray-800">{selectedInst.category}</span></div>
                    <div><span className="text-gray-500">机构类型：</span><span className="text-gray-800">{selectedInst.type}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-100">
                    <div><span className="text-gray-500">台账总数：</span><span className="font-mono font-bold text-[#1677ff]">{selectedInst.totalLedgers}</span></div>
                    <div><span className="text-gray-500">服务状态：</span><span className="text-green-600 font-medium">{selectedInst.statusText} ({selectedInst.daysRemaining}天)</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-gray-500">服务开始：</span><span className="font-mono text-gray-800">{selectedInst.startDate}</span></div>
                    <div><span className="text-gray-500">服务截止：</span><span className="font-mono text-gray-800">{selectedInst.endDate}</span></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 bg-[#fafafa] p-3 rounded border border-[#e8e8e8] text-center">
                    <div>
                      <div className="text-gray-500 mb-1">网站台账</div>
                      <div className="font-mono font-bold text-gray-800 text-sm">{selectedInst.website}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">抖音台账</div>
                      <div className="font-mono font-bold text-gray-800 text-sm">{selectedInst.douyin}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">微博台账</div>
                      <div className="font-mono font-bold text-gray-800 text-sm">{selectedInst.weibo}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">微信公众号</div>
                      <div className="font-mono font-bold text-gray-800 text-sm">{selectedInst.wechat}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">今日头条</div>
                      <div className="font-mono font-bold text-gray-800 text-sm">{selectedInst.toutiao}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">台账总数</div>
                      <div className="font-mono font-bold text-[#1677ff] text-sm">{selectedInst.totalLedgers}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 italic text-[11px]">注：以上台账数据通过属地多模态舆情采集引擎自动汇聚与去重核验。</div>
                </div>
              )}
            </div>
            <div className="flex justify-end px-6 py-3 border-t border-[#e8e8e8] bg-[#fafafa]">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 bg-[#1677ff] text-white rounded text-xs hover:bg-blue-600 cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
