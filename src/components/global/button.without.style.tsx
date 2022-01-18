const ButtonWithOutStyle: React.FC<{ handleClick: () => void }> = (props) => {
  return (
    <button
      style={{ color: "blue", border: "none", background: "none" }}
      onClick={() => props.handleClick()}
    >
      {props.children}
    </button>
  );
};

export default ButtonWithOutStyle;
