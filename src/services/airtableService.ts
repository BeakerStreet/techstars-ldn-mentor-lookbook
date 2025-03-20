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
    
    // Add filter for Status field
    const filterByFormula = encodeURIComponent("Status='Booked - March 2025'");
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}?filterByFormula=${filterByFormula}`;
    
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

export async function submitMentorFeedback(
  mentorId: string,
  company: string,
  feedbackType: 'thumbsUp' | 'thumbsNeutral'
): Promise<boolean> {
  const { token, baseId, tableName } = getAirtableConfig();
  
  if (!token || !baseId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Clean up the tableName in case it contains any slashes or extra path segments
    const cleanTableName = tableName.split('/')[0].split('?')[0].trim();
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}/${mentorId}`;
    
    // Get current record data
    const getResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch mentor record: ${getResponse.status} ${getResponse.statusText}`,
        getResponse.status,
        errorDetails
      );
    }

    const record = await getResponse.json();
    console.log('Retrieved Airtable record:', record);
    
    // Match the exact field names as in Airtable
    // "Renn thumbs up", "Renn thumbs neutral", etc.
    const fieldName = `${company} thumbs ${feedbackType === 'thumbsUp' ? 'up' : 'neutral'}`;
    console.log('Using field name:', fieldName);
    
    // Get current value to toggle it
    const currentValue = record.fields[fieldName] === true;
    const newValue = !currentValue; // Toggle between true and false
    
    console.log(`Toggling field ${fieldName} from ${currentValue} to ${newValue}`);
    
    // Update the record with the toggled value
    const updateResponse = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          [fieldName]: newValue
        }
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      console.error('Airtable update error details:', errorDetails);
      
      throw new AirtableError(
        `Failed to update mentor record: ${updateResponse.status} ${updateResponse.statusText}`,
        updateResponse.status,
        errorDetails
      );
    }

    const updateData = await updateResponse.json();
    console.log('Update successful:', updateData);
    
    return newValue; // Return the new value so the component knows if it's checked or unchecked
  } catch (error) {
    console.error('Error in submitMentorFeedback:', error);
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to submit mentor feedback: Network error or invalid response');
  }
}
