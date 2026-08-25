import React, { useState } from 'react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    ledger: true,
    error: false,
    special: false,
    system: false
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-[170px] flex-shrink-0 bg-[#f0f5ff] flex flex-col border-r border-[#e8e8e8] select-none">
      {/* Logo Area */}
      <div className="h-[60px] flex items-center justify-center border-b border-[#e8e8e8] bg-[#e6f0ff]">
        <img 
          alt="康奈网络 Logo" 
          className="h-8 object-contain px-2" 
          src="/src/assets/images/logo_kangnai_1786845884423.jpg"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1">
          {/* Active Item: 机构管理 */}
          <li>
            <button
              onClick={() => onSelectView('institution_management')}
              className={`w-full text-left flex items-center px-4 py-2.5 transition-colors ${
                currentView === 'institution_management'
                  ? 'bg-[#e6f0ff] text-[#1677ff] border-r-2 border-[#1677ff] font-medium'
                  : 'text-[#333333] hover:bg-gray-100'
              }`}
            >
              <i className="fa-solid fa-building w-5 text-center mr-2"></i>
              <span className="text-xs">机构管理</span>
            </button>
          </li>

          {/* Group 1: 属地台账管理 */}
          <li className="mt-2">
            <div 
              onClick={() => toggleGroup('ledger')}
              className="flex items-center justify-between px-4 py-2 text-[#333333] hover:bg-gray-100 cursor-pointer text-xs"
            >
              <div className="flex items-center">
                <i className="fa-regular fa-folder-open w-5 text-center mr-2"></i>
                <span>属地台账管理</span>
              </div>
              <i className={`fa-solid fa-angle-down text-[10px] transition-transform ${openGroups.ledger ? 'rotate-180' : ''}`}></i>
            </div>
            {openGroups.ledger && (
              <ul className="pl-11 py-1 space-y-1 text-xs">
                <li>
                  <button 
                    onClick={() => onSelectView('local_institution')}
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${currentView === 'local_institution' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'}`}
                  >
                    属地机构
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Group 2: 错误表述管理 */}
          <li className="mt-1">
            <div 
              onClick={() => toggleGroup('error')}
              className="flex items-center justify-between px-4 py-2 text-[#333333] hover:bg-gray-100 cursor-pointer text-xs"
            >
              <div className="flex items-center">
                <i className="fa-regular fa-file-lines w-5 text-center mr-2"></i>
                <span>错误表述管理</span>
              </div>
              <i className={`fa-solid fa-angle-down text-[10px] transition-transform ${openGroups.error ? 'rotate-180' : ''}`}></i>
            </div>
            {openGroups.error && (
              <ul className="pl-11 py-1 space-y-1 text-xs">
                <li>
                  <button 
                    onClick={() => onSelectView('error_institution')} 
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${currentView === 'error_institution' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'}`}
                  >
                    错误表述机构
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onSelectView('error_data')} 
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${currentView === 'error_data' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'}`}
                  >
                    错误表述数据
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onSelectView('error_history')} 
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${currentView === 'error_history' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'}`}
                  >
                    历史数据采集
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Group 3: 专项行动管理 */}
          <li className="mt-1">
            <div 
              onClick={() => toggleGroup('special')}
              className="flex items-center justify-between px-4 py-2 text-[#333333] hover:bg-gray-100 cursor-pointer text-xs"
            >
              <div className="flex items-center">
                <i className="fa-solid fa-list-check w-5 text-center mr-2"></i>
                <span>专项行动管理</span>
              </div>
              <i className={`fa-solid fa-angle-down text-[10px] transition-transform ${openGroups.special ? 'rotate-180' : ''}`}></i>
            </div>
            {openGroups.special && (
              <ul className="pl-11 py-1 space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => onSelectView('special_institution')}
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${
                      currentView === 'special_institution' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'
                    }`}
                  >
                    专项行动机构
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectView('special_plan')}
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${
                      currentView === 'special_plan' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'
                    }`}
                  >
                    专项行动方案
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Group 4: 系统管理 */}
          <li className="mt-1">
            <div 
              onClick={() => toggleGroup('system')}
              className="flex items-center justify-between px-4 py-2 text-[#333333] hover:bg-gray-100 cursor-pointer text-xs"
            >
              <div className="flex items-center">
                <i className="fa-solid fa-gear w-5 text-center mr-2"></i>
                <span>系统管理</span>
              </div>
              <i className={`fa-solid fa-angle-down text-[10px] transition-transform ${openGroups.system ? 'rotate-180' : ''}`}></i>
            </div>
            {openGroups.system && (
              <ul className="pl-11 py-1 space-y-1 text-xs">
                <li>
                  <button 
                    onClick={() => onSelectView('download_center')}
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${currentView === 'download_center' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'}`}
                  >
                    下载中心
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onSelectView('system_logs')}
                    className={`block py-1.5 text-left w-full hover:text-[#1677ff] ${currentView === 'system_logs' ? 'text-[#1677ff] font-medium' : 'text-[#333333]'}`}
                  >
                    日志管理
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};
