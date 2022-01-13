export default interface IWinnersView {
  render: () => Promise<string>;
  afterRender: () => Promise<void>;
}
