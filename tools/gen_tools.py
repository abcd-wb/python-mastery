#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把尚硅谷《Git 企业实战》《JavaWeb》两门工具/扩展课加入 data/tools.js。
分P数据直取 B 站官方接口，按标题关键字分组。幂等：已存在则跳过。
用法：python3 tools/gen_tools.py
"""
import json
import urllib.request

API = 'https://api.bilibili.com/x/web-interface/view?bvid='
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/126 Safari/537.36',
      'Referer': 'https://www.bilibili.com/'}

# 每门课：(bvid, 章节规则[(上界序号, 章名, 说明)], why, how)
# 章节按分P序号区间划分
DEFS = [
    dict(
        id='git', bv='BV1NK421Y7XZ',
        title='尚硅谷《Git 企业实战》', sub='2024 最新版 · Git + GitLab 全流程 · 40 集',
        teacher='尚硅谷', platform='B 站（页面内直接播放）',
        lang='全中文', cost='免费',
        why='程序员必备的版本控制工具：从本地仓库、分支合并、冲突解决，到 GitLab 企业级协作、Code Review、CI/CD 自动部署。'
            '写代码迟早要协作和回退版本，这门工具课一天就能拿下，越早学越省事。',
        how='它不是编程课，是工具课：跟着敲一遍 add/commit/push/pull、建分支、制造一次冲突再解决，就够用了。'
            'GitLab 部署与 runner 部分了解即可，用到再回头查。',
        chapters=[(1, 4, 'Git 入门', '课程介绍、版本控制的意义、安装与工具选择'),
                  (5, 10, '本地仓库与基础命令', '用户签名、初始化、提交、版本穿梭、reset 逻辑'),
                  (11, 17, '客户端与分支协作', '客户端操作、远程仓库、Gitee、IDEA 集成、分支冲突与合并'),
                  (18, 26, 'GitLab 基础', '极狐 GitLab 优势与安装、登录、人员群组、仓库与权限、合并请求'),
                  (27, 35, '企业工作流与冲突实战', '企业开发工作流、项目初始化、各类冲突场景、Code Review'),
                  (36, 40, 'CI/CD 与总结', 'runner 安装注册、SpringBoot 自动部署、安全扫描、课程总结')],
    ),
    dict(
        id='javaweb', bv='BV1AS4y177xJ',
        title='尚硅谷《JavaWeb》', sub='全新技术栈 · 全程实战 · 89 集',
        teacher='尚硅谷', platform='B 站（页面内直接播放）',
        lang='全中文', cost='免费',
        why='Java Web 开发完整入门：前端三件套（HTML/CSS/JS）、Tomcat 与 Servlet、会话跟踪、MVC 分层、'
            'Filter/Listener、三个实战项目（库存管理、QQZone、书城），最后接 Vue + Axios。想走 Java 后端方向，这是地基。',
        how='这是 Java 方向，不是 Python 路线：前端三件套可快速过，重点在 Servlet 原理、MVC 思想和手写 IOC，'
            '以及最后书城项目（Vue + Axios + 事务）串起整条链。每个项目自己再改一遍需求。',
        chapters=[(1, 7, 'HTML 基础', '教程简介、HTML 介绍、基础标签、表格、表单、框架与总结'),
                  (8, 11, 'CSS', 'CSS 语法、盒子模型、布局、静态页面实现'),
                  (12, 17, 'JavaScript', 'JS 语法、鼠标交互实战、购物车计算、作业与总结'),
                  (18, 20, 'Web 基础与 Tomcat', 'CS/BS 异同、Tomcat 新建部署运行、IDEA 下 JavaWeb 项目'),
                  (21, 34, 'Servlet', '请求参数、中文乱码、继承关系、生命周期、HTTP、Session、转发重定向、Thymeleaf、路径'),
                  (35, 39, '项目实战一：库存管理', '编辑修改、删除添加、分页、关键字查询、复习'),
                  (40, 55, 'MVC 架构进阶', 'Servlet 优化、DispatcherServlet、IOC、Service 引入、Filter、事务管理、Listener'),
                  (56, 68, '项目实战二：QQZone', '需求与数据库设计、DAO/Service/Controller、登录、日志列表与详情、回复管理、通用代码导出'),
                  (69, 76, '项目实战三：书城（上）', '需求分析、ER 图、登录、图书列表、购物车、结账、订单、过滤器'),
                  (77, 89, '书城（下）与 Vue/Axios', 'Cookie、验证码、正则、表单验证、AJAX、Vue 快速入门、Axios、购物车改造')],
    ),
]


def fetch(bv):
    d = json.load(urllib.request.urlopen(urllib.request.Request(API + bv, headers=UA), timeout=30))
    if d.get('code') != 0:
        raise RuntimeError('%s: %s' % (bv, d.get('message')))
    return d['data']['pages']


def build(c):
    pages = fetch(c['bv'])
    chapters, out = [], []
    for i, (a, b, name, desc) in enumerate(c['chapters'], 1):
        chapters.append({'id': 't%d' % i, 'n': '第%d章' % i, 'name': name,
                         'from': a, 'to': min(b, len(pages)), 'desc': desc})
    for i, pg in enumerate(pages, 1):
        ch = chapters[-1]['id']
        for cch in chapters:
            if cch['from'] <= i <= cch['to']:
                ch = cch['id']
                break
        out.append({'p': i, 't': pg['part'].strip(), 'ch': ch, 'd': int(pg['duration'])})
    secs = sum(p['d'] for p in out)
    return {
        'id': c['id'], 'bv': c['bv'], 'title': c['title'], 'sub': c['sub'],
        'teacher': c['teacher'], 'platform': c['platform'],
        'url': 'https://www.bilibili.com/video/%s/' % c['bv'],
        'lang': c['lang'], 'cost': c['cost'],
        'length': '%d 集 · 约 %.1f 小时' % (len(out), secs / 3600.0),
        'secs': secs, 'why': c['why'], 'how': c['how'],
        'chapters': chapters, 'pages': out,
    }


def main():
    path = 'data/tools.js'
    out = {}
    for c in DEFS:
        out[c['id']] = build(c)
        print('%-9s %d 集  %.1f 小时' % (c['id'], len(out[c['id']]['pages']), out[c['id']]['secs'] / 3600))
    js = ['/* 工具/扩展课：尚硅谷 Git、JavaWeb —— 由 tools/gen_tools.py 从 B 站官方接口生成，勿手改 */',
          '(function (W) {',
          '  var M = W.TOOLS_COURSES = ' + json.dumps(out, ensure_ascii=False, indent=1).replace('\n', '\n  ') + ';',
          '  var C = W.COURSES || (W.COURSES = {});',
          '  for (var k in M) C[k] = M[k];',
          '})(window);',
          '']
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(js))
    print('写出 data/tools.js')


if __name__ == '__main__':
    main()
