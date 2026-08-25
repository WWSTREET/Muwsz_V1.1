import React from 'react';
import { FilterState } from '../types';
import { regionsList, categoriesList, typesList, statisticalUnitsList } from '../data/mockData';

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset
}) => {
  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
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
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <span className="px-2 text-xs text-gray-400">{filters.name.length} / 100</span>
        </div>

        <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm relative">
          <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">所在地区</span>
          <select 
            className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
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
            onChange={(e) => handleChange('category', e.target.value)}
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
            onChange={(e) => handleChange('type', e.target.value)}
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
      <div className="flex gap-4">
        <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm max-w-[calc(25%-12px)] relative">
          <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">有效期</span>
          <select 
            className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
            value={filters.validity}
            onChange={(e) => handleChange('validity', e.target.value)}
          >
            <option value="">请选择有效期</option>
            <option value="valid">有效中</option>
            <option value="expiring">即将到期 (&lt;30天)</option>
            <option value="expired">已到期</option>
          </select>
          <i className="fa-solid fa-angle-down text-gray-400 px-2 text-[10px] pointer-events-none absolute right-0"></i>
        </div>

        <div className="flex-1 flex items-center border border-[#e8e8e8] rounded-sm max-w-[calc(25%-12px)] relative">
          <span className="px-3 text-xs text-gray-600 bg-gray-50 border-r border-[#e8e8e8] whitespace-nowrap">统计单元</span>
          <select 
            className="flex-1 border-none text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent cursor-pointer"
            value={filters.statisticalUnit}
            onChange={(e) => handleChange('statisticalUnit', e.target.value)}
          >
            <option value="">请选择统计单元名称</option>
            {statisticalUnitsList.map((su, idx) => (
              <option key={idx} value={su}>{su}</option>
            ))}
          </select>
          <i className="fa-solid fa-angle-down text-gray-400 px-2 text-[10px] pointer-events-none absolute right-0"></i>
        </div>

        <div className="flex-1 flex justify-end gap-2 max-w-[calc(50%-8px)]">
          <button 
            onClick={onSearch}
            className="bg-[#1677ff] text-white px-5 py-1.5 rounded-sm text-xs flex items-center hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-magnifying-glass mr-1.5"></i> 查询
          </button>
          <button 
            onClick={onReset}
            className="bg-gray-50 text-gray-700 border border-[#e8e8e8] px-5 py-1.5 rounded-sm text-xs flex items-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-arrow-rotate-right mr-1.5"></i> 重置
          </button>
        </div>
      </div>
    </div>
  );
};
