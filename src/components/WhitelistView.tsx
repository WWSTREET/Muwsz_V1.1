import React, { useState } from 'react';
import { LedgerItem } from '../mockLedgerData';
import { ConfirmModal } from './ConfirmModal';
import { LedgerFilterBar, LedgerFilterValues, initialFilterValues } from './LedgerFilterBar';

interface WhitelistViewProps {
  ledgers: LedgerItem[];
  ledgerTypeName?: string;
  onViewDetail?: (ledger: LedgerItem) => void;
  onRemoveFromWhitelist: (id: number) => void;
  onBatchRemoveFromWhitelist: (ids: number[]) => void;
  onAddToBlacklist?: (id: number) => void;
  onBatchAddToBlacklist?: (ids: number[]) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const WhitelistView: React.FC<WhitelistViewProps> = ({
  ledgers,
  ledgerTypeName = '属地台账',
  onViewDetail,
  onRemoveFromWhitelist,
  onBatchRemoveFromWhitelist,
  onAddToBlacklist,
  onBatchAddToBlacklist,
  onNavigateToTab
}) => {
  const [filterValues, setFilterValues] = useState<LedgerFilterValues>(initialFilterValues);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal confirmation states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
    confirmText?: string;
    confirmType?: 'primary' | 'danger' | 'warning' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    content: '',
    onConfirm: () => {}
  });

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const whitelistItems = ledgers.filter(item => {
    if (item.category !== 'whitelist') return false;

    // Filter by name
    if (filterValues.ledgerName.trim()) {
      const q = filterValues.ledgerName.trim().toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.subjectName.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Filter by platform
    if (filterValues.platform) {
      if (!item.platform.includes(filterValues.platform) && !filterValues.platform.includes(item.platform)) {
        return false;
      }
    }

    // Filter by authType
    if (filterValues.authType) {
      if (item.authType && !item.authType.includes(filterValues.authType)) {
        return false;
      }
    }

    // Filter by judgmentType
    if (filterValues.judgmentType) {
      if (item.judgmentType && !item.judgmentType.includes(filterValues.judgmentType)) {
        return false;
      }
    }

    // Filter by collectStatus
    if (filterValues.collectStatus) {
      if (item.collectStatus && !item.collectStatus.includes(filterValues.collectStatus)) {
        return false;
      }
    }

    // Filter by ledgerStatus
    if (filterValues.ledgerStatus) {
      if (item.ledgerStatus && !item.ledgerStatus.includes(filterValues.ledgerStatus)) {
        return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(whitelistItems.length / pageSize) || 1;
  const pagedItems = whitelistItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(pagedItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const triggerRemoveOne = (item: LedgerItem) => {
    setModalConfig({
      isOpen: true,
      title: '确认移出白名单',
      confirmType: 'warning',
      confirmText: '确认移出',
      content: (
        <div>
          <p>确定要将台账 <strong className="text-gray-900 font-semibold">【{item.name}】</strong> 移出白名单吗？</p>
          <p className="mt-1.5 text-gray-500 text-xs">移出后将失去重点关注台账的保护属性，恢复为常规{ledgerTypeName}。</p>
        </div>
      ),
      onConfirm: () => {
        onRemoveFromWhitelist(item.id);
        closeModal();
      }
    });
  };

  const triggerAddToBlacklistOne = (item: LedgerItem) => {
    setModalConfig({
      isOpen: true,
      title: '确认加入黑名单',
      confirmType: 'danger',
      confirmText: '确认移入黑名单',
      content: (
        <div>
          <p>确定要将台账 <strong className="text-gray-900 font-semibold">【{item.name}】</strong> 直接移入黑名单吗？</p>
          <p className="mt-1.5 text-gray-500 text-xs">加入黑名单后，该台账将被隐藏并集中移入黑名单列表中管控。</p>
        </div>
      ),
      onConfirm: () => {
        if (onAddToBlacklist) {
          onAddToBlacklist(item.id);
        }
        closeModal();
      }
    });
  };

  const handleBatchRemove = () => {
    if (selectedIds.length === 0) {
      setModalConfig({
        isOpen: true,
        title: '提示',
        confirmType: 'primary',
        confirmText: '我知道了',
        content: <span>请先勾选需要移出白名单的台账。</span>,
        onConfirm: closeModal
      });
      return;
    }
    setModalConfig({
      isOpen: true,
      title: '批量移出白名单',
      confirmType: 'warning',
      confirmText: '确认移出',
      content: (
        <div>
          <p>确定要将选中的 <strong className="text-orange-600 font-semibold">{selectedIds.length}</strong> 项台账移出白名单并恢复至{ledgerTypeName}吗？</p>
        </div>
      ),
      onConfirm: () => {
        onBatchRemoveFromWhitelist(selectedIds);
        setSelectedIds([]);
        closeModal();
      }
    });
  };

  const handleBatchAddToBlacklist = () => {
    if (selectedIds.length === 0) {
      setModalConfig({
        isOpen: true,
        title: '提示',
        confirmType: 'primary',
        confirmText: '我知道了',
        content: <span>请先勾选需要加入黑名单的台账。</span>,
        onConfirm: closeModal
      });
      return;
    }
    setModalConfig({
      isOpen: true,
      title: '批量加入黑名单',
      confirmType: 'danger',
      confirmText: '确认加入黑名单',
      content: (
        <div>
          <p>确定要将选中的 <strong className="text-red-600 font-semibold">{selectedIds.length}</strong> 项台账直接移入黑名单吗？</p>
        </div>
      ),
      onConfirm: () => {
        if (onBatchAddToBlacklist) {
          onBatchAddToBlacklist(selectedIds);
        } else if (onAddToBlacklist) {
          selectedIds.forEach(id => onAddToBlacklist(id));
        }
        setSelectedIds([]);
        closeModal();
      }
    });
  };

  return (
    <div className="bg-white flex flex-col space-y-4">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        content={modalConfig.content}
        confirmText={modalConfig.confirmText}
        confirmType={modalConfig.confirmType}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />

      {/* Header Info Banner */}
      <div className="flex items-center justify-between bg-[#f6ffed] border border-[#b7eb8f] px-4 py-2.5 rounded-sm text-xs text-gray-700">
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-shield-halved text-[#52c41a] text-sm"></i>
          <span>
            白名单中的台账属于受信任/重点关注台账（即使该台账的地址发生变更不再属于管辖地区也不会被自动移除），当前共有 <strong className="text-[#52c41a] font-semibold">{whitelistItems.length}</strong> 条白名单台账。
          </span>
        </div>
        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('ledger')}
            className="text-[#1677ff] hover:underline flex items-center space-x-1 cursor-pointer bg-transparent border-none text-xs font-medium"
          >
            <span>返回{ledgerTypeName}列表</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <LedgerFilterBar
        totalCount={whitelistItems.length}
        selectedCount={selectedIds.length}
        onSearch={(filters) => {
          setFilterValues(filters);
          setCurrentPage(1);
        }}
        onReset={() => {
          setFilterValues(initialFilterValues);
          setCurrentPage(1);
        }}
      />

      {/* Batch Operations Bar */}
      <div className="flex items-center justify-between bg-[#e6f4ff] border border-[#91caff] px-3.5 py-2 rounded-sm text-xs text-gray-700">
        <div className="flex items-center space-x-1.5">
          <i className="fa-solid fa-circle-info text-[#1677ff]"></i>
          <span>已选择 <strong className="text-[#1677ff] font-semibold">{selectedIds.length}</strong> 项目</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBatchRemove}
            className="bg-white border border-[#fa8c16] text-[#fa8c16] px-3 py-1 rounded-sm text-xs hover:bg-orange-50 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-user-minus mr-1.5 text-[11px]"></i> 批量移出白名单
          </button>
          <button
            onClick={handleBatchAddToBlacklist}
            className="bg-white border border-[#ff4d4f] text-[#ff4d4f] px-3 py-1 rounded-sm text-xs hover:bg-red-50 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-ban mr-1.5 text-[11px]"></i> 批量加入黑名单
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs table-fixed">
          <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
            <tr>
              <th className="px-1.5 py-2.5 font-normal w-[32px] text-center whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={pagedItems.length > 0 && selectedIds.length === pagedItems.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                />
              </th>
              <th className="px-1 py-2.5 font-normal w-[36px] text-center whitespace-nowrap">序号</th>
              <th className="px-2 py-2.5 font-normal w-[18%] whitespace-nowrap">台账名称</th>
              <th className="px-1.5 py-2.5 font-normal w-[16%] whitespace-nowrap">主体名称/类型</th>
              <th className="px-2 py-2.5 font-normal w-[20%] whitespace-nowrap">URL地址/简介</th>
              <th className="px-1.5 py-2.5 font-normal w-[100px] whitespace-nowrap">认证/研判</th>
              <th className="px-1.5 py-2.5 font-normal w-[110px] whitespace-nowrap">台账标签</th>
              <th className="px-1 py-2.5 font-normal w-[75px] whitespace-nowrap text-right">粉丝数</th>
              <th className="px-1 py-2.5 font-normal w-[65px] text-center whitespace-nowrap">台账来源</th>
              <th className="px-1 py-2.5 font-normal w-[60px] text-center whitespace-nowrap">台账类型</th>
              <th className="px-2 py-2.5 font-normal w-[140px] text-center whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8e8]">
            {pagedItems.length > 0 ? (
              pagedItems.map((item, idx) => {
                let rawUrl = item.detail?.ledgerUrl;
                if (!rawUrl || rawUrl === '-') {
                  if (item.platform === '微博') rawUrl = `https://weibo.com/u/${1672519560 + item.id}`;
                  else if (item.platform === '网站') rawUrl = `https://www.site${item.id}.gov.cn`;
                  else if (item.platform === '今日头条') rawUrl = `https://www.toutiao.com/c/user/token/TT_${item.id}`;
                  else if (item.platform === '抖音') rawUrl = `https://www.douyin.com/user/DY_${item.id}`;
                  else if (item.platform === '微信公众号') rawUrl = `https://mp.weixin.qq.com/s/gh_${item.id}`;
                  else rawUrl = `https://www.example.com/ledger/${item.id}`;
                }
                const hrefUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
                const introText = item.intro || item.detail?.authInfo?.summary || `${item.name}官方账号，发布权威政务信息与服务动态。`;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-1.5 py-2 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectOne(item.id)}
                        className="rounded border-gray-300 text-[#1677ff] cursor-pointer"
                      />
                    </td>
                    <td className="px-1 py-2 text-gray-500 text-center whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-2 py-2 overflow-hidden">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-6 h-6 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div
                            onClick={() => onViewDetail && onViewDetail(item)}
                            className="font-medium text-[#1677ff] hover:underline cursor-pointer truncate text-xs"
                            title={`点击查看详情：${item.name}`}
                          >
                            {item.name}
                          </div>
                          <div className="text-[10px] space-y-0.2">
                            <div className="text-gray-400 truncate">{item.platformBadge || item.platform}</div>
                            <div
                              className="text-gray-500 truncate"
                              title={item.authDesc || item.detail?.authInfo?.authDesc || item.subjectName}
                            >
                              {item.authDesc || item.detail?.authInfo?.authDesc || item.subjectName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* 主体名称/类型 (调整到台账名称后面) */}
                    <td className="px-1.5 py-2 text-gray-600 overflow-hidden">
                      <div className="space-y-0.2 min-w-0">
                        <div className="text-gray-800 truncate text-xs font-normal" title={item.subjectName}>{item.subjectName}</div>
                        <div className="text-[10px] text-gray-400 truncate" title={item.subjectType}>{item.subjectType}</div>
                      </div>
                    </td>
                    {/* URL地址/简介 (简介上方增加URL地址，并可点击跳转) */}
                    <td className="px-2 py-2 text-gray-600 overflow-hidden">
                      <div className="min-w-0 space-y-0.5">
                        <a
                          href={hrefUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#1677ff] hover:underline font-mono text-[11px] truncate block leading-tight"
                          title={`点击跳转主页/地址：${rawUrl}`}
                        >
                          {rawUrl}
                        </a>
                        <div
                          className="text-[11px] text-gray-500 line-clamp-2 leading-tight"
                          title={introText}
                        >
                          {introText}
                        </div>
                      </div>
                    </td>
                    <td className="px-1.5 py-2 overflow-hidden">
                      <div className="flex flex-col space-y-0.5">
                        <span className="px-1 py-0.2 bg-gray-100 text-gray-600 rounded-xs text-[10px] border border-gray-200 truncate text-center" title={item.authType}>
                          {item.authType}
                        </span>
                        <span className="px-1 py-0.2 bg-gray-100 text-gray-600 rounded-xs text-[10px] border border-gray-200 truncate text-center" title={item.judgmentType}>
                          {item.judgmentType}
                        </span>
                      </div>
                    </td>
                    <td className="px-1.5 py-2 overflow-hidden">
                      <div className="flex flex-col gap-0.5">
                        {item.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1 py-0.2 bg-gray-100 text-gray-600 rounded-xs text-[10px] border border-gray-200 truncate"
                            title={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-1 py-2 font-mono text-gray-800 whitespace-nowrap text-right text-[11px] overflow-hidden truncate" title={item.fansDisplay}>
                    {item.fansDisplay}
                  </td>
                  <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                    <span className="px-1 py-0.2 bg-blue-50 text-[#1677ff] text-[10px] rounded-xs border border-blue-200 whitespace-nowrap truncate inline-block" title={item.source}>
                      {item.source}
                    </span>
                  </td>
                  <td className="px-1 py-2 whitespace-nowrap text-center overflow-hidden">
                    <span className="px-1 py-0.2 bg-green-50 text-[#52c41a] text-[10px] rounded-xs border border-green-200 font-medium whitespace-nowrap inline-block">
                      白名单
                    </span>
                  </td>
                  <td className="px-1.5 py-2 text-center whitespace-nowrap overflow-hidden">
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <button
                        onClick={() => triggerRemoveOne(item)}
                        className="text-[#fa8c16] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                        title="移出白名单"
                      >
                        移出白名单
                      </button>
                      <button
                        onClick={() => triggerAddToBlacklistOne(item)}
                        className="text-[#ff4d4f] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-normal whitespace-nowrap"
                        title="加入黑名单"
                      >
                        加入黑名单
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <i className="fa-regular fa-folder-open text-2xl text-gray-300"></i>
                    <p className="text-xs">暂无白名单台账数据</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1 py-1">
        <span>共 {whitelistItems.length} 条数据，每页 {pageSize} 条</span>
        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-2.5 py-1 border border-[#d9d9d9] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
          >
            上一页
          </button>
          <span className="px-3 py-1 font-mono text-[#1677ff] bg-blue-50 border border-blue-200 rounded-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-2.5 py-1 border border-[#d9d9d9] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};
