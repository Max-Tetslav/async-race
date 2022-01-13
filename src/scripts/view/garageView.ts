import IGarageView from '../types/iGarageView';

export default class GarageView implements IGarageView {
  render = async (): Promise<string> => {
    return `
      <h1 style={color: yellow}>GARAGE</h1>
    `;
  };

  afterRender = async () => {};
}
