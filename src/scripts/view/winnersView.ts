import IWinnersView from '../types/iWinnersView';

export default class WinnersView implements IWinnersView {
  render = async (): Promise<string> => {
    return `
      <h1 style={color: yellow}>Winners</h1>
    `;
  };

  afterRender = async (): Promise<void> => {};
}
