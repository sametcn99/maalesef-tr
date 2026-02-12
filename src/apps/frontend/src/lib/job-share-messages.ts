export const JOB_SHARE_MESSAGES = [
  "Bu harika {title} pozisyonunu gördün mü? Bence tam sana göre olabilir!",
  "{title} pozisyonu için harika bir fırsat! İlgilenenler kaçırmasın.",
  "Kariyerinde yeni bir sayfa açmak isteyenler için: {title}",
  "Bu {title} ilanı gerçekten dikkat çekici. Başvurmayı düşünen var mı?",
  "Yeni bir macera arayanlar, {title} pozisyonuna bir göz atın!",
  "{title} olarak çalışmak isteyen arkadaşlarım, bu ilanı incelemelisiniz.",
  "Harika bir şirket, harika bir pozisyon: {title}. Kesinlikle bakmalısınız.",
  "İş arayan tanıdıklarım için {title} fırsatını paylaşıyorum.",
  "Bu {title} pozisyonu kaçmaz! Detaylar linkte.",
  "Kariyer basamaklarını tırmanmak isteyenler için şahane bir {title} ilanı.",
  "{title} arayanlar, bu ilana mutlaka bir şans verin.",
  "Geleceğin {title} adayları, bu fırsat sizin için olabilir!",
  "İlgilenenler için {title} pozisyonu açılmış. Bence bir bakın.",
  "Bu {title} rolü tam da aradığım gibi diyenler, linke tıklayın!",
  "Yetenekli bir {title} aranıyor! Belki de o sensin?",
];

export function getRandomJobShareMessage(title: string): string {
  const randomIndex = Math.floor(Math.random() * JOB_SHARE_MESSAGES.length);
  return JOB_SHARE_MESSAGES[randomIndex].replace("{title}", title);
}
