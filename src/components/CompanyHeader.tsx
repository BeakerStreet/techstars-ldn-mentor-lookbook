import { Company } from '../types/company';
import { Linkedin, Globe } from 'lucide-react';

interface CompanyHeaderProps {
  company: Company;
}

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  return (
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
  );
};

export default CompanyHeader; 