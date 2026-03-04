import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Medico {
    idPractitioner: string;
    nombre: string;
    especialidad: string;
    tokenFirma: string;
}

interface AuthContextType {
    medico: Medico | null;
    loginMedico: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [medico, setMedico] = useState<Medico | null>(null);

    const loginMedico = () => {
        setMedico({
            idPractitioner: "MED-999",
            nombre: "Dr. Zacamil",
            especialidad: "Medicina General",
            tokenFirma: "abc-123-xyz"
        });
    };

    const logout = () => {
        setMedico(null);
    };

    return (
        <AuthContext.Provider value={{ medico, loginMedico, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
