import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "../api/axios";

//must start with lower or upper case letter and must be followed by anywhere from 3 to 23 characters(lower or upper case letters, digits, and underscores)(overall: 4- 24 characters)
// const USER_REGX = /^[a-zA-Z][a-zA-Z0-9]{3,23}$/;

//at least one lower case letter, one upper case letter, one digit, and one special character(overall: 8 - 24 characters)
const PWD_REGX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,24}$/;

const REGISTER_URL = "/users";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidPassword(PWD_REGX.test(password));
  }, [password]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled
    const passwordTest = PWD_REGX.test(password);
    if (!passwordTest) {
      setErrMsg("Invalid username or password");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        { email, password }
      );
      console.log(JSON.stringify(response));
      setSuccess(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username already exists");
      } else {
        setErrMsg("Registration failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type={"email"}
              name="email"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={userFocus ? "instructions" : "offscreen"}
            >
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">Password:</label>
            <input
              type={"password"}
              id="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id="pwdnote"
              className={
                passwordFocus && !validPassword ? "instructions" : "offscreen"
              }
            >
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <button disabled={!validPassword ? true : false}>Sign Up</button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/* put router link */}
              <a href="#">Login</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
