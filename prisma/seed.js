const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INITIAL_ORGANIZATION = {
  name: "CareGroup Health",
  logoUrl: "🧬",
  primaryColor: "#0f766e", // teal-700
  secondaryColor: "#1e1b4b", // indigo-950
  fontFamily: "Inter",
};

const INITIAL_REGIONS = [
  { id: "reg-northeast", name: "Northeast Territory" },
  { id: "reg-midwest", name: "Midwest Territory" },
  { id: "reg-south", name: "South Territory" },
  { id: "reg-west", name: "West Territory" }
];

const INITIAL_SERVICES = [
  {
    id: "dental-cleaning",
    name: "Comprehensive Teeth Cleaning",
    description: "Deep scaling, polishing, and full periodontal assessment by a registered hygienist. Recommended twice a year.",
    duration: 45,
    price: 150,
    category: "Preventive",
    isGlobal: true,
  },
  {
    id: "dental-implants",
    name: "Dental Implants Consultation",
    description: "Advanced 3D imaging, consultation, and treatment planning for permanent restorative tooth implants.",
    duration: 60,
    price: 99,
    category: "Restorative",
    isGlobal: true,
  },
  {
    id: "teeth-whitening",
    name: "Laser Teeth Whitening",
    description: "In-office professional whitening system. Brightens teeth up to 8 shades in a single 60-minute session.",
    duration: 60,
    price: 399,
    category: "Cosmetic",
    isGlobal: true,
  },
  {
    id: "general-consultation",
    name: "General Physician Consultation",
    description: "Routine check-ups, chronic disease management, and prescription renewals with our experienced MDs.",
    duration: 30,
    price: 120,
    category: "General Practice",
    isGlobal: true,
  },
  {
    id: "preventive-wellness",
    name: "Preventive Wellness Screening",
    description: "Full panel blood tests, biometric checks, and personalized longevity counseling.",
    duration: 45,
    price: 250,
    category: "Wellness",
    isGlobal: true,
  },
  {
    id: "acute-care",
    name: "Urgent Illness & Injury Care",
    description: "Walk-in treatment for cuts, sprains, fractures, fevers, allergic reactions, and flu symptoms.",
    duration: 30,
    price: 180,
    category: "Urgent Care",
    isGlobal: true,
  },
  {
    id: "covid-flu-testing",
    name: "Rapid COVID & Flu Screening",
    description: "Dual rapid antigen swab testing with results and official travel documentation in 15 minutes.",
    duration: 15,
    price: 60,
    category: "Testing",
    isGlobal: true,
  },
  {
    id: "botox-cosmetic",
    name: "Botox Cosmetic Treatment",
    description: "FDA-approved prescription medicine injection to temporarily improve the appearance of moderate to severe frown lines.",
    duration: 30,
    price: 450,
    category: "Injectables",
    isGlobal: true,
  },
  {
    id: "hydrafacial",
    name: "HydraFacial Deluxe",
    description: "Patented vortex-fusion treatment that cleanses, exfoliates, extracts, and hydrates the skin using super serums.",
    duration: 60,
    price: 199,
    category: "Aesthetics",
    isGlobal: true,
  },
];

const INITIAL_LOCATIONS = [
  {
    id: "austin-dental",
    name: "Austin Dental Care",
    slug: "austin-dental",
    address: "310 Congress Ave, Suite A",
    city: "Austin",
    state: "TX",
    zip: "78701",
    phone: "(512) 555-0199",
    email: "austin@caregroupdental.com",
    hours: "Mon - Fri: 8:00 AM - 5:00 PM",
    templateType: "DENTAL",
    growthScore: 94,
    
    // Health score breakdowns
    seoScore: 95,
    bookingScore: 90,
    reviewScore: 96,
    contentScore: 92,
    patientScore: 97,
    regionId: "reg-south",
    
    providers: [
      {
        id: "dr-sarah-jensen",
        name: "Dr. Sarah Jensen",
        title: "DDS",
        bio: "Dr. Jensen graduated from UT Health San Antonio. She specializes in advanced cosmetic dentistry and dental implants, and is dedicated to anxiety-free dental care.",
        specialty: "Cosmetic & Implant Dentistry",
        imageUrl: "/providers/dr-jensen.jpg",
        email: "s.jensen@caregroupdental.com",
        profileViews: 1450
      },
      {
        id: "dr-marcus-vance",
        name: "Dr. Marcus Vance",
        title: "DDS",
        bio: "Dr. Vance has over 15 years of experience in general practice and dental surgery. He enjoys helping families achieve healthy, beautiful smiles.",
        specialty: "Family & Restorative Dentistry",
        imageUrl: "/providers/dr-vance.jpg",
        email: "m.vance@caregroupdental.com",
        profileViews: 820
      }
    ],
    serviceIds: ["dental-cleaning", "dental-implants", "teeth-whitening"],
    reviews: [
      {
        patientName: "Alex Rivera",
        rating: 5,
        content: "Absolutely the best dental cleaning experience! Dr. Jensen was extremely gentle, explained everything thoroughly, and the clinic is incredibly clean.",
        date: "2026-07-02",
        replyContent: "Hi Alex! Thank you so much for the kind words. We are thrilled you had a comfortable experience with Dr. Jensen. See you at your next cleaning!",
        replyStatus: "SENT"
      },
      {
        patientName: "Michael Chang",
        rating: 5,
        content: "Had a laser teeth whitening done here. Incredible results! My teeth are noticeably whiter and the process was pain-free. Worth every penny.",
        date: "2026-07-05",
        replyContent: null,
        replyStatus: "NONE"
      },
      {
        patientName: "Sarah K.",
        rating: 4,
        content: "Very modern clinic and helpful front desk staff. Slight delay in starting my appointment, but the treatment itself was excellent.",
        date: "2026-07-06",
        replyContent: null,
        replyStatus: "NONE"
      }
    ],
    analytics: [
      { date: "2026-07-01", visitors: 125, leads: 12, bookings: 6 },
      { date: "2026-07-02", visitors: 140, leads: 15, bookings: 8 },
      { date: "2026-07-03", visitors: 110, leads: 9, bookings: 5 },
      { date: "2026-07-04", visitors: 85, leads: 6, bookings: 3 },
      { date: "2026-07-05", visitors: 95, leads: 11, bookings: 7 },
      { date: "2026-07-06", visitors: 150, leads: 18, bookings: 10 },
      { date: "2026-07-07", visitors: 165, leads: 22, bookings: 12 }
    ]
  },
  {
    id: "radiant-spa",
    name: "Radiant Skin Med Spa",
    slug: "radiant-spa",
    address: "750 Fifth Ave, Floor 3",
    city: "New York",
    state: "NY",
    zip: "10019",
    phone: "(212) 555-0144",
    email: "radiant@caregroupmedspa.com",
    hours: "Mon - Sat: 9:00 AM - 7:00 PM",
    templateType: "SPA",
    growthScore: 89,
    
    // Health score breakdowns
    seoScore: 88,
    bookingScore: 84,
    reviewScore: 92,
    contentScore: 91,
    patientScore: 90,
    regionId: "reg-northeast",

    providers: [
      {
        id: "elizabeth-stone",
        name: "Elizabeth Stone",
        title: "LE",
        bio: "Elizabeth is a licensed aesthetician with a passion for scientific skincare. She specializes in non-invasive skin rejuvenation and custom hydrafacials.",
        specialty: "Advanced Aesthetics",
        imageUrl: "/providers/elizabeth-stone.jpg",
        email: "e.stone@caregroupmedspa.com",
        profileViews: 1980
      },
      {
        id: "dr-alan-ford",
        name: "Dr. Alan Ford",
        title: "MD",
        bio: "Dr. Ford is a board-certified dermatologist overseeing all clinical injectables, ensuring natural-looking and safe facial rejuvenation results.",
        specialty: "Aesthetic Medicine",
        imageUrl: "/providers/dr-ford.jpg",
        email: "a.ford@caregroupmedspa.com",
        profileViews: 1120
      }
    ],
    serviceIds: ["botox-cosmetic", "hydrafacial", "teeth-whitening"],
    reviews: [
      {
        patientName: "Jessica Bennett",
        rating: 5,
        content: "Elizabeth is a skin wizard! My Deluxe HydraFacial left my skin glowing and hydrated for weeks. The clinic is like a luxury hotel.",
        date: "2026-06-28",
        replyContent: "Thank you Jessica! Elizabeth is indeed fantastic. We look forward to pampering you again soon!",
        replyStatus: "SENT"
      },
      {
        patientName: "David Cole",
        rating: 5,
        content: "Got Botox with Dr. Ford. Very professional, listened to my concerns, and did a super natural job. No frozen face at all.",
        date: "2026-07-04",
        replyContent: null,
        replyStatus: "NONE"
      }
    ],
    analytics: [
      { date: "2026-07-01", visitors: 90, leads: 15, bookings: 4 },
      { date: "2026-07-02", visitors: 110, leads: 19, bookings: 7 },
      { date: "2026-07-03", visitors: 95, leads: 12, bookings: 5 },
      { date: "2026-07-04", visitors: 80, leads: 8, bookings: 3 },
      { date: "2026-07-05", visitors: 115, leads: 22, bookings: 9 },
      { date: "2026-07-06", visitors: 130, leads: 25, bookings: 11 },
      { date: "2026-07-07", visitors: 120, leads: 20, bookings: 8 }
    ]
  },
  {
    id: "metro-urgent",
    name: "Metro Health Urgent Care",
    slug: "metro-urgent",
    address: "502 N Michigan Ave",
    city: "Chicago",
    state: "IL",
    zip: "60611",
    phone: "(312) 555-0182",
    email: "chicago@metrohealthurgent.com",
    hours: "Daily: 7:00 AM - 10:00 PM",
    templateType: "URGENT_CARE",
    growthScore: 92,
    
    // Health score breakdowns
    seoScore: 92,
    bookingScore: 89,
    reviewScore: 94,
    contentScore: 90,
    patientScore: 95,
    regionId: "reg-midwest",

    providers: [
      {
        id: "dr-robert-chen",
        name: "Dr. Robert Chen",
        title: "MD",
        bio: "Dr. Chen is a board-certified Emergency Medicine specialist. He manages acute traumas, minor fractures, and infectious diseases with clinical precision.",
        specialty: "Emergency Medicine",
        imageUrl: "/providers/dr-chen.jpg",
        email: "r.chen@metrohealthurgent.com",
        profileViews: 980
      },
      {
        id: "lucas-milligan",
        name: "Lucas Milligan",
        title: "FNP-C",
        bio: "Lucas is a certified Family Nurse Practitioner focusing on urgent pediatric care, acute illness diagnoses, and sports injury treatments.",
        specialty: "Family Urgent Care",
        imageUrl: "/providers/lucas-milligan.jpg",
        email: "l.milligan@metrohealthurgent.com",
        profileViews: 740
      }
    ],
    serviceIds: ["acute-care", "covid-flu-testing"],
    reviews: [
      {
        patientName: "Emma Watson",
        rating: 5,
        content: "Super fast walk-in care! Came in with a deep cut on my hand, was checked in, stitched up by Dr. Chen, and discharged in under 45 minutes.",
        date: "2026-07-01",
        replyContent: "Thank you Emma! We strive to deliver fast and professional urgent care to our community. We wish you a speedy recovery!",
        replyStatus: "SENT"
      },
      {
        patientName: "James P.",
        rating: 3,
        content: "Wait time was about 35 minutes on a Sunday afternoon, which isn't bad for urgent care. The Nurse Practitioner Lucas was very professional.",
        date: "2026-07-03",
        replyContent: "Hi James, thank you for your review. Sundays can get a bit busy, but we are glad you received professional care from Lucas.",
        replyStatus: "SENT"
      }
    ],
    analytics: [
      { date: "2026-07-01", visitors: 210, leads: 40, bookings: 25 },
      { date: "2026-07-02", visitors: 230, leads: 45, bookings: 28 },
      { date: "2026-07-03", visitors: 190, leads: 35, bookings: 22 },
      { date: "2026-07-04", visitors: 180, leads: 30, bookings: 19 },
      { date: "2026-07-05", visitors: 220, leads: 42, bookings: 27 },
      { date: "2026-07-06", visitors: 250, leads: 50, bookings: 35 },
      { date: "2026-07-07", visitors: 240, leads: 48, bookings: 32 }
    ]
  },
  {
    id: "midtown-medical",
    name: "Midtown Medical Group",
    slug: "midtown-medical",
    address: "2400 Peachtree Rd NE",
    city: "Atlanta",
    state: "GA",
    zip: "30305",
    phone: "(404) 555-0155",
    email: "atlanta@caregroupmedical.com",
    hours: "Mon - Fri: 8:30 AM - 5:30 PM",
    templateType: "MEDICAL",
    growthScore: 85,
    
    // Health score breakdowns
    seoScore: 86,
    bookingScore: 80,
    reviewScore: 85,
    contentScore: 88,
    patientScore: 86,
    regionId: "reg-south",

    providers: [
      {
        id: "dr-helen-rhodes",
        name: "Dr. Helen Rhodes",
        title: "MD",
        bio: "Dr. Rhodes is a primary care physician with special certification in geriatrics and preventive medicine. She leads our wellness diagnostics clinic.",
        specialty: "Primary Care & Geriatrics",
        imageUrl: "/providers/dr-rhodes.jpg",
        email: "h.rhodes@caregroupmedical.com",
        profileViews: 1250
      }
    ],
    serviceIds: ["general-consultation", "preventive-wellness"],
    reviews: [
      {
        patientName: "Robert Green",
        rating: 4,
        content: "Good doctor, very meticulous during my general wellness screening. Clean office and parking is easy.",
        date: "2026-07-02",
        replyContent: null,
        replyStatus: "NONE"
      }
    ],
    analytics: [
      { date: "2026-07-01", visitors: 80, leads: 8, bookings: 4 },
      { date: "2026-07-02", visitors: 95, leads: 11, bookings: 6 },
      { date: "2026-07-03", visitors: 85, leads: 7, bookings: 4 },
      { date: "2026-07-04", visitors: 50, leads: 3, bookings: 2 },
      { date: "2026-07-05", visitors: 70, leads: 6, bookings: 3 },
      { date: "2026-07-06", visitors: 100, leads: 12, bookings: 7 },
      { date: "2026-07-07", visitors: 90, leads: 10, bookings: 5 }
    ]
  }
];

const INITIAL_LEADS = [
  {
    name: "Arthur Pendelton",
    email: "arthur.p@outlook.com",
    phone: "(512) 555-8832",
    status: "LEAD",
    source: "CHAT",
    notes: "Asked about insurance coverage for dental implants."
  },
  {
    name: "Megan Fox",
    email: "megan.f@gmail.com",
    phone: "(212) 555-7281",
    status: "VISITOR",
    source: "WEBSITE",
    notes: "Looked at HydraFacial Deluxe pricing sheet."
  },
  {
    name: "Clara Oswald",
    email: "clara.o@yahoo.com",
    phone: "(312) 555-1033",
    status: "PATIENT",
    source: "BOOKING",
    notes: "Regular patient check-up for pediatric flu shot."
  },
  {
    name: "Daniel Craig",
    email: "bond.007@mi6.gov.uk",
    phone: "(404) 555-0070",
    status: "APPOINTMENT",
    source: "BOOKING",
    notes: "Booked general health consultation check-up."
  }
];

const INITIAL_APPOINTMENTS = [
  {
    patientName: "Alice Cooper",
    patientEmail: "alice@rock.com",
    patientPhone: "(512) 555-1972",
    appointmentDate: "2026-07-10",
    appointmentTime: "10:30",
    status: "CONFIRMED",
    notes: "First time at this clinic. Requests gentle touch.",
    serviceId: "teeth-whitening",
    providerId: "dr-sarah-jensen",
    locationId: "austin-dental"
  },
  {
    patientName: "Bruce Banner",
    patientEmail: "hulk@avengers.org",
    patientPhone: "(312) 555-9111",
    appointmentDate: "2026-07-08",
    appointmentTime: "14:15",
    status: "PENDING",
    notes: "Needs sudden checkup for radiation level, walking in.",
    serviceId: "acute-care",
    providerId: "dr-robert-chen",
    locationId: "metro-urgent"
  },
  {
    patientName: "Selena Gomez",
    patientEmail: "selena@popstars.net",
    patientPhone: "(212) 555-0909",
    appointmentDate: "2026-07-12",
    appointmentTime: "16:00",
    status: "CONFIRMED",
    notes: "Wants premium quiet room during cosmetic injection.",
    serviceId: "botox-cosmetic",
    providerId: "dr-alan-ford",
    locationId: "radiant-spa"
  }
];

async function main() {
  console.log('🌱 Starting enterprise database seeding...');

  console.log('Cleaning database...');
  await prisma.appointment.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.analytics.deleteMany({});
  await prisma.provider.deleteMany({});
  await prisma.locationService.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.region.deleteMany({});
  await prisma.organization.deleteMany({});

  console.log('Creating organization...');
  const org = await prisma.organization.create({
    data: {
      name: INITIAL_ORGANIZATION.name,
      logoUrl: INITIAL_ORGANIZATION.logoUrl,
      primaryColor: INITIAL_ORGANIZATION.primaryColor,
      secondaryColor: INITIAL_ORGANIZATION.secondaryColor,
      fontFamily: INITIAL_ORGANIZATION.fontFamily,
    }
  });

  console.log('Creating Regions...');
  const regionMap = {};
  for (const r of INITIAL_REGIONS) {
    const reg = await prisma.region.create({
      data: {
        id: r.id,
        name: r.name,
        organizationId: org.id
      }
    });
    regionMap[r.id] = reg;
  }

  console.log('Creating global services...');
  const serviceMap = {};
  for (const s of INITIAL_SERVICES) {
    const service = await prisma.service.create({
      data: {
        id: s.id,
        name: s.name,
        description: s.description,
        duration: s.duration,
        price: s.price,
        category: s.category,
        isGlobal: s.isGlobal,
      }
    });
    serviceMap[s.id] = service;
  }

  console.log('Creating locations and related assets...');
  for (const locData of INITIAL_LOCATIONS) {
    const loc = await prisma.location.create({
      data: {
        id: locData.id,
        name: locData.name,
        slug: locData.slug,
        address: locData.address,
        city: locData.city,
        state: locData.state,
        zip: locData.zip,
        phone: locData.phone,
        email: locData.email,
        hours: locData.hours,
        templateType: locData.templateType,
        growthScore: locData.growthScore,
        seoScore: locData.seoScore,
        bookingScore: locData.bookingScore,
        reviewScore: locData.reviewScore,
        contentScore: locData.contentScore,
        patientScore: locData.patientScore,
        regionId: locData.regionId,
        organizationId: org.id,
      }
    });

    await prisma.page.create({
      data: {
        slug: "home",
        title: `${loc.name} - Home`,
        type: "HOME",
        locationId: loc.id,
        content: JSON.stringify({
          heroTitle: `Welcome to ${loc.name}`,
          heroSubtitle: `Providing premium healthcare in ${loc.city}, ${loc.state}`,
          aboutSection: `At ${loc.name}, we are dedicated to providing the highest quality healthcare services to the ${loc.city} community. Our team of experienced professionals utilizes state-of-the-art technology to ensure your health and comfort.`,
        })
      }
    });

    for (const sId of locData.serviceIds) {
      await prisma.locationService.create({
        data: {
          locationId: loc.id,
          serviceId: sId,
        }
      });
    }

    for (const provData of locData.providers) {
      await prisma.provider.create({
        data: {
          id: provData.id,
          name: provData.name,
          title: provData.title,
          bio: provData.bio,
          specialty: provData.specialty,
          imageUrl: provData.imageUrl,
          email: provData.email,
          profileViews: provData.profileViews,
          locationId: loc.id,
        }
      });
    }

    for (const revData of locData.reviews) {
      await prisma.review.create({
        data: {
          patientName: revData.patientName,
          rating: revData.rating,
          content: revData.content,
          date: revData.date,
          replyContent: revData.replyContent,
          replyStatus: revData.replyStatus,
          locationId: loc.id,
        }
      });
    }

    for (const anData of locData.analytics) {
      await prisma.analytics.create({
        data: {
          date: anData.date,
          visitors: anData.visitors,
          leads: anData.leads,
          bookings: anData.bookings,
          locationId: loc.id,
        }
      });
    }
  }

  console.log('Creating CRM leads...');
  for (const leadData of INITIAL_LEADS) {
    await prisma.lead.create({
      data: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        status: leadData.status,
        source: leadData.source,
        notes: leadData.notes,
      }
    });
  }

  console.log('Creating appointments...');
  for (const apptData of INITIAL_APPOINTMENTS) {
    await prisma.appointment.create({
      data: {
        patientName: apptData.patientName,
        patientEmail: apptData.patientEmail,
        patientPhone: apptData.patientPhone,
        appointmentDate: apptData.appointmentDate,
        appointmentTime: apptData.appointmentTime,
        status: apptData.status,
        notes: apptData.notes,
        serviceId: apptData.serviceId,
        providerId: apptData.providerId,
        locationId: apptData.locationId,
      }
    });
  }

  console.log('🌱 Enterprise Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
