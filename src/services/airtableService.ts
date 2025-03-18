
import { Mentor } from '../types/mentor';

// This token will be replaced by the user's actual token
const AIRTABLE_API_TOKEN = 'your_airtable_token_here';
const AIRTABLE_BASE_ID = 'your_base_id_here';
const MENTORS_TABLE_NAME = 'Mentors';

export async function fetchMentors(): Promise<Mentor[]> {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${MENTORS_TABLE_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch mentors from Airtable');
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
