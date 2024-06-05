import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

function CreateTasks() {
  const [newTask, setTasks] = useState<
    Array<{ title: string; status: string }>
  >([]);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
export default CreateTasks;
