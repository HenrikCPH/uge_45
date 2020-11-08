import logo from './logo.svg';
import './App.css';
import BasicExample from './example';

function App(props) {
  return (
    <div>
      <BasicExample bookFacade={props.bookFacade}/>
    </div>
  );
}

export default App;
