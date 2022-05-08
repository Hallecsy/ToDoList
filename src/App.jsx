import { useState, useEffect } from 'react';
import './App.css';
import uuid from 'react-native-uuid';
import axios from 'axios';
import './index.css';
import Loading from './components/Loading';
import Form from './components/Form';
import List from './components/List';

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/todos')
      .then((res) => {
        setTasks(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Impossible de récupérer la liste des tâches');
        setIsLoading(false);
      });
  }, []);

  const [newTask, setNewTask] = useState({
    uuid: uuid.v4(), titre: '', description: '', priorite: 1, date: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);

  const changeSelectedIndex = (selectValue) => {
    document.querySelector('#priorite-select').value = selectValue;
  };

  return (
    <div className="p-10 my-10 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-3xl sm:mx-auto sm:rounded-lg">

      <Form
        tasks={tasks}
        setTasks={setTasks}
        newTask={newTask}
        setNewTask={setNewTask}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        changeSelectedIndex={changeSelectedIndex}
      />

      {errorMessage && (
      <div className="bg-red-100 rounded-lg bg- p-5 my-3">
        <p className="font-semibold text-xl text-red-600 text-center my-2">{errorMessage}</p>
      </div>
      )}

      {isLoading ? <Loading />
        : (
          <List
            tasks={tasks}
            setTasks={setTasks}
            setNewTask={setNewTask}
            setIsEditing={setIsEditing}
            setErrorMessage={setErrorMessage}
            changeSelectedIndex={changeSelectedIndex}
          />
        )}

    </div>
  );
};
