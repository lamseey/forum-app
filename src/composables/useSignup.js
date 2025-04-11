import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const useSignup = () => {
  const email = ref('');
  const password = ref('');
  const error = ref(null);
  const router = useRouter();

  const register = async () => {
    error.value = null;
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      console.log('Registered successfully');
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      error.value = err.message;
    }
  };

  return { email, password, error, register };
};

export default useSignup;