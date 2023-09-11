## Memento Organizer Documentation - V: 0.1.1 Alpha

**Index**

1. [Actual State](#actual-state)  
   1.1. [Features](#features)  
   1.2. [Missing](#missing)

2. [Objectives](#objectives)

3. [Functional Requisites - F.R](#functional-requisites)

4. [Non Functional Requisites - N.F.R](#non-functional-requisites)

5. [Structure Of Project](#structure-of-project)

6. [Contribute](#contribute)  
   6.1. [With code, tests and documentation](#with-code-tests-and-documentation)  
   6.1.1 [Prerequisites](#prerequisites)

## Actual State

> WARNING!!
> This Project is Still in Alpha and is missing a considerable number of features, still is work to do to make it fully usable and intuitive.
> Still is already usable and it can be safely deployed.  
> Since this project is characterized as a personal project at the moment don't expect those missing features to be available ASAP since i work on it on my free time

If you wanna know some mapped features and issues you can go to the [Issues Page on this Github Repository](https://github.com/GDavij/memento-organizer/issues) to know more about it

### Features

In This actual state we already have those functionalities

- Capability to write notes
- Security in all non public data like password, the content of your notes, and etc… (AES 256 And [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2))
- Capability to Filter notes by (Something to Improve)
  - Id
  - Name
  - Description
  - Content
  - Issued Date(Creation Date)
- A Very Basic Syntax to write notes that is very inspired by markdown(Heading, Lists at this moment)
- Integration with AWS S3 for inserting images into notes, all images being encrypted with AES 256
- Basic Account Manager(Create Account, update password, e-mail, delete account)
- Basic Login Screen (Email, Password)
- Basic Admin Dashboard
- Capability to create and modify kanbans
  - Table
  - Columns
  - Tasks

### Missing

> keep in mind that the features missing that are here listed are all for the actual moment of the project it can change depending of the path this project will take.

- Though Sets

  - Group words or phrases on Sets and Subsets

- Tag Notes

  - Add The Ability to Tag a Group of Notes with a HashTag for easy filtering by "Ideas or References"

- Put notes in folders

  - Group Notes in Folders and Sub folders

- Notes Tabs

  - Ability to open various notes like you could do on your browser for better productivity

- Tests(Unit, Integration and E2e)

  - Map services and ensure that one existing feature don't break when modifying or adding a new one

- Graphs
  - Statics and Graphs for showing data like links between notes/documents, words/phrases

## Objectives

At the first moment the objective of this project is for learning and training programming concepts such technical as teorical.

In this project you will see some concepts of SOLID such `single responsibility`, `Dependency Injection`, `Inversion of Control` and others, i really tried to make my code organized so maintenance will be easier and code will be less proper to errors

In the technical aspect you will find those technologies that i use this project to learn more and test my learning.

- [Dotnet](https://dotnet.microsoft.com/en-us/)
- [AspNet](https://dotnet.microsoft.com/en-us/apps/aspnet)
- [Typescript](https://www.typescriptlang.org/)/[Javascript](https://en.wikipedia.org/wiki/JavaScript)
- [NextJs](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)

In the more teorical side you will find these types of concepts i tried to apply

- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [SOLID](https://en.wikipedia.org/wiki/SOLID)

Other Objective of this project is the implementation of an idea to create a organizer of ideas and notes/documents something like software like [Obsidian](https://obsidian.md/) and [Zettlr](https://www.zettlr.com/) does.
this project is very inspired on [Zettlr](https://www.zettlr.com/) since i find very productive and easy to use when you catch [markdown](https://en.wikipedia.org/wiki/Markdown) syntax

**Expected lifecycle**

This project lifecycle will be live while the ideas for the project keep going and the project don't get too bigger at point to split it to multiple projects or for unexpected reasons it ends

## Functional Requisites

- The system must be able to let users modify(CRUD) notes/documents
- The system must be able to let users create folders and subfolders to group notes/documents
- The system must be able to let users create Hashtags to group a set of notes/documents
- The system must be Able to let users modify(CRUD) kanbans
- The system must be able to let users modify(CRUD) thoughts sets
- The system must allow users to open multiple notes/documents and let then switch between then implementing a tabs system
- The system must collect data for generate values that can be read from graphs and statistics only by the user
- The system must be able to let users change theirs e-mail and password whenever they want
- The system must be able to let users delete their account whenever they want
- The system must be able to let users create their account by then selfs
- The system must be able to create admins
- Admins must be able to see existing users in the system

## Non Functional Requisites

- The system must work online and must be accessed over a [web browser](https://en.wikipedia.org/wiki/Web_browser)
- All not public data must be securely encrypted
- All data that is only for verification like `password` must use [passphrase key derivation functions](https://en.wikipedia.org/wiki/Key_derivation_function) like [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) instead of just [hash functions](https://en.wikipedia.org/wiki/Cryptographic_hash_function) like [SHA512](https://en.wikipedia.org/wiki/SHA-2)
- The first admin of the system must be created without a admin token
- If already exist an admin in the system, the next admin to be created need the token of an existing admin of the system to be allowed it's creation
- A note/document, kanban or though set, must not be shared between users

## Structure of Project

> this is the actual structure of the project it can change since it's under alpha version

```
.
|-api                           # Represent the Backend of the System
|--docs                         # Documentation specific for the aspnetcore api
|--src                          # Part where the source code is store
|---MementoOrganizer            # SubFolder for storing the source code
|----Application                # Layer that has the application logic(validations, configurations, middlewares, etc..)
|----Controllers                # Layer that contains the interfaces to communicate with the API
|----Domain                     # Layer that contains all the contracts of domain and all entities of the system
|----Infrastructure             # Contains all external services or providers needed for this API
|--tests                        # Store the Tests cases for the system
|---MementoOrganizer.Tests      # SubFolder Storing the Source code for the test cases
|
|-web                           # Represent the Frontend of the System
|--memento-organizer-next       # Represent the NextJs HCI Implementation for the system
|---src                         # Part where the source code is stored
|----app                        # Layer where pages are stored and routing is done
|----context                    # Layer that contains "Services Providers" for pages and subPages
|----lib                        # Layer where auxiliary functions are stored
|----models                     # Layer where api data and requests are typed
|----services                   # Layer where contains functions that communicate with the API for send or receive data
```

## Contribute

### With Code, Tests and Documentation

#### Prerequisites

In Order to contribute with code, tests and documentation you need to be familiar with these requisites at least

**BACKEND**

- [C#](https://dotnet.microsoft.com/en-us/languages/csharp)
- [Dotnet](https://dotnet.microsoft.com/en-us/)
- [AspNet](https://dotnet.microsoft.com/en-us/apps/aspnet)
- [HTTP Protocol](https://en.wikipedia.org/wiki/HTTP)
- [MongoDB](https://www.mongodb.com/)

**FRONTEND**

- [Typescript](https://www.typescriptlang.org/)/[Javascript](https://en.wikipedia.org/wiki/JavaScript)
- [Javascript async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [NextJS](https://nextjs.org/)
- [ESLint](https://eslint.org/)
