import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";

export default function Home() {
  const [tasks, setTasks] = useState<
    Array<{ id: number; title: string; status: string; created_at: string }>
  >([]);
  const [updatedTask, setUpdatedTask] = useState<
    Array<{ id: number; title: string; status: string }>
  >([]);
  const router = useRouter();

  function getTasks() {
    axios
      .get("http://localhost:3020/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar lista de cadastros", error);
      });
  }

  useEffect(() => {
    getTasks();
  }, []);

  function clickDelete(id: number) {
    if (
      window.confirm("Você tem certeza que deseja excluir a task " + id + "?")
    ) {
      axios
        .delete("http://localhost:3020/tasks/" + id)
        .then((response) => {
          if (response.status === 204) {
            getTasks();
          }
          router.reload();
        })
        .catch((error) => {
          console.error("Task não excluido", error);
        });
    }
  }
  function handleInputChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  }

  function handleUpdateTask(id: number) {
    if (updatedTask) {
      axios
        .patch(`http://localhost:3020/tasks/${id}`, updatedTask)
        .then(() => {
          router.asPath;
        })
        .catch((error) => {
          console.error("Erro ao buscar detalhes do destino", error);
        });
    }
  }
  console.log(updatedTask);
  return (
    <main className="container p-5">
      <table className="table table-bordered table-dark table-hover mx-auto align-middle">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col" colSpan={2}>
              Created_at
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <th scope="row">{task.id}</th>
              <td className="d-flex flex-direction-row flex-wrap">
                <textarea
                  placeholder={task.title}
                  className="form-control bg-transparent border-0 outline-0 p-0 flex-grow-1"
                  onBlur={() => handleUpdateTask(task.id)}
                  name="title"
                  onChange={handleInputChange}
                  minLength={1}
                ></textarea>
              </td>
              <td>
                <select
                  className="form-select bg-transparent border-0 outline-0 text-start p-0"
                  aria-label="Default select example"
                  name="status"
                  onChange={handleInputChange}
                  onBlur={() => {
                    const select = document.querySelector("form-select");
                    console.log(select);
                  }}
                >
                  <option>Pendente</option>
                  <option>Concluido</option>
                </select>
              </td>
              <td>{formatDate(task.created_at)}</td>
              <td>
                <div className="text-center d-flex gap-2 flex-wrap align-items-center justify-content-center">
                  <button className="btn btn-success mx-1">
                    <i className="bi bi-plus-square"></i>
                  </button>
                  <button
                    onClick={() => clickDelete(task.id)}
                    className="btn btn-danger mx-1"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
