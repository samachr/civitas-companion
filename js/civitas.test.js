const Civitas = require('./scripts');

describe('Game setup', () => {
  test('starts with 10 rock', () => {
    const game = new Civitas().setup();
    expect(game.rock).toBe(10);
  });
  test('starts game with no other resources', () => {
    const game = new Civitas().setup();
    expect(game.money).toBe(0);
    expect(game.food).toBe(0);
    expect(game.cotton).toBe(0);
    expect(game.wood).toBe(0);
  })
});

describe('Resource Purchase', () => {
  test('mine', () => {
    const game = new Civitas().setup();
    game.buy('mine')
    expect(game.rock).toBe(5);
    expect(game.buildings['mine']).toBe(1);
  })
  test('can not buy level 2', () => {
    const game = new Civitas().setup(() => {}, {buildings: {'mine': 1}, money: 50});
    expect(game.canBuy('metalrefinery')).toBe(false);
  })
  test('can buy level 2', () => {
    const game = new Civitas().setup(() => {}, {buildings: {'mine': 2}, money: 50});
    expect(game.canBuy('metalrefinery')).toBe(true);
  })
})

describe('Working', () => {
  test('mine', () => {
    const game = new Civitas().setup(() => {}, {buildings: {'mine': 1}});
    game.work('mine');
    expect(game.money).toBe(10);
    expect(game.rock).toBe(12)
  })
})
