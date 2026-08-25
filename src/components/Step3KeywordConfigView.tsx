import React, { useState } from 'react';

export interface Mode2GroupItem {
  id: string;
  main: string[];
  sub: string[];
  secondary: string[];
}

export interface Step3KeywordConfigViewProps {
  mode1Groups: string[][];
  onChangeMode1Groups: (groups: string[][]) => void;
  mode2Groups: Mode2GroupItem[];
  onChangeMode2Groups: (groups: Mode2GroupItem[]) => void;
  activeMode: 'mode1' | 'mode2';
  onChangeActiveMode: (mode: 'mode1' | 'mode2') => void;
  excludeKeywords: string[];
  onChangeExcludeKeywords: (keywords: string[]) => void;
  ignoreKeywords?: string[];
  onChangeIgnoreKeywords?: (keywords: string[]) => void;
  onToast: (msg: string) => void;
  onPreviewGroup?: (groupName: string, keywords: string[]) => void;
}

export const Step3KeywordConfigView: React.FC<Step3KeywordConfigViewProps> = ({
  mode1Groups,
  onChangeMode1Groups,
  mode2Groups,
  onChangeMode2Groups,
  activeMode,
  onChangeActiveMode,
  excludeKeywords,
  onChangeExcludeKeywords,
  ignoreKeywords = [],
  onChangeIgnoreKeywords,
  onToast,
  onPreviewGroup,
}) => {
  // Input drafts for Mode 1
  const [mode1Drafts, setMode1Drafts] = useState<{ [index: number]: string }>({});

  // Input drafts for Mode 2
  const [mode2Drafts, setMode2Drafts] = useState<{
    [key: string]: string; // `${groupId}_main` | `${groupId}_sub` | `${groupId}_secondary`
  }>({});

  // Input draft for Exclude Keywords
  const [excludeDraft, setExcludeDraft] = useState<string>('');

  // Input draft for Ignore Keywords
  const [ignoreDraft, setIgnoreDraft] = useState<string>('');

  // ----------------------------------------------------
  // Mode 1 Handlers
  // ----------------------------------------------------
  const handleAddMode1Tag = (groupIndex: number, text: string) => {
    const rawTerms = text.split(/[,，;；\n]/).map(t => t.trim()).filter(Boolean);
    if (rawTerms.length === 0) return;

    const newGroups = [...mode1Groups];
    const currentTags = newGroups[groupIndex] || [];
    const combined = Array.from(new Set([...currentTags, ...rawTerms]));
    newGroups[groupIndex] = combined;
    onChangeMode1Groups(newGroups);
    setMode1Drafts(prev => ({ ...prev, [groupIndex]: '' }));
  };

  const handleRemoveMode1Tag = (groupIndex: number, tagIndex: number) => {
    const newGroups = [...mode1Groups];
    newGroups[groupIndex] = newGroups[groupIndex].filter((_, idx) => idx !== tagIndex);
    onChangeMode1Groups(newGroups);
  };

  const handleAddMode1Group = () => {
    onChangeMode1Groups([...mode1Groups, []]);
    onToast('已添加一组新关键词');
  };

  const handleRemoveMode1Group = (groupIndex: number) => {
    if (mode1Groups.length <= 1) {
      onToast('至少保留一组关键词');
      return;
    }
    const newGroups = mode1Groups.filter((_, idx) => idx !== groupIndex);
    onChangeMode1Groups(newGroups);
    onToast(`已删除第 ${groupIndex + 1} 组关键词`);
  };

  const handleCopyMode1Group = (groupIndex: number) => {
    const tags = mode1Groups[groupIndex] || [];
    if (tags.length === 0) {
      onToast('当前词组为空，无可复制内容');
      return;
    }
    const text = tags.join(', ');
    navigator.clipboard?.writeText(text);
    onToast(`已复制第 ${groupIndex + 1} 组关键词：${text}`);
  };

  // ----------------------------------------------------
  // Mode 2 Handlers
  // ----------------------------------------------------
  const handleAddMode2Tag = (
    groupId: string,
    level: 'main' | 'sub' | 'secondary',
    text: string
  ) => {
    const rawTerms = text.split(/[,，;；\n]/).map(t => t.trim()).filter(Boolean);
    if (rawTerms.length === 0) return;

    const newGroups = mode2Groups.map(grp => {
      if (grp.id !== groupId) return grp;
      const currentTags = grp[level] || [];
      return {
        ...grp,
        [level]: Array.from(new Set([...currentTags, ...rawTerms])),
      };
    });

    onChangeMode2Groups(newGroups);
    setMode2Drafts(prev => ({ ...prev, [`${groupId}_${level}`]: '' }));
  };

  const handleRemoveMode2Tag = (
    groupId: string,
    level: 'main' | 'sub' | 'secondary',
    tagIndex: number
  ) => {
    const newGroups = mode2Groups.map(grp => {
      if (grp.id !== groupId) return grp;
      return {
        ...grp,
        [level]: grp[level].filter((_, idx) => idx !== tagIndex),
      };
    });
    onChangeMode2Groups(newGroups);
  };

  const handleClearMode2Row = (groupId: string, level: 'main' | 'sub' | 'secondary') => {
    const newGroups = mode2Groups.map(grp => {
      if (grp.id !== groupId) return grp;
      return {
        ...grp,
        [level]: [],
      };
    });
    onChangeMode2Groups(newGroups);
    setMode2Drafts(prev => ({ ...prev, [`${groupId}_${level}`]: '' }));
    onToast(`已清空${level === 'main' ? '主' : level === 'sub' ? '副' : '次'}关键词`);
  };

  const handleCopyMode2Row = (groupId: string, level: 'main' | 'sub' | 'secondary') => {
    const targetGroup = mode2Groups.find(g => g.id === groupId);
    if (!targetGroup) return;
    const tags = targetGroup[level] || [];
    if (tags.length === 0) {
      onToast('当前行为空，无可复制内容');
      return;
    }
    const text = tags.join(', ');
    navigator.clipboard?.writeText(text);
    onToast(`已复制关键词：${text}`);
  };

  const handleAddMode2Group = () => {
    const newId = `group_${Date.now()}`;
    onChangeMode2Groups([
      ...mode2Groups,
      {
        id: newId,
        main: [],
        sub: [],
        secondary: [],
      },
    ]);
    onToast('已添加一组新词组');
  };

  const handleRemoveMode2Group = (groupId: string, index: number) => {
    if (mode2Groups.length <= 1) {
      onToast('至少保留一组词组');
      return;
    }
    onChangeMode2Groups(mode2Groups.filter(g => g.id !== groupId));
    onToast(`已删除词组 ${index + 1}`);
  };

  // ----------------------------------------------------
  // Exclude Keywords Handlers
  // ----------------------------------------------------
  const handleAddExcludeTag = (text: string) => {
    const rawTerms = text.split(/[,，;；\n]/).map(t => t.trim()).filter(Boolean);
    if (rawTerms.length === 0) return;
    const combined = Array.from(new Set([...excludeKeywords, ...rawTerms]));
    onChangeExcludeKeywords(combined);
    setExcludeDraft('');
  };

  const handleRemoveExcludeTag = (index: number) => {
    onChangeExcludeKeywords(excludeKeywords.filter((_, idx) => idx !== index));
  };

  const handleCopyExclude = () => {
    if (excludeKeywords.length === 0) {
      onToast('排除词为空');
      return;
    }
    const text = excludeKeywords.join('; ');
    navigator.clipboard?.writeText(text);
    onToast(`已复制排除词：${text}`);
  };

  const handleClearExclude = () => {
    onChangeExcludeKeywords([]);
    setExcludeDraft('');
    onToast('已清空全部排除词');
  };

  // ----------------------------------------------------
  // Ignore Keywords Handlers
  // ----------------------------------------------------
  const handleAddIgnoreTag = (text: string) => {
    const rawTerms = text.split(/[,，;；\n]/).map(t => t.trim()).filter(Boolean);
    if (rawTerms.length === 0) return;
    const combined = Array.from(new Set([...ignoreKeywords, ...rawTerms]));
    if (onChangeIgnoreKeywords) {
      onChangeIgnoreKeywords(combined);
    }
    setIgnoreDraft('');
  };

  const handleRemoveIgnoreTag = (index: number) => {
    if (onChangeIgnoreKeywords) {
      onChangeIgnoreKeywords(ignoreKeywords.filter((_, idx) => idx !== index));
    }
  };

  const handleCopyIgnore = () => {
    if (ignoreKeywords.length === 0) {
      onToast('忽略词为空');
      return;
    }
    const text = ignoreKeywords.join('; ');
    navigator.clipboard?.writeText(text);
    onToast(`已复制忽略词：${text}`);
  };

  const handleClearIgnore = () => {
    if (onChangeIgnoreKeywords) {
      onChangeIgnoreKeywords([]);
    }
    setIgnoreDraft('');
    onToast('已清空全部忽略词');
  };

  return (
    <div className="w-full space-y-4 text-xs">
      {/* 1. 顶部 Tab 切换：手动输入 (模式一) | 手动输入 (模式二) */}
      <div className="flex items-center space-x-4">
        <label className="font-medium text-gray-700 flex items-center shrink-0">
          <span className="text-red-500 mr-1">*</span>关键词
        </label>

        <div className="flex items-center bg-gray-100 p-0.5 rounded-md border border-gray-200">
          <button
            type="button"
            onClick={() => onChangeActiveMode('mode1')}
            className={`px-4 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
              activeMode === 'mode1'
                ? 'bg-white text-gray-900 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            模式一
          </button>
          <button
            type="button"
            onClick={() => onChangeActiveMode('mode2')}
            className={`px-4 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
              activeMode === 'mode2'
                ? 'bg-white text-gray-900 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            模式二
          </button>
        </div>
      </div>

      {/* 2. 说明栏 */}
      <div className="p-2.5 bg-[#f6f8fa] text-gray-500 rounded border border-gray-100 text-[11px] leading-relaxed">
        {activeMode === 'mode1' ? (
          <span>
            说明：一组内输入多个关键词用逗号分隔，回车添加关键词，词与词之间为“且”的关系，可设置多组。
          </span>
        ) : (
          <span>
            说明：一组内可输入主、副、次关键词，主副次之间为“且”的关系；各级别内可输入多个关键词（逗号分隔，回车添加为“或”的关系）。
          </span>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. 模式一内容（对齐图1） */}
      {/* ---------------------------------------------------- */}
      {activeMode === 'mode1' && (
        <div className="space-y-3">
          {mode1Groups.map((group, groupIdx) => {
            const draft = mode1Drafts[groupIdx] || '';
            const isFirstActive = groupIdx === 0;

            return (
              <div
                key={groupIdx}
                className={`flex items-center rounded border transition px-3 py-2 bg-white ${
                  isFirstActive
                    ? 'border-[#2f54eb] ring-2 ring-blue-100'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {/* 关键词标签列表 & 输入框 */}
                <div className="flex-1 flex flex-wrap items-center gap-1.5 min-h-[26px]">
                  {group.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center space-x-1.5 bg-[#f0f2f5] hover:bg-[#e4e6eb] text-gray-800 px-2.5 py-0.5 rounded text-xs transition select-none"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMode1Tag(groupIdx, tagIdx)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer text-[11px] leading-none"
                        title="删除该词"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={draft}
                    onChange={e =>
                      setMode1Drafts(prev => ({ ...prev, [groupIdx]: e.target.value }))
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',' || e.key === '，') {
                        e.preventDefault();
                        handleAddMode1Tag(groupIdx, draft);
                      } else if (e.key === 'Backspace' && !draft && group.length > 0) {
                        handleRemoveMode1Tag(groupIdx, group.length - 1);
                      }
                    }}
                    onBlur={() => {
                      if (draft.trim()) {
                        handleAddMode1Tag(groupIdx, draft);
                      }
                    }}
                    placeholder={
                      group.length === 0
                        ? `请输入第${groupIdx + 1}组关键词`
                        : '回车或逗号添加关键词'
                    }
                    className="flex-1 min-w-[150px] text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                </div>

                {/* 右侧操作按钮 */}
                <div className="flex items-center space-x-2.5 ml-3 shrink-0 text-[#1677ff]">
                  {/* 复制按钮 */}
                  <button
                    type="button"
                    onClick={() => handleCopyMode1Group(groupIdx)}
                    className="hover:text-blue-700 cursor-pointer p-0.5"
                    title="复制这组关键词"
                  >
                    <i className="fa-regular fa-copy text-sm"></i>
                  </button>

                  {/* 搜索/预览图标 */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onPreviewGroup) {
                        onPreviewGroup(`第 ${groupIdx + 1} 组`, group);
                      } else {
                        onToast(`正在匹配第 ${groupIdx + 1} 组关键词规则`);
                      }
                    }}
                    className="hover:text-blue-700 cursor-pointer p-0.5"
                    title="搜索/预览匹配"
                  >
                    <i className="fa-solid fa-magnifying-glass text-sm"></i>
                  </button>

                  {/* 删除该组 (第2组及以上，或多于1组时显示) */}
                  {mode1Groups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMode1Group(groupIdx)}
                      className="text-red-500 hover:text-red-700 cursor-pointer p-0.5 ml-1"
                      title="删除这组关键词"
                    >
                      <i className="fa-regular fa-circle-xmark text-sm"></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* + 添加一组 虚线按钮 */}
          <button
            type="button"
            onClick={handleAddMode1Group}
            className="w-full py-2.5 border border-dashed border-gray-300 rounded hover:border-[#1677ff] hover:text-[#1677ff] hover:bg-blue-50/20 text-gray-500 cursor-pointer transition flex items-center justify-center space-x-1 font-medium bg-[#fafafa]"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>添加一组</span>
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. 模式二内容（对齐图2） */}
      {/* ---------------------------------------------------- */}
      {activeMode === 'mode2' && (
        <div className="space-y-4">
          {mode2Groups.map((group, groupIdx) => {
            const isFirst = groupIdx === 0;

            return (
              <div
                key={group.id}
                className="bg-[#f8fafd] rounded-lg border border-gray-200 p-3.5 space-y-3 shadow-xs"
              >
                {/* 词组头部 */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-xs">
                    词组{groupIdx + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allWords = [
                          ...(group.main || []),
                          ...(group.sub || []),
                          ...(group.secondary || []),
                        ];
                        if (onPreviewGroup) {
                          onPreviewGroup(`词组${groupIdx + 1}`, allWords);
                        } else {
                          onToast(`预览词组${groupIdx + 1}规则`);
                        }
                      }}
                      className="px-3 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-[11px] font-medium cursor-pointer shadow-xs transition"
                    >
                      预览
                    </button>
                    {!isFirst && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMode2Group(group.id, groupIdx)}
                        className="px-3 py-1 bg-[#ff4d4f] hover:bg-red-600 text-white rounded text-[11px] font-medium cursor-pointer shadow-xs transition"
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>

                {/* 主 / 副 / 次 输入行 */}
                {(
                  [
                    { key: 'main', label: '主', placeholder: '请输入主关键词，逗号分隔，回车添加为“或”的关系' },
                    { key: 'sub', label: '副', placeholder: '请输入副关键词，逗号分隔，回车添加为“或”的关系' },
                    { key: 'secondary', label: '次', placeholder: '请输入次关键词，逗号分隔，回车添加为“或”的关系' },
                  ] as const
                ).map(levelConfig => {
                  const levelKey = levelConfig.key;
                  const tags = group[levelKey] || [];
                  const draftKey = `${group.id}_${levelKey}`;
                  const draftVal = mode2Drafts[draftKey] || '';

                  return (
                    <div key={levelKey} className="flex items-center space-x-2.5">
                      <span className="text-gray-500 font-medium text-xs w-4 text-center shrink-0">
                        {levelConfig.label}
                      </span>

                      <div className="flex-1 flex items-center rounded border border-gray-300 hover:border-gray-400 focus-within:border-[#1677ff] bg-white px-3 py-1.5 transition">
                        <div className="flex-1 flex flex-wrap items-center gap-1.5 min-h-[24px]">
                          {tags.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center space-x-1 bg-[#f0f2f5] hover:bg-[#e4e6eb] text-gray-800 px-2.5 py-0.5 rounded text-xs transition select-none"
                            >
                              <span>{t}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveMode2Tag(group.id, levelKey, tIdx)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer text-[11px] leading-none"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </span>
                          ))}

                          <input
                            type="text"
                            value={draftVal}
                            onChange={e =>
                              setMode2Drafts(prev => ({
                                ...prev,
                                [draftKey]: e.target.value,
                              }))
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ',' || e.key === '，') {
                                e.preventDefault();
                                handleAddMode2Tag(group.id, levelKey, draftVal);
                              } else if (
                                e.key === 'Backspace' &&
                                !draftVal &&
                                tags.length > 0
                              ) {
                                handleRemoveMode2Tag(group.id, levelKey, tags.length - 1);
                              }
                            }}
                            onBlur={() => {
                              if (draftVal.trim()) {
                                handleAddMode2Tag(group.id, levelKey, draftVal);
                              }
                            }}
                            placeholder={tags.length === 0 ? levelConfig.placeholder : '回车添加'}
                            className="flex-1 min-w-[130px] text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                          />
                        </div>

                        {/* 行右侧操作按钮：复制 + 清空/扫把 */}
                        <div className="flex items-center space-x-2.5 ml-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyMode2Row(group.id, levelKey)}
                            className="text-[#1677ff] hover:text-blue-700 cursor-pointer p-0.5"
                            title="复制"
                          >
                            <i className="fa-regular fa-copy text-sm"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClearMode2Row(group.id, levelKey)}
                            className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                            title="清空本行"
                          >
                            <i className="fa-solid fa-broom text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* + 添加一组 虚线按钮 */}
          <button
            type="button"
            onClick={handleAddMode2Group}
            className="w-full py-2.5 border border-dashed border-gray-300 rounded hover:border-[#1677ff] hover:text-[#1677ff] hover:bg-blue-50/20 text-gray-500 cursor-pointer transition flex items-center justify-center space-x-1 font-medium bg-[#fafafa]"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>添加一组</span>
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. 底部排除词（对齐两张图底部） */}
      {/* ---------------------------------------------------- */}
      <div className="pt-2">
        <div className="flex items-center space-x-3">
          <label className="font-medium text-gray-700 w-12 shrink-0">排除词</label>

          <div className="flex-1 flex items-center rounded border border-gray-300 hover:border-gray-400 focus-within:border-[#1677ff] bg-white px-3 py-2 transition min-h-[40px]">
            <div className="flex-1 flex flex-wrap items-center gap-1.5">
              {excludeKeywords.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs select-none"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExcludeTag(idx)}
                    className="text-red-400 hover:text-red-600 cursor-pointer text-[11px]"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={excludeDraft}
                onChange={e => setExcludeDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ';' || e.key === '；' || e.key === ',' || e.key === '，') {
                    e.preventDefault();
                    handleAddExcludeTag(excludeDraft);
                  } else if (e.key === 'Backspace' && !excludeDraft && excludeKeywords.length > 0) {
                    handleRemoveExcludeTag(excludeKeywords.length - 1);
                  }
                }}
                onBlur={() => {
                  if (excludeDraft.trim()) {
                    handleAddExcludeTag(excludeDraft);
                  }
                }}
                placeholder={
                  excludeKeywords.length === 0
                    ? '请输入排除词，多个词之间用分号隔开，回车添加关键词'
                    : '回车或分号添加排除词'
                }
                className="flex-1 min-w-[240px] text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* 右侧复制 + 清空按钮 */}
            <div className="flex items-center space-x-2.5 ml-2.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyExclude}
                className="text-[#1677ff] hover:text-blue-700 cursor-pointer p-0.5"
                title="复制排除词"
              >
                <i className="fa-regular fa-copy text-sm"></i>
              </button>
              <button
                type="button"
                onClick={handleClearExclude}
                className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                title="清空排除词"
              >
                <i className="fa-regular fa-circle-xmark text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 6. 底部忽略词 */}
        <div className="flex items-center space-x-3 pt-2">
          <label className="font-medium text-gray-700 w-12 shrink-0">忽略词</label>

          <div className="flex-1 flex items-center rounded border border-gray-300 hover:border-gray-400 focus-within:border-[#1677ff] bg-white px-3 py-2 transition min-h-[40px]">
            <div className="flex-1 flex flex-wrap items-center gap-1.5">
              {ignoreKeywords.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-xs select-none"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIgnoreTag(idx)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer text-[11px]"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={ignoreDraft}
                onChange={e => setIgnoreDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ';' || e.key === '；' || e.key === ',' || e.key === '，') {
                    e.preventDefault();
                    handleAddIgnoreTag(ignoreDraft);
                  } else if (e.key === 'Backspace' && !ignoreDraft && ignoreKeywords.length > 0) {
                    handleRemoveIgnoreTag(ignoreKeywords.length - 1);
                  }
                }}
                onBlur={() => {
                  if (ignoreDraft.trim()) {
                    handleAddIgnoreTag(ignoreDraft);
                  }
                }}
                placeholder={
                  ignoreKeywords.length === 0
                    ? '请输入忽略词，多个词之间用分号隔开，回车添加关键词'
                    : '回车或分号添加忽略词'
                }
                className="flex-1 min-w-[240px] text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* 右侧复制 + 清空按钮 */}
            <div className="flex items-center space-x-2.5 ml-2.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyIgnore}
                className="text-[#1677ff] hover:text-blue-700 cursor-pointer p-0.5"
                title="复制忽略词"
              >
                <i className="fa-regular fa-copy text-sm"></i>
              </button>
              <button
                type="button"
                onClick={handleClearIgnore}
                className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                title="清空忽略词"
              >
                <i className="fa-regular fa-circle-xmark text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
