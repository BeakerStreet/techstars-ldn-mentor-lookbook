
import { useMemo } from 'react';
import { Mentor } from '../../types/mentor';
import MentorCard from '../../components/MentorCard';

// Example mentor data - always shown regardless of Airtable status
const exampleMentor: Mentor = {
  id: 'example-mentor',
  name: 'Sarah Johnson',
  headshot: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
  linkedinUrl: 'https://linkedin.com',
  role: 'Chief Technology Officer',
  company: 'TechInnovate',
  bio: 'Sarah is a seasoned technology leader with over 15 years of experience in building and scaling startups. She specializes in AI, machine learning, and cloud infrastructure.',
  expertise: ['Artificial Intelligence', 'Cloud Architecture', 'Team Building', 'Fundraising'],
  email: 'example@techstars.com',
  slug: 'sarah-johnson'
};

interface MentorGridProps {
  mentors: Mentor[];
  loading: boolean;
  error: string | null;
  selectedTags: string[];
  selectedDate: string | null;
}

const MentorGrid = ({ mentors, loading, error, selectedTags, selectedDate }: MentorGridProps) => {
  // Filter mentors based on selected tags and date
  const filteredMentors = useMemo(() => {
    let filtered = mentors;

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(mentor => mentor.date === selectedDate);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(mentor => {
        const mentorTags = [
          ...(mentor.expertise || []),
          ...(mentor.industries || [])
        ];
        return selectedTags.every(tag => mentorTags.includes(tag));
      });
    }

    return filtered;
  }, [mentors, selectedTags, selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
      <div className="relative">
        <div className="absolute -top-3 -right-3 z-10">
          <span className="px-2 py-1 text-xs bg-techstars-phosphor text-white rounded-full">
            Example
          </span>
        </div>
        <MentorCard key={exampleMentor.id} mentor={exampleMentor} index={0} />
      </div>
      
      {error ? (
        <div className="col-span-full sm:col-span-3 flex items-center justify-center p-6 bg-red-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <p className="text-sm text-gray-600">Please check your Airtable configuration in the .env file</p>
          </div>
        </div>
      ) : mentors.length === 0 ? (
        <div className="col-span-full sm:col-span-3 flex items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-techstars-slate font-medium mb-2">No additional mentors found from Airtable</p>
            <p className="text-sm text-gray-600">Add mentors to your Airtable base to see them here</p>
          </div>
        </div>
      ) : (
        filteredMentors.map((mentor, index) => (
          <MentorCard key={mentor.id} mentor={mentor} index={index + 1} />
        ))
      )}
    </div>
  );
};

export default MentorGrid;
