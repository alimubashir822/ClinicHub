import { PrismaClient } from '@prisma/client';
import { 
  INITIAL_ORGANIZATION, 
  INITIAL_SERVICES, 
  INITIAL_LOCATIONS, 
  INITIAL_LEADS, 
  INITIAL_APPOINTMENTS 
} from '../src/lib/initialData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing database
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
  await prisma.organization.deleteMany({});

  // 2. Create Organization
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

  // 3. Create Global Services
  console.log('Creating global services...');
  const serviceMap: { [key: string]: any } = {};
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

  // 4. Create Locations, Pages, Providers, Reviews, and Analytics
  console.log('Creating locations and related assets...');
  for (const locData of INITIAL_LOCATIONS) {
    // Create Location
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
        organizationId: org.id,
      }
    });

    // Create default Pages for this location
    // Home Page
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

    // Link Services to Location
    for (const sId of locData.serviceIds) {
      await prisma.locationService.create({
        data: {
          locationId: loc.id,
          serviceId: sId,
        }
      });
    }

    // Create Providers
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
          locationId: loc.id,
        }
      });
    }

    // Create Reviews
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

    // Create Analytics records
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

  // 5. Create Leads
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

  // 6. Create Appointments
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

  console.log('🌱 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
