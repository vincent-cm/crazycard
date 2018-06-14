export class Card {
  id?: number;
  name?: string;
  apr?: string;
  balancetransferofferduation?: number;
  purchaseofferduration?: number;
  credit?: number;
  constructor(
    id?,
    name?,
    description?,
    apr?,
    balancetransferofferduation?,
    purchaseofferduration?,
    credit?
  ) {
    this.id = id ? id : null;
    this.name = name ? name : '';
    this.apr = apr ? apr : null;
    this.balancetransferofferduation = balancetransferofferduation
      ? balancetransferofferduation
      : null;
    this.purchaseofferduration = purchaseofferduration
      ? purchaseofferduration
      : null;
    this.credit = credit ? credit : null;
  }
}
