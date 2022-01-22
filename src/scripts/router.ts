import IViewsList from './types/interfaces/iViewsList';
import { IRoutesList, IStaticLayoutList } from './types/interfaces/iRouter';
import GarageView from './view/garageView';
import WinnersView from './view/winnersView';
import Header from './layout/header';
import Footer from './layout/footer';

const viewsList: IViewsList = {
  garage: new GarageView(),
  winners: new WinnersView(),
};

const staticLayoutList: IStaticLayoutList = {
  header: new Header(),
  footer: new Footer(),
};

const routesList: IRoutesList = {
  '/': viewsList.garage,
  '/winners': viewsList.winners,
};

const getURL = (): string => {
  const url = window.location.hash.slice(1) || '/';

  return url;
};

const createRootElements = async (): Promise<void> => {
  const root = document.getElementById('root')!;
  const headerElement = document.createElement('header');
  headerElement.id = 'header';
  root.append(headerElement);

  const contentElement = document.createElement('content');
  contentElement.id = 'content';
  root.append(contentElement);

  const footerElement = document.createElement('footer');
  footerElement.id = 'footer';
  root.append(footerElement);
};

const Router = async (): Promise<void> => {
  await createRootElements();
  const headerRoot = document.getElementById('header') as HTMLElement;
  const contentRoot = document.getElementById('content') as HTMLElement;
  const footerRoot: HTMLElement = document.getElementById('footer') as HTMLElement;

  headerRoot.innerHTML = staticLayoutList.header.render();
  staticLayoutList.header.afterRender();
  footerRoot.innerHTML = staticLayoutList.footer.render();

  const url: string = getURL();
  const page: GarageView | WinnersView = routesList[url];

  contentRoot.innerHTML = page.render();
  await page.afterRender();
};

export default Router;
