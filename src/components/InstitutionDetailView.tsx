import React, { useState } from 'react';
import { Institution } from '../types';

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

const mockMembers: MemberItem[] = [
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

interface InstitutionDetailViewProps {
  institution: Institution;
  onBack: () => void;
  onEdit: (institution: Institution) => void;
}

export const InstitutionDetailView: React.FC<InstitutionDetailViewProps> = ({
  institution,
  onBack,
  onEdit
}) => {
  // Permission toggles state
  const [permissions, setPermissions] = useState({
    ledger: true,
    error: true,
    action: true
  });

  const [qrModalUser, setQrModalUser] = useState<MemberItem | null>(null);

  const togglePermission = (key: 'ledger' | 'error' | 'action') => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Derive short name
  const shortName = institution.name.includes('陕西省委') 
    ? '陕西省委网信办' 
    : institution.name.replace(/中共|网络安全和信息化委员会办公室|委员会|中心/g, '').trim() || '省委网信办';

  const categoryTypeDisplay = `${institution.category || '一类'}: ${institution.type || '网信部门'}`;
  const salesName = institution.salesName || '夏小花';
  const salesPhone = institution.salesPhone || '136****1626';
  const daysRemaining = institution.daysRemaining || 105;
  const endDate = institution.endDate || '2026-11-30';
  const isTrial = institution.status === 'trial' || institution.status === undefined;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col space-y-7">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f0]">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onBack}
            className="text-gray-600 hover:text-[#1677ff] cursor-pointer text-sm bg-transparent border-none p-0 flex items-center transition-colors mr-1"
            title="返回机构列表"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">机构详情</h1>
        </div>
        <button 
          onClick={() => onEdit(institution)}
          className="bg-[#1677ff] hover:bg-blue-600 text-white text-xs px-5 py-1.5 rounded transition-colors cursor-pointer font-normal shadow-xs"
        >
          编辑
        </button>
      </div>

      {/* Section 1: 基本信息 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-1.5">
          <div className="w-1 h-3.5 bg-[#1677ff]"></div>
          <h2 className="text-xs font-bold text-gray-800">基本信息</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-xs pl-2.5">
          {/* Row 1 */}
          <div className="flex items-start">
            <span className="text-gray-600 w-18 shrink-0">机构名称</span>
            <span className="text-gray-900 font-normal break-all">{institution.name}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 w-18 shrink-0">机构简称</span>
            <span className="text-gray-900">{shortName}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 w-18 shrink-0">机构类别</span>
            <span className="text-gray-900">{categoryTypeDisplay}</span>
          </div>

          {/* Row 2 */}
          <div className="flex items-center">
            <span className="text-gray-600 w-18 shrink-0">所在地区</span>
            <span className="text-gray-900">{institution.region || '陕西'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 w-18 shrink-0">销售人员</span>
            <span className="text-gray-900">{salesName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 w-18 shrink-0">销售电话</span>
            <span className="text-gray-900 font-mono">{salesPhone}</span>
          </div>

          {/* Row 3 */}
          <div className="flex items-center">
            <span className="text-gray-600 w-18 shrink-0">系统名称</span>
            <span className="text-gray-400">-</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 w-18 shrink-0">机构类型</span>
            <div>
              {isTrial ? (
                <span className="border border-[#d46b08] text-[#d46b08] bg-[#fff7e6] text-[11px] px-2 py-0.5 rounded-sm">
                  试用
                </span>
              ) : (
                <span className="border border-[#1677ff] text-[#1677ff] bg-[#e6f4ff] text-[11px] px-2 py-0.5 rounded-sm">
                  正式
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 w-18 shrink-0">到期时间</span>
            <span className="text-gray-900 font-mono">{endDate}</span>
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
                {/* Switch Toggle with '开' */}
                <button
                  type="button"
                  onClick={() => togglePermission('ledger')}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors text-[11px] font-normal ${
                    permissions.ledger ? 'bg-[#1677ff] justify-end pr-1.5 text-white' : 'bg-gray-300 justify-start pl-1.5 text-gray-600'
                  }`}
                >
                  {permissions.ledger ? (
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

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 w-16">开通状态</span>
                <div className="flex items-center space-x-2">
                  <span className="border border-[#ffd591] text-[#d46b08] bg-[#fffbe6] text-[11px] px-2 py-0.5 rounded-sm">
                    {isTrial ? '试用' : '正式'}
                  </span>
                  <span className="border border-[#ffd591] text-[#d46b08] bg-[#fffbe6] text-[11px] px-2 py-0.5 rounded-sm font-mono">
                    {daysRemaining}天
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 w-16">到期时间</span>
                <span className="text-gray-800 font-mono">{endDate}</span>
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
                {/* Switch Toggle with '开' */}
                <button
                  type="button"
                  onClick={() => togglePermission('error')}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors text-[11px] font-normal ${
                    permissions.error ? 'bg-[#1677ff] justify-end pr-1.5 text-white' : 'bg-gray-300 justify-start pl-1.5 text-gray-600'
                  }`}
                >
                  {permissions.error ? (
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

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 w-16">开通状态</span>
                <div className="flex items-center space-x-2">
                  <span className="border border-[#ffd591] text-[#d46b08] bg-[#fffbe6] text-[11px] px-2 py-0.5 rounded-sm">
                    {isTrial ? '试用' : '正式'}
                  </span>
                  <span className="border border-[#ffd591] text-[#d46b08] bg-[#fffbe6] text-[11px] px-2 py-0.5 rounded-sm font-mono">
                    {daysRemaining}天
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 w-16">到期时间</span>
                <span className="text-gray-800 font-mono">{endDate}</span>
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
                {/* Switch Toggle with '开' */}
                <button
                  type="button"
                  onClick={() => togglePermission('action')}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors text-[11px] font-normal ${
                    permissions.action ? 'bg-[#1677ff] justify-end pr-1.5 text-white' : 'bg-gray-300 justify-start pl-1.5 text-gray-600'
                  }`}
                >
                  {permissions.action ? (
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

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 w-16">开通状态</span>
                <div className="flex items-center space-x-2">
                  <span className="border border-[#ffd591] text-[#d46b08] bg-[#fffbe6] text-[11px] px-2 py-0.5 rounded-sm">
                    {isTrial ? '试用' : '正式'}
                  </span>
                  <span className="border border-[#ffd591] text-[#d46b08] bg-[#fffbe6] text-[11px] px-2 py-0.5 rounded-sm font-mono">
                    {daysRemaining}天
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 w-16">到期时间</span>
                <span className="text-gray-800 font-mono">{endDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: 人员管理 */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-1.5">
          <div className="w-1 h-3.5 bg-[#1677ff]"></div>
          <h2 className="text-xs font-bold text-gray-800">人员管理</h2>
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
                <th className="px-4 py-3 font-normal w-20 text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {mockMembers.map((member) => (
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
                    <button 
                      onClick={() => setQrModalUser(member)}
                      className="text-gray-700 hover:text-[#1677ff] p-1 rounded transition-colors cursor-pointer bg-transparent border-none inline-flex items-center justify-center"
                      title="查看绑定二维码"
                    >
                      <i className="fa-solid fa-qrcode text-base"></i>
                    </button>
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

