import { useEffect, useState } from 'react';
import { fetchFounders } from '../services/founderAirtableService';
import { Founder } from '../types/founder';
import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import FounderCard from '../components/FounderCard';

const Founders = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFounders = async () => {
      try {
        setLoading(true);
        const data = await fetchFounders();
        setFounders(data);
      } catch (err) {
        setError('Failed to load founders. Please try again later.');
        console.error('Error loading founders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFounders();
  }, []);

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 mt-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Techstars Founders</h1>
            <p className="text-techstars-slate text-lg max-w-2xl mx-auto">
              Meet the innovative founders building the future through Techstars London.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : founders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {founders.map((founder) => (
                <FounderCard key={founder.id} founder={founder} />
              ))}
            </div>
          ) : (
            <div className="text-center text-techstars-slate py-20">
              No founders found at the moment.
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

export default Founders; 