import React, { useState, useMemo, useRef, useEffect } from 'react';

export const ALL_INSTITUTIONS_DATABASE = [
  '中共陕西省委网络安全和信息化委员会办公室',
  '西安市网络安全和信息化委员会办公室',
  '中共西安市雁塔区委网络安全和信息化委员会办公室',
  '中共西安市碑林区委网络安全和信息化委员会办公室',
  '中共西安市莲湖区委网络安全和信息化委员会办公室',
  '中共宝鸡市委网络安全和信息化委员会办公室',
  '中共咸阳市委网络安全和信息化委员会办公室',
  '中共汉中市委网络安全和信息化委员会办公室',
  '中共榆林市委网络安全和信息化委员会办公室',
  '中共延安市委网络安全和信息化委员会办公室',
  '中共洛阳市委网络安全和信息化委员会办公室',
  '中共河南省委网络安全和信息化委员会办公室',
  '郑州市网络安全和信息化委员会办公室',
  '阳泉市公安局',
  '中共山西省委网络安全和信息化委员会办公室',
  '太原市网络安全和信息化委员会办公室',
  '中共峡江县委宣传部',
  '北京市网络安全和信息化委员会办公室',
  '中共北京市海淀区委宣传部',
  '中共北京市朝阳区委宣传部',
  '上海市网络安全和信息化委员会办公室',
  '中共上海市浦东新区区委宣传部',
  '中共广东省委网络安全和信息化委员会办公室',
  '广州市网络安全和信息化委员会办公室',
  '深圳市网络安全和信息化委员会办公室',
  '杭州市网络安全和信息化委员会办公室',
  '中共浙江省委网络安全和信息化委员会办公室',
  '成都市网络安全和信息化委员会办公室',
  '中共四川省委网络安全和信息化委员会办公室',
  '武汉市网络安全和信息化委员会办公室',
  '中共湖北省委网络安全和信息化委员会办公室',
  '南京市网络安全和信息化委员会办公室',
  '中共江苏省委网络安全和信息化委员会办公室',
];

export interface InstitutionSearchSelectProps {
  selectedInstitutions: string[];
  onChange: (institutions: string[]) => void;
  onToast: (msg: string) => void;
}

export const InstitutionSearchSelect: React.FC<InstitutionSearchSelectProps> = ({
  selectedInstitutions,
  onChange,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered institutions based on search term
  const filteredInstitutions = useMemo(() => {
    if (!searchTerm.trim()) {
      return ALL_INSTITUTIONS_DATABASE;
    }
    const term = searchTerm.trim().toLowerCase();
    return ALL_INSTITUTIONS_DATABASE.filter(inst =>
      inst.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleToggleInstitution = (inst: string) => {
    if (selectedInstitutions.includes(inst)) {
      if (selectedInstitutions.length === 1) {
        onToast('统一行动请至少保留一个机构');
        return;
      }
      onChange(selectedInstitutions.filter(i => i !== inst));
    } else {
      onChange([...selectedInstitutions, inst]);
    }
  };

  const handleRemoveInstitution = (inst: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedInstitutions.length === 1) {
      onToast('统一行动请至少保留一个机构');
      return;
    }
    onChange(selectedInstitutions.filter(i => i !== inst));
  };

  const handleSelectAllFiltered = () => {
    const combined = Array.from(
      new Set([...selectedInstitutions, ...filteredInstitutions])
    );
    onChange(combined);
    onToast(`已勾选当前搜索的 ${filteredInstitutions.length} 个机构`);
  };

  const handleClearSelected = () => {
    if (ALL_INSTITUTIONS_DATABASE.length > 0) {
      onChange([ALL_INSTITUTIONS_DATABASE[0]]);
      onToast('已清空多余机构，保留默认主机构');
    }
  };

  return (
    <div ref={containerRef} className="space-y-2 relative text-xs">
      {/* 机构选择器主输入框 */}
      <div
        onClick={() => setIsDropdownOpen(true)}
        className={`min-h-[42px] p-2 bg-white rounded border cursor-pointer transition flex flex-wrap items-center gap-1.5 ${
          isDropdownOpen
            ? 'border-[#1677ff] ring-2 ring-blue-100 shadow-xs'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {/* 已选机构 Tag 胶囊 */}
        {selectedInstitutions.map(inst => (
          <span
            key={inst}
            className="inline-flex items-center space-x-1.5 bg-[#e6f4ff] border border-[#91caff] text-[#0958d9] px-2.5 py-1 rounded text-xs transition"
          >
            <i className="fa-regular fa-building text-[11px]"></i>
            <span className="max-w-[280px] truncate" title={inst}>
              {inst}
            </span>
            <button
              type="button"
              onClick={e => handleRemoveInstitution(inst, e)}
              className="text-blue-400 hover:text-red-500 cursor-pointer text-[11px] leading-none"
              title="移除该机构"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </span>
        ))}

        {/* 内嵌搜索输入框 */}
        <div className="flex-1 flex items-center min-w-[180px] pl-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={
              selectedInstitutions.length === 0
                ? '输入关键词搜索机构，可多选（例如：陕西、西安、洛阳、公安）...'
                : '输入关键词继续搜索添加机构...'
            }
            className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* 右侧展开与搜索图标 */}
        <div className="flex items-center space-x-2 text-gray-400 shrink-0 pr-1">
          {searchTerm && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setSearchTerm('');
              }}
              className="hover:text-gray-600 cursor-pointer"
              title="清空搜索词"
            >
              <i className="fa-solid fa-circle-xmark text-xs"></i>
            </button>
          )}
          <i
            className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180 text-[#1677ff]' : ''
            }`}
          ></i>
        </div>
      </div>

      {/* 统计与快捷操作 */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 px-0.5">
        <span>
          已选择 <strong className="text-[#1677ff] font-bold">{selectedInstitutions.length}</strong> 个机构
        </span>
        <span className="text-gray-400">支持输入省、市、区县、机构名称关键字实时检索多选</span>
      </div>

      {/* 下拉搜索多选面板 */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 space-y-2.5 animate-fade-in">
          {/* 顶部过滤工具条 */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
              <span className="font-bold text-gray-700">
                {searchTerm ? `搜索结果（${filteredInstitutions.length}）` : `全部机构候选库（${ALL_INSTITUTIONS_DATABASE.length}）`}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-[#1677ff] hover:underline cursor-pointer font-medium"
              >
                勾选当前全部结果
              </button>
              <span className="text-gray-200">|</span>
              <button
                type="button"
                onClick={handleClearSelected}
                className="text-gray-500 hover:text-red-500 cursor-pointer"
              >
                重置
              </button>
            </div>
          </div>

          {/* 机构候选列表 (可滚动) */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {filteredInstitutions.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                <i className="fa-regular fa-folder-open text-base mb-1 block"></i>
                未找到匹配 “<span className="text-gray-600">{searchTerm}</span>” 的机构
              </div>
            ) : (
              filteredInstitutions.map(inst => {
                const isSelected = selectedInstitutions.includes(inst);

                return (
                  <div
                    key={inst}
                    onClick={() => handleToggleInstitution(inst)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-900 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Controlled by outer div click
                        className="rounded border-gray-300 text-[#1677ff] focus:ring-0 cursor-pointer shrink-0"
                      />
                      <span className="truncate" title={inst}>
                        {/* 高亮搜索字 */}
                        {searchTerm ? (
                          <span>
                            {inst.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) =>
                              part.toLowerCase() === searchTerm.toLowerCase() ? (
                                <mark key={i} className="bg-yellow-200 text-gray-900 rounded-xs px-0.5">
                                  {part}
                                </mark>
                              ) : (
                                part
                              )
                            )}
                          </span>
                        ) : (
                          inst
                        )}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded font-normal shrink-0">
                        已选择
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 底部确认栏 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
            <span className="text-gray-400">
              已勾选 <strong className="text-[#1677ff]">{selectedInstitutions.length}</strong> 个机构
            </span>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(false)}
              className="px-3 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer shadow-xs transition"
            >
              完成选择
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
