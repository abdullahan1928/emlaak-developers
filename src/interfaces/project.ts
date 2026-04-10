export interface IProject {
  _id?: number;
  title: string;
  location: string;
  startingPrice: string;
  category: string;
  description: string;
  tags: string[];
  pictures: string[];
}
