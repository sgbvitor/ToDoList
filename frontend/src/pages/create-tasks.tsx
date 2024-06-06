/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const [newTask, setTasks] = useState<Array<{ title: string; status: string }>>(
  []
);
const router = useRouter();

function handleInputChangeCreate(e: React.ChangeEvent<HTMLInputElement>) {
  setTasks({ ...newTask, [e.target.name]: e.target.value });
}

function handleCreateNewTask() {
  axios
    .post("http://localhost:3020/tasks", newTask)
    .then(() => {
      router.asPath;
    })
    .catch((error) => {
      console.error("Erro ao buscar detalhes da Categoria", error);
    });
}
export { handleCreateNewTask, handleInputChangeCreate };
