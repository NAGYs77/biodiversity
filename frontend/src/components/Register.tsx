import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react'; 
import { useNavigate } from 'react-router-dom'; // Pour rediriger après l'inscription
import axios from 'axios';
import google from '../assets/google.png'; 
import apple from '../assets/apple.png'; 

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // L'URL correspond à ton AuthController.java
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (response.status === 200) {
                alert("Compte créé avec succès !");
                navigate('/Login'); // Redirection vers la page de connexion
            }
        } catch (error: any) {
            console.error("Erreur d'inscription:", error);
            alert(error.response?.data || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white px-10 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-5 border border-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-600 italic tracking-tight">BioDiversity</h1>
                    <p className="text-gray-400 mt-2 text-sm">Veuillez vous inscrire</p>
                </div>

               
                <div className="relative group">
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                    <input
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nom et Prénom"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-full focus:bg-white focus:border-green-400 transition-all outline-none text-sm"
                        required
                    />
                </div>

                {/* Champ Email */}
                <div className="relative group">
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}                    
                        placeholder="Email"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-full focus:bg-white focus:border-green-400 transition-all outline-none text-sm"
                        required
                    />
                </div>

                {/* Séparateur visuel */}
                <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-medium">et</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Champ Mot de passe */}
                <div className="relative group">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mot de passe..."
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-full focus:bg-white focus:border-green-400 transition-all outline-none text-sm"
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-full transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
                >
                    {loading ? "Création du compte..." : "S'inscrire"}
                </button>

                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-full hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                        <img src={google} alt="Google" className="w-5 h-5 object-contain" />
                        <span className="text-sm font-semibold text-gray-700">Google</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-full hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                        <img src={apple} alt="Apple" className="w-5 h-5 object-contain" />
                        <span className="text-sm font-semibold text-gray-700">Apple</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;