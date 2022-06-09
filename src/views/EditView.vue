<template>
  <v-app>
    <v-container fluid>
      <v-col cols="12"
        ><div class="d-flex justify-center align-center">
          <h1 class="display-3 mb-5">
            Editando el curso: {{ courseData.name }}
          </h1>
        </div>
        <v-form class="mt-10" ref="formAdd" v-model="valid">
          <v-col cols="12">
            <v-text-field
              label="Nombre"
              v-model="course.name"
              :rules="textRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="URL de la imágen del curso"
              v-model="course.src"
              :rules="textRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Cupos del curso"
              v-model.number="course.availability"
              type="number"
              min="0"
              :rules="textRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Inscritos en el curso"
              v-model.number="course.students"
              type="number"
              min="0"
              :rules="studentRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Duración del curso"
              v-model="course.duration"
              :rules="textRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Costo del curso"
              v-model.number="course.price"
              type="number"
              min="0"
              :rules="textRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Código del curso"
              v-model="course.code"
              :rules="textRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Descripción del curso"
              v-model="course.description"
              outlined
              :rules="textRules"
              required
            ></v-textarea>
            <v-switch v-model="course.completed" label="Terminado"></v-switch>
            <div class="d-flex justify-center align-center">
              <v-btn
                class="mr-4"
                color="success"
                :disabled="!valid"
                @click="updateCourse"
              >
                ACTUALIZAR
              </v-btn>

              <v-btn color="error" class="mr-4" @click="reset">
                LIMPIAR FORMULARIO
              </v-btn>

              <v-btn color="warning" class="mr-4" @click="resetValidation">
                LIMPIAR VALIDACIÓN
              </v-btn>
              <v-btn color="primary" @click="back"> REGRESAR </v-btn>
            </div>
          </v-col>
        </v-form>
      </v-col>
    </v-container>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Edit",
  data() {
    return {
      course: {
        name: "",
        price: "",
        duration: "",
        availability: "",
        students: "",
        completed: false,
        date: "",
        description: "",
        src: "",
        code: "",
      },
      textRules: [(v) => !!v || "Field is required"],
      studentRules: [
        (v) => !!v || "Field is required",
        (v) =>
          v <= this.course.availability ||
          "More students than available spaces",
      ],
      valid: false,
    };
  },

  methods: {
    ...mapActions(["update_course", "get_courses"]),
    updateCourse() {
      this.update_course({ ...this.course });
      this.course = {};
      this.back()
    },
    reset() {
      this.$refs.formAdd.reset();
    },
    resetValidation() {
      this.$refs.formAdd.resetValidation();
    },
    back() {
      this.$router.push({ name: "admin" });
    },
  },
  computed: {
    ...mapState(["courses"]),

    courseData() {
      const { courses } = this;
      const { id } = this.$route.params;
      this.course = courses.find((u) => u.id == id);
      return this.course;
    },
  },
  created() {
    this.get_courses();
  },
};
</script>
