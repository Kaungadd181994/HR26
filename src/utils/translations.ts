export interface LangDictionary {
  // Navigation & Shell
  dashboard: string;
  employees: string;
  salaryPortal: string;
  disbursements: string;
  repayments: string;
  corporateHrPortal: string;
  hrCheckerMode: string;
  languageSelect: string;

  // Employees Screen
  workforceCtrl: string;
  workforceSubtitle: string;
  directoryTab: string;
  controlTab: string;
  searchPlaceholder: string;
  deptFilterText: string;
  statusFilterText: string;
  ewaAccessText: string;
  registerBtn: string;
  hideFormBtn: string;

  // Add individual Form
  registerTitle: string;
  personnelName: string;
  departmentLabel: string;
  salaryLabel: string;
  statusCode: string;
  activeService: string;
  terminatedService: string;
  conflictService: string;
  customActionTitle: string;
  customActionDesc: string;
  preApproveEwa: string;
  preApproveEwaDesc: string;
  cancelBtn: string;
  createBtn: string;

  // Table Columns
  colEmpId: string;
  colName: string;
  colDept: string;
  colGrossSalary: string;
  colEwaGateway: string;
  colLifecycle: string;
  colActions: string;
  actionModify: string;

  // Edit Modal Window
  modifyTitle: string;
  modifySubtitle: string;
  uniqueCode: string;
  workerFullname: string;
  monthlyGross: string;
  accountLifecycle: string;
  whitelistedEwa: string;
  discardChanges: string;
  saveChanges: string;

  // Enterprise / Bulk update view
  bulkEngineTitle: string;
  bulkEngineSubtitle: string;
  targetDept: string;
  salaryMultiplier: string;
  forceLifecycle: string;
  forceEwaAccess: string;
  irreversibleNotice: string;
  irreversibleNoticeDesc: string;
  resetBtn: string;
  executeBulkBtn: string;
  quickAuditsTitle: string;
  quickAuditsSubtitle: string;
  deploySyncBtn: string;
  deploySyncDesc: string;
  triggerScanBtn: string;
  triggerScanDesc: string;
  cleanSandboxBtn: string;
  cleanSandboxDesc: string;
  regulatoryAdvisoryTitle: string;
  regulatoryAdvisoryDesc: string;

  // Disbursement screen
  clearedCapital: string;
  clearedCapitalDesc: string;
  awaitingSettle: string;
  awaitingSettleDesc: string;
  networkProtocolTitle: string;
  networkProtocolDesc: string;
  clearanceLedgerTitle: string;
  clearanceLedgerSubtitle: string;
  forceSettleBtn: string;
  settleRef: string;
  clearingRoute: string;
  withholdingTax: string;
  netWiredPayout: string;
  verifyAuditBtn: string;
  closeReportBtn: string;
}

export const translations: Record<'en' | 'mm', LangDictionary> = {
  en: {
    dashboard: "Dashboard",
    employees: "Workforce Control",
    salaryPortal: "Salary Portal",
    disbursements: "Disbursements",
    repayments: "Repayments",
    corporateHrPortal: "Corporate HR Control",
    hrCheckerMode: "HR Checker Mode",
    languageSelect: "Language",

    workforceCtrl: "Enterprise Workforce Control Console",
    workforceSubtitle: "Add individuals, execute batch corporate transformations, and control salary-advance permissions.",
    directoryTab: "Workforce Directory",
    controlTab: "Enterprise Control Center",
    searchPlaceholder: "Query name or ID code...",
    deptFilterText: "Dept :",
    statusFilterText: "Lifecycle :",
    ewaAccessText: "EWA Access :",
    registerBtn: "Register New Employee",
    hideFormBtn: "Hide Creator Form",

    registerTitle: "Register Individual & Trigger Integrations",
    personnelName: "Personnel Name",
    departmentLabel: "Department",
    salaryLabel: "Monthly Salary (MMK)",
    statusCode: "Status Code",
    activeService: "Active Service",
    terminatedService: "Terminated/Offboarded",
    conflictService: "Status Under Dispute",
    customActionTitle: "Dynamic Automation Custom Action",
    customActionDesc: "The selected task executes immediately upon successful system authorization.",
    preApproveEwa: "Pre-approve Earned Wage Access (EWA Whitelist)",
    preApproveEwaDesc: "Allows immediate early salary withdrawals as soon as cycle tracking begins.",
    cancelBtn: "Cancel Action",
    createBtn: "Authorize & Create Employee",

    colEmpId: "Employee ID",
    colName: "Full Name",
    colDept: "Department",
    colGrossSalary: "Monthly Salary (Gross)",
    colEwaGateway: "EWA Access Gateway",
    colLifecycle: "Operational Lifecycle",
    colActions: "Actions Hub",
    actionModify: "Modify Details",

    modifyTitle: "Modify Employee Parameters",
    modifySubtitle: "Edit core salaries, whitelists, and lifecycle categories on-the-fly.",
    uniqueCode: "Employee Unique Code",
    workerFullname: "Worker Full Name",
    monthlyGross: "Monthly gross (MMK)",
    accountLifecycle: "Account Lifecycle Code",
    whitelistedEwa: "Whitelisted for EWA access",
    discardChanges: "Discard Changes",
    saveChanges: "Save & Apply Changes",

    bulkEngineTitle: "Bulk Adjustments Engine",
    bulkEngineSubtitle: "Apply macro factors across specific divisions in one action.",
    targetDept: "Target Department",
    salaryMultiplier: "Base Salary Multiplier Bumps",
    forceLifecycle: "Force Account Lifecycle State",
    forceEwaAccess: "Force Whitelist Portal Access",
    irreversibleNotice: "Irreversible Action Notice",
    irreversibleNoticeDesc: "Applying these factors directly recalculates database records. These operations form part of telemetry audit trail.",
    resetBtn: "Reset Defaults",
    executeBulkBtn: "Execute Batch Update",
    quickAuditsTitle: "Enterprise Quick Audits",
    quickAuditsSubtitle: "Run administrative scripts over database state.",
    deploySyncBtn: "Deploy Central Bank Sync (CBM)",
    deploySyncDesc: "Scans and automatically whitelists compliant active employees under central legal guidelines.",
    triggerScanBtn: "Trigger Immediate Compliance Scan",
    triggerScanDesc: "Automates checking to verify dynamic 50% legal cap constraints for current month's advances.",
    cleanSandboxBtn: "Deep Cleanse Sandbox State",
    cleanSandboxDesc: "Clears any corrupt draft sessions and enforces strict identity state.",
    regulatoryAdvisoryTitle: "Real-time CBM EWA Rules",
    regulatoryAdvisoryDesc: "Earned Wage Access represents pro-rated accrued salary for services already rendered. Early release avoids generating interest debt spirals.",

    clearedCapital: "Wired Capital (Released)",
    clearedCapitalDesc: "Liquid advance cache cleared over audited merchant accounts.",
    awaitingSettle: "Awaiting Batch Settle",
    awaitingSettleDesc: "Early wage drafts flagged for batch clearing.",
    networkProtocolTitle: "Standard Network Protocols",
    networkProtocolDesc: "Transactions comply fully with the Myanmar Central Bank (CBM) retail pay system guidelines.",
    clearanceLedgerTitle: "Wage Clearance Batch Ledgers",
    clearanceLedgerSubtitle: "Audit advanced requests, monitor clearing routes, and trigger immediate ISO bank settlement.",
    forceSettleBtn: "Force Instant Settle All",
    settleRef: "Settle Ref",
    clearingRoute: "Clearing Route (Wallet/Bank)",
    withholdingTax: "Tax Fee (2%)",
    netWiredPayout: "Net Wired Payout",
    verifyAuditBtn: "Verify Audit",
    closeReportBtn: "Close Report"
  },
  mm: {
    dashboard: "ပင်မမျက်နှာစာ",
    employees: "ဝန်ထမ်းထိန်းချုပ်မှု",
    salaryPortal: "လစာထုတ်ယူမှု စနစ်",
    disbursements: "ငွေထုတ်ပေးမှု မှတ်တမ်း",
    repayments: "လစာပြန်လည်ပေးသွင်းမှု",
    corporateHrPortal: "ကော်ပိုရိတ် HR ထိန်းချုပ်ရေးစင်တာ",
    hrCheckerMode: "HR စစ်ဆေးသူစနစ်",
    languageSelect: "ဘာသာစကား",

    workforceCtrl: "လုပ်ငန်းခွင် ဝန်ထမ်းစီမံခန့်ခွဲမှုစနစ် (Workforce Console)",
    workforceSubtitle: "ဝန်ထမ်းအသစ်စာရင်းသွင်းရန်၊ တစ်စုတစ်ပေါင်းတည်းပြောင်းလဲမှုများပြုလုပ်ရန်နှင့် လစာကြိုထုတ်ခွင့် (EWA) ကို ကွပ်ကဲရန်။",
    directoryTab: "ဝန်ထမ်းများလမ်းညွှန်းစာအုပ်",
    controlTab: "လုပ်ငန်းစုကြီးကြပ်ရေးဗဟို (Enterprise Center)",
    searchPlaceholder: "နာမည် သို့မဟုတ် ကုဒ်ဖြင့် ရှာဖွေရန်...",
    deptFilterText: "ဌာန :",
    statusFilterText: "အလုပ်အဆင့်အတန်း :",
    ewaAccessText: "လစာကြိုထုတ်ခွင့် (EWA) :",
    registerBtn: "ဝန်ထမ်းသစ် မှတ်ပုံတင်ရန်",
    hideFormBtn: "ဖောင်ပိတ်ရန်",

    registerTitle: "ဝန်ထမ်းတစ်ဦးချင်းစီသစ် ရေးသွင်းခြင်းနှင့် လုပ်ငန်းအလိုအလျောက်ချိတ်ဆက်မှုများ နှိုးဆော်ခြင်း",
    personnelName: "ဝန်ထမ်းအမည်",
    departmentLabel: "လုပ်ငန်းဌာန",
    salaryLabel: "လစဉ်အခြေခံလစာ (မြန်မာကျပ်ငွေ)",
    statusCode: "ဝန်ထမ်းအလုပ်အခြေအနေကုဒ်",
    activeService: "လက်ရှိတာဝန်ထမ်းဆောင်ဆဲ (Active)",
    terminatedService: "အလုပ်မှရပ်စဲပြီး (Terminated)",
    conflictService: "အငြင်းပွားဖွယ်ရာအခြေအနေ (Dispute State)",
    customActionTitle: "ဒိုင်းနမစ် ဉာဏ်ရည်လုပ်ငန်းစနစ်ဆန်း (Dynamic Quick Action)",
    customActionDesc: "သတ်မှတ်ခွင့်ပြုချက် အတည်ပြုပြီးသည်နှင့် ရွေးချယ်ထားသော ဆင့်ပွားအလိုအလျောက်လုပ်ငန်းများကို ချက်ချင်းစတင်မည်။",
    preApproveEwa: "လစာစောထုတ်ခွင့် ကြိုတင်ခွင့်ပြုရန် (EWA Whitelist)",
    preApproveEwaDesc: "လစာသံသရာခြေရာခံစနစ် စတင်သည်နှင့်တစ်ပြိုင်နက် လစာစောထုတ်ယူခွင့်ကို ချက်ချင်းရရှိစေမည်။",
    cancelBtn: "ပယ်ဖျက်ရန်",
    createBtn: "ဝန်ထမ်းသစ်စာရင်းအခြေပြု သိမ်းဆည်းရန်",

    colEmpId: "ဝန်ထမ်း ကုဒ်အိုင်ဒီ",
    colName: "အမည်အပြည့်အစုံ",
    colDept: "ဌာနခွဲ",
    colGrossSalary: "လစဉ်စုစုပေါင်းလစာ (Gross Price)",
    colEwaGateway: "EWA ခွင့်ပြုချက်အဆင့်အတန်း",
    colLifecycle: "လုပ်ငန်းခွင် အခြေအနေ",
    colActions: "လုပ်ဆောင်ချက်ဗဟိုခလုတ်",
    actionModify: "အချက်အလက်ပြင်ဆင်ရန်",

    modifyTitle: "ဝန်ထမ်း၏ ကိုယ်ရေးအချက်အလက်များကို ပြင်ဆင်ရန်",
    modifySubtitle: "အခြေခံလစာများ၊ ခွင့်ပြုချက်များနှင့် လုပ်ငန်းခွင်အဆက်အစပ်များကို လိုအပ်သလို အဆင်ပြေစွာ ပြောင်းလဲပြင်ဆင်နိုင်သည်။",
    uniqueCode: "ဝန်ထမ်းတစ်ဦးချင်းစီ၏ ကိုယ်ပိုင်ကုဒ်",
    workerFullname: "ဝန်ထမ်း အမည်အပြည့်အစုံ",
    monthlyGross: "လစဉ် စုစုပေါင်းလစာ (Gross MMK)",
    accountLifecycle: "အကောင့်ဝင်ရောက်မှု အဆင့်သတ်မှတ်ချက်",
    whitelistedEwa: "လစာစောထုတ်ယူခွင့်စနစ် (EWA) ခွင့်ပြုထားသည်",
    discardChanges: "ပြင်ဆင်မှုများအား ပယ်ဖျက်ရန်",
    saveChanges: "ပြင်ဆင်ထားသည်များကို သိမ်းဆည်းရန်",

    bulkEngineTitle: "အစုအပုံလိုက် ပြင်ဆင်မှု အင်ဂျင်ကြီး (Bulk Update Engine)",
    bulkEngineSubtitle: "ဌာနခွဲအလိုက် သို့မဟုတ် ဝန်ထမ်းအဆင့်အလိုက် တွက်ချက်မှုနှုန်းထားများကို တစ်ချက်တည်းဖြင့် ပြောင်းလဲရန်။",
    targetDept: "ပစ်မှတ်ထားသောလုပ်ငန်းဌာန",
    salaryMultiplier: "အခြေခံလစာ မြှောက်ဖော်ကိန်း တိုးမြှင့်မှု",
    forceLifecycle: "လုပ်ငန်းခွင်ဘဝစက်ဝန်းကို အာဏာသက်ရောက်စေရန်",
    forceEwaAccess: "EWA လစာကြိုထုတ်ခွင့်ကို အတင်းအကျပ်ပြောင်းလဲရန်",
    irreversibleNotice: "အရေးကြီးသတိပေးချက်",
    irreversibleNoticeDesc: "ဤတွက်ချက်နှုန်းများကို အတည်ပြုပါက စနစ်အတွင်းရှိ လက်ရှိဝန်ထမ်းအားလုံး၏ အချက်အလက်များကို တိုက်ရိုက်ပြန်လည်ပြင်ဆင်တွက်ချက်သွားမည်ဖြစ်ပြီး စာရင်းစစ်မှတ်တမ်းတွင် ထည့်သွင်းသိမ်းဆည်းမည်။",
    resetBtn: "မူလအတိုင်းပြန်ထားရန်",
    executeBulkBtn: "အစုလိုက်အပြုံလိုက် အတည်ပြုထိန်းချုပ်ရန်",
    quickAuditsTitle: "အမြန် စာရင်းစစ်စနစ်နှင့် ဖြတ်လမ်းနည်းများ",
    quickAuditsSubtitle: "စနစ်ဒေတာဘေ့စ်တစ်ခုလုံးအပေါ် အုပ်ချုပ်ရေးဆိုင်ရာစုံစမ်းမှုများကို ချက်ချင်းလုပ်ဆောင်ရန်။",
    deploySyncBtn: "ဗဟိုဘဏ်စည်းမျဉ်း သဟဇာတဖြစ်မှုစနစ် ညှိနှိုင်းရန် (CBM Sync)",
    deploySyncDesc: "ဗဟိုဘဏ်၏ တရားဝင်လမ်းညွှန်ချက်များနှင့်အညီ တာဝန်ထမ်းဆောင်ဆဲ ဝန်ထမ်းများကို EWA အလိုအလျောက် ခွင့်ပြုပေးသည်။",
    triggerScanBtn: "ချက်ချင်းဖြစ်တည်မှု စည်းမျဉ်းကိုက်ညီမှု စစ်ဆေးရန်",
    triggerScanDesc: "သတ်မှတ်ထားသော ယခုလ၏ ၅၀% အမြင့်ဆုံး လစာကြိုထုတ်ထုတ်ယူမှု ကန့်သတ်ချက် ပြည့်မပြည့် စနစ်မှ စစ်ဆေးပေးမည်။",
    cleanSandboxBtn: "စမ်းသပ်မှုပတ်ဝန်းကျင် သန့်ရှင်းရေးပြုလုပ်ရန် (Clean Space)",
    cleanSandboxDesc: "မပြည့်စုံသော ဒရက်ဖ်ငွေလွှဲမှုများနှင့် ပြဿနာရှိသော စာရင်းအချက်အလက်ဟောင်းများကို ဖယ်ရှားရှင်းလင်းပေးမည်။",
    regulatoryAdvisoryTitle: "မြန်မာနိုင်ငံတော်ဗဟိုဘဏ် EWA စည်းမျဉ်းများ",
    regulatoryAdvisoryDesc: "EWA (Earned Wage Access) သည် ဝန်ထမ်းများ လုပ်ကိုင်ပြီးစီးခဲ့သည့် ရက်ပိုင်းလစာကို ကြိုတင်ထုတ်ယူခွင့် ဖြစ်ပါသည်။ တရားမဝင် လစာတိုးချေးငွေစနစ်များကဲ့သို့ အတိုးတွက်ချက်ခြင်းမရှိသဖြင့် ကြွေးမြီသံသရာ မဖြစ်ပေါ်စေပါ။",

    clearedCapital: "အမှန်ထုတ်ပေးပြီးသော ရန်ပုံငွေ (Wired Capital)",
    clearedCapitalDesc: "အတည်ပြုစစ်ဆေးပြီးသော လုပ်ငန်းရှင်ငွေစာရင်းမှ လွှဲပြောင်းပေးပြီးသော စုစုပေါင်းပမာဏ။",
    awaitingSettle: "လစာတွဲဖက် အတည်ပြုရန် စောင့်ဆိုင်းနေသော ပမာဏ",
    awaitingSettleDesc: "အုပ်စုလိုက် ငွေရှင်းရန် စောင့်ဆိုင်းနေသော လစာစောထုတ်ယူမှု ဒရက်ဖ်စာရင်းများ။",
    networkProtocolTitle: "စနစ် စံနှုန်းသတ်မှတ်ချက်များ",
    networkProtocolDesc: "ငွေကြေးလွှဲပြောင်းမှုအားလုံးသည် မြန်မာနိုင်ငံတော်ဗဟိုဘဏ် (CBM) ၏ လက်လီငွေပေးချေမှုစနစ် စံညွှန်များနှင့်အညီ ဆောင်ရွက်ပါသည်။",
    clearanceLedgerTitle: "လစာထုတ်ပေးမှု စာရင်းဇယားနှင့် စာရင်းစစ်ချုပ် (Batch Ledgers)",
    clearanceLedgerSubtitle: "လစာကြိုထုတ်မှု တောင်းဆိုချက်များကို စစ်ဆေးရန်၊ ငွေလွှဲပေးမည့်လမ်းကြောင်းများကို ခြေရာခံရန်နှင့် ISO ဘဏ်စနစ် ချိတ်ဆက်ရှင်းလင်းရန်။",
    forceSettleBtn: "တင်ပြထားသည့်အားလုံးကို ချက်ချင်းငွေလွှဲစနစ်အတည်ပြုရန်",
    settleRef: "ငွေလွှဲ ရည်ညွှန်းကုဒ် (Settle Ref)",
    clearingRoute: "ငွေရှင်းလွှဲပြောင်းရာ ဘဏ်/မိုဘိုင်းပိုက်ဆံအိတ်",
    withholdingTax: "ဝင်ငွေခွန် ထိန်းသိမ်းငွေ (၂%)",
    netWiredPayout: "ဝန်ထမ်းလက်ဝယ် ရရှိမည့် အသားတင်ငွေ (Net Net)",
    verifyAuditBtn: "စာရင်းစစ်အစီရင်ခံစာ ကြည့်ရန်",
    closeReportBtn: "အစီရင်ခံစာ ပိတ်ရန်"
  }
};
