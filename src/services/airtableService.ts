import { Mentor } from '../types/mentor';

// Get configuration from environment variables
export const getAirtableConfig = () => {
  return {
    token: import.meta.env.VITE_AIRTABLE_API_TOKEN || '',
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
    tableName: import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Mentors'
  };
};

export const isAirtableConfigured = () => {
  const { token, baseId } = getAirtableConfig();
  return !!token && !!baseId;
};

class AirtableError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'AirtableError';
  }
}

export async function fetchMentors(): Promise<Mentor[]> {
  const { token, baseId, tableName } = getAirtableConfig();
  
  if (!token || !baseId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Clean up the tableName in case it contains any slashes or extra path segments
    const cleanTableName = tableName.split('/')[0].split('?')[0].trim();
    
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
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
        `Failed to fetch mentors: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    return data.records.map((record: any) => ({
      id: record.id,
      name: record.fields.Name || 'Unknown',
      headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
      linkedinUrl: record.fields.LinkedIn || '#',
      role: record.fields.Role || '',
      company: record.fields.Company || '',
      bio: record.fields.Bio || '',
      expertise: record.fields.Expertise || [],
      email: record.fields.Email || '',
      slug: createSlug(record.fields.Name || 'mentor'),
      industries: record.fields['Industries of Interest'] || [],
      date: record.fields.Date || ''
    }));
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch mentors: Network error or invalid response');
  }
}

export async function fetchMentorBySlug(slug: string): Promise<Mentor | null> {
  try {
    const mentors = await fetchMentors();
    return mentors.find(mentor => mentor.slug === slug) || null;
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch mentor by slug');
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
}
