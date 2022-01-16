import Car from '../components/car';
import { Events } from '../types/events';
import ICar from '../types/iCar';
import IGarageView from '../types/iGarageView';
import { createCurrentCar, deleteCurrentCar, getAllCars, getCurrentCar, updateCurrentCar } from '../utils/api';
import { DEFAULT_CAR_COLOR } from '../utils/constants';
import { renderGarage } from '../utils/renderGarage';
import { getCarID } from '../utils/utils';

export default class GarageView implements IGarageView {
  render = async (): Promise<string> => {
    return `
    <div>
      <div>
        <form class="custom-car" id="custom-car">
          <input id="update-name-input" type="text" disabled="true" />
          <input id="update-color-input" type="color" disabled="true" />
          <button id="submit-update-car" disabled="true">Update</button>
        </form>
        <form class="create-car" id="create-car">
          <input id="create-name-input" type="text"/ >
          <input id="create-color-input" type="color"/>
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

    chooseCar.forEach((item: HTMLButtonElement) => {
      item.addEventListener(Events.click, async (e: MouseEvent): Promise<void> => {
        await this.choseCarHandler(e);
        updateCarColor.disabled = false;
        updateCarName.disabled = false;
        submitUpdate.disabled = false;
      });
    });

    const deleteCar: HTMLButtonElement[] = [...document.querySelectorAll('.delete-car')] as HTMLButtonElement[];

    deleteCar.forEach((item: HTMLButtonElement) => {
      item.addEventListener(Events.click, async (e: MouseEvent) => {
        await this.deleteCarHandler(e);
      });
    });
  };

  deleteCarHandler = async (e: MouseEvent): Promise<void> => {
    const target: HTMLElement = e.target as HTMLElement;
    const carID: string = getCarID(target.id);

    await deleteCurrentCar(carID);
    await this.updateGarage();
  };

  addFormListeners = async (): Promise<void> => {
    await this.updateCar();
    await this.createCar();
  };

  updateCar = async (): Promise<void> => {
    const submitUpdate: HTMLButtonElement = document.getElementById('submit-update-car') as HTMLButtonElement;
    const updateCarName: HTMLInputElement = document.getElementById('update-name-input') as HTMLInputElement;
    const updateCarColor: HTMLInputElement = document.getElementById('update-color-input') as HTMLInputElement;
    const currentCar: ICar = await JSON.parse(localStorage.getItem('currentCar')!);

    let updatedName: null | string = null;
    let updatedColor: null | string = null;

    updateCarName.addEventListener(Events.input, (): void => {
      updatedName = updateCarName.value || currentCar.name;
    });
    updateCarColor.addEventListener(Events.input, (): void => {
      updatedColor = updateCarColor.value || currentCar.color;
    });

    updatedColor = updateCarColor.value || currentCar.color;
    updatedName = updateCarName.value || currentCar.name;

    submitUpdate.addEventListener(Events.click, async (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      await updateCurrentCar(localStorage.getItem('carID')!, updatedName!, updatedColor!);
      updateCarColor.value = DEFAULT_CAR_COLOR;
      updateCarName.value = '';
      updateCarName.placeholder = '';
      updateCarName.disabled = true;
      updateCarColor.disabled = true;
      submitUpdate.disabled = true;
      await this.updateGarage();
    });
  };

  createCar = async (): Promise<void> => {
    const submitCreate: HTMLButtonElement = document.getElementById('submit-create-car') as HTMLButtonElement;
    const createCarName: HTMLInputElement = document.getElementById('create-name-input') as HTMLInputElement;
    const createCarColor: HTMLInputElement = document.getElementById('create-color-input') as HTMLInputElement;

    let createdName: null | string = null;
    let createdColor: null | string = null;

    createCarName.addEventListener(Events.input, (): void => {
      createdName = createCarName.value;
    });
    createCarColor.addEventListener(Events.input, (): void => {
      createdColor = createCarColor.value;
    });

    createdColor = createdColor || DEFAULT_CAR_COLOR;

    submitCreate.addEventListener(Events.click, async (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      await createCurrentCar(createdName!, createdColor!);
      createCarColor.value = DEFAULT_CAR_COLOR;
      createCarName.value = '';
      createCarName.placeholder = '';
      await this.updateGarage();
    });
  };
}
