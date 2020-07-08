export class Product {
  _id: string;
  name: string;
  status: string;
  price: number;
  quantity: { imported: number, exported: number };
  star: { number: number, countRate: number };
  type: string;
  colors: [];
  properties: [];
  technicalDetails: [];
  description: string;
  post: string;
}
