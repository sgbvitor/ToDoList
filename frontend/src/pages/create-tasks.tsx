/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function createTasks() {
  const [newTask, setTasks] = useState<
    Array<{ title: string; status: string }>
  >([]);
  const router = useRouter();

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setTasks({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateNewTalento = () => {
    axios
      .post("http://localhost:3020/tasks", newTask)
      .then(() => {
        router.push("/talento");
      })
      .catch((error) => {
        console.error("Erro ao buscar detalhes da Categoria", error);
      });
  };
}
