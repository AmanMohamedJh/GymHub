# Practical OOP Examples from GymHub - Interactive Learning

## 🎯 Understanding OOP Through GymHub Code Examples

This document provides hands-on examples and exercises to understand how OOP concepts are practically implemented in the GymHub system.

---

## 1. ENCAPSULATION Examples 🔒

### Exercise 1: Password Security in User Model

**Problem**: How does GymHub protect user passwords?

**Code Example**:
```javascript
// File: backend/src/models/userModel.js

const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  // Other fields...
});

// ✅ ENCAPSULATED: Password hashing logic is hidden inside the model
userSchema.statics.signup = async function (name, email, phone, password, role, adminKey) {
  // Validation logic encapsulated
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not Strong Enough");
  }

  // ✅ ENCAPSULATED: Salt generation and hashing hidden from external code
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name, email, phone,
    password: hash, // ✅ Only hashed password stored
    role
  });

  return user;
};

// ✅ ENCAPSULATED: Login verification logic hidden
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("No account found with this email");
  }

  // ✅ ENCAPSULATED: Password comparison logic hidden
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};
```

**🤔 Think About It:**
- Why is password hashing encapsulated inside the model?
- What would happen if password logic was scattered across the application?
- How does this protect the application from security vulnerabilities?

**✨ Key Takeaways:**
- Private data (raw passwords) never leaves the model
- Complex logic (hashing, validation) is bundled with data
- External code can't accidentally expose sensitive information

---

### Exercise 2: Equipment State Management

**Problem**: How does GymHub manage complex equipment maintenance logic?

**Code Example**:
```javascript
// File: backend/src/models/Gym_Owner/Equipment.js

const equipmentSchema = new mongoose.Schema({
  // ✅ ENCAPSULATED: Internal state hidden
  maintenance: [{
    scheduledDate: { type: Date, required: true },
    status: { type: String, enum: ["Scheduled", "In Progress", "Completed", "Overdue"], default: "Scheduled" },
    notificationSent: { type: Boolean, default: false },
  }],
  lastMaintenanceDate: { type: Date },
});

// ✅ ENCAPSULATED: Complex date logic hidden inside method
equipmentSchema.methods.updateMaintenanceStatus = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  this.maintenance.forEach((maintenance) => {
    const scheduledDate = new Date(maintenance.scheduledDate);
    scheduledDate.setHours(0, 0, 0, 0);

    // ✅ ENCAPSULATED: Business logic for status updates
    if (scheduledDate.getTime() === today.getTime() && maintenance.status === "Scheduled") {
      maintenance.status = "In Progress";
    } else if (scheduledDate < today && maintenance.status !== "Completed") {
      maintenance.status = "Overdue";
    }
  });

  return this.save();
};

// ✅ SIMPLE USAGE: Complex logic hidden behind simple interface
// In controller:
const equipment = await Equipment.findById(equipmentId);
await equipment.updateMaintenanceStatus(); // Simple call, complex logic hidden
```

**🎯 Try This Exercise:**

Create your own encapsulated method for the Equipment model:

```javascript
// YOUR TURN: Create a method that calculates equipment health score
equipmentSchema.methods.getHealthScore = function() {
  // TODO: Implement logic that:
  // 1. Considers equipment condition (Excellent=100, Good=75, Fair=50, Poor=25)
  // 2. Reduces score based on overdue maintenance
  // 3. Increases score for recent maintenance
  // 4. Returns a score between 0-100

  // Your code here...
};
```

---

## 2. INHERITANCE Examples 🧬

### Exercise 3: User Role Specialization

**Problem**: How does GymHub handle different user types without code duplication?

**Code Example**:
```javascript
// Base User Schema (Parent)
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["client", "gym_owner", "trainer", "admin"] },
  // Common properties for all users
});

// ✅ INHERITANCE: Trainer specialization inherits from User
const TrainerRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Inherits base user properties
    required: true,
  },
  // ✅ SPECIALIZED: Additional trainer-specific properties
  trainingType: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  certificateUrl: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

// ✅ INHERITANCE: Client specialization inherits from User
const ClientGymRegistrationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Inherits base user properties
    required: true,
  },
  // ✅ SPECIALIZED: Additional client-specific properties
  fitnessGoals: { type: String },
  fitnessLevel: { type: String },
  medical: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String },
  },
});
```

**🎯 Interactive Example:**
```javascript
// How inheritance works in practice:

// 1. Create base user
const baseUser = await User.create({
  name: "John Doe",
  email: "john@example.com",
  role: "trainer"
});

// 2. Create specialized trainer (inherits from base user)
const trainerRegistration = await TrainerRegistration.create({
  user: baseUser._id, // ✅ Links to base user (inheritance)
  trainingType: "Weight Training",
  yearsOfExperience: 5,
  certificateUrl: "/certificates/john-cert.pdf"
});

// 3. Usage: Get complete trainer info (base + specialized)
const populatedTrainer = await TrainerRegistration
  .findById(trainerRegistration._id)
  .populate('user'); // ✅ Inherits all base user properties

console.log(populatedTrainer.user.name); // "John Doe" (inherited)
console.log(populatedTrainer.trainingType); // "Weight Training" (specialized)
```

---

### Exercise 4: Component Inheritance

**Problem**: How does GymHub reuse UI components without code duplication?

**Code Example**:
```javascript
// Base Modal Component (Parent)
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children} {/* ✅ Flexible content injection */}
      </div>
    </div>
  );
};

// ✅ INHERITANCE: Delete Modal inherits base Modal structure
const DeleteModal = ({ isOpen, onClose, onDelete, itemName }) => (
  <Modal isOpen={isOpen} onClose={onClose}> {/* ✅ Inherits base behavior */}
    {/* ✅ SPECIALIZED: Delete-specific content */}
    <div className="delete-modal-content">
      <h3>Delete Confirmation</h3>
      <p>Are you sure you want to delete {itemName}?</p>
      <div className="modal-actions">
        <button onClick={onDelete} className="delete-btn">Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  </Modal>
);

// ✅ INHERITANCE: Reply Modal inherits base Modal structure
const ReplyModal = ({ isOpen, onClose, onReply, value, setValue, review }) => (
  <Modal isOpen={isOpen} onClose={onClose}> {/* ✅ Inherits base behavior */}
    {/* ✅ SPECIALIZED: Reply-specific content */}
    <div className="reply-modal-content">
      <h3>Reply to Review</h3>
      <p>Replying to {review?.clientName}'s review</p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write your reply..."
      />
      <div className="modal-actions">
        <button onClick={onReply}>Send Reply</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  </Modal>
);
```

**🎯 Try This Exercise:**

Create your own specialized modal:

```javascript
// YOUR TURN: Create a ConfirmationModal that inherits from Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  // TODO: Use the Modal component as base
  // TODO: Add confirmation-specific content
  // TODO: Include title, message, and confirm/cancel buttons
  
  // Your code here...
);
```

---

## 3. ABSTRACTION Examples 🎭

### Exercise 5: Database Abstraction

**Problem**: How does GymHub hide complex database operations?

**Code Example**:
```javascript
// ✅ ABSTRACTION: Complex MongoDB operations hidden behind simple functions

// Without abstraction (complex):
const gym = await db.collection('gyms').aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [lng, lat] },
      distanceField: "distance",
      maxDistance: 10000,
      spherical: true
    }
  },
  {
    $match: { status: "approved" }
  },
  {
    $lookup: {
      from: "users",
      localField: "ownerId",
      foreignField: "_id",
      as: "owner"
    }
  }
]).toArray();

// ✅ WITH ABSTRACTION: Simple interface hides complexity
class GymService {
  static async findNearbyGyms(lat, lng, maxDistance = 10000) {
    return await Gym.find({
      "location.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance
        }
      },
      status: "approved"
    }).populate('ownerId', 'name email');
  }
}

// ✅ SIMPLE USAGE: Complex query hidden behind clean interface
const nearbyGyms = await GymService.findNearbyGyms(7.8731, 80.7718);
```

---

### Exercise 6: API Abstraction with Custom Hooks

**Problem**: How does GymHub hide complex HTTP requests from components?

**Code Example**:
```javascript
// ✅ ABSTRACTION: Custom hook hides HTTP complexity
export const useGym = () => {
  const { user } = useAuthContext();
  
  const registerGym = async (gymData) => {
    try {
      // ✅ ABSTRACTION: Complex FormData preparation hidden
      const formData = new FormData();
      
      Object.keys(gymData).forEach(key => {
        if (key === 'images' && Array.isArray(gymData[key])) {
          gymData[key].forEach(image => formData.append('images', image));
        } else if (key === 'location') {
          formData.append('location', JSON.stringify(gymData[key]));
        } else {
          formData.append(key, gymData[key]);
        }
      });
      
      // ✅ ABSTRACTION: HTTP configuration and error handling hidden
      const response = await fetch('/api/gym-owner/gyms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register gym');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  
  return { registerGym };
};

// ✅ SIMPLE COMPONENT USAGE: Complexity abstracted away
const RegisterGym = () => {
  const { registerGym } = useGym(); // Simple interface
  const [formData, setFormData] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerGym(formData); // Simple call - complexity hidden
      navigate('/owner-dashboard');
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
    </form>
  );
};
```

**🎯 Try This Exercise:**

Create your own abstraction layer:

```javascript
// YOUR TURN: Create a useEquipment hook that abstracts equipment operations
export const useEquipment = () => {
  const { user } = useAuthContext();
  
  const addEquipment = async (equipmentData) => {
    // TODO: Abstract the complexity of:
    // 1. Preparing the request body
    // 2. Setting up authentication headers
    // 3. Handling different response scenarios
    // 4. Error formatting
    
    // Your code here...
  };
  
  return { addEquipment };
};
```

---

## 4. POLYMORPHISM Examples 🎪

### Exercise 7: Role-Based Polymorphism

**Problem**: How does GymHub handle different user behaviors with the same interface?

**Code Example**:
```javascript
// ✅ POLYMORPHISM: Same interface, different implementations based on role
class DashboardService {
  static async getDashboardData(user) {
    // Same method signature, different behavior based on user.role
    switch (user.role) {
      case "client":
        return {
          type: "client",
          data: {
            bookings: await GymBooking.find({ clientId: user._id }),
            progress: await ClientProgress.find({ clientId: user._id }),
            sessions: await TrainerSession.find({ clientId: user._id })
          },
          actions: ["book_gym", "view_progress", "book_trainer"],
          dashboard: "/client-dashboard"
        };
        
      case "gym_owner":
        const gyms = await Gym.find({ ownerId: user._id });
        return {
          type: "gym_owner",
          data: {
            gyms: gyms,
            equipment: await Equipment.find({ userId: user._id }),
            registrations: await ClientGymRegistration.find({ 
              gymId: { $in: gyms.map(g => g._id) } 
            })
          },
          actions: ["manage_gyms", "manage_equipment", "view_analytics"],
          dashboard: "/owner-dashboard"
        };
        
      case "trainer":
        return {
          type: "trainer",
          data: {
            sessions: await TrainerSession.find({ trainerId: user._id }),
            clients: await TrainerSession.distinct("clientId", { trainerId: user._id }),
            workoutPlans: await WorkoutPlan.find({ trainerId: user._id })
          },
          actions: ["manage_sessions", "create_plans", "track_progress"],
          dashboard: "/trainer-dashboard"
        };
        
      case "admin":
        return {
          type: "admin",
          data: {
            pendingGyms: await Gym.find({ status: "pending" }),
            pendingTrainers: await TrainerRegistration.find({ status: "pending" }),
            users: await User.find({}).select("-password")
          },
          actions: ["approve_gyms", "manage_users", "system_settings"],
          dashboard: "/admin-dashboard"
        };
    }
  }
}

// ✅ POLYMORPHIC USAGE: Same method call, different results
const clientData = await DashboardService.getDashboardData(clientUser);
const ownerData = await DashboardService.getDashboardData(ownerUser);
const trainerData = await DashboardService.getDashboardData(trainerUser);
const adminData = await DashboardService.getDashboardData(adminUser);

// Each call returns different data structure but same interface
console.log(clientData.type);    // "client"
console.log(ownerData.type);     // "gym_owner"
console.log(trainerData.type);   // "trainer"
console.log(adminData.type);     // "admin"
```

---

### Exercise 8: Equipment State Polymorphism

**Problem**: How does the same equipment interface behave differently based on state?

**Code Example**:
```javascript
// ✅ POLYMORPHISM: Same interface, different behaviors based on equipment state
class EquipmentManager {
  static async getAvailableActions(equipment) {
    // Same method, different actions based on equipment state
    if (equipment.inInventory) {
      return {
        state: "inventory",
        actions: [
          { name: "assign_to_gym", label: "Assign to Gym", icon: "🏋️" },
          { name: "update_condition", label: "Update Condition", icon: "🔧" },
          { name: "schedule_maintenance", label: "Schedule Maintenance", icon: "📅" }
        ],
        location: "Inventory Storage",
        status: "Available for assignment"
      };
    } else {
      const gym = await Gym.findById(equipment.gymId);
      return {
        state: "assigned",
        actions: [
          { name: "remove_from_gym", label: "Return to Inventory", icon: "📦" },
          { name: "report_issue", label: "Report Issue", icon: "⚠️" },
          { name: "schedule_maintenance", label: "Schedule Maintenance", icon: "📅" }
        ],
        location: gym ? gym.name : "Unknown Gym",
        status: "In active use"
      };
    }
  }
  
  static async getMaintenanceSchedule(equipment) {
    // Same method, different schedule based on condition
    const schedules = {
      "Poor": {
        frequency: "Weekly",
        priority: "High",
        type: "Repair",
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      "Fair": {
        frequency: "Bi-weekly", 
        priority: "Medium",
        type: "Inspection",
        nextDue: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      "Good": {
        frequency: "Monthly",
        priority: "Low", 
        type: "Routine",
        nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      "Excellent": {
        frequency: "Quarterly",
        priority: "Low",
        type: "Preventive", 
        nextDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    };
    
    return schedules[equipment.condition] || schedules["Fair"];
  }
}

// ✅ POLYMORPHIC USAGE: Same methods, different results based on state
const inventoryEquipment = { inInventory: true, condition: "Good" };
const gymEquipment = { inInventory: false, gymId: "gym123", condition: "Poor" };

const inventoryActions = await EquipmentManager.getAvailableActions(inventoryEquipment);
const gymActions = await EquipmentManager.getAvailableActions(gymEquipment);

console.log(inventoryActions.actions); // Different actions for inventory equipment
console.log(gymActions.actions);       // Different actions for gym equipment
```

**🎯 Try This Exercise:**

Create your own polymorphic behavior:

```javascript
// YOUR TURN: Create a NotificationManager that behaves differently based on user role
class NotificationManager {
  static async getNotifications(user) {
    // TODO: Return different notification types based on user role:
    // - Clients: booking reminders, trainer messages, progress updates
    // - Gym Owners: equipment maintenance, new registrations, reviews
    // - Trainers: session schedules, client progress, payment updates
    // - Admins: system alerts, approval requests, user reports
    
    // Your code here...
  }
  
  static async sendNotification(user, message) {
    // TODO: Send notifications differently based on user preferences:
    // - Email for important updates
    // - SMS for urgent reminders
    // - In-app for general information
    
    // Your code here...
  }
}
```

---

## 🎓 Practice Challenges

### Challenge 1: Build an OOP Feature
Design a **Review System** that demonstrates all four OOP principles:

1. **Encapsulation**: Hide rating calculation logic
2. **Inheritance**: Create specialized review types (gym reviews, trainer reviews)
3. **Abstraction**: Simple interface for complex review aggregation
4. **Polymorphism**: Different behavior based on review type

### Challenge 2: Code Review Exercise
Review this code and identify OOP improvements:

```javascript
// BEFORE: Procedural approach
const createUser = async (userData) => {
  // Validate email
  if (!userData.email.includes('@')) {
    throw new Error('Invalid email');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Save to database
  const user = await db.users.insert({
    ...userData,
    password: hashedPassword
  });
  
  return user;
};

// TODO: Refactor using OOP principles
// How would you improve this code using encapsulation, abstraction, etc.?
```

### Challenge 3: Design Pattern Implementation
Implement a **Factory Pattern** for creating different types of gym memberships:

```javascript
// TODO: Create a MembershipFactory that:
// 1. Encapsulates membership creation logic
// 2. Uses inheritance for different membership types
// 3. Abstracts complex pricing calculations
// 4. Polymorphic behavior based on membership type
```

---

## 🚀 Next Steps

1. **Explore the Codebase**: Look for more examples of OOP principles in the GymHub repository
2. **Practice Implementation**: Try implementing the exercises and challenges
3. **Create Your Own Examples**: Build features using OOP principles
4. **Review and Refactor**: Look at existing code and identify opportunities for OOP improvements

## 📚 Key Takeaways

- **Encapsulation** = Bundle data and methods, hide complexity
- **Inheritance** = Reuse and extend existing functionality  
- **Abstraction** = Simple interfaces for complex operations
- **Polymorphism** = Same interface, different behaviors

Remember: OOP isn't about using fancy patterns - it's about writing maintainable, reusable, and understandable code! 🎯