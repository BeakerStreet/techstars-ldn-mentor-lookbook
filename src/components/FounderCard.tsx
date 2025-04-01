import { Link } from 'react-router-dom';
import { Founder } from '../types/founder';
import { Building2, MapPin, Users, Rocket } from 'lucide-react';

interface FounderCardProps {
  founder: Founder;
}

const FounderCard = ({ founder }: FounderCardProps) => {
  return (
    <Link
      to={`/founders/${founder.slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={founder.headshot || '/placeholder.svg'}
          alt={founder.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {founder.company && (
          <div className="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white px-4 py-2 text-sm font-medium">
            {founder.company}
          </div>
        )}
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
  );
};

export default FounderCard; 