export default class Header {
  render = async (): Promise<string> => {
    return `
      <header>
        <nav>
          <ul>
            <li><a id="garage-link" href="/#/">Garage</a></li>
            <li><a id="winners-link" href="/#/winners">Winners</a></li>
          </ul>
        </nav>
      </header>
    `;
  };

  afterRender = async (): Promise<void> => {
    const homeLink: HTMLElement = document.getElementById('garage-link') as HTMLElement;

    homeLink.addEventListener('click', (): void => {
      window.location.hash = '/';
    });

    const winnersLink: HTMLElement = document.getElementById('winners-link') as HTMLElement;

    winnersLink.addEventListener('click', (): void => {
      window.location.hash = '/winners';
    });
  };
}
