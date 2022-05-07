import { useState, useEffect } from 'react';
import './App.css';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { format } from 'date-fns';
import './index.css';

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
    uuid: uuid.v4(), titre: '', description: '', priorite: 1, date: new Date().toISOString()
  };

  const changeSelectedIndex = (selectValue) => {
    document.querySelector('#priorite-select').value = selectValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/todos', {
      uuid: newTask.uuid,
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
    console.log(id);
    axios.delete(`http://localhost:5000/api/todos/${id}`).then(() => {
      const newList = tasks.filter((task) => task.uuid !== id);
      setTasks(newList);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (task) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setNewTask(task);
    setIsEditing(true);
    changeSelectedIndex(task.priorite);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setNewTask(emptyForm);
    changeSelectedIndex('1');
    setIsEditing(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:5000/api/todos/${newTask.uuid}`, {
      titre: newTask.titre,
      description: newTask.description,
      priorite: parseInt(newTask.priorite, 10),
      date: new Date(newTask.date)
    }).then(() => {
      const newList = tasks.map((task) => (task.uuid === newTask.uuid ? newTask : task));
      setTasks(newList);
      setNewTask(emptyForm);
      changeSelectedIndex('1');
      setIsEditing(false);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const doneTask = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;
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
      element.classList.toggle('opacity-40');
      setTasks(newList);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  const sortTasks = (e) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    const sortElement = e.target.id;
    if (sortElement === 'sort-titre') {
      tasks.sort((a, b) => ((a.titre > b.titre) ? 1 : ((b.titre > a.titre) ? -1 : 0)));
    } else if (sortElement === 'sort-date') {
      tasks.sort((a, b) => ((a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)));
    } else {
      tasks.sort((a, b) => ((a.priorite < b.priorite) ? 1 : ((b.priorite < a.priorite) ? -1 : 0)));
    }
    setTasks([...tasks]);
  };

  return (
    <div className="p-10 my-10 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-3xl sm:mx-auto sm:rounded-lg">
      <p>
        A faire :<br />
        - Ajouter un loader<br />
        - Séparer le code en composants (Un form.js, etc...)<br />
        - Gérer les erreurs en front et back (Ne pas envoyer un form vide)<br />
      </p>
      <h1 className="text-center font-bold text-3xl mb-5">ToDo List</h1>
      <div className="bg-gray-800 rounded-lg p-5 text-white">
        {isEditing ? (
          <h2 className="text-center font-bold text-2xl">Modifier une tâche</h2>
        ) : (
          <h2 className="text-center font-bold text-2xl">Nouvelle tâche</h2>
        )}
        <form method="GET" onSubmit={handleSubmit} className="pt-5 pb-5">
          <div className="py-2 flex">
            <label htmlFor="titreTask" className="font-semibold flex-shrink-0"> Nom de la tâche : </label>
            <input id="titreTask" type="text" name="titre" className="w-1/2 shadow appearance-none border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900" value={newTask.titre} onChange={handleChange} />
          </div>
          <div className="py-2 flex">
            <label htmlFor="descriptionTask" className="font-semibold flex-shrink-0"> Description : </label>
            <input id="descriptionTask" type="textarea" name="description" className="w-full shadow appearance-none border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900" value={newTask.description} onChange={handleChange} />
          </div>
          <div className="py-2">
            <label htmlFor="priorite-select" className="font-semibold"> Priorité : </label>
            <select name="priorite" id="priorite-select" className="shadow border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900" onChange={handleChange}>
              <option value="3">Urgente</option>
              <option value="2">Haute</option>
              <option value="1" selected>Normale</option>
              <option value="0">Basse</option>
            </select>
          </div>
          <div className="py-2">
            <label htmlFor="dateTask" className="font-semibold"> À faire pour le : </label>
            <input id="dateTask" type="date" name="date" className="shadow appearance-none border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900" value={format(new Date(newTask.date), 'yyyy-MM-dd')} onChange={handleChange} />
          </div>
          <br />
          {isEditing ? (
            <div className="text-center mt-5">
              <input type="submit" value="Modifier" onClick={handleEditSubmit} className="cursor-pointer px-8 py-2 mr-5 bg-gray-50 rounded-full text font-bold text-gray-900 border" />
              <input type="submit" value="Annuler" onClick={handleCancel} className="cursor-pointer px-8 py-2 bg-gray-50 rounded-full text font-bold text-gray-900 border" />
            </div>
          ) : (
            <div className="flex">
              <input type="submit" value="Ajouter" className="cursor-pointer m-auto px-8 py-2 mt-5 bg-gray-50 rounded-full text font-bold text-gray-900 border" />
            </div>
          )}
        </form>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.uuid} className={task.isDone ? 'relative bg-blue-100 rounded-lg p-5 my-3 opacity-40 hover:opacity-70' : 'relative bg-blue-100 rounded-lg p-5 my-3'}>
            <h2 className="font-bold text-lg">{task.titre}</h2>
            <p className="italic">{task.description}</p>
            <div className="flex absolute top-4 right-4">
              <div className="flex mr-4">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 246.027 246.027" xmlSpace="preserve">
                  <path d="M242.751,196.508L143.937,25.358c-4.367-7.564-12.189-12.081-20.924-12.081c-8.735,0-16.557,4.516-20.924,12.081  L3.276,196.508c-4.368,7.564-4.368,16.596,0,24.161s12.189,12.081,20.924,12.081h197.629c8.734,0,16.556-4.516,20.923-12.08  C247.119,213.105,247.118,204.073,242.751,196.508z M123.014,204.906c-8.672,0-15.727-7.055-15.727-15.727  c0-8.671,7.055-15.726,15.727-15.726s15.727,7.055,15.727,15.726C138.74,197.852,131.685,204.906,123.014,204.906z M138.847,137.68  c0,8.73-7.103,15.833-15.833,15.833s-15.833-7.103-15.833-15.833V65.013c0-4.142,3.358-7.5,7.5-7.5h16.667  c4.143,0,7.5,3.358,7.5,7.5V137.68z" />
                </svg>
                <p className="ml-2">{task.priorite == 0 ? 'Basse' : task.priorite == 1 ? 'Normale' : task.priorite == 2 ? 'Haute' : 'Urgente !'} </p>
              </div>
              <div className="flex">
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                  <circle style={{ fill: '#000000' }} cx="256" cy="256" r="256" />
                  <polygon style={{ fill: '#ffffff' }} points="367.184,386.656 240,259.488 240,76.848 272,76.848 272,246.24 389.808,364.032 " />
                </svg>
                <p>{format(new Date(task.date), 'dd/MM/yyyy')}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="mt-3">
                <button className="px-3 py-2 mr-2 text-gray-50 text-xs rounded-full font-bold bg-gray-900" id={task.uuid} type="button" onClick={doneTask}>{task.isDone ? 'Non terminé' : 'Terminé'}</button>
              </div>
              <div className="mt-3">
                <button className="px-3 py-2 mr-2 text-gray-50 text-xs rounded-full font-bold bg-gray-900" type="button" onClick={() => handleEdit(task)}>Modifier</button>
                <button className="px-3 py-2 text-gray-50 text-xs rounded-full font-bold bg-gray-900" type="button" onClick={() => handleRemove(task.uuid)}>Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <h2 className="text-center font-bold text-xl mt-6">Trier par :</h2>
        <div className="flex justify-center mt-3">
          <button className="px-3 py-2 mr-2 text-gray-50 text-sm rounded font-bold bg-gray-500 hover:bg-gray-900" type="button" id="sort-titre" onClick={sortTasks}>Titre</button>
          <button className="px-3 py-2 mr-2 text-gray-50 text-sm rounded font-bold bg-gray-500 hover:bg-gray-900" type="button" id="sort-priorite" onClick={sortTasks}>Priorité</button>
          <button className="px-3 py-2 mr-2 text-gray-50 text-sm rounded font-bold bg-gray-500 hover:bg-gray-900" type="button" id="sort-date" onClick={sortTasks}>Date</button>
        </div>
      </div>
    </div>
  );
};
