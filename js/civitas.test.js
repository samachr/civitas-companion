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
