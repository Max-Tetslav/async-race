import Footer from '../layout/footer';
import Header from '../layout/header';
import GarageView from '../view/garageView';
import WinnersView from '../view/winnersView';

interface IRoutesList {
  [key: string]: GarageView | WinnersView;
}

interface IStaticLayoutList {
  [key: string]: Header | Footer;
}

export { IRoutesList, IStaticLayoutList };
