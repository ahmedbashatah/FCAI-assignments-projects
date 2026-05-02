#ifndef BST_H
#define BST_H

#include <iostream>
#include <string>
using namespace std;

class Task {
public:
    string description;
    int duration;
    string category;

    Task() {}

    Task(string d, int du, string c) {
        description = d;
        duration = du;
        category = c;
    }

    void print() {
        cout << "[" << description << ", " << duration << ", " << category << "]" << endl;
    }
};

class Node {
public:
    Task task;
    Node* left;
    Node* right;

    Node(Task t) {
        task = t;
        left = right = NULL;
    }
};

class BST {
private:
    Node* root;

    Node* insert(Node* node, Task task) {
        if (node == NULL)
            return new Node(task);

        if (task.duration <= node->task.duration)
            node->left = insert(node->left, task);
        else
            node->right = insert(node->right, task);

        return node;
    }

    void inorder(Node* node) {
        if (node == NULL) return;
        inorder(node->left);
        node->task.print();
        inorder(node->right);
    }

    void search(Node* node, int duration) {
        if (node == NULL) return;

        if (duration < node->task.duration)
            search(node->left, duration);
        else if (duration > node->task.duration)
            search(node->right, duration);
        else {
            node->task.print();
            search(node->left, duration);
            search(node->right, duration);
        }
    }

    void displayMore(Node* node, int duration) {
        if (node == NULL) return;

        if (node->task.duration >= duration) {
            displayMore(node->left, duration);
            node->task.print();
            displayMore(node->right, duration);
        } else {
            displayMore(node->right, duration);
        }
    }

    void displayLess(Node* node, int duration) {
        if (node == NULL) return;

        if (node->task.duration <= duration) {
            displayLess(node->left, duration);
            node->task.print();
            displayLess(node->right, duration);
        } else {
            displayLess(node->left, duration);
        }
    }

    Node* findMin(Node* node) {
        while (node->left != NULL)
            node = node->left;
        return node;
    }

    Node* remove(Node* node, int duration) {
        if (node == NULL) return NULL;

        if (duration < node->task.duration)
            node->left = remove(node->left, duration);
        else if (duration > node->task.duration)
            node->right = remove(node->right, duration);
        else {
            if (node->left == NULL && node->right == NULL) {
                delete node;
                return NULL;
            }
            else if (node->left == NULL) {
                Node* temp = node->right;
                delete node;
                return temp;
            }
            else if (node->right == NULL) {
                Node* temp = node->left;
                delete node;
                return temp;
            }
            else {
                Node* temp = findMin(node->right);
                node->task = temp->task;
                node->right = remove(node->right, temp->task.duration);
            }
        }
        return node;
    }

public:
    BST() {
        root = NULL;
    }

    void insert(Task task) {
        root = insert(root, task);
    }

    void displayAll() {
        inorder(root);
    }

    void search(int duration) {
        search(root, duration);
    }

    void displayMoreThan(int duration) {
        displayMore(root, duration);
    }

    void displayLessThan(int duration) {
        displayLess(root, duration);
    }

    void remove(int duration) {
        root = remove(root, duration);
    }
};

#endif
