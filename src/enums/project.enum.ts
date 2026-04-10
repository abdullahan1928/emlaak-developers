export interface IImage {
  url: string;
  order: number;
  public_id: string;
}

export enum ProjectStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  UPCOMING = "upcoming",
}

export enum PublishStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export enum Category {
  COMMERCIAL = "commerical",
  RESIDENTIAL = "residential",
  INDUSTRIAL = "industrial",
  AGRICULTURAL = "agricultural",
}