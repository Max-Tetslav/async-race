import { Methods } from '../types/enums';
import IDriveStatus from '../types/interfaces/iDriveStatus';
import IEngineResp from '../types/interfaces/iEngineResp';
import { ENGINE_BROKEN } from '../utils/consts';
import store from './store';
import {
  GARAGE_URL,
  CURRENT_CAR_URL,
  OPTIONS_DELETE_CURRENT_CAR,
  ALL_CARS_URL,
  START_ENGINE_URL,
  STOP_ENGINE_URL,
  DRIVE_MODE_URL,
} from './consts';

export const getAllCars = async (page: number, limit: number) => {
  const request = await fetch(ALL_CARS_URL(page, limit));
  // store.cars = await request.json();
  store.carsNum = Number(request.headers.get('X-Total-Count'));
  return {
    cars: await request.json(),
    carsNum: Number(request.headers.get('X-Total-Count')),
  };
};

export const getCurrentCar = async (id: string) => {
  const request = await fetch(CURRENT_CAR_URL(id));
  const response = await request.json();
  const carString = JSON.stringify(response);
  localStorage.setItem('currentCar', carString);

  return response;
};

export const updateCurrentCar = async (id: string, newName: string, newColor: string) => {
  const request = await fetch(CURRENT_CAR_URL(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: newColor }),
  });

  console.log(request.json());
};

export const deleteCurrentCar = async (id: string) => {
  const request = await fetch(CURRENT_CAR_URL(id), OPTIONS_DELETE_CURRENT_CAR);
  const response = await request.json();

  return response;
};

export const createCurrentCar = async (newName: string, newColor: string) => {
  const request = await fetch(GARAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: newColor }),
  });

  const response = await request.json();

  return response;
};

export const startEngine = async (id: string): Promise<IEngineResp> => {
  const request = await fetch(START_ENGINE_URL(id), {
    method: Methods.patch,
  });

  const response: IEngineResp = await request.json();

  return {
    velocity: response.velocity,
    distance: response.distance,
  };
};

export const stopEngine = async (id: string): Promise<IEngineResp> => {
  const request = await fetch(STOP_ENGINE_URL(id), {
    method: Methods.patch,
  });
  const response = await request.json();

  return response;
};

export const switchDriveMode = async (id: string): Promise<IDriveStatus> => {
  try {
    const request = await fetch(DRIVE_MODE_URL(id), {
      method: Methods.patch,
    });
    const response = await request.json();

    return response;
  } catch {
    return ENGINE_BROKEN;
  }
};
