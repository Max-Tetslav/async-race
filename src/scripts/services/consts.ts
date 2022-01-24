import { EngineStates } from '../types/enums';

export const BASE_URL: string = 'http://127.0.0.1:3000';

export const GARAGE_URL: string = `${BASE_URL}/garage/`;
export const ENGINE_URL: string = `${BASE_URL}/engine/`;
export const WINNERS_URL: string = `${BASE_URL}/winners/`;

export const DEFAULT_CARS_PER_PAGE_LIMIT: number = 7;

export const ALL_CARS_URL = (page: number, limit: number) => `${GARAGE_URL}?_page=${page}&_limit=${limit}`;
export const CURRENT_CAR_URL = (id: string): string => `${GARAGE_URL}${id}`;
export const START_ENGINE_URL = (id: string): string => `${ENGINE_URL}?id=${id}&status=${EngineStates.start}`;
export const STOP_ENGINE_URL = (id: string): string => `${ENGINE_URL}?id=${id}&status=${EngineStates.stop}`;
export const DRIVE_MODE_URL = (id: string): string => `${ENGINE_URL}?id=${id}&status=${EngineStates.drive}`;

export const OPTIONS_UPDATE_CURRENT_CAR = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const OPTIONS_DELETE_CURRENT_CAR = {
  method: 'DELETE',
};

export const OPTIONS_CREATE_CAR = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};
