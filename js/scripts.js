class Civitas {
  constructor() {
    this.wood = 0;
    this.food = 0;
    this.cotton = 0;
    this.rock = 10;
    this.money = 0;
  }
  hello() {
    return 'hello world'
  }
  setup() {
    return this;
  }
}

try {
  module.exports = Civitas;
}
catch(err) {
  new Civitas().setup();
}
