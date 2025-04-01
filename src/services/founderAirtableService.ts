import { Founder } from '../types/founder';

// Get configuration from environment variables
export const getFounderAirtableConfig = () => {
  return {
    token: import.meta.env.VITE_FOUNDER_AIRTABLE_API_TOKEN || '',
    baseId: import.meta.env.VITE_FOUNDER_AIRTABLE_BASE_ID || '',
    tableId: import.meta.env.VITE_FOUNDER_AIRTABLE_TABLE_ID || 'tbl0QMMe09tybCQ0K'  // Fallback to the known ID
  };
};

export const isFounderAirtableConfigured = () => {
  const { token, baseId } = getFounderAirtableConfig();
  return !!token && !!baseId;
};

class AirtableError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'AirtableError';
  }
}

export async function fetchFounders(): Promise<Founder[]> {
  const { token, baseId, tableId } = getFounderAirtableConfig();
  
  console.log('Founder Airtable Config:', {
    hasToken: !!token,
    baseId,
    tableId
  });
  
  if (!token || !baseId) {
    throw new AirtableError('Founder Airtable API credentials not configured in environment variables');
  }

  try {
    const filterByFormula = encodeURIComponent("lookbookInclude='TRUE'");
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filterByFormula}&_=${Date.now()}`;
    
    console.log('Fetching founders from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url,
        headers: Object.fromEntries(response.headers.entries()),
        errorText
      });
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch founders: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    console.log('Airtable Response:', {
      recordCount: data.records?.length || 0,
      firstRecord: data.records?.[0]?.fields ? {
        name: data.records[0].fields.Name,
        hasHeadshot: !!data.records[0].fields.Headshot,
        title: data.records[0].fields.Title,
        company: data.records[0].fields['Company Name']
      } : null
    });
    
    return data.records.map((record: any) => {
      const founder = {
        id: record.id,
        name: record.fields.Name || 'Unknown',
        headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
        linkedinUrl: record.fields.LinkedIn || '#',
        role: record.fields.Title || '',
        company: record.fields['Company Name'] || '',
        bio: record.fields.Bio || '',
        expertise: record.fields.Expertise || [],
        email: record.fields.Email || '',
        phoneNumber: record.fields['Cell Phone Number'] || '',
        slug: createSlug(record.fields.Name || 'founder'),
        industries: record.fields['Industries of Interest'] || [],
        date: record.fields.Date || '',
        lookbookLabel: record.fields.lookbookLabel || '',
        lookbookTag: Array.isArray(record.fields.lookbookTag) ? 
          record.fields.lookbookTag.filter((tag: string) => tag === 'Investor' || tag === 'Operator') : 
          undefined,
        // Founder-specific fields
        companyStage: record.fields['Company Stage'] || '',
        companyDescription: record.fields['Company Description'] || '',
        fundingRound: record.fields['Funding Round'] || '',
        teamSize: record.fields['Team Size'] || '',
        location: record.fields.Location || ''
      };
      
      return founder;
    });
  } catch (error) {
    console.error('Error in fetchFounders:', error);
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch founders: Network error or invalid response');
  }
}

export async function fetchFounderBySlug(slug: string): Promise<Founder | null> {
  const { token, baseId, tableId } = getFounderAirtableConfig();
  
  console.log('Fetching founder by slug:', {
    slug,
    hasToken: !!token,
    baseId,
    tableId
  });
  
  if (!token || !baseId) {
    throw new AirtableError('Founder Airtable API credentials not configured in environment variables');
  }

  try {
    const filterByFormula = encodeURIComponent(
      `AND(lookbookInclude='TRUE', Name='${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}')`
    );
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filterByFormula}&_=${Date.now()}`;
    
    console.log('Fetching founder from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url,
        headers: Object.fromEntries(response.headers.entries()),
        errorText
      });
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch founder: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    console.log('Airtable Response:', {
      recordCount: data.records?.length || 0,
      foundRecord: data.records?.[0]?.fields ? {
        name: data.records[0].fields.Name,
        hasHeadshot: !!data.records[0].fields.Headshot,
        title: data.records[0].fields.Title,
        company: data.records[0].fields['Company Name']
      } : null
    });
    
    if (data.records.length === 0) {
      console.log('No founder found for slug:', slug);
      return null;
    }

    const record = data.records[0];
    return {
      id: record.id,
      name: record.fields.Name || 'Unknown',
      headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
      linkedinUrl: record.fields.LinkedIn || '#',
      role: record.fields.Title || '',
      company: record.fields['Company Name'] || '',
      bio: record.fields.Bio || '',
      expertise: record.fields.Expertise || [],
      email: record.fields.Email || '',
      phoneNumber: record.fields['Cell Phone Number'] || '',
      slug: createSlug(record.fields.Name || 'founder'),
      industries: record.fields['Industries of Interest'] || [],
      date: record.fields.Date || '',
      lookbookLabel: record.fields.lookbookLabel || '',
      lookbookTag: Array.isArray(record.fields.lookbookTag) ? 
        record.fields.lookbookTag.filter((tag: string) => tag === 'Investor' || tag === 'Operator') : 
        undefined,
      // Founder-specific fields
      companyStage: record.fields['Company Stage'] || '',
      companyDescription: record.fields['Company Description'] || '',
      fundingRound: record.fields['Funding Round'] || '',
      teamSize: record.fields['Team Size'] || '',
      location: record.fields.Location || ''
    };
  } catch (error) {
    console.error('Error in fetchFounderBySlug:', error);
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch founder by slug');
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
} 