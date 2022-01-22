import IWinnersView from '../types/interfaces/iWinnersView';

export default class WinnersView implements IWinnersView {
  render = (): string => {
    return `
      <h1 style={color: yellow}>Winners</h1>
    `;
  };

  afterRender = async (): Promise<void> => {};
}
