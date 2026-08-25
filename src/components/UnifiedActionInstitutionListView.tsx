import React, { useState, useMemo } from 'react';
import { InstitutionLedgerScopeConfig } from './SpecialPlanCreateView';
import { getInstitutionRegion, getInstitutionType } from '../utils/territoryLedgers';

export interface UnifiedActionInstitutionListViewProps {
  institutions: string[];
  instConfigs: { [instName: string]: InstitutionLedgerScopeConfig };
  onSelectInstitution: (instName: string) => void;
  onResetInstitutionTerritory: (instName: string) => void;
  onResetAllTerritory: () => void;
  onRemoveInstitution: (instName: string) => void;
  onOpenManageInstitutions: () => void;
  onToast: (msg: string) => void;
}

export const UnifiedActionInstitutionListView: React.FC<UnifiedActionInstitutionListViewProps> = ({
  institutions,
  instConfigs,
  onSelectInstitution,
  onResetInstitutionTerritory,
  onResetAllTerritory,
  onRemoveInstitution,
  onOpenManageInstitutions,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'default' | 'modified' | 'empty'>('all');
  const [showBatchResetConfirm, setShowBatchResetConfirm] = useState(false);
  const [singleResetTarget, setSingleResetTarget] = useState<string | null>(null);

  // Calculate totals
  const stats = useMemo(() => {
    let totalLedgers = 0;
    let localImportTotal = 0;
    let manualAddTotal = 0;
    let blacklistTotal = 0;
    let modifiedCount = 0;
    let emptyCount = 0;

    institutions.forEach(inst => {
      const cfg = instConfigs[inst];
      if (cfg) {
        const t1Count = cfg.tab1Ledgers.length;
        const bCount = cfg.tab3Blacklist.length;
        const localCount = cfg.tab1Ledgers.filter(l => l.importSource === '属地导入').length;
        const manualCount = cfg.tab1Ledgers.filter(l => l.importSource === '手动追加').length;

        totalLedgers += t1Count;
        localImportTotal += localCount;
        manualAddTotal += manualCount;
        blacklistTotal += bCount;

        if (t1Count === 0) {
          emptyCount++;
        } else if (manualCount > 0 || bCount > 0) {
          modifiedCount++;
        }
      }
    });

    return {
      instCount: institutions.length,
      totalLedgers,
      localImportTotal,
      manualAddTotal,
      blacklistTotal,
      modifiedCount,
      emptyCount,
    };
  }, [institutions, instConfigs]);

  // Filter institutions
  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      const region = getInstitutionRegion(inst);
      const matchesSearch =
        !searchTerm.trim() ||
        inst.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        region.toLowerCase().includes(searchTerm.trim().toLowerCase());

      if (!matchesSearch) return false;

      const cfg = instConfigs[inst];
      const t1Count = cfg ? cfg.tab1Ledgers.length : 0;
      const manualCount = cfg ? cfg.tab1Ledgers.filter(l => l.importSource === '手动追加').length : 0;
      const bCount = cfg ? cfg.tab3Blacklist.length : 0;

      if (statusFilter === 'empty') return t1Count === 0;
      if (statusFilter === 'modified') return manualCount > 0 || bCount > 0;
      if (statusFilter === 'default') return t1Count > 0 && manualCount === 0 && bCount === 0;

      return true;
    });
  }, [institutions, instConfigs, searchTerm, statusFilter]);

  return (
    <div className="flex flex-col space-y-4 text-xs">
      {/* Top Banner & Instructions */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 border border-blue-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#1677ff] text-white flex items-center justify-center text-sm shrink-0 shadow-xs mt-0.5">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-gray-900 text-sm">统一行动：机构台账范围管理</h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200 font-medium">
                默认已应用属地台账
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
              本次统一行动共纳入 <strong className="text-gray-800">{institutions.length}</strong> 个机构，系统已<strong className="text-[#1677ff]">默认加载并应用各机构在属地台账中的基准台账</strong>。点击任意机构可进入专属详情页，灵活调整本行动台账、配置黑名单或进行多维台账检索。
            </p>
          </div>
        </div>

        {/* Global summary stats pills */}
        <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
          <div className="bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-2xs text-center">
            <div className="text-[10px] text-gray-400">参与机构</div>
            <div className="text-sm font-bold text-gray-800">{stats.instCount} 所</div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-md border border-blue-200 shadow-2xs text-center">
            <div className="text-[10px] text-blue-600 font-medium">已纳入行动台账</div>
            <div className="text-sm font-bold text-[#1677ff]">{stats.totalLedgers} 条</div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-md border border-red-200 shadow-2xs text-center">
            <div className="text-[10px] text-red-500 font-medium">排除黑名单</div>
            <div className="text-sm font-bold text-red-600">{stats.blacklistTotal} 条</div>
          </div>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left: Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[260px] max-w-sm">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索机构名称、所属省市区..."
              className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#1677ff] transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 border border-gray-200 rounded p-0.5 bg-gray-50">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                statusFilter === 'all'
                  ? 'bg-white text-[#1677ff] shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              全部机构 ({institutions.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('default')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                statusFilter === 'default'
                  ? 'bg-white text-green-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              默认应用属地 ({institutions.length - stats.modifiedCount - stats.emptyCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('modified')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                statusFilter === 'modified'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              已单独调整 ({stats.modifiedCount})
            </button>
            {stats.emptyCount > 0 && (
              <button
                type="button"
                onClick={() => setStatusFilter('empty')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                  statusFilter === 'empty'
                    ? 'bg-white text-red-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                未配置台账 ({stats.emptyCount})
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowBatchResetConfirm(true)}
            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded text-xs font-medium cursor-pointer transition flex items-center space-x-1.5"
            title="将全部机构的台账重新恢复为系统属地默认台账"
          >
            <i className="fa-solid fa-rotate-left text-xs"></i>
            <span>全部重置为属地台账</span>
          </button>

          <button
            type="button"
            onClick={onOpenManageInstitutions}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1677ff] border border-blue-200 rounded text-xs font-medium cursor-pointer transition flex items-center space-x-1.5"
            title="在步骤一调整参与本次统一行动的机构名单"
          >
            <i className="fa-solid fa-building-circle-gear text-xs"></i>
            <span>管理参与机构</span>
          </button>
        </div>
      </div>

      {/* Institution List Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-semibold select-none">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[240px]">机构名称 / 类型</th>
                <th className="py-3 px-4 w-36">所属区域</th>
                <th className="py-3 px-4 w-32 text-center">属地默认台账</th>
                <th className="py-3 px-4 w-40 text-center">本行动台账 (已纳入)</th>
                <th className="py-3 px-4 w-28 text-center">黑名单</th>
                <th className="py-3 px-4 w-32 text-center">有效排查台账</th>
                <th className="py-3 px-4 w-36 text-center">配置状态</th>
                <th className="py-3 px-4 w-44 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredInstitutions.length > 0 ? (
                filteredInstitutions.map((inst, index) => {
                  const cfg = instConfigs[inst];
                  const t1Count = cfg ? cfg.tab1Ledgers.length : 0;
                  const localCount = cfg ? cfg.tab1Ledgers.filter(l => l.importSource === '属地导入').length : 0;
                  const manualCount = cfg ? cfg.tab1Ledgers.filter(l => l.importSource === '手动追加').length : 0;
                  const bCount = cfg ? cfg.tab3Blacklist.length : 0;
                  const effectiveCount = Math.max(0, t1Count - bCount);
                  const region = getInstitutionRegion(inst);
                  const instType = getInstitutionType(inst);

                  const isModified = manualCount > 0 || bCount > 0;
                  const isEmpty = t1Count === 0;

                  return (
                    <tr
                      key={inst}
                      onClick={() => onSelectInstitution(inst)}
                      className="hover:bg-blue-50/40 transition cursor-pointer group"
                    >
                      {/* 序号 */}
                      <td className="py-3.5 px-4 text-center text-gray-400 font-mono">
                        {index + 1}
                      </td>

                      {/* 机构名称 / 类型 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start space-x-2.5">
                          <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                            <i className="fa-regular fa-building"></i>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-[#1677ff] transition flex items-center space-x-1.5">
                              <span>{inst}</span>
                              <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-[#1677ff] transition opacity-0 group-hover:opacity-100"></i>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-gray-100 text-gray-600 border border-gray-200">
                                {instType}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                点击进入调整详情
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 所属区域 */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <i className="fa-solid fa-location-dot text-gray-400 text-[11px]"></i>
                          <span>{region}</span>
                        </div>
                      </td>

                      {/* 属地默认台账数 */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-gray-700 font-medium bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                          {localCount} 条
                        </span>
                      </td>

                      {/* 本行动台账 (核心已纳入) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-full ${
                              isEmpty
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-50 text-[#1677ff] border border-blue-200 shadow-2xs'
                            }`}
                          >
                            {t1Count} 条
                          </span>
                          {manualCount > 0 && (
                            <span className="text-[10px] text-blue-600 mt-0.5">
                              (含追加 {manualCount} 条)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 黑名单 */}
                      <td className="py-3.5 px-4 text-center">
                        {bCount > 0 ? (
                          <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            {bCount} 条
                          </span>
                        ) : (
                          <span className="text-gray-300 font-mono">0</span>
                        )}
                      </td>

                      {/* 有效排查台账 */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                          {effectiveCount} 条
                        </span>
                      </td>

                      {/* 配置状态 */}
                      <td className="py-3.5 px-4 text-center">
                        {isEmpty ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-red-50 text-red-600 border border-red-200 font-medium">
                            <i className="fa-solid fa-circle-exclamation mr-1 text-[10px]"></i>
                            待配置台账
                          </span>
                        ) : isModified ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            <i className="fa-solid fa-sliders mr-1 text-[10px]"></i>
                            已单独调整
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-700 border border-green-200 font-medium">
                            <i className="fa-solid fa-circle-check mr-1 text-[10px]"></i>
                            默认应用属地
                          </span>
                        )}
                      </td>

                      {/* 操作 */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={e => e.stopPropagation()} // 防止点击操作按钮触发整行跳转
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => onSelectInstitution(inst)}
                            className="px-2.5 py-1 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium cursor-pointer shadow-2xs transition flex items-center space-x-1"
                            title="进入该机构的台账详情页进行调整"
                          >
                            <i className="fa-solid fa-pen-to-square text-[11px]"></i>
                            <span>调整台账</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSingleResetTarget(inst)}
                            className="p-1 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded cursor-pointer transition"
                            title="恢复为该机构默认属地台账"
                          >
                            <i className="fa-solid fa-rotate-left text-xs"></i>
                          </button>

                          {institutions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onRemoveInstitution(inst)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition"
                              title="从本次统一行动中移除该机构"
                            >
                              <i className="fa-regular fa-trash-can text-xs"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa-regular fa-folder-open text-3xl text-gray-300"></i>
                      <span>未找到符合条件的机构</span>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                          }}
                          className="text-[#1677ff] hover:underline text-xs cursor-pointer mt-1"
                        >
                          清除搜索条件
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-200 flex flex-wrap items-center justify-between text-gray-500 text-xs">
          <div>
            共显示 <strong>{filteredInstitutions.length}</strong> 个机构 (总计 <strong>{institutions.length}</strong> 个机构已加入本次统一行动)
          </div>
          <div className="flex items-center space-x-4">
            <span>
              已纳入台账合计：<strong className="text-[#1677ff] font-bold">{stats.totalLedgers}</strong> 条
            </span>
            <span>
              黑名单合计：<strong className="text-red-500 font-bold">{stats.blacklistTotal}</strong> 条
            </span>
            <span>
              实际有效扫描量：<strong className="text-green-700 font-bold">{Math.max(0, stats.totalLedgers - stats.blacklistTotal)}</strong> 条
            </span>
          </div>
        </div>
      </div>

      {/* Batch Reset Confirmation Modal */}
      {showBatchResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl text-[#333]">
            <div className="flex items-center space-x-2 text-orange-600">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <h3 className="font-bold text-sm text-gray-800">批量重置为属地台账确认</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              确定要将参与本次统一行动的全部 <strong>{institutions.length}</strong> 个机构的台账重新恢复为<strong>默认属地台账</strong>吗？各机构的手动追加台账与黑名单将被清空并恢复至属地基准。
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchResetConfirm(false)}
                className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAllTerritory();
                  setShowBatchResetConfirm(false);
                  onToast('已将全部机构台账重置并重新应用为属地默认台账！');
                }}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                确认全部重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Reset Confirmation Modal */}
      {singleResetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl text-[#333]">
            <div className="flex items-center space-x-2 text-orange-600">
              <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              <h3 className="font-bold text-sm text-gray-800">重置属地台账确认</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              确定要将【<strong className="text-gray-900">{singleResetTarget}</strong>】的台账重置为<strong>默认属地台账</strong>吗？此操作将清空该机构的手动追加与黑名单调整。
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSingleResetTarget(null)}
                className="px-4 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetInstitutionTerritory(singleResetTarget);
                  setSingleResetTarget(null);
                  onToast(`已将【${singleResetTarget}】重置为默认属地台账！`);
                }}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
