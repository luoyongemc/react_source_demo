//vnode 虚拟dom节点
//node dom节点

// import { reconcileChildren } from "../../react/packages/react-reconciler/src/ReactFiberBeginWork.old";


// * vnode

// type 原生标签  string 
//      文本节点  没有type
//      函数组件 function  

//props 属性  如 className href id children

function render(vnode, container) {
    console.log(vnode, 'vnode');

    //step1 vnode->node  将虚拟dom转为真实dom
    const node = createNode(vnode);
    //step2 加入到容器节点中去
    container.appendChild(node)
}

function isStringOrNumber(sth) {
    return typeof sth === 'string' || typeof sth === 'number'
}

//根据虚拟dom节点，生成真实dom节点
function createNode(vnode) {
    let node;

    const {type} = vnode;
    //todo 根据虚拟dom节点，生成真实dom节点
    if(typeof type === 'string') {
        //原生标签节点
        node = updateHostComponent(vnode)
    }else if(isStringOrNumber(vnode)){
        //文本标签节点
        node = updateTextComponent(vnode)
    }else if(typeof type === 'function') { //类组件的类型也是function
        node = type.prototype.isReactComponent ? updateClassComponent(vnode) : updateFunctionComponent(vnode)
    }else {
        //渲染FragmentComponent
        node = updateFragmentComponent(vnode)
    }

    return node;
}

function updateFragmentComponent(vnode) {
    //源码中没有用createDocumentFragment，而是直接处理子节点
    const node = document.createDocumentFragment();
    reconcileChildren(node, vnode.props.children);
    return node;
}

//类组件
function updateClassComponent(vnode) {
    const {type, props} = vnode;
    const instance = new type(props);
    const child = instance.render();
    // vnode -> node
    const node = createNode(child);
    return node;
}

//函数组件
function updateFunctionComponent(vnode) {
    const {type, props} = vnode;
    const child = type(props);
    // vnode -> node
    const node = createNode(child);
    return node;
}

//文本节点
function updateTextComponent(vnode) {
    const node = document.createTextNode(vnode);
    return node;
}

//添加属性  更新dom节点属性  className id href
//源码中还处理了style 合成事件
function updateNode(node, nextVal) {
    Object.keys(nextVal)
     .filter(k => k !== 'children')
     .forEach(k => {
         node[k] = nextVal[k];
     })
}

//原生标签节点 div、a
function updateHostComponent(vnode) {
    const {type, props} = vnode;
    const node = document.createElement(type);
    updateNode(node, props)
    reconcileChildren(node, props.children)
    return node;
}
// function updateHostComponent(workInProgress) {
//     if(!workInProgress.stateNode) {
//         workInProgress.stateNode = createNode(workInProgress)
//     }
// }
// 遍历子节点 子节点是vnode，然后再vnode -> node  再插入parentNode中
function reconcileChildren(parentNode, children) {
    const newChildren = Array.isArray(children) ? children : [children];
    
    for (let i = 0; i < newChildren.length; i++) {
        const child = newChildren[i];
        //vnode -> node 再把node插入到parentNode中
        render(child,parentNode);
    }

}

// ***********fiber相关看react-dom-fiber.js

//下一个要渲染更新的任务 fiber
// let nextUnitOfWork = null;

// function performUnitOfWork(workInProgress) {
//     //step1: 渲染更新fiber  
//     // todo

//     const {type} = workInProgress;
//     if(typeof type === "string") {
//         //原生标签节点
//         updateHostComponent(workInProgress);
//     }


//     //step2: 并且返回下一个(王朝的故事)
//     //有长子
//     if(workInProgress.child) {
//         return workInProgress.child;
//     }
//     let nextFiber = workInProgress;
//     while(nextFiber) {
//         if(nextFiber.sibling) {
//             return nextFiber.sibling
//         }
//         nextFiber = nextFiber.return;
//     }

// }

// function workLoop(IdleDeadline) {
    

//     while(nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
//         // 渲染更新fiber  并且返回下一个
//         nextUnitOfWork = performUnitOfWork(nextUnitOfWork);//返回下一个要执行的任务
//     }

//     //commit  进行真实dom的操作
//     // if(!nextUnitOfWork) {}
// }

// requestIdleCallback(workLoop)




export default {render}