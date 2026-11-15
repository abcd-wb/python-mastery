#!/bin/bash
# 双击运行：把 /Applications 里还没分组的新应用，自动收进「应用分组」对应分组
cd "$(dirname "$0")"

echo "============================================"
echo "  应用分组 · 自动归位"
echo "============================================"
echo

python3 tools/appgroups_sync.py --dry-run
echo
read -r -p "确认按上面的结果加入？(y 回车确认 / 直接回车取消) " ans
if [ "$ans" = "y" ] || [ "$ans" = "Y" ]; then
  echo
  python3 tools/appgroups_sync.py
  echo
  echo "完成。打开桌面上的「应用分组」就能看到。"
else
  echo "已取消，没有改动。"
fi
echo
read -r -p "按回车关闭窗口…" _
