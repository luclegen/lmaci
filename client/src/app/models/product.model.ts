export class Product {
  name: string;
  status: string;
  quantity: { imported: number, exported: number };
  price: number;
  star: { number: number, countRate: number };
  type: string;
  description: string;
  colors: string[];
  technicalDetails: [];
  post: string;
}
