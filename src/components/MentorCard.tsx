import { Link } from 'react-router-dom';
import { Mentor } from '../types/mentor';
import { Linkedin } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  index: number;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, index }) => {
  // Staggered animation delay based on index
  const animationDelay = `${index * 0.05}s`;

  return (
    <div 
      className="glass card-hover overflow-hidden relative rounded-xl border border-gray-100 shadow-sm"
      style={{ 
        animationDelay, 
        animation: 'scale-in 0.5s ease-out forwards',
        opacity: 1,
        transform: 'scale(1)',
        visibility: 'visible'
      }}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={mentor.headshot} 
          alt={mentor.name} 
          className="mentor-image w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{mentor.name}</h3>
            {mentor.role && mentor.company && (
              <p className="text-sm text-white/90">{mentor.role} at {mentor.company}</p>
            )}
            {mentor.expertise && mentor.expertise.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.expertise.slice(0, 2).map((skill, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-0.5 bg-white/20 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {mentor.expertise.length > 2 && (
                  <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
                    +{mentor.expertise.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <a 
              href={mentor.linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/20 hover:bg-techstars-phosphor hover:text-white rounded-full transition-colors duration-300"
              aria-label={`View ${mentor.name}'s LinkedIn profile`}
            >
              <Linkedin size={16} />
            </a>
            
            <Link
              to={`/mentor/${mentor.slug}`}
              className="p-2 bg-white/20 hover:bg-white hover:text-black rounded-full transition-colors duration-300"
              aria-label={`View ${mentor.name}'s profile`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-arrow-right"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
