class Node {
  value = null;
  left = null;
  right = null;

  constructor(value) {
    this.value = value;
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

function prepArray(array) {
  array.sort((a, b) => a - b);
  for (let i = 1; i < array.length; i++) {
    if (array[i] === array[i - 1]) {
      array.splice(i, 1);
      i--; // Recheck the same index
    }
  }
  return array;
}

function buildTree(array, left = 0, right = array.length - 1) {
  if (left > right) {
    return null;
  }
  let middle = Math.floor((left + right) / 2);
  let leftSub = buildTree(array, left, middle - 1);
  let rightSub = buildTree(array, middle + 1, right);
  const newNode = new Node(array[middle]);
  newNode.left = leftSub;
  newNode.right = rightSub;
  return newNode;
}

class Tree {
  root = null;
  constructor(array) {
    array = prepArray(array);
    this.root = buildTree(array);
  }

  insert(value) {
    let currNode = this.root;
    const newNode = new Node(value);

    while (currNode !== null) {
      if (value < currNode.value) {
        if (currNode.left === null) {
          currNode.left = newNode;
          break;
        }
        currNode = currNode.left;
      } else if (value > currNode.value) {
        if (currNode.right === null) {
          currNode.right = newNode;
          break;
        }
        currNode = currNode.right;
      } else {
        console.log(`A node with value ${value} already exists!`);
        return;
      }
    }

    if (!this.isBalanced()) {
      this.#rebalance();
    }
  }

  deleteItem(value) {
    let currNode = this.root;
    let parent = null;

    while (currNode !== null) {
      if (currNode.value === value) {
        break;
      }
      parent = currNode;
      if (value < currNode.value) {
        currNode = currNode.left;
      } else if (value > currNode.value) {
        currNode = currNode.right;
      }
    }

    if (currNode === null) return; // Not found

    if (currNode.left === null && currNode.right === null) {
      if (parent === null) {
        this.root = null;
      } else if (parent.left === currNode) {
        parent.left = null;
      } else {
        parent.right = null;
      }
      return;
    }

    if (
      (currNode.left === null && currNode.right !== null) ||
      (currNode.left !== null && currNode.right === null)
    ) {
      let child = currNode.left !== null ? currNode.left : currNode.right;
      if (parent === null) {
        this.root = child;
      } else if (parent.left === currNode) {
        parent.left = child;
      } else {
        parent.right = child;
      }
      return;
    }

    let succParent = currNode;
    let succ = currNode.right;
    while (succ !== null && succ.left !== null) {
      succParent = succ;
      succ = succ.left;
    }
    currNode.value = succ.value;
    if (succParent === currNode) {
      currNode.right = succ.right;
    } else if (succParent.left === succ) {
      succParent.left = succ.right;
    }
  }

  find(value) {
    let currNode = this.root;
    while (currNode !== null) {
      if (currNode.value === value) {
        return currNode;
      }
      if (value < currNode.value) {
        currNode = currNode.left;
      } else {
        currNode = currNode.right;
      }
    }
    return false;
  }

  levelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Expected a function!');
    }
    const queue = [];
    if (this.root !== null) queue.push(this.root);
    while (queue.length !== 0) {
      const u = queue.shift();
      callback(u);
      if (u.left) queue.push(u.left);
      if (u.right) queue.push(u.right);
    }
  }

  preOrderForEach(callback) {
    function preorder(node) {
      if (!node) return;
      callback(node);
      preorder(node.left);
      preorder(node.right);
    }
    preorder(this.root);
  }

  inOrderForEach(callback) {
    function inorder(node) {
      if (!node) return;
      inorder(node.left);
      callback(node);
      inorder(node.right);
    }
    inorder(this.root);
  }

  postOrderForEach(callback) {
    function postorder(node) {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      callback(node);
    }
    postorder(this.root);
  }

  height(value) {
    function getHeight(node) {
      if (!node) return 0;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
    const node = this.find(value);
    return node ? getHeight(node) : 0; // Safety if node not found
  }

  depth(value) {
    let node = this.root;
    let depth = 0;
    while (node !== null && node.value !== value) {
      if (value > node.value) {
        node = node.right;
      } else if (value < node.value) {
        node = node.left;
      }
      depth += 1;
    }
    return node === null ? -1 : depth; // Changed: return -1 if not found
  }

  isBalanced() {
    const check = (node) => {
      if (!node) return 0;
      let left = check(node.left);
      if (left === -1) return -1;
      let right = check(node.right);
      if (right === -1) return -1;
      if (Math.abs(left - right) > 1) return -1;
      return Math.max(left, right) + 1;
    };
    return check(this.root) !== -1;
  }

  #rebalance() {
    const orderedElements = [];
    this.inOrderForEach((node) => {
      orderedElements.push(node.value);
    });
    this.root = buildTree(orderedElements);
  }
}

// usage
const array = [];
for (let i = 1; i <= 20; i++) {
  array.push(Math.floor(Math.random() * 100));
}
const tree = new Tree(array);

console.log('====== IS TREE BALANCED? ======');
console.log(tree.isBalanced());

tree.insert(69);
prettyPrint(tree.root);

console.log('====== LEVEL ORDER ======');
tree.levelOrderForEach((node) => {
  console.log(node.value);
});

console.log('====== PREORDER ======');
tree.preOrderForEach((node) => {
  console.log(node.value);
});

console.log('====== POSTORDER ======');
tree.postOrderForEach((node) => {
  console.log(node.value);
});

console.log('====== INORDER ======');
tree.inOrderForEach((node) => {
  console.log(node.value);
});

for (let i = 0; i < 20; i++) {
  tree.insert(Math.floor(Math.random() * 100) + 100);
}

prettyPrint(tree.root);

console.log('====== INORDER AFTER REBALANCING ======');
tree.inOrderForEach((node) => {
  console.log(node.value);
});

console.log('====== LEVEL ORDER ======');
tree.levelOrderForEach((node) => {
  console.log(node.value);
});

console.log('====== PREORDER ======');
tree.preOrderForEach((node) => {
  console.log(node.value);
});

console.log('====== POSTORDER ======');
tree.postOrderForEach((node) => {
  console.log(node.value);
});

console.log('====== INORDER ======');
tree.inOrderForEach((node) => {
  console.log(node.value);
});
