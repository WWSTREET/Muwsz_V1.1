import React from 'react';
import { Institution } from '../types';

interface InstitutionTableProps {
  institutions: Institution[];
  onToggleStatus: (id: number) => void;
  onViewDetail: (institution: Institution) => void;
  onEdit: (institution: Institution) => void;
  onDelete: (id: number) => void;
}

export const InstitutionTable: React.FC<InstitutionTableProps> = ({
  institutions,
  onToggleStatus,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border border-[#e8e8e8] rounded-t-sm overflow-hidden shadow-xs bg-white">
      <table className="w-full text-left text-xs table-fixed">
        <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
          <tr>
            <th className="px-3 py-2.5 font-normal w-[48px] text-center whitespace-nowrap">序号</th>
            <th className="px-3 py-2.5 font-normal w-[24%] whitespace-nowrap">机构信息</th>
            <th className="px-3 py-2.5 font-normal w-[14%] whitespace-nowrap">机构类别</th>
            <th className="px-3 py-2.5 font-normal w-[15%] whitespace-nowrap">销售</th>
            <th className="px-3 py-2.5 font-normal w-[90px] text-center whitespace-nowrap">机构状态</th>
            <th className="px-3 py-2.5 font-normal w-[140px] whitespace-nowrap">服务周期</th>
            <th className="px-3 py-2.5 font-normal w-[90px] text-center whitespace-nowrap">到期倒计时</th>
            <th className="px-3 py-2.5 font-normal w-[130px] text-center whitespace-nowrap">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e8e8e8]">
          {institutions.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                暂无符合条件的机构数据
              </td>
            </tr>
          ) : (
            institutions.map((inst, index) => {
              const isTrial = inst.status === 'trial';
              return (
                <tr key={inst.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-3 py-2.5 text-gray-500 text-center whitespace-nowrap">{index + 1}</td>
                  <td className="px-3 py-2.5 overflow-hidden">
                    <div className="flex items-center min-w-0">
                      {isTrial ? (
                        <span className="text-[#d46b08] bg-[#ffe7ba] border border-[#ffd591] text-[10px] px-1 rounded-xs mr-1.5 leading-tight flex-shrink-0">试用</span>
                      ) : (
                        <span className="text-[#1677ff] bg-[#e6f0ff] border border-[#91caff] text-[10px] px-1 rounded-xs mr-1.5 leading-tight flex-shrink-0">正式</span>
                      )}
                      <span className="font-medium text-gray-800 truncate" title={inst.name}>
                        {inst.name}
                      </span>
                    </div>
                    <div className="text-gray-400 text-[11px] truncate mt-0.5" title={inst.region}>{inst.region}</div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 overflow-hidden">
                    <div className="truncate text-gray-800 font-normal" title={inst.category}>{inst.category}</div>
                    <div className="text-gray-400 text-[11px] truncate" title={inst.type}>{inst.type}</div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 overflow-hidden">
                    <div className="truncate text-gray-800 font-normal" title={inst.salesName}>{inst.salesName}</div>
                    <div className="text-gray-400 text-[11px] font-mono truncate" title={inst.salesPhone}>{inst.salesPhone}</div>
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap">
                    {/* Toggle Switch */}
                    <div 
                      onClick={() => onToggleStatus(inst.id)}
                      className={`relative inline-block w-[40px] h-[20px] rounded-[20px] cursor-pointer transition-colors ${
                        inst.isActive ? 'bg-[#1677ff]' : 'bg-gray-300'
                      }`}
                      title={inst.isActive ? '点击关闭' : '点击开启'}
                    >
                      <div 
                        className={`absolute top-[2px] w-[16px] h-[16px] bg-white rounded-full transition-all shadow-xs ${
                          inst.isActive ? 'left-[22px]' : 'left-[2px]'
                        }`}
                      ></div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-mono text-[11px] whitespace-nowrap overflow-hidden">
                    <div className="truncate" title={`始: ${inst.startDate}`}>始: {inst.startDate}</div>
                    <div className="truncate" title={`止: ${inst.endDate}`}>止: {inst.endDate}</div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-medium text-center whitespace-nowrap">
                    <span className="px-1.5 py-0.5 bg-orange-50 text-[#fa8c16] rounded-xs border border-orange-200 text-xs font-mono">
                      {inst.daysRemaining}天
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2.5">
                      <button 
                        onClick={() => onViewDetail(inst)}
                        className="text-[#1677ff] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
                      >
                        详情
                      </button>
                      <button 
                        onClick={() => onEdit(inst)}
                        className="text-[#1677ff] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => onDelete(inst.id)}
                        className="text-[#ff4d4f] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Table Pagination / Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#fafafa] border-t border-[#e8e8e8] text-xs text-gray-500">
        <div>共 {institutions.length} 条记录</div>
        <div className="flex items-center space-x-2">
          <button className="px-2.5 py-1 border border-[#d9d9d9] rounded bg-white hover:bg-gray-100 disabled:opacity-50">上一页</button>
          <span className="px-2 py-1 bg-[#1677ff] text-white rounded">1</span>
          <button className="px-2.5 py-1 border border-[#d9d9d9] rounded bg-white hover:bg-gray-100 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};
