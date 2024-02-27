import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";


function LoginSignup({closeMenu}) {
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
        </div>
  );
}

export default LoginSignup;
