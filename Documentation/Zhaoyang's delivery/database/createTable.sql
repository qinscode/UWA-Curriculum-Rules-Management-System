-- Courses Table
CREATE TABLE Courses (
    CourseCode VARCHAR(10) NOT NULL,
    CourseID INT NOT NULL,
    CourseName VARCHAR(100) NOT NULL,
    CourseType ENUM('Undergraduate', 'Postgraduate', 'Research') NOT NULL,
    Year INT NOT NULL,
    Semester ENUM('S1', 'S2') NOT NULL,
    ActiveStatus ENUM('Active', 'Archived') NOT NULL,
    PRIMARY KEY (CourseID)
);

-- CourseTemplates Table
CREATE TABLE CourseTemplates (
    TemplateID INT AUTO_INCREMENT NOT NULL,
    CourseID INT NOT NULL,
    TemplateType VARCHAR(50) NOT NULL,
    LastUpdated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ActiveStatus ENUM('Active', 'Archived') NOT NULL,
    PRIMARY KEY (TemplateID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Rules Table
CREATE TABLE Rules (
    RuleID INT AUTO_INCREMENT NOT NULL,
    CourseID INT NOT NULL,
    TemplateID INT NOT NULL,
    RuleContent TEXT NOT NULL,
    RuleType VARCHAR(50) NOT NULL,
    LastUpdated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (RuleID),
    FOREIGN KEY (TemplateID) REFERENCES CourseTemplates(TemplateID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Units Table
CREATE TABLE Units (
    UnitCode VARCHAR(10) NOT NULL,
    UnitName VARCHAR(100) NOT NULL,
    CreditPoints INT NOT NULL,
    PRIMARY KEY (UnitCode)
);

-- UnitSets Table
CREATE TABLE UnitSets (
    SetID INT AUTO_INCREMENT NOT NULL,
    CourseID INT NOT NULL,
    Description TEXT NOT NULL,
    UnitSetType ENUM('Core', 'Elective', 'Optional') NOT NULL,
    PRIMARY KEY (SetID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- Users Table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL, -- Consider using VARBINARY for hashed passwords
    Role ENUM('Administrator', 'Faculty', 'Student') NOT NULL,
    PRIMARY KEY (UserID),
    UNIQUE (Email)
);

-- LogRecord Table
CREATE TABLE LogRecord (
    LogID INT AUTO_INCREMENT NOT NULL,
    UserID INT NOT NULL,
    Action ENUM('Create', 'Update', 'Delete', 'Login', 'Logout') NOT NULL,
    Timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Details TEXT NOT NULL,
    PRIMARY KEY (LogID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Indexing for better query performance
CREATE INDEX idx_course_active ON Courses(CourseCode, ActiveStatus);
CREATE INDEX idx_template_active ON CourseTemplates(TemplateID, ActiveStatus);
CREATE INDEX idx_rules_lastupdated ON Rules(LastUpdated);
CREATE INDEX idx_logrecord_timestamp ON LogRecord(Timestamp);
