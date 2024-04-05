import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import Signup_main from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import SignupFormModal from "../SignupFormModal/manual";


function LoginSignup({closeMenu}) {
  const history = useHistory()
  const redirect = () => {
    history.push('/signup')
    closeMenu()
  }
  return (
    <div className="login_signup_buttons">
          <OpenModalButton
            className={"navigation_buttons"}
            buttonText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />

          <OpenModalButton
            className={"navigation_buttons"}
            buttonText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
          {/* <button className="navigation_buttons" onClick={redirect}>Sign Up</button> */}
        </div>
  );
}

export default LoginSignup;
