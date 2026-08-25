import React, { useState, useEffect, useMemo } from 'react';
import { LedgerItem } from '../mockLedgerData';

interface BatchImportViewProps {
  institutionName?: string;
  onImportLedgers?: (items: LedgerItem[]) => void;
  onNavigateToWhitelist?: () => void;
  onNavigateToSystemLogs?: () => void;
}

export interface ParseImportItem {
  id: string;
  name: string;
  platform: string;
  url: string;
  urlType: '台账地址' | '主页地址';
  tag: 'new' | 'in_whitelist' | 'in_ledger' | 'in_blacklist' | 'manual_removed' | 'invalid_url' | 'duplicate';
  originalTag?: 'new' | 'in_whitelist' | 'in_ledger' | 'in_blacklist' | 'manual_removed' | 'invalid_url' | 'duplicate';
  tagText: string;
  reason?: string;
}

export interface ImportTask {
  id: string;
  fileName: string;
  platform: string;
  platformId: string;
  uploadTime: string;
  totalRows: number;
  status: 'parsing' | 'parsed' | 'imported' | 'failed';
  importableList: ParseImportItem[];
  nonImportableList: ParseImportItem[];
  selectedImportableIds: string[];
  selectedNonImportableIds?: string[];
  importedCount?: number;
  importedTime?: string;
}

export const BatchImportView: React.FC<BatchImportViewProps> = ({
  institutionName = '属地机构',
  onImportLedgers,
  onNavigateToSystemLogs,
}) => {
  // Tasks list state
  const [tasks, setTasks] = useState<ImportTask[]>([
    {
      id: 'TASK_20260818_000',
      fileName: '中共陕西省委网信办1万条大规模账号数据.xlsx',
      platform: '综合平台',
      platformId: 'general',
      uploadTime: '2026-08-18 10:28:05',
      totalRows: 10000,
      status: 'parsing',
      importableList: [],
      nonImportableList: [],
      selectedImportableIds: [],
    },
    {
      id: 'TASK_20260818_001',
      fileName: '属地重点政务与融媒体台账批次_1万条.xlsx',
      platform: '综合平台',
      platformId: 'general',
      uploadTime: '2026-08-18 10:15:20',
      totalRows: 10000,
      status: 'parsed',
      importableList: generateMockImportable('综合平台', institutionName, 22),
      nonImportableList: generateMockNonImportable('综合平台', 7),
      selectedImportableIds: [],
    },
    {
      id: 'TASK_20260818_002',
      fileName: '省直机关及省属企事业单位台账清单.xlsx',
      platform: '综合平台',
      platformId: 'general',
      uploadTime: '2026-08-18 09:30:12',
      totalRows: 5800,
      status: 'imported',
      importedCount: 18,
      importedTime: '2026-08-18 09:35:40',
      importableList: generateMockImportable('综合平台', institutionName, 18),
      nonImportableList: generateMockNonImportable('综合平台', 5),
      selectedImportableIds: [],
    },
    {
      id: 'TASK_20260817_003',
      fileName: '新浪微博与抖音属地账号批量导入.xlsx',
      platform: '新浪微博',
      platformId: 'weibo',
      uploadTime: '2026-08-17 16:45:00',
      totalRows: 3400,
      status: 'imported',
      importedCount: 15,
      importedTime: '2026-08-17 16:50:10',
      importableList: generateMockImportable('新浪微博', institutionName, 15),
      nonImportableList: generateMockNonImportable('新浪微博', 4),
      selectedImportableIds: [],
    },
    {
      id: 'TASK_20260817_004',
      fileName: '全省各市州涉网账号明细表_表头损坏.xlsx',
      platform: '综合平台',
      platformId: 'general',
      uploadTime: '2026-08-17 14:20:00',
      totalRows: 0,
      status: 'failed',
      failReason: 'Excel 文件解析失败：未提取到符合规范的表头（缺失必填列 [主页地址]），请对照《台账导入模板》修改后重新上传。',
      importableList: [],
      nonImportableList: [],
      selectedImportableIds: [],
    }
  ]);

  // Upload area state: Pending file selection before hitting "确定上传"
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);

  // Pagination for main tasks table
  const [taskPage, setTaskPage] = useState<number>(1);
  const taskPageSize = 6;

  // Active reviewing task modal
  const [activeReviewTask, setActiveReviewTask] = useState<ImportTask | null>(null);
  const [activeFailureTask, setActiveFailureTask] = useState<ImportTask | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'importable' | 'nonImportable'>('importable');

  // Review Modal filtering & search
  const [reviewSearchTerm, setReviewSearchTerm] = useState<string>('');
  const [nonImportableSearchTerm, setNonImportableSearchTerm] = useState<string>('');
  const [reviewTagFilter, setReviewTagFilter] = useState<'all' | 'new' | 'in_whitelist' | 'in_ledger'>('all');

  // Review Modal pagination
  const [topPage, setTopPage] = useState<number>(1);
  const topPageSize = 8;
  const [bottomPage, setBottomPage] = useState<number>(1);
  const bottomPageSize = 8;

  // Status Filter for main task list
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');
  const [taskNameFilter, setTaskNameFilter] = useState<string>('');

  // Global Toast / Success Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Simulated Background Parsing Engine (Takes 18 seconds per parsing task so parsing status is noticeable)
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prevTasks => {
        let hasCompleted = false;
        let hasFailed = false;
        const updated = prevTasks.map(t => {
          if (t.status === 'parsing') {
            const isErrorFile = t.fileName.includes('错误') || t.fileName.includes('损坏') || t.fileName.includes('失败') || t.fileName.includes('异常');
            if (isErrorFile) {
              hasFailed = true;
              return {
                ...t,
                status: 'failed' as const,
                failReason: 'Excel 文件解析失败：未提取到符合规范的表头（缺失必填列 [主页地址] 或 [所属平台]），请对照《台账导入模板》修改后重新上传。',
                totalRows: 0,
                importableList: [],
                nonImportableList: []
              };
            }
            hasCompleted = true;
            return {
              ...t,
              status: 'parsed' as const,
              importableList: generateMockImportable('综合平台', institutionName, 20),
              nonImportableList: generateMockNonImportable('综合平台', 6)
            };
          }
          return t;
        });

        if (hasFailed) {
          showToast('上传文件解析失败！未提取到符合规范的表头，请查看失败原因。');
        } else if (hasCompleted) {
          showToast('后台数据解析完成！请在解析记录列表中点击【查看与二次处理】确认入库。');
        }

        return updated;
      });
    }, 18000); // 18 seconds for parsing

    return () => clearInterval(timer);
  }, [institutionName]);

  // File input ref for real file selection
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Download General Excel Template
  const handleDownloadTemplate = () => {
    const header = '所属平台,主页地址,台账名称\n';
    const sample1 = `网站,https://www.sxwxb.gov.cn,陕西省委网信办官网\n`;
    const sample2 = `微博,https://weibo.com/u/1234567890,陕西发布官方微博\n`;
    const sample3 = `抖音,https://www.douyin.com/user/MS4wLjABAAAA_sx_news,陕广新闻\n`;
    const sample4 = `今日头条,https://www.toutiao.com/c/user/token123/,陕西头条官方号`;

    const element = document.createElement('a');
    const file = new Blob(['\ufeff' + header + sample1 + sample2 + sample3 + sample4], { type: 'text/csv;charset=utf-8;' });
    element.href = URL.createObjectURL(file);
    element.download = `台账导入模板.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Real file selection handler with format & size validation
  const handleRealFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`文件大小超过限制！所选文件 [${file.name}] 大小为 ${(file.size / 1024 / 1024).toFixed(2)}MB，文件大小必须小于或等于 10M。`);
      e.target.value = '';
      return;
    }

    // Validate extension (.xls or .xlsx)
    const nameLower = file.name.toLowerCase();
    if (!nameLower.endsWith('.xls') && !nameLower.endsWith('.xlsx')) {
      alert(`文件格式不符！仅支持后缀名必须为 .xls 或 .xlsx 的 Excel 格式文件。`);
      e.target.value = '';
      return;
    }

    setPendingFileName(file.name);
  };

  // User selects file (preset or browse)
  const handleSelectFile = (fileName?: string) => {
    if (fileName) {
      setPendingFileName(fileName);
    } else {
      fileInputRef.current?.click();
    }
  };

  // User clicks "确定上传" -> Creates parsing record task
  const handleConfirmUpload = () => {
    if (!pendingFileName) {
      alert('请先选择需要上传的 Excel 文件！');
      return;
    }

    const taskId = `TASK_${new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14)}_${Math.floor(Math.random() * 89 + 10)}`;
    const randomRows = Math.floor(Math.random() * 8000) + 2000;

    const newTask: ImportTask = {
      id: taskId,
      fileName: pendingFileName,
      platform: '综合平台',
      platformId: 'general',
      uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      totalRows: randomRows,
      status: 'parsing',
      importableList: [],
      nonImportableList: [],
      selectedImportableIds: [],
    };

    setTasks(prev => [newTask, ...prev]);
    setPendingFileName(null);
    setTaskPage(1); // Reset page to 1 so user sees the new record
    showToast(`文件 [${newTask.fileName}] 已添加至解析记录中，正在后台进行解析...`);
  };

  // Delete task record
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('确定要删除该上传解析记录吗？')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // Open Review Modal for a specific task
  const handleOpenReviewModal = (task: ImportTask) => {
    setActiveReviewTask({ ...task });
    setModalActiveTab('importable');
    setTopPage(1);
    setBottomPage(1);
    setReviewSearchTerm('');
    setNonImportableSearchTerm('');
    setReviewTagFilter('all');
  };

  // Close Review Modal
  const handleCloseReviewModal = () => {
    setActiveReviewTask(null);
  };

  // Modal Action: Move single item from Importable to NonImportable
  const handleModalRemoveSingle = (item: ParseImportItem) => {
    if (!activeReviewTask) return;

    const updatedImportable = activeReviewTask.importableList.filter(i => i.id !== item.id);
    const updatedSelectedIds = activeReviewTask.selectedImportableIds.filter(id => id !== item.id);

    const isOriginallyBlacklist = item.originalTag === 'in_blacklist';
    const movedItem: ParseImportItem = {
      ...item,
      originalTag: item.originalTag || item.tag,
      tag: isOriginallyBlacklist ? 'in_blacklist' : 'manual_removed',
      tagText: isOriginallyBlacklist ? '在我的黑名单' : '人工移除',
      reason: isOriginallyBlacklist ? '已存在于机构黑名单库中，禁止重复导入' : '人工二次筛选主动移除',
    };
    const updatedNonImportable = [movedItem, ...activeReviewTask.nonImportableList];

    const updatedTask: ImportTask = {
      ...activeReviewTask,
      importableList: updatedImportable,
      selectedImportableIds: updatedSelectedIds,
      nonImportableList: updatedNonImportable,
    };

    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Modal Action: Move selected items from Importable to NonImportable
  const handleModalBatchRemoveSelected = () => {
    if (!activeReviewTask || activeReviewTask.selectedImportableIds.length === 0) return;

    const idsToRemove = activeReviewTask.selectedImportableIds;
    const itemsToMove = activeReviewTask.importableList.filter(i => idsToRemove.includes(i.id));
    const updatedImportable = activeReviewTask.importableList.filter(i => !idsToRemove.includes(i.id));

    const movedItems: ParseImportItem[] = itemsToMove.map(item => {
      const isOriginallyBlacklist = item.originalTag === 'in_blacklist';
      return {
        ...item,
        originalTag: item.originalTag || item.tag,
        tag: isOriginallyBlacklist ? 'in_blacklist' : 'manual_removed',
        tagText: isOriginallyBlacklist ? '在我的黑名单' : '人工移除',
        reason: isOriginallyBlacklist ? '已存在于机构黑名单库中，禁止重复导入' : '人工二次筛选批量移除',
      };
    });

    const updatedNonImportable = [...movedItems, ...activeReviewTask.nonImportableList];

    const updatedTask: ImportTask = {
      ...activeReviewTask,
      importableList: updatedImportable,
      selectedImportableIds: [],
      nonImportableList: updatedNonImportable,
    };

    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Modal Action: Restore item from NonImportable back to Importable
  const handleModalRestoreItem = (item: ParseImportItem) => {
    if (!activeReviewTask || item.tag !== 'manual_removed') return;

    const updatedNonImportable = activeReviewTask.nonImportableList.filter(i => i.id !== item.id);

    const origTag = item.originalTag || 'new';
    const restoredItem: ParseImportItem = {
      ...item,
      tag: origTag,
      tagText: origTag === 'in_whitelist' ? '已在白名单' : origTag === 'in_ledger' ? '已在台账中' : '新可导入',
      reason: undefined,
    };

    const updatedImportable = [restoredItem, ...activeReviewTask.importableList];

    const updatedTask: ImportTask = {
      ...activeReviewTask,
      importableList: updatedImportable,
      nonImportableList: updatedNonImportable,
    };

    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Modal Action: Remove item from Blacklist and move to Importable list
  const handleModalRemoveBlacklist = (item: ParseImportItem) => {
    if (!activeReviewTask) return;

    const updatedNonImportable = activeReviewTask.nonImportableList.filter(i => i.id !== item.id);
    const updatedSelectedNonImportable = (activeReviewTask.selectedNonImportableIds || []).filter(id => id !== item.id);

    const restoredItem: ParseImportItem = {
      ...item,
      originalTag: 'in_blacklist',
      tag: 'new',
      tagText: '从黑名单放回(可导入)',
      reason: undefined,
    };

    const updatedImportable = [restoredItem, ...activeReviewTask.importableList];

    const updatedTask: ImportTask = {
      ...activeReviewTask,
      importableList: updatedImportable,
      nonImportableList: updatedNonImportable,
      selectedNonImportableIds: updatedSelectedNonImportable,
    };

    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    showToast(`已将【${item.name}】成功放回【可导入台账列表】中！`);
  };

  // Modal Action: Batch remove selected blacklist items from NonImportable list back to Importable list
  const handleModalBatchRemoveBlacklist = () => {
    if (!activeReviewTask || !activeReviewTask.selectedNonImportableIds || activeReviewTask.selectedNonImportableIds.length === 0) return;

    const idsToProcess = activeReviewTask.selectedNonImportableIds;
    const itemsToMove = activeReviewTask.nonImportableList.filter(i => idsToProcess.includes(i.id) && i.tag === 'in_blacklist');

    if (itemsToMove.length === 0) {
      showToast('选中的项目无黑名单类型账号！');
      return;
    }

    const moveIds = itemsToMove.map(i => i.id);
    const updatedNonImportable = activeReviewTask.nonImportableList.filter(i => !moveIds.includes(i.id));
    const updatedSelectedIds = activeReviewTask.selectedNonImportableIds.filter(id => !moveIds.includes(id));

    const restoredItems: ParseImportItem[] = itemsToMove.map(item => ({
      ...item,
      originalTag: 'in_blacklist',
      tag: 'new',
      tagText: '从黑名单放回(可导入)',
      reason: undefined,
    }));

    const updatedImportable = [...restoredItems, ...activeReviewTask.importableList];

    const updatedTask: ImportTask = {
      ...activeReviewTask,
      importableList: updatedImportable,
      nonImportableList: updatedNonImportable,
      selectedNonImportableIds: updatedSelectedIds,
    };

    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    showToast(`已成功将所选的 ${itemsToMove.length} 条黑名单账号放回【可导入台账列表】！`);
  };

  // Modal Action: Batch restore selected manually removed items back to Importable list
  const handleModalBatchRestoreManualRemoved = () => {
    if (!activeReviewTask || !activeReviewTask.selectedNonImportableIds || activeReviewTask.selectedNonImportableIds.length === 0) return;

    const idsToProcess = activeReviewTask.selectedNonImportableIds;
    const itemsToMove = activeReviewTask.nonImportableList.filter(i => idsToProcess.includes(i.id) && i.tag === 'manual_removed');

    if (itemsToMove.length === 0) {
      showToast('选中的项目无人工移除类型账号！');
      return;
    }

    const moveIds = itemsToMove.map(i => i.id);
    const updatedNonImportable = activeReviewTask.nonImportableList.filter(i => !moveIds.includes(i.id));
    const updatedSelectedIds = activeReviewTask.selectedNonImportableIds.filter(id => !moveIds.includes(id));

    const restoredItems: ParseImportItem[] = itemsToMove.map(item => ({
      ...item,
      tag: item.originalTag || 'new',
      tagText: item.originalTag === 'in_whitelist' ? '已在白名单' : item.originalTag === 'in_ledger' ? '已在台账中' : '新可导入',
      reason: undefined,
    }));

    const updatedImportable = [...restoredItems, ...activeReviewTask.importableList];

    const updatedTask: ImportTask = {
      ...activeReviewTask,
      importableList: updatedImportable,
      nonImportableList: updatedNonImportable,
      selectedNonImportableIds: updatedSelectedIds,
    };

    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    showToast(`已成功将所选的 ${itemsToMove.length} 条人工移除账号放回【可导入台账列表】！`);
  };

  // Modal Action: Batch restore all selected operable items (both blacklist and manual removed)
  const handleModalBatchRestoreAllSelected = () => {
    if (!activeReviewTask || !activeReviewTask.selectedNonImportableIds || activeReviewTask.selectedNonImportableIds.length === 0) return;

    const idsToProcess = activeReviewTask.selectedNonImportableIds;
    const itemsToMove = activeReviewTask.nonImportableList.filter(i => idsToProcess.includes(i.id) && (i.tag === 'in_blacklist' || i.tag === 'manual_removed'));

    if (itemsToMove.length === 0) {
      showToast('选中的项目皆为系统检验异常账号，不支持手动恢复！');
      return;
    }

    const moveIds = itemsToMove.map(i => i.id);
    const updatedNonImportable = activeReviewTask.nonImportableList.filter(i => !moveIds.includes(i.id));
    const updatedSelectedIds = activeReviewTask.selectedNonImportableIds.filter(id => !moveIds.includes(id));

    const restoredItems: ParseImportItem[] = itemsToMove.map(item => ({
      ...item,
      originalTag: item.originalTag || (item.tag === 'in_blacklist' ? 'in_blacklist' : 'new'),
      tag: 'new',
      tagText: item.tag === 'in_blacklist' ? '从黑名单放回(可导入)' : '人工放回(可导入)',
      reason: undefined,
    }));

    const updatedImportable = [...restoredItems, ...activeReviewTask.importableList];

    const updatedTask: ImportTask = {
      ...activeReviewTask,
      importableList: updatedImportable,
      nonImportableList: updatedNonImportable,
      selectedNonImportableIds: updatedSelectedIds,
    };

    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    showToast(`已成功将所选的 ${itemsToMove.length} 条数据放回【可导入台账列表】！`);
  };

  // Confirm Adding to Ledger inside Modal
  const handleConfirmAddToLedger = (taskToImport: ImportTask) => {
    if (taskToImport.importableList.length === 0) {
      alert('当前可导入列表中没有可增加的台账数据！');
      return;
    }

    const newLedgers: LedgerItem[] = taskToImport.importableList.map((item, idx) => ({
      id: Date.now() + idx + Math.floor(Math.random() * 1000),
      name: item.name,
      platform: item.platform as any,
      badgeType: 'blueV',
      avatar: 'https://images.unsplash.com/photo-1572945758420-279497e52002?w=100&auto=format&fit=crop&q=80',
      authType: '机构',
      judgmentType: '精准匹配',
      tags: ['批量导入', '白名单'],
      addresses: [{ icon: '🏛', text: '陕西/西安' }],
      subjectName: `${institutionName || '政务'}归属单位`,
      subjectType: '机关',
      fans: 120000,
      fansDisplay: '12.00万',
      collectStatus: '已采集',
      ledgerStatus: '正常',
      source: '批量导入',
      category: 'whitelist',
      addedTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      detail: {
        ledgerId: `import_${Date.now()}_${idx}`,
        ledgerUrl: item.url,
        collectStatus: '已采集',
        collectParam: `${Date.now() + idx}`,
        lastPostTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lastPostLocation: '陕西/西安',
        registeredCity: '陕西/西安',
        ipLocation: '陕西',
        jurisdictionLocation: '陕西/西安',
        authInfo: {
          nickname: item.name,
          accountId: `${Date.now() + idx}`,
          vType: '蓝V',
          fansCount: '12.00万',
          followCount: '150',
          likesCount: '5.2万',
          worksCount: '120',
          serviceUnit: institutionName,
          serviceCategory: '公共服务',
        },
      },
    }));

    if (onImportLedgers) {
      onImportLedgers(newLedgers);
    }

    // Mark task as imported
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updatedTask: ImportTask = {
      ...taskToImport,
      status: 'imported',
      importedCount: newLedgers.length,
      importedTime: nowStr,
    };

    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

    if (activeReviewTask && activeReviewTask.id === taskToImport.id) {
      setActiveReviewTask(null);
    }

    showToast(`成功将 [${taskToImport.fileName}] 中的 ${newLedgers.length} 条有效台账添加到系统台账库！`);
  };

  // Download Non-Importable CSV Report
  const handleDownloadNonImportableReport = (task: ImportTask) => {
    if (task.nonImportableList.length === 0) return;
    let csvContent = "序号,台账名称,平台类型,台账或主页地址,不可导入标记,原因说明\n";
    task.nonImportableList.forEach((item, idx) => {
      csvContent += `${idx + 1},"${item.name}","${item.platform}","${item.url}","${item.tagText}","${item.reason || ''}"\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    element.href = URL.createObjectURL(file);
    element.download = `${task.fileName}_不可导入台账清单.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filter tasks list
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (taskStatusFilter !== 'all' && t.status !== taskStatusFilter) return false;
      if (taskNameFilter && !t.fileName.toLowerCase().includes(taskNameFilter.toLowerCase())) return false;
      return true;
    });
  }, [tasks, taskStatusFilter, taskNameFilter]);

  // Main Tasks Table Pagination math
  const totalTaskPages = Math.ceil(filteredTasks.length / taskPageSize) || 1;
  const paginatedTasks = filteredTasks.slice((taskPage - 1) * taskPageSize, taskPage * taskPageSize);

  // Review modal search + tag filtering (新可导入 vs 已在白名单)
  const modalImportableFiltered = useMemo(() => {
    if (!activeReviewTask) return [];
    return activeReviewTask.importableList.filter(i => {
      // Keyword search
      if (reviewSearchTerm) {
        const matchesName = i.name.toLowerCase().includes(reviewSearchTerm.toLowerCase());
        const matchesUrl = i.url.toLowerCase().includes(reviewSearchTerm.toLowerCase());
        if (!matchesName && !matchesUrl) return false;
      }
      // Tag filter (新可导入 vs 已在白名单)
      if (reviewTagFilter === 'new' && i.tag !== 'new') return false;
      if (reviewTagFilter === 'in_whitelist' && i.tag !== 'in_whitelist') return false;
      if (reviewTagFilter === 'in_ledger' && i.tag !== 'in_ledger') return false;
      return true;
    });
  }, [activeReviewTask, reviewSearchTerm, reviewTagFilter]);

  // Modal Pagination math for Tab 1
  const totalTopPages = activeReviewTask ? Math.ceil(modalImportableFiltered.length / topPageSize) || 1 : 1;
  const paginatedTopList = modalImportableFiltered.slice((topPage - 1) * topPageSize, topPage * topPageSize);

  // Review modal filter for Tab 2 (不可导入台账列表)
  const modalNonImportableFiltered = useMemo(() => {
    if (!activeReviewTask) return [];
    if (!nonImportableSearchTerm) return activeReviewTask.nonImportableList;
    const term = nonImportableSearchTerm.toLowerCase();
    return activeReviewTask.nonImportableList.filter(i => {
      const matchName = i.name.toLowerCase().includes(term);
      const matchUrl = i.url.toLowerCase().includes(term);
      const matchPlatform = i.platform.toLowerCase().includes(term);
      const matchTag = i.tagText.toLowerCase().includes(term);
      const matchReason = i.reason ? i.reason.toLowerCase().includes(term) : false;
      return matchName || matchUrl || matchPlatform || matchTag || matchReason;
    });
  }, [activeReviewTask, nonImportableSearchTerm]);

  // Modal Pagination math for Tab 2
  const totalBottomPages = activeReviewTask ? Math.ceil(modalNonImportableFiltered.length / bottomPageSize) || 1 : 1;
  const paginatedBottomList = activeReviewTask ? modalNonImportableFiltered.slice((bottomPage - 1) * bottomPageSize, bottomPage * bottomPageSize) : [];

  // Top page checkbox logic
  const currentTopPageIds = paginatedTopList.map(i => i.id);
  const isCurrentTopPageAllSelected =
    activeReviewTask &&
    currentTopPageIds.length > 0 &&
    currentTopPageIds.every(id => activeReviewTask.selectedImportableIds.includes(id));

  const handleModalToggleSelectTopAll = () => {
    if (!activeReviewTask) return;
    let updatedIds: string[];
    if (isCurrentTopPageAllSelected) {
      updatedIds = activeReviewTask.selectedImportableIds.filter(id => !currentTopPageIds.includes(id));
    } else {
      updatedIds = Array.from(new Set([...activeReviewTask.selectedImportableIds, ...currentTopPageIds]));
    }
    const updatedTask = { ...activeReviewTask, selectedImportableIds: updatedIds };
    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleModalToggleSelectTopRow = (id: string) => {
    if (!activeReviewTask) return;
    const isSelected = activeReviewTask.selectedImportableIds.includes(id);
    const updatedIds = isSelected
      ? activeReviewTask.selectedImportableIds.filter(i => i !== id)
      : [...activeReviewTask.selectedImportableIds, id];

    const updatedTask = { ...activeReviewTask, selectedImportableIds: updatedIds };
    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Bottom page checkbox logic (Only operable items: in_blacklist or manual_removed)
  const currentBottomPageOperableItems = paginatedBottomList.filter(i => i.tag === 'in_blacklist' || i.tag === 'manual_removed');
  const currentBottomPageOperableIds = currentBottomPageOperableItems.map(i => i.id);
  const selectedNonImportableIds = activeReviewTask?.selectedNonImportableIds || [];
  const isCurrentBottomPageAllSelected =
    activeReviewTask &&
    currentBottomPageOperableIds.length > 0 &&
    currentBottomPageOperableIds.every(id => selectedNonImportableIds.includes(id));

  const handleModalToggleSelectBottomAll = () => {
    if (!activeReviewTask) return;
    let updatedIds: string[];
    if (isCurrentBottomPageAllSelected) {
      updatedIds = selectedNonImportableIds.filter(id => !currentBottomPageOperableIds.includes(id));
    } else {
      updatedIds = Array.from(new Set([...selectedNonImportableIds, ...currentBottomPageOperableIds]));
    }
    const updatedTask = { ...activeReviewTask, selectedNonImportableIds: updatedIds };
    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleModalToggleSelectBottomRow = (item: ParseImportItem) => {
    if (!activeReviewTask) return;
    if (item.tag !== 'in_blacklist' && item.tag !== 'manual_removed') return; // System issue items are not operable

    const isSelected = selectedNonImportableIds.includes(item.id);
    const updatedIds = isSelected
      ? selectedNonImportableIds.filter(i => i !== item.id)
      : [...selectedNonImportableIds, item.id];

    const updatedTask = { ...activeReviewTask, selectedNonImportableIds: updatedIds };
    setActiveReviewTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Counts for summary
  const parsingCount = tasks.filter(t => t.status === 'parsing').length;
  const parsedCount = tasks.filter(t => t.status === 'parsed').length;
  const importedCount = tasks.filter(t => t.status === 'imported').length;
  const failedCount = tasks.filter(t => t.status === 'failed').length;

  return (
    <div className="bg-white border border-[#e8e8e8] rounded-sm p-5 shadow-xs flex flex-col flex-1 min-h-[680px] space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1677ff] text-white px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 animate-in slide-in-from-top-2 duration-200 text-xs">
          <i className="fa-solid fa-circle-info text-sm"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input for real file selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleRealFileChange}
        accept=".xls,.xlsx"
        className="hidden"
      />

      {/* Header Title & Condensed Upload Rules & Template Download */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#e8e8e8] flex-wrap gap-2">
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5 min-w-0">
          <div className="w-1 h-3.5 bg-[#1677ff] rounded-full shrink-0"></div>
          <span className="text-xs font-bold text-gray-800 shrink-0">批量导入台账</span>

          {/* 规则 1：支持平台胶囊标签 */}
          <span className="inline-flex items-center text-gray-700 bg-blue-50/90 px-2.5 py-0.5 rounded-full border border-blue-100 text-[11px] font-normal shrink-0">
            <i className="fa-solid fa-circle-info text-[#1677ff] mr-1.5 text-[11px]"></i>
            仅支持：<strong className="font-medium text-gray-800 ml-0.5">网站、微博、抖音、今日头条</strong>
          </span>

          {/* 规则 2：精简填写说明与必填项强调 */}
          <span className="text-[11px] text-gray-600 ml-1 leading-normal">
            请先点击右侧下载《台账导入模板》进行填写，模板<strong className="font-bold text-gray-900">表头不可删改</strong>；必填：<strong className="font-bold text-red-600">主页地址、所属平台</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-1.5 bg-blue-50 border border-[#1677ff] text-[#1677ff] hover:bg-blue-100 rounded text-xs font-medium cursor-pointer transition-colors shadow-2xs inline-flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-download"></i>
            <span>下载台账导入模板</span>
          </button>

          {onNavigateToSystemLogs && (
            <button
              onClick={onNavigateToSystemLogs}
              className="text-xs text-gray-600 hover:text-[#1677ff] flex items-center space-x-1 font-medium bg-gray-50 hover:bg-gray-100 px-3 py-1.5 border border-gray-200 rounded cursor-pointer"
            >
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>导入台账日志</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: Compact Upload Drop Area (极小化上传区域) */}
      <div className="bg-[#fcfdfe] border border-[#e8e8e8] rounded p-3 shadow-2xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center space-x-3 border-2 border-dashed border-gray-200 hover:border-[#1677ff] bg-white rounded px-4 py-2 transition-colors">
            <i className="fa-solid fa-cloud-arrow-up text-xl text-[#1677ff]"></i>
            
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-700 font-medium">选择或拖拽 Excel 文件</span>
              <span className="text-[11px] text-gray-400 ml-2 font-normal hidden sm:inline">
                (仅支持 .xls, .xlsx 格式，最大 10M)
              </span>
            </div>

            {/* Simulated file selector / sample options */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleSelectFile()}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs text-gray-700 cursor-pointer"
              >
                浏览文件...
              </button>
              <button
                type="button"
                onClick={() => handleSelectFile(`${institutionName || '属地'}1万条大规模账号数据.xlsx`)}
                className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[11px] text-gray-500 cursor-pointer"
              >
                示例1万条批次
              </button>
              <button
                type="button"
                onClick={() => handleSelectFile(`表头损坏与缺失格式异常账号批次_错误例.xlsx`)}
                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-[11px] text-red-600 cursor-pointer"
                title="测试解析失败效果"
              >
                示例格式异常批次
              </button>
            </div>
          </div>

          {/* Pending file status & Confirm Upload Button */}
          <div className="flex items-center space-x-3 shrink-0">
            {pendingFileName ? (
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded">
                <i className="fa-solid fa-file-excel text-green-600 text-sm"></i>
                <span className="text-xs text-green-800 font-medium truncate max-w-[200px]" title={pendingFileName}>
                  {pendingFileName}
                </span>
                <button
                  onClick={() => setPendingFileName(null)}
                  className="text-gray-400 hover:text-red-500 text-xs ml-1 cursor-pointer"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">未选择文件</span>
            )}

            <button
              onClick={handleConfirmUpload}
              disabled={!pendingFileName}
              className={`px-5 py-2 rounded text-xs font-medium cursor-pointer shadow-2xs transition-all flex items-center space-x-1.5 ${
                pendingFileName
                  ? 'bg-[#1677ff] text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-check"></i>
              <span>确定上传</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Enlarged Parse Record List with Pagination (解析记录列表 - 极大扩大占比) */}
      <div className="flex flex-col flex-1 space-y-3 min-h-[420px]">
        {/* 重要流程提示 Banner */}
        <div className="bg-amber-50/90 border border-amber-200 rounded px-3.5 py-2 text-xs text-amber-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <i className="fa-solid fa-circle-exclamation text-amber-600 text-sm shrink-0"></i>
            <span className="leading-normal">
              <strong className="font-bold text-amber-900">重点提示：</strong>上传文件显示“解析完成”并不等于已将数据存入台账！请点击后方的 <strong className="text-[#1677ff] font-bold">【查看与二次处理】</strong> 按钮进行校验核对，点击弹窗内的“确认导入到台账”后方可正式入库。
            </span>
          </div>
          {parsedCount > 0 && (
            <span className="bg-amber-500 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs animate-pulse">
              {parsedCount} 个批次待处理添加
            </span>
          )}
        </div>

        {/* Task List Header & Status Summary */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <i className="fa-solid fa-list-check text-[#1677ff] text-sm"></i>
              <h3 className="text-xs font-bold text-gray-800">解析记录</h3>
              <span className="text-[11px] text-gray-500 font-normal">（共 {tasks.length} 条批次记录）</span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-xs text-[11px]">
                解析中: <strong className="font-mono">{parsingCount}</strong>
              </span>
              <span className={`px-2.5 py-0.5 rounded-xs text-[11px] font-bold flex items-center space-x-1 ${
                parsedCount > 0 
                  ? 'bg-amber-100 text-amber-900 border border-amber-400 shadow-2xs ring-1 ring-amber-300/50' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <i className="fa-solid fa-triangle-exclamation text-amber-600 text-[10px]"></i>
                <span>解析完成 (待二次处理加台账):</span>
                <strong className="font-mono text-xs text-amber-900">{parsedCount}</strong>
              </span>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-xs text-[11px]">
                已导入到台账: <strong className="font-mono">{importedCount}</strong>
              </span>
              <span className={`px-2 py-0.5 rounded-xs text-[11px] flex items-center space-x-1 ${
                failedCount > 0 
                  ? 'bg-red-50 text-red-700 border border-red-200 font-bold' 
                  : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}>
                <span>解析失败:</span>
                <strong className="font-mono">{failedCount}</strong>
              </span>
            </div>
          </div>

          {/* Filters for task list */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-gray-500">状态:</span>
              <select
                value={taskStatusFilter}
                onChange={e => {
                  setTaskStatusFilter(e.target.value);
                  setTaskPage(1);
                }}
                className="border border-[#d9d9d9] rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#1677ff]"
              >
                <option value="all">全部状态</option>
                <option value="parsing">解析中</option>
                <option value="parsed">解析完成 (待二次处理导入到台账)</option>
                <option value="imported">已导入到台账</option>
                <option value="failed">解析失败</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="搜索文件名..."
              value={taskNameFilter}
              onChange={e => {
                setTaskNameFilter(e.target.value);
                setTaskPage(1);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setTaskPage(1);
                }
              }}
              className="border border-[#d9d9d9] rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#1677ff] w-40"
            />

            {/* 查询 & 重置按钮 */}
            <button
              onClick={() => {
                setTaskPage(1);
              }}
              className="px-3 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer shadow-2xs flex items-center space-x-1 transition-colors"
            >
              <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
              <span>查询</span>
            </button>

            <button
              onClick={() => {
                setTaskStatusFilter('all');
                setTaskNameFilter('');
                setTaskPage(1);
              }}
              className="px-3 py-1 bg-white hover:bg-gray-50 border border-[#d9d9d9] text-gray-700 hover:text-gray-900 rounded text-xs font-medium cursor-pointer shadow-2xs flex items-center space-x-1 transition-colors"
            >
              <i className="fa-solid fa-rotate-left text-[11px]"></i>
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* Task Table */}
        <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-2xs flex-1 flex flex-col justify-between">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8]">
              <tr>
                <th className="px-3.5 py-2.5 font-medium w-12 text-center">序号</th>
                <th className="px-3.5 py-2.5 font-medium">文件名</th>
                <th className="px-3.5 py-2.5 font-medium w-36">提交时间</th>
                <th className="px-3.5 py-2.5 font-medium w-28 text-center">预估数据量</th>
                <th className="px-3.5 py-2.5 font-medium w-64 text-center">解析与处理状态</th>
                <th className="px-3.5 py-2.5 font-medium w-44 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-16 text-center text-gray-400">
                    暂无解析记录，请在上方选择 Excel 文件并点击【确定上传】
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task, idx) => {
                  const globalIdx = (taskPage - 1) * taskPageSize + idx + 1;
                  const isParsing = task.status === 'parsing';
                  const isParsed = task.status === 'parsed';
                  const isImported = task.status === 'imported';
                  const isFailed = task.status === 'failed';

                  return (
                    <tr 
                      key={task.id} 
                      className={`transition-colors ${
                        isParsed 
                          ? 'bg-amber-50/40 hover:bg-amber-50/80 border-l-2 border-l-amber-500' 
                          : isFailed
                          ? 'bg-red-50/20 hover:bg-red-50/50 border-l-2 border-l-red-500'
                          : 'hover:bg-gray-50/80'
                      }`}
                    >
                      <td className="px-3.5 py-3 text-center text-gray-500 font-mono">{globalIdx}</td>
                      <td className="px-3.5 py-3 font-medium text-gray-800">
                        <div className="flex items-center space-x-2">
                          <i className={`fa-solid fa-file-excel text-sm shrink-0 ${isFailed ? 'text-red-500' : 'text-green-600'}`}></i>
                          <span className="truncate max-w-md" title={task.fileName}>{task.fileName}</span>
                          {isParsed && (
                            <span className="px-1.5 py-0.2 bg-amber-500 text-white font-bold text-[10px] rounded shrink-0">
                              需处理
                            </span>
                          )}
                          {isFailed && (
                            <span className="px-1.5 py-0.2 bg-red-500 text-white font-bold text-[10px] rounded shrink-0">
                              异常
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 text-gray-500 font-mono text-[11px]">{task.uploadTime}</td>
                      <td className="px-3.5 py-3 text-center font-mono text-gray-700">{task.totalRows > 0 ? `${task.totalRows.toLocaleString()} 条` : '-'}</td>
                      
                      {/* Enhanced Status Display */}
                      <td className="px-3.5 py-3 text-center">
                        {isParsing ? (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-xs text-[11px] font-medium inline-flex items-center">
                            <i className="fa-solid fa-spinner animate-spin mr-1.5 text-blue-600"></i> 解析中...
                          </span>
                        ) : isParsed ? (
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xs text-[11px] font-bold inline-flex items-center shadow-2xs">
                              <i className="fa-solid fa-hourglass-half mr-1 text-amber-600"></i> 解析完成 (待二次处理添加)
                            </span>
                            <span className="text-[11px] text-gray-600">
                              可导入:<strong className="text-[#1677ff] font-mono ml-0.5 font-bold">{task.importableList.length}</strong> 条 | 不可导入:<strong className="text-red-500 font-mono ml-0.5">{task.nonImportableList.length}</strong> 条
                            </span>
                          </div>
                        ) : isImported ? (
                          <span className="px-2.5 py-1 bg-green-50 text-green-800 border border-green-300 rounded-xs text-[11px] font-medium inline-flex items-center">
                            <i className="fa-solid fa-circle-check mr-1 text-green-600 text-xs"></i> 已导入到台账 ({task.importedCount || task.importableList.length} 条)
                          </span>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-0.5">
                            <span className="px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-xs text-[11px] font-bold inline-flex items-center shadow-2xs">
                              <i className="fa-solid fa-circle-xmark mr-1 text-red-500"></i> 解析失败
                            </span>
                            <span className="text-[10px] text-red-500 max-w-[190px] truncate" title={task.failReason || 'Excel格式或表头校验不通过'}>
                              {task.failReason || 'Excel格式或表头校验不通过'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Operation Column */}
                      <td className="px-3.5 py-3 text-center">
                        {isParsing ? (
                          <span className="text-gray-400 italic text-[11px]">解析中请稍候...</span>
                        ) : isParsed ? (
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleOpenReviewModal(task)}
                              className="text-[#1677ff] hover:text-blue-700 hover:underline text-xs cursor-pointer font-medium inline-flex items-center space-x-1 transition-colors"
                            >
                              <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i>
                              <span>查看与二次处理</span>
                            </button>
                          </div>
                        ) : isImported ? (
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleOpenReviewModal(task)}
                              className="text-[#1677ff] hover:text-blue-700 hover:underline text-xs cursor-pointer font-medium inline-flex items-center space-x-1 transition-colors"
                            >
                              <i className="fa-solid fa-eye text-xs"></i>
                              <span>查看记录明细</span>
                            </button>
                          </div>
                        ) : isFailed ? (
                          <span className="text-gray-400 font-mono text-xs cursor-default select-none">-</span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Tasks Table Pagination */}
          <div className="bg-[#fafafa] px-4 py-2 border-t border-[#e8e8e8] flex items-center justify-between text-xs text-gray-500">
            <span>
              显示 <strong className="text-gray-800 font-mono">{filteredTasks.length > 0 ? (taskPage - 1) * taskPageSize + 1 : 0}</strong> - <strong className="text-gray-800 font-mono">{Math.min(taskPage * taskPageSize, filteredTasks.length)}</strong> 条，共 <strong className="text-gray-800 font-mono">{filteredTasks.length}</strong> 条记录
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTaskPage(prev => Math.max(1, prev - 1))}
                disabled={taskPage === 1}
                className="px-2.5 py-1 border border-[#d9d9d9] rounded-xs bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                上一页
              </button>
              <span className="font-mono">{taskPage} / {totalTaskPages} 页</span>
              <button
                onClick={() => setTaskPage(prev => Math.min(totalTaskPages, prev + 1))}
                disabled={taskPage >= totalTaskPages}
                className="px-2.5 py-1 border border-[#d9d9d9] rounded-xs bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Enlarged Review Modal with Tabbed Layout (更宽更宽敞的二次处理弹窗 & Tab切换) */}
      {activeReviewTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-[94vw] max-w-7xl overflow-hidden shadow-2xl flex flex-col h-[88vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#f0f5ff] px-6 py-3.5 border-b border-[#adc6ff] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-file-excel text-green-600 text-2xl"></i>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                    <span>上传解析核验 - 【{activeReviewTask.fileName}】</span>
                    {activeReviewTask.status === 'imported' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-xs text-[10px] font-normal">
                        已导入到台账
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    提交时间：{activeReviewTask.uploadTime} | 预估导入总量：{activeReviewTask.totalRows.toLocaleString()} 条
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseReviewModal}
                className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer bg-transparent border-none p-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Tab Switcher (切换可导入台账列表 & 不可导入台账列表) */}
            <div className="bg-white px-6 pt-3 border-b border-[#e8e8e8] flex items-center justify-between shrink-0">
              <div className="flex space-x-6">
                <button
                  onClick={() => {
                    setModalActiveTab('importable');
                    setTopPage(1);
                  }}
                  className={`pb-2.5 px-2 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center space-x-2 ${
                    modalActiveTab === 'importable'
                      ? 'border-[#1677ff] text-[#1677ff]'
                      : 'border-transparent text-gray-600 hover:text-[#1677ff]'
                  }`}
                >
                  <i className="fa-solid fa-circle-check text-green-600"></i>
                  <span>可导入台账列表</span>
                </button>

                <button
                  onClick={() => {
                    setModalActiveTab('nonImportable');
                    setBottomPage(1);
                  }}
                  className={`pb-2.5 px-2 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center space-x-2 ${
                    modalActiveTab === 'nonImportable'
                      ? 'border-[#1677ff] text-[#1677ff]'
                      : 'border-transparent text-gray-600 hover:text-[#1677ff]'
                  }`}
                >
                  <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                  <span>不可导入台账列表</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 pb-2">
                {/* Download Excel Button - Adjusted to Top Header Area as requested */}
                {modalActiveTab === 'nonImportable' && (
                  <button
                    onClick={() => handleDownloadNonImportableReport(activeReviewTask)}
                    disabled={activeReviewTask.nonImportableList.length === 0}
                    className="px-3 py-1 bg-white border border-[#ffa39e] text-red-600 hover:bg-red-50 rounded text-xs font-medium cursor-pointer shadow-2xs inline-flex items-center space-x-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    title="下载当前不可导入明细 Excel 报表"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span>下载不可导入明细 Excel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body (Tab Content) */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col space-y-4 text-xs">
              {modalActiveTab === 'importable' ? (
                /* TAB 1: 可导入台账列表 */
                <div className="flex flex-col flex-1 space-y-3">
                  {/* Search & Tag Filter Bar */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 border border-[#e8e8e8] rounded-sm gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-medium text-gray-700">台账搜索:</span>
                        <input
                          type="text"
                          placeholder="输入台账名称或链接检索..."
                          value={reviewSearchTerm}
                          onChange={e => {
                            setReviewSearchTerm(e.target.value);
                            setTopPage(1);
                          }}
                          className="border border-[#d9d9d9] rounded px-3 py-1 text-xs bg-white focus:outline-none focus:border-[#1677ff] w-64"
                        />
                      </div>

                      {/* Tag Filter (新台账 vs 已在白名单) */}
                      <div className="flex items-center space-x-1.5">
                        <span className="font-medium text-gray-700">数据标注:</span>
                        <select
                          value={reviewTagFilter}
                          onChange={e => {
                            setReviewTagFilter(e.target.value as any);
                            setTopPage(1);
                          }}
                          className="border border-[#d9d9d9] rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#1677ff]"
                        >
                          <option value="all">全部标注数据</option>
                          <option value="new">新可导入</option>
                          <option value="in_whitelist">已在白名单</option>
                          <option value="in_ledger">已在台账中</option>
                        </select>
                      </div>

                      {/* 查询 & 重置按钮 */}
                      <button
                        onClick={() => {
                          setTopPage(1);
                        }}
                        className="px-3 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer shadow-2xs flex items-center space-x-1 transition-colors"
                      >
                        <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
                        <span>查询</span>
                      </button>

                      <button
                        onClick={() => {
                          setReviewSearchTerm('');
                          setReviewTagFilter('all');
                          setTopPage(1);
                        }}
                        className="px-3 py-1 bg-white hover:bg-gray-50 border border-[#d9d9d9] text-gray-700 hover:text-gray-900 rounded text-xs font-medium cursor-pointer shadow-2xs flex items-center space-x-1 transition-colors"
                      >
                        <i className="fa-solid fa-rotate-left text-[11px]"></i>
                        <span>重置</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      {activeReviewTask.selectedImportableIds.length > 0 && (
                        <span className="text-[11px] text-gray-600">
                          已选择 <strong className="text-[#1677ff] font-mono">{activeReviewTask.selectedImportableIds.length}</strong> 项
                        </span>
                      )}
                      {activeReviewTask.status !== 'imported' && (
                        <button
                          onClick={handleModalBatchRemoveSelected}
                          disabled={activeReviewTask.selectedImportableIds.length === 0}
                          className={`px-3 py-1 rounded-xs text-xs font-medium flex items-center space-x-1 cursor-pointer transition-all ${
                            activeReviewTask.selectedImportableIds.length > 0
                              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-2xs'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          <i className="fa-solid fa-trash-can text-[11px]"></i>
                          <span>批量移除至不可导入列表</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-2xs flex-1 flex flex-col justify-between min-h-[340px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8] sticky top-0 bg-white">
                        <tr>
                          {activeReviewTask.status !== 'imported' && (
                            <th className="px-3.5 py-2.5 font-medium w-10 text-center">
                              <input
                                type="checkbox"
                                checked={isCurrentTopPageAllSelected || false}
                                onChange={handleModalToggleSelectTopAll}
                                className="rounded border-gray-300 text-[#1677ff] focus:ring-blue-500 cursor-pointer"
                              />
                            </th>
                          )}
                          <th className="px-3.5 py-2.5 font-medium w-12 text-center">序号</th>
                          <th className="px-3.5 py-2.5 font-medium">台账名称</th>
                          <th className="px-3.5 py-2.5 font-medium w-28">平台类型</th>
                          <th className="px-3.5 py-2.5 font-medium">台账地址 / 主页地址</th>
                          <th className="px-3.5 py-2.5 font-medium w-32 text-center">数据标注</th>
                          {activeReviewTask.status !== 'imported' && (
                            <th className="px-3.5 py-2.5 font-medium w-24 text-center">操作</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedTopList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-3 py-16 text-center text-gray-400">
                              暂无符合筛选条件的可导入台账数据
                            </td>
                          </tr>
                        ) : (
                          paginatedTopList.map((item, idx) => {
                            const globalIdx = (topPage - 1) * topPageSize + idx + 1;
                            const isChecked = activeReviewTask.selectedImportableIds.includes(item.id);

                            return (
                              <tr key={item.id} className={`hover:bg-blue-50/40 transition-colors ${isChecked ? 'bg-blue-50/20' : ''}`}>
                                {activeReviewTask.status !== 'imported' && (
                                  <td className="px-3.5 py-2.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleModalToggleSelectTopRow(item.id)}
                                      className="rounded border-gray-300 text-[#1677ff] focus:ring-blue-500 cursor-pointer"
                                    />
                                  </td>
                                )}
                                <td className="px-3.5 py-2.5 text-center text-gray-500 font-mono">{globalIdx}</td>
                                <td className="px-3.5 py-2.5 font-medium text-gray-800">{item.name}</td>
                                <td className="px-3.5 py-2.5 text-gray-600">
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-xs text-[11px]">
                                    {item.platform}
                                  </span>
                                </td>
                                <td className="px-3.5 py-2.5 text-gray-600 font-mono text-[11px] truncate max-w-md" title={item.url}>
                                  <a href={item.url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#1677ff] hover:underline">
                                    {item.url}
                                  </a>
                                </td>
                                <td className="px-3.5 py-2.5 text-center">
                                  {activeReviewTask.status === 'imported' ? (
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-xs text-[11px] font-medium inline-flex items-center">
                                      已导入
                                    </span>
                                  ) : item.tag === 'in_whitelist' ? (
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-xs text-[11px] font-medium inline-flex items-center">
                                      已在白名单
                                    </span>
                                  ) : item.tag === 'in_ledger' ? (
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xs text-[11px] font-medium inline-flex items-center">
                                      已在台账中
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-blue-50 text-[#1677ff] border border-blue-200 rounded-xs text-[11px] font-medium inline-flex items-center">
                                      <i className="fa-solid fa-plus-circle mr-1"></i> 新可导入
                                    </span>
                                  )}
                                </td>
                                {activeReviewTask.status !== 'imported' && (
                                  <td className="px-3.5 py-2.5 text-center">
                                    <button
                                      onClick={() => handleModalRemoveSingle(item)}
                                      className="text-red-500 hover:text-red-700 hover:underline text-xs font-medium cursor-pointer"
                                      title="移出可导入列表"
                                    >
                                      移除
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="bg-[#fafafa] px-4 py-2 border-t border-[#e8e8e8] flex items-center justify-between text-xs text-gray-500">
                      <span>
                        显示 <strong className="text-gray-800 font-mono">{modalImportableFiltered.length > 0 ? (topPage - 1) * topPageSize + 1 : 0}</strong> - <strong className="text-gray-800 font-mono">{Math.min(topPage * topPageSize, modalImportableFiltered.length)}</strong> 条，共 <strong className="text-gray-800 font-mono">{modalImportableFiltered.length}</strong> 条
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setTopPage(prev => Math.max(1, prev - 1))}
                          disabled={topPage === 1}
                          className="px-2.5 py-1 border border-[#d9d9d9] rounded-xs bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          上一页
                        </button>
                        <span className="font-mono">{topPage} / {totalTopPages} 页</span>
                        <button
                          onClick={() => setTopPage(prev => Math.min(totalTopPages, prev + 1))}
                          disabled={topPage >= totalTopPages}
                          className="px-2.5 py-1 border border-[#d9d9d9] rounded-xs bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: 不可导入台账列表 */
                <div className="flex flex-col flex-1 space-y-3">
                  {/* Action Bar & Search Bar for Tab 2 */}
                  <div className="flex items-center justify-between bg-amber-50/60 p-3 border border-[#ffd591] rounded-sm gap-3 flex-wrap">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                      {/* Search Bar for NonImportable list (Notice Title removed as requested) */}
                      <div className="flex items-center space-x-1.5">
                        <span className="font-medium text-gray-700 shrink-0 text-xs">台账搜索:</span>
                        <input
                          type="text"
                          placeholder="输入台账名称、地址、平台或原因..."
                          value={nonImportableSearchTerm}
                          onChange={e => {
                            setNonImportableSearchTerm(e.target.value);
                            setBottomPage(1);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              setBottomPage(1);
                            }
                          }}
                          className="border border-[#d9d9d9] rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-[#1677ff] w-56"
                        />
                        <button
                          onClick={() => {
                            setBottomPage(1);
                          }}
                          className="px-2.5 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-medium cursor-pointer shadow-2xs flex items-center space-x-1 transition-colors shrink-0"
                        >
                          <i className="fa-solid fa-magnifying-glass text-[11px]"></i>
                          <span>查询</span>
                        </button>
                        <button
                          onClick={() => {
                            setNonImportableSearchTerm('');
                            setBottomPage(1);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-[#d9d9d9] text-gray-700 hover:text-gray-900 rounded text-xs font-medium cursor-pointer shadow-2xs flex items-center space-x-1 transition-colors shrink-0"
                        >
                          <i className="fa-solid fa-rotate-left text-[11px]"></i>
                          <span>重置</span>
                        </button>
                      </div>
                    </div>

                    {/* Batch Operations Section (Only show for pending/reviewing tasks, NOT for imported detail view) */}
                    {activeReviewTask.status !== 'imported' && (() => {
                      const selectedItems = activeReviewTask.nonImportableList.filter(i => (activeReviewTask.selectedNonImportableIds || []).includes(i.id));
                      const hasBlacklistSelected = selectedItems.some(i => i.tag === 'in_blacklist');
                      const hasManualRemovedSelected = selectedItems.some(i => i.tag === 'manual_removed');
                      const hasAnyOperableSelected = hasBlacklistSelected || hasManualRemovedSelected;

                      return (
                        <div className="flex items-center space-x-2 bg-white/95 px-3 py-1 border border-amber-300 rounded text-xs shadow-2xs flex-wrap gap-y-1">
                          <span className="text-gray-500 font-mono text-[11px] mr-1 shrink-0">
                            已选择 <strong className="text-[#1677ff] font-bold">{(activeReviewTask.selectedNonImportableIds || []).length}</strong> 项
                          </span>

                          {/* 批量恢复至可导入列表 */}
                          <button
                            onClick={handleModalBatchRestoreAllSelected}
                            disabled={!hasAnyOperableSelected}
                            className="px-2.5 py-1 bg-[#1677ff] text-white hover:bg-blue-600 rounded text-xs font-medium cursor-pointer inline-flex items-center space-x-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                            title="批量将选中的可操作账号恢复至可导入列表"
                          >
                            <i className="fa-solid fa-arrow-left-long text-[10px]"></i>
                            <span>批量恢复至可导入</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Table */}
                  <div className="border border-[#e8e8e8] rounded-sm bg-white overflow-hidden shadow-2xs flex-1 flex flex-col justify-between min-h-[340px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f7f8fa] text-gray-700 border-b border-[#e8e8e8] sticky top-0 bg-white">
                        <tr>
                          {activeReviewTask.status !== 'imported' ? (
                            <th className="px-3 py-2.5 font-medium w-16 text-center">
                              <div className="flex items-center justify-center space-x-1.5">
                                <input
                                  type="checkbox"
                                  checked={isCurrentBottomPageAllSelected}
                                  onChange={handleModalToggleSelectBottomAll}
                                  disabled={currentBottomPageOperableIds.length === 0}
                                  className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={currentBottomPageOperableIds.length === 0 ? '当前页无可勾选操作的数据' : '全选/反选当前页可操作项'}
                                />
                                <span>序号</span>
                              </div>
                            </th>
                          ) : (
                            <th className="px-3.5 py-2.5 font-medium w-12 text-center">序号</th>
                          )}
                          <th className="px-3.5 py-2.5 font-medium">台账名称</th>
                          <th className="px-3.5 py-2.5 font-medium w-28">平台类型</th>
                          <th className="px-3.5 py-2.5 font-medium">台账地址 / 主页地址</th>
                          <th className="px-3.5 py-2.5 font-medium w-36 text-center">不可导入原因/标记</th>
                          <th className="px-3.5 py-2.5 font-medium w-32 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedBottomList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-3 py-16 text-center text-gray-400">
                              {nonImportableSearchTerm ? '未检索到符合条件的不可导入台账记录' : '无不可导入数据'}
                            </td>
                          </tr>
                        ) : (
                          paginatedBottomList.map((item, idx) => {
                            const globalIdx = (bottomPage - 1) * bottomPageSize + idx + 1;
                            const isManualRemoved = item.tag === 'manual_removed';
                            const isBlacklist = item.tag === 'in_blacklist';
                            const isOperable = isBlacklist || isManualRemoved;
                            const isRowSelected = (activeReviewTask.selectedNonImportableIds || []).includes(item.id);

                            return (
                              <tr 
                                key={item.id} 
                                className={`transition-colors ${
                                  activeReviewTask.status !== 'imported' && isRowSelected 
                                    ? 'bg-blue-50/50 hover:bg-blue-50/80' 
                                    : !isOperable 
                                      ? 'bg-gray-50/30 hover:bg-gray-50/60' 
                                      : 'hover:bg-amber-50/30'
                                }`}
                              >
                                {activeReviewTask.status !== 'imported' ? (
                                  <td className="px-3 py-2.5 text-center text-gray-500 font-mono">
                                    <div className="flex items-center justify-center space-x-1.5">
                                      <input
                                        type="checkbox"
                                        checked={isRowSelected}
                                        onChange={() => handleModalToggleSelectBottomRow(item)}
                                        disabled={!isOperable}
                                        className={`rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] ${
                                          !isOperable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                        title={!isOperable ? '系统检验有问题的，不可操作' : '勾选进行批量处理'}
                                      />
                                      <span>{globalIdx}</span>
                                    </div>
                                  </td>
                                ) : (
                                  <td className="px-3.5 py-2.5 text-center text-gray-500 font-mono">{globalIdx}</td>
                                )}
                                <td className="px-3.5 py-2.5 font-medium text-gray-800">{item.name}</td>
                                <td className="px-3.5 py-2.5 text-gray-600">
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-xs text-[11px]">
                                    {item.platform}
                                  </span>
                                </td>
                                <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px] truncate max-w-md" title={item.url}>
                                  {item.url}
                                </td>
                                <td className="px-3.5 py-2.5 text-center">
                                  {isBlacklist ? (
                                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-xs text-[11px] font-medium inline-flex items-center" title={item.reason}>
                                      <i className="fa-solid fa-ban mr-1 text-red-600"></i> 在我的黑名单
                                    </span>
                                  ) : isManualRemoved ? (
                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-xs text-[11px] font-medium inline-flex items-center">
                                      <i className="fa-solid fa-user-minus mr-1"></i> 人工移除
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-300 rounded-xs text-[11px] font-medium inline-flex items-center" title={item.reason}>
                                      <i className="fa-solid fa-circle-xmark mr-1 text-gray-500"></i> {item.tagText}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3.5 py-2.5 text-center">
                                  {isBlacklist && activeReviewTask.status !== 'imported' ? (
                                    <button
                                      onClick={() => handleModalRemoveBlacklist(item)}
                                      className="text-[#1677ff] hover:text-blue-700 hover:underline text-xs font-medium cursor-pointer inline-flex items-center space-x-1"
                                      title="放回到可导入列表"
                                    >
                                      <i className="fa-solid fa-rotate-left text-[10px]"></i>
                                      <span>放回可导入</span>
                                    </button>
                                  ) : isManualRemoved && activeReviewTask.status !== 'imported' ? (
                                    <button
                                      onClick={() => handleModalRestoreItem(item)}
                                      className="text-[#1677ff] hover:text-blue-700 hover:underline text-xs font-medium cursor-pointer inline-flex items-center space-x-1"
                                      title="放回到可导入列表"
                                    >
                                      <i className="fa-solid fa-rotate-left text-[10px]"></i>
                                      <span>放回可导入</span>
                                    </button>
                                  ) : (
                                    <span className="text-gray-300 text-xs font-mono cursor-not-allowed" title="系统检验有问题，不可操作">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="bg-[#fafafa] px-4 py-2 border-t border-[#e8e8e8] flex items-center justify-between text-xs text-gray-500">
                      <span>
                        显示 <strong className="text-gray-800 font-mono">{modalNonImportableFiltered.length > 0 ? (bottomPage - 1) * bottomPageSize + 1 : 0}</strong> - <strong className="text-gray-800 font-mono">{Math.min(bottomPage * bottomPageSize, modalNonImportableFiltered.length)}</strong> 条，共 <strong className="text-gray-800 font-mono">{modalNonImportableFiltered.length}</strong> 条
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setBottomPage(prev => Math.max(1, prev - 1))}
                          disabled={bottomPage === 1}
                          className="px-2.5 py-1 border border-[#d9d9d9] rounded-xs bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          上一页
                        </button>
                        <span className="font-mono">{bottomPage} / {totalBottomPages} 页</span>
                        <button
                          onClick={() => setBottomPage(prev => Math.min(totalBottomPages, prev + 1))}
                          disabled={bottomPage >= totalBottomPages}
                          className="px-2.5 py-1 border border-[#d9d9d9] rounded-xs bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#fafafa] px-6 py-3 border-t border-[#e8e8e8] flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-500">
                二次核验无误后，点击“确认导入到台账”即可将可导入列表中的{' '}
                <strong className="text-[#1677ff] font-bold font-mono">{activeReviewTask.importableList.length}</strong> 条台账真实添加入库。
              </span>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCloseReviewModal}
                  className="px-4 py-1.5 border border-[#d9d9d9] text-gray-700 hover:bg-gray-100 rounded text-xs cursor-pointer"
                >
                  关闭
                </button>

                {activeReviewTask.status !== 'imported' && (
                  <button
                    onClick={() => handleConfirmAddToLedger(activeReviewTask)}
                    disabled={activeReviewTask.importableList.length === 0}
                    className="px-6 py-1.5 bg-[#1677ff] text-white hover:bg-blue-600 rounded text-xs font-medium cursor-pointer shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    确认导入到台账 ({activeReviewTask.importableList.length}条)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failure Detail Modal */}
      {activeFailureTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-red-50 px-5 py-3.5 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-triangle-exclamation text-base"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-900">文件解析失败详情</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveFailureTask(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg p-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs text-gray-700">
              {/* File Basic Info */}
              <div className="bg-gray-50 border border-gray-200 rounded p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">上传文件名：</span>
                  <span className="font-medium text-gray-800 break-all">{activeFailureTask.fileName}</span>
                </div>
                <div>
                  <span className="text-gray-500">上传时间：</span>
                  <span className="font-mono text-gray-700">{activeFailureTask.uploadTime}</span>
                </div>
              </div>

              {/* Error Explanation Box */}
              <div className="bg-red-50/80 border border-red-200 rounded p-3.5 space-y-1.5">
                <div className="font-bold text-red-800 flex items-center space-x-1.5">
                  <i className="fa-solid fa-circle-xmark text-red-600"></i>
                  <span>错误原因说明</span>
                </div>
                <p className="text-red-700 leading-relaxed font-medium pl-5 text-[11px]">
                  {activeFailureTask.failReason || 'Excel 文件解析失败：未提取到符合规范的表头，请检查文件表头列名与内容。'}
                </p>
              </div>

              {/* Troubleshooting Guidelines */}
              <div className="space-y-2 pt-1">
                <h4 className="font-bold text-gray-800 flex items-center space-x-1.5">
                  <i className="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>常见排查与处理建议：</span>
                </h4>
                <ul className="space-y-1.5 pl-5 list-disc text-gray-600 text-[11px] leading-relaxed">
                  <li>
                    <strong>表头校验失败</strong>：请下载并对照标准《台账导入模板》，确保 Excel 第一行为表头，切勿删除或修改表头名称（必填项：<span className="text-red-600 font-bold">主页地址</span>、<span className="text-red-600 font-bold">所属平台</span>）。
                  </li>
                  <li>
                    <strong>文件格式不符</strong>：请确认上传文件后缀名为 <span className="font-mono text-gray-800 font-bold">.xls</span> 或 <span className="font-mono text-gray-800 font-bold">.xlsx</span>，且文件未设置密码保护或已损坏。
                  </li>
                  <li>
                    <strong>数据有效性</strong>：请勿将普通网页内容直接存为 `.xlsx`，请确认工作表第一页包含有效的文本行数据。
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveFailureTask(null);
                  handleDownloadTemplate();
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-[#1677ff] text-[#1677ff] rounded text-xs font-medium cursor-pointer transition-colors inline-flex items-center space-x-1"
              >
                <i className="fa-solid fa-download text-[11px]"></i>
                <span>下载台账导入模板</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const taskIdToDelete = activeFailureTask.id;
                    setActiveFailureTask(null);
                    handleDeleteTask(taskIdToDelete);
                  }}
                  className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded text-xs cursor-pointer transition-colors"
                >
                  删除此记录
                </button>
                <button
                  onClick={() => {
                    setActiveFailureTask(null);
                    handleSelectFile();
                  }}
                  className="px-4 py-1.5 bg-[#1677ff] text-white hover:bg-blue-600 rounded text-xs font-medium cursor-pointer transition-colors"
                >
                  重新选择文件上传
                </button>
                <button
                  onClick={() => setActiveFailureTask(null)}
                  className="px-3.5 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded text-xs cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock generation helpers
function generateMockImportable(platform: string, instName: string, count: number): ParseImportItem[] {
  const baseItems: ParseImportItem[] = [
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `${instName || '陕西省'}网络安全和信息化委员会办公室官网`,
      platform: '网站',
      url: 'https://www.sxwxb.gov.cn',
      urlType: '台账地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `陕西发布`,
      platform: '微信公众号',
      url: 'https://mp.weixin.qq.com/s/sx_fabu_official',
      urlType: '主页地址',
      tag: 'in_whitelist',
      tagText: '已在白名单',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `陕西广电融媒体集团官方账号`,
      platform: '今日头条',
      url: 'https://www.toutiao.com/c/user/token/sx_guangdian',
      urlType: '主页地址',
      tag: 'in_ledger',
      tagText: '已在台账中',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `群众新闻网`,
      platform: '网站',
      url: 'https://www.sxdaily.com.cn',
      urlType: '台账地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `陕西日报官方微博`,
      platform: '新浪微博',
      url: 'https://weibo.com/sxrb_official',
      urlType: '主页地址',
      tag: 'in_whitelist',
      tagText: '已在白名单',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `陕广新闻`,
      platform: '抖音',
      url: 'https://www.douyin.com/user/MS4wLjABAAAA_sx_news',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `西安发布`,
      platform: '微信公众号',
      url: 'https://mp.weixin.qq.com/s/xian_fabu',
      urlType: '主页地址',
      tag: 'in_whitelist',
      tagText: '已在白名单',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `西安晚报官方头条号`,
      platform: '今日头条',
      url: 'https://www.toutiao.com/c/user/token/xian_wanbao',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `宝鸡政法`,
      platform: '微信公众号',
      url: 'https://mp.weixin.qq.com/s/baoji_zhengfa',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `咸阳宣传`,
      platform: '新浪微博',
      url: 'https://weibo.com/xianyang_xuanchuan',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `铜川融媒`,
      platform: '抖音',
      url: 'https://www.douyin.com/user/MS4wLjABAAAA_tongchuan_rm',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `渭南网`,
      platform: '网站',
      url: 'https://www.wnnews.cn',
      urlType: '台账地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `延安发布`,
      platform: '微信公众号',
      url: 'https://mp.weixin.qq.com/s/yanan_fabu',
      urlType: '主页地址',
      tag: 'in_whitelist',
      tagText: '已在白名单',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `榆林网信`,
      platform: '今日头条',
      url: 'https://www.toutiao.com/c/user/token/yulin_wangxin',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `汉中日报官方微博`,
      platform: '新浪微博',
      url: 'https://weibo.com/hanzhong_daily',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `安康融媒`,
      platform: '抖音',
      url: 'https://www.douyin.com/user/MS4wLjABAAAA_ankang_rm',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `商洛政务网`,
      platform: '网站',
      url: 'https://www.shangluo.gov.cn',
      urlType: '台账地址',
      tag: 'new',
      tagText: '新可导入',
    },
    {
      id: `imp_${Math.random().toString(36).substr(2, 6)}`,
      name: `杨凌融媒体中心`,
      platform: '微信公众号',
      url: 'https://mp.weixin.qq.com/s/yangling_media',
      urlType: '主页地址',
      tag: 'new',
      tagText: '新可导入',
    },
  ];

  return baseItems.slice(0, count);
}

function generateMockNonImportable(platform: string, count: number): ParseImportItem[] {
  const baseItems: ParseImportItem[] = [
    {
      id: `non_${Math.random().toString(36).substr(2, 6)}`,
      name: `违规恶意网络炒作账号A`,
      platform: '抖音',
      url: 'https://www.douyin.com/user/bad_acc_001',
      urlType: '主页地址',
      tag: 'in_blacklist',
      originalTag: 'in_blacklist',
      tagText: '在我的黑名单',
      reason: '已存在于机构黑名单库中，禁止重复导入',
    },
    {
      id: `non_${Math.random().toString(36).substr(2, 6)}`,
      name: `涉错误表述不实账号B`,
      platform: '新浪微博',
      url: 'https://weibo.com/bad_acc_002',
      urlType: '主页地址',
      tag: 'in_blacklist',
      originalTag: 'in_blacklist',
      tagText: '在我的黑名单',
      reason: '已存在于机构黑名单库中，禁止重复导入',
    },
    {
      id: `non_${Math.random().toString(36).substr(2, 6)}`,
      name: `仿冒政务公众号C`,
      platform: '微信公众号',
      url: 'https://mp.weixin.qq.com/s/fake_gov_003',
      urlType: '主页地址',
      tag: 'in_blacklist',
      originalTag: 'in_blacklist',
      tagText: '在我的黑名单',
      reason: '已存在于机构黑名单库中，禁止重复导入',
    },
    {
      id: `non_${Math.random().toString(36).substr(2, 6)}`,
      name: `测试异常域名网站D`,
      platform: '网站',
      url: 'http://invalid-domain-test.local/index.html',
      urlType: '台账地址',
      tag: 'invalid_url',
      tagText: '格式异常',
      reason: '台账网址格式非法或无法连通访问',
    },
    {
      id: `non_${Math.random().toString(36).substr(2, 6)}`,
      name: `缺失主页链接账号E`,
      platform: '今日头条',
      url: '-',
      urlType: '主页地址',
      tag: 'invalid_url',
      tagText: '缺失链接',
      reason: '缺少有效的主页/台账地址信息',
    },
    {
      id: `non_${Math.random().toString(36).substr(2, 6)}`,
      name: `批次重复账号F`,
      platform: '微信公众号',
      url: 'https://mp.weixin.qq.com/s/sx_fabu_official',
      urlType: '主页地址',
      tag: 'duplicate',
      tagText: '批次重复',
      reason: '与本次导入文件中第 2 条数据完全重复',
    },
  ];

  return baseItems.slice(0, count);
}
