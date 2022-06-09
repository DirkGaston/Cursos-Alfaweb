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
      <v-card>
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
      <div
        class="mt-10 mb-3 pa-3 d-flex align-center"
        style="outline: 2px solid #a63eb8; border-radius: 5px; color: #a63eb8"
      >
        <v-icon class="me-5" style="color: #a63eb8">mdi-account-group</v-icon>
        <span
          >Cantidad total de alumnos permitidos:
          <strong>{{ totalAvailability }}</strong> alumnos</span
        >
      </div>
      <div
        class="mt-5 mb-3 pa-3 d-flex align-center"
        style="outline: 2px solid #3da1f1; border-radius: 5px; color: #3da1f1"
      >
        <v-icon class="me-5" style="color: #3da1f1"
          >mdi-account-multiple-check</v-icon
        >
        <span
          >Cantidad total de alumnos inscritos:
          <strong>{{ totalStudents }}</strong> alumnos</span
        >
      </div>
      <div
        class="mt-5 mb-3 pa-3 d-flex align-center"
        style="outline: 2px solid #f34c3f; border-radius: 5px; color: #f34c3f"
      >
        <v-icon class="me-5" style="color: #f34c3f">mdi-account-clock</v-icon>
        <span
          >Cantidad total de cupos restantes:
          <strong>{{ totalLeftover }}</strong> alumnos</span
        >
      </div>
      <div
        class="mt-5 mb-3 pa-3 d-flex align-center"
        style="outline: 2px solid #e8296a; border-radius: 5px; color: #e8296a"
      >
        <v-icon class="me-5" style="color: #e8296a">mdi-block-helper</v-icon>
        <span
          >Cantidad total de cursos terminados:
          <strong>{{ completedCoursesCount }}</strong> cursos</span
        >
      </div>
      <div
        class="mt-5 mb-3 pa-3 d-flex align-center"
        style="outline: 2px solid #7f5d50; border-radius: 5px; color: #7f5d50"
      >
        <v-icon class="me-5" style="color: #7f5d50">mdi-bell-ring</v-icon>
        <span
          >Cantidad total de cursos activos:
          <strong>{{ filteredUncompletedCourses.length }}</strong> cursos</span
        >
      </div>
      <div
        class="mt-5 mb-3 pa-3 d-flex align-center"
        style="outline: 2px solid #fd5f2d; border-radius: 5px; color: #fd5f2d"
      >
        <v-icon class="me-5" style="color: #fd5f2d">mdi-bell-ring</v-icon>
        <span
          >Cantidad total de cursos:
          <strong>{{ totalCourses }}</strong> alumnos</span
        >
      </div>
    </v-col>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

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
      console.log(this.idDelete);
      this.delete_course(this.idDelete);
      this.closeDelete();
    },
    triggerAdd() {
      this.dialog = true;
    },
    triggerDelete(id) {
      console.log(id);
      this.idDelete = id;
      this.dialogDelete = true;
    },
    triggerUpdate(id) {
      console.log(id);
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

    totalActive() {
      return;
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

<style>
#totalAvailabiliy {
  outline: 1px solid #a63eb8;
}
</style>
