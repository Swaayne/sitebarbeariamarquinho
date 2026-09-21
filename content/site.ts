import { assetPath } from "@/lib/asset-path";
// Edite aqui os contatos, textos, preços e fotos após o feedback.
export const site = {
  name: "Barbearia do Marquinhos", city: "Indaiatuba", whatsapp: "5519992837580", phoneDisplay: "(19) 99283-7580",
  instagramUrl: "", // Insira o link verdadeiro para ativar o Instagram.
  instagramLabel: "Instagram", draft: true, showPrices: true, showTeam: true, copyrightYear: 2026,
  address: { street: "Rua Onze de Junho, 442", neighborhood: "Centro", state: "SP", postalCode: "13330-050" },
  hours: [{ days: "Terça a sexta", time: "08h às 19h" }, { days: "Sábado", time: "08h às 18h" }, { days: "Domingo e segunda", time: "Fechado" }],
  about: { text: "Cuidar do visual também é reservar um momento para você. A proposta da Barbearia do Marquinhos é simples: um corte que combine com seu estilo e uma boa conversa sobre o que você procura.", secondParagraph: "Estamos na Rua Onze de Junho, no centro de Indaiatuba. Escolha um serviço, fale com a gente pelo WhatsApp e combine sua próxima visita." },
  images: { hero: { src: assetPath("images/hero.webp"), alt: "Foto ilustrativa de barbeiros cuidando do corte de clientes" }, about: { src: assetPath("images/interior.webp"), alt: "Foto ilustrativa de cadeiras e espelhos em uma barbearia" } }
};
export const services = [
  { name: "Corte masculino", description: "Clássico, moderno ou uma nova ideia. O ponto de partida é o seu estilo.", price: "R$ [XX]", featured: false },
  { name: "Barba", description: "Desenho e acabamento para dar forma à barba e valorizar o seu visual.", price: "R$ [XX]", featured: false },
  { name: "Corte + Barba", description: "Um cuidado completo para alinhar o corte, a barba e a sua personalidade.", price: "R$ [XX]", featured: true },
  { name: "Acabamento", description: "Os detalhes que renovam o contorno e mantêm o corte em dia.", price: "R$ [XX]", featured: false },
  { name: "Corte infantil", description: "Uma opção de cuidado para os pequenos. Consulte as idades atendidas.", price: "R$ [XX]", featured: false }
];
export const gallery = [
  { src: assetPath("images/haircut.webp"), title: "Cortes & personalidade", alt: "Referência ilustrativa de corte masculino com acabamento nas laterais" },
  { src: assetPath("images/beard.webp"), title: "Barba nos detalhes", alt: "Referência ilustrativa de um serviço de cuidado com a barba" },
  { src: assetPath("images/interior.webp"), title: "O ambiente", alt: "Referência de ambiente; não é uma fotografia da Barbearia do Marquinhos" },
  { src: assetPath("images/tools.webp"), title: "O cuidado de perto", alt: "Referência ilustrativa de ferramentas de barbearia" }
];
export const team = ["Barbeiro 1", "Barbeiro 2", "Barbeiro 3"];
export const questions = [
  { question: "Preciso agendar horário?", answer: "Você pode solicitar um horário pelo WhatsApp. O atendimento por ordem de chegada e a necessidade de reserva ainda serão confirmados pela barbearia.", pending: true },
  { question: "Quais formas de pagamento vocês aceitam?", answer: "As formas de pagamento serão informadas aqui. Enquanto isso, consulte a barbearia pelo WhatsApp antes da sua visita.", pending: true },
  { question: "Vocês atendem crianças?", answer: "O corte infantil está entre os serviços propostos neste rascunho. Confirme pelo WhatsApp a disponibilidade e as idades atendidas.", pending: true },
  { question: "Qual o horário de funcionamento?", answer: "De terça a sexta, das 08h às 19h. Aos sábados, das 08h às 18h. Domingo e segunda-feira, fechado. Para feriados, consulte pelo WhatsApp.", pending: false }
];
export function whatsappUrl(service?: string) {
  const message = service ? `Olá! Vim pelo site da ${site.name} e gostaria de agendar ${service.toLowerCase()}. Poderiam me informar os horários disponíveis e o valor?` : `Olá! Vim pelo site da ${site.name} e gostaria de agendar um horário.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
export function fullAddress() { return `${site.address.street} - ${site.address.neighborhood}, ${site.city} - ${site.address.state}, ${site.address.postalCode}`; }
export function mapsUrl() { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress())}`; }
export function mapEmbedUrl() { return `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress())}&t=&z=16&ie=UTF8&iwloc=&output=embed`; }
