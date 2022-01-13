import ICar from '../types/iCar';

export default class Car implements ICar {
  _name: string;

  _color: string;

  _id: number;

  constructor(name: string, color: string, id: number) {
    this._name = name;
    this._color = color;
    this._id = id;
  }

  setName(newName: string): void {
    this._name = newName;
  }

  getName(): string {
    return this._name;
  }

  setColor(newColor: string): void {
    this._color = newColor;
  }

  getColor(): string {
    return this._color;
  }

  getID(): number {
    return this._id;
  }

  render(): string {
    return `
      <div style='color: red'>
        ${this.getColor()} машина ${this._name}
      </div>
    `;
  }
}
