import {Route,Switch} from 'react-router-dom';
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePages';
import Middle from './Pages/Middle';
import NotFound from './Pages/NotFound';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route path='/' exact component={HomePage}/>
        <Route path='/verify' exact component={Middle}/>
        <Route path='/chats' exact component={ChatPage}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  );
}

export default App;
