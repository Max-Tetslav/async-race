export default interface IGarageView {
  render: () => Promise<string>;
  afterRender: () => Promise<void>;
}
