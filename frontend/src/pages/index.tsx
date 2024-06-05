import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";

export default function Home() {
  const [tasks, setTasks] = useState<
    Array<{ id: number; title: string; status: string; created_at: string }>
  >([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  }
  const handleInputChangeSelect: ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  };

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
  return (
    <main className="container p-5">
      <style jsx>{`
        .form-control {
          color: white;
        }
        .form-control::placeholder {
          color: white;
        }
        .form-control:focus {
          color: white;
          border-color: transparent;
          box-shadow: none;
          caret-color: white;
        }
        .form-select {
          color: white;
        }
        .form-select:focus {
          color: white;
          border-color: transparent;
          box-shadow: none;
          caret-color: white;
        }
        .form-select option {
          background-color: #212529;
        }
      `}</style>
      <table className="table table-dark table-hover mx-auto ">
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
                  className="form-control bg-transparent border-0 outline-0 t"
                  disabled={editingTaskId !== task.id}
                  onClick={() => setEditingTaskId(task.id)}
                  onBlur={() => handleUpdateTask(task.id)}
                  name="title"
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <select
                  className="form-select bg-transparent border-0 outline-0 text-start p-0"
                  aria-label="Default select example"
                  name="status"
                  onChange={handleInputChangeSelect}
                  onSelect={() => handleUpdateTask(task.id)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Concluido">Concluido</option>
                </select>
              </td>
              <td>{formatDate(task.created_at)}</td>
              <td>
                <div className="text-center d-flex gap-2 flex-wrap align-items-center justify-content-center">
                  <button className="btn btn-success mx-1">
                    <i className="bi bi-plus-square"></i>
                  </button>
                  <button
                    onClick={() => setEditingTaskId(task.id)} // Definir editTaskId quando o botão de edição for clicado
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
