import { useState, useEffect } from 'react';
import firebase from './firebaseConnection'
import './style.css'

function App() {

  //minhas useState
  const [idPost, setIdPost] = useState('')
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  
  //useState de login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userLogado, setUserLogado] = useState({});

  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');

  const [usuario, setUsuario] = useState({});



  //xxxxxxxxxxxxx minhas useEffect
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


  // carregar usuario
  useEffect(() => {
    async function checkLogin(params) {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // se tiver algum usuário logado ele chega aqui
          setUser(true)
          setUserLogado({
            uid: user.uid,
            email: user.email,
          })
        }else{
          // não possui nenhum user logado
          setUser(false)
          setUserLogado({

          })
        }
      })
    }
    checkLogin()

    return () => {
      
    };
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


// ========== função para cadastrar novo usuario

  async function novoUsuario() {
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then( async (value) => {
      firebase.firestore().collection('users')
      .doc(value.user.uid)
      .set({
        nome: nome,
        cargo: cargo,
        status: true,
      })
      .then(()=>{
        setNome('')
        setCargo('')
        setEmail('')
        setSenha('')
      })
      .catch(()=>{
        alert('Deu algum erro no cadastro')
      })


    })
    .catch((error)=>{
      if (error.code === 'auth/weak-password') {
        alert('Sua senha é muito fraca')
      } else if(error.code === 'auth/email-already-in-use'){
        alert('Esse email já existe.')
      }
    })


  }


//--------- função para logout

  async function logout() {
    await firebase.auth().signOut()
    setUsuario({})
  }


// -------- função login
  async function login() {
    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(async (value) => {
      await firebase.firestore().collection('users')
      .doc(value.user.uid)
      .get()
      .then((snapshot)=>{
        setUsuario({
          nome: snapshot.data().nome,
          cargo: snapshot.data().cargo,
          status: snapshot.data().status,
          email: value.user.email
        })
      })

    })
    .catch((error)=>{
      console.log('ERRO AO FAZER LOGIN' + error)
    })
  }






// ------- HTML

  return (
    <div className="App">
      <h1>ReactJs + Firebase .</h1> <br/>
        
  

        <div className="container">
          <h2>Cadastro de Usuário</h2>

          <label>Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} /><br/>

          <label>Cargo</label>
          <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} /><br/>

          <label>Email</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} /><br/>
          
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /><br/>
          
          <button onClick={login}>Login</button><br/>
          <button onClick={novoUsuario}>Cadastrar</button> <br/>   
          <button onClick={logout}>Logout</button><br/><br/>
        

          <hr/><br/>
          
          {Object.keys(usuario).length > 0 && (
            <div>
              <strong>Olá </strong>{usuario.nome}<br/>
              <strong>Cargo: </strong>{usuario.cargo}<br/>
              <strong>Email: </strong>{usuario.email}<br/>
              <strong>Status: </strong>{usuario.status ? 'ATIVO' : 'DESATIVADO'}<br/>

            </div>
          )}




        </div>

        











        <div className="container">
          <h2>Banco de dados</h2>
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
