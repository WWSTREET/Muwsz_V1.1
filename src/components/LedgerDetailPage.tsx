import React from 'react';
import { LedgerItem } from '../mockLedgerData';

interface LedgerDetailPageProps {
  ledger: LedgerItem;
  onBack: () => void;
  onAddToWhitelist: (id: number) => void;
  onRemoveFromWhitelist: (id: number) => void;
  onAddToBlacklist: (id: number) => void;
}

export const LedgerDetailPage: React.FC<LedgerDetailPageProps> = ({
  ledger,
  onBack,
  onAddToWhitelist,
  onRemoveFromWhitelist,
  onAddToBlacklist
}) => {
  const detail = ledger.detail || {
    ledgerId: `0_${ledger.id}`,
    collectStatus: ledger.collectStatus as any,
    collectParam: `${ledger.id}`,
    jurisdictionLocation: ledger.addresses?.[0]?.text || '-',
    authInfo: {}
  };

  const auth = detail.authInfo || {};

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板：' + text);
  };

  // Open external URL
  const handleVisitUrl = () => {
    if (detail.ledgerUrl && detail.ledgerUrl !== '-') {
      window.open(detail.ledgerUrl, '_blank');
    } else {
      alert('该台账未提供直接访问的主页URL');
    }
  };

  const getPlatformIcon = (p: string) => {
    switch (p) {
      case '微博':
        return <i className="fa-brands fa-weibo text-[#fa8c16]"></i>;
      case '微信公众号':
        return <i className="fa-brands fa-weixin text-[#52c41a]"></i>;
      case '今日头条':
        return <i className="fa-solid fa-newspaper text-[#ff4d4f]"></i>;
      case '抖音':
        return <i className="fa-brands fa-tiktok text-black"></i>;
      case '网站':
      default:
        return <i className="fa-solid fa-earth-americas text-[#1677ff]"></i>;
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Top Header Back Bar */}
      <div className="border-b border-[#e8e8e8] px-6 py-3 flex items-center justify-between bg-white">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-gray-800 hover:text-[#1677ff] font-medium text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <i className="fa-solid fa-chevron-left text-xs text-gray-500"></i>
          <span>台账详情</span>
        </button>
      </div>

      {/* Whitelist Banner if Whitelisted */}
      {ledger.category === 'whitelist' && (
        <div className="mx-6 mt-4 bg-[#f6ffed] border border-[#b7eb8f] px-4 py-2.5 rounded-sm text-xs text-[#389e0d] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-shield-halved text-base"></i>
            <span>
              <strong>重点关注台账（白名单）</strong>：此台账已加入白名单重点监测池。根据系统管控规则，<strong>即使该台账的地址发生变更不再属于当前管辖地区，也不会从属地台账中被自动移出</strong>。
            </span>
          </div>
          <span className="px-2 py-0.5 bg-green-100 text-[#389e0d] text-[11px] rounded border border-[#b7eb8f] font-medium">
            白名单常驻保护
          </span>
        </div>
      )}

      {/* Main Content Body */}
      <div className="p-6 space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-start justify-between pb-6 border-b border-[#f0f0f0]">
          <div className="flex items-start space-x-4">
            {/* Avatar & Platform badge */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={ledger.avatar}
                  alt={ledger.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-xs"
                />
                {ledger.badgeType === 'redV' && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                    V
                  </span>
                )}
                {ledger.badgeType === 'blueV' && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                    V
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center space-x-1 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-sm text-xs text-gray-700">
                {getPlatformIcon(ledger.platform)}
                <span className="text-[11px]">{ledger.platform}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{ledger.name}</h1>
              </div>

              {/* Subject details */}
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span className="text-[#1677ff] flex items-center">
                  <i className="fa-regular fa-building mr-1"></i>
                  {ledger.subjectName}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{ledger.subjectType}</span>
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-2 pt-0.5">
                <span className="px-2 py-0.5 bg-blue-50 text-[#1677ff] rounded-xs text-xs border border-blue-200">
                  {ledger.authType}
                </span>
                <span className="px-2 py-0.5 bg-green-50 text-[#52c41a] rounded-xs text-xs border border-green-200">
                  {ledger.ledgerStatus}
                </span>
                {ledger.category === 'whitelist' && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-xs text-xs border border-emerald-300 font-medium">
                    白名单
                  </span>
                )}
                {ledger.category === 'blacklist' && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-xs text-xs border border-red-300 font-medium">
                    黑名单
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-center space-x-2 text-xs pt-1">
                <span className="text-gray-500">台账标签</span>
                <div className="flex flex-wrap gap-1.5">
                  {ledger.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-xs text-xs border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0 pt-1">
            {ledger.category === 'whitelist' ? (
              <button
                onClick={() => onRemoveFromWhitelist(ledger.id)}
                className="bg-white border border-[#fa8c16] text-[#fa8c16] hover:bg-orange-50 px-3.5 py-1.5 rounded-sm text-xs cursor-pointer flex items-center transition-colors shadow-xs"
              >
                <i className="fa-solid fa-user-minus mr-1.5 text-[11px]"></i> 移出白名单
              </button>
            ) : (
              <button
                onClick={() => onAddToWhitelist(ledger.id)}
                className="bg-white border border-[#52c41a] text-[#52c41a] hover:bg-green-50 px-3.5 py-1.5 rounded-sm text-xs cursor-pointer flex items-center transition-colors shadow-xs"
              >
                <i className="fa-solid fa-shield-halved mr-1.5 text-[11px]"></i> 加入白名单
              </button>
            )}

            {ledger.category !== 'blacklist' && (
              <button
                onClick={() => onAddToBlacklist(ledger.id)}
                className="bg-white border border-[#ff4d4f] text-[#ff4d4f] hover:bg-red-50 px-3.5 py-1.5 rounded-sm text-xs cursor-pointer flex items-center transition-colors shadow-xs"
              >
                <i className="fa-solid fa-ban mr-1.5 text-[11px]"></i> 加入黑名单
              </button>
            )}

            <button
              onClick={handleVisitUrl}
              className="bg-[#1677ff] text-white hover:bg-blue-600 px-4 py-1.5 rounded-sm text-xs cursor-pointer flex items-center transition-colors shadow-xs"
            >
              <i className="fa-regular fa-file-lines mr-1.5 text-[11px]"></i> 访问主页
            </button>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3.5 text-xs text-gray-700 py-1">
          {/* Left Column */}
          <div className="space-y-3.5">
            {/* 台账ID */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-solid fa-fingerprint text-gray-400 text-[11px]"></i>
                <span>台账ID</span>
              </div>
              <span className="text-gray-900 font-mono">{detail.ledgerId}</span>
            </div>

            {/* 采集状态 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-solid fa-gear text-gray-400 text-[11px]"></i>
                <span>采集状态</span>
              </div>
              <span className="flex items-center space-x-1.5 font-medium">
                {detail.collectStatus === '已采集' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-green-600">已采集</span>
                  </>
                ) : detail.collectStatus === '不可采' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-orange-600">不可采</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-red-600">未采集</span>
                  </>
                )}
              </span>
            </div>

            {/* 最后发文时间 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-regular fa-clock text-gray-400 text-[11px]"></i>
                <span>最后发文时间</span>
              </div>
              <span className="text-gray-900">{detail.lastPostTime || '-'}</span>
            </div>

            {/* 注册城市 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-regular fa-user text-gray-400 text-[11px]"></i>
                <span>注册城市</span>
                <i className="fa-regular fa-circle-question text-gray-300 text-[10px] ml-0.5"></i>
              </div>
              <span className="text-gray-900">{detail.registeredCity || '-'}</span>
            </div>

            {/* 管辖归属地 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-solid fa-landmark text-gray-400 text-[11px]"></i>
                <span>管辖归属地</span>
                <i className="fa-regular fa-circle-question text-gray-300 text-[10px] ml-0.5"></i>
              </div>
              <span className="text-gray-900">{detail.jurisdictionLocation || '-'}</span>
            </div>

            {/* 区域模型地址 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-solid fa-play text-gray-400 text-[10px]"></i>
                <span>区域模型地址</span>
                <i className="fa-regular fa-circle-question text-gray-300 text-[10px] ml-0.5"></i>
              </div>
              <span className="text-gray-900">{detail.regionalModelLocation || '-'}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3.5">
            {/* 台账URL */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-solid fa-link text-gray-400 text-[11px]"></i>
                <span>台账URL</span>
              </div>
              {detail.ledgerUrl && detail.ledgerUrl !== '-' ? (
                <div className="flex items-center space-x-1 text-[#1677ff] truncate max-w-md">
                  <a
                    href={detail.ledgerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline truncate"
                  >
                    {detail.ledgerUrl}
                  </a>
                  <button
                    onClick={() => handleCopy(detail.ledgerUrl!)}
                    className="text-gray-400 hover:text-[#1677ff] p-0.5 bg-transparent border-none cursor-pointer flex-shrink-0"
                    title="复制链接"
                  >
                    <i className="fa-regular fa-copy text-xs"></i>
                  </button>
                </div>
              ) : (
                <span className="text-gray-900">-</span>
              )}
            </div>

            {/* 采集参数 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-solid fa-sliders text-gray-400 text-[11px]"></i>
                <span>采集参数</span>
              </div>
              <span className="text-gray-900 font-mono truncate max-w-md">{detail.collectParam || '-'}</span>
            </div>

            {/* 最后一天发文地址 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <i className="fa-solid fa-paper-plane text-gray-400 text-[11px]"></i>
                <span>最后一天发文地址</span>
                <i className="fa-regular fa-circle-question text-gray-300 text-[10px] ml-0.5"></i>
              </div>
              <span className="text-gray-900">{detail.lastPostLocation || '-'}</span>
            </div>

            {/* IP属地 */}
            <div className="flex items-center">
              <div className="w-28 text-gray-500 flex items-center space-x-1">
                <span className="px-1 py-0.2 bg-gray-100 text-[10px] text-gray-500 rounded-xs font-mono">IP</span>
                <span>IP属地</span>
                <i className="fa-regular fa-circle-question text-gray-300 text-[10px] ml-0.5"></i>
              </div>
              <span className="text-gray-900">{detail.ipLocation || '-'}</span>
            </div>
          </div>
        </div>

        {/* Specific Platform Authentication / Profile Table */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-1 h-3.5 bg-[#1677ff] rounded-xs"></span>
            <h3 className="text-sm font-semibold text-gray-900">
              {ledger.platform === '网站'
                ? '网站信息'
                : ledger.platform === '微博'
                ? '微博认证信息'
                : ledger.platform === '抖音'
                ? '抖音认证信息'
                : ledger.platform === '今日头条'
                ? '今日头条认证信息'
                : '微信公众号认证信息'}
            </h3>
          </div>

          {/* Website ICP Table */}
          {ledger.platform === '网站' ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-700 font-medium">ICP备案信息</div>
              <div className="border border-[#e8e8e8] rounded-sm overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-[#e8e8e8]">
                    <tr>
                      <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">网站名称</td>
                      <td className="w-2/6 px-4 py-3 text-gray-900">{auth.siteName || ledger.name}</td>
                      <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">备案号</td>
                      <td className="w-2/6 px-4 py-3 text-gray-900 font-mono">{auth.filingNo || '鄂ICP备19016380号-1'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">主备案号</td>
                      <td className="px-4 py-3 text-gray-900 font-mono">{auth.mainFilingNo || '鄂ICP备19016380号'}</td>
                      <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">主办单位名称</td>
                      <td className="px-4 py-3 text-gray-900">{auth.sponsorName || ledger.subjectName}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">主办单位性质</td>
                      <td className="px-4 py-3 text-gray-900">{auth.sponsorNature || ledger.subjectType}</td>
                      <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">审核通过日期</td>
                      <td className="px-4 py-3 text-gray-900">{auth.approvalDate || '2019-06-25 11:56:32'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">更新时间</td>
                      <td colSpan={3} className="px-4 py-3 text-gray-900">{auth.updatedTime || '2026-08-15 19:19:21'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : ledger.platform === '微博' ? (
            /* Weibo Auth Table */
            <div className="border border-[#e8e8e8] rounded-sm overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#e8e8e8]">
                  <tr>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">昵称</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900">{auth.nickname || ledger.name}</td>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">账号ID</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900 font-mono">{auth.accountId || '1672519561'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">V类型</td>
                    <td className="px-4 py-3 text-gray-900">{auth.vType || '红V'}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">注册省份</td>
                    <td className="px-4 py-3 text-gray-900">{auth.registeredProvince || '河南'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">粉丝数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.fansCount || ledger.fansDisplay}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">关注数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.followCount || '1,640'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">获赞数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.likesCount || '2,732.55万'}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">转评赞数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.repostsCount || '3,481.92万'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">作品数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.worksCount || '20.35万'}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">许可证编号</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.licenseNo || '41120170005'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">服务单位</td>
                    <td className="px-4 py-3 text-gray-900">{auth.serviceUnit || ledger.subjectName}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">服务类别</td>
                    <td className="px-4 py-3 text-gray-900">{auth.serviceCategory || '采编发布服务、转载服务'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">认证信息</td>
                    <td className="px-4 py-3 text-gray-900">{auth.authDesc || `${ledger.subjectName}官方微博`}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">注册时间</td>
                    <td className="px-4 py-3 text-gray-900">{auth.registeredTime || '2009-12-22 10:39:54'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">更新时间</td>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">{auth.updatedTime || '2026-08-16 02:26:09'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : ledger.platform === '抖音' ? (
            /* Douyin Auth Table */
            <div className="border border-[#e8e8e8] rounded-sm overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#e8e8e8]">
                  <tr>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">昵称</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900">{auth.nickname || ledger.name}</td>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">账号ID</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900 font-mono">{auth.accountId || '4054638993872125'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">V类型</td>
                    <td className="px-4 py-3 text-gray-900">{auth.vType || '蓝V'}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">注册省份</td>
                    <td className="px-4 py-3 text-gray-900">{auth.registeredProvince || '湖北'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">注册城市</td>
                    <td className="px-4 py-3 text-gray-900">{auth.registeredCity || '随州'}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">IP属地</td>
                    <td className="px-4 py-3 text-gray-900">{auth.ipLocation || '湖北'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">粉丝数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.fansCount || ledger.fansDisplay}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">关注数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.followCount || '158'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">获赞数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.likesCount || '17.77万'}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">作品数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.worksCount || '174'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">认证信息</td>
                    <td className="px-4 py-3 text-gray-900">{auth.authDesc || ledger.subjectName}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">更新时间</td>
                    <td className="px-4 py-3 text-gray-900">{auth.updatedTime || '2026-08-15 19:19:21'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">简介</td>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">{auth.summary || '校训：厚德重能 求特创新 欢迎投稿19153737@qq.com/玉见·红石榴工作室'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : ledger.platform === '今日头条' ? (
            /* Toutiao Auth Table */
            <div className="border border-[#e8e8e8] rounded-sm overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#e8e8e8]">
                  <tr>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">昵称</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900">{auth.nickname || ledger.name}</td>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">账号ID</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900 font-mono">{auth.accountId || '57555349110'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">V类型</td>
                    <td className="px-4 py-3 text-gray-900">{auth.vType || '蓝V'}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">IP属地</td>
                    <td className="px-4 py-3 text-gray-900">{auth.ipLocation || '湖北'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">粉丝数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.fansCount || ledger.fansDisplay}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">作品数量</td>
                    <td className="px-4 py-3 text-gray-900 font-mono">{auth.worksCount || '490'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">认证信息</td>
                    <td className="px-4 py-3 text-gray-900">{auth.authDesc || `${ledger.subjectName}官方账号`}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">更新时间</td>
                    <td className="px-4 py-3 text-gray-900">{auth.updatedTime || '2026-08-15 18:19:34'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">简介</td>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">{auth.summary || ledger.subjectName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* WeChat Official Account Auth Table */
            <div className="border border-[#e8e8e8] rounded-sm overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#e8e8e8]">
                  <tr>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">昵称</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900">{auth.nickname || ledger.name}</td>
                    <td className="w-1/6 px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">账号</td>
                    <td className="w-2/6 px-4 py-3 text-gray-900 font-mono">{auth.accountId || '3865344706'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">认证信息</td>
                    <td className="px-4 py-3 text-gray-900">{auth.authDesc || ledger.subjectName}</td>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">更新时间</td>
                    <td className="px-4 py-3 text-gray-900">{auth.updatedTime || '2026-08-14 21:02:02'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#fafafa] text-gray-500 font-normal">简介</td>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">{auth.summary || '对辖区做相关开发建设工作，稳定投资促进增长；做招商引资工作，促进产业持续发展。'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
