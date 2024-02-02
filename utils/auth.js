import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useProtectedRoute = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // Redirect to login page if user is not authenticated
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking session status:', error);
        // Redirect to login page in case of error
        router.push('/login');
      }
    };

    checkAuthentication();
  }, []);
};
