<template>
  <div v-if="discussion" class="discussion-item">
    <button @click="DeleteDiscussion(discussion.id)"> Delete </button>
    <button @click="editing = !editing"> {{(editing) ? "Confirm" : "Edit" }} </button>
    <router-link v-if="inHome" :to="'/discussion/' + discussion.id"> View Details</router-link>
    <div v-if="editing">
      <div class="account">
        <img :src="discussion.authorPDP" alt="">
        <p>{{ discussion.authorName }}</p>
      </div>
      <input class="discussion-title" v-model="discussion.titre" placeholder="titre"><br>
      <input class="discussion-content" v-model="discussion.contenu" placeholder="contenu"><br>
      <p class="discussion-date"><strong>Date:</strong> {{ discussion.date.toDate().toLocaleString() }}</p>
      <div class="discussion-upvote">
        <strong>Upvotes:</strong> {{ discussion.upvoters.size }}
      </div>
      <div class="discussion-downvote">
        <strong>Upvotes:</strong> {{ discussion.downvote.size }}
      </div>
      <button @click = UpdateDiscussion(discussion.id)>Confirm</button>
    </div>
    <div v-else>
      <div class="account">
        <img :src="discussion.authorPDP" alt="">
        <p>{{ discussion.authorName }}</p>
      </div>
      <h2 class="discussion-title">{{ discussion.titre }}</h2>
      <p class="discussion-content">{{ discussion.contenu }}</p>
      <p class="discussion-date"><strong>Date:</strong> {{ discussion.date?.toDate?.()?.toLocaleString() || new Date(discussion.date).toLocaleString() }}</p>
      <p class="discussion-upvote"><strong>Upvotes:</strong> {{ discussion.upvote }}</p>
      <p class="discussion-downvote"><strong>Downvotes:</strong> {{ discussion.downvote }}</p>
      <ResponseList :discussionId="discussion.id" />
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue"

import { db } from "/src/firebase";
import {doc, deleteDoc, getDocs, collection, updateDoc, getDoc} from "firebase/firestore";
import ResponseList from "@/components/ResponseList.vue";
import { useRoute } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import getUser from "@/composables/getUser";


const emit = defineEmits(["discussionDeleted"]);

const user = inject('userDoc');


const props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});
onMounted(async () => {
  await fetchDiscussion();
});


const route = useRoute();
const inHome = ref(false);
if (route.path === "/") {
  inHome.value = true;
}

let editing = ref(false);

function DeleteDiscussion(id) {
  if (confirm("Are you sure you want to delete this discussion?")) {
    deleteDoc(doc(db, "discussions", id));
    deleteRecursive(id);
    emit("discussionDeleted", id);
  }
}

function UpdateDiscussion(id) {
  editing.value = false;
  const updatedDiscussion = {... props.discussion};
  updatedDiscussion.date = new Date();
  updateDoc(doc(db, "discussions", id), updatedDiscussion);
  fetchDiscussion();
}

async function deleteRecursive(id) {
  const query = await getDocs(collection(db, "responses"));
  for (let i = 0; i < query.docs.length; i++){
    if (query.docs[i].data().discussionId === id){
      await deleteDoc(doc(db, "responses", query.docs[i].id))
      await deleteRecursive(query.docs[i].id);
    }
  }
}

const discussion = ref({});

async function fetchDiscussion() {
  const mydoc = doc(db, "discussions", props.discussionId);
  const docSnap = await getDoc(mydoc);
  discussion.value = {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

</script>

<style scoped>
.discussion-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.discussion-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.discussion-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.discussion-content {
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
}

.discussion-date {
  font-size: 14px;
  color: #777;
}

.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  margin: 10px 0;
}

.account img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.account p {
  margin: 0;
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
}

</style>