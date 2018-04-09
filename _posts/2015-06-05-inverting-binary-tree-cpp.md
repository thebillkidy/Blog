---
layout: post
current: post
cover: 'assets/images/covers/algorithms2.jpg'
navigation: True
title: Inverting a binary tree in C++
date: 2015-06-05 18:41:00
tags: algorithms, cpp, c++
class: post-template
subclass: 'post tag-algorithms'
author: xavier
---

So not so long ago (10th of June) [Max Howell](https://twitter.com/mxcl) tweeted a post stating:

Google: 90% of our engineers use the software you wrote (Homebrew),
but you can’t invert a binary tree on a whiteboard so fuck off.

This post got me started for solving this particular problem because it really is not that hard to solve.

Let's start by explaining the problem in detail with an example. Take for example this tree:

4
/ \
2 7
/ \ / \
1 3 6 9

Inverting it would result into:

4
/ \
7 2
/ \ / \
9 6 3 1

If we analyse this problem we can see that the only thing that we have to do is to traverse the tree in level order and swap the nodes.

So let's get started!

First we need to create a simple program that will allow us to actually read in a tree:

```cpp
#include

struct TreeNode {
  int val;
  TreeNode *left;
  TreeNode *right;
  explicit TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* invertTree(TreeNode* root) {
  /* Work to be done here */
  return root;
}

/* PreOrder printing printing */
void printTree(TreeNode* root) {
  std::cout << root->val << std::endl; if (root->left)
  printTree(root->left);

  if (root->right)
    printTree(root->right);
  }
}

int main(int argc, char ** argv) {
  TreeNode *root = new TreeNode(4);
  root->left = new TreeNode(2);
  root->right = new TreeNode(7);
  root->left->left = new TreeNode(1);
  root->left->right = new TreeNode(3);
  root->right->left = new TreeNode(6);
  root->right->right = new TreeNode(9);

  printTree(root);
  std::cout << std::endl;

  std::cout << std::endl; printTree(invertTree(root)); /* Cleanup */ delete root->right->right;
  delete root->right->left;
  delete root->left->left;
  delete root->left->right;
  delete root->left;
  delete root->right;
  delete root;
}
```

Once we have that we will fill in the invertTree method. This method accepts our root node but also has to return the root node. Because of this we will need to create a sub-method that will handle our inversion. This inversion works by just saving our nodes as temporary ones and then swapping the nodes. We now recursively call this sub-method for the left and the right node and on the end we will have our inversed tree.

Also note that I have printed the binary tree in preorder for convenience and fast writing of the code.

Result code:

```
#include

struct TreeNode {
  int val;
  TreeNode *left;
  TreeNode *right;
  explicit TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void swap_nodes(TreeNode* root) {
  /* Swap */
  TreeNode *tempRight = root->right;
  TreeNode *tempLeft = root->left;

  root->left = tempRight;
  root->right = tempLeft;

  /* Repeat for the other nodes */
  if (root->left) {
    swap_nodes(root->left);
  }

  if (root->right)
    swap_nodes(root->right);
  }
}

TreeNode* invertTree(TreeNode* root) {
  swap_nodes(root);

  return root;
}

/* PreOrder printing printing */
void printTree(TreeNode* root) {
  std::cout << root->val << std::endl; if (root->left)
  printTree(root->left);

  if (root->right)
    printTree(root->right);
  }
}

int main(int argc, char ** argv) {
  TreeNode *root = new TreeNode(4);
  root->left = new TreeNode(2);
  root->right = new TreeNode(7);
  root->left->left = new TreeNode(1);
  root->left->right = new TreeNode(3);
  root->right->left = new TreeNode(6);
  root->right->right = new TreeNode(9);

  printTree(root);
  std::cout << std::endl;

  std::cout << std::endl; printTree(invertTree(root)); /* Cleanup */ delete root->right->right;
  delete root->right->left;
  delete root->left->left;
  delete root->left->right;
  delete root->left;
  delete root->right;
  delete root;
}
```

If anybody has comments about this code or sees anything that is wrong / should be fixed please drop a comment below or send me an email so I can address this issue.

> Also thanks to LeetCode for providing the structure of the TreeNode and the basic question.
