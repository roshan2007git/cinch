import CinchLogo from "@/components/ui/cinch-logo";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div>
            <CinchLogo />

            <p className="mt-6 text-[#8A8880] leading-7">
              Custom clothing,
              made personal.
            </p>
          </div>

          <div>
            <h3 className="uppercase text-sm tracking-[0.2em] mb-6">
              Navigation
            </h3>

            <div className="space-y-3 text-[#8A8880]">
              <a href="#about">
                About
              </a>
              <br />
              <a href="#process">
                How It Works
              </a>
              <br />
              <a href="#pricing">
                Pricing
              </a>
              <br />
              <a href="#faq">
                FAQ
              </a>
            </div>
          </div>

          <div>
            <h3 className="uppercase text-sm tracking-[0.2em] mb-6">
              Legal
            </h3>

            <div className="space-y-3 text-[#8A8880]">
              <p>
                Privacy Policy
              </p>
              <p>
                Terms of Service
              </p>
              <p>
                Refund Policy
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2C2C2A] mt-16 pt-8 text-[#8A8880] text-sm">
          © 2026 Cinch. All rights
          reserved. Made in Bengaluru 🇮🇳
        </div>
      </div>
    </footer>
  );
}