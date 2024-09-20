DELIMITER //

CREATE PROCEDURE AddOrUpdateCourse(
    IN _CourseID INT,
    IN _CourseCode VARCHAR(10),
    IN _CourseName VARCHAR(100),
    IN _CourseType ENUM('Undergraduate', 'Postgraduate', 'Research'),
    IN _Year INT,
    IN _Semester ENUM('S1', 'S2'),
    IN _ActiveStatus ENUM('Active', 'Archived')
)
BEGIN
    IF EXISTS (SELECT 1 FROM Courses WHERE CourseID = _CourseID) THEN
        UPDATE Courses
        SET CourseCode = _CourseCode, CourseName = _CourseName, CourseType = _CourseType,
            Year = _Year, Semester = _Semester, ActiveStatus = _ActiveStatus
        WHERE CourseID = _CourseID;
    ELSE
        INSERT INTO Courses (CourseCode, CourseID, CourseName, CourseType, Year, Semester, ActiveStatus)
        VALUES (_CourseCode, _CourseID, _CourseName, _CourseType, _Year, _Semester, _ActiveStatus);
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE AddOrUpdateCourseTemplate(
    IN _TemplateID INT,
    IN _CourseID INT,
    IN _TemplateType VARCHAR(50),
    IN _ActiveStatus ENUM('Active', 'Archived')
)
BEGIN
    IF EXISTS (SELECT 1 FROM CourseTemplates WHERE TemplateID = _TemplateID) THEN
        UPDATE CourseTemplates
        SET CourseID = _CourseID, TemplateType = _TemplateType, ActiveStatus = _ActiveStatus
        WHERE TemplateID = _TemplateID;
    ELSE
        INSERT INTO CourseTemplates (CourseID, TemplateType, ActiveStatus)
        VALUES (_CourseID, _TemplateType, _ActiveStatus);
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE AddLogRecord(
    IN _UserID INT,
    IN _Action ENUM('Create', 'Update', 'Delete', 'Login', 'Logout'),
    IN _Details TEXT
)
BEGIN
    INSERT INTO LogRecord (UserID, Action, Details)
    VALUES (_UserID, _Action, _Details);
END //

DELIMITER ;
