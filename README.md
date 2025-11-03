# bst-js

Simple side-project done for The Odin Project.
Implemented a Binary Search Tree that rebalances itself.

## What I learned

1. Solidified my knowledge of how Binary Search Trees work

## How to Use

1. Create an array
2. Create a tree from that array with `New Tree(<your_array>)`

- You can insert a value with `tree.insert(value)`
- Methods that takes in a callback

  - `tree.levelOrderForEach(callback)`
  - `tree.preOrderForEach(callback)`
  - `tree.inOrderForEach(callback)`
  - `tree.postOrderForEach(callback)`

- `prettyPrint(tree.root)` to print the tree

- `tree.height(value)` to get the height of the node with the given value
- `tree.depth(value)` to get the depth of the node with the given value
- `tree.find(value)` returns the node with the given value, if it's not found, it returns `false`
- `tree.deleteItem(value)` deletes the node with the given value
- `tree.isBalanced()` returns `true` if the tree is balanced, `false` if not
