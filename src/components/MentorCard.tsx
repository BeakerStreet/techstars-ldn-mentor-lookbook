
import { Link } from 'react-router-dom';
import { Mentor } from '../types/mentor';
import { Linkedin } from 'lucide-react';
import { useMemo } from 'react';

interface MentorCardProps {
  mentor: Mentor;
  index: number;
}

// Fun placeholder images for mentors without headshots
const placeholderImages = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&fit=crop", // robot
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&fit=crop", // cat
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&fit=crop", // deer
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&fit=crop", // kitten
];

const MentorCard: React.FC<MentorCardProps> = ({ mentor, index }) => {
  // Staggered animation delay based on index
  const animationDelay = `${index * 0.05}s`;

  // Generate a deterministic random placeholder based on the mentor's name
  const placeholderImage = useMemo(() => {
    if (mentor.headshot && mentor.headshot !== '/placeholder.svg') {
      return mentor.headshot;
    }
    
    // Use the mentor's name to generate a consistent index for the placeholder
    const nameSum = mentor.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const placeholderIndex = nameSum % placeholderImages.length;
    return placeholderImages[placeholderIndex];
  }, [mentor.name, mentor.headshot]);

  return (
    <Link 
      to={`/mentor/${mentor.slug}`}
      className="block"
    >
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
            src={placeholderImage} 
            alt={mentor.name} 
            className="mentor-image w-full h-full object-cover"
            loading="lazy"
          />
          {!mentor.headshot || mentor.headshot === '/placeholder.svg' ? (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              AI Generated
            </div>
          ) : null}
        </div>
        
        <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{mentor.name}</h3>
              {mentor.role && mentor.company && (
                <p className="text-sm text-white/90">{mentor.role} at {mentor.company}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.date && (
                  <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
                    {mentor.date}
                  </span>
                )}
                {mentor.expertise?.slice(0, 1).map((skill, index) => (
                  <span 
                    key={`expertise-${index}`}
                    className="text-xs px-2 py-0.5 bg-white/20 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {mentor.industries?.slice(0, 1).map((industry, index) => (
                  <span 
                    key={`industry-${index}`}
                    className="text-xs px-2 py-0.5 bg-white/20 rounded-full"
                  >
                    {industry}
                  </span>
                ))}
                {(mentor.expertise?.length > 1 || mentor.industries?.length > 1) && (
                  <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
                    +{(mentor.expertise?.length || 0) + (mentor.industries?.length || 0) - 2} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <a 
                href={mentor.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/20 hover:bg-techstars-phosphor hover:text-white rounded-full transition-colors duration-300"
                aria-label={`View ${mentor.name}'s LinkedIn profile`}
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={16} />
              </a>
              
              <div className="p-2 bg-white/20 hover:bg-white hover:text-black rounded-full transition-colors duration-300">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;
