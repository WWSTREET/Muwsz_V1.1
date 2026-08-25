import React from 'react';

interface OtherPagesViewProps {
  viewKey: string;
  onBackToInstitution: () => void;
}

export const OtherPagesView: React.FC<OtherPagesViewProps> = ({ viewKey, onBackToInstitution }) => {
  const titles: Record<string, { title: string; group: string; desc: string }> = {
    local_institution: { title: '属地机构', group: '属地台账管理', desc: '管理各属地监管单位及直属机构信息档案。' },
    local_ledger: { title: '属地台账', group: '属地台账管理', desc: '查看和维护属地台账明细及合规性记录。' },
    error_institution: { title: '错误表述机构', group: '错误表述管理', desc: '监控与核查各机构历史错误表述及整改情况。' },
    error_ledger: { title: '错误表述台账', group: '错误表述管理', desc: '记录文本监测中发现的错误表述清单。' },
    error_data: { title: '错误表述数据', group: '错误表述管理', desc: '大数据分析与错误表述统计报表。' },
    error_history: { title: '历史数据采集', group: '错误表述管理', desc: '历史互联网公开信息自动化采集与存档。' },
    special_institution: { title: '专项行动机构', group: '专项行动管理', desc: '专项治理行动参与机构一览及进度督办。' },
    special_plan: { title: '专项行动方案', group: '专项行动管理', desc: '制定和发布各阶段专项治理行动方案。' },
    system_logs: { title: '日志管理', group: '系统管理', desc: '查看系统管理员及各机构操作审计日志。' },
  };

  const current = titles[viewKey] || { title: '管理页面', group: '系统功能', desc: '牧网守正后台管理系统子模块。' };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col">
      {/* Breadcrumb & Title */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#e8e8e8]">
        <div>
          <div className="text-xs text-gray-400 mb-1">
            {current.group} <i className="fa-solid fa-chevron-right mx-1 text-[9px]"></i> <span className="text-gray-700">{current.title}</span>
          </div>
          <h2 className="text-base font-semibold text-gray-800">{current.title}</h2>
        </div>
        <button
          onClick={onBackToInstitution}
          className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded text-xs hover:bg-gray-200 transition-colors flex items-center cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left mr-1.5"></i> 返回机构管理
        </button>
      </div>

      {/* Content box */}
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#d9d9d9] rounded-lg p-12 text-center bg-[#fafafa]">
        <div className="w-16 h-16 bg-[#e6f0ff] text-[#1677ff] rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">
          <i className="fa-solid fa-layer-group"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{current.title} 模块</h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">{current.desc}</p>
        <div className="flex gap-3">
          <button 
            onClick={() => alert(`正在加载 ${current.title} 数据...`)}
            className="bg-[#1677ff] text-white px-4 py-2 rounded text-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-rotate mr-1.5"></i> 刷新数据
          </button>
          <button 
            onClick={onBackToInstitution}
            className="bg-white border border-[#d9d9d9] text-gray-700 px-4 py-2 rounded text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
};
