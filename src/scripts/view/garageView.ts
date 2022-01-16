import Car from '../components/car';
import ICar from '../types/iCar';
import IGarageView from '../types/iGarageView';
import { getAllCars, getCurrentCar, updateCurrentCar } from '../utils/api';
import { renderGarage } from '../utils/renderGarage';
import { getCarID } from '../utils/utils';

export default class GarageView implements IGarageView {
  render = async (): Promise<string> => {
    return `
    <div>
      <div>
        <form class="create-car" id="create-car">
          <input id="update-name-input" type="text" disabled="true" />
          <input id="update-color-input" type="color" disabled="true" />
          <button id="submit-update-car" disabled="true">Update</button>
        </form>
        <form class="custom-car" id="custom-car">
          <input type="text"/ >
          <input type="color"/>
          <button id="submit-create-car">Create</button>
        </form>
      </div>
      <div>
        <button id="start-race">Race</button>
        <button id="reset-race">Reset</button>
        <button id="generate-cars">Generate Cars</button>
      </div>
      <h1 style={color: yellow}>GARAGE</h1>
      <div id="cars-root"></div>      
    </div>
    `;
  };

  afterRender = async (): Promise<void> => {
    const cars: ICar[] = await getAllCars();
    const carsObjects: Car[] = cars.map((item: ICar) => new Car(item.name, item.color, item.id));

    await renderGarage(carsObjects);

    await this.addCarListeners();
    await this.addFormListeners();
  };

  choseCarHandler = async (e: Event): Promise<void> => {
    const updateCarName: HTMLInputElement = document.getElementById('update-name-input') as HTMLInputElement;
    const updateCarColor: HTMLInputElement = document.getElementById('update-color-input') as HTMLInputElement;
    const target: HTMLElement = e.target as HTMLElement;
    const carID: string = getCarID(target.id);
    const car: ICar = await getCurrentCar(carID);

    localStorage.setItem('carID', carID);

    updateCarName.placeholder = car.name;
    updateCarColor.value = car.color;
  };

  updateGarage = async (): Promise<void> => {
    const target: HTMLElement = document.getElementById('cars-root') as HTMLElement;
    target.innerHTML = '';

    const cars: ICar[] = await getAllCars();
    const carsObjects: Car[] = cars.map((item: ICar) => new Car(item.name, item.color, item.id));

    await renderGarage(carsObjects);
    await this.addCarListeners();
  };

  addCarListeners = async (): Promise<void> => {
    const chooseCar: HTMLButtonElement[] = [...document.querySelectorAll('.select-car')] as HTMLButtonElement[];
    const updateCarName: HTMLInputElement = document.getElementById('update-name-input') as HTMLInputElement;
    const updateCarColor: HTMLInputElement = document.getElementById('update-color-input') as HTMLInputElement;
    const submitUpdate: HTMLButtonElement = document.getElementById('submit-update-car') as HTMLButtonElement;

    chooseCar.forEach((item: HTMLElement) => {
      item.addEventListener('click', async (e: MouseEvent): Promise<void> => {
        await this.choseCarHandler(e);
        updateCarColor.disabled = false;
        updateCarName.disabled = false;
        submitUpdate.disabled = false;
      });
    });
  };

  addFormListeners = async (): Promise<void> => {
    const submitUpdate: HTMLButtonElement = document.getElementById('submit-update-car') as HTMLButtonElement;
    const updateCarName: HTMLInputElement = document.getElementById('update-name-input') as HTMLInputElement;
    const updateCarColor: HTMLInputElement = document.getElementById('update-color-input') as HTMLInputElement;
    const currentCar: ICar = await JSON.parse(localStorage.getItem('currentCar')!);
    let newColor: null | string = null;
    let newName: null | string = null;

    updateCarName.addEventListener('input', (): void => {
      newName = updateCarName.value ? updateCarName.value : currentCar.name;
    });
    updateCarColor.addEventListener('input', (): void => {
      newColor = updateCarColor.value ? updateCarColor.value : currentCar.color;
    });

    newColor = updateCarColor.value ? updateCarColor.value : currentCar.color;
    newName = updateCarName.value ? updateCarName.value : currentCar.name;

    submitUpdate.addEventListener('click', async (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      await updateCurrentCar(localStorage.getItem('carID')!, newName!, newColor!);
      updateCarColor.value = '#000000';
      updateCarName.value = '';
      updateCarName.placeholder = '';
      updateCarName.disabled = true;
      updateCarColor.disabled = true;
      submitUpdate.disabled = true;
      await this.updateGarage();
    });
  };
}
