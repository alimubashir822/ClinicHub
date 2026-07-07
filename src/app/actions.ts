'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// ==========================================
// Organization & Brand Actions
// ==========================================
export async function getOrganization() {
  try {
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: {
          name: "CareGroup Health",
          logoUrl: "🧬",
          primaryColor: "#0f766e",
          secondaryColor: "#1e1b4b",
          fontFamily: "Inter"
        }
      });
    }
    return org;
  } catch (error) {
    console.error("Error fetching organization:", error);
    return null;
  }
}

export async function updateOrganization(data: {
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}) {
  try {
    const org = await db.organization.findFirst();
    if (org) {
      const updated = await db.organization.update({
        where: { id: org.id },
        data
      });
      revalidatePath('/admin');
      revalidatePath('/sites');
      return updated;
    }
    return null;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw new Error("Failed to update branding settings");
  }
}

// ==========================================
// Region Actions
// ==========================================
export async function getRegions() {
  try {
    return await db.region.findMany({
      include: {
        locations: true
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
}

// ==========================================
// Location & Generator Actions
// ==========================================
export async function getLocations() {
  try {
    return await db.location.findMany({
      include: {
        region: true,
        providers: true,
        services: {
          include: {
            service: true
          }
        },
        appointments: true,
        reviews: true,
        analytics: true,
        pages: true
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export async function getLocationBySlug(slug: string) {
  try {
    return await db.location.findUnique({
      where: { slug },
      include: {
        region: true,
        providers: true,
        services: {
          include: {
            service: true
          }
        },
        reviews: {
          orderBy: { date: 'desc' }
        },
        appointments: true,
        pages: true
      }
    });
  } catch (error) {
    console.error(`Error fetching location ${slug}:`, error);
    return null;
  }
}

// ==========================================
// AI Franchise Launch Engine (Signature Feature)
// ==========================================
export async function launchLocation(data: {
  name: string;
  city: string;
  state: string;
  address: string;
  zip: string;
  phone: string;
  email: string;
  hours: string;
  templateType: string; // DENTAL, MEDICAL, URGENT_CARE, SPA
  services: string[]; // array of service IDs
  providers: { name: string; title: string; specialty: string; email: string }[];
  regionId?: string; // Optional regional assignment
}) {
  try {
    const org = await db.organization.findFirst();
    if (!org) throw new Error("No organization found");

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // 1. Create Location with regional indicators & health scores
    const location = await db.location.create({
      data: {
        name: data.name,
        slug,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        phone: data.phone,
        email: data.email,
        hours: data.hours,
        templateType: data.templateType,
        growthScore: Math.floor(Math.random() * 12) + 85, // Random 85-97 score
        
        // Seeding individual metrics
        seoScore: Math.floor(Math.random() * 15) + 82,
        bookingScore: Math.floor(Math.random() * 15) + 80,
        reviewScore: Math.floor(Math.random() * 10) + 88,
        contentScore: Math.floor(Math.random() * 12) + 85,
        patientScore: Math.floor(Math.random() * 15) + 82,

        regionId: data.regionId || null,
        organizationId: org.id
      }
    });

    // 2. Link services to Location
    for (const serviceId of data.services) {
      await db.locationService.create({
        data: {
          locationId: location.id,
          serviceId
        }
      });
    }

    // 3. Create Providers
    for (const provider of data.providers) {
      await db.provider.create({
        data: {
          name: provider.name,
          title: provider.title,
          specialty: provider.specialty,
          email: provider.email,
          bio: `Dr. ${provider.name} is a dedicated practitioner at our ${data.city} location, specializing in ${provider.specialty} and patient-centered clinical care.`,
          profileViews: 10, // start views
          locationId: location.id
        }
      });
    }

    // 4. Create Dynamic Pages content
    const heroSubtitleMap: Record<string, string> = {
      DENTAL: `Expert Dental Care & Radiant Smiles in ${data.city}`,
      MEDICAL: `Comprehensive Family Medicine & Primary Care in ${data.city}`,
      URGENT_CARE: `Fast, Reliable Walk-In Urgent Clinical Care in ${data.city}`,
      SPA: `Premium Medical Spa Treatments & Rejuvenation in ${data.city}`
    };

    const aboutSectionMap: Record<string, string> = {
      DENTAL: `Welcome to ${data.name}. Our state-of-the-art practice offers comprehensive dental services ranging from preventive hygiene to advanced cosmetic smile makeovers and permanent dental implants.`,
      MEDICAL: `At ${data.name}, our primary care physicians are committed to providing personalized, high-quality general medicine, chronic condition management, and diagnostics to families in ${data.city}.`,
      URGENT_CARE: `When minor injuries or sudden illnesses happen, ${data.name} is here to provide swift, expert medical evaluation and treatment. No appointment is needed for our walk-in clinic.`,
      SPA: `${data.name} is a luxury medical aesthetic sanctuary combining clinical expertise with spa comfort. We offer premium skin resurfacing, injectables, and wellness therapies.`
    };

    await db.page.create({
      data: {
        slug: "home",
        title: `${data.name} - Home`,
        type: "HOME",
        locationId: location.id,
        content: JSON.stringify({
          heroTitle: data.name,
          heroSubtitle: heroSubtitleMap[data.templateType] || `Your Premium Health Partner in ${data.city}`,
          aboutSection: aboutSectionMap[data.templateType] || `Providing premium healthcare services for the ${data.city} community.`
        })
      }
    });

    // 5. Add initial analytics records for past week
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    for (const date of dates) {
      await db.analytics.create({
        data: {
          date,
          visitors: Math.floor(Math.random() * 40) + 10,
          leads: Math.floor(Math.random() * 5),
          bookings: Math.floor(Math.random() * 3),
          locationId: location.id
        }
      });
    }

    // 6. Create initial reviews
    const reviewers = ['Thomas Jenkins', 'Clara Vance', 'Avery Sterling'];
    const commentsMap: Record<string, string[]> = {
      DENTAL: [
        "Very patient team! They walked me through my implant procedure in detail.",
        "Beautiful clinic and friendly staff, dental cleaning was quick and painless.",
        "Excellent family dentist! My kids love going here."
      ],
      MEDICAL: [
        "Dr. is very professional, took his time to explain my lab results.",
        "Clean clinic, short wait times, and easy prescription pick-ups.",
        "Very professional staff, always accommodating with bookings."
      ],
      URGENT_CARE: [
        "In and out with a prescription in under 30 minutes! Life saver.",
        "Stitched up my sprained ankle. The NP was extremely comforting.",
        "Wait time was short and doctor was great with my screaming toddler."
      ],
      SPA: [
        "The Deluxe Hydrafacial was a dream! My skin is glowing.",
        "Very natural botox results, Dr. is incredibly skilled.",
        "Sleek and tranquil aesthetic, highly recommend their wellness packages."
      ]
    };

    const comments = commentsMap[data.templateType] || ["Excellent care!", "Friendly staff.", "Highly recommended!"];

    for (let i = 0; i < reviewers.length; i++) {
      await db.review.create({
        data: {
          patientName: reviewers[i],
          rating: 4 + (i % 2),
          content: comments[i] || "Fantastic service!",
          date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          replyContent: null,
          replyStatus: "NONE",
          locationId: location.id
        }
      });
    }

    revalidatePath('/admin');
    revalidatePath('/admin/locations');
    return { success: true, slug, locationId: location.id };
  } catch (error) {
    console.error("Error launching location:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to launch location");
  }
}

// ==========================================
// Provider Views incrementer
// ==========================================
export async function incrementProviderViews(providerId: string) {
  try {
    const updated = await db.provider.update({
      where: { id: providerId },
      data: {
        profileViews: {
          increment: 1
        }
      },
      include: {
        location: true
      }
    });
    
    // Revalidate related views
    revalidatePath('/admin');
    revalidatePath(`/clinic?id=${updated.locationId}`);
    revalidatePath(`/sites/${updated.location.slug}`);
    return updated;
  } catch (error) {
    console.error("Error incrementing provider views:", error);
    return null;
  }
}

// ==========================================
// Booking & Appointment Actions
// ==========================================
export async function getAppointments() {
  try {
    return await db.appointment.findMany({
      include: {
        location: true,
        service: true,
        provider: true
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function createAppointment(data: {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceId: string;
  providerId: string;
  locationId: string;
  notes?: string;
}) {
  try {
    const appointment = await db.appointment.create({
      data: {
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        status: "CONFIRMED",
        notes: data.notes,
        serviceId: data.serviceId,
        providerId: data.providerId,
        locationId: data.locationId
      },
      include: {
        location: true
      }
    });

    await db.lead.create({
      data: {
        name: data.patientName,
        email: data.patientEmail,
        phone: data.patientPhone,
        status: "APPOINTMENT",
        source: "BOOKING",
        notes: `Booked appointment for ${data.appointmentDate} at ${data.locationId}. Notes: ${data.notes || 'None'}`
      }
    });

    const today = new Date().toISOString().split('T')[0];
    const analytics = await db.analytics.findFirst({
      where: {
        locationId: data.locationId,
        date: today
      }
    });

    if (analytics) {
      await db.analytics.update({
        where: { id: analytics.id },
        data: {
          bookings: analytics.bookings + 1,
          visitors: analytics.visitors + 1
        }
      });
    } else {
      await db.analytics.create({
        data: {
          locationId: data.locationId,
          date: today,
          visitors: 1,
          leads: 0,
          bookings: 1
        }
      });
    }

    revalidatePath('/admin');
    revalidatePath('/admin/crm');
    revalidatePath(`/sites/${appointment.location.slug}`);
    return { success: true, appointmentId: appointment.id };
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Failed to schedule appointment");
  }
}

// ==========================================
// Lead & CRM Actions
// ==========================================
export async function getLeads() {
  try {
    return await db.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function createLead(data: {
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  notes?: string;
  locationId?: string;
}) {
  try {
    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        source: data.source,
        notes: data.notes
      }
    });

    if (data.locationId) {
      const today = new Date().toISOString().split('T')[0];
      const analytics = await db.analytics.findFirst({
        where: {
          locationId: data.locationId,
          date: today
        }
      });

      if (analytics) {
        await db.analytics.update({
          where: { id: analytics.id },
          data: {
            leads: analytics.leads + 1
          }
        });
      } else {
        await db.analytics.create({
          data: {
            locationId: data.locationId,
            date: today,
            visitors: 1,
            leads: 1,
            bookings: 0
          }
        });
      }
      const loc = await db.location.findUnique({ where: { id: data.locationId } });
      if (loc) revalidatePath(`/sites/${loc.slug}`);
    }

    revalidatePath('/admin');
    revalidatePath('/admin/crm');
    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error("Error creating CRM lead:", error);
    throw new Error("Failed to record lead");
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const lead = await db.lead.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/crm');
    return lead;
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw new Error("Failed to update lead status");
  }
}

// ==========================================
// Review & Reputation Actions
// ==========================================
export async function getReviews() {
  try {
    return await db.review.findMany({
      include: {
        location: true
      },
      orderBy: { date: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function submitReviewReply(id: string, replyContent: string) {
  try {
    const updated = await db.review.update({
      where: { id },
      data: {
        replyContent,
        replyStatus: 'SENT'
      }
    });
    revalidatePath('/admin/reviews');
    return updated;
  } catch (error) {
    console.error("Error submitting review reply:", error);
    throw new Error("Failed to submit reply");
  }
}

// ==========================================
// Global Services Actions
// ==========================================
export async function getGlobalServices() {
  try {
    return await db.service.findMany({
      where: { isGlobal: true }
    });
  } catch (error) {
    console.error("Error fetching global services:", error);
    return [];
  }
}

// ==========================================
// Region Management Actions
// ==========================================
export async function createRegion(data: { name: string; managerName?: string; managerEmail?: string }) {
  try {
    const org = await db.organization.findFirst();
    if (!org) throw new Error("No organization found");

    const newReg = await db.region.create({
      data: {
        name: data.name,
        managerName: data.managerName || null,
        managerEmail: data.managerEmail || null,
        organizationId: org.id
      }
    });
    revalidatePath('/admin');
    revalidatePath('/admin/locations');
    return { success: true, region: newReg };
  } catch (error) {
    console.error("Error creating region:", error);
    throw new Error("Failed to create region");
  }
}

export async function updateRegion(id: string, data: { name: string; managerName?: string; managerEmail?: string }) {
  try {
    const updated = await db.region.update({
      where: { id },
      data: {
        name: data.name,
        managerName: data.managerName || null,
        managerEmail: data.managerEmail || null
      }
    });
    revalidatePath('/admin');
    revalidatePath('/admin/locations');
    return { success: true, region: updated };
  } catch (error) {
    console.error("Error updating region:", error);
    throw new Error("Failed to update region");
  }
}

export async function deleteRegion(id: string) {
  try {
    await db.region.delete({
      where: { id }
    });
    revalidatePath('/admin');
    revalidatePath('/admin/locations');
    return { success: true };
  } catch (error) {
    console.error("Error deleting region:", error);
    throw new Error("Failed to delete region");
  }
}

// ==========================================
// Website Blocks Saving Actions
// ==========================================
export async function saveWebsiteBlocks(locationId: string, pageSlug: string, contentJson: string) {
  try {
    const page = await db.page.findUnique({
      where: {
        locationId_slug: {
          locationId,
          slug: pageSlug
        }
      }
    });

    let updatedPage;
    if (page) {
      updatedPage = await db.page.update({
        where: { id: page.id },
        data: { content: contentJson }
      });
    } else {
      updatedPage = await db.page.create({
        data: {
          slug: pageSlug,
          title: `Custom ${pageSlug.toUpperCase()}`,
          type: "CUSTOM",
          content: contentJson,
          locationId
        }
      });
    }

    const loc = await db.location.findUnique({
      where: { id: locationId }
    });
    
    if (loc) {
      revalidatePath(`/sites/${loc.slug}`);
    }
    revalidatePath(`/clinic?id=${locationId}`);
    return { success: true, page: updatedPage };
  } catch (error) {
    console.error("Error saving website blocks:", error);
    throw new Error("Failed to save website blocks configuration");
  }
}

// ==========================================
// AI Brand Compliance Actions
// ==========================================
export interface ComplianceAlert {
  id: string;
  locationId: string;
  clinicName: string;
  type: 'COMPLIANCE' | 'BRANDING' | 'CONTENT';
  message: string;
  severity: 'high' | 'medium' | 'low';
  targetTable: 'location' | 'provider' | 'page' | 'service';
  targetId: string;
  recommendedFix: string;
}

export async function runBrandComplianceScan() {
  try {
    const locations = await db.location.findMany({
      include: {
        providers: true,
        pages: true,
        services: {
          include: {
            service: true
          }
        }
      }
    });

    const org = await db.organization.findFirst();
    const approvedFontFamily = org?.fontFamily || 'Inter';

    const alerts: ComplianceAlert[] = [];

    // Seeding base compliance warnings matching custom layout config
    for (const loc of locations) {
      // 1. Check for unapproved medical claims in provider bios (FDA Compliance)
      for (const prov of loc.providers) {
        const bioLower = prov.bio.toLowerCase();
        if (bioLower.includes('cure') || bioLower.includes('guarantee') || bioLower.includes('insures') || bioLower.includes('eliminate')) {
          alerts.push({
            id: `claims-${prov.id}`,
            locationId: loc.id,
            clinicName: loc.name,
            type: 'COMPLIANCE',
            severity: 'high',
            message: `Outlawed claim verbs ('cure', 'guarantee') detected in practitioner bio for ${prov.name}.`,
            targetTable: 'provider',
            targetId: prov.id,
            recommendedFix: `Sanitize medical terminology to read 'facilitate healing' or 'support treatment of'.`
          });
        }
      }

      // 2. Check for missing disclaimers on Spa and Urgent Care homepages
      const homePage = loc.pages.find(p => p.slug === 'home');
      if (homePage) {
        let content: any = {};
        try {
          content = JSON.parse(homePage.content);
        } catch (_) {}

        const textToScan = `${content.aboutSection || ''} ${content.heroSubtitle || ''}`.toLowerCase();
        if (loc.templateType === 'SPA' || loc.templateType === 'URGENT_CARE') {
          if (!textToScan.includes('disclaimer') && !textToScan.includes('not evaluate') && !textToScan.includes('medical advice')) {
            alerts.push({
              id: `disclaimer-${homePage.id}`,
              locationId: loc.id,
              clinicName: loc.name,
              type: 'COMPLIANCE',
              severity: 'high',
              message: `FDA clinical disclaimer missing from homepage text.`,
              targetTable: 'page',
              targetId: homePage.id,
              recommendedFix: `Append regulatory text: 'Disclaimer: Treatment outcomes vary. Consult our medical staff for specific advice.'`
            });
          }
        }

        // 3. Check for Custom Block styling deviations (Branding checks)
        if (content.blocks) {
          const blocks = typeof content.blocks === 'string' ? JSON.parse(content.blocks) : content.blocks;
          let fontViolation = false;
          if (Array.isArray(blocks)) {
            blocks.forEach((b: any) => {
              if (b.styles?.fontFamily && b.styles.fontFamily.toLowerCase() === 'comic sans') {
                fontViolation = true;
              }
            });
          }
          if (fontViolation) {
            alerts.push({
              id: `font-${homePage.id}`,
              locationId: loc.id,
              clinicName: loc.name,
              type: 'BRANDING',
              severity: 'medium',
              message: `Unapproved typography styling 'Comic Sans' detected in local custom blocks.`,
              targetTable: 'page',
              targetId: homePage.id,
              recommendedFix: `Reset blocks styles configuration to match corporate approved typeface: '${approvedFontFamily}'.`
            });
          }
        }
      }

      // 4. Check contact integrity (Outdated credentials)
      for (const prov of loc.providers) {
        if (prov.name.includes('Lucas Milligan') && prov.title !== 'NP') {
          alerts.push({
            id: `credentials-${prov.id}`,
            locationId: loc.id,
            clinicName: loc.name,
            type: 'CONTENT',
            severity: 'low',
            message: `Mismatched title credentials listed for staff Practitioner ${prov.name}.`,
            targetTable: 'provider',
            targetId: prov.id,
            recommendedFix: `Update title credentials to NP and align clinical bio.`
          });
        }
      }

      // 5. Check if contact email is invalid or missing domain
      if (!loc.email.includes('@') || !loc.email.endsWith('.com')) {
        alerts.push({
          id: `email-${loc.id}`,
          locationId: loc.id,
          clinicName: loc.name,
          type: 'CONTENT',
          severity: 'medium',
          message: `Invalid/broken contact email address listing '${loc.email}'.`,
          targetTable: 'location',
          targetId: loc.id,
          recommendedFix: `Update clinic contact record with active location inbox address.`
        });
      }
    }

    return alerts;
  } catch (error) {
    console.error("Error running brand compliance scan:", error);
    return [];
  }
}

export async function resolveComplianceAlert(alertId: string, locationId: string, targetTable: string, targetId: string) {
  try {
    if (targetTable === 'provider') {
      const prov = await db.provider.findUnique({ where: { id: targetId } });
      if (prov) {
        let updatedBio = prov.bio;
        // Fix claims
        updatedBio = updatedBio.replace(/guarantees to cure/g, "supports the treatment of");
        updatedBio = updatedBio.replace(/cures/g, "manages");
        updatedBio = updatedBio.replace(/guarantee/g, "support");
        updatedBio = updatedBio.replace(/eliminate/g, "alleviate");
        
        let updatedTitle = prov.title;
        let updatedName = prov.name;
        if (prov.name.includes('Lucas Milligan')) {
          updatedTitle = 'NP';
          updatedName = prov.name.replace('Dr. ', '');
        }

        await db.provider.update({
          where: { id: targetId },
          data: { 
            bio: updatedBio,
            title: updatedTitle,
            name: updatedName
          }
        });
      }
    } 
    
    else if (targetTable === 'page') {
      const page = await db.page.findUnique({ where: { id: targetId } });
      if (page) {
        let content = JSON.parse(page.content);
        
        if (alertId.startsWith('disclaimer')) {
          const disclaimerText = " Disclaimer: Treatment outcomes vary. Consult our medical staff for specific advice.";
          if (!content.aboutSection.includes(disclaimerText)) {
            content.aboutSection = (content.aboutSection || "") + disclaimerText;
          }
        } 
        
        if (alertId.startsWith('font')) {
          if (content.blocks) {
            const blocks = typeof content.blocks === 'string' ? JSON.parse(content.blocks) : content.blocks;
            if (Array.isArray(blocks)) {
              blocks.forEach((b: any) => {
                if (b.styles?.fontFamily && b.styles.fontFamily.toLowerCase() === 'comic sans') {
                  b.styles.fontFamily = 'Inherit';
                }
              });
              content.blocks = blocks;
            }
          }
        }

        await db.page.update({
          where: { id: targetId },
          data: { content: JSON.stringify(content) }
        });
      }
    } 
    
    else if (targetTable === 'location') {
      const loc = await db.location.findUnique({ where: { id: targetId } });
      if (loc) {
        if (alertId.startsWith('email')) {
          const cleanEmail = loc.email.includes('@') 
            ? loc.email 
            : `${loc.slug}@caregrouphealth.com`;
          
          await db.location.update({
            where: { id: targetId },
            data: { email: cleanEmail.endsWith('.com') ? cleanEmail : `${cleanEmail}.com` }
          });
        }
      }
    }

    revalidatePath('/admin');
    revalidatePath('/admin/brand');
    const loc = await db.location.findUnique({ where: { id: locationId } });
    if (loc) revalidatePath(`/sites/${loc.slug}`);
    revalidatePath(`/clinic?id=${locationId}`);

    return { success: true };
  } catch (error) {
    console.error(`Error resolving compliance alert ${alertId}:`, error);
    throw new Error("Failed to resolve compliance alert");
  }
}
