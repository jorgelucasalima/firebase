import { useState, useEffect } from 'react';
import firebase from './firebaseConnection'
import './style.css'

function App() {

  //minhas useState
  const [idPost, setIdPost] = useState('')
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  

  //minhas useEffect
  // carregar a lista assim que abrir
  useEffect(() => {
  
    async function loadPosts() {
      await firebase.firestore().collection('posts')
      .onSnapshot((doc) => {
        let meusPosts = []
      
        doc.forEach((item)=>{
          meusPosts.push({
            id: item.id,
            titulo: item.data().titulo,
            autor: item.data().autor,
          })
        })
        
        setPosts(meusPosts)
      
      })
    }

    loadPosts()
  }, []);



//----------- adiciona um post
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

//-------- buscar dados com o botão

  async function buscarPost() {

    await firebase.firestore().collection('posts')
    .get()
    .then((snapshort)=>{
        let lista = []
        snapshort.forEach((doc)=>{
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        }) 

        setPosts(lista)

    })
    .catch(()=>{
      alert('deu algum erro..')
    })

    // buscando 1 por vez
 /*
    await firebase.firestore().collection('posts')
    .doc('123')
    .get()
    .then((snapshot) => {
      setTitulo(snapshot.data().titulo)
      setAutor(snapshot.data().autor)
    })
    .catch(()=>{
      console.log('Deu algum erro')
    })
 */ 
  }


  //--- editar post
  async function editarPost(params) {
    await firebase.firestore().collection('posts')
    .doc(idPost)
    .update({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log('Dados Atualizados com sucesso no editarPost')
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(()=>{
      console.log('Deu algum erro no editarPost')
    })
  }


//------ excluir post

  async function excluirPost(id) {
    await firebase.firestore().collection('posts').doc(id)
    .delete()
    .then(()=>{
      alert('Esse post foi excluído com sucesso.')
    })
    .catch(()=>{
      console.log('Deu algum problema ao excluir os dados')
    })


  }






// HTML



  return (
    <div className="App">
      <h1>ReactJs + Firebase .</h1> <br/>
        <div className="container">
 
          <label>ID:</label>
          <input type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)} />


          <label>Titulo</label>
          <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}></textarea>
        
          <label>Autor: </label>
          <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} /><br/><br/>

          <button onClick={ handleAdd }>Cadastrar</button>
          <button onClick={ buscarPost }>Buscar Post</button> <br/>
          <button onClick={ editarPost }>Editar</button>

          <ul>
            {posts.map((post)=>{
              return(
                <li key={post.id}>
                  <span>ID: {post.id}</span><br/>
                  <span>Titulo: {post.titulo}</span> <br/>
                  <span>Autor: {post.autor}</span><br/><br/>
                  <button onClick={() => excluirPost(post.id)}>Excluir Post</button><br/><br/>
                </li>
              )
            })}
          </ul>



        </div>
    </div>
  );
}

export default App;
