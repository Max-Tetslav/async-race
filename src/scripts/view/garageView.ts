import Car from '../components/car';
import { Events } from '../types/enums';
import ICar from '../types/interfaces/iCar';
import IGarageView from '../types/interfaces/iGarageView';
import { CAR_WIDTH, DEFAULT_CAR_COLOR, MAX_GENERATE_NUM } from '../utils/consts';
import getCarID from '../utils/helpers/getCarId';
import getRandomCarName from '../utils/helpers/getRandomCarName';
import getRandomHEX from '../utils/helpers/getRandomHex';
import { DEFAULT_CARS_PER_PAGE_LIMIT } from '../services/consts';
import store from '../services/store';
import { getDistanceBetweenElements } from '../utils/helpers/getHtmlDistance';
import setAnimation from '../utils/helpers/setAnimation';
import IDriveStatus from '../types/interfaces/iDriveStatus';
import IEngineResp from '../types/interfaces/iEngineResp';
import {
  createCurrentCar,
  deleteCurrentCar,
  getAllCars,
  getCurrentCar,
  startEngine,
  stopEngine,
  switchDriveMode,
  updateCurrentCar,
} from '../services/api';
import ICarResult from '../types/interfaces/iCarResult';

export default class GarageView implements IGarageView {
  render = (): string => {
    return `
    <div class="content-wrapper">
      <div class="forms-container">
        <form class="custom-car car-form" id="custom-car">
          <input id="update-name-input" type="text" disabled="true" />
          <input id="update-color-input" type="color" disabled="true" />
          <button id="submit-update-car" disabled="true">Update</button>
        </form>
        <form class="create-car car-form" id="create-car">
          <input id="create-name-input" type="text"/ >
          <input id="create-color-input" type="color"/>
          <button id="submit-create-car">Create</button>
        </form>
        <div>
          <button id="start-race">Race</button>
          <button id="reset-race">Reset</button>
          <button id="generate-cars">Generate Cars</button>
        </div>
      </div>
      <h1 style={color: yellow}>GARAGE <span id="cars-num"></span></h1>
      <div class="cars-root" id="cars-root"></div>    
      <div class="garage-nav" id="garage-nav">
        <button id="prev-garage-page">Prev</button>
        <p>Page: <span id="garage-page"></span></p>
        <button id="next-garage-page">Next</button>
      </div>
      <div class="winner-message-container" id="winner-message">
        <button class="winner-message-btn" id="winner-message-close">Close</button>
        <p id="winner-message-text"></p>
      </div>
    </div>
    `;
  };

  afterRender = async (): Promise<void> => {
    await getAllCars(store.garagePage, DEFAULT_CARS_PER_PAGE_LIMIT);

    this.renderGarage(store.cars, store.carsNum);

    await this.addFormListeners();
    await this.addCarListeners();
    await this.addGaragaNavListeners();
  };

  addFormListeners = async (): Promise<void> => {
    await this.updateCar();
    await this.createCar();
    await this.generateCars();
    this.resetAllCars();
    await this.startAllCars();
  };

  updateCar = async (): Promise<void> => {
    const submitUpdate: HTMLButtonElement = document.getElementById('submit-update-car') as HTMLButtonElement;
    const updateCarName: HTMLInputElement = document.getElementById('update-name-input') as HTMLInputElement;
    const updateCarColor: HTMLInputElement = document.getElementById('update-color-input') as HTMLInputElement;

    let newName: string = '';
    let newColor: string = '';

    updateCarName.addEventListener(Events.input, (): void => {
      if (updateCarName.value) {
        newName = updateCarName.value;
      }
    });
    updateCarColor.addEventListener(Events.input, (): void => {
      if (updateCarName.value) {
        newColor = updateCarColor.value;
      }
    });

    submitUpdate.addEventListener(Events.click, async (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      const currentCar: ICar = store.currentCar as ICar;
      console.log(store.currentCar);
      newColor = updateCarColor.value || currentCar.color;
      newName = updateCarName.value || currentCar.name;

      await updateCurrentCar(currentCar.id.toString(), newName, newColor);
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

    let newName: string = '';
    let newColor: string = '';

    createCarName.addEventListener(Events.input, (): void => {
      newName = createCarName.value;
    });
    createCarColor.addEventListener(Events.input, (): void => {
      newColor = createCarColor.value;
    });

    newColor = newColor || DEFAULT_CAR_COLOR;

    submitCreate.addEventListener(Events.click, async (e: MouseEvent): Promise<void> => {
      e.preventDefault();
      await createCurrentCar(newName!, newColor!);
      createCarColor.value = DEFAULT_CAR_COLOR;
      createCarName.value = '';
      createCarName.placeholder = '';
      await this.updateGarage();
    });
  };

  generateCars = async (): Promise<void> => {
    const generateButton: HTMLButtonElement = document.getElementById('generate-cars') as HTMLButtonElement;

    generateButton.addEventListener(Events.click, async () => {
      for (let i = 0; i < MAX_GENERATE_NUM; i += 1) {
        const name: string = getRandomCarName();
        const color: string = getRandomHEX();

        createCurrentCar(name, color);
      }
      await this.updateGarage();
    });
  };

  startAllCars = async () => {
    const raceBtn: HTMLButtonElement = document.getElementById('start-race') as HTMLButtonElement;
    const resetBtn: HTMLButtonElement = document.getElementById('reset-race') as HTMLButtonElement;
    resetBtn.disabled = true;

    raceBtn.addEventListener(Events.click, async () => {
      resetBtn.disabled = false;
      raceBtn.disabled = true;
      const promises = store.cars.map((item) => this.startCarHandler(item.id.toString()));

      const finishRace = (await Promise.all(promises)).filter((item) => item.success);

      const timeResults = finishRace.map((item) => item.drivingTime);

      const bestTime = Math.min(...timeResults);

      const winner = finishRace.find((item) => item.drivingTime === bestTime);

      store.winner = winner as ICarResult;

      this.renderRaceWinner(store.winner as ICarResult);
    });
  };

  resetAllCars = () => {
    const raceBtn: HTMLButtonElement = document.getElementById('start-race') as HTMLButtonElement;
    const resetBtn: HTMLButtonElement = document.getElementById('reset-race') as HTMLButtonElement;
    const stopBtns: HTMLButtonElement[] = [...document.querySelectorAll('.stop-button')] as HTMLButtonElement[];
    resetBtn.disabled = true;

    resetBtn.addEventListener(Events.click, () => {
      resetBtn.disabled = true;
      raceBtn.disabled = false;
      stopBtns.forEach((item) => {
        item.click();
      });
    });
  };

  renderRaceWinner = (winner: ICarResult) => {
    const messageContainer: HTMLElement = document.getElementById('winner-message') as HTMLElement;
    const messageRoot: HTMLElement = document.getElementById('winner-message-text') as HTMLElement;
    const messageExit: HTMLButtonElement = document.getElementById('winner-message-close') as HTMLButtonElement;

    const car = store.cars.find((item) => item.id.toString() === winner.carID) as ICar;

    messageRoot.innerHTML = `Winner is ${car.name}. Time is ${(winner.drivingTime / 1000).toFixed(2)}sec. Congrats!`;
    messageContainer.style.display = 'flex';

    messageExit.addEventListener(Events.click, () => {
      messageContainer.style.display = '';
    });
  };

  renderGarage = (data: ICar[], carsNum: number): void => {
    const target: HTMLElement = document.getElementById('cars-root') as HTMLElement;

    data.map((item: ICar) => {
      const car = new Car(item.name, item.color, item.id);

      target.innerHTML += car.render();

      return car;
    });
    this.renderCarsNum(carsNum);
    this.upadatePage();
    this.disableGarageNav();
  };

  updateGarage = async (): Promise<void> => {
    const target: HTMLElement = document.getElementById('cars-root') as HTMLElement;
    target.innerHTML = '';

    await getAllCars(store.garagePage, DEFAULT_CARS_PER_PAGE_LIMIT);

    this.renderGarage(store.cars, store.carsNum);
    await this.addCarListeners();
  };

  renderCarsNum = (carsNum: number): void => {
    const target: HTMLElement = document.getElementById('cars-num') as HTMLElement;

    target.innerHTML = `(${carsNum})`;
  };

  addCarListeners = async (): Promise<void> => {
    const updateCarName: HTMLInputElement = document.getElementById('update-name-input') as HTMLInputElement;
    const updateCarColor: HTMLInputElement = document.getElementById('update-color-input') as HTMLInputElement;
    const submitUpdate: HTMLButtonElement = document.getElementById('submit-update-car') as HTMLButtonElement;
    const chooseCar: HTMLButtonElement[] = [...document.querySelectorAll('.select-car')] as HTMLButtonElement[];

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

    const startBtn: HTMLButtonElement[] = [...document.querySelectorAll('.start-button')] as HTMLButtonElement[];

    startBtn.forEach((item: HTMLButtonElement) => {
      item.addEventListener(Events.click, async (e: Event) => {
        const target: HTMLButtonElement = e.target as HTMLButtonElement;
        const carID: string = getCarID(target.id);
        await this.startCarHandler(carID);
      });
    });

    const stopBtn: HTMLButtonElement[] = [...document.querySelectorAll('.stop-button')] as HTMLButtonElement[];

    stopBtn.forEach((item: HTMLButtonElement) => {
      item.disabled = true;
      item.addEventListener(Events.click, async (e: Event) => {
        const target: HTMLButtonElement = e.target as HTMLButtonElement;
        const carID: string = getCarID(target.id);
        await this.stopCarHandler(carID);
        store.promises = [];
      });
    });
  };

  choseCarHandler = async (e: Event): Promise<void> => {
    const updateCarName: HTMLInputElement = document.getElementById('update-name-input') as HTMLInputElement;
    const updateCarColor: HTMLInputElement = document.getElementById('update-color-input') as HTMLInputElement;
    const target: HTMLElement = e.target as HTMLElement;
    const carID: string = getCarID(target.id);
    const car: ICar = await getCurrentCar(carID);

    store.currentCar = car;

    updateCarName.placeholder = car.name;
    updateCarColor.value = car.color;
  };

  deleteCarHandler = async (e: MouseEvent): Promise<void> => {
    const target: HTMLElement = e.target as HTMLElement;
    const carID: string = getCarID(target.id);

    await deleteCurrentCar(carID);
    await this.updateGarage();
  };

  startCarHandler = async (carID: string): Promise<ICarResult> => {
    const startBtn: HTMLButtonElement = document.getElementById(`start-${carID}`) as HTMLButtonElement;

    const { velocity, distance }: IEngineResp = await startEngine(carID);
    const drivingTime = Math.round(distance / velocity);

    const car: HTMLElement = document.getElementById(`car-${carID}`) as HTMLElement;
    const flag: HTMLElement = document.getElementById(`flag-${carID}`) as HTMLElement;
    const htmlDistance = Math.floor(getDistanceBetweenElements(car, flag)) + CAR_WIDTH;

    store.animation[`car-${carID}`] = setAnimation(car, htmlDistance, drivingTime);

    const stopBtn: HTMLButtonElement = document.getElementById(`stop-${carID}`) as HTMLButtonElement;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    const { success } = await this.driveModeHandler(carID);

    if (!success) window.cancelAnimationFrame(store.animation[`car-${carID}`].animationId);

    return { success, carID, drivingTime };
  };

  stopCarHandler = async (carID: string): Promise<void> => {
    const stopBtn: HTMLButtonElement = document.getElementById(`stop-${carID}`) as HTMLButtonElement;
    window.cancelAnimationFrame(store.animation[`car-${carID}`].animationId);
    await stopEngine(carID);
    const car: HTMLElement = document.getElementById(`car-${carID}`) as HTMLElement;

    const startBtn: HTMLButtonElement = document.getElementById(`start-${carID}`) as HTMLButtonElement;
    stopBtn.disabled = true;
    startBtn.disabled = false;

    car.style.transform = `translateX(0px)`;
  };

  driveModeHandler = async (carID: string): Promise<IDriveStatus> => {
    const response = await switchDriveMode(carID);
    return response;
  };

  disableGarageNav = (): void => {
    const nextBtn = document.getElementById('next-garage-page') as HTMLButtonElement;
    const prevBtn = document.getElementById('prev-garage-page') as HTMLButtonElement;

    nextBtn.disabled = false;
    prevBtn.disabled = false;

    if (store.garagePage === 1) {
      prevBtn.disabled = true;
    }
    if (store.garagePage === Math.ceil(store.carsNum / 7)) {
      nextBtn.disabled = true;
    }
  };

  upadatePage = (): void => {
    const target: HTMLElement = document.getElementById('garage-page') as HTMLElement;

    target.innerHTML = store.garagePage.toString();
  };

  switchPage = (): void => {
    this.updateGarage();
    this.upadatePage();
  };

  addGaragaNavListeners = async (): Promise<void> => {
    const nextBtn: HTMLButtonElement = document.getElementById('next-garage-page') as HTMLButtonElement;
    const prevBtn: HTMLButtonElement = document.getElementById('prev-garage-page') as HTMLButtonElement;

    nextBtn.addEventListener(Events.click, () => {
      if (store.garagePage < Math.ceil(store.carsNum / 7)) {
        store.garagePage += 1;
        this.switchPage();
      }
    });

    prevBtn.addEventListener(Events.click, () => {
      if (store.garagePage !== 1) {
        store.garagePage -= 1;
        this.switchPage();
      }
    });
  };
}
