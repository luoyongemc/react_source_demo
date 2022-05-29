import React from "react";

export default class App extends React.Component {
  state = { show: false };
  componentDidMount() {
    document.addEventListener("click", () => {
      this.setState({ show: false });
    });
  }
  handleClick = (e) => {
    //在16中，事件被代理到了document上执行   在17中，事件被代理到了root上执行
    e.stopPropagation();//react17中生效
    // e.nativeEvent.stopImmediatePropagation(); //react16中生效 stopImmediatePropagation也阻止本级监听函数执行
    this.setState({ show: true });
  };
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>显示</button>
        {this.state.show && <div>modal</div>}
      </div>
    );
  }
}
