# maalesef

**maalesef**, iş başvurusu süreçlerini daha şeffaf, topluluk odaklı ve anlamlı hale getirmeyi amaçlayan bir platformdur.

## Özellikler

- **İş Başvurusu Takibi:** Başvurularınızı ve aldığınız yanıtları tek bir yerden yönetin.
- **Ret Paylaşımı (Rejection Share):** "Maalesef" ile biten o e-postaları toplulukla paylaşın ve benzer deneyimler yaşayanlarla bağ kurun.
- **Yapay Zeka Destekli Değerlendirme:** Gemini Flash ile başvurular otomatik değerlendirilir ve sistematik olarak reddedilir.
- **Profil ve Rozet Sistemi:** Platformdaki etkileşimlerinize (paylaşım, değerlendirme vb.) göre özel rozetler kazanın ve profilinizi özelleştirin.
- **Milestone Bildirimleri:** Başvuru sayınız veya topluluk etkileşimleriniz belirli bir seviyeye ulaştığında anında haberdar olun.

## Teknoloji Yığını

Bu proje modern bir monorepo mimarisi üzerine kurulu olup aşağıdaki teknolojileri kullanır:

- **Çalışma Zamanı (Runtime):** [Bun](https://bun.sh)
- **Paket Yönetimi & Monorepo:** TurboRepo Workspaces
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Radix UI Themes, Framer Motion
- **Backend:** NestJS, TypeORM, PostgreSQL, Passport JWT
- **AI:** Google Generative AI (Gemini Flash)
- **Linter & Formatter:** Biome (Frontend), ESLint & Prettier (Backend)

## Monorepo Yapısı

```text
src/apps/backend   -> NestJS API + TypeORM + cron tabanlı AI değerlendirme
src/apps/frontend  -> Next.js uygulaması (App Router)
```

## Başlangıç

### Gereksinimler

- [Bun](https://bun.sh/docs/installation) yüklü olmalıdır (v1.3.8+ önerilir).
- Docker ve Docker Compose (en azından PostgreSQL için).

### Kurulum

1. Depoyu klonlayın:

   ```bash
   git clone https://github.com/sametcn99/maalesef.git
   cd maalesef
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   bun install
   ```

3. Çevresel değişkenleri ayarlayın:

   ```bash
   cp .env.example .env
   ```

   Geliştirme için `.env.example` içeriği başlangıçta yeterlidir.

4. Veritabanını başlatın (lokal geliştirme):

   ```bash
   docker compose up -d db
   ```

### Geliştirme Modunda Çalıştırma

Tüm uygulamaları (frontend, backend) aynı anda başlatmak için:

```bash
bun run dev
```

Sadece belirli bir uygulamayı çalıştırmak isterseniz:

```bash
bun turbo run dev --filter=frontend
# veya
bun turbo run dev --filter=backend
```

Varsayılan adresler:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- API Docs (aktifse): `http://localhost:3001/docs`

## Docker ile Tam Çalıştırma (Production Benzeri)

Tüm servisleri (db + backend + frontend) container olarak kaldırmak için:

```bash
docker compose up -d --build
```

## Komutlar

- `bun run build`: Tüm uygulamaları derler.
- `bun run dev`: Geliştirme sunucusunu başlatır.
- `bun run lint`: Kod kalitesini denetler.
- `bun run format`: Kodu otomatik olarak formatlar.
- `bun run check`: Tip kontrolü, lint ve format denetimlerini aynı anda çalıştırır.
- `bun run start`: Uygulamaları production start komutlarıyla çalıştırır.

## Ortam Değişkenleri (Özet)

`.env.example` dosyası referans alınmalıdır. Kritik değişkenler:

- Backend: `PORT`, `DB_*`, `JWT_*`, `SERVICE_URL_BACKEND`, `CORS_ORIGIN`, `SMTP_*`, `MAIL_FROM`
- AI: `GOOGLE_AI_API_KEY`, `GOOGLE_AI_MODEL`
- Frontend build-time: `NEXT_PUBLIC_API_URL`

Notlar:

- `GOOGLE_AI_API_KEY` verilmezse AI değerlendirme akışı pasif kalır.
- Backend migration’lar uygulama açılışında otomatik çalışır (`migrationsRun: true`).
- API dokümantasyonu `ENABLE_API_DOCS=true` iken `/docs` ve `/openapi.json` üzerinden sunulur.

## Lisans

Bu proje [GPL-3.0](LICENSE) lisansı altında lisanslanmıştır.
