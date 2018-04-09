---
layout: post
current: post
cover: 'assets/images/covers/coding4.jpg'
navigation: True
title: Creating a LinkedList with C++
date: 2015-06-05 18:41:00
tags: algorithms, cpp, c++
class: post-template
subclass: 'post tag-coding tag-cpp'
author: xavier
---

Linked Lists are one of the fundamental data structures. The main usage of a Linked List is when constant insertion and deletion time is required, or when a dynamic list that can grow and shrink over time is needed.

A Linked List exists out of several __nodes__ that are linked to each other by using a pointer that points to the next node in the list. Every node also has it's data structure which will hold the data for this node.

__Note:__ A linked lists should be sorted by default.

### Schematic

![linked_list_schematic](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPN044U3V4N29iUUk)

### Filled In

![linked_list_filled_in](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPal9DUFVSeVFXTG8)

## Architecture, methods and attributes

Let's get started by naming the files and classes that we will need to build our LinkedList.

### Architecture

* __Main (main.cpp)__ This is our entry point of our application, we will demonstrate some of the created functionallity here so that we can see that the LinkedList works.

* __LinkedList (linkedlist.cpp, linkedlist.h)__ This class will be responsible of managing our different ListNode and add new nodes to it or remove nodes from it.
* __ListNode (listnode.cpp, listnode.h)__ A list node is our base class, this is what makes our LinkedList, so we will put data in those nodes and connect them to the next node. The next node is NULL on the last Node, this is to show that there are no more items.

### Methods

After we thought of the Architecture we are going to decide which methods our classes should have. This is important to think of in the beginning since we want to make sure to know in which order we should implement them.

A LinkedList should have the following methods:

* constructor &amp; destructor (Creates the LinkedList)
* get_size (Returns the amount of nodes in our LinkedList)
* print (Print the nodes of the LinkedList)
* search (Search after a node that has the given key)
* insert_front (Insert a new node with the given key at the front of the list)
* remove_front (Remove a node from the front of the list)
* insert (Insert a new item in the list, this is automatically sorted)
* remove (Removes an item from the list)

> We will make sure that the methods insert_front and remove_front are protected, we do this since we do not want to allow the main program to add items at the front. If we would allow this then we would fail to ensure that our LinkedList is sorted by default.

### Attributes

Attributes in a LinkedList are easy, there are just 2 things that we need:

* start_node (This is the starting node of our list, now we can traverse the whole list)
* size (Really important is that we keep a variable that will hold the size for us, if we correctly increase and decrease this variable then we are able to get the correct size every time. If we would calculate the size every time we call the get_size method, then we would have to traverse the whole list to get our size, which is a huge performance loss on big lists.)

## Starting to code our LinkedList

After creating the files explained above, we are finally ready to start programming our list. For our convenience we will start with creating our ListNode class and our LinkedList class.

### ListNode

Creating our node which is going to power the whole list. The header will just hold the method definitions and the attributes, so we created this straight away. While the ListNode is going to have the implementations of these definitions, we will implement these along the way one by one.

#### ListNode.h

```cpp
#ifndef LINKEDLIST_LISTNODE_H_
#define LINKEDLIST_LISTNODE_H_

typedef int T;
class ListNode {
private:
T m_key;
ListNode *m_next;

public:
ListNode();
~ListNode();
T get_key() const { return m_key; };
ListNode *get_next() { return m_next; };
void set_next(ListNode *next) { m_next = next; };
ListNode(const T&amp;);
ListNode(const T&amp;, ListNode *next);
}

#endif
```

> We use the standard code style guide written by google here: [http://google-styleguide.googlecode.com/svn/trunk/cppguide.html](http://google-styleguide.googlecode.com/svn/trunk/cppguide.html).

#### ListNode.cpp

Starting to create the ListNode, we created the file and we will start by implementing the constructor and the destructor.

We will have 3 constructors here, 1 base constructor and 2 copy constructors. One of the copy constructors makes sure that we can create nodes without having to call set_next the whole time. While the other one makes sure that we can both add a key instantly as set the next node for it.

(__Note:__ make sure to include the "listnode.h" above the first method.)

##### Constructor

```cpp
ListNode::ListNode() : m_key(0), m_next(NULL) {
};

ListNode::ListNode(const T &amp;key) : m_key(key), m_next(NULL) {
};

ListNode::ListNode(const T &amp;key, ListNode * next) : m_key(key), m_next(next) {
};
```

##### Destructor

We do not need to write a Destructor for the ListNode since we will remove all our nodes in the LinkedList class.

We however include it for later

```cpp
ListNode::~ListNode() {};
```

#### LinkedList.h

Now we can start creating our most important class, the LinkedList class. We will start by creating the method definitions as we did with the ListNode.

```cpp
#ifndef LINKEDLIST_LINKEDLIST_H_
#define LINKEDLIST_LINKEDLIST_H_

#include "ListNode.h"

using std::cin;
using std::cout;
using std::endl;
using std::ostream;

class ListNode;

typedef int T;
class LinkedList
{
private:
int m_size; // Keep the m_size, then we don't have to loop through it the whole time

public:
LinkedList();
~LinkedList();
int get_size() const { return m_size; };
void add (const T &amp;);
void remove (const T &amp;);
void add_front(const T &amp; key);
void print(ostream &amp; os) const;
void print() const;
void remove_front ();

protected:
ListNode * start_node; // Start node
ListNode * search (const T &amp; key);
};

#endif
```

#### LinkedList.cpp

Now we are at the main file that will let everything work that we have written so far, and that is the implementation of our LinkedList.

As mentioned above we will start by implementing the constructor and the destructor. After that we will implement the print methods so that we can test the other methods, then the get_size and as the last methods we will implement the add and remove methods.

##### Constructor

Nothing special about our constructor, we just set the size on 0 by default.

```cpp
LinkedList::LinkedList() : m_size(0)
{
}
```

##### Destructor

The destructor however is special, here we need to make sure that the memory used to create and hold the list gets cleared after usage. We do this since C++ doesn't automatically garbage collect our objects.

Clearing the linkedList should remove all the ListNodes from it and freeing the memory. We do this by creating a temp pointer, and then saying while we have nodes, set the start pointer to the next pointer and clear the temp pointer.

```cpp
LinkedList::~LinkedList() {
ListNode *h;

// While we have nodes, keep deleting them
while (m_start_node->get_next()) {
  h = m_start_node;
  m_start_node = m_start_node->get_next();

  delete h;
}

delete m_start_node;
}
```

##### Print

Let's start by implementing our main methods for the LinkedList class now. We start with the print method so that we can test if our program runs while we are implementing the other methods.

> Another way to ensure that a program works as inted is by using Unit Tests, I however won't cover that subject here, but there will be an article about this in the forseeable future.

To implement the Print method for a LinkedList we just have to say, If the start_node is not NULL and we have a next, assign a temporary pointer to the next. And while doing this keep printing our temporary pointer.

```cpp
void LinkedList::print(ostream &amp; os) const
{
  ListNode * h = start_node;

  while (h) {
    os << "Value: " << std::to_string(h->get_key()) << std::endl;
    h = h->get_next();
  }
}
```

> **Note:** As you can see in the code above, we accept the parameter **ostream**, this parameter allows us to generalise the output method. so for example, if we now call print(std::cout); then we are able to let the print method output this on the command line.

##### Search

Searching in a LinkedList is similary to printing a LinkedList, instead we also accept a Key parameter that references to the key that we are searching for. Then we create a while loop that loops through our list for as long as next is not NULL and we make sure that they key is not found yet!

```cpp
ListNode* LinkedList::search(const T &amp; key)
{
  ListNode * h = start_node;

  while (h &amp;&amp; h->get_key() != key)
  h = h->get_next();

  return h;
}
```

> If we would just create an if loop in our while loop and set a boolean if we found the key or not (like many programmers do), then we would create a small performance hog that will increase if our lists grow. This is because when you are setting a variable you are still looping through the whole list even though you found the element needed already. So that is why we loop till we found the key, then we know it is in there and then we just return out of our method.

##### Add and Remove at front (protected)

Adding items at the front of our LinkedList works like this:

![schema_add_front](https://drive.google.com/uc?export=view&amp;id=0B-cbbSwiSpTPX3djeHJFSzlwSFE)

Explained this means that we will create a new node, set the node it's next to our start_node, and then set the start_node to the newly created node.

For the removing, we just create a temp pointer, we set the start node to it. Then we set the start_node to the next node, and we remove the temp pointer, therefor removing the first node.

**Implementation (add_front):**

```cpp
void LinkedList::add_front(const T &amp;key) {
  // First create the new ListNode
  ListNode *node = new ListNode(key);

  // Set the node->next to the start_node
  node->set_next(m_start_node);

  // Set the start_node to the node
  m_start_node = node;
  m_size++;
}
```

**Implementation (remove_front):**

```cpp
void LinkedList::remove_front() {
  ListNode *h = m_start_node;
  m_start_node = m_start_node->get_next();
  delete h;
  m_size--;
}
```

> **Note:** do not forget, by calling the **new** keyword we are allocating space on the **heap**.

##### Add and Remove (public)

Now we will create the most difficult method for our List. That is the adding of items. This is difficult in terms that we will have to search for the position that we want to enter the item at (This because a LinkedList is sorted by default).

To correctly implement the add method, we will work in several steps. This because there are some factors that we will need to think about.

1. What if start_node is NULL?
2. What if the first node is bigger then the node we are adding?
3. We have to implement at the ->next, but how do we know the previous pointer? (This because we know that the one we are at now is already bigger)

**Implementation (add):**

```cpp
void LinkedList::add(T const &amp;key) {
  ListNode *node = new ListNode(key);
  m_size++;

  // If the start_node is NULL, just set the startnode to our new node.
  if (!m_start_node) {
    m_start_node = node;
    return;
  }

  // If the first node is bigger then the new node, then set the new node as first node
  if (m_start_node->get_key() > key) {
    node->set_next(m_start_node);
    m_start_node = node;
    return;
  }

  // Else search for a spot to enter it, this spot is when the next node is bigger then the current node.
  ListNode *h = m_start_node;
  while (h->get_next() &amp;&amp; h->get_next()->get_key() < key) {
    h = h->get_next();
  }

  node->set_next(h->get_next());
  h->set_next(node);
}
```

**Implementation (Remove):** Remove accepts a key that we need to remove

```cpp
void LinkedList::remove(T const &amp;key) {
  ListNode *h = m_start_node;

  // If first node, then remove the first node
  if (h &amp;&amp; h->get_key() > key) {
    remove_front();
    return;
  }

  while (h->get_next() &amp;&amp; h->get_next()->get_key() < key) {
    h = h->get_next();
  }

  ListNode *h2 = h->get_next();

  h->set_next(h->get_next()->get_next());
  delete h2;
  m_size--;
}
```

### Testing it all in the main

To test all the methods written above we create our main.cpp and we will create a few small test cases. You should always do this when creating a program, this to ensure that it will always work. Normally these test cases should be converted to Unit Tests, but this will be covered in a later article.

**Main.cpp**

```cpp
#include "LinkedList.h"

using std::cout;

int main() {
  cout << "Testing" << endl;

  LinkedList list;
  list.add(10);
  list.add(10);
  list.add(1);
  list.add(8);
  list.add(3);
  list.add(7);
  list.add(4);
  list.add(9);
  list.add(6);
  list.add(5);
  list.add(2);

  cout << "Added " << list.get_size() << " nodes." << endl;

  // Remove both 10's, 4 and 1 (Testing remove front, remove end, remove double, remove mid)
  list.remove(10);
  list.remove(10);
  list.remove(4);
  list.remove(1);

  list.print(std::cout);

  cout << "Out of scope, Removed list, should show " << list.get_size() << " removed items" << endl;
}
```

## Conclusion

A linkedlist is tricky to implement, that's why this article goes in depth on this problem and tries to provide insight in how you should implement a linkedlist while still checking every single problem that can occur.

I am far from a professional C++ developer and while there may be better implementations, I believe this implementation can help a lot of beginning C++ developers to learn how they should tackle problems like this.

If you have any questions, or think there are better ways to implement this, feel free to leave a comment below.