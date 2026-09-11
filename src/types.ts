export interface Episode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  isFree: boolean;
  description: string;
}

export interface Series {
  id: string;
  title: string;
  genre: string[];
  description: string;
  coverImage: string;
  bannerImage: string;
  totalEpisodes: number;
  price: number;
  currency: 'USD' | 'KHR';
  rating: number;
  views: number;
  releaseYear: number;
  episodes: Episode[];
}

export interface Order {
  id: string;
  seriesId: string;
  seriesTitle: string;
  amount: number;
  currency: 'USD' | 'KHR';
  paymentMethod: 'KHQR' | 'ABA' | 'ACLEDA' | 'Bakong';
  customerPhone: string;
  customerName: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  slipImage?: string;
}

export interface CreatorSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  khqrString: string;
  qrImageUrl: string;
  defaultSeriesPrice: number;
}
