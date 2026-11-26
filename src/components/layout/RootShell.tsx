import { SerwistProvider } from "@/components/providers/SerwistProvider";
import { I18nBootstrap } from "@/components/providers/I18nBootstrap";
import { PwaInstallProvider } from "@/components/pwa/PwaInstallProvider";
import { fontVariables } from "@/lib/fonts";
import "@/app/globals.css";

/**
 * The <html> document shared by each root layout. `lang` and `dir` belong on the
 * root element: screen readers, hyphenation, search engines, and RTL rely on it.
 */
export function RootShell({
  lang,
  dir = "ltr",
  children,
}: {
  lang: string;
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      dir={dir}
      className={`${fontVariables} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased">
        <I18nBootstrap>
          <SerwistProvider>
            <PwaInstallProvider>{children}</PwaInstallProvider>
          </SerwistProvider>
        </I18nBootstrap>
      </body>
    </html>
  );
}
