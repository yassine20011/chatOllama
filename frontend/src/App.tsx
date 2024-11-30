import './App.css'
import NavBar from './components/navBar'

function App() {

  const users = fetch('http://localhost:3000/users').then((response) => response.json()).then(data => console.log(data))

  return (
    <>
      <NavBar />
      <h1>React App</h1>
    </>
  )
}

export default App
