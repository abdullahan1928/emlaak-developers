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
  COMMERCIAL = "commercial",
  RESIDENTIAL = "residential",
  INDUSTRIAL = "industrial",
  AGRICULTURAL = "agricultural",
  MIXED_USE = "mixed-use",
  TOWNSHIP = "township",
  HOUSING_SOCIETY = "housing-society",
}

export enum AreaUnit {
  MARLA = "marla",
  KANAL = "kanal",
  SQFT = "sqft",
  SQYD = "sqyd",
}