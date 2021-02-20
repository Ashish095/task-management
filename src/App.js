import React, { useState } from "react";
import "./index.css";
import { v4 as uuid } from "uuid";

function RecursiveRender({ tasks, onAdd }) {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [activeTaskId, setActiveTaskId] = useState("");

  const onSubTaskAdd = (subTasks, taskId) => {
    onAdd(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subTasks
          };
        } else {
          return t;
        }
      })
    );
  };

  return (
    <>
      {tasks.map((task) => (
        <li key={task.id}>
          <p style={{ display: "inline-block", marginRight: 8 }}>
            {task.title}
          </p>
          {showInput && task.id === activeTaskId && (
            <input
              value={taskTitle}
              style={{ marginRight: 4 }}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          )}
          <button
            style={{ marginRight: 4 }}
            onClick={(e) => {
              if (!showInput) {
                setShowInput(true);
                setActiveTaskId(task.id);
                return;
              }

              setShowInput(false);
              setTaskTitle("");
              setActiveTaskId(-1);

              onAdd(
                tasks.map((t) => {
                  if (t.id === task.id) {
                    return {
                      ...task,
                      subTasks: [
                        ...task.subTasks,
                        {
                          id: uuid(),
                          title: taskTitle,
                          subTasks: []
                        }
                      ]
                    };
                  } else {
                    return t;
                  }
                })
              );
            }}
          >
            {showInput ? "Save" : "Add"}
          </button>
          <button
            onClick={(e) => onAdd(tasks.filter((t) => t.id !== task.id))}
            style={{ marginRight: 4 }}
          >
            Remove
          </button>
          {task.subTasks && task.subTasks.length > 0 && (
            <ul>
              <RecursiveRender
                tasks={task.subTasks}
                onAdd={(subTasks) => onSubTaskAdd(subTasks, task.id)}
              />
            </ul>
          )}
        </li>
      ))}
    </>
  );
}

class List extends React.Component {
  state = {
    taskTitle: "",
    tasks: []
  };

  render() {
    const { tasks, taskTitle } = this.state;

    return (
      <div>
        <input
          style={{ marginRight: 8 }}
          type="text"
          value={taskTitle}
          onChange={(e) => this.setState({ taskTitle: e.target.value })}
        />
        <button
          onClick={(e) =>
            this.setState((prevState) => ({
              tasks: [
                ...prevState.tasks,
                {
                  id: uuid(),
                  title: prevState.taskTitle,
                  subTasks: []
                }
              ],
              taskTitle: ""
            }))
          }
        >
          Add
        </button>
        <ul>
          <RecursiveRender
            tasks={tasks}
            onAdd={(tasks) => this.setState({ tasks })}
          />
        </ul>
      </div>
    );
  }
}

export default function App() {
  return (
    <div className="App">
      <List />
    </div>
  );
}
