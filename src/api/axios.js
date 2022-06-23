import axios from "axios";

export default axios.create({
  baseURL: "https://compact-note.herokuapp.com/note-app",
});
