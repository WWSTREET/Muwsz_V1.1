import React, { useState } from 'react';

export interface ExportField {
  id: string;
  name: string;
  required?: boolean;
}

export const EXPORT_FIELD_LIST: ExportField[] = [
  { id: 'name', name: '台账名称', required: true },
  { id: 'platform', name: '所属平台' },
  { id: 'homepage', name: '主页地址' },
  { id: 'fans', name: '粉丝数量' },
  { id: 'authType', name: '台账认证类型' },
  { id: 'vBadge', name: '认证标识（V标）' },
  { id: 'authDesc', name: '台账认证信息' },
  { id: 'summary', name: '台账简介' },
  { id: 'jurisdiction', name: '管辖归属地' },
  { id: 'ipLocation', name: 'IP属地' },
  { id: 'lastPostLocation', name: '最后一天发文地址' },
  { id: 'registeredLocation', name: '注册地址' },
  { id: 'modelLocation', name: '区域模型地址' },
  { id: 'pendingModelLocation', name: '待确认区域模型地址' },
  { id: 'judgmentType', name: '台账研判类型' },
  { id: 'subjectName', name: '关联主体名称' },
  { id: 'subjectType', name: '主体类型' },
];

export const ERROR_DATA_EXPORT_FIELDS: ExportField[] = [
  { id: 'title', name: '文章标题', required: true },
  { id: 'errorType', name: '错误类型', required: true },
  { id: 'wrongText', name: '错误内容（原词）', required: true },
  { id: 'correctText', name: '建议修正', required: true },
  { id: 'status', name: '修正状态' },
  { id: 'ledgerName', name: '台账名称' },
  { id: 'platform', name: '所属平台' },
  { id: 'institutionName', name: '所属机构' },
  { id: 'subjectType', name: '主体类型' },
  { id: 'publishTime', name: '发布时间' },
  { id: 'alertStatus', name: '预警状态' },
  { id: 'alertTime', name: '预警时间' },
  { id: 'url', name: '原文链接' },
  { id: 'postContent', name: '发文内容' },
];

interface ExportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
  exportMode: 'selected' | 'all';
  ledgerTypeName?: string; // e.g. '属地台账' | '错误表述台账' | '错误表述数据'
  fields?: ExportField[];
  onConfirmExport: (selectedFieldNames: string[]) => void;
}

export const ExportConfigModal: React.FC<ExportConfigModalProps> = ({
  isOpen,
  onClose,
  totalCount,
  exportMode,
  ledgerTypeName = '属地台账',
  fields,
  onConfirmExport,
}) => {
  const activeFields = fields || EXPORT_FIELD_LIST;

  // Default all fields selected
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(
    activeFields.map(f => f.id)
  );

  // Sync if fields prop changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedFieldIds(activeFields.map(f => f.id));
    }
  }, [isOpen, fields]);

  if (!isOpen) return null;

  const isAllSelected = selectedFieldIds.length === activeFields.length;
  const isIndeterminate = selectedFieldIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // Keep only required ones
      setSelectedFieldIds(activeFields.filter(f => f.required).map(f => f.id));
    } else {
      setSelectedFieldIds(activeFields.map(f => f.id));
    }
  };

  const handleToggleField = (field: ExportField) => {
    if (field.required) return; // Cannot uncheck required field
    if (selectedFieldIds.includes(field.id)) {
      setSelectedFieldIds(prev => prev.filter(id => id !== field.id));
    } else {
      setSelectedFieldIds(prev => [...prev, field.id]);
    }
  };

  const handleStartExport = () => {
    const selectedFieldNames = activeFields
      .filter(f => selectedFieldIds.includes(f.id))
      .map(f => f.name);
    onConfirmExport(selectedFieldNames);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="bg-white rounded-md shadow-2xl w-[680px] max-w-[92vw] overflow-hidden flex flex-col border border-gray-100 text-[#333]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">配置导出项</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-lg p-1 leading-none rounded hover:bg-gray-100"
            title="关闭"
          >
            &times;
          </button>
        </div>

        {/* Modal Sub-Header (Select All + Count) */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer select-none text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={el => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onChange={handleToggleSelectAll}
              className="w-3.5 h-3.5 text-[#1677ff] rounded border-gray-300 focus:ring-0 cursor-pointer"
            />
            <span>全选</span>
          </label>
          <span className="text-gray-500 font-normal">
            已选 <strong className="text-[#1677ff] font-semibold">{selectedFieldIds.length}</strong> / {activeFields.length} 项
          </span>
        </div>

        {/* Field Selection Grid */}
        <div className="px-6 py-3 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2.5">
            {activeFields.map(field => {
              const isChecked = selectedFieldIds.includes(field.id);
              return (
                <div
                  key={field.id}
                  onClick={() => handleToggleField(field)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded text-xs transition-colors select-none ${
                    field.required
                      ? 'bg-[#f0f5ff] text-gray-500 cursor-not-allowed border border-[#d6e4ff]'
                      : isChecked
                      ? 'bg-[#f0f7ff] text-gray-800 border border-[#bae0ff] hover:bg-[#e6f4ff] cursor-pointer'
                      : 'bg-[#f8f9fa] text-gray-600 border border-gray-200 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={field.required}
                    onChange={() => {}} // Handled by parent div
                    className="w-3.5 h-3.5 text-[#1677ff] rounded border-gray-300 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center truncate">
                    {field.required && <span className="text-red-500 mr-1 font-bold">*</span>}
                    <span className="truncate">{field.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-[#fafafa]">
          <div className="text-xs text-gray-600">
            本次共选择 <strong className="text-[#1677ff] font-bold text-sm">{totalCount}</strong> 条{exportMode === 'selected' ? ' (勾选项)' : ' (全部)'}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-normal transition-colors cursor-pointer shadow-2xs"
            >
              取消
            </button>
            <button
              onClick={handleStartExport}
              disabled={selectedFieldIds.length === 0}
              className="px-5 py-1.5 rounded bg-[#1677ff] hover:bg-[#4096ff] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-download text-[11px]"></i>
              <span>开始导出</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
