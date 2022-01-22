import ICar from '../types/interfaces/iCar';
import { flag } from './svg/flag';
import { car } from './svg/car';

export default class Car implements ICar {
  name: string;

  color: string;

  id: number;

  constructor(name: string, color: string, id: number) {
    this.name = name;
    this.color = color;
    this.id = id;
  }

  setName(newName: string): void {
    this.name = newName;
  }

  getName(): string {
    return this.name;
  }

  setColor(newColor: string): void {
    this.color = newColor;
  }

  getColor(): string {
    return this.color;
  }

  getID(): number {
    return this.id;
  }

  render = (): string => {
    return `
      <div style='color: red'>
        <div class="car-controls">
          <div>
            <button class="car-button start-button" id="start-${this.id}">A</button>
            <button class="car-button stop-button" id="stop-${this.id}">B</button>
          </div>
          <button class="select-car" id="select-${this.id}">Select</button>
          <button class="delete-car" id="delete-${this.id}">Delete</button>
          <p>${this.name}</p>
        </div>
        <div class="road">
          ${car(this.color)}
          ${flag}
        </div>
      </div>
    `;
  };
}
