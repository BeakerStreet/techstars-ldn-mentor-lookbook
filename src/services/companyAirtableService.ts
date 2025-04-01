import { Company } from '../types/company';

// Get configuration from environment variables
const getAirtableConfig = () => {
  return {
    token: import.meta.env.VITE_COMPANY_AIRTABLE_API_TOKEN || '',
    baseId: import.meta.env.VITE_COMPANY_AIRTABLE_BASE_ID || '',
    tableId: import.meta.env.VITE_COMPANY_AIRTABLE_TABLE_ID || ''
  };
};

class AirtableError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'AirtableError';
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
}

export const fetchCompanies = async (): Promise<Company[]> => {
  const { token, baseId, tableId } = getAirtableConfig();
  
  if (!token || !baseId || !tableId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?sort[0][field]=company&sort[0][direction]=asc`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch companies: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    return data.records.map((record: any) => ({
      id: record.id,
      company: record.fields.company || '',
      URL: record.fields.URL || '',
      companyLinkedIn: record.fields.companyLinkedIn || '',
      logo: record.fields.logo?.[0]?.url || '/placeholder.svg',
      oneLiner: record.fields.oneLiner || '',
      founders: record.fields.founders || '',
      slug: createSlug(record.fields.company || '')
    }));
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch companies: Network error or invalid response');
  }
};

export const fetchCompanyBySlug = async (slug: string): Promise<Company | null> => {
  const { token, baseId, tableId } = getAirtableConfig();
  
  if (!token || !baseId || !tableId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Convert slug back to company name format (capitalize first letter of each word)
    const companyName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const filterByFormula = encodeURIComponent(`company='${companyName}'`);
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filterByFormula}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch company: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    if (data.records.length === 0) {
      return null;
    }

    const record = data.records[0];
    return {
      id: record.id,
      company: record.fields.company || '',
      URL: record.fields.URL || '',
      companyLinkedIn: record.fields.companyLinkedIn || '',
      logo: record.fields.logo?.[0]?.url || '/placeholder.svg',
      oneLiner: record.fields.oneLiner || '',
      founders: record.fields.founders || '',
      slug: createSlug(record.fields.company || '')
    };
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch company by slug');
  }
}; 