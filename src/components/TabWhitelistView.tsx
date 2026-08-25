import React, { useState, useMemo } from 'react';
import { LedgerItem } from '../mockLedgerData';
import { LedgerFilterSection, LedgerFilterCriteria, initialFilterCriteria } from './LedgerFilterSection';

export interface TabWhitelistViewProps {
  whitelists: LedgerItem[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onRestoreToTab1: (ids: number[]) => void;
  onMoveToBlacklist: (ids: number[]) => void;
  onDeleteFromWhitelist: (ids: number[]) => void;
  onGoToTab2?: () => void;
  onToast: (msg: string) => void;
}

export const TabWhitelistView: React.FC<TabWhitelistViewProps> = ({
  whitelists,
  selectedIds,
  onSelectionChange,
  onRestoreToTab1,
  onMoveToBlacklist,
  onDeleteFromWhitelist,
  onGoToTab2,
  onToast,
}) => {
  // Filter state
  const [filters, setFilters] = useState<LedgerFilterCriteria>(initialFilterCriteria);
  const [fansSortOrder, setFansSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // Filter query logic
  const displayList = useMemo(() => {
    let list = whitelists.filter(item => {
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
        if (
          exWords.some(
            w =>
              (item.name && item.name.includes(w)) ||
              (item.intro && item.intro.includes(w)) ||
              (item.subjectName && item.subjectName.includes(w))
          )
        ) {
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
        const matchAddress =
          item.addresses?.some(a => a.text.includes(filters.address)) ||
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
        if (
          !filters.selectedSubjectTags.some(
            t => itemTags.some(it => it.includes(t)) || item.subjectName?.includes(t)
          )
        ) {
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
  }, [whitelists, filters, fansSortOrder]);

  const allSelected =
    displayList.length > 0 && displayList.every(i => selectedIds.includes(i.id));

  const handleToggleSelectAll = () => {
    if (allSelected) {
      const displayIds = new Set(displayList.map(i => i.id));
      onSelectionChange(selectedIds.filter(id => !displayIds.has(id)));
    } else {
      const newIds = Array.from(
        new Set([...selectedIds, ...displayList.map(i => i.id)])
      );
      onSelectionChange(newIds);
    }
  };

  const handleToggleSelectItem = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleToggleFansSort = () => {
    if (fansSortOrder === 'none') setFansSortOrder('desc');
    else if (fansSortOrder === 'desc') setFansSortOrder('asc');
    else setFansSortOrder('none');
  };

  return (
    <div className="flex flex-col space-y-3.5 text-xs">
      {/* 1. Filter Section */}
      <LedgerFilterSection
        totalCount={displayList.length}
        filters={filters}
        onFilterChange={setFilters}
        onQuery={() => {
          onToast(`查询完成，共找到 ${displayList.length} 条白名单台账`);
        }}
        onReset={() => {
          setFilters(initialFilterCriteria);
          onToast('已重置筛选条件');
        }}
      />

      {/* 2. 操作栏 (批量加入专项台账 / 批量移入黑名单 / 批量移出白名单) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-800 text-xs">白名单列表</span>
          <span className="text-xs text-gray-500">
            (当前已勾选 <strong className="text-[#1677ff] font-bold font-mono">{selectedIds.length}</strong> 项)
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-700 border border-green-200">
            白名单中的台账在排查中将作为重点免检/保护账号
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* 批量加入专项台账 */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onRestoreToTab1(selectedIds)}
            className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              selectedIds.length > 0
                ? 'bg-[#1677ff] hover:bg-[#4096ff] text-white shadow-xs'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>批量加入专项台账 ({selectedIds.length})</span>
          </button>

          {/* 批量移入黑名单 */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onMoveToBlacklist(selectedIds)}
            className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              selectedIds.length > 0
                ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-xs'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-ban text-xs"></i>
            <span>移入黑名单 ({selectedIds.length})</span>
          </button>

          {/* 批量移出白名单 */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onDeleteFromWhitelist(selectedIds)}
            className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition flex items-center space-x-1.5 ${
              selectedIds.length > 0
                ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-2xs'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <i className="fa-regular fa-trash-can text-xs"></i>
            <span>移出白名单 ({selectedIds.length})</span>
          </button>

          {onGoToTab2 && (
            <button
              type="button"
              onClick={onGoToTab2}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1677ff] border border-blue-200 rounded text-xs font-medium cursor-pointer transition flex items-center space-x-1"
            >
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
              <span>前往台账检索添加</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. 数据表格 */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-xs overflow-hidden">
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
              <th className="w-[10%] px-2.5 py-2.5">认证/研判</th>
              <th className="w-[11%] px-2.5 py-2.5">台账标签</th>
              <th className="w-[12%] px-2.5 py-2.5">应用地址</th>
              <th className="w-[13%] px-2.5 py-2.5">主体名称/类型</th>
              <th
                className="w-[8%] px-2 py-2.5 text-right cursor-pointer hover:text-[#1677ff] transition"
                onClick={handleToggleFansSort}
              >
                粉丝数{' '}
                {fansSortOrder === 'desc'
                  ? '↓'
                  : fansSortOrder === 'asc'
                  ? '↑'
                  : '⇅'}
              </th>
              <th className="w-[7%] px-1 py-2.5 text-center">采集状态</th>
              <th className="w-[7%] px-1 py-2.5 text-center">台账状态</th>
              <th className="w-[160px] px-2 py-2.5 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <i className="fa-solid fa-shield-halved text-2xl text-green-300"></i>
                    <span>当前暂无白名单台账</span>
                    {onGoToTab2 && (
                      <button
                        type="button"
                        onClick={onGoToTab2}
                        className="text-[#1677ff] hover:underline cursor-pointer text-xs"
                      >
                        前往【台账检索】勾选加入白名单
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              displayList.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                const dotStatus =
                  item.collectDotStatus || (item.collectStatus === '已采集' ? '采集中' : '未采集');

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-green-50/30 transition ${
                      isSelected ? 'bg-green-50/20' : ''
                    }`}
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
                          <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            {item.name.slice(0, 1)}
                          </div>
                        )}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center space-x-1 flex-wrap">
                            <span
                              className="font-bold text-[#1677ff] hover:underline cursor-pointer truncate max-w-[120px]"
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <span className="px-1 py-0.2 rounded text-[10px] bg-green-50 text-green-700 border border-green-200">
                              白名单
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center space-x-1">
                            <span className="text-gray-400">
                              {item.platformBadge || item.platform}
                            </span>
                          </div>
                          {item.authBadgeDesc && (
                            <div
                              className="text-[10px] text-gray-400 truncate max-w-[140px]"
                              title={item.authBadgeDesc}
                            >
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
                        <div
                          key={i}
                          className="flex items-center space-x-1 text-[11px] text-gray-600 truncate"
                        >
                          <i
                            className={`fa-solid ${addr.icon || 'fa-location-dot'} text-gray-400 text-[10px] shrink-0`}
                          ></i>
                          <span className="truncate" title={addr.text}>
                            {addr.text}
                          </span>
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
                      <div className="flex items-center justify-center space-x-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => onRestoreToTab1([item.id])}
                          className="text-[#1677ff] hover:text-blue-700 font-medium cursor-pointer"
                          title="将该白名单台账加入本专项行动台账"
                        >
                          加入专项台账
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => onMoveToBlacklist([item.id])}
                          className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                          title="移入黑名单"
                        >
                          加入黑名单
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => onDeleteFromWhitelist([item.id])}
                          className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                          title="移出白名单"
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
