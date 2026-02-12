import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/users/entities/user.entity.js';
import { Job } from '../modules/jobs/entities/job.entity.js';
import { NotificationEntity } from '../modules/notifications/entities/notification.entity.js';
import {
  Application,
  ApplicationStatus,
} from '../modules/applications/entities/application.entity.js';
import {
  UserBadge,
  BadgeType,
} from '../modules/badges/entities/user-badge.entity.js';

import * as crypto from 'crypto';

function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    ç: 'c',
    Ç: 'C',
    ğ: 'g',
    Ğ: 'G',
    ı: 'i',
    İ: 'I',
    ö: 'o',
    Ö: 'O',
    ş: 's',
    Ş: 'S',
    ü: 'u',
    Ü: 'U',
  };
  return text
    .toString()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => trMap[match] || match)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(NotificationEntity)
    private readonly notifRepo: Repository<NotificationEntity>,
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    @InjectRepository(UserBadge)
    private readonly badgeRepo: Repository<UserBadge>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    try {
      this.logger.log('Seeding database...');

      const adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
      const adminName = this.configService.getOrThrow<string>('ADMIN_NAME');
      const adminPassword = this.getAdminPassword();

      let adminUser = await this.userRepo.findOne({
        where: { email: adminEmail },
      });

      if (adminUser) {
        const passwordMatches = await bcrypt.compare(
          adminPassword,
          adminUser.password,
        );

        let hasChanges = false;

        if (!passwordMatches) {
          adminUser.password = await bcrypt.hash(adminPassword, 12);
          hasChanges = true;
          this.logger.log('Admin şifresi .env ile güncellendi.');
        }

        if (!adminUser.emailVerified) {
          adminUser.emailVerified = true;
          adminUser.emailVerifiedAt = new Date();
          adminUser.emailVerificationToken = null;
          adminUser.emailVerificationTokenExpiresAt = null;
          hasChanges = true;
          this.logger.log('Admin e-posta doğrulaması aktif edildi.');
        }

        if (hasChanges) {
          adminUser = await this.userRepo.save(adminUser);
        }
      } else {
        adminUser = await this.userRepo.save(
          this.userRepo.create({
            name: adminName,
            email: adminEmail,
            password: await bcrypt.hash(adminPassword, 12),
            emailVerified: true,
            emailVerifiedAt: new Date(),
            emailVerificationToken: null,
            emailVerificationTokenExpiresAt: null,
            shareCount: 7, // For badge demonstration
          }),
        );
        this.logger.log('Admin kullanıcısı oluşturuldu.');
      }

      const jobCount = await this.jobRepo.count();
      let jobs = await this.jobRepo.find({
        take: 2,
        order: { createdAt: 'ASC' },
      });

      if (jobCount === 0) {
        jobs = await this.jobRepo.save([
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'Frontend Developer',
            company: 'EvilCorp Inc.',
            location: 'İstanbul, Türkiye (Hibrit)',
            shortDescription:
              'Modern web teknolojileri ile kullanıcı arayüzleri geliştirmek üzere deneyimli bir Frontend Developer arıyoruz.',
            fullDescription:
              'TeknoSoft A.Ş. olarak büyüyen ekibimize katılacak, React ve Next.js ekosisteminde deneyimli bir Frontend Developer arıyoruz.\n\nGörev tanımı:\n- Kullanıcı arayüzlerinin tasarım ekibiyle birlikte geliştirilmesi\n- Mevcut uygulamaların performans optimizasyonu\n- RESTful API entegrasyonları\n- Kod review süreçlerine aktif katılım\n- Birim testlerin yazılması ve bakımı\n\nSunduğumuz imkanlar:\n- Esnek çalışma saatleri\n- Yemek kartı ve özel sağlık sigortası\n- Yılda 2 kez şirket etkinlikleri',
            requirements: [
              'En az 3 yıl React deneyimi',
              'TypeScript bilgisi',
              'Next.js ile proje deneyimi',
              'Git versiyon kontrol sistemi bilgisi',
              'Responsive tasarım konusunda deneyim',
              'İyi derecede İngilizce',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 45.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'Kaç yıllık frontend deneyiminiz var?',
                type: 'select' as const,
                options: ['0-1 yıl', '1-3 yıl', '3-5 yıl', '5-7 yıl', '7+ yıl'],
                required: true,
              },
              {
                id: 'q3',
                label:
                  'Daha önce hangi React projelerinde çalıştınız? Kısaca açıklayın.',
                type: 'textarea' as const,
                placeholder:
                  'Projelerinizi ve kullandığınız teknolojileri açıklayın...',
                required: true,
              },
            ],
          }),
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'Backend Developer (Node.js)',
            company: 'EvilCorp Inc.',
            location: 'Ankara, Türkiye (Uzaktan)',
            shortDescription:
              'Ölçeklenebilir backend sistemleri geliştirmek için Node.js konusunda deneyimli bir geliştirici arıyoruz.',
            fullDescription:
              "DataFlow Teknoloji, fintech alanında hizmet veren ve hızla büyüyen bir teknoloji şirketidir. Backend ekibimize katılacak tutkulu bir geliştirici arıyoruz.\n\nSorumluluklar:\n- Mikroservis mimarisi ile backend geliştirme\n- Veritabanı tasarımı ve optimizasyonu (PostgreSQL, Redis)\n- API tasarımı ve dokümantasyonu\n- CI/CD pipeline'larının yönetimi\n- Güvenlik standartlarına uygun kod geliştirme\n\nSunduğumuz imkanlar:\n- Tamamen uzaktan çalışma\n- Birey odaklı kariyer gelişim planı\n- Konferans ve eğitim bütçesi",
            requirements: [
              'En az 4 yıl Node.js deneyimi',
              'PostgreSQL veya benzeri RDBMS deneyimi',
              'Docker ve containerization bilgisi',
              'REST API tasarımı konusunda deneyim',
              'Mikroservis mimarisi bilgisi',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 50.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'Kaç yıllık Node.js deneyiminiz var?',
                type: 'select' as const,
                options: ['0-1 yıl', '1-3 yıl', '3-5 yıl', '5-7 yıl', '7+ yıl'],
                required: true,
              },
              {
                id: 'q3',
                label: 'Docker ve Kubernetes konusunda deneyiminizi açıklayın.',
                type: 'textarea' as const,
                placeholder: 'Deneyiminizi kısaca özetleyin...',
                required: false,
              },
            ],
          }),
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'UI/UX Designer',
            company: 'EvilCorp Inc.',
            location: 'İzmir, Türkiye (Ofiste)',
            shortDescription:
              'Kullanıcı deneyimini ön planda tutan, yaratıcı ve analitik düşünen bir UI/UX Designer arıyoruz.',
            fullDescription:
              'Kreatif Dijital olarak müşterilerimize en iyi dijital deneyimi sunmayı hedefliyoruz. Ekibimize katılacak, kullanıcı odaklı tasarım yapabilen bir UI/UX Designer arıyoruz.\n\nGörev tanımı:\n- Kullanıcı araştırması ve persona oluşturma\n- Wireframe ve prototip hazırlama (Figma)\n- Tasarım sistemleri oluşturma ve yönetme\n- A/B testleri ve kullanılabilirlik testleri\n- Frontend ekibiyle yakın çalışma\n\nSunduğumuz imkanlar:\n- Modern ofis ortamı\n- Yaratıcı ekip kültürü\n- Design tool lisansları şirketten',
            requirements: [
              'En az 2 yıl UI/UX tasarım deneyimi',
              "Figma'da ileri düzey yetkinlik",
              'Kullanıcı araştırması metodolojileri bilgisi',
              'Tasarım sistemi oluşturma deneyimi',
              'Portfolyo zorunludur',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 35.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'Tasarım deneyiminiz kaç yıl?',
                type: 'select' as const,
                options: ['0-1 yıl', '1-3 yıl', '3-5 yıl', '5+ yıl'],
                required: true,
              },
              {
                id: 'q3',
                label: 'Portfolyo linkinizi paylaşır mısınız?',
                type: 'text' as const,
                placeholder: 'https://portfolyo.com/...',
                required: true,
              },
            ],
          }),
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'DevOps Engineer',
            company: 'EvilCorp Inc.',
            location: 'İstanbul, Türkiye (Uzaktan)',
            shortDescription:
              'Cloud altyapı yönetimi ve otomasyon süreçlerini geliştirmek üzere deneyimli bir DevOps Engineer arıyoruz.',
            fullDescription:
              "BulutVeri A.Ş., Türkiye'nin önde gelen cloud hizmet sağlayıcılarından biridir. Altyapı ekibimize katılacak deneyimli bir DevOps Engineer arıyoruz.\n\nSorumluluklar:\n- AWS/GCP altyapı yönetimi\n- Terraform ile Infrastructure as Code\n- Kubernetes cluster yönetimi\n- Monitoring ve alerting sistemleri kurulumu\n- Güvenlik politikalarının uygulanması\n\nSunduğumuz imkanlar:\n- Uzaktan çalışma\n- AWS/GCP sertifika desteği\n- Performans bazlı bonus sistemi",
            requirements: [
              'En az 3 yıl DevOps deneyimi',
              'AWS veya GCP sertifikası tercih sebebi',
              'Terraform deneyimi',
              'Kubernetes yönetimi',
              'Linux sistem yönetimi',
              'CI/CD araçları deneyimi (Jenkins, GitLab CI, GitHub Actions)',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 55.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'Hangi cloud platformlarında deneyiminiz var?',
                type: 'select' as const,
                options: ['AWS', 'GCP', 'Azure', 'AWS + GCP', 'Hepsi'],
                required: true,
              },
              {
                id: 'q3',
                label:
                  'Kubernetes ile yönettiğiniz en büyük cluster hakkında bilgi verin.',
                type: 'textarea' as const,
                placeholder:
                  'Cluster boyutu, node sayısı, kullanılan araçlar...',
                required: false,
              },
            ],
          }),
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'Mobile Developer (React Native)',
            company: 'EvilCorp Inc.',
            location: 'Bursa, Türkiye (Hibrit)',
            shortDescription:
              'iOS ve Android platformlarında React Native ile mobil uygulama geliştirmek üzere bir geliştirici arıyoruz.',
            fullDescription:
              'AppVista, mobil uygulama geliştirme alanında uzmanlaşmış bir yazılım şirketidir. React Native ile cross-platform mobil uygulamalar geliştirecek bir developer arıyoruz.\n\nSorumluluklar:\n- React Native ile mobil uygulama geliştirme\n- Native modül entegrasyonları\n- App Store ve Google Play yayınlama süreçleri\n- Performans optimizasyonu\n- Push notification ve deep linking implementasyonu\n\nSunduğumuz imkanlar:\n- Haftada 2 gün uzaktan çalışma\n- Güncel cihaz temini\n- Eğitim ve gelişim bütçesi',
            requirements: [
              'En az 2 yıl React Native deneyimi',
              'iOS ve Android platform bilgisi',
              'Redux veya benzeri state management deneyimi',
              'REST API entegrasyonu deneyimi',
              'App Store/Google Play yayınlama deneyimi',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 40.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'React Native deneyiminiz kaç yıl?',
                type: 'select' as const,
                options: ['0-1 yıl', '1-2 yıl', '2-3 yıl', '3-5 yıl', '5+ yıl'],
                required: true,
              },
              {
                id: 'q3',
                label:
                  'Yayınladığınız bir mobil uygulama var mı? Varsa linkini paylaşın.',
                type: 'text' as const,
                placeholder: 'App Store veya Google Play linki...',
                required: false,
              },
            ],
          }),
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'Data Analyst',
            company: 'EvilCorp Inc.',
            location: 'İstanbul, Türkiye (Ofiste)',
            shortDescription:
              'Veri analizi ve raporlama süreçlerini yönetecek, analitik düşünebilen bir Data Analyst arıyoruz.',
            fullDescription:
              'InsightLab, e-ticaret sektöründe veri odaklı çözümler sunan bir analitik şirketidir. Müşterilerimize değer katacak veri analizleri yapacak bir Data Analyst arıyoruz.\n\nSorumluluklar:\n- SQL ile veri sorgulama ve analiz\n- Dashboard ve rapor oluşturma\n- A/B test analizleri\n- Veri kalitesi kontrolü\n- İş birimlerine veri odaklı öneriler sunma\n\nSunduğumuz imkanlar:\n- Merkezi lokasyonda modern ofis\n- Yemek ve ulaşım desteği\n- Online kurs abonelikleri',
            requirements: [
              'En az 2 yıl veri analizi deneyimi',
              'SQL konusunda ileri düzey bilgi',
              'Python veya R bilgisi tercih sebebi',
              'Tableau veya Power BI deneyimi',
              'İstatistik bilgisi',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 35.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'Veri analizi deneyiminiz kaç yıl?',
                type: 'select' as const,
                options: ['0-1 yıl', '1-2 yıl', '2-3 yıl', '3-5 yıl', '5+ yıl'],
                required: true,
              },
              {
                id: 'q3',
                label: 'Hangi BI araçlarını kullanıyorsunuz?',
                type: 'text' as const,
                placeholder: 'Tableau, Power BI, Looker...',
                required: true,
              },
            ],
          }),
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'Full Stack Developer',
            company: 'EvilCorp Inc.',
            location: 'Antalya, Türkiye (Uzaktan)',
            shortDescription:
              'Hem frontend hem backend tarafında güçlü bir Full Stack Developer arıyoruz.',
            fullDescription:
              'YazılımPark, SaaS ürünleri geliştiren ve Türkiye genelinde hizmet veren bir yazılım şirketidir. Ürün ekibimize katılacak Full Stack Developer arıyoruz.\n\nSorumluluklar:\n- React/Next.js ile frontend geliştirme\n- Node.js/NestJS ile backend geliştirme\n- Veritabanı tasarımı (PostgreSQL, MongoDB)\n- API tasarımı ve entegrasyonu\n- Kod review ve mentorluk\n\nSunduğumuz imkanlar:\n- %100 uzaktan çalışma\n- Rekabetçi maaş + RSU\n- 25 gün yıllık izin',
            requirements: [
              'En az 4 yıl full stack geliştirme deneyimi',
              'React ve Node.js bilgisi',
              'TypeScript deneyimi',
              'SQL ve NoSQL veritabanı deneyimi',
              'Agile/Scrum metodolojisi deneyimi',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 55.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'Toplam yazılım geliştirme deneyiminiz kaç yıl?',
                type: 'select' as const,
                options: [
                  '1-3 yıl',
                  '3-5 yıl',
                  '5-7 yıl',
                  '7-10 yıl',
                  '10+ yıl',
                ],
                required: true,
              },
              {
                id: 'q3',
                label: 'Neden uzaktan çalışmayı tercih ediyorsunuz?',
                type: 'textarea' as const,
                placeholder: 'Motivasyonunuzu paylaşın...',
                required: false,
              },
              {
                id: 'q4',
                label: 'Daha önce SaaS ürünlerinde çalıştınız mı? Açıklayın.',
                type: 'textarea' as const,
                placeholder: 'SaaS deneyiminizi kısaca özetleyin...',
                required: true,
              },
            ],
          }),
          this.jobRepo.create({
            createdBy: adminUser,
            title: 'QA Engineer',
            company: 'EvilCorp Inc.',
            location: 'İstanbul, Türkiye (Hibrit)',
            shortDescription:
              'Yazılım kalitesini en üst düzeyde tutacak, otomasyon testleri geliştirecek bir QA Engineer arıyoruz.',
            fullDescription:
              "TestPro Yazılım, yazılım test ve kalite güvence alanında uzmanlaşmış bir şirkettir. Müşteri projelerinde kaliteyi sağlayacak bir QA Engineer arıyoruz.\n\nSorumluluklar:\n- Test planı ve test senaryosu hazırlama\n- Otomasyon testleri geliştirme (Cypress, Playwright)\n- API testleri yazma\n- Bug raporlama ve takip\n- CI/CD pipeline'larına test entegrasyonu\n\nSunduğumuz imkanlar:\n- Haftada 3 gün uzaktan çalışma\n- ISTQB sertifika desteği\n- Takım aktiviteleri",
            requirements: [
              'En az 2 yıl QA deneyimi',
              'Cypress veya Playwright deneyimi',
              'API test araçları bilgisi (Postman, REST Assured)',
              'SQL bilgisi',
              'ISTQB sertifikası tercih sebebi',
            ],
            questions: [
              {
                id: 'q1',
                label: 'Maaş beklentiniz nedir? (Net TL)',
                type: 'text' as const,
                placeholder: 'Örn: 32.000 TL',
                required: true,
              },
              {
                id: 'q2',
                label: 'QA deneyiminiz kaç yıl?',
                type: 'select' as const,
                options: ['0-1 yıl', '1-2 yıl', '2-3 yıl', '3-5 yıl', '5+ yıl'],
                required: true,
              },
              {
                id: 'q3',
                label: 'Hangi test otomasyon araçlarını kullanıyorsunuz?',
                type: 'text' as const,
                placeholder: 'Cypress, Playwright, Selenium...',
                required: true,
              },
            ],
          }),
        ]);
        this.logger.log('Örnek iş ilanları oluşturuldu.');
      }

      const firstJob =
        jobs[0] ??
        (await this.jobRepo.findOne({
          order: { createdAt: 'ASC' },
        }));

      const hasWelcomeNotification = await this.notifRepo.count({
        where: { userId: adminUser.id, title: 'Platforma hoş geldiniz!' },
      });

      if (hasWelcomeNotification === 0) {
        await this.notifRepo.save(
          this.notifRepo.create({
            userId: adminUser.id,
            title: 'Platforma hoş geldiniz!',
            body: 'maalesef platformuna kayıt olduğunuz için teşekkür ederiz. İş ilanlarını inceleyebilir ve başvurularınızı takip edebilirsiniz.',
            read: true,
            shareable: false,
          }),
        );
      }

      if (firstJob) {
        const hasApplicationNotification = await this.notifRepo.count({
          where: {
            userId: adminUser.id,
            title: 'Başvurunuz değerlendiriliyor',
          },
        });

        if (hasApplicationNotification === 0) {
          await this.notifRepo.save(
            this.notifRepo.create({
              userId: adminUser.id,
              title: 'Başvurunuz değerlendiriliyor',
              body: `${firstJob.company} - ${firstJob.title} pozisyonuna yaptığınız başvuru inceleme sürecindedir.`,
              read: false,
              shareable: false,
            }),
          );
        }

        // Add a rejected application for the admin user
        const hasRejectedApplication = await this.appRepo.count({
          where: {
            userId: adminUser.id,
            status: ApplicationStatus.REJECTED,
          },
        });

        if (hasRejectedApplication === 0) {
          const secondJob =
            jobs[1] ??
            (
              await this.jobRepo.find({
                skip: 1,
                take: 1,
                order: { createdAt: 'ASC' },
              })
            )[0];

          if (secondJob) {
            await this.appRepo.save(
              this.appRepo.create({
                userId: adminUser.id,
                jobId: secondJob.id,
                jobTitle: secondJob.title,
                status: ApplicationStatus.REJECTED,
                appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                feedback:
                  'Maalesef tecrübeniz bu pozisyon için yeterli görünmüyor. Özellikle mikroservis mimarileri konusundaki yanıtlarınız beklentilerimizin altında kaldı. Kariyerinizde başarılar dileriz.',
                answers: {},
                aiConsent: false,
              }),
            );

            // Also add a notification for this rejection
            await this.notifRepo.save(
              this.notifRepo.create({
                userId: adminUser.id,
                title: `${secondJob.title} başvurusu değerlendirildi`,
                body: 'Maalesef tecrübeniz bu pozisyon için yeterli görünmüyor. Özellikle mikroservis mimarileri konusundaki yanıtlarınız beklentilerimizin altında kaldı. Kariyerinizde başarılar dileriz.',
                read: false,
                shareable: true,
              }),
            );
          }
        }
      }

      // Backfill missing slugs for jobs
      const sluglessJobs = await this.jobRepo.find({
        where: { slug: IsNull() },
      });
      if (sluglessJobs.length > 0) {
        this.logger.log(`Fixing slugs for ${sluglessJobs.length} jobs...`);
        for (const job of sluglessJobs) {
          const randomId = crypto.randomBytes(3).toString('hex');
          job.slug = `${slugify(job.title)}-${randomId}`;
          await this.jobRepo.save(job);
        }
      }

      // Backfill missing jobSlugs for applications
      const sluglessApps = await this.appRepo.find({
        where: { jobSlug: IsNull() },
      });
      if (sluglessApps.length > 0) {
        this.logger.log(
          `Fixing jobSlugs for ${sluglessApps.length} applications...`,
        );
        for (const app of sluglessApps) {
          const job = await this.jobRepo.findOne({ where: { id: app.jobId } });
          if (job) {
            app.jobSlug = job.slug;
            await this.appRepo.save(app);
          }
        }
      }

      // Add sample badges for admin user
      const hasBadges = await this.badgeRepo.count({
        where: { userId: adminUser.id },
      });

      if (hasBadges === 0) {
        await this.badgeRepo.save([
          this.badgeRepo.create({
            userId: adminUser.id,
            badgeName: 'İlk Maalesef',
            type: BadgeType.REJECTION,
            threshold: 1,
          }),
          this.badgeRepo.create({
            userId: adminUser.id,
            badgeName: 'Dirençli Başvuru',
            type: BadgeType.REJECTION,
            threshold: 5,
          }),
          this.badgeRepo.create({
            userId: adminUser.id,
            badgeName: 'Ses Getiren',
            type: BadgeType.SHARE,
            threshold: 5,
          }),
          this.badgeRepo.create({
            userId: adminUser.id,
            badgeName: 'İstihdam Gönüllüsü',
            type: BadgeType.JOB_POST,
            threshold: 5,
          }),
        ]);
        this.logger.log('Örnek rozetler oluşturuldu.');
      }

      this.logger.log('Database seeded successfully.');
    } catch (error) {
      this.logger.error('Database seed failed', error as Error);
    }
  }

  private getAdminPassword(): string {
    return this.configService.getOrThrow<string>('ADMIN_PASSWORD');
  }
}
