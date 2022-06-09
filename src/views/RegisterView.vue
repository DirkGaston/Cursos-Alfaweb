<template>
  <div class="mt-10">
    <v-row justify="center">
      <v-col cols="8">
        <h1 class="text-left">Registro de Usuario</h1>
      </v-col>
    </v-row>

    <v-form v-model="valid" ref="formRegister">
      <v-row justify="center">
        <v-col cols="8">
          <v-text-field
            v-model="user.email"
            label="Email"
            :rules="emailRules"
            required
          >
          </v-text-field>
          <v-text-field
            v-model="user.password"
            label="Password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="show1 ? 'text' : 'password'"
            required
            counter
            maxlength="20"
            @click:append="show1 = !show1"
          >
          </v-text-field>

          <v-btn
            class="mr-5"
            color="success"
            :disabled="!valid"
            @click="registerUser"
            >Registrar</v-btn
          >
          <v-btn class="mr-5" color="error" @click="reset"
            >Limpiar Formulario</v-btn
          >
          <v-btn color="warning" @click="reset">Limpiar Validación</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default {
  data() {
    return {
      valid: false,
      user: {
        email: "",
        password: "",
      },
      show1: false,
      emailRules: [
        (v) => (v && !!v.trim()) || "Write something, not just spaces",
        (v) => !!v || "Please type email",
        (v) =>
          /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(v) || "Incorrect email format",
      ],
      passwordRules: [
        (v) => (v && !!v.trim()) || "Write something, not just spaces",
        (v) => !!v || "Please type password",
        (v) => (v && v.length > 5) || "More than 6 characters required",
        (v) => (v && v.length < 12) || "Less than 12 characters required",
      ],
    };
  },
  methods: {
    async registerUser() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.user.email,
          this.user.password
        );
        this.$router.push({ name: "login" });
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            alert("El correo ya está siendo utilizado");
            break;
        }
      }
    },
    reset() {
      this.$refs.formRegister.reset();
    },
  },
};
</script>
