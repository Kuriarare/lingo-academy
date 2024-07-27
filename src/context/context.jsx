// Context.js
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create Context
const DataContext = createContext();

// Provider Component
export const DataProvider = ({ children }) => {
  // Add children to props validation
  DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://195.110.58.68:3001/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        
        setData(data);
      })
      .catch((err) => console.log(err));
  }, []); // Added dependency array here

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// Export the Context
export default DataContext;
