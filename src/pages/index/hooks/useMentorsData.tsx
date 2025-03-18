
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
    
    // Add Airtable mentors' dates
    mentors.forEach(mentor => {
      if (mentor.date) dateSet.add(mentor.date);
    });
    
    return Array.from(dateSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [mentors]);

  // Get unique tags from all mentors
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    
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
