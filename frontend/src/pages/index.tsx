import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";
import { Modal, Button, Form } from "react-bootstrap";

export default function Home() {
  const [newTask, setNewTask] = useState<{ title: string; status: string }>({
    title: "",
    status: "pendente",
  });
  const [tasks, setTasks] = useState<
    Array<{ id: number; title: string; status: string; created_at: string }>
  >([]);
  const [updatedTask, setUpdatedTask] = useState<
    Array<{ id: number; title: string; status: string }>
  >([]);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleInputChangeCreate(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  }

  async function handleCreateNewTask() {
    await axios
      .post("http://localhost:3020/tasks", newTask)
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error("Error creating new task", error);
      });
  }

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
        .delete(`http://localhost:3020/tasks/${id}`)
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

  function handleInputChange(e: ChangeEvent<HTMLParagraphElement>) {
    setUpdatedTask({
      ...updatedTask,
      [e.target.title]: e.target.textContent,
    });
  }

  function handleInputChangeSelect(e: ChangeEvent<HTMLSelectElement>) {
    setUpdatedTask({
      ...updatedTask,
      [e.target.name]: e.target.value,
    });
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
  return (
    <main className="p-5">
      <table className="table table-bordered table-dark table-hover mx-auto align-middle">
        <thead className="align-middle">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Created_at</th>
            <th
              className="text-center d-flex align-items-center justify-content-center"
              scope="col"
            >
              <Button
                className="btn bg-transparent border-0 outline-0 shadow-none d-flex flex-column align-items-center justify-content-center"
                onClick={handleShow}
              >
                <i className="bi bi-plus-circle-fill text-success fs-3"></i>
                <span className="text-success">New</span>
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <th scope="row">{task.id}</th>
              <td>
                <p
                  title="title"
                  contentEditable
                  onChange={() => handleInputChange}
                  onBlur={() => handleUpdateTask(task.id)}
                  className="text-white bg-transparent border-0 outline-0 p-0 flex-grow-1 overflow-auto"
                >
                  {task.title}
                </p>
              </td>
              <td>
                <select
                  className="form-select bg-transparent border-0 outline-0 p-0 flex-grow-1 overflow-auto"
                  aria-label="Default select example"
                  name="status"
                  onChange={handleInputChangeSelect}
                  defaultValue={task.status}
                  onClick={() => handleUpdateTask(task.id)}
                >
                  <option>Pendente</option>
                  <option>Concluido</option>
                </select>
              </td>
              <td>{formatDate(task.created_at)}</td>
              <td>
                <div className="text-center d-flex gap-2 flex-wrap align-items-center justify-content-center">
                  <button
                    onClick={() => clickDelete(task.id)}
                    className="btn text-danger bg-transparent border-0 outline-0 shadow-none mx-1"
                  >
                    <i className="bi bi-trash3 fs-3" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-dark text-light border-0">
          <Modal.Title>New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                className="bg-black text-light"
                name="title"
                as="textarea"
                rows={1}
                onChange={handleInputChangeCreate}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateNewTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
