/**
 * questionBank.js
 * ------------------------------------------------------
 * Comprehensive Technical Domain Knowledge Base & Semantic Synthesizer.
 * 
 * Curated Technical Domains (12 Pure Engineering & Computer Science Disciplines):
 * 1. C Programming Language (`c`)
 * 2. C++ Programming Language (`cpp`)
 * 3. Data Structures & Algorithms (`dsa`)
 * 4. JavaScript Programming (`javascript`)
 * 5. Python Programming (`python`)
 * 6. Java Programming & JVM Architecture (`java`)
 * 7. Database Management Systems (DBMS) & SQL (`sql`)
 * 8. Object-Oriented Programming (OOP) Concepts (`oop`)
 * 9. Operating Systems Concepts (`os`)
 * 10. Computer Networks Concepts (`networks`)
 * 11. Web Development Fundamentals (`web_dev`)
 * 12. Software Engineering Basics (`software_engineering`)
 * 
 * Features:
 * - 100% Restricted to Technical & Software Engineering Domains.
 * - Ordered Curriculum Roadmaps mapping 10-30 questions systematically across subtopics.
 * - Granular Subtopic-by-Subtopic progressive inquiry.
 * - Zero-repetition deduplication and balanced distractor lengths.
 * - Pedagogical, spoiler-free approach hints.
 * - Procedural Technical Synthesizer for arbitrary engineering subtopics.
 */

export const TOPIC_BANKS = {
  // =========================================================================
  // 0. C Programming Language
  // =========================================================================
  c: {
    name: "C Programming Language",
    aliases: [
      "c programming language", "c programming", "c language", "c lang",
      "ansi c", "c99", "c11", "c17", "c"
    ],
    subtopics: [
      "Pointers, Pointer Arithmetic & Address Operators",
      "Dynamic Memory Management (malloc, calloc, realloc, free)",
      "Structures, Unions & Typedefs",
      "Arrays, Strings & Standard string.h Functions",
      "Functions, Parameter Passing by Pointer & Recursion",
      "Bitwise Manipulation & Bit-fields",
      "Preprocessor Directives, Macros & Header Guards",
      "File I/O (fopen, fread, fwrite, fclose)",
      "Memory Layout (Stack, Heap, Data, BSS & Text Segments)",
      "Type Casting, Void Pointers & Function Pointers"
    ],
    easy: [
      {
        question: "What is the return type and primary function of the `sizeof` operator in C?",
        options: [
          "It yields the size in bytes of a type or object as a compile-time constant of type `size_t`.",
          "It returns the number of dynamic heap elements allocated to a pointer variable at runtime.",
          "It calculates the total number of characters in a string excluding the null terminator byte.",
          "It returns a 32-bit signed integer representing the memory address of the target variable."
        ],
        correctAnswer: "It yields the size in bytes of a type or object as a compile-time constant of type `size_t`.",
        explanation: "`sizeof` is a compile-time operator that computes the storage size in bytes of an expression or type, returning a value of unsigned integer type `size_t`.",
        difficulty: "easy",
        subCluster: "pointers_memory",
        conceptTag: "Pointers, Pointer Arithmetic & Address Operators",
        approachHint: "Is `sizeof` evaluated at runtime like a library function or by the compiler during translation?",
        benchmarkSeconds: 18
      },
      {
        question: "What is the key functional difference between `malloc()` and `calloc()` in the C standard library (`stdlib.h`)?",
        options: [
          "`calloc()` initializes all allocated bytes to zero, whereas `malloc()` leaves memory uninitialized.",
          "`malloc()` allocates heap memory, while `calloc()` allocates temporary space on the CPU stack.",
          "`calloc()` automatically frees memory when scope exits, while `malloc()` requires `free()`.",
          "`malloc()` accepts element count and element size, while `calloc()` accepts total bytes only."
        ],
        correctAnswer: "`calloc()` initializes all allocated bytes to zero, whereas `malloc()` leaves memory uninitialized.",
        explanation: "`calloc(num, size)` allocates and clears memory by setting all bits to zero. `malloc(totalBytes)` allocates raw uninitialized memory containing indeterminate values.",
        difficulty: "easy",
        subCluster: "dynamic_memory",
        conceptTag: "Dynamic Memory Management (malloc, calloc, realloc, free)",
        approachHint: "Consider memory initialization: which allocator clears memory to zero before returning?",
        benchmarkSeconds: 20
      },
      {
        question: "How are standard strings represented and terminated in standard C?",
        options: [
          "As contiguous arrays of `char` elements terminated by a null byte (`'\\0'`).",
          "As length-prefixed dynamic objects that store string length in the first byte.",
          "As immutable memory sequences managed by the operating system kernel runtime.",
          "As linked lists of 16-bit Unicode characters ending with an EOF sentinel value."
        ],
        correctAnswer: "As contiguous arrays of `char` elements terminated by a null byte (`'\\0'`).",
        explanation: "C strings are null-terminated character sequences (`char[]`), using the sentinel value `0` / `'\\0'` to mark the end of the string.",
        difficulty: "easy",
        subCluster: "strings_arrays",
        conceptTag: "Arrays, Strings & Standard string.h Functions",
        approachHint: "How do functions like `strlen()` know when a character array ends without an explicit length parameter?",
        benchmarkSeconds: 18
      },
      {
        question: "How does parameter passing work for primitive non-array variables in C functions?",
        options: [
          "All arguments are passed strictly by value, copying the value into local parameter storage.",
          "All arguments are passed by reference, directly sharing variable addresses by default.",
          "Arguments are evaluated lazily upon first access inside the executing function body.",
          "Integer types are passed by reference while floating-point types are passed by value."
        ],
        correctAnswer: "All arguments are passed strictly by value, copying the value into local parameter storage.",
        explanation: "C is strictly a pass-by-value language. To achieve pass-by-reference semantics, the programmer must explicitly pass pointers to variable addresses.",
        difficulty: "easy",
        subCluster: "functions_parameters",
        conceptTag: "Functions, Parameter Passing by Pointer & Recursion",
        approachHint: "Think about modifying a function parameter inside the function body: does the original variable in the caller change without pointers?",
        benchmarkSeconds: 18
      }
    ],
    medium: [
      {
        question: "What is the key structural difference between a `struct` and a `union` in C?",
        options: [
          "In a `struct`, members have distinct memory offsets; in a `union`, all members share the same memory location.",
          "In a `union`, members have distinct memory offsets; in a `struct`, all members share the same memory location.",
          "A `struct` can contain pointer variables, while a `union` is restricted strictly to scalar primitive integers.",
          "A `union` is allocated on the dynamic heap, while a `struct` is restricted exclusively to the call stack."
        ],
        correctAnswer: "In a `struct`, members have distinct memory offsets; in a `union`, all members share the same memory location.",
        explanation: "A struct allocates separate storage for each member (sum of sizes + padding). A union overlays all members at the same base address (size of largest member).",
        difficulty: "medium",
        subCluster: "structs_unions",
        conceptTag: "Structures, Unions & Typedefs",
        approachHint: "Consider memory overlap: does a union allocate total memory equal to the sum of its fields or only the largest field?",
        benchmarkSeconds: 24
      },
      {
        question: "In C pointer arithmetic, what is the effect of incrementing a pointer variable declared as `int *ptr` (`ptr++`) on a 64-bit architecture?",
        options: [
          "The numeric address value in `ptr` increases by `sizeof(int)` (typically 4 bytes).",
          "The numeric address value in `ptr` increases by exactly 1 byte regardless of type.",
          "The numeric address value in `ptr` increases by `sizeof(void*)` (typically 8 bytes).",
          "The numeric address value in `ptr` increments the integer value stored at that target address."
        ],
        correctAnswer: "The numeric address value in `ptr` increases by `sizeof(int)` (typically 4 bytes).",
        explanation: "Pointer arithmetic in C scales by the size of the referenced type (`sizeof(*ptr)`). Incrementing an `int*` advances the address by 4 bytes.",
        difficulty: "medium",
        subCluster: "pointer_arithmetic",
        conceptTag: "Pointers, Pointer Arithmetic & Address Operators",
        approachHint: "When iterating through an array using pointers, how does the compiler ensure you land precisely on the next element?",
        benchmarkSeconds: 22
      },
      {
        question: "What is the purpose of header guards (`#ifndef HEADER_H`, `#define HEADER_H`, `#endif`) in C header files?",
        options: [
          "They prevent multiple inclusion and redefinition errors when a header is included transitively across files.",
          "They instruct the linker to encrypt function signatures to prevent reverse engineering of binary objects.",
          "They allocate static global memory for all functions declared within that translation unit.",
          "They tell the preprocessor to automatically optimize away unused function prototypes at compile time."
        ],
        correctAnswer: "They prevent multiple inclusion and redefinition errors when a header is included transitively across files.",
        explanation: "Header guards prevent the preprocessor from copying the contents of a header file multiple times into the same translation unit, avoiding type/struct redefinition errors.",
        difficulty: "medium",
        subCluster: "preprocessor",
        conceptTag: "Preprocessor Directives, Macros & Header Guards",
        approachHint: "What happens during preprocessor macro expansion when two different `.h` files both `#include` the same third `.h` file?",
        benchmarkSeconds: 22
      }
    ],
    hard: [
      {
        question: "In C memory layout, in which segment are uninitialized global and uninitialized static variables stored?",
        options: [
          "The BSS (Block Started by Symbol) segment, which the OS kernel zeroes out before program execution.",
          "The Data segment, where explicit non-zero initialization constants are loaded directly from disk binary.",
          "The Stack segment, where frame pointers dynamically allocate local variables during call execution.",
          "The Text segment, which stores read-only CPU machine instructions marked with executable permissions."
        ],
        correctAnswer: "The BSS (Block Started by Symbol) segment, which the OS kernel zeroes out before program execution.",
        explanation: "Uninitialized global and static variables are placed in the BSS segment. It occupies no space in the disk executable file; the OS allocates and zeroes it at load time.",
        difficulty: "hard",
        subCluster: "memory_layout",
        conceptTag: "Memory Layout (Stack, Heap, Data, BSS & Text Segments)",
        approachHint: "Differentiate between initialized global data (Data segment) vs uninitialized globals that are zero-initialized by the OS at startup.",
        benchmarkSeconds: 30
      },
      {
        question: "How is a function pointer variable named `funcPtr` that takes an `int` parameter and returns a `double` declared in C?",
        options: [
          "`double (*funcPtr)(int);`",
          "`double *funcPtr(int);`",
          "`double (int) *funcPtr;`",
          "`(double*) funcPtr(int);`"
        ],
        correctAnswer: "`double (*funcPtr)(int);`",
        explanation: "`double (*funcPtr)(int)` declares a function pointer. Without parentheses around `*funcPtr`, `double *funcPtr(int)` declares a function returning a `double*`.",
        difficulty: "hard",
        subCluster: "function_pointers",
        conceptTag: "Type Casting, Void Pointers & Function Pointers",
        approachHint: "Pay close attention to operator precedence: `()` has higher precedence than `*`, requiring parentheses around `*funcPtr`.",
        benchmarkSeconds: 32
      }
    ]
  },

  // =========================================================================
  // 1. C++ Programming & Systems Architecture
  // =========================================================================
  cpp: {
    name: "C++ Programming Language",
    aliases: [
      "c++ programming language", "c++ programming", "c++", "cpp",
      "c plus plus", "c/c++", "modern c++", "cpp programming", "c++11", "c++14", "c++17", "c++20"
    ],
    subtopics: [
      "Pointers, References & Memory Layout",
      "Stack vs Heap Allocation & new/delete",
      "Object-Oriented Architecture & Virtual Tables",
      "RAII, Constructors & Rule of 3/5/0",
      "Templates, SFINAE & Generic Programming",
      "STL Containers, Iterators & Algorithms",
      "Smart Pointers (unique_ptr, shared_ptr, weak_ptr)",
      "Move Semantics, Rvalues & std::move",
      "Lambda Expressions & Functional Utilities",
      "Concurrency, Mutexes & Memory Model"
    ],
    easy: [
      {
        question: "What is the key difference between a pointer and a reference in standard C++?",
        options: [
          "A reference must be initialized upon declaration and cannot be reseated to bind to another object.",
          "A pointer cannot hold a null value, whereas a reference can freely refer to null memory addresses.",
          "A reference requires explicit dereferencing using the `*` operator on every read and write operation.",
          "A pointer cannot be used to iterate across contiguous elements stored inside an array."
        ],
        correctAnswer: "A reference must be initialized upon declaration and cannot be reseated to bind to another object.",
        explanation: "References in C++ are non-reseatable aliases that must be bound upon initialization, whereas pointers can be reassigned and can be null.",
        difficulty: "easy",
        subCluster: "pointers_references",
        conceptTag: "Pointers, References & Memory Layout",
        approachHint: "Think about whether you can change what an existing C++ reference points to after it has been created.",
        benchmarkSeconds: 20
      },
      {
        question: "What does the Resource Acquisition Is Initialization (RAII) idiom guarantee in modern C++?",
        options: [
          "Resources bound to an object lifetime are released deterministically in its destructor upon scope exit.",
          "All heap memory allocations are automatically garbage collected by the compiler runtime engine.",
          "Objects allocated on the call stack are preserved across multiple distinct thread invocations.",
          "Constructors are prohibited from throwing exceptions to ensure zero runtime performance overhead."
        ],
        correctAnswer: "Resources bound to an object lifetime are released deterministically in its destructor upon scope exit.",
        explanation: "RAII ties resource lifecycle to object lifetime: resources are acquired in constructors and released in destructors when scope ends.",
        difficulty: "easy",
        subCluster: "raii_lifetimes",
        conceptTag: "RAII, Constructors & Rule of 3/5/0",
        approachHint: "Consider how stack unwinding during exceptions ensures destructors still execute to clean up resources.",
        benchmarkSeconds: 20
      },
      {
        question: "What is the primary operational distinction between `std::vector` and `std::list` in the C++ Standard Template Library?",
        options: [
          "`std::vector` provides contiguous memory and O(1) random access; `std::list` is a doubly-linked list.",
          "`std::list` provides contiguous memory and O(1) random access; `std::vector` is a doubly-linked list.",
          "`std::vector` allocates elements on the stack, whereas `std::list` allocates elements exclusively on heap.",
          "`std::vector` allows fast O(1) middle insertions, whereas `std::list` requires O(n) element shifts."
        ],
        correctAnswer: "`std::vector` provides contiguous memory and O(1) random access; `std::list` is a doubly-linked list.",
        explanation: "std::vector stores elements contiguously for O(1) indexing and cache efficiency, while std::list is a doubly-linked list with non-contiguous nodes.",
        difficulty: "easy",
        subCluster: "stl_containers",
        conceptTag: "STL Containers, Iterators & Algorithms",
        approachHint: "Think about memory layout: which container stores elements side-by-side in a single dynamic array?",
        benchmarkSeconds: 20
      }
    ],
    medium: [
      {
        question: "Why should a base class designed for polymorphic inheritance declare a `virtual` destructor in C++?",
        options: [
          "To ensure the derived class destructor is invoked when deleting an object through a base pointer.",
          "To allow the base class constructor to initialize derived private fields before allocation.",
          "To force all derived classes to be declared as abstract classes with pure virtual interfaces.",
          "To prevent compiler optimizations that inline virtual method calls in performance-critical code."
        ],
        correctAnswer: "To ensure the derived class destructor is invoked when deleting an object through a base pointer.",
        explanation: "Deleting a derived object via a base pointer with a non-virtual destructor results in undefined behavior (the derived destructor does not execute).",
        difficulty: "medium",
        subCluster: "virtual_tables",
        conceptTag: "Object-Oriented Architecture & Virtual Tables",
        approachHint: "Consider deleting a `Derived` instance through a `Base*`: how does the runtime know to run `~Derived()` without a vtable entry?",
        benchmarkSeconds: 26
      },
      {
        question: "How does `std::unique_ptr` enforce exclusive resource ownership at compile time in modern C++?",
        options: [
          "Its copy constructor and copy assignment operator are deleted, allowing only move operations.",
          "It maintains an atomic reference counter in dynamic heap memory that decrements on destruction.",
          "It encrypts the underlying raw pointer with compiler metadata to prevent aliasing references.",
          "It allocates managed objects directly into read-only memory regions of the host operating system."
        ],
        correctAnswer: "Its copy constructor and copy assignment operator are deleted, allowing only move operations.",
        explanation: "std::unique_ptr deletes copy semantics (`= delete`) and implements move semantics (`std::move`), ensuring only one owner exists.",
        difficulty: "medium",
        subCluster: "smart_pointers",
        conceptTag: "Smart Pointers (unique_ptr, shared_ptr, weak_ptr)",
        approachHint: "What happens if you try to do `auto p2 = p1;` with a unique_ptr? Why does the compiler reject copying?",
        benchmarkSeconds: 24
      }
    ],
    hard: [
      {
        question: "What is the primary function of `std::move` in modern C++ (C++11 and later)?",
        options: [
          "It performs an unconditional static_cast to an rvalue reference, enabling move semantics without copying bytes.",
          "It physically moves memory bytes from one heap address to another using kernel DMA operations.",
          "It nullifies the source object immediately at the point of the function call before assignment.",
          "It constructs a separate thread to transfer object ownership asynchronously in the background."
        ],
        correctAnswer: "It performs an unconditional static_cast to an rvalue reference, enabling move semantics without copying bytes.",
        explanation: "std::move does not move data at runtime; it casts an lvalue to an rvalue reference (T&&), signaling to move constructors that the resource can be pilfered.",
        difficulty: "hard",
        subCluster: "move_semantics",
        conceptTag: "Move Semantics, Rvalues & std::move",
        approachHint: "Does `std::move` generate runtime machine instructions to move memory, or is it a compile-time type cast?",
        benchmarkSeconds: 32
      }
    ]
  },

  // =========================================================================
  // 2. Data Structures & Algorithms
  // =========================================================================
  dsa: {
    name: "Data Structures & Algorithms (DSA)",
    aliases: [
      "data structures & algorithms (dsa)", "data structures", "algorithms",
      "dsa", "binary trees", "trees", "graphs", "sorting", "searching", "dynamic programming"
    ],
    subtopics: [
      "Arrays, Two Pointers & Prefix Sums",
      "Strings, Hashing & Sliding Window",
      "Binary Search & Search Space Reduction",
      "Linked Lists & Pointer Mutation",
      "Stacks, Queues & Monotonic Sequences",
      "Trees, Binary Search Trees & AVL Rotations",
      "Binary Heaps & Priority Queues",
      "Graph Traversals (BFS & DFS)",
      "Dynamic Programming & Memoization",
      "Greedy Heuristics & Interval Scheduling"
    ],
    easy: [
      {
        question: "What is the primary time complexity advantage of inserting a new node at the head of a Singly Linked List compared to an Array?",
        options: [
          "`O(1)` constant time insertion and deletion at the head without shifting subsequent elements.",
          "`O(log n)` logarithmic time insertion due to binary tree pointer balancing.",
          "`O(n)` linear time insertion because memory must be reallocated sequentially.",
          "`O(n log n)` time complexity due to automatic sorting of existing elements."
        ],
        correctAnswer: "`O(1)` constant time insertion and deletion at the head without shifting subsequent elements.",
        explanation: "Linked lists insert at the head in O(1) by updating next pointers, while arrays require O(n) element shifts.",
        difficulty: "easy",
        subCluster: "linked_lists",
        conceptTag: "Linked Lists & Pointer Mutation",
        approachHint: "Consider prepending an item at index 0: why does an array need to move all other items while a list does not?",
        benchmarkSeconds: 20
      },
      {
        question: "Which collision resolution technique in Hash Tables chains colliding elements into linked lists?",
        options: [
          "Separate Chaining maintains an auxiliary linked list or bucket for all keys sharing a hash index.",
          "Linear Probing maintains an auxiliary linked list or bucket for all keys sharing a hash index.",
          "Quadratic Probing maintains an auxiliary linked list or bucket for all keys sharing a hash index.",
          "Double Hashing maintains an auxiliary linked list or bucket for all keys sharing a hash index."
        ],
        correctAnswer: "Separate Chaining maintains an auxiliary linked list or bucket for all keys sharing a hash index.",
        explanation: "Separate chaining handles collisions by storing colliding elements in linked lists at each bucket slot.",
        difficulty: "easy",
        subCluster: "strings_hashing",
        conceptTag: "Strings, Hashing & Sliding Window",
        approachHint: "Differentiate between open addressing (probing slots in the table) vs external bucket chaining.",
        benchmarkSeconds: 20
      }
    ],
    medium: [
      {
        question: "What is the worst-case search complexity in an unbalanced Binary Search Tree (BST)?",
        options: [
          "`O(n)` when elements are inserted in sorted order, creating a linear skewed tree.",
          "`O(log n)` regardless of insertion order due to automatic balance rotations.",
          "`O(n log n)` due to recursive stack overhead during node traversal steps.",
          "`O(1)` when root pointers are cached in hardware CPU register memory."
        ],
        correctAnswer: "`O(n)` when elements are inserted in sorted order, creating a linear skewed tree.",
        explanation: "An unbalanced BST can degenerate into a linked list of height n, giving O(n) search.",
        difficulty: "medium",
        subCluster: "trees_bst",
        conceptTag: "Trees, Binary Search Trees & AVL Rotations",
        approachHint: "Consider inserting sorted values 1, 2, 3, 4, 5 into a standard BST: what shape does the tree take?",
        benchmarkSeconds: 24
      },
      {
        question: "Which graph traversal algorithm finds the shortest path in an unweighted graph in terms of number of edges?",
        options: [
          "Breadth-First Search (BFS) explores vertices layer by layer using a FIFO queue.",
          "Depth-First Search (DFS) explores vertices layer by layer using a FIFO queue.",
          "Dijkstra's Algorithm without using a priority queue structure.",
          "Kruskal's Algorithm using disjoint union-find sets."
        ],
        correctAnswer: "Breadth-First Search (BFS) explores vertices layer by layer using a FIFO queue.",
        explanation: "BFS explores outward in concentric radial layers, guaranteeing the fewest edges to any reachable node.",
        difficulty: "medium",
        subCluster: "graphs",
        conceptTag: "Graph Traversals (BFS & DFS)",
        approachHint: "Think of a ripple in a pond: which traversal visits all distance-1 neighbors before distance-2 neighbors?",
        benchmarkSeconds: 22
      }
    ],
    hard: [
      {
        question: "In Dynamic Programming, what two fundamental properties indicate that a problem can be solved using DP?",
        options: [
          "Optimal Substructure and Overlapping Subproblems.",
          "Greedy Choice Property and Independence of States.",
          "Linear Separability and Convex Objective Boundaries.",
          "Asymmetric Divide-and-Conquer and Disjoint Partitions."
        ],
        correctAnswer: "Optimal Substructure and Overlapping Subproblems.",
        explanation: "Optimal substructure means optimal solutions to subproblems form the overall optimal solution; overlapping subproblems mean subproblems recur repeatedly.",
        difficulty: "hard",
        subCluster: "dp_memoization",
        conceptTag: "Dynamic Programming & Memoization",
        approachHint: "Why is memoization or tabulation useful? What must subproblems have in common for caching to work?",
        benchmarkSeconds: 30
      }
    ]
  },

  // =========================================================================
  // 3. JavaScript Programming
  // =========================================================================
  javascript: {
    name: "JavaScript Programming",
    aliases: [
      "javascript programming", "javascript", "js", "typescript", "ts",
      "es6", "node", "nodejs", "react", "frontend", "web development"
    ],
    subtopics: [
      "Data Types, Coercion & Truthiness",
      "Scopes, Hoisting & the TDZ",
      "Closures & Lexical Environments",
      "Prototypes, Object Methods & this Binding",
      "Promises, Async/Await & Microtasks",
      "Event Loop, Macrotasks & Web APIs",
      "DOM Manipulation, Bubbling & Capturing",
      "ES6+ Destructuring, Rest/Spread & Modules",
      "Memory Management, Garbage Collection & Leaks",
      "V8 JIT Compilation & Performance Optimization"
    ],
    easy: [
      {
        question: "What is the key functional difference between `let` and `var` variable declarations in JavaScript?",
        options: [
          "`let` is block-scoped and temporal dead zone bound, whereas `var` is function-scoped and hoisted.",
          "`var` is block-scoped and temporal dead zone bound, whereas `let` is function-scoped and hoisted.",
          "`let` variables are automatically frozen and immutable, whereas `var` variables can be mutated.",
          "`var` cannot be reassigned after declaration, whereas `let` can be reassigned freely."
        ],
        correctAnswer: "`let` is block-scoped and temporal dead zone bound, whereas `var` is function-scoped and hoisted.",
        explanation: "`let` is scoped to the enclosing block `{}` and resides in the TDZ before declaration; `var` is function-scoped and initialized to `undefined` upon hoisting.",
        difficulty: "easy",
        subCluster: "scopes_hoisting",
        conceptTag: "Scopes, Hoisting & the TDZ",
        approachHint: "Think about scope inside an `if (true) { ... }` block: which variable leaks outside the curly braces?",
        benchmarkSeconds: 20
      },
      {
        question: "What does `typeof null` evaluate to in standard ECMAScript?",
        options: [
          "`'object'` due to a legacy 31-bit type tag bug in the original JavaScript engine implementation.",
          "`'null'` because null is an independent primitive value in the ECMAScript specification.",
          "`'undefined'` because uninitialized null pointers point to undefined memory addresses.",
          "`'boolean'` because null is coerced to false in all logical expression evaluations."
        ],
        correctAnswer: "`'object'` due to a legacy 31-bit type tag bug in the original JavaScript engine implementation.",
        explanation: "`typeof null === 'object'` is a famous historical bug where objects had type tag `000` and `null` was represented as null pointer (`0x00`).",
        difficulty: "easy",
        subCluster: "types_coercion",
        conceptTag: "Data Types, Coercion & Truthiness",
        approachHint: "Remember the famous historical JavaScript engine quirk regarding the type tag of the null pointer.",
        benchmarkSeconds: 18
      }
    ],
    medium: [
      {
        question: "In the JavaScript Event Loop, how are Microtasks (like Promise callbacks) prioritized relative to Macrotasks (like `setTimeout`)?",
        options: [
          "All queued Microtasks are executed to completion before the next Macrotask is dequeued.",
          "Macrotasks and Microtasks are interleaved in a strict alternating 1-to-1 ratio.",
          "Macrotasks are always executed first, deferring Microtasks to the next frame animation.",
          "Microtasks execute only when the browser tab loses active window focus."
        ],
        correctAnswer: "All queued Microtasks are executed to completion before the next Macrotask is dequeued.",
        explanation: "The microtask queue is drained completely after every macrotask and before the event loop picks the next macrotask from the task queue.",
        difficulty: "medium",
        subCluster: "event_loop",
        conceptTag: "Event Loop, Macrotasks & Web APIs",
        approachHint: "Think about Promise `.then()` vs `setTimeout(..., 0)`: which queue must be completely emptied first?",
        benchmarkSeconds: 26
      },
      {
        question: "What happens when an arrow function executes in JavaScript with regard to its `this` binding?",
        options: [
          "It retains lexical `this` from its enclosing scope and cannot be rebound using `.bind()`, `.call()`, or `.apply()`.",
          "It dynamically binds `this` to the object that invoked the function at execution time.",
          "It sets `this` to `undefined` in strict mode and to the global object in non-strict mode.",
          "It creates an independent prototype chain containing a copy of the caller's context."
        ],
        correctAnswer: "It retains lexical `this` from its enclosing scope and cannot be rebound using `.bind()`, `.call()`, or `.apply()`.",
        explanation: "Arrow functions do not have their own `this`; they capture `this` lexically from the enclosing lexical scope at creation time.",
        difficulty: "medium",
        subCluster: "prototypes_this",
        conceptTag: "Prototypes, Object Methods & this Binding",
        approachHint: "Do arrow functions have their own `this` binding or do they inherit it from the surrounding code?",
        benchmarkSeconds: 24
      }
    ],
    hard: [
      {
        question: "How does a Closure retain access to outer variables even after the outer function has finished executing?",
        options: [
          "The inner function retains a reference to the outer Lexical Environment Record on the heap.",
          "The JavaScript engine serializes outer function variables into browser local storage.",
          "The CPU register stack frame is frozen in place and prevented from being popped off.",
          "The V8 compiler re-executes the outer function body from scratch on every invocation."
        ],
        correctAnswer: "The inner function retains a reference to the outer Lexical Environment Record on the heap.",
        explanation: "Functions in JS carry an internal `[[Environment]]` reference to their parent Lexical Environment, keeping referenced variables alive on the heap.",
        difficulty: "hard",
        subCluster: "closures",
        conceptTag: "Closures & Lexical Environments",
        approachHint: "Think about garbage collection: why doesn't the outer variable get garbage collected when the inner function still lives?",
        benchmarkSeconds: 30
      }
    ]
  },

  // =========================================================================
  // 4. Python Programming
  // =========================================================================
  python: {
    name: "Python Programming",
    aliases: [
      "python programming", "python", "python3", "py",
      "python functions", "python basics", "django", "flask", "fastapi"
    ],
    subtopics: [
      "Data Types, Mutability & Collections",
      "Functions, Scopes & the LEGB Rule",
      "Iterators, Generators & Lazy Evaluation",
      "Object-Oriented Architecture & Dunder Methods",
      "Decorators & Higher-Order Functions",
      "Context Managers & Exception Flow",
      "Concurrency, GIL & Asyncio Event Loops",
      "Metaclasses & Class Creation Mechanics",
      "Comprehensions & Functional Paradigms",
      "CPython Bytecode & Memory Management"
    ],
    easy: [
      {
        question: "What is the primary difference between a `list` and a `tuple` in Python?",
        options: [
          "`list` is a mutable sequence, whereas `tuple` is an immutable sequence.",
          "`tuple` is a mutable sequence, whereas `list` is an immutable sequence.",
          "`list` can hold heterogeneous types, while `tuple` is restricted strictly to numbers.",
          "`tuple` is allocated on the dynamic heap, while `list` is stored in CPU registers."
        ],
        correctAnswer: "`list` is a mutable sequence, whereas `tuple` is an immutable sequence.",
        explanation: "Lists can be modified in place (`append`, `pop`, index assignment). Tuples are immutable and cannot be altered after creation.",
        difficulty: "easy",
        subCluster: "types_mutability",
        conceptTag: "Data Types, Mutability & Collections",
        approachHint: "Can you reassign an element `t[0] = 5` in a tuple like you can with a list?",
        benchmarkSeconds: 18
      },
      {
        question: "What resolution order does Python use to look up variable names (the LEGB rule)?",
        options: [
          "Local, Enclosing, Global, Built-in.",
          "Global, Local, Enclosing, Built-in.",
          "Local, Global, Enclosing, Built-in.",
          "Built-in, Global, Enclosing, Local."
        ],
        correctAnswer: "Local, Enclosing, Global, Built-in.",
        explanation: "Python resolves identifiers by searching Local scope first, then Enclosing functions, then Global module scope, and finally Built-ins.",
        difficulty: "easy",
        subCluster: "functions_legb",
        conceptTag: "Functions, Scopes & the LEGB Rule",
        approachHint: "Think from the innermost scope outwards toward Python's standard built-in functions.",
        benchmarkSeconds: 18
      }
    ],
    medium: [
      {
        question: "What is the key operational difference between a standard function returning a list and a Generator using `yield` in Python?",
        options: [
          "Generators produce values lazily on demand without storing the entire sequence in memory.",
          "Functions with `yield` execute in parallel threads across multiple physical CPU cores.",
          "Generators compute all elements upfront and cache them inside a global static dictionary.",
          "Functions with `yield` are compiled directly into C extensions to bypass the GIL."
        ],
        correctAnswer: "Generators produce values lazily on demand without storing the entire sequence in memory.",
        explanation: "Generators use `yield` to pause execution and produce values one by one, saving memory for large or infinite streams.",
        difficulty: "medium",
        subCluster: "iterators_generators",
        conceptTag: "Iterators, Generators & Lazy Evaluation",
        approachHint: "Think about memory consumption when dealing with 10 million items: why is a generator lighter than a list?",
        benchmarkSeconds: 24
      },
      {
        question: "What does Python's Global Interpreter Lock (GIL) in CPython prevent?",
        options: [
          "Multiple native OS threads from executing Python bytecode simultaneously on separate CPU cores.",
          "Asynchronous coroutines from sharing state within a single asyncio event loop.",
          "Subclasses from accessing private attributes prefixed with double underscores.",
          "C extension modules from allocating heap memory through the standard `malloc` library."
        ],
        correctAnswer: "Multiple native OS threads from executing Python bytecode simultaneously on separate CPU cores.",
        explanation: "The GIL is a mutex in CPython that protects access to Python objects, preventing true multi-core parallel execution of bytecode threads.",
        difficulty: "medium",
        subCluster: "concurrency_gil",
        conceptTag: "Concurrency, GIL & Asyncio Event Loops",
        approachHint: "Why does CPU-bound multi-threading in pure Python not speed up on multi-core processors?",
        benchmarkSeconds: 26
      }
    ],
    hard: [
      {
        question: "In Python object instantiation, what is the exact difference between `__new__` and `__init__`?",
        options: [
          "`__new__` creates and returns the new instance; `__init__` initializes the newly created instance.",
          "`__init__` allocates heap memory for the instance; `__new__` sets attribute values on self.",
          "`__new__` is called only for immutable types; `__init__` is called only for mutable class types.",
          "`__new__` runs in a separate thread; `__init__` runs synchronously in the main interpreter loop."
        ],
        correctAnswer: "`__new__` creates and returns the new instance; `__init__` initializes the newly created instance.",
        explanation: "`__new__` is the static constructor that creates and returns the object instance. `__init__` is the initializer that configures attributes on `self`.",
        difficulty: "hard",
        subCluster: "oop_dunder",
        conceptTag: "Object-Oriented Architecture & Dunder Methods",
        approachHint: "`__new__` is a static method that returns a new instance; `__init__` receives `self` to set attributes.",
        benchmarkSeconds: 30
      }
    ]
  },

  // =========================================================================
  // 5. Java Programming & JVM Architecture
  // =========================================================================
  java: {
    name: "Java Programming",
    aliases: [
      "java programming", "java", "jvm", "core java", "spring",
      "spring boot", "jakarta", "java 17", "java 21"
    ],
    subtopics: [
      "JVM Architecture, Bytecode & Memory Areas",
      "OOP, Interfaces & Abstract Classes",
      "Java Collections Framework (List, Set, Map)",
      "Exception Handling & Checked vs Unchecked",
      "Multithreading, Concurrency & volatile",
      "Generics, Type Erasure & Wildcards",
      "Stream API & Lambda Functional Interfaces",
      "Garbage Collection (G1, ZGC) & Memory Tuning",
      "Reflection, Annotations & Classloading",
      "Modern Java (Records, Sealed Classes, Virtual Threads)"
    ],
    easy: [
      {
        question: "What is the key functional difference between a Java `Interface` (Java 8+) and an `abstract class`?",
        options: [
          "A class can implement multiple interfaces, but can extend only a single abstract class.",
          "An interface can declare stateful instance variables, whereas abstract classes cannot.",
          "An interface cannot define default methods, whereas abstract classes require default implementations.",
          "Abstract classes cannot declare constructors, whereas interfaces require public constructors."
        ],
        correctAnswer: "A class can implement multiple interfaces, but can extend only a single abstract class.",
        explanation: "Java permits single class inheritance (one abstract class) but multiple interface implementation.",
        difficulty: "easy",
        subCluster: "oop_interfaces",
        conceptTag: "OOP, Interfaces & Abstract Classes",
        approachHint: "Think about multiple inheritance in Java: how many classes vs how many interfaces can a single class inherit?",
        benchmarkSeconds: 20
      },
      {
        question: "What is the difference between Checked and Unchecked Exceptions in Java?",
        options: [
          "Checked exceptions extend `Exception` and must be handled at compile time; unchecked extend `RuntimeException`.",
          "Unchecked exceptions extend `Exception` and must be handled at compile time; checked extend `RuntimeException`.",
          "Checked exceptions crash the JVM immediately, while unchecked exceptions are logged silently.",
          "Checked exceptions are restricted to multi-threaded code, while unchecked are for single-threaded loops."
        ],
        correctAnswer: "Checked exceptions extend `Exception` and must be handled at compile time; unchecked extend `RuntimeException`.",
        explanation: "Checked exceptions are checked at compile time (`IOException`, `SQLException`). Unchecked exceptions extend `RuntimeException` (`NullPointerException`).",
        difficulty: "easy",
        subCluster: "exceptions",
        conceptTag: "Exception Handling & Checked vs Unchecked",
        approachHint: "Which exception family does the compiler force you to wrap in `try/catch` or declare in `throws`?",
        benchmarkSeconds: 20
      }
    ],
    medium: [
      {
        question: "What does the `volatile` keyword guarantee when applied to a variable in Java?",
        options: [
          "All reads and writes go directly to main memory, ensuring visibility across threads and preventing instruction reordering.",
          "It locks the variable with an internal mutex so only one thread can mutate it at a time.",
          "It prevents the garbage collector from ever deleting the variable from JVM heap memory.",
          "It converts the primitive variable into an immutable atomic object reference."
        ],
        correctAnswer: "All reads and writes go directly to main memory, ensuring visibility across threads and preventing instruction reordering.",
        explanation: "`volatile` establishes a happens-before relationship, guaranteeing thread visibility and prohibiting reordering without mutex locking.",
        difficulty: "medium",
        subCluster: "concurrency_volatile",
        conceptTag: "Multithreading, Concurrency & volatile",
        approachHint: "Focus on thread visibility and CPU caching: what happens when one core modifies a variable cached in its L1 cache?",
        benchmarkSeconds: 28
      },
      {
        question: "How does Type Erasure in Java Generics affect runtime reflection and bytecode execution?",
        options: [
          "Generic type arguments are replaced with their upper bound (or `Object`) at compile time and removed from bytecode.",
          "The JVM creates a separate compiled class file for every distinct type argument used in code.",
          "Generics are retained in full detail in bytecode, allowing primitive types to be stored without boxing.",
          "Type erasure throws a runtime ClassCastException whenever two generic classes share an interface."
        ],
        correctAnswer: "Generic type arguments are replaced with their upper bound (or `Object`) at compile time and removed from bytecode.",
        explanation: "Java generics provide compile-time safety. The compiler erases type parameters to maintain backwards compatibility with pre-Java 5 bytecode.",
        difficulty: "medium",
        subCluster: "generics_erasure",
        conceptTag: "Generics, Type Erasure & Wildcards",
        approachHint: "Backward compatibility: why did Java 5 erase generic types when running on legacy JVM bytecode interpreters?",
        benchmarkSeconds: 30
      }
    ],
    hard: [
      {
        question: "How do Virtual Threads (Project Loom) in Java 21 achieve high scalability compared to platform threads?",
        options: [
          "They are lightweight user-mode threads managed by the JVM that unmount from carrier threads during blocking I/O.",
          "They bypass the JVM interpreter and execute directly on GPU compute cores in parallel.",
          "They eliminate all context switches by executing all asynchronous tasks within a single kernel thread.",
          "They compress call stack frames into shared read-only memory buffers in the operating system."
        ],
        correctAnswer: "They are lightweight user-mode threads managed by the JVM that unmount from carrier threads during blocking I/O.",
        explanation: "Virtual threads are M:N threads managed by the JVM. When a virtual thread blocks on I/O, it unmounts from its carrier platform thread, freeing it for other work.",
        difficulty: "hard",
        subCluster: "modern_java",
        conceptTag: "Modern Java (Records, Sealed Classes, Virtual Threads)",
        approachHint: "Think about blocking I/O: instead of blocking an expensive OS kernel thread, what does the JVM do with the lightweight continuation?",
        benchmarkSeconds: 38
      }
    ]
  },

  // =========================================================================
  // 6. Database Management Systems (DBMS) & SQL
  // =========================================================================
  sql: {
    name: "Database Management Systems (DBMS) & SQL",
    aliases: [
      "database management systems (dbms) & sql", "database management systems (dbms) / sql",
      "sql", "database", "databases", "mysql", "postgresql", "rdbms", "sqlite", "relational database", "dbms"
    ],
    subtopics: [
      "Row Filtering (WHERE & Predicates)",
      "Grouping & Aggregation (GROUP BY & HAVING)",
      "Table Joins (INNER, LEFT, RIGHT & FULL)",
      "Subqueries & Common Table Expressions (CTEs)",
      "Data Integrity, Primary Keys & Foreign Cascades",
      "Indexing Architecture & Sargability",
      "Transactions, ACID Guarantees & Isolation Levels",
      "Set Operations (UNION, INTERSECT, EXCEPT)",
      "Window Functions (ROW_NUMBER, RANK, OVER)",
      "Query Optimization & Execution Explain Plans"
    ],
    easy: [
      {
        question: "What is the key functional difference between the `WHERE` and `HAVING` clauses in standard SQL?",
        options: [
          "`WHERE` filters individual rows before aggregation; `HAVING` filters aggregated groups after grouping.",
          "`HAVING` filters individual rows before aggregation; `WHERE` filters aggregated groups after grouping.",
          "`WHERE` is restricted strictly to numeric columns, while `HAVING` applies only to string text columns.",
          "`HAVING` creates a permanent database view, while `WHERE` operates only inside temporary subqueries."
        ],
        correctAnswer: "`WHERE` filters individual rows before aggregation; `HAVING` filters aggregated groups after grouping.",
        explanation: "`WHERE` evaluates predicates on base table rows before `GROUP BY`. `HAVING` evaluates conditions on summary aggregate results.",
        difficulty: "easy",
        subCluster: "grouping_aggregation",
        conceptTag: "Grouping & Aggregation (GROUP BY & HAVING)",
        approachHint: "Think about query execution order: does SQL group records first or filter base rows first?",
        benchmarkSeconds: 20
      },
      {
        question: "What does an `INNER JOIN` between two database tables produce?",
        options: [
          "Only the rows that have matching values in both joined tables based on the join predicate.",
          "All rows from the left table combined with matching rows from the right table.",
          "All possible Cartesian product combinations of rows across both tables unconditionally.",
          "All rows from both tables, filling non-matching columns with default null values."
        ],
        correctAnswer: "Only the rows that have matching values in both joined tables based on the join predicate.",
        explanation: "An INNER JOIN returns only records where the join condition is satisfied in both relation sets.",
        difficulty: "easy",
        subCluster: "table_joins",
        conceptTag: "Table Joins (INNER, LEFT, RIGHT & FULL)",
        approachHint: "Think of a Venn diagram intersection: which rows survive when matching keys must exist on both sides?",
        benchmarkSeconds: 18
      }
    ],
    medium: [
      {
        question: "What does the 'I' in ACID transaction properties stand for, and what does it guarantee?",
        options: [
          "Isolation: Concurrent transactions execute without seeing each other's intermediate uncommitted states.",
          "Integrity: Foreign key constraints are automatically recomputed whenever a row is modified.",
          "Indexing: All table columns are automatically indexed in B-tree structures by the storage engine.",
          "Idempotency: Re-running a transaction multiple times produces the exact same primary key values."
        ],
        correctAnswer: "Isolation: Concurrent transactions execute without seeing each other's intermediate uncommitted states.",
        explanation: "Isolation ensures concurrent transactions execute independently without interference, avoiding dirty reads or lost updates.",
        difficulty: "medium",
        subCluster: "transactions_acid",
        conceptTag: "Transactions, ACID Guarantees & Isolation Levels",
        approachHint: "Think about multi-user database concurrency: what prevents one user from reading half-finished transaction writes?",
        benchmarkSeconds: 24
      },
      {
        question: "What is the key difference between the `RANK()` and `DENSE_RANK()` SQL window functions when encountering tie values?",
        options: [
          "`RANK()` leaves gaps in the ranking sequence after ties; `DENSE_RANK()` assigns consecutive integers.",
          "`DENSE_RANK()` leaves gaps in the ranking sequence after ties; `RANK()` assigns consecutive integers.",
          "`RANK()` operates across entire tables only; `DENSE_RANK()` is restricted strictly to partition clauses.",
          "`DENSE_RANK()` orders records in descending order, while `RANK()` orders records in ascending order."
        ],
        correctAnswer: "`RANK()` leaves gaps in the ranking sequence after ties; `DENSE_RANK()` assigns consecutive integers.",
        explanation: "If two items tie for 1st place, `RANK()` gives ranks 1, 1, 3. `DENSE_RANK()` gives ranks 1, 1, 2 without skipping numbers.",
        difficulty: "medium",
        subCluster: "window_functions",
        conceptTag: "Window Functions (ROW_NUMBER, RANK, OVER)",
        approachHint: "If two runners tie for 1st place, does the next runner get 2nd place or 3rd place?",
        benchmarkSeconds: 26
      }
    ],
    hard: [
      {
        question: "What makes a SQL query predicate 'non-sargable', preventing the database optimizer from using an index seek?",
        options: [
          "Wrapping indexed columns inside functions or mathematical expressions in the `WHERE` clause.",
          "Using parameterized bind variables instead of hard-coded string literals in the query text.",
          "Joining two tables on columns that share identical data types and primary key constraints.",
          "Selecting specific named column identifiers instead of using the wildcard `SELECT *` syntax."
        ],
        correctAnswer: "Wrapping indexed columns inside functions or mathematical expressions in the `WHERE` clause.",
        explanation: "Non-SARGable (Search Argument Able) predicates (e.g. `WHERE YEAR(date_col) = 2024`) force full index/table scans because the function must evaluate for every row.",
        difficulty: "hard",
        subCluster: "indexing_sargability",
        conceptTag: "Indexing Architecture & Sargability",
        approachHint: "What happens to index seek capability when you wrap a column in `WHERE UPPER(username) = 'ALICE'`?",
        benchmarkSeconds: 32
      }
    ]
  },

  // =========================================================================
  // 7. Object-Oriented Programming (OOP) Concepts
  // =========================================================================
  oop: {
    name: "Object-Oriented Programming (OOP) Concepts",
    aliases: [
      "object-oriented programming (oop) concepts", "object oriented programming",
      "oop", "oops", "object-oriented concepts", "oop concepts", "design patterns",
      "solid principles", "object oriented"
    ],
    subtopics: [
      "Encapsulation, Data Hiding & Access Modifiers",
      "Inheritance Hierarchies & Method Overriding",
      "Polymorphism (Dynamic Dispatch & Overloading)",
      "Abstraction & Interface Contracts",
      "Composition vs Inheritance (HAS-A vs IS-A)",
      "SOLID Principles (SRP, OCP, LSP, ISP, DIP)",
      "Creational Design Patterns (Factory, Singleton, Builder)",
      "Structural Design Patterns (Adapter, Decorator, Facade)",
      "Behavioral Design Patterns (Observer, Strategy, Command)",
      "Coupling, Cohesion & Modular Architecture"
    ],
    easy: [
      {
        question: "What is the primary purpose of encapsulation in object-oriented programming?",
        options: [
          "Bundling data with methods while restricting direct external access to internal object state.",
          "Allowing derived classes to automatically inherit all private fields from base parent classes.",
          "Enabling multiple methods to share the exact same parameter list with different method names.",
          "Translating high-level source code directly into machine-executable binary opcodes."
        ],
        correctAnswer: "Bundling data with methods while restricting direct external access to internal object state.",
        explanation: "Encapsulation hides internal object state behind public methods (getters/setters), protecting data integrity and reducing coupling.",
        difficulty: "easy",
        subCluster: "encapsulation",
        conceptTag: "Encapsulation, Data Hiding & Access Modifiers",
        approachHint: "Think about why classes use private variables with public methods to protect state integrity.",
        benchmarkSeconds: 18
      },
      {
        question: "What does the 'IS-A' relationship signify in object-oriented software design?",
        options: [
          "A class inheritance hierarchy where a child subclass is a specialized type of its parent class.",
          "A component containment model where an outer class holds a reference to an inner helper class.",
          "A dynamic binding mechanism where an interface generates new methods during runtime execution.",
          "A database relationship where a primary table references multiple foreign keys concurrently."
        ],
        correctAnswer: "A class inheritance hierarchy where a child subclass is a specialized type of its parent class.",
        explanation: "Inheritance models an 'IS-A' relationship (e.g., Dog IS-A Animal), whereas composition models a 'HAS-A' relationship (e.g., Car HAS-A Engine).",
        difficulty: "easy",
        subCluster: "inheritance",
        conceptTag: "Composition vs Inheritance (HAS-A vs IS-A)",
        approachHint: "Contrast 'IS-A' (inheritance, e.g., Dog is an Animal) with 'HAS-A' (composition, e.g., Car has an Engine).",
        benchmarkSeconds: 18
      }
    ],
    medium: [
      {
        question: "According to the Liskov Substitution Principle (LSP), how should subtype inheritance behave?",
        options: [
          "Objects of a superclass should be replaceable with objects of its subclasses without altering correctness.",
          "Subclasses must override every public and protected method defined in the superclass explicitly.",
          "Subclasses must declare stricter input preconditions than their base class parent methods.",
          "Derived classes must completely hide all inherited attributes using private access specifiers."
        ],
        correctAnswer: "Objects of a superclass should be replaceable with objects of its subclasses without altering correctness.",
        explanation: "LSP states that derived classes must be substitutable for their base classes without breaking client code expectations or program correctness.",
        difficulty: "medium",
        subCluster: "solid_principles",
        conceptTag: "SOLID Principles (SRP, OCP, LSP, ISP, DIP)",
        approachHint: "Remember Barbara Liskov's rule: substituting a derived instance for a base reference must not break the program.",
        benchmarkSeconds: 24
      },
      {
        question: "What is the primary intent of the Strategy Design Pattern in object-oriented architecture?",
        options: [
          "Defining a family of interchangeable algorithms and encapsulating each one inside a separate class.",
          "Ensuring that a specific class has only one global instance accessible throughout the application.",
          "Attaching additional dynamic responsibilities to an individual object without modifying its class.",
          "Converting the incompatible interface of an existing class into another interface clients expect."
        ],
        correctAnswer: "Defining a family of interchangeable algorithms and encapsulating each one inside a separate class.",
        explanation: "The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.",
        difficulty: "medium",
        subCluster: "design_patterns",
        conceptTag: "Behavioral Design Patterns (Observer, Strategy, Command)",
        approachHint: "Think about swapping payment methods (CreditCard, PayPal, Crypto) at runtime without altering the Checkout class.",
        benchmarkSeconds: 26
      }
    ],
    hard: [
      {
        question: "In compiled object-oriented languages (like C++ or Java), how is dynamic polymorphism implemented under the hood?",
        options: [
          "Through a virtual method table (vtable) containing function pointers resolved at execution time.",
          "By duplicating the complete compiled machine code of the superclass inside every child instance.",
          "By parsing the raw textual class declaration string before every virtual method invocation step.",
          "Through global operating system interrupt routines that intercept every object property access."
        ],
        correctAnswer: "Through a virtual method table (vtable) containing function pointers resolved at execution time.",
        explanation: "Compilers generate a vtable per class with virtual methods. Each object instance stores a `vptr` pointing to its class vtable for runtime method dispatch.",
        difficulty: "hard",
        subCluster: "polymorphism_vtable",
        conceptTag: "Polymorphism (Dynamic Dispatch & Overloading)",
        approachHint: "How does the runtime know which overridden method to call when an object is accessed through a base pointer?",
        benchmarkSeconds: 30
      }
    ]
  },

  // =========================================================================
  // 8. Operating Systems Concepts
  // =========================================================================
  os: {
    name: "Operating Systems Concepts",
    aliases: [
      "operating systems concepts", "operating systems", "operating system",
      "os", "os concepts", "operating systems basics", "kernel", "linux kernel", "processes and threads"
    ],
    subtopics: [
      "Processes, Threads & Context Switching",
      "CPU Scheduling Algorithms (FCFS, SJF, Round Robin, Priority)",
      "Process Synchronization, Mutexes & Semaphores",
      "Deadlocks (Conditions, Prevention, Avoidance & Banker's Algorithm)",
      "Memory Management (Paging, Segmentation & Virtual Memory)",
      "Page Replacement Algorithms (FIFO, LRU, Optimal)",
      "File Systems, Inodes & Directory Structures",
      "I/O Systems, DMA & Disk Scheduling (SSTF, SCAN, C-SCAN)",
      "System Calls, User vs Kernel Mode & Trap Handlers",
      "Inter-Process Communication (Pipes, Sockets, Shared Memory)"
    ],
    easy: [
      {
        question: "What is the fundamental difference in resource allocation between an operating system Process and a Thread?",
        options: [
          "Processes have independent address spaces, while threads of the same process share the same memory.",
          "Threads have independent address spaces, while processes of the same application share memory.",
          "Processes execute exclusively in user mode, while threads execute exclusively in kernel ring 0.",
          "Threads cannot execute concurrently, whereas processes are guaranteed parallel execution on one core."
        ],
        correctAnswer: "Processes have independent address spaces, while threads of the same process share the same memory.",
        explanation: "A process is an execution unit with its own private virtual address space. Threads within a process share the same code, data, and heap segments but have private stacks.",
        difficulty: "easy",
        subCluster: "processes_threads",
        conceptTag: "Processes, Threads & Context Switching",
        approachHint: "Think about memory isolation: why is context switching between processes heavier than between threads?",
        benchmarkSeconds: 20
      },
      {
        question: "Which four conditions must simultaneously hold for a system deadlock to occur (Coffman conditions)?",
        options: [
          "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait occurring at the same time.",
          "Paging Thrashing, Belady's Anomaly, Race Conditions, and Critical Section Starvation.",
          "Preemptive Scheduling, Virtual Memory Swapping, Semaphore Deadband, and DMA Interrupts.",
          "Kernel Panics, Memory Fragmentation, Cache Incoherency, and Socket Buffer Overflow."
        ],
        correctAnswer: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait occurring at the same time.",
        explanation: "All four Coffman conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) must hold simultaneously for a deadlock to exist.",
        difficulty: "easy",
        subCluster: "deadlocks",
        conceptTag: "Deadlocks (Conditions, Prevention, Avoidance & Banker's Algorithm)",
        approachHint: "Recall the four necessary Coffman conditions required for resource deadlocks.",
        benchmarkSeconds: 20
      }
    ],
    medium: [
      {
        question: "What problem does Virtual Memory solve by using Paging and Translation Lookaside Buffers (TLB)?",
        options: [
          "It allows non-contiguous physical memory allocation while providing a contiguous virtual address space.",
          "It compresses all disk storage into volatile registers to eliminate secondary storage access.",
          "It eliminates the need for CPU context switches when alternating between concurrent tasks.",
          "It prevents operating system kernels from ever writing memory pages to secondary swap files."
        ],
        correctAnswer: "It allows non-contiguous physical memory allocation while providing a contiguous virtual address space.",
        explanation: "Virtual memory decouples logical address space from physical RAM via page tables and TLBs, eliminating external fragmentation and enabling memory protection.",
        difficulty: "medium",
        subCluster: "memory_paging",
        conceptTag: "Memory Management (Paging, Segmentation & Virtual Memory)",
        approachHint: "Think about address translation: how does paging allow a program to see contiguous memory even if physical RAM is fragmented?",
        benchmarkSeconds: 26
      },
      {
        question: "What is Belady's Anomaly in the context of operating system page replacement algorithms?",
        options: [
          "Increasing the number of allocated page frames causes an increase in the number of page faults.",
          "Allocating more CPU execution time to a thread causes its total memory consumption to drop to zero.",
          "Using LRU replacement always produces more page faults than simple First-In-First-Out paging.",
          "High disk I/O throughput causes all cached virtual memory pages to become permanently corrupted."
        ],
        correctAnswer: "Increasing the number of allocated page frames causes an increase in the number of page faults.",
        explanation: "Belady's Anomaly is a phenomenon in FIFO page replacement where increasing the number of page frames results in more page faults for certain access patterns.",
        difficulty: "medium",
        subCluster: "page_replacement",
        conceptTag: "Page Replacement Algorithms (FIFO, LRU, Optimal)",
        approachHint: "Counterintuitively, under FIFO replacement, giving a process more RAM frames can sometimes produce more page misses.",
        benchmarkSeconds: 24
      }
    ],
    hard: [
      {
        question: "What is Priority Inversion in real-time operating systems, and how is it resolved?",
        options: [
          "A high-priority task is blocked by a low-priority task holding a mutex; solved via Priority Inheritance.",
          "A low-priority task preempts a high-priority task indefinitely; solved via First-Come-First-Served.",
          "A thread deadlock caused by circular wait; solved by terminating all running background processes.",
          "An interrupt handler running in user mode; solved by disabling all hardware timer interrupts."
        ],
        correctAnswer: "A high-priority task is blocked by a low-priority task holding a mutex; solved via Priority Inheritance.",
        explanation: "Priority inversion occurs when a medium task preempts a low task holding a resource needed by a high task. Priority Inheritance temporarily boosts the low task's priority.",
        difficulty: "hard",
        subCluster: "synchronization",
        conceptTag: "Process Synchronization, Mutexes & Semaphores",
        approachHint: "Think of the Mars Pathfinder bug: a medium-priority task kept a low-priority task from finishing, indirectly starving the high-priority task.",
        benchmarkSeconds: 32
      }
    ]
  },

  // =========================================================================
  // 9. Computer Networks Concepts
  // =========================================================================
  networks: {
    name: "Computer Networks Concepts",
    aliases: [
      "computer networks concepts", "computer networks", "computer network",
      "networking", "networks", "tcp/ip", "osi model", "computer networking"
    ],
    subtopics: [
      "OSI vs TCP/IP Reference Models & Layer Responsibilities",
      "Physical & Data Link Layers (Framing, MAC, Ethernet, ARP)",
      "Network Layer, IP Addressing & Subnetting (IPv4 vs IPv6)",
      "Routing Protocols (Distance Vector, Link State, OSPF, BGP)",
      "Transport Layer Protocols (TCP vs UDP, 3-Way Handshake)",
      "TCP Flow Control (Sliding Window) & Congestion Control",
      "Application Layer Protocols (HTTP/HTTPS, DNS, FTP, SMTP, DHCP)",
      "Network Security, TLS/SSL Handshake & Certificates",
      "Network Address Translation (NAT) & Firewalls",
      "Socket Programming & Client-Server Architecture"
    ],
    easy: [
      {
        question: "What is the fundamental transport-layer difference between TCP and UDP?",
        options: [
          "TCP is connection-oriented with guaranteed delivery, while UDP is connectionless and best-effort.",
          "TCP operates exclusively on local LANs, while UDP is required for routing across wide area networks.",
          "TCP encrypts all packet payloads by default, while UDP transmits data as unformatted raw binary.",
          "UDP guarantees ordered packet sequencing, while TCP delivers packets out of order randomly."
        ],
        correctAnswer: "TCP is connection-oriented with guaranteed delivery, while UDP is connectionless and best-effort.",
        explanation: "TCP provides reliable, ordered, byte-stream delivery with error checking and retransmission. UDP is lightweight and connectionless without delivery guarantees.",
        difficulty: "easy",
        subCluster: "transport_layer",
        conceptTag: "Transport Layer Protocols (TCP vs UDP, 3-Way Handshake)",
        approachHint: "Consider reliability vs latency: which protocol performs handshakes and retransmissions?",
        benchmarkSeconds: 18
      },
      {
        question: "What is the primary responsibility of the Domain Name System (DNS) in computer networks?",
        options: [
          "Translating human-readable domain names into numerical machine-routable IP addresses.",
          "Encrypting HTTP application payload packets between web browsers and origin web servers.",
          "Assigning dynamic physical MAC hardware addresses to network interface cards on boot.",
          "Managing TCP sliding window buffer sizes to prevent receiver socket buffer overflows."
        ],
        correctAnswer: "Translating human-readable domain names into numerical machine-routable IP addresses.",
        explanation: "DNS acts as the internet directory, mapping hostnames (e.g. `example.com`) to IP addresses (e.g. `93.184.216.34`).",
        difficulty: "easy",
        subCluster: "application_layer",
        conceptTag: "Application Layer Protocols (HTTP/HTTPS, DNS, FTP, SMTP, DHCP)",
        approachHint: "Think of DNS as the internet's phonebook: what does it look up when you type 'example.com'?",
        benchmarkSeconds: 18
      }
    ],
    medium: [
      {
        question: "What is the exact sequence of packet flags exchanged during a standard TCP 3-way connection handshake?",
        options: [
          "Client sends SYN; Server responds with SYN-ACK; Client completes handshake with ACK.",
          "Client sends ACK; Server responds with SYN; Client completes handshake with FIN.",
          "Client sends PSH; Server responds with RST; Client completes handshake with SYN.",
          "Client sends FIN; Server responds with FIN-ACK; Client completes handshake with RST."
        ],
        correctAnswer: "Client sends SYN; Server responds with SYN-ACK; Client completes handshake with ACK.",
        explanation: "TCP establishes a connection via 3-way handshake: 1) SYN (synchronize seq), 2) SYN-ACK (acknowledge & sync), 3) ACK (acknowledge server seq).",
        difficulty: "medium",
        subCluster: "tcp_handshake",
        conceptTag: "Transport Layer Protocols (TCP vs UDP, 3-Way Handshake)",
        approachHint: "Synchronize -> Synchronize-Acknowledge -> Acknowledge.",
        benchmarkSeconds: 22
      },
      {
        question: "How does the Address Resolution Protocol (ARP) operate within a local IPv4 broadcast domain?",
        options: [
          "It broadcasts an ARP Request asking for the MAC address corresponding to a known target IP address.",
          "It queries remote DNS root nameservers to resolve local private IP addresses to global domain names.",
          "It dynamically assigns IPv4 configuration settings, default gateways, and subnet masks to hosts.",
          "It routes network packets between separate autonomous systems using distance-vector algorithms."
        ],
        correctAnswer: "It broadcasts an ARP Request asking for the MAC address corresponding to a known target IP address.",
        explanation: "ARP resolves Layer 3 IPv4 addresses to Layer 2 MAC addresses by broadcasting a request frame to `FF:FF:FF:FF:FF:FF` on the local link.",
        difficulty: "medium",
        subCluster: "data_link_arp",
        conceptTag: "Physical & Data Link Layers (Framing, MAC, Ethernet, ARP)",
        approachHint: "At Layer 2 (Data Link), Ethernet switches need the 48-bit MAC address. How do you find it from an IP?",
        benchmarkSeconds: 24
      }
    ],
    hard: [
      {
        question: "In TCP Congestion Control, what happens when a retransmission timeout occurs versus receiving 3 duplicate ACKs?",
        options: [
          "Timeout resets `cwnd` to 1 MSS (Slow Start); 3 duplicate ACKs triggers Fast Retransmit / Fast Recovery.",
          "Timeout triples the `cwnd` value; 3 duplicate ACKs immediately terminates the TCP connection socket.",
          "Both events trigger an identical immediate drop of `cwnd` to zero and pause transmission for 60s.",
          "Timeout switches transmission to UDP mode; 3 duplicate ACKs forces hardware router reboots."
        ],
        correctAnswer: "Timeout resets `cwnd` to 1 MSS (Slow Start); 3 duplicate ACKs triggers Fast Retransmit / Fast Recovery.",
        explanation: "A timeout indicates severe network congestion, collapsing `cwnd` to 1 MSS. Three duplicate ACKs indicate packet loss but continued flow, invoking Fast Retransmit/Fast Recovery.",
        difficulty: "hard",
        subCluster: "congestion_control",
        conceptTag: "TCP Flow Control (Sliding Window) & Congestion Control",
        approachHint: "A timeout is a severe signal (packet lost), whereas 3 dup ACKs means subsequent packets are still reaching the receiver.",
        benchmarkSeconds: 32
      }
    ]
  },

  // =========================================================================
  // 10. Web Development Fundamentals
  // =========================================================================
  web_dev: {
    name: "Web Development Fundamentals",
    aliases: [
      "web development fundamentals (html, css, javascript basics)",
      "web development fundamentals", "web development", "web dev",
      "frontend", "html css js", "html", "css"
    ],
    subtopics: [
      "Semantic HTML5 Elements & Accessibility (a11y)",
      "CSS Box Model, Margin Collapsing & Box-Sizing",
      "CSS Flexbox & Grid Layout Systems",
      "CSS Specificity, Inheritance & Cascade Order",
      "Responsive Web Design, Media Queries & Viewports",
      "DOM Tree, Event Delegation & Event Propagation",
      "Client-Server Communication, Fetch API & REST Endpoints",
      "Browser Storage (Cookies, localStorage, sessionStorage, IndexedDB)",
      "Web Performance, Critical Rendering Path & Asset Optimization",
      "Web Security Fundamentals (CORS, CSRF, XSS, Content Security Policy)"
    ],
    easy: [
      {
        question: "What components constitute the standard CSS Box Model from innermost to outermost?",
        options: [
          "Content, followed by Padding, followed by Border, and enclosed by Margin.",
          "Margin, followed by Border, followed by Padding, and enclosed by Content.",
          "Content, followed by Border, followed by Margin, and enclosed by Padding.",
          "Padding, followed by Content, followed by Margin, and enclosed by Border."
        ],
        correctAnswer: "Content, followed by Padding, followed by Border, and enclosed by Margin.",
        explanation: "The CSS box model layers from inside out: Content -> Padding (inside space) -> Border -> Margin (outside space).",
        difficulty: "easy",
        subCluster: "css_box_model",
        conceptTag: "CSS Box Model, Margin Collapsing & Box-Sizing",
        approachHint: "Start from the text/image itself inside the element and move outward toward neighboring elements.",
        benchmarkSeconds: 18
      },
      {
        question: "Why is event delegation used when handling events on multiple dynamic child DOM elements?",
        options: [
          "Attaching a single listener to a common ancestor utilizes event bubbling to handle child events.",
          "It forces the browser rendering engine to repaint all child DOM nodes in parallel GPU threads.",
          "It prevents child elements from ever triggering hover or active pseudo-class styles in CSS.",
          "It automatically converts asynchronous event handler callbacks into synchronous promises."
        ],
        correctAnswer: "Attaching a single listener to a common ancestor utilizes event bubbling to handle child events.",
        explanation: "Event delegation leverages bubbling by placing one event listener on a parent element to handle events triggered by current or future child elements.",
        difficulty: "easy",
        subCluster: "dom_events",
        conceptTag: "DOM Tree, Event Delegation & Event Propagation",
        approachHint: "Instead of adding 1,000 click listeners on `<li>` items, attach 1 listener on the parent `<ul>`.",
        benchmarkSeconds: 20
      }
    ],
    medium: [
      {
        question: "In the CSS Cascade, which selector combination has the highest specificity weight?",
        options: [
          "`#header .nav-item:hover` containing one ID selector, one class selector, and one pseudo-class.",
          "`.nav .nav-item.active` containing three chained class selectors without an ID selector.",
          "`header nav ul li a` containing five descending HTML element type selectors in sequence.",
          "`*` universal selector combined with an element attribute selector `[data-active]`."
        ],
        correctAnswer: "`#header .nav-item:hover` containing one ID selector, one class selector, and one pseudo-class.",
        explanation: "Specificity weight tuple (IDs, Classes/Attributes/Pseudo-classes, Elements): `#header .nav-item:hover` is (1, 2, 0), which beats class-only (0, 3, 0) or element-only (0, 0, 5).",
        difficulty: "medium",
        subCluster: "css_specificity",
        conceptTag: "CSS Specificity, Inheritance & Cascade Order",
        approachHint: "Compare specificity tuples (IDs, Classes/Attributes/Pseudo-classes, Elements): (1, 2, 0) beats (0, 3, 0) and (0, 0, 5).",
        benchmarkSeconds: 24
      },
      {
        question: "What is the core purpose of the Cross-Origin Resource Sharing (CORS) browser mechanism?",
        options: [
          "Allowing servers to specify which external origins are permitted to read their HTTP responses.",
          "Encrypting WebSocket connection frames to prevent ISP surveillance on public Wi-Fi networks.",
          "Preventing search engine web crawlers from indexing private authenticated frontend routes.",
          "Blocking cross-site script tags from loading public third-party JavaScript libraries."
        ],
        correctAnswer: "Allowing servers to specify which external origins are permitted to read their HTTP responses.",
        explanation: "CORS is an HTTP-header based mechanism that allows servers to indicate origins (domain, scheme, port) other than its own from which browsers should permit loading resources.",
        difficulty: "medium",
        subCluster: "web_security",
        conceptTag: "Web Security Fundamentals (CORS, CSRF, XSS, Content Security Policy)",
        approachHint: "CORS is an HTTP-header based mechanism enforced by browsers to relax or enforce the Same-Origin Policy (SOP).",
        benchmarkSeconds: 24
      }
    ],
    hard: [
      {
        question: "How does the browser engine construct the initial render tree to paint pixels to the screen?",
        options: [
          "It merges the DOM tree and CSSOM tree, excluding hidden nodes (like `display: none`) before layout.",
          "It executes all asynchronous JavaScript scripts before parsing HTML tokens to build the DOM.",
          "It paints all CSS background colors to the canvas before downloading any HTML markup text.",
          "It calculates physical pixel layout coordinates directly from raw HTML bytes without CSSOM."
        ],
        correctAnswer: "It merges the DOM tree and CSSOM tree, excluding hidden nodes (like `display: none`) before layout.",
        explanation: "The browser combines the DOM and CSSOM into a Render Tree containing only visible nodes. Elements with `display: none` are omitted from the render tree entirely.",
        difficulty: "hard",
        subCluster: "rendering_path",
        conceptTag: "Web Performance, Critical Rendering Path & Asset Optimization",
        approachHint: "DOM + CSSOM = Render Tree -> Layout -> Paint. What happens to elements styled with `display: none`?",
        benchmarkSeconds: 30
      }
    ]
  },

  // =========================================================================
  // 11. Software Engineering Basics
  // =========================================================================
  software_engineering: {
    name: "Software Engineering Basics",
    aliases: [
      "software engineering basics (sdlc, version control, etc.)",
      "software engineering basics", "software engineering", "sdlc",
      "version control", "git", "software development", "agile", "scrum", "ci/cd"
    ],
    subtopics: [
      "Software Development Life Cycle Models (Waterfall, Agile, Scrum, Kanban)",
      "Requirements Engineering & User Stories",
      "Version Control Systems with Git (Branches, Merging, Rebasing)",
      "Software Architecture & Modular Design Principles",
      "Testing Methodologies (Unit, Integration, Regression, E2E)",
      "Test-Driven Development (TDD) & Red-Green-Refactor Cycle",
      "Continuous Integration & Continuous Deployment (CI/CD Pipelines)",
      "Refactoring, Code Smells & Technical Debt Management",
      "Software Maintenance, Bug Tracking & Root Cause Analysis",
      "Software Quality Assurance, Code Reviews & Static Analysis"
    ],
    easy: [
      {
        question: "In Git version control, what is the fundamental difference between `git merge` and `git rebase`?",
        options: [
          "`merge` preserves history with a dedicated merge commit, while `rebase` rewrites history linearly.",
          "`merge` permanently deletes feature branch commits, while `rebase` pushes them to remote main.",
          "`rebase` can only be executed on the server, while `merge` is restricted to local offline staging.",
          "`merge` converts all file changes into zip archives, while `rebase` encrypts commit messages."
        ],
        correctAnswer: "`merge` preserves history with a dedicated merge commit, while `rebase` rewrites history linearly.",
        explanation: "`git merge` combines branches by creating a 3-way merge commit preserving history. `git rebase` moves or replays commits onto another base tip for a linear history.",
        difficulty: "easy",
        subCluster: "git_version_control",
        conceptTag: "Version Control Systems with Git (Branches, Merging, Rebasing)",
        approachHint: "Consider commit history: one creates a diamond branch graph with a merge commit; the other replays commits linearly.",
        benchmarkSeconds: 18
      },
      {
        question: "What is the standard sequence of phases in the Test-Driven Development (TDD) cycle?",
        options: [
          "Red (write failing test), Green (write minimal code to pass), Refactor (clean code without altering behavior).",
          "Design (create UML diagram), Implement (write full codebase), Test (perform manual QA testing).",
          "Deploy (push to production), Monitor (track crash logs), Hotfix (patch bugs on production server).",
          "Review (conduct peer code review), Merge (merge into main branch), Release (tag version release)."
        ],
        correctAnswer: "Red (write failing test), Green (write minimal code to pass), Refactor (clean code without altering behavior).",
        explanation: "The canonical TDD cycle is: 1) Red: write a failing unit test, 2) Green: write minimal implementation code to pass, 3) Refactor: improve structure without changing functionality.",
        difficulty: "easy",
        subCluster: "tdd_methodology",
        conceptTag: "Test-Driven Development (TDD) & Red-Green-Refactor Cycle",
        approachHint: "Red -> Green -> Refactor.",
        benchmarkSeconds: 18
      }
    ],
    medium: [
      {
        question: "What is the key distinction between Continuous Delivery and Continuous Deployment in modern CI/CD?",
        options: [
          "Continuous Delivery requires manual human approval to deploy to prod; Deployment deploys automatically.",
          "Continuous Delivery builds frontend apps only; Continuous Deployment builds backend microservices.",
          "Continuous Delivery runs unit tests only; Continuous Deployment runs integration tests exclusively.",
          "Continuous Delivery operates on local dev machines; Continuous Deployment operates in cloud environments."
        ],
        correctAnswer: "Continuous Delivery requires manual human approval to deploy to prod; Deployment deploys automatically.",
        explanation: "Continuous Delivery automates release preparation up to a manual trigger. Continuous Deployment automatically rolls out passed builds directly to production.",
        difficulty: "medium",
        subCluster: "ci_cd_pipelines",
        conceptTag: "Continuous Integration & Continuous Deployment (CI/CD Pipelines)",
        approachHint: "Both automate testing and building up to staging, but which one requires a human button click before production release?",
        benchmarkSeconds: 24
      },
      {
        question: "According to the Software Testing Pyramid model, how should automated test suites be proportioned?",
        options: [
          "A broad base of fast unit tests, a middle layer of integration tests, and a small peak of E2E tests.",
          "A large majority of manual end-to-end UI tests, with few integration tests and zero unit tests.",
          "An equal 33% split between manual exploratory tests, visual regression tests, and load tests.",
          "A heavy foundation of slow browser automation tests, supported by a minimal layer of unit tests."
        ],
        correctAnswer: "A broad base of fast unit tests, a middle layer of integration tests, and a small peak of E2E tests.",
        explanation: "The testing pyramid advocates for a large volume of fast, low-cost unit tests at the base, fewer integration tests in the middle, and minimal slow, brittle E2E tests at the apex.",
        difficulty: "medium",
        subCluster: "testing_pyramid",
        conceptTag: "Testing Methodologies (Unit, Integration, Regression, E2E)",
        approachHint: "Unit tests are fast and cheap; End-to-end tests are slow and expensive. How should the pyramid be shaped?",
        benchmarkSeconds: 24
      }
    ],
    hard: [
      {
        question: "What is Technical Debt in software engineering, and what is the primary indicator that refactoring is required?",
        options: [
          "Implied future rework caused by choosing expedient quick solutions; indicated by high code churn and code smells.",
          "The monetary subscription cost paid to cloud infrastructure providers for hosting unused server instances.",
          "The total financial deficit incurred by an engineering team when purchasing third-party software licenses.",
          "The delay in release schedules caused by operating system kernel updates on developer workstations."
        ],
        correctAnswer: "Implied future rework caused by choosing expedient quick solutions; indicated by high code churn and code smells.",
        explanation: "Technical debt is the implied cost of additional rework caused by choosing an easy, fast solution now instead of a better approach that takes longer.",
        difficulty: "hard",
        subCluster: "refactoring_technical_debt",
        conceptTag: "Refactoring, Code Smells & Technical Debt Management",
        approachHint: "Ward Cunningham's metaphor: taking a shortcut now incurs debt that accrues interest as slower future development.",
        benchmarkSeconds: 30
      }
    ]
  }
};

/**
 * Finds the matching topic bank if available.
 * @param {string} userTopic 
 * @returns {Object|null}
 */
export function findTopicBank(userTopic) {
  if (!userTopic || typeof userTopic !== "string") return null;
  const clean = userTopic.trim().toLowerCase();
  const words = clean.split(/[^a-z0-9+#_]+/).filter(Boolean);

  let bestMatch = null;
  let maxMatchedLength = 0;

  for (const [key, bank] of Object.entries(TOPIC_BANKS)) {
    for (const alias of bank.aliases) {
      const aliasClean = alias.toLowerCase().trim();
      let matched = false;

      if (aliasClean.length <= 3) {
        matched = words.includes(aliasClean) || clean === aliasClean;
      } else {
        matched = clean.includes(aliasClean) || aliasClean.includes(clean);
      }

      if (matched && aliasClean.length > maxMatchedLength) {
        maxMatchedLength = aliasClean.length;
        bestMatch = bank;
      }
    }
  }

  return bestMatch;
}

/**
 * Identifies the high-level technical domain category of any engineering topic.
 * @param {string} topic 
 * @returns {string} Technical domain category
 */
export function detectDomainCategory(topic) {
  const clean = (topic || "").toLowerCase();
  const words = clean.split(/[^a-z0-9+#_]+/).filter(Boolean);

  // 1. Systems & Low-Level Programming
  const systemsKeywords = [
    "c", "cpp", "c++", "rust", "zig", "os", "operating", "kernel", "linux", "unix",
    "posix", "thread", "threads", "mutex", "process", "processes", "paging", "memory",
    "driver", "embedded", "assembly", "asm", "concurrency"
  ];
  if (words.some(w => systemsKeywords.includes(w)) || clean.includes("operating system") || clean.includes("c language") || clean.includes("c++")) {
    return "systems_programming";
  }

  // 2. Web, Cloud & Networks
  const webKeywords = [
    "js", "javascript", "ts", "typescript", "web", "html", "css", "dom", "frontend",
    "browser", "react", "vue", "angular", "node", "express", "network", "networking",
    "tcp", "udp", "http", "https", "dns", "rest", "api", "cloud", "aws", "docker"
  ];
  if (words.some(w => webKeywords.includes(w)) || clean.includes("web development") || clean.includes("computer network")) {
    return "web_cloud";
  }

  // 3. Data Structures, Algorithms & Databases
  const dataKeywords = [
    "dsa", "data structure", "data structures", "algorithm", "algorithms", "tree", "graph",
    "heap", "sort", "sorting", "search", "searching", "sql", "dbms", "database", "databases",
    "postgres", "mysql", "indexing", "query", "queries", "table", "relational"
  ];
  if (words.some(w => dataKeywords.includes(w)) || clean.includes("data structure") || clean.includes("database management")) {
    return "data_algorithms";
  }

  // 4. Software Architecture & Engineering
  const archKeywords = [
    "oop", "oops", "object-oriented", "object oriented", "design pattern", "patterns",
    "solid", "sdlc", "software engineering", "git", "version control", "agile", "scrum",
    "refactoring", "tdd", "ci/cd", "testing", "clean code", "java", "python"
  ];
  if (words.some(w => archKeywords.includes(w)) || clean.includes("software engineering") || clean.includes("object-oriented")) {
    return "software_architecture";
  }

  // Default: Core Computer Science
  return "core_cs";
}

/**
 * Returns a balanced curriculum roadmap of subtopics for a given topic and question count.
 * @param {string} topic 
 * @param {number} numQuestions 
 * @returns {string[]} Array of subtopic titles
 */
export function getSubtopicRoadmap(topic, numQuestions = 10) {
  const bank = findTopicBank(topic);
  const count = Math.max(1, Math.min(numQuestions, 30));

  if (bank && Array.isArray(bank.subtopics) && bank.subtopics.length > 0) {
    const roadmap = [];
    for (let i = 0; i < count; i++) {
      roadmap.push(bank.subtopics[i % bank.subtopics.length]);
    }
    return roadmap;
  }

  // Dynamic domain subtopics for unlisted technical subjects
  const domain = detectDomainCategory(topic);
  const cleanTopic = topic.trim();

  const DOMAIN_SUBTOPIC_TEMPLATES = {
    systems_programming: [
      `Memory Models, Pointer Semantics & Lifetime Management in ${cleanTopic}`,
      `Concurrency, Thread Synchronization & Race Prevention in ${cleanTopic}`,
      `Operating System Traps, Syscalls & Kernel Interfaces in ${cleanTopic}`,
      `CPU Cache Hierarchy, Data Alignment & Memory Latency in ${cleanTopic}`,
      `Low-Level I/O, File Descriptors & Buffer Management in ${cleanTopic}`,
      `Virtual Memory, Page Tables & Address Translation in ${cleanTopic}`,
      `Inter-Process Communication, Pipes & Shared Memory in ${cleanTopic}`,
      `Binary Representation, Bitwise Operators & Endianness in ${cleanTopic}`,
      `Compiler Optimization, Inlining & Assembly Generation in ${cleanTopic}`,
      `Profiling, Bottlenecks & Low-Level Systems Tuning in ${cleanTopic}`
    ],
    web_cloud: [
      `DOM Tree Structure, Event Propagation & Rendering in ${cleanTopic}`,
      `Asynchronous Event Loop, Microtasks & Promises in ${cleanTopic}`,
      `HTTP/HTTPS Request-Response Cycles & REST API Contracts in ${cleanTopic}`,
      `Client-Side State Management & Reactive Data Flows in ${cleanTopic}`,
      `Web Security, CORS, CSRF & XSS Mitigation in ${cleanTopic}`,
      `Browser Storage, Cookies & Cache Strategies in ${cleanTopic}`,
      `Network Protocols, WebSockets & Real-Time Sync in ${cleanTopic}`,
      `Frontend Asset Bundling, Tree-Shaking & Minification in ${cleanTopic}`,
      `Cloud Infrastructure, Containerization & Microservices in ${cleanTopic}`,
      `Performance Budgets, LCP/INP & Critical Path Optimization in ${cleanTopic}`
    ],
    data_algorithms: [
      `Asymptotic Time & Space Complexity (Big-O Analysis) in ${cleanTopic}`,
      `Linear Data Structures (Arrays, Linked Lists, Stacks, Queues) in ${cleanTopic}`,
      `Hash Tables, Collision Strategies & Amortized Lookups in ${cleanTopic}`,
      `Hierarchical Structures, Binary Trees & BST Balance in ${cleanTopic}`,
      `Graph Representations, BFS/DFS & Shortest Paths in ${cleanTopic}`,
      `Divide-and-Conquer, Sorting & Binary Search in ${cleanTopic}`,
      `Greedy Strategies & Dynamic Programming Subproblems in ${cleanTopic}`,
      `Relational Query Optimization & Index Slicing in ${cleanTopic}`,
      `ACID Guarantees, Transactions & Lock Contention in ${cleanTopic}`,
      `Advanced Tree Structures (Heaps, Tries & Segment Trees) in ${cleanTopic}`
    ],
    software_architecture: [
      `Encapsulation, Interface Segregation & Information Hiding in ${cleanTopic}`,
      `Composition vs Inheritance & Class Hierarchy Design in ${cleanTopic}`,
      `SOLID Design Principles & Extensible Code Architecture in ${cleanTopic}`,
      `Creational, Structural & Behavioral Design Patterns in ${cleanTopic}`,
      `Test-Driven Development (TDD) & Unit Test Isolation in ${cleanTopic}`,
      `Continuous Integration, Automated Builds & Deployment in ${cleanTopic}`,
      `Refactoring Strategies, Code Smells & Technical Debt in ${cleanTopic}`,
      `Version Control Branching, Rebasing & Code Reviews in ${cleanTopic}`,
      `Coupling, Cohesion & Modular Component Boundaries in ${cleanTopic}`,
      `Error Handling, Fault Isolation & Resilience Patterns in ${cleanTopic}`
    ],
    core_cs: [
      `Syntax, Fundamentals & Execution Semantics in ${cleanTopic}`,
      `Data Structures, Collections & Memory Layout in ${cleanTopic}`,
      `Control Flow, Functions & Modular Scoping in ${cleanTopic}`,
      `Object-Oriented Architecture & Polymorphism in ${cleanTopic}`,
      `Memory Allocation, Lifetime & Resource Management in ${cleanTopic}`,
      `Error Handling, Exceptions & Fault Tolerance in ${cleanTopic}`,
      `Concurrency, Threading & Asynchronous Control in ${cleanTopic}`,
      `Standard Libraries, APIs & Canonical Patterns in ${cleanTopic}`,
      `Performance Profiling & Algorithmic Optimization in ${cleanTopic}`,
      `Advanced Paradigms & Engineering Best Practices in ${cleanTopic}`
    ]
  };

  const pool = DOMAIN_SUBTOPIC_TEMPLATES[domain] || DOMAIN_SUBTOPIC_TEMPLATES.core_cs;
  const roadmap = [];
  for (let i = 0; i < count; i++) {
    roadmap.push(pool[i % pool.length]);
  }
  return roadmap;
}

/**
 * Rich Cognitive Procedural Synthesizer for arbitrary unlisted technical topics.
 * Generates distinct questions with zero repetitive recycling and authentic engineering tone.
 */
export function generateProceduralQuestion(topic, difficulty = "medium", seed = 0, targetSubtopic = "") {
  const cleanTopic = topic.trim();
  const diff = ["easy", "medium", "hard"].includes(difficulty.toLowerCase())
    ? difficulty.toLowerCase()
    : "medium";

  const domain = detectDomainCategory(cleanTopic);
  const subtopicName = targetSubtopic || `${cleanTopic} Core Principles`;

  const DOMAIN_ARCHETYPES = {
    systems_programming: [
      {
        q: `In ${cleanTopic} (${subtopicName}), what is the primary consequence of improper resource deallocation?`,
        correct: `It causes gradual memory leaks and resource exhaustion over extended program runtimes.`,
        distractors: [
          `It immediately forces the compiler to recompile all third-party libraries in the project.`,
          `It converts all dynamic heap allocations into read-only static global constants in RAM.`,
          `It automatically doubles the network packet bandwidth available to the operating system.`
        ],
        exp: `Failing to manage resource deallocation in ${cleanTopic} leads to memory bloat and eventual process starvation.`,
        hint: `Think about what happens over time when memory is allocated repeatedly without ever being returned to the OS.`
      },
      {
        q: `In ${cleanTopic} (${subtopicName}), what common pitfall frequently results in race conditions during concurrent execution?`,
        correct: `Mutating shared mutable state simultaneously from multiple threads without synchronization primitives.`,
        distractors: [
          `Using immutable constant data structures across multiple parallel worker threads concurrently.`,
          `Isolating thread data into independent message channels with zero shared memory references.`,
          `Declaring explicit mutex locks around critical sections to serialize concurrent writes.`
        ],
        exp: `Concurrent unsynchronized access to shared mutable data in ${cleanTopic} produces non-deterministic data races.`,
        hint: `Consider what happens when two threads read, increment, and write back the same variable at the exact same instant.`
      },
      {
        q: `When designing high-throughput systems in ${cleanTopic} (${subtopicName}), why is CPU cache line alignment important?`,
        correct: `It prevents false sharing where threads on different cores invalidate each other's cache lines.`,
        distractors: [
          `It automatically compresses all source code into hardware microcode before compilation.`,
          `It eliminates the need for operating system virtual memory page table translations.`,
          `It forces all heap allocations to execute synchronously inside the CPU instruction cache.`
        ],
        exp: `False sharing occurs when independent variables reside on the same cache line modified by distinct CPU cores.`,
        hint: `Think about multi-core CPU L1/L2 caches and cache coherence protocols (MESI).`
      }
    ],
    web_cloud: [
      {
        q: `When structuring asynchronous operations in ${cleanTopic} (${subtopicName}), what is the primary benefit of promises over raw callback chains?`,
        correct: `They avoid callback hell and provide centralized error propagation through unified catch handlers.`,
        distractors: [
          `They force all network requests to execute synchronously on the main UI browser thread.`,
          `They eliminate the need for HTTP status codes by converting all responses into booleans.`,
          `They bypass browser security policies and allow unrestricted cross-origin local file reads.`
        ],
        exp: `Promises flatten asynchronous control flow and ensure errors propagate predictably through chained handlers.`,
        hint: `Think about pyramid-of-doom callbacks vs linear .then().catch() chains.`
      },
      {
        q: `In ${cleanTopic} (${subtopicName}), why is defensive sanitization of user-provided HTML inputs essential?`,
        correct: `It prevents Cross-Site Scripting (XSS) attacks by neutralizing malicious executable script tags.`,
        distractors: [
          `It guarantees that all CSS stylesheet animations execute at exactly 60 frames per second.`,
          `It converts relational database tables into static flat files in browser local storage.`,
          `It eliminates network latency by caching all dynamic API responses permanently on disk.`
        ],
        exp: `Unsanitized inputs injected into HTML can execute arbitrary JavaScript in the user's browser context (XSS).`,
        hint: `Consider what happens when an attacker enters '<script>stealCookies()</script>' into a comment box.`
      }
    ],
    data_algorithms: [
      {
        q: `When evaluating algorithmic efficiency in ${cleanTopic} (${subtopicName}), what is the key advantage of hash-based lookups?`,
        correct: `Average-case O(1) constant time retrieval by mapping keys directly to array memory slots.`,
        distractors: [
          `Guaranteed linear O(n) sequential scanning across all stored elements on every query.`,
          `Automatic sorting of all stored key-value pairs in lexicographical ascending order.`,
          `Zero memory consumption regardless of the total number of elements inserted into the table.`
        ],
        exp: `Hash lookups in ${cleanTopic} achieve near-instantaneous O(1) average access via mathematical hash functions.`,
        hint: `Think about direct indexing: hashing converts a key directly into an array index without searching through elements.`
      },
      {
        q: `In ${cleanTopic} (${subtopicName}), why does a balanced Binary Search Tree (like AVL or Red-Black) maintain logarithmic height?`,
        correct: `To guarantee O(log n) worst-case time complexity for search, insertion, and deletion operations.`,
        distractors: [
          `To ensure that all stored numeric values are automatically converted into 32-bit floating points.`,
          `To prevent the operating system from allocating any stack memory during recursive traversals.`,
          `To allow infinite elements to be stored inside a single fixed-size CPU cache register.`
        ],
        exp: `Balancing rotations keep tree height at O(log n), preventing the degradation to O(n) linear chains.`,
        hint: `What happens to search time if a BST degenerates into a flat line of nodes?`
      }
    ],
    software_architecture: [
      {
        q: `When structuring modular components in ${cleanTopic} (${subtopicName}), which design principle promotes maintainability?`,
        correct: `Encapsulating internal implementation details behind clean, minimal public interface boundaries.`,
        distractors: [
          `Exposing all internal private variables directly to global scope for unrestricted runtime access.`,
          `Bypassing all type checking and input validation routines to reduce initial binary file size.`,
          `Merging all business logic, data persistence, and UI rendering into a single monolithic loop.`
        ],
        exp: `Encapsulation in ${cleanTopic} minimizes tight coupling and isolates state mutations within safe component boundaries.`,
        hint: `Focus on the benefits of information hiding: why should external callers interact only through public methods?`
      },
      {
        q: `In ${cleanTopic} (${subtopicName}), why does the Single Responsibility Principle (SRP) enhance software quality?`,
        correct: `It ensures a module has only one reason to change, minimizing ripple effects during refactoring.`,
        distractors: [
          `It requires every function in the entire codebase to contain no more than one single line of code.`,
          `It prevents any developer from creating more than one class inside a given software project.`,
          `It mandates that all database queries and UI layouts be combined into a single master class.`
        ],
        exp: `SRP ensures classes remain focused on a single cohesive concern, making maintenance and testing straightforward.`,
        hint: `Think about Robert C. Martin's definition: 'A class should have one, and only one, reason to change.'`
      }
    ],
    core_cs: [
      {
        q: `In ${cleanTopic} (${subtopicName}), why is defensive input validation essential at system boundaries?`,
        correct: `It prevents malformed parameters from triggering undefined behavior or security vulnerabilities.`,
        distractors: [
          `It guarantees that all asynchronous database queries complete in zero milliseconds.`,
          `It eliminates the need for unit testing by mathematically proving source code correctness.`,
          `It forces the host operating system to execute all processes with elevated root privileges.`
        ],
        exp: `Defensive validation in ${cleanTopic} rejects unexpected or malicious inputs before they reach core logic.`,
        hint: `Consider what could go wrong if external, untrusted user data is passed directly into internal operations.`
      },
      {
        q: `When managing software dependencies in ${cleanTopic} (${subtopicName}), what is the primary risk of tight coupling?`,
        correct: `Changes in one dependent module ripple through and break unrelated components across the system.`,
        distractors: [
          `It causes hardware RAM chips to permanently lose clock synchronization during execution.`,
          `It prevents compilers from generating any binary output files unless connected to internet.`,
          `It automatically doubles the physical size of source code comments on the disk storage.`
        ],
        exp: `Tight coupling creates fragile architectures where internal modifications trigger cascading failures.`,
        hint: `Think about loose coupling vs tight coupling: why should components depend on abstractions rather than concrete details?`
      }
    ]
  };

  const pool = DOMAIN_ARCHETYPES[domain] || DOMAIN_ARCHETYPES.core_cs;
  const item = pool[seed % pool.length];
  const defaultBenchmark = diff === "easy" ? 20 : diff === "medium" ? 30 : 45;

  return {
    question: item.q,
    options: [item.correct, ...item.distractors],
    correctAnswer: item.correct,
    explanation: item.exp,
    difficulty: diff,
    topic: cleanTopic,
    conceptTag: subtopicName,
    subCluster: subtopicName.toLowerCase().replace(/[^a-z0-9+#_]+/g, "_"),
    approachHint: item.hint || `Analyze the foundational principles and core relationships of ${subtopicName}.`,
    benchmarkSeconds: defaultBenchmark
  };
}
