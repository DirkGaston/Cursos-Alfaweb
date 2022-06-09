<template>
  <v-container fluid>
    <v-col cols="12">
      <div class="d-flex justify-center align-center">
        <h1 class="display-3 mb-5">Administración</h1>
        <v-btn color="primary ml-10 mb-3" @click="triggerAdd()"
          >AGREGAR CURSO</v-btn
        >
      </div>
    </v-col>
    <v-col cols="12">
      <v-card class="pb-6">
        <template>
          <v-data-table :headers="headers" :items="courses" class="elevation-1">
            <template v-slot:[`item.price`]="{ item }">
              <v-chip color="success" dark>
                ${{ item.price.toLocaleString() }}
              </v-chip>
            </template>
            <template v-slot:[`item.date`]="{ item }">
              <v-chip color="success" dark>
                {{ dateFormat(item.date, "MM-dd-yyyy") }}
              </v-chip>
            </template>
            <template v-slot:[`item.completed`]="{ item }">
              <v-chip :color="getColor(item.completed)" dark>
                {{ getStatus(item.completed) }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="triggerUpdate(item.id)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="triggerDelete(item.id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
          <template>
            <v-row justify="center">
              <v-dialog v-model="dialog" max-width="800px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Agregando Curso</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="formAdd" v-model="valid">
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
                        </v-col>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      class="mr-4"
                      color="success"
                      :disabled="!valid"
                      @click="addCourse"
                    >
                      AGREGAR
                    </v-btn>

                    <v-btn color="error" class="mr-4" @click="reset">
                      LIMPIAR FORMULARIO
                    </v-btn>

                    <v-btn color="warning" @click="resetValidation">
                      LIMPIAR VALIDACIÓN
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </template>
        </template>
      </v-card>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"
            >Are you sure you want to delete this item?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteCourse()">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <Computations
        icon="mdi-account-group"
        :comp="totalAvailability"
        text="Cantidad total de alumnos permitidos"
        outlineColor="#a63eb8"
        textColor="#a63eb8"
        iconColor="#a63eb8"
      />
      <Computations
        icon="mdi-account-multiple-check"
        :comp="totalStudents"
        text="Cantidad total de alumnos inscritos"
        outlineColor="#3da1f1"
        textColor="#3da1f1"
        iconColor="#3da1f1"
      />
      <Computations
        icon="mdi-account-clock"
        :comp="totalLeftover"
        text="Cantidad total de cupos restantes"
        outlineColor="#f34c3f"
        textColor="#f34c3f"
        iconColor="#f34c3f"
      />
      <Computations
        icon="mdi-block-helper"
        :comp="completedCoursesCount"
        text="Cantidad total de cursos terminados"
        outlineColor="#e8296a"
        textColor="#e8296a"
        iconColor="#e8296a"
      />
      <Computations
        icon="mdi-bell-ring"
        :comp="filteredUncompletedCourses.length"
        text="Cantidad total de cursos activos"
        outlineColor="#7f5d50"
        textColor="#7f5d50"
        iconColor="#7f5d50"
      />
      <Computations
        icon="mdi-bell-ring"
        :comp="totalCourses"
        text="Cantidad total de cursos"
        outlineColor="#fd5f2d"
        textColor="#fd5f2d"
        iconColor="#fd5f2d"
      />
    </v-col>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import Computations from "@/components/Computations.vue";

export default {
  data() {
    return {
      course: {
        name: "",
        price: "",
        duration: "",
        availability: "",
        students: "",
        completed: false,
        date: date,
        description: "",
        src: "",
        code: "",
      },
      headers: [
        {
          text: "Curso",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Cupos", value: "availability" },
        { text: "Inscritos", value: "students" },
        { text: "Duración", value: "duration" },
        { text: "Costo", value: "price" },
        { text: "Terminado", value: "completed" },
        { text: "Fecha", value: "date" },
        { text: "Acciones", value: "actions" },
      ],
      dialog: false,
      dialogDelete: false,
      valid: false,
      textRules: [(v) => !!v || "Field is required"],
      studentRules: [
        (v) => !!v || "Field is required",
        (v) =>
          v <= this.course.availability ||
          "More students than available spaces",
      ],
      idDelete: "",
      idEdit: "",
    };
  },
  components: {
    Computations,
  },
  methods: {
    ...mapActions([
      "add_course",
      "delete_course",
      "update_course",
      "get_courses",
    ]),
    addCourse() {
      this.add_course({ ...this.course });
      this.dialog = false;
    },
    deleteCourse() {
      this.delete_course(this.idDelete);
      this.closeDelete();
    },
    triggerAdd() {
      this.dialog = true;
    },
    triggerDelete(id) {
      this.idDelete = id;
      this.dialogDelete = true;
    },
    triggerUpdate(id) {
      this.idEdit = id;
      this.$router.push({ path: `/edit/${this.idEdit}` });
    },
    getColor(completed) {
      if (completed === true) return "blue";
      else return "grey";
    },
    getStatus(completed) {
      if (completed === true) return "Sí";
      else return "No";
    },

    reset() {
      this.$refs.formAdd.reset();
    },
    resetValidation() {
      this.$refs.formAdd.resetValidation();
    },
    dateFormat(inputDate, format) {
      const date = new Date(inputDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      format = format.replace("MM", month.toString().padStart(2, "0"));
      if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
      } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
      }
      format = format.replace("dd", day.toString().padStart(2, "0"));

      return format;
    },
    deleteItem() {
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
  },

  computed: {
    ...mapState(["courses"]),
    ...mapGetters(["completedCoursesCount"]),
    totalAvailability() {
      return this.courses.reduce(
        (acc, cur) => acc + Number(cur.availability),
        0
      );
    },
    totalStudents() {
      return this.courses.reduce((acc, cur) => acc + Number(cur.students), 0);
    },
    totalLeftover() {
      return this.totalAvailability - this.totalStudents;
    },
    totalCourses() {
      return this.courses.length;
    },
    filteredUncompletedCourses() {
      let uncompletedCourses = this.courses;

      uncompletedCourses = uncompletedCourses.filter((item) => {
        return item.completed === false;
      });

      return uncompletedCourses;
    },
    completedCoursesCount() {
      return this.$store.getters.completedCoursesCount;
    },
  },
  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.get_courses();
  },
};

let today = new Date();

let date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
</script>
