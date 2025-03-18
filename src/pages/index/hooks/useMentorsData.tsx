
import { useState, useEffect, useMemo } from 'react';
import { fetchMentors, isAirtableConfigured } from '../../../services/airtableService';
import { Mentor } from '../../../types/mentor';
import { toast } from 'sonner';

export const useMentorsData = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Example mentor for reference - used to derive constant values
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

  const loadMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAirtableConfigured()) {
        const data = await fetchMentors();
        setMentors(data);
      } else {
        setError('Airtable API credentials not configured in environment variables');
        toast.error('Missing Airtable API credentials in environment variables');
      }
    } catch (err) {
      setError('Failed to load mentors. Please check your environment variables and try again.');
      console.error('Error loading mentors:', err);
      toast.error('Failed to load mentors. Please check your environment variables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, []);

  // Get unique dates from all mentors
  const availableDates = useMemo(() => {
    const dateSet = new Set<string>();
    
    // Add example mentor's date if it exists
    if (exampleMentor.date) dateSet.add(exampleMentor.date);
    
    // Add Airtable mentors' dates
    mentors.forEach(mentor => {
      if (mentor.date) dateSet.add(mentor.date);
    });
    
    return Array.from(dateSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [mentors]);

  // Get unique tags from all mentors
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    
    // Add example mentor's tags
    exampleMentor.expertise?.forEach(tag => tagSet.add(tag));
    exampleMentor.industries?.forEach(tag => tagSet.add(tag));
    
    // Add Airtable mentors' tags
    mentors.forEach(mentor => {
      mentor.expertise?.forEach(tag => tagSet.add(tag));
      mentor.industries?.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  }, [mentors]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedDate(null);
  };

  return {
    mentors,
    loading,
    error,
    selectedTags,
    selectedDate,
    setSelectedDate,
    allTags,
    availableDates,
    handleTagToggle,
    handleClearFilters,
    loadMentors
  };
};
