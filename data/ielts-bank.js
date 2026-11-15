/* 雅思真题练习题库（示例题：题型与评分标准照雅思，内容为原创，可自行导入替换）
   数据结构：window.IELTS_BANK = {reading:[], listening:[], writing:[], speaking:[]} */
window.IELTS_BANK = {

  /* ---------------- 阅读 ---------------- */
  reading: [
    {
      id: 'r1',
      title: 'Passage 1 · Urban Trees',
      cn: '城市里的树',
      minutes: 20,
      passage: [
        { h: 'A', t: 'For many city governments, planting trees is the cheapest tool they have against summer heat. A mature street tree can lower the air temperature around it by two to three degrees, and shade on a pavement can make the surface feel ten degrees cooler. Trees also trap dust, slow rainwater before it reaches drains, and give birds somewhere to live. Recent surveys in Europe and East Asia suggest that residents who can see greenery from their windows report lower levels of stress, although researchers are careful to say that the link is an association rather than proof of cause.' },
        { h: 'B', t: 'Trees are not free, however. A street tree needs pruning, watering in dry years, and eventually removal when its roots lift the pavement or its branches block a road. In some cities the annual cost of maintaining a single mature tree is higher than the electricity saved by the shade it provides. Allergy is another concern: pollen from certain species causes problems for a large share of the population, and a few councils have been criticised for choosing fast-growing species that are cheap to plant but expensive to keep.' },
        { h: 'C', t: 'The right species depends entirely on the climate. Singapore, which is hot and wet all year, plants densely and requires new developments to include vegetation on walls and roofs. Cities in dry regions cannot copy this approach: they need deep-rooted species that survive on little water, and they often plant in wide, shaded streets rather than narrow ones. In both cases, the choice is made by planners rather than by residents, and the results are visible only after a decade.' },
        { h: 'D', t: 'The next generation of urban trees will be managed with data. Some cities now attach sensors to young trees that report soil moisture and send an alert when a tree needs water, which reduces both waste and the number of trees lost in their first summers. Others are testing species from warmer regions, on the assumption that the climate in twenty years will resemble that of a city several hundred kilometres south. What none of these projects can do is replace the time a tree needs to grow: a decision taken this year will not be seen on the street until the 2040s.' }
      ],
      groups: [
        {
          title: 'Questions 1–5 · 判断题（TRUE / FALSE / NOT GIVEN）',
          type: 'tfng',
          items: [
            { q: 'Street trees can make the air around them a few degrees cooler.', a: 'TRUE', exp: 'A 段：A mature street tree can lower the air temperature around it by two to three degrees.' },
            { q: 'Maintaining a tree always costs less than the electricity saved by its shade.', a: 'FALSE', exp: 'B 段：有些城市维护一棵成年树的年成本高于遮阴省下的电费，所以“always”错。' },
            { q: 'New buildings in Singapore are required to include vegetation.', a: 'TRUE', exp: 'C 段：requires new developments to include vegetation on walls and roofs.' },
            { q: 'Every city uses the same list of tree species.', a: 'NOT GIVEN', exp: '文中说树种取决于气候，但没提“所有城市用同一份名单”，也没否认，属于未提及。' },
            { q: 'Seeing greenery from home is linked to lower stress.', a: 'TRUE', exp: 'A 段：residents who can see greenery ... report lower levels of stress.' }
          ]
        },
        {
          title: 'Questions 6–8 · 选择题',
          type: 'mcq',
          items: [
            { q: 'What is the writer’s attitude towards planting trees in cities?', opts: ['Completely supportive', 'Supportive but aware of the costs', 'Doubtful about the benefits', 'Neutral and uninterested'], a: 1, exp: '全文既讲好处也讲成本与维护问题，属于“支持但清楚代价”。' },
            { q: 'Why does the writer mention roots and branches?', opts: ['To explain why trees are removed', 'To show trees grow quickly', 'To compare species', 'To criticise residents'], a: 0, exp: 'B 段：roots lift the pavement / branches block a road，最终导致 removal。' },
            { q: 'Paragraph D is mainly about', opts: ['the cost of sensors', 'how long trees take to grow', 'new ways of managing urban trees', 'the climate in twenty years'], a: 2, exp: 'D 段讲传感器、试种耐热树种等新的管理方式。' }
          ]
        },
        {
          title: 'Questions 9–10 · 填空（不超过两个词）',
          type: 'gap',
          items: [
            { q: 'Trees help to slow ______ before it reaches drains.', a: ['rainwater', 'rain water', 'rain'], exp: 'A 段：slow rainwater before it reaches drains.' },
            { q: 'Some young trees send an alert when the ______ is too low.', a: ['soil moisture', 'moisture'], exp: 'D 段：report soil moisture and send an alert when a tree needs water.' }
          ]
        }
      ]
    }
  ],

  /* ---------------- 听力 ---------------- */
  listening: [
    {
      id: 'l1',
      title: 'Section 1 · Renting a Flat',
      cn: '租房咨询（系统语音朗读，可反复听）',
      minutes: 10,
      script: [
        'Agent: Good morning, Riverside Lettings. How can I help?',
        'Student: Hello, I’m calling about the flat on Mill Road, the one-bedroom one.',
        'Agent: Yes, it’s still available. It’s on the second floor, above a bakery.',
        'Student: And how much is the rent?',
        'Agent: Eight hundred and fifty pounds a month, and that includes water but not electricity.',
        'Student: Is there a deposit?',
        'Agent: Yes, one month’s rent as a deposit, so eight hundred and fifty pounds.',
        'Student: When could I move in?',
        'Agent: The current tenant leaves at the end of the month, so the flat is free from the third of March.',
        'Student: One more thing — can I keep a cat?',
        'Agent: I’m afraid the landlord doesn’t allow pets, but guide dogs are fine.'
      ],
      groups: [
        {
          title: 'Questions 1–5 · 填空（每空一个词或数字）',
          type: 'gap',
          items: [
            { q: 'The flat is on the ______ floor.', a: ['second', '2nd', '2'], exp: 'on the second floor' },
            { q: 'The monthly rent is £______.', a: ['850', 'eight hundred and fifty'], exp: 'eight hundred and fifty pounds' },
            { q: 'The deposit is £______.', a: ['850'], exp: 'one month’s rent as a deposit ... eight hundred and fifty pounds' },
            { q: 'The flat is free from the ______ of March.', a: ['third', '3rd', '3'], exp: 'free from the third of March' },
            { q: 'Pets are not allowed, but ______ dogs are fine.', a: ['guide'], exp: 'guide dogs are fine' }
          ]
        }
      ]
    }
  ],

  /* ---------------- 写作 ---------------- */
  writing: [
    {
      id: 'w1', type: 'task2', title: 'Task 2 · 大学课程与就业',
      minutes: 40, minWords: 250,
      prompt: 'Some people believe that universities should only offer courses that prepare students for well-paid jobs. Others think that subjects such as history and philosophy are equally important.\n\nDiscuss both views and give your own opinion.',
      tips: ['两边观点都要展开，不能只写一边', '最后一段给出自己的立场', '每段一个中心句（topic sentence）']
    },
    {
      id: 'w2', type: 'task2', title: 'Task 2 · 城市交通',
      minutes: 40, minWords: 250,
      prompt: 'In many cities, private cars are being restricted in the city centre in order to encourage the use of public transport.\n\nDo the advantages of this policy outweigh the disadvantages?',
      tips: ['明确回答 “outweigh” 这个问题', '举例要具体（城市、措施、结果）', '结尾不要引入新观点']
    }
  ],

  /* ---------------- 口语 ---------------- */
  speaking: [
    {
      id: 's1', title: 'Part 1 · 日常话题', part: 1, minutes: 5,
      questions: [
        'Where are you from, and how long have you lived there?',
        'Do you prefer studying in the morning or in the evening?',
        'How often do you use public transport?',
        'What kind of weather do you like most?'
      ]
    },
    {
      id: 's2', title: 'Part 2 · 卡片题', part: 2, minutes: 4,
      cue: 'Describe a skill you learned recently.\n\nYou should say:\n• what the skill is\n• how you learned it\n• how long it took you\n\nand explain why you decided to learn it.',
      prep: 60,
      questions: []
    },
    {
      id: 's3', title: 'Part 3 · 深入讨论', part: 3, minutes: 5,
      questions: [
        'Why do adults find it harder to learn new skills than children?',
        'Should schools teach practical skills such as cooking and budgeting?',
        'How has the internet changed the way people learn?',
        'Do you think qualifications will still matter in twenty years?'
      ]
    }
  ]
};
