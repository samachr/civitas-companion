const resourceTypes = [
  'wood',
  'food',
  'cotton',
  'rock',
  'money',
]

const workers = [
  {id: 1, cost: [{type: 'money', value: 0}], provides: [{type: 'worker', value: 1}, {type: 'rock', value: 10}]},
  {id: 2, cost: [{type: 'money', value: 20}], provides: [{type: 'worker', value: 1}, {type: 'wood', value: 10}]},
  {id: 3, cost: [{type: 'money', value: 50}], provides: [{type: 'worker', value: 1}, {type: 'food', value: 10}]},
  {id: 4, cost: [{type: 'money', value: 100}], provides: [{type: 'worker', value: 1}, {type: 'cotton', value: 10}]},
  {id: 5, cost: [{type: 'money', value: 250}], provides: [{type: 'worker', value: 1}]},
]

const buildings = [
  {id: 'mine', name: 'Mine', max: 2, cost: [{type: 'rock', value: 5}], requirements: [], provides: 'mine', wages: [{type: 'money', value: 10}, {type: 'rock', value: 2}]},
  {id: 'quarry', name: 'Quarry', max: 2, cost: [{type: 'rock', value: 5}], requirements: [], provides: 'quarry', wages: [{type: 'money', value: 10}, {type: 'rock', value: 2}]},
  {id: 'treenursery', name: 'Tree Nursery', max: 2, cost: [{type: 'wood', value: 5}], requirements: [], provides: 'treenursery', wages: [{type: 'money', value: 10}, {type: 'wood', value: 2}]},
  {id: 'farm', name: 'Farm', max: 2, cost: [{type: 'food', value: 5}], requirements: [], provides: 'farm', wages: [{type: 'money', value: 10}, {type: 'food', value: 2}]},
  {id: 'ranch', name: 'Ranch', max: 2, cost: [{type: 'food', value: 5}], requirements: [], provides: 'ranch', wages: [{type: 'money', value: 10}, {type: 'food', value: 2}]},
  {id: 'cottonmill', name: 'Cotton Mill', max: 2, cost: [{type: 'cotton', value: 5}], requirements: [], provides: 'cottonmill', wages: [{type: 'money', value: 10}, {type: 'cotton', value: 2}]},
  {id: 'metalrefinery', name: 'Metal Refinery', max: 1, cost: [{type: 'money', value: 50}], requirements: [{type: 'mine', value: 2}], provides: 'metalrefinery', wages: [{type: 'money', value: 20}, {type: 'rock', value: 5}]},
  {id: 'gemrefinery', name: 'Gem Refinery', max: 1, cost: [{type: 'money', value: 50}], requirements: [{type: 'quarry', value: 2}], provides: 'gemrefinery', wages: [{type: 'money', value: 20}, {type: 'rock', value: 5}]},
  {id: 'sawmill', name: 'Sawmill', max: 1, cost: [{type: 'money', value: 50}], requirements: [{type: 'treenursery', value: 2}], provides: 'sawmill', wages: [{type: 'money', value: 20}, {type: 'wood', value: 5}]},
  {id: 'foodprocesssor', name: 'Food Processor', max: 1, cost: [{type: 'money', value: 50}], requirements: [{type: 'farm', value: 2}], provides: 'foodprocesssor', wages: [{type: 'money', value: 20}, {type: 'food', value: 5}]},
  {id: 'slaughterhouse', name: 'Slaughter House', max: 1, cost: [{type: 'money', value: 50}], requirements: [{type: 'ranch', value: 2}], provides: 'slaughterhouse', wages: [{type: 'money', value: 20}, {type: 'food', value: 5}]},
  {id: 'textilefactory', name: 'Textile Factory', max: 1, cost: [{type: 'money', value: 50}], requirements: [{type: 'cottonmill', value: 2}], provides: 'textilefactory', wages: [{type: 'money', value: 20}, {type: 'cotton', value: 5}]},

]

class Civitas {
  constructor() {
    this.wood = 0;
    this.food = 0;
    this.cotton = 0;
    this.rock = 10;
    this.money = 0;
    this.onUpdate = (state) => {};
    this.buildings = {};
    this.worker = 1;
  }
  buyWorker() {
    const nextWorker = workers.find(worker => worker.id == this.worker + 1);
    nextWorker.cost.forEach(cost => {
      if (resourceTypes.indexOf(cost.type) != -1) {
        this[cost.type] = this[cost.type] - cost.value;
      }
    });
    nextWorker.provides.forEach(provide => {
      this[provide.type] = this[provide.type] + provide.value; 
    });
    this.update();
  }
  canBuy(itemId) {
    const building = buildings.find(building => building.id == itemId);
    return !building.cost.some(cost => {
      if (resourceTypes.indexOf(cost.type) != -1) {
        return this[cost.type] - cost.value < 0;
      }
    }) && (this.buildings[building.id] || 0) < building.max && !building.requirements.some((requirement => this.buildings[requirement.type] != requirement.value));
  }
  buy(buildingId) {
    const building = buildings.find(building => building.id == buildingId);
    if (!this.buildings[building.id]) {
      this.buildings[building.id] = 0;
    }
    this.buildings[building.id] = this.buildings[building.id] + 1;
    building.cost.forEach(cost => {
      if (resourceTypes.indexOf(cost.type) != -1) {
        this[cost.type] = this[cost.type] - cost.value;
      }
    })
    this.update();
  }
  work(buildingId) {
    const building = buildings.find(building => building.id == buildingId);
    building.wages.forEach(wage => {
      this[wage.type] = this[wage.type] + wage.value;
    })
    this.update();
  }
  hello() {
    return 'hello world'
  }
  setup(onUpdate, initialState) {
    if (initialState) {
      Object.keys(initialState).forEach(key => this[key] = initialState[key])
    }
    if (onUpdate) {
      this.onUpdate = onUpdate;
    }
    this.update();
    return this;
  }
  update() {
    this.onUpdate(this.toState());
  }
  toState() {
    return {
      ...resourceTypes.reduce((state, resourceType) => {
        state[resourceType] = this[resourceType];
        return state;
      }, {}),
      ownedBuildings: this.buildings,
      affordableBuildings: buildings.filter(
        building => this.canBuy(building.id)
      ).map(building => building.id),
      worker: this.worker
    }
  }
}

try {
  module.exports = Civitas;
}
catch(err) {
  window.civitas = new Civitas().setup((state) => {
    console.log(state);
    resourceTypes.forEach(resourceType => {
      document.getElementById(resourceType).innerHTML = state[resourceType]
    })
    document.getElementById('worker').innerHTML = state['worker'];
    const buildingsElement = document.getElementById('buildings');
    buildingsElement.innerHTML = '';
    buildings.forEach(building => {
      const buildingElement = document.createElement('div');
      buildingElement.innerHTML = `
        <span class="name">${building.name}</span>
      `;
      buildingElement.id = building.id;
      buildingElement.className = 'building';
      if (state.affordableBuildings.find(id => id == building.id)) {
        const affordableButton = document.createElement('button')
        affordableButton.innerHTML = `Buy (${building.cost.map(cost => '' + cost.value + ' ' + cost.type).join(',')})`;
        buildingElement.classList.add('affordable');
        affordableButton.classList.add('affordable');
        affordableButton.onclick = () => {
          window.civitas.buy(building.id);
        }
        buildingElement.appendChild(affordableButton)
      } else if((state.ownedBuildings[building.id] || 0) < building.max) {
        const costSpan = document.createElement('span');
        costSpan.innerHTML = `${building.cost.concat(building.requirements).map(cost => '' + cost.value + ' ' + cost.type).join(', ')} to buy`;
        buildingElement.appendChild(costSpan);
      }
      if (state.ownedBuildings[building.id]) {
        const ownedButton = document.createElement('button')
        ownedButton.innerHTML = `Work (owned: ${state.ownedBuildings[building.id]})`;
        buildingElement.classList.add('owned');
        ownedButton.classList.add('owned');
        ownedButton.onclick = () => {
          window.civitas.work(building.id);
        }
        buildingElement.appendChild(ownedButton)
      } 
      buildingsElement.appendChild(buildingElement);
    })
  });
}
