import styles from "../../styles/NavigationBar.module.css";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../reducers/user";
import { useSelector } from "react-redux";

export default function NavigationBar() {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.user);

  return (
    <div className={styles.divMain}>
      <button onClick={() => dispatch(logoutUser())}>logout</button>
    </div>
  );
}
