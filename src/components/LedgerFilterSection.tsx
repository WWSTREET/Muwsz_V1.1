import React, { useState } from 'react';

export interface LedgerFilterCriteria {
  nameType: string;
  nameKeyword: string;
  excludeKeyword: string;
  platform: string;
  authType: string;
  address: string;
  judgmentType: string;
  collectStatus: string;
  fansMin: string;
  fansMax: string;
  ledgerStatus: string;
  subjectTypeAll: boolean;
  selectedSubjectTypes: string[];
  subjectTagAll: boolean;
  selectedSubjectTags: string[];
  ledgerTagAll: boolean;
  selectedLedgerTags: string[];
}

export const initialFilterCriteria: LedgerFilterCriteria = {
  nameType: '台账名称',
  nameKeyword: '',
  excludeKeyword: '',
  platform: '全部',
  authType: '全部',
  address: '全部',
  judgmentType: '全部',
  collectStatus: '全部',
  fansMin: '',
  fansMax: '',
  ledgerStatus: '全部',
  subjectTypeAll: false,
  selectedSubjectTypes: [],
  subjectTagAll: false,
  selectedSubjectTags: [],
  ledgerTagAll: false,
  selectedLedgerTags: [],
};

export interface LedgerFilterSectionProps {
  totalCount: number;
  filters: LedgerFilterCriteria;
  onFilterChange: (filters: LedgerFilterCriteria) => void;
  onQuery: () => void;
  onReset: () => void;
  defaultExpanded?: boolean;
}

export const LedgerFilterSection: React.FC<LedgerFilterSectionProps> = ({
  totalCount,
  filters,
  onFilterChange,
  onQuery,
  onReset,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const updateFilter = (field: keyof LedgerFilterCriteria, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const subjectTypeList = [
    '机构编制', '外交', '司法行政', '旅游', '民政', '宗教', '工会', '工商',
    '中央军委改革和编制办公室', '住房城乡建设', '农业', '侨联', '贸易促进', '文化', '无类型'
  ];

  const subjectTagList = ['教育类', '公安', '医疗', '无标签'];

  const ledgerTagList = ['媒体属性', '级别', '暂时屏蔽', '废弃政务类废弃', '废弃媒体类废弃', '无标签'];

  const toggleSubjectType = (type: string) => {
    const list = filters.selectedSubjectTypes;
    if (list.includes(type)) {
      const next = list.filter(t => t !== type);
      onFilterChange({
        ...filters,
        selectedSubjectTypes: next,
        subjectTypeAll: next.length === subjectTypeList.length,
      });
    } else {
      const next = [...list, type];
      onFilterChange({
        ...filters,
        selectedSubjectTypes: next,
        subjectTypeAll: next.length === subjectTypeList.length,
      });
    }
  };

  const handleToggleSubjectTypeAll = (checked: boolean) => {
    onFilterChange({
      ...filters,
      subjectTypeAll: checked,
      selectedSubjectTypes: checked ? [...subjectTypeList] : [],
    });
  };

  const toggleSubjectTag = (tag: string) => {
    const list = filters.selectedSubjectTags;
    if (list.includes(tag)) {
      const next = list.filter(t => t !== tag);
      onFilterChange({
        ...filters,
        selectedSubjectTags: next,
        subjectTagAll: next.length === subjectTagList.length,
      });
    } else {
      const next = [...list, tag];
      onFilterChange({
        ...filters,
        selectedSubjectTags: next,
        subjectTagAll: next.length === subjectTagList.length,
      });
    }
  };

  const handleToggleSubjectTagAll = (checked: boolean) => {
    onFilterChange({
      ...filters,
      subjectTagAll: checked,
      selectedSubjectTags: checked ? [...subjectTagList] : [],
    });
  };

  const toggleLedgerTag = (tag: string) => {
    const list = filters.selectedLedgerTags;
    if (list.includes(tag)) {
      const next = list.filter(t => t !== tag);
      onFilterChange({
        ...filters,
        selectedLedgerTags: next,
        ledgerTagAll: next.length === ledgerTagList.length,
      });
    } else {
      const next = [...list, tag];
      onFilterChange({
        ...filters,
        selectedLedgerTags: next,
        ledgerTagAll: next.length === ledgerTagList.length,
      });
    }
  };

  const handleToggleLedgerTagAll = (checked: boolean) => {
    onFilterChange({
      ...filters,
      ledgerTagAll: checked,
      selectedLedgerTags: checked ? [...ledgerTagList] : [],
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2.5 shadow-xs text-xs">
      {/* Row 1 */}
      <div className="grid grid-cols-4 gap-3">
        {/* 1. 台账名称 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <select
            value={filters.nameType}
            onChange={e => updateFilter('nameType', e.target.value)}
            className="px-2 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium cursor-pointer focus:outline-none"
          >
            <option value="台账名称">台账名称</option>
            <option value="账号">账号</option>
            <option value="URL">URL</option>
            <option value="ID">ID</option>
          </select>
          <input
            type="text"
            value={filters.nameKeyword}
            onChange={e => updateFilter('nameKeyword', e.target.value)}
            placeholder="请输入台账名称"
            className="flex-1 px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none min-w-0"
          />
          <span className="text-[10px] text-gray-400 pr-2 select-none shrink-0 font-mono">
            {filters.nameKeyword.length} / 2000
          </span>
        </div>

        {/* 2. 排除词 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            排除词
          </span>
          <input
            type="text"
            value={filters.excludeKeyword}
            onChange={e => updateFilter('excludeKeyword', e.target.value)}
            placeholder="请输入排除词，多个以英文逗号隔开"
            className="flex-1 px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none min-w-0"
          />
          <span className="text-[10px] text-gray-400 pr-2 select-none shrink-0 font-mono">
            {filters.excludeKeyword.length} / 2000
          </span>
        </div>

        {/* 3. 所属平台 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            所属平台
          </span>
          <select
            value={filters.platform}
            onChange={e => updateFilter('platform', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none bg-white"
          >
            <option value="全部">请选择所属平台</option>
            <option value="网站">网站</option>
            <option value="微信公众号">微信公众号</option>
            <option value="微博">微博</option>
            <option value="今日头条">今日头条</option>
            <option value="抖音">抖音</option>
          </select>
        </div>

        {/* 4. 认证类型 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            认证类型
          </span>
          <select
            value={filters.authType}
            onChange={e => updateFilter('authType', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none bg-white"
          >
            <option value="全部">请选择认证类型</option>
            <option value="机构">机构</option>
            <option value="媒体">媒体</option>
            <option value="个人">个人</option>
            <option value="企业">企业</option>
            <option value="未认证">未认证</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-4 gap-3">
        {/* 1. 应用地址 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            应用地址
          </span>
          <select
            value={filters.address}
            onChange={e => updateFilter('address', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none bg-white"
          >
            <option value="全部">请选择应用地址</option>
            <option value="西安">陕西 / 西安市</option>
            <option value="莲湖区">陕西 / 西安市 / 莲湖区</option>
            <option value="雁塔区">陕西 / 西安市 / 雁塔区</option>
            <option value="高陵区">陕西 / 西安市 / 高陵区</option>
            <option value="碑林区">陕西 / 西安市 / 碑林区</option>
            <option value="鄠邑区">陕西 / 西安市 / 鄠邑区</option>
            <option value="未央区">陕西 / 西安市 / 未央区</option>
            <option value="长安区">陕西 / 西安市 / 长安区</option>
            <option value="高新区">陕西 / 西安市 / 高新区</option>
            <option value="新城区">陕西 / 西安市 / 新城区</option>
            <option value="灞桥区">陕西 / 西安市 / 灞桥区</option>
            <option value="阎良区">陕西 / 西安市 / 阎良区</option>
            <option value="临潼区">陕西 / 西安市 / 临潼区</option>
          </select>
          <button
            type="button"
            className="px-2 text-gray-400 hover:text-[#1677ff] border-l border-gray-200 cursor-pointer"
            title="层级地址选择"
          >
            <i className="fa-solid fa-sliders text-xs"></i>
          </button>
        </div>

        {/* 2. 研判类型 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            研判类型
          </span>
          <select
            value={filters.judgmentType}
            onChange={e => updateFilter('judgmentType', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none bg-white"
          >
            <option value="全部">请选择研判类型</option>
            <option value="人工研判">人工研判</option>
            <option value="自动研判">自动研判</option>
            <option value="精准匹配">精准匹配</option>
            <option value="重点研判">重点研判</option>
            <option value="免研判">免研判</option>
          </select>
        </div>

        {/* 3. 采集状态 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            采集状态
          </span>
          <select
            value={filters.collectStatus}
            onChange={e => updateFilter('collectStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none bg-white"
          >
            <option value="全部">请选择采集状态</option>
            <option value="采集中">采集中</option>
            <option value="未采集">未采集</option>
          </select>
        </div>

        {/* 4. 粉丝数 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            粉丝数
          </span>
          <input
            type="text"
            placeholder="最小值"
            value={filters.fansMin}
            onChange={e => updateFilter('fansMin', e.target.value)}
            className="w-1/2 px-2 py-1.5 text-xs text-center focus:outline-none min-w-0"
          />
          <span className="text-gray-400 px-1 text-xs shrink-0 select-none">至</span>
          <input
            type="text"
            placeholder="最大值"
            value={filters.fansMax}
            onChange={e => updateFilter('fansMax', e.target.value)}
            className="w-1/2 px-2 py-1.5 text-xs text-center focus:outline-none min-w-0"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-4 gap-3">
        {/* 1. 台账状态 */}
        <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
          <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
            台账状态
          </span>
          <select
            value={filters.ledgerStatus}
            onChange={e => updateFilter('ledgerStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none bg-white"
          >
            <option value="全部">请选择台账状态</option>
            <option value="正常">正常</option>
            <option value="异常">异常</option>
            <option value="注销">注销</option>
          </select>
        </div>
      </div>

      {/* Checkbox Groups (展开时显示) */}
      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-gray-100 text-[11px]">
          {/* Checkbox Group 1: 主体类型 */}
          <div className="flex items-start space-x-3 text-gray-700 flex-wrap gap-y-1.5">
            <span className="font-bold shrink-0 text-gray-800 w-16">主体类型：</span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.subjectTypeAll}
                onChange={e => handleToggleSubjectTypeAll(e.target.checked)}
                className="rounded text-[#1677ff] cursor-pointer"
              />
              <span className="font-medium text-gray-700">全选</span>
            </label>
            {subjectTypeList.map((t, idx) => {
              const isChecked = filters.subjectTypeAll || filters.selectedSubjectTypes.includes(t);
              return (
                <label key={idx} className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSubjectType(t)}
                    className="rounded text-[#1677ff] cursor-pointer"
                  />
                  <span>{t}</span>
                  {t !== '无类型' && <i className="fa-solid fa-caret-down text-[9px] text-gray-400"></i>}
                </label>
              );
            })}
          </div>

          {/* Checkbox Group 2: 主体标签 */}
          <div className="flex items-start space-x-3 text-gray-700 flex-wrap gap-y-1.5">
            <span className="font-bold shrink-0 text-gray-800 w-16">主体标签：</span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.subjectTagAll}
                onChange={e => handleToggleSubjectTagAll(e.target.checked)}
                className="rounded text-[#1677ff] cursor-pointer"
              />
              <span className="font-medium text-gray-700">全选</span>
            </label>
            {subjectTagList.map((t, idx) => {
              const isChecked = filters.subjectTagAll || filters.selectedSubjectTags.includes(t);
              return (
                <label key={idx} className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSubjectTag(t)}
                    className="rounded text-[#1677ff] cursor-pointer"
                  />
                  <span>{t}</span>
                  {t !== '无标签' && t !== '医疗' && <i className="fa-solid fa-caret-down text-[9px] text-gray-400"></i>}
                </label>
              );
            })}
          </div>

          {/* Checkbox Group 3: 台账标签 */}
          <div className="flex items-start space-x-3 text-gray-700 flex-wrap gap-y-1.5">
            <span className="font-bold shrink-0 text-gray-800 w-16">台账标签：</span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.ledgerTagAll}
                onChange={e => handleToggleLedgerTagAll(e.target.checked)}
                className="rounded text-[#1677ff] cursor-pointer"
              />
              <span className="font-medium text-gray-700">全选</span>
            </label>
            {ledgerTagList.map((t, idx) => {
              const isChecked = filters.ledgerTagAll || filters.selectedLedgerTags.includes(t);
              return (
                <label key={idx} className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleLedgerTag(t)}
                    className="rounded text-[#1677ff] cursor-pointer"
                  />
                  <span>{t}</span>
                  {t !== '无标签' && <i className="fa-solid fa-caret-down text-[9px] text-gray-400"></i>}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Filter Toolbar (与截图完全一致) */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-xs text-[#1677ff] font-medium">
          <i className="fa-solid fa-chart-simple"></i>
          <span>
            (共 <strong className="font-bold font-mono">{totalCount}</strong> 条)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-800 text-xs cursor-pointer flex items-center space-x-1 px-2 py-1"
          >
            <span>{isExpanded ? '收起' : '展开'}</span>
            <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
          </button>

          <button
            type="button"
            onClick={onQuery}
            className="px-5 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-bold cursor-pointer transition shadow-xs flex items-center space-x-1"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>查询</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded text-xs cursor-pointer transition flex items-center space-x-1"
          >
            <i className="fa-solid fa-rotate-left text-[11px]"></i>
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>
  );
};
