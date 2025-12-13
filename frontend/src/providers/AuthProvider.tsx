import { axiosInstance } from '../lib/axios';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

type UpdateApiToken = string | null;

const updateApiToken = (token: UpdateApiToken) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) await checkAdminStatus();
      } catch (error: any) {
        updateApiToken(null);
        console.error(`Error in authProvider: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [getToken, checkAdminStatus]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthProvider;
