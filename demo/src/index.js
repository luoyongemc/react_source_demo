// import React, {Component} from "react";
// import ReactDOM from "react-dom";
// import App from "./demo_2";

// const rootEl = document.getElementById("root");

// ReactDOM.render(<App />, rootEl);
// ReactDOM.unstable_createRoot(rootEl).render(<App />);


import React from 'react';
import ReactDOM from './react-dom_fiber';
import Component from "./Component";


class ClassComponent extends Component {
    render() {
        return (
            <div className="border">
                <p>{this.props.name}</p>
            </div>
        )
    }
}



export default function Example() {
  const [count,setCount] = React.useState(0);

  return (
    <div>
        <p>{count}</p>
        <button onClick={() => setCount(count + 1)}>click me</button>
    </div>
  )
}



function FunctionComponent(props) {
    return (
        <div className='border'>
            <p>{props.name}</p>
        </div>
    )
}

const jsx = (
    <section>
        <h1>慢慢慢</h1>
        <h1>全栈</h1>
        <a href="https://www.kaikeba.com">kkb</a>
        <FunctionComponent name='函数组件'/>
        <ClassComponent name='类组件'/>
        <>
            <li>xixi</li>
            <li>haha</li>
        </>
        {/* <Example /> */}
    </section>
)

ReactDOM.render(jsx, document.getElementById("root"));

//* 不同节点的渲染
//原生标签节点  比如div a等   document.createElement
//文本节点 document.createTextNode || node.textContext || 或者是node.nodeValue
//函数组件
//类组件
//Fragment



//fiber 节点
// ** fiber 结构
//type 类型
//props 属性
// child 第一个子节点  fiber
// sibling 下一个兄弟节点 fiber
// return 父节点 fiber
// stateNode 原生标签的dom节点
