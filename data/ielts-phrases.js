/* 雅思高分句型库：按话题分，写作 + 口语各若干条，配英文语音与造句练习 */
window.IELTS_PHRASES = {
  topics: [
    { id: 'edu', name: '教育', en: 'Education' },
    { id: 'env', name: '环境', en: 'Environment' },
    { id: 'tech', name: '科技', en: 'Technology' },
    { id: 'work', name: '工作', en: 'Work' },
    { id: 'health', name: '健康', en: 'Health' },
    { id: 'gov', name: '政府', en: 'Government' },
    { id: 'city', name: '城市', en: 'Cities' },
    { id: 'media', name: '媒体', en: 'Media' }
  ],
  items: [
    /* ---------- 教育 ---------- */
    { id: 'e1', topic: 'edu', kind: 'writing', en: 'One of the strongest arguments in favour of free university education is that it allows talent to be rewarded rather than wealth.', zh: '支持大学免费教育最有力的论据之一是：它让才华而不是财富成为被奖励的东西。', use: 'Task 2 开头段表态' },
    { id: 'e2', topic: 'edu', kind: 'writing', en: 'While it is true that examinations measure little more than memory, this does not mean that they are worthless.', zh: '虽然考试测的几乎只是记忆力，但这并不意味着它一无是处。', use: '让步段（While it is true that…, this does not mean that…）' },
    { id: 'e3', topic: 'edu', kind: 'writing', en: 'A further consideration is the extent to which schools prepare students for a labour market that is changing faster than any curriculum.', zh: '还有一个考虑是：学校在多大程度上让学生准备好面对一个变化快过任何课程的市场。', use: '主体段第二点，句首过渡' },
    { id: 'e4', topic: 'edu', kind: 'writing', en: 'Unless governments invest in vocational training, the gap between graduates and available jobs will continue to widen.', zh: '如果政府不投资职业培训，毕业生与可用岗位之间的差距会继续扩大。', use: '结论段提建议（Unless…, … will continue to）' },
    { id: 'e5', topic: 'edu', kind: 'speaking', en: 'I would say the biggest difference is the pace — at school someone tells you what to do next, whereas at university you have to plan it yourself.', zh: '我觉得最大的差别是节奏：中学有人告诉你下一步做什么，大学得自己安排。', use: 'Part 3 对比类问题' },

    /* ---------- 环境 ---------- */
    { id: 'v1', topic: 'env', kind: 'writing', en: 'The damage caused by single-use plastics is now so visible that even industries that depend on them have begun to look for alternatives.', zh: '一次性塑料造成的破坏已经明显到连依赖它的行业都开始寻找替代品。', use: 'Task 2 举例开头（so … that）' },
    { id: 'v2', topic: 'env', kind: 'writing', en: 'Taxing flights would be unpopular, but it would be effective: demand for air travel responds strongly to price.', zh: '对航班征税会不受欢迎，但有效：航空需求对价格反应很强。', use: '评价政策（让步 + 冒号解释）' },
    { id: 'v3', topic: 'env', kind: 'writing', en: 'It is often assumed that individual action is enough, yet the figures suggest that industrial emissions dwarf household ones.', zh: '人们常以为个人行动就够了，但数据表明工业排放远超家庭排放。', use: '反驳常见观点（It is often assumed that…, yet…）' },
    { id: 'v4', topic: 'env', kind: 'writing', en: 'Unless recycling is made convenient, most people will simply not do it, however strongly they agree with the principle.', zh: '除非回收变得方便，否则即使再认同这个理念，多数人也不会做。', use: '结论段（Unless…, … however + adj）' },
    { id: 'v5', topic: 'env', kind: 'speaking', en: 'Where I live, this is a fairly new issue — ten years ago nobody talked about it, but now it comes up in every conversation about the city.', zh: '在我住的地方，这是近几年才有的问题：十年前没人提，现在每个关于城市的话题都会说到。', use: 'Part 3 谈变化' },

    /* ---------- 科技 ---------- */
    { id: 't1', topic: 'tech', kind: 'writing', en: 'What matters is not how much data a company collects, but whether the people it belongs to have any say in how it is used.', zh: '重要的不是公司收集多少数据，而是数据所属的人对它的用途有没有发言权。', use: 'Task 2 转折定义（What matters is not…, but whether…）' },
    { id: 't2', topic: 'tech', kind: 'writing', en: 'Automation has already replaced routine work in manufacturing; the question now is whether it will do the same to office work.', zh: '自动化已经取代了制造业的常规工作；现在的问题是它会不会对办公室工作做同样的事。', use: '主体段举例（分号连接两个分句）' },
    { id: 't3', topic: 'tech', kind: 'writing', en: 'It would be naive to pretend that these tools are neutral: the way they are designed shapes the way we think.', zh: '假装这些工具是中立的就太天真了：它们的设计方式塑造了我们的思考方式。', use: '表达立场（It would be naive to pretend that…）' },
    { id: 't4', topic: 'tech', kind: 'writing', en: 'The benefit is real but unevenly distributed, which is precisely why regulation matters.', zh: '好处是真的，但分配不均——这正是监管重要的原因。', use: '段落收尾（…, which is precisely why…）' },
    { id: 't5', topic: 'tech', kind: 'speaking', en: 'I use it every day, but I would not say I depend on it — if it disappeared tomorrow I would manage, just more slowly.', zh: '我每天都用，但不会说离不开它：明天没了我也能对付，只是慢一点。', use: 'Part 1 谈习惯（but I would not say…）' },

    /* ---------- 工作 ---------- */
    { id: 'w1', topic: 'work', kind: 'writing', en: 'For many employees, flexibility matters more than a small rise in salary, because time is the one thing money cannot buy back.', zh: '对很多员工来说，弹性比小幅涨薪更重要，因为时间是钱买不回来的。', use: 'Task 2 论证原因（because 从句）' },
    { id: 'w2', topic: 'work', kind: 'writing', en: 'Working from home suits some tasks and ruins others; a sensible employer lets the type of work decide.', zh: '远程办公适合某些工作、毁掉另一些；明智的雇主让工作性质来决定。', use: '折中观点（分号 + 具体化）' },
    { id: 'w3', topic: 'work', kind: 'writing', en: 'Those who argue that young people change jobs too often tend to overlook how rarely the alternative — a job for life — still exists.', zh: '认为年轻人跳槽太频繁的人，往往忽略了一点：“一份工作干一辈子”这种情况已经很少见了。', use: '反驳（Those who argue that… tend to overlook…）' },
    { id: 'w4', topic: 'work', kind: 'writing', en: 'In the long run, a workforce that is constantly exhausted is cheaper to hire and more expensive to keep.', zh: '长期看，一支长期疲惫的劳动力招起来便宜，留起来贵。', use: '结论句（In the long run, …）' },
    { id: 'w5', topic: 'work', kind: 'speaking', en: 'The part I enjoy most is the variety — no two days are the same, which keeps me interested.', zh: '我最喜欢的部分是变化：没有两天是一样的，这让我一直有兴趣。', use: 'Part 1/2 描述喜欢的原因' },

    /* ---------- 健康 ---------- */
    { id: 'h1', topic: 'health', kind: 'writing', en: 'Prevention is cheaper than treatment, yet health budgets almost everywhere are weighted towards the latter.', zh: '预防比治疗便宜，但几乎所有地方的医疗预算都偏向后者。', use: 'Task 2 指出矛盾（yet 转折）' },
    { id: 'h2', topic: 'health', kind: 'writing', en: 'Taxing sugary drinks has been shown to reduce consumption, although the effect is modest and uneven across income groups.', zh: '对含糖饮料征税已被证明能减少消费，尽管效果有限且在不同收入群体间不均。', use: '引用证据（has been shown to…, although…）' },
    { id: 'h3', topic: 'health', kind: 'writing', en: 'It is tempting to blame individuals for poor health, but the environment in which they live limits their choices far more than willpower does.', zh: '把健康问题归咎于个人很容易，但他们所处的环境对选择的限制远大于意志力。', use: '让步反驳（It is tempting to blame…, but…）' },
    { id: 'h4', topic: 'health', kind: 'writing', en: 'A policy that works in one country may fail in another, because diet and transport are shaped by culture as much as by price.', zh: '在A国有效的政策在B国可能失败，因为饮食与出行方式受文化影响不亚于受价格影响。', use: '限定条件（may fail, because… as much as…）' },
    { id: 'h5', topic: 'health', kind: 'speaking', en: 'I try to walk whenever I can — not because I enjoy it, but because it is the only exercise I actually keep doing.', zh: '能走我就走——不是因为喜欢，而是因为这是唯一我能坚持的运动。', use: 'Part 1 谈习惯（not because…, but because…）' },

    /* ---------- 政府 ---------- */
    { id: 'g1', topic: 'gov', kind: 'writing', en: 'Governments have a responsibility to fund what markets will not, and basic research is the clearest example.', zh: '政府有责任资助市场不会资助的东西，基础研究是最明显的例子。', use: 'Task 2 立场句（what 引导的宾语从句）' },
    { id: 'g2', topic: 'gov', kind: 'writing', en: 'Spending on public transport is often presented as a cost, when in fact it is an investment with a measurable return.', zh: '公共交通支出常被当作成本，实际上它是一项回报可衡量的投资。', use: '纠正误解（is often presented as…, when in fact…）' },
    { id: 'g3', topic: 'gov', kind: 'writing', en: 'The question is not whether to regulate, but at what level — too little lets harm spread, too much drives activity underground.', zh: '问题不是要不要监管，而是监管到什么程度：太少伤害扩散，太多把活动逼到地下。', use: '结论段提平衡（not whether…, but at what level）' },
    { id: 'g4', topic: 'gov', kind: 'writing', en: 'Any policy that ignores the poorest will be judged a failure, however impressive its overall figures look.', zh: '任何忽视最贫困者的政策都会被判为失败，无论总体数字多漂亮。', use: '评价（Any policy that… will be judged…, however…）' },
    { id: 'g5', topic: 'gov', kind: 'speaking', en: 'I think both sides have a point — individuals can change habits quickly, but only governments can change the system.', zh: '我觉得两边都有道理：个人能快速改变习惯，但只有政府能改变系统。', use: 'Part 3 双方观点' },

    /* ---------- 城市 ---------- */
    { id: 'c1', topic: 'city', kind: 'writing', en: 'A city that is designed around cars makes walking inconvenient, and then blames its residents for not walking.', zh: '围绕汽车设计的城市让步行变得不方便，然后又怪居民不走路。', use: '讽刺式论证（and then blames…）' },
    { id: 'c2', topic: 'city', kind: 'writing', en: 'Rents rise faster than wages in most large cities, which pushes key workers further from the centre they serve.', zh: '多数大城市的房租涨得比工资快，把关键岗位的人推离他们服务的市中心。', use: '因果链（which 引导结果）' },
    { id: 'c3', topic: 'city', kind: 'writing', en: 'Green space is not a luxury added at the end of a project; it is infrastructure that decides how a neighbourhood ages.', zh: '绿地不是项目末尾加的奢侈品，而是决定一个社区如何老化的基础设施。', use: '重新定义（not…; it is…）' },
    { id: 'c4', topic: 'city', kind: 'writing', en: 'Where public transport is reliable, people give up their cars without being forced to.', zh: '公共交通可靠的地方，人们不用被强迫就会放弃私家车。', use: '条件句开头（Where…, people…）' },
    { id: 'c5', topic: 'city', kind: 'speaking', en: 'What I like about my city is that everything is within walking distance, although the traffic has got much worse.', zh: '我喜欢我城市的地方是什么都在步行范围内，虽然交通差了很多。', use: 'Part 2 描述地点' },

    /* ---------- 媒体 ---------- */
    { id: 'm1', topic: 'media', kind: 'writing', en: 'The problem is not that people are lied to, but that they are shown only the parts of the story that confirm what they already believe.', zh: '问题不是人们被骗，而是他们只看到印证自己原有看法的那些部分。', use: 'Task 2 深入分析（not that…, but that…）' },
    { id: 'm2', topic: 'media', kind: 'writing', en: 'Advertising does not simply sell products; it sells a version of the life that goes with them.', zh: '广告卖的不只是产品，还卖一种与产品配套的生活想象。', use: '主体段观点（not simply…; it…）' },
    { id: 'm3', topic: 'media', kind: 'writing', en: 'Regulating speech is difficult precisely because the harm is slow, cumulative and hard to prove in a single case.', zh: '监管言论之所以难，恰恰因为伤害是缓慢的、累积的，很难在单个案例中证明。', use: '解释困难（precisely because）' },
    { id: 'm4', topic: 'media', kind: 'writing', en: 'A free press is valuable not because journalists are always right, but because the possibility of being checked keeps power careful.', zh: '新闻自由的价值不在于记者总是对的，而在于“可能被核查”让权力保持谨慎。', use: '结论句（not because…, but because…）' },
    { id: 'm5', topic: 'media', kind: 'speaking', en: 'I get most of my news from podcasts, which is probably not ideal — it means I hear what I already agree with.', zh: '我主要从播客获取新闻，这大概不理想：意味着我听到的都是我已经认同的。', use: 'Part 3 谈媒体（which 引导评价）' }
  ]
};
