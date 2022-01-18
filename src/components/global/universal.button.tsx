const UniversalButton: React.FC<{ handleClick: () => void }> = (props) => {
  return (
    <button
      style={{
        border: "none",
        background: "#4285F4",
        color: "white",
        borderRadius: 4,
        padding: 10,
        display: "inline-block",
        cursor: "pointer",
      }}
      onClick={props.handleClick}
    >
      {props.children}
    </button>
  );
};

export default UniversalButton;
