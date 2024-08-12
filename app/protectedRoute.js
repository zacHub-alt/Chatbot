import { useRouter } from 'next/navigation'; // or 'next/router' for older versions
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const withAuth = (Component) => {
  const AuthHOC = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          console.log('No user, redirecting to /signin');
          router.push('/signin'); // Redirect to sign-in page if not authenticated
        } else {
          console.log('User authenticated, proceeding...');
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; // Show a loading state while checking authentication
    }

    return <Component {...props} />;
  };

  // Add a display name for the higher-order component
  AuthHOC.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthHOC;
};

export default withAuth;
