/**
 * AutoPin case study, a D-GITALCODE product. Code-based page at /{locale}/portfolio/autopin.
 *
 * Every feature listed as verified was shown working against the Pinterest API Sandbox on
 * 2026-11-27 (recorded session, HQ report operations/media/autopin-standard-access/
 * TECHNICAL_VERIFICATION.md). Do not add Production, Standard Access, video Pin, analytics
 * or automatic-scheduler claims until there is evidence for them.
 */
import type { Locale } from "@/lib/i18n/settings";

export const AUTOPIN_SLUG = "autopin";
export const AUTOPIN_PRIVACY_URL = "https://autopin-privacy.vercel.app/privacy";
export const AUTOPIN_COVER = "/images/portfolio/autopin/autopin-dashboard.webp";
export const AUTOPIN_OG_IMAGE = "/images/portfolio/autopin/autopin-og.jpg";
export const AUTOPIN_TECHNOLOGIES = [
  "Python",
  "FastAPI",
  "SQLAlchemy",
  "Alembic",
  "APScheduler",
  "Jinja2",
  "Pinterest API v5",
  "OAuth 2.0",
];

export const AUTOPIN_SCREENSHOTS = [
  { src: "/images/portfolio/autopin/autopin-dashboard.webp", key: "dashboard" },
  { src: "/images/portfolio/autopin/autopin-connected.webp", key: "connected" },
  { src: "/images/portfolio/autopin/autopin-review.webp", key: "review" },
  { src: "/images/portfolio/autopin/autopin-history.webp", key: "history" },
] as const;

type ScreenshotKey = (typeof AUTOPIN_SCREENSHOTS)[number]["key"];

export interface AutoPinCase {
  title: string;
  tagline: string;
  metaDescription: string;
  cardDescription: string;
  attribution: string;
  agencyLink: string;
  statusLabel: string;
  statusText: string;
  introTitle: string;
  intro: string;
  problemTitle: string;
  problem: string;
  audienceTitle: string;
  audience: string;
  verifiedTitle: string;
  verifiedNote: string;
  verified: string[];
  partialTitle: string;
  partial: string[];
  notClaimedTitle: string;
  notClaimed: string[];
  architectureTitle: string;
  architecture: { label: string; text: string }[];
  screensTitle: string;
  screensNote: string;
  screens: Record<ScreenshotKey, string>;
  trustTitle: string;
  privacyLink: string;
  disclaimer: string;
}

const en: AutoPinCase = {
  title: "AutoPin",
  tagline: "Pinterest Pin planning and publishing, with every Pin approved by a person.",
  metaDescription:
    "AutoPin, developed by D-GITALCODE: connect a Pinterest account with OAuth, review and approve each Pin, then publish it through the Pinterest API. Verified in the Pinterest Sandbox.",
  cardDescription:
    "Pinterest publishing tool developed by D-GITALCODE: OAuth connection, individual Pin approval and publishing through the Pinterest API, verified in the Pinterest Sandbox.",
  attribution: "Developed by D-GITALCODE",
  agencyLink: "Visit the D-GITALCODE website",
  statusLabel: "In development · Verified in the Pinterest Sandbox",
  statusText:
    "AutoPin has been tested end to end against the Pinterest API Sandbox, where Pins are visible only to their creator. Production publishing requires Pinterest Standard Access, which has not been granted. AutoPin is not yet available as a public service.",
  introTitle: "What AutoPin is",
  intro:
    "AutoPin is a web application that prepares Pinterest Pins and publishes them through Pinterest's official API. A business connects its Pinterest account with Pinterest's own sign-in, chooses a board, uploads images, reviews each Pin and decides which ones are published.",
  problemTitle: "The problem it addresses",
  problem:
    "Publishing on Pinterest regularly means repeating the same steps for every image: upload, pick a board, write the details, publish. Fully automatic tools remove the person from the decision. AutoPin keeps the repetitive work in one place while leaving the final choice to the user: nothing is published until someone approves that specific Pin.",
  audienceTitle: "Who it is for",
  audience:
    "Small businesses, shops and content teams that publish images on Pinterest and want a clear queue, an approval step and a record of what was published.",
  verifiedTitle: "Verified capabilities",
  verifiedNote: "Shown working against the Pinterest API Sandbox in a recorded session on 27 November 2026.",
  verified: [
    "Pinterest account connection through OAuth 2.0: the user signs in on Pinterest's own page; AutoPin never sees the Pinterest password",
    "Connected account display, confirmed with Pinterest after sign-in",
    "Board retrieval from the Pinterest API and selection of the publishing board",
    "Image upload into a queue where every new Pin starts on hold",
    "Individual review and approval of each Pin before it can be published",
    "Publish next Pin now: the approved Pin is created on Pinterest through the API",
    "Publishing history with the Pin ID returned by Pinterest",
    "Access tokens stored encrypted, never shown in the interface",
  ],
  partialTitle: "Partially verified",
  partial: [
    "Scheduling: a publish time can be set on a Pin, and a time alone never approves it. Automatic publication at the scheduled time has not yet been fully verified.",
  ],
  notClaimedTitle: "Not claimed",
  notClaimed: [
    "Production publishing on public Pinterest boards (requires Standard Access, not granted)",
    "Video Pins",
    "Analytics or reporting",
  ],
  architectureTitle: "Architecture and technology",
  architecture: [
    { label: "Backend", text: "Python with FastAPI, server-rendered Jinja2 interface" },
    { label: "Data", text: "SQLAlchemy models with Alembic migrations" },
    { label: "Pinterest integration", text: "Pinterest API v5 over HTTPS (httpx): OAuth token exchange, user account, boards, Pin creation" },
    { label: "Security", text: "OAuth 2.0 authorization code flow with single-use state; tokens encrypted at rest (Fernet); bcrypt password hashing" },
    { label: "Background work", text: "APScheduler for periodic checks of approved Pins" },
  ],
  screensTitle: "Screens",
  screensNote: "Captured from the recorded Pinterest API Sandbox session (test account and test images).",
  screens: {
    dashboard: "Dashboard: environment, connected account, board and queue status",
    connected: "Pinterest account connected through OAuth, Sandbox environment",
    review: "Reviewing a Pin before approving it",
    history: "Publishing history with the Pin ID returned by Pinterest",
  },
  trustTitle: "Developer and policies",
  privacyLink: "AutoPin privacy policy",
  disclaimer: "AutoPin is an independent product by D-GITALCODE and is not affiliated with or endorsed by Pinterest.",
};

const fr: AutoPinCase = {
  title: "AutoPin",
  tagline: "Planification et publication d'Épingles Pinterest, chaque Épingle validée par une personne.",
  metaDescription:
    "AutoPin, développé par D-GITALCODE : connexion d'un compte Pinterest via OAuth, validation de chaque Épingle, puis publication via l'API Pinterest. Vérifié dans le Sandbox Pinterest.",
  cardDescription:
    "Outil de publication Pinterest développé par D-GITALCODE : connexion OAuth, validation individuelle des Épingles et publication via l'API Pinterest, vérifié dans le Sandbox Pinterest.",
  attribution: "Développé par D-GITALCODE",
  agencyLink: "Visiter le site de D-GITALCODE",
  statusLabel: "En développement · Vérifié dans le Sandbox Pinterest",
  statusText:
    "AutoPin a été testé de bout en bout avec le Sandbox de l'API Pinterest, où les Épingles ne sont visibles que par leur créateur. La publication en production nécessite l'accès Standard de Pinterest, qui n'a pas été accordé. AutoPin n'est pas encore disponible comme service public.",
  introTitle: "Ce qu'est AutoPin",
  intro:
    "AutoPin est une application web qui prépare des Épingles Pinterest et les publie via l'API officielle de Pinterest. Une entreprise connecte son compte Pinterest avec la connexion propre à Pinterest, choisit un tableau, importe des images, vérifie chaque Épingle et décide lesquelles sont publiées.",
  problemTitle: "Le problème traité",
  problem:
    "Publier régulièrement sur Pinterest oblige à répéter les mêmes étapes pour chaque image : import, choix du tableau, détails, publication. Les outils entièrement automatiques retirent la personne de la décision. AutoPin regroupe le travail répétitif tout en laissant le choix final à l'utilisateur : rien n'est publié tant que cette Épingle précise n'a pas été validée.",
  audienceTitle: "Pour qui",
  audience:
    "Petites entreprises, boutiques et équipes de contenu qui publient des images sur Pinterest et veulent une file claire, une étape de validation et un historique de ce qui a été publié.",
  verifiedTitle: "Fonctionnalités vérifiées",
  verifiedNote: "Démontrées avec le Sandbox de l'API Pinterest lors d'une session enregistrée le 27 novembre 2026.",
  verified: [
    "Connexion du compte Pinterest via OAuth 2.0 : l'utilisateur se connecte sur la page de Pinterest ; AutoPin ne voit jamais le mot de passe Pinterest",
    "Affichage du compte connecté, confirmé auprès de Pinterest après la connexion",
    "Récupération des tableaux via l'API Pinterest et choix du tableau de publication",
    "Import d'images dans une file où chaque nouvelle Épingle commence en attente",
    "Vérification et validation individuelle de chaque Épingle avant toute publication",
    "Publier la prochaine Épingle maintenant : l'Épingle validée est créée sur Pinterest via l'API",
    "Historique des publications avec l'identifiant d'Épingle renvoyé par Pinterest",
    "Jetons d'accès stockés chiffrés, jamais affichés dans l'interface",
  ],
  partialTitle: "Partiellement vérifié",
  partial: [
    "Planification : une heure de publication peut être fixée sur une Épingle, et une heure seule ne la valide jamais. La publication automatique à l'heure prévue n'a pas encore été entièrement vérifiée.",
  ],
  notClaimedTitle: "Non revendiqué",
  notClaimed: [
    "Publication en production sur des tableaux Pinterest publics (nécessite l'accès Standard, non accordé)",
    "Épingles vidéo",
    "Statistiques ou rapports",
  ],
  architectureTitle: "Architecture et technologies",
  architecture: [
    { label: "Backend", text: "Python avec FastAPI, interface rendue côté serveur avec Jinja2" },
    { label: "Données", text: "Modèles SQLAlchemy avec migrations Alembic" },
    { label: "Intégration Pinterest", text: "API Pinterest v5 en HTTPS (httpx) : échange de jeton OAuth, compte utilisateur, tableaux, création d'Épingles" },
    { label: "Sécurité", text: "Flux OAuth 2.0 par code d'autorisation avec état à usage unique ; jetons chiffrés au repos (Fernet) ; mots de passe hachés avec bcrypt" },
    { label: "Tâches de fond", text: "APScheduler pour la vérification périodique des Épingles validées" },
  ],
  screensTitle: "Écrans",
  screensNote: "Captures de la session enregistrée avec le Sandbox de l'API Pinterest (compte et images de test).",
  screens: {
    dashboard: "Tableau de bord : environnement, compte connecté, tableau et état de la file",
    connected: "Compte Pinterest connecté via OAuth, environnement Sandbox",
    review: "Vérification d'une Épingle avant sa validation",
    history: "Historique des publications avec l'identifiant renvoyé par Pinterest",
  },
  trustTitle: "Développeur et politiques",
  privacyLink: "Politique de confidentialité d'AutoPin",
  disclaimer: "AutoPin est un produit indépendant de D-GITALCODE, sans affiliation ni approbation de Pinterest.",
};

const ar: AutoPinCase = {
  title: "AutoPin",
  tagline: "تخطيط دبابيس Pinterest ونشرها، مع موافقة شخص على كل دبوس.",
  metaDescription:
    "AutoPin من تطوير D-GITALCODE: ربط حساب Pinterest عبر OAuth، ومراجعة كل دبوس والموافقة عليه، ثم نشره عبر واجهة Pinterest البرمجية. تم التحقق منه في بيئة Sandbox الخاصة بـ Pinterest.",
  cardDescription:
    "أداة نشر على Pinterest من تطوير D-GITALCODE: ربط عبر OAuth، وموافقة فردية على كل دبوس، ونشر عبر واجهة Pinterest البرمجية، تم التحقق منها في بيئة Sandbox.",
  attribution: "من تطوير D-GITALCODE",
  agencyLink: "زيارة موقع D-GITALCODE",
  statusLabel: "قيد التطوير · تم التحقق في بيئة Sandbox الخاصة بـ Pinterest",
  statusText:
    "تم اختبار AutoPin بالكامل مع بيئة Sandbox لواجهة Pinterest البرمجية، حيث لا تظهر الدبابيس إلا لمنشئها. يتطلب النشر في بيئة الإنتاج الوصول القياسي (Standard Access) من Pinterest، ولم يُمنح بعد. AutoPin غير متاح بعد كخدمة عامة.",
  introTitle: "ما هو AutoPin",
  intro:
    "AutoPin تطبيق ويب يُعدّ دبابيس Pinterest وينشرها عبر واجهة Pinterest البرمجية الرسمية. تربط الشركة حساب Pinterest الخاص بها عبر صفحة تسجيل الدخول الخاصة بـ Pinterest، وتختار لوحة، وترفع الصور، وتراجع كل دبوس، وتقرر ما يُنشر منها.",
  problemTitle: "المشكلة التي يعالجها",
  problem:
    "النشر المنتظم على Pinterest يعني تكرار الخطوات نفسها لكل صورة: الرفع، واختيار اللوحة، وكتابة التفاصيل، والنشر. الأدوات الآلية بالكامل تُبعد الشخص عن القرار. يجمع AutoPin العمل المتكرر في مكان واحد ويترك القرار النهائي للمستخدم: لا يُنشر أي شيء قبل الموافقة على ذلك الدبوس بعينه.",
  audienceTitle: "لمن هو موجّه",
  audience:
    "الشركات الصغيرة والمتاجر وفرق المحتوى التي تنشر الصور على Pinterest وتريد قائمة انتظار واضحة وخطوة موافقة وسجلاً لما تم نشره.",
  verifiedTitle: "قدرات تم التحقق منها",
  verifiedNote: "تم عرضها وهي تعمل مع بيئة Sandbox لواجهة Pinterest البرمجية في جلسة مسجلة بتاريخ 27 نوفمبر 2026.",
  verified: [
    "ربط حساب Pinterest عبر OAuth 2.0: يسجّل المستخدم الدخول في صفحة Pinterest نفسها، ولا يرى AutoPin كلمة مرور Pinterest أبداً",
    "عرض الحساب المرتبط بعد تأكيده لدى Pinterest",
    "جلب اللوحات من واجهة Pinterest البرمجية واختيار لوحة النشر",
    "رفع الصور إلى قائمة انتظار يبدأ فيها كل دبوس جديد معلّقاً",
    "مراجعة كل دبوس والموافقة عليه بشكل فردي قبل أن يمكن نشره",
    "نشر الدبوس التالي الآن: يُنشأ الدبوس الموافق عليه على Pinterest عبر الواجهة البرمجية",
    "سجل النشر مع معرّف الدبوس الذي أعاده Pinterest",
    "رموز الوصول مخزّنة مشفّرة ولا تظهر في الواجهة أبداً",
  ],
  partialTitle: "تم التحقق جزئياً",
  partial: [
    "الجدولة: يمكن تحديد وقت نشر للدبوس، والوقت وحده لا يعني الموافقة عليه أبداً. لم يتم بعد التحقق بالكامل من النشر التلقائي في الوقت المحدد.",
  ],
  notClaimedTitle: "غير مُدّعى",
  notClaimed: [
    "النشر في بيئة الإنتاج على لوحات Pinterest العامة (يتطلب الوصول القياسي، ولم يُمنح)",
    "دبابيس الفيديو",
    "الإحصاءات أو التقارير",
  ],
  architectureTitle: "البنية والتقنيات",
  architecture: [
    { label: "الواجهة الخلفية", text: "Python مع FastAPI، وواجهة تُعرض من الخادم باستخدام Jinja2" },
    { label: "البيانات", text: "نماذج SQLAlchemy مع ترحيلات Alembic" },
    { label: "التكامل مع Pinterest", text: "واجهة Pinterest البرمجية v5 عبر HTTPS (httpx): تبادل رمز OAuth، وحساب المستخدم، واللوحات، وإنشاء الدبابيس" },
    { label: "الأمان", text: "تدفق OAuth 2.0 برمز التفويض مع حالة تُستخدم مرة واحدة؛ رموز مشفّرة أثناء التخزين (Fernet)؛ كلمات مرور مجزّأة باستخدام bcrypt" },
    { label: "المهام الخلفية", text: "APScheduler للتحقق الدوري من الدبابيس الموافق عليها" },
  ],
  screensTitle: "الشاشات",
  screensNote: "لقطات من الجلسة المسجلة مع بيئة Sandbox لواجهة Pinterest البرمجية (حساب وصور اختبار).",
  screens: {
    dashboard: "لوحة التحكم: البيئة والحساب المرتبط واللوحة وحالة قائمة الانتظار",
    connected: "حساب Pinterest مرتبط عبر OAuth في بيئة Sandbox",
    review: "مراجعة دبوس قبل الموافقة عليه",
    history: "سجل النشر مع معرّف الدبوس الذي أعاده Pinterest",
  },
  trustTitle: "المطوّر والسياسات",
  privacyLink: "سياسة الخصوصية لـ AutoPin",
  disclaimer: "AutoPin منتج مستقل من D-GITALCODE، وليس تابعاً لـ Pinterest ولا معتمداً منها.",
};

const CASES: Record<Locale, AutoPinCase> = { en, fr, ar };

export function getAutoPinCase(locale: Locale): AutoPinCase {
  return CASES[locale] ?? CASES.fr;
}
