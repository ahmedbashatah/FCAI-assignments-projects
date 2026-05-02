#ifndef HEAP_H
#define HEAP_H

#include <iostream>
#include <string>
#include <algorithm> 
#include "BST.h"     
using namespace std;
const int MAX_CATEGORIES = 20; 

class MinHeap {
private:
    Task* heapArray;
    int capacity;
    int heap_size;

    void heapifyDown(int i) {
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        int smallest = i;

        if (l < heap_size && heapArray[l].duration < heapArray[i].duration) {
            smallest = l;
        }
        if (r < heap_size && heapArray[r].duration < heapArray[smallest].duration) {
            smallest = r;
        }

        if (smallest != i) {
            swap(heapArray[i], heapArray[smallest]);
            heapifyDown(smallest);
        }
    }

    void heapifyUp(int i) {
        while (i != 0 && heapArray[(i - 1) / 2].duration > heapArray[i].duration) {
            swap(heapArray[i], heapArray[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }

public:
    MinHeap(int cap) : capacity(cap), heap_size(0) {
        heapArray = new Task[capacity];
    }

    ~MinHeap() {
        delete[] heapArray;
    }

    void insertTask(const Task& t) {
        if (heap_size == capacity) {
            return;
        }
        heap_size++;
        int i = heap_size - 1;
        heapArray[i] = t;
        heapifyUp(i);
    }

    Task extractMin() {
        if (heap_size <= 0) {
            Task empty = {"", -1, ""};
            return empty;
        }
        if (heap_size == 1) {
            heap_size--;
            return heapArray[0];
        }

        Task root = heapArray[0];
        heapArray[0] = heapArray[heap_size - 1];
        heap_size--;
        heapifyDown(0);

        return root;
    }

    bool isEmpty() const {
        return heap_size == 0;
    }

    void displayAndSummarizeCompletedTasks() {
        MinHeap tempHeap(capacity);
        for (int i = 0; i < heap_size; i++) {
            tempHeap.insertTask(heapArray[i]);
        }

        string categoryNames[MAX_CATEGORIES];
        int categoryCounts[MAX_CATEGORIES] = {0};
        int categoryIndex = 0;

        cout << "Completed tasks (Duration Ascending):" << endl;
        while (!tempHeap.isEmpty()) {
            Task t = tempHeap.extractMin();
            if (t.duration != -1) {
                cout << t.description << ", " << t.duration << ", " << t.category << endl;

                bool found = false;
                for (int i = 0; i < categoryIndex; i++) {
                    if (categoryNames[i] == t.category) {
                        categoryCounts[i]++;
                        found = true;
                        break;
                    }
                }
                
                if (!found && categoryIndex < MAX_CATEGORIES) {
                    categoryNames[categoryIndex] = t.category;
                    categoryCounts[categoryIndex] = 1;
                    categoryIndex++;
                }
            }
        }

        cout << "\nNumber of completed tasks per category:" << endl;
        for (int i = 0; i < categoryIndex; i++) {
            cout << categoryNames[i] << ": " << categoryCounts[i] << endl;
        }
    }
};

#endif // HEAP_H