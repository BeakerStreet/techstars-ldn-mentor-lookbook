
import { Mentor } from '../types/mentor';

export class ExaError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'ExaError';
  }
}

export async function generateMentorDescription(mentor: Mentor): Promise<string> {
  const apiKey = import.meta.env.VITE_EXA_API_KEY;
  
  if (!apiKey) {
    throw new ExaError('Exa API key not configured in environment variables');
  }

  try {
    // Log the API key (only during debugging)
    console.log('Making Exa API request with key:', apiKey.substring(0, 5) + '...');
    
    // Create a more detailed prompt for better results
    const prompt = `Create a concise, professional description for this mentor:
      Name: ${mentor.name}
      Role: ${mentor.role || 'N/A'}
      Company: ${mentor.company || 'N/A'}
      Bio: ${mentor.bio || 'N/A'}
      Expertise: ${mentor.expertise?.join(', ') || 'N/A'}
      Industries: ${mentor.industries?.join(', ') || 'N/A'}
      
      The description should highlight their background, expertise, and the value they can bring to startups.
      Keep it under 150 words and focus on their professional strengths.`;
    
    const response = await fetch('https://api.exa.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'exa-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, professional descriptions of mentors based on their background. Focus on their expertise, experience, and value they can bring to startups.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    console.log('Exa API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Exa API error response:', errorText);
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new ExaError(
        `Failed to generate description: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    console.log('Exa API response data:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new ExaError('Invalid response format from Exa API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateMentorDescription:', error);
    if (error instanceof ExaError) {
      throw error;
    }
    throw new ExaError('Failed to generate description: Network error or invalid response');
  }
}
