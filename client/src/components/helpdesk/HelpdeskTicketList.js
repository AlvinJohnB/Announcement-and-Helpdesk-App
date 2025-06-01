import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import HelpdeskTicketItem from "./HelpdeskTicketItem";
import LoadingSpinner from "../common/LoadingSpinner";

const HelpdeskTicketList = ({ status = "open", department = "All" }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/endorsements");
      let filtered = res.data.filter((t) => t.status === status);
      if (department !== "All") {
        filtered = filtered.filter((t) => t.department === department);
      }
      setTickets(filtered);
    } catch (err) {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line
  }, [status, department]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {tickets.length === 0 && (
        <div className="text-muted">No tickets found.</div>
      )}
      {tickets.map((ticket) => (
        <HelpdeskTicketItem
          key={ticket._id}
          ticket={ticket}
          refreshTickets={fetchTickets}
        />
      ))}
    </div>
  );
};

export default HelpdeskTicketList;
