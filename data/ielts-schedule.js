/* 内置课表已按用户要求清空（2026-11-15）：全部课程改为在课表空白处自行排课。
   旧数据仍备份在浏览器 localStorage 的 ielts_plan_v3 / 项目 git 快照里。
   window.IELTS_SCHEDULE 结构保留，避免旧脚本读不到时报错。 */
window.IELTS_SCHEDULE = {
  student: '',
  from: '',
  to: '',
  syncedAt: '',
  link: '',
  meeting: '',
  lessons: []
};
