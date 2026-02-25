import { useState, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { Link } from "react-router-dom";
import logoLemu from '../assets/lemu.png'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="bg-white transition-colors duration-300 ">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-20"> {/* Hauteur augmentée à h-20 pour laisser de la place au grand logo */}
          
          {/* 1. LOGO AGRANDI & ALIGNÉ */}
          <div className="flex-1 flex justify-start items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img 
                  src={logoLemu} 
                  alt="Logo Lemurianland" 
                
                  className="h-20 w-auto object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col ml-1">
                <span className="text-2xl font-extrabold tracking-tighter text-emerald-800 dark:text-emerald-400 leading-none">
                  Ylang&<span className="text-green-500 font-medium">Ylang</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold dark:text-gray-500">
                  Biodiversity Portal
                </span>
              </div>
            </Link>
          </div>

          {/* 2. BARRE DE RECHERCHE */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative w-full max-w-md group">
              <input
                type="text"
                placeholder="Rechercher une espèce..."
                className="bg-gray-100 dark:bg-slate-800 px-10 border-2 border-transparent rounded-full py-2.5 w-full 
                 focus:bg-white dark:focus:bg-slate-700 focus:border-green-400 focus:ring-4 focus:ring-green-500/20 
                 transition-all duration-300 outline-none text-sm shadow-sm dark:text-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3 
         group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors" />
            </div>
          </div>

          {/* 3. MENU & BOUTONS */}
          <div className="flex-1 hidden md:flex items-center justify-end space-x-6">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:ring-2 hover:ring-green-400 transition-all duration-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/Species" className="text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-semibold text-sm">Species</Link>
            <Link to="/Register" className="text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-semibold text-sm">Register</Link>
            <Link to="/Login" className="text-gray-700 dark:text-gray-200 hover:text-green-600 transition font-semibold text-sm">Login</Link>
            
            <Link 
              to="/Species?action=add" 
              className="bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition shadow-md text-sm font-bold active:scale-95"
            >
              + Publier
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-white text-2xl">
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;