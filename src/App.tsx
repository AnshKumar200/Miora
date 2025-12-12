import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import NotePage from './pages/NotePage'
import Layout from './pages/Layout'

function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path='/note/:id' element={<NotePage />} />
            </Route>
        </Routes>
    )
}

export default App
