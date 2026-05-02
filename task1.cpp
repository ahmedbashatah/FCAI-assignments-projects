#include <iostream>
#include <string>
using namespace std;

class Student {
public:
    string name;
    int id;
    float gpa;

    Student(string n = "", int i = 0, float g = 0.0) {
        name = n;
        id = i;
        gpa = g;
    }
};

class Node {
public:
    Student data;
    Node* next;

    Node(Student s) {
        data = s;
        next = NULL;
    }
};

class StudentList {
private:
    Node* head;

public:
    StudentList() { head = NULL; }
    ~StudentList();

    void insertStudent(Student s);
    bool deleteStudent(int id);
    Student* search(int id);
    void display();
    int size();
};

StudentList::~StudentList() {
    Node* current = head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        delete temp;
    }
}

void StudentList::insertStudent(Student s) {
    Node* newNode = new Node(s);

    if (head == NULL || s.id < head->data.id) {
        newNode->next = head;
        head = newNode;
        return;
    }

    Node* current = head;
    while (current->next != NULL && current->next->data.id < s.id) {
        current = current->next;
    }

    newNode->next = current->next;
    current->next = newNode;
}

bool StudentList::deleteStudent(int id) {
    if (head == NULL) return false;

    if (head->data.id == id) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return true;
    }

    Node* current = head;
    while (current->next != NULL && current->next->data.id != id) {
        current = current->next;
    }

    if (current->next == NULL) return false;

    Node* temp = current->next;
    current->next = current->next->next;
    delete temp;
    return true;
}

Student* StudentList::search(int id) {
    Node* current = head;
    while (current != NULL) {
        if (current->data.id == id) return &current->data;
        current = current->next;
    }
    return NULL;
}

void StudentList::display() {
    Node* current = head;
    while (current != NULL) {
        cout << current->data.id << " - " << current->data.name
            << " - " << current->data.gpa << endl;
        current = current->next;
    }
}

int StudentList::size() {
    int count = 0;
    Node* current = head;
    while (current != NULL) {
        count++;
        current = current->next;
    }
    return count;
}

int main() {
    StudentList list;

    list.insertStudent(Student("Ali", 5, 3.1));
    list.insertStudent(Student("Sara", 2, 2.7));
    list.insertStudent(Student("Omar", 8, 2.9));
    list.insertStudent(Student("Salem", 4, 3.6));


    cout << "Students List:\n";
    list.display();

    cout << "\nSearching ID 5:\n";
    Student* s = list.search(5);
    if (s) cout << s->name << " found\n";
    else cout << "Not found\n";

    cout << "\nSize = " << list.size() << endl;

    cout << "\nDeleting ID 2\n";
    list.deleteStudent(2);
    list.display();

    return 0;
}
