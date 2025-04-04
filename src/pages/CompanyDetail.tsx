import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFounderBySlug } from '../services/founderAirtableService';
import { fetchCompanyBySlug } from '../services/companyAirtableService';
import { Founder } from '../types/founder';
import { Company } from '../types/company';
import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import { ArrowLeft, Linkedin, Mail, Phone, Globe } from 'lucide-react';

// Fun placeholder images for founders without headshots
const placeholderImages = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop", // robot
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&fit=crop", // cat
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&fit=crop", // deer
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&fit=crop", // kitten
];

// Maximum length for role display in title
const MAX_ROLE_LENGTH = 80;

const CompanyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanyAndFounders = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const companyData = await fetchCompanyBySlug(slug);
        setCompany(companyData);
        
        if (!companyData) {
          setError('Company not found');
          return;
        }

        // Parse founder names from the company's founders field
        const founderNames = companyData.founders
          .split(',')
          .map(name => name.trim())
          .filter(Boolean);

        // Fetch details for each founder
        const founderPromises = founderNames.map(async (name) => {
          const founderSlug = name.toLowerCase().replace(/\s+/g, '-');
          const founderData = await fetchFounderBySlug(founderSlug);
          return founderData;
        });

        const founderResults = await Promise.all(founderPromises);
        const validFounders = founderResults.filter((f): f is Founder => f !== null);
        setFounders(validFounders);

      } catch (err) {
        setError('Failed to load company details. Please try again later.');
        console.error('Error loading company:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyAndFounders();
  }, [slug]);
  
  // Generate a deterministic random placeholder based on the founder's name
  const getFounderImage = (founder: Founder) => {
    if (founder.headshot && founder.headshot !== '/placeholder.svg') {
      return founder.headshot;
    }
    
    // Use the founder's name to generate a consistent index for the placeholder
    const nameSum = founder.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const placeholderIndex = nameSum % placeholderImages.length;
    return placeholderImages[placeholderIndex];
  };

  // Format role and company with character limit
  const getFormattedRoleAndCompany = (founder: Founder) => {
    if (!founder.role && !founder.company) return '';
    
    const roleAndCompany = founder.role && founder.company 
      ? `${founder.role} at ${founder.company}`
      : founder.role || founder.company || '';
    
    if (roleAndCompany.length <= MAX_ROLE_LENGTH) {
      return roleAndCompany;
    }
    
    return `${roleAndCompany.substring(0, MAX_ROLE_LENGTH)}...`;
  };

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-5xl mx-auto px-6 md:px-12 pb-20 mt-24">
          <Link 
            to="/founders" 
            className="inline-flex items-center py-2 px-4 mb-8 text-sm hover:text-techstars-phosphor transition-colors duration-300"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to all companies
          </Link>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : company ? (
            <div className="space-y-12">
              {/* Company Header */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="overflow-hidden rounded-xl shadow-lg relative">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={`${company.company} logo`}
                        className="w-24 h-24 object-contain bg-gradient-to-br from-gray-50 to-gray-100 p-8"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                          const letterDiv = document.createElement('div');
                          letterDiv.className = 'text-8xl font-bold text-gray-400';
                          letterDiv.textContent = company.company.charAt(0);
                          target.parentElement?.appendChild(letterDiv);
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <span className="text-8xl font-bold text-gray-400">{company.company.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.company}</h1>
                    <p className="text-techstars-slate text-lg">{company.oneLiner}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {company.companyLinkedIn && (
                    <a
                      href={company.companyLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-techstars-slate hover:text-techstars-phosphor transition-colors"
                    >
                      <Linkedin size={20} />
                      <span>Company LinkedIn</span>
                    </a>
                  )}
                  {company.URL && (
                    <a
                      href={company.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-techstars-slate hover:text-techstars-phosphor transition-colors"
                    >
                      <Globe size={20} />
                      <span>Company Website</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Founders Section */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Founders</h2>
                {founders.map((founder, index) => (
                  <div key={founder.id} className="bg-white rounded-xl shadow-sm p-8">
                    <div className="grid md:grid-cols-[1fr,2fr] gap-8">
                      <div className="space-y-6">
                        <div className="overflow-hidden rounded-xl shadow-lg relative">
                          <img 
                            src={getFounderImage(founder)} 
                            alt={founder.name} 
                            className="w-full aspect-square object-cover"
                          />
                          {(!founder.headshot || founder.headshot === '/placeholder.svg') && (
                            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                              May Look Different
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-4">
                          {founder.phoneNumber && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                              <div className="p-2 bg-techstars-phosphor/10 rounded-md text-techstars-phosphor">
                                <Phone size={20} />
                              </div>
                              <span>{founder.phoneNumber}</span>
                            </div>
                          )}
                          <a 
                            href={founder.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                          >
                            <div className="p-2 bg-[#0077B5]/10 rounded-md text-[#0077B5]">
                              <Linkedin size={20} />
                            </div>
                            <span>LinkedIn Profile</span>
                          </a>
                          
                          {founder.email && (
                            <a 
                              href={`mailto:${founder.email}`}
                              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                            >
                              <div className="p-2 bg-techstars-phosphor/10 rounded-md text-techstars-phosphor">
                                <Mail size={20} />
                              </div>
                              <span>Email Directly</span>
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="inline-block px-3 py-1 text-xs rounded-full bg-techstars-phosphor/10 text-techstars-phosphor font-medium mb-2">
                            Techstars Founder
                          </div>
                          <h3 className="text-2xl font-bold mb-2">{founder.name}</h3>
                          {(founder.role || founder.company) && (
                            <p className="text-techstars-slate text-lg">
                              {getFormattedRoleAndCompany(founder)}
                            </p>
                          )}
                          {founder.lookbookBio && (
                            <p className="text-gray-700 mt-4 leading-relaxed">
                              {founder.lookbookBio}
                            </p>
                          )}
                        </div>
                        
                        {founder.bio && (
                          <div>
                            <h4 className="text-xl font-semibold mb-3">About the Founder</h4>
                            <p className="text-gray-700 leading-relaxed">{founder.bio}</p>
                          </div>
                        )}
                        
                        {founder.expertise && founder.expertise.length > 0 && (
                          <div>
                            <h4 className="text-xl font-semibold mb-3">Areas of Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                              {founder.expertise.map((skill, index) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {founder.industries && founder.industries.length > 0 && (
                          <div>
                            <h4 className="text-xl font-semibold mb-3">Industries of Interest</h4>
                            <div className="flex flex-wrap gap-2">
                              {founder.industries.map((industry, index) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                  {industry}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-techstars-slate py-20">Company not found</div>
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

export default CompanyDetail; 