# Katkıda Bulunma Rehberi

**maalesef** projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu platformun gelişmesine yardımcı olacak her türlü katkı (hata bildirimi, yeni özellik önerisi veya kod düzeltmesi) bizim için çok değerlidir.

## Nasıl Katkıda Bulunabilirim?

### 1. Hata Bildirimi (Bug Reports)

Eğer uygulamada bir hata ile karşılaşırsanız, lütfen GitHub Issues üzerinden bir kayıt oluşturun. Bildiriminizde şu ayrıntılara yer vermeniz süreci hızlandıracaktır:

- Hatanın kısa ve net bir açıklaması.
- Hatayı yeniden oluşturmak için izlenmesi gereken adımlar.
- Beklenen sonuç ve aslında gerçekleşen sonuç.
- (Varsa) Hata ekran görüntüleri, tarayıcı konsol çıktıları veya backend logları.

### 2. Özellik Önerileri (Feature Requests)

Platformda olmasını istediğiniz yeni bir özellik mi var? Lütfen önce mevcut "Issue" kayıtlarını kontrol edin. Eğer benzer bir istek yoksa, yeni bir kayıt açarak önerinizi detaylandırın.

### 3. Kod Katkıları (Pull Requests)

- Önce projeyi fork edin.
- Yerel makinenizde yeni bir branch oluşturun: `git checkout -b feature/harika-ozellik` veya `fix/hata-adi`.
- Gerekli değişiklikleri yapın.
- Kodunuzun mevcut standartlara uygunluğunu kontrol etmek için root dizininde `bun run check` komutunu çalıştırın.
- Değişikliklerinizi commit edin ve branch'inizi GitHub'a push edin.
- Projenin `main` branch'ine yönelik bir Pull Request (PR) açın.

## Kodlama Standartları

- **Diller:** Proje TypeScript kullanılarak geliştirilmektedir. Mümkün olduğunca en güncel dil özelliklerini ve güvenli tip tanımlamalarını kullanın.
- **Frontend (Next.js):** [Biome](https://biomejs.dev/) kurallarına uygun kod yazın. Component tabanlı ve temiz kod prensiplerini takip edin.
- **Backend (NestJS):** NestJS mimari prensiplerine (Dependency Injection, Service/Controller ayrımı vb.) uyun. ESLint ve Prettier kurallarını takip edin.
- **İsimlendirme:** Kod içerisinde değişken, fonksiyon ve sınıf isimlerinde açıklayıcı İngilizce terimler kullanın. Ancak kullanıcıya dönük metinler ve dokümantasyon Türkçe olmalıdır.

## Geliştirme Akışı

Proje monorepo yapısında olduğu için bağımlılık yönetimi ve komut çalıştırma işlemleri `turbo` üzerinden yürütülür.

- Yeni bir paket eklemek için:

  ```bash
  bun add <paket-adi> --filter <frontend|backend>
  ```

- Tüm testleri çalıştırmak için:

  ```bash
  bun turbo run test
  ```

## İletişim

Herhangi bir sorunuz olduğunda GitHub Issues bölümünden bizimle iletişime geçmekten çekinmeyin.

**Teşekkürler!**
