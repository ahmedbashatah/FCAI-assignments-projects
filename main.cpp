#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <limits>
#include "BST.h"
#include "heap.h"

using namespace std;

void readInput(BST& bst, const string& filename, int totalTasks) {
    ifstream file(filename);
    string line;
    Task t;
    int count = 0;

    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << endl;
        return;
    }


    while (count < totalTasks && getline(file, line)) {
        t.description = line;
        
        if (getline(file, line)) {
            try {
                t.duration = stoi(line);
            } catch (const std::invalid_argument& e) {
                t.duration = 0; 
            }
        } else break; 

        if (getline(file, line)) {
            t.category = line;
        } else break;

        bst.insertTask(t);
        count++;
    }
    file.close();
}

void displayMenu() {
    cout << "\n--- CS214: Task Manager Menu ---" << endl;
    cout << "1. Insert a task (using BST Class)" << endl;
    cout << "2. Display all (using BST Class)" << endl;
    cout << "3. Search for a task (using BST Class)" << endl;
    cout << "4. Remove a task (using BST Class)" << endl;
    cout << "5. Display less than (using BST Class)" << endl;
    cout << "6. Mark task as completed (remove from BST, insert into Min Heap)" << endl;
    cout << "7. Display completed tasks and the number of tasks completed per category (using Heap Class)" << endl;
    cout << "8. Exit" << endl;
    cout << "Enter number of option: ";
}

int main() {
    BST taskBST;
    MinHeap completedHeap(40); 
     
    
    
    taskBST.insertTask({"Study data structure", 60, "Educational"});
    taskBST.insertTask({"Go the gym", 60, "Health"});
    taskBST.insertTask({"Health", 20, "Health"});
    taskBST.insertTask({"Watch a podcast", 120, "Self development"});
    taskBST.insertTask({"Food", 30, "Food"});
    taskBST.insertTask({"Study software engineering", 60, "Educational"});
    taskBST.insertTask({"Reading a book", 20, "Self development"});
    taskBST.insertTask({"Tidy room", 15, "Other"});
    taskBST.insertTask({"Shopping", 20, "Other"});
    taskBST.insertTask({"Go to Library", 30, "Other"});
    taskBST.insertTask({"Make DS Assignment", 100, "Educational"});
    
    int choice;
    string desc;
    int duration;
    string category;
    string searchDesc;
    Task tempTask;

    do {
        displayMenu();
        if (!(cin >> choice)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            choice = 0; 
            continue;
        }
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        switch (choice) {
            case 1:
                cout << "Enter task description: ";
                getline(cin, desc);
                cout << "Enter duration: ";
                cin >> duration;
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "Enter category: ";
                getline(cin, category);
                taskBST.insertTask({desc, duration, category});
                cout << "The task is added." << endl;
                break;

            case 2:
                cout << "\n--- All Tasks in BST (Sorted by Description) ---" << endl;
                taskBST.displayAllTasks();
                break;

            case 3:
                cout << "Enter part of description: ";
                getline(cin, searchDesc);
                tempTask = *taskBST.findAndReturnTask(searchDesc);
                if (tempTask.duration != -1) {
                    cout << "Task found: " << tempTask.description << ", " << tempTask.duration << ", " << tempTask.category << endl;
                } else {
                    cout << "/0 tasks are found." << endl;
                }
                break;

            case 4:
                cout << "Enter task description to remove: ";
                getline(cin, desc);
                tempTask = taskBST.removeTask(desc);
                if (tempTask.duration != -1) {
                    cout << "/1 task is removed." << endl;
                } else {
                    cout << "Task not found." << endl;
                }
                break;

            case 5:
                cout << "Enter duration less than: ";
                cin >> duration;
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "\n--- Tasks with Duration < " << duration << " ---" << endl;
                taskBST.displayLessDuration(duration);
                break;

            case 6:
                cout << "Enter task description to mark as completed: ";
                getline(cin, desc);
                tempTask = taskBST.removeTask(desc);
                if (tempTask.duration != -1) {
                    completedHeap.insertTask(tempTask);
                    cout << tempTask.description << " marked as completed and moved to Min Heap." << endl;
                } else {
                    cout << "Task not found in BST." << endl;
                }
                break;

            case 7:
                completedHeap.displayAndSummarizeCompletedTasks();
                break;

            case 8:
                cout << "Exiting Task Manager." << endl;
                break;

            default:
                cout << "Invalid option. Please try again." << endl;
        }
    } while (choice != 8);

    return 0;
}