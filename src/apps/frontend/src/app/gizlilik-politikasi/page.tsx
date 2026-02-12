import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "maalesef'in kurgusal, ironik deneyiminde verilerinizi nasıl (minimumda) kullandığımız ve ghosting kültürünü görünür kılarken neleri yapmadığımız.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <article className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Gizlilik Politikası
          </h1>
        </div>

        <div className="space-y-12 border-t border-border pt-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Toplanan Veriler
            </h2>
            <ul className="space-y-3 text-lg leading-8 text-muted">
              <li>
                <strong>Hesap bilgileri:</strong> Ad-soyad, e-posta, şifre
                (güvenli şekilde saklanır).
              </li>
              <li>
                <strong>Kullanım verileri:</strong> Başvurulan kurgusal ilanlar,
                simülasyon sonuçları, bildirim tercihleri.
              </li>
              <li>
                <strong>Teknik veriler:</strong> IP adresi, tarayıcı türü, cihaz
                bilgisi ve hata günlükleri.
              </li>
              <li>
                <strong>Çerezler:</strong> Oturumun hatırlanması ve temel
                analitik süreçler için sınırlı çerezler kullanılır.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Verilerin Kullanım Amaçları
            </h2>
            <ul className="space-y-3 text-lg leading-8 text-muted">
              <li>
                Kimlik doğrulama, oturum yönetimi ve kullanıcı hesabının
                işlerliği.
              </li>
              <li>
                Kurgusal başvuru ve ret akışlarını yönetmek; istatistik ve
                bildirimleri sunmak.
              </li>
              <li>
                Güvenlik: kötüye kullanımı tespit etmek, sistemi korumak ve
                performansı ölçmek.
              </li>
              <li>
                Ürün geliştirme: anonimleştirilmiş analizler ile kullanıcı
                deneyimini iyileştirmek.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Paylaşım ve Aktarım
            </h2>
            <p className="text-lg leading-8 text-muted">
              Veri satışı yapılmaz ve veriler gerçek işverenlerle paylaşılmaz.
              Hizmetin sunulması için güvenilir servis sağlayıcıları
              (barındırma, e-posta, analitik) kullanılabilir; bu sağlayıcılar
              verileri yalnızca uygulama talimatları doğrultusunda işler.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Saklama Süresi
            </h2>
            <p className="text-lg leading-8 text-muted">
              Kullanıcı hesabı aktif kaldığı sürece veriler saklanır. Hesap
              silindiğinde makul süre içinde kişisel veriler silinir veya
              anonimleştirilir.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Kullanıcı Hakları
            </h2>
            <ul className="space-y-3 text-lg leading-8 text-muted">
              <li>
                Erişim: Hesap bilgileri ve simülasyon geçmişi görüntülenebilir.
              </li>
              <li>Düzeltme: Eksik veya hatalı veriler güncellenebilir.</li>
              <li>
                Silme: Hesabın kapatılmasıyla verilerin silinmesi talep
                edilebilir.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Güvenlik</h2>
            <p className="text-lg leading-8 text-muted">
              Şifreler hash'lenmiş olarak saklanır; erişimler yetkilendirme
              kontrolleri ile korunur.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
