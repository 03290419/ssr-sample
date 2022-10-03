import { Route } from 'react-router-dom';
import RedPage from './pages/RedPage';
import BluePage from './pages/BluePage';
import Menu from './components/Menu';
import './App.css';

function App() {
    return (
        <div>
            <Menu />
            <hr />
            <Route path="/red" component={RedPage} />
            <Route path="/blue" component={BluePage} />
        </div>
    );
}

export default App;
