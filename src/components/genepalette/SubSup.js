const SubSup = ({ allel, small, ...props }) => {
  return (
    <span style={{ position: "relative" }}>
      <span
        style={{
          marginRight: allel.sup === "" && allel.sub === "" ? "0px" : "10px",
          fontSize: "14px",
        }}
      >
        {allel.main}
      </span>{" "}
      <span style={{ position: "absolute", fontSize: "14px" }}>
        <sup
          style={{
            display: "block",
            position: "relative",
            left: "-10px",
            top: small ? "10px" : "5px",
          }}
        >
          {allel.sup}
        </sup>
        <sub
          style={{
            display: "block",
            position: "relative",
            left: "-10px",
            top: small ? "22px" : "18px",
          }}
        >
          {allel.sub}
        </sub>
      </span>
    </span>
  );
};

SubSup.defaultProps = {
  allel: {
    sup: "",
    sub: "",
    main: "",
  },
};

export default SubSup;
