import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SpeciesCard from './SpeciesCard';

// INTERFACE 
export interface SpeciesData {
  id?: number;
  commonName: string;
  scientificName: string;
  attachments?: string[];
}

export const getSpeciesColor = (name: string): string => {
  const colors = [
    'bg-red-50 text-red-600 border-red-200', 
    'bg-blue-50 text-blue-600 border-blue-200', 
    'bg-emerald-50 text-emerald-600 border-emerald-200', 
    'bg-amber-50 text-amber-600 border-amber-200', 
    'bg-purple-50 text-purple-600 border-purple-200', 
    'bg-pink-50 text-pink-600 border-pink-200'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Species: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdding = searchParams.get('action') === 'add';

  const [speciesList, setSpeciesList] = useState<SpeciesData[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesData | null>(null);
  

  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    
    const role = localStorage.getItem('userRole');
    setCurrentRole(role);
    fetchSpecies();
  }, []);

  const isAdmin = currentRole === 'ROLE_ADMIN';

  const fetchSpecies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/species', {
        withCredentials: true 
      });
      setSpeciesList(response.data);
    } catch (error) {
      console.error("Erreur backend:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    if (window.confirm("Voulez-vous vraiment supprimer cette recherche ?")) {
      try {
        await axios.delete(`http://localhost:8080/api/species/${id}`, {
          withCredentials: true
        });
        fetchSpecies(); 
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('commonName', commonName);
    formData.append('scientificName', scientificName);
    selectedFiles.forEach(f => formData.append('attachments', f));

    try {
      await axios.post('http://localhost:8080/api/species/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSearchParams({});
      fetchSpecies();
      setCommonName(""); setScientificName(""); setSelectedFiles([]);
      alert("Votre recherche a été publiée !");
    } catch (error) {
      alert("Erreur lors de l'envoi. Assurez-vous d'être connecté.");
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return '📝';
    if (fileName.endsWith('.pdf')) return '📕';
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) return '📊';
    if (fileName.endsWith('.ppt') || fileName.endsWith('.xls')) return '📊';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.xls')) return '📊';
    if (fileName.endsWith('.png') || fileName.endsWith('.xls')) return '📊';
    return '📄';
    
  };

  if (isAdding) {
    return (
      <div className="min-h-screen bg-white p-10 flex flex-col items-center text-black">
        <button 
          onClick={() => setSearchParams({})} 
          className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 self-start mb-10 transition font-bold shadow-md"
        >
          ← 
        </button>
        
        <div className="w-full max-w-2xl bg-gray-50 p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">Publier une recherche</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Session : <span className="font-bold">{isAdmin ? "ADMIN" : "USER"}</span></p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="Nom de l'espèce" 
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white" 
              required
            />
            <input 
              type="text" 
              placeholder="Nom scientifique" 
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white" 
              required
            />
            
            <div className="border-2 border-dashed border-green-200 rounded-2xl p-6 text-center bg-white hover:bg-green-50 transition cursor-pointer relative">
              <label className="cursor-pointer block text-gray-500 font-medium">
                Cliquez pour ajouter vos documents/photos
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
              </label>
              {selectedFiles.length > 0 && (
                <ul className="mt-3 text-sm text-green-600 text-left">
                  {selectedFiles.map((f, i) => <li key={i}>{getFileIcon(f.name)} {f.name}</li>)}
                </ul>
              )}
            </div>
            
            <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg text-lg">
              Publier maintenant
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-black">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Biodiversité Mondiale</h1>
        {/* AFFICHAGE DU RÔLE DYNAMIQUE */}
        <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          Mode {isAdmin ? "Administrateur" : "Consultation"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-6 ">
        {speciesList.map((s) => (
          <SpeciesCard 
            key={s.id} 
            species={s} 
            isAdmin={isAdmin} 
            onDelete={() => s.id && handleDelete(s.id)}
            onClick={() => setSelectedSpecies(s)} 
          />
        ))}
      </div>

      
      {selectedSpecies && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-green-800 leading-tight">{selectedSpecies.commonName}</h2>
            <p className="italic text-gray-400 mb-6">{selectedSpecies.scientificName}</p>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Documents consultables</h3>
              <ul className="space-y-3">
                {selectedSpecies.attachments && selectedSpecies.attachments.length > 0 ? (
                  selectedSpecies.attachments.map((file, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <span className="mr-2">{getFileIcon(file)}</span>
                      <a href={`http://localhost:8080/uploads/${file}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate font-medium">
                        {file}
                      </a>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm text-center">Aucun fichier joint.</p>
                )}
              </ul>
            </div>
            <button onClick={() => setSelectedSpecies(null)} className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors shadow-lg">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Species;