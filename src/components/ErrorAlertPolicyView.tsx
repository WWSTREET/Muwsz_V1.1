import React, { useState } from 'react';

export interface AlertPolicyItem {
  id: number;
  name: string;
  scope: string[];
  days: string[];
  timeRange: string;
  recipients: AlertRecipientItem[];
  status: boolean;
  operator: string;
  operateTime: string;
}

export interface AlertRecipientItem {
  id: number;
  avatar?: string;
  nickname: string;
  name: string;
  phone: string;
  isFollowOfficialAccount: boolean;
  bindTime: string;
}

const ERROR_SCOPE_OPTIONS = [
  '固定表述错误',
  '人物职务错误',
  '机构组织名称错误',
  '地名与区划错误',
  '数字与年份错误',
  '党的二十届四中全会',
  '法律法规名称',
  '特定术语规范',
  '政领范',
  '标点及符号',
  '错别字',
  '抗战胜利80周年',
  '双字重叠',
  '语序颠倒',
  '涉密及敏感',
  '敏感词',
  '涉恐涉暴',
  '其他错误',
];

const WEEKDAYS = [
  { key: 'mon', label: '周一' },
  { key: 'tue', label: '周二' },
  { key: 'wed', label: '周三' },
  { key: 'thu', label: '周四' },
  { key: 'fri', label: '周五' },
  { key: 'sat', label: '周六' },
  { key: 'sun', label: '周日' },
];

const INITIAL_CANDIDATE_USERS: AlertRecipientItem[] = [
  {
    id: 101,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
    nickname: '陕西网安-王晨',
    name: '王晨',
    phone: '13891823412',
    isFollowOfficialAccount: true,
    bindTime: '2026-06-12 10:22:31',
  },
  {
    id: 102,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
    nickname: '巡查专员-李峰',
    name: '李峰',
    phone: '13991209843',
    isFollowOfficialAccount: true,
    bindTime: '2026-07-01 15:40:12',
  },
  {
    id: 103,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
    nickname: '政务运维-赵雪',
    name: '赵雪',
    phone: '13788291039',
    isFollowOfficialAccount: true,
    bindTime: '2026-07-15 09:18:45',
  },
  {
    id: 104,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=60',
    nickname: '研判中心-刘洋',
    name: '刘洋',
    phone: '18602938192',
    isFollowOfficialAccount: true,
    bindTime: '2026-08-01 11:05:20',
  },
];

export const ErrorAlertPolicyView: React.FC = () => {
  // Policies state (initial empty as shown in image 1, with capability to add/edit/delete)
  const [policies, setPolicies] = useState<AlertPolicyItem[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);

  // Form states
  const [policyName, setPolicyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    '固定表述错误',
    '人物职务错误',
    '机构组织名称错误',
    '地名与区划错误',
    '数字与年份错误',
    '党的二十届四中全会',
    '法律法规名称',
    '特定术语规范',
    '政领范',
    '标点及符号',
    '错别字',
    '抗战胜利80周年',
    '双字重叠',
  ]);
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
  ]);
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('23:59:59');
  const [recipients, setRecipients] = useState<AlertRecipientItem[]>([]);

  // Secondary modal: Add Personnel
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [searchField, setSearchField] = useState('姓名');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([]);

  // Open modal for new policy
  const handleOpenNewModal = () => {
    setEditingPolicyId(null);
    setPolicyName('');
    setSelectedScopes([
      '固定表述错误',
      '人物职务错误',
      '机构组织名称错误',
      '地名与区划错误',
      '数字与年份错误',
      '党的二十届四中全会',
      '法律法规名称',
      '特定术语规范',
      '政领范',
      '标点及符号',
      '错别字',
      '抗战胜利80周年',
      '双字重叠',
    ]);
    setSelectedDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
    setStartTime('00:00:00');
    setEndTime('23:59:59');
    setRecipients([]);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditPolicy = (policy: AlertPolicyItem) => {
    setEditingPolicyId(policy.id);
    setPolicyName(policy.name);
    setSelectedScopes(policy.scope);
    setSelectedDays(policy.days);
    const times = policy.timeRange.split(' 至 ');
    setStartTime(times[0] || '00:00:00');
    setEndTime(times[1] || '23:59:59');
    setRecipients(policy.recipients);
    setIsModalOpen(true);
  };

  // Delete policy
  const handleDeletePolicy = (id: number) => {
    if (window.confirm('确定要删除该预警策略吗？')) {
      setPolicies(prev => prev.filter(p => p.id !== id));
    }
  };

  // Toggle status
  const handleToggleStatus = (id: number) => {
    setPolicies(prev =>
      prev.map(p => (p.id === id ? { ...p, status: !p.status } : p))
    );
  };

  // Save policy
  const handleSavePolicy = () => {
    if (!policyName.trim()) {
      alert('请输入策略名称');
      return;
    }
    if (selectedScopes.length === 0) {
      alert('请选择预警范围');
      return;
    }
    if (selectedDays.length === 0) {
      alert('请选择接收日期');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingPolicyId) {
      setPolicies(prev =>
        prev.map(p =>
          p.id === editingPolicyId
            ? {
                ...p,
                name: policyName,
                scope: selectedScopes,
                days: selectedDays,
                timeRange: `${startTime} 至 ${endTime}`,
                recipients: recipients,
                operateTime: nowStr,
              }
            : p
        )
      );
    } else {
      const newPolicy: AlertPolicyItem = {
        id: Date.now(),
        name: policyName,
        scope: selectedScopes,
        days: selectedDays,
        timeRange: `${startTime} 至 ${endTime}`,
        recipients: recipients,
        status: true,
        operator: '系统管理员',
        operateTime: nowStr,
      };
      setPolicies(prev => [newPolicy, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Days checkbox helpers
  const isAllDaysSelected = selectedDays.length === WEEKDAYS.length;
  const handleToggleAllDays = () => {
    if (isAllDaysSelected) {
      setSelectedDays([]);
    } else {
      setSelectedDays(WEEKDAYS.map(w => w.key));
    }
  };

  const handleToggleDay = (key: string) => {
    if (selectedDays.includes(key)) {
      setSelectedDays(prev => prev.filter(d => d !== key));
    } else {
      setSelectedDays(prev => [...prev, key]);
    }
  };

  // Scope toggle
  const handleToggleScope = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(prev => prev.filter(s => s !== scope));
    } else {
      setSelectedScopes(prev => [...prev, scope]);
    }
  };

  // Candidate Personnel Filter
  const filteredCandidates = INITIAL_CANDIDATE_USERS.filter(user => {
    if (!searchKeyword.trim()) return true;
    if (searchField === '姓名') {
      return user.name.includes(searchKeyword.trim());
    } else if (searchField === '手机号') {
      return user.phone.includes(searchKeyword.trim());
    } else {
      return user.nickname.includes(searchKeyword.trim());
    }
  });

  const handleSaveSelectedPersonnel = () => {
    const chosen = INITIAL_CANDIDATE_USERS.filter(u =>
      selectedCandidateIds.includes(u.id)
    );
    // Merge avoid duplicate
    setRecipients(prev => {
      const existingIds = prev.map(r => r.id);
      const toAdd = chosen.filter(c => !existingIds.includes(c.id));
      return [...prev, ...toAdd];
    });
    setIsUserModalOpen(false);
  };

  const handleRemoveRecipient = (id: number) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="bg-white border border-[#e8e8e8] rounded-sm p-4 shadow-2xs flex flex-col min-h-[560px]">
      {/* Top Title & Info & Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8] mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
          <span className="text-xs font-bold text-gray-800">预警策略配置</span>
          <span className="text-xs text-gray-500 flex items-center ml-2">
            <i className="fa-solid fa-circle-info mr-1 text-[#1677ff]"></i> 可以针对不同的客户配置不同的预警策略
          </span>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="px-3.5 py-1.5 bg-white border border-[#1677ff] text-[#1677ff] hover:bg-blue-50 text-xs rounded-xs flex items-center cursor-pointer transition-colors shadow-2xs font-medium"
        >
          <i className="fa-solid fa-plus mr-1.5"></i> 新增策略
        </button>
      </div>

      {/* Main Table */}
      <div className="border border-[#e8e8e8] rounded-sm overflow-hidden flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-4 py-2.5 font-medium w-14 text-center">序号</th>
                <th className="px-4 py-2.5 font-medium min-w-[140px]">策略名称</th>
                <th className="px-4 py-2.5 font-medium min-w-[200px]">预警范围</th>
                <th className="px-4 py-2.5 font-medium min-w-[120px]">预警日期</th>
                <th className="px-4 py-2.5 font-medium min-w-[90px] text-center">预警人数</th>
                <th className="px-4 py-2.5 font-medium min-w-[80px] text-center">状态</th>
                <th className="px-4 py-2.5 font-medium min-w-[100px]">操作人</th>
                <th className="px-4 py-2.5 font-medium min-w-[140px]">操作时间</th>
                <th className="px-4 py-2.5 font-medium w-24 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {policies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-28 text-center bg-white">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-3xl border border-dashed border-gray-200">
                        <i className="fa-regular fa-folder-open text-gray-400"></i>
                      </div>
                      <span className="text-xs text-gray-500 font-normal">暂无策略配置项</span>
                    </div>
                  </td>
                </tr>
              ) : (
                policies.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-500 font-mono">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {p.scope.slice(0, 2).map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-blue-50 text-[#1677ff] rounded-xs text-[10px]">
                            {s}
                          </span>
                        ))}
                        {p.scope.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-xs text-[10px]">
                            +{p.scope.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-[11px]">
                      {p.days.length === 7 ? '每日 (周一至周日)' : p.days.join(', ')}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-gray-700">
                      {p.recipients.length} 人
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                          p.status ? 'bg-[#1677ff]' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                            p.status ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        ></div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.operator}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{p.operateTime}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEditPolicy(p)}
                        className="text-[#1677ff] hover:underline cursor-pointer"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(p.id)}
                        className="text-red-500 hover:underline cursor-pointer"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-end px-4 py-3 border-t border-[#e8e8e8] bg-white text-xs text-gray-600 space-x-3 select-none">
          <span>共 {policies.length} 条</span>
          <button className="px-2 py-1 border border-[#d9d9d9] rounded hover:bg-gray-50 cursor-pointer disabled:opacity-40" disabled>
            &lt;
          </button>
          <span className="px-2.5 py-1 bg-[#1677ff] text-white rounded font-mono font-medium">1</span>
          <button className="px-2 py-1 border border-[#d9d9d9] rounded hover:bg-gray-50 cursor-pointer disabled:opacity-40" disabled>
            &gt;
          </button>
          <select className="border border-[#d9d9d9] rounded px-1.5 py-1 text-xs outline-none bg-white">
            <option value="10">10条/页</option>
            <option value="20">20条/页</option>
            <option value="50">50条/页</option>
          </select>
          <span className="flex items-center space-x-1">
            <span>前往</span>
            <input type="text" defaultValue="1" className="w-8 text-center border border-[#d9d9d9] rounded py-0.5" />
            <span>页</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Primary Modal: Add/Edit Strategy (图2: 错误表述预警11策略) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-[#e8e8e8] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
              <h2 className="text-sm font-bold text-gray-800">
                {editingPolicyId ? '编辑预警策略' : '错误表述预警策略'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Row 1: 策略名称 & 预警范围 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 策略名称 */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">
                    <span className="text-red-500 mr-1">*</span>策略名称
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={50}
                      className="w-full border border-[#d9d9d9] rounded px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#1677ff] pr-14"
                      placeholder="请输入策略名称"
                      value={policyName}
                      onChange={e => setPolicyName(e.target.value)}
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] text-gray-400 font-mono">
                      {policyName.length} / 50
                    </span>
                  </div>
                </div>

                {/* 预警范围 */}
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-1.5">
                    <span className="text-red-500 mr-1">*</span>预警范围
                  </label>
                  <div
                    onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                    className="w-full border border-[#d9d9d9] rounded px-2.5 py-1.5 min-h-[34px] flex items-center justify-between cursor-pointer hover:border-[#1677ff] bg-white"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[280px]">
                      {selectedScopes.length === 0 ? (
                        <span className="text-gray-400 text-xs">请选择预警范围</span>
                      ) : (
                        <>
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded-xs text-[11px]">
                            {selectedScopes[0]}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleScope(selectedScopes[0]);
                              }}
                              className="ml-1 text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </span>
                          </span>
                          {selectedScopes.length > 1 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-xs text-[11px]">
                              + {selectedScopes.length - 1}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <i className={`fa-solid fa-angle-down text-gray-400 text-xs transition-transform ${isScopeDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </div>

                  {/* Dropdown Options */}
                  {isScopeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e8e8e8] rounded shadow-lg z-20 max-h-48 overflow-y-auto p-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        {ERROR_SCOPE_OPTIONS.map(opt => (
                          <label
                            key={opt}
                            className="flex items-center space-x-1.5 p-1 rounded hover:bg-gray-50 cursor-pointer select-none text-[11px]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedScopes.includes(opt)}
                              onChange={() => handleToggleScope(opt)}
                              className="rounded text-[#1677ff] focus:ring-[#1677ff]"
                            />
                            <span className="text-gray-700 truncate">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: 接收日期 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">
                  <span className="text-red-500 mr-1">*</span>接收日期
                </label>
                <div className="flex items-center space-x-4 pt-0.5">
                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAllDaysSelected}
                      onChange={handleToggleAllDays}
                      className="rounded text-[#1677ff] focus:ring-[#1677ff]"
                    />
                    <span className="text-gray-700 font-medium">全选</span>
                  </label>
                  {WEEKDAYS.map(w => (
                    <label key={w.key} className="flex items-center space-x-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(w.key)}
                        onChange={() => handleToggleDay(w.key)}
                        className="rounded text-[#1677ff] focus:ring-[#1677ff]"
                      />
                      <span className="text-gray-700">{w.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 3: 接收时段 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">
                  <span className="text-red-500 mr-1">*</span>接收时段
                </label>
                <div className="inline-flex items-center border border-[#d9d9d9] rounded px-3 py-1.5 bg-white space-x-2">
                  <input
                    type="text"
                    className="w-20 text-center font-mono outline-none text-gray-700 text-xs"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                  <span className="text-gray-400">至</span>
                  <input
                    type="text"
                    className="w-20 text-center font-mono outline-none text-gray-700 text-xs"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                  />
                  <i className="fa-regular fa-clock text-gray-400 pl-1 border-l border-gray-200"></i>
                </div>
              </div>

              {/* Row 4: 预警接收人 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-medium">
                    <span className="text-red-500 mr-1">*</span>预警接收人
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidateIds([]);
                      setIsUserModalOpen(true);
                    }}
                    className="px-3 py-1 border border-[#1677ff] text-[#1677ff] hover:bg-blue-50 rounded-xs text-xs flex items-center cursor-pointer transition-colors"
                  >
                    <i className="fa-solid fa-plus mr-1"></i> 添加
                  </button>
                </div>

                {/* Recipients Inner Table */}
                <div className="border border-[#e8e8e8] rounded-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8]">
                      <tr>
                        <th className="px-3 py-2 font-medium w-12 text-center">序号</th>
                        <th className="px-3 py-2 font-medium">微信头像/昵称</th>
                        <th className="px-3 py-2 font-medium">姓名</th>
                        <th className="px-3 py-2 font-medium">手机号</th>
                        <th className="px-3 py-2 font-medium text-center">关注公众号</th>
                        <th className="px-3 py-2 font-medium">绑定时间</th>
                        <th className="px-3 py-2 font-medium w-16 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recipients.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center bg-white">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-xl border border-dashed border-gray-200">
                                <i className="fa-regular fa-folder-open text-gray-400"></i>
                              </div>
                              <span className="text-xs text-gray-400 font-normal">抱歉！ 暂无数据</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        recipients.map((rec, rIdx) => (
                          <tr key={rec.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-center text-gray-500 font-mono">{rIdx + 1}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={rec.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60'}
                                  alt={rec.nickname}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-gray-800">{rec.nickname}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-gray-700">{rec.name}</td>
                            <td className="px-3 py-2 font-mono text-gray-600">{rec.phone}</td>
                            <td className="px-3 py-2 text-center">
                              <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px]">
                                已关注
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-gray-500 text-[11px]">{rec.bindTime}</td>
                            <td className="px-3 py-2 text-center">
                              <button
                                onClick={() => handleRemoveRecipient(rec.id)}
                                className="text-red-500 hover:underline cursor-pointer"
                              >
                                移除
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* Table Footer Pagination */}
                  <div className="px-3 py-2 border-t border-[#e8e8e8] bg-white flex items-center justify-end text-[11px] text-gray-500 space-x-2">
                    <span>共 {recipients.length} 条</span>
                    <button className="px-1.5 py-0.5 border border-gray-200 rounded disabled:opacity-40" disabled>&lt;</button>
                    <span className="px-2 py-0.5 bg-[#1677ff] text-white rounded font-mono">1</span>
                    <button className="px-1.5 py-0.5 border border-gray-200 rounded disabled:opacity-40" disabled>&gt;</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 px-6 py-3 border-t border-[#e8e8e8] bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-1.5 border border-[#d9d9d9] text-gray-600 hover:bg-gray-50 rounded-xs text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSavePolicy}
                className="px-5 py-1.5 bg-[#1677ff] text-white hover:bg-blue-600 rounded-xs text-xs cursor-pointer font-medium shadow-2xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Secondary Modal: Add Personnel (图3: 新增人员) */}
      {/* ========================================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/45 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-[#e8e8e8] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e8e8e8]">
              <h3 className="text-xs font-bold text-gray-800">新增人员</h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Filter Bar */}
            <div className="p-4 border-b border-[#e8e8e8] flex items-center space-x-2 text-xs">
              <div className="flex items-center border border-[#d9d9d9] rounded overflow-hidden">
                <select
                  value={searchField}
                  onChange={e => setSearchField(e.target.value)}
                  className="bg-gray-50 border-r border-[#d9d9d9] px-2.5 py-1.5 text-xs text-gray-700 outline-none"
                >
                  <option value="姓名">姓名</option>
                  <option value="手机号">手机号</option>
                  <option value="微信昵称">微信昵称</option>
                </select>
                <input
                  type="text"
                  placeholder="请输入关键字进行搜索"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  className="px-3 py-1.5 text-xs outline-none w-56 text-gray-700"
                />
              </div>
              <button
                onClick={() => {}}
                className="px-4 py-1.5 bg-[#1677ff] text-white hover:bg-blue-600 rounded text-xs flex items-center cursor-pointer shadow-2xs font-medium"
              >
                <i className="fa-solid fa-magnifying-glass mr-1"></i> 查询
              </button>
            </div>

            {/* Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="border border-[#e8e8e8] rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8]">
                    <tr>
                      <th className="px-3 py-2.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredCandidates.length > 0 &&
                            filteredCandidates.every(c => selectedCandidateIds.includes(c.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCandidateIds(filteredCandidates.map(c => c.id));
                            } else {
                              setSelectedCandidateIds([]);
                            }
                          }}
                          className="rounded text-[#1677ff] focus:ring-[#1677ff]"
                        />
                      </th>
                      <th className="px-3 py-2.5 font-medium">微信头像/昵称</th>
                      <th className="px-3 py-2.5 font-medium">姓名</th>
                      <th className="px-3 py-2.5 font-medium">手机号</th>
                      <th className="px-3 py-2.5 font-medium text-center">关注公众号</th>
                      <th className="px-3 py-2.5 font-medium">绑定时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-14 text-center bg-white">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-2xl border border-dashed border-gray-200">
                              <i className="fa-regular fa-folder-open text-gray-400"></i>
                            </div>
                            <span className="text-xs text-gray-400 font-normal">暂无可用绑定公众号人员</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCandidates.map(cand => {
                        const isChecked = selectedCandidateIds.includes(cand.id);
                        return (
                          <tr
                            key={cand.id}
                            onClick={() => {
                              if (isChecked) {
                                setSelectedCandidateIds(prev => prev.filter(id => id !== cand.id));
                              } else {
                                setSelectedCandidateIds(prev => [...prev, cand.id]);
                              }
                            }}
                            className={`cursor-pointer transition-colors ${isChecked ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                          >
                            <td className="px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCandidateIds(prev => [...prev, cand.id]);
                                  } else {
                                    setSelectedCandidateIds(prev => prev.filter(id => id !== cand.id));
                                  }
                                }}
                                className="rounded text-[#1677ff] focus:ring-[#1677ff]"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={cand.avatar}
                                  alt={cand.nickname}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-gray-800">{cand.nickname}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-800">{cand.name}</td>
                            <td className="px-3 py-2 font-mono text-gray-600">{cand.phone}</td>
                            <td className="px-3 py-2 text-center">
                              <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px]">
                                已关注
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-gray-500 text-[11px]">{cand.bindTime}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              <div className="flex items-center justify-end mt-3 text-xs text-gray-500 space-x-3 select-none">
                <span>共 {filteredCandidates.length} 条</span>
                <button className="px-2 py-1 border border-gray-200 rounded disabled:opacity-40" disabled>&lt;</button>
                <span className="px-2.5 py-1 bg-[#1677ff] text-white rounded font-mono">1</span>
                <button className="px-2 py-1 border border-gray-200 rounded disabled:opacity-40" disabled>&gt;</button>
                <select className="border border-gray-200 rounded px-1.5 py-1 text-xs outline-none bg-white">
                  <option value="100">100条/页</option>
                  <option value="50">50条/页</option>
                  <option value="20">20条/页</option>
                </select>
                <span className="flex items-center space-x-1">
                  <span>前往</span>
                  <input type="text" defaultValue="1" className="w-8 text-center border border-gray-200 rounded py-0.5" />
                  <span>页</span>
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 px-5 py-3 border-t border-[#e8e8e8] bg-white">
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="px-5 py-1.5 border border-[#d9d9d9] text-gray-600 hover:bg-gray-50 rounded-xs text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveSelectedPersonnel}
                className="px-5 py-1.5 bg-[#1677ff] text-white hover:bg-blue-600 rounded-xs text-xs cursor-pointer font-medium shadow-2xs"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
