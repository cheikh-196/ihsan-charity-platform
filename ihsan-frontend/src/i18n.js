import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traductions FR / AR
const resources = {
    fr: {
        translation: {
            "nav": {
                "home": "Accueil",
                "needs": "Besoins",
                "transparency": "Transparence",
                "dashboard": "Tableau de bord",
                "login": "Connexion",
                "register": "Inscription",
                "logout": "Déconnexion"
            },
            "home": {
                "title1": "La charité",
                "title2": "radicalement transparente",
                "desc": "IHSAN trace chaque don de bout en bout. Chaque transaction est horodatée, hashée en SHA-256 et publiquement vérifiable. Zéro opacité.",
                "btn_needs": "🤲 Voir les besoins",
                "btn_transparency": "🔍 Vérifier les transactions",
                "stats_mru": "MRU distribués",
                "stats_donations": "Dons confirmés",
                "stats_needs": "Besoins actifs",
                "stats_places": "Quartiers couverts"
            }
        }
    },
    ar: {
        translation: {
            "nav": {
                "home": "الرئيسية",
                "needs": "الاحتياجات",
                "transparency": "الشفافية",
                "dashboard": "لوحة القيادة",
                "login": "تسجيل الدخول",
                "register": "إنشاء حساب",
                "logout": "تسجيل الخروج"
            },
            "home": {
                "title1": "العمل الخيري",
                "title2": "بشفافية تامة",
                "desc": "إحسان يتتبع كل تبرع من البداية إلى النهاية. كل معاملة مؤرخة ومؤمنة بـ SHA-256 ويمكن التحقق منها علنًا. لا يوجد تعتيم.",
                "btn_needs": "🤲 عرض الاحتياجات",
                "btn_transparency": "🔍 التحقق من المعاملات",
                "stats_mru": "أوقية موزعة",
                "stats_donations": "تبرعات مؤكدة",
                "stats_needs": "احتياجات نشطة",
                "stats_places": "أحياء مغطاة"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "fr", // langue par défaut
        fallbackLng: "fr",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
