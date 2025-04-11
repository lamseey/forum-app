import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// refs
const user = ref(null);

// listen for auth changes outside of function, so only 1 listener is ever attached
const auth = getAuth();
onAuthStateChanged(auth, (_user) => {
  console.log('User state change. Current user is:', _user);
  user.value = _user;
});

const getUser = () => {
  return user;
};

export default getUser;
