import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  Prompt,
  useRouteMatch,
  useParams,
  useHistory
} from "react-router-dom";
import './style2.css';

const Header = ({isLoggedIn, loginMsg}) => {
  return(
    <>
    <ul className="header">
        <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
        <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>
        {isLoggedIn && (
        <>
        <li><NavLink activeClassName="active" to="/add-book">Add Book</NavLink></li>
        <li><NavLink activeClassName="active" to="/find-book">Find Book</NavLink></li>
        </>
        )}
        <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>      
        <li><NavLink activeClassName="active" to="/login-out">{loginMsg}</NavLink></li>
    </ul>

        <hr />
        </>
  );
}

const Content = (props) => {
  let history = useHistory();
  
  const setLoginStatus = status => {
    props.setIsLoggedIn(status);
    history.push("/");
  }
  return (
    <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/products">
            <Products bookFacade={props.bookFacade}/>
          </Route>
          <Route path="/company">
            <Company />
          </Route>
          <Route path="/add-book">
            <AddBook bookFacade={props.bookFacade}/>
          </Route>
          <Route path="/find-book">
            <FindBook bookFacade={props.bookFacade}/>
          </Route>
          <Route path="/login-out">
            <LoginOut 
              loginMsg={props.isLoggedIn ? "Logout" : "Login"}
              isLoggedIn={props.isLoggedIn}
              setLoginStatus={setLoginStatus}
            />
          </Route>
          <Route>
            <NoMatch path="*" />
          </Route>
        </Switch>
      </div>
  );
}

export default function BasicExample(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <div>
        <Header 
        loginMsg={isLoggedIn ? "Logout" : "Login"}
        isLoggedIn={isLoggedIn}
        />
        <Content bookFacade={props.bookFacade} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function LoginOut({isLoggedIn, loginMsg, setLoginStatus}) {
  const handleBtnClick = () => {
    setLoginStatus(!isLoggedIn);
  }
  return (
    <div>
      <h2>{loginMsg}</h2>
      <button onClick={handleBtnClick}>{loginMsg}</button>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Products(props) {
  let { path, url } = useRouteMatch();
  let books = props.bookFacade.getBooks();
  let bookList = books.map((book) => 
  <li key={book.id}>{book.title} <Link to={`${url}/${book.id}`}>Details</Link></li>)
  return (
    <div>
      <h2>{bookList}</h2>
      <Switch>
        <Route exact path={path}>
          <h3>Please select a book.</h3>
        </Route>
          <Route path={`${path}/:bookId`}>
            <Details bookFacade={props.bookFacade} />
          </Route>
      </Switch>
    </div>
  );
}

function Details(props) {
  let { bookId } = useParams();
  const book = props.bookFacade.findBook(bookId);
  return (
    <div>
      <h2>Book details:</h2>
      <p>ID: {book.id}</p>
      <p>Title: {book.title}</p>
      <p>Info: {book.info}</p>
    </div>
  );
  
}

function FindBook(props) {
  const [book, setBook] = useState(0);
  
  const handleChange = event => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setBook({id: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setBook(props.bookFacade.findBook(book.id));
  }
  
  const handleDelete = event => {
    event.preventDefault();
    props.bookFacade.deleteBook(book.id);
  }

  return (
    <div>
      <form onSubmit = {handleSubmit}>
        <input
          id="id"
          value ={book.id}
          placeholder="Enter a book id"
          type="text"
          onChange={handleChange}
        />
        <button>Search</button>
        <h2>Book details:</h2>
        <p>ID: {book.id}</p>
        <p>Title: {book.title}</p>
        <p>Info: {book.info}</p>
        <button onClick ={handleDelete}>Delete book</button>
      </form>
    </div>
  );
} 

function Company() {
  return (
    <div>
      <h2>Company</h2>
    </div>
  );
}  

function AddBook(props) {
  let [isBlocking, setIsBlocking] = useState(false);
  const emptyBook = {id: "", title: "", info:""};
  const [book,addBook] = useState(emptyBook);

  const handleChange = event => {
    setIsBlocking(event.target.value.length > 0);
    const target = event.target;
    const id = target.id;
    const value = target.value;
    addBook({ ...book, [id]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    event.target.reset();
        setIsBlocking(false);
    props.bookFacade.addBook(book);
    alert("The book you entered: " + book.info + " " + book.title);
  }


  return (
    <div>
      <Prompt
        when={isBlocking}
        message={location => "Are you sure you want to go to ${location.pathname}"
        }
      />
      <h3> Add book </h3>
      <form onSubmit = {handleSubmit}>
        <input
          id="title"
          value ={book.title}
          placeholder="add title"
          type="text"
          onChange={handleChange}
        />
        <br />
        <input
          id="info"
          value ={book.info}
          placeholder="add info"
          type="text"
          onChange={handleChange}
        />
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>No match for that URL</h2>
    </div>
  );
}