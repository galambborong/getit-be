const {modifyTimeStamp, creatRefObj} = require('../db/utils/data-manipulation');

describe('modifyTimeStamp', () => {
    test('return an empty array when given an empty array', () => {
        expect(modifyTimeStamp([])).toEqual([]);
    });
    test('it doesn\'t mutate original array', () => {
        const articles =[{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
          }];
        modifyTimeStamp(articles);
        expect(articles).toEqual([{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
          }]);
    });
    test('returns a new array and a new object inside array', () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
          }]
          const output = modifyTimeStamp(input)
        expect(output[0]).not.toBe(input[0])
        expect(output).not.toBe(input)
    });
    test('it correctly modifies the created_at value', () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
          }];
          expect(modifyTimeStamp(input)).toEqual([{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2018-11-15T12:21:54.171Z',
            votes: 100,
          }]);
    });
    test('it works with a multiple object array', () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100,
          },
          {
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
              'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: 1416140514171,
          }];
          expect(modifyTimeStamp(input)).toEqual([{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: "2018-11-15T12:21:54.171Z",
            votes: 100,
          },
          {
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body:
              'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: "2014-11-16T12:21:54.171Z",
          }])
    });
});

describe('createRefObj', () => {
    test('returns an empty object given an empty array', () => {
        expect(creatRefObj([])).toEqual({})
    });
    test('it takes a single object array, a key and a value and it gives it a reference', () => {
        const input = [
            {
                article_id: 26,
                title: 'HOW COOKING HAS CHANGED US',
                body: 'In a cave in South Africa, archaeologists have unearthed the remains of a million-year-old campfire, and discovered tiny bits of animal bones and ash from plants. It’s the oldest evidence of our ancient human ancestors—probably Homo erectus, a species that preceded ours—cooking a meal.',
                votes: 0,
                topic: 'cooking',
                author: 'weegembump',
                created_at: '2017-04-21T12:34:54.761Z'
              }
        ];
        expect(creatRefObj(input, 'title', 'article_id')).toEqual({
            'HOW COOKING HAS CHANGED US': 26 
        });
    });
    test('it works with multiple object array', () => {
        const input = [
            {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: 1542284514171,
                votes: 100,
              },
              {
                article_id: 2,
                title: 'Sony Vaio; or, The Laptop',
                topic: 'mitch',
                author: 'icellusedkars',
                body:
                  'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                created_at: 1416140514171,
              }
        ];
        expect(creatRefObj(input, 'title', 'article_id')).toEqual({
            'Living in the shadow of a great man': 1,
            'Sony Vaio; or, The Laptop': 2
        })
    })
});