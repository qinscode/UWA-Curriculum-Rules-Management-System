CREATE DATABASE IF NOT EXISTS TestCurriculumDB;
USE TestCurriculumDB;

-- Check if the tables exist
SHOW TABLES;

-- Describe the structure of each table to verify
DESCRIBE Courses;
DESCRIBE CourseTemplates;
DESCRIBE Rules;
DESCRIBE Units;
DESCRIBE UnitSets;
DESCRIBE Users;
DESCRIBE LogRecord;

-- Test stored procedure
CALL AddLogRecord(1, 'Create', 'Test log entry for course creation.');

-- Test Insert Trigger (AfterInsertCourseLog)
INSERT INTO Courses (CourseCode, CourseID, CourseName, CourseType, Year, Semester, ActiveStatus)
VALUES ('CS102', 2, 'Computer Science 102', 'Undergraduate', 2024, 'S1', 'Active');

-- Test Update Trigger (AfterUpdateCourseLog)
UPDATE Courses
SET CourseName = 'Advanced Computer Science 102'
WHERE CourseID = 2;

-- Test Delete Trigger (BeforeDeleteUserLog)
INSERT INTO Users (UserID, Email, Password, Role)
VALUES (2, 'user2@example.com', 'password2', 'Student');
DELETE FROM Users WHERE UserID = 2;

-- Test Views
SELECT * FROM ActiveCoursesView;
SELECT * FROM CourseTemplateDetailsView;

-- Verify Logs
SELECT * FROM LogRecord;
