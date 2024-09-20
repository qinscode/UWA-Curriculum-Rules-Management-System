## Database Structure
### Table
1. Course
- Attributes: CourseID, CourseCode, CourseName, CourseType, Year, Semester, ActiveStatus
- Purpose: Stores information about each course.
- Primary key: CourseID
  
2. CourseTemplates
- Attributes: TemplateID, CourseID, TemplateType, LastUpdated, ActiveStatus
- Purpose: Tracks different templates for courses, such as coursework, research programs, etc.
- Primary key: TemplateID
- Foreign key: CourseID reference to Courses(CourseID)

3. Rules
- Attributes: RuleID, CourseID, TemplateID, RuleContent, RuleType, LastUpdated
- Purpose: Stores rules applicable to course templates (e.g., admission requirements, language requirements).
- Primary key: RuleID
- Foreign key: TemplateID reference to CourseTemplates(TemplateID)
- Foreign key: CourseID reference to Courses(CourseID)

4. Units
- Attributes: UnitCode, UnitName, CreditPoints
- Purpose: Details of individual units or classes within a course.
- Primary key: UnitCode

5. UnitSets
- Attributes: SetID, CourseID, Description, UnitSetType
- Purpose: Manages groups of units (e.g., core, elective sets) required for different courses or majors.
- Primary key: SetID
- Foreign key: CourseID reference to Courses(CourseID)

6. Users
- Attributes: UserID, Email, Password, Role
- Purpose: Handles user authentication and role management.
- Primarz key: UserID

7. LogRecord
- Attributes: LogID, UserID, Action, Timestamp, Details
- Purpose: Tracks user actions for audit and administrative purposes.
- Primary key: LogID
- Foreign key: UserID reference to Users(UserID)