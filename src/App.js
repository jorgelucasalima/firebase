import { useState } from 'react';
import firebase from './firebaseConnection'
import './style.css'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')


  async function handleAdd() {
    await firebase.firestore().collection('posts')
    .add({
      titulo: titulo,
      autor: autor,
    })

    //forma passando o doc na mão
    //.doc('12345')
    //.set({
    //  titulo: titulo,
    //  autor: autor
    
    .then(()=>{
      console.log("dados cadastrados com sucesso.")
      setTitulo('')
      setAutor('')
    })
    .catch((error)=>{
      console.log("gerou erro" + error)
    })
  }


  async function buscarPost() {
    await firebase.firestore().collection('posts')
    .doc('')
    .get()
    .then((snapshot) => {
      setTitulo(snapshot.data().titulo)
      setAutor(snapshot.data().autor)
    })
    .catch(()=>{
      console.log('Deu algum erro')
    })
  }


  return (
    <div className="App">
      <h1>ReactJs + Firebase .</h1> <br/>
        <div className="container">
          <label>Titulo</label>
          <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}></textarea>
        
          <label>Autor: </label>
          <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} /><br/><br/>

          <button onClick={handleAdd}>Cadastrar</button>
          <button onClick={buscarPost}>Buscar Post</button>
          </div>
    </div>
  );
}

export default App;
