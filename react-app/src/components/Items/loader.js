import { ProgressBar, RotatingSquare, ThreeDots } from "react-loader-spinner";
import { clearCart } from "../../store/cart";

const LoaderComp = () => {
  return (
    <div className="loader_spinner_container">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#2e2e2e"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName="loader_spinner"
        visible={true}
      />
    </div>
  );
};
export default LoaderComp;
