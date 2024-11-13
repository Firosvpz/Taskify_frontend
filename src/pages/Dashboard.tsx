import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  InputGroup,
  Modal,
  ListGroup,
} from "react-bootstrap";
import {
  getTasks,
  createTasks,
  updateTasks,
  deleteTasks,
  completeTasks,
  searchTask
} from "../api/taskApi";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaCheck,
  FaSignOutAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/slice/authSlice";
import { disconnectSocket, getSocket, initSocket } from "../api/socket";

interface ITask {
  _id: string;
  title: string;
  status: "pending" | "completed";
}

const StyledContainer = styled(Container)`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 1rem;
`;

const StyledCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 2rem;
  color: white;
`;

const StyledTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled(Form)`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-top: -1rem;
  position: relative;
  z-index: 1;
`;

const StyledInputGroup = styled(InputGroup)`
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const StyledButton = styled(Button)`
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const TaskList = styled(ListGroup)`
  margin-top: 2rem;
`;

const TaskItem = styled(ListGroup.Item)`
  border: none;
  background-color: white;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StyledBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 0.5em 0.8em;
  border-radius: 20px;
`;

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 15px;
    border: none;
  }

  .modal-header {
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .modal-footer {
    border-top: none;
  }
`;

const ChartCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: none;
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const LogoutButton = styled(Button)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ITask>({ mode: "onChange" });

  useEffect(() => {
    const token = localStorage.getItem('userToken')as string
    initSocket(token);
    const socket = getSocket();

    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('parsedUser',parsedUser);
      
      socket.emit('join', parsedUser.id);
  }

    socket.on("taskCreated", (newTask: ITask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on("taskUpdated", (updatedTask: ITask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
      );
    });

    socket.on("taskDeleted", (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    socket.on("taskCompleted", (completedTask: ITask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === completedTask._id ? completedTask : task,
        ),
      );
    });

    fetchTasks();

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("taskCompleted");
      disconnectSocket();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to fetch tasks. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchTasks(); // Load all tasks if the search query is empty
      return;
    }

    try {
      const searchResults = await searchTask(search);
      setTasks(searchResults.tasks);
    } catch (error) {
      console.error("Error searching tasks:", error);
      toast.error("Failed to search tasks. Please try again.");
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      dispatch(clearUser());
      localStorage.removeItem("userToken");
      toast.success("Logged out successfully");
      setTasks([]);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  const onSubmit: SubmitHandler<ITask> = async (data) => {
    try {
      setLoading(true);
      const { title } = data;
      const response = await createTasks(title, "pending");
      if (response?.success) {
        toast.success("Task added successfully");
        const socket = getSocket();
        socket.emit("taskCreated", response.task);
        reset();
      } else {
        toast.error("Error while adding task");
      }
    } catch (error) {
      toast.error("Task Adding Failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task: ITask) => {
    if (task.status === "completed") {
      toast.error("Completed tasks cannot be edited.");
      return;
    }
    setCurrentTask(task);
    setValue("title", task.title);
    setShowEditModal(true);
  };

  const handleDeleteTask = (task: ITask) => {
    setCurrentTask(task);
    setShowDeleteModal(true);
  };

  const handleCompleteTask = async (task: ITask) => {
    try {
      setLoading(true);
      const response = await completeTasks(task._id);
      if (response?.success) {
        toast.success("Task completed successfully");
        const socket = getSocket();
        socket.emit("taskUpdated", response.task);
      } else {
        toast.error("Error while completing task");
      }
    } catch (error) {
      toast.error("Task Completion Failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmEdit = async (data: ITask) => {
    if (!currentTask) return;
    try {
      setLoading(true);
      const response = await updateTasks(
        currentTask._id,
        data.title,
        currentTask.status,
      );
      if (response?.success) {
        toast.success("Task updated successfully");
        const socket = getSocket();
        socket.emit("taskUpdated", response.task);
        setShowEditModal(false);
      } else {
        toast.error("Error while updating task");
      }
    } catch (error) {
      toast.error("Task Update Failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!currentTask) return;
    try {
      setLoading(true);
      const response = await deleteTasks(currentTask._id);
      if (response?.success) {
        setTasks((prev) => prev.filter((task) => task._id !== currentTask._id));
        toast.success("Task deleted successfully");
        const socket = getSocket();
        socket.emit("taskDeleted", currentTask._id);
        setShowDeleteModal(false);
      } else {
        toast.error("Error while deleting task");
      }
    } catch (error) {
      toast.error("Task Deletion Failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks
    .filter((task) => filter === "all" || task.status === filter)
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const pieChartData = [
    { name: "Pending", value: pendingTasks.length },
    { name: "Completed", value: completedTasks.length },
  ];

  const barChartData = [
    { name: "Pending", value: pendingTasks.length },
    { name: "Completed", value: completedTasks.length },
  ];

  const COLORS = ["#FFA500", "#00C49F"];

  return (
    <StyledContainer fluid>
      <LogoutButton
        variant="outline-danger"
        onClick={() => setShowLogoutModal(true)}
      >
        <FaSignOutAlt /> Logout
      </LogoutButton>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <StyledCard>
            <CardHeader>
              <StyledTitle>
                <FaTasks className="me-3" /> Task Dashboard
              </StyledTitle>
            </CardHeader>
            <Card.Body>
              <Row className="mb-4">
                <Col md={6}>
                  <ChartCard>
                    <Card.Body>
                      <h5 className="text-center mb-4">
                        Task Status Distribution
                      </h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {pieChartData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </Card.Body>
                  </ChartCard>
                </Col>
                <Col md={6}>
                  <ChartCard>
                    <Card.Body>
                      <h5 className="text-center mb-4">
                        Task Status Comparison
                      </h5>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={barChartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card.Body>
                  </ChartCard>
                </Col>
              </Row>

              <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <StyledInputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter new task"
                    {...register("title", {
                      required: "Title is required",
                    })}
                    isInvalid={!!errors.title}
                  />
                  <StyledButton
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="fa-spin" />
                    ) : (
                      <>
                        <FaPlus /> Add Task
                      </>
                    )}
                  </StyledButton>
                </StyledInputGroup>
                {errors.title && (
                  <Form.Text className="text-danger">
                    {errors.title.message}
                  </Form.Text>
                )}
              </StyledForm>

              <Row className="mt-4">
                <Col sm={6} className="mb-3 mb-sm-0">
                  <StyledInputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search tasks"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                      <Button variant="primary" onClick={handleSearch}></Button>
                  </StyledInputGroup>
                </Col>
                <Col sm={6}>
                  <StyledInputGroup>
                    <InputGroup.Text>
                      <FaFilter />
                    </InputGroup.Text>
                    <Form.Select
                      value={filter}
                      onChange={(e) =>
                        setFilter(
                          e.target.value as "all" | "pending" | "completed",
                        )
                      }
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </StyledInputGroup>
                </Col>
              </Row>

              <TaskList>
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-muted mt-4">No tasks found.</p>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      className="d-flex justify-content-between align-items-center p-3"
                    >
                      <div className="d-flex align-items-center">
                        {task.status === "completed" ? (
                          <FaCheckCircle className="text-success me-2" />
                        ) : (
                          <FaClock className="text-warning me-2" />
                        )}
                        <span
                          className={
                            task.status === "completed"
                              ? "text-decoration-line-through"
                              : ""
                          }
                        >
                          {task.title}
                        </span>
                      </div>
                      <div>
                        <StyledBadge
                          bg={
                            task.status === "completed" ? "success" : "warning"
                          }
                          className="me-2"
                        >
                          {task.status}
                        </StyledBadge>
                        {task.status !== "completed" && (
                          <StyledButton
                            variant="outline-success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleCompleteTask(task)}
                            disabled={loading}
                          >
                            <FaCheck />
                          </StyledButton>
                        )}
                        <StyledButton
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditTask(task)}
                          disabled={task.status === "completed"}
                        >
                          <FaEdit />
                        </StyledButton>
                        <StyledButton
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTask(task)}
                        >
                          <FaTrash />
                        </StyledButton>
                      </div>
                    </TaskItem>
                  ))
                )}
              </TaskList>
            </Card.Body>
          </StyledCard>
        </Col>
      </Row>

      <StyledModal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(confirmEdit)}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                {...register("title", { required: "Title is required" })}
                isInvalid={!!errors.title}
              />
              {errors.title && (
                <Form.Text className="text-danger">
                  {errors.title.message}
                </Form.Text>
              )}
            </Form.Group>
            <StyledButton variant="primary" type="submit" disabled={loading}>
              {loading ? <FaSpinner className="fa-spin" /> : "Save Changes"}
            </StyledButton>
          </Form>
        </Modal.Body>
      </StyledModal>

      <StyledModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <StyledButton
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="danger"
            onClick={confirmDelete}
            disabled={loading}
          >
            {loading ? <FaSpinner className="fa-spin" /> : "Delete"}
          </StyledButton>
        </Modal.Footer>
      </StyledModal>

      <StyledModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <StyledButton
            variant="secondary"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="danger"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? <FaSpinner className="fa-spin" /> : "Logout"}
          </StyledButton>
        </Modal.Footer>
      </StyledModal>
    </StyledContainer>
  );
};

export default Dashboard;
