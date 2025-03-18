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
    const response = await fetch('https://api.exa.ai/v1/chat/completions', {
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
            content: `Create a concise description for this mentor:
              Name: ${mentor.name}
              Role: ${mentor.role || 'N/A'}
              Company: ${mentor.company || 'N/A'}
              Bio: ${mentor.bio || 'N/A'}
              Expertise: ${mentor.expertise?.join(', ') || 'N/A'}
              Industries: ${mentor.industries?.join(', ') || 'N/A'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
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
    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof ExaError) {
      throw error;
    }
    throw new ExaError('Failed to generate description: Network error or invalid response');
  }
} 