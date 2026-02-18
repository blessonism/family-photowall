import { getSiteConfig } from "@/lib/data";

const siteConfig = getSiteConfig();

export default function Footer() {
  return (
    <footer className="bg-foreground text-white/80">
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="font-serif text-2xl text-white mb-3">
          {siteConfig.familyName}氏家族
        </p>
        <p className="text-sm text-white/50 mb-8">
          {siteConfig.footer.message}
        </p>
        <div className="w-12 h-px bg-white/20 mx-auto mb-8" />
        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} {siteConfig.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
