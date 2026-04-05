export interface Testimonial {
  name: string;
  role: string;
  text: string;
}

export const testimonials: Testimonial[] = [
  // --- Yazılımcılar ---
  {
    name: "Ahmet Y.",
    role: "Kıdemli Developer",
    text: "Hayatımda aldığım en hızlı ret cevabıydı. Kahvem bitmeden reddedildim, harika bir verimlilik!",
  },
  {
    name: "Ayşe K.",
    role: "UX Designer",
    text: "Reddedilme maili o kadar profesyoneldi ki, neredeyse işe alındım sandım. Teşekkürler Maalesef!",
  },
  {
    name: "Mehmet S.",
    role: "Product Manager",
    text: "Artık belirsizlik yok. 'Size döneceğiz' yalanı yok. Direkt 'Hayır' var. Dürüstlük budur.",
  },
  {
    name: "Elif T.",
    role: "Frontend Developer",
    text: "3 yıl tecrübe istiyorlardı, 5 yılım var diye reddedildim. Overqualified ret çok şık olmuş.",
  },
  {
    name: "Can D.",
    role: "DevOps Engineer",
    text: "CI/CD pipeline'ım deployment'tan hızlı ama bu ret daha hızlıydı. Respect.",
  },
  {
    name: "Zeynep A.",
    role: "Data Scientist",
    text: "Ret maillini sentiment analysis'e soktum, %99.7 profesyonellik skoru çıktı. Bravo.",
  },
  {
    name: "Burak M.",
    role: "Mobile Developer",
    text: "App Store reject'lerinden sonra iş reject'i yemeye alışığım ama bu kadar hızlısını görmedim.",
  },
  {
    name: "Selin Ö.",
    role: "Backend Developer",
    text: "Microservice mimarisinden daha hızlı scale eden bi ret sistemi. Helal olsun.",
  },
  {
    name: "Oğuz K.",
    role: "Full Stack Dev",
    text: "Hem frontend hem backend biliyorum ama bu retin hızını bilmiyordum. 10/10.",
  },
  {
    name: "Deniz R.",
    role: "QA Engineer",
    text: "Bug-free bir ret süreci. Hiçbir hata yok. Test ettim, onaylıyorum.",
  },
  // --- Tasarımcılar ---
  {
    name: "İrem B.",
    role: "UI Designer",
    text: "Ret mailinin tipografisi mükemmeldi. Hangi font bu? Kerning'i bile doğru.",
  },
  {
    name: "Kaan V.",
    role: "Graphic Designer",
    text: "Reddedilme deneyiminin UX'i 5 yıldız. Onboarding'den bile iyi.",
  },
  {
    name: "Naz E.",
    role: "Motion Designer",
    text: "'Maalesef' butonu tıklandığında çıkan animasyon, portfolio'ma koyabilir miyim?",
  },
  {
    name: "Emre Ç.",
    role: "Brand Designer",
    text: "Şirketin ret verme tarzı bile branding açısından tutarlı. Kim yaptı bunu?",
  },
  // --- Yöneticiler ---
  {
    name: "Hakan P.",
    role: "CTO",
    text: "Engineering ekibime başvuranları artık burada reddediyoruz. Zaman tasarrufu inanılmaz.",
  },
  {
    name: "Merve L.",
    role: "HR Manager",
    text: "Eskiden ret maili yazmak yarım saatimi alıyordu. Artık 0.3 saniye. Hayat kurtarıcı.",
  },
  {
    name: "Serkan U.",
    role: "CEO",
    text: "Investor'lara bile bu systemi gösterdim. 'Biz de kullanabilir miyiz?' dediler.",
  },
  {
    name: "Pınar G.",
    role: "Team Lead",
    text: "Ekibime doğru kişiyi bulmak zor. Ama yanlış kişiyi reddetmek artık çok kolay.",
  },
  // --- Stajyerler & Yeni Mezunlar ---
  {
    name: "Arda N.",
    role: "Stajyer",
    text: "Hayatımda ilk kez profesyonelce reddedildim. Büyümüş hissediyorum.",
  },
  {
    name: "Buse F.",
    role: "Yeni Mezun",
    text: "Üniversitede proje reddi yerdim hep. Ama bu başka seviye. Çok kaliteli bir hayır.",
  },
  {
    name: "Tolga H.",
    role: "Junior Developer",
    text: "İlk iş başvurum, ilk reddim. Bu platformda başlamak güzel oldu aslında.",
  },
  {
    name: "Gizem S.",
    role: "Bootcamp Mezunu",
    text: "12 haftalık bootcamp'in ardından 12 saniyelik ret aldım. Efficiency masterclass.",
  },
  // --- Sektör Profesyonelleri ---
  {
    name: "Volkan İ.",
    role: "Sistem Yöneticisi",
    text: "Server uptime'ımdan daha güvenilir bir ret sistemi. %99.99 availability.",
  },
  {
    name: "Aslı C.",
    role: "Scrum Master",
    text: "Sprint planning'den çıktım, 3 ret almışım. Velocity artmış sayılır.",
  },
  {
    name: "Murat T.",
    role: "Database Admin",
    text: "Ret verilerini analiz ettim. Response time avg 0.2s. Bu production-ready.",
  },
  {
    name: "Defne Y.",
    role: "Tech Writer",
    text: "Ret metninin documentation'ı bile mükemmel. Clear, concise, devastating.",
  },
  {
    name: "Barış K.",
    role: "Security Engineer",
    text: "Bu sistemin güvenliğini test ettim. Ret maili kesinlikle ulaşıyor. Bypass yok.",
  },
  {
    name: "Ceren M.",
    role: "Cloud Architect",
    text: "Multi-region ret dağıtımı var. Hangi ülkeden başvursan başvur, ret gelir.",
  },
  {
    name: "Onur A.",
    role: "ML Engineer",
    text: "Ret prediction modelimi bu veriyle eğittim. Accuracy: %100. Herkes reddediliyor.",
  },
  {
    name: "Yağmur D.",
    role: "iOS Developer",
    text: "Apple bile bu kadar şık reject etmiyor. Maalesef > App Store Review.",
  },
  // --- Freelancerlar ---
  {
    name: "Sinan R.",
    role: "Freelance Dev",
    text: "Upwork'te ghost'lanmaya alışığım. En azından burada yüzüme söylüyorlar.",
  },
  {
    name: "Lale B.",
    role: "Freelance Designer",
    text: "Client'lar 'düşüneceğiz' der, ghostlar. Burada anında hayır var. Refreshing.",
  },
  {
    name: "Kerem Ş.",
    role: "Consultant",
    text: "Danışmanlık verdiğim şirketlere de öneriyorum. Reddedilme süreçlerini optimize ettik.",
  },
  // --- Diğer Sektörler ---
  {
    name: "Fatma Z.",
    role: "Öğretmen",
    text: "Öğrencilerime de gösterdim. 'Hayatta ret yemek normaldir' dersi için mükemmel materyal.",
  },
  {
    name: "Ali V.",
    role: "Mühendis",
    text: "Köprü inşa ediyorum ama burada kariyer köprüm yıkıldı. En azından hızlı yıkıldı.",
  },
  {
    name: "Sibel N.",
    role: "Avukat",
    text: "İtiraz etmeyi düşündüm ama ret o kadar haklıydı ki, saygı duydum.",
  },
  {
    name: "Cenk O.",
    role: "Muhasebeci",
    text: "Başvuru maliyeti: 0 TL. Reddedilme maliyeti: 0 TL. ROI: Priceless.",
  },
  {
    name: "Duygu P.",
    role: "Psikolog",
    text: "Reddedilme korkusu terapisi yapıyordum. Artık exposure therapy için buraya yönlendiriyorum.",
  },
  {
    name: "Ege W.",
    role: "Gazeteci",
    text: "Bu platform hakkında haber yazacaktım. Başvurdum, reddedildim, haber hazır.",
  },
  {
    name: "Hande T.",
    role: "Sosyal Medya Uzmanı",
    text: "Ret mailimi story attım. 47 beğeni aldı. En çok etkileşim alan içeriğim.",
  },
  // --- Tekrar Başvuranlar ---
  {
    name: "İlker G.",
    role: "Senior Architect",
    text: "5. kez reddedildim. Her seferinde ret maili farklı. Bespoke rejection experience.",
  },
  {
    name: "Jale U.",
    role: "Product Designer",
    text: "Eski şirketimde 2 ay beklerdim cevap için. Burada 2 saniye. İnovasyon budur.",
  },
  {
    name: "Koray E.",
    role: "Engineering Manager",
    text: "Ekibimle beraber toplu başvuru yaptık. Toplu reddedildik. Team building aktivitesi oldu.",
  },
  {
    name: "Leyla H.",
    role: "Growth Hacker",
    text: "Reddedilme metriğim %100 growth gösteriyor. Her ay daha fazla ret alıyorum.",
  },
  {
    name: "Mete İ.",
    role: "Blockchain Dev",
    text: "Ret immutable. Geri alınamaz, değiştirilemez. Gerçek decentralized rejection.",
  },
  {
    name: "Nur Ç.",
    role: "Game Developer",
    text: "Boss fight'tan zor bi iş başvurusu yoktu, ta ki burayı bulana kadar.",
  },
  {
    name: "Ozan F.",
    role: "Embedded Systems",
    text: "Mikrodenetleyiciden hızlı interrupt: Maalesef ret notification'ı.",
  },
  {
    name: "Pelin M.",
    role: "AI Researcher",
    text: "GPT bile bu kadar yaratıcı ret yazamaz. Bunu yapan insan mı gerçekten?",
  },
  {
    name: "Rıza A.",
    role: "Network Engineer",
    text: "Latency: 0ms. Packet loss: 0%. Ret delivery rate: %100. İmpeccable infrastructure.",
  },
  {
    name: "Seda K.",
    role: "Agile Coach",
    text: "Retlerinizin retrospective'ini yapabilir miyiz? Çok fazla learning opportunity var.",
  },
  {
    name: "Tamer L.",
    role: "VP of Engineering",
    text: "Board meeting'de bu platformu anlattım. 'Neden biz yapmadık?' dediler.",
  },
  {
    name: "Umut B.",
    role: "Site Reliability Eng.",
    text: "İncident response time'ımızdan hızlı ret geliyor. On-call'dan bile acil.",
  },
  {
    name: "Vildan S.",
    role: "Data Analyst",
    text: "Dashboard'uma ret verilerimi ekledim. Grafikler çok güzel. Hep yukarı gidiyor.",
  },
  {
    name: "Yusuf Ö.",
    role: "Intern Adayı",
    text: "Staj başvurusu yaptım. 'Stajyer bile almıyoruz' dediler. En azından tutarlılar.",
  },
  {
    name: "Zara D.",
    role: "Content Writer",
    text: "Ret mailindeki copywriting muhteşem. Kim yazdı bunu? İşe almayı düşünür müsünüz... aa.",
  },
  // --- Startups & Girişimciler ---
  {
    name: "Berk T.",
    role: "Serial Entrepreneur",
    text: "Yatırımcı reddinden sonra iş başvurusu reddi çerez gibi geldi. Lezzetli.",
  },
  {
    name: "Pelin S.",
    role: "Co-Founder",
    text: "Pivot etmekten yorulup iş aradım. Maalesef beni tekrar pivot etmeye zorladı.",
  },
  {
    name: "Utku K.",
    role: "Bootstrapper",
    text: "Kendi işimi kurmak daha kolaymış. En azından müşteriler 'biz size döneceğiz' demiyor.",
  },
  {
    name: "Selin G.",
    role: "Growth Marketer",
    text: "Ret mailindeki 'Unsubscribe' butonu bile conversion odaklı. Saygı duydum.",
  },
  {
    name: "Doruk A.",
    role: "Indie Hacker",
    text: "SaaS fikri olarak 'Reject as a Service' (RaaS) yapacaktım, siz yapmışsınız.",
  },
  // --- Kurumsal Hayat Kaçkınları ---
  {
    name: "Ece Y.",
    role: "Ex-Corporate",
    text: "plaza diliyle reddedilmek bir başka oluyor. 'Align olamadık' dediler, öldüm.",
  },
  {
    name: "Mert B.",
    role: "Department Head",
    text: "Bütçe onayı beklemekten daha hızlı ret onayı geldi. Kurumsal hız rekoru.",
  },
  {
    name: "Nilüfer Ç.",
    role: "Project Lead",
    text: "Critical path'imde bir blocker vardı, o da işe alınmamakmış. Project closed.",
  },
  {
    name: "Kaan D.",
    role: "Business Analyst",
    text: "Gap analysis yaptım. Benim yeteneklerimle onların beklentileri arasında Grand Canyon var.",
  },
  {
    name: "Aylin F.",
    role: "HR Specialist",
    text: "Kendi silahımla vuruldum. Standart ret maili template'i ne kadar acıtıyormuş meğer.",
  },
  // --- Remote Çalışanlar ---
  {
    name: "Olga R.",
    role: "Digital Nomad",
    text: "Bali'den başvurdum, İstanbul'dan reddedildim. Ret cevabı global dolaşıyor.",
  },
  {
    name: "John D.",
    role: "Remote Dev",
    text: "Timezone fark etmeksizin reddediyorlar. 7/24 kesintisiz hizmet.",
  },
  {
    name: "Ezgi M.",
    role: "Freelance Writer",
    text: "Kahve dükkanındaki internetim koptu sandım, meğer ret hızıymış, yüklenememiş.",
  },
  {
    name: "Baran K.",
    role: "Virtual Assistant",
    text: "Sanal olarak reddedildim ama acısı gayet gerçekti. Reality check.",
  },
  {
    name: "Gül E.",
    role: "E-comm Manager",
    text: "Sepette unutulan ürün gibiyim. Bildirim geldi ama satınalma (işe alım) gerçekleşmedi.",
  },
  // --- Yeni Teknolojiler & Kripto ---
  {
    name: "Satoshi N.",
    role: "Anonymous",
    text: "Blokzincirinde bile bu kadar şeffaf bir 'Hayır' görmedim.",
  },
  {
    name: "Vitalik B.",
    role: "Smart Contract Dev",
    text: "Gas fee ödemeden reddedildim. Scalability solution dedikleri bu olsa gerek.",
  },
  {
    name: "Ada L.",
    role: "NFT Artist",
    text: "Ret mektubumu NFT yapıp satsam, maaşımdan çok kazanırım.",
  },
  {
    name: "Elon M.",
    role: "Tech Magnate",
    text: "Mars'a gitmek bu şirkete girmekten daha kolay. Roketim hazır.",
  },
  {
    name: "Sam A.",
    role: "AI Ethicist",
    text: "Yapay zeka bile 'Maalesef' derken daha empatik olamazdı. Turing testini geçti.",
  },
  // --- Akademik & Eğitim ---
  {
    name: "Prof. Dr. X",
    role: "Akademisyen",
    text: "Makalem reddedildiğinde peer review vardı. Burada o bile yok. Direkt yargısız infaz.",
  },
  {
    name: "Cansu T.",
    role: "Doktora Öğrencisi",
    text: "Tez savunmamda bu kadar terlemedim. Ret mailini okurken tansiyonum düştü.",
  },
  {
    name: "Emre U.",
    role: "Araştırma Görevlisi",
    text: "Hipotezim: İşe alınacağım. Sonuç: Hipotez çürütüldü. Bilimsel bir ret.",
  },
  {
    name: "Melis A.",
    role: "Öğretim Üyesi",
    text: "Ders olarak okutulmalı: 'Management of Disappointment 101'. ",
  },
  {
    name: "Bora S.",
    role: "Eğitim Teknoloğu",
    text: "LMS sistemimize entegre etmek lazım. 'Otomatik Ret Modülü'. Çok satar.",
  },
  // --- Sağlık & Hizmet ---
  {
    name: "Dr. House",
    role: "Teşhis Uzmanı",
    text: "Semptomlar: Umut, heyecan. Teşhis: İşsizlik. Tedavi: Maalesef.",
  },
  {
    name: "Hemşire J.",
    role: "Acil Tıp",
    text: "Triyajda öncelik verdiler, 'Acil Ret' kategorisinden girdim.",
  },
  {
    name: "Şef Remy",
    role: "Gourmet Chef",
    text: "Menüde bugün 'Soğuk Ret Çorbası' var. Tadı biraz acı.",
  },
  {
    name: "Garson P.",
    role: "Head Waiter",
    text: "Bahşiş beklemiyordum ama en azından bir 'Güle güle' deselerdi. O da yok.",
  },
  {
    name: "Kurye M.",
    role: "Hızlı Teslimat",
    text: "Benim teslimat süremden daha hızlı ret bildirimi geldi. Rekabet edemem.",
  },
  // --- Sanat & Eğlence ---
  {
    name: "Leonardo D.",
    role: "Aktör",
    text: "Oscar'ı almam bu kadar sürmedi. Ama ret cevabını hemen aldım.",
  },
  {
    name: "Mozart W.",
    role: "Besteci",
    text: "Bu redde bir requiem yazılır. Minör tonunda, hüzünlü ve kısa.",
  },
  {
    name: "Picasso P.",
    role: "Ressam",
    text: "Kubist bir yaklaşım: Beni her açıdan reddettiler.",
  },
  {
    name: "Joker",
    role: "Komedyen",
    text: "Şakamı anlamadılar sanırım. Ya da fazla ciddiye aldılar. Why so serious?",
  },
  {
    name: "Batman",
    role: "Vigilante",
    text: "Karanlıkta çalışmayı severim ama bu kadar karanlık bir gelecek beklemiyordum.",
  },
  // --- Spor & Aktivite ---
  {
    name: "Ronaldo C.",
    role: "Futbolcu",
    text: "Ofsayt bayrağı kalktı. Gol sanmıştım, iptal oldu. VAR'a gitmeye gerek yok.",
  },
  {
    name: "Messi L.",
    role: "Playmaker",
    text: "Dribbling yapıp herkesi geçtim, kaleciyle (IK) karşı karşıya kaldım, şut ve... aut.",
  },
  {
    name: "Serena W.",
    role: "Tenisçi",
    text: "Ace attılar. Raketimi kırdım. Maç bitti.",
  },
  {
    name: "Bolt U.",
    role: "Sprinter",
    text: "9.58 saniyede 100 metre koşarım ama ret maili 0.1 saniyede geldi.",
  },
  {
    name: "Michael J.",
    role: "Basketbolcu",
    text: "Son saniye basketi bekliyordum, buzzer beater... ama kendi potama.",
  },
  // --- Finans & Bankacılık ---
  {
    name: "Kemal B.",
    role: "Risk Analisti",
    text: "Portföy riski hesaplarım ama kendi kariyer riskimi hesaplayamamışım. %100 ret riski.",
  },
  {
    name: "Ayla D.",
    role: "Yatırım Danışmanı",
    text: "Müşterilerime 'diversify edin' derim. Belki ben de başvurularımı diversify etmeliyim.",
  },
  {
    name: "Erdem K.",
    role: "Muhasebe Müdürü",
    text: "Bilanço tutmuyor. Aktifimde tecrübe var, pasifimde ret. Zarar ettim.",
  },
  {
    name: "Serap Y.",
    role: "Kredi Uzmanı",
    text: "Kredi başvurusu reddedilir derler ya, hah. İş başvurusu reddi bambaşka level.",
  },
  {
    name: "Cem T.",
    role: "Ödeme Sistemleri",
    text: "Transaction failed. Retry? Declined again. Insufficient qualifications.",
  },
  // --- E-Ticaret & Lojistik ---
  {
    name: "Burcu E.",
    role: "E-Ticaret Müdürü",
    text: "Sepet terk oranı %70 derler, benimki %100. Hiç işe alınmadım.",
  },
  {
    name: "Hasan P.",
    role: "Depo Müdürü",
    text: "Stok yönetimi yapıyorum ama iş fırsatı stokum devamlı tükeniyor.",
  },
  {
    name: "Gamze S.",
    role: "Satın Alma Uzmanı",
    text: "Ben alıcıyım normalde ama burada satılamıyorum. Pazar analizi yapmalıyım.",
  },
  {
    name: "Tarık N.",
    role: "Lojistik Koordinatörü",
    text: "Kargo takibi: 'Başvurunuz reddedildi, teslimat yapılmadı.'",
  },
  {
    name: "İpek H.",
    role: "Müşteri İlişkileri",
    text: "CRM'de benim kaydım 'Lost Opportunity' olarak geçiyordur.",
  },
  // --- Medya & İletişim ---
  {
    name: "Alp M.",
    role: "Editör",
    text: "Metni düzeltmeye alışığım. Beni düzeltemeyeceklerini söylediler.",
  },
  {
    name: "Canan F.",
    role: "Haber Editörü",
    text: "Breaking News: Yine reddedildim. Canlı yayına geçiyoruz, izleyici yorumları açık.",
  },
  {
    name: "Serhat G.",
    role: "Radyo Prodüktörü",
    text: "Yayına alınmadım. Hem kariyer olarak hem de işe alınma olarak.",
  },
  {
    name: "Ebru V.",
    role: "Sosyal Medya Editörü",
    text: "Viral oldum ama iş bulma konusunda değil, reddedilme rekorunda.",
  },
  {
    name: "Orhan Z.",
    role: "Video Editör",
    text: "Timeline'ımda işe kabul sahnesi hiç olmadı. Cut, kesiyoruz.",
  },
  // --- Turizm & Otelcilik ---
  {
    name: "Levent K.",
    role: "Otel Müdürü",
    text: "Check-in yapamadım. 'Rezervasyonunuz iptal edildi' gibi bir şey.",
  },
  {
    name: "Meltem A.",
    role: "Tur Rehberi",
    text: "İnsanlara yol gösteriyorum ama kendi kariyer yolumu bulamıyorum.",
  },
  {
    name: "Bartu S.",
    role: "Resepsiyon Şefi",
    text: "'Odamız doldu' der gibi 'Pozisyonumuz doldu' dediler.",
  },
  {
    name: "Aysel R.",
    role: "Etkinlik Organizatörü",
    text: "Mülakat organize ettim resmen. Tek eksik işe alınmamdı.",
  },
  {
    name: "Fırat D.",
    role: "F&B Müdürü",
    text: "Menü sunumu yaptım, beğenilmedim. 'Hesap lütfen' dedim, 'Ödeme gerekmiyor' dediler.",
  },
  // --- İnşaat & Gayrimenkul ---
  {
    name: "Mehmet D.",
    role: "İnşaat Mühendisi",
    text: "Kariyer temeli sağlam ama bina yükselmiyor. Statik hesaplar tutmadı.",
  },
  {
    name: "Oya K.",
    role: "Gayrimenkul Danışmanı",
    text: "Konum: Müsait. Durum: Kiralık. Sonuç: İlgi yok.",
  },
  {
    name: "Cevdet Y.",
    role: "Proje Müdürü",
    text: "Gantt chart'a göre şu an işe başlamış olmalıydım. Reality check gerekli.",
  },
  {
    name: "Sevgi P.",
    role: "Mimarlık Asistanı",
    text: "Çizimler hazır, sunum hazır, ben hazır değilmişim.",
  },
  {
    name: "Turgay L.",
    role: "Şantiye Şefi",
    text: "İnşaat tamamlandı ama benim işim başlamadı bile.",
  },
  // --- Otomotiv & Ulaşım ---
  {
    name: "Ufuk T.",
    role: "Servis Müdürü",
    text: "Araç bakımı yapıyorum, CV bakımı yapmayı unuttum galiba.",
  },
  {
    name: "Yeliz M.",
    role: "Satış Danışmanı",
    text: "Test sürüşü yaptırdım, beğenmediler. Geri getirdiler.",
  },
  {
    name: "Samet K.",
    role: "Yedek Parça Uzmanı",
    text: "Ben yedek parçayım sanırım. İhtiyaç olursa aranırım, hiç aranmadım.",
  },
  {
    name: "Nihan C.",
    role: "Operasyon Müdürü",
    text: "Filo yönetimi yapıyorum, kendimi yönetemiyorum.",
  },
  {
    name: "Recep E.",
    role: "Trafik Koordinatörü",
    text: "Rotayı kaybettim. GPS de kurtaramadı.",
  },
  // --- Perakende & Satış ---
  {
    name: "Gökhan A.",
    role: "Mağaza Müdürü",
    text: "Stok sayımı gibi başvuru sayımı yapıyorum. Fire çok yüksek.",
  },
  {
    name: "Elif N.",
    role: "Satış Temsilcisi",
    text: "Cross-sell, up-sell derler ya, bana no-sell dediler.",
  },
  {
    name: "Murat V.",
    role: "Kategori Müdürü",
    text: "Ürün yerleştirme konusunda iyiyim, kendimi yerleştiremedim.",
  },
  {
    name: "Hatice B.",
    role: "Görsel Tasarım Uzmanı",
    text: "Vitrin düzenledim, özgeçmiş düzenledim. İkisi de sadece bakıldı.",
  },
  {
    name: "Yılmaz S.",
    role: "Franchise Sahibi",
    text: "Kendi işimi yürütüyorum ama başkasının işinde çalışamıyorum apparently.",
  },
  // --- Teknoloji Startupları ---
  {
    name: "Deniz T.",
    role: "Growth Lead",
    text: "Acquisition'ı biliyorum ama kendimi acquire edemedim.",
  },
  {
    name: "Sude M.",
    role: "UX Researcher",
    text: "User interview yaptım, ben reject edildim. Ironic.",
  },
  {
    name: "Eren G.",
    role: "Performance Marketer",
    text: "CPA optimize ediyorum, CPR (Cost Per Rejection) da optimize ettim.",
  },
  {
    name: "Ayşegül P.",
    role: "Customer Success",
    text: "Müşteri başarısı sağlıyorum, kendi başarım kayıp.",
  },
  {
    name: "Çağlar K.",
    role: "Revenue Operations",
    text: "Pipeline'da ilerlemiyorum. Stuck at 'Application Rejected' stage.",
  },
  // --- SaaS & B2B ---
  {
    name: "Özgür Y.",
    role: "Account Executive",
    text: "Deal close ediyorum, kendi kapım suratıma kapandı ama.",
  },
  {
    name: "Begüm T.",
    role: "Solutions Architect",
    text: "Çözüm üretiyorum, sorunum olan işsizliğe çözüm üretemiyorum.",
  },
  {
    name: "Uğur D.",
    role: "Partnerships Lead",
    text: "Ortaklıklar kuruyorum, kimse benimle ortak olmuyor.",
  },
  {
    name: "Esra K.",
    role: "Implementation Manager",
    text: "Entegrasyon sağlıyorum, işe entegre olamıyorum.",
  },
  {
    name: "Halil S.",
    role: "Sales Engineer",
    text: "Demo yaptım, POC hazırladım. Contract stage'e geçemedik.",
  },
  // --- Dijital Ajanslar ---
  {
    name: "Miray A.",
    role: "Kreatif Direktör",
    text: "Kampanya tasarlıyorum, kendi iş kampanyam çöktü.",
  },
  {
    name: "Buğra E.",
    role: "Copywriter",
    text: "Başlık yazarım, kendi başlığımı 'İşsizim' yapacaklar.",
  },
  {
    name: "Ceyda Y.",
    role: "SEO Specialist",
    text: "Google'da 1. sıradayım, işe alınmada sonuncu.",
  },
  {
    name: "Kıvanç M.",
    role: "Media Planner",
    text: "Reach ve frequency'i biliyorum, benim reach'im 0.",
  },
  {
    name: "Şule R.",
    role: "Social Media Strategist",
    text: "Engagement yüksek, employment düşük.",
  },
  // --- Eğitim Teknolojileri ---
  {
    name: "Tuba K.",
    role: "Eğitim İçerik Uzmanı",
    text: "Kurs tasarlıyorum, 'İşe Alınma 101' kursu almalıyım galiba.",
  },
  {
    name: "Emrah D.",
    role: "Instructional Designer",
    text: "Öğrenme deneyimi tasarlıyorum, reddedilme deneyimi yaşıyorum.",
  },
  {
    name: "Gizem L.",
    role: "E-Learning Koordinatörü",
    text: "Online eğitim veriyorum, online reddediliyorum.",
  },
  {
    name: "Berkay T.",
    role: "EdTech Product Manager",
    text: "Ürün geliştiriyorum, kendimi geliştirmeyi unutmuşum.",
  },
  {
    name: "Aslıhan V.",
    role: "Student Success Manager",
    text: "Öğrenci başarısı sağlıyorum, mezun oldum başarısız oldum.",
  },
  // --- Danışmanlık ---
  {
    name: "Ferhat Y.",
    role: "Stratejik Danışman",
    text: "Strateji veriyorum, kendi stratejim iflas etti.",
  },
  {
    name: "Şevval K.",
    role: "Süreç Danışmanı",
    text: "Süreci optimize ediyorum, benim sürecim takıldı.",
  },
  {
    name: "Onur P.",
    role: "Change Management",
    text: "Değişim yönetiyorum, değişmeyip işsiz kaldım.",
  },
  {
    name: "Rabia S.",
    role: "Business Consultant",
    text: "İş geliştirme öneriyorum, iş bulamıyorum.",
  },
  {
    name: "Vedat M.",
    role: "Operational Excellence",
    text: "Mükemmellik arıyorum, mükemmel bir ret buldum.",
  },
  // --- Kamu & Sosyal Etki ---
  {
    name: "Acar K.",
    role: "Belediye Planlama Uzmanı",
    text: "İmar planı revizyonu bundan uzun sürüyor. Burada kariyer planım iki tıkla iptal edildi.",
  },
  {
    name: "Beliz Ş.",
    role: "Sosyal Politika Koordinatörü",
    text: "Toplumsal fayda projeleri yönetiyorum, kendi faydamı savunamadım. Ret cevabı da kamu ihalesi kadar kesin.",
  },
  {
    name: "Cemre U.",
    role: "Kamu İhale Analisti",
    text: "Şartnameyi okudum, yine de elendim. Demek ki burada en düşük teklif bile umut değil.",
  },
  {
    name: "Doğa Ç.",
    role: "STK Proje Yöneticisi",
    text: "Proje bütçesi yazarken bu kadar redline görmedim. Başvurum tek kalemde silindi.",
  },
  {
    name: "Erkin N.",
    role: "Fon Geliştirme Uzmanı",
    text: "Hibe bulmak zor sanıyordum, meğer iş bulmak bonus round'muş. Fon yok, teklif yok.",
  },
  {
    name: "Filiz O.",
    role: "Sosyal Etki Analisti",
    text: "Etkisini ölçtüm: özgüvenimde küçük, mizah anlayışımda büyük bir sıçrama oldu.",
  },
  {
    name: "Gökçe T.",
    role: "Kent Araştırmacısı",
    text: "Şehirlerin nabzını tutuyorum ama şirketin kalbinde yer bulamadım. Kentsel dönüşüm var, kariyer dönüşümü yok.",
  },
  {
    name: "Harun İ.",
    role: "Hibe Program Sorumlusu",
    text: "Başvuru formlarına hakimim. Ama bu form bana hakim geldi.",
  },
  {
    name: "Ilgın P.",
    role: "Gönüllü Operasyon Lideri",
    text: "Gönüllüler bile daha uzun onboarding alıyor. Bana doğrudan kapanış toplantısı yaptılar.",
  },
  {
    name: "Jülide D.",
    role: "Yerel Yönetim Danışmanı",
    text: "Belediyelerde süreç yavaş derler, burada ret belediye meclisinden hızlı geçti.",
  },
  // --- Üretim & Sanayi ---
  {
    name: "Koral A.",
    role: "Üretim Planlama Şefi",
    text: "Kapasite planı yaptım, belli ki benim için slot açılmamış. Hat durmadı, ben durdum.",
  },
  {
    name: "Leman Y.",
    role: "Kalite Sistemleri Uzmanı",
    text: "ISO denetiminde bu kadar net uygunsuzluk görmedim. CV'me major nonconformity yazmışlar gibi.",
  },
  {
    name: "Mertcan S.",
    role: "Endüstriyel Otomasyon Mühendisi",
    text: "PLC daha reset atmadan kariyerim shutdown oldu. Otomasyon seviyesi etkileyici.",
  },
  {
    name: "Nursel E.",
    role: "Süreç İyileştirme Lideri",
    text: "Süreci kısaltalım derken beni tamamen süreçten çıkardılar. Lean rejection.",
  },
  {
    name: "Okan C.",
    role: "Tedarik Zinciri Planlayıcısı",
    text: "Talep tahmini yaptım, arz tarafı beni istemedi. Stokta umut kalmamış.",
  },
  {
    name: "Poyraz H.",
    role: "Fabrika Dijitalleşme Uzmanı",
    text: "Kağıtsız üretim olur da duygusuz ret olmaz sanmıştım. Oldu.",
  },
  {
    name: "Rana G.",
    role: "Bakım Güvenilirlik Mühendisi",
    text: "Arıza kök neden analizi yaptım: sorun bende değil, sistem herkese aynı davranıyor.",
  },
  {
    name: "Sarp Ö.",
    role: "Yalın Dönüşüm Koçu",
    text: "İsrafı önlüyorlar; beklenti biriktirmeye hiç izin vermiyorlar. Takdir ettim.",
  },
  {
    name: "Tuğçe L.",
    role: "Operasyonel Verimlilik Uzmanı",
    text: "Verimlilik KPI'ı buysa madalya verilir. Ben daha sekmeyi kapatmadan reddedildim.",
  },
  {
    name: "Ufkan B.",
    role: "Endüstri 4.0 Koordinatörü",
    text: "Akıllı fabrikalar gördüm, akıllı ret sistemi ilk kez görüyorum.",
  },
  // --- Pazarlama & Marka ---
  {
    name: "Vera M.",
    role: "Marka Strateji Uzmanı",
    text: "Marka tonu çok tutarlı: sıcak giriş, soğuk kapanış. Positioning cuk oturmuş.",
  },
  {
    name: "Yaren K.",
    role: "İçerik Pazarlama Müdürü",
    text: "Bana gelen ret metni, hazırladığım çoğu kampanyadan daha iyi performans gösterdi.",
  },
  {
    name: "Zafer T.",
    role: "Performans Kreatifi",
    text: "CTR'ım yüksekti ama HR conversion gelmedi. Funnel burada bıçak gibi kesiliyor.",
  },
  {
    name: "Alara D.",
    role: "Topluluk Pazarlama Lideri",
    text: "Topluluk büyütürüm ama kendime bir koltuk büyütemedim. Discord'da daha çok sahipleniliyorum.",
  },
  {
    name: "Borahan F.",
    role: "CRM Kampanya Uzmanı",
    text: "Lifecycle akışında yeni bir aşama öğrendim: submit, mail, hüzün.",
  },
  {
    name: "Cansu E.",
    role: "Etkinlik Pazarlama Yöneticisi",
    text: "Lansman kurarım, sahne kurarım, beklenti kurarım. Sonuncusu burada söküldü.",
  },
  {
    name: "Demir U.",
    role: "Ürün Pazarlama Analisti",
    text: "Go-to-market planım vardı, go-to-offer kısmı eksik kaldı.",
  },
  {
    name: "Eylül S.",
    role: "Influencer İlişkileri Sorumlusu",
    text: "İkna kabiliyetim yüksektir, ama bu sistemi kimse collaborate'a çeviremiyor.",
  },
  {
    name: "Fikret A.",
    role: "Büyüme İçerik Editörü",
    text: "Organik büyüme uzmanıyım. Sadece reddedilme geçmişim organik olarak büyüyor.",
  },
  {
    name: "Güneş R.",
    role: "Konumlandırma Danışmanı",
    text: "Beni piyasada güzel konumlandırırım diyordum, meğer burada 'uygun değil' rafına aitmişim.",
  },
  // --- Sağlık Teknolojileri & Biyoteknoloji ---
  {
    name: "Handan V.",
    role: "Klinik Veri Uzmanı",
    text: "Veriyi temizledim, hipotezi kurdum, sonuç yine ret. Çalışma tek kolda sonlandı.",
  },
  {
    name: "Işın K.",
    role: "Medikal Operasyon Koordinatörü",
    text: "Acil olmayan hiçbir süreç bu kadar hızlı ilerlememeli. Ama ret triage'ı kusursuz.",
  },
  {
    name: "Jale P.",
    role: "Biyoinformatik Analisti",
    text: "Gen diziliminde bu kadar kesin eşleşmeme görmedim. Belli ki DNA'm role fit değil.",
  },
  {
    name: "Kayra M.",
    role: "Sağlık Ürünü Yöneticisi",
    text: "Roadmap'im sağlamdı, prognosis kötü çıktı.",
  },
  {
    name: "Levent O.",
    role: "Regülasyon Belgeleri Uzmanı",
    text: "Dokümantasyon tamdı ama onay mercii yine 'maalesef' dedi.",
  },
  {
    name: "Melike T.",
    role: "Laboratuvar Sistem Analisti",
    text: "Numune kabulden hızlı ret kabul süreci var. SOP yazılsa örnek olur.",
  },
  {
    name: "Nejat A.",
    role: "Hasta Deneyimi Tasarımcısı",
    text: "Empati yolculuğu çıkarıyorum, bana çıkarılan yol kısa sürdü.",
  },
  {
    name: "Özlem C.",
    role: "Dijital Sağlık Program Müdürü",
    text: "Tele-sağlık projeleri yönetiyorum, tele-ret deneyimi yaşadım. Fiziksel olarak da vurdu.",
  },
  {
    name: "Peri D.",
    role: "Moleküler Veri Mühendisi",
    text: "Mikro seviyede analiz yaparım, makro seviyede yine elenmişim.",
  },
  {
    name: "Rauf Y.",
    role: "Klinik Araştırma Planlayıcısı",
    text: "Kontrol grubu olsam daha çok ilgi görürdüm. Başvuru kolu erkenden kapatıldı.",
  },
  // --- Oyun & Dijital Eğlence ---
  {
    name: "Selen B.",
    role: "Oyun Ekonomisi Tasarımcısı",
    text: "Soft currency'm boldu ama burada hard wall'a çarptım.",
  },
  {
    name: "Taner K.",
    role: "Seviye Tasarımcısı",
    text: "Bu level'in çıkışı yokmuş. Spawn olur olmaz fail screen geldi.",
  },
  {
    name: "Uraz E.",
    role: "Live Ops Uzmanı",
    text: "Canlı operasyon yönetiyorum, canlı canlı reddedildim. Event reward da yok.",
  },
  {
    name: "Vuslat T.",
    role: "Oyun Topluluğu Yöneticisi",
    text: "Topluluk drama'sı görmüş insanım, yine de bu ret twist'i beklemiyordum.",
  },
  {
    name: "Yekta A.",
    role: "Teknik Oyun Yazarı",
    text: "Lore yazıyorum, kendi hikayem burada kısa öykü bile olamadı.",
  },
  {
    name: "Zümra N.",
    role: "Oyuncu Davranışı Araştırmacısı",
    text: "Player retention modelim var, employer retention bana hiç uğramadı.",
  },
  {
    name: "Arin D.",
    role: "Esports Operasyon Sorumlusu",
    text: "Turnuva bracket'ında bye geçtim, işe alım bracket'ında ilk turda çıktım.",
  },
  {
    name: "Barlas P.",
    role: "Gelir Modeli Analisti",
    text: "Monetization'ı biliyorum ama burada emotional damage free-to-play.",
  },
  {
    name: "Ceyhun L.",
    role: "Oyun Yayın Koordinatörü",
    text: "Yayın açılmadan chat düşer ya, benim kariyer de öyle düştü.",
  },
  {
    name: "Dila S.",
    role: "QA Otomasyon Tasarımcısı",
    text: "Regression test koştum, sonuç aynı: her build'de yine reddediliyorum.",
  },
  // --- Lojistik & Saha Operasyonları ---
  {
    name: "Ekin M.",
    role: "Rota Optimizasyon Uzmanı",
    text: "En kısa yolu bulurum, bu platform bana en kısa hayal kırıklığı rotasını verdi.",
  },
  {
    name: "Fırat Y.",
    role: "Saha Hizmetleri Planlayıcısı",
    text: "Ekipleri sahaya diziyorum, beni tribüne gönderdiler.",
  },
  {
    name: "Gözde A.",
    role: "Mikro Dağıtım Operasyon Müdürü",
    text: "Dakika bazlı teslimat yönetiyorum. Dakika altı ret de gördüm artık.",
  },
  {
    name: "Hazar K.",
    role: "Fulfillment Süreç Analisti",
    text: "Sipariş tamamlanır sanmıştım, meğer başvuru iptal akışına düşmüş.",
  },
  {
    name: "Iraz C.",
    role: "Son Kilometre İyileştirme Uzmanı",
    text: "Last mile çözülür de last hope bu kadar çabuk kaybolur muymuş.",
  },
  {
    name: "Korhan T.",
    role: "Filo Performans Koordinatörü",
    text: "Araç doluluk oranı tamam, kariyer doluluk oranı sıfır.",
  },
  {
    name: "Lara U.",
    role: "Depo Otomasyon Lideri",
    text: "Raf sistemleri düzenli, duygularım değil. Ret makinesi iyi çalışıyor.",
  },
  {
    name: "Menderes E.",
    role: "Talep Tahmin Uzmanı",
    text: "Tahmin modelim bu kadar sapmazdı. Kendime fazla güvenmişim.",
  },
  {
    name: "Nehir B.",
    role: "Operasyon Kontrol Merkezi Uzmanı",
    text: "Alarm yönetiyorum, bu mail resmen kişisel alarm oldu.",
  },
  {
    name: "Onat D.",
    role: "Sevkiyat Kalite Sorumlusu",
    text: "Paket hasarsız, ego hafif ezik. Teslimat tamamlandı.",
  },
  // --- Fintech & Regülasyon ---
  {
    name: "Pelin T.",
    role: "Uyum Teknolojileri Analisti",
    text: "Regülasyon metinleri bile bu kadar katı değil. Uyum yoksa umut da yok.",
  },
  {
    name: "Rüya K.",
    role: "Dolandırıcılık Önleme Uzmanı",
    text: "Fraud'u anlarım, bu ret gerçek. Tamamen otantik bir hayal kırıklığı.",
  },
  {
    name: "Selçuk A.",
    role: "Ödeme Operasyon Mimarı",
    text: "Transaction declined mesajını yıllardır görüyorum. İlk kez ben kart oldum.",
  },
  {
    name: "Tansu M.",
    role: "Fintech İş Geliştirme Müdürü",
    text: "Yeni ortaklıklar kurarım, bu şirket benimle settlement'a bile gelmedi.",
  },
  {
    name: "Ulya E.",
    role: "Regülasyon Raporlama Uzmanı",
    text: "Tablo hazırladım: başvuru sayısı 1, onay sayısı 0, açıklama kısmı 'maalesef'.",
  },
  {
    name: "Vefa D.",
    role: "Dijital Cüzdan Ürün Sahibi",
    text: "Wallet dolu olabilir ama moral bakiyesi eksiye düştü.",
  },
  {
    name: "Yade G.",
    role: "Risk Motoru Analisti",
    text: "Motor doğru çalışmış; beni yüksek riskli umut yatırımı olarak sınıflamış.",
  },
  {
    name: "Zeki C.",
    role: "Açık Bankacılık Entegrasyon Lideri",
    text: "API'ler bağlandı, ben bağ kuramadım.",
  },
  {
    name: "Ahu N.",
    role: "AML Süreç Tasarımcısı",
    text: "Şüpheli işlem görsem incelerim, burada şüphe yok: direkt ret.",
  },
  {
    name: "Barın T.",
    role: "Kart Program Yöneticisi",
    text: "Temassız ödeme gibi temassız işe alım. Dokunmadan reddediyorlar.",
  },
  // --- İnsan Kaynakları & Organizasyon ---
  {
    name: "Cemil O.",
    role: "İşveren Markası Uzmanı",
    text: "İşveren markası güçlüymüş gerçekten; reddedilirken bile kampanyaya ikna oluyorsun.",
  },
  {
    name: "Derya V.",
    role: "Organizasyonel Gelişim Danışmanı",
    text: "Şirketleri büyütürüm, kendi sabrım küçüldü.",
  },
  {
    name: "Ecehan S.",
    role: "Yetenek Analitiği Uzmanı",
    text: "Veriye bakınca benim seçilmem gerekirdi. Meğer veri değil kader dashboard'u kullanıyorlarmış.",
  },
  {
    name: "Ferda K.",
    role: "Çalışan Deneyimi Tasarımcısı",
    text: "Çalışan deneyimini tasarlıyorum, aday deneyimi bana sert bir workshop verdi.",
  },
  {
    name: "Gülin T.",
    role: "Öğrenme Programları Yöneticisi",
    text: "Bugünkü öğrenim: umut asenkron, ret senkron çalışıyor.",
  },
  {
    name: "Hande E.",
    role: "İç İletişim Editörü",
    text: "İç iletişim yazıyorum, dışarıdan gelen bu mesaj içime işledi.",
  },
  {
    name: "İlayda M.",
    role: "Performans Sistemleri Uzmanı",
    text: "OKR yazmayı bilirim. Bu çeyrek hedefim: bir kez olsun shortlist'e kalmak.",
  },
  {
    name: "Kutsi A.",
    role: "Kültür Program Lideri",
    text: "Kültür uyumu yok dediler. Ben de kültür şoku yaşadım.",
  },
  {
    name: "Lora D.",
    role: "Kariyer Gelişim Partneri",
    text: "Başkalarına kariyer yolu çizerim. Kendime çizdiğim yol burada çıkmaz sokak.",
  },
  {
    name: "Mine Y.",
    role: "İşe Alım Operasyon Analisti",
    text: "Sistemin nasıl çalıştığını biliyorum. İçeriden bakınca da acıyormuş.",
  },
  // --- Veri Platformları & Altyapı ---
  {
    name: "Nail U.",
    role: "Veri Platform Uzmanı",
    text: "Pipeline kuruyorum, benim pipeline 'rejected' tablosuna dump oldu.",
  },
  {
    name: "Oylum K.",
    role: "Gözlemlenebilirlik Mühendisi",
    text: "Trace'ledim, span'lerime baktım; hata yok, sadece sonuç çok dürüst.",
  },
  {
    name: "Pera A.",
    role: "Akış İşleme Geliştiricisi",
    text: "Event stream gibi aktı: apply edildi, işlendi, reddedildi.",
  },
  {
    name: "Rami T.",
    role: "DataOps Koordinatörü",
    text: "Orkestrasyon kusursuz. Tek failed task benim beklentim.",
  },
  {
    name: "Sudehan E.",
    role: "Şema Yönetişim Analisti",
    text: "Şema uyumluluğu aradılar, benim tabloyu migration'sız drop ettiler.",
  },
  {
    name: "Timur C.",
    role: "Lakehouse Mimarı",
    text: "Veri gölü kurarım, burada umut göletim bile kuruyamadı.",
  },
  {
    name: "Umay D.",
    role: "Metaveri Program Yöneticisi",
    text: "Bağlam eklemeyi severim. Burada bağlam tek kelime: olmaz.",
  },
  {
    name: "Vural G.",
    role: "Altyapı Maliyet Analisti",
    text: "Cost optimize ediyorum, şirket de aday üzerinde zaman maliyetini optimize etmiş.",
  },
  {
    name: "Yalın S.",
    role: "ETL Güvenilirlik Sorumlusu",
    text: "Retry mekanizması var mı diye baktım. Yok, bu job terminal state.",
  },
  {
    name: "Zerrin B.",
    role: "Veri Kalite Ürün Sahibi",
    text: "Quality gate'den kalmışım. Hem de log bırakmadan.",
  },
  // --- Emlak & Yapılı Çevre Teknolojileri ---
  {
    name: "Afra L.",
    role: "PropTech Ürün Uzmanı",
    text: "Akıllı bina projeleri gördüm, akıllı ret tasarımı ilk defa görüyorum.",
  },
  {
    name: "Berke M.",
    role: "Portföy Analitiği Yöneticisi",
    text: "Varlık dağılımım iyi, kariyer dağılımım tek kalem zarar.",
  },
  {
    name: "Cavidan T.",
    role: "Yapı Bilgi Modelleme Uzmanı",
    text: "3D model kurarım, burada geleceğimin wireframe'i bile çıkmadı.",
  },
  {
    name: "Dilara K.",
    role: "Kiralama Operasyon Lideri",
    text: "Mülkü kiraya veririm, kendimi kadroya veremedim.",
  },
  {
    name: "Efecan A.",
    role: "Sürdürülebilir Bina Danışmanı",
    text: "Yeşil dönüşüm tamam, benim umut döngüsü sürdürülemedi.",
  },
  {
    name: "Feyza U.",
    role: "Akıllı Bina Entegrasyon Uzmanı",
    text: "Sensörler bağlanıyor, entegrasyonlar tamam. Sadece ben sisteme attach olamadım.",
  },
  {
    name: "Görkem D.",
    role: "Şantiye Teknoloji Koordinatörü",
    text: "Şantiyede herkes baret takar, burada darbe direkt kafaya geldi.",
  },
  {
    name: "Hicran Y.",
    role: "Tesis Performans Analisti",
    text: "Bina performansını ölçerim. Bugün moral performansım düşük çıktı.",
  },
  {
    name: "İdil O.",
    role: "Gayrimenkul Veri Editörü",
    text: "İlan metni düzenlerim, kendi hikayemin başlığını 'uygun aday değil' yaptılar.",
  },
  {
    name: "Koraycan E.",
    role: "Mekansal Deneyim Tasarımcısı",
    text: "Alan kurgusu yaparım, bana hiç alan bırakmadılar.",
  },
  // --- Müşteri Deneyimi & Gelir Operasyonları ---
  {
    name: "Lalehan T.",
    role: "Müşteri Eğitim Uzmanı",
    text: "Eğitim verirken sabırlıyım, bu ret bana hızlandırılmış ders oldu.",
  },
  {
    name: "Meriç K.",
    role: "Gelir Operasyon Analisti",
    text: "Revenue funnel'a hakimim; benim funnel awareness'ta kaldı.",
  },
  {
    name: "Nevin A.",
    role: "İptal Önleme Yöneticisi",
    text: "Churn azaltıyorum ama kendi elenmemi önleyemedim.",
  },
  {
    name: "Onurhan S.",
    role: "Destek Kalite Lideri",
    text: "Kalite formu doldursam 'ret tonu çok temiz, etki seviyesi yüksek' yazarım.",
  },
  {
    name: "Pınarcan D.",
    role: "Hesap Sağlığı Uzmanı",
    text: "Account health iyi, applicant health sallanıyor.",
  },
  {
    name: "Reyhan T.",
    role: "Teknik Destek Program Müdürü",
    text: "Issue çözmeyi severim. Bu issue'nun çözümü bende yokmuş.",
  },
  {
    name: "Seçkin M.",
    role: "Yenileme Operasyon Sorumlusu",
    text: "Renewal kovalarım, benim için ilk teklif bile gelmedi.",
  },
  {
    name: "Tijen E.",
    role: "Müşteri Yolculuğu Analisti",
    text: "Journey map çizdim; temas noktası çok, mutlu son yok.",
  },
  {
    name: "Ufukhan C.",
    role: "Çözüm Aktivasyon Uzmanı",
    text: "Onboarding başlatırım, bana direkt offboarding hissi verdiler.",
  },
  {
    name: "Yelda S.",
    role: "Servis Tasarım Araştırmacısı",
    text: "Servis blueprint çıkarıyorum, burada blueprint'in sonunda sadece kırmızı bir X var.",
  },
];
