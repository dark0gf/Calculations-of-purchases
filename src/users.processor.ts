import logger from './logger';

interface IData {
  values: [number]; // store values to average and median calculation
  countAllPurchases: number; // how many total purchases
  countUniqueUsersPurchases: number; // how many unique users have such type of purchase
}

interface IKeyData {
  [key: string]: IData
}

interface IStats {
  min: number;
  max: number;
  average: number;
  median: number
}

interface IResult {
  [key: string]: IStats
}

class UsersProcessor {
  data: IKeyData;

  constructor() {
    this.data = {};
  }

  add(data: {purchases: [{type: string, amount: number}]}) {
    logger.info('adding');
    const currentUserTypes = [];
    data.purchases.forEach((purchase) => {
      let unique = false;
      if (currentUserTypes.indexOf(purchase.type) === -1) {
        currentUserTypes.push(purchase.type);
        unique = true;
      }

      const dataItem = this.data[purchase.type];
      if (dataItem) {
        dataItem.values.push(purchase.amount);
        dataItem.countAllPurchases++;
        if (unique) {
          dataItem.countUniqueUsersPurchases++;
        }
      } else {
        this.data[purchase.type] = {
          values: [purchase.amount],
          countAllPurchases: 1,
          countUniqueUsersPurchases: 1
        };
      }
    });
  }

  getResult(): IResult {
    const result: IResult = {};

    Object.keys(this.data).map((type) => {
      const data = this.data[type];
      if (data.countUniqueUsersPurchases < 5) {
        return;
      }
      const sortedValues = data.values.sort((a, b) => (a - b));
      const mid = Math.floor(sortedValues.length / 2);
      result[type] = {
        min: sortedValues[0],
        max: sortedValues[sortedValues.length - 1],
        average: sortedValues.reduce((acc, cur) => (acc + cur), 0) / sortedValues.length,
        median: sortedValues.length % 2 !== 0 ? sortedValues[mid] : (sortedValues[mid - 1] + sortedValues[mid]) / 2
      };
    });

    return result;
  }
}

export default UsersProcessor;
