#include <iostream>
using namespace std;

class Node {
public:
    char data;
    Node* next;
    Node* prev;

    Node(char c) {
        data = c;
        next = prev = NULL;
    }
};

class MyStringList {
private:
    Node* head;
    Node* tail;

public:
    MyStringList() { head = tail = NULL; }

    void pushBack(char c) {
        Node* n = new Node(c);
        if (!head) {
            head = tail = n;
            return;
        }
        tail->next = n;
        n->prev = tail;
        tail = n;
    }

    void display() {
        Node* ptr = head;
        while (ptr) {
            cout << ptr->data;
            ptr = ptr->next;
        }
        cout << endl;
    }

    void insertChar(int position, char c) {
        Node* n = new Node(c);
        if (position == 0 || !head) {
            n->next = head;
            if (head) head->prev = n;
            head = n;
            if (!tail) tail = n;
            return;
        }

        Node* ptr = head;
        for (int i = 0; ptr && i < position - 1; i++)
            ptr = ptr->next;

        if (!ptr) { pushBack(c); return; }

        n->next = ptr->next;
        if (ptr->next) ptr->next->prev = n;
        ptr->next = n;
        n->prev = ptr;
        if (ptr == tail) tail = n;
    }

    void deleteChar(int position) {
        if (!head) return;

        Node* ptr = head;
        for (int i = 0; ptr && i < position; i++)
            ptr = ptr->next;
        if (!ptr) return;

        if (ptr->prev) ptr->prev->next = ptr->next;
        else head = ptr->next;

        if (ptr->next) ptr->next->prev = ptr->prev;
        else tail = ptr->prev;

        delete ptr;
    }

    void concat(MyStringList &other) {
        Node* ptr = other.head;
        while (ptr) {
            pushBack(ptr->data);
            ptr = ptr->next;
        }
    }

    MyStringList substring(int start, int length) {
        MyStringList sub;
        Node* ptr = head;

        for (int i = 0; ptr && i < start; i++)
            ptr = ptr->next;

        for (int i = 0; ptr && i < length; i++) {
            sub.pushBack(ptr->data);
            ptr = ptr->next;
        }
        return sub;
    }

    int search(string sub) {
        Node* ptr = head;
        int index = 0;

        while (ptr) {
            Node* temp = ptr;
            int i = 0;
            while (temp && i < sub.length() && temp->data == sub[i]) {
                temp = temp->next;
                i++;
            }
            if (i == sub.length()) return index;
            ptr = ptr->next;
            index++;
        }
        return -1;
    }

    void replace(string oldS, string newS) {
        int index = search(oldS);
        while (index != -1) {
            for (int i = 0; i < oldS.length(); i++)
                deleteChar(index);

            for (int i = 0; i < newS.length(); i++)
                insertChar(index + i, newS[i]);

            index = search(oldS);
        }
    }

    void reverseList() {
        Node* ptr = head;
        Node* temp = NULL;

        while (ptr) {
            temp = ptr->prev;
            ptr->prev = ptr->next;
            ptr->next = temp;
            ptr = ptr->prev;
        }

        if (temp) head = temp->prev;
    }
};


int main() {
    MyStringList L1, L2;
    string s1, s2;

    cout << "Enter string to add to list 1: ";
    cin >> s1;
    for (char c : s1) L1.pushBack(c);

    cout << "Enter string to add to list 2: ";
    cin >> s2;
    for (char c : s2) L2.pushBack(c);

    cout << "Concatenated Lists: ";
    L1.concat(L2);
    L1.display();

    int position;
    cout << "Choose a character by index to remove: ";
    cin >> position;
    L1.deleteChar(position);
    cout << "List after removal: ";
    L1.display();

    int start, length;
    cout << "Enter index and length to get substring: ";
    cin >> start >> length;
    MyStringList sub = L1.substring(start, length);
    cout << "Substring: ";
    sub.display();

    cout << "Search for a string in the list: ";
    string word; cin >> word;
    int index = L1.search(word);
    if (index == -1) cout << "Not found\n";
    else cout << "Found at index " << index << endl;

    string a, b;
    cout << "Enter 2 substrings to replace one with another: ";
    cin >> a >> b;
    L1.replace(a, b);
    cout << "List after replacement: ";
    L1.display();

    L1.reverseList();
    cout << "Reversed List: ";
    L1.display();
}
