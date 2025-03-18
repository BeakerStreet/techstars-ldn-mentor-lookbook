import { useEffect, useState } from 'react';
import { fetchMentors, isAirtableConfigured } from '../services/airtableService';
import { Mentor } from '../types/mentor';
import MentorCard from '../components/MentorCard';
import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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

const Index = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const displayMentors = () => {
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
          mentors.map((mentor, index) => (
            <MentorCard key={mentor.id} mentor={mentor} index={index + 1} />
          ))
        )}
      </div>
    );
  };

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
          <div className="text-center mb-16 mt-8">
            <div className="inline-block px-3 py-1 text-xs rounded-full bg-techstars-phosphor/10 text-techstars-phosphor font-medium mb-3 animate-fade-in">
              Meet Our Network
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-down">
              Techstars London Mentors
            </h1>
            <p className="text-techstars-slate max-w-2xl mx-auto animate-slide-down" style={{ animationDelay: '0.1s' }}>
              Connect with our exceptional mentors who are ready to guide you through your entrepreneurial journey.
            </p>
            
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={loadMentors}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>
          </div>

          {displayMentors()}
        </main>
        
        <footer className="py-8 border-t border-gray-100 text-center text-sm text-techstars-slate">
          <div className="max-w-7xl mx-auto px-6">
            <p>© {new Date().getFullYear()} Techstars London. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AnimatedPageTransition>
  );
};

export default Index;
