import { useState } from 'react';
import './App.css';
import uuid from 'react-native-uuid';

export const App = () => {
  const [tasks, setTasks] = useState([
    {
      uuid: uuid.v4(),
      title: 'Sortir les poubelles',
      description: 'Poubelle jaune le mardi et grise le jeudi',
      date: '2021-03-15',
      isDone: false,
      priority: '1'
    }, {
      uuid: uuid.v4(),
      title: 'Faire le plein',
      description: 'Utiliser l\'indemnité inflation de 100€',
      date: '2021-04-02',
      isDone: false,
      priority: '3'
    }, {
      uuid: uuid.v4(),
      title: 'Arroser les plantes',
      description: 'Surtout les géraniums',
      date: '2021-03-17',
      isDone: false,
      priority: '1'
    }, {
      uuid: uuid.v4(),
      title: 'Confirmer la location du canoë',
      description: 'Prévoir 12€/personne pour la demi-journée',
      date: '2021-03-20',
      isDone: false,
      priority: '2'
    }
  ]);

  const [newTask, setNewTask] = useState({ uuid: uuid.v4(), title: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [isEditing, setIsEditing] = useState(false);

  const empty_form = { uuid: uuid.v4(), title: '', description: '', priority: "", date: new Date().toISOString().split('T')[0] }

  const changeSelectedIndex = (selectValue) => {
    document.querySelector("#priority-select").value = selectValue;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks([...tasks, newTask]);
    setNewTask(empty_form);
    changeSelectedIndex("");
  }

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  }

  const handleRemove = (id) => {
    const newList = tasks.filter((task) => task.uuid !== id);
    setTasks(newList);
  }

  const handleEdit = (task) => {
    setNewTask(task);
    setIsEditing(true);
    changeSelectedIndex(task.priority);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setNewTask(empty_form);
    changeSelectedIndex("");
    setIsEditing(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const newList = tasks.map((task) => (task.uuid === newTask.uuid ? newTask : task));
    setTasks(newList);
    setNewTask(empty_form);
    changeSelectedIndex('');
    setIsEditing(false);
  };

  const doneTask = (e) => {
    const element = e.target.parentElement;
    element.classList.toggle("crossed-line");
    const newList = tasks.map((task) => task.uuid === e.target.id ? { ...task, isDone: !task.isDone } : task);
    setTasks(newList);
  };

  const sortTasks = (e) => {
    const sortElement = e.target.value;
    if (sortElement === "title") {
      tasks.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    } else if (sortElement === "date") {
      tasks.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
    } else {
      tasks.sort((a, b) => (a.priority < b.priority) ? 1 : ((b.priority < a.priority) ? -1 : 0));
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
          <label> Nom de la tâche : </label>
          <input type="text" name="title" value={newTask.title} onChange={handleChange} />
          <br />
          <label> Description : </label>
          <input type="textarea" name="description" value={newTask.description} onChange={handleChange} />
          <br />
          <label> Priorité : </label>
          <select name="priority" id="priority-select" onChange={handleChange}>
            <option value="">Aucune</option>
            <option value="3">Urgente</option>
            <option value="2" >Haute</option>
            <option value="1">Normale</option>
            <option value="0">Basse</option>
          </select>
          <br />
          <label> À faire pour le : </label>
          <input type="date" name="date" value={newTask.date} onChange={handleChange} />
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
        {tasks.map(task => <li key={task.uuid}><input type="checkbox" id={task.uuid} onClick={doneTask}></input><label htmlFor={task.uuid} > {task.title} ({task.description}) <strong>Pour le :</strong> {task.date} <strong>Priorité :</strong> {task.priority} </label><button onClick={() => handleRemove(task.uuid)}>Supprimer</button><button onClick={() => handleEdit(task)}>Modifier</button></li>)}
      </ul>
      <div>
        <h2>Trier par :</h2>
        <input type="radio" name="tri" id="sort-title" value="title" onClick={sortTasks} /><label htmlFor="sort-title">Titre</label>
        <input type="radio" name="tri" id="sort-priority" value="priority" onClick={sortTasks} /><label htmlFor="sort-priority">Priorité</label>
        <input type="radio" name="tri" id="sort-date" value="date" onClick={sortTasks} /><label htmlFor="sort-date">Date</label>
      </div>
    </div>
  )
}