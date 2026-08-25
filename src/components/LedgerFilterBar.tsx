import React, { useState, useRef, useEffect } from 'react';

export interface LedgerFilterValues {
  nameField: string;
  ledgerName: string;
  excludeWord: string;
  platform: string;
  authType: string;
  addressMode: string;
  addressApp: string;
  judgmentType: string;
  collectStatus: string;
  minFans: string;
  maxFans: string;
  ledgerStatus: string;
  subjectTypes: Record<string, boolean>;
  subjectTags: Record<string, boolean>;
  ledgerTags: Record<string, boolean>;
  mediaAttrOptions: Record<string, boolean>;
  levelOptions: Record<string, boolean>;
  hideExisting?: boolean;
}

export const initialFilterValues: LedgerFilterValues = {
  nameField: '台账名称',
  ledgerName: '',
  excludeWord: '',
  platform: '',
  authType: '',
  addressMode: '包含',
  addressApp: '',
  judgmentType: '',
  collectStatus: '',
  minFans: '',
  maxFans: '',
  ledgerStatus: '',
  subjectTypes: {
    org: false, diplomacy: false, justice: false, tourism: false, civil: false,
    religion: false, union: false, business: false, cpc: false, housing: false,
    agriculture: false, overseas: false, trade: false, culture: false, none: false
  },
  subjectTags: {
    edu: false, publicSecurity: false, medical: false, noneTag: false
  },
  ledgerTags: {
    media: false, level: false, tempHide: false, discardGov: false, discardMedia: false, noneLedgerTag: false
  },
  mediaAttrOptions: {
    govPublish: false, newsMedia: false, businessMedia: false, foreignMedia: false, otherMedia: false
  },
  levelOptions: {
    '省级': false, '地市级': false, '县区级': false, '乡镇街道': false
  },
  hideExisting: false
};

interface LedgerFilterBarProps {
  totalCount: number;
  selectedCount: number;
  onSearch: (filters: LedgerFilterValues) => void;
  onReset: () => void;
  showHideExisting?: boolean;
  hideExisting?: boolean;
  onHideExistingChange?: (val: boolean) => void;
}

export const LedgerFilterBar: React.FC<LedgerFilterBarProps> = ({
  totalCount,
  selectedCount,
  onSearch,
  onReset,
  showHideExisting = false,
  hideExisting = false,
  onHideExistingChange
}) => {
  // Collapsible toggle (default false - collapsed)
  const [isExpandedFilters, setIsExpandedFilters] = useState(false);

  // Filter Form States
  const [nameField, setNameField] = useState('台账名称');
  const [ledgerName, setLedgerName] = useState('');
  const [excludeWord, setExcludeWord] = useState('');
  const [platform, setPlatform] = useState('');
  const [authType, setAuthType] = useState('');
  const [addressMode, setAddressMode] = useState('包含');
  const [addressApp, setAddressApp] = useState('');
  const [judgmentType, setJudgmentType] = useState('');
  const [collectStatus, setCollectStatus] = useState('');
  const [minFans, setMinFans] = useState('');
  const [maxFans, setMaxFans] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('');

  // Address Scope Popover state
  const [showAddressRangePopover, setShowAddressRangePopover] = useState(false);
  const [isCustomAddressScope, setIsCustomAddressScope] = useState(false);
  const [personalAddressFields, setPersonalAddressFields] = useState<Record<string, boolean>>({
    jurisdiction: true, ip: true, lastPublish: true, regCity: true, regionModel: true, unconfirmedRegionModel: false,
  });
  const [orgAddressFields, setOrgAddressFields] = useState<Record<string, boolean>>({
    jurisdiction: true, ip: true, lastPublish: true, regCity: true, regionModel: true, unconfirmedRegionModel: false,
  });

  // Active Dropdown Popover Key
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sub-option states for dropdowns
  const [mediaAttrOptions, setMediaAttrOptions] = useState<Record<string, boolean>>({
    govPublish: false, newsMedia: false, businessMedia: false, foreignMedia: false, otherMedia: false
  });

  const [levelOptions, setLevelOptions] = useState<Record<string, boolean>>({
    '省级': false, '地市级': false, '县区级': false, '乡镇街道': false
  });

  // Checkbox group states
  const [subjectTypes, setSubjectTypes] = useState<Record<string, boolean>>({
    org: false, diplomacy: false, justice: false, tourism: false, civil: false,
    religion: false, union: false, business: false, cpc: false, housing: false,
    agriculture: false, overseas: false, trade: false, culture: false, none: false
  });

  const [subjectTags, setSubjectTags] = useState<Record<string, boolean>>({
    edu: false, publicSecurity: false, medical: false, noneTag: false
  });

  const [ledgerTags, setLedgerTags] = useState<Record<string, boolean>>({
    media: false, level: false, tempHide: false, discardGov: false, discardMedia: false, noneLedgerTag: false
  });

  const selectedMediaCount = Object.values(mediaAttrOptions).filter(Boolean).length;

  const toggleMediaOption = (key: string) => {
    const updated = { ...mediaAttrOptions, [key]: !mediaAttrOptions[key] };
    setMediaAttrOptions(updated);
    const hasAny = Object.values(updated).some(Boolean);
    setLedgerTags(prev => ({ ...prev, media: hasAny }));
  };

  const resetMediaOptions = () => {
    const cleared = {
      govPublish: false, newsMedia: false, businessMedia: false, foreignMedia: false, otherMedia: false
    };
    setMediaAttrOptions(cleared);
    setLedgerTags(prev => ({ ...prev, media: false }));
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownKey(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryClick = () => {
    onSearch({
      nameField,
      ledgerName,
      excludeWord,
      platform,
      authType,
      addressMode,
      addressApp,
      judgmentType,
      collectStatus,
      minFans,
      maxFans,
      ledgerStatus,
      subjectTypes,
      subjectTags,
      ledgerTags,
      mediaAttrOptions,
      levelOptions,
      hideExisting
    });
  };

  const handleResetClick = () => {
    setNameField('台账名称');
    setLedgerName('');
    setExcludeWord('');
    setPlatform('');
    setAuthType('');
    setAddressMode('包含');
    setAddressApp('');
    setJudgmentType('');
    setCollectStatus('');
    setMinFans('');
    setMaxFans('');
    setLedgerStatus('');
    setSubjectTypes({
      org: false, diplomacy: false, justice: false, tourism: false, civil: false,
      religion: false, union: false, business: false, cpc: false, housing: false,
      agriculture: false, overseas: false, trade: false, culture: false, none: false
    });
    setSubjectTags({
      edu: false, publicSecurity: false, medical: false, noneTag: false
    });
    setLedgerTags({
      media: false, level: false, tempHide: false, discardGov: false, discardMedia: false, noneLedgerTag: false
    });
    setMediaAttrOptions({
      govPublish: false, newsMedia: false, businessMedia: false, foreignMedia: false, otherMedia: false
    });
    setLevelOptions({
      '省级': false, '地市级': false, '县区级': false, '乡镇街道': false
    });
    if (onHideExistingChange) {
      onHideExistingChange(false);
    }
    onReset();
  };

  return (
    <div className="space-y-3 text-xs">
      {/* Main Filter Panel */}
      <div className="bg-white p-3.5 border border-[#e8e8e8] rounded-sm space-y-3">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 台账名称 / 台账ID */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors">
            <div className="flex items-center px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap cursor-pointer">
              <span>{nameField}</span>
              <i className="fa-solid fa-angle-down text-gray-400 text-[10px] ml-1.5"></i>
            </div>
            <input
              type="text"
              className="flex-1 px-2.5 py-1.5 border-none outline-none text-gray-800 placeholder-gray-400 min-w-0"
              placeholder="请输入台账名称"
              value={ledgerName}
              onChange={e => setLedgerName(e.target.value)}
              maxLength={2000}
            />
            <span className="px-2 text-gray-400 text-[11px] font-mono whitespace-nowrap">{ledgerName.length} / 2000</span>
          </div>

          {/* 排除词 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">排除词</span>
            <input
              type="text"
              className="flex-1 px-2.5 py-1.5 border-none outline-none text-gray-800 placeholder-gray-400 min-w-0"
              placeholder="请输入排除词，多个以英文逗号分隔"
              value={excludeWord}
              onChange={e => setExcludeWord(e.target.value)}
              maxLength={2000}
            />
            <span className="px-2 text-gray-400 text-[11px] font-mono whitespace-nowrap">{excludeWord.length} / 2000</span>
          </div>

          {/* 所属平台 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">所属平台</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7 min-w-0"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            >
              <option value="">请选择所属平台</option>
              <option value="今日头条">今日头条</option>
              <option value="抖音">抖音</option>
              <option value="新浪微博">新浪微博</option>
              <option value="微博">微博</option>
              <option value="微信公众号">微信公众号</option>
              <option value="网站">网站</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 认证类型 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">认证类型</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7 min-w-0"
              value={authType}
              onChange={e => setAuthType(e.target.value)}
            >
              <option value="">请选择认证类型</option>
              <option value="其他">其他</option>
              <option value="机构">机构</option>
              <option value="个人认证">个人认证</option>
              <option value="企业">企业认证</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 应用地址 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors relative">
            <span className="px-2 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">应用地址</span>
            <select
              className="flex-1 px-2 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none min-w-0"
              value={addressApp}
              onChange={e => setAddressApp(e.target.value)}
            >
              <option value="">请选择应用</option>
              <option value="henan">河南</option>
              <option value="sichuan">四川</option>
              <option value="shandong">山东</option>
              <option value="neimenggu">内蒙古</option>
              <option value="jiangxi">江西</option>
            </select>
            <button
              type="button"
              onClick={() => setShowAddressRangePopover(!showAddressRangePopover)}
              className={`px-2 text-gray-400 hover:text-[#1677ff] border-l border-[#d9d9d9] py-1.5 bg-transparent cursor-pointer transition-colors ${
                showAddressRangePopover ? 'text-[#1677ff] bg-blue-50/50' : ''
              }`}
              title="地址检索范围"
            >
              <i className="fa-solid fa-sliders text-[11px]"></i>
            </button>

            {/* 地址检索范围 Popover */}
            {showAddressRangePopover && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAddressRangePopover(false)}
                />

                <div className="absolute top-full right-0 mt-2 z-50 w-[380px] bg-white rounded-md shadow-xl border border-gray-200 p-4 text-xs font-sans text-gray-700 animate-in fade-in zoom-in-95">
                  <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 pointer-events-none" />

                  <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-sm">地址检索范围</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-medium select-none">
                        {isCustomAddressScope ? '自定义' : '默认'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomAddressScope(!isCustomAddressScope)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isCustomAddressScope ? 'bg-[#1677ff]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isCustomAddressScope ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {!isCustomAddressScope ? (
                    <div className="space-y-3.5 text-xs">
                      <p className="text-gray-400 font-normal">默认检索范围说明：</p>

                      <div className="space-y-1.5">
                        <div className="flex items-center font-bold text-gray-800">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          个人、其他、疑似个人
                        </div>
                        <p className="text-gray-500 leading-relaxed pl-2 text-[11px]">
                          匹配IP属地、注册城市、区域模型地址、最后一天发文地址、管辖归属地，其中任意一项匹配即命中。
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center font-bold text-gray-800">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          机构、媒体、疑似机构、疑似媒体
                        </div>
                        <p className="text-gray-500 leading-relaxed pl-2 text-[11px]">
                          仅匹配管辖归属地。
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3.5 text-xs">
                      <p className="text-gray-400 font-normal">
                        自定义模式下，两组认证类型下均需至少选择一个地址字段。
                      </p>

                      <div>
                        <div className="flex items-center font-bold text-gray-800 mb-2">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          个人、其他、疑似个人
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-2 pl-2">
                          {[
                            { id: 'jurisdiction', label: '管辖归属地' },
                            { id: 'ip', label: 'IP属地' },
                            { id: 'lastPublish', label: '最后一天发文地址' },
                            { id: 'regCity', label: '注册城市' },
                            { id: 'regionModel', label: '区域模型地址' },
                            { id: 'unconfirmedRegionModel', label: '待确认区域模型地址' },
                          ].map(opt => {
                            const checked = personalAddressFields[opt.id];
                            return (
                              <label
                                key={opt.id}
                                className="inline-flex items-center space-x-1.5 cursor-pointer select-none text-[11px]"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={e =>
                                    setPersonalAddressFields(prev => ({
                                      ...prev,
                                      [opt.id]: e.target.checked,
                                    }))
                                  }
                                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                                />
                                <span className={checked ? 'text-[#1677ff] font-medium' : 'text-gray-600'}>
                                  {opt.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center font-bold text-gray-800 mb-2">
                          <span className="w-0.5 h-3 bg-[#1677ff] rounded-full inline-block mr-1.5" />
                          机构、媒体、疑似机构、疑似媒体
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-2 pl-2">
                          {[
                            { id: 'jurisdiction', label: '管辖归属地' },
                            { id: 'ip', label: 'IP属地' },
                            { id: 'lastPublish', label: '最后一天发文地址' },
                            { id: 'regCity', label: '注册城市' },
                            { id: 'regionModel', label: '区域模型地址' },
                            { id: 'unconfirmedRegionModel', label: '待确认区域模型地址' },
                          ].map(opt => {
                            const checked = orgAddressFields[opt.id];
                            return (
                              <label
                                key={opt.id}
                                className="inline-flex items-center space-x-1.5 cursor-pointer select-none text-[11px]"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={e =>
                                    setOrgAddressFields(prev => ({
                                      ...prev,
                                      [opt.id]: e.target.checked,
                                    }))
                                  }
                                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer"
                                />
                                <span className={checked ? 'text-[#1677ff] font-medium' : 'text-gray-600'}>
                                  {opt.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 研判类型 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">研判类型</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7 min-w-0"
              value={judgmentType}
              onChange={e => setJudgmentType(e.target.value)}
            >
              <option value="">请选择研判类型</option>
              <option value="未研判">未研判</option>
              <option value="精准匹配">精准匹配</option>
              <option value="模糊匹配">模糊匹配</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 采集状态 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">采集状态</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7 min-w-0"
              value={collectStatus}
              onChange={e => setCollectStatus(e.target.value)}
            >
              <option value="">请选择采集状态</option>
              <option value="未采集">未采集</option>
              <option value="已采集">已采集</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {/* 粉丝数 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">粉丝数</span>
            <input
              type="text"
              className="w-16 px-2 py-1.5 border-none outline-none text-center text-gray-800 placeholder-gray-400 flex-1 min-w-0"
              placeholder="最小值"
              value={minFans}
              onChange={e => setMinFans(e.target.value)}
            />
            <span className="text-gray-400 px-1 whitespace-nowrap">至</span>
            <input
              type="text"
              className="w-16 px-2 py-1.5 border-none outline-none text-center text-gray-800 placeholder-gray-400 flex-1 min-w-0"
              placeholder="最大值"
              value={maxFans}
              onChange={e => setMaxFans(e.target.value)}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* 台账状态 */}
          <div className="flex items-center border border-[#d9d9d9] rounded-sm relative focus-within:border-[#1677ff] transition-colors">
            <span className="px-2.5 py-1.5 bg-gray-50/80 border-r border-[#d9d9d9] text-gray-700 whitespace-nowrap">台账状态</span>
            <select
              className="flex-1 px-2.5 py-1.5 border-none outline-none bg-transparent text-gray-700 cursor-pointer appearance-none pr-7 min-w-0"
              value={ledgerStatus}
              onChange={e => setLedgerStatus(e.target.value)}
            >
              <option value="">请选择台账状态</option>
              <option value="正常">正常</option>
              <option value="异常">异常</option>
            </select>
            <i className="fa-solid fa-angle-down text-gray-400 absolute right-2.5 pointer-events-none text-[10px]"></i>
          </div>

          {showHideExisting && (
            <div className="flex items-center pl-1">
              <label className="flex items-center space-x-2 cursor-pointer text-gray-700 select-none hover:text-[#1677ff]">
                <input
                  type="checkbox"
                  checked={hideExisting}
                  onChange={e => onHideExistingChange && onHideExistingChange(e.target.checked)}
                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff]"
                />
                <span className="text-xs font-normal">隐藏已存在台账</span>
              </label>
            </div>
          )}
        </div>

        {/* Collapsible Checkbox Groups */}
        {isExpandedFilters && (
          <div className="space-y-2.5 pt-3 border-t border-[#f0f0f0] text-gray-700 select-none">
            {/* 主体类型 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-gray-800 font-normal w-16 whitespace-nowrap">主体类型</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Object.values(subjectTypes).every(Boolean)}
                  onChange={e => {
                    const val = e.target.checked;
                    const updated: Record<string, boolean> = {};
                    Object.keys(subjectTypes).forEach(k => { updated[k] = val; });
                    setSubjectTypes(updated);
                  }}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <span>全选</span>
              </label>

              {[
                { key: 'org', label: '机构编制' },
                { key: 'diplomacy', label: '外交' },
                { key: 'justice', label: '司法行政' },
                { key: 'tourism', label: '旅游' },
                { key: 'civil', label: '民政' },
                { key: 'religion', label: '宗教' },
                { key: 'union', label: '工会' },
                { key: 'business', label: '工商' },
                { key: 'cpc', label: '中央军委改革和编制办公室' },
                { key: 'housing', label: '住房城乡建设' },
                { key: 'agriculture', label: '农业' },
                { key: 'overseas', label: '侨联' },
                { key: 'trade', label: '贸易促进' },
                { key: 'culture', label: '文化' },
                { key: 'none', label: '无类型', hasArrow: false }
              ].map(item => (
                <div key={item.key} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    id={`subject-${item.key}`}
                    checked={subjectTypes[item.key]}
                    onChange={e => setSubjectTypes({ ...subjectTypes, [item.key]: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <label htmlFor={`subject-${item.key}`} className="cursor-pointer flex items-center">
                    <span>{item.label}</span>
                    {item.hasArrow !== false && (
                      <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {/* 主体标签 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-gray-800 font-normal w-16 whitespace-nowrap">主体标签</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Object.values(subjectTags).every(Boolean)}
                  onChange={e => {
                    const val = e.target.checked;
                    const updated: Record<string, boolean> = {};
                    Object.keys(subjectTags).forEach(k => { updated[k] = val; });
                    setSubjectTags(updated);
                  }}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <span>全选</span>
              </label>

              {[
                { key: 'edu', label: '教育类' },
                { key: 'publicSecurity', label: '公安' },
                { key: 'medical', label: '医疗' },
                { key: 'noneTag', label: '无标签', hasArrow: false }
              ].map(item => (
                <div key={item.key} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    id={`subject-tag-${item.key}`}
                    checked={subjectTags[item.key]}
                    onChange={e => setSubjectTags({ ...subjectTags, [item.key]: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <label htmlFor={`subject-tag-${item.key}`} className="cursor-pointer flex items-center">
                    <span>{item.label}</span>
                    {item.hasArrow !== false && (
                      <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {/* 台账标签 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs relative" ref={dropdownRef}>
              <span className="text-gray-800 font-normal w-16 whitespace-nowrap">台账标签</span>
              
              <label className="flex items-center space-x-1 cursor-pointer">
                <div className="w-3.5 h-3.5 bg-gray-300 rounded-xs flex items-center justify-center text-white text-[9px]">
                  <i className="fa-solid fa-minus"></i>
                </div>
                <span>全选</span>
              </label>

              {/* 媒体属性 (Popover) */}
              <div className="relative">
                <div 
                  onClick={() => setActiveDropdownKey(activeDropdownKey === 'mediaAttr' ? null : 'mediaAttr')}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={ledgerTags.media}
                    onChange={e => {
                      e.stopPropagation();
                      const next = e.target.checked;
                      setLedgerTags({ ...ledgerTags, media: next });
                      if (next && selectedMediaCount === 0) {
                        setMediaAttrOptions({ ...mediaAttrOptions, govPublish: true });
                      }
                    }}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <div className="flex items-center space-x-1 text-gray-800 hover:text-[#1677ff]">
                    <span className={ledgerTags.media ? 'text-[#1677ff] font-medium' : ''}>媒体属性</span>
                    {selectedMediaCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-[#e6f4ff] text-[#1677ff] text-[10px] rounded border border-[#91caff] leading-tight">
                        {selectedMediaCount}
                      </span>
                    )}
                    <i className={`fa-solid fa-caret-${activeDropdownKey === 'mediaAttr' ? 'up' : 'down'} text-[10px] text-gray-500`}></i>
                  </div>
                </div>

                {activeDropdownKey === 'mediaAttr' && (
                  <div className="absolute left-0 top-7 w-56 bg-white border border-[#e8e8e8] shadow-lg rounded-sm p-3 z-50 space-y-2 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.govPublish}
                        onChange={() => toggleMediaOption('govPublish')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">政务发布</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.newsMedia}
                        onChange={() => toggleMediaOption('newsMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">新闻媒体</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.businessMedia}
                        onChange={() => toggleMediaOption('businessMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">商业媒体</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.foreignMedia}
                        onChange={() => toggleMediaOption('foreignMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">驻华外媒废弃转到屏</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={mediaAttrOptions.otherMedia}
                        onChange={() => toggleMediaOption('otherMedia')}
                        className="rounded border-gray-300 text-[#1677ff]"
                      />
                      <span className="text-gray-800">其他媒体废弃</span>
                    </label>

                    <div className="pt-2 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={resetMediaOptions}
                        className="text-gray-500 hover:text-[#1677ff] text-[11px] flex items-center space-x-1 cursor-pointer bg-transparent border-none"
                      >
                        <i className="fa-solid fa-arrow-rotate-right text-[10px]"></i>
                        <span>重置</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 级别 */}
              <div className="relative">
                <div
                  onClick={() => setActiveDropdownKey(activeDropdownKey === 'level' ? null : 'level')}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={ledgerTags.level}
                    onChange={e => setLedgerTags({ ...ledgerTags, level: e.target.checked })}
                    className="rounded border-gray-300 text-[#1677ff]"
                  />
                  <div className="flex items-center space-x-1 text-gray-800 hover:text-[#1677ff]">
                    <span>级别</span>
                    <i className={`fa-solid fa-caret-${activeDropdownKey === 'level' ? 'up' : 'down'} text-[10px] text-gray-500`}></i>
                  </div>
                </div>

                {activeDropdownKey === 'level' && (
                  <div className="absolute left-0 top-7 w-48 bg-white border border-[#e8e8e8] shadow-lg rounded-sm p-3 z-50 space-y-2 text-xs">
                    {['省级', '地市级', '县区级', '乡镇街道'].map(lvl => (
                      <label key={lvl} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={levelOptions[lvl]}
                          onChange={() => setLevelOptions({ ...levelOptions, [lvl]: !levelOptions[lvl] })}
                          className="rounded border-gray-300 text-[#1677ff]"
                        />
                        <span className="text-gray-800">{lvl}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 暂时屏蔽 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="ledger-tag-tempHide"
                  checked={ledgerTags.tempHide}
                  onChange={e => setLedgerTags({ ...ledgerTags, tempHide: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="ledger-tag-tempHide" className="cursor-pointer flex items-center">
                  <span>暂时屏蔽</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 废弃政务类废弃 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="ledger-tag-discardGov"
                  checked={ledgerTags.discardGov}
                  onChange={e => setLedgerTags({ ...ledgerTags, discardGov: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="ledger-tag-discardGov" className="cursor-pointer flex items-center">
                  <span>废弃政务类废弃</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 废弃媒体类废弃 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="ledger-tag-discardMedia"
                  checked={ledgerTags.discardMedia}
                  onChange={e => setLedgerTags({ ...ledgerTags, discardMedia: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="ledger-tag-discardMedia" className="cursor-pointer flex items-center">
                  <span>废弃媒体类废弃</span>
                  <i className="fa-solid fa-caret-down ml-1 text-gray-500 text-[10px]"></i>
                </label>
              </div>

              {/* 无标签 */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="ledger-tag-noneLedgerTag"
                  checked={ledgerTags.noneLedgerTag}
                  onChange={e => setLedgerTags({ ...ledgerTags, noneLedgerTag: e.target.checked })}
                  className="rounded border-gray-300 text-[#1677ff]"
                />
                <label htmlFor="ledger-tag-noneLedgerTag" className="cursor-pointer">
                  <span>无标签</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Count & Action Buttons Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center space-x-2 text-gray-700">
          <i className="fa-solid fa-chart-simple text-[#1677ff] text-sm"></i>
          <span>
            (共查询到 <strong className="text-[#1677ff] font-semibold">{totalCount}</strong> 条台账)
          </span>
        </div>
        <div className="flex items-center space-x-2.5">
          {/* Expand/Collapse Trigger */}
          <span
            onClick={() => setIsExpandedFilters(!isExpandedFilters)}
            className="text-[#1677ff] cursor-pointer hover:underline flex items-center space-x-1 mr-2 select-none font-medium"
          >
            <span>{isExpandedFilters ? '收起' : '展开'}</span>
            <i className={`fa-solid fa-angle-${isExpandedFilters ? 'up' : 'down'} text-[10px]`}></i>
          </span>

          {/* 查询 Button */}
          <button
            onClick={handleQueryClick}
            className="bg-[#1677ff] text-white px-5 py-1.5 rounded-sm text-xs hover:bg-blue-600 transition-colors cursor-pointer flex items-center shadow-xs"
          >
            <i className="fa-solid fa-magnifying-glass mr-1.5 text-[11px]"></i>
            <span>查询</span>
          </button>

          {/* 重置 Button */}
          <button
            onClick={handleResetClick}
            className="bg-gray-50 text-gray-700 border border-[#d9d9d9] px-4 py-1.5 rounded-sm text-xs hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer flex items-center"
          >
            <i className="fa-solid fa-arrow-rotate-right mr-1.5 text-[11px] text-gray-500"></i>
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>
  );
};
