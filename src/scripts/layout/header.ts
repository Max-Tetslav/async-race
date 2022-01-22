export default class Header {
  render = (): string => {
    return `
      <nav>
        <ul class="nav-list">
          <li><a id="garage-link" href="/#/">Garage</a></li>
          <li><a id="winners-link" href="/#/winners">Winners</a></li>
        </ul>
      </nav>
    `;
  };

  afterRender = (): void => {
    const homeLink: HTMLElement = document.getElementById('garage-link') as HTMLElement;

    homeLink.addEventListener('click', (e: MouseEvent): void => {
      e.preventDefault();
      window.location.hash = '/';
    });

    const winnersLink: HTMLElement = document.getElementById('winners-link') as HTMLElement;

    winnersLink.addEventListener('click', (e: MouseEvent): void => {
      e.preventDefault();
      window.location.hash = '/winners';
    });
  };
}
