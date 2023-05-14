"use strict";

//import Vue from 'vue';
import axios from 'axios';

export default {
  data() {
    return {
      posts: []
    }
  },
  async mounted() {
    axios.get('http://localhost:5000')
      .then(response => {
        this.posts = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
