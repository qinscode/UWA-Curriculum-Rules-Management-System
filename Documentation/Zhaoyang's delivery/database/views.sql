CREATE VIEW ActiveCoursesView AS
SELECT CourseID, CourseCode, CourseName, CourseType, Year, Semester
FROM Courses
WHERE ActiveStatus = 'Active';


CREATE VIEW UserActionLogView AS
SELECT Users.Email, LogRecord.Action, LogRecord.Timestamp, LogRecord.Details
FROM LogRecord
JOIN Users ON LogRecord.UserID = Users.UserID;


CREATE VIEW CourseTemplateView AS
SELECT Courses.CourseName, CourseTemplates.TemplateType, CourseTemplates.LastUpdated
FROM Courses
JOIN CourseTemplates ON Courses.CourseID = CourseTemplates.CourseID
WHERE CourseTemplates.ActiveStatus = 'Active';
