import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import EndorsementItem from "./EndorsementItem";
import LoadingSpinner from "../common/LoadingSpinner";

const EndorsementList = () => {
  const [endorsements, setEndorsements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEndorsements = async () => {
    try {
      const res = await api.get("/api/endorsements");
      setEndorsements(res.data);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndorsements();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {endorsements.map((endorsement) => (
        <EndorsementItem
          key={endorsement._id}
          endorsement={endorsement}
          refreshEndorsements={fetchEndorsements}
        />
      ))}
    </div>
  );
};

export default EndorsementList;
