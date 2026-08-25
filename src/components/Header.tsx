import React, { useState, useEffect } from 'react';
import { getDownloadTasks, subscribeDownloadTasks, DownloadTask } from '../data/downloadCenterStore';

interface HeaderProps {
  onNavigate?: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [tasks, setTasks] = useState<DownloadTask[]>(getDownloadTasks());

  useEffect(() => {
    const unsubscribe = subscribeDownloadTasks(newTasks => {
      setTasks(newTasks);
    });
    return unsubscribe;
  }, []);

  const processingCount = tasks.filter(t => t.status === 'processing').length;

  const handleOpenDownloadCenter = () => {
    if (onNavigate) {
      onNavigate('download_center');
    } else {
      window.location.hash = '#/download_center';
    }
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出系统吗？')) {
      alert('已成功退出登录');
    }
  };

  return (
    <header className="h-[60px] flex-shrink-0 bg-[#e6f0ff] border-b border-[#e8e8e8] flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-800">牧网守正后台管理系统</h1>
      </div>
      <div className="flex items-center space-x-5">
        {/* 下载中心 (Image 3: 这里增加下载中心，用于显示正在导出日志) */}
        <button
          onClick={handleOpenDownloadCenter}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all ${
            processingCount > 0
              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 animate-pulse'
              : 'bg-white/80 hover:bg-white text-[#1677ff] border border-[#91caff] shadow-2xs hover:shadow-xs'
          }`}
          title="点击进入下载中心查看导出文件"
        >
          {processingCount > 0 ? (
            <i className="fa-solid fa-spinner fa-spin text-white"></i>
          ) : (
            <i className="fa-solid fa-cloud-arrow-down text-xs"></i>
          )}
          <span>下载中心</span>
          {processingCount > 0 ? (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {processingCount}项导出中
            </span>
          ) : (
            <span className="bg-blue-100 text-[#1677ff] text-[10px] px-1.5 py-0.2 rounded-full font-normal">
              {tasks.length}
            </span>
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center text-right mr-1">
          <div className="mr-3">
            <div className="text-sm font-medium leading-tight text-gray-800">邓东升</div>
            <div className="text-xs text-gray-500 leading-tight">产品二部</div>
          </div>
          <img 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full border border-gray-300 object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoVXa2Ptrk8mS88cl9aJJhNH6Ho83BMuZnTLn1C6HfDnWigSiJihupbTb-44L3gundWdV7mezJWRod6IoeaoHIVTcyHPThAXQ_jLqoIAllTVMeo_MTUlQ4O0kz-foq3lnsvDn6ewfpE3WTrHfBK_v2ypBYlIHbSdhnaNUHGUuH8NeVLGLx7w_6SfmkRd6UV9UC4-3KG-DR712win3uJDxk54glwWcThDU5jlQ1Gb58SRDJXHEA1g21Nw"
          />
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-[#1677ff] text-sm transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-arrow-right-from-bracket mr-1"></i>
          退出
        </button>
      </div>
    </header>
  );
};
