import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Chat App</h1>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
    </div>
  );
}

export default Home; 