import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    height: "",
    weight: "",
    age: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    nav("/");
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">Sign up</button>
      </form>

      <br />
      <Link to="/">Already have an account?</Link>
    </div>
  );
};

export default RegisterForm;
