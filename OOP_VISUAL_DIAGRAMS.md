# GymHub System Architecture - OOP Concepts Visual Overview

```mermaid
graph TB
    subgraph "ENCAPSULATION 🔒"
        User[User Model]
        User --> UserData[Private: password, email<br/>Public: name, role]
        User --> UserMethods[Methods: signup(), login()]
        
        Equipment[Equipment Model]
        Equipment --> EquipmentData[Private: maintenance status<br/>Public: name, condition]
        Equipment --> EquipmentMethods[Methods: updateMaintenanceStatus()]
        
        AuthContext[Auth Context]
        AuthContext --> AuthState[Private: reducer logic<br/>Public: user state]
        AuthContext --> AuthActions[Methods: dispatch()]
    end
    
    subgraph "INHERITANCE 🧬"
        BaseUser[Base User Schema]
        BaseUser --> TrainerReg[Trainer Registration<br/>+ training type<br/>+ experience]
        BaseUser --> ClientReg[Client Registration<br/>+ fitness goals<br/>+ medical info]
        BaseUser --> GymOwner[Gym Owner<br/>+ gym management<br/>+ equipment]
        
        BaseModal[Base Modal Component]
        BaseModal --> ReplyModal[Reply Modal<br/>+ textarea<br/>+ reply actions]
        BaseModal --> DeleteModal[Delete Modal<br/>+ confirmation<br/>+ delete actions]
    end
    
    subgraph "ABSTRACTION 🎭"
        Database[(MongoDB)]
        Database --> Mongoose[Mongoose ODM]
        Mongoose --> SimpleAPI[Simple Model API<br/>User.create()<br/>User.findById()]
        
        HTTPRequests[HTTP Complexity]
        HTTPRequests --> CustomHooks[Custom Hooks<br/>useGym()<br/>useAuth()]
        CustomHooks --> ComponentAPI[Simple Component API<br/>registerGym()<br/>login()]
        
        ComplexUI[Complex UI Logic]
        ComplexUI --> UIComponents[Reusable Components<br/>Navbar<br/>Modal]
        UIComponents --> SimpleUsage[Simple Component Usage<br/><Navbar/><br/><Modal/>]
    end
    
    subgraph "POLYMORPHISM 🎪"
        UserInterface[User Interface]
        UserInterface --> ClientBehavior[Client Behavior<br/>Dashboard: bookings, progress]
        UserInterface --> GymOwnerBehavior[Gym Owner Behavior<br/>Dashboard: gyms, equipment]
        UserInterface --> TrainerBehavior[Trainer Behavior<br/>Dashboard: sessions, clients]
        UserInterface --> AdminBehavior[Admin Behavior<br/>Dashboard: approvals, users]
        
        EquipmentInterface[Equipment Interface]
        EquipmentInterface --> InventoryActions[In Inventory<br/>assign_to_gym]
        EquipmentInterface --> GymActions[In Gym<br/>remove_from_gym]
        
        ModalInterface[Modal Interface]
        ModalInterface --> DeleteType[type="delete"]
        ModalInterface --> ReplyType[type="reply"]
        ModalInterface --> InfoType[type="info"]
    end
    
    style User fill:#e1f5fe
    style Equipment fill:#e1f5fe
    style AuthContext fill:#e1f5fe
    
    style BaseUser fill:#f3e5f5
    style BaseModal fill:#f3e5f5
    
    style Mongoose fill:#e8f5e8
    style CustomHooks fill:#e8f5e8
    style UIComponents fill:#e8f5e8
    
    style UserInterface fill:#fff3e0
    style EquipmentInterface fill:#fff3e0
    style ModalInterface fill:#fff3e0
```

## OOP Principles Flow in GymHub

```mermaid
sequenceDiagram
    participant Client as Client App
    participant Context as Auth Context (Encapsulation)
    participant Hook as Custom Hook (Abstraction)
    participant Controller as Controller (Inheritance)
    participant Model as Mongoose Model (Polymorphism)
    participant DB as MongoDB

    Note over Client,DB: User Login Flow Demonstrating All OOP Principles
    
    Client->>Context: dispatch({ type: "LOGIN", ... })
    Note over Context: Encapsulated state management<br/>Internal reducer logic hidden
    
    Context->>Hook: useAuth() called
    Note over Hook: Abstraction layer<br/>Complex HTTP requests hidden
    
    Hook->>Controller: POST /api/login
    Note over Controller: Inherits from base controller<br/>Common error handling
    
    Controller->>Model: User.login(email, password)
    Note over Model: Polymorphic behavior<br/>Different validation per role
    
    Model->>DB: MongoDB Query
    DB->>Model: User Data
    
    Model->>Controller: Authenticated User
    Controller->>Hook: Success Response
    Hook->>Context: User Data
    
    Note over Context: Encapsulated state update<br/>localStorage operations hidden
    
    Context->>Client: Updated User State
    
    Note over Client: Polymorphic UI rendering<br/>Different dashboard per role
```

## Component Interaction Example

```mermaid
classDiagram
    class User {
        <<Encapsulation>>
        -password: String
        -email: String
        +name: String
        +role: String
        +signup()
        +login()
    }
    
    class TrainerRegistration {
        <<Inheritance>>
        +user: ObjectId
        +trainingType: String
        +yearsOfExperience: Number
        +getSpecializedData()
    }
    
    class ClientRegistration {
        <<Inheritance>>
        +clientId: ObjectId
        +fitnessGoals: String
        +fitnessLevel: String
        +getClientData()
    }
    
    class UserService {
        <<Polymorphism>>
        +getDashboardData(user)
        +getPermissions(user)
    }
    
    class DatabaseAbstraction {
        <<Abstraction>>
        +findUser()
        +createUser()
        +updateUser()
    }
    
    User <|-- TrainerRegistration
    User <|-- ClientRegistration
    User --> UserService
    UserService --> DatabaseAbstraction
    
    note for User "Encapsulates authentication\nand user data management"
    note for TrainerRegistration "Inherits User properties\nadds trainer-specific fields"
    note for UserService "Polymorphic methods behave\ndifferently per user role"
    note for DatabaseAbstraction "Hides MongoDB complexity\nbehind simple interfaces"
```