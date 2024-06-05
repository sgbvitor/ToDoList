import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import formatDate from "../utils/formatDate";

export default function Home() {
  const [tasks, setTasks] = useState<
    Array<{ id: number; title: string; status: string; created_at: string }>
  >([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
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

  return (
    <main className="container p-5">
      <table className="table table-dark w-75 mx-auto ">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th colSpan={2} scope="col">
              Created_at
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <th scope="row">{task.id}</th>
              <td>
                <input
                  placeholder={task.title}
                  type="text"
                  className="form-control bg-transparent border-0 outline-0"
                  disabled={editingTaskId !== task.id} // Enable input when editingTaskId matches task.id
                  onBlur={() => setEditingTaskId(null)} // Disable input when focus is lost
                />
              </td>
              <td>{task.status}</td>
              <td>{formatDate(task.created_at)}</td>
              <td>
                <div className="text-center d-flex gap-2 flex-wrap align-items-center justify-content-center">
                  <button className="btn btn-success mx-1">
                    <i className="bi bi-plus-square"></i>
                  </button>
                  <button
                    onClick={() => setEditingTaskId(task.id)} // Set editingTaskId when edit button is clicked
                    className="btn btn-warning mx-1"
                  >
                    <i className="bi bi-pencil-square"></i>
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
