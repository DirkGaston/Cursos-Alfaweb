import Vue from "vue";
import Vuex from "vuex";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    courses: [],
  },
  getters: {
    completedCourses(state) {
      return state.courses.filter((course) => course.completed);
    },
    completedCoursesCount(state, getters) {
      return getters.completedCourses.length;
    },
  },
  mutations: {
    GET_COURSES(state, payload) {
      state.courses = payload;
    },
  },
  actions: {
    async get_courses({ commit }) {
      try {
        const q = query(collection(db, "courses"));
        onSnapshot(q, (querySnapshot) => {
          const courses = [];
          querySnapshot.forEach((doc) => {
            courses.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          commit("GET_COURSES", courses);
        });
      } catch (error) {}
    },

    async add_course({ commit }, course) {
      try {
        await addDoc(collection(db, "courses"), {
          name: course.name,
          price: course.price,
          duration: course.duration,
          availability: course.availability,
          completed: course.completed,
          date: course.date,
          description: course.description,
          src: course.src,
          code: course.code,
          students: course.students,
        });
      } catch (error) {}
    },
    async delete_course({ commit }, id) {
      try {
        const docRef = doc(db, "courses", id);
        await deleteDoc(docRef);
      } catch (error) {}
    },
    async update_course({ commit }, course) {
      try {
        const docRef = doc(db, "courses", course.id);
        await updateDoc(docRef, {
          name: course.name,
          price: course.price,
          duration: course.duration,
          availability: course.availability,
          completed: course.completed,
          date: course.date,
          description: course.description,
          src: course.src,
          code: course.code,
          students: course.students,
        });
      } catch (error) {}
    },
  },
  modules: {},
});
