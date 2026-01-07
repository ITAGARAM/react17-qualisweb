import React from "react";
import { connect } from "react-redux";
import { SET_TIMER_START } from "../../actions/LoginTypes";
import rsapi from "../../rsapi";

//ALPDJ21-132--Added by Ganesh(27-11-2025)--for every 15 min session time update.
// Start----
class GlobalTimer extends React.Component {
  componentDidMount() {
    this.startCounting();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startCounting = () => {
    const { userInfo } = this.props;
    const CHECK_TIME_MIN = userInfo.nsessiontimeout;
    this.timer = setInterval(() => {
      const { timerStart, dispatch } = this.props;
      if (!timerStart) return;
      const now = Date.now();
      const diffMin = Math.floor((now - timerStart) / 60000);
      if (diffMin >= CHECK_TIME_MIN) {
        rsapi()
          .post("/login/updateSession", { userInfo })
          .then(() => {
            // Reset timer start so another cycle begins
            dispatch({ type: SET_TIMER_START, payload: Date.now() });
          })
          .catch((err) => {
            console.error("Session Timeout Update Failed", err);
            clearInterval(this.timer);
          });
      }
    }, 1000);
  };
  render() {
    return null;
  }
}
const mapState = (state) => ({
  timerStart: state.Login.timerStart,
  userInfo: state.Login.userInfo,
});

export default connect(mapState)(GlobalTimer);
// -- End