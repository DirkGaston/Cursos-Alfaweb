<template>
  <div class="mt-10">
    <v-row justify="center">
      <v-col cols="8">
        <h1 class="text-left">Login de Usuario</h1>
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
            @click="loginUser"
            >Iniciar</v-btn
          >
          <v-btn class="mr-5" color="error" @click="reset"
            >Limpiar Formulario</v-btn
          >
          <v-btn color="warning" @click="reset">Limpiar Validación</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{}"> </template>

          <v-card>
            <v-card-title> Error! </v-card-title>

            <v-card-text> Incorrect password, please try again </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-4" text @click="dialog = false">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";

export default {
  data() {
    return {
      valid: false,
      user: {
        email: "",
        password: "",
      },
      dialog: false,
      show1: false,
      emailRules: [
        (v) => (v && !!v.trim()) || "Write something, not just spaces",
        (v) => !!v || "Doesn't exist...",
        (v) =>
          /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(v) || "Incorrect email format",
      ],
      passwordRules: [
        (v) => !!v || "Doesn't exist...",
        (v) => (v && v.length > 5) || "More than 6 characters required",
        (v) => (v && v.length < 12) || "Less than 12 characters required",
      ],
    };
  },
  methods: {
    loginUser() {
      signInWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          this.$router.push({ name: "home" });
        })
        .catch((e) => {
          this.dialog = true;
        });
    },
    reset() {
      this.$refs.formRegister.reset();
    },
  },
};
</script>
