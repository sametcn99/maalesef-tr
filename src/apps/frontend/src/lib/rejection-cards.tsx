import {
  Shield,
  Clock,
  XCircle,
  FileX,
  Ban,
  type LucideIcon,
  AppWindow,
  BatteryLow,
  BookOpenText,
  Calendar,
  Camera,
  Cloudy,
  Code,
  Coffee,
  Droplets,
  Eye,
  FileArchive,
  FolderTree,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  Globe,
  Hash,
  Headphones,
  Hourglass,
  KeyRound,
  Keyboard,
  LampDesk,
  BriefcaseBusiness,
  MicOff,
  Monitor,
  Mouse,
  Music,
  Space,
  Timer,
  Type,
  Users,
  Wifi,
  Zap,
} from "lucide-react";

export interface RejectionCard {
  icon: LucideIcon;
  text: string;
  subtext: string;
}

export const rejectionCards: RejectionCard[] = [
  {
    icon: XCircle,
    text: "Başvurunuz değerlendirildi",
    subtext: "ama maalesef...",
  },
  {
    icon: Ban,
    text: "Pozisyon dolduruldu",
    subtext: "aslında hiç açılmamıştı.",
  },
  {
    icon: Shield,
    text: "Yapay zeka elemeyi geçti",
    subtext: "ama biz yine de reddettik.",
  },
  {
    icon: BatteryLow,
    text: "Şarj yüzdesi",
    subtext: "%12 şarjla mülakat mı?",
  },
  {
    icon: Code,
    text: "Kodu kopyaladınız",
    subtext: "StackOverflow kokusu aldık.",
  },
  {
    icon: Keyboard,
    text: "Klavye sesiniz",
    subtext: "Mekanik klavye? Çok gürültülü.",
  },
  {
    icon: Hash,
    text: "Slack profili",
    subtext: "Emoji kullanmıyorsunuz.",
  },
  {
    icon: XCircle,
    text: "Cevabınız çok hızlıydı",
    subtext: "robot olduğunuzdan şüpheliyiz.",
  },
  {
    icon: Ban,
    text: "Junior arıyoruz",
    subtext: "ama 10 yıl tecrübe şart.",
  },
  {
    icon: Shield,
    text: "Kedi tüyü",
    subtext: "CV'nizde tüy tespit edildi.",
  },
  {
    icon: Clock,
    text: "Hobi fazlalığı",
    subtext: "İşe vakit kalmayacak gibi.",
  },
  {
    icon: FileX,
    text: "Profil resminiz",
    subtext: "Vesikalık değil, çok mutlu.",
  },
  {
    icon: Users,
    text: "Toplantı notu",
    subtext: "Comic Sans ile yazmışsınız.",
  },
  {
    icon: Ban,
    text: "Zoom arka planı",
    subtext: "Bulanıklaştırma yok.",
  },
  {
    icon: Clock,
    text: "Günaydın saati",
    subtext: "11:00'de günaydın denmez.",
  },
  {
    icon: XCircle,
    text: "Email adresiniz",
    subtext: "çılgın_boy_99@... ciddiyetsiz.",
  },
  {
    icon: XCircle,
    text: "Kültürel uyumsuzluk",
    subtext: "ofiste çok gülümsüyorsunuz.",
  },
  {
    icon: FileX,
    text: "Referansınız eksik",
    subtext: "kimseyi tanımıyorsunuz.",
  },
  {
    icon: Shield,
    text: "Brokoli sevgisi",
    subtext: "Öğle yemeğinde yer misiniz?",
  },
  {
    icon: XCircle,
    text: "Masa düzeni",
    subtext: "Kablolar çok dağınık.",
  },
  {
    icon: Ban,
    text: "İmza sirküleri",
    subtext: "Eğik çizgi açısı yanlış.",
  },
  {
    icon: Clock,
    text: "Çay mı kahve mi?",
    subtext: "Çay dediniz, biz kahveciyiz.",
  },
  {
    icon: XCircle,
    text: "Gömlek ütüsü",
    subtext: "Yaka hafif kırışık, elendiniz.",
  },
  {
    icon: FileX,
    text: "Dark mode",
    subtext: "IDE'niz neden beyaz?",
  },
  {
    icon: Shield,
    text: "Akraba bağı",
    subtext: "İçeride tanıdığınız yok.",
  },
  {
    icon: FileX,
    text: "CV'niz incelendi",
    subtext: "tam 0.3 saniyede.",
  },
  {
    icon: XCircle,
    text: "Mülakatınız tamamlandı",
    subtext: "başka bir adayda karar kıldık.",
  },
  {
    icon: Ban,
    text: "Linkedın profiliniz",
    subtext: "maalesef çok renkli.",
  },
  {
    icon: Clock,
    text: "Deneyiminiz fazla",
    subtext: "size bu maaşı veremeyiz.",
  },
  {
    icon: Shield,
    text: "Font seçiminiz",
    subtext: "Inter mi? Çok ana akım.",
  },
  {
    icon: Coffee,
    text: "Kahve tercihi",
    subtext: "Sütsüz mü? Çok sertsiniz.",
  },
  {
    icon: Ban,
    text: "Mülakat arka planı",
    subtext: "Kütüphane mi? Çok klişe.",
  },
  {
    icon: Clock,
    text: "Excel becerisi",
    subtext: "VLOOKUP mı? XLOOKUP lütfen.",
  },
  {
    icon: FileX,
    text: "Burç uyumsuzluğu",
    subtext: "Merkür retrosunda başvurdunuz.",
  },
  {
    icon: XCircle,
    text: "Mülakatta çok su içtiniz",
    subtext: "fazla özgüvenli bulduk.",
  },
  {
    icon: Shield,
    text: "Yetenek setiniz",
    subtext: "Docker biliyorsunuz, biz gemiciyiz.",
  },
  {
    icon: Ban,
    text: "CV dosya adı",
    subtext: "cv_son_v12_final.pdf ? Hayır.",
  },
  {
    icon: Eye,
    text: "Göz kırpma hızı",
    subtext: "Dakikada 12? Çok şüpheli.",
  },
  {
    icon: GitBranch,
    text: "Github yeşilliği",
    subtext: "Gözlerimizi çok yordu.",
  },
  {
    icon: Hourglass,
    text: "Bekleme listesi",
    subtext: "sıranız: 1.492.203",
  },
  {
    icon: Wifi,
    text: "İnternet hızınız",
    subtext: "Ping 15ms? Çok sabırsızsınız.",
  },
  {
    icon: Ban,
    text: "İyi çalışmalar",
    subtext: "Maile 'Saygılarımla' yakışırdı.",
  },
  {
    icon: Timer,
    text: "Sistem saati",
    subtext: "3 saniye geridesiniz.",
  },
  {
    icon: Cloudy,
    text: "Hava durumu",
    subtext: "Bugün hava çok kapalı.",
  },
  {
    icon: Zap,
    text: "Işık hızı",
    subtext: "Kodunuz c'den yavaş.",
  },
  {
    icon: GitCommitHorizontal,
    text: "Commit mesajı",
    subtext: "'fix' yazmışsınız, detay yok.",
  },
  {
    icon: Monitor,
    text: "Masaüstü",
    subtext: "Geri Dönüşüm Kutusu dolu.",
  },
  {
    icon: AppWindow,
    text: "Browser sekmesi",
    subtext: "100+ sekme açık, RAM ağlıyor.",
  },
  {
    icon: Music,
    text: "Spotify listesi",
    subtext: "Arabesk dinliyorsunuz, biz Jazz severiz.",
  },
  {
    icon: Keyboard,
    text: "Klavye kısayolu",
    subtext: "Ctrl+C kullanıyorsunuz, Vim şart.",
  },
  {
    icon: Mouse,
    text: "Mouse kullanımı",
    subtext: "Touchpad mi? Asla kabul edilemez.",
  },
  {
    icon: Users,
    text: "Ofis terliği",
    subtext: "Toplantıda terlik giydiniz.",
  },
  {
    icon: Droplets,
    text: "Su markası",
    subtext: "Musluk suyu içiyorsunuz.",
  },

  {
    icon: Space,
    text: "Tab vs Space",
    subtext: "Space kullandınız, bitti.",
  },
  {
    icon: BriefcaseBusiness,
    text: "Linkedin başlığı",
    subtext: "'Ninja' mı? Biz samuray arıyoruz.",
  },
  {
    icon: Headphones,
    text: "Kulaklık seçimi",
    subtext: "Kablolu mu? Yıl 2026.",
  },
  // Extra cards 1-25
  {
    icon: XCircle,
    text: "Selamlama tonunuz",
    subtext: "çok samimi, kurumsallık alarm verdi.",
  },
  {
    icon: Calendar,
    text: "Takvim daveti",
    subtext: "14:03 yerine 14:00 demeliydiniz.",
  },
  {
    icon: Globe,
    text: "Portföy siteniz",
    subtext: "çok hızlı açıldı, bize güven vermedi.",
  },
  {
    icon: Clock,
    text: "Yanıt süreniz",
    subtext: "4 dakika bekledik, duygusal bağ koptu.",
  },
  {
    icon: Camera,
    text: "Kamera açınız",
    subtext: "yüzde 12 fazla tavan gösteriyor.",
  },
  {
    icon: LampDesk,
    text: "Masa lambanız",
    subtext: "ışık sıcaklığı ekip ruhumuza uymadı.",
  },
  {
    icon: Type,
    text: "Yazı tipi tercihiniz",
    subtext: "Calibri yerine karakter beklerdik.",
  },
  {
    icon: FileArchive,
    text: "PDF boyutu",
    subtext: "287 KB, fazla optimize.",
  },
  {
    icon: Clock,
    text: "Mesaj saatiniz",
    subtext: "02:17'de motivasyon mektubu gönderdiniz.",
  },
  {
    icon: KeyRound,
    text: "Şifre yöneticiniz",
    subtext: "çok güvenli insanlar bizi gerer.",
  },
  {
    icon: Monitor,
    text: "İkinci monitörünüz",
    subtext: "çok düzenli, şüpheli bulduk.",
  },
  {
    icon: AppWindow,
    text: "Sekme disiplini",
    subtext: "tarayıcıyı klasör gibi kullanıyorsunuz.",
  },
  {
    icon: BookOpenText,
    text: "README dosyanız",
    subtext: "çok açıklayıcı, gizem payı bırakmamış.",
  },
  {
    icon: Users,
    text: "Toplantıya girişiniz",
    subtext: "31 saniye erken geldiniz, baskı hissettik.",
  },
  {
    icon: FolderTree,
    text: "Klasör yapınız",
    subtext: "fazla mantıklı, ekip normlarını bozabilir.",
  },
  {
    icon: XCircle,
    text: "Not alma stiliniz",
    subtext: "madde işaretleri fazla simetrik.",
  },
  {
    icon: GitPullRequest,
    text: "Pull request başlığınız",
    subtext: "duygu içermiyor.",
  },
  {
    icon: FileX,
    text: "Profil biyografiniz",
    subtext: "noktalama işaretleri gereğinden iddialı.",
  },
  {
    icon: Clock,
    text: "Tuşa basma ritminiz",
    subtext: "metronomla yarışıyor gibiydi.",
  },
  {
    icon: Shield,
    text: "Caps Lock mesafeniz",
    subtext: "kurum standardının dışında.",
  },
  {
    icon: XCircle,
    text: "Webcam çözünürlüğünüz",
    subtext: "çok net, kusur bulamadık.",
  },
  {
    icon: Ban,
    text: "Ekran paylaşımınız",
    subtext: "çok temizdi, gerçekçi gelmedi.",
  },
  {
    icon: FileX,
    text: "Dosya isimleriniz",
    subtext: "tarih formatınız bize yabancı.",
  },
  {
    icon: Clock,
    text: "Bağlantı kopma sayınız",
    subtext: "sıfır sorun biraz abartı.",
  },
  {
    icon: Shield,
    text: "VPN disiplininiz",
    subtext: "fazla örnek çalışan hissi verdi.",
  },
  // Extra cards 26-50
  {
    icon: XCircle,
    text: "Fincan boyutunuz",
    subtext: "toplantı için gereğinden özgüvenli.",
  },
  {
    icon: Ban,
    text: "Kahvaltı tercihiniz",
    subtext: "poğaça yerine yulaf dediniz.",
  },
  {
    icon: Monitor,
    text: "Masaüstü duvar kağıdınız",
    subtext: "çok motive edici.",
  },
  {
    icon: Clock,
    text: "Bildirim sesiniz",
    subtext: "ekip nabzını bozabilir.",
  },
  {
    icon: GitBranch,
    text: "Git grafiğiniz",
    subtext: "fazla düzgün, doğal akıştan uzak.",
  },
  {
    icon: XCircle,
    text: "El yazınız",
    subtext: "imza bölümünde fazla kararlı.",
  },
  {
    icon: Ban,
    text: "Tarayıcı eklentileriniz",
    subtext: "üretkenliğiniz bizi tehdit etti.",
  },
  {
    icon: FileX,
    text: "Takma adınız",
    subtext: "kurumsal e-posta ile kavga ediyor.",
  },
  {
    icon: Clock,
    text: "Saat dilimi farkınız",
    subtext: "bize düşünmek için fazla zaman bıraktı.",
  },
  {
    icon: Shield,
    text: "Mute tuşu refleksiniz",
    subtext: "fazla profesyonel.",
  },
  {
    icon: XCircle,
    text: "Beyaz tahta kullanımınız",
    subtext: "çok planlı ilerlediniz.",
  },
  {
    icon: Headphones,
    text: "Kulaklık pedleriniz",
    subtext: "renk seçimi politikamıza ters.",
  },
  {
    icon: FileX,
    text: "Bulut klasörünüz",
    subtext: "her şey 'final' değil, huzursuz olduk.",
  },
  {
    icon: Clock,
    text: "Kod gönderim saatiniz",
    subtext: "öğlen sonrası fazla enerjiktiniz.",
  },
  {
    icon: Shield,
    text: "Güvenlik sorunuza cevabınız",
    subtext: "annenizin kızlık soyadı bile etkileyiciydi.",
  },
  {
    icon: XCircle,
    text: "Kod satır sonlarınız",
    subtext: "ruhumuzla çakışmadı.",
  },
  {
    icon: Ban,
    text: "Gün sonu mesajınız",
    subtext: "'kolay gelsin' yerine 'iyi akşamlar' beklerdik.",
  },
  {
    icon: FileX,
    text: "Blog yazınız",
    subtext: "başlıklarınız bizden daha tutarlı.",
  },
  {
    icon: Clock,
    text: "Molaya çıkış süreniz",
    subtext: "dakikliği biraz kişisel aldık.",
  },
  {
    icon: Shield,
    text: "Şarj kablonuz",
    subtext: "örgülü kablo kültürel bir kırılım.",
  },
  {
    icon: XCircle,
    text: "Parantez hizanız",
    subtext: "çok tatmin edici, kıskandık.",
  },
  {
    icon: Users,
    text: "Toplantı arka plan sesiniz",
    subtext: "yağmur sesi fazla sanatsal.",
  },
  {
    icon: FileX,
    text: "Link ağacınız",
    subtext: "fazla derli toplu.",
  },
  {
    icon: Clock,
    text: "Yazım hızınız",
    subtext: "gözlem formunu yetiştiremedik.",
  },
  {
    icon: Shield,
    text: "Tarayıcı yer imleriniz",
    subtext: "fazla bilinçli kategorilenmiş.",
  },
  // Extra cards 51-75
  {
    icon: XCircle,
    text: "Ekran parlaklığınız",
    subtext: "biz daha loş bir ekip hayal etmiştik.",
  },
  {
    icon: Ban,
    text: "Çorap deseniniz",
    subtext: "standup için fazla iddialı.",
  },
  {
    icon: FileX,
    text: "Notion sayfanız",
    subtext: "kapak görseli fazla iyi seçilmiş.",
  },
  {
    icon: Clock,
    text: "Mesai başlangıcınız",
    subtext: "08:59 ile 09:00 arasında etik boşluk var.",
  },
  {
    icon: MicOff,
    text: "Mikrofon kaliteniz",
    subtext: "fazla net, gerçekçi bulmadık.",
  },
  {
    icon: XCircle,
    text: "Soru sorma sıranız",
    subtext: "çok stratejik, spontane değil.",
  },
  {
    icon: Ban,
    text: "Çekmece düzeniniz",
    subtext: "minimalizm kota aşımı.",
  },
  {
    icon: FileX,
    text: "Gönderdiğiniz screenshot",
    subtext: "oklarınız fazla düzgün.",
  },
  {
    icon: Droplets,
    text: "Sunum geçiş hızınız",
    subtext: "ekibi hazırlıksız yakaladı.",
  },
  {
    icon: Shield,
    text: "Hotkey kasınız",
    subtext: "tehlikeli derecede gelişmiş.",
  },
  {
    icon: XCircle,
    text: "Kahkaha seviyeniz",
    subtext: "kurumsal tondan 2 desibel yüksek.",
  },
  {
    icon: Ban,
    text: "Favori terminaliniz",
    subtext: "biz daha dramatik bir seçim beklerdik.",
  },
  {
    icon: FileX,
    text: "Case study dosyanız",
    subtext: "dosya adı umut verici çıktı.",
  },
  {
    icon: Clock,
    text: "Mesaj sonundaki nokta",
    subtext: "gereğinden erken geldi.",
  },
  {
    icon: Camera,
    text: "Kamera odaklamanız",
    subtext: "yüz tanıma sistemimizi etkiledi.",
  },
  {
    icon: XCircle,
    text: "Sorularınızın kalitesi",
    subtext: "mülakat akışını gölgede bıraktı.",
  },
  {
    icon: Ban,
    text: "Tatil planınız",
    subtext: "dengeyi fazla ciddiye alıyorsunuz.",
  },
  {
    icon: FileX,
    text: "Gist paylaşımınız",
    subtext: "temiz kod bu kadar da olmaz.",
  },
  {
    icon: Clock,
    text: "Moladaki dönüşünüz",
    subtext: "saniyesine geri dönmeniz ekipte tedirginlik yarattı.",
  },
  {
    icon: Shield,
    text: "Dosya yedekleme alışkanlığınız",
    subtext: "risk alma kültürümüze uymadı.",
  },
  {
    icon: XCircle,
    text: "Mail imzanız",
    subtext: "fazla düzenliydi.",
  },
  {
    icon: Ban,
    text: "Kod editörü temanız",
    subtext: "biz daha kararsız renkler seviyoruz.",
  },
  {
    icon: FileX,
    text: "Sosyal linkleriniz",
    subtext: "hepsi çalışıyor, bu baskı yaratıyor.",
  },
  {
    icon: Clock,
    text: "Başvuru tarihiniz",
    subtext: "ayın çok mantıklı bir gününe denk geldi.",
  },
  {
    icon: Shield,
    text: "Oturum kilitleme hızınız",
    subtext: "güvenlik ekibini işsiz bırakabilir.",
  },
  // Extra cards 76-100
  {
    icon: XCircle,
    text: "Fikirlerinizi sıralayışınız",
    subtext: "fazla anlaşılırdı.",
  },
  {
    icon: Ban,
    text: "İkinci kahveniz",
    subtext: "özveri seviyeniz bizi rahatsız etti.",
  },
  {
    icon: FileX,
    text: "Ekran görüntüsü çözünürlüğü",
    subtext: "piksel bulamadık.",
  },
  {
    icon: Clock,
    text: "Ping değeriniz",
    subtext: "fazla hızlı bağlandınız.",
  },
  {
    icon: Shield,
    text: "Soru-cevap dengeniz",
    subtext: "fazla sağlıklı.",
  },
  {
    icon: XCircle,
    text: "Monitör yüksekliğiniz",
    subtext: "ergonomi politikamızı tartışmaya açtı.",
  },
  {
    icon: Ban,
    text: "Otomatik düzeltmeniz",
    subtext: "çok az hata bıraktınız.",
  },
  {
    icon: FileX,
    text: "Ajanda fotoğrafınız",
    subtext: "takvim bloklarınız estetik duruyor.",
  },
  {
    icon: Clock,
    text: "Bekleme müziğini dinleme süreniz",
    subtext: "sabır seviyeniz kurum ortalamasını geçti.",
  },
  {
    icon: Shield,
    text: "Tarayıcı geçmişiniz",
    subtext: "fazla teknik, yeterince kaotik değil.",
  },
  {
    icon: XCircle,
    text: "Görüşme öncesi denemeniz",
    subtext: "hazırlıklı adaylarla çalışamıyoruz.",
  },
  {
    icon: Ban,
    text: "Sandalye modeliniz",
    subtext: "fazla konforlu, mücadele ruhunu törpüler.",
  },
  {
    icon: FileX,
    text: "Referans formatınız",
    subtext: "virgülleriniz aşırı güven verdi.",
  },
  {
    icon: Clock,
    text: "Soruyu düşünerek cevap vermeniz",
    subtext: "hemen panik olmadınız.",
  },
  {
    icon: Shield,
    text: "Şirket araştırmanız",
    subtext: "web sitemizi gerçekten okumuşsunuz.",
  },
  {
    icon: XCircle,
    text: "Jira kullanım ihtimaliniz",
    subtext: "fazla sorumluluk kokuyor.",
  },
  {
    icon: Ban,
    text: "Tahta kalemi tutuşunuz",
    subtext: "biraz fazla kontrollü.",
  },
  {
    icon: FileX,
    text: "PDF kenar boşluklarınız",
    subtext: "rahatsız edici derecede dengeli.",
  },
  {
    icon: Clock,
    text: "İlk gülüşünüz",
    subtext: "fazla zamanlı geldi.",
  },
  {
    icon: Camera,
    text: "Kamera karşısı duruşunuz",
    subtext: "fazla stabil.",
  },
  {
    icon: XCircle,
    text: "İsim telaffuzunuz",
    subtext: "şirket adını doğru söylemeniz şaşırttı.",
  },
  {
    icon: Ban,
    text: "Ofis bitkiniz",
    subtext: "fazla canlı, beklentileri yükseltiyor.",
  },
  {
    icon: FileX,
    text: "Başlık seçiminiz",
    subtext: "çok net, yorum alanı bırakmadı.",
  },
  {
    icon: Clock,
    text: "Bildirim kapatma süreniz",
    subtext: "disiplin katsayısı fazla yüksek.",
  },
  {
    icon: Shield,
    text: "Kablo toplama yönteminiz",
    subtext: "iş sağlığı ekibini ağlattı.",
  },
  // Extra cards 101-125
  {
    icon: XCircle,
    text: "Takip mailiniz",
    subtext: "fazla nazik, şüphe uyandırdı.",
  },
  {
    icon: Droplets,
    text: "Sunum yapmadan önce su içmeniz",
    subtext: "profesyonellik doz aşımı.",
  },
  {
    icon: FileX,
    text: "Kullanıcı adınız",
    subtext: "fazla hatırlanabilir.",
  },
  {
    icon: Clock,
    text: "Sekme geçiş hızınız",
    subtext: "gözlerimiz yetişemedi.",
  },
  {
    icon: Shield,
    text: "Şarj adaptörünüz",
    subtext: "çok kompakt, fazla modern.",
  },
  {
    icon: XCircle,
    text: "Cümle sonu tonunuz",
    subtext: "gereğinden umutluydu.",
  },
  {
    icon: Users,
    text: "Toplantı linkini erkenden açmanız",
    subtext: "beklenti yönetimini bozdu.",
  },
  {
    icon: FileX,
    text: "Commit açıklamanız",
    subtext: "işi gereğinden fazla ciddiye almış.",
  },
  {
    icon: Clock,
    text: "Araya girme süreniz",
    subtext: "fazla saygılı davrandınız.",
  },
  {
    icon: Shield,
    text: "Güvenlik sorularına yaklaşımınız",
    subtext: "çok sakin kaldınız.",
  },
  {
    icon: Camera,
    text: "Kameraya bakış süreniz",
    subtext: "özgüven oranı yüksek çıktı.",
  },
  {
    icon: Ban,
    text: "Küçük konuşma performansınız",
    subtext: "fazla yeterliydi.",
  },
  {
    icon: FileX,
    text: "Portföy renk paletiniz",
    subtext: "zevk çıtasını yükseltti.",
  },
  {
    icon: Calendar,
    text: "Takvim onay hızınız",
    subtext: "biz hâlâ düşünüyorduk.",
  },
  {
    icon: Shield,
    text: "Tarayıcı profilleriniz",
    subtext: "fazla organize.",
  },
  {
    icon: XCircle,
    text: "Ses seviyeniz",
    subtext: "kulak sağlığımızı düşündünüz, alışık değiliz.",
  },
  {
    icon: Ban,
    text: "Yemek kartı sorunuz",
    subtext: "fazla gerçekçiydi.",
  },
  {
    icon: FileX,
    text: "Son görüldü ayarınız",
    subtext: "mahremiyet seviyesi yüksek.",
  },
  {
    icon: Clock,
    text: "Oturum açma süreniz",
    subtext: "tek denemede girmeniz beklenmiyordu.",
  },
  {
    icon: Shield,
    text: "İki faktörlü doğrulamanız",
    subtext: "fazla kurallı.",
  },
  {
    icon: XCircle,
    text: "Aydınlatmanız",
    subtext: "gölge bırakmadınız, dramatik değil.",
  },
  {
    icon: Ban,
    text: "Soru örnekleriniz",
    subtext: "fazla iyi hazırlanmış.",
  },
  {
    icon: FileX,
    text: "Case çözümünüz",
    subtext: "bizim dokümandan daha okunaklı.",
  },
  {
    icon: Clock,
    text: "Nefes alma aralığınız",
    subtext: "çok dengeliydi.",
  },
  {
    icon: Shield,
    text: "Yedek internetiniz",
    subtext: "risk iştahımıza ters.",
  },
  // Extra cards 126-150
  {
    icon: XCircle,
    text: "Kısayol kombinasyonlarınız",
    subtext: "kas hafızanız ekipten hızlı.",
  },
  {
    icon: Calendar,
    text: "Takvim bloklama alışkanlığınız",
    subtext: "fazla sınır koyuyorsunuz.",
  },
  {
    icon: FileX,
    text: "Avatar seçiminiz",
    subtext: "fazla sempatik bulundu.",
  },
  {
    icon: Clock,
    text: "Yanıt öncesi duraksamanız",
    subtext: "dramatik olarak yetersizdi.",
  },
  {
    icon: Shield,
    text: "Ekran kilidi duvar kağıdınız",
    subtext: "fazla motive edici.",
  },
  {
    icon: XCircle,
    text: "Çalışma masasındaki bardak altlığı",
    subtext: "detay seviyesi bizi korkuttu.",
  },
  {
    icon: Ban,
    text: "Koyu tema kontrastınız",
    subtext: "retina dostu olmak zorunda değildiniz.",
  },
  {
    icon: FileX,
    text: "Tanıtım cümleniz",
    subtext: "tek nefeste fazla güçlü geldi.",
  },
  {
    icon: Clock,
    text: "Video açılışınız",
    subtext: "bağlantı çok sorunsuzdu.",
  },
  {
    icon: Shield,
    text: "Tab title düzeniniz",
    subtext: "kurumsal arşiv standardını aştı.",
  },
  {
    icon: XCircle,
    text: "Ekip sorularınıza yaklaşımınız",
    subtext: "fazla dikkatliydiniz.",
  },
  {
    icon: Ban,
    text: "Slack durum mesajınız",
    subtext: "çok dürüst.",
  },
  {
    icon: FileX,
    text: "Kod örneği seçiminiz",
    subtext: "acımasızca temiz.",
  },
  {
    icon: Clock,
    text: "Sorular arası bekleyişiniz",
    subtext: "konfor alanı yaratmadı.",
  },
  {
    icon: Shield,
    text: "Dosya indirme klasörünüz",
    subtext: "gerçekçi olmayan seviyede temiz.",
  },
  {
    icon: XCircle,
    text: "Ekran paylaşımında paniklememeniz",
    subtext: "beklenmedik bir gelişme oldu.",
  },
  {
    icon: Coffee,
    text: "Kahve molası frekansınız",
    subtext: "kurum ortalamasının altında.",
  },
  {
    icon: FileX,
    text: "Tablo hizalarınız",
    subtext: "piksel isabeti moral bozdu.",
  },
  {
    icon: Clock,
    text: "Yanıt verirken gülümsemeniz",
    subtext: "zamanlaması fazla iyiydi.",
  },
  {
    icon: Shield,
    text: "Otomatik kaydetme disiplininiz",
    subtext: "fazla güvenilir.",
  },
  {
    icon: XCircle,
    text: "Günlük planınız",
    subtext: "fazla yapılabilir görünüyordu.",
  },
  {
    icon: Ban,
    text: "Ofis dedikodusuna yaklaşımınız",
    subtext: "pasif kaldınız.",
  },
  {
    icon: FileX,
    text: "Arşiv klasör adlarınız",
    subtext: "geleceğe gereğinden hazır.",
  },
  {
    icon: Clock,
    text: "Bekleme odasında duruşunuz",
    subtext: "çok rahattınız.",
  },
  {
    icon: Shield,
    text: "Sızma testi bilginiz",
    subtext: "bazı ekipleri işsiz bırakabilir.",
  },
  // Extra cards 151-175
  {
    icon: Users,
    text: "Toplantı sonunda teşekkür etmeniz",
    subtext: "fazla olgunca.",
  },
  {
    icon: Ban,
    text: "Kablo uzunluğunuz",
    subtext: "özgürlüğe fazla alan bırakıyor.",
  },
  {
    icon: FileX,
    text: "Proje isimleriniz",
    subtext: "beklenmedik derecede yaratıcı.",
  },
  {
    icon: Clock,
    text: "Göz teması süreniz",
    subtext: "ölçüm cihazımızı bozdu.",
  },
  {
    icon: Clock,
    text: "Zaman kutulama beceriniz",
    subtext: "plansız büyüme modelimize ters.",
  },
  {
    icon: XCircle,
    text: "Emoji seçiminiz",
    subtext: "tek bir gülen yüz fazla iddialıydı.",
  },
  {
    icon: Ban,
    text: "Kendi adınıza domain almanız",
    subtext: "fazla kararlı.",
  },
  {
    icon: FileX,
    text: "Kapanış cümleniz",
    subtext: "fazla netti, açık kapı bırakmadı.",
  },
  {
    icon: Camera,
    text: "Kamera açma hızınız",
    subtext: "sisteme yakalanmadınız.",
  },
  {
    icon: Shield,
    text: "Kod yorumlarınız",
    subtext: "fazla insancıl.",
  },
  {
    icon: XCircle,
    text: "Arama geçmişi temizliğiniz",
    subtext: "fazla kontrollü.",
  },
  {
    icon: Ban,
    text: "Sessiz klavye tercihiniz",
    subtext: "biz biraz dram seviyoruz.",
  },
  {
    icon: FileX,
    text: "Özgeçmiş başlığınız",
    subtext: "çok okunur.",
  },
  {
    icon: Calendar,
    text: "Takvim hatırlatıcınız",
    subtext: "bir dakika erken çaldı, disiplini abarttınız.",
  },
  {
    icon: Shield,
    text: "Bulut senkronizasyonunuz",
    subtext: "fazla sorunsuz.",
  },
  {
    icon: XCircle,
    text: "Soru sormadan önceki ifadeniz",
    subtext: "fazla nazikti.",
  },
  {
    icon: Ban,
    text: "CV PDF ikonunuz",
    subtext: "renk tonu kurumsal kedere uygun değil.",
  },
  {
    icon: FileX,
    text: "Demo veriniz",
    subtext: "fazla mantıklı senaryo kurmuşsunuz.",
  },
  {
    icon: Clock,
    text: "Son cümle sonrası sessizliğiniz",
    subtext: "fazla dengeli.",
  },
  {
    icon: Shield,
    text: "Güncelleme notlarınız",
    subtext: "fazla şeffaf.",
  },
  {
    icon: XCircle,
    text: "Başarı örneğiniz",
    subtext: "ikna edici olmasına gerek yoktu.",
  },
  {
    icon: Headphones,
    text: "Kulaklık mikrofon kolu",
    subtext: "fazla profesyonel görünüyordu.",
  },
  {
    icon: FileX,
    text: "Link açıklamalarınız",
    subtext: "hepsi gerçekten ne olduğunu söylüyor.",
  },
  {
    icon: Clock,
    text: "Yazma molalarınız",
    subtext: "ritim duygusu fazla iyi.",
  },
  {
    icon: Shield,
    text: "Karanlıkta bile odaklı oluşunuz",
    subtext: "kurum efsanelerine ters.",
  },
  // Extra cards 176-200
  {
    icon: Users,
    text: "Toplantı linkini kaydetmeniz",
    subtext: "bize göre fazla sürdürülebilir.",
  },
  {
    icon: Ban,
    text: "E-posta konu başlığınız",
    subtext: "konuyu gereğinden net anlatmış.",
  },
  {
    icon: FileX,
    text: "Profil özetiniz",
    subtext: "fazla kısa ve iyi.",
  },
  {
    icon: Clock,
    text: "Soruya başlama zamanınız",
    subtext: "düşünce payı bırakmadınız.",
  },
  {
    icon: Shield,
    text: "Ekran temizliğiniz",
    subtext: "parmak izi bulamadık.",
  },
  {
    icon: Camera,
    text: "Kamera hizanız",
    subtext: "simetri takıntımızı tetikledi.",
  },
  {
    icon: Ban,
    text: "Müsaitlik saatleriniz",
    subtext: "fazla geniş, bu kadar esnek olunmaz.",
  },
  {
    icon: FileX,
    text: "Teknik sunum dosyanız",
    subtext: "başlık ve içerik tutarlıydı.",
  },
  {
    icon: Users,
    text: "Toplantı sonrası cevabınız",
    subtext: "beklenenden önce geldi.",
  },
  {
    icon: Shield,
    text: "Yedek planınız",
    subtext: "A planından daha iyiydi.",
  },
  {
    icon: XCircle,
    text: "Enerji seviyeniz",
    subtext: "kurumsal melankoliye uymadı.",
  },
  {
    icon: Ban,
    text: "Durum güncellemesi formatınız",
    subtext: "çok okunur olmuş.",
  },
  {
    icon: FileX,
    text: "Dosya paylaşım izinleriniz",
    subtext: "kim neye erişiyor belli, tatsız.",
  },
  {
    icon: Clock,
    text: "Görüşme günü seçiminiz",
    subtext: "haftanın fazla mantıklı günü.",
  },
  {
    icon: Shield,
    text: "Güvenlik farkındalığınız",
    subtext: "oltalama testini boşa çıkarabilir.",
  },
  {
    icon: Headphones,
    text: "Kulaklık takışınız",
    subtext: "fazla simetrik.",
  },
  {
    icon: Ban,
    text: "Ekran çözünürlüğünüz",
    subtext: "sunum yapanı olduğundan kısa gösterdi.",
  },
  {
    icon: GitBranch,
    text: "Github pinned repo seçiminiz",
    subtext: "hikaye kurgusu fazla iyi.",
  },
  {
    icon: Clock,
    text: "Mail açılma hızınız",
    subtext: "takip metriklerimizi bozdu.",
  },
  {
    icon: Shield,
    text: "Sessiz ortamınız",
    subtext: "fazla izole, kurumsal uğultu yok.",
  },
  {
    icon: XCircle,
    text: "Not defteri kalınlığınız",
    subtext: "gereğinden hazırlıklı.",
  },
  {
    icon: Ban,
    text: "Açık sekme adlarınız",
    subtext: "fazla anlaşılır.",
  },
  {
    icon: FileX,
    text: "Klasör simgeleriniz",
    subtext: "renk koordinasyonu ürkütücü.",
  },
  {
    icon: Users,
    text: "Toplantıdan çıkışınız",
    subtext: "tam zamanında ayrıldınız, duygusal değildi.",
  },
  {
    icon: Keyboard,
    text: "Klavye eğiminiz",
    subtext: "politikamıza göre fazla rahat.",
  },
];

export interface PositionedRejectionCard extends RejectionCard {
  id: string;
  top: string;
  side: "left" | "right";
  offset: string;
  rotation: number;
  enterDelayMs: number;
  floatDelayMs: number;
  floatDurationMs: number;
  floatDistancePx: number;
  opacity: number;
}

type RejectionCardViewport = "mobile" | "tablet" | "desktop";

interface LayoutColumn {
  side: PositionedRejectionCard["side"];
  min: number;
  max: number;
}

interface LayoutConfig {
  cardCount: number;
  columns: LayoutColumn[];
  topMin: number;
  topMax: number;
  topJitter: number;
  rotationMin: number;
  rotationMax: number;
  revealBaseMs: number;
  revealStepMs: number;
  floatDurationMinMs: number;
  floatDurationMaxMs: number;
  floatDistanceMinPx: number;
  floatDistanceMaxPx: number;
  opacityMin: number;
  opacityMax: number;
}

const layoutConfigs: Record<RejectionCardViewport, LayoutConfig> = {
  mobile: {
    cardCount: 6,
    columns: [
      { side: "left", min: 2, max: 5 },
      { side: "left", min: 8, max: 12 },
      { side: "right", min: 8, max: 12 },
      { side: "right", min: 2, max: 5 },
    ],
    topMin: 8,
    topMax: 88,
    topJitter: 4,
    rotationMin: -6,
    rotationMax: 6,
    revealBaseMs: 250,
    revealStepMs: 250,
    floatDurationMinMs: 9_000,
    floatDurationMaxMs: 14_000,
    floatDistanceMinPx: 4,
    floatDistanceMaxPx: 6,
    opacityMin: 1,
    opacityMax: 1,
  },
  tablet: {
    cardCount: 12,
    columns: [
      { side: "left", min: 2, max: 7 },
      { side: "left", min: 10, max: 15 },
      { side: "right", min: 10, max: 15 },
      { side: "right", min: 2, max: 7 },
    ],
    topMin: 6,
    topMax: 90,
    topJitter: 5,
    rotationMin: -9,
    rotationMax: 9,
    revealBaseMs: 150,
    revealStepMs: 180,
    floatDurationMinMs: 8_000,
    floatDurationMaxMs: 13_000,
    floatDistanceMinPx: 5,
    floatDistanceMaxPx: 8,
    opacityMin: 1,
    opacityMax: 1,
  },
  desktop: {
    cardCount: 26,
    columns: [
      { side: "left", min: 2, max: 8 },
      { side: "left", min: 11, max: 17 },
      { side: "right", min: 11, max: 17 },
      { side: "right", min: 2, max: 8 },
    ],
    topMin: 4,
    topMax: 92,
    topJitter: 6,
    rotationMin: -12,
    rotationMax: 12,
    revealBaseMs: 120,
    revealStepMs: 150,
    floatDurationMinMs: 7_500,
    floatDurationMaxMs: 12_000,
    floatDistanceMinPx: 6,
    floatDistanceMaxPx: 10,
    opacityMin: 1,
    opacityMax: 1,
  },
};

function shuffle<T>(items: readonly T[]): T[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [
      nextItems[swapIndex],
      nextItems[index],
    ];
  }

  return nextItems;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function distributeCount(total: number, bucketCount: number) {
  const counts = Array.from({ length: bucketCount }, () =>
    Math.floor(total / bucketCount),
  );
  const remainderOrder = shuffle(
    Array.from({ length: bucketCount }, (_, index) => index),
  );

  for (let index = 0; index < total % bucketCount; index += 1) {
    counts[remainderOrder[index]] += 1;
  }

  return counts;
}

function buildTopPositions(config: LayoutConfig, count: number) {
  if (count <= 0) {
    return [];
  }

  if (count === 1) {
    return [toPercent(randomBetween(config.topMin + 4, config.topMax - 4))];
  }

  const segment = (config.topMax - config.topMin) / count;

  return shuffle(
    Array.from({ length: count }, (_, index) => {
      const baseTop = config.topMin + segment * index + segment / 2;
      const top = clamp(
        baseTop + randomBetween(-config.topJitter, config.topJitter),
        config.topMin,
        config.topMax,
      );

      return toPercent(top);
    }),
  );
}

function buildSlots(config: LayoutConfig, cardCount: number) {
  const columnCounts = distributeCount(cardCount, config.columns.length);

  return shuffle(
    config.columns.flatMap((column, columnIndex) => {
      const topPositions = buildTopPositions(config, columnCounts[columnIndex]);

      return topPositions.map((top) => ({
        side: column.side,
        offset: toPercent(randomBetween(column.min, column.max)),
        top,
      }));
    }),
  );
}

export function getRejectionCardViewport(width: number): RejectionCardViewport {
  if (width < 640) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

export function buildRejectionCardLayout({
  width,
  reducedMotion = false,
}: {
  width: number;
  reducedMotion?: boolean;
}): PositionedRejectionCard[] {
  const viewport = getRejectionCardViewport(width);
  const config = layoutConfigs[viewport];
  const cardCount = reducedMotion
    ? Math.max(4, Math.floor(config.cardCount * 0.6))
    : config.cardCount;
  const cards = shuffle(rejectionCards).slice(0, cardCount);
  const revealOrder = shuffle(
    Array.from({ length: cards.length }, (_, index) => index),
  );
  const slots = buildSlots(config, cards.length);

  return cards.map((card, index) => {
    const revealIndex = revealOrder[index] ?? index;

    return {
      ...card,
      id: `${card.text}-${index}`,
      ...slots[index],
      rotation: Number(
        randomBetween(config.rotationMin, config.rotationMax).toFixed(1),
      ),
      enterDelayMs: reducedMotion
        ? 0
        : Math.round(
            config.revealBaseMs +
              revealIndex * config.revealStepMs +
              randomBetween(0, config.revealStepMs * 0.6),
          ),
      floatDelayMs: reducedMotion ? 0 : Math.round(randomBetween(240, 1_400)),
      floatDurationMs: reducedMotion
        ? 0
        : Math.round(
            randomBetween(config.floatDurationMinMs, config.floatDurationMaxMs),
          ),
      floatDistancePx: reducedMotion
        ? 0
        : Math.round(
            randomBetween(config.floatDistanceMinPx, config.floatDistanceMaxPx),
          ),
      opacity: Number(
        randomBetween(config.opacityMin, config.opacityMax).toFixed(2),
      ),
    };
  });
}
