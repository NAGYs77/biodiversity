import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react'; 
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import google from '../assets/google.png'; 
import apple from '../assets/apple.png'; 

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // AJOUT DE withCredentials: true
            // C'est indispensable pour que le navigateur accepte et renvoie le cookie JSESSIONID
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                login: formData.email, 
                password: formData.password
            }, {
                withCredentials: true 
            });

            if (response.status === 200) {
                const user = response.data;
                
                // Debug pour vérifier que le rôle arrive bien (ROLE_ADMIN ou ROLE_USER)
                console.log("Connexion réussie ! Rôle détecté :", user.role);
                
                // Stockage dans le localStorage pour gérer l'affichage conditionnel dans React
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userRole', user.role); 
                
                // Redirection vers la page principale
                navigate('/Species'); 
            }
        } catch (err: any) {
            console.error("Erreur de connexion:", err);
            if (err.response?.status === 401) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError("Erreur serveur. Vérifiez que le backend est lancé.");
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 min-h-screen">
            <form onSubmit={handleSubmit} className="bg-white px-10 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-5 border border-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-600 italic tracking-tight">BioDiversity</h1>
                    <p className="text-gray-400 mt-2 text-sm">Veuillez vous connecter</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-3 rounded-full border border-red-100 text-center animate-bounce">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Champ Email */}
                    <div className="relative group">
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-full focus:bg-white focus:border-green-400 transition-all outline-none text-sm text-black"
                            required
                        />
                    </div>

                    {/* Champ Mot de passe */}
                    <div className="relative group">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mot de passe"
                            className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-full focus:bg-white focus:border-green-400 transition-all outline-none text-sm text-black"
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
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-full transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
                >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>

                {/* Séparateur */}
                <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-medium">ou</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Boutons Sociaux */}
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-full hover:bg-gray-50 transition-all shadow-sm">
                        <img src={google} alt="Google" className="w-5 h-5 object-contain" />
                        <span className="text-sm font-semibold text-gray-700">Google</span>
                        <a href='http://'>
                        </a>
                        
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-full hover:bg-gray-50 transition-all shadow-sm">
                        <img src={apple} alt="Apple" className="w-5 h-5 object-contain" />
                        <span className="text-sm font-semibold text-gray-700">Apple</span>
                        <a href='http://'>
                        </a>
                    </button>
                </div>

                <p className="text-center text-gray-500 text-xs mt-4">
                    Pas encore de compte ?{' '}
                    <Link to="/Register" className="text-green-600 font-bold hover:underline">
                        Inscrivez-vous
                    </Link>
                </p>
            </form>
        </div>
    );
};
export default Login;