import '../App.css';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { format } from 'date-fns';

const Form = ({
  tasks,
  setTasks,
  newTask,
  setNewTask,
  isEditing,
  setIsEditing,
  setErrorMessage,
  changeSelectedIndex
}) => {
  const emptyForm = {
    uuid: uuid.v4(), titre: '', description: '', priorite: 1, date: new Date().toISOString()
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/todos', {
      uuid: newTask.uuid,
      titre: newTask.titre,
      description: newTask.description,
      priorite: parseInt(newTask.priorite, 10),
      date: newTask.date
    }).then((response) => {
      if (response.status === 200) {
        setTasks([...tasks, newTask]);
        setNewTask(emptyForm);
        changeSelectedIndex('');
      }
    })
      .catch(() => {
        setErrorMessage('Impossible d\'ajouter une nouvelle tâche');
      });
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
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
    }).then((response) => {
      const newList = tasks.map((task) => (task.uuid === newTask.uuid ? newTask : task));

      if (response.status === 200) {
        setTasks(newList);
        setNewTask(emptyForm);
        changeSelectedIndex('1');
        setIsEditing(false);
      }
    })
      .catch(() => {
        setErrorMessage('Impossible de modifier la tâche');
      });
  };

  return (
    <div>
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
            <input id="titreTask" type="text" name="titre" value={newTask.titre} onChange={handleChange} className="w-1/2 shadow appearance-none border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900" />
          </div>
          <div className="py-2 flex">
            <label htmlFor="descriptionTask" className="font-semibold flex-shrink-0"> Description : </label>
            <input id="descriptionTask" type="textarea" name="description" value={newTask.description} onChange={handleChange} className="w-full shadow appearance-none border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900" />
          </div>
          <div className="py-2">
            <label htmlFor="priorite-select" className="font-semibold"> Priorité : </label>
            <select name="priorite" id="priorite-select" onChange={handleChange} className="shadow border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900">
              <option value="3">Urgente</option>
              <option value="2">Haute</option>
              <option value="1" selected>Normale</option>
              <option value="0">Basse</option>
            </select>
          </div>
          <div className="py-2">
            <label htmlFor="dateTask" className="font-semibold"> À faire pour le : </label>
            <input id="dateTask" type="date" name="date" value={format(new Date(newTask.date), 'yyyy-MM-dd')} onChange={handleChange} className="shadow appearance-none border rounded py-1 px-3 ml-2 text-grey-darker text-gray-900" />
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
    </div>
  );
};

export default Form;
