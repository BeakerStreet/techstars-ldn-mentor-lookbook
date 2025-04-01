import { useEffect, useState, useMemo } from 'react';
import { fetchFounders } from '../services/founderAirtableService';
import { Founder } from '../types/founder';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import FounderCard from '../components/FounderCard';
import FloatingFilterBar from '../components/FloatingFilterBar';

const Founders = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

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

  // Get unique companies for the filter
  const companies = useMemo(() => {
    const uniqueCompanies = new Set(founders.map(founder => founder.company).filter(Boolean));
    return Array.from(uniqueCompanies).sort();
  }, [founders]);

  // Filter founders by selected company
  const filteredFounders = useMemo(() => {
    if (!selectedCompany) return founders;
    return founders.filter(founder => founder.company === selectedCompany);
  }, [founders, selectedCompany]);

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 pb-48 pt-24">
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
          ) : (
            <>
              {filteredFounders.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFounders.map((founder) => (
                    <FounderCard key={founder.id} founder={founder} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-techstars-slate py-20">
                  No founders found for the selected company.
                </div>
              )}

              {companies.length > 0 && (
                <FloatingFilterBar
                  allTags={companies}
                  selectedTags={selectedCompany ? [selectedCompany] : []}
                  onTagToggle={(company) => setSelectedCompany(company === selectedCompany ? null : company)}
                  availableDates={[]}
                  selectedDate={null}
                  onDateSelect={() => {}}
                  onClearFilters={() => setSelectedCompany(null)}
                />
              )}
            </>
          )}
        </main>
        
        <BottomNav />
      </div>
    </AnimatedPageTransition>
  );
};

export default Founders; 