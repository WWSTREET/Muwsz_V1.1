import React, { useState, useMemo } from 'react';

export interface ImportLogItem {
  id: string; // 导入ID，如 "31", "30", "29"
  fileName: string; // 文件名称，如 "网站-0807.xlsx"
  platform: '网站' | '今日头条' | '抖音' | '新浪微博' | '微信公众号';
  source: '错误表述管理' | '属地台账管理' | '专项行动管理' | '白名单管理';
  institutionName: string; // 机构名称
  operateTime: string; // 2026-08-07 14:46:00
  operator: string; // 祝亚林, 张小东...
  status: '已完成' | '进行中' | '失败';
  successCount: number;
  failedCount: number;
  totalCount: number;
  detailRows?: ImportDetailRow[];
}

export interface ImportDetailRow {
  id: number;
  name: string;
  platform?: '网站' | '今日头条' | '抖音' | '新浪微博' | '微信公众号';
  url: string;
  status: '成功' | '失败';
  detail: string;
}

// Initial mock logs matching user screenshot 1
const initialImportLogs: ImportLogItem[] = [
  {
    id: '31',
    fileName: '网站-0807.xlsx',
    platform: '网站',
    source: '错误表述管理',
    institutionName: '绵阳市中医院（成都中医药大学附属绵阳医院、绵阳市中医药研究所、四川中医药高等专科学校附属医院）',
    operateTime: '2026-08-07 14:46:00',
    operator: '祝亚林',
    status: '已完成',
    successCount: 100,
    failedCount: 0,
    totalCount: 100,
    detailRows: [
      { id: 1, name: '青岛日报报业集团（青岛日报社）', url: 'https://guanhai.com.cn', status: '成功', detail: '新台账，已导入' },
      { id: 2, name: '青岛日报报业集团（青岛日报社）', url: 'https://219.146.89.130', status: '成功', detail: '新台账，已导入' },
      { id: 3, name: '德州日报社', url: 'https://dezhoudaily.com', status: '成功', detail: '新台账，已导入' },
      { id: 4, name: '日照广播电视台', url: 'https://rzgbdst.com', status: '成功', detail: '新台账，已导入' },
      { id: 5, name: '济南传媒网', url: 'https://laiwumedia.com', status: '成功', detail: '新台账，已导入' },
      { id: 6, name: '荷泽牡丹传媒网', url: 'https://mdtv.cc', status: '成功', detail: '新台账，已导入' },
      { id: 7, name: '台儿庄新闻网', url: 'https://taierzhuang.gov.cn', status: '成功', detail: '新台账，已导入' },
      { id: 8, name: '胶东在线', url: 'https://17lu.net', status: '成功', detail: '新台账，已导入' },
      { id: 9, name: '烟台市融媒体中心（烟台日报社、烟台广播电视台）', url: 'https://120.192.166.252', status: '成功', detail: '新台账，已导入' },
      { id: 10, name: '泰安市广播电视台', url: 'https://218.56.144.100', status: '成功', detail: '新台账，已导入' },
      { id: 11, name: '泰安市广播电视台', url: 'https://124.130.146.172', status: '成功', detail: '新台账，已导入' },
      { id: 12, name: '泰安市广播电视台', url: 'https://1545ts.net', status: '成功', detail: '新台账，已导入' },
      { id: 13, name: '海阳市融媒体中心（海阳市广播电视台）', url: 'https://hyzc.cn', status: '成功', detail: '新台账，已导入' },
      { id: 14, name: '山东广播电视台', url: 'https://iqilu.com', status: '成功', detail: '新台账，已导入' },
      { id: 15, name: '淄博市广播电视台', url: 'https://liaozhai.tv', status: '成功', detail: '新台账，已导入' },
      { id: 16, name: '山东省生态环境厅', url: 'https://sdein.gov.cn', status: '成功', detail: '新台账，已导入' },
      { id: 17, name: '荷泽市广播电视台', url: 'https://hezequanmei.com', status: '成功', detail: '新台账，已导入' },
      { id: 18, name: '掌上临朐', url: 'https://elinqu.com', status: '成功', detail: '新台账，已导入' },
    ]
  },
  {
    id: '30',
    fileName: '今日头条-0807.xlsx',
    platform: '今日头条',
    source: '属地台账管理',
    institutionName: '台湾省教育厅',
    operateTime: '2026-08-07 14:28:50',
    operator: '张小东',
    status: '已完成',
    successCount: 15,
    failedCount: 0,
    totalCount: 15,
    detailRows: [
      { id: 1, name: '台湾省教育厅头条号', url: 'https://www.toutiao.com/c/user/token/tw_edu', status: '成功', detail: '新台账，已导入' },
      { id: 2, name: '台北教育发布', url: 'https://www.toutiao.com/c/user/token/taibei_edu', status: '成功', detail: '新台账，已导入' },
      { id: 3, name: '高雄市教育咨询', url: 'https://www.toutiao.com/c/user/token/gaoxiong_edu', status: '成功', detail: '新台账，已导入' },
    ]
  },
  {
    id: '29',
    fileName: '%E5%8F%B0%E8%B3%B0%E5%8C%AF%E5%85%A5_20260708.xlsx',
    platform: '抖音',
    source: '属地台账管理',
    institutionName: '台湾省教育厅',
    operateTime: '2026-07-08 15:45:14',
    operator: '王飞飞',
    status: '进行中',
    successCount: 0,
    failedCount: 0,
    totalCount: 0,
    detailRows: []
  },
  {
    id: '28',
    fileName: '未命名表格 (4).xlsx',
    platform: '网站',
    source: '错误表述管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:44:18',
    operator: '姚博文',
    status: '已完成',
    successCount: 1,
    failedCount: 0,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '江津网', url: 'https://www.cqjjnet.com', status: '成功', detail: '新台账，已导入' }
    ]
  },
  {
    id: '27',
    fileName: '未命名表格 (4).xlsx',
    platform: '网站',
    source: '属地台账管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:43:58',
    operator: '姚博文',
    status: '已完成',
    successCount: 1,
    failedCount: 0,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '江津政务网', url: 'https://www.jiangjin.gov.cn', status: '成功', detail: '新台账，已导入' }
    ]
  },
  {
    id: '26',
    fileName: '未命名表格 (4).xlsx',
    platform: '抖音',
    source: '错误表述管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:42:59',
    operator: '姚博文',
    status: '已完成',
    successCount: 1,
    failedCount: 0,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '江津融媒抖音号', url: 'https://www.douyin.com/user/jiangjin_media', status: '成功', detail: '新台账，已导入' }
    ]
  },
  {
    id: '25',
    fileName: '未命名表格 (4).xlsx',
    platform: '抖音',
    source: '属地台账管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:42:17',
    operator: '姚博文',
    status: '已完成',
    successCount: 1,
    failedCount: 0,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '江津发布抖音', url: 'https://www.douyin.com/user/jiangjin_fabu', status: '成功', detail: '新台账，已导入' }
    ]
  },
  {
    id: '24',
    fileName: '未命名表格 (4).xlsx',
    platform: '今日头条',
    source: '错误表述管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:19:38',
    operator: '姚博文',
    status: '已完成',
    successCount: 0,
    failedCount: 1,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '涉违规表述非合规号', url: 'https://www.toutiao.com/c/user/token/bad_123', status: '失败', detail: '在黑名单中，未导入' }
    ]
  },
  {
    id: '23',
    fileName: '未命名表格 (4).xlsx',
    platform: '今日头条',
    source: '属地台账管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:19:15',
    operator: '姚博文',
    status: '已完成',
    successCount: 0,
    failedCount: 1,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '失联政务账号', url: 'https://www.toutiao.com/c/user/token/lost_456', status: '失败', detail: '账号已注销，未导入' }
    ]
  },
  {
    id: '22',
    fileName: '未命名表格 (4).xlsx',
    platform: '新浪微博',
    source: '错误表述管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:18:50',
    operator: '姚博文',
    status: '已完成',
    successCount: 0,
    failedCount: 1,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '违规未认证微博', url: 'https://weibo.com/unverified_bad', status: '失败', detail: '在黑名单中，未导入' }
    ]
  },
  {
    id: '21',
    fileName: '未命名表格 (4).xlsx',
    platform: '新浪微博',
    source: '属地台账管理',
    institutionName: '中共重庆市江津区委网络安全和信息化委员会办公室',
    operateTime: '2026-06-17 10:18:28',
    operator: '姚博文',
    status: '已完成',
    successCount: 0,
    failedCount: 1,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '重复提交微博', url: 'https://weibo.com/duplicate_weibo', status: '失败', detail: '批次内高度重复，未导入' }
    ]
  },
  {
    id: '20',
    fileName: '未命名表格 (4).xlsx',
    platform: '网站',
    source: '错误表述管理',
    institutionName: '台湾省网信办',
    operateTime: '2026-06-17 10:14:26',
    operator: '姚博文',
    status: '已完成',
    successCount: 1,
    failedCount: 0,
    totalCount: 1,
    detailRows: [
      { id: 1, name: '台湾网信门户', url: 'https://www.taiwan.gov.tw', status: '成功', detail: '新台账，已导入' }
    ]
  }
];

interface SystemLogViewProps {
  onBackToInstitution?: () => void;
}

export const SystemLogView: React.FC<SystemLogViewProps> = ({ onBackToInstitution }) => {
  const [activeTab, setActiveTab] = useState<'import' | 'manual' | 'operation'>('import');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedLog, setSelectedLog] = useState<ImportLogItem | null>(null);

  // Form Filters (Log List)
  const [fileNameFilter, setFileNameFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Form Filters (Detail Page)
  const [detailNameFilter, setDetailNameFilter] = useState('');
  const [detailStatusFilter, setDetailStatusFilter] = useState('');
  const [detailPlatformFilter, setDetailPlatformFilter] = useState('');

  // Filtered Import Logs
  const filteredImportLogs = useMemo(() => {
    return initialImportLogs.filter(log => {
      if (fileNameFilter && !log.fileName.toLowerCase().includes(fileNameFilter.toLowerCase())) return false;
      if (sourceFilter && log.source !== sourceFilter) return false;
      if (statusFilter) {
        if (statusFilter === '已导入' && log.status === '失败') return false;
        if (statusFilter === '失败' && log.status !== '失败') return false;
        if (statusFilter !== '已导入' && statusFilter !== '失败' && log.status !== statusFilter) return false;
      }
      if (institutionFilter && !log.institutionName.toLowerCase().includes(institutionFilter.toLowerCase())) return false;
      if (operatorFilter && !log.operator.toLowerCase().includes(operatorFilter.toLowerCase())) return false;
      if (startDateFilter && log.operateTime < startDateFilter) return false;
      if (endDateFilter && log.operateTime > endDateFilter + ' 23:59:59') return false;
      return true;
    });
  }, [
    fileNameFilter,
    sourceFilter,
    statusFilter,
    institutionFilter,
    operatorFilter,
    startDateFilter,
    endDateFilter,
  ]);

  // Reset Filters
  const handleResetListFilters = () => {
    setFileNameFilter('');
    setPlatformFilter('');
    setSourceFilter('');
    setStatusFilter('');
    setInstitutionFilter('');
    setOperatorFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const handleResetDetailFilters = () => {
    setDetailNameFilter('');
    setDetailStatusFilter('');
    setDetailPlatformFilter('');
  };

  // Open Log Detail
  const handleOpenDetail = (log: ImportLogItem) => {
    setSelectedLog(log);
    setDetailNameFilter('');
    setDetailStatusFilter('');
    setDetailPlatformFilter('');
    setViewMode('detail');
  };

  // Trigger File Download for batch
  const handleDownloadLogFile = (log: ImportLogItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Generate CSV data for downloading
    let csv = `导入ID,文件名,平台类型,导入来源,机构名称,操作时间,操作人员,状态,成功数,失败数,总数\n`;
    csv += `"${log.id}","${log.fileName}","${log.platform}","${log.source}","${log.institutionName}","${log.operateTime}","${log.operator}","${log.status}",${log.successCount},${log.failedCount},${log.totalCount}\n\n`;

    csv += `序号,台账名称,主页地址,状态,详情说明\n`;
    const details = log.detailRows || [];
    details.forEach((row) => {
      csv += `${row.id},"${row.name}","${row.url}","${row.status}","${row.detail}"\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    element.href = URL.createObjectURL(file);
    element.download = `台账导入日志_批次${log.id}_${log.fileName}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtered Detail Rows
  const filteredDetailRows = useMemo(() => {
    if (!selectedLog || !selectedLog.detailRows) return [];
    return selectedLog.detailRows.filter(row => {
      if (detailNameFilter && !row.name.toLowerCase().includes(detailNameFilter.toLowerCase())) return false;
      if (detailStatusFilter) {
        if (detailStatusFilter === '成功' || detailStatusFilter === '已导入') {
          if (row.status !== '成功') return false;
        } else if (row.status !== detailStatusFilter) {
          return false;
        }
      }
      const itemPlatform = row.platform || selectedLog.platform;
      if (detailPlatformFilter && itemPlatform !== detailPlatformFilter) return false;
      return true;
    });
  }, [selectedLog, detailNameFilter, detailStatusFilter, detailPlatformFilter]);

  // Helper platform icon renderer
  const renderPlatformBadge = (plat: string) => {
    switch (plat) {
      case '网站':
        return (
          <span className="inline-flex items-center text-xs font-medium text-gray-700 whitespace-nowrap">
            <span className="w-4 h-4 rounded-xs bg-blue-600 text-white flex items-center justify-center text-[10px] mr-1.5 font-bold flex-shrink-0">网</span>
            <span>网站</span>
          </span>
        );
      case '今日头条':
        return (
          <span className="inline-flex items-center text-xs font-medium text-gray-700 whitespace-nowrap">
            <span className="w-4 h-4 rounded-xs bg-red-500 text-white flex items-center justify-center text-[10px] mr-1.5 font-bold flex-shrink-0">头</span>
            <span>今日头条</span>
          </span>
        );
      case '抖音':
        return (
          <span className="inline-flex items-center text-xs font-medium text-gray-700 whitespace-nowrap">
            <span className="w-4 h-4 rounded-xs bg-black text-white flex items-center justify-center text-[10px] mr-1.5 font-bold flex-shrink-0">抖</span>
            <span>抖音</span>
          </span>
        );
      case '新浪微博':
      case '微博':
        return (
          <span className="inline-flex items-center text-xs font-medium text-gray-700 whitespace-nowrap">
            <span className="w-4 h-4 rounded-xs bg-orange-500 text-white flex items-center justify-center text-[10px] mr-1.5 font-bold flex-shrink-0">博</span>
            <span>微博</span>
          </span>
        );
      case '微信公众号':
        return (
          <span className="inline-flex items-center text-xs font-medium text-gray-700 whitespace-nowrap">
            <span className="w-4 h-4 rounded-xs bg-green-500 text-white flex items-center justify-center text-[10px] mr-1.5 font-bold flex-shrink-0">微</span>
            <span>微信公众号</span>
          </span>
        );
      default:
        return <span className="text-xs text-gray-700 whitespace-nowrap">{plat}</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col font-sans min-w-0">
      {/* VIEW MODE: DETAIL PAGE (截图 2) */}
      {viewMode === 'detail' && selectedLog ? (
        <div className="flex flex-col space-y-4 min-w-0">
          {/* Top Return Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center space-x-1.5 text-gray-800 hover:text-[#1677ff] font-medium text-sm cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-xs text-gray-500"></i>
              <span>详情</span>
            </button>
          </div>

          {/* Search Filter Bar */}
          <div className="flex items-center justify-between py-2 flex-wrap gap-3">
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">台账名称</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="请输入台账名称"
                    value={detailNameFilter}
                    onChange={(e) => setDetailNameFilter(e.target.value)}
                    maxLength={50}
                    className="w-64 h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none pr-10"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-mono">
                    {detailNameFilter.length}/50
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">状态</span>
                <select
                  value={detailStatusFilter}
                  onChange={(e) => setDetailStatusFilter(e.target.value)}
                  className="h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none bg-white min-w-[130px]"
                >
                  <option value="">请选择状态</option>
                  <option value="成功">已导入</option>
                  <option value="失败">失败</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">平台类型</span>
                <select
                  value={detailPlatformFilter}
                  onChange={(e) => setDetailPlatformFilter(e.target.value)}
                  className="h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none bg-white min-w-[130px]"
                >
                  <option value="">请选择平台类型</option>
                  <option value="网站">网站</option>
                  <option value="微信公众号">微信公众号</option>
                  <option value="今日头条">今日头条</option>
                  <option value="新浪微博">新浪微博</option>
                  <option value="抖音">抖音</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {}}
                className="px-4 py-1.5 bg-[#1677ff] text-white hover:bg-blue-600 rounded text-xs font-medium cursor-pointer flex items-center space-x-1"
              >
                <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
                <span>查询</span>
              </button>
              <button
                onClick={handleResetDetailFilters}
                className="px-4 py-1.5 border border-[#d9d9d9] text-gray-600 hover:bg-gray-50 rounded text-xs font-medium cursor-pointer flex items-center space-x-1"
              >
                <i className="fa-solid fa-rotate-left text-[11px]"></i>
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* Details Table (Matching Screenshot 2) */}
          <div className="border border-[#e8e8e8] rounded overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8]">
                <tr>
                  <th className="px-4 py-3 font-medium w-16 text-center whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 font-medium min-w-[200px] whitespace-nowrap">台账名称</th>
                  <th className="px-4 py-3 font-medium w-28 whitespace-nowrap">平台类型</th>
                  <th className="px-4 py-3 font-medium min-w-[240px] whitespace-nowrap">主页地址</th>
                  <th className="px-4 py-3 font-medium w-28 text-center whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 font-medium min-w-[200px] whitespace-nowrap">详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDetailRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400 whitespace-nowrap">
                      暂无台账日志明细记录
                    </td>
                  </tr>
                ) : (
                  filteredDetailRows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 text-center text-gray-500 font-mono whitespace-nowrap">{row.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{renderPlatformBadge(row.platform || selectedLog.platform)}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1677ff] hover:underline break-all"
                        >
                          {row.url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {row.status === '成功' ? (
                          <span className="inline-flex items-center text-xs text-green-700 font-medium whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                            已导入
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-red-600 font-medium whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                            失败
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.status === '成功' ? '-' : row.detail}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE: LIST PAGE (截图 1) */
        <div className="flex flex-col space-y-5 min-w-0">
          {/* Main Title */}
          <h2 className="text-base font-semibold text-gray-800">日志管理</h2>

          {/* Sub Navigation Tabs */}
          <div className="flex space-x-6 border-b border-[#e8e8e8] text-xs font-medium">
            <button
              onClick={() => setActiveTab('import')}
              className={`pb-2 cursor-pointer transition-colors ${
                activeTab === 'import'
                  ? 'border-b-2 border-[#1677ff] text-[#1677ff] font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              导入台账日志
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`pb-2 cursor-pointer transition-colors ${
                activeTab === 'manual'
                  ? 'border-b-2 border-[#1677ff] text-[#1677ff] font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              手动添加台账日志
            </button>
            <button
              onClick={() => setActiveTab('operation')}
              className={`pb-2 cursor-pointer transition-colors ${
                activeTab === 'operation'
                  ? 'border-b-2 border-[#1677ff] text-[#1677ff] font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              操作日志
            </button>
          </div>

          {activeTab === 'import' && (
            <div className="flex flex-col space-y-4 min-w-0">
              {/* Form Filter Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* 文件名称 */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 min-w-[56px] text-right whitespace-nowrap">文件名称</span>
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      placeholder="请输入文件名称"
                      value={fileNameFilter}
                      onChange={(e) => setFileNameFilter(e.target.value)}
                      maxLength={50}
                      className="w-full h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none pr-10"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-mono">
                      {fileNameFilter.length}/50
                    </span>
                  </div>
                </div>

                {/* 导入来源 */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 min-w-[56px] text-right whitespace-nowrap">导入来源</span>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none bg-white min-w-0"
                  >
                    <option value="">请选择导入来源</option>
                    <option value="错误表述管理">错误表述管理</option>
                    <option value="属地台账管理">属地台账管理</option>
                    <option value="专项行动管理">专项行动管理</option>
                  </select>
                </div>

                {/* 导入状态 */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 min-w-[56px] text-right whitespace-nowrap">导入状态</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none bg-white min-w-0"
                  >
                    <option value="">请选择导入状态</option>
                    <option value="已导入">已导入</option>
                    <option value="失败">失败</option>
                  </select>
                </div>
              </div>

              {/* Form Filter Row 2 */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {/* 机构名称 */}
                <div className="flex items-center space-x-2 flex-1 min-w-[220px]">
                  <span className="text-gray-600 min-w-[56px] text-right whitespace-nowrap">机构名称</span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="请输入机构名称"
                      value={institutionFilter}
                      onChange={(e) => setInstitutionFilter(e.target.value)}
                      maxLength={100}
                      className="w-full h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none pr-10"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-mono">
                      {institutionFilter.length}/100
                    </span>
                  </div>
                </div>

                {/* 操作人员 */}
                <div className="flex items-center space-x-2 min-w-[180px] w-52">
                  <span className="text-gray-600 min-w-[56px] text-right whitespace-nowrap">操作人员</span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="请输入操作人员"
                      value={operatorFilter}
                      onChange={(e) => setOperatorFilter(e.target.value)}
                      maxLength={10}
                      className="w-full h-8 px-2.5 text-xs border border-[#d9d9d9] rounded focus:border-[#1677ff] focus:outline-none pr-10"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-mono">
                      {operatorFilter.length}/10
                    </span>
                  </div>
                </div>

                {/* 操作时间 */}
                <div className="flex items-center space-x-2 min-w-[280px]">
                  <span className="text-gray-600 min-w-[56px] text-right whitespace-nowrap">操作时间</span>
                  <div className="flex items-center space-x-1 border border-[#d9d9d9] rounded px-2 h-8 bg-white focus-within:border-[#1677ff]">
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="w-28 text-xs text-gray-600 outline-none bg-transparent"
                    />
                    <span className="text-gray-400">~</span>
                    <input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="w-28 text-xs text-gray-600 outline-none bg-transparent"
                    />
                    <i className="fa-regular fa-calendar text-gray-400 text-xs"></i>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={() => {}}
                    className="px-4 py-1.5 bg-[#1677ff] text-white hover:bg-blue-600 rounded text-xs font-medium cursor-pointer flex items-center space-x-1 whitespace-nowrap"
                  >
                    <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
                    <span>查询</span>
                  </button>
                  <button
                    onClick={handleResetListFilters}
                    className="px-4 py-1.5 border border-[#d9d9d9] text-gray-600 hover:bg-gray-50 rounded text-xs font-medium cursor-pointer flex items-center space-x-1 whitespace-nowrap"
                  >
                    <i className="fa-solid fa-rotate-left text-[11px]"></i>
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* Data Table (Matching Screenshot 1) */}
              <div className="border border-[#e8e8e8] rounded overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs min-w-[1000px]">
                  <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8]">
                    <tr>
                      <th className="px-3 py-3 font-medium w-12 text-center whitespace-nowrap">序号</th>
                      <th className="px-3 py-3 font-medium w-16 text-center whitespace-nowrap">导入ID</th>
                      <th className="px-3 py-3 font-medium min-w-[160px] max-w-[220px] whitespace-nowrap">文件名称</th>
                      <th className="px-3 py-3 font-medium w-28 whitespace-nowrap">导入来源</th>
                      <th className="px-3 py-3 font-medium min-w-[200px] max-w-[320px] whitespace-nowrap">机构名称</th>
                      <th className="px-3 py-3 font-medium w-40 whitespace-nowrap">操作时间</th>
                      <th className="px-3 py-3 font-medium w-20 whitespace-nowrap">操作人员</th>
                      <th className="px-3 py-3 font-medium w-24 text-center whitespace-nowrap">导入状态</th>
                      <th className="px-3 py-3 font-medium w-36 text-center whitespace-nowrap">数据(成功/失败/总数)</th>
                      <th className="px-3 py-3 font-medium w-24 text-center whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredImportLogs.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-3 py-10 text-center text-gray-400 whitespace-nowrap">
                          暂无符合条件的导入台账日志
                        </td>
                      </tr>
                    ) : (
                      filteredImportLogs.map((log, index) => (
                        <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-3 py-3 text-center text-gray-500 font-mono whitespace-nowrap">{index + 1}</td>
                          <td className="px-3 py-3 text-center text-gray-600 font-mono whitespace-nowrap">{log.id}</td>
                          <td className="px-3 py-3 font-medium min-w-[160px] max-w-[220px] truncate whitespace-nowrap">
                            <span
                              onClick={() => handleOpenDetail(log)}
                              className="text-[#1677ff] hover:underline cursor-pointer inline-flex items-center truncate"
                              title={log.fileName}
                            >
                              <i className="fa-solid fa-paperclip text-xs mr-1 text-gray-400 flex-shrink-0"></i>
                              <span className="truncate">{log.fileName}</span>
                            </span>
                          </td>
                          <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{log.source}</td>
                          <td className="px-3 py-3 text-gray-700 min-w-[200px] max-w-[320px] truncate whitespace-nowrap" title={log.institutionName}>
                            {log.institutionName}
                          </td>
                          <td className="px-3 py-3 text-gray-500 font-mono whitespace-nowrap">{log.operateTime}</td>
                          <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{log.operator}</td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {log.status === '失败' ? (
                              <span className="inline-flex items-center text-xs text-red-600 font-medium whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 flex-shrink-0"></span>
                                失败
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs text-green-700 font-medium whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 flex-shrink-0"></span>
                                已导入
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-medium whitespace-nowrap">
                            <span className="text-green-600">{log.successCount}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className={log.failedCount > 0 ? 'text-red-500' : 'text-gray-600'}>{log.failedCount}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-gray-700">{log.totalCount}</span>
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap space-x-2">
                            <button
                              onClick={() => handleOpenDetail(log)}
                              className="text-[#1677ff] hover:underline text-xs cursor-pointer font-medium"
                            >
                              详情
                            </button>
                            <button
                              onClick={(e) => handleDownloadLogFile(log, e)}
                              className="text-[#1677ff] hover:underline text-xs cursor-pointer font-medium"
                            >
                              下载
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="border border-[#e8e8e8] rounded p-8 text-center bg-gray-50">
              <i className="fa-solid fa-file-pen text-3xl text-gray-300 mb-2"></i>
              <p className="text-xs text-gray-500">显示手动检索匹配与新增台账日志记录（含添加白名单、黑名单动作等）</p>
            </div>
          )}

          {activeTab === 'operation' && (
            <div className="border border-[#e8e8e8] rounded p-8 text-center bg-gray-50">
              <i className="fa-solid fa-list-check text-3xl text-gray-300 mb-2"></i>
              <p className="text-xs text-gray-500">显示管理员与系统配置规则变更日志记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
