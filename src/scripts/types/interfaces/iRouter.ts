import Footer from '../../layout/footer';
import Header from '../../layout/header';
import GarageView from '../../view/garageView';
import WinnersView from '../../view/winnersView';

export interface IRoutesList {
  [key: string]: GarageView | WinnersView;
}

export interface IStaticLayoutList {
  header: Header;
  footer: Footer;
}
