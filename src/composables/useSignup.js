import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const useSignup = () => {
  const email = ref('');
  const password = ref('');
  const username = ref(''); // Add username as a new reactive reference
  const error = ref(null);
  const router = useRouter();

  const register = async () => {
    error.value = null;
    try {
      const auth = getAuth();
      // Register the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;

      // Update the user profile with the username
      await updateProfile(user, {
        displayName: username.value, // Set the username as the displayName
      });

      console.log('Registered successfully');
      router.push('/'); // Redirect after successful registration
    } catch (err) {
      console.error('Registration error:', err);
      error.value = err.message;
    }
  };

  return { email, password, username, error, register };
};

export default useSignup;