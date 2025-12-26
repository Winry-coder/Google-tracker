/**
 * Lead Enrichment Service (Phase 4)
 * Handles automatic data gathering for new leads.
 */

export interface EnrichmentData {
  company?: string;
  jobTitle?: string;
  linkedinUrl?: string;
}

export async function enrichLeadData(
  email: string
): Promise<EnrichmentData | null> {
  const domain = email.split('@')[1];

  // Skip common public providers
  const publicProviders = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'aol.com',
    'mail.com',
  ];
  if (publicProviders.includes(domain.toLowerCase())) {
    return null;
  }

  try {
    // 1. Basic Domain Enrichment (Company Guessing)
    // Clean domain: "mail.google.com" -> "google", "app.lead-tracker.io" -> "lead-tracker"
    const domainParts = domain.split('.');
    let rawCompany = domainParts[domainParts.length - 2];

    // Handle cases like "co.uk" or "com.br"
    if (
      domainParts.length > 2 &&
      domainParts[domainParts.length - 1].length === 2 &&
      domainParts[domainParts.length - 2].length <= 3
    ) {
      rawCompany = domainParts[domainParts.length - 3];
    }

    const companyGuess = rawCompany
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // 2. Placeholder for future API integration
    const enriched: EnrichmentData = {
      company: companyGuess,
      jobTitle: 'Professional',
      linkedinUrl: `https://www.linkedin.com/company/${rawCompany}`,
    };

    return enriched;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Enrichment failed:', error);
    return null;
  }
}
