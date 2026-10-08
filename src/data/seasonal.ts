import site from './site.json';
const enquiry = new URL(site.whatsapp);
enquiry.searchParams.set('text', "Hi! I'd like to ask about new preschool admissions at The Little Graduates during Vidyarambham season and arrange a visit.");
export const admissionsWhatsApp = enquiry.href;
export const testimonials = [
  { quote: "A huge blessing — it made me realize how much a school's methodology and approach shape both a child's and a parent's experience of learning.", name: 'Reshma Koruth', role: 'Parent of 3' },
  { quote: 'The faculty is dedicated and passionate. Teachers are friendly and approachable, making kids feel comfortable.', name: 'Adithya Unnikrishnan', role: 'Parent' },
];
export const faqs = [
  ['What ages can join?', 'We welcome children aged 1.5–6 across Playgroup, Nursery, LKG and UKG. Our team can help you choose a suitable starting point for your child.'],
  ['What if my child takes time to settle in?', 'New children ease in gradually, with familiar teachers nearby and a predictable routine. Every child settles differently; talk with us about what your child needs.'],
  ['Where can I find the fees?', 'Our fee guide explains programme fees. The Fees page asks for a parent name and phone number to open the guide. You can also ask our team about the programme you are considering.'],
  ['Is daycare available?', 'Yes, we offer daycare and afterschool options. Ask our team about timings and the right arrangement for your family.'],
  ['Where is the preschool?', 'We are on Kattayil Road, Near Kaloor, Elamakara, Kochi, Kerala 682017. Book a free campus visit to see the classrooms and meet the team.'],
];
export const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q,a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
