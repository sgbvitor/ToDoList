import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import formatDate from "@/utils/formatDate";
import { Modal, Button, Form } from "react-bootstrap";
import setRange from "@/utils/setRange";

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

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
  return (
    <main className="container p-5">
      <table className="table table-bordered table-dark table-hover mx-auto align-middle">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Created_at</th>
            <th className="text-center" scope="col">
              <Button className="btn btn-success mx-1" onClick={handleShow}>
                <i className="bi bi-plus-square"></i>
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <th scope="row">{task.id}</th>
              <td className="d-flex flex-direction-row flex-wrap">
                <input
                  className="form-control bg-transparent border-0 outline-0 p-0 flex-grow-1 overflow-auto"
                  onBlur={() => handleUpdateTask(task.id)}
                  name="title"
                  onChange={handleInputChange}
                  minLength={1}
                  placeholder={task.title}
                  onClick={() => setRange}
                />
              </td>
              <td>
                <select
                  className="form-select bg-transparent border-0 outline-0 text-start p-0"
                  aria-label="Default select example"
                  name="status"
                  onChange={handleInputChange}
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-dark text-white border-bottom-0"
        >
          <Modal.Title>New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form className="bg-dark text-white">
            <Form.Group
              className="mb-3 bg-dark text-white"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                className="mb-3 bg-secondary text-white"
                as="textarea"
                rows={3}
                onChange={handleInputChangeCreate}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white border-top-0">
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
