export const getCarID = (elementID: string): string => {
  const carID: string = elementID.split('-')[1];

  return carID;
};
