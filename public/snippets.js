// SNIPPETS: language folders & files
// You can modify this file to add more programs without touching script.js

window.SNIPPETS = {
  python: [
    {
      id: "py-hello",
      fileName: "hello_world.py",
      lang: "Python",
      prismLang: "python",
      runLang: "python",
      code: `print("Hello, World!")`
    },
    {
      id: "py-factorial",
      fileName: "factorial.py",
      lang: "Python",
      prismLang: "python",
      runLang: "python",
      code: `def factorial(n: int) -> int:
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

if __name__ == "__main__":
    print(factorial(5))`
    }
  ],
  java: [
    {
      id: "java-main",
      fileName: "Main.java",
      lang: "Java",
      prismLang: "java",
      runLang: "java",
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`
    },
    {
      id: "java-binary-search",
      fileName: "BinarySearch.java",
      lang: "Java",
      prismLang: "java",
      runLang: "java",
      code: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {1, 4, 7, 10, 13};
        int idx = search(arr, 10);
        System.out.println("Index = " + idx);
    }
}`
    }
  ],
  cpp: [
    {
      id: "cpp-selection-sort",
      fileName: "selection_sort.cpp",
      lang: "C++",
      prismLang: "cpp",
      runLang: "cpp",
      code: `#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
        }
    }
}

int main() {
    int arr[] = {5, 2, 8, 1, 3};
    int n = sizeof(arr) / sizeof(int);

    selectionSort(arr, n);

    cout << "Sorted: ";
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    return 0;
}`
    },
    {
      id: "cpp-max",
      fileName: "max_element.cpp",
      lang: "C++",
      prismLang: "cpp",
      runLang: "cpp",
      code: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {3, 8, 1, 9, 2};
    int n = sizeof(arr) / sizeof(int);
    int mx = arr[0];
    for (int i = 1; i < n; i++) {
        mx = max(mx, arr[i]);
    }
    cout << "Max = " << mx << endl;
    return 0;
}`
    }
  ],
  c: [
    {
      id: "c-sum",
      fileName: "sum_array.c",
      lang: "C",
      prismLang: "c",
      runLang: "c",
      code: `#include <stdio.h>

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = sizeof(arr) / sizeof(int);
    int sum = 0;
    for (int i = 0; i < n; i++) sum += arr[i];
    printf("Sum = %d\\n", sum);
    return 0;
}`
    },
    {
      id: "c-factorial",
      fileName: "factorial.c",
      lang: "C",
      prismLang: "c",
      runLang: "c",
      code: `#include <stdio.h>

int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("%d\\n", factorial(5));
    return 0;
}`
    }
  ],
  javascript: [
    {
      id: "js-sum",
      fileName: "sum.js",
      lang: "JavaScript",
      prismLang: "javascript",
      runLang: "javascript",
      code: `function sum(a, b) {
  return a + b;
}

console.log(sum(5, 7));`
    },
    {
      id: "js-greet",
      fileName: "greet.js",
      lang: "JavaScript",
      prismLang: "javascript",
      runLang: "javascript",
      code: `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Raviranjan");`
    }
  ]
};
