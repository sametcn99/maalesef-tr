import { BadgeType } from '../entities/user-badge.entity.js';

export interface BadgeDefinition {
  type: BadgeType;
  threshold: number;
  name: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Rejection Badges (1, 5, 10, 15, 20, 25, 30, ...)
  { type: BadgeType.REJECTION, threshold: 1, name: 'İlk Maalesef' },
  { type: BadgeType.REJECTION, threshold: 5, name: 'Dirençli Başvuru' },
  { type: BadgeType.REJECTION, threshold: 10, name: 'Reddedilme Üstadı' },
  { type: BadgeType.REJECTION, threshold: 15, name: 'Bükülmez Çelik' },
  { type: BadgeType.REJECTION, threshold: 20, name: 'Maalesef Koleksiyoncusu' },
  { type: BadgeType.REJECTION, threshold: 25, name: 'Kariyer Savaşçısı' },
  { type: BadgeType.REJECTION, threshold: 30, name: 'Red Geçirmez' },
  { type: BadgeType.REJECTION, threshold: 35, name: 'İnatçı Aday' },
  { type: BadgeType.REJECTION, threshold: 40, name: 'Mülakat Gazisi' },
  { type: BadgeType.REJECTION, threshold: 45, name: 'Yılmayan Ruh' },
  { type: BadgeType.REJECTION, threshold: 50, name: 'Maalesef Efsanesi' },

  // Share Badges (5, 10, 15, 20, 25, 30, ...)
  { type: BadgeType.SHARE, threshold: 5, name: 'Ses Getiren' },
  { type: BadgeType.SHARE, threshold: 10, name: 'Fısıltı Gazetesi' },
  { type: BadgeType.SHARE, threshold: 15, name: 'Yankı Ustası' },
  { type: BadgeType.SHARE, threshold: 20, name: 'Gündem Belirleyici' },
  { type: BadgeType.SHARE, threshold: 25, name: 'Maalesef Elçisi' },
  { type: BadgeType.SHARE, threshold: 30, name: 'Sosyal Kelebek' },
  { type: BadgeType.SHARE, threshold: 35, name: 'İlham Kaynağı' },
  { type: BadgeType.SHARE, threshold: 40, name: 'Dijital Gezgin' },
  { type: BadgeType.SHARE, threshold: 45, name: 'İçerik Mimarı' },
  { type: BadgeType.SHARE, threshold: 50, name: 'Viral Üstadı' },

  // Job Post Badges (5, 10, 15, 20, 25, 30, ...)
  { type: BadgeType.JOB_POST, threshold: 5, name: 'İstihdam Gönüllüsü' },
  { type: BadgeType.JOB_POST, threshold: 10, name: 'Kariyer Mimarı' },
  { type: BadgeType.JOB_POST, threshold: 15, name: 'Fırsat Fabrikası' },
  { type: BadgeType.JOB_POST, threshold: 20, name: 'Yetenek Avcısı' },
  { type: BadgeType.JOB_POST, threshold: 25, name: 'Sektör Duayeni' },
  { type: BadgeType.JOB_POST, threshold: 30, name: 'İş Veren Mıknatısı' },
  { type: BadgeType.JOB_POST, threshold: 35, name: 'Ekonomik Kalkınmacı' },
  { type: BadgeType.JOB_POST, threshold: 40, name: 'Vizyoner Lider' },
  { type: BadgeType.JOB_POST, threshold: 45, name: 'Pazar Kurucu' },
  { type: BadgeType.JOB_POST, threshold: 50, name: 'İstihdam İmparatoru' },
];
