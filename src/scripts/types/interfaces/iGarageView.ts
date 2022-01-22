export default interface IGarageView {
  render: () => string;
  afterRender: () => Promise<void>;
}
