import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkında",
  description:
    "maalesef, sektördeki kronik sessizliği ve tuhaf ritüelleri ironik biçimde yüzünüze tutan kurgusal bir deneyim. Gerçek iş yok; sadece gerçek problemler var.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <article className="space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Hakkında
        </h1>
        <div className="space-y-6 text-lg leading-8 text-muted">
          <p>
            Sektördeki kronik sessizliği ve tuhaf ritüelleri ironik biçimde bir
            aynaya çeviren <strong>maalesef</strong>, gerçek işlerin büyük bir
            kısmının cevapsız kaldığı, sürecin belirsiz vaatlerle noktalandığı o
            yorucu iletişim döngüsünü görünür kılmayı hedefleyen kurgusal bir
            deneyimdir. İnsan kaynakları süreçlerinin e-posta sessizliğine,
            kurumsal sunumların ise sonsuz değerlendirme döngülerine dönüştüğü
            bu ortamda uygulama, adayların sıklıkla karşılaştığı ancak dile
            getirilmeyen o yorgunluğu görünür kılmayı amaçlar.
          </p>
          <p>
            Sessizliğin normalleşmesine karşı bir duruş sergileyen bu platform,
            iş arama sürecindeki belirsizlik ve ghosting kültürünü tartışmaya
            açmayı amaçlar. Süreci kurgusal ilanlar ve küçük detaylarla yeniden
            canlandıran uygulama; adayların motivasyonunu etkileyen bu
            sessizliği kontrollü bir şekilde yansıtır. Temel amacı, sessizliği
            bir standart olmaktan çıkarıp, şirketleri daha açık ve insani bir
            iletişime yönlendirecek bir mercek sunmaktır.
          </p>
          <p>
            Bu simülasyon içerisinde, kurgusal ilanlara başvuran her kullanıcı
            için otomatik akışlar tetiklenir ve sistem asla asılsız bir geri
            dönüş vaadinde bulunmaz. Gerçek iş, istihdam veya kurumsal aile
            söylemlerinin uzağında duran platform; hiçbir verinin dışarıya
            aktarılmadığı, tamamen güvenli ve ironi odaklı bir alan sağlar.
          </p>
          <p>
            Uygulama; beklentileri gerçekçi bir zemine oturtmayı, sürecin
            görünmez yükünü ifşa etmeyi ve adaylara bu süreçte yalnız
            olmadıklarını hatırlatmayı hedefler. Mizah ve ironiyi kullanarak
            sektörün iletişim sorunlarını yeniden düşündürmeyi amaçlayan bir
            araç olarak kurgulanmıştır. Platformun bu farkındalık çabasına
            sosyal medya üzerinden paylaşımlarda bulunarak destek olunabilir.
          </p>
        </div>
      </article>
    </div>
  );
}
