export default class Footer {
  render = (): string => {
    return `
      <div class="footer-wrapper">
        <a class="footer__link author-container" href="https://github.com/Max-Tetslav" target="_blank">
          <img class="github-logo" src="./assets/svg/github.svg" alt="github-logo" draggable="false">
          <p class="author-container__nickname">@Max-Tetslav</p>
        </a>
        <a class="footer__link" href="https://rs.school/js/" target="_blank">
          <img class="rss-logo" src="./assets/svg/rss.svg" alt="rss-logo" draggable="false">
        </a>
      </div>
    `;
  };
}
