# Design Template 1

Ett modernt, minimalistiskt och professionellt design-template byggt med Next.js, TypeScript, Tailwind CSS och shadcn/ui komponenter.

## 🚀 Funktioner

- **Modern UI/UX**: Minimalistisk design med utmärkt tillgänglighet (a11y)
- **Responsiv Design**: Optimerad för alla enheter
- **TypeScript**: Fullständig typning för bättre utvecklingsupplevelse
- **Tailwind CSS**: Utility-first CSS-ramverk för snabb styling
- **shadcn/ui**: Högkvalitativa, tillgängliga UI-komponenter
- **Next.js 14**: App Router med server-side rendering
- **E-handel Ready**: Shopify-integration för produkthantering

## 🛠️ Teknisk Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: shadcn/ui (Radix primitives)
- **Package Manager**: pnpm
- **Fonts**: Inter (Google Fonts)
- **Icons**: Lucide React

## 📁 Projektstruktur

```
design_template_1/
├── app/                    # Next.js App Router
│   ├── product/           # Produktsidor
│   ├── shop/              # Butikssidor
│   └── layout.tsx         # Root layout
├── components/             # Återanvändbara komponenter
│   ├── ui/                # shadcn/ui komponenter
│   ├── layout/            # Layout-komponenter
│   ├── cart/              # Kundvagn-funktionalitet
│   └── products/          # Produkt-relaterade komponenter
├── lib/                    # Utilities och helpers
├── hooks/                  # Custom React hooks
└── public/                 # Statiska filer
```

## 🚀 Komma igång

### Förutsättningar

- Node.js 18+ 
- pnpm (rekommenderat) eller npm

### Installation

1. Klona projektet:
```bash
git clone <repository-url>
cd design_template_1
```

2. Installera beroenden:
```bash
pnpm install
```

3. Starta utvecklingsservern:
```bash
pnpm dev
```

4. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## 📝 Utveckling

### Kommandon

- `pnpm dev` - Starta utvecklingsservern
- `pnpm build` - Bygg för produktion
- `pnpm start` - Starta produktionsservern
- `pnpm lint` - Kör ESLint
- `pnpm type-check` - Kontrollera TypeScript-typer

### Kodstandarder

- Använd TypeScript för all ny kod
- Följ ESLint-reglerna
- Använd Tailwind CSS för styling
- Komponenter ska vara tillgängliga (a11y)
- Responsiv design för alla enheter

## 🔧 Konfiguration

### Miljövariabler

Skapa en `.env.local` fil med följande variabler:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

### Tailwind CSS

Projektet använder Tailwind CSS med anpassade färger och typografi. Se `tailwind.config.js` för konfiguration.

## 📱 Responsiv Design

Projektet är optimerat för:
- Mobil (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large Desktop (1280px+)

## ♿ Tillgänglighet (A11y)

- Semantisk HTML
- ARIA-attribut där det behövs
- Tangentbordsnavigering
- Skärmläsarstöd
- Kontrastfärger som uppfyller WCAG-riktlinjer

## 🚀 Deployment

### Vercel (Rekommenderat)

1. Pusha kod till GitHub
2. Koppla ditt GitHub-repo till Vercel
3. Konfigurera miljövariabler
4. Deploya automatiskt

### Andra plattformar

Projektet kan deployas på vilken som helst Node.js-hostingplattform som stöder Next.js.

## 🤝 Bidrag

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/AmazingFeature`)
3. Committa dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Pusha till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT-licensen.

## 📞 Support

För frågor eller support, skapa en issue i GitHub-repositoryt.

---

**Utvecklat med ❤️ av Axel Samuelson**
