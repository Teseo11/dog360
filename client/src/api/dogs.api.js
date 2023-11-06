import axios from "axios";

export const getDogsRequest = async () =>
  await axios.get("http://localhost:4000/dogs");

export const createDogRequest = async (dog) =>
  await axios.post("http://localhost:4000/dogs", dog);
