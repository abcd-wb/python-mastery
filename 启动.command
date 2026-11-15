#!/bin/bash
# 双击运行：启动本地服务（资料库 / 词库 / 识图 / 唤起雅思哥）
cd "$(dirname "$0")"
PORT=8101

# 已经在跑：直接开页面，不再起第二个（否则会报端口被占用）
if curl -s -m 1 -o /dev/null "http://127.0.0.1:$PORT/api/files/ping"; then
  echo "服务已经在运行，直接打开页面。"
  open "http://127.0.0.1:$PORT/hub.html"
  exit 0
fi

# 每次启动顺手把没分组的应用收进去（静默，秒级完成）
if [ -f "tools/appgroups_sync.py" ]; then
  python3 "tools/appgroups_sync.py" >/tmp/appgroups-sync.log 2>&1
fi

echo "正在启动…"
python3 serve.py $PORT &
SRV=$!

# 等服务真的能应答，再开浏览器 —— 否则页面先开、接口还没起来，会显示“连不上本地服务”
for i in $(seq 1 60); do
  if curl -s -m 1 -o /dev/null "http://127.0.0.1:$PORT/api/files/ping"; then
    break
  fi
  sleep 0.2
done

open "http://127.0.0.1:$PORT/hub.html"
echo "服务已启动：http://127.0.0.1:$PORT/hub.html"
echo "（这个窗口关掉，服务就停了）"

wait $SRV
