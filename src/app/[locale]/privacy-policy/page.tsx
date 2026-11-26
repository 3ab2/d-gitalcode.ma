import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/settings";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";

const PRIVACY_EMAIL = "dgitalcode@gmail.com";
const PRIVACY_WEBSITE = "https://d-gitalcodema.vercel.app";
const LAST_UPDATED = "9 août 2026";

const META = {
  title: "Politique de confidentialité — AutoPin",
  description:
    "Politique de confidentialité de D-GITALCODE et de l'application AutoPin.",
} as const;

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPublicPageMetadata({
    locale: locale as Locale,
    path: "privacy-policy",
    title: META.title,
    description: META.description,
  });
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-white/70 md:text-base">
        {children}
      </div>
    </section>
  );
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <article className="pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-white/[0.08] pb-8">
          <p className="text-sm font-medium text-brand-green">D-GITALCODE — AutoPin</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-sm text-white/50">
            Dernière mise à jour : {LAST_UPDATED}
          </p>
        </header>

        <div className="mt-10 space-y-10">
          <div className="space-y-4 text-[15px] leading-relaxed text-white/70 md:text-base">
            <p>
              D-GITALCODE (« nous », « notre » ou « nos ») respecte votre vie privée et
              s&apos;engage à protéger les informations personnelles traitées dans le
              cadre de ses services et de son application <strong className="font-semibold text-white/90">AutoPin</strong>.
            </p>
            <p>
              Cette Politique de confidentialité explique quelles informations peuvent
              être traitées, comment elles sont utilisées, et dans quelles circonstances
              elles peuvent être partagées.
            </p>
          </div>

          <Section id="presentation" title="1. Présentation">
            <p>
              <strong className="font-semibold text-white/90">D-GITALCODE</strong>{" "}
              développe des solutions numériques pour accompagner ses clients et
              utilisateurs.
            </p>
            <p>
              <strong className="font-semibold text-white/90">AutoPin</strong>
              {" "}
              est un outil d&apos;automatisation développé par D-GITALCODE permettant à
              son utilisateur autorisé de publier des images et des vidéos sur Pinterest
              via l&apos;API officielle de Pinterest.
            </p>
            <p>
              Site web :{" "}
              <a
                href={PRIVACY_WEBSITE}
                className="text-brand-green underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {PRIVACY_WEBSITE}
              </a>
            </p>
          </Section>

          <Section id="informations" title="2. Informations traitées">
            <p>Selon l&apos;utilisation d&apos;AutoPin, les informations suivantes peuvent être traitées :</p>

            <h3 className="pt-2 text-base font-semibold text-white/90 md:text-lg">
              Informations de compte Pinterest
            </h3>
            <p>
              Lorsque vous connectez votre compte Pinterest à AutoPin, l&apos;application
              peut recevoir, via l&apos;autorisation OAuth de Pinterest, les informations
              nécessaires à son fonctionnement, notamment :
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-brand-green">
              <li>les informations de compte Pinterest requises pour l&apos;autorisation OAuth ;</li>
              <li>les identifiants de compte Pinterest nécessaires à l&apos;application ;</li>
              <li>les tableaux (Boards) requis pour la publication ;</li>
              <li>les informations relatives aux Épingles nécessaires au fonctionnement de l&apos;application.</li>
            </ul>
            <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white/85">
              AutoPin ne reçoit jamais et ne stocke jamais le mot de passe Pinterest de
              l&apos;utilisateur.
            </p>

            <h3 className="pt-2 text-base font-semibold text-white/90 md:text-lg">
              Contenus et métadonnées
            </h3>
            <p>AutoPin peut également traiter :</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-brand-green">
              <li>des images ;</li>
              <li>des vidéos ;</li>
              <li>des titres ;</li>
              <li>des descriptions ;</li>
              <li>des URL de destination ;</li>
              <li>des métadonnées de publication ;</li>
              <li>des informations techniques nécessaires au fonctionnement de l&apos;application.</li>
            </ul>
          </Section>

          <Section id="utilisation" title="3. Utilisation des données">
            <p>Les données sont utilisées uniquement pour :</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-brand-green">
              <li>authentifier le compte Pinterest ;</li>
              <li>publier du contenu ;</li>
              <li>sélectionner les tableaux de destination ;</li>
              <li>automatiser les publications ;</li>
              <li>vérifier le statut des publications ;</li>
              <li>assurer la maintenance et le dépannage de l&apos;application.</li>
            </ul>
            <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white/85">
              D-GITALCODE ne vend pas les informations personnelles.
            </p>
          </Section>

          <Section id="api-pinterest" title="4. API Pinterest">
            <p>
              AutoPin utilise l&apos;API officielle de Pinterest ainsi que
              l&apos;autorisation OAuth afin de connecter le compte de
              l&apos;utilisateur et de publier du contenu.
            </p>
            <p>
              Les données Pinterest ne sont utilisées que pour les fonctionnalités
              demandées par l&apos;utilisateur autorisé.
            </p>
            <p>
              L&apos;utilisation de Pinterest reste soumise à la politique de
              confidentialité et aux conditions d&apos;utilisation de Pinterest.
            </p>
          </Section>

          <Section id="traitement-local" title="5. Traitement local des médias">
            <p>
              Lorsque AutoPin est utilisé localement, les fichiers multimédias peuvent
              rester sur l&apos;ordinateur de l&apos;utilisateur.
            </p>
            <p>L&apos;application peut utiliser des dossiers tels que :</p>
            <pre className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 font-mono text-sm text-white/80">
              {`input/\narchive/\nfailed/`}
            </pre>
            <p>
              Après une publication réussie, un fichier multimédia peut être déplacé
              de <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-sm text-white/85">input/</code>{" "}
              vers{" "}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-sm text-white/85">archive/</code>.
            </p>
            <p>
              Une publication en échec ne doit pas être considérée comme une
              publication réussie.
            </p>
          </Section>

          <Section id="stockage-securite" title="6. Stockage et sécurité des données">
            <p>
              Nous mettons en œuvre des mesures de sécurité raisonnables destinées à
              protéger les informations traitées par AutoPin contre l&apos;accès non
              autorisé, la perte, la modification ou la divulgation.
            </p>
            <p>
              Aucun système n&apos;étant totalement à l&apos;abri des risques, nous ne
              pouvons pas garantir une sécurité absolue.
            </p>
            <p>
              Les identifiants OAuth, jetons d&apos;accès et secrets d&apos;application
              doivent être stockés de manière sécurisée et ne doivent jamais être
              exposés publiquement.
            </p>
          </Section>

          <Section id="conservation" title="7. Conservation des données">
            <p>
              Les données sont conservées uniquement aussi longtemps que nécessaire au
              fonctionnement de l&apos;application.
            </p>
            <p>
              Les utilisateurs peuvent supprimer les médias stockés localement à tout
              moment.
            </p>
            <p>
              Les utilisateurs peuvent également révoquer l&apos;autorisation Pinterest
              accordée à AutoPin depuis les paramètres de leur compte Pinterest.
            </p>
          </Section>

          <Section id="tiers" title="8. Services tiers">
            <p>
              Pinterest est le principal service tiers utilisé par AutoPin pour
              l&apos;autorisation et la publication de contenu.
            </p>
            <p>
              Ce service dispose de sa propre politique de confidentialité et de ses
              propres conditions d&apos;utilisation. Nous vous recommandons de les
              consulter.
            </p>
          </Section>

          <Section id="droits" title="9. Droits des utilisateurs">
            <p>Selon les lois applicables, vous pouvez notamment demander :</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-brand-green">
              <li>l&apos;accès aux informations vous concernant ;</li>
              <li>la correction d&apos;informations inexactes ;</li>
              <li>la suppression de certaines informations ;</li>
              <li>la limitation de certains traitements, lorsque cela est applicable ;</li>
              <li>le retrait ou la révocation d&apos;une autorisation précédemment accordée.</li>
            </ul>
            <p>
              Pour toute demande relative à la confidentialité, contactez-nous à :{" "}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="text-brand-green underline-offset-2 hover:underline"
              >
                {PRIVACY_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section id="mineurs" title="10. Protection des mineurs">
            <p>
              AutoPin n&apos;est pas destiné aux enfants. D-GITALCODE ne collecte pas
              sciemment d&apos;informations personnelles auprès d&apos;enfants.
            </p>
          </Section>

          <Section id="modifications" title="11. Modifications">
            <p>
              Cette Politique de confidentialité peut être mise à jour lorsque cela est
              nécessaire afin de refléter des évolutions d&apos;AutoPin, de nos services
              ou des exigences applicables.
            </p>
            <p>
              La date de « Dernière mise à jour » indiquée en haut de cette page sera
              modifiée en conséquence.
            </p>
          </Section>

          <Section id="contact" title="12. Contact">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-6">
              <p className="font-semibold text-white">D-GITALCODE</p>
              <p className="mt-1 font-medium text-white/90">AutoPin</p>
              <p className="mt-4">
                Email :{" "}
                <a
                  href={`mailto:${PRIVACY_EMAIL}`}
                  className="text-brand-green underline-offset-2 hover:underline"
                >
                  {PRIVACY_EMAIL}
                </a>
              </p>
              <p className="mt-2">
                Site web :{" "}
                <a
                  href={PRIVACY_WEBSITE}
                  className="text-brand-green underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PRIVACY_WEBSITE}
                </a>
              </p>
            </div>
            <p className="pt-2 text-sm text-white/50">
              Cette Politique de confidentialité s&apos;applique à l&apos;utilisation
              d&apos;AutoPin et aux fonctionnalités associées fournies par D-GITALCODE.
            </p>
          </Section>
        </div>
      </div>
    </article>
  );
}
