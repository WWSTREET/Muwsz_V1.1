import React, { useState, useEffect, useMemo } from 'react';
import { DownloadTask, getDownloadTasks, subscribeDownloadTasks, triggerFileDownload } from '../data/downloadCenterStore';

interface DownloadCenterViewProps {
  onBackToInstitution?: () => void;
}

export const DownloadCenterView: React.FC<DownloadCenterViewProps> = ({ onBackToInstitution }) => {
  const [tasks, setTasks] = useState<DownloadTask[]>(getDownloadTasks());
  const [operatorFilter, setOperatorFilter] = useState('');
  const [taskTypeFilter, setTaskTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloadToast, setDownloadToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    const unsubscribe = subscribeDownloadTasks(newTasks => {
      setTasks(newTasks);
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setDownloadToast({ show: true, msg });
    setTimeout(() => {
      setDownloadToast({ show: false, msg: '' });
    }, 3000);
  };

  const handleDownload = (task: DownloadTask) => {
    if (task.status !== 'completed') {
      alert('任务仍在处理中，请稍候再下载！');
      return;
    }
    triggerFileDownload(task);
    showToast(`已开始下载文件【${task.fileName}】！`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setOperatorFilter('');
    setTaskTypeFilter('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (operatorFilter && t.operator !== operatorFilter) return false;
      if (taskTypeFilter && t.taskType !== taskTypeFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (startDate && t.time < `${startDate} 00:00:00`) return false;
      if (endDate && t.time > `${endDate} 23:59:59`) return false;
      return true;
    });
  }, [tasks, operatorFilter, taskTypeFilter, statusFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
  const pagedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage, pageSize]);

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 min-h-0 text-[#333]">
      {/* Toast Notification */}
      {downloadToast.show && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900/85 text-white px-5 py-2 rounded shadow-lg text-xs flex items-center space-x-2 animate-bounce">
          <i className="fa-solid fa-circle-check text-green-400"></i>
          <span>{downloadToast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-bold text-gray-800">下载中心</h2>
          <span className="text-xs text-gray-400">（记录并管理异步导出的台账任务文件）</span>
        </div>
        {onBackToInstitution && (
          <button
            onClick={onBackToInstitution}
            className="text-xs text-[#1677ff] hover:underline cursor-pointer flex items-center space-x-1"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回机构列表</span>
          </button>
        )}
      </div>

      {/* Filter Bar (Matching Image 4) */}
      <div className="bg-white border border-[#e8e8e8] rounded-sm p-3.5 mb-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
          {/* 操作账号 */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">操作账号</span>
            <select
              value={operatorFilter}
              onChange={e => setOperatorFilter(e.target.value)}
              className="border border-[#d9d9d9] rounded px-2.5 py-1 text-xs text-gray-700 bg-white hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none min-w-[150px]"
            >
              <option value="">请选择操作账号</option>
              <option value="邓东升">邓东升</option>
              <option value="李隆荔">李隆荔</option>
              <option value="相建旗">相建旗</option>
              <option value="王飞飞">王飞飞</option>
              <option value="王卓">王卓</option>
            </select>
          </div>

          {/* 任务类型 */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">任务类型</span>
            <select
              value={taskTypeFilter}
              onChange={e => setTaskTypeFilter(e.target.value)}
              className="border border-[#d9d9d9] rounded px-2.5 py-1 text-xs text-gray-700 bg-white hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none min-w-[150px]"
            >
              <option value="">请选择任务类型</option>
              <option value="台账一键导出">台账一键导出</option>
              <option value="台账选中导出">台账选中导出</option>
              <option value="台账导入日志">台账导入日志</option>
              <option value="错误表述台账一键导出">错误表述台账一键导出</option>
              <option value="错误表述台账选中导出">错误表述台账选中导出</option>
            </select>
          </div>

          {/* 任务状态 */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">任务状态</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-[#d9d9d9] rounded px-2.5 py-1 text-xs text-gray-700 bg-white hover:border-[#4096ff] focus:border-[#1677ff] focus:outline-none min-w-[150px]"
            >
              <option value="">请选择任务状态</option>
              <option value="completed">已完成</option>
              <option value="processing">处理中</option>
              <option value="pending">待处理</option>
              <option value="failed">失败</option>
            </select>
          </div>

          {/* 操作时间 */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">操作时间</span>
            <div className="flex items-center border border-[#d9d9d9] rounded px-2 py-0.5 bg-white space-x-1.5">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="text-xs text-gray-700 focus:outline-none bg-transparent"
                placeholder="开始时间"
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="text-xs text-gray-700 focus:outline-none bg-transparent"
                placeholder="结束时间"
              />
              <i className="fa-regular fa-calendar text-gray-400 text-xs ml-1"></i>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={handleSearch}
              className="bg-[#1677ff] hover:bg-[#4096ff] text-white px-4 py-1 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
            >
              <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
              <span>查询</span>
            </button>
            <button
              onClick={handleReset}
              className="border border-[#d9d9d9] bg-white hover:bg-gray-50 text-gray-700 px-4 py-1 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <i className="fa-solid fa-rotate-right text-[11px]"></i>
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Alert Banner (Matching Image 4) */}
      <div className="flex items-center space-x-2 bg-[#e6f4ff] border border-[#91caff] px-4 py-2.5 rounded-sm text-xs text-gray-700 mb-4">
        <i className="fa-solid fa-circle-info text-[#1677ff] text-sm"></i>
        <span>
          说明：导出任务以异步方式处理，待处理和处理中状态时任务仍在执行；状态为"已完成"后可点击【下载】获取导出文件。
        </span>
      </div>

      {/* Task Table (Matching Image 4) */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-3 py-2.5 font-medium w-[60px] text-center whitespace-nowrap">序号</th>
                <th className="px-4 py-2.5 font-medium w-[35%] whitespace-nowrap">导出文件名</th>
                <th className="px-4 py-2.5 font-medium w-[150px] whitespace-nowrap text-center">任务类型</th>
                <th className="px-3 py-2.5 font-medium w-[90px] text-right whitespace-nowrap">导出条数</th>
                <th className="px-4 py-2.5 font-medium w-[120px] text-center whitespace-nowrap">任务状态</th>
                <th className="px-4 py-2.5 font-medium w-[110px] text-center whitespace-nowrap">操作账号</th>
                <th className="px-4 py-2.5 font-medium w-[160px] text-center whitespace-nowrap">操作时间</th>
                <th className="px-4 py-2.5 font-medium w-[90px] text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-gray-600">
              {pagedTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                      <span>暂无导出任务记录</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedTasks.map((task, index) => {
                  const seq = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={task.id} className="hover:bg-[#fafafa] transition-colors">
                      {/* 序号 */}
                      <td className="px-3 py-2.5 text-center text-gray-500">{seq}</td>

                      {/* 导出文件名 */}
                      <td className="px-4 py-2.5 font-normal text-gray-800 truncate">
                        <div className="flex items-center space-x-1.5 truncate" title={task.fileName}>
                          <i className="fa-solid fa-paperclip text-gray-400 text-xs flex-shrink-0"></i>
                          <span className="truncate hover:text-[#1677ff] cursor-pointer" onClick={() => handleDownload(task)}>
                            {task.fileName}
                          </span>
                        </div>
                      </td>

                      {/* 任务类型 */}
                      <td className="px-4 py-2.5 text-center text-gray-600 whitespace-nowrap">
                        {task.taskType}
                      </td>

                      {/* 导出条数 */}
                      <td className="px-3 py-2.5 text-right font-medium text-gray-700 whitespace-nowrap">
                        {task.count.toLocaleString()}
                      </td>

                      {/* 任务状态 */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        {task.status === 'completed' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-[#52c41a] border border-green-200">
                            <i className="fa-regular fa-circle-check mr-1 text-[10px]"></i>
                            已完成
                          </span>
                        ) : task.status === 'processing' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-200 animate-pulse">
                            <i className="fa-solid fa-spinner fa-spin mr-1 text-[10px]"></i>
                            处理中 {task.progress ? `(${task.progress}%)` : ''}
                          </span>
                        ) : task.status === 'pending' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-[#fa8c16] border border-amber-200">
                            <i className="fa-regular fa-clock mr-1 text-[10px]"></i>
                            待处理
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-[#ff4d4f] border border-red-200">
                            <i className="fa-regular fa-circle-xmark mr-1 text-[10px]"></i>
                            失败
                          </span>
                        )}
                      </td>

                      {/* 操作账号 */}
                      <td className="px-4 py-2.5 text-center text-gray-700 whitespace-nowrap">
                        {task.operator}
                      </td>

                      {/* 操作时间 */}
                      <td className="px-4 py-2.5 text-center text-gray-500 font-mono text-[11px] whitespace-nowrap">
                        {task.time}
                      </td>

                      {/* 操作 */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        {task.status === 'completed' ? (
                          <button
                            onClick={() => handleDownload(task)}
                            className="text-[#1677ff] hover:text-[#4096ff] hover:underline text-xs font-medium cursor-pointer"
                          >
                            下载
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs font-mono select-none cursor-not-allowed">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredTasks.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e8e8e8] bg-[#fafafa] text-xs text-gray-600">
            <div>
              共 <strong className="text-gray-800 font-medium">{filteredTasks.length}</strong> 条记录，
              第 <strong className="text-gray-800 font-medium">{currentPage}</strong> / {totalPages} 页
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded border border-[#d9d9d9] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#1677ff] text-white font-medium border border-[#1677ff]'
                          : 'bg-white border border-[#d9d9d9] hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded border border-[#d9d9d9] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
