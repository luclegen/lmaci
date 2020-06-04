import { Type } from '../shared/type.enum';

export class Product {
  name: string;
  status: string;
  quantity: { imported: number, exported: number };
  price: number;
  star: { number: number, countRate: number };
  type: Type;
  description: string;
  colors: string[];
  technicalDetails: [];
  post: string;
}
