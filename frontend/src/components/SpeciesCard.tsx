import React from 'react';
import { type SpeciesData, getSpeciesColor } from './Species';

//  AJOUTE 'isAdmin' ICI 
interface SpeciesCardProps {
  species: SpeciesData;
  onClick?: () => void;
  onDelete?: (id: number) => void;
  isAdmin: boolean; 
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ species, onClick, onDelete, isAdmin }) => {
  const colorClasses = getSpeciesColor(species.commonName);
  
  // Construction de l'URL de l'image 
  const imageUrl = species.attachments && species.attachments.length > 0 
    ? `http://localhost:8080/uploads/${species.attachments[0]}`
    : null;

  return (
    <div 
      onClick={onClick}
      className={`relative group bg-white p-4 rounded-2xl border-2 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full ${colorClasses.split(' ')[2]}`}
    >
      
      {isAdmin && species.id && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete?.(species.id!);
          }}
          className="absolute -top-2 -right-2 bg-white text-red-500 border-2 border-red-100 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-20 shadow-sm"
          title="Supprimer"
        >
          ✕
        </button>
      )}

      <div className="h-28 w-full bg-gray-100 rounded-xl mb-3 overflow-hidden flex items-center justify-center text-2xl">
        {imageUrl ? (
          <img src={imageUrl} alt={species.commonName} className="w-full h-full object-cover" />
        ) : (
          "🌿"
        )}
      </div>

      <h2 className="text-lg font-bold text-gray-800 leading-tight truncate">{species.commonName}</h2>
      <p className="text-xs text-gray-400 italic mb-2 truncate">{species.scientificName}</p>
      
     
    </div>
  );
};

export default SpeciesCard;