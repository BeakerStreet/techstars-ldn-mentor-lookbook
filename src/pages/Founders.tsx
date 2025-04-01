import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFounders } from '../services/founderAirtableService';
import { Founder } from '../types/founder';
import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import { Building2, MapPin, Users, Rocket } from 'lucide-react';

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
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
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
                <Link
                  key={founder.id}
                  to={`/founders/${founder.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={founder.headshot || '/placeholder.svg'}
                      alt={founder.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-techstars-phosphor transition-colors duration-300">
                      {founder.name}
                    </h2>
                    
                    {(founder.role || founder.company) && (
                      <p className="text-techstars-slate mb-4">
                        {founder.role && founder.company
                          ? `${founder.role} at ${founder.company}`
                          : founder.role || founder.company}
                      </p>
                    )}

                    <div className="space-y-2">
                      {founder.companyStage && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Rocket size={16} className="text-techstars-phosphor" />
                          <span>{founder.companyStage}</span>
                        </div>
                      )}
                      
                      {founder.teamSize && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-techstars-phosphor" />
                          <span>{founder.teamSize}</span>
                        </div>
                      )}
                      
                      {founder.fundingRound && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 size={16} className="text-techstars-phosphor" />
                          <span>{founder.fundingRound}</span>
                        </div>
                      )}
                      
                      {founder.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="text-techstars-phosphor" />
                          <span>{founder.location}</span>
                        </div>
                      )}
                    </div>

                    {founder.expertise && founder.expertise.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {founder.expertise.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            {skill}
                          </span>
                        ))}
                        {founder.expertise.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            +{founder.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
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