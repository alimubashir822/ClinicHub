Created & Developed by [Mubashir Ali](#developer-creator) (Full-Stack Healthcare Technology Engineer | AI Healthcare Solutions Builder)

# 🏥 CareFranchise OS

## AI-Powered Healthcare Franchise Digital Operating System

CareFranchise OS is a state-of-the-art Healthcare Franchise Digital Operating System built to help large healthcare organizations launch locations faster, maintain brand consistency, increase patient acquisition, and scale technical digital operations.

The system transitions traditional clinic websites into active, synchronized assets, pairing local customization options for clinic managers with robust corporate oversight tools for HQ administrators.

---

## 🚀 Key Features

### 1. Enterprise Regional Hierarchy & Access Control (RBAC)
*   **Corporate Headquarters**: Full administrative control over branding, new location provisioning, service price catalogs, and compliance audits.
*   **Regional Territory Manager**: Control panels to assign managers to territories, monitor compliance, and coordinate routing rules within specific ZIP mappings.
*   **Clinic Location Manager**: Customization console for local clinic hours, local announcements, doctor scheduling, and homepage layout blocks.
*   **Healthcare Provider**: Personal listing dashboards to update medical biographies and check schedule listings.

### 2. AI Brand Compliance Guardian™
*   **Automated Audits**: Crawls all live locations to scan for FDA claim violations, missing medical disclaimers, style violations, and outdated credentials.
*   **DB-Backed Resolution**: Built-in "Fix Auto" server actions to instantly resolve compliance issues in database text values in real-time.

### 3. AI Location Launch Wizard & Asset Generator
*   **5-Step Provisioning**: Orchestrates location names, specialty templates, service allocations, practitioner details, and dynamic subdomains.
*   **Asset Previewer**: Pre-generates Local Business JSON-LD micro-data, local promotional email campaigns, Google search ads, and local marketing copies on launch.

### 4. Smart Booking Network & Load Balancer
*   **Proximity Routing Simulator**: Routes patient booking requests based on ZIP code locations and specialty treatment match rates.
*   **Load Monitor**: Reroutes booking demand dynamically based on provider availability and clinic capacity indicators.

### 5. Technical SEO Command Center
*   **PageSpeed Analytics**: Real-time speed metrics for each digital twin location.
*   **Sitemap Registers**: Automatic compilation of dynamic XML sitemaps pathing.
*   **JSON-LD Verification**: Structured schema validation code snippets to inspect crawler readouts.

### 6. Website Block Builder
*   **Drag & Order Layouts**: Local clinic managers can toggle sections (Hero, Services, Providers, Reviews) and rearrange layout order, which immediately propagates to public landing pages.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16.2 (App Router)
*   **UI Library**: React 19.2, Lucide React Icons
*   **Database ORM**: Prisma ORM with SQLite backend (`prisma/dev.db`)
*   **Styles**: Tailwind CSS v4 using CSS theme variables
*   **Interactive Features**: Canvas Confetti animations, AI Chatbot assistant widgets

---

## 📦 Directory Structure

```text
├── prisma/
│   ├── dev.db             # SQLite local database file
│   └── schema.prisma      # Core database entities (Org, Region, Location, Provider, Review, Appt, Page)
├── src/
│   ├── app/
│   │   ├── admin/         # HQ control dashboards (booking, brand, locations, crm, seo)
│   │   ├── clinic/        # Local clinic portal manager settings & website block editor
│   │   ├── sites/[slug]/  # Public-facing location microsites with AI chatbot widget
│   │   ├── actions.ts     # Core server actions for regions, compliance, blocks, and appointments
│   │   ├── layout.tsx     # Global page metadata and fonts
│   │   └── globals.css    # Responsive scrollbar styles and Tailwind settings
│   └── components/
│       ├── ui.tsx         # Responsive Cards, Inputs, Modals, Badges, and Buttons
│       └── admin-layout.tsx # Responsive collapsible sidebar navigation layout
```

---

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Database
```bash
npx prisma db push
```

### 3. Seed Database
```bash
npx prisma db seed
# or run custom setup action
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Corporate HQ Control Panel.

---

## 🏥 Compliance & Customization Footers
Partnered with **Med Clinic X** for global healthcare layout distributions. Public landing pages and portals render standardized footers with hyperlinks back to:
[Healthcare system by Med Clinic X](https://www.medclinicx.com/)

---

<a id="developer-creator"></a>
## 👤 Developer & Creator

I am a Full-Stack Healthcare Technology Developer specializing in building modern, scalable, and AI-powered healthcare platforms. I create high-performance digital solutions using React.js, Next.js, TypeScript, and Tailwind CSS to deliver fast, secure, and user-friendly experiences.

My expertise covers complete application development, from frontend architecture and responsive interfaces to backend systems powered by Node.js, REST APIs, GraphQL, PostgreSQL, and Prisma ORM. I build reliable platforms designed for scalability, performance, and long-term growth.

I work with modern cloud infrastructure including AWS, Vercel Edge, Google Cloud, Cloudflare CDN, Docker, and CI/CD pipelines to deploy secure and optimized applications.

With a strong focus on healthcare technology, I develop solutions including patient portals, AI automation systems, EHR integrations, and healthcare applications built around industry standards such as FHIR APIs and HIPAA compliance requirements.

My goal is to combine modern software engineering, cloud technologies, and healthcare innovation to help organizations build smarter digital experiences that improve patient engagement, operational efficiency, and healthcare delivery.

### 📫 Connect with Me

- 💼 **LinkedIn**: <a href="https://linkedin.com/in/mubashirali822" target="_blank" rel="noopener noreferrer">mubashirali822</a>
- 📧 **Email**: <a href="mailto:alimubashir822@gmail.com" target="_blank" rel="noopener noreferrer">alimubashir822@gmail.com</a>
- 🌐 **Website**: <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer">medclinicx.com</a>
- 🏥 **View More Healthcare Solutions**: <a href="https://www.medclinicx.com/demo" target="_blank" rel="noopener noreferrer">medclinicx.com/demo</a>

⭐ *Building the next generation of digital healthcare technology.*
