import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description:
    "maalesef platformunun ironik, kurgusal ve hafif sarkastik kullanım şartları. Gerçek iş yok; gerçek sorunlara dair bir mercek var.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <article className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Kullanım Şartları
          </h1>
        </div>

        <div className="space-y-12 border-t border-border pt-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              1. Amaç ve Kapsam
            </h2>
            <p className="text-lg leading-8 text-muted">
              Platformun amacı, gerçek iş başvurularında yaşanan sessizliği,
              ghosting kültürünü ve sonsuz değerlendirme ritüellerini görünür
              kılmaktır. Buradaki ilanlar, şirket bilgileri ve yanıt taslakları
              tamamen kurgusaldır; herhangi bir istihdam veya kariyer fırsatı
              sağlama amacı gütmez.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              2. Hesap ve Kullanım
            </h2>
            <ul className="space-y-3 text-lg leading-8 text-muted">
              <li>
                Kullanıcılar, kayıt aşamasında sunulan bilgilerin doğruluğundan
                ve şifre güvenliğinden bizzat sorumludur.
              </li>
              <li>
                Platform yalnızca kişisel ve deneysel amaçlarla kullanılabilir;
                ticari kullanım, veri kazıma ve her türlü otomasyon yasaktır.
              </li>
              <li>
                Saldırgan, yasa dışı veya platformun ironik doğasına aykırı
                içerik paylaşımı hesap kısıtlamasıyla sonuçlanabilir.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              3. Kurgusallık ve Sorumluluk Reddi
            </h2>
            <p className="text-lg leading-8 text-muted">
              Platformdaki tüm içerikler kurgu eseridir. Buradaki ret mesajları
              veya süreçler gerçek dünya kariyer kararları için bir referans
              teşkil etmez. Platform; servis sürekliliği, verilerin mutlak
              doğruluğu veya belirli bir kullanıcı tatmini konusunda taahhüt
              vermez.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              4. Hizmetin Kapsamı
            </h2>
            <p className="text-lg leading-8 text-muted">
              Hizmet "olduğu gibi" sunulmaktadır. Platform; bakım çalışmaları,
              güvenlik gereksinimleri veya iyileştirmeler nedeniyle hizmeti
              geçici olarak durdurma veya değiştirme hakkını saklı tutar.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              5. Fikri Mülkiyet
            </h2>
            <p className="text-lg leading-8 text-muted">
              Uygulamanın tasarımı, metin içerikleri ve yazılım altyapısı
              maalesef platformuna aittir. Yazılı izin olmaksızın platform
              içeriğinin kopyalanması, dağıtılması veya üzerinde değişiklik
              yapılması yasaktır.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Fesih</h2>
            <p className="text-lg leading-8 text-muted">
              Kullanıcılar hesaplarını diledikleri zaman silebilir. Kullanım
              şartlarının ihlali durumunda platform, ilgili hesabı askıya alma
              veya sonlandırma hakkına sahiptir.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
