import { FileText, Send, Clock, XCircle } from "lucide-react";

const steps = [
  {
    icon: <FileText size={24} strokeWidth={1.5} />,
    title: "İlanları Keşfet",
    desc: "Yüzlerce şirket arasından, senin için en uygun 'hayır' cevabını verecek olanı seç.",
  },
  {
    icon: <Send size={24} strokeWidth={1.5} />,
    title: "Başvurunu Yap",
    desc: "CV'ni yükle ve o heyecanlı bekleyiş sürecine başla.",
  },
  {
    icon: <Clock size={24} strokeWidth={1.5} />,
    title: "Yapay Zeka Değerlendirsin",
    desc: "Gelişmiş AI algoritmamız CV'nizi 1-2 gün içinde analiz edip gerçekçi bir ret mektubu hazırlar.",
  },
  {
    icon: <XCircle size={24} strokeWidth={1.5} />,
    title: "Reddedilme Keyfini Yaşa",
    desc: "Kişiselleştirilmiş, sıcak ve bir o kadar da kalıp bir ret cevabıyla süreci tamamla.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-surface border-t border-border relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-accent font-semibold tracking-wide uppercase text-sm mb-3">
            Süreç Nasıl İşliyor?
          </h2>
          <h3 className="text-3xl font-bold text-foreground sm:text-4xl">
            Adım Adım Hayal Kırıklığı
          </h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Static content
              key={i}
              className="group relative bg-background rounded-2xl p-8 border border-border transition-all duration-300 hover:shadow-xl hover:border-accent/30 hover:-translate-y-1"
            >
              <div className="absolute top-6 right-6 text-6xl font-black text-surface-hover/80 select-none -z-0 group-hover:text-accent/5 transition-colors">
                {i + 1}
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-accent-muted text-accent flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
