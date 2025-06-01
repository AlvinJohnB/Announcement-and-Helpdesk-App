import React, { useEffect, useState } from "react";
import axios from "axios";
import EndorsementItem from "./EndorsementItem";
import LoadingSpinner from "./LoadingSpinner";

const EndorsementList = () => {
  const [endorsements, setEndorsements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEndorsements = async () => {
    try {
      const res = await axios.get("/api/endorsements");
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
