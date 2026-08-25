import React, { useState, useMemo } from 'react';
import { LedgerItem } from '../mockLedgerData';
import { LedgerFilterSection, LedgerFilterCriteria, initialFilterCriteria } from './LedgerFilterSection';

export interface Tab1ActionLedgersViewProps {
  ledgers: LedgerItem[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onMoveToBlacklist: (ids: number[]) => void;
  onRemoveFromTab1: (ids: number[]) => void;
  onGoToTab2: () => void;
  onToast: (msg: string) => void;
}

export const Tab1ActionLedgersView: React.FC<Tab1ActionLedgersViewProps> = ({
  ledgers,
  selectedIds,
  onSelectionChange,
  onMoveToBlacklist,
  onRemoveFromTab1,
  onGoToTab2,
  onToast,
}) => {
  // Filter state matching the screenshot
  const [filters, setFilters] = useState<LedgerFilterCriteria>(initialFilterCriteria);
  const [fansSortOrder, setFansSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // Filter query logic
  const displayList = useMemo(() => {
    let list = ledgers.filter(item => {
      // 1. nameKeyword & nameType
      if (filters.nameKeyword.trim()) {
        const kw = filters.nameKeyword.trim();
        if (filters.nameType === '账号') {
          if (!item.detail?.accountName?.includes(kw) && !item.name?.includes(kw)) return false;
        } else if (filters.nameType === 'URL') {
          if (!item.detail?.ledgerUrl?.includes(kw)) return false;
        } else if (filters.nameType === 'ID') {
          if (!item.id.toString().includes(kw) && !item.detail?.platformId?.includes(kw)) return false;
        } else {
          // 台账名称 / 主体
          const matchName = item.name && item.name.includes(kw);
          const matchSub = item.subjectName && item.subjectName.includes(kw);
          const matchUrl = item.detail?.ledgerUrl && item.detail.ledgerUrl.includes(kw);
          if (!matchName && !matchSub && !matchUrl) return false;
        }
      }

      // 2. excludeKeyword
      if (filters.excludeKeyword.trim()) {
        const exWords = filters.excludeKeyword.split(/[,，、;；]/).map(w => w.trim()).filter(Boolean);
        if (exWords.some(w => (item.name && item.name.includes(w)) || (item.intro && item.intro.includes(w)) || (item.subjectName && item.subjectName.includes(w)))) {
          return false;
        }
      }

      // 3. platform
      if (filters.platform !== '全部' && item.platform !== filters.platform) {
        return false;
      }

      // 4. authType
      if (filters.authType !== '全部' && !item.authType?.includes(filters.authType)) {
        return false;
      }

      // 5. address
      if (filters.address !== '全部') {
        const matchAddress = item.addresses?.some(a => a.text.includes(filters.address)) ||
          item.detail?.addressTree?.includes(filters.address) ||
          item.detail?.region?.includes(filters.address);
        if (!matchAddress) return false;
      }

      // 6. judgmentType
      if (filters.judgmentType !== '全部' && item.judgmentType !== filters.judgmentType) {
        return false;
      }

      // 7. collectStatus
      if (filters.collectStatus !== '全部') {
        const dot = item.collectDotStatus || (item.collectStatus === '已采集' ? '采集中' : '未采集');
        if (filters.collectStatus === '采集中' && dot !== '采集中') return false;
        if (filters.collectStatus === '未采集' && dot !== '未采集') return false;
      }

      // 8. fansMin / fansMax
      const fCount = item.fans || item.fansCount || 0;
      if (filters.fansMin.trim()) {
        const min = parseInt(filters.fansMin.trim(), 10);
        if (!isNaN(min) && fCount < min) return false;
      }
      if (filters.fansMax.trim()) {
        const max = parseInt(filters.fansMax.trim(), 10);
        if (!isNaN(max) && fCount > max) return false;
      }

      // 9. ledgerStatus
      if (filters.ledgerStatus !== '全部') {
        const status = item.accountStatus || item.ledgerStatus || '正常';
        if (status !== filters.ledgerStatus) return false;
      }

      // 10. subject types
      if (!filters.subjectTypeAll && filters.selectedSubjectTypes.length > 0) {
        if (!filters.selectedSubjectTypes.some(t => item.subjectType?.includes(t))) {
          return false;
        }
      }

      // 11. subject tags
      if (!filters.subjectTagAll && filters.selectedSubjectTags.length > 0) {
        const itemTags = item.tags || [];
        if (!filters.selectedSubjectTags.some(t => itemTags.some(it => it.includes(t)) || item.subjectName?.includes(t))) {
          return false;
        }
      }

      // 12. ledger tags
      if (!filters.ledgerTagAll && filters.selectedLedgerTags.length > 0) {
        const itemTags = item.tags || [];
        if (!filters.selectedLedgerTags.some(t => itemTags.some(it => it.includes(t)))) {
          return false;
        }
      }

      return true;
    });

    if (fansSortOrder === 'asc') {
      list = [...list].sort((a, b) => (a.fans || a.fansCount || 0) - (b.fans || b.fansCount || 0));
    } else if (fansSortOrder === 'desc') {
      list = [...list].sort((a, b) => (b.fans || b.fansCount || 0) - (a.fans || a.fansCount || 0));
    }

    return list;
  }, [ledgers, filters, fansSortOrder]);

  // Reset filters
  const handleReset = () => {
    setFilters(initialFilterCriteria);
    setFansSortOrder('none');
    onSelectionChange([]);
    onToast('已重置筛选条件');
  };

  const handleQuery = () => {
    onToast(`已筛选出 ${displayList.length} 条台账记录`);
  };

  const toggleFansSort = () => {
    if (fansSortOrder === 'none') {
      setFansSortOrder('desc');
      onToast('已按粉丝数降序排序');
    } else if (fansSortOrder === 'desc') {
      setFansSortOrder('asc');
      onToast('已按粉丝数升序排序');
    } else {
      setFansSortOrder('none');
      onToast('已恢复默认排序');
    }
  };

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

  if (ledgers.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3 bg-gray-50/50 rounded-lg border border-dashed border-gray-300">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1677ff] flex items-center justify-center text-xl">
          <i className="fa-regular fa-folder-open"></i>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          暂无行动台账，请前往【台账检索】配置台账
        </p>
        <button
          type="button"
          onClick={onGoToTab2}
          className="px-4 py-1.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium cursor-pointer shadow-xs transition"
        >
          去配置台账 <i className="fa-solid fa-arrow-right ml-1"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 text-xs">
      {/* 1. 多条件筛选区域 (与图片画框保持完全一致) */}
      <LedgerFilterSection
        totalCount={displayList.length}
        filters={filters}
        onFilterChange={setFilters}
        onQuery={handleQuery}
        onReset={handleReset}
        defaultExpanded={true}
      />

      {/* 2. 操作条 (批量操作与计数) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-800 text-xs">本专项行动台账列表</span>
          <span className="text-xs text-gray-500">
            (当前已配置 <strong className="text-gray-700 font-bold font-mono">{displayList.length}</strong> 项，已勾选{' '}
            <strong className="text-[#1677ff] font-bold font-mono">{selectedIds.length}</strong> 项)
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* 批量移出专项台账 */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onRemoveFromTab1(selectedIds)}
            className={`px-3.5 py-1.5 rounded text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              selectedIds.length > 0
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-xs'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-trash-can"></i>
            <span>批量移出专项台账 ({selectedIds.length})</span>
          </button>

          {/* 批量加入黑名单 */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onMoveToBlacklist(selectedIds)}
            className={`px-3.5 py-1.5 rounded text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              selectedIds.length > 0
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-ban"></i>
            <span>批量加入黑名单 ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* 3. 数据表格 (与台账数据源选择页面结构与视觉样式完全一致) */}
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
              <th className="w-[16%] px-2.5 py-2.5">台账名称</th>
              <th className="w-[80px] px-2 py-2.5 text-center">台账类型</th>
              <th className="w-[16%] px-2.5 py-2.5">简介</th>
              <th className="w-[9%] px-2 py-2.5">认证/研判</th>
              <th className="w-[10%] px-2 py-2.5">台账标签</th>
              <th className="w-[11%] px-2 py-2.5">应用地址</th>
              <th className="w-[12%] px-2 py-2.5">主体名称/类型</th>
              <th
                className="w-[8%] px-2 py-2.5 text-right cursor-pointer hover:bg-gray-100 select-none"
                onClick={toggleFansSort}
                title="点击按粉丝数排序"
              >
                粉丝数 {fansSortOrder === 'desc' ? '↓' : fansSortOrder === 'asc' ? '↑' : '⇅'}
              </th>
              <th className="w-[7%] px-1 py-2.5 text-center">采集状态</th>
              <th className="w-[7%] px-1 py-2.5 text-center">台账状态</th>
              <th className="w-[125px] px-2 py-2.5 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <i className="fa-regular fa-folder-open text-2xl text-gray-300"></i>
                    <span>没有符合条件的台账记录</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayList.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                const dotStatus = item.collectDotStatus || (item.collectStatus === '已采集' ? '采集中' : '未采集');

                // 判断台账类型：白名单 | 黑名单 | 应用属地台账/错误表述台账不显示
                const itemExtended = item as any;
                const isExplicitWhitelist = item.ledgerType === '白名单' || item.categoryType === '白名单' || itemExtended.category === 'whitelist';
                const isExplicitBlacklist = item.ledgerType === '黑名单' || item.categoryType === '黑名单' || itemExtended.category === 'blacklist';
                // 如果是应用属地台账（importSource === '属地导入'且未被设为白名单/黑名单）或普通/错误表述台账，则不显示台账类型
                const isTerritoryOrNormal = itemExtended.importSource === '属地导入' && !isExplicitWhitelist && !isExplicitBlacklist;

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

                    {/* 台账类型 */}
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      {!isTerritoryOrNormal && isExplicitWhitelist ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          白名单
                        </span>
                      ) : !isTerritoryOrNormal && isExplicitBlacklist ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-200">
                          黑名单
                        </span>
                      ) : (
                        <span className="text-gray-300 font-mono text-xs">-</span>
                      )}
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
                        {(item.tags || []).slice(0, 2).map((t, i) => (
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
                      {(item.addresses || []).slice(0, 2).map((addr, i) => (
                        <div key={i} className="flex items-center space-x-1 text-[11px] text-gray-600 truncate">
                          <i className={`fa-solid ${addr.icon || 'fa-location-dot'} text-gray-400 text-[10px] shrink-0`}></i>
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
                      {item.fansDisplay || `${item.fans || item.fansCount || 0}`}
                    </td>

                    {/* 采集状态 */}
                    <td className="px-1 py-2 text-center">
                      <span className="inline-flex items-center space-x-1 text-[11px]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dotStatus === '采集中' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></span>
                        <span className={dotStatus === '采集中' ? 'text-green-700' : 'text-gray-500'}>
                          {dotStatus}
                        </span>
                      </span>
                    </td>

                    {/* 台账状态 */}
                    <td className="px-1 py-2 text-center text-gray-700 font-medium">
                      {item.accountStatus || item.ledgerStatus || '正常'}
                    </td>

                    {/* 操作 */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex items-center justify-center space-x-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => onMoveToBlacklist([item.id])}
                          className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                        >
                          加入黑名单
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => onRemoveFromTab1([item.id])}
                          className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                        >
                          移出
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
