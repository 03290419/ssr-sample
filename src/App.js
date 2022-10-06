import { Route } from 'react-router-dom';
import RedPage from './pages/RedPage';
import BluePage from './pages/BluePage';
import Menu from './components/Menu';
import UsersPage from './pages/UsersPage';
import './App.css';

function App() {
    return (
        <div>
            <Menu />
            <hr />
            <Route path="/red" component={RedPage} />
            <Route path="/blue" component={BluePage} />
            <Route path="/users" component={UsersPage} />
        </div>
    );
}

export default App;
