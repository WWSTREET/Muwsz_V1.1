import React, { useState, useMemo } from 'react';
import { generateTab2MockLedgers, Tab2LedgerItem } from '../data/tab2MockLedgers';
import { LedgerItem } from '../mockLedgerData';

export interface Tab2DataSourceViewProps {
  currentInstName: string;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onImportToTab1: (selectedItems: LedgerItem[]) => void;
  onDirectBlacklist: (selectedItems: LedgerItem[]) => void;
  onToast: (msg: string) => void;
}

export const Tab2DataSourceView: React.FC<Tab2DataSourceViewProps> = ({
  currentInstName,
  selectedIds,
  onSelectionChange,
  onImportToTab1,
  onDirectBlacklist,
  onToast,
}) => {
  // Master full list for Tab 2
  const [dataList, setDataList] = useState<Tab2LedgerItem[]>(() => generateTab2MockLedgers());

  // Rule option state: 'location' (一键应用属地台账) or 'error_expression' (一键应用错误表述台账)
  const [ruleOption, setRuleOption] = useState<'location' | 'error_expression'>('location');

  // Filters expanded state - default collapsed as requested
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Filter Form State
  const [nameType, setNameType] = useState('台账名称');
  const [nameKeyword, setNameKeyword] = useState('');
  const [excludeKeyword, setExcludeKeyword] = useState('');
  const [platform, setPlatform] = useState('全部');
  const [authType, setAuthType] = useState('全部');
  const [address, setAddress] = useState('全部');
  const [judgmentType, setJudgmentType] = useState('全部');
  const [collectStatus, setCollectStatus] = useState('全部');
  const [fansMin, setFansMin] = useState('');
  const [fansMax, setFansMax] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('全部');

  // Checkbox categories
  const [subjectTypeAll, setSubjectTypeAll] = useState(false);
  const [subjectTagAll, setSubjectTagAll] = useState(false);
  const [ledgerTagAll, setLedgerTagAll] = useState(false);

  // 应用选定规则（二选一：一键应用属地台账 vs 一键应用错误表述台账）
  const handleApplySelectedRule = (overrideType?: 'location' | 'error_expression') => {
    const targetType = overrideType || ruleOption;
    const fresh = generateTab2MockLedgers();

    if (targetType === 'location') {
      // 1. 一键应用属地台账规则
      setNameKeyword('');
      setExcludeKeyword('');
      setPlatform('全部');
      setAuthType('全部');
      setAddress('西安');
      setJudgmentType('全部');
      setCollectStatus('全部');
      setFansMin('');
      setFansMax('');
      setLedgerStatus('全部');
      setSubjectTypeAll(false);
      setSubjectTagAll(false);
      setLedgerTagAll(false);

      // 自动匹配属地规则台账 + 白名单台账（批量/手动添加）
      const matched = fresh.filter(i => 
        i.addresses.some(a => a.text.includes('西安') || a.text.includes('陕西')) ||
        i.category === 'whitelist' ||
        i.categoryType === '白名单' ||
        i.sourceTag === '自动匹配'
      );
      setDataList(matched);
      onSelectionChange(matched.map(i => i.id));
      onToast(`已应用【一键应用属地台账】：回显应用地址（西安），自动圈定属地匹配及白名单台账共 ${matched.length} 条（已全选）`);
    } else {
      // 2. 一键应用错误表述台账规则
      setNameKeyword('');
      setExcludeKeyword('');
      setPlatform('全部');
      setAuthType('全部');
      setAddress('全部');
      setJudgmentType('精准匹配');
      setCollectStatus('全部');
      setFansMin('');
      setFansMax('');
      setLedgerStatus('全部');
      setSubjectTypeAll(false);
      setSubjectTagAll(false);
      setLedgerTagAll(false);

      // 自动匹配错误表述规则台账 + 白名单台账（批量/手动添加）
      const matched = fresh.filter(i => 
        i.judgmentType === '精准匹配' ||
        i.judgmentType === '人工研判' ||
        i.category === 'whitelist' ||
        i.categoryType === '白名单' ||
        (i.tags && i.tags.some(t => t.includes('媒体') || t.includes('政务')))
      );
      setDataList(matched);
      onSelectionChange(matched.map(i => i.id));
      onToast(`已应用【一键应用错误表述台账】：回显研判类型（精准匹配），自动圈定错误表述匹配及白名单台账共 ${matched.length} 条（已全选）`);
    }
  };

  // Filter query action
  const handleQuery = () => {
    let result = generateTab2MockLedgers();
    if (nameKeyword.trim()) {
      result = result.filter(i => i.name.includes(nameKeyword.trim()) || i.subjectName.includes(nameKeyword.trim()));
    }
    if (excludeKeyword.trim()) {
      const exWords = excludeKeyword.split(/[,，、;；]/).map(w => w.trim()).filter(Boolean);
      result = result.filter(i => !exWords.some(w => i.name.includes(w) || (i.intro && i.intro.includes(w))));
    }
    if (platform !== '全部') {
      result = result.filter(i => i.platform === platform);
    }
    if (authType !== '全部') {
      result = result.filter(i => i.authType === authType);
    }
    if (address !== '全部') {
      result = result.filter(i => i.addresses.some(a => a.text.includes(address)));
    }
    if (judgmentType !== '全部') {
      result = result.filter(i => i.judgmentType === judgmentType);
    }
    if (collectStatus !== '全部') {
      if (collectStatus === '采集中') result = result.filter(i => i.collectDotStatus === '采集中');
      if (collectStatus === '未采集') result = result.filter(i => i.collectDotStatus === '未采集');
    }
    if (fansMin.trim()) {
      const min = parseInt(fansMin.trim(), 10);
      if (!isNaN(min)) {
        result = result.filter(i => (i.fans || i.fansCount || 0) >= min);
      }
    }
    if (fansMax.trim()) {
      const max = parseInt(fansMax.trim(), 10);
      if (!isNaN(max)) {
        result = result.filter(i => (i.fans || i.fansCount || 0) <= max);
      }
    }
    if (ledgerStatus !== '全部') {
      result = result.filter(i => (i.accountStatus || i.ledgerStatus || '正常') === ledgerStatus);
    }
    setDataList(result);
    onToast(`查询完成，共找到 ${result.length} 条台账记录`);
  };

  // Reset filters
  const handleReset = () => {
    setNameKeyword('');
    setExcludeKeyword('');
    setPlatform('全部');
    setAuthType('全部');
    setAddress('全部');
    setJudgmentType('全部');
    setCollectStatus('全部');
    setFansMin('');
    setFansMax('');
    setLedgerStatus('全部');
    setSubjectTypeAll(false);
    setSubjectTagAll(false);
    setLedgerTagAll(false);
    const fresh = generateTab2MockLedgers();
    setDataList(fresh);
    onSelectionChange([]);
    onToast('已重置所有筛选条件与结果');
  };

  // Display list is the current data list
  const displayList = dataList;

  const allSelected = displayList.length > 0 && displayList.every(i => selectedIds.includes(i.id));

  const handleToggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(displayList.map(i => i.id));
    }
  };

  const handleToggleSelectItem = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  // 加入专项台账（移除本页选中的数据，不跳转，并通知父组件更新）
  const handleImportItems = (items: Tab2LedgerItem[]) => {
    if (items.length === 0) {
      onToast('请先勾选需要加入专项台账的记录');
      return;
    }
    const idsToRemove = new Set(items.map(i => i.id));
    setDataList(prev => prev.filter(i => !idsToRemove.has(i.id)));
    onSelectionChange(selectedIds.filter(id => !idsToRemove.has(id)));
    onImportToTab1(items);
  };

  // 加入黑名单（移除本页选中的数据，不跳转，并通知父组件更新）
  const handleBlacklistItems = (items: Tab2LedgerItem[]) => {
    if (items.length === 0) {
      onToast('请先勾选需要加入黑名单的记录');
      return;
    }
    const idsToRemove = new Set(items.map(i => i.id));
    setDataList(prev => prev.filter(i => !idsToRemove.has(i.id)));
    onSelectionChange(selectedIds.filter(id => !idsToRemove.has(id)));
    onDirectBlacklist(items);
  };

  // 一键全部加入至专项台账
  const handleImportAllToTab1 = () => {
    if (displayList.length === 0) {
      onToast('当前无可用台账记录可加入');
      return;
    }
    handleImportItems(displayList);
  };

  const handleToggleRowWhitelist = (item: Tab2LedgerItem) => {
    const isW = item.category === 'whitelist';
    setDataList(prev =>
      prev.map(i =>
        i.id === item.id
          ? {
              ...i,
              category: isW ? 'normal' : 'whitelist',
              categoryType: isW ? undefined : '白名单',
            }
          : i
      )
    );
    onToast(isW ? `已将【${item.name}】移出白名单` : `已将【${item.name}】加入白名单`);
  };

  const handleToggleRowBlacklist = (item: Tab2LedgerItem) => {
    const isB = item.category === 'blacklist';
    setDataList(prev =>
      prev.map(i =>
        i.id === item.id
          ? {
              ...i,
              category: isB ? 'normal' : 'blacklist',
              categoryType: isB ? undefined : '黑名单',
            }
          : i
      )
    );
    onToast(isB ? `已将【${item.name}】移出黑名单` : `已将【${item.name}】加入黑名单`);
  };

  return (
    <div className="flex flex-col space-y-3 text-xs">
      {/* 1. 顶部台账一键应用规则（二选一直接移至顶部右侧，去除冗余描述卡片） */}
      <div className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/40 border border-[#91caff] rounded-lg px-4 py-2.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-3.5 bg-[#1677ff] rounded-full"></div>
          <span className="font-bold text-gray-800 text-xs">台账规则一键应用</span>
        </div>

        {/* 右侧二选一直接应用按钮组 */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setRuleOption('location');
              handleApplySelectedRule('location');
            }}
            className={`px-3.5 py-1.5 rounded-md border text-xs cursor-pointer transition shadow-xs flex items-center space-x-1.5 ${
              ruleOption === 'location'
                ? 'bg-[#1677ff] text-white border-[#1677ff] font-bold shadow-blue-200'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1677ff] hover:text-[#1677ff]'
            }`}
          >
            <i className="fa-solid fa-location-dot text-[11px]"></i>
            <span>一键应用属地台账</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRuleOption('error_expression');
              handleApplySelectedRule('error_expression');
            }}
            className={`px-3.5 py-1.5 rounded-md border text-xs cursor-pointer transition shadow-xs flex items-center space-x-1.5 ${
              ruleOption === 'error_expression'
                ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-amber-200'
                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            <i className="fa-solid fa-triangle-exclamation text-[11px]"></i>
            <span>一键应用错误表述台账</span>
          </button>
        </div>
      </div>

      {/* 2. 详细多条件筛选区域 */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2.5 shadow-xs">
        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 台账名称 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
            <select
              value={nameType}
              onChange={e => setNameType(e.target.value)}
              className="px-2 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium cursor-pointer focus:outline-none"
            >
              <option value="台账名称">台账名称</option>
              <option value="账号">账号</option>
              <option value="URL">URL</option>
              <option value="ID">ID</option>
            </select>
            <input
              type="text"
              value={nameKeyword}
              onChange={e => setNameKeyword(e.target.value)}
              placeholder="请输入台账名称"
              className="flex-1 px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 pr-2 select-none">0 / 2000</span>
          </div>

          {/* 排除词 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:border-[#1677ff]">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              排除词
            </span>
            <input
              type="text"
              value={excludeKeyword}
              onChange={e => setExcludeKeyword(e.target.value)}
              placeholder="请输入排除词，多个以英文逗号隔开"
              className="flex-1 px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 pr-2 select-none">0 / 2000</span>
          </div>

          {/* 所属平台 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              所属平台
            </span>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="全部">请选择所属平台</option>
              <option value="网站">网站</option>
              <option value="微信公众号">微信公众号</option>
              <option value="微博">微博</option>
              <option value="今日头条">今日头条</option>
              <option value="抖音">抖音</option>
            </select>
          </div>

          {/* 认证类型 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              认证类型
            </span>
            <select
              value={authType}
              onChange={e => setAuthType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="全部">请选择认证类型</option>
              <option value="机构">机构</option>
              <option value="媒体">媒体</option>
              <option value="个人认证">个人认证</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 应用地址 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              应用地址
            </span>
            <select
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="全部">请选择应用地址</option>
              <option value="西安">陕西 / 西安市</option>
              <option value="莲湖区">陕西 / 西安市 / 莲湖区</option>
              <option value="雁塔区">陕西 / 西安市 / 雁塔区</option>
              <option value="高陵区">陕西 / 西安市 / 高陵区</option>
              <option value="碑林区">陕西 / 西安市 / 碑林区</option>
              <option value="鄠邑区">陕西 / 西安市 / 鄠邑区</option>
              <option value="未央区">陕西 / 西安市 / 未央区</option>
            </select>
            <button
              type="button"
              className="px-2 text-gray-400 hover:text-[#1677ff] border-l border-gray-200"
              title="层级地址树选择"
            >
              <i className="fa-solid fa-sliders text-xs"></i>
            </button>
          </div>

          {/* 研判类型 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              研判类型
            </span>
            <select
              value={judgmentType}
              onChange={e => setJudgmentType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="全部">请选择研判类型</option>
              <option value="人工研判">人工研判</option>
              <option value="精准匹配">精准匹配</option>
              <option value="模糊匹配">模糊匹配</option>
              <option value="未研判">未研判</option>
            </select>
          </div>

          {/* 采集状态 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              采集状态
            </span>
            <select
              value={collectStatus}
              onChange={e => setCollectStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="全部">请选择采集状态</option>
              <option value="采集中">采集中</option>
              <option value="未采集">未采集</option>
            </select>
          </div>

          {/* 粉丝数 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              粉丝数
            </span>
            <input
              type="text"
              placeholder="最小值"
              value={fansMin}
              onChange={e => setFansMin(e.target.value)}
              className="w-1/2 px-2 py-1.5 text-xs text-center focus:outline-none"
            />
            <span className="text-gray-400 px-1 text-xs">至</span>
            <input
              type="text"
              placeholder="最大值"
              value={fansMax}
              onChange={e => setFansMax(e.target.value)}
              className="w-1/2 px-2 py-1.5 text-xs text-center focus:outline-none"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 台账状态 */}
          <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden">
            <span className="px-2.5 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-700 text-xs font-medium shrink-0">
              台账状态
            </span>
            <select
              value={ledgerStatus}
              onChange={e => setLedgerStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="全部">请选择台账状态</option>
              <option value="正常">正常</option>
              <option value="异常">异常</option>
              <option value="注销">注销</option>
            </select>
          </div>
        </div>

        {/* Checkbox Group 1: 主体类型 */}
        {isFilterExpanded && (
          <div className="space-y-2 pt-1 border-t border-gray-100 text-[11px]">
            <div className="flex items-start space-x-3 text-gray-700 flex-wrap gap-y-1.5">
              <span className="font-bold shrink-0 text-gray-800 w-16">主体类型：</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subjectTypeAll}
                  onChange={e => setSubjectTypeAll(e.target.checked)}
                  className="rounded text-[#1677ff]"
                />
                <span>全选</span>
              </label>
              {[
                '机构编制', '外交', '司法行政', '旅游', '民政', '宗教', '工会', '工商',
                '中央军委改革和编制办公室', '住房城乡建设', '农业', '侨联', '贸易促进', '文化', '无类型'
              ].map((t, idx) => (
                <label key={idx} className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  <input type="checkbox" checked={subjectTypeAll} onChange={() => {}} className="rounded text-[#1677ff]" />
                  <span>{t}</span>
                  {t !== '无类型' && <i className="fa-solid fa-caret-down text-[9px] text-gray-400"></i>}
                </label>
              ))}
            </div>

            {/* Checkbox Group 2: 主体标签 */}
            <div className="flex items-start space-x-3 text-gray-700 flex-wrap gap-y-1.5">
              <span className="font-bold shrink-0 text-gray-800 w-16">主体标签：</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subjectTagAll}
                  onChange={e => setSubjectTagAll(e.target.checked)}
                  className="rounded text-[#1677ff]"
                />
                <span>全选</span>
              </label>
              {['教育类', '公安', '医疗', '无标签'].map((t, idx) => (
                <label key={idx} className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  <input type="checkbox" checked={subjectTagAll} onChange={() => {}} className="rounded text-[#1677ff]" />
                  <span>{t}</span>
                  {t !== '无标签' && t !== '医疗' && <i className="fa-solid fa-caret-down text-[9px] text-gray-400"></i>}
                </label>
              ))}
            </div>

            {/* Checkbox Group 3: 台账标签 */}
            <div className="flex items-start space-x-3 text-gray-700 flex-wrap gap-y-1.5">
              <span className="font-bold shrink-0 text-gray-800 w-16">台账标签：</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ledgerTagAll}
                  onChange={e => setLedgerTagAll(e.target.checked)}
                  className="rounded text-[#1677ff]"
                />
                <span>全选</span>
              </label>
              {['媒体属性', '级别', '暂时屏蔽', '废弃政务类废弃', '废弃媒体类废弃', '无标签'].map((t, idx) => (
                <label key={idx} className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-900">
                  <input type="checkbox" checked={ledgerTagAll} onChange={() => {}} className="rounded text-[#1677ff]" />
                  <span>{t}</span>
                  {t !== '无标签' && <i className="fa-solid fa-caret-down text-[9px] text-gray-400"></i>}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Filter Toolbar */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-blue-600 font-medium">
            <i className="fa-solid fa-chart-simple"></i>
            <span>(共 <strong className="font-bold font-mono">{displayList.length}</strong> 条)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="text-gray-500 hover:text-gray-800 text-xs cursor-pointer flex items-center space-x-1 px-2 py-1"
            >
              <span>{isFilterExpanded ? '收起' : '展开'}</span>
              <i className={`fa-solid ${isFilterExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
            </button>

            <button
              type="button"
              onClick={handleQuery}
              className="px-5 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-bold cursor-pointer transition shadow-xs flex items-center space-x-1"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>查询</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded text-xs cursor-pointer transition flex items-center space-x-1"
            >
              <i className="fa-solid fa-rotate-left text-[11px]"></i>
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 操作条 (一键全部加入 / 勾选导入至本行动 / 加入黑名单) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-800 text-xs">台账检索列表</span>
          <span className="text-xs text-gray-500">
            (当前已勾选 <strong className="text-[#1677ff] font-bold font-mono">{selectedIds.length}</strong> 项)
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* 新增：“一键全部加入至专项台账” */}
          <button
            type="button"
            onClick={handleImportAllToTab1}
            className="px-3.5 py-1.5 rounded text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 border border-red-500 text-red-600 bg-white hover:bg-red-50 shadow-xs"
          >
            <i className="fa-solid fa-cloud-arrow-down text-red-500"></i>
            <span>一键全部加入至专项台账</span>
          </button>

          {/* 将已勾选台账导入至专项台账 */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              const selectedItems = displayList.filter(i => selectedIds.includes(i.id));
              handleImportItems(selectedItems);
            }}
            className={`px-4 py-1.5 rounded text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              selectedIds.length > 0
                ? 'bg-[#52c41a] hover:bg-green-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-arrow-down-to-bracket"></i>
            <span>将已勾选台账导入至专项台账 ({selectedIds.length})</span>
          </button>

          {/* 将已勾选台账直接加入黑名单 */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              const selectedItems = displayList.filter(i => selectedIds.includes(i.id));
              handleBlacklistItems(selectedItems);
            }}
            className={`px-4 py-1.5 rounded text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              selectedIds.length > 0
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-ban"></i>
            <span>将已勾选台账直接加入黑名单 ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* 4. 详细数据表格 (无横向滚动条，自适应宽度) */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-xs">
        <table className="w-full text-left text-xs table-fixed">
          <thead className="bg-[#fafafa] text-gray-700 border-b border-gray-200 select-none">
            <tr>
              <th className="w-9 px-2 py-2.5 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                />
              </th>
              <th className="w-10 px-1 py-2.5 text-center">序号</th>
              <th className="w-[18%] px-2.5 py-2.5">台账名称</th>
              <th className="w-[18%] px-2.5 py-2.5">简介</th>
              <th className="w-[10%] px-2 py-2.5">认证/研判</th>
              <th className="w-[11%] px-2 py-2.5">台账标签</th>
              <th className="w-[12%] px-2 py-2.5">应用地址</th>
              <th className="w-[13%] px-2 py-2.5">主体名称/类型</th>
              <th className="w-[8%] px-2 py-2.5 text-right">粉丝数 ⇅</th>
              <th className="w-[7%] px-1 py-2.5 text-center">采集状态</th>
              <th className="w-[7%] px-1 py-2.5 text-center">台账状态</th>
              <th className="w-[125px] px-2 py-2.5 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <i className="fa-solid fa-magnifying-glass text-2xl text-gray-300"></i>
                    <span>未找到匹配的台账记录，请点击上方【一键应用该规则】或重置查询</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayList.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-blue-50/40 transition ${isSelected ? 'bg-blue-50/20' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectItem(item.id)}
                        className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                      />
                    </td>

                    {/* 序号 */}
                    <td className="px-1 py-2 text-center text-gray-400 font-mono">{idx + 1}</td>

                    {/* 台账名称 */}
                    <td className="px-2.5 py-2">
                      <div className="flex items-start space-x-1.5 min-w-0">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200 mt-0.5"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            {item.name.slice(0, 1)}
                          </div>
                        )}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center space-x-1 flex-wrap">
                            <span className="font-bold text-[#1677ff] hover:underline cursor-pointer truncate max-w-[120px]" title={item.name}>
                              {item.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center space-x-1">
                            <span className="text-gray-400">
                              {item.platformBadge || item.platform}
                            </span>
                          </div>
                          {item.authBadgeDesc && (
                            <div className="text-[10px] text-gray-400 truncate max-w-[140px]" title={item.authBadgeDesc}>
                              <i className="fa-solid fa-check text-blue-500 mr-0.5"></i>
                              <span>{item.authBadgeDesc}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 简介 */}
                    <td className="px-2.5 py-2">
                      <div className="text-[11px] text-gray-600 line-clamp-2" title={item.intro || '-'}>
                        {item.intro || '-'}
                      </div>
                    </td>

                    {/* 认证/研判 */}
                    <td className="px-2 py-2 space-y-0.5">
                      <div className="text-gray-800 font-medium truncate">{item.authType}</div>
                      <div className="text-[10px] text-gray-400 truncate">{item.judgmentType}</div>
                    </td>

                    {/* 台账标签 */}
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((t, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] truncate max-w-[70px]"
                            title={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 应用地址 */}
                    <td className="px-2 py-2 space-y-0.5">
                      {item.addresses.slice(0, 2).map((addr, i) => (
                        <div key={i} className="flex items-center space-x-1 text-[11px] text-gray-600 truncate">
                          <i className={`fa-solid ${addr.icon} text-gray-400 text-[10px] shrink-0`}></i>
                          <span className="truncate" title={addr.text}>{addr.text}</span>
                        </div>
                      ))}
                    </td>

                    {/* 主体名称/类型 */}
                    <td className="px-2 py-2 space-y-0.5">
                      <div className="font-medium text-gray-800 truncate" title={item.subjectName}>
                        {item.subjectName}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">{item.subjectType}</div>
                    </td>

                    {/* 粉丝数 */}
                    <td className="px-2 py-2 text-right font-mono text-gray-700">
                      {item.fansDisplay || '-'}
                    </td>

                    {/* 采集状态 */}
                    <td className="px-1 py-2 text-center">
                      <span className="inline-flex items-center space-x-1 text-[11px]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.collectDotStatus === '采集中' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></span>
                        <span className={item.collectDotStatus === '采集中' ? 'text-green-700' : 'text-gray-500'}>
                          {item.collectDotStatus || '未采集'}
                        </span>
                      </span>
                    </td>

                    {/* 台账状态 */}
                    <td className="px-1 py-2 text-center text-gray-700 font-medium">
                      {item.accountStatus || '正常'}
                    </td>

                    {/* 操作 */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex items-center justify-center space-x-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleImportItems([item])}
                          className="text-[#1677ff] hover:text-blue-700 font-medium cursor-pointer"
                        >
                          加入专项台账
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBlacklistItems([item])}
                          className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                        >
                          加入黑名单
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

