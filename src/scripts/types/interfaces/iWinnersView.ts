export default interface IWinnersView {
  render: () => string;
  afterRender?: () => Promise<void>;
}
