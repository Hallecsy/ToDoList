import { useState, useEffect } from 'react';
import './App.css';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { format } from 'date-fns';

export const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then((res) => {
        setTasks(res.data);
      });
  }, []);

  const [newTask, setNewTask] = useState({
    uuid: uuid.v4(), titre: '', description: '', date: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);

  const emptyForm = {
    uuid: uuid.v4(), titre: '', description: '', priorite: '', date: new Date().toISOString().split('T')[0]
  };

  const changeSelectedIndex = (selectValue) => {
    document.querySelector('#priorite-select').value = selectValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/todos', {
      uuid: uuid.v4(),
      titre: newTask.titre,
      description: newTask.description,
      priorite: parseInt(newTask.priorite, 10),
      date: newTask.date
    }).then(() => {
      setTasks([...tasks, newTask]);
      setNewTask(emptyForm);
      changeSelectedIndex('');
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleRemove = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`).then(() => {
      const newList = tasks.filter((task) => task.uuid !== id);
      setTasks(newList);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (task) => {
    setNewTask(task);
    setIsEditing(true);
    changeSelectedIndex(task.priorite);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setNewTask(emptyForm);
    changeSelectedIndex('');
    setIsEditing(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:5000/api/todos/${newTask.uuid}`, {
      titre: newTask.titre,
      description: newTask.description,
      priorite: parseInt(newTask.priorite, 10),
      date: newTask.date
    }).then(() => {
      const newList = tasks.map((task) => (task.uuid === newTask.uuid ? newTask : task));
      setTasks(newList);
      setNewTask(emptyForm);
      changeSelectedIndex('');
      setIsEditing(false);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const doneTask = (e) => {
    const element = e.target.parentElement;
    let boolIsDone = false;

    const newList = tasks.map(
      (task) => {
        if (task.uuid === e.target.id) {
          boolIsDone = !task.isDone;
          return { ...task, isDone: boolIsDone };
        }
        return task;
      }
    );

    axios.put(`http://localhost:5000/api/todos/${e.target.id}`, {
      isDone: boolIsDone
    }).then(() => {
      element.classList.toggle('crossed-line');
      setTasks(newList);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const sortTasks = (e) => {
    const sortElement = e.target.value;
    if (sortElement === 'titre') {
      tasks.sort((a, b) => ((a.titre > b.titre) ? 1 : ((b.titre > a.titre) ? -1 : 0)));
    } else if (sortElement === 'date') {
      tasks.sort((a, b) => ((a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)));
    } else {
      tasks.sort((a, b) => ((a.priorite < b.priorite) ? 1 : ((b.priorite < a.priorite) ? -1 : 0)));
    }
    setTasks([...tasks]);
  };

  return (
    <div>
      <div>
        {isEditing ? (
          <h1>Modifier une tâche</h1>
        ) : (
          <h1>Nouvelle tâche</h1>
        )}
        <form method="GET" onSubmit={handleSubmit}>
          <label htmlFor="titreTask"> Nom de la tâche : </label>
          <input id="titreTask" type="text" name="titre" value={newTask.titre} onChange={handleChange} />
          <br />
          <label htmlFor="descriptionTask"> Description : </label>
          <input id="descriptionTask" type="textarea" name="description" value={newTask.description} onChange={handleChange} />
          <br />
          <label htmlFor="priorite-select"> Priorité : </label>
          <select name="priorite" id="priorite-select" onChange={handleChange}>
            <option value="">Aucune</option>
            <option value="3">Urgente</option>
            <option value="2">Haute</option>
            <option value="1">Normale</option>
            <option value="0">Basse</option>
          </select>
          <br />
          <label htmlFor="dateTask"> À faire pour le : </label>
          <input id="dateTask" type="date" name="date" value={format(new Date(newTask.date), 'yyyy-MM-dd')} onChange={handleChange} />
          <br />
          {isEditing ? (
            <div>
              <input type="submit" value="Modifier" onClick={handleEditSubmit} />
              <input type="submit" value="Annuler" onClick={handleCancel} />
            </div>
          ) : (
            <input type="submit" value="Ajouter" />
          )}
        </form>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.uuid} className={task.isDone ? 'crossed-line' : ''}>
            <input type="checkbox" id={task.uuid} onClick={doneTask} defaultChecked={task.isDone ? 'checked' : ''} />
            <label htmlFor={task.uuid}>
              {task.titre} ({task.description})
              <br /><strong>Pour le : </strong>{format(new Date(task.date), 'dd/MM/yyyy')}
              <br /><strong>Priorité : </strong>{task.priorite}
            </label>
            <button type="button" onClick={() => handleRemove(task.uuid)}>Supprimer</button>
            <button type="button" onClick={() => handleEdit(task)}>Modifier</button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Trier par :</h2>
        <input type="radio" name="tri" id="sort-titre" value="titre" onClick={sortTasks} />
        <label htmlFor="sort-titre">Titre</label>
        <input type="radio" name="tri" id="sort-priorite" value="priorite" onClick={sortTasks} />
        <label htmlFor="sort-priorite">Priorité</label>
        <input type="radio" name="tri" id="sort-date" value="date" onClick={sortTasks} />
        <label htmlFor="sort-date">Date</label>
      </div>
    </div>
  );
};
