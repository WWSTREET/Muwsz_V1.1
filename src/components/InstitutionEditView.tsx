import React, { useState } from 'react';
import { Institution } from '../types';
import { regionsList } from '../data/mockData';

interface MemberItem {
  id: number;
  avatar: string;
  nickname: string;
  name: string;
  phone: string;
  officialAccounts: string;
  bindTime: string;
  lastLoginTime: string;
}

const initialMembers: MemberItem[] = [
  {
    id: 1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    nickname: '寓辰',
    name: '刘明',
    phone: '',
    officialAccounts: '陕西康奈网络',
    bindTime: '2022-06-02 15:43:51',
    lastLoginTime: '-'
  },
  {
    id: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    nickname: 'S mile、',
    name: '张思思',
    phone: '',
    officialAccounts: '康奈网络、陕西康奈网络',
    bindTime: '2024-11-07 16:39:08',
    lastLoginTime: '-'
  },
  {
    id: 3,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80',
    nickname: '柯昌万',
    name: '柯主任',
    phone: '',
    officialAccounts: '陕西康奈网络',
    bindTime: '2022-07-09 19:42:00',
    lastLoginTime: '-'
  },
  {
    id: 4,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
    nickname: 'Minor宛',
    name: '贾宛芝',
    phone: '',
    officialAccounts: '康奈网络、陕西康奈网络',
    bindTime: '2022-09-21 10:30:56',
    lastLoginTime: '-'
  },
  {
    id: 5,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
    nickname: '不加糖的NaOH',
    name: '贺莉娜',
    phone: '18710791109',
    officialAccounts: '陕西康奈网络',
    bindTime: '2023-05-09 15:36:36',
    lastLoginTime: '-'
  }
];

const categoryOptions = [
  '一类: 网信部门',
  '一类: 党委部门',
  '二类: 融媒体中心',
  '二类: 政府部门',
  '三类: 事业单位',
  '四类: 国有企业',
  '四类: 民营企业',
  '五类: 其他机构'
];

interface InstitutionEditViewProps {
  mode?: 'add' | 'edit';
  institution?: Institution | null;
  onCancel: () => void;
  onConfirm: (data: Partial<Institution>) => void;
}

export const InstitutionEditView: React.FC<InstitutionEditViewProps> = ({
  mode = 'edit',
  institution,
  onCancel,
  onConfirm
}) => {
  const isAddMode = mode === 'add';

  // Derive initial values
  const defaultName = institution ? institution.name : '';
  const defaultShortName = institution 
    ? (institution.name.includes('陕西省委') 
        ? '陕西省委网信办' 
        : institution.name.replace(/中共|网络安全和信息化委员会办公室|委员会|中心/g, '').trim() || '省委网信办')
    : '';

  const defaultCategoryType = institution 
    ? `${institution.category || '一类'}: ${institution.type || '网信部门'}`
    : '一类: 网信部门';

  // Form states
  const [formData, setFormData] = useState({
    name: defaultName,
    shortName: defaultShortName,
    categoryType: defaultCategoryType,
    region: institution?.region || '陕西',
    salesName: institution?.salesName || '夏小花',
    salesPhone: institution?.salesPhone || '136****1626',
    systemName: '',
    status: institution?.status || 'trial',
    endDate: institution?.endDate || '2026-11-30'
  });

  const [nameError, setNameError] = useState(false);

  // Permissions state
  const [permissions, setPermissions] = useState({
    ledger: {
      enabled: true,
      status: 'trial',
      endDate: institution?.endDate || '2026-11-30'
    },
    error: {
      enabled: true,
      status: 'trial',
      endDate: institution?.endDate || '2026-11-30'
    },
    action: {
      enabled: true,
      status: 'trial',
      endDate: institution?.endDate || '2026-11-30'
    }
  });

  const [members, setMembers] = useState<MemberItem[]>(initialMembers);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [qrModalUser, setQrModalUser] = useState<MemberItem | null>(null);

  const handleTogglePermission = (key: 'ledger' | 'error' | 'action') => {
    setPermissions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled
      }
    }));
  };

  const handlePermissionStatusChange = (key: 'ledger' | 'error' | 'action', val: string) => {
    setPermissions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: val
      }
    }));
  };

  const handlePermissionDateChange = (key: 'ledger' | 'error' | 'action', date: string) => {
    setPermissions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        endDate: date
      }
    }));
  };

  const handleSyncMT = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast('从MT同步人员成功，已更新最新成员数据！');
      setTimeout(() => setSyncToast(null), 3000);
    }, 800);
  };

  const handleRefreshMember = (id: number) => {
    setSyncToast(`成员序号 ${id} 状态已刷新`);
    setTimeout(() => setSyncToast(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAddMode && !formData.name.trim()) {
      setNameError(true);
      setSyncToast('请输入机构名称');
      setTimeout(() => setSyncToast(null), 2500);
      return;
    }

    // Parse category and type
    let cat = '一类';
    let typ = '网信部门';
    if (formData.categoryType.includes(':')) {
      const parts = formData.categoryType.split(':');
      cat = parts[0].trim();
      typ = parts[1].trim();
    } else if (formData.categoryType.includes('：')) {
      const parts = formData.categoryType.split('：');
      cat = parts[0].trim();
      typ = parts[1].trim();
    }

    onConfirm({
      name: formData.name.trim() || (isAddMode ? '新创建机构' : institution?.name),
      region: formData.region,
      category: cat,
      type: typ,
      salesName: formData.salesName,
      salesPhone: formData.salesPhone,
      status: formData.status as 'official' | 'trial' | 'expired' | 'closed',
      endDate: formData.endDate,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col space-y-7">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f0]">
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-[#1677ff] cursor-pointer text-sm bg-transparent border-none p-0 flex items-center transition-colors mr-1"
            title="返回"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">
            {isAddMode ? '新增机构' : '编辑机构'}
          </h1>
        </div>
        <div className="flex items-center space-x-2.5">
          <button 
            type="button"
            onClick={onCancel}
            className="bg-white border border-[#d9d9d9] hover:border-gray-400 text-gray-700 text-xs px-4 py-1.5 rounded transition-colors cursor-pointer"
          >
            取消
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="bg-[#1677ff] hover:bg-blue-600 text-white text-xs px-5 py-1.5 rounded transition-colors cursor-pointer font-medium shadow-xs"
          >
            确认
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {syncToast && (
        <div className="bg-[#e6f4ff] border border-[#91caff] text-[#1677ff] text-xs px-4 py-2 rounded flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-circle-info text-sm"></i>
            <span>{syncToast}</span>
          </div>
          <button 
            onClick={() => setSyncToast(null)} 
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Section 1: 服务信息 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-1.5">
          <div className="w-1 h-3.5 bg-[#1677ff]"></div>
          <h2 className="text-xs font-bold text-gray-800">服务信息</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-xs pl-2.5">
          {/* Row 1 */}
          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">
              <span className="text-red-500 mr-0.5">*</span>机构名称
            </label>
            {isAddMode ? (
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (nameError) setNameError(false);
                }}
                placeholder="请输入机构名称"
                className={`flex-1 bg-white text-gray-800 border ${nameError ? 'border-red-500' : 'border-[#d9d9d9]'} rounded px-2.5 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:border-[#1677ff]`}
              />
            ) : (
              <input 
                type="text" 
                value={formData.name} 
                disabled
                className="flex-1 bg-[#f5f5f5] text-gray-600 border border-[#d9d9d9] rounded px-2.5 py-1.5 cursor-not-allowed text-xs focus:outline-none"
              />
            )}
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">机构简称</label>
            {isAddMode ? (
              <input 
                type="text" 
                value={formData.shortName} 
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="请输入机构简称"
                className="flex-1 bg-white text-gray-800 border border-[#d9d9d9] rounded px-2.5 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:border-[#1677ff]"
              />
            ) : (
              <input 
                type="text" 
                value={formData.shortName} 
                disabled
                className="flex-1 bg-[#f5f5f5] text-gray-600 border border-[#d9d9d9] rounded px-2.5 py-1.5 cursor-not-allowed text-xs focus:outline-none"
              />
            )}
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">机构类别</label>
            {isAddMode ? (
              <div className="flex-1 relative">
                <select 
                  value={formData.categoryType}
                  onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}
                  className="w-full bg-white border border-[#d9d9d9] rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] appearance-none pr-8 cursor-pointer"
                >
                  {categoryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
              </div>
            ) : (
              <input 
                type="text" 
                value={formData.categoryType} 
                disabled
                className="flex-1 bg-[#f5f5f5] text-gray-600 border border-[#d9d9d9] rounded px-2.5 py-1.5 cursor-not-allowed text-xs focus:outline-none"
              />
            )}
          </div>

          {/* Row 2 */}
          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">
              <span className="text-red-500 mr-0.5">*</span>所在地区
            </label>
            <div className="flex-1 relative">
              <select 
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-white border border-[#d9d9d9] rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] appearance-none pr-8 cursor-pointer"
              >
                {regionsList.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">销售人员</label>
            {isAddMode ? (
              <input 
                type="text" 
                value={formData.salesName} 
                onChange={(e) => setFormData({ ...formData, salesName: e.target.value })}
                placeholder="请输入销售人员"
                className="flex-1 bg-white text-gray-800 border border-[#d9d9d9] rounded px-2.5 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:border-[#1677ff]"
              />
            ) : (
              <input 
                type="text" 
                value={formData.salesName} 
                disabled
                className="flex-1 bg-[#f5f5f5] text-gray-600 border border-[#d9d9d9] rounded px-2.5 py-1.5 cursor-not-allowed text-xs focus:outline-none"
              />
            )}
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">销售电话</label>
            {isAddMode ? (
              <input 
                type="text" 
                value={formData.salesPhone} 
                onChange={(e) => setFormData({ ...formData, salesPhone: e.target.value })}
                placeholder="请输入销售电话"
                className="flex-1 bg-white text-gray-800 border border-[#d9d9d9] rounded px-2.5 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:border-[#1677ff] font-mono"
              />
            ) : (
              <input 
                type="text" 
                value={formData.salesPhone} 
                disabled
                className="flex-1 bg-[#f5f5f5] text-gray-600 border border-[#d9d9d9] rounded px-2.5 py-1.5 cursor-not-allowed text-xs focus:outline-none font-mono"
              />
            )}
          </div>

          {/* Row 3 */}
          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">系统名称</label>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={formData.systemName}
                maxLength={50}
                onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                placeholder="客户端系统名称，不填默认为机构简称"
                className="w-full bg-white border border-[#d9d9d9] rounded px-2.5 py-1.5 pr-12 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1677ff]"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                {formData.systemName.length} / 50
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">
              <span className="text-red-500 mr-0.5">*</span>机构类型
            </label>
            <div className="flex-1 relative">
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'official' | 'trial' | 'expired' | 'closed' })}
                className="w-full bg-white border border-[#d9d9d9] rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] appearance-none pr-8 cursor-pointer"
              >
                <option value="trial">试用</option>
                <option value="official">正式</option>
                <option value="expired">已过期</option>
                <option value="closed">已关闭</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 w-20 shrink-0">
              <span className="text-red-500 mr-0.5">*</span>到期时间
            </label>
            <div className="flex-1 relative">
              <input 
                type="date" 
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-white border border-[#d9d9d9] rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] font-mono cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: 权限配置 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-1.5">
          <div className="w-1 h-3.5 bg-[#1677ff]"></div>
          <h2 className="text-xs font-bold text-gray-800">权限配置</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pl-2.5">
          {/* Card 1: 属地台账管理 */}
          <div className="border border-[#d9e8ff] rounded-lg p-5 bg-[#fbfdff] flex flex-col justify-between hover:border-[#1677ff] transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-base text-[#1677ff]">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                  <span className="font-bold text-xs text-[#1677ff]">属地台账管理</span>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => handleTogglePermission('ledger')}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors text-[11px] font-normal ${
                    permissions.ledger.enabled ? 'bg-[#1677ff] justify-end pr-1.5 text-white' : 'bg-gray-300 justify-start pl-1.5 text-gray-600'
                  }`}
                >
                  {permissions.ledger.enabled ? (
                    <>
                      <span className="mr-1.5 text-[10px]">开</span>
                      <span className="bg-white w-4 h-4 rounded-full shadow-sm"></span>
                    </>
                  ) : (
                    <>
                      <span className="bg-white w-4 h-4 rounded-full shadow-sm"></span>
                      <span className="ml-1.5 text-[10px]">关</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                允许该机构客户在V8客户端使用台账管理模块
              </p>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div className="flex items-center">
                <span className="text-gray-700 w-16 shrink-0">开通状态</span>
                <div className="flex-1 relative">
                  <select 
                    value={permissions.ledger.status}
                    onChange={(e) => handlePermissionStatusChange('ledger', e.target.value)}
                    disabled={!permissions.ledger.enabled}
                    className="w-full bg-white border border-[#d9d9d9] rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] appearance-none pr-6 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="trial">试用</option>
                    <option value="official">正式</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 w-16 shrink-0">到期时间</span>
                <div className="flex-1 relative">
                  <input 
                    type="date"
                    value={permissions.ledger.endDate}
                    onChange={(e) => handlePermissionDateChange('ledger', e.target.value)}
                    disabled={!permissions.ledger.enabled}
                    className="w-full bg-white border border-[#d9d9d9] rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] font-mono cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 错误表述管理 */}
          <div className="border border-[#d9e8ff] rounded-lg p-5 bg-[#fbfdff] flex flex-col justify-between hover:border-[#1677ff] transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-base text-[#fa541c]">
                    <i className="fa-solid fa-clipboard-list"></i>
                  </span>
                  <span className="font-bold text-xs text-[#1677ff]">错误表述管理</span>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => handleTogglePermission('error')}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors text-[11px] font-normal ${
                    permissions.error.enabled ? 'bg-[#1677ff] justify-end pr-1.5 text-white' : 'bg-gray-300 justify-start pl-1.5 text-gray-600'
                  }`}
                >
                  {permissions.error.enabled ? (
                    <>
                      <span className="mr-1.5 text-[10px]">开</span>
                      <span className="bg-white w-4 h-4 rounded-full shadow-sm"></span>
                    </>
                  ) : (
                    <>
                      <span className="bg-white w-4 h-4 rounded-full shadow-sm"></span>
                      <span className="ml-1.5 text-[10px]">关</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                允许该机构客户在V8客户端使用错误表述管理模块
              </p>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div className="flex items-center">
                <span className="text-gray-700 w-16 shrink-0">开通状态</span>
                <div className="flex-1 relative">
                  <select 
                    value={permissions.error.status}
                    onChange={(e) => handlePermissionStatusChange('error', e.target.value)}
                    disabled={!permissions.error.enabled}
                    className="w-full bg-white border border-[#d9d9d9] rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] appearance-none pr-6 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="trial">试用</option>
                    <option value="official">正式</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 w-16 shrink-0">到期时间</span>
                <div className="flex-1 relative">
                  <input 
                    type="date"
                    value={permissions.error.endDate}
                    onChange={(e) => handlePermissionDateChange('error', e.target.value)}
                    disabled={!permissions.error.enabled}
                    className="w-full bg-white border border-[#d9d9d9] rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] font-mono cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 专项行动管理 */}
          <div className="border border-[#d9e8ff] rounded-lg p-5 bg-[#fbfdff] flex flex-col justify-between hover:border-[#1677ff] transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-base text-[#52c41a]">
                    <i className="fa-solid fa-shield-halved"></i>
                  </span>
                  <span className="font-bold text-xs text-[#1677ff]">专项行动管理</span>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => handleTogglePermission('action')}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors text-[11px] font-normal ${
                    permissions.action.enabled ? 'bg-[#1677ff] justify-end pr-1.5 text-white' : 'bg-gray-300 justify-start pl-1.5 text-gray-600'
                  }`}
                >
                  {permissions.action.enabled ? (
                    <>
                      <span className="mr-1.5 text-[10px]">开</span>
                      <span className="bg-white w-4 h-4 rounded-full shadow-sm"></span>
                    </>
                  ) : (
                    <>
                      <span className="bg-white w-4 h-4 rounded-full shadow-sm"></span>
                      <span className="ml-1.5 text-[10px]">关</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                允许该机构客户在V8客户端使用专项行动管
              </p>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div className="flex items-center">
                <span className="text-gray-700 w-16 shrink-0">开通状态</span>
                <div className="flex-1 relative">
                  <select 
                    value={permissions.action.status}
                    onChange={(e) => handlePermissionStatusChange('action', e.target.value)}
                    disabled={!permissions.action.enabled}
                    className="w-full bg-white border border-[#d9d9d9] rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] appearance-none pr-6 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="trial">试用</option>
                    <option value="official">正式</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 w-16 shrink-0">到期时间</span>
                <div className="flex-1 relative">
                  <input 
                    type="date"
                    value={permissions.action.endDate}
                    onChange={(e) => handlePermissionDateChange('action', e.target.value)}
                    disabled={!permissions.action.enabled}
                    className="w-full bg-white border border-[#d9d9d9] rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-[#1677ff] font-mono cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: 人员管理 */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="w-1 h-3.5 bg-[#1677ff]"></div>
            <h2 className="text-xs font-bold text-gray-800">人员管理</h2>
          </div>
          <button
            type="button"
            onClick={handleSyncMT}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-[#1677ff] text-[#1677ff] rounded text-xs hover:bg-[#e6f4ff] transition-colors cursor-pointer bg-white"
          >
            <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin' : ''}`}></i>
            <span>从MT同步人员</span>
          </button>
        </div>

        <div className="overflow-x-auto pl-2.5">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead className="bg-[#f2f4f8] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-4 py-3 font-normal w-14 text-center">序号</th>
                <th className="px-4 py-3 font-normal w-52">微信头像/昵称</th>
                <th className="px-4 py-3 font-normal w-36">姓名</th>
                <th className="px-4 py-3 font-normal w-40">手机号</th>
                <th className="px-4 py-3 font-normal">关注公众号</th>
                <th className="px-4 py-3 font-normal w-48">绑定时间</th>
                <th className="px-4 py-3 font-normal w-36">最后登录时间</th>
                <th className="px-4 py-3 font-normal w-28 text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5 text-center text-gray-500">{member.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2.5">
                      <img 
                        src={member.avatar} 
                        alt={member.nickname} 
                        className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-gray-800 truncate max-w-[140px]">{member.nickname}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-800">{member.name}</td>
                  <td className="px-4 py-3.5 text-gray-600 font-mono">{member.phone || ''}</td>
                  <td className="px-4 py-3.5 text-gray-600">{member.officialAccounts}</td>
                  <td className="px-4 py-3.5 text-gray-600 font-mono">{member.bindTime}</td>
                  <td className="px-4 py-3.5 text-gray-400">{member.lastLoginTime}</td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        type="button"
                        onClick={() => setQrModalUser(member)}
                        className="text-gray-700 hover:text-[#1677ff] p-1 rounded transition-colors cursor-pointer bg-transparent border-none inline-flex items-center justify-center"
                        title="查看绑定二维码"
                      >
                        <i className="fa-solid fa-qrcode text-base"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRefreshMember(member.id)}
                        className="text-[#1677ff] hover:text-blue-700 cursor-pointer text-xs transition-colors"
                      >
                        刷新
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal for WeChat Binding */}
      {qrModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <h3 className="text-sm font-bold text-gray-800 mb-2">微信绑定二维码</h3>
            <p className="text-xs text-gray-500 mb-4">用户：{qrModalUser.name} ({qrModalUser.nickname})</p>
            <div className="p-3 bg-white border border-gray-200 rounded-md shadow-xs mb-4">
              <div className="w-44 h-44 bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 rounded">
                <i className="fa-solid fa-qrcode text-7xl text-gray-700"></i>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mb-4 text-center">
              使用微信扫描二维码可完成账号关联与通知接收
            </p>
            <button
              type="button"
              onClick={() => setQrModalUser(null)}
              className="w-full py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white text-xs rounded transition-colors cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
