
import { useEffect, useState } from 'react';
import { fetchMentors } from '../services/airtableService';
import { Mentor } from '../types/mentor';
import MentorCard from '../components/MentorCard';
import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';

const Index = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        const data = await fetchMentors();
        setMentors(data);
      } catch (err) {
        setError('Failed to load mentors. Please try again later.');
        console.error('Error loading mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, []);

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
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : mentors.length === 0 ? (
            <div className="text-center text-techstars-slate">No mentors found. Please check back later.</div>
          ) : (
            <div className="mentor-grid">
              {mentors.map((mentor, index) => (
                <MentorCard key={mentor.id} mentor={mentor} index={index} />
              ))}
            </div>
          )}
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
