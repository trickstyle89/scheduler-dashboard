import React, { Component } from "react";
import classnames from "classnames";
import Loading from './Loading';
import Panel from './Panel';
import axios from 'axios';
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";


 const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: state => getTotalInterviews(state)
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: state => getLeastPopularTimeSlot(state)
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: state => getMostPopularDay(state)
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: state => getInterviewsPerDay(state)
  }
];

class Dashboard extends Component {

  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
   };


  componentDidMount = () => {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

  Promise.all([
    axios.get("/api/days"),
    axios.get("/api/appointments"),
    axios.get("/api/interviewers")
  ]).then(([days, appointments, interviewers]) => {
    this.setState({
      loading: false,
      days: days.data,
      appointments: appointments.data,
      interviewers: interviewers.data
    });
  });
};

  componentDidUpdate = (previousProps, previousState) => {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel = (id) => {
    this.setState({
      focused: id
    });
  }

  render() {
    
      const dashboardClasses = classnames("dashboard", {
        "dashboard--focused": this.state.focused
      });
    
      const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
        .map(panel => (
          <Panel
            key={panel.id}
            label={panel.label}
            value={panel.getValue(this.state)}
            onSelect={event => this.selectPanel(panel.id)}
          />
        ));
    
      if (this.state.loading) {
        return <Loading />;
      }
    
      return <main className={dashboardClasses}>{panels}</main>;
    }
}

export default Dashboard;
