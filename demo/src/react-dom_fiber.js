//vnode 虚拟dom节点
//node dom节点

// import { onCommitRoot } from "../../react/packages/react-reconciler/src/ReactFiberDevToolsHook.new";


// * vnode

// type 原生标签  string 
//      文本节点  没有type
//      函数组件 function  

//props 属性  如 className href id children


//wipRoot  正在工作的fiber得根节点
let wipRoot = null;
function render(vnode, container) {
    wipRoot = {
        type: "div",
        props: {
            children: {...vnode}
        },
        stateNode: container
    }
    nextUnitOfWork = wipRoot;
}

function isStringOrNumber(sth) {
    return typeof sth === 'string' || typeof sth === 'number'
}

//根据虚拟dom节点，生成真实dom节点
//给原生标签创建dom节点  真实dom
function createNode(workInProgress) {
    const {type, props} = workInProgress;
    let node = document.createElement(type);
    updateNode(node, props);

    return node;
}



//添加属性  更新dom节点属性  className id href
//源码中还处理了style 合成事件
function updateNode(node, nextVal) {
    Object.keys(nextVal)
    //  .filter(k => k !== 'children')
     .forEach(k => {
         if(k === "children") {
             if(isStringOrNumber(nextVal[k])) {
                 node.textContent = nextVal[k] + '';
             }
         }else {
            node[k] = nextVal[k]
         }
     })
}

function updateHostComponent(workInProgress) {
    if(!workInProgress.stateNode) {
        //创建dom节点
        workInProgress.stateNode = createNode(workInProgress)
    }

    //协调子节点
    reconcileChildren(workInProgress,workInProgress.props.children)

    console.log(workInProgress, 'workInProgress');
}

//拿到子节点 然后协调
function updateFunctionComponent(workInProgress) {
    const {type, props} = workInProgress;
    const child = type(props);

    reconcileChildren(workInProgress, child);
}

function updateClassComponent(workInProgress) {
    const {type, props} = workInProgress;
    const instance = new type(props);
    const child = instance.render();

    reconcileChildren(workInProgress, child);
}

function updateFragmentComponent(workInProgress) {
    reconcileChildren(workInProgress, workInProgress.props.children);
}




// 协调子节点
function reconcileChildren(workInProgress, children) {
    if(isStringOrNumber(children)) {
        return;
    }

    const newChildren = Array.isArray(children) ? children : [children];
    //记录上一个fiber节点（就是哥哥或者姐姐）
    let previousNewFiber = null;
    for (let i = 0; i < newChildren.length; i++) {
        const child = newChildren[i];
        
        let newFiber = {
            type: child.type,
            props: {...child.props},
            child: null,
            sibling: null,
            return: workInProgress,
            stateNode: null
        }
        if(i === 0) {
            // newFiber 是workInProgress第一个子fiber
            workInProgress.child = newFiber;
        }else {
            previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
    }

}

//下一个要渲染更新的任务 fiber
let nextUnitOfWork = null;

function performUnitOfWork(workInProgress) {
    //step1: 渲染更新fiber  
    // todo

    const {type} = workInProgress;
    if(typeof type === "string") {
        //原生标签节点
        updateHostComponent(workInProgress);
    }else if(typeof type === 'function') {
        type.prototype.isReactComponent  
        ? updateClassComponent(workInProgress)
        : updateFunctionComponent(workInProgress)
    }else {
        updateFragmentComponent(workInProgress)
    }

    
    //step2: 并且返回下一个(王朝的故事)
    //有长子
    if(workInProgress.child) {
        return workInProgress.child;
    }
    let nextFiber = workInProgress;
    while(nextFiber) {
        if(nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.return;
    }

}

function workLoop(IdleDeadline) {
    

    while(nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
        // 渲染更新fiber  并且返回下一个
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);//返回下一个要执行的任务
    }

    //commit  进行真实dom的操作
    if(!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
}

requestIdleCallback(workLoop);


function commitRoot() {
    commitWorker(wipRoot.child);
    wipRoot = null
}

function commitWorker(workInProgress) {
    if(!workInProgress) {
        return;
    }
    //step1 渲染更新自己
    //todo  vnode -> node  node更新到container
    //怎么拿到parentNode

    let parentNodeFiber = workInProgress.return;
    //fiber节点不一定有dom节点 比如Fragment Consumer
    while(!parentNodeFiber.stateNode) {
        parentNodeFiber = parentNodeFiber.return
    }
    let parentNode = parentNodeFiber.stateNode;

    if(workInProgress.stateNode) {
        parentNode.appendChild(workInProgress.stateNode);
    }

    //step2 渲染更新子节点
    commitWorker(workInProgress.child)
    //step3 渲染更新sibling
    commitWorker(workInProgress.sibling)
}




export default { render }