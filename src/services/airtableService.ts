import { Mentor } from '../types/mentor';

// Get tokens from localStorage or use placeholders
export const getAirtableConfig = () => {
  return {
    token: localStorage.getItem('airtable_token') || '',
    baseId: localStorage.getItem('airtable_base_id') || '',
    tableName: localStorage.getItem('airtable_table_name') || 'Mentors'
  };
};

export const isAirtableConfigured = () => {
  const { token, baseId } = getAirtableConfig();
  return !!token && !!baseId;
};

export async function fetchMentors(): Promise<Mentor[]> {
  const { token, baseId, tableName } = getAirtableConfig();
  
  if (!token || !baseId) {
    console.error('Airtable API credentials not configured');
    return [];
  }

  try {
    // Clean up the tableName in case it contains any slashes or extra path segments
    // Only use the base table name without any view IDs or additional paths
    const cleanTableName = tableName.split('/')[0].split('?')[0].trim();
    
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}`;
    console.log('Fetching from Airtable URL:', url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error response:', errorText);
      throw new Error(`Failed to fetch mentors: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Airtable data received:', data);
    
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
      slug: createSlug(record.fields.Name || 'mentor')
    }));
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }
}

export async function fetchMentorBySlug(slug: string): Promise<Mentor | null> {
  try {
    const mentors = await fetchMentors();
    return mentors.find(mentor => mentor.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching mentor by slug:', error);
    return null;
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
}
