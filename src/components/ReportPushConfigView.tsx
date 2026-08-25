import React, { useState } from 'react';

export const ReportPushConfigView: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [frequency, setFrequency] = useState('每周通知 (固定周期推送)');
  const [weekday, setWeekday] = useState('星期一');
  const [timeStr, setTimeStr] = useState('00:00:00');
  const [channel, setChannel] = useState<'wechat' | 'group'>('wechat');

  const recipients: any[] = []; // Empty state as per image

  return (
    <div className="bg-white border border-[#e8e8e8] rounded p-6 shadow-xs flex flex-col space-y-6">
      {/* Title & Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e8e8]">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
          <span className="text-xs font-bold text-gray-800">报告推送配置</span>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ml-4 ${
              isEnabled ? 'bg-[#1677ff]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                isEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
        <span className="text-[11px] text-gray-400 flex items-center">
          <i className="fa-solid fa-circle-info mr-1 text-[#1677ff]"></i> 配置台账更新报告的通知方式和接收人
        </span>
      </div>

      {/* Config Form Fields */}
      <div className="grid grid-cols-3 gap-6 text-xs">
        {/* Frequency */}
        <div className="space-y-1.5">
          <label className="block text-gray-700 font-medium">
            <span className="text-red-500 mr-1">*</span>通知频率
          </label>
          <div className="relative">
            <select
              className="w-full border border-[#e8e8e8] rounded px-3 py-2 bg-white text-gray-700 outline-none cursor-pointer"
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
            >
              <option value="每周通知 (固定周期推送)">每周通知 (固定周期推送)</option>
              <option value="每日通知">每日通知</option>
              <option value="每月通知">每月通知</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-3 top-3 pointer-events-none"></i>
          </div>
        </div>

        {/* Weekday */}
        <div className="space-y-1.5">
          <label className="block text-gray-700 font-medium">
            <span className="text-red-500 mr-1">*</span>固定星期
          </label>
          <div className="relative">
            <select
              className="w-full border border-[#e8e8e8] rounded px-3 py-2 bg-white text-gray-700 outline-none cursor-pointer"
              value={weekday}
              onChange={e => setWeekday(e.target.value)}
            >
              <option value="星期一">星期一</option>
              <option value="星期二">星期二</option>
              <option value="星期三">星期三</option>
              <option value="星期四">星期四</option>
              <option value="星期五">星期五</option>
              <option value="星期六">星期六</option>
              <option value="星期日">星期日</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-3 top-3 pointer-events-none"></i>
          </div>
        </div>

        {/* Time */}
        <div className="space-y-1.5">
          <label className="block text-gray-700 font-medium">
            <span className="text-red-500 mr-1">*</span>通知时间
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full border border-[#e8e8e8] rounded px-3 py-2 bg-white text-gray-700 outline-none font-mono"
              value={timeStr}
              onChange={e => setTimeStr(e.target.value)}
            />
            <i className="fa-regular fa-clock text-gray-400 absolute right-3 top-3 pointer-events-none"></i>
          </div>
        </div>
      </div>

      {/* Push Channel */}
      <div className="space-y-1.5 text-xs">
        <label className="block text-gray-700 font-medium">
          <span className="text-red-500 mr-1">*</span>推送渠道
        </label>
        <div className="flex items-center space-x-6 pt-1">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="radio"
              name="channel"
              checked={channel === 'wechat'}
              onChange={() => setChannel('wechat')}
              className="text-[#1677ff] focus:ring-[#1677ff]"
            />
            <span className="text-gray-800">微信公众号</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="radio"
              name="channel"
              checked={channel === 'group'}
              onChange={() => setChannel('group')}
              className="text-[#1677ff] focus:ring-[#1677ff]"
            />
            <span className="text-gray-800">外部群</span>
          </label>
        </div>
      </div>

      {/* Recipients Section */}
      <div className="pt-4 border-t border-[#e8e8e8]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-3.5 bg-[#1677ff] rounded-full"></div>
            <span className="text-xs font-bold text-gray-800">接收人员</span>
          </div>
          <button
            onClick={() => alert('点击新增接收人员')}
            className="bg-[#1677ff] text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center shadow-xs"
          >
            <i className="fa-solid fa-plus mr-1"></i> 新增人员
          </button>
        </div>

        {/* Recipients Table with Empty State */}
        <div className="border border-[#e8e8e8] rounded-t-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#fafafa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-4 py-3 font-medium w-16">序号</th>
                <th className="px-4 py-3 font-medium">微信头像/昵称</th>
                <th className="px-4 py-3 font-medium">姓名</th>
                <th className="px-4 py-3 font-medium">手机号</th>
                <th className="px-4 py-3 font-medium">关注公众号</th>
                <th className="px-4 py-3 font-medium">绑定时间</th>
                <th className="px-4 py-3 font-medium w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              {recipients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center text-2xl">
                        <i className="fa-solid fa-folder-open"></i>
                      </div>
                      <span className="text-xs text-gray-400">抱歉！ 暂无数据</span>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end pt-4 border-t border-[#e8e8e8]">
        <button
          onClick={() => alert('报告推送配置保存成功！')}
          className="bg-[#1677ff] text-white px-8 py-2 rounded text-xs hover:bg-blue-600 transition-colors cursor-pointer shadow-sm"
        >
          保存
        </button>
      </div>
    </div>
  );
};
