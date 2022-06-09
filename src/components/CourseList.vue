<template>
  <v-container fluid>
    <v-col cols="12">
      <h1 class="display-3 text-center mb-5">Lista de Cursos</h1>
    </v-col>
    <v-row wrap justify-space-around>
      <v-flex v-for="item in courses" :key="item.name">
        <v-card width="500px" class="mb-5 mt-5">
          <v-img contain height="300px" :src="item.src"> </v-img>

          <v-card-text class="font-weight-bold grey lighten-2">
            <h2 class="ml-7 mb-7 mt-5">{{ item.name }}</h2>
            <h4 class="ml-7 mb-5">Información</h4>
            <v-timeline align-top dense>
              <v-timeline-item color="purple" small>
                <v-row class>
                  <v-col class="font-weight-regular body-1" cols="5">
                    Costo:
                    <span class="font-weight-bold">
                      ${{ item.price.toLocaleString() }}</span
                    >
                    Duración: {{ item.duration }}
                  </v-col>
                </v-row>
              </v-timeline-item>
              <v-timeline-item color="green" small>
                <v-row class>
                  <v-col class="font-weight-regular body-1" cols="5">
                    Cupos:
                    <span class="font-weight-bold">
                      {{ item.availability }}</span
                    >
                    Completado: {{ getStatus(item.completed) }}
                  </v-col>
                </v-row>
              </v-timeline-item>
              <v-timeline-item color="purple" small>
                <v-row class>
                  <v-col class="font-weight-regular body-1" cols="5">
                    Fecha de Registro: {{ dateFormat(item.date, "MM-dd-yyyy") }}
                  </v-col>
                </v-row>
              </v-timeline-item>
              <v-timeline-item color="green" small>
                <v-row class>
                  <v-col class="font-weight-regular body-1" cols="10">
                    Descripción: <br />
                    {{ item.description }}
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    ...mapActions(["get_courses"]),
    getStatus(completed) {
      if (completed === true) return "Sí";
      else return "No";
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
  },
  computed: {
    ...mapState(["courses"]),
  },
  created() {
    this.get_courses();
  },
};
</script>

<style></style>
