<template>
  <v-app>
    <v-app-bar color="deep-purple" app dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title style="font-weight: 300">Cursos Alfaweb</v-toolbar-title>
      <v-spacer></v-spacer>
      <h5
        v-if="user !== null"
        class="mr-2"
        style="font-weight: 300; text-transform: uppercase"
      >
        {{ user.email }}
      </h5>
      <v-icon @click="cerrarSesion">mdi-logout</v-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item to="/" v-if="user">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/login" v-if="!user">
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>

          <v-list-item to="/register" v-if="!user">
            <v-list-item-icon>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Registro</v-list-item-title>
          </v-list-item>

          <v-list-item to="/admin" v-if="user">
            <v-list-item-icon>
              <v-icon>mdi-home-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Administración</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main style="padding: 67px 0px 0px">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

export default {
  name: "App",

  data: () => ({
    drawer: false,
    group: null,
    user: null,
    dialog: false,
  }),

  beforeCreate() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  },

  methods: {
    async cerrarSesion() {
      await signOut(auth);
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style></style>
