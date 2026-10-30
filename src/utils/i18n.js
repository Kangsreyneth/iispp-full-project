/** UI labels in English and Khmer. Content typed by admins is shown as written. */
const dict = {
  en: {
    home: "Home", about: "About", academics: "Academics", faculty: "Faculty", admissions: "Admissions",
    news: "News", events: "Events", contact: "Contact", search: "Search", searchPlaceholder: "Search news, events, programs…",
    adminLogin: "Admin", dashboard: "Dashboard", logout: "Logout",
    readMore: "Read more", viewAll: "View all", learnMore: "Learn more",
    latestNews: "Latest news", upcomingEvents: "Upcoming events", programs: "Programs", exploreProgram: "Explore programs",
    visitUs: "Visit us", directions: "Get directions", sendMessage: "Send us a message",
    name: "Your name", email: "Email", subject: "Subject", message: "Message", send: "Send message",
    noResults: "No results found", featured: "Featured", apply: "How to apply",
    followUs: "Follow us", quickLinks: "Quick links", contactUs: "Contact us",
    undergraduate: "Undergraduate", graduate: "Graduate", shortCourse: "Short course",
  },
  km: {
    home: "ទំព័រដើម", about: "អំពីយើង", academics: "កម្មវិធីសិក្សា", faculty: "មហាវិទ្យាល័យ", admissions: "ការចូលរៀន",
    news: "ព័ត៌មាន", events: "ព្រឹត្តិការណ៍", contact: "ទំនាក់ទំនង", search: "ស្វែងរក", searchPlaceholder: "ស្វែងរកព័ត៌មាន ព្រឹត្តិការណ៍ កម្មវិធី…",
    adminLogin: "អ្នកគ្រប់គ្រង", dashboard: "ផ្ទាំងគ្រប់គ្រង", logout: "ចាកចេញ",
    readMore: "អានបន្ត", viewAll: "មើលទាំងអស់", learnMore: "ស្វែងយល់បន្ថែម",
    latestNews: "ព័ត៌មានថ្មីៗ", upcomingEvents: "ព្រឹត្តិការណ៍ខាងមុខ", programs: "កម្មវិធីសិក្សា", exploreProgram: "រកមើលកម្មវិធីសិក្សា",
    visitUs: "មកទស្សនា", directions: "ទិសដៅ", sendMessage: "ផ្ញើសារមកយើង",
    name: "ឈ្មោះរបស់អ្នក", email: "អ៊ីមែល", subject: "ប្រធានបទ", message: "សារ", send: "ផ្ញើសារ",
    noResults: "រកមិនឃើញលទ្ធផល", featured: "ពិសេស", apply: "របៀបចុះឈ្មោះ",
    followUs: "តាមដានយើង", quickLinks: "តំណរហ័ស", contactUs: "ទាក់ទងយើង",
    undergraduate: "បរិញ្ញាបត្រ", graduate: "ក្រោយបរិញ្ញាបត្រ", shortCourse: "វគ្គខ្លី",
  },
};
export const translate = (lang, key) => dict[lang]?.[key] ?? dict.en[key] ?? key;
