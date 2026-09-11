import { Series, CreatorSettings, Order } from '../types';
import acledaRealQr from '../assets/images/acleda_qr_real_1788173142774.jpg';

export const initialCreatorSettings: CreatorSettings = {
  bankName: 'ACLEDA Bank / KHQR',
  accountName: 'HANG HAK',
  accountNumber: '015466210',
  khqrString: '00020101021129310014015466210@aclb01090154662105204599953038405802KH5908HANG HAK6010Phnom Penh6304342C',
  qrImageUrl: acledaRealQr,
  defaultSeriesPrice: 1.00
};

export const initialOrders: Order[] = [
  {
    id: 'ORD-9821',
    seriesId: 'series-1',
    seriesTitle: 'ស្នេហ៍ពិតក្រោមពន្លឺព្រះច័ន្ទ',
    amount: 1.00,
    currency: 'USD',
    paymentMethod: 'KHQR',
    customerPhone: '015 466 210',
    customerName: 'សុខ ចាន់ដារ៉ា',
    status: 'COMPLETED',
    createdAt: '2026-08-30 14:20'
  },
  {
    id: 'ORD-9822',
    seriesId: 'series-2',
    seriesTitle: 'អាថ៌កំបាំងភូមិគ្រឹះបុរាណ',
    amount: 1.00,
    currency: 'USD',
    paymentMethod: 'ABA',
    customerPhone: '015 987 654',
    customerName: 'ចាន់ សុភាព',
    status: 'COMPLETED',
    createdAt: '2026-08-30 18:45'
  }
];

export const initialSeriesList: Series[] = [
  {
    id: 'series-1',
    title: 'ស្នេហ៍ពិតក្រោមពន្លឺព្រះច័ន្ទ',
    genre: ['រឿងមនោសញ្ចេតនា', 'រឿងភាគដិតដวงចិត្ត'],
    description: 'ជារឿងភាគដ៏រំភើបនិងរំជួលចិត្ត រវាងបុរសមេធាវីអភិជន និងនារីរាំរបាំបុរាណម្នាក់ ដែលត្រូវជួបឧបសគ្គស្នេហាជាច្រើនក្នុងសង្គមស៊ីវីល័យ។',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    totalEpisodes: 40,
    price: 1.00,
    currency: 'USD',
    rating: 4.8,
    views: 45200,
    releaseYear: 2026,
    episodes: Array.from({ length: 40 }, (_, i) => {
      const epNum = i + 1;
      const isFree = epNum <= 5;
      return {
        id: `s1-ep${epNum}`,
        seriesId: 'series-1',
        episodeNumber: epNum,
        title: `ភាគទី ${epNum} ${epNum <= 5 ? '(ឥតគិតថ្លៃ)' : '(វីដេអូបង់ប្រាក់)'}`,
        duration: '42 នាទី',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: `https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80`,
        isFree,
        description: `ការវិវត្តនៃសាច់រឿងក្នុងភាគទី ${epNum} កាន់តែជក់ចិត្ត និងមានឈុតឆាករំភើបក្រៃលែង។`
      };
    })
  },
  {
    id: 'series-2',
    title: 'អាថ៌កំបាំងភូមិគ្រឹះបុរាណ',
    genre: ['រឿងអាថ៌កំបាំង', 'រន្ធត់'],
    description: 'ក្រុមយុវជនវ៉ែនតាខ្មៅ៣នាក់ បានសម្រេចចិត្តចូលទៅក្នុងភូមិគ្រឹះចាស់ទំរង់សម័យអាណានិគមដែលបោះបង់ចោល ហើយបានប្រទះឃើញរឿងរ៉ាវព្រលឹងខ្មោចអតីតកាល។',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    totalEpisodes: 30,
    price: 1.00,
    currency: 'USD',
    rating: 4.6,
    views: 32100,
    releaseYear: 2025,
    episodes: Array.from({ length: 30 }, (_, i) => {
      const epNum = i + 1;
      const isFree = epNum <= 5;
      return {
        id: `s2-ep${epNum}`,
        seriesId: 'series-2',
        episodeNumber: epNum,
        title: `ភាគទី ${epNum} ${epNum <= 5 ? '(ឥតគិតថ្លៃ)' : '(វីដេអូបង់ប្រាក់)'}`,
        duration: '38 នាទី',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80`,
        isFree,
        description: `តម្រុយថ្មីៗត្រូវបានរកឃើញក្នុងភាគទី ${epNum} ដែលនាំឱ្យមានការភ្ញាក់ផ្អើលដល់គ្រប់គ្នា។`
      };
    })
  },
  {
    id: 'series-3',
    title: 'ក្ដីស្រមៃលើសង្វៀន',
    genre: ['រឿងក្បាច់គុន', 'ប្រយុទ្ធ'],
    description: 'ក្មេងប្រុសស្រុកស្រែចម្ការម្នាក់មានទេពកោសល្យផ្នែកគុនល្បុក្កតោ បានតស៊ូប្រកួតប្រជែងរហូតដល់កម្រិតពិភពលោក ដើម្បីកិត្តិយសជាតិ។',
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80',
    totalEpisodes: 25,
    price: 1.00,
    currency: 'USD',
    rating: 4.9,
    views: 89000,
    releaseYear: 2026,
    episodes: Array.from({ length: 25 }, (_, i) => {
      const epNum = i + 1;
      const isFree = epNum <= 5;
      return {
        id: `s3-ep${epNum}`,
        seriesId: 'series-3',
        episodeNumber: epNum,
        title: `ភាគទី ${epNum} ${epNum <= 5 ? '(ឥតគិតថ្លៃ)' : '(វីដេអូបង់ប្រាក់)'}`,
        duration: '45 នាទី',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: `https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80`,
        isFree,
        description: `ការប្រកួតវគ្គជម្រុះក្នុងភាគទី ${epNum} គឺពោរពេញដោយភាពតានតឹង និងកលល្បិចថ្មីៗ។`
      };
    })
  }
];
