export interface IProject {
  _id?: number;
  title: string;
  location: string;
  price: string;
  category: string;
  views: number;
  description: string;
  tags: string[];
  pictures: string[];
}
