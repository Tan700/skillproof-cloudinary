export type AssetType = 'video' | 'image' | 'raw';

export type ProjectAsset = {
  publicId: string;
  secureUrl: string;
  resourceType: AssetType;
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
  createdAt?: string;
  label?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  skills: string[];
  creator: string;
  creatorRole: string;
  createdAt: string;
  assets: ProjectAsset[];
  links: { github?: string; demo?: string };
};
